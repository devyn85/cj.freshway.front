/*
 ############################################################################
 # FiledataField	: TmAmountDailyExcelPopup.tsx
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
// import { apiGetExcelUpload, apiSaveExcel as apiSaveMasterList } from '@/api/tm/apiTmDistanceBand';
import { apiGetCarInfo, apiSaveMasterList, apiGetExcelValChk as getExcelValChkv } from '@/api/tm/apiTmAmountDaily';
import { apiGetMasterList } from '@/api/tm/apiTmManageEntity';
// import {  } from '@/api/tm/apiTmEntityRule';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import { getCommonCodebyCd, getCommonCodeList, getCommonCodeListByData } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import fileUtil from '@/util/fileUtils';
import { isEmpty } from 'lodash';
interface PropsType {
	close?: any;
	dcCode: any;
	fnCallBack: any;
	// codeList: any;
	save?: any;
}

const TmAmountDailyExcelPopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;
	const refModal = useRef(null);
	const refModal1 = useRef(null);
	// 다국어
	const { t } = useTranslation();
	const gridRef = useRef(null);
	// const gridRef = useRef(null);
	const [avgChk, setAvgChk] = useState(false);
	const [gridData, setGridData] = useState([]);
	const excelUploadFileRef = useRef(null);
	const refSttlItemList = useRef([]);

	const user = useAppSelector(state => state.user.userInfo);

	const carcapacityLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CARCAPACITY', value)?.cdNm;
	};
	// 계약유형 코드 조회
	const contracttypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;
	};
	const carOrderLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CAR_ORDERCLOSE', value)?.cdNm;
	};
	const getTmcaclItmeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('TM_CALC_ITEM', value)?.cdNm;

		// return list;
	};
	const sttlItemCdFunc = () => {
		// data1이 'D' 또는 'P'인 항목만 필터링
		const D = getCommonCodeListByData('TM_CALC_ITEM', 'D', null, null, null);
		const P = getCommonCodeListByData('TM_CALC_ITEM', 'P', null, null, null);
		return [...D, ...P];
	};

	//물류센터 공통코드 호출
	const getCustomCommonCodeList = (owIndex: any, columnIndex: any, value: any) => {
		const list = getCommonCodeList('WMS_MNG_DC');
		const convert = list.map(item => ({
			...item,
			display: item?.comCd && item?.comCd !== 'STD' ? `[${item?.comCd}] ${item?.cdNm}` : item?.cdNm,
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
		editable: true,
		showRowCheckColumn: true,
		// showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
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
	/**
	 * 엑셀 양식 다운로드
	 * 로케이션 일괄업로드만 공통 기능을 사용하지 않고 버튼으로 추가(별도양식)
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: '기타비용관리 양식.xlsx',
		};

		fileUtil.downloadFile(params);
	};
	/**
	 * 엑셀 업로드 파일 변경 이벤트
	 * @param {object} e 이벤트
	 * @returns {void}
	 */
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// //console.log((e);
		// //console.log((gridBtn.tGridRef);
		// excelImport(e, 0, gridBtn.tGridRef, 1);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, onDataCheckClick);
	};

	/**
	 * 유효성 검증
	 * @returns {void}
	 */
	const onDataCheckClick = () => {
		// 변경 데이터 확인
		const saveList = gridRef.current.getGridData();
		//console.log((saveList);
		// if (!gpsList || gpsList.length < 1) {
		// 	// showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
		// 	// 	return;
		// 	// });
		// } else if (gpsList.length > 0 && !gridRef.current.validateRequiredGridData()) {
		// 	return;
		// } else {
		// //console.log((props.custKey);
		const params = {
			// processType: 'SPMS_CUSTDLVINFO_EXLCHK',
			saveList: saveList,

			fixdccode: props.dcCode,
		};
		// const params = new FormData(); // 파일 전송할 form
		// params.append('dto', saveList);
		// // params.append('saveList' gpsList)
		// params.append('tplBcnrId', props.tplBcnrId);
		// params.append('fromCustKey', props.fromCustKey);
		// params.append('custKey', props.custKey);
		// params.append('dcCode', '2170');

		gridRef.current.clearGridData();
		getExcelValChkv(params).then((res: any) => {
			// gridRef.current.addRow(res.data);
			const newData = (Array.isArray(res.data) ? res.data : [res.data]).map(item => ({
				...item,
				// customRowCheckYn: item.errYn === 'Y' ? 'N' : 'Y',
				rowStatus: item.errYn === 'N' ? 'I' : '',
			}));
			gridRef.current?.addRow(newData);
			setGridData(newData);

			// //console.log((gridRef.current.get());
			// gridRef.current?.addUncheckedRowsByValue('uploadFlag', 'E');
			// setAvgChk(true);
		});
	};

	const saveMaster = () => {
		const codeDtl = gridRef.current.getCheckedRowItemsAll();
		////console.log((codeDtl);
		const saveList1 = codeDtl.filter(item => item.rowStatus === 'I' && item.errYn === 'N');
		const rowsToUse = (codeDtl || []).filter((r: any) => r?.rowStatus === 'I' && r?.valFlag === 'Y' && r.errYn === 'N');
		////console.log((saveList1);
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
							apiSaveMasterList(saveList)
								.then(res => {
									if (res.statusCode === 0) {
										gridRef.current.clearGridData();
										props.close?.();
										props.fnCallBack?.();
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
					apiSaveMasterList(saveList)
						.then(res => {
							if (res.statusCode === 0) {
								gridRef.current.clearGridData();
								props.close?.();
								props.fnCallBack?.();
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
	};
	const getSttlItemList = () => {
		//console.log((1);
		const selectRow = gridRef.current.getSelectedIndex()[0];
		const courier = gridRef.current.getCellValue(selectRow, 'courier');
		const dcCode = gridRef.current.getCellValue(selectRow, 'dccode');
		//console.log((courier);
		apiGetMasterList({ dcCode: dcCode, courier: courier }).then(res => {
			if (res.data.length > 0) {
				//console.log((1);
				const matched = sttlItemCdFunc().filter(item2 => res.data.some(item1 => item1.sttlItemCd === item2.comCd));
				//console.log((matched);
				refSttlItemList.current = matched;
			} else {
				refSttlItemList.current = null;
			}
		});
		// const list = apiGetMasterList({ dcCode: dcCode, courier: courier }).then(res => res.data);
		// //console.log((Array.isArray(list));
		// refSttlItemList.current = sttlItemCdFunc().filter(item2 => list.some(item1 => item1.sttlItemCd === item2.comCd));
	};

	const setCarInfo = (item: any) => {
		const selectRow = gridRef.current.getSelectedIndex()[0];
		const currentCourier = gridRef.current.getCellValue(selectRow, 'courier');
		const currentCourierNm = gridRef.current.getCellValue(selectRow, 'couriername');
		const fromdate = gridRef.current.getCellValue(selectRow, 'fromdate');
		//console.log((item);
		apiGetCarInfo({ carno: item?.carno, sttlitemcd: item?.sttlItemCd, courier: item?.courier, fromdt: fromdate })
			.then((res: any) => {
				// 수정할 값 구성
				//console.log((res.data);
				const item = res.data[0];
				//console.log((item?.couriername);
				// if (item?.contracttype === 'TEMPORARY') {
				// 	showAlert('', '해당 차량은 실비차 입니다.');
				// 	return;
				// }
				// const selectRow = gridRef.current.getSelectedIndex()[0];

				// //console.log((currentCourier);
				const updatedRow = {
					// ...rowItem,
					courier: currentCourier ? currentCourier : item?.courier,
					couriername: currentCourierNm ? currentCourierNm : item?.couriername,
					carcapacity: item?.carcapacity,
					carno: item?.carno,
					contracttype: item?.contracttype,
					caragentkey: item?.caragentkey,
					caragentname: item?.caragentname,
					masterAmount: item?.amount,
					other03: item?.other03,
					sttlitemcd: '',
				};

				// 해당 행에 값 업데이트
				// //console.log((updatedRow);

				gridRef.current.updateRow(updatedRow, selectRow);
				// if (currentCourier !== item?.courier) {
				// getSttlItemList();
				// }
				// 팝업 닫기
				refModal.current?.handlerClose();
			})
			.catch(error => {
				// 에러가 발생해도 팝업은 닫기
				refModal.current?.handlerClose();
			});
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
	// 그리드 컬럼 정의
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: '물류센터',
			editable: false,
			visible: true,
			dataType: 'code',
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			labelFunction: getCustomCommonCodeList,
		},
		{
			dataField: 'courier',
			headerText: '운송사',
			editable: true,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			// required: true,
			commRenderer: {
				type: 'search',
				popupType: 'carrierDrop',
				searchDropdownProps: {
					dataFieldMap: {
						courier: 'code',
						couriername: 'name',
					},
				},
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					//console.log((e);
					if (e.item.rowStatus !== 'I') return;
					// 예: custcd 컬럼에서 팝업 열기
					refModal1.current.open({
						gridRef: gridRef,
						rowIndex,
						dataFieldMap: {
							courier: 'code',
							couriername: 'name',
						},
						popupType: 'carrier',
					});
				},
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return gridRef.current.getCellValue(rowIndex, 'courier')
					? gridRef.current.getCellValue(rowIndex, 'couriername')
					: '';
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},

		{
			dataField: 'allowanceDate',
			headerText: '일자',
			dataType: 'date',
			editable: true,
			required: true,
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
				validator: function (oldValue, newValue, item, dataField, fromClipboard, which) {
					// YYYYMMDD 숫자 8자리 체크

					const isValid = /^\d{8}$/.test(newValue);

					if (!isValid) {
						return {
							validate: false,
							message: '날짜는 YYYYMMDD 형식으로 입력하세요.',
						};
					}
					return { validate: true };
				},
			},
		},
		{
			dataField: 'carno',
			headerText: '차량번호',
			editable: true,
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			commRenderer: {
				type: 'search',
				popupType: 'car',
				searchDropdownProps: {
					dataFieldMap: {
						sku: 'code',
						skuName: 'name',
					},
					callbackBeforeUpdateRow: (e: any) => {
						const selectedIndex = gridRef?.current?.getSelectedIndex();
						// getSkuSelectData(e.code, selectedIndex[0]);

						const selectedRows = gridRef?.current?.getGridData()[selectedIndex[0]];

						if (!e || e.length === 0) return;

						const selectedData = selectedRows[0];

						// 차량 상세
						apiGetCarInfo({ carno: e.code })
							.then((res: any) => {
								// 수정할 값 구성

								// if (res.data[0].contracttype === 'TEMPORARY') {
								// 	showAlert('', '해당 차량은 실비차 입니다.');
								// 	return;
								// }
								const updatedRow = {
									...selectedRows,
									// courier: !commUtil.isEmpty(rowItem.courier) ? rowItem.courier : res.data.caragentcd,
									carcapacity: res.data[0].carcapacity,
									carno: res.data[0].carno,
									courier: selectedRows.courier ? selectedRows.courier : res.data[0].courier,
									couriername: selectedRows.couriername ? selectedRows.couriername : res.data[0].couriername,
									caragentcd: res.data[0].caragentcd,
									caragentname: res.data[0].caragentname,
									contracttype: res.data[0].contracttype,
								};
								// 해당 행에 값 업데이트

								gridRef.current.updateRow(updatedRow, selectedIndex[0]);

								// 팝업 닫기
								refModal.current?.handlerClose();
							})
							.catch(error => {
								// 에러가 발생해도 팝업은 닫기
								refModal.current?.handlerClose();
							});
					},
				},
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					const rowItem = e.item;
					if (e.item.rowStatus !== 'I') return;
					refModal.current.open({
						gridRef: gridRef,
						rowIndex,
						dataFieldMap: {
							carno: 'code',
							carname: 'name',
						},
						customDccode: e.item.dccode,
						popupType: 'car',
						onConfirm: (selectedRows: any[]) => {
							if (!selectedRows || selectedRows.length === 0) return;

							const selectedData = selectedRows[0];
							// 차량 상세
							apiGetCarInfo({ carno: selectedData.code })
								.then((res: any) => {
									// 수정할 값 구성

									// if (res.data[0].contracttype === 'TEMPORARY') {
									// 	showAlert('', '해당 차량은 실비차 입니다.');
									// 	return;
									// }
									const updatedRow = {
										...rowItem,
										// courier: !commUtil.isEmpty(rowItem.courier) ? rowItem.courier : res.data.caragentcd,
										carcapacity: res.data[0].carcapacity,
										carno: res.data[0].carno,
										courier: e.item.courier ? e.item.courier : res.data[0].courier,
										couriername: e.item.couriername ? e.item.couriername : res.data[0].couriername,
										caragentcd: res.data[0].caragentcd,
										caragentname: res.data[0].caragentname,
										contracttype: res.data[0].contracttype,
									};
									// 해당 행에 값 업데이트
									gridRef.current.updateRow(updatedRow, rowIndex);

									// 팝업 닫기
									refModal.current?.handlerClose();
								})
								.catch(error => {
									// 에러가 발생해도 팝업은 닫기
									refModal.current?.handlerClose();
								});
						},
					});
				},
			},
		},

		{
			dataField: 'caragentname',
			headerText: '2차운송사명',
			dataType: 'text',
			editable: true,
			required: true,
			width: 100,
			commRenderer: {
				type: 'search',
				popupType: 'carrierDrop',
				searchDropdownProps: {
					dataFieldMap: {
						caragentcd: 'code',
						caragentname: 'name',
					},
				},
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;

					if (e.item.rowStatus !== 'I' || e.item?.contracttype !== 'TEMPORARY' || isEmpty(e.item.contracttype)) return;
					// 예: custcd 컬럼에서 팝업 열기
					refModal1.current.open({
						gridRef: gridRef,
						rowIndex,
						dataFieldMap: {
							caragentcd: 'code',
							caragentname: 'name',
						},
						popupType: 'carrier',
					});
				},
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return gridRef.current.getCellValue(rowIndex, 'caragentcd')
					? gridRef.current.getCellValue(rowIndex, 'caragentname')
					: '';
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item.rowStatus !== 'I' || item?.contracttype !== 'TEMPORARY' || isEmpty(item.contracttype)) {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},

		{
			dataField: 'contracttype',
			headerText: '계약유형',
			dataType: 'code',
			editable: false,
			width: 100,
			labelFunction: contracttypeLabelFunc,
		},
		{
			dataField: 'carcapacity',
			headerText: '톤급',
			dataType: 'code',
			editable: false,
			labelFunction: carcapacityLabelFunc,
		},
		{
			dataField: 'sttlItemCd',
			headerText: '정산항목',
			editable: true,
			dataType: 'code',
			required: true,
			labelFunction: getTmcaclItmeCommonCode,
			// renderer: {
			// 	// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
			// 	type: 'DropDownListRenderer',
			// 	list: getCommonCodeList('TM_CALC_ITEM', ''),
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex, columnIndex, value, item) {
					if (item.rowStatus === 'I') {
						return {
							type: 'DropDownListRenderer',
							list: getCommonCodeList('TM_CALC_ITEM', '').filter(item => item.data1 !== 'M'),
							keyField: 'comCd', // key 에 해당되는 필드명
							valueField: 'cdNm',
						};
					}
					return { type: 'InputEditRenderer' };
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},

		// {
		// 	dataField: 'applyType',
		// 	headerText: '적용방식',
		// 	editable: true,
		// 	renderer: {
		// 		// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
		// 		type: 'DropDownListRenderer',
		// 		list: getCommonCodeList('ADJUST_APPLY_TYPE', ''),
		// 		keyField: 'comCd', // key 에 해당되는 필드명
		// 		valueField: 'cdNm',
		// 	},
		// },
		{
			dataField: 'amount',
			headerText: '금액',
			dataType: 'numeric',
			editable: true,
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowNegative: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
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

				return getCommonCodebyCd('TM_CALC_ITEM', sttlItemCd)?.data2;
			},
			editable: false,
		},
		{
			dataField: 'rmk',
			headerText: '비고',
			editable: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				////console.log((item.rowStatus);
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'errMsg',
			headerText: '에러메시지',
			dataType: 'text',
			editable: false,
			width: 100,
		},
		{
			dataField: 'errYn',
			headerText: '에러코드',
			dataType: 'code',

			editable: false,
			width: 100,
		},
		{
			dataField: 'valChk',
			headerText: 'valChk',
			dataType: 'text',
			editable: false,
			width: 100,
			visible: false,
		},
		{
			dataField: 'serialkey',
			headerText: '시리얼키',
			editable: false,
			visible: false,
		},
		{
			dataField: 'couriername',
			headerText: '운송사',
			visible: false,
		},
		{
			dataField: 'caragentcd',
			headerText: '2차운송사',
			dataType: 'text',
			editable: false,
			width: 100,
			visible: false,
			// labelFunction: carcapacityLabelFunc,
		},
	];
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		gridRef?.current.bind('cellEditBegin', (e: any) => {
			//console.log(((e);
			const data = e.item;
			const name = e.dataField;
			//console.log((e);
			if (name === 'todate' || name === 'fromdate') {
				return true;
			} else {
				if (data.rowStatus !== 'I') {
					return false;
				}
			}
			// if (name === 'sttlItemCd') {
			// 	getSttlItemList();
			// }
		});
		gridRef?.current.bind('cellEditEnd', (event: any) => {
			const rowIndex = event.rowIndex;
			const rowItem = event.item;
			//console.log((event);
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			if (event.dataField == 'amount' || event.dataField == 'sttlItemCd') {
				const master = Number(rowItem.masterAmount);
				const amount = Number(rowItem.amount);
				const confirmAmount = Number(rowItem.confirmAmount);
				const updateRow = {
					confirmAmount: master + amount,
				};
				gridRef?.current.updateRow(updateRow, event.rowIndex);
			}

			if (event.dataField == 'sttlItemCd' || event.dataField === 'courier') {
				// 코드에서 data1을 찾는다.
				// const code = getCommonCodebyCd('TM_CALC_ITEM', rowItem.sttlItemCd);
				// const data1 = code?.data1 || '';
				// gridRef.current.setCellValue(rowIndex, 'sttlItemType', data1);
				// //console.log((event);
				setCarInfo({ carno: event.item.carno, sttlItemCd: event.item.sttlItemCd, courier: event.item.courier });
			}
		});
	}, []);
	useEffect(() => {
		// if (gridRef) {
		// const newData = (Array.isArray(props.data) ? props.data : [props.data]).map(item => ({
		// 	...item,
		// 	customRowCheckYn: 'N',
		// }));
		// // gridRefCur?.setGridData(props.data);
		// gridRef?.current.setGridData(newData);
		if (gridData.length > 0) {
			// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
			// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
		}
		gridRef.current?.addUncheckedRowsByValue('errYn', 'Y');
	}, [gridData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="기타/업무비관리 엑셀업로드" showButtons={false} />

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

export default TmAmountDailyExcelPopup;
