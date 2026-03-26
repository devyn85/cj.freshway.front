/*
 ############################################################################
 # FiledataField	: StExdcTransIndicatorVDetail.tsx
 # Description		: 외부창고 지표 상세 화면
 # Author			    :
 # Since			    : 26.03.18
 ############################################################################
*/

import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReact';
import type { ChartData, ChartOptions } from 'chart.js';
import 'chart.js/auto';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import styled from 'styled-components';

type TrendDirection = 'up' | 'down';

type SummaryItem = {
	title: string;
	main: string;
	compareRate: string;
	compareValue: string;
	compareRateDirection: TrendDirection;
	compareValueDirection: TrendDirection;
};

export const StExdcTransIndicatorVDetail = forwardRef((props: any, ref: any) => {
	const chartRef = useRef<any>(null);

	const monthlyLabels = [
		'25년 1월',
		'25년 2월',
		'25년 3월',
		'25년 4월',
		'25년 5월',
		'25년 6월',
		'25년 7월',
		'25년 8월',
		'25년 9월',
		'25년 10월',
	];

	const defaultChartData: ChartData<'bar' | 'line', number[], string> = {
		labels: monthlyLabels,
		datasets: [
			{
				type: 'bar',
				label: '입고',
				data: [935, 760, 817, 935, 760, 817, 0, 0, 0, 0],
				backgroundColor: '#0b5872',
				borderColor: '#0b5872',
				borderWidth: 1,
				barThickness: 16,
				order: 2,
				yAxisID: 'y',
			},
			{
				type: 'bar',
				label: '출고',
				data: [5189, 4643, 3844, 5189, 4643, 3844, 0, 0, 0, 0],
				backgroundColor: '#ed7d31',
				borderColor: '#ed7d31',
				borderWidth: 1,
				barThickness: 16,
				order: 2,
				yAxisID: 'y1',
			},
			{
				type: 'line',
				label: '보관료',
				data: [3.8, 4.6, 4.9, 3.8, 4.6, 4.9, 0, 0, 0, 0],
				borderColor: '#2ca7df',
				backgroundColor: '#2ca7df',
				borderWidth: 2,
				pointRadius: 3,
				pointHoverRadius: 4,
				tension: 0,
				order: 1,
				yAxisID: 'y',
			},
		],
	};

	const [chartData, setChartData] = useState<ChartData<'bar' | 'line', number[], string>>(defaultChartData);

	const chartOptions: ChartOptions<'bar' | 'line'> = useMemo(
		() => ({
			responsive: true,
			maintainAspectRatio: false,
			layout: {
				padding: {
					top: 6,
					right: 10,
					bottom: 4,
					left: 10,
				},
			},
			plugins: {
				legend: {
					display: true,
					position: 'bottom',
					align: 'center',
					labels: {
						boxWidth: 12,
						boxHeight: 12,
						padding: 14,
						color: '#444',
						font: {
							size: 11,
						},
					},
				},
				title: {
					display: true,
					text: '외부창고 입출고 마감 현황',
					color: '#666',
					font: {
						size: 12,
						weight: 'normal',
					},
					padding: {
						top: 4,
						bottom: 10,
					},
				},
				tooltip: {
					enabled: true,
				},
			},
			scales: {
				x: {
					grid: {
						display: false,
					},
					ticks: {
						color: '#666',
						font: {
							size: 10,
						},
					},
					border: {
						color: '#cfcfcf',
					},
				},
				y: {
					position: 'left',
					min: 0,
					max: 6,
					ticks: {
						stepSize: 1,
						color: '#666',
						font: {
							size: 10,
						},
					},
					grid: {
						color: '#e3e3e3',
					},
					border: {
						color: '#cfcfcf',
					},
				},
				y1: {
					position: 'right',
					min: 0,
					max: 6000,
					grid: {
						drawOnChartArea: false,
					},
					ticks: {
						stepSize: 1000,
						color: '#666',
						font: {
							size: 10,
						},
						callback: value => Number(value).toLocaleString(),
					},
					border: {
						color: '#cfcfcf',
					},
				},
			},
		}),
		[],
	);

	const summaryData: SummaryItem[] = [
		{
			title: '입고',
			main: '817건',
			compareRate: '7.5%',
			compareValue: '57건',
			compareRateDirection: 'up',
			compareValueDirection: 'up',
		},
		{
			title: '출고',
			main: '3844건',
			compareRate: '20.8%',
			compareValue: '799건',
			compareRateDirection: 'down',
			compareValueDirection: 'down',
		},
		{
			title: '보관료',
			main: '6.1억',
			compareRate: '6.6%',
			compareValue: '0.4억',
			compareRateDirection: 'up',
			compareValueDirection: 'up',
		},
	];

	const gridProps = {
		fillColumnSizeMode: false,
		enableColumnResize: true,
		enableFilter: true,
		editable: false,
	};

	const gridCol1 = [
		{ dataField: 'gubun', headerText: '구분', dataType: 'string', editable: false, formatString: '#,##0.###' },
		{ dataField: 'avg', headerText: '25년 1월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'acc', headerText: '25년 2월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm01', headerText: '25년 3월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm02', headerText: '25년 4월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm03', headerText: '25년 5월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm04', headerText: '25년 6월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm05', headerText: '25년 7월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm06', headerText: '25년 8월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm07', headerText: '25년 9월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm08', headerText: '25년 10월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm09', headerText: '25년 11월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm10', headerText: '25년 12월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
	];

	const gridCol2 = [
		{ dataField: 'gubun', headerText: '창고코드', dataType: 'string', editable: false, formatString: '#,##0.###' },
		{ dataField: 'avg', headerText: '창고명', editable: false },
		{ dataField: 'avg', headerText: '설명전환', editable: false },
		{ dataField: 'avg', headerText: '설명변수', editable: false },
		{ dataField: 'acc', headerText: '25년 2월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm01', headerText: '출고', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm02', headerText: '입고', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
	];

	useEffect(() => {
		if (!Array.isArray(props?.chartData?.labels) || !Array.isArray(props?.chartData?.datasets)) return;
		setChartData(props.chartData);
	}, [props?.chartData]);

	return (
		<Container>
			<Section>
				<GridTopBtn gridTitle={'전월대비'} style={{ paddingBottom: 5 }} />
				<SummaryTablesRow>
					{summaryData.map(item => (
						<SummaryMiniTable key={item.title}>
							<SummaryMiniTableTitle>{item.title}</SummaryMiniTableTitle>
							<SummaryMiniTableMain>{item.main}</SummaryMiniTableMain>
							<SummaryMiniTableTrend>
								<TrendText>
									<TrendArrow $direction={item.compareRateDirection}>
										{item.compareRateDirection === 'up' ? '▲' : '▼'}
									</TrendArrow>
									{item.compareRate}
								</TrendText>
							</SummaryMiniTableTrend>
							<SummaryMiniTableTrend>
								<TrendText>
									<TrendArrow $direction={item.compareValueDirection}>
										{item.compareValueDirection === 'up' ? '▲' : '▼'}
									</TrendArrow>
									{item.compareValue}
								</TrendText>
							</SummaryMiniTableTrend>
						</SummaryMiniTable>
					))}
				</SummaryTablesRow>
			</Section>
			<Section>
				<GridTopBtn gridTitle={'전년동월대비'} style={{ paddingBottom: 5 }} />
				<ChartPanel>
					<ChartInner>
						<Chart ref={chartRef} type="bar" data={chartData} options={chartOptions} />
					</ChartInner>
				</ChartPanel>
			</Section>

			<>
				<GridTopBtn gridTitle={'외부창고정산/마감현황'} style={{ paddingBottom: 5 }} />
				<GridAutoHeight>
					<AUIGrid columnLayout={gridCol1} gridProps={gridProps} ref={ref.gridRef1} />
				</GridAutoHeight>
			</>
			<>
				<GridTopBtn gridTitle={'외부창고물동현황'} style={{ paddingBottom: 5, paddingTop: 5 }} />
				<GridAutoHeight>
					<AUIGrid columnLayout={gridCol2} gridProps={gridProps} ref={ref.gridRef2} />
				</GridAutoHeight>
			</>
		</Container>
	);
});

const borderColor = '#e5e5e5';
const headerBg = '#f2f2f2';

const Container = styled.div`
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding-bottom: 15px;
`;

const Section = styled.div`
	padding: 4px 4px 6px;
`;

const SummaryTablesRow = styled.div`
	display: flex;
	align-items: stretch;
	gap: 30px;
`;

const SummaryMiniTable = styled.div`
	width: 162px;
	border: 1px solid ${borderColor};
	background: #ffffff;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 24px 28px 28px;
	border-radius: 4px;
`;

const SummaryMiniTableTitle = styled.div`
	grid-column: 1 / 3;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${headerBg};
	border-bottom: 1px solid ${borderColor};
	font-size: 11px;
	font-weight: 700;
`;

const SummaryMiniTableMain = styled.div`
	grid-row: 2 / 5;
	display: flex;
	align-items: center;
	justify-content: center;
	border-right: 1px solid ${borderColor};
	font-size: 11px;
	font-weight: 700;
`;

const SummaryMiniTableTrend = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 11px;
	font-weight: 700;

	&:nth-child(3) {
		border-bottom: 1px solid ${borderColor};
	}
`;

const TrendText = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 1px;
	color: #111111;
`;

const TrendArrow = styled.span<{ $direction: TrendDirection }>`
	color: ${({ $direction }) => ($direction === 'up' ? '#d90000' : '#004de7')};
	font-weight: 700;
`;

const ChartPanel = styled.div`
	height: 210px;
	box-sizing: border-box;
`;

const ChartInner = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
`;
