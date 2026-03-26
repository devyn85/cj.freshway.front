// lib
import Datepicker from '@/components/common/custom/form/Datepicker';
import { Col, Form, Input, Row } from 'antd';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Component
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputText, InputTextArea, RadioBox, SelectBox } from '@/components/common/custom/form';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import TmCrmWmsMemoFileUpload from './TmCrmWmsMemoFileUpload';

// Type
import { apiGetMasterHistList, apiSaveCrmApply, apiSaveDetail } from '@/api/tm/apiTmCrmWmsMemo';
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';
import dayjs from 'dayjs';

// API Call Function
import { apiGetDriverPhoneByCarNo } from '@/api/cm/apiCmSearch';
import { apiCrmDelete } from '@/api/tm/apiTmCrmWmsMemo';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import ScrollBox from '@/components/common/ScrollBox';
import Splitter from '@/components/common/Splitter';

const TmCrmWmsMemoTab1 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const { gridRef, data, searchForm } = props;

	// Form 인스턴스
	const [form] = Form.useForm();
	const [detailForm] = Form.useForm(); // 처리 상세
	const { schDeliveryDt, schStorerKey, schDcCode } = searchForm.getFieldsValue();

	// gridRef // CRM요청관리 목록
	const gridRef2 = useRef(null); // 처리이력 목록

	// 파일 업로드 모달 ref
	const refModal = useRef(null);

	// 파일 업로드 팝업 관련 상태
	const [fileUploadParams, setFileUploadParams] = useState<any>(null);

	// CRM요청관리 목록 원본
	const [originalData, setOriginalData] = useState([]);
	// 상세 우측 상단의 저장/임시저장 구분 하기 위한 boolean 값 grid 의 row 클릭 할때난 신규/답글 버튼 클릭시 처리 상세 form 의 버튼 text 가 변경 되어야 함.
	const [btnBoolean, setBtnBoolean] = useState(false);
	// mast grid 의 전송 대상 정보 저장
	const [transTagetBoolean, setTransTagetBoolean] = useState(false);

	// master grid 이전 row 선택 rowid 를 가진다.
	const masterGridSelectionRowId = useRef<string>();
	const memoTargetComboList = getCommonCodeList('CRM_MEMO_TARGET');

	const [detailFormStatus, setDetailFormStatus] = useState({
		/**
		 * 처리상태가 임시 저장(status = '02')일 경우
		 * 메모유형, 전송대상, 차량번호, 관리처코드, 노출기간, 내용
		 * 위 필드들 모두 활성화 (disabled: false)
		 */
		parentId: true, // 상위메모ID
		memoType: true, // 메모유형
		transTarget: true, // 전송대상
		carNo: true, // 차량번호
		custKey: true, // 관리처코드
		inquiryDate: true, // 노출기간
		description: true, // 내용
	});

	// radio 에서 사용 할 CRM 메모 작성출처
	const radioOptions = getCommonCodeList('CRM_MEMO_SOURCE', 'TOTAL', 'TOTAL')?.map((option: any) => {
		return { label: option.cdNm, value: option.comCd };
	});

	// 그리드 초기화
	/**
	 * 좌측 CRM 요청관리 목록 grid
	 */
	const gridCol1 = [
		{
			headerText: t('lbl.SOURCE_SYSTEM'), // 작성출처
			dataField: 'sourceSystem',
			dataType: 'code',
		},
		{
			headerText: t('lbl.TO_CUSTKEY_WD'), // 관리처코드
			dataField: 'custKey',
			dataType: 'code',
		},
		{
			headerText: t('lbl.TO_CUSTKEY_WD2'), // 관리처
			dataField: 'custName',
			dataType: 'default',
		},
		{
			headerText: t('lbl.WRITER'), // 작성자
			dataField: 'memoWriter',
			dataType: 'default',
		},
		{
			headerText: t('lbl.QCSTATUS_RT'), // 처리상태
			dataField: 'statusNm',
			dataType: 'code',
		},
		{
			headerText: t('lbl.CARNO'), // 차량번호
			dataField: 'carNo',
			dataType: 'code',
		},
		{
			headerText: t('lbl.MEMO_TYPE'), // 메모유형
			dataField: 'memoType',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('CRM_MEMO_TYPE', value)?.cdNm;
			},
		},
		{
			// CRM 요청관리에서는 issueno 자리에 serialkey를 넣어서 보내면 됨
			headerText: t('lbl.ATCHFILE'), // 파일첨부
			dataField: 'fileCnt',
			dataType: 'numeric',
			width: 120,
			commRenderer: {
				type: 'search',
				align: 'center',
				iconPosition: 'right',
				onClick: function (e: any) {
					if (e.item?.rowStatus === 'I') {
						showMessage({
							content: '저장 후 첨부 파일 등록 해주세요.',
							modalType: 'info',
						});
						return false;
					}

					openFileUploadPopup({
						serialKey: e.item.serialKey,
						issueNo: e.item.serialKey,
						rowIndex: e.rowIndex,
						status: e.item.status,
					});
				},
			},
		},
		{
			headerText: t('lbl.PHONE'), // 전화번호
			dataField: 'driverPhone',
			dataType: 'code',
			// labelFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
			// 	if (!value) return '';
			// 	// 숫자만 남기고 정규식을 이용해 포맷팅
			// 	return value.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`); // 전화 번호 formate 적용.
			// 	// .replace(/-(\d+)-/g, (_: any, p1: any) => `-${'*'.repeat(p1.length)}-`); // 가운데 번호 * 처리.
			// },
		},
		{
			headerText: t('lbl.MEMO'), // 메모
			dataField: 'description',
			dataType: 'default',
		},
		{
			headerText: t('lbl.INQUIRYDATE'), // 노출기간
			dataField: 'inquiryDate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			headerText: 'serialKey', // serial key
			dataField: 'serialKey',
			dataType: 'default',
			visible: false,
		},
	];

	/**
	 * 우측 처리 이력 목록 grid
	 */
	const gridCol2 = [
		{
			headerText: t('lbl.DATETIME'), // 일시
			dataField: 'memoDate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
		},
		{
			headerText: t('lbl.SOURCE_SYSTEM'), // 작성출처
			dataField: 'sourceSystemNm',
			dataType: 'code',
		},
		{
			headerText: t('lbl.WRITER'), // 작성자
			dataField: 'memoWriter',
			dataType: 'default',
		},
		{
			headerText: t('lbl.MEMO_TYPE'), // 메모유형
			dataField: 'memoType',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('CRM_MEMO_TYPE', value)?.cdNm;
			},
		},
		{
			headerText: t('lbl.CONTENT'), // 내용
			dataField: 'description',
			dataType: 'default',
		},
		{
			headerText: t('lbl.QCSTATUS_RT'), // 처리상태
			dataField: 'status',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				// 메모 상태
				return getCommonCodebyCd('CRM_MEMO_STATUS', value)?.cdNm;
			},
		},
		{
			// 파일첨부
			headerText: t('lbl.ATTACHFILE'),
			dataField: 'fileCnt',
			dataType: 'numeric',
			width: 120,
			commRenderer: {
				type: 'search',
				align: 'center',
				iconPosition: 'right',
				onClick: function (e: any) {
					if (e.item?.rowStatus === 'I') {
						showMessage({
							content: '저장 후 첨부 파일 등록 해주세요.',
							modalType: 'info',
						});
						return false;
					}
					openFileUploadPopupHist({
						serialKey: e.item.serialKey,
						issueNo: e.item.serialKey,
						rowIndex: e.rowIndex,
						status: e.item.status,
					});
				},
			},
		},
		// {
		// 	headerText: 'DM' + t('lbl.SEND'), // DM전송
		// 	dataField: 'edmsFileId',
		// 	dataType: 'code',
		// },
		{
			headerText: t('lbl.INQUIRYDATE'), // 노출기간
			dataField: 'inquiryDate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			headerText: 'serialKey', // serial key
			dataField: 'serialKey',
			dataType: 'default',
			visible: false,
		},
	];

	// 그리드 속성 (CRM 요청관리 목록)
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		showRowCheckColumn: true,
		enableFilter: true,
		// selectionMode: 'singleRow',
	};

	// 그리드 속성 (처리 이력 목록)
	const gridProps2 = {
		editable: false,
		fillColumnSizeMode: false,
		showRowCheckColumn: true,
		enableFilter: true,
		// selectionMode: 'singleRow',
		rowCheckDisabledFunction: (rowIndex: any, isChecked: any, item: any) => {
			if (item.memoLevel === 'M') {
				return false;
			}
			return true;
		},
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * CRM 요청 관리 목록 파일 업로드 팝업 열기
	 * @param {any} rowData 그리드 행 데이터
	 */
	const openFileUploadPopup = (rowData: any) => {
		setFileUploadParams({
			serialKey: rowData.serialKey,
			issueNo: rowData.issueNo,
			rowIndex: rowData.rowIndex,
			status: rowData.status,
			onSave: (fileCount: number) => {
				// 파일 저장 후 그리드 업데이트
				gridRef.current.updateRow({ fileCnt: fileCount }, rowData.rowIndex, false);
				gridRef2.current.updateRow({ fileCnt: fileCount }, 0, false);
				refModal.current.handlerClose();
			},
		});
		setTimeout(() => refModal.current?.handlerOpen(), 0);
	};

	/**
	 * 처리 이력 목록 파일업로드
	 * @param {any} rowData 그리드 행 데이터
	 */
	const openFileUploadPopupHist = (rowData: any) => {
		setFileUploadParams({
			serialKey: rowData.serialKey,
			issueNo: rowData.issueNo,
			rowIndex: rowData.rowIndex,
			status: rowData.status,
			onSave: (fileCount: number) => {
				// 파일 저장 후 그리드 업데이트
				gridRef2.current.updateRow({ fileCnt: fileCount }, rowData.rowIndex, false);
				refModal.current.handlerClose();
			},
		});
		setTimeout(() => refModal.current?.handlerOpen(), 0);
	};

	/**
	 * 파일 업로드 팝업 닫기
	 */
	const closeFileUploadPopup = () => {
		refModal.current?.handlerClose();
		setFileUploadParams(null);
	};

	/**
	 * CRM요청관리목록(왼쪽 grid) - 신규 버튼
	 */
	const addRowGrid = () => {
		// 처리상세 폼 disabled 상태 변경
		changeDetailFormStatus('', 'addRowGrid');

		// 상세 폼 초기화
		detailForm.setFieldsValue({
			parentId: '',
			memoType: '01',
			transTarget: '02', // WMS에서 신규 버튼 클릭 시 전송대상은 배송기사
			memoWriter: '',
			memoDate: '',
			sourceSystem: 'WMS',
			carNo: '',
			driverName: '',
			driverPhone: '',
			custKey: '',
			custName: '',
			inquiryDate: undefined,
			status: '01', // 신규 버튼 클릭 시 처리상태 "접수"
			description: '',
			memoLevel: 'M',
			custType: 'C',
			rowStatus: 'I',
			storerKey: schStorerKey,
		});

		setBtnBoolean(false); // true : 저장 false: 임시저장.
		// 상위메모ID 영역으로 스크롤, 포커스
		try {
			detailForm.scrollToField('parentId', { block: 'center' });
			setTimeout(() => {
				// 상위메모ID 영역으로 포커스
				const el = document.querySelector('input[name="parentId"]') as HTMLElement;
				el?.focus();
			}, 0);
		} catch {}
	};

	/**
	 * CRM요청관리목록 - 확정 버튼
	 * - CRM요청관리 목록, 처리이력 목록 두 그리드모두 같은 확정 API를 사용, gridRef를 파라미터로 받아서 구별
	 * @param selectedGridRef
	 * @param btn
	 */
	const saveConfirmStatus = (btn: any) => {
		const checkedMasterList = gridRef.current?.getCheckedRowItems() || [];
		const checkedMHistList = gridRef2.current?.getCheckedRowItems() || [];

		// 선택 항목 없음
		if (commUtil.isEmpty(checkedMasterList) && commUtil.isEmpty(checkedMHistList)) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// serialkey 미포함 (신규등록 건)
		if (checkedMasterList.some((itemRow: any) => !itemRow.item.serialKey)) {
			showMessage({
				content: `신규등록건은 저장하신 후에 확정처리 해주세요 [행번호: ${
					checkedMasterList.find((itemRow: any) => !itemRow.item.serialKey)?.rowIndex + 1
				}]`,
				modalType: 'info',
			});
			return;
		}

		if (checkedMHistList.some((itemRow: any) => !itemRow.item.serialKey)) {
			showMessage({
				content: `신규등록건은 저장하신 후에 확정처리 해주세요 [행번호: ${
					checkedMHistList.find((itemRow: any) => !itemRow.item.serialKey)?.rowIndex + 1
				}]`,
				modalType: 'info',
			});
			return;
		}

		// sourceSystemnm이 WMS가 아닌 건
		if (
			checkedMasterList.some((itemRow: any) => itemRow.item.sourceSystem !== 'WMS') ||
			checkedMHistList.some((itemRow: any) => itemRow.item.sourceSystemNm !== '물류센터')
		) {
			showMessage({
				content: 'WMS 작성 건만 확정 처리가 가능합니다.',
				modalType: 'info',
			});
			return;
		}

		// 이미 확정된 건(status = '03')
		if (
			checkedMasterList.some((itemRow: any) => itemRow.item.status === '03') ||
			checkedMHistList.some((itemRow: any) => itemRow.item.status === '03')
		) {
			showMessage({
				content: '이미 확정된 건이 포함되어 있습니다.',
				modalType: 'info',
			});
			return;
		}

		const masterList = checkedMasterList.map((item: any) => item.item);
		const histList = checkedMHistList.map((item: any) => item.item);
		const params = {
			masterList: masterList, // 마스터 리스트
			histList: histList, // 상세 리스트
		};
		// 확정하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_CFM_022'), () => {
			apiSaveCrmApply(params).then((res: any) => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_VAL_210'),
						modalType: 'info',
						onOk: () => {
							gridRef.current.resetUpdatedItems();
							gridRef.current.setAllCheckedRows(false);
							props.onSearch();
						},
					});
				}
			});
		});
	};

	/**
	 * CRM요청관리목록 - 삭제 버튼
	 */
	const deleteMasterInfo = () => {
		const checkedMaster = gridRef.current.getCheckedRowItems();
		const checkedHist = gridRef2.current.getCheckedRowItems();

		// 출처 제한 (작성 출처가 WMS가 아님)
		if (
			checkedMaster.some(
				(checkedItem: any) => checkedItem.item.sourceSystem !== 'WMS' && checkedItem.item.status !== '02',
			) ||
			checkedHist.some(
				(checkedItem: any) => checkedItem.item.sourceSystem !== 'WMS' && checkedItem.item.status !== '02',
			)
		) {
			// "WMS 작성 건만 삭제가 가능합니다."
			showMessage({
				content: 'WMS 작성 건만 삭제가 가능합니다.',
				modalType: 'info',
			});
			return;
		}

		// 임시저장만 삭제 가능
		if (
			checkedHist.some((checkedItem: any) => checkedItem.item.status !== '02') ||
			checkedMaster.some((checkedItem: any) => checkedItem.item.status !== '02')
		) {
			// "임시저장중인 상태만 삭제가 가능합니다."
			showMessage({
				content: '임시저장중인 상태만 삭제가 가능합니다.',
				modalType: 'info',
			});
			return;
		}

		const masterList = checkedMaster.map((item: any) => item.item);
		const histList = checkedHist.map((item: any) => item.item);
		const params = {
			masterList: masterList, // 마스터 리스트
			histList: histList, // 상세 리스트
		};
		// //console.log('ssss: ', params);
		// 삭제하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_CFM_001'), () => {
			apiCrmDelete(params).then(res => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_006'),
						modalType: 'info',
						onOk: () => {
							gridRef.current.resetUpdatedItems();
							gridRef.current.setAllCheckedRows(false);
							props.onSearch();
						},
					});
				}
			});
		});
	};

	/**
	 * 처리 이력 목록 삭제.
	 */
	const deleteHistInfo = () => {
		const checkedHist = gridRef2.current.getCheckedRowItems();

		// 출처 제한 (작성 출처가 WMS가 아님)
		if (
			checkedHist.some(
				(checkedItem: any) => checkedItem.item.sourceSystem !== 'WMS' && checkedItem.item.status !== '02',
			)
		) {
			// "WMS 작성 건만 삭제가 가능합니다."
			showMessage({
				content: 'WMS 작성 건만 삭제가 가능합니다.',
				modalType: 'info',
			});
			return;
		}

		// 임시저장만 삭제 가능
		if (checkedHist.some((checkedItem: any) => checkedItem.item.status !== '02')) {
			// "임시저장중인 상태만 삭제가 가능합니다."
			showMessage({
				content: '임시저장중인 상태만 삭제가 가능합니다.',
				modalType: 'info',
			});
			return;
		}

		const rows = checkedHist.map((item: any) => item.item);

		// 삭제하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_CFM_001'), () => {
			apiCrmDelete(rows).then(res => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_006'),
						modalType: 'info',
						onOk: () => {
							gridRef.current.resetUpdatedItems();
							gridRef.current.setAllCheckedRows(false);
							props.onSearch();
						},
					});
				}
			});
		});
	};

	/**
	 * 처리이력 목록 - 답글달기
	 * - 선택된 원글(M)에 대한 답글(C) 작성 준비
	 * - 처리상세 폼에 parentId 부모 memoid를 세팅하고 나머지는 비움
	 */
	const addReplyHist = async () => {
		const mastGridData = gridRef.current?.getSelectedRows?.()?.[0];
		const histGridData = gridRef2.current?.getSelectedRows?.()?.[0];
		// CRM요청관리 목록 미선택
		if (commUtil.isEmpty(mastGridData)) {
			showMessage({
				content: '저장 대상 자료가 존재 하지 않습니다.',
				modalType: 'info',
			});
			return;
		}

		// 부모가 임시저장(status = '02')인 경우
		if (mastGridData?.status == '02') {
			showMessage({
				content: '임시저장 상태입니다. 확정 후 답글달기를 진행해주세요.',
				modalType: 'info',
			});
			return;
		}
		// 상세 우측 상단의 저장/임시저장 구분 (true : 저장 false: 임시저장).
		setBtnBoolean(false);

		// 처리상세 폼 disabled 상태 변경
		changeDetailFormStatus('', 'addRowHistGridReply');
		// 상세 목록의 전송 대상 정보를 detailForm 의 전송대상 출처에 넣어야 함.
		// cust_type =C, source_system = wms
		const selectTargetCd = memoTargetComboList.find((val: any) => {
			let sType = '';
			switch (histGridData?.sourceSystem) {
				case 'CRM':
					sType = '01';
					break;
				case 'CS':
					sType = '04';
					break;
				default:
					// 배송기사
					sType = '02';
					break;
			}

			return sType === val.comCd;
		});

		detailForm.setFieldsValue({
			parentId: mastGridData?.memoId,
			memoType: mastGridData?.memoType,
			transTarget: selectTargetCd?.comCd, // 처리 이력 목록의 작성 출처 따라 가게 처리.
			carNo: mastGridData?.carNo,
			driverName: mastGridData?.driverName,
			custKey: mastGridData?.custKey,
			custName: mastGridData?.custName,
			driverPhone: mastGridData?.driverPhone,
			memoWriter: '',
			memoDate: '',
			inquiryDate: undefined,
			status: '01', // 답글달기 클릭 시 처리상태 "접수"
			description: '',
			memoLevel: 'C',
			custType: 'C',
			sourceSystem: 'WMS',
			rowStatus: 'I',
		});

		// 상세 전송 방식 WMS 면 수정 안되게 막음.
		detailFormStatus.transTarget = mastGridData.transTarget !== 'WMS' ? false : true;
		// 부모들의 전송 대상이 02(배송기사이면 true 아니면 false)
		setTransTagetBoolean(mastGridData.transTarget === '02' ? true : false);

		try {
			detailForm.scrollToField('parentId', { block: 'center' });
			setTimeout(() => {
				const el = document.querySelector('input[name="parentId"]') as HTMLElement;
				el?.focus();
			}, 0);
		} catch {}
	};

	/**
	 * 처리상세 폼 필드 disabled 상태 변경 ( 후측 하단 form 영역 상태값에 따라 활성화 처리.)
	 * @param {string} status 처리상태 코드 (01: 접수, 02: 임시저장, 03: 확정, 04: 처리중)
	 * @param {string} type 호출 위치 (selectedHistGrid: 처리이력목록 선택, addRowGrid: 신규 버튼, addRowHistGridReply: 답글달기 버튼)
	 */
	const changeDetailFormStatus = (status: string, type: string) => {
		switch (type) {
			case 'addRowGrid': // 왼쪽 목록 신규 버튼 클릭
				setDetailFormStatus({
					parentId: true, // 상위 메모 ID
					memoType: false, // 메모 유형
					transTarget: false, // 전송대상
					carNo: false, // 차량 번호
					custKey: false, // 관리처 코드
					inquiryDate: false, // 노출기간
					description: false, // 내용
				});
				break;
			case 'addRowHistGridReply': // 우측 hist grid 답글달기 버튼 클릭 시
				setDetailFormStatus({
					parentId: true, // 상위 메모 ID 닫기
					memoType: true, // 메모 유형 닫기
					transTarget: false, // 전송대상 열기
					carNo: false, // 차량 번호 열기
					custKey: true, // 관리처 코드 닫음
					inquiryDate: false, // 노출기간 열기
					description: false, // 내용 열기
				});
				break;
			default: // 처리 이력 목록 선택 시
				// 접수/ 처리중/ 확정
				if (status === '01' || status === '03' || status === '04') {
					setDetailFormStatus({
						parentId: true, // 상위 메모 ID
						memoType: true,
						transTarget: true,
						carNo: true,
						custKey: true,
						inquiryDate: false, // 확정 시 노출기간만 수정 가능
						description: true,
					});
				} else {
					setDetailFormStatus({
						parentId: true, // TODO: 활성화 여부 확인
						memoType: false,
						transTarget: false,
						carNo: false,
						custKey: false,
						inquiryDate: false,
						description: false,
					});
				}
				break;
		}
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * (CRM 요청관리 목록)
		 */
		gridRef?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			if (data?.length > 0) {
				gridRef?.current.setSelectionByIndex(0);
			}
		});

		/**
		 * 처리이력 목록
		 */
		gridRef2?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			if (gridRef2.current.getGridData().length > 0) {
				gridRef2?.current.setSelectionByIndex(0);
			}
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditEnd', (event: any) => {
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			gridRef.current.setCellValue(event.rowIndex, 'rowStatus', event.item.rowStatus === 'I' ? 'I' : 'U');
		});

		gridRef2?.current.bind('cellEditEnd', (event: any) => {
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			gridRef2.current.setCellValue(event.rowIndex, 'rowStatus', event.item.rowStatus === 'I' ? 'I' : 'U');
		});

		/**
		 * 그리드 셀 선택 변경 - 처리이력 목록 조회
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionChange', (event: any) => {
			const params = event.primeCell.item;
			if (commUtil.isEmpty(params)) return false;
			if (masterGridSelectionRowId.current === params._$uid) {
				return false;
			} else {
				masterGridSelectionRowId.current = params._$uid;
			}

			// 그리드 초기화
			gridRef2.current?.clearGridData();
			// 처리 상세 초기화
			detailForm.resetFields([
				'parentId',
				'memoType',
				'transTarget',
				'carNo',
				'driverName',
				'custKey',
				'custName',
				'memoWriter',
				'memoDate',
				'inquiryDate',
				'status',
				'description',
				'memoLevel',
				'custType',
				'sourceSystem',
				'rowStatus',
				'serialKey',
			]);

			// 상세 우측 상단의 저장/임시저장 구분 (true : 저장 false: 임시저장).
			setBtnBoolean(params?.status === '03' || params?.status === '01' || params?.status === '04' ? false : true);

			apiGetMasterHistList(params).then(res => {
				if (res.statusCode > -1) {
					const dataList = res?.data.map((item: any) => ({
						...item,
						rowStatus: 'R',
					}));
					gridRef2.current?.setGridData(dataList);
					if (res?.data.length > 0) {
						gridRef2?.current.setSelectionByIndex(0);
					}
				}
				if (commUtil.isNotEmpty(params)) {
					setTimeout(() => {
						gridRef.current.setFocus();
					}, 900);
				}
			});
		});

		/**
		 * 그리드 셀 선택 변경 - 처리상세 목록 조회
		 * @param {any} event 이벤트
		 */
		gridRef2?.current?.bind('selectionChange', async (event: any) => {
			const params = event.primeCell.item;
			// 상세 우측 상단의 저장/임시저장 구분 (true : 저장 false: 임시저장).
			setBtnBoolean(params?.status === '03' || params?.status === '01' || params?.status === '04' ? true : false);

			let phone1 = params.driverPhone || '';
			if (params.carNo) {
				const res = await apiGetDriverPhoneByCarNo({ carno: params.carNo });

				if (res?.data) {
					if (commUtil.isNotEmpty(res?.data.phone1) || commUtil.isNotEmpty(res?.data.phone2)) {
						phone1 = commUtil.isEmpty(res?.data.phone1)
							? commUtil.isEmpty(res?.data.phone2)
								? ''
								: res?.data.phone2
							: res?.data.phone1;
					}
				}
			}

			detailForm.setFieldsValue({
				...params,
				parentId: params.parentId,
				inquiryDate: commUtil.isNotEmpty(params?.inquiryDate) ? dayjs(params?.inquiryDate, 'YYYYMMDD') : undefined,
				driverName: params?.driverName ? `[${params?.carNo}] ${params?.driverName}` : '',
				custName: params?.custName ? `[${params?.custKey}] ${params?.custName}` : '',
				driverPhone: phone1 ? phone1.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`) : '', // 전화 번호 formate 적용.
				// .replace(/-(\d+)-/g, (_: any, p1: any) => `-${'*'.repeat(p1.length)}-`); // 가운데 번호 * 처리.
			});

			// 우측 하단 처리상세 폼 disabled 상태 변경
			changeDetailFormStatus(params?.status, 'selectedHistGrid');

			// if (commUtil.isNotEmpty(params)) {
			// 	setTimeout(() => {
			// 		gridRef.current.setFocus();
			// 	});
			// }
		});
	};

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * 처리상세 - 저장/임시저장 버튼 클릭
	 * @param {any} btn
	 */
	const saveDetail = async (btn: any) => {
		try {
			// 처리상세 값 핸들링
			const values = await detailForm.validateFields();
			const { memoType, transTarget, carNo, custKey, description, status, rowStatus } = values;
			const inquiryDate = values.inquiryDate ? dayjs(values.inquiryDate).format('YYYYMMDD') : undefined;

			if ('R' === rowStatus) {
				showMessage({
					content: ' 수정된 내용이 없습니다.',
					modalType: 'info',
				});
				return false;
			}
			if (commUtil.isEmpty(memoType)) {
				showMessage({
					content: '메모유형은 필수입니다.',
					modalType: 'info',
				});
				return false;
			}
			if (commUtil.isEmpty(transTarget)) {
				showMessage({
					content: '전송대상은 필수입니다.',
					modalType: 'info',
				});
				return false;
			}
			if (commUtil.isEmpty(custKey)) {
				showMessage({
					content: '관리처는 필수입니다.',
					modalType: 'info',
				});
				return false;
			}
			if (commUtil.isEmpty(description)) {
				showMessage({
					content: '내용은 필수입니다.',
					modalType: 'info',
				});
				return false;
			}

			if (commUtil.isNotEmpty(values.driverName)) {
				const spaceIndex = values.driverName.indexOf(' ');
				if (spaceIndex > -1) {
					values.driverName = values.driverName.substring(spaceIndex + 1);
				}
			}

			/**
			 * 선택한 처리이력 목록의 처리상태가 확정(status = '03')인 건만 노출기간 설정 가능
			 * 20260219 노출기간 임시저장 이전에도 입력가능하게 요청 으로 주석 처리.
			 */
			// if (commUtil.isNotEmpty(inquiryDate) && status !== '03') {
			// 	showMessage({
			// 		content: '확정 건만 노출기간 설정 가능합니다.',
			// 		modalType: 'info',
			// 	});
			// 	return false;
			// }

			if (dayjs(inquiryDate).isBefore(dayjs(), 'day')) {
				showMessage({
					content: '노출기간은 오늘일자부터 등록이 가능합니다.',
					modalType: 'info',
				});
				return false;
			}

			if (transTagetBoolean && transTarget !== '02') {
				showMessage({
					content: '본글의 전송대상이 배송기사면 댓글도 배송기사만 가능합니다.',
					modalType: 'info',
				});
				return false;
			}

			const isValid = await validateForm(detailForm);
			if (!isValid) {
				return;
			}
			// //console.log(`inquiryDate : ${inquiryDate} || values.inqueryDate: ${values.inquiryDate}`);
			// inquiryDate 를 다시 설정 안해주면 기준 시간대로 설정된 날이 잡힌다. 그래서 다시 값을 덮어 쒸워줌.
			values.inquiryDate = inquiryDate;
			showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
				apiSaveDetail(values).then(res => {
					if (res.statusCode > -1) {
						showMessage({
							content: t('msg.MSG_COM_SUC_003'),
							modalType: 'info',
							onOk: async () => {
								props.onSearch();
							},
						});
					}
				});
			});
		} catch (errorInfo: any) {
			// 검증 실패 시 첫 번째 에러 메시지를 알림창으로 표시
			if (errorInfo.errorFields.length > 0) {
				const firstError = errorInfo.errorFields[0].errors[0];
				showMessage({
					content: firstError,
					modalType: 'info',
				});
				return false;
			}
		}
	};

	/**
	 *
	 * @param row
	 */
	const callBackDriverPop = async (row: any) => {
		// //console.log(`aaaa : ${row[0]}`);

		if (commUtil.isEmpty(row?.[0]?.code)) {
			const currentRowStatus = detailForm.getFieldValue('rowStatus');
			detailForm.setFields([
				{
					name: 'driverPhone',
					value: '',
					touched: true, // 수정 된 상태로 변경 시키기 위해서 수정함.
				},
				{
					name: 'rowStatus',
					value: currentRowStatus === 'I' ? 'I' : 'U',
				},
			]);
			return;
		}
		const selected = row?.[0];
		const code = selected.code ?? selected.carno ?? detailForm.getFieldValue('code');
		let phone1 = '';
		const res = await apiGetDriverPhoneByCarNo({ carno: code });

		if (res?.data) {
			if (commUtil.isNotEmpty(res?.data.phone1) || commUtil.isNotEmpty(res?.data.phone2)) {
				phone1 = commUtil.isEmpty(res?.data.phone1)
					? commUtil.isEmpty(res?.data.phone2)
						? ''
						: res?.data.phone2
					: res?.data.phone1;
			}
		}
		detailForm.setFieldValue(
			'driverPhone',
			phone1.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`),
		);
	};

	/**
	 * 라디오 버튼 선택 시 포함되는 조회 조건(sourceSystem)만 표시
	 * 전체, CRM, WMS
	 * @param {any} e 이벤트
	 */
	const onChangeRadio = (e: any) => {
		const value = e.target.value;

		// 데이터 필터링
		const filteredData =
			value === 'TOTAL' ? originalData : originalData.filter((item: any) => item.sourceSystem === value);

		// 그리드 업데이트
		gridRef.current.setGridData(filteredData);
		if (filteredData.length > 0) {
			gridRef.current.setSelectionByIndex(0);
		}
	};

	/**
	 * detailForm 의 값이 변경 될때 rowStatus 값을 체크 및 수정 해주려고함.
	 * @param {any} changedValues 변경된 값들
	 * @param {any} allValues 모든 값
	 */
	const changeDetailFormData = (changedValues: any, allValues: any) => {
		// //console.log('1231312313');
		if (!changedValues.rowStatus) {
			detailForm.setFieldsValue({ rowStatus: allValues.rowStatus === 'I' ? 'I' : 'U' });
		}
	};

	/**
	 * @param {any} changedValues 변경된 값들
	 * @param {any} allValues 모든 값
	 */
	const changeDetailFormIdValue = (changedValues: any, allValues: any) => {
		// 차량번호나 기사명이 초기화 되면 전화번호도 초기화
		if (
			('carNo' in changedValues && !changedValues.carNo) ||
			('driverName' in changedValues && !changedValues.driverName)
		) {
			detailForm.setFieldValue('driverPhone', '');
		}
	};

	/**
	 * 그리드 버튼 함수를 설정한다. (CRM요청관리 목록 : 왼쪽 grid 버튼)
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: 'btn2', // 신규(그리드 추가 x, 처리상세로 focus, 처리상세의 저장 버튼으로 저장)
				btnLabel: '신규',
				callBackFn: addRowGrid,
			},
			{
				btnType: 'delete', // 삭제
				btnLabel: '삭제',
				isActionEvent: false, // callback 전처리 사용 유무 사용 안함 설정 하고 callBackFn 에서 신규 row 및 기존 row 삭제 로직 처리 함.
				callBackFn: deleteMasterInfo,
			},
			{
				btnType: 'btn3', // 확정
				btnLabel: '확정',
				callBackFn: saveConfirmStatus,
			},
		],
	};

	/**
	 * 처리이력 목록 (임시저장/수정)
	 */
	/**
	 * 그리드 버튼 함수를 설정한다. (처리이력 목록)
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn2: GridBtnPropsType = {
		tGridRef: gridRef2, // 처리이력 목록 Ref
		btnArr: [
			{
				btnType: 'btn4', // 답글달기
				btnLabel: '답글달기',
				callBackFn: addReplyHist,
			},
			// {
			// 	btnType: 'delete', // 삭제
			// 	btnLabel: '삭제',
			// 	callBackFn: deleteHistInfo,
			// },
			{
				btnType: 'btn5', // 확정
				btnLabel: '확정',
				callBackFn: saveConfirmStatus,
			},
		],
	};

	// 처리 상세 영역 저장(임시저장) 버튼 설정
	const tableBtn: TableBtnPropsType = {
		tGridRef: null, // 처리상세
		btnArr: btnBoolean
			? [
					{
						btnType: 'save', // 저장
						btnLabel: '저장',
						isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
						callBackFn: saveDetail,
					},
			  ]
			: [
					{
						btnType: 'btn1', // 임시저장
						btnLabel: '임시저장',
						isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
						callBackFn: saveDetail,
					},
			  ],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
		gridRef2.current?.resize('100%', '100%');
	}, [props.activeTabKey]);

	/**
	 * 그리드 이벤트 바인딩
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		if (gridRef.current && data) {
			// 원본 데이터 저장
			setOriginalData(data);

			// 현재 라디오 선택값에 따라 필터링
			const currentValue = form.getFieldValue('radioBasic1') || 'TOTAL';
			const filteredData =
				currentValue === 'TOTAL' ? data : gridRef.current.filter((item: any) => item.sourceSystem === currentValue);

			// 그리드 설정
			gridRef.current.setGridData(filteredData);
			gridRef.current.setSelectionByIndex(0, 0);

			if (filteredData.length > 0) {
				const colSizeList = gridRef.current.getFitColumnSizeList(true);
				gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [data, ref, gridRef, form]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<Form form={form} initialValues={{ radioBasic1: 'TOTAL' }}>
								<GridTopBtn gridTitle={'CRM요청관리 목록'} gridBtn={gridBtn} totalCnt={props.totalCnt}>
									<li>
										<RadioBox
											name="radioBasic1"
											options={radioOptions} // CRM 메모 작성출처
											className="bg-white"
											onChange={onChangeRadio}
										/>
									</li>
								</GridTopBtn>
							</Form>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef} columnLayout={gridCol1} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<Splitter
						direction="vertical"
						key="TmCrmWmsMemo-tab1-right-splitter"
						onResizing={resizeAllGrids}
						onResizeEnd={resizeAllGrids}
						items={[
							<>
								<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
									<GridTopBtn gridTitle={'처리이력 목록'} gridBtn={gridBtn2} />
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
								</GridAutoHeight>
							</>,
							<>
								<AGrid style={{ padding: '10px 0', marginBottom: 0, height: 'auto' }}>
									<TableTopBtn tableTitle={'처리상세'} tableBtn={tableBtn} />
								</AGrid>
								<ScrollBox>
									<AGrid>
										<Form
											form={detailForm}
											onValuesChange={changeDetailFormData}
											onFieldsChange={changeDetailFormIdValue}
										>
											<Row gutter={0}>
												<Col span={24}>
													<UiDetailViewArea>
														<UiDetailViewGroup className="grid-column-2">
															<Form.Item name="memoLevel" hidden>
																<Input />
															</Form.Item>
															<Form.Item name="rowStatus" hidden>
																<Input />
															</Form.Item>
															<Form.Item name="serialKey" hidden>
																<Input />
															</Form.Item>
															<Form.Item name="storerKey" hidden>
																<Input />
															</Form.Item>
															<Form.Item name="sourceSystem" hidden>
																<Input />
															</Form.Item>

															{/* <Input name="memoLevel" type="hidden" />
										<Input name="rowStatus" type="hidden" /> */}
															<li style={{ gridColumn: 'span 2' }}>
																{/* 상위메모 ID */}
																<InputText
																	label={'상위메모ID'}
																	name="parentId"
																	placeholder="상위메모ID 입력"
																	disabled={detailFormStatus.parentId}
																/>
															</li>
															<li>
																{/* 메모유형 */}
																<SelectBox
																	label={t('lbl.MEMO_TYPE')}
																	name="memoType"
																	options={getCommonCodeList('CRM_MEMO_TYPE')}
																	fieldNames={{ label: 'cdNm', value: 'comCd' }}
																	disabled={detailFormStatus.memoType}
																	required
																/>
															</li>
															<li>
																{/* 전송대상(공통코드 CRM_MEMO_TARGET) */}
																<SelectBox
																	label={t('lbl.TRANSTARGET')}
																	name="transTarget"
																	options={memoTargetComboList}
																	fieldNames={{ label: 'cdNm', value: 'comCd' }}
																	disabled={detailFormStatus.transTarget}
																	required
																/>
															</li>
															<li>
																{/* 작성자 */}
																<InputText
																	label={t('lbl.WRITER')}
																	name="memoWriter"
																	placeholder="작성자 입력"
																	disabled
																/>
															</li>
															<li>
																{/* 작성일시 */}
																<InputText
																	label={t('lbl.WRITERDATE')}
																	name="memoDate"
																	placeholder="작성일자 입력"
																	disabled
																/>
															</li>
															<li>
																{/* 차량번호 */}
																<CmCarSearch
																	form={detailForm}
																	name="driverName"
																	code="carNo"
																	label={t('lbl.CARNO')}
																	selectionMode="singleRow"
																	callBack={callBackDriverPop}
																	disabled={detailFormStatus.carNo}
																/>
															</li>
															<li>
																{/* 관리처코드 */}
																{/* 거래처 조회 팝업 */}
																<CmCustSearch
																	form={detailForm}
																	label={t('lbl.TO_CUSTKEY_WD')}
																	name="custName"
																	code="custKey"
																	disabled={detailFormStatus.custKey}
																	required
																/>
															</li>
															<li>
																{/* 기사번호 */}
																<InputText label={t('lbl.DRIVERPHONE')} name="driverPhone" placeholder="" disabled />
															</li>
															<li></li>
															<li>
																{/* 노출기간 */}
																<Datepicker
																	label={t('lbl.INQUIRYDATE')}
																	name="inquiryDate"
																	// picker={'day'}
																	allowClear
																	showNow={true}
																	format="YYYY-MM-DD"
																	disabled={detailFormStatus.inquiryDate}
																/>
															</li>
															<li>
																<SelectBox
																	label={t('lbl.QCSTATUS_RT')}
																	name="status"
																	options={getCommonCodeList('CRM_MEMO_STATUS')}
																	fieldNames={{ label: 'cdNm', value: 'comCd' }}
																	disabled
																/>
															</li>
															<li style={{ gridColumn: 'span 2' }}>
																{/* 내용 */}
																<InputTextArea
																	label={t('lbl.CONTENT')}
																	name="description"
																	placeholder="텍스트를 입력해주세요."
																	maxLength={100}
																	autoSize={{ minRows: 8, maxRows: 15 }}
																	disabled={detailFormStatus.description}
																	required
																/>
															</li>
														</UiDetailViewGroup>
													</UiDetailViewArea>
												</Col>
											</Row>
										</Form>
									</AGrid>
								</ScrollBox>
							</>,
						]}
					/>,
				]}
			/>

			<CustomModal ref={refModal} width="1000px">
				{fileUploadParams && (
					<TmCrmWmsMemoFileUpload
						serialKey={fileUploadParams.serialKey}
						issueNo={fileUploadParams.issueNo}
						status={fileUploadParams.status}
						close={closeFileUploadPopup}
						onSave={fileUploadParams.onSave}
					/>
				)}
			</CustomModal>
		</>
	);
});

export default TmCrmWmsMemoTab1;
