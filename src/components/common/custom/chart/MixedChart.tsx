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
import {
	Chart as ChartJS,
	LinearScale,
	CategoryScale,
	BarElement,
	PointElement,
	LineElement,
	Legend,
	Tooltip,
	LineController,
	BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

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

const MixedChart = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const chartRef = useRef(null);

	const [data, setData] = useState({
		labels: [],
		datasets: [],
	});

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			y: {
				suggestedMin: 0,
				suggestedMax: 60,
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
						type: 'bar',
						label: 'Bar Dataset',
						data: [10, 20, 30, 40],
						backgroundColor: 'rgba(255, 99, 132, 0.2)',
						order: 1,
					},
					{
						type: 'line',
						label: 'Line Dataset',
						data: [15, 22, 27, 35],
						fill: false,
						borderColor: 'rgb(54, 162, 235)',
						backgroundColor: 'rgb(54, 162, 235)',
						order: 2,
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
					<p>Mixed Chart (ChartJS)</p>
				</div>
				<div id="chart" className="chart-form">
					<div className="chart-block">
						<Chart ref={chartRef} type="bar" data={data} options={options} />
						<div style={{ textAlign: 'center' }}>Bar + line</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MixedChart;
