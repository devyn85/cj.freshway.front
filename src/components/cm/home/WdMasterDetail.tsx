/*
 ############################################################################
 # FiledataField  : NewMasterDetail.tsx
 # Description    : 신규 마스터 그리드 (리사이즈 최적화)
 ############################################################################
 */
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API
import GridAutoHeight from '@/components/common/GridAutoHeight';
import {
	BarController,
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineController,
	LineElement,
	PointElement,
	Tooltip,
} from 'chart.js';
import { Chart, getElementAtEvent } from 'react-chartjs-2';
import styled from 'styled-components';

ChartJS.register(
	LinearScale,
	CategoryScale,
	BarElement,
	PointElement,
	LineElement,
	Legend,
	Tooltip,
	LineController,
	BarController,
);

const NewMasterDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { searchDetailList, isActive, data, chartData, labels } = props;
	const chartRef = useRef(null);
	const { t } = useTranslation();

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				stacked: true,
			},
			y: {
				stacked: true,
				suggestedMin: 0,
				suggestedMax: 100,
			},
		},
	};

	// grid Ref
	ref.gridRefGrp = useRef();
	ref.gridRefDtl = useRef();

	// 신규 마스터 상세 그리드 칼럼 레이아웃 설정
	const gridColDtl = [
		{
			headerText: t('주문마감경로'),
			dataField: 'closeName',
			dataType: 'code',
		},
		{
			headerText: t('마감시간'),
			dataField: 'closeDate',
			dataType: 'date',
		},
		{
			headerText: t('주문건수'),
			dataField: 'orderCnt',
			dataType: 'numeric',
			formatString: '#,##0',
		},
		{
			headerText: t('물동량'),
			dataField: 'weight',
			dataType: 'numeric',
			formatString: '#,##0',
		},
	];

	// 신규 마스터 상세 그리드 속성 설정
	const gridPropsDtl = {
		editable: false,
		fillColumnSizeMode: true,
		showFooter: true,
	};

	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'closeName',
		},
		{
			dataField: 'orderCnt',
			positionField: 'orderCnt',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'weight',
			positionField: 'weight',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const onChartClick = (event: any) => {
		const { index } = getElementAtEvent(ref.gridRefGrp.current, event)[0];
		searchDetailList(labels[index]);
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		const gridRef = ref.gridRefDtl.current;
		if (gridRef) {
			gridRef?.setGridData(data);
			gridRef?.setSelectionByIndex(0, 0);

			if (data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [data]);

	return (
		<>
			<Wrap>
				<Item>
					<GridTopBtn gridTitle="물동량 및 라벨건수" style={{ marginBottom: '10px' }} />
					<ChartWrap id="chart">
						<Chart ref={ref.gridRefGrp} type="bar" data={chartData} options={options} onClick={onChartClick} />
					</ChartWrap>
				</Item>
				<Item>
					<GridTopBtn gridTitle={t('상세 내역')} style={{ marginBottom: '10px' }} />
					<GridAutoHeight id="new-master-detail-grid">
						<AUIGrid
							ref={ref.gridRefDtl}
							columnLayout={gridColDtl}
							gridProps={gridPropsDtl}
							footerLayout={footerLayout}
						/>
					</GridAutoHeight>
				</Item>
			</Wrap>
		</>
	);
});

const Wrap = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	gap: 8px;
`;

const Item = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const ChartWrap = styled.div`
	width: 100%;
	height: 100%;
`;

export default NewMasterDetail;
