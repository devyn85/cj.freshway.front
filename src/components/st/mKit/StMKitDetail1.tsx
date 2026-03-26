/*
 ############################################################################
 # FiledataField	: StMKitDetail1.tsx
 # Description		: 재고 > 재고조정 > 키트처리[이체대상TAB]
 # Author		    	: 고혜미
 # Since			    : 25.11.04
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
import {
	apiPostSaveMasterList01,
	apiPostSaveMasterList04,
	apiPostSaveSubItemsList01,
	apiPostSaveSubItemsList02,
} from '@/api/st/apiStMKit';

// Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import dayjs from 'dayjs';
import { useEffect } from 'react';

//types
import GridAutoHeight from '@/components/common/GridAutoHeight';
import { Form } from 'antd';

const StMKitDetail1 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, printMasterList } = props;
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	// 그리드 컬럼 팝업용 Ref
	const refModal = useRef(null);

	// Declare react Ref(2/4)
	ref.gridRef1 = useRef();

	const fixdccode = Form.useWatch('fixdccode', props.searchForm);

	// 기타(4/4)

	// 그리드 컬럼
	const gridCol = [
		{
			dataField: 'planDt',
			headerText: t('lbl.PLAN_DATE'),
			editable: false,
			width: 100,
			dataType: 'date',
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
		}, // 계획일자
		{
			headerText: t('lbl.KITSKUINFO') /*KIT상품정보*/,
			children: [
				{
					headerText: t('lbl.KIT_SKU'),
					dataField: 'kitSku',
					dataType: 'code',
					editable: false,
					width: 90,
					cellMerge: true,
					mergeRef: 'rowDist',
					mergePolicy: 'restrict',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							const params = {
								sku: e.item.kitSku,
								skuDescr: e.item.kitNm,
							};
							ref.gridRef1.current.openPopup(params, 'sku');
						},
					},
				}, // 상품코드
				{
					headerText: t('lbl.KIT_SKUNAME'),
					dataField: 'kitNm',
					dataType: 'string',
					editable: false,
					cellMerge: true,
					mergeRef: 'rowDist',
					mergePolicy: 'restrict',
					width: 380,
				}, // 상품명칭
			],
		},
		{
			dataField: 'minExpiredt',
			headerText: t('lbl.KITEXPIREDT'),
			editable: false,
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
			width: 100,
			dataType: 'code',
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value) ? '' : (value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD')) ?? '';
			},
		}, // KIT 소비일자
		{
			dataField: 'openqty',
			headerText: t('lbl.KITPLANQTY'),
			editable: false,
			width: 100,
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
			dataType: 'numeric',
		}, // KIT 계획수량
		{
			dataField: 'confirmqty',
			headerText: t('lbl.KITCONFIRMQTY'),
			editable: true,
			width: 100,
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
			dataType: 'numeric',
		}, // KIT 생산수량
		{
			headerText: t('lbl.COMPONENTINFO'), // 구성품정보
			children: [
				{
					headerText: t('lbl.SKU'),
					dataField: 'sku',
					dataType: 'code',
					editable: false,
					width: 90,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							const params = {
								sku: e.item.sku,
								skuDescr: e.item.skuNm,
							};
							ref.current.openPopup(params, 'sku');
						},
					},
				}, // 상품코드
				{
					headerText: t('lbl.SKUNAME'),
					dataField: 'skuNm',
					dataType: 'string',
					editable: false,
					width: 380,
				}, // 상품명칭
				{ dataField: 'stockgradeNm', headerText: t('lbl.STOCKGRADE'), editable: false, width: 80, dataType: 'code' }, // 재고속성
				{
					dataField: 'expiredt',
					headerText: t('lbl.EXPIREDT'),
					editable: false,
					width: 100,
					dataType: 'code',
					labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						return commUtil.isEmpty(value) ? '' : (value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD')) ?? '';
					},
				}, // 소비일자
				{ dataField: 'stockqtyTotal', headerText: t('lbl.QTY_ST'), editable: false, width: 100, dataType: 'numeric' }, // 현재고수량
				{ dataField: 'stockqty', headerText: t('lbl.OPENQTY_ST'), editable: false, width: 100, dataType: 'numeric' }, // 가용재고수량
				{ dataField: 'reqQty', headerText: t('lbl.REQ_QTY'), editable: false, width: 100, dataType: 'numeric' }, // 요청량
			],
		},
		{
			headerText: t('lbl.COSTCENTER'), //귀속부서
			children: [
				{
					dataField: 'costcd',
					headerText: t('lbl.COSTCENTER'), //귀속부서
					dataType: 'code',
					editable: true,
					cellMerge: true,
					mergeRef: 'rowDist',
					mergePolicy: 'restrict',
					required: true,
					commRenderer: {
						type: 'search',
						popupType: 'costCenter',
						searchDropdownProps: {
							dataFieldMap: {
								costcd: 'code',
								costcdname: 'name',
							},
							callbackBeforeUpdateRow: (e: any) => {
								// //console.log('e : ', e);
								// //console.log('grtddf: ', ref.current.getGridData());
								// const selectedIndex = ref?.current?.getSelectedIndex();
								// const selectedRow = ref?.current.getItemByRowIndex(selectedIndex[0]);
								// const allData = ref.current.getGridData() as any[];
								// //console.log('test : ', ref.current.getMergeEndRowIndex(1, 2));
								setMergeData(ref.current.getSelectedIndex()[0], e, 'costcd', 'costcdname');
								/*
								allData.forEach((row: any, idx: number) => {
									const rowPlanDt =
										typeof row.planDt === 'string' ? row.planDt : dayjs(row.planDt).format('YYYY-MM-DD');

									if (rowPlanDt === selectedRow.planDt && row.kitSku === selectedRow.kitSku) {
										ref.current.setCellValue(idx, 'costcd', e.code);
										ref.current.setCellValue(idx, 'costcdname', e.name);
									}
								});
*/
								// let rowIndex = -1;
								// for (const item of ref.current.getGridData()) {
								// 	rowIndex++;
								// 	if (item.planDt === selectedRow.planDt && item.kitSku === selectedRow.kitSku) {
								// 		item.costcd = selectedRow.costcd;
								// 		item.costcdname = selectedRow.costcdname;
								// 		//ref.current.updateRows(item, rowIndex);
								// 		ref.current.setCellValue(rowIndex, 'costcd', selectedRow.costcd);
								// 		ref.current.setCellValue(rowIndex, 'cocostcdnamestcd', selectedRow.costcdname);
								// 	}
								// }
								// //ref.current.update();
							},
						},
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							// 예: costcd 컬럼에서 팝업 열기
							refModal.current.open({
								gridRef: ref,
								rowIndex,
								dataFieldMap: {
									costcd: 'code',
									costcdname: 'name',
								},
								popupType: 'costCenter',
								onConfirm: (selectedRows: any[]) => {
									refModal.current?.handlerClose();
									if (!selectedRows || selectedRows.length === 0) return;

									const selectedData = selectedRows[0];
									setMergeData(rowIndex, selectedData, 'costcd', 'costcdname');
								},
							});
						},
					},
				},
				{
					dataField: 'costcdname',
					headerText: t('lbl.COSTCENTERNAME'), //귀속부서명
					dataType: 'string',
					editable: false,
					cellMerge: true,
					mergeRef: 'rowDist',
					mergePolicy: 'restrict',
				},
			],
		},
		{
			headerText: t('lbl.CUST'), //거래처
			children: [
				{
					dataField: 'custkey',
					headerText: t('lbl.CUST_CODE'), //거래처
					dataType: 'code',
					editable: true,
					cellMerge: true,
					mergeRef: 'rowDist',
					mergePolicy: 'restrict',
					required: true,
					commRenderer: {
						type: 'search',
						popupType: 'cust',
						searchDropdownProps: {
							dataFieldMap: {
								custkey: 'code',
								custname: 'name',
							},
							callbackBeforeUpdateRow: (e: any) => {
								setMergeData(ref.current.getSelectedIndex()[0], e, 'custkey', 'custname');
							},
						},
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							// 예: custcd 컬럼에서 팝업 열기
							refModal.current.open({
								gridRef: ref,
								rowIndex,
								dataFieldMap: {
									custkey: 'code',
									custname: 'name',
								},
								popupType: 'cust',
								onConfirm: (selectedRows: any[]) => {
									refModal.current?.handlerClose();
									if (!selectedRows || selectedRows.length === 0) return;

									const selectedData = selectedRows[0];
									setMergeData(rowIndex, selectedData, 'custkey', 'custname');
								},
							});
						},
					},
				},
				{
					dataField: 'custname',
					headerText: t('lbl.CUST_NAME'), //거래처명
					dataType: 'string',
					editable: false,
					cellMerge: true,
					mergeRef: 'rowDist',
					mergePolicy: 'restrict',
				},
			],
		},
		{ dataField: 'qty', visible: false }, // 숨김,
		{ dataField: 'skuUom', visible: false }, // 숨김
		{ dataField: 'kitUom', visible: false }, // 숨김
		{ dataField: 'rownum', visible: false }, // 순번(숨김)
		{ dataField: 'rowDist', visible: false }, // 세로병합용(숨김)
	];

	const gridProps = {
		editable: true,
		enableCellMerge: true,
		editableMergedCellsAll: true, // 병합된 셀을 사용자가 직접 수정할 때 병합된 셀 전체가 수정 적용될지 여부 (기본값: false)
		cellMergePolicy: 'valueWithNull',
		//	cellMergeRowSpan: true,
		showRowCheckColumn: true,
		//showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		// showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		// customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		// customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 귀속부서, 거래처 셋팅
	 * @param idx
	 * @param item
	 * @param code
	 * @param name
	 * @returns {void}
	 */
	const setMergeData = (idx: string, item: any, code: string, name: string) => {
		const mergeStartRow = ref.current.getMergeStartRowIndex(idx, 1);
		const mergeEndRow = ref.current.getMergeEndRowIndex(idx, 1);

		for (let i = mergeStartRow; i <= mergeEndRow; i++) {
			ref.current.setCellValue(i, code, item.code);
			ref.current.setCellValue(i, name, item.name);
		}
	};
	/**
	 * 저장
	 * @returns {void}
	 */
	const saveMasterList = async () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = ref.current.getCheckedRowItemsAll();
		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (!ref.current.validateRequiredGridData()) return;

		const searchParam = props.searchForm.getFieldsValue();

		if (searchParam.procdiv === '1') {
			if (updatedItems.some((row: any) => commUtil.isEmpty(row.loc) || row.stockqty < row.reqQty)) {
				showAlert(null, '자품목의 재고가 없거나 부족합니다.');
				return;
			}

			if (updatedItems.some((row: any) => commUtil.isEmpty(row.expiredt))) {
				showAlert(null, '소비일자(소비기한) 빈값은 저장할 수 없습니다.');
				return;
			}

			if (updatedItems.some((row: any) => row.confirmqty <= 0)) {
				showAlert(null, 'KIT 생산수량를 입력하십시오.');
				return;
			}

			// 동일 SKU별 요청량 합계 체크 (재고 부족 확인)
			const skuGroups: { [key: string]: any[] } = {};
			updatedItems.forEach((item: any) => {
				if (!skuGroups[item.sku]) skuGroups[item.sku] = [];
				skuGroups[item.sku].push(item);
			});

			for (const sku in skuGroups) {
				const group = skuGroups[sku];
				const totalReqQty = group.reduce((acc, cur) => acc + (Number(cur.reqQty) || 0), 0);
				const firstRowStockQty = Number(group[0].stockqty) || 0;
				if (totalReqQty > firstRowStockQty) {
					showAlert(null, `상품[${sku}]의 총 요청량(${totalReqQty})이 재고수량(${firstRowStockQty})을 초과합니다.`);
					return;
				}
			}

			// Kit 리스트 확인
			const kitList: any[] = [];
			for (const item of props.kitList) {
				const mappingKits = updatedItems.filter((v: any) => v.planDt === item.planDt && v.kitSku === item.kitSku);
				if (mappingKits && mappingKits.length > 0) {
					item.openqty = mappingKits[0].openqty;
					item.confirmqty = mappingKits[0].confirmqty;
					item.costcd = mappingKits[0].costcd;
					item.custkey = mappingKits[0].custkey;
					item.loc = mappingKits[0].loc;
					item.stockid = mappingKits[0].stockid;
					item.STOCKGRADE = mappingKits[0].STOCKGRADE;
					kitList.push(item);
				}
			}

			const params = {
				fixdccode: fixdccode,
				saveList: updatedItems, // 선택된 행의 데이터
				saveKitList: kitList,
			};

			// 저장 실행
			//ref.current.showConfirmSave(() => {
			apiPostSaveSubItemsList01(params).then(res => {
				if (res.statusCode === 0) {
					// // 전체 체크 해제
					// ref.current.setAllCheckedRows(false);
					// // AUIGrid 변경이력 Cache 삭제
					// ref.current.resetUpdatedItems();
					// KIT별 처리
					// const params2 = {
					// 	fixdccode: fixdccode,
					// 	saveList: updatedItems,
					// 	saveKitList: kitList,
					// };
					loopTransaction(params, 0, kitList.length);
				}
			});
			//});
		} else if (searchParam.procdiv === '2') {
			if (updatedItems.some((row: any) => commUtil.isEmpty(row.openqty) || row.openqty < row.reqQty)) {
				showAlert(null, 'KIT상품의 재고가 없거나 부족합니다.');
				return;
			}

			if (updatedItems.some((row: any) => commUtil.isEmpty(row.expiredt))) {
				showAlert(null, '소비일자(소비기한) 빈값은 저장할 수 없습니다.');
				return;
			}

			const processedRowDists = new Set();

			const kitList: any[] = [];
			for (const item of updatedItems) {
				if (!processedRowDists.has(item.rowDist)) {
					processedRowDists.add(item.rowDist);
					kitList.push({
						rowDist: item.rowDist,
						kitSku: item.kitSku,
						planDt: item.planDt,
						dccode: item.dccode,
						openqty: item.openqty,
						confirmqty: item.confirmqty,
						costcd: item.costcd,
						custkey: item.custkey,
						loc: item.loc,
						stockid: item.stockid,
					});
				}
			}

			const params = {
				fixdccode: fixdccode,
				saveList: updatedItems, // 선택된 행의 데이터
				saveKitList: kitList,
			};

			apiPostSaveSubItemsList02(params).then(res => {
				if (res.statusCode === 0) {
					const rowDistCnt = new Set(updatedItems.map((item: any) => item.rowDist)).size;
					loopTransaction02(params, 0, rowDistCnt);
				}
			});
		}
	};

	/**
	 * 연쇄 트랜젝션 호출 함수
	 * @param params
	 * @param index
	 * @param total
	 */
	const loopTransaction = (params: any, index: number, total: number) => {
		let final = false;

		if (total === index + 1) {
			final = true;
		}

		if (index < total) {
			const updatedItems = params.saveList.filter(
				(v: any) => v.kitSku === params.saveKitList[index].kitSku && v.planDt === params.saveKitList[index].planDt,
			);
			const currentParams = {
				fixdccode: fixdccode,
				saveList: updatedItems,
				saveKitList: [params.saveKitList[index]],
			};

			apiPostSaveMasterList01(currentParams).then(res => {
				if (!final) {
					loopTransaction(params, index + 1, total);
				} else {
					if (res.statusCode === 0) {
						// 전체 체크 해제
						ref.current.setAllCheckedRows(false);
						// AUIGrid 변경이력 Cache 삭제
						ref.current.resetUpdatedItems();
						showMessage({
							content: t('msg.MSG_COM_SUC_003'),
							modalType: 'info',
							onOk: () => {
								props.callBackFn?.(); // 콜백 함수 호출
								props.callBackResultFn?.();
							},
						});
					}
				}
			});
		} else {
			// 전체 체크 해제
			ref.current.setAllCheckedRows(false);
			// AUIGrid 변경이력 Cache 삭제
			ref.current.resetUpdatedItems();
			showMessage({
				content: t('msg.MSG_COM_SUC_003'),
				modalType: 'info',
				onOk: () => {
					props.callBackFn?.(); // 콜백 함수 호출
					props.callBackResultFn?.();
				},
			});
		}
	};

	/**
	 * 연쇄 트랜젝션 호출 함수
	 * @param params
	 * @param index
	 * @param total
	 */
	const loopTransaction02 = (params: any, index: number, total: number) => {
		let final = false;

		if (total === index + 1) {
			final = true;
		}

		if (index < total) {
			const updatedItems = params.saveList.filter((v: any) => v.rowDist === params.saveKitList[index].rowDist);
			const currentParams = {
				fixdccode: fixdccode,
				saveList: updatedItems,
				saveKitList: [params.saveKitList[index]],
			};

			apiPostSaveMasterList04(currentParams).then(res => {
				if (!final) {
					loopTransaction02(params, index + 1, total);
				} else {
					if (res.statusCode === 0) {
						// 전체 체크 해제
						ref.current.setAllCheckedRows(false);
						// AUIGrid 변경이력 Cache 삭제
						ref.current.resetUpdatedItems();
						showMessage({
							content: t('msg.MSG_COM_SUC_003'),
							modalType: 'info',
							onOk: () => {
								props.callBackFn?.(); // 콜백 함수 호출
								props.callBackResultFn?.();
							},
						});
					}
				}
			});
		} else {
			// 전체 체크 해제
			ref.current.setAllCheckedRows(false);
			// AUIGrid 변경이력 Cache 삭제
			ref.current.resetUpdatedItems();
			showMessage({
				content: t('msg.MSG_COM_SUC_003'),
				modalType: 'info',
				onOk: () => {
					props.callBackFn?.(); // 콜백 함수 호출
					props.callBackResultFn?.();
				},
			});
		}
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 시작 (신규일때만 편집 허용)
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('cellEditBegin', (event: any) => {
			if (event.item.rowStatus !== 'I') {
				// false를 반환하여 편집 모드 진입을 막는다.
				//return false;
			}
			return true;
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('cellEditEndBefore', (event: any) => {
			const curDataField = event.dataField;
			if (curDataField === 'confirmqty' || curDataField === 'costcd' || curDataField === 'custkey') {
				const grid = ref.current;
				const changedValue = event.value;
				const targetItem = event.item;

				if (!grid) return;

				const groupPlanDt =
					typeof targetItem.planDt === 'string' ? targetItem.planDt : dayjs(targetItem.planDt).format('YYYY-MM-DD');

				const groupKitSku = targetItem.kitSku;

				const allData = grid.getGridData() as any[];
				const rowsToCheck: number[] = [];
				const rowsToUnCheck: any[] = [];

				allData.forEach((row: any, idx: number) => {
					const rowPlanDt = typeof row.planDt === 'string' ? row.planDt : dayjs(row.planDt).format('YYYY-MM-DD');

					if (rowPlanDt === groupPlanDt && row.kitSku === groupKitSku) {
						if (event.dataField === 'confirmqty') {
							// confirmqty는 그룹 전체 동일하게 설정
							grid.setCellValue(idx, 'confirmqty', changedValue);

							// 각 행의 qty 개별 적용 !!!
							const eachQty = Number(row.qty);
							grid.setCellValue(idx, 'reqQty', changedValue * eachQty);

							// if (changedValue == 0) {
							// 	rowsToUnCheck.push(row);
							// }
						} else if (event.dataField === 'costcd') {
							// grid.setCellValue(idx, 'costcd', changedValue);
							grid.setCellValue(idx, 'costcd', '');
							grid.setCellValue(idx, 'costcdname', '');
						} else if (event.dataField === 'custkey') {
							// grid.setCellValue(idx, 'costcdname', changedValue);
							grid.setCellValue(idx, 'custkey', '');
							grid.setCellValue(idx, 'custname', '');
						}

						rowsToCheck.push(idx);
					}
				});
				// if (rowsToUnCheck.length > 0) {
				// 	//console.log('rowsToUnCheck : ', rowsToUnCheck);
				// 	const uncheckedIds = rowsToUnCheck.map((item: any) => item._$uid);
				// 	ref.current.addUncheckedRowsByIdsBefore(uncheckedIds);
				// }
				// 체크 처리
				//if (rowsToCheck.length > 0) {
				//if (typeof grid.setCheckedRowIndexes === 'function') {
				//grid.setCheckedRowIndexes(rowsToCheck);
				//}
				//}

				// if (typeof grid.clearSelection === 'function') {
				// 	grid.clearSelection();
				// }
			}
		});

		/**
		 * 그리드 엑스트라 행 체크
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('rowCheckClick', (event: any) => {
			const { item, checked, rowIndex } = event;
			const gridData = ref?.current.getGridData();

			for (const row of gridData) {
				if (row.planDt === item.planDt && row.kitSku === item.kitSku && row.dccode === item.dccode) {
					if (checked) {
						ref.current.addCheckedRowsByValue('rownum', row.rownum);
					} else {
						ref.current.addUncheckedRowsByValue('rownum', row.rownum);
						const indexes = ref.current.getRowIndexesByValue('rownum', row.rownum);
						ref.current.restoreEditedRows(indexes[0]);
					}
				}
			}
		});
	};

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRef1Cur = ref.current;
		if (gridRef1Cur) {
			gridRef1Cur?.setGridData(props.data);
		}
	}, [props.data]);

	return (
		<>
			<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt}>
					<Form form={form} layout="inline"></Form>
				</GridTopBtn>
			</AGrid>
			{/* 상품 LIST 그리드 */}
			<GridAutoHeight>
				<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
			</GridAutoHeight>
			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModal} />
		</>
	);
});
export default StMKitDetail1;
