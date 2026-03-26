/*
 ############################################################################
 # FiledataField	: MsExdcRateUploadExcelPopup.tsx
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

// utils
import { showAlert } from '@/util/MessageUtil';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// API
import { apiPostExcelUpload } from '@/api/cm/apiCmExcel';
import { apiPostExcelUploadTmEntity, apiSaveTmEntityExcel } from '@/api/tm/apiTmEntityRule';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import fileUtil from '@/util/fileUtils';
import dayjs from 'dayjs';
interface PropsType {
	close?: any;
	save?: any;
	gridCol?: any;
	gridProps?: any;
	setSepecCodeDetail?: any;
	callBack?: any;
}

const TmentityRuleExcelUpload = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;
	const refModal = useRef(null);
	const excelUploadFileRef = useRef(null);
	// 다국어
	const { t } = useTranslation();

	const gridRef1 = useRef(null);
	const [avgChk, setAvgChk] = useState(false);
	const [gridData, setGridData] = useState([]);
	const getTmcaclItmeCommonCodeList = () => {
		const list = getCommonCodeList('TM_CALC_ITEM');

		return list.filter(item => item.data1 === 'P' && item.data3 === 'Y');
		// return list;
	};
	const getTmcaclItmeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('TM_CALC_ITEM', value)?.cdNm;

		// return list;
	};
	const getCustOrderCloseTypeCommonCodeList = () => {
		// ////console.log((getCommonCodeList('CUSTORDERCLOSETYPE', ''));
		//추후 공통 코드 추가 후 변경 예정(data1)
		return getCommonCodeList('VIHICLE_TYPE_CD');
	};
	const getCustOrderCloseTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('VIHICLE_TYPE_CD', value)?.cdNm;

		// return list;
	};
	const getCarCapCityTypeCommonCodeList = () => {
		return getCommonCodeList('CARCAPACITY', '공통', '');
	};
	const getCarCapCityTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		// return getCommonCodebyCd('CARCAPACITY', value)?.cdNm;
		const list = getCommonCodeList('CARCAPACITY', '공통', null);
		const convert = list.map(item => ({
			...item,
			// display: item.comCd && item.comCd !== 'STD' ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
		}));
		////console.log((convert);
		let result = null;
		if (!commUtil.isEmpty(convert)) {
			result = convert.find((el: any) => {
				if (el.comCd === value) {
					return el;
				}
			});
		}
		return result ? result.cdNm : null;

		// return list;
	};
	const getContractTypeCommonCodeList = () => {
		return getCommonCodeList('CONTRACTTYPE');
	};
	const getContractTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;

		// return list;
	};
	/**
	 * 공통 코드 호출([comCd]cdNm)
	 * @param owIndex
	 * @param columnIndex
	 * @param value
	 * @returns
	 */
	const getCustomCommonCodeList = (owIndex: any, columnIndex: any, value: any) => {
		const list = getCommonCodeList('WMS_MNG_DC');
		const convert = list.map(item => ({
			...item,
			display: item.comCd && item.comCd !== 'STD' ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
		}));
		let result = null;
		if (!commUtil.isEmpty(convert)) {
			result = convert.find((el: any) => {
				if (el.comCd === value) {
					return el;
				}
			});
		}
		return result ? result.display : null;
	};
	/**
	 * 엑셀 업로드 파일 변경 이벤트
	 * @param {object} e 이벤트
	 * @returns {void}
	 */
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		//console.log((e);
		//console.log((gridBtn.tGridRef);
		// excelImport(e, 0, gridBtn.tGridRef, 1, onDataCheckClick);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, onDataCheckClick);
	};
	/**
	 * 엑셀 양식 다운로드
	 * 로케이션 일괄업로드만 공통 기능을 사용하지 않고 버튼으로 추가(별도양식)
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: '운송단가관리 양식.xlsx',
		};

		fileUtil.downloadFile(params);
	};
	const onDataCheckClick = () => {
		// 변경 데이터 확인
		// const gpsList = gridRef1.current.getChangedData({ validationYn: false });
		const gpsList = gridRef1.current.getGridData();
		if (!gpsList || gpsList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
				return;
			});
		} else if (gpsList.length > 0 && !gridRef1.current.validateRequiredGridData()) {
			return;
		} else {
			const params = {
				// processType: 'SPMS_CUSTDLVINFO_EXLCHK',
				saveList: gpsList,
			};
			gridRef1.current.clearGridData();
			apiPostExcelUploadTmEntity(params).then((res: any) => {
				// gridRef.current.addRow(res.data);
				//console.log((res.data);
				// setGridData(res.data);
				// gridRef1.current?.addRow(res.data);
				const newData = (Array.isArray(res.data) ? res.data : [res.data]).map(item => ({
					...item,
					rowStatus: item.errYn === 'N' ? 'I' : '',
					// customRowCheckYn: 'N',
				}));

				gridRef1.current.addRow(newData);
				setGridData(newData);

				// gridRef1.current?.addUncheckedRowsByValue('errYn', 'Y');
				// gridRef1.current?.addCheckedRowsByValue('errYn', 'N');
				// setAvgChk(true);
			});
		}
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
		//console.log((target);
		const file = target.files[0];
		//console.log((file);

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
			//console.log((columnLayout);
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
			//console.log((columnInfoList);
			const jsonData = { startRow: depth, columnNames: columnKeyList };
			const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
			const formData = new FormData();
			formData.append('file', file);
			formData.append('params', jsonBlob);
			//console.log((jsonBlob);
			const params = formData;
			//console.log((params);
			for (const pair of params.entries()) {
				//console.log((pair[0], pair[1]);
			}
			gridRef?.current?.clearGridData();
			apiPostExcelUpload(params).then((res: any) => {
				if (res.statusCode == 0) {
					gridRef.current?.addRow(res.data.rowsData);
					//console.log((res.data);
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
	const uploadSave = () => {
		const codeDtl = gridRef1.current.getCheckedRowItemsAll();
		//console.log((codeDtl);
		const saveList1 = codeDtl.filter(item => item.rowStatus === 'I' && item.errYn === 'N');
		const rowsToUse = (codeDtl || []).filter((r: any) => r?.rowStatus === 'I' && r?.valFlag === 'Y' && r.errYn === 'N');
		//console.log((saveList1);
		if (saveList1.length == 0) {
			showAlert('', '데이터가 없습니다.');
			return;
		}
		if (rowsToUse.length > 0) {
			showConfirm(
				'',
				'동일한 내용의 행이 이미 존재합니다. 기존 행의 기간을 수정 하시겠습니까?',
				() => {
					let insertCount = 0;
					const updateCount = 0;
					let deleteCount = 0;

					saveList1?.forEach((item: any) => {
						switch (item.rowStatus) {
							case 'I':
								insertCount++;
								break;
							case 'U':
								insertCount++;
								break;
							case 'D':
								deleteCount++;
								break;
						}
					});

					const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${insertCount}건
				수정 : ${updateCount}건
				삭제 : ${deleteCount}건`;
					showConfirm(
						null,
						messageWithRowStatusCount,
						() => {
							const saveList = { saveList: saveList1 };
							apiSaveTmEntityExcel(saveList)
								.then(res => {
									if (res.statusCode === 0) {
										gridRef1.current.clearGridData();
										props.close?.();
										props.callBack?.();
										showAlert('저장', '저장되었습니다.');
									} else {
										return false;
									}
								})
								.catch(() => false);
						},
						() => {
							return;
						},
					);
				},
				() => {
					return;
				},
			);
		} else {
			let insertCount = 0;
			const updateCount = 0;
			let deleteCount = 0;

			saveList1?.forEach((item: any) => {
				switch (item.rowStatus) {
					case 'I':
						insertCount++;
						break;
					case 'U':
						insertCount++;
						break;
					case 'D':
						deleteCount++;
						break;
				}
			});

			const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${insertCount}건
				수정 : ${updateCount}건
				삭제 : ${deleteCount}건`;
			showConfirm(
				null,
				messageWithRowStatusCount,
				() => {
					const saveList = { saveList: saveList1 };
					apiSaveTmEntityExcel(saveList)
						.then(res => {
							if (res.statusCode === 0) {
								gridRef1.current.clearGridData();
								props.close?.();
								props.callBack?.();
								showAlert('저장', '저장되었습니다.');
							} else {
								return false;
							}
						})
						.catch(() => false);
				},
				() => {
					return;
				},
			);
		}

		// //console.log((saveList);
	};
	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'excelForm',
			// },
			{
				btnType: 'excelSelect', // 엑셀선택
				isActionEvent: false,
				callBackFn: () => {
					onClickUploadExcel();
				},
			},
			// {
			// 	btnType: 'excelDownload', // 엑셀다운로드
			// },
			{
				btnType: 'save',
				callBackFn: () => {
					uploadSave();
				},
			},
		],
	};

	const extendedGridCol = [
		// {
		// 	dataField: 'customRowCheckYn',
		// 	headerText: 'customRowCheckYn',
		// 	visible: false,
		// },

		{
			dataField: 'dcCode',
			headerText: '물류센터',
			required: true,
			editable: false,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			dataType: 'code',
			labelFunction: getCustomCommonCodeList,
		},
		{
			dataField: 'courierNm',
			headerText: '운송사',
			editable: true,
			required: true,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			dataType: 'code',
			commRenderer: {
				type: 'search',
				popupType: 'carrier',
				searchDropdownProps: {
					dataFieldMap: {
						courier: 'code',
						courierNm: 'name',
					},
				},
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					////console.log((e);
					if (e.item.rowStatus !== 'I') return;
					// 예: custcd 컬럼에서 팝업 열기
					refModal.current.open({
						gridRef: gridRef1,
						rowIndex,
						dataFieldMap: {
							courier: 'code',
							courierNm: 'name',
						},
						popupType: 'carrier',
					});
				},
			},
			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
				// ////console.log((item);
				return item.courierNm ?? value;
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				// //console.log(item.rowStatus);
				if (item?.rowStatus === 'I') {
					// 편집 가능 class 삭제
					return 'isEdit';
				} else {
					// 편집 가능 class 추가
					// //console.log(item);
					gridRef1.current.removeEditClass(columnIndex);
				}
			},
			// },
		},
		{
			dataField: 'sttlItemCd',
			headerText: '관리항목',
			dataType: 'code',
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			labelFunction: getTmcaclItmeCommonCode,
			editable: true,
			required: true,
			mergePolicy: 'restrict',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef1.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			// editRenderer: {
			// 	type: 'DropDownListRenderer',
			// 	list: getTmcaclItmeCommonCodeList(),
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex, columnIndex, value, item) {
					if (item?.rowStatus === 'I') {
						return {
							type: 'DropDownListRenderer',
							list: getTmcaclItmeCommonCodeList(),
							keyField: 'comCd', // key 에 해당되는 필드명
							valueField: 'cdNm',
						};
					}
					return { type: 'InputEditRenderer' };
				},
			},
		},

		{
			dataField: 'contractType',
			headerText: '계약유형',
			dataType: 'code',
			required: true,
			editable: true,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			mergePolicy: 'restrict',
			labelFunction: getContractTypeCommonCode,
			// editRenderer: {
			// 	// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
			// 	type: 'DropDownListRenderer',
			// 	list: getContractTypeCommonCodeList(),
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex, columnIndex, value, item) {
					if (item?.rowStatus === 'I') {
						return {
							type: 'DropDownListRenderer',
							// list: getContractTypeCommonCodeList(),
							listFunction: function (rowIndex, columnIndex, item, dataField) {
								if (item.sttlItemCd === 'P01')
									// 상위 단계(부모)의 값이 1이라면....
									return getContractTypeCommonCodeList().filter(
										item => item.comCd !== 'FIXTEMPORARY' && item.comCd !== 'TEMPORARY',
									);
								// myGroupLevel1 은 미리 정의된 배열임
								// 상위 단계(부모)의 값이 2라면....
								else return getContractTypeCommonCodeList(); // myGroupLevel1 은 미리 정의된 배열임
								// return ['1', '2', '3']; // 기본 리스트
							},
							keyField: 'comCd', // key 에 해당되는 필드명
							valueField: 'cdNm',
						};
					}
					return { type: 'InputEditRenderer' };
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef1.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		// { dataField: 'courier', headerText: '운송사코드', dataType: 'string', editable: true },

		{
			dataField: 'ton',
			headerText: '톤수',
			dataType: 'code',
			editable: true,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			mergePolicy: 'restrict',
			// required: true,
			labelFunction: getCarCapCityTypeCommonCode,
			// editRenderer: {
			// 	type: 'DropDownListRenderer',
			// 	list: getCarCapCityTypeCommonCodeList(),
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex, columnIndex, value, item) {
					if (item?.rowStatus === 'I') {
						return {
							type: 'DropDownListRenderer',
							list: getCarCapCityTypeCommonCodeList(),
							keyField: 'comCd', // key 에 해당되는 필드명
							valueField: 'cdNm',
						};
					}
					return { type: 'InputEditRenderer' };
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef1.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'closeType',
			headerText: '마감유형',
			required: true,
			dataType: 'code',
			editable: true,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			mergePolicy: 'restrict',
			labelFunction: getCustOrderCloseTypeCommonCode,
			// editRenderer: {
			// 	// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
			// 	type: 'DropDownListRenderer',
			// 	list: getCustOrderCloseTypeCommonCodeList(),
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex, columnIndex, value, item) {
					// //console.log(('---', item);
					if (item?.rowStatus === 'I') {
						return {
							type: 'DropDownListRenderer',
							list: getCustOrderCloseTypeCommonCodeList(),
							keyField: 'comCd', // key 에 해당되는 필드명
							valueField: 'cdNm',
						};
					}
					return { type: 'InputEditRenderer' };
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef1.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'base',
			headerText: '기준',
			dataType: 'string',
			editable: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item?.rowStatus === 'I') {
					// 편집 가능 class 삭제
					return 'isEdit';
				} else {
					// 편집 가능 class 추가
					// //console.log(item);
					gridRef1.current.removeEditClass(columnIndex);
				}
			},
		},

		{
			dataField: 'amount',
			headerText: '금액',
			dataType: 'numeric',
			editable: true,
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true, // 0~9만 입력
				allowPoint: false, // 소수점 금지
				allowNegative: false, // 음수 금지
				formatString: '#,##0',
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef1.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},

		{
			dataField: 'caclTypeData',
			headerText: '적용주기',
			dataType: 'code',
			labelFunction: (
				rowIndex: number,
				colIndex: number,
				value: any,
				headerText: string,
				item: { sttlItemCd?: string },
			) => {
				const sttlItemCd = item?.sttlItemCd;
				////console.log(();
				return getCommonCodebyCd('TM_CALC_ITEM', sttlItemCd)?.data2;
			},
			editable: false,
		},
		{
			dataField: 'fromDate',
			headerText: '시작일자',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			// dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			required: true,
			// width: 120,
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef1.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'toDate',
			// required: true,
			headerText: '종료일자',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			// width: 200,
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef1.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			// labelFnction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2`-`$3');
			// },
		},
		{
			dataField: 'rmk',
			headerText: '비고',
			dataType: 'string',
			editable: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef1.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'errMsg',
			headerText: '에러메시지',
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'errYn',
			headerText: '에러코드',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'valFlag',
			headerText: '에러코드',
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'code',
			headerText: 'code',
			visible: false,
		},
		{
			dataField: 'courier',
			headerText: 'courier',
			visible: false,
		},
	];
	const gridProps = {
		editable: true,
		enableAutoColumnLayout: false, // 컬럼 자동 생성/정렬 방지
		// showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// enableAutoColumnLayout: false, // 컬럼 자동 생성/정렬 방지
		showRowCheckColumn: true,
		// rowIdField: '_$uid',
		// isLegacyRemove: true,
	};
	useEffect(() => {
		const gridRefCur = gridRef1.current;
		gridRef1.current.bind('cellDoubleClick', (e: any) => {
			// if (e.dataField === 'courierNm') {
			// 	// 상품코드 셀 더블클릭하면 상품상세팝업 표시
			// 	const rowIndex = e.rowIndex;
			// 	////console.log((e);
			// 	if (e.item.rowStatus !== 'I') return;
			// 	// 예: custcd 컬럼에서 팝업 열기
			// 	refModal.current.open({
			// 		gridRef: gridRef1,
			// 		rowIndex,
			// 		dataFieldMap: {
			// 			courier: 'code',
			// 			courierNm: 'name',
			// 		},
			// 		popupType: 'carrier',
			// 	});
			// }
		});
		gridRefCur.bind('cellEditBegin', (e: any) => {
			////console.log((e);
			const data = e.item;
			const name = e.dataField;
			if ((name === 'toDate' || name === 'fromDate') && data.errYn === 'N') {
				return true;
			} else {
				if (data.rowStatus !== 'I') {
					return false;
				}
			}
		});
		gridRefCur.bind('cellEditEnd', (event: any) => {
			// 해당 행 전체 데이터
			const row = event.item; // 또는 event.row depending on your grid version
			let fromDt = row.fromDate;
			let toDt = row.toDate;
			////console.log((event);
			// 현재 셀 편집 중 변경된 값 반영
			if (event.dataField === 'fromDate' || event.dataField === 'toDate') {
				if (event.dataField === 'fromDate') {
					fromDt = event.value; // 새로 입력된 from값
				} else if (event.dataField === 'toDate') {
					toDt = event.value; // 새로 입력된 to값
				}

				// dayjs 등 날짜 객체로 변환하여 비교
				if (fromDt && toDt) {
					const fromDay = dayjs(fromDt);
					const toDay = dayjs(toDt);

					if (fromDay.isAfter(toDay)) {
						showAlert('날짜 오류', '시작일(from)이 종료일(to)보다 늦을 수 없습니다.');
						const dataField = event.dataField;
						gridRefCur.setCellValue(event.rowIndex, dataField, event.oldValue);
						return false;
					}
				}
			}
			if (event.dataField === 'sttlItemCd' || event.dataField === 'contractType') {
				if (row.sttlItemCd === 'P01') {
					if (row.contractType === 'FIXTEMPORARY' || row.contractType === 'TEMPORARY' || row.contractType === 'SELF') {
						showAlert(
							'계약유형 오류',
							'관리항목이 운송료인 경우 계약유형은 "임시용차/실비용차/고객자차"를 선택할 수 없습니다.',
						);
						const dataField = event.dataField;
						gridRefCur.setCellValue(event.rowIndex, dataField, event.oldValue);
						return false;
					}
				}
			}
			if (event.dataField === 'courierNm') {
			}
		});
	}, []);
	useEffect(() => {
		//console.log(('gridData', gridData);
		// const codeDtl = gridRef1.current.getGridData();
		const errList = gridRef1.current.getGridData().filter(item => item.errYn === 'Y');

		// gridRef1.current.addUncheckedRowsByValue('errYn', 'Y');
		// const errList = gridData.filter(item => {
		// 	return item.errYn === 'Y';
		// });
		//setTime
		for (const e of errList) {
			//console.log((e._$uid);
			gridRef1.current.addUncheckedRowsByValue('_$uid', e._$uid);
		}
		const colSizeList = gridRef1.current?.getFitColumnSizeList(true);
		gridRef1.current.setColumnSizeList(colSizeList);
	}, [gridData]);
	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="운송비마스터 엑셀 업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '}>
					<Button onClick={onExcelDownload}>양식다운로드</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef1} columnLayout={extendedGridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
			</ButtonWrap>
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
};

export default TmentityRuleExcelUpload;
