/*
 ############################################################################
 # FiledataField	: BarChart.tsx
 # Description		: ChartJS 바차트
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import './Chart.css';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

const BarChart = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const chartRef01 = useRef(null);
	const chartRef02 = useRef(null);

	const [data, setData] = useState({
		labels: [],
		datasets: [],
	});

	const stackedOption: object = {
		responsive: true,
		maintainAspectRatio: false,
		maxBarThickness: 50, // bar 굵기, datasets에서 별도 관리 가능
		plugins: {
			// title
			title: {
				display: false,
				text: 'Chart.js Bar Chart',
			},
			// 목차
			legend: {
				display: true,
				position: 'top',
			},
		},
		scales: {
			x: {
				stacked: true,
			},
			y: {
				stacked: true,
				suggestedMin: 0,
				suggestedMax: 120,
			},
		},
	};

	// 경계선
	const lineOption: object = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {},
			y: {
				suggestedMin: 0,
				suggestedMax: 60,
			},
		},
		plugins: {
			// title
			title: {
				display: false,
				text: 'Chart.js Bar line Chart',
			},
			// 목차
			legend: {
				display: true,
				position: 'top',
			},
			// 경계선 옵션
			annotation: {
				annotations: {
					line1: {
						type: 'line',
						borderDash: [6, 6],
						borderColor: 'orange',
						borderWidth: 1,
						scaleID: 'y',
						value: 23,
						// yMin: 23,
						// yMax: 23,
					},
					line2: {
						type: 'line',
						borderDash: [6, 6],
						borderColor: 'red',
						borderWidth: 1,
						scaleID: 'y',
						value: 42,
						// yMin: 42,
						// yMax: 42,
					},
				},
			},
		},
	};

	/**
	 * =====================================================================
	 *	02. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		setData(data => {
			data = {
				labels: ['January', 'February', 'March', 'April'],
				datasets: [
					{
						label: 'Data1',
						data: [20, 40, 10, 30],
						backgroundColor: 'red',
					},
					{
						label: 'Data2',
						data: [50, 10, 10, 30],
						backgroundColor: 'blue',
					},
					{
						label: 'Data3',
						data: [10, 50, 30, 20],
						backgroundColor: 'green',
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
					<p>Bar Chart (ChartJS)</p>
				</div>
				<div id="chart" className="chart-form">
					<div className="chart-block">
						<Bar ref={chartRef01} data={data} options={stackedOption} />
						<div style={{ textAlign: 'center' }}>스택 차트 (두께)</div>
					</div>
					<div className="chart-block">
						<Bar ref={chartRef02} data={data} options={lineOption} />
						<div style={{ textAlign: 'center' }}>경계선</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default BarChart;
