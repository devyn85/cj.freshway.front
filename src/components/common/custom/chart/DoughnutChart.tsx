/*
 ############################################################################
 # FiledataField	: DoughnutChart.tsx
 # Description		: ChartJS 도넛 차트
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import './Chart.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import doughnutlabel from 'chartjs-plugin-doughnutlabel-v3';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const DOUGHNUTLABEL_PLUGIN: any = doughnutlabel;

	const chartRef01 = useRef(null);
	const chartRef02 = useRef(null);
	const chartRef03 = useRef(null);

	const [data, setData] = useState({
		labels: [],
		datasets: [],
	});

	const [customData, setCustomData] = useState({
		labels: [],
		datasets: [],
	});

	// 도넛 + 센터
	const doughnutOptions: object = {
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
				position: 'right',
			},
			// 툴팁 설정
			tooltip: {
				boxWidth: 15,
				bodyFont: {
					size: 14,
				},
			},
			// 가운데 라벨 설정
			doughnutLabel: {
				labels: [
					{
						text: 'Total',
						color: 'blue',
						font: {
							size: '20',
						},
					},
					{
						text: '1992',
						color: 'red',
						font: {
							size: '10',
						},
					},
				],
			},
		},
	};

	// 반도넛
	const halfOption: object = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			// 목차
			legend: {
				display: false,
			},
			// 툴팁 설정
			tooltip: {
				boxWidth: 15,
				bodyFont: {
					size: 14,
				},
			},
			// 가운데 라벨 설정
			doughnutLabel: {
				labels: [
					{
						text: '',
						color: '',
						font: {
							size: '150',
						},
					},
					{
						text: '2023',
						color: 'gray',
						font: {
							size: '35',
						},
					},
				],
			},
		},
		// 반도넛
		rotation: -90,
		circumference: 180,
	};

	const options: object = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			// 목차
			legend: {
				display: false,
			},
			// 툴팁 설정
			tooltip: {
				boxWidth: 15,
				bodyFont: {
					size: 14,
				},
			},
			// 가운데 라벨 설정
			doughnutLabel: {
				labels: [
					{
						text: '30%',
						color: 'red',
						font: {
							size: '50',
						},
					},
					{
						text: 'TODAY',
						color: 'lightgrey',
						font: {
							size: '25',
						},
					},
				],
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

		// custom data
		setCustomData(customData => {
			customData = {
				labels: ['Count', 'None'],
				datasets: [
					{
						label: '',
						data: [30, 70],
						backgroundColor: ['orange', 'gainsboro'],
						cutout: '90%', // 도넛 사이즈
					},
				],
			};
			return { ...customData };
		});
	}, []);

	return (
		<>
			<div className="chart-container">
				<div>
					<p>Doughnut Chart (ChartJS)</p>
				</div>
				<div id="chart" className="chart-form">
					<div className="chart-block">
						<Doughnut ref={chartRef01} data={data} options={doughnutOptions} plugins={[DOUGHNUTLABEL_PLUGIN]} />
						<div style={{ textAlign: 'center' }}>도넛 + 센터 custom</div>
					</div>
					<div className="chart-block">
						<Doughnut ref={chartRef02} data={data} options={halfOption} plugins={[DOUGHNUTLABEL_PLUGIN]} />
						<div style={{ textAlign: 'center' }}>반도넛</div>
					</div>
					<div className="chart-block">
						<Doughnut ref={chartRef03} data={customData} options={options} plugins={[DOUGHNUTLABEL_PLUGIN]} />
						<div style={{ textAlign: 'center' }}>도넛 굵기</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DoughnutChart;
