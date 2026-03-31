/*
 ############################################################################
 # FiledataField	: StConvertCGDetail2.tsx
 # Description		: 재고 > 재고조정 > 재고속성변경
 # Author			    : Canal Frame
 # Since			    : 25.09.18
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
// Utils
//types
import GridAutoHeight from '@/components/common/GridAutoHeight';
import { GridBtnPropsType } from '@/types/common';
// API Call Function

const StConvertCGDetail2 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, activeKeyMaster, formRef } = props; // Antd Form
	const gridId = uuidv4() + '_gridWrap';

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
		{ dataField: 'loccategoryname', headerText: t('lbl.LOCCATEGORY'), editable: false, width: 100, dataType: 'string' }, // 로케이션종류
		{ dataField: 'loctypename', headerText: t('lbl.LOCTYPE'), editable: false, width: 100, dataType: 'string' }, // 로케이션유형
		{ dataField: 'stockgradename', headerText: t('lbl.STOCKGRADE'), editable: false, width: 80, dataType: 'string' }, // 재고속성
		{ dataField: 'lotcnt', headerText: t('lbl.LOTCNT'), editable: false, width: 80, dataType: 'numeric' }, // LOT수
		{ dataField: 'loccnt', headerText: t('lbl.LOCCNT'), editable: false, width: 80, dataType: 'numeric' }, // 로케이션수
		{ dataField: 'skucnt', headerText: t('lbl.SKUCNT'), editable: false, width: 80, dataType: 'numeric' }, // 상품수
		{ dataField: 'idcnt', headerText: t('lbl.IDCNT'), editable: false, width: 80, dataType: 'numeric' }, // ID수
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		showStateColumn: false,
		fillColumnSizeMode: false,
		showFooter: true,
		// 숨겨진 컬럼 정의
		// columnLayout: [
		// 	...gridCol,
		// 	{ dataField: 'loccategory', headerText: t('lbl.LOCCATEGORY'), visible: false },
		// 	{ dataField: 'loctype', headerText: t('lbl.LOCTYPE'), visible: false },
		// 	{ dataField: 'stockgrade', headerText: t('lbl.STOCKGRADE'), visible: false },
		// 	{ dataField: 'wharea', headerText: t('lbl.WHAREA'), visible: false },
		// 	{ dataField: 'whareafloor', headerText: t('lbl.WHAREAFLOOR'), visible: false },
		// 	{ dataField: 'zone', headerText: t('lbl.ZONE'), visible: false },
		// ],
	};

	// FooterLayout Props
	const footerLayout = [
		{ labelText: t('lbl.TOTAL'), positionField: gridCol[0].dataField }, // 합계
		{ dataField: 'lotcnt', positionField: 'lotcnt', operation: 'SUM', formatString: '#,##0', style: 'right' }, // LOT 합계
		{ dataField: 'loccnt', positionField: 'loccnt', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 로케이션 합계
		{ dataField: 'skucnt', positionField: 'skucnt', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 상품 합계
		{ dataField: 'idcnt', positionField: 'idcnt', operation: 'SUM', formatString: '#,##0', style: 'right' }, // ID수 합계
	];

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	const prevRowIndex = useRef<any>(null);

	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);
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
			ref?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		ref.current.bind('selectionChange', (event: any) => {
			const { rowIndex } = event.primeCell;

			if (prevRowIndex.current === rowIndex) return;

			prevRowIndex.current = rowIndex;
			props.onRowSelect(event.primeCell.item);
		});
	};

	useEffect(() => {
		const grid = ref.current;
		if (!grid) return;

		grid.setGridData(props.data || []);

		if (props.data?.length > 0) {
			grid.setSelectionByIndex(0, 0);
			const firstItem = grid.getItemByRowIndex(0);
			if (firstItem) props.onRowSelect?.(firstItem);
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridTitle={'로케이션' + t('lbl.LIST')} totalCnt={props.totalCnt2} gridBtn={gridBtn} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>
		</>
	);
});
export default StConvertCGDetail2;
