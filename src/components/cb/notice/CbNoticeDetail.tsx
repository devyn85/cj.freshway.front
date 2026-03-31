// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Checkbox, Form, Input } from 'antd';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Component
import CmNoticePopup from '@/components/cm/popup/CmNoticePopup';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import InputQuillEditor from '@/components/common/custom/form/InputQuillEditor';

import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';

// API
import { apiGetNoticeDetail, apiGetNoticeRecvList, apiPostSaveNotice } from '@/api/cb/apiCbNotice';
import { apiGetCmFileUploadList } from '@/api/cm/apiCmFileUpload';
import CmReceivePopup from '@/components/cm/popup/CmReceivePopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import ScrollBox from '@/components/common/ScrollBox';
import Splitter from '@/components/common/Splitter';

const CbNoticeDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// grid data
	const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
	// form disable 제어
	const [formDisabled, setFormDisabled] = useState(true);
	// file
	const uploadFile = useRef(null);
	const [fileInfoList, setFileInfoList] = useState([]);
	const [saveFormData, setSaveFormData] = useState([]);
	const [popYnList, setPopYnList] = useState([]); // 팝업형 공지사항 목록

	// grid Ref
	ref.gridRef = useRef();
	ref.gridRefFile = useRef();
	ref.gridRefRcv = useRef();
	const modalRef = useRef(null);
	const refNoticeModal = useRef(null);
	const rowStatusRef = useRef(''); // rowStatus 상태값

	// 입력 폼
	const detailForm = props.detailForm;
	const [rcvForm] = Form.useForm();

	// 공지사항 그리드 칼럼 레이아웃 설정
	const gridColMaster = [
		{
			headerText: t('lbl.GUBUN_2'), // 구분
			dataField: 'brdDocKndCd',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodeList('DOC_KND_CD')
					.filter((item: any) => item.comCd === value)
					.map((obj: any) => obj.cdNm);
			},
		},
		{
			headerText: t('lbl.TITLE'), // 제목
			dataField: 'brdTit',
		},
		{
			headerText: t('공지대상'), // 공지대상
			dataField: 'brdTarget',
		},
		{
			headerText: t('공지기간'), // 공지기간
			dataField: 'brdDt',
			dataType: 'code',
			labelFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
				return item?.rowStatus === 'I' || commUtil.isEmpty(item.brdStDt) || commUtil.isEmpty(item.brdExprDt)
					? ''
					: `${item.brdStDt} ~ ${item.brdExprDt}`;
			},
		},
		{
			headerText: t('첨부파일유무'), // 첨부파일유무
			dataField: 'fileYn',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodeList('YN', '전체', '')
					.filter((item: any) => item.comCd === value)
					.map((obj: any) => obj.cdNm);
			},
		},
		{
			headerText: t('팝업노출여부'), // 팝업노출여부
			dataField: 'popYn',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodeList('YN', '전체', '')
					.filter((item: any) => item.comCd === value)
					.map((obj: any) => obj.cdNm);
			},
		},
		{
			headerText: t('lbl.DEL_YN'),
			dataField: 'delYn',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodeList('DEL_YN')
					.filter((item: any) => item.comCd === value)
					.map((obj: any) => obj.cdNm);
			},
		},
		{
			dataField: 'updNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'editWho',
			editable: false,
		},
		{
			dataField: 'editWho',
			visible: false,
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
		},
		{
			dataField: 'regNm',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addWho',
			editable: false,
		},
		{
			dataField: 'addWho',
			visible: false,
		},
		{
			dataField: 'addDate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'date',
		},
		{
			dataField: 'brdNum',
			dataType: 'code',
			headerText: t('링크복사'),
			renderer: {
				type: 'LinkRenderer',
				baseUrl: 'javascript',
				jsCallback: function (rowIndex: any, columnIndex: any, value: any) {
					navigator.clipboard
						.writeText(`${window.location.href}?brdNum=${value}`)
						.then(() => showAlert(null, '복사되었습니다.'))
						.catch(() => showAlert(null, '복사에 실패했습니다.'));
				},
			},
		},
	];

	// 공지사항 그리드 속성 설정
	const gridPropsMaster = {
		// editable: true,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		fillColumnSizeMode: true,
		isLegacyRemove: true,
	};

	// 첨부파일 그리드 칼럼 레이아웃 설정
	const gridColFile = [
		{
			headerText: t('lbl.FILENAME'),
			dataField: 'sourceFileNm',
			renderer: {
				type: 'LinkRenderer',
				baseUrl: 'javascript',
				jsCallback: function (rowIndex: any, columnIndex: any, value: any, item: any) {
					// ...
				},
			},
		},
		{
			headerText: t('lbl.FILE_SIZE'),
			dataField: 'fileSize',
			dataType: 'numeric',
			width: '70',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return `${(value / 1024 / 1024).toFixed(2)} MB`;
			},
		},
		{
			dataField: 'type',
			visible: false,
		},
		{
			dataField: 'refKey',
			visible: false,
		},
		{
			dataField: 'fileSeq',
			visible: false,
		},
		{
			dataField: 'uploadedDirPath',
			visible: false,
		},
		{
			dataField: 'uploadedFileNm',
			visible: false,
		},
	];

	// 첨부파일 그리드 속성 설정
	const gridPropsFile = {
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		isLegacyRemove: true,
	};

	// 수신처 그리드 칼럼 레이아웃 설정
	const gridColRcv = [
		{
			headerText: '유형', // 수신처유형
			dataField: 'rcvcustType',
			editable: false,
			// editable 막기위해 사용
			editRenderer: {
				type: 'DropDownListRenderer',
				// list: getCommonCodeList('DEL_YN'),
				list: [
					{
						comCd: 'R',
						cdNm: '수신그룹',
					},
					{
						comCd: 'U',
						cdNm: '사용자',
					},
				],
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return value === 'R' ? '수신그룹' : '사용자';
			},
		},
		{
			headerText: '공지대상',
			dataField: 'recvNm',
		},
	];

	// 수신처 그리드 속성 설정
	const gridPropsRcv = {
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		fillColumnSizeMode: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 공지사항 상세 조회
	 * @returns {void}
	 */
	const searchDtl = () => {
		const selectedRow = ref.gridRef.current?.getSelectedRows();
		if (selectedRow.length > 0 && !ref.gridRef.current.isAddedById(selectedRow[0]._$uid)) {
			setSelectedRowIndex(ref.gridRef.current.getSelectedIndex()[0]); // rowIndex 저장

			const params = {
				brdNum: selectedRow[0].brdNum,
			};

			apiGetNoticeDetail(params).then(res => {
				detailForm.resetFields();
				detailForm.setFieldsValue({
					...wrapWithTag(res.data),
					brdDt: [
						res.data?.brdStDt ? dayjs(res.data?.brdStDt) : null,
						res.data?.brdExprDt ? dayjs(res.data?.brdExprDt) : null,
					],
					rowStatus: 'R',
				});
				setFormDisabled(false);
				rowStatusRef.current = 'R';

				// QuillEditor에서 DATA 자동보정 이슈가 있어 아래 로직 추가
				ref.gridRef.current?.restoreEditedRows('selectedIndex');
			});
		} else {
			// 상세 내용 초기화
			ref.gridRefFile.current.clearGridData();
			ref.gridRefRcv.current.clearGridData();
			return;
		}
	};

	/**
	 * 수신처 목록 조회
	 * @returns {void}
	 */
	//apiGetNoticeRecvList
	const searchRcvList = () => {
		const selectedRow = ref.gridRef.current?.getSelectedRows();
		if (selectedRow.length > 0 && !ref.gridRef.current?.isAddedById(selectedRow[0]._$uid)) {
			const params = {
				brdNum: selectedRow[0].brdNum,
			};
			apiGetNoticeRecvList(params).then(res => {
				ref.gridRefRcv.current?.setGridData(res.data);
			});
		}
	};

	/**
	 * 첨부파일 목록 조회
	 * @returns {void}
	 */
	const searchFileUploadList = () => {
		const selectedRow = ref.gridRef.current?.getSelectedRows();
		if (selectedRow.length > 0 && !ref.gridRef.current?.isAddedById(selectedRow[0]._$uid)) {
			const params = {
				type: 'NOTICE',
				refKey: selectedRow[0].brdNum,
			};
			apiGetCmFileUploadList(params).then(res => {
				ref.gridRefFile.current?.setGridData(res.data);
			});
		}
	};

	/**
	 * 신규 추가
	 * @returns {void}
	 */
	const addDetail = () => {
		// 이미 신규 행이 있는 경우 경고 메시지를 표시하고 함수를 종료한다.
		if (detailForm.getFieldValue('rowStatus') === 'I') {
			showMessage({
				content: t('msg.MSG_COM_ERR_054'), // 이미 신규 행이 존재합니다
				modalType: 'warning',
			});
			return;
		}
		// 초기화된 로케이션 정보 객체를 생성한다.
		const initValues: any = {
			rowStatus: 'I', // 신규 입력 상태
			brdDocKndCd: '',
			brdDt: [dayjs(), dayjs().add(7, 'day')],
			brdTit: '',
			brdCntt: '',
			popYn: 'Y',
			delYn: 'N',
			redirectUrl: '',
		};
		ref.gridRef.current?.addRow(initValues);

		setFormDisabled(false);
		setSelectedRowIndex(ref.gridRef.current?.getSelectedIndex()[0]); // rowIndex 저장

		// 폼에 초기화된 값을 설정한다.
		detailForm.setFieldsValue(initValues);
		rowStatusRef.current = 'I';
	};

	/**
	 * 상세저장
	 * @returns {void}
	 */
	const saveDetail = async () => {
		const rowStatus = ref.gridRef.current?.getCellValue(selectedRowIndex, 'rowStatus');

		// 입력 값 검증
		if (rowStatus === 'I' || rowStatus === 'U') {
			const isValid = await validateForm(detailForm);
			if (!isValid) {
				return;
			}
		}

		apiPostSaveNoticeFunc();
	};

	const apiPostSaveNoticeFunc = () => {
		// 파일 전송할 form
		const formDataParam = new FormData();

		// 저장 DATA 추가
		const params = {
			...detailForm.getFieldsValue(true),
			brdDocDivCd: 'NOTICE', // "공지사항" 고정
			brdStDt:
				detailForm.getFieldValue('brdDt') && detailForm.getFieldValue('brdDt')[0]
					? detailForm.getFieldValue('brdDt')[0].format('YYYYMMDD')
					: '',
			brdExprDt:
				detailForm.getFieldValue('brdDt') && detailForm.getFieldValue('brdDt')[1]
					? detailForm.getFieldValue('brdDt')[1].format('YYYYMMDD')
					: '',
			allUserYn: rcvForm.getFieldValue('allUserYn') ? 'Y' : 'N',
		};

		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = ref.gridRef.current.getChangedData({ validationYn: false });
		const currentStatus = detailForm.getFieldValue('rowStatus');

		// 신규 또는 수정건이 있을 경우에만 form data를 포함한 값을 param에 추가, 삭제인 경우 updatedItems로 처리
		if (currentStatus === 'U' || currentStatus === 'I') {
			formDataParam.append(
				'params',
				new Blob([JSON.stringify([params])], {
					type: 'application/json',
				}),
			);
		} else {
			formDataParam.append(
				'params',
				new Blob([JSON.stringify(updatedItems)], {
					type: 'application/json',
				}),
			);
		}

		// 첨부파일 존재시 추가
		const gridFileList = ref.gridRefFile.current.getChangedData();
		if (gridFileList.length > 0) {
			saveFormData.forEach(function (item: any) {
				formDataParam.append('file', item);
			});
			formDataParam.append(
				'fileInfoList',
				new Blob([JSON.stringify(gridFileList)], {
					type: 'application/json',
				}),
			);
		}

		// 수신처 존재시 추가
		const gridRcvList = ref.gridRefRcv.current.getChangedData();

		const recvParam = gridRcvList?.map((item: any) => ({
			...item,
			brdNum: ref.gridRef.current?.getSelectedRows()[0].brdNum,
		})); // brdNum 추가

		if (gridRcvList.length > 0) {
			formDataParam.append(
				'recvGroupList',
				new Blob([JSON.stringify(recvParam)], {
					type: 'application/json',
				}),
			);
		}

		ref.gridRef.current.showConfirmSave(() => {
			apiPostSaveNotice(formDataParam).then(() => {
				ref.gridRef.current.setAllCheckedRows(false);
				ref.gridRef.current.resetUpdatedItems();
				detailForm.resetFields();
				rowStatusRef.current = 'R';

				// showMessage({
				// 	content: t('msg.MSG_COM_SUC_003'),
				// 	modalType: 'info',
				// });

				if (props.callBackFn && props.callBackFn instanceof Function) {
					props.callBackFn();
				}
			});
		});
	};

	/**
	 * detail 삭제버튼
	 * @returns {void}
	 */
	const deleteFunc = async () => {
		const rowStatus = detailForm.getFieldValue('rowStatus');
		if (rowStatus === 'I') {
			detailForm.resetFields();
			return;
		}

		apiPostSaveNoticeFunc();
	};

	/**
	 * 공지내용 미리보기
	 * @returns {void}
	 */
	const previewNoticePop = () => {
		const formData = detailForm.getFieldsValue(true);
		setPopYnList([
			{
				brdDocKndCd: formData['brdDocKndCd'],
				brdtit: formData['brdTit'],
				brdcntt: formData['brdCntt'],
			},
		]);
		refNoticeModal.current.handlerOpen();
	};

	// 공지사항 그리드 버튼 설정
	const gridBtnMaster: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				isActionEvent: false,
				callBackFn: addDetail,
				initValues: {
					rowStatus: 'I', // 신규 행 상태로 설정
				},
			},
			{
				btnType: 'delete', // 행삭제
				callBackFn: () => {
					rowStatusRef.current = 'R';
				},
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveDetail,
			},
		],
	};

	// 공지사항 상세 버튼 설정
	const tableBtnDetail: TableBtnPropsType = {
		tGridRef: ref.gridRef, // 사용자 목록 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 미리보기
				callBackFn: previewNoticePop,
			},
		],
	};

	// 첨부파일 그리드 버튼 설정
	const gridBtnFile: GridBtnPropsType = {
		tGridRef: ref.gridRefFile, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'delete', // 행삭제
				btnLabel: '파일삭제',
				callBackFn: () => {
					onValuesChange();
				},
			},
		],
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 */
	const onValuesChange = () => {
		const currentStatus = detailForm.getFieldValue('rowStatus');

		if (currentStatus === 'R' || currentStatus === 'U') {
			if (selectedRowIndex !== null) {
				// form에서 변경한 해당 row의 상태를 'U'로 변경 (showConfirmSave에서 그리드 변경을 감지하기 위해 저장하는 값)
				ref.gridRef.current?.setCellValue(selectedRowIndex, 'rowStatus', 'U');
			}
			detailForm.setFieldValue('rowStatus', 'U');
		}
	};

	/**
	 * 업로드 클릭
	 */
	function onClickFileUpload() {
		uploadFile.current.click();
	}

	/**
	 * 업로드 이벤트
	 * @param {object} event 업로드 파일 변경 이벤트
	 */
	function changeUploadEvent(event: any) {
		const files = uploadFile.current.files;
		const tmpFileList = [...fileInfoList];
		const tmpSaveList = [...saveFormData];

		for (const element of files) {
			const currentFile = {
				fileTp: 'cpt',
				sourceFileNm: element.name,
				fileSize: element.size.toString(),
				attchFileGrpNo: detailForm.getFieldValue('brdNum'),
				attchFileNm: element.name,
				attchFileSz: element.size.toString(),
				attchFileExtNm: element.name.split('.')[1],
				rowStatus: 'I',
				uuid: uuidv4(),
			};

			// 임시 저장
			tmpFileList.push(currentFile);
			tmpSaveList.push(element);

			ref.gridRefFile.current.addRow(currentFile, 'last');
			onValuesChange();
		}

		// 파일 리스트 저장
		setFileInfoList(tmpFileList);
		setSaveFormData(tmpSaveList);

		// 같은 파일을 재업로드할 수 있도록 이벤트 초기화
		event.target.value = '';
	}

	/**
	 * 파일 다운로드
	 * @param {object} event 파일 다운로드 이벤트
	 */
	function fileDownloadEvent(event: any) {
		const refKey = ref.gridRefFile.current.getCellValue(event.rowIndex, 'refKey');
		const saveFileNm = ref.gridRefFile.current.getCellValue(event.rowIndex, 'sourceFileNm');
		const savePathNm = ref.gridRefFile.current.getCellValue(event.rowIndex, 'uploadedDirPath');
		const attchFileNm = ref.gridRefFile.current.getCellValue(event.rowIndex, 'uploadedFileNm');

		if (commUtil.isEmpty(refKey)) {
			return;
		}

		const params = {
			dirType: 'savePath',
			saveFileNm: saveFileNm,
			savePathNm: savePathNm,
			attchFileNm: attchFileNm,
		};
		fileUtils.downloadFile(params);
	}

	// 첨부파일 삭제 함수
	const deleteFileRow = () => {
		const selectedIndex = ref.gridRefFile.current.getSelectedIndex()[0];
		ref.gridRefFile.current?.removeRow(selectedIndex);
		onValuesChange();
	};

	// 수신처 그리드 버튼 설정
	const gridBtnRcv: GridBtnPropsType = {
		tGridRef: ref.gridRefRcv, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'delete', // 행삭제
			},
		],
	};

	/**
	 * 팝업 확인
	 * @param {object} params Request Params
	 */
	const confirmEvent = (params: any) => {
		// popup에서 선택된 데이터를 신규행으로 추가
		// 현재 그리드 데이터
		const gridData = ref.gridRefRcv.current.getGridData();

		// 중복 기준 Set 생성
		const userIdSet = new Set(gridData.map((row: any) => row.userId));
		const groupNmSet = new Set(gridData.map((row: any) => row.recvGroupNm));

		// 중복 제거 및 recvNm 추가
		// userId가 있으면 userId로, 없으면 recvGroupNm으로 비교
		const filtered = params
			.filter((item: any) => (item.userId ? !userIdSet.has(item.userId) : !groupNmSet.has(item.recvGroupNm)))
			.map((item: any) => ({
				...item,
				recvNm: item.userNm || item.recvGroupNm,
			}));

		if (filtered.length) {
			ref.gridRefRcv.current.addRow(filtered);
		}

		onValuesChange();

		modalRef.current.handlerClose();
	};

	/**
	 * 수신처 검색 팝업
	 */
	const onClickReceivePopup = () => {
		modalRef.current.handlerOpen();
	};

	/**
	 * 수신처 검색 팝업 닫기
	 */
	const closeEventReceivePopup = () => {
		modalRef.current.handlerClose();
	};

	/**
	 * 태그 수정
	 * @param {any} obj 타겟 Object
	 * @returns {any} 결과값 Object
	 */
	const wrapWithTag = (obj: any) => {
		let value = obj.brdCntt || '';

		// 역슬래시(\) 문자 삭제
		value = value.replace(/\\/g, '');

		// 이미 <p>로 시작하고 </p>로 끝나면 그대로 반환
		// 이미 <blockquote>로 시작하면 그대로 반환
		if ((value.trim().startsWith('<p>') && value.trim().endsWith('</p>')) || value.trim().startsWith('<blockquote>')) {
			return obj;
		}

		// 아니면 감싸기
		return {
			...obj,
			brdCntt: `<p>${value}</p>`,
		};
	};

	/**
	 * 공지대상 전체 사용자 체크박스 변경시
	 * @param {any} event 이벤트
	 */
	const onChangeAllUserYn = (event: any) => {
		rcvForm.setFieldValue(event?.target?.name, event?.target?.checked);

		if (event?.target?.checked) {
			ref.gridRefRcv.current.clearGridData();
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	let prevRowIndex: any = null;
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;

		// 마스터 그리드 행 변경 시
		gridRefCur?.bind('selectionChange', (event: any) => {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell.rowIndex === prevRowIndex) return;

			// 이미 신규 행이 있는 경우 경고 메시지를 표시하고 함수를 종료한다.
			if (detailForm.getFieldValue('rowStatus') === 'I') {
				if (commUtil.isNotEmpty(gridRefCur?.getItemByRowIndex(prevRowIndex))) {
					showMessage({
						content: t('msg.MSG_COM_ERR_054'), // 이미 신규 행이 존재합니다
						modalType: 'warning',
					});
					gridRefCur?.setSelectionByIndex(prevRowIndex, 0);
					return;
				}
			}

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell.rowIndex;

			// 상세공지사항 조회
			searchDtl();

			// 수신처 목록 조회
			searchRcvList();

			// 첨부파일 목록 조회
			searchFileUploadList();
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRefCur?.bind('cellEditEnd', (event: any) => {
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			// gridRefCur.setCellValue(event.rowIndex, 'rowStatus', 'U');
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);

			// 상세공지사항 조회
			searchDtl();

			// 수신처 목록 조회
			searchRcvList();

			// 첨부파일 목록 조회
			searchFileUploadList();

			// 상세 초기화
			if (props.data?.length < 1) {
				detailForm.resetFields();
				ref.gridRefFile.current.clearGridData();
				ref.gridRefRcv.current.clearGridData();
			}
		}
	}, [props.data]);

	// 첨부파일 Cell 선택시
	useEffect(() => {
		ref.gridRefFile.current?.bind('cellClick', (event: any) => {
			if (event.dataField == 'sourceFileNm') {
				fileDownloadEvent(event);
			}
		});
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRefGrp?.current?.resize?.('100%', '100%');
		ref.gridRefFile?.current?.resize?.('100%', '100%');
		ref.gridRefRcv?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtnMaster} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridColMaster} gridProps={gridPropsMaster} />
						</GridAutoHeight>
					</>,
					<Splitter
						key="cbNotice-bottom-splitter"
						onResizing={resizeAllGrids}
						onResizeEnd={resizeAllGrids}
						items={[
							<AGrid key="cbNotice-form" className="form-inner">
								<TableTopBtn tableTitle={t('공지내용')} tableBtn={tableBtnDetail} className="fix-title" />
								<ScrollBox>
									<Form form={detailForm} onValuesChange={onValuesChange} disabled={formDisabled}>
										<UiDetailViewArea>
											<UiDetailViewGroup>
												<Form.Item name="rowStatus" hidden>
													<Input />
												</Form.Item>
												<li className="col-2">
													<SelectBox
														name="brdDocKndCd"
														label={t('구분')} // 문서유형
														options={getCommonCodeList('DOC_KND_CD', '선택', '')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
														disabled={detailForm.getFieldValue('rowStatus') !== 'I'}
														required
														rules={[{ required: true, validateTrigger: 'none' }]}
													/>
												</li>
												<li className="col-2">
													<SelectBox
														name="delYn"
														label={t('lbl.DEL_YN')}
														initval={''}
														options={getCommonCodeList('DEL_YN')}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
														required
														rules={[{ required: true, validateTrigger: 'none' }]}
													/>
												</li>
												<li className="col-2">
													<SelectBox
														name="popYn"
														label={'팝업노출여부'}
														initval={'N'}
														options={[
															{ comCd: 'Y', cdNm: '노출' },
															{ comCd: 'N', cdNm: '비노출' },
														]}
														fieldNames={{ label: 'cdNm', value: 'comCd' }}
													/>
												</li>
												<li className="col-2">
													<Rangepicker
														label={t('공지기간')} // 공지기간
														name="brdDt"
														disabled={formDisabled}
														required
														rules={[{ required: true, validateTrigger: 'none' }]}
													/>
												</li>
												<li className="col-1">
													<InputText
														label={t('이동URL')}
														name="redirectUrl"
														autoComplete="off"
														placeholder={'http가 포함된 전체 URL을 넣어주세요.'}
													/>
												</li>
												<li className="col-1">
													<InputText
														label={t('lbl.TITLE')}
														name="brdTit"
														required
														rules={[{ required: true, validateTrigger: 'none' }]}
														autoComplete="off"
													/>
												</li>
												<li className="col-1">
													{/* <InputTextArea
										label={t('lbl.CONTENT')}
										autoSize={{ minRows: 15, maxRows: 15 }}
										name="brdCntt"
										style={{ height: '100px' }}
										disabled={formDisabled}
									/> */}
													<InputQuillEditor
														name="brdCntt"
														label={t('lbl.CONTENT')}
														disabled={formDisabled}
														height={'500px'}
													/>
												</li>
											</UiDetailViewGroup>
										</UiDetailViewArea>
									</Form>
								</ScrollBox>
							</AGrid>,

							<>
								<AGrid>
									<GridTopBtn gridBtn={gridBtnFile} gridTitle={t('lbl.ATTACHFILE')}>
										<Button onClick={onClickFileUpload}>{'파일추가'}</Button>
										<input
											ref={uploadFile}
											id="cbCommunityUploadInput"
											multiple
											type="file"
											style={{ display: 'none' }}
											onChange={changeUploadEvent}
										/>
										{/* <Button onClick={deleteFileRow}> {'파일삭제'}</Button> */}
									</GridTopBtn>
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={ref.gridRefFile} columnLayout={gridColFile} gridProps={gridPropsFile} />
								</GridAutoHeight>
							</>,
							<>
								<AGrid>
									<GridTopBtn gridBtn={gridBtnRcv} gridTitle={t('공지대상')}>
										<Form form={rcvForm}>
											{rowStatusRef.current === 'I' && (
												<Checkbox name={'allUserYn'} onChange={onChangeAllUserYn}>
													전체 사용자
												</Checkbox>
											)}
											<Button onClick={onClickReceivePopup}>공지대상 추가</Button>
										</Form>
									</GridTopBtn>
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={ref.gridRefRcv} columnLayout={gridColRcv} gridProps={gridPropsRcv} />
								</GridAutoHeight>
							</>,
						]}
					/>,
				]}
			/>

			<CustomModal ref={modalRef} width="900px">
				<CmReceivePopup close={closeEventReceivePopup} callBack={confirmEvent} />
			</CustomModal>
			{/* 공지사항 팝업 */}
			<CustomModal ref={refNoticeModal} width="720px">
				<CmNoticePopup
					data={popYnList}
					close={() => {
						refNoticeModal.current.handlerClose();
					}}
				/>
			</CustomModal>
		</>
	);
});

export default CbNoticeDetail;
