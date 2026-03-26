import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API Call Function
import { apiGetDetailLeftList } from '@/api/om/apiOmPurchaseStorageAutoTotal';
import GridAutoHeight from '@/components/common/GridAutoHeight';

// Utils

interface OmPurchaseStorageDetailLeftGridProps {
	selectedRow?: any;
	onDataChange?: (data: any[]) => void;
}

const OmPurchaseStorageDetailLeftGrid = forwardRef((props: OmPurchaseStorageDetailLeftGridProps, ref: any) => {
	// 다국어
	const { t } = useTranslation();

	const [gridData, setGridData] = useState<any[]>([]);

	/**
	 * 그리드 컬럼 설정
	 */
	const getGridCol = () => {
		return [
			{
				dataField: 'fromDcCode',
				headerText: '수급센터',
				dataType: 'code',
			},
			{
				dataField: 'dcCode',
				headerText: '출고센터',
				dataType: 'code',
			},
			{
				dataField: 'sku',
				headerText: '상품코드',
				dataType: 'code',
			},
			{
				dataField: 'skuName',
				headerText: '상품명',
			},
			{
				dataField: 'uom',
				headerText: '단위',
				dataType: 'code',
			},
			{
				dataField: 'qty',
				headerText: '현재고수량',
				dataType: 'numeric',
			},
			{
				dataField: 'openQty',
				headerText: '가용재고수량',
				dataType: 'numeric',
			},
			{
				dataField: 'orderQty',
				headerText: '주문수량',
				dataType: 'numeric',
			},
			{
				dataField: 'openMinusOrderQty',
				headerText: '주문차감가용재고',
				dataType: 'numeric',
			},
			{
				dataField: 'stoOrderQty',
				headerText: '이체량',
				dataType: 'numeric',
			},
			{
				dataField: 'qtyPicked',
				headerText: '피킹재고',
				dataType: 'numeric',
			},
		];
	};

	/**
	 * 그리드 속성 설정
	 */
	const getGridProps = () => {
		return {
			editable: false,
			fillColumnSizeMode: false,
			enableColumnResize: true,
			showRowCheckColumn: false,
			enableFilter: true,
			showRowNumColumn: false,
			groupingFields: ['fromDcCode'],
			groupingSummary: {
				dataFields: ['qty', 'openQty', 'orderQty', 'openMinusOrderQty', 'stoOrderQty', 'qtyPicked'],
			},
			displayTreeOpen: true,
			enableCellMerge: true,
			cellMergeRowSpan: true,
			fillValueGroupingSummary: true,
			showBranchOnGrouping: false,
			adjustSummaryPosition: true,
			rowStyleFunction: (rowIndex: any, item: any) => {
				if (item._$isGroupSumField) {
					switch (item._$depth) {
						case 2:
							return 'aui-grid-row-depth1-style';
						case 3:
							return 'aui-grid-row-depth2-style';
						case 4:
						default:
							return 'aui-grid-row-depth-default-style';
					}
				}
			},
			showFooter: true,
		};
	};

	/**
	 * 그리드 푸터 레이아웃 설정
	 */
	const getFooterLayout = () => {
		return [
			{
				dataField: 'qty',
				positionField: 'qty',
				operation: 'SUM',
				formatString: '#,##0',
				style: 'right',
			},
			{
				dataField: 'openQty',
				positionField: 'openQty',
				operation: 'SUM',
				formatString: '#,##0',
				style: 'right',
			},
			{
				dataField: 'orderQty',
				positionField: 'orderQty',
				operation: 'SUM',
				formatString: '#,##0',
				style: 'right',
			},
			{
				dataField: 'openMinusOrderQty',
				positionField: 'openMinusOrderQty',
				operation: 'SUM',
				formatString: '#,##0',
				style: 'right',
			},
			{
				dataField: 'stoOrderQty',
				positionField: 'stoOrderQty',
				operation: 'SUM',
				formatString: '#,##0',
				style: 'right',
			},
			{
				dataField: 'qtyPicked',
				positionField: 'qtyPicked',
				operation: 'SUM',
				formatString: '#,##0',
				style: 'right',
			},
		];
	};

	/**
	 * 그리드 데이터 조회 및 로드
	 * @param params
	 */
	const loadGridData = (params: any) => {
		if (!ref.current) return;

		ref.current.setGridData([]);
		apiGetDetailLeftList(params).then(res => {
			if (res.data && res.data.length > 0) {
				for (const item of res.data) {
					item.openMinusOrderQty = item.openQty - item.orderQty;
				}
				setGridData(res.data);
				ref.current.setGridData(res.data);
				const colSizeList = ref.current.getFitColumnSizeList(true);
				ref.current.setColumnSizeList(colSizeList);
				props.onDataChange?.(res.data);
			}
		});
	};

	/**
	 * 선택된 행 변경 감지하여 데이터 로드
	 */
	useEffect(() => {
		if (props.selectedRow) {
			loadGridData(props.selectedRow);
		}
	}, [props.selectedRow]);

	return (
		<>
			<AGrid>
				<GridTopBtn gridTitle="센터 별 재고현황" />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref} columnLayout={getGridCol()} gridProps={getGridProps()} footerLayout={getFooterLayout()} />
			</GridAutoHeight>
		</>
	);
});

export default OmPurchaseStorageDetailLeftGrid;
