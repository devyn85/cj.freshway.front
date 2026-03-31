/*
 ############################################################################
 # FiledataField	: StKitPlanDetail1.tsx
 # Description		: 재고 > 재고작업 > KIT상품 계획등록
 # Author			    : Canal Frame
 # Since			    : 25.10.27
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { useEffect } from 'react';
// Utils
//types
import GridAutoHeight from '@/components/common/GridAutoHeight';
import { GridBtnPropsType } from '@/types/common';
// API Call Function

const StKitPlanDetail2 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.KIT_SKU'),
			dataField: 'kitSku',
			editable: false,
			width: 100,
			cellMerge: true,
			mergeRef: 'kitSku',
			mergePolicy: 'restrict',
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
		}, // KIT상품코드
		{
			headerText: t('lbl.KIT_SKUNAME'),
			dataField: 'kitNm',
			dataType: 'string',
			cellMerge: true,
			mergeRef: 'kitSku',
			mergePolicy: 'restrict',
			editable: false,
			width: 380,
		}, // KIT상품명
		{
			headerText: t('lbl.SKU'),
			dataField: 'sku',
			editable: false,
			width: 80,
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
		{
			headerText: t('lbl.SKUINFO'), //상품정보
			children: [
				{
					headerText: t('lbl.QTY'),
					dataField: 'qty',
					dataType: 'numeric',
					editable: false,
					width: 80,
				}, //수량
				{
					headerText: t('lbl.RECEIVING_SCHEDULED_DATE'),
					dataField: 'receivingScheduledDate',
					dataType: 'date',
					editable: false,
					width: 120,
				}, //입고예정일
				{
					headerText: t('lbl.CURRENT_STOCK'),
					dataField: 'currentQty',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //현재고
				{
					headerText: t('lbl.DPINPLAN'),
					dataField: 'openqty',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //입고예정
				{
					headerText: '제작필요수량',
					dataField: 'productionRequiredQty',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //제작필요수량
				{
					headerText: '생산수량차감현재고',
					dataField: 'stock',
					dataType: 'numeric',
					editable: false,
					width: 130,
				}, //입고예정
			],
		},
		{
			headerText: '월 생산확정수량', //월 생산확정수량
			children: [
				{
					headerText: t('lbl.SUB_SUM'),
					dataField: 'totalConfirmqty',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //계
				{
					headerText: 'D+7',
					dataField: 'confirmqtySum7days',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //D+7
				{
					headerText: 'D+14',
					dataField: 'confirmqtySum14days',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //D+14
				{
					headerText: 'D+21',
					dataField: 'confirmqtySum21days',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //D+21
			],
		},
		{
			headerText: t('lbl.MONTHLY_USAGE') /*월 사용량*/,
			children: [
				{
					headerText: t('lbl.SHIPDAY1W'),
					dataField: 'preMonthUsage1',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //D-1월
				{
					headerText: t('lbl.SHIPDAY2W'),
					dataField: 'preMonthUsage2',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //D-2월
				{
					headerText: t('lbl.SHIPDAY3W'),
					dataField: 'preMonthUsage3',
					dataType: 'numeric',
					editable: false,
					width: 120,
				}, //D-3월
			],
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		showStateColumn: false,
		fillColumnSizeMode: false,
		enableCellMerge: true,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 2);
		}
	}, [props.data]);

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref,
		btnArr: [],
	};

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
			// ref?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */

		let prevRowIndex: any = null;
		ref?.current.bind('selectionChange', (event: any) => {
			if (event.primeCell?.item?._$uid === prevRowIndex) return;
			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell?.item?._$uid;
			props.onRowSelect(event.primeCell.item);
		});
	};

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt2} gridBtn={gridBtn}></GridTopBtn>
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
			</GridAutoHeight>
		</>
	);
});
export default StKitPlanDetail2;
