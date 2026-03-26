/*
 ############################################################################
 # FiledataField	: ZoomChart.tsx
 # Description		: ChartJS 줌 차트
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import { Button } from 'antd';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, zoomPlugin);

const ZoomChart = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const wheelRef = useRef(null);
	const dragRef = useRef(null);

	const [data, setData] = useState({
		labels: [],
		datasets: [],
	});

	const wheelOption: object = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				type: 'category',
				min: 5,
				max: 12,
			},
			y: {
				type: 'linear',
			},
		},
		plugins: {
			zoom: {
				pan: {
					enabled: true,
					mode: 'xy',
					threshold: 5,
				},
				limits: {
					x: { min: 0, max: 12 },
					y: { min: 0, max: 100 },
				},
				zoom: {
					wheel: {
						enabled: true,
					},
					pinch: {
						enabled: true,
					},
					mode: 'xy',
				},
			},
		},
	};

	const dragOption: object = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			tooltip: false,
			zoom: {
				pan: {
					enabled: true,
					mode: 'x',
					modifierKey: 'ctrl',
				},
				zoom: {
					drag: {
						enabled: true,
					},
					mode: 'x',
				},
			},
		},
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 클릭 이벤트
	 */
	const onClick = () => {
		// zoom 초기화

		wheelRef.current.resetZoom();
		dragRef.current.resetZoom();
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		setData(data => {
			data = {
				labels: [
					'January',
					'February',
					'March',
					'April',
					'May',
					'June',
					'July',
					'August',
					'September',
					'October',
					'November',
					'December',
				],
				datasets: [
					{
						label: 'Data1',
						data: [20, 40, 10, 30, 80, 40, 85, 15, 30, 80, 10, 50],
						backgroundColor: 'red',
					},
					{
						label: 'Data2',
						data: [50, 10, 10, 30, 40, 10, 30, 80, 40, 85, 15, 40],
						backgroundColor: 'blue',
					},
					{
						label: 'Data3',
						data: [10, 50, 30, 20, 40, 10, 30, 80, 40, 85, 10, 50],
						backgroundColor: 'green',
					},
					{
						label: 'Data4',
						data: [70, 10, 10, 10, 10, 50, 30, 20, 40, 10, 80, 40],
						backgroundColor: 'maroon',
					},
					{
						label: 'Data5',
						data: [50, 30, 10, 10, 20, 40, 10, 30, 80, 40, 85, 90],
						backgroundColor: 'moccasin',
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
					<p style={{ marginRight: '20px' }}>Zoom Chart (ChartJS)</p>
					<Button onClick={onClick}>Drag Reset</Button>
				</div>

				<div id="chart" className="chart-form">
					<div className="chart-block">
						<Bar ref={wheelRef} data={data} options={wheelOption} />
						<div style={{ textAlign: 'center' }}>Wheel Zoom</div>
					</div>
					<div className="chart-block">
						<Bar ref={dragRef} data={data} options={dragOption} />
						<div style={{ textAlign: 'center' }}>Drag Zoom</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ZoomChart;
