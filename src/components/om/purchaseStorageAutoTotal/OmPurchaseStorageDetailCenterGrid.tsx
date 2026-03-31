import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API Call Function
import { apiGetDetailOrderList } from '@/api/om/apiOmPurchaseStorageAutoTotal';
import GridAutoHeight from '@/components/common/GridAutoHeight';

interface OmPurchaseStorageDetailCenterGridProps {
	selectedRow?: any;
	onDataChange?: (data: any[]) => void;
}

const OmPurchaseStorageDetailCenterGrid = forwardRef((props: OmPurchaseStorageDetailCenterGridProps, ref: any) => {
	// 다국어
	const { t } = useTranslation();

	const [gridData, setGridData] = useState<any[]>([]);

	/**
	 * 그리드 컬럼 설정
	 */
	const getGridCol = () => {
		return [
			{
				dataField: 'dcCode',
				headerText: '물류센터',
				dataType: 'code',
			},
			{
				dataField: 'wdQty01',
				headerText: 'D+1일',
				dataType: 'numeric',
			},
			{
				dataField: 'wdQty02',
				headerText: 'D+2일',
				dataType: 'numeric',
			},
			{
				dataField: 'wdQty03',
				headerText: 'D+3일',
				dataType: 'numeric',
			},
			{
				dataField: 'wdQty04',
				headerText: 'D+4일',
				dataType: 'numeric',
			},
			{
				dataField: 'wdQty05',
				headerText: 'D+5일',
				dataType: 'numeric',
			},
			{
				dataField: 'wdQty06',
				headerText: 'D+6일',
				dataType: 'numeric',
			},
			{
				dataField: 'wdQty07',
				headerText: 'D+7일',
				dataType: 'numeric',
			},
			{
				dataField: 'wdQty08',
				headerText: 'D+8일',
				dataType: 'numeric',
			},
			{
				dataField: 'wdQty09',
				headerText: 'D+9일',
				dataType: 'numeric',
			},
			{
				dataField: 'wdQty10',
				headerText: 'D+10일',
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
		};
	};

	/**
	 * 그리드 데이터 조회 및 로드
	 * @param params
	 */
	const loadGridData = (params: any) => {
		if (!ref.current) return;

		ref.current.setGridData([]);
		apiGetDetailOrderList(params).then(res => {
			if (res.data && res.data.length > 0) {
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
				<GridTopBtn gridTitle="예측수불현황" />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref} columnLayout={getGridCol()} gridProps={getGridProps()} />
			</GridAutoHeight>
		</>
	);
});

export default OmPurchaseStorageDetailCenterGrid;
