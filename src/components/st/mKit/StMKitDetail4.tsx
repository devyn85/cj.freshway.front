/*
 ############################################################################
 # FiledataField	: StMKitDetail4.tsx
 # Description		: 재고 > 재고조정 > 처리[처리TAB]
 # Author		    	: 고혜미
 # Since			    : 25.11.04
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
import { apiPostSaveMasterList03, apiPostSaveSubItemsList03 } from '@/api/st/apiStMKit';

// Component

import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import dayjs from 'dayjs';
import { useEffect } from 'react';

//types
import GridAutoHeight from '@/components/common/GridAutoHeight';
import { Form } from 'antd';

const StMKitDetail4 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form } = props;
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	// 그리드 컬럼 팝업용 Ref
	const refModal = useRef(null);

	// Declare react Ref(2/4)
	ref.gridRef4 = useRef();

	const fixdccode = Form.useWatch('fixdccode', props.searchForm);

	// 기타(4/4)

	// 그리드 컬럼
	const gridCol = [
		/*
		{
			dataField: 'approvalreqno',
			headerText: t('lbl.APPROVALNO'),
			editable: false,
			width: 100,
			dataType: 'code',
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
		}, // 결재문서번호 */
		{
			dataField: 'approvalstatusname',
			headerText: t('lbl.APPROVALSTATUS'),
			editable: false,
			width: 100,
			dataType: 'code',
			cellMerge: true,
			mergeRef: 'rowDist',
			mergePolicy: 'restrict',
		}, // 결재상태

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
							ref.gridRef4.current.openPopup(params, 'sku');
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
			editable: false,
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
				{ dataField: 'stockqty', headerText: t('lbl.QTY_ST'), editable: false, width: 100, dataType: 'numeric' }, // 현재고수량
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
					editable: false,
					cellMerge: true,
					mergeRef: 'rowDist',
					mergePolicy: 'restrict',
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
					editable: false,
					required: false,
					cellMerge: true,
					mergeRef: 'rowDist',
					mergePolicy: 'restrict',
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
		{ dataField: 'rownum', visible: false }, // 순번(숨김)
		{ dataField: 'rowDist', visible: false }, // 세로병합용(숨김)
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		//showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		enableCellMerge: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = ref.current.getCheckedRowItemsAll();

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// Kit 리스트 확인
		const kitList: any[] = [];
		for (const item of updatedItems) {
			if (kitList.length < 1) {
				kitList.push(item);
			} else {
				const mappingKits = kitList.filter((v: any) => v.planDt === item.planDt && v.kitSku === item.kitSku);
				if (mappingKits && mappingKits.length > 0) {
					//kitList.push(item);
				} else {
					kitList.push(item);
				}
			}
		}

		const params = {
			fixdccode: fixdccode,
			saveList: updatedItems, // 선택된 행의 데이터
			saveKitList: kitList,
		};

		// 저장 실행
		apiPostSaveSubItemsList03(params).then(res => {
			if (res.statusCode === 0) {
				loopTransaction(params, 0, kitList.length);
			}
		});
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
			apiPostSaveMasterList03(currentParams).then(res => {
				if (!final) {
					loopTransaction(params, index + 1, total);
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
						},
					});
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
		ref?.current.bind('cellEditEnd', (event: any) => {
			if (event.dataField === 'confirmqty') {
				const grid = ref.current;
				const changedValue = event.value;
				const targetItem = event.item;

				if (!grid) return;

				const groupPlanDt =
					typeof targetItem.planDt === 'string' ? targetItem.planDt : dayjs(targetItem.planDt).format('YYYY-MM-DD');

				const groupKitSku = targetItem.kitSku;

				const allData = grid.getGridData() as any[];
				const rowsToCheck: number[] = [];

				allData.forEach((row: any, idx: number) => {
					const rowPlanDt = typeof row.planDt === 'string' ? row.planDt : dayjs(row.planDt).format('YYYY-MM-DD');

					if (rowPlanDt === groupPlanDt && row.kitSku === groupKitSku) {
						// confirmqty는 그룹 전체 동일하게 설정
						grid.setCellValue(idx, 'confirmqty', changedValue);

						// 각 행의 qty 개별 적용 !!!
						const eachQty = Number(row.qty) || 0;
						grid.setCellValue(idx, 'reqQty', changedValue * eachQty);

						rowsToCheck.push(idx);
					}
				});

				// 체크 처리
				if (rowsToCheck.length > 0) {
					if (typeof grid.setCheckedRowIndexes === 'function') {
						grid.setCheckedRowIndexes(rowsToCheck);
					}
				}

				if (typeof grid.clearSelection === 'function') {
					grid.clearSelection();
				}
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
				btnType: 'btn2', // 저장
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
		const gridRef4Cur = ref.current;
		if (gridRef4Cur) {
			gridRef4Cur?.setGridData(props.data);
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
		</>
	);
});
export default StMKitDetail4;
