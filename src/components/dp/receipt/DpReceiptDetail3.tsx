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
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// Redux
// API Call Function

const DpReceiptDetail3 = ({ gridRef4, gridDataResult }: any) => {
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
		{
			headerText: t('lbl.FROM_DCCODE'), // 공급센터
			children: [
				{
					dataField: 'fromDccode',
					headerText: t('lbl.DCCODE'), // 물류센터
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'fromDcname',
					headerText: t('lbl.DCNAME'), // 물류센터명
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'), // 공급받는센터
			children: [
				{
					dataField: 'toDccode',
					headerText: t('lbl.DCCODE'), // 물류센터
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'toDcname',
					headerText: t('lbl.DCNAME'), // 물류센터명
					editable: false,
				},
			],
		},
		{
			dataField: 'toSku',
			headerText: t('lbl.SKU'), // 상품코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'skuName',
			headerText: t('lbl.SKUNM'), // 상품명
			editable: false,
		},
		{
			dataField: 'fromUom',
			headerText: t('lbl.UOM'), // 단위
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toStockgradeName',
			headerText: t('lbl.STOCKGRADE'), // 재고속성
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toOrderqty',
			headerText: t('lbl.TRANQTY'), // 작업수량
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'processflag',
			headerText: 'PROCESSFLAG',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'processmsg',
			headerText: 'PROCESSMSG',
			dataType: 'default',
			editable: false,
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: false,
		//independentAllCheckBox: true,
		fillColumnSizeMode: true,
		showFooter: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.processflag == 'E') {
				// 글자색
				return 'gc-user32';
			}
			return '';
		},
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},
		{ dataField: 'toOrderqty', positionField: 'toOrderqty', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 이동수량 합계
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef4, // 타겟 그리드 Ref
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
		if (gridRef4.current) {
			// 그리드 초기화
			gridRef4.current?.setGridData(gridDataResult);
			gridRef4.current?.setSelectionByIndex(0, 0);

			if (gridRef4.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef4.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef4.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridDataResult]);

	useEffect(() => {
		//
	}, []);

	return (
		<>
			<AGrid dataProps={'row-single'} style={{ marginTop: '15px' }}>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={0} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={gridRef4} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>
		</>
	);
};
export default DpReceiptDetail3;
