/*
 ############################################################################
 # FiledataField	: Chart.tsx
 # Description		: 차트
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/
// lib
import { Form, Row, Button, Col } from 'antd';
// component
import MenuTitle from '@/components/common/custom/MenuTitle';
import Search from '@/assets/styled/Search/Search';
import DoughnutChart from '@/components/common/custom/chart/DoughnutChart';
import MixedChart from '@/components/common/custom/chart/MixedChart';
import BarChart from '@/components/common/custom/chart/BarChart';
import LabelChart from '@/components/common/custom/chart/LabelChart';
import ZoomChart from '@/components/common/custom/chart/ZoomChart';

const Chart = () => {
	// const { menu } = useLocation().state;

	const openPage = (params: string) => {
		let url = null;
		if (params === 'labels') {
			url = 'https://chartjs-plugin-datalabels.netlify.app/samples/charts/line.html';
		} else if (params === 'annotation') {
			url = 'https://www.chartjs.org/chartjs-plugin-annotation/latest/samples/intro.html';
		} else if (params === 'zoom') {
			url = 'https://www.chartjs.org/chartjs-plugin-zoom/latest/samples/basic.html';
		} else if (params === 'chart2') {
			url = 'https://react-chartjs-2.js.org/docs/migration-to-v4';
		} else {
			url = 'https://www.chartjs.org/docs/3.9.1/samples/information.html';
		}
		window.open(url, '_blank');
	};

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle />
			{/* 링크 */}
			<Search>
				<Form>
					<Row>
						<Col span={24}>
							<Form.Item label="샘플 Plugin 샘플">
								<Button type="link" onClick={() => openPage('chart2')}>
									React-ChartJS-2
								</Button>
								<Button type="link" onClick={() => openPage('charjs')}>
									기본 ChartJS
								</Button>
								<Button type="link" onClick={() => openPage('labels')}>
									라벨 ChartJS
								</Button>
								<Button type="link" onClick={() => openPage('annotation')}>
									경계선 ChartJS
								</Button>
								<Button type="link" onClick={() => openPage('zoom')}>
									Zoom ChartJS
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Search>
			{/* 도넛 차트 */}
			<DoughnutChart></DoughnutChart>
			{/* Mixed 차트 */}
			<MixedChart></MixedChart>
			{/* Bar 차트 */}
			<BarChart></BarChart>
			{/* 라벨 차트 */}
			<LabelChart></LabelChart>
			{/* 줌 차트 */}
			<ZoomChart></ZoomChart>
		</>
	);
};

export default Chart;
