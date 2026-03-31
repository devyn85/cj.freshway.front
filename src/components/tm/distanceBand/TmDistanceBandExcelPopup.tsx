/*
 ############################################################################
 # FiledataField	: TmDistanceBandExcelPopup.tsx
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
import { apiGetExcelUpload, apiSaveList } from '@/api/tm/apiTmDistanceBand';
// import {  } from '@/api/tm/apiTmEntityRule';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import fileUtil from '@/util/fileUtils';
import dayjs from 'dayjs';
interface PropsType {
	close?: any;
	dcCode: any;
	fnCallBack: any;
}

const TmDistanceBandExcelPopup = forwardRef((props: PropsType, ref: any) => {
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

	// const prevRowRange: any = null;
	//공통 코드 호출
	const getTmcaclItmeCommonCodeList = () => {
		const list = getCommonCodeList('TM_CALC_ITEM', '공통', 'P00');

		return list.filter(item => item.data1 === 'P');
		// return list;
	};
	const getCarCapCityTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CARCAPACITY', value)?.cdNm;
	};
	const getContractTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;
	};
	const getCustOrderCloseTypeCommonCodeList = () => {
		// //console.log(getCommonCodeList('CUSTORDERCLOSETYPE', ''));
		//추후 공통 코드 추가 후 변경 예정(data1)
		return getCommonCodeList('VIHICLE_TYPE_CD');
	};
	const getCarCapCityTypeCommonCodeList = () => {
		return getCommonCodeList('CARCAPACITY');
	};
	const getContractTypeCommonCodeList = () => {
		return getCommonCodeList('CONTRACTTYPE').filter(
			item => item.comCd == 'FIXTEMPORARY' || item.comCd === 'TEMPORARY' || item.comCd === 'FIX',
		);
	};
	//물류센터 공통코드 호출
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
	const gridProps = {
		editable: false,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		enableMovingColumn: false,
		enableAutoColumnLayout: false, // 컬럼 자동 생성/정렬 방지
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
		// //console.log(e);
		// //console.log(gridBtn.tGridRef);
		// excelImport(e, 0, gridBtn.tGridRef, 1);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, onDataCheckClick);
	};
	/**
	 * 엑셀 양식 다운로드
	 * 로케이션 일괄업로드만 공통 기능을 사용하지 않고 버튼으로 추가(별도양식)
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: '센터별구간관리 양식.xlsx',
		};

		fileUtil.downloadFile(params);
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
		// //console.log(props.custKey);
		const params = {
			// processType: 'SPMS_CUSTDLVINFO_EXLCHK',
			saveList: saveList,

			dcCode: props.dcCode,
		};
		// const params = new FormData(); // 파일 전송할 form
		// params.append('dto', saveList);
		// // params.append('saveList' gpsList)
		// params.append('tplBcnrId', props.tplBcnrId);
		// params.append('fromCustKey', props.fromCustKey);
		// params.append('custKey', props.custKey);
		// params.append('dcCode', '2170');

		gridRef.current.clearGridData();
		apiGetExcelUpload(params).then((res: any) => {
			// gridRef.current.addRow(res.data);
			const newData = (Array.isArray(res.data) ? res.data : [res.data]).map(item => ({
				...item,
				customRowCheckYn: 'N',
				rowStatus: item.errYn === 'N' ? 'I' : '',
			}));
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

		const codeDtl = (codeDtl1 || []).filter((r: any) => r?.rowStatus === 'I');
		const rowsToUse = (codeDtl || []).filter((r: any) => r?.rowStatus === 'I' && r?.valFlag === 'Y');
		// 수정:

		if (!codeDtl || codeDtl.length < 1) {
			gridRef.current.showConfirmSave(() => {
				return;
			});
		} else if (codeDtl.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		} else {
			if (rowsToUse.length > 0) {
				showConfirm(
					null,
					'동일한 내용의 행이 이미 존재 합니다. 기존 행의 기간을 수정 하시겠습니까?',
					() => {
						showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
							const saveList = {
								saveList: codeDtl,
							};

							//console.log((saveList);
							apiSaveList(saveList)
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
					},
					() => {
						return false;
					},
				);
			} else {
				showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
					const saveList = {
						saveList: codeDtl,
					};

					//console.log((saveList);
					apiSaveList(saveList)
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
		}
	};
	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
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
			{
				btnType: 'save',
				callBackFn: saveMaster,
			},
		],
	};
	// 기존 gridCol에 에러 컬럼 추가
	const gridCol = [
		{
			dataField: 'dcCode',
			headerText: '물류센터',
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			editable: false,
			dataType: 'code',
			labelFunction: getCustomCommonCodeList,
		},

		{
			dataField: 'courierNm',
			headerText: '운송사',
			editable: true,
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
					//console.log((e);
					if (e.item.rowStatus !== 'I') return;
					// 예: custcd 컬럼에서 팝업 열기
					refModal.current.open({
						gridRef: gridRef,
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
				// //console.log((item);
				return item.courierNm ?? value;
			},
		},
		{
			dataField: 'contractType',
			headerText: '계약유형',
			dataType: 'code',
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			required: true,
			mergePolicy: 'restrict',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			editRenderer: {
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				list: getContractTypeCommonCodeList(),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			editable: true,
			labelFunction: getContractTypeCommonCode,
		},
		{
			dataField: 'base',
			headerText: '구간',
			dataType: 'code',
			required: true,
			editable: true,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			merge: true, // 머지금지(머지되면 편집막힘)
			mergePolicy: 'restrict',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			editRenderer: {
				type: 'InputEditRenderer',
				// onlyNumeric: true,
				allowPoint: false, // 소수점 입력 불가
				allowNegative: false, // 음수 입력 불가
				maxlength: 2,
				regExp: '^(?:[1-9]\\d?)$',
			},
		},

		{
			dataField: 'ton',
			headerText: '톤수',
			dataType: 'code',
			editable: true,
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			editRenderer: {
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				list: getCarCapCityTypeCommonCodeList(),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: getCarCapCityTypeCommonCode,
		},

		{
			dataField: 'amount',
			headerText: '단가',
			dataType: 'numeric',
			editable: true,
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true, // 0~9만 입력
				allowPoint: false, // 소수점 금지
				allowNegative: false, // 음수 금지
				formatString: '#,##0',
			},
		},
		// { dataField: 'rmk', headerText: '비고', dataType: 'string', editable: true },
		{
			dataField: 'fromDate',
			headerText: '시작일자',
			dataType: 'date',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			required: true,
			formatString: 'yyyy-mm-dd',
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
		},
		{
			dataField: 'toDate',
			// required: true,
			headerText: '종료일자',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			// labelFnction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
			// },
		},
		{
			dataField: 'errYn',
			headerText: '에러코드',
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			editable: false,
			dataType: 'code',
			// labelFunction: getCustomCommonCodeList,
		},
		{
			dataField: 'errMsg',
			headerText: '에러메시지',
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			editable: false,
			dataType: 'code',
			// labelFunction: getCustomCommonCodeList,
		},
		{
			dataField: 'valFlag',
			headerText: 'valFlag',
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			editable: false,
			visible: false,
			dataType: 'code',
			// labelFunction: getCustomCommonCodeList,
		},
		{
			dataField: 'courier',
			headerText: '운송사',
			// required: true,
			editable: false,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			visible: false,
			dataType: 'code',
		},

		// {
		// 	dataField: 'addWho',
		// 	headerText: '등록자',
		// 	width: 90,
		// 	dataType: 'manager',
		// 	managerDataField: 'addWhoId',
		// 	editable: false,
		// },
		// { dataField: 'addDate', headerText: '등록일시', dataType: 'code', editable: false },
		// {
		// 	dataField: 'editWho',
		// 	headerText: '수정자',
		// 	width: 90,
		// 	dataType: 'manager',
		// 	managerDataField: 'editWhoId',
		// 	editable: false,
		// },
		// { dataField: 'editDate', headerText: '수정일시', dataType: 'code', editable: false },

		// { dataField: 'rowStatus', headerText: '행 상태', dataType: 'string', editable: true },
	];

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		const gridRefCur = gridRef.current;
		// const gridRefCur1 = ref.gridRef1.current;
		// ref.gridRef.current.bind('cellDoubleClick', (e: any) => {
		// 	if (e.dataField === 'courierNm') {
		// 		// 상품코드 셀 더블클릭하면 상품상세팝업 표시
		// 		const rowIndex = e.rowIndex;
		// 		//console.log((e);
		// 		if (e.item.rowStatus !== 'I') return;
		// 		// 예: custcd 컬럼에서 팝업 열기
		// 		// refModal.current.open({
		// 		// 	gridRef: ref.gridRef,
		// 		// 	rowIndex,
		// 		// 	dataFieldMap: {
		// 		// 		courier: 'code',
		// 		// 		courierNm: 'name',
		// 		// 	},
		// 		// 	popupType: 'carrier',
		// 		// });
		// 	}
		// });
		gridRefCur.bind('cellEditBegin', function (event: any) {
			// '회사', '코드리스트' 신규행만 수정 가능

			if (event.item.rowStatus !== 'I') {
				if (event.dataField === 'fromDate' || event.dataField === 'toDate') {
					return true;
				} else {
					return false;
				}
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});
		gridRefCur.bind('cellEditEnd', (event: any) => {
			// 해당 행 전체 데이터
			const row = event.item; // 또는 event.row depending on your grid version
			let fromDt = row.fromDate;
			let toDt = row.toDate;

			// 현재 셀 편집 중 변경된 값 반영
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
		});
		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */

		// gridRefCur.bind('selectionChange', (event: any) => {
		// 	//console.log(event);

		// 	if (event.primeCell.item.rowStatus === 'I') {
		// 		ref.gridRef1.current.clearGridData();
		// 		prevRowIndex = null;
		// 		prevRowCou = null;

		// 		return;
		// 	}
		// 	if (event.primeCell.item.base === prevRowIndex && event.primeCell.item.courier === prevRowCou) {
		// 		return;
		// 	}

		// 	prevRowIndex = event.primeCell.item.base;
		// 	prevRowCou = event.primeCell.item.courier;
		// 	//console.log(prevRowIndex, prevRowCou);
		// 	// //console.log(prevRowIndex);
		// 	const selectRow = event.primeCell.item;
		// 	props.searchDtl(selectRow);
		// });
	}, []);
	useEffect(() => {
		const errList = gridRef.current.getGridData().filter(item => item.errYn === 'Y');
		const uncheckedIds = errList.map((item: any) => item._$uid);
		gridRef.current.addUncheckedRowsByIdsBefore(uncheckedIds);
		// gridRef.current?.addUncheckedRowsByValue('errYn', 'Y');
		if (gridData.length > 0) {
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			gridRef.current.setColumnSizeList(colSizeList);

			// gridRefCur.setColumnPropByDataField('courierNm', { width: colSizeList[3] + 20 });
			// gridRefCur.setColumnPropByDataField('amount', { width: 91 });
			// gridRefCur.setColumnPropByDataField('ton', { width: 68 });
			// gridRefCur.setColumnPropByDataField('toDate', { width: 108 });
			// gridRefCur.setColumnPropByDataField('addDate', { width: 180 });
			// gridRefCur.setColumnPropByDataField('editDate', { width: 180 });
			// gridRefCur.setColumnPropByDataField('fromDate', { width: 108 });

			// props.searchDtl(selectRow);
		}
	}, [gridData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="센터별구간설정엑셀업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '}>
					<Button onClick={onExcelDownload}>양식다운로드</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
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
});

export default TmDistanceBandExcelPopup;
