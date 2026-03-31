/*
 ############################################################################
 # FiledataField	: LabelChart.tsx
 # Description		: ChartJS 라벨 차트
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import './Chart.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import chartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);

const LabelChart = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const DATALABEL_PLUGIN: any = chartDataLabels;

	const chartRef = useRef(null);

	const [data, setData] = useState({
		labels: [],
		datasets: [],
	});

	// 도넛 + 센터
	const options: object = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			// title
			title: {
				display: false,
				text: 'Chart.js Doughnut Chart',
			},
			// 목차
			legend: {
				display: true,
				position: 'bottom',
			},
			// 툴팁 설정
			tooltip: {
				boxWidth: 15,
				bodyFont: {
					size: 14,
				},
			},
			datalabels: {
				borderRadius: 25,
				borderWidth: 2,
				color: 'white',
				font: {
					weight: 'bold',
				},
				formatter: Math.round,
				backgroundColor: function (context: any) {
					return context.dataset.backgroundColor;
				},
			},
		},
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		// data
		setData(data => {
			data = {
				labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre'],
				datasets: [
					{
						label: '',
						data: [30, 40, 60, 70, 5],
						backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
					},
				],
			};
			return { ...data };
		});
	}, []);

	return (
		<>
			<div className="chart-container">
				<div className="chart-title">
					<p>Label Chart (ChartJS)</p>
				</div>
				<div id="chart" className="chart-form">
					<div className="chart-block">
						<Doughnut ref={chartRef} data={data} options={options} plugins={[DATALABEL_PLUGIN]} />
						<div style={{ textAlign: 'center' }}>도넛 라벨</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default LabelChart;
