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

const StKitPlanDetail3 = forwardRef((props: any, ref: any) => {
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
			headerText: t('lbl.RECEIVING_SCHEDULED_DATE'),
			dataField: 'deliverydate',
			dataType: 'date',
			editable: false,
			width: 120,
		}, //입고예정일
		{
			headerText: 'PO',
			dataField: 'orderqty',
			dataType: 'numeric',
			editable: false,
			width: 120,
		}, //PO
		{
			headerText: '업체확정',
			dataField: 'vendorconfirmqty',
			dataType: 'numeric',
			editable: false,
			width: 120,
		}, //업체확정
		{
			headerText: t('lbl.DPCONFIRMQTY_DP'),
			dataField: 'confirmqty',
			dataType: 'numeric',
			editable: false,
			width: 120,
		}, //입고확정량
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		showStateColumn: false,
		fillColumnSizeMode: false,
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
			// gridRef?.setSelectionByIndex(0, 0);
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
	};

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt3} gridBtn={gridBtn}></GridTopBtn>
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
			</GridAutoHeight>
		</>
	);
});
export default StKitPlanDetail3;
