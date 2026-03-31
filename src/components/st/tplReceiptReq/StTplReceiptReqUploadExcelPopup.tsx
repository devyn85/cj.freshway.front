/*
 ############################################################################
 # FiledataField	: StTplReceiptReqUploadExcelPopup.tsx
 # Description		:  엑셀 업로드 예제 팝업
 # Author			: Canal Frame
 # Since			: 25.05.09
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils
import { showAlert } from '@/util/MessageUtil';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// API
import { apiPostExcelUpload } from '@/api/cm/apiCmExcel';
import { apiGetExcelCheck, apisaveMasterList } from '@/api/st/apiStTplReceiptReq';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import StTplReceiptReqFileUploadPopup from '@/components/comfunc/func/filePage/StTplReceiptReqFileUploadPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { useAppSelector } from '@/store/core/coreHook';
import fileUtil from '@/util/fileUtils';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
interface PropsType {
	close?: any;
	save?: any;
	gridCol?: any;
	// setSepecCodeDetail?: any;
	// uploadFile: any;
	isDisabled: any;
	convert: any;
	lotDuration: any;
	fromCustKey: any;
	custKey: any;
	tplBcnrId: any;
	dcCode: any;
	fnCallBack: any;
	docType: any;
	organize: any;
}

const StTplReceiptReqUploadExcelPopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;
	const refModal = useRef(null);
	// 다국어
	const { t } = useTranslation();
	const gridRef = useRef(null);
	// const gridRef = useRef(null);
	const [avgChk, setAvgChk] = useState(false);
	const [gridData, setGridData] = useState([]);
	const excelUploadFileRef = useRef(null);
	const refModal1 = useRef(null);
	const [docNo, setDocNo] = useState();
	const [docType, setDocType] = useState('DP');
	const [rowStatus, setRowStatus] = useState('');
	const [rowIndex, setRowIndex] = useState('');

	const user = useAppSelector(state => state.user.userInfo);
	const gridProps = {
		editable: true,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부

		enableMovingColumn: false,
		enableAutoColumnLayout: false, // 컬럼 자동 생성/정렬 방지
	};
	const popupCallBack = (item: any) => {
		const codeDtl1 = gridRef.current.getChangedData({ validationYn: false });
		const codeDtl = (codeDtl1 || []).filter((r: any) => r?.rowStatus === 'I' && r?.uploadFlag === 'S');

		if (!isEmpty(item.newDocNo)) {
			for (const e of codeDtl) {
				const data = {
					_$uid: e._$uid ?? e.uid ?? e.serialKey, // 그리드 식별자
					// serialKey: e.serialKey,
					// toDate: dayjs(n.fromDate, 'YYYYMMDD').subtract(1, 'day').format('YYYYMMDD'), // 종료일을 어제로 설정
					// rowStatus: 'U',
					docNo: item.newDocNo,
					attachment: item.count,
				};
				gridRef.current.updateRowsById(data);
				// ref.gridRef?.current?.setCellValue(, 'docNo', item.newDocNo);
			}

			setDocNo(item.newDocNo);
			// setFlag('Y');
			// gridRef?.current?.setCellValue(rowIndex, 'attachment', item.count);
		} else if (
			gridRef.current
				.getChangedData({ validationYn: false })
				.filter((r: any) => r?.rowStatus === 'I' && !isEmpty(r?.docNo) && r?.uploadFlag === 'S').length > 0
		) {
			const list = gridRef.current
				.getChangedData({ validationYn: false })
				.filter((r: any) => r?.rowStatus === 'I' && !isEmpty(r?.docNo) && r?.uploadFlag === 'S');
			const docno = list[0].docNo;

			for (const e of list) {
				const data = {
					_$uid: e._$uid ?? e.uid ?? e.serialKey, // 그리드 식별자
					// serialKey: e.serialKey,
					// toDate: dayjs(n.fromDate, 'YYYYMMDD').subtract(1, 'day').format('YYYYMMDD'), // 종료일을 어제로 설정
					// rowStatus: 'U',
					docNo: docNo,
					attachment: item.count,
				};
				gridRef.current.updateRowsById(data);
				// popupRef.gridRef.current.addUncheckedRowsByValue('_$uid', e._$uid);
				// ref.gridRef?.current?.setCellValue(, 'docNo', item.newDocNo);
			}
		}
		refModal1.current.handlerClose();
	};
	/**
	 * 셀 클릭 파일 업로드
	 * @param {object} item 파일 정보
	 * @returns {void}
	 */
	const onClickFileUploader = (item: any) => {
		// //console.log(flag);

		// ...existing code...
		if (isEmpty(item.item.docNo)) {
			const validChk = gridRef.current.getGridData();

			// rowStatus가 'I'이고 docNo가 있는 행들만 추출
			const rowsToUse = (validChk || []).filter((r: any) => r?.rowStatus === 'I' && r?.docNo);

			// 예: 첫 번째 매칭 행을 사용
			if (rowsToUse.length > 0) {
				const target = rowsToUse[0];
				// 필요한 필드로 payload 구성
				// const payload = {
				// 	docNo: target.docNo,
				// 	docType: target.docType,
				// 	tplBcnrId: target.tplBcnrId,
				// 	// ...추가로 보낼 필드
				// };

				setDocNo(target.docNo);
				setDocType(item.item.docType);
				setRowIndex(item.rowIndex);
				setRowStatus('I');
				refModal1.current.handlerOpen(gridRef);
				return;
				// 실제 처리 호출 예:
				// apisaveMasterList({ saveList: [target] }) 또는 원하는 로직
			} else {
				setDocNo('');
				setDocType(item.item.docType);
				setRowStatus('I');
				setRowIndex(item.rowIndex);
				refModal1.current.handlerOpen(gridRef);
				return;
			}
		}
		setDocNo(item.item.docNo);
		setDocType(item.item.docType);
		setRowStatus('I');
		setRowIndex(item.rowIndex);
		refModal1.current.handlerOpen(gridRef);
		return;
	};
	/**
	 * 엑셀의 내용을 Dataset 에 import 한다.
	 * @param {any} e React.ChangeEvent<HTMLInputElement>
	 * @param {number} nSheetIdx 읽어올 엑셀의 sheet index ('0' base)
	 * @param {any} gridRef 타겟 그리드 Ref
	 * @param {number} nStartRow 읽어올 시작 row. (default = 1)
	 * @returns {void}
	 */
	const excelImport = (e: React.ChangeEvent<HTMLInputElement>, nSheetIdx: number, gridRef: any, nStartRow: number) => {
		const target = e.currentTarget;

		const file = target.files[0];

		if (file === undefined) {
			return;
		} else {
			// 칼럼의 계층형 최대 높이 구하기
			let depth = 1;
			const columnLayout = gridRef?.current?.getColumnLayout();
			const getColumnDepth = (columnLayoutList: any) => {
				columnLayoutList?.map((layout: any) => {
					if (layout.depth > depth) {
						depth = layout.depth;
					}

					if (commUtil.isNotEmpty(layout.children)) {
						getColumnDepth(layout.children);
					}
				});
			};
			getColumnDepth(columnLayout);

			// 그리드 자식들의 칼럼 Key 목록
			const columnKeyList: any[] = [];
			if (gridRef?.current?.props?.gridProps?.showRowNumColumn !== false) {
				// 로우 넘버링 유무에 따른 칼럼 추가
				columnKeyList.push('no');
			}
			const columnInfoList = gridRef?.current?.getColumnInfoList();
			columnInfoList?.map((columnInfo: any) => {
				columnKeyList.push(columnInfo.dataField);
			});

			const jsonData = { startRow: depth, columnNames: columnKeyList };
			const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
			const formData = new FormData();
			formData.append('file', file);
			formData.append('params', jsonBlob);

			const params = formData;

			for (const pair of params.entries()) {
			}
			gridRef?.current?.clearGridData();
			apiPostExcelUpload(params).then((res: any) => {
				if (res.statusCode == 0) {
					gridRef.current?.addRow(res.data.rowsData);

					// 칼럼 사이즈 재조정
					const colSizeList = gridRef.current?.getFitColumnSizeList(true);
					gridRef.current?.setColumnSizeList(colSizeList);

					onDataCheckClick();
				}
			});
		}
	};
	/**
	 * 엑셀 업로드 버튼 클릭
	 */
	const onClickUploadExcel = () => {
		excelUploadFileRef.current.click();
	};

	/**
	 * 엑셀 업로드 파일 변경 이벤트
	 * @param {object} e 이벤트
	 * @returns {void}
	 */
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, onDataCheckClick);
	};

	/**
	 * 유효성 검증
	 * @returns {void}
	 */
	const onDataCheckClick = () => {
		// 변경 데이터 확인
		const saveList = gridRef.current.getGridData();

		// if (!gpsList || gpsList.length < 1) {
		// 	// showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
		// 	// 	return;
		// 	// });
		// } else if (gpsList.length > 0 && !gridRef.current.validateRequiredGridData()) {
		// 	return;
		// } else {

		const params = {
			// processType: 'SPMS_CUSTDLVINFO_EXLCHK',
			saveList: saveList,
			tplUser: props.tplBcnrId,
			fromCustKey: props.fromCustKey,
			custkey: props.custKey,
			dcCode: '2170',
			organize: props.organize,
		};
		// const params = new FormData(); // 파일 전송할 form
		// params.append('dto', saveList);
		// // params.append('saveList' gpsList)
		// params.append('tplBcnrId', props.tplBcnrId);
		// params.append('fromCustKey', props.fromCustKey);
		// params.append('custKey', props.custKey);
		// params.append('dcCode', '2170');

		gridRef.current.clearGridData();
		apiGetExcelCheck(params).then((res: any) => {
			const newData = (Array.isArray(res.data) ? res.data : [res.data]).map(item => ({
				...item,
				rowStatus: item.uploadFlag !== 'E' ? 'I' : '',
				customRowCheckYn: 'N',
			}));

			// gridRefCur?.setGridData(newData);
			// gridRefCur?.setGridData(props.data);

			gridRef.current?.addRow(newData);

			setGridData(newData);
			// //console.log(gridRef.current.get());
			// gridRef.current?.addUncheckedRowsByValue('uploadFlag', 'E');
			// setAvgChk(true);
		});
		// }
	};
	/**
	 * 저장로직
	 * @returns
	 */
	const saveMaster = () => {
		const codeDtl1 = gridRef.current.getChangedData({ validationYn: false });
		const validChk = gridRef.current.getGridData();

		const codeDtl = (codeDtl1 || []).filter((r: any) => r?.rowStatus === 'I');
		const rowsToUse = (codeDtl || []).filter((r: any) => r?.rowStatus !== 'I');
		// 수정:
		const fileList = codeDtl.filter(item => Number(item.attachment) !== 0);
		const attachedList = codeDtl.filter(item => Number(item.attachment) !== 0 && item.attachment != null);
		const missingAttachCount = codeDtl.length - attachedList.length;

		for (const e of rowsToUse) {
			const item = {
				_$uid: e._$uid ?? e.uid ?? e.serialKey, // 그리드 식별자
				rowStatus: 'U',
			};
			gridRef.current.updateRowsById(item);
			gridRef.current.addUncheckedRowsByValue('_$uid', e._$uid);
		}
		if (!codeDtl || codeDtl.length < 1) {
			gridRef.current.showConfirmSave(() => {
				return;
			});
		} else if (codeDtl.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		} else if (user.emptype !== 'A01' && missingAttachCount > 0) {
			showAlert('', '증빙첨부는 필수입니다.');
			return;
		} else {
			showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
				const saveList = {
					saveList: codeDtl,
				};

				//console.log((saveList);
				apisaveMasterList(saveList)
					.then(res => {
						if (res.statusCode === 0) {
							gridRef.current.clearGridData();
							props.close();
							props.fnCallBack(); // 저장 성공 후에만 호출
							showAlert('저장', '저장되었습니다.');
						} else {
							return false;
						}
					})
					.catch(e => {
						return false;
					});
			});
		}
	};
	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelForm',
			},
			{
				btnType: 'excelSelect', // 엑셀선택
				isActionEvent: false,
				callBackFn: () => {
					onClickUploadExcel();
				},
			},
			{
				btnType: 'save',
				callBackFn: saveMaster,
			},
		],
	};
	// 기존 gridCol에 에러 컬럼 추가
	const gridCol = [
		// { dataField: 'duration', headerText: 'duration', width: 120, editable: false, visible: false },
		{ dataField: 'qtyPerBox', headerText: 'qtyPerBox', width: 120, editable: false, visible: false },
		{ dataField: 'netWeight', headerText: 'netWeight', width: 120, editable: false, visible: false },
		{ dataField: 'boxPerPlt', headerText: 'boxPerPlt', width: 120, editable: false, visible: false },
		{ dataField: 'tplBcnrId', headerText: 'tplBcnrId', width: 120, editable: false, visible: false },
		{ dataField: 'durationType', headerText: 'durationType', width: 120, editable: false, visible: false },
		{ dataField: 'docType', headerText: '요청번호', width: 120, editable: false, visible: false },
		{ dataField: 'docNo', headerText: '요청번호', width: 120, editable: false },
		// {
		// 	dataField: 'sku',
		// 	headerText: '상품코드',
		// 	width: 130,
		// 	editable: true,
		// 	renderer: {
		// 		type: 'InputEditRenderer',
		// 		showEditorBtn: true, // 🔍 버튼처럼 보이게
		// 	},
		// },
		{
			dataField: 'sku',
			headerText: '상품코드',
			width: 109,
			dataType: 'code',
			// editable: false,
			required: true,
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	//console.log(((item.rowStatus);
			// 	if (!item || item.delYn == null) {
			// 		// item이 없거나 delYn이 없으면 기본값 반환 또는 아무것도 안함
			// 		return;
			// 	}
			// 	if (item.delYn !== 'N') {
			// 		// 편집 가능 class 삭제
			// 		gridRef.current.removeEditClass(columnIndex);
			// 	} else {
			// 		// 편집 가능 class 추가
			// 		return 'isEdit';
			// 	}
			// },
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				//console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			commRenderer: {
				type: 'search',
				popupType: 'sku',
				searchDropdownProps: {
					dataFieldMap: {
						sku: 'code',
						skuName: 'name',
					},
					callbackBeforeUpdateRow: (e: any) => {
						const selectedIndex = gridRef?.current?.getSelectedIndex();
						// getSkuSelectData(e.code, selectedIndex[0]);
					},
				},

				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					const data = gridRef.current.getSelectedRows();
					if (e.item?.rowStatus !== 'I') {
						return false;
					}
					refModal.current.open({
						gridRef: gridRef,
						codeName: e.value, // 돋보기 눌러서는 모달 열 때 value는 undefined입니다. ( event type이 다름 )
						rowIndex,
						selectData: data[0],
						dataFieldMap: {
							sku: 'code',
							skuName: 'name',
						},
						onConfirm: (selectedRows: any[]) => {
							const dataFieldMap = {
								sku: 'sku',
								skuName: 'name',
							};

							const rowData = selectedRows[0];
							const updateObj: Record<string, any> = {};
							Object.entries(dataFieldMap).forEach(([targetField, sourceField]) => {
								updateObj[targetField] = rowData[sourceField];
							});
							// 안전한 업데이트를 위해 next tick으로 밀기
							setTimeout(() => {
								// getSkuSelectData(rowData.sku, rowIndex);
								gridRef?.current?.updateRow(updateObj, rowIndex);
								refModal.current?.handlerClose();
							}, 0);
							gridRef?.current?.addCheckedRowsByIds(gridRef?.current?.indexToRowId(rowIndex));
						},
						popupType: 'sku',
					});
				},
			},
		},
		{ dataField: 'skuName', headerText: '상품명', width: 160, editable: false },
		{ dataField: 'baseUom', headerText: '단위', width: 80, editable: false },
		{
			dataField: 'orderQty',
			headerText: '입고수량',
			dataType: 'numeric',
			width: 100,
			editable: true,
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				//console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'boxQty',
			headerText: '박스수량',
			dataType: 'numeric',
			width: 90,
			editable: false,
			// labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
			// 	//console.log(item);
			// 	return  props.convert(item.orderQty, item.baseUom, 'BOX', item.qtyPerBox, item.boxPerPlt, item.netWeight);
			// },
		},
		{
			dataField: 'pltQty',
			headerText: 'PLT수량',
			dataType: 'numeric',
			width: 90,
			editable: false,
		},
		{
			dataField: 'deliveryDate',
			headerText: '입고예정일',
			width: 120,
			editable: true,
			required: true,
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				//console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) || value === '' ? '' : dayjs(value).format('YYYY-MM-DD') ?? '';
			},
		},
		// ...existing code...
		{
			dataField: 'openTime',
			headerText: '입고예정시간',
			width: 100,
			editable: true,

			dataType: 'string', // 시간 문자열(HHmm)로 처리
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				//console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowPoint: false,
				allowNegative: false,
				maxlength: 4,
				regExp: /^\d{0,4}$/,
			},
			labelFunction: (rowIndex: number, colIndex: number, value: any) => {
				if (value === null || value === undefined || value === '') return '';
				const s = String(value).replace(/\D/g, '').padStart(4, '0').slice(0, 4);
				return `${s.slice(0, 2)}:${s.slice(2)}`; // "HH:mm"
			},
		},
		{
			dataField: 'durationRate',
			headerText: '소비기한잔여(%)',
			dataType: 'code',
			width: 140,
			editable: false,
		},
		// {
		// 	dataField: 'lottable01',
		// 	headerText: 'lottable01',
		// 	width: 120,
		// 	editable: false,
		// },
		{
			dataField: 'durationFrom',
			headerText: '제조일자',
			width: 120,
			editable: true,
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				//console.log((item.rowStatus);
				if (!props.isDisabled(item) || item.durationType === '1') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) || value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD') ?? '';
			},
		},

		{
			dataField: 'durationTo',
			headerText: '소비일자',
			width: 120,
			editable: true,
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				//console.log((item.rowStatus);
				if (!props.isDisabled(item) || item.durationType === '2') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) || value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD') ?? '';
			},
		},
		{
			dataField: 'convSerialNo',
			headerText: 'B/L번호',
			width: 140,
			editable: true,
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				//console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},

		{
			dataField: 'serialNo',
			headerText: '이력번호',
			width: 140,
			editable: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				//console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'attachment',
			headerText: '증빙첨부',
			width: 100,
			editable: false,
			renderer: {
				type: 'ButtonRenderer',
				// labelText: '첨부',
				onClick: (event: any) => {
					onClickFileUploader(event);
				},
			},
		},
		{
			dataField: 'rmk',
			headerText: '비고',
			width: 200,
			editable: true,
			renderer: {
				type: 'InputEditRenderer',
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				// //console.log(item);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		// 화주 팝업이 없어서 임시로 생성
		// {
		// 	dataField: 'fromCustKey',
		// 	headerText: '거래처(임시)',
		// 	width: 200,
		// 	visible: false,
		// },
		// {
		// 	dataField: 'fromCustName',
		// 	headerText: '거래처명(임시)',
		// 	width: 200,
		// 	visible: false,
		// },
		// {
		// 	dataField: 'organize',
		// 	headerText: '창고(임시)',
		// 	width: 200,
		// 	visible: false,
		// },

		{
			dataField: 'uploadFlag',
			headerText: '업로드 상태',
			width: 90,
			dataType: 'code',
			// managerDataField: 'addWhoId',
			editable: false,
		},
		{
			dataField: 'errMsg',
			headerText: '에러메시지',
			width: 90,
			dataType: 'manager',
			managerDataField: 'addWhoId',
			editable: false,
		},
		{
			dataField: 'addWho',
			headerText: '등록자',
			width: 90,
			dataType: 'manager',
			managerDataField: 'addWhoId',
			editable: false,
			visible: false,
		},
		{
			dataField: 'addDate',
			headerText: '등록일시',
			dataType: 'date',
			visible: false,
			dateInputFormat: 'yyyymmddHHMMss', // 실제 데이터의 형식 지정
			formatString: 'yyyy-mm-dd HH:MM:ss', // 실제 데이터 형식을 어떻게 표시할지 지정
			editable: false,
		},
		{
			dataField: 'editWho',
			headerText: '수정자',
			width: 90,
			dataType: 'manager',
			visible: false,
			managerDataField: 'editWhoId',
			editable: false,
		},
		{
			dataField: 'editDate',
			headerText: '수정일시',
			editable: false,
			dataType: 'date',
			visible: false,
			dateInputFormat: 'yyyymmddHHMMss', // 실제 데이터의 형식 지정
			formatString: 'yyyy-mm-dd HH:MM:ss', // 실제 데이터 형식을 어떻게 표시할지 지정
		},
	];
	// 'YYYYMMDD'만 허용. 하이픈/슬래시 등 있으면 숫자만 추출해 8자리 사용.
	const normalizeYMD = (raw?: string | null) => {
		if (!raw) return null;
		const onlyNum = (raw + '').toUpperCase().trim();
		if (onlyNum === 'STD') return null; // STD는 날짜 없음 처리
		const ymd = onlyNum.replace(/[^0-9]/g, '').slice(0, 8);
		return ymd.length === 8 ? ymd : null;
	};

	const parseYYYYMMDD_UTC = (ymd: string) => {
		const y = Number(ymd.slice(0, 4));
		const m = Number(ymd.slice(4, 6));
		const d = Number(ymd.slice(6, 8));
		const dt = new Date(Date.UTC(y, m - 1, d));
		// 유효성 체크 (예: 20250230 방지)
		if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
		return dt;
	};

	const formatYYYYMMDD_UTC = (dt: Date) => {
		const y = dt.getUTCFullYear();
		const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
		const d = String(dt.getUTCDate()).padStart(2, '0');
		return `${y}${m}${d}`;
	};

	const addDaysUTC = (dt: Date, days: number) => {
		const nd = new Date(dt.getTime());
		nd.setUTCDate(nd.getUTCDate() + days);
		return nd;
	};

	// 문자열 'YYYYMMDD' <-> Date 사이 안전 변환
	const ymdPlusDays = (ymdRaw: string, days: number) => {
		const ymd = normalizeYMD(ymdRaw);
		if (!ymd) return null;
		const dt = parseYYYYMMDD_UTC(ymd);
		if (!dt) return null;
		return formatYYYYMMDD_UTC(addDaysUTC(dt, days));
	};
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		setTimeout(() => {
			// 업로드 에러 데이터 컬럼 체크 해제

			const errList = gridRef.current.getGridData().filter(item => item.uploadFlag === 'E');
			const uncheckedIds = errList.map((item: any) => item._$uid);
			gridRef.current.addUncheckedRowsByIdsBefore(uncheckedIds);
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
		}, 500);
	}, [gridData]);
	useEffect(() => {
		const gridRefCur = gridRef.current;

		gridRefCur.bind('cellEditBegin', function (event: any) {
			const row = event.rowIndex;
			// //console.log(event);
			const e = event.dataField;
			const data = event.item;
			// //console.log(data);
			if (e === 'durationFrom') {
				if (data.durationType === '1') {
					// 편집 불가
					return false;
				}
			}
			if (e === 'durationTo') {
				// item.durationType === '2';
				if (data.durationType === '2') {
					// 편집 불가
					return false;
				}
			}
			if (event.item.rowStatus !== 'I' || !event.item.rowStatus) {
				return false;
			} else {
				// //console.log(data?.rowStatus);
				return true;
			}
		});
		// gridRefCur.bind('addRow', function (event: any) {
		// 	//console.log(event);
		// 	// const rows = gridRefCur.getRowsByValue('docNo', ['Anna', 'Lawrence']);
		// 	const codeDtl = gridRef.current.getChangedData({ validationYn: false });
		// 	const list = codeDtl.filter(item => {
		// 		!isEmpty(item.docNo) && item.rowStatus === 'I';
		// 	});
		// 	//console.log(list);
		// 	if (list.length > 0) {
		// 		gridRefCur.setCellValue(event.rowIndex, 'docNo', list.get(0).docNo);
		// 	}
		// });
		gridRefCur.bind('cellEditEnd', async (event: any) => {
			const row = event.rowIndex;

			const e = event.dataField;
			const data = event.item;
			if (e === 'durationFrom' || e === 'durationTo') {
				gridRefCur.setCellValue(row, 'lottable01', event.value);
				if (!isEmpty(event.item.durationType)) {
					const duration = event.item.duration;
					const durationType = event.item.durationType;
					// const date = new Date(event.item.lottable01);
					// //console.log(date);
					if (durationType === '1') {
						// "~까지": lottable01 = 소비기한(만료일)
						const durationTo = event.value; // 그대로
						const durationFrom = ymdPlusDays(event.value, -duration); // 소비기한 - 기간
						gridRefCur.setCellValue(row, 'durationTo', durationTo ?? '');
						gridRefCur.setCellValue(row, 'durationFrom', durationFrom ?? '');
					} else if (durationType === '2') {
						// "~부터": lottable01 = 시작일(기준일)
						const durationFrom = event.value; // 그대로
						const durationTo = ymdPlusDays(event.value, duration); // 기준일 + 기간
						gridRefCur.setCellValue(row, 'durationFrom', durationFrom ?? '');
						gridRefCur.setCellValue(row, 'durationTo', durationTo ?? '');
					} else {
						// 정의되지 않은 타입은 둘 다 공백 처리
						gridRefCur.setCellValue(row, 'durationFrom', '');
						gridRefCur.setCellValue(row, 'durationTo', '');
					}
				}
			}
			if (e === 'orderQty') {
				const val = props.convert(data.orderQty, data.baseUom, 'BOX', data.qtyPerBox, data.boxPerPlt, data.netWeight);
				const val1 = props.convert(data.orderQty, data.baseUom, 'PAL', data.qtyPerBox, data.boxPerPlt, data.netWeight);

				gridRefCur.setCellValue(row, 'boxQty', val);
				gridRefCur.setCellValue(row, 'pltQty', val1);
			}
			if (e === 'openTime') {
				if (isEmpty(event.value)) {
					gridRefCur.setCellValue(row, 'openTime', '');
					return;
				}
				const raw = String(event.value ?? '')
					.replace(/\D/g, '')
					.padStart(4, '0')
					.slice(0, 4);
				const hh = parseInt(raw.slice(0, 2), 10);
				const mm = parseInt(raw.slice(2), 10);
				if (Number.isNaN(hh) || Number.isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) {
					showAlert('입력오류', '시간은 0000 ~ 2359 범위의 숫자로 입력해주세요.');
					// 되돌리기
					if (typeof event.revert === 'function') {
						event.revert();
					} else {
						gridRefCur.setCellValue(row, 'openTime', event.oldValue);
					}
				} else {
					// 저장값은 "HHmm" (숫자4자리)로 유지
					gridRefCur.setCellValue(row, 'openTime', raw);
				}
			}
			if (e === 'lottable01') {
				// const
				if (!data.duration || !data.lottable01) {
					return 0;
				}
				const val2 = props.lotDuration('EXPIRE', data.duration, data.lottable01, 'R'); // 예: "56"
				if (val2 === 0) {
					gridRefCur.setCellValue(row, 'durationRate', 0 + '%');
				}
				gridRefCur.setCellValue(row, 'durationRate', val2 + '%');
			}
			if (e === 'lottableFrom' || e === 'lottableTo') {
			}
		});
		// //console.log(props.custKey);
	}, []);

	// // grid data 변경 감지
	// useEffect(() => {
	// 	const gridRefCur1 = gridRef.current;
	// 	if (gridRefCur1) {
	// 		gridRefCur1?.setGridData(props.data);
	// 		gridRefCur1?.setSelectionByIndex(0, 0);
	// 		if (props.data.length > 0) {
	// 			// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
	// 			// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
	// 			const colSizeList = gridRefCur1.getFitColumnSizeList(true);
	// 			// 구해진 칼럼 사이즈를 적용 시킴.
	// 			gridRefCur1.setColumnSizeList(colSizeList);
	// 			gridRefCur1.setColumnPropByDataField('expenseType', { width: 220 });
	// 			gridRefCur1.setColumnPropByDataField('areaPriceUom', { width: 60 });
	// 			gridRefCur1.setColumnPropByDataField('sku', { width: 75 });
	// 			gridRefCur1.setColumnPropByDataField('organize', { width: 100 });
	// 		}
	// 	}
	// }, [props.data]);
	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="위탁입고요청" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '}>
					{/* <Button onClick={onDataCheckClick}>{'유효성검증'}</Button> */}
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
			</ButtonWrap>
			<CustomModal ref={refModal1} width="600px">
				<StTplReceiptReqFileUploadPopup
					ref={refModal1}
					docNo={docNo}
					docType={docType}
					rowStatus={rowStatus}
					callBack={popupCallBack}
				/>
			</CustomModal>
			<CmSearchWrapper ref={refModal} />
			{/* 엑셀 파일 업로드 INPUT 영역 */}
			<input
				ref={excelUploadFileRef}
				id="excelUploadInput"
				type="file"
				onChange={onFileChange}
				onClick={(e: any) => {
					e.target.value = null;
				}}
				style={{ display: 'none' }}
			/>
		</>
	);
});

export default StTplReceiptReqUploadExcelPopup;
