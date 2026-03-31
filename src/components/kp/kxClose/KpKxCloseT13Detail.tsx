/*
 ############################################################################
 # FiledataField    : KpKxCloseT13Detail.tsx
 # Description      : 재고비교
 # Author           : sss
 # Since            : 25.07.04
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';

// Lib
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component

// Type

// API

const KpKxCloseT13Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	ref.gridRef = useRef<any>(null);
	const { t } = useTranslation();

	const qtyColorFunc = (_rowIndex: number, _columnIndex: number, _value: any, _headerText: string, item: any) => {
		// 상태에 따른 스타일 적용 - CLASS명 반환
		if (item.kxQty !== item.fwQty) {
			return 'bg-warning';
		}
	};

	const getGridCol = () => {
		return [
			{
				headerText: t('lbl.DCCODE'), // 센터
				dataField: 'dcCode',
				dataType: 'text',
			},
			{
				headerText: t('lbl.ORGANIZE'), // 창고
				dataField: 'organize',
				dataType: 'text',
			},
			{
				headerText: t('lbl.ORGANIZENAME'), // 창고명
				dataField: 'organizeName',
				dataType: 'text',
			},
			{
				headerText: t('lbl.SKU'), // 상품
				dataField: 'sku',
				dataType: 'text',
			},
			{
				headerText: t('lbl.SKUNM'), // 상품명
				dataField: 'skuName',
				dataType: 'text',
			},
			{
				headerText: 'FW' + t('lbl.STOCKQTY'), // FW재고량
				dataField: 'fwQty',
				dataType: 'numeric',
			},
			{
				headerText: 'KX' + t('lbl.STOCKQTY'), // KX재고량
				dataField: 'kxQty',
				dataType: 'numeric',
			},
			{
				headerText: t('lbl.DIFFQTY') + '(FW-KX)', // 차이량(FW-KX)
				dataField: 'diffQty',
				dataType: 'numeric',
				styleFunction: qtyColorFunc,
			},
			{
				headerText: t('lbl.UOM'), // 단위
				dataField: 'uom',
				dataType: 'text',
			},
		];
	};

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	// 그리드 속성 설정
	const gridProps = {};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
				<GridTopBtn gridBtn={{ tGridRef: ref.gridRef }} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref.gridRef} columnLayout={getGridCol()} gridProps={gridProps} />
			</GridAutoHeight>
		</>
	);
});

export default KpKxCloseT13Detail;
