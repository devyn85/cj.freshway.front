/*
 ############################################################################
 # FiledataField	: StLocMoveDetail2.tsx
 # Description		: 재고 > 재고현황 > 재고일괄이동(Detail)
 # Author			: Canal Frame
 # Since			: 25.08.04
 ############################################################################
*/
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// Redux
// API Call Function

const RtQCConfirmDetail3 = ({ isShow, gridRef2, gridData3, gridRef3, gridData4 }: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();

	// Declare react Ref(2/4)

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 스타일 함수
	 * @param rowIndex 행 인덱스
	 * @param columnIndex 열 인덱스
	 * @param value 셀 값
	 * @param headerText 헤더 텍스트
	 * @param item 데이터 항목
	 * @returns 스타일 객체
	 */
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.DCCODE'), dataField: 'dccode', width: 80, editable: false, dataType: 'code' }, // 물류센터
		{
			headerText: t('lbl.ORGANIZE'),
			dataField: 'organize',
			width: 80,
			editable: false,
			dataType: 'code',
		}, // 창고
		{
			headerText: t('lbl.STOCKTYPE'),
			dataField: 'stocktype',
			width: 80,
			editable: false,
			dataType: 'code',
		}, // 재고위치
		{
			headerText: t('lbl.STOCKGRADE'),
			dataField: 'stockgrade',
			width: 80,
			editable: false,
			dataType: 'code',
		}, // 재고속성
		{ headerText: t('lbl.LOC'), dataField: 'loc', width: 80, editable: false, dataType: 'code' }, // 로케이션
		{
			headerText: t('lbl.SKU'),
			dataField: 'sku',
			width: 80,
			editable: false,
			filter: { showIcon: true },
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef2.current.openPopup(e.item, 'sku');
				},
			},
		}, // 상품코드
		{ headerText: t('lbl.SKUNAME'), dataField: 'skuname', width: 120, editable: false, filter: { showIcon: true } }, // 상품명칭
		{
			headerText: t('lbl.STORAGETYPE'),
			dataField: 'storagetype',
			width: 80,
			editable: false,
			dataType: 'code',
		}, // 저장조건
		{
			headerText: t('lbl.STOCK_INFO'), // 재고정보
			children: [
				{ headerText: t('lbl.UOM_ST'), dataField: 'uom', width: 80, editable: false, dataType: 'code' }, // 단위
				{
					headerText: t('lbl.QTY_ST'),
					dataField: 'qty',
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
				}, // 현재고수량
				{
					headerText: t('lbl.QTYALLOCATED_ST'),
					dataField: 'qtyallocated',
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
				}, // 재고할당수량
				{
					headerText: t('lbl.QTYPICKED_ST'),
					dataField: 'qtypicked',
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
				}, // 피킹재고
				{
					headerText: t('lbl.MOVE_POSSIBLE_QTY'),
					dataField: 'posbqty',
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
				}, // 이동가능수량
			],
		},
		{ headerText: t('lbl.FIXLOC'), dataField: 'fixloc', width: 80, editable: false, dataType: 'code' }, // 고정로케이션
		{
			headerText: t('lbl.MOVE_INFO'), // 이동정보
			children: [
				{
					headerText: t('lbl.MOVE_LOC'),
					dataField: 'toLoc',
					width: 100,
					editable: false,
					style: 'user12',
					dataType: 'code',
				}, // 이동로케이션
				{
					headerText: t('lbl.MOVE_QTY'),
					dataField: 'toOrderqty',
					width: 80,
					editable: false,
					style: 'user12',
					dataType: 'numeric',
					formatString: '#,##0.###',
				}, // 이동수량
			],
		},
		{
			headerText: t('lbl.NEARDURATIONYN'),
			dataField: 'neardurationyn',
			width: 80,
			editable: false,
			dataType: 'code',
		}, // 소비기한임박여부
		{
			headerText: t('lbl.LOTTABLE01'),
			dataField: 'lottable01',
			width: 80,
			editable: false,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
			},
		}, // 기준일(소비,제조)
		{
			headerText: t('lbl.DURATION_TERM'),
			dataField: 'durationTerm',
			width: 80,
			editable: false,
			dataType: 'code',
		}, // 소비기간(잔여/전체)
		{
			headerText: t('lbl.SERIALINFO'), // 상품이력정보
			children: [
				{
					headerText: t('lbl.SERIALNO'),
					dataField: 'serialno',
					width: 80,
					editable: false,
					dataType: 'code',
				}, // 이력번호
				{
					headerText: t('lbl.BARCODE'),
					dataField: 'barcode',
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 바코드
				{
					headerText: t('lbl.CONVSERIALNO'),
					dataField: 'convserialno',
					width: 100,
					editable: false,
					dataType: 'code',
				}, // B/L번호
				{
					headerText: t('lbl.BUTCHERYDT'),
					dataField: 'butcherydt',
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 도축일자
				{ headerText: t('lbl.FACTORYNAME'), dataField: 'factoryname', width: 100, editable: false }, // 도축장
				{
					headerText: t('lbl.CONTRACTTYPE'),
					dataField: 'contracttype',
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 계약유형
				{
					headerText: t('lbl.CONTRACTCOMPANY'),
					dataField: 'contractcompany',
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 계약업체
				{
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataField: 'contractcompanyname',
					width: 120,
					editable: false,
				}, // 계약업체명
				{
					headerText: t('lbl.FROMVALIDDT'),
					dataField: 'fromvaliddt',
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 유효일자(FROM)
				{
					headerText: t('lbl.TOVALIDDT'),
					dataField: 'tovaliddt',
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 유효일자(TO)
			],
		},
		{
			headerText: t('lbl.PROCESS_RESULT'), // 처리결과
			children: [
				{
					headerText: t('lbl.PROCESSFLAG'),
					dataField: 'processflag',
					width: 80,
					editable: false,
					dataType: 'code',
				}, // 처리결과
				{ headerText: t('lbl.PROCESSMSG'), dataField: 'processmsg', width: 120, editable: false }, // 처리메시지
			],
		},
	];

	const gridCol1 = [
		{
			headerText: t('lbl.FROM_DCCODE'), // 공급센터
			children: [
				{ dataField: 'fromDccode', headerText: t('lbl.DCCODE'), dataType: 'code', editable: false }, // 물류센터
				{ dataField: 'fromDcname', headerText: t('lbl.DCNAME'), editable: false }, // 물류센터명
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'), // 공급받는센터
			children: [
				{ dataField: 'toDccode', headerText: t('lbl.DCCODE'), dataType: 'code', editable: false }, // 물류센터
				{ dataField: 'toDcname', headerText: t('lbl.DCNAME'), editable: false }, // 물류센터명
			],
		},
		{ dataField: 'toSku', headerText: t('lbl.SKU'), dataType: 'code', editable: false }, // 상품코드
		{ dataField: 'skuName', headerText: t('lbl.SKUNM'), editable: false }, // 상품명
		{ dataField: 'fromUom', headerText: t('lbl.UOM'), dataType: 'code', editable: false }, // 단위
		{ dataField: 'toStockgradeName', headerText: t('lbl.STOCKGRADE'), dataType: 'code', editable: false }, // 재고속성
		{
			dataField: 'toOrderqty',
			headerText: t('lbl.TRANQTY'),
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		}, // 작업수량
		{ dataField: 'processflag', headerText: t('lbl.PROCESSFLAG'), dataType: 'code', editable: false }, // 처리결과
		{ dataField: 'processmsg', headerText: t('lbl.PROCESSMSG'), dataType: 'default', editable: false }, // 처리메시지
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: false,
		//independentAllCheckBox: true,
		fillColumnSizeMode: false,
		showFooter: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.processflag == 'E') {
				// 글자색
				return 'gc-user32';
			}
			return '';
		},
	};
	const gridProps1 = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: false,
		//independentAllCheckBox: true,
		fillColumnSizeMode: true,
		showFooter: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.processflag != 'Y') {
				// 글자색
				return 'gc-user32';
			}
			return '';
		},
	};

	// FooterLayout Props
	const footerLayout = [
		{ labelText: t('lbl.TOTAL'), positionField: gridCol[0].dataField }, // 합계
		{ dataField: 'toOrderqty', positionField: 'toOrderqty', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 이동수량 합계
	];
	const footerLayout1 = [
		{ labelText: t('lbl.TOTAL'), positionField: gridCol[0].dataField }, // 합계
		{ dataField: 'toOrderqty', positionField: 'toOrderqty', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 이동수량 합계
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef2, // 타겟 그리드 Ref
		btnArr: [],
	};
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef2, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		const gridRef = gridRef2.current;
		if (gridRef) {
			gridRef?.setGridData(gridData3);
			gridRef?.setSelectionByIndex(0, 0);

			if (gridData3.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData3]);

	useEffect(() => {
		const gridRef = gridRef3.current;
		if (gridRef) {
			gridRef?.setGridData(gridData4);
			gridRef?.setSelectionByIndex(0, 0);

			if (gridData4.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData4]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef2?.current?.resize?.('100%', '100%');
		gridRef3?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<Splitter
			direction="vertical"
			onResizing={resizeAllGrids}
			onResizeEnd={resizeAllGrids}
			items={[
				<>
					<AGrid dataProps={'row-single'} style={{ padding: '10px 0', marginBottom: 0 }}>
						<GridTopBtn gridBtn={gridBtn} gridTitle={`재고이동 ${t('lbl.LIST')}`} totalCnt={gridData3?.length} />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={gridRef2} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
					</GridAutoHeight>
				</>,
				<>
					<AGrid dataProps={'row-single'} style={{ padding: '10px 0', marginBottom: 0 }}>
						<GridTopBtn gridBtn={gridBtn1} gridTitle={`STO ${t('lbl.LIST')}`} totalCnt={gridData4?.length} />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={gridRef3} columnLayout={gridCol1} gridProps={gridProps1} footerLayout={footerLayout1} />
					</GridAutoHeight>
				</>,
			]}
		/>
	);
};
export default RtQCConfirmDetail3;
