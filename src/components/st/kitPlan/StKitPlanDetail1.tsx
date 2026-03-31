/*
 ############################################################################
 # FiledataField	: StKitPlanDetail1.tsx
 # Description		: 재고 > 재고작업 > KIT상품 계획등록
 # Author			    : Canal Frame
 # Since			    : 25.10.21
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import { Form } from 'antd';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import CheckboxGroup from '@/components/common/custom/form/CheckboxGroup';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { forwardRef, useEffect } from 'react';
dayjs.locale('ko');
// Utils
import { apiPostSaveMasterList } from '@/api/st/apiStKitPlan';
//types
import GridAutoHeight from '@/components/common/GridAutoHeight';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
// asset

// API Call Function

const StKitPlanDetail1 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, month, initialValues } = props;
	const [formValues, setFormValues] = useState<any>({});

	// Declare react Ref(2/4)

	// Declare init value(3/4)

	// 기타(4/4)
	const bsicOptions = [
		{ label: t('lbl.REQUEST'), value: 'REQUEST' },
		{
			label: t('lbl.PLAN'),
			value: 'PLAN',
		},
		{
			label: t('lbl.PRODUCTION'),
			value: 'PRODUCTION',
		},
	];

	const makeDynamicCols = () => {
		if (!month) return [];

		const start = dayjs(month).startOf('month');
		const end = dayjs(month).endOf('month');
		const cols = [];

		for (let d = start; d.isBefore(end) || d.isSame(end, 'day'); d = d.add(1, 'day')) {
			const label = d.format('MM.DD(ddd)');
			const dayOfWeek = d.day();

			let headerColor = '';
			if (dayOfWeek === 0) headerColor = 'red'; // 일요일
			else if (dayOfWeek === 6) headerColor = 'blue'; // 토요일

			// 오늘 이후인지 여부
			const isAfterToday = d.isAfter(dayjs(), 'day');
			// 일요일인지 여부
			const isSunday = dayOfWeek === 0;

			const canEdit = isAfterToday && !isSunday;

			cols.push({
				headerText: `<span style="color:${headerColor}">${label}</span>`,
				children: [
					{
						headerText: '요청',
						dataField: `d${d.format('DD')}Req`,
						width: 120,
						editable: canEdit ? true : false,
						dataType: 'numeric',
						formatString: '#,##0',
						editRenderer: {
							type: 'InputEditRenderer',
							onlyNumeric: true, // 0~9 까지만 허용
							allowNegative: false, //음수허용
							allowPoint: false, // onlyNumeric 인 경우 소수점(.) 도 허용
						},
						style: 'text-align: right',
						styleFunction: () => (canEdit ? 'isEdit' : ''),
					},
					{
						headerText: '계획',
						dataField: `d${d.format('DD')}Plan`,
						width: 120,
						editable: canEdit ? true : false,
						dataType: 'numeric',
						formatString: '#,##0',
						editRenderer: {
							type: 'InputEditRenderer',
							onlyNumeric: true, // 0~9 까지만 허용
							allowNegative: false, //음수허용
							allowPoint: false, // onlyNumeric 인 경우 소수점(.) 도 허용
						},
						style: 'text-align: right',
						styleFunction: () => (canEdit ? 'isEdit' : ''),
					},
					{
						headerText: '생산',
						dataField: `d${d.format('DD')}Prod`,
						width: 120,
						editable: false,
						dataType: 'numeric',
						editRenderer: {
							type: 'InputEditRenderer',
							onlyNumeric: true, // 0~9 까지만 허용
							allowNegative: false, //음수허용
							allowPoint: false, // onlyNumeric 인 경우 소수점(.) 도 허용
						},
						formatString: '#,##0',
						style: 'text-align: right',
					},
				],
			});
		}

		return cols;
	};

	// 그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.KIT_SKU'),
			dataField: 'kitSku',
			dataType: 'code',
			editable: false,
			width: 90,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.kitSku,
						skuDescr: e.item.kitNm,
					};
					ref.current.openPopup(params, 'sku');
				},
			},
		}, // 상품코드
		{
			headerText: t('lbl.KIT_SKUNAME'),
			dataField: 'kitNm',
			dataType: 'string',
			editable: false,
			width: 380,
		}, // 상품명칭
		{ headerText: t('lbl.STORAGETYPE'), dataField: 'storagetype', editable: false, width: 80, dataType: 'code' }, // 저장조건
		{ headerText: t('lbl.UOM_WEIGHT_RATE'), dataField: 'grossweight', editable: false, width: 80, dataType: 'numeric' }, // 단위중량
		{ headerText: t('lbl.QTYPERBOX'), dataField: 'qtyperbox', editable: false, width: 80, dataType: 'numeric' }, // 박스입수
		{ headerText: t('lbl.QTYPERPLT'), dataField: 'boxperplt', editable: false, width: 80, dataType: 'numeric' }, // PLT입수
		{ headerText: t('lbl.POMDCODE'), dataField: 'buyerkeynm', editable: false, width: 100, dataType: 'string' }, // 수급담당
		{
			headerText: t('lbl.CENTER_MANAGER'),
			dataField: 'centerManager',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const list = getCommonCodeList('KITPLAN_CHARGE', '');
				const found = list.find(opt => opt.comCd === value);
				return found ? found.cdNm : value;
			},
			editable: false,
			width: 100,
			dataType: 'string',
		}, // 센터담당
		{
			headerText: '센터보유량<br/>FW(제작센터)',
			dataField: 'centerQty1',
			editable: false,
			width: 120,
			dataType: 'numeric',
		}, // 센터보유량 FW(인천제외)
		{
			headerText: '센터보유량<br/>FW(저장센터)',
			dataField: 'centerQty2',
			editable: false,
			width: 120,
			dataType: 'numeric',
		}, // 센터보유량 FW(인천)
		{
			headerText: '센터보유량<br/>FW(합)',
			dataField: 'sumCenterQty',
			editable: false,
			width: 120,
			dataType: 'numeric',
		}, // 센터보유량 FW(두 조건의 합)
		{ headerText: t('lbl.STOCKSAFETY'), dataField: 'stocksafety', editable: false, width: 120, dataType: 'numeric' }, // 안전재고
		{ headerText: t('lbl.REORDERPOINT'), dataField: 'reorderpoint', editable: false, width: 120, dataType: 'numeric' }, // 재발주점
		{ headerText: 'MAX', dataField: 'maxstock', editable: false, width: 120, dataType: 'numeric' }, // MAX
		{ headerText: 'D+7<br/>기주문량', dataField: 'quantityOrder', editable: false, width: 120, dataType: 'numeric' }, // D-7 기주문량
		{
			headerText: '반영수량<br/>(재고 -7일 치 주문량)',
			dataField: 'reflectedQty',
			editable: false,
			width: 140,
			dataType: 'numeric',
		}, // 반영수량 (재고 -7일 치 주문량)
		{
			headerText: '전년동월<br/>제작수량',
			dataField: 'totalConfirmqtyLastYear',
			editable: false,
			width: 120,
			dataType: 'numeric',
		}, // 전년동월 제작수량
		{
			headerText: '주문량' /*해당월 주문량*/,
			dataField: 'myGroupField1',
			children: [
				{
					headerText: t('lbl.TOTAL_ORDER'),
					dataField: 'totalOrderqty',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //총 주문
				{
					headerText: t('lbl.BEFORE_THE_DAY'),
					dataField: 'qtyOrderBefore',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //당일 전
				{
					headerText: t('lbl.AFTR_THE_DAY'),
					dataField: 'qtyOrderAfter',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //당일 후
				{
					headerText: t('lbl.DP_CNTRS'),
					dataField: 'dpRate',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //DP대비
			],
		},
		{
			headerText: t('lbl.QTY_WD') /*출고수량*/,
			children: [
				{
					headerText: t('lbl.SHIPDAY1W'),
					dataField: 'confirmqtyM1',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //D-1월
				{
					headerText: t('lbl.SHIPDAY2W'),
					dataField: 'confirmqtyM2',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //D-2월
				{
					headerText: t('lbl.SHIPDAY3W'),
					dataField: 'confirmqtyM3',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //D3월
			],
		},
		{
			headerText: '생산량' /*해당월 생산량*/,
			dataField: 'myGroupField2',
			children: [
				{
					headerText: 'DP',
					dataField: 'dpQty',
					dataType: 'numeric',
					style: 'text-align: right',
					editable: true,
					width: 120,
				}, //DP
				{
					headerText: t('lbl.PLANNED_WORK_QUANTITY'),
					dataField: 'totalConfirmqty',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //기 작업수량
				{
					headerText: t('lbl.WORK_REMAINING_AMOUNT'),
					dataField: 'workRemainingAmt',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //작업잔량
				{
					headerText: t('lbl.WORK_RATE'),
					dataField: 'workRate',
					dataType: 'numeric',
					style: 'text-align: right',
					editable: false,
					width: 120,
				}, //작업율
			],
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: false,
		fillColumnSizeMode: false,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		headerHeight: 20,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const prevRowIndex = useRef<any>(null);
	const onFormChange = (changedValues: any, allValues: any) => {
		setFormValues(allValues);

		const selected = Array.isArray(allValues?.gubun)
			? allValues.gubun
			: Object.keys(allValues?.gubun || {}).filter(k => allValues.gubun[k]);

		const suffixMap: Record<'REQUEST' | 'PLAN' | 'PRODUCTION', string> = {
			REQUEST: 'Req',
			PLAN: 'Plan',
			PRODUCTION: 'Prod',
		};

		const types = ['REQUEST', 'PLAN', 'PRODUCTION'] as const;

		types.forEach(type => {
			const suffix = suffixMap[type];
			const fieldset: string[] = [];

			for (let i = 1; i <= 31; i++) {
				const day = i.toString().padStart(2, '0');
				const field = `d${day}${suffix}`;
				fieldset.push(field);
			}
			if (selected.includes(type)) {
				// 체크됨 → 컬럼 보이기
				ref.current.showColumnByDataField(fieldset);
			} else {
				// 체크 해제됨 → 컬럼 숨기기
				ref.current.hideColumnByDataField(fieldset);
			}
		});
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		// ref?.current.bind('ready', (event: any) => {
		// 	// 그리드가 준비되면 첫 번째 행을 선택한다.
		// 	ref?.current.setSelectionByIndex(0);
		// });

		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		let prevRowIndex: any = null;
		ref?.current.bind('selectionChange', (event: any) => {
			// const { rowIndex } = event.primeCell;
			// if (rowIndex === prevRowIndex.current) return;
			// prevRowIndex.current = rowIndex;
			// props.onRowSelect(event.primeCell.item);
			// const selectedRow = ref.current?.getSelectedRows()[0];
			// const selectedRowJson = selectedRow ? JSON.stringify(selectedRow) : null;
			// if (prevSelectedRowJson !== null && selectedRowJson === prevSelectedRowJson) {
			// 	return;
			// }
			// prevSelectedRowJson = selectedRowJson;

			// //상세 조회
			// props.onRowSelect(selectedRow);
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;
			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell?.item?._$uid;
			const selectedRow = ref.current?.getSelectedRows()[0];
			// 상세코드 조회
			props.onRowSelect(selectedRow);
		});

		/**
		 * 그리드 행 선택 이벤트
		 * @param {any} event 이벤트
		 */
		// ref?.current.bind('selectionConstraint', (event: any) => {
		// 	// 선택된 Row가 다를 경우에만 검색
		// 	if (event.rowIndex !== event.toRowIndex) {
		// 		const gridRefCur = ref.current;
		// 		if (gridRefCur) {
		// 			// 선택된 행의 데이터를 가져온다.
		// 			// const selectedRow = gridRefCur.getSelectedRows()[0];
		// 			const item = gridRefCur.getItemByRowIndex(event.toRowIndex);
		// 			props.onRowSelect(item);
		// 		}
		// 	}
		// });
		// ref?.current.bind('selectionConstraint', (event: any) => {
		// 	// 선택된 Row가 다를 경우에만 검색
		// 	if (event.rowIndex !== event.toRowIndex) {
		// 		const gridRefCur = ref.current;
		// 		if (gridRefCur) {
		// 			// 선택된 행의 데이터를 가져온다.
		// 			// const selectedRow = gridRefCur.getSelectedRows()[0];
		// 			const item = gridRefCur.getItemByRowIndex(event.toRowIndex);
		// 			props.onRowSelect(item);
		// 		}
		// 	}
		// });

		/**
		 * 셀 편집 시작 전
		 * @event cellEditEndBefore
		 * @param {object} event 이벤트
		 * @returns {void} 최종 수정값
		 */
		ref?.current.bind('cellEditBegin', (event: any) => {
			///
		});

		/**
		 * 셀 편집 종료 후
		 * @event cellEditEndBefore
		 * @param {object} event 이벤트
		 * @returns {void} 최종 수정값
		 */
		ref?.current.bind('cellEditEnd', (event: any) => {
			///
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveMasterList = async () => {
		const gridRef = ref.current;
		const checkedRows = gridRef.getCheckedRowItems();
		const updatedItems = ref.current.getCheckedRowItemsAll();

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		const isChanged = gridRef.getChangedData({ validationYn: false });
		if (!isChanged || isChanged.length < 1) {
			showAlert(null, t('msg.noChange')); // 변경사항이 없습니다.
			return;
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				month: month.format('YYYYMM'),
				saveList: updatedItems, // 선택된 행의 데이터
			};

			apiPostSaveMasterList(params).then(res => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							props.callBackFn?.(); // 콜백 함수 호출
						},
					});
				}
			});
		});
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

	/**
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);
		}
		if (!month) return;

		const dynCols = makeDynamicCols();

		//기존 컬럼
		let currCols = [];
		try {
			currCols = gridRef.getOriginalColumnLayout?.() || gridRef.getColumnLayout() || [];
		} catch (e) {
			currCols = gridRef.getColumnLayout() || [];
		}

		const baseCols = currCols.filter((col: any) => {
			if (!col.headerText) return true;
			// '01.' 형식 날짜 컬럼은 모두 제거
			return !/\d{2}\./.test(col.headerText);
		});

		//새 레이아웃 생성
		const newLayout = [...baseCols, ...dynCols];

		try {
			setTimeout(() => {
				gridRef.changeColumnLayout(newLayout);

				const monthNum1 = dayjs().format('MM');
				const monthNum2 = dayjs(month).format('MM');
				gridRef.setColumnPropByDataField('myGroupField1', { headerText: `${monthNum2}월 주문량` });
				gridRef.setColumnPropByDataField('myGroupField2', { headerText: `${monthNum2}월 생산량` });
				//
				// gridRef.setGridData(props.data || []);
				// gridRef.setSelectionByIndex(0, 0);
			}, 0);
		} catch (err) {
			//
		}

		if (formValues?.gubun?.length > 0) {
			onFormChange({}, formValues);
		}
	}, [props.data, month]);

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref,
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt1} gridBtn={gridBtn}>
					<Form form={form} initialValues={initialValues} layout="inline">
						<div className="sect">
							<li>
								<CheckboxGroup
									name="gubun"
									className="bg-white"
									span={24}
									options={bsicOptions}
									rules={[{ required: true, validateTrigger: 'none' }]}
									onChange={(checkedValues: any) => {
										// 💡 직접 Form 상태 업데이트
										form.setFieldsValue({ gubun: checkedValues });
										onFormChange({ gubun: checkedValues }, { gubun: checkedValues });
									}}
								/>
							</li>
						</div>
					</Form>
				</GridTopBtn>
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
			</GridAutoHeight>
		</>
	);
});
export default StKitPlanDetail1;
