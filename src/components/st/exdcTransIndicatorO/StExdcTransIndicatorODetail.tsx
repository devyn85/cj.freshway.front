/*
 ############################################################################
 # FiledataField	: StExdcTransIndicatorODetail.tsx
 # Description		: 외부비축재고속성변경 페이징 및 상세영역
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.05.25
 ############################################################################
*/
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { Form } from 'antd';
import 'chart.js/auto';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';

import { useTranslation } from 'react-i18next';

const StExdcTransIndicatorODetail = forwardRef((props: any, refs: any) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();

	refs.gridRef = useRef();
	refs.gridRef1 = useRef();
	refs.gridRef2 = useRef();
	const chartRef = useRef(null);

	const [detailGridData, setDetailGridData] = useState([]);

	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [],
	});

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		layout: {
			padding: {
				top: 8,
				right: 8,
				bottom: 8,
				left: 8,
			},
		},
		plugins: {
			legend: {
				display: true,
				position: 'bottom',
				fullSize: true,
				labels: {
					boxWidth: 14,
					boxHeight: 14,
					padding: 16,
					usePointStyle: false,
				},
			},
		},
		scales: {
			x: {
				title: {
					display: false,
					text: '지역',
				},
			},
			y: {
				suggestedMin: 0,
				suggestedMax: 0.5,
				title: {
					display: false,
					text: '수량',
				},
			},
		},
	} as const;

	const gridCol = [
		{ dataField: 'gubun', headerText: '구분', dataType: 'string', editable: false, formatString: '#,##0.###' },
		{ dataField: 'avg', headerText: '평균', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'acc', headerText: '누계', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm01', headerText: '1월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm02', headerText: '2월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm03', headerText: '3월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm04', headerText: '4월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm05', headerText: '5월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm06', headerText: '6월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm07', headerText: '7월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm08', headerText: '8월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm09', headerText: '9월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm10', headerText: '10월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm11', headerText: '11월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm12', headerText: '12월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
	];

	const gridCol1 = [
		{ dataField: 'gubun', headerText: '구분', dataType: 'string', editable: false, formatString: '#,##0.###' },
		{ dataField: 'avg', headerText: '평균', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'acc', headerText: '누계', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm01', headerText: '1월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm02', headerText: '2월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm03', headerText: '3월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm04', headerText: '4월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm05', headerText: '5월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm06', headerText: '6월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm07', headerText: '7월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm08', headerText: '8월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm09', headerText: '9월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm10', headerText: '10월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm11', headerText: '11월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm12', headerText: '12월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
	];

	const gridCol2 = [
		{ dataField: 'gubun', headerText: '구분', dataType: 'string', editable: false, formatString: '#,##0.###' },
		{ dataField: 'avg', headerText: '평균', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'acc', headerText: '누계', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm01', headerText: '1월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm02', headerText: '2월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm03', headerText: '3월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm04', headerText: '4월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm05', headerText: '5월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm06', headerText: '6월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm07', headerText: '7월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm08', headerText: '8월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm09', headerText: '9월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm10', headerText: '10월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm11', headerText: '11월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
		{ dataField: 'm12', headerText: '12월', dataType: 'numeric', editable: false, formatString: '#,##0.###' },
	];
	const gridProps = {
		autoGridHeight: false,
		fillColumnSizeMode: true,
		enableColumnResize: true,
		enableFilter: true,
		editable: false,
	};

	const mockGridData0 = [
		{
			gubun: 'STO',
			avg: 12.3,
			acc: 147.6,
			m01: 10.1,
			m02: 11.2,
			m03: 12.4,
			m04: 13.1,
			m05: 11.8,
			m06: 12.9,
			m07: 13.4,
			m08: 12.7,
			m09: 11.9,
			m10: 12.2,
			m11: 11.6,
			m12: 12.3,
		},
		{
			gubun: 'SO',
			avg: 9.8,
			acc: 117.6,
			m01: 8.1,
			m02: 9.3,
			m03: 10.4,
			m04: 9.8,
			m05: 9.2,
			m06: 10.1,
			m07: 10.6,
			m08: 9.9,
			m09: 9.1,
			m10: 10.0,
			m11: 10.3,
			m12: 10.8,
		},
		{
			gubun: 'TR',
			avg: 7.4,
			acc: 88.8,
			m01: 6.2,
			m02: 7.1,
			m03: 7.6,
			m04: 7.2,
			m05: 7.9,
			m06: 8.1,
			m07: 7.8,
			m08: 7.4,
			m09: 7.0,
			m10: 7.5,
			m11: 7.3,
			m12: 7.7,
		},
		{
			gubun: '합계',
			avg: 29.5,
			acc: 354.0,
			m01: 24.4,
			m02: 27.6,
			m03: 30.4,
			m04: 30.1,
			m05: 28.9,
			m06: 31.1,
			m07: 31.8,
			m08: 30.0,
			m09: 28.0,
			m10: 29.7,
			m11: 29.2,
			m12: 30.8,
		},
	];

	const mockGridData1 = [
		{
			gubun: 'STO',
			avg: 320.5,
			acc: 3846.0,
			m01: 290.0,
			m02: 300.0,
			m03: 315.0,
			m04: 330.0,
			m05: 325.0,
			m06: 335.0,
			m07: 340.0,
			m08: 322.0,
			m09: 315.0,
			m10: 318.0,
			m11: 325.0,
			m12: 331.0,
		},
		{
			gubun: 'SO',
			avg: 280.2,
			acc: 3362.4,
			m01: 255.0,
			m02: 268.0,
			m03: 272.0,
			m04: 281.0,
			m05: 286.0,
			m06: 290.0,
			m07: 295.0,
			m08: 282.0,
			m09: 276.0,
			m10: 279.0,
			m11: 288.0,
			m12: 292.0,
		},
		{
			gubun: 'TR',
			avg: 195.8,
			acc: 2349.6,
			m01: 180.0,
			m02: 188.0,
			m03: 192.0,
			m04: 198.0,
			m05: 201.0,
			m06: 205.0,
			m07: 210.0,
			m08: 197.0,
			m09: 193.0,
			m10: 196.0,
			m11: 194.0,
			m12: 195.0,
		},
		{
			gubun: '합계',
			avg: 796.5,
			acc: 9558.0,
			m01: 725.0,
			m02: 756.0,
			m03: 779.0,
			m04: 809.0,
			m05: 812.0,
			m06: 830.0,
			m07: 845.0,
			m08: 801.0,
			m09: 784.0,
			m10: 793.0,
			m11: 807.0,
			m12: 818.0,
		},
	];

	const mockGridData2 = [
		{
			gubun: 'STO',
			avg: 0.038,
			acc: 0.456,
			m01: 0.035,
			m02: 0.037,
			m03: 0.039,
			m04: 0.04,
			m05: 0.038,
			m06: 0.039,
			m07: 0.04,
			m08: 0.039,
			m09: 0.038,
			m10: 0.037,
			m11: 0.038,
			m12: 0.039,
		},
		{
			gubun: 'SO',
			avg: 0.033,
			acc: 0.396,
			m01: 0.032,
			m02: 0.033,
			m03: 0.034,
			m04: 0.034,
			m05: 0.032,
			m06: 0.033,
			m07: 0.034,
			m08: 0.033,
			m09: 0.032,
			m10: 0.033,
			m11: 0.034,
			m12: 0.034,
		},
		{
			gubun: 'TR',
			avg: 0.028,
			acc: 0.336,
			m01: 0.027,
			m02: 0.028,
			m03: 0.028,
			m04: 0.029,
			m05: 0.028,
			m06: 0.028,
			m07: 0.029,
			m08: 0.028,
			m09: 0.027,
			m10: 0.028,
			m11: 0.028,
			m12: 0.028,
		},
		{
			gubun: '합계',
			avg: 0.099,
			acc: 1.188,
			m01: 0.094,
			m02: 0.098,
			m03: 0.101,
			m04: 0.103,
			m05: 0.098,
			m06: 0.1,
			m07: 0.103,
			m08: 0.1,
			m09: 0.097,
			m10: 0.098,
			m11: 0.1,
			m12: 0.101,
		},
	];

	const makeChartData = (list: any[]) => {
		const stoData = list.find(item => item.gubun === 'STO');
		const soData = list.find(item => item.gubun === 'SO');

		return {
			labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			datasets: [
				{
					label: 'STO',
					data: [
						stoData?.m01 ?? 0,
						stoData?.m02 ?? 0,
						stoData?.m03 ?? 0,
						stoData?.m04 ?? 0,
						stoData?.m05 ?? 0,
						stoData?.m06 ?? 0,
						stoData?.m07 ?? 0,
						stoData?.m08 ?? 0,
						stoData?.m09 ?? 0,
						stoData?.m10 ?? 0,
						stoData?.m11 ?? 0,
						stoData?.m12 ?? 0,
					],
					backgroundColor: '#1b7f3a',
					borderColor: '#1b7f3a',
					borderWidth: 1,
					barThickness: 18,
				},
				{
					label: 'SO',
					data: [
						soData?.m01 ?? 0,
						soData?.m02 ?? 0,
						soData?.m03 ?? 0,
						soData?.m04 ?? 0,
						soData?.m05 ?? 0,
						soData?.m06 ?? 0,
						soData?.m07 ?? 0,
						soData?.m08 ?? 0,
						soData?.m09 ?? 0,
						soData?.m10 ?? 0,
						soData?.m11 ?? 0,
						soData?.m12 ?? 0,
					],
					backgroundColor: '#8fd0f3',
					borderColor: '#8fd0f3',
					borderWidth: 1,
					barThickness: 18,
				},
			],
		};
	};

	const gridBtn: GridBtnPropsType = {
		tGridRef: refs.gridRef,
		btnArr: [],
	};

	useEffect(() => {
		const hasServerList = Array.isArray(props.data?.list) && props.data.list.length > 0;

		if (hasServerList) {
			const list = props.data.list;
			refs.gridRef.current?.setGridData(list.slice(0, 4));
			refs.gridRef1.current?.setGridData(list.slice(4, 8));
			refs.gridRef2.current?.setGridData(list.slice(8, 12));
			return;
		}

		refs.gridRef.current?.setGridData(mockGridData0);
		refs.gridRef1.current?.setGridData(mockGridData1);
		refs.gridRef2.current?.setGridData(mockGridData2);
	}, [props.data]);

	useEffect(() => {
		const hasServerList = Array.isArray(props.data?.list) && props.data.list.length > 0;
		setChartData(makeChartData(hasServerList ? props.data.list : mockGridData0));
	}, [props.data]);

	return (
		<Wrap>
			<ChartSection key="StExdcTransIndicatorO-chart">
				<GridTopBtn gridTitle={'주문유형별운송료(단위:억원)'} style={{ paddingBottom: 10 }} />
				<ChartArea>
					<Bar ref={chartRef} data={chartData} options={chartOptions} />
				</ChartArea>
			</ChartSection>

			<>
				<GridTopBtn gridTitle={'년도별운송료(단위:억원)'} style={{ padding: '10px 0' }} />
				<GridAutoHeight>
					<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={refs.gridRef} />
				</GridAutoHeight>
			</>
			<>
				<GridTopBtn gridTitle={'출고량(단위:억원)'} style={{ padding: '10px 0' }} />
				<GridAutoHeight>
					<AUIGrid columnLayout={gridCol1} gridProps={gridProps} ref={refs.gridRef1} />
				</GridAutoHeight>
			</>
			<>
				<GridTopBtn gridTitle={'KG당운송료(단위:억원)'} style={{ padding: '10px 0' }} />
				<GridAutoHeight>
					<AUIGrid columnLayout={gridCol2} gridProps={gridProps} ref={refs.gridRef2} />
				</GridAutoHeight>
			</>
		</Wrap>
	);
});

const Wrap = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	padding-bottom: 15px;
`;

const ChartSection = styled.div`
	height: 100%;
	min-height: 260px;
	display: flex;
	flex-direction: column;
`;

const ChartArea = styled.div`
	flex: 1;
	min-height: 220px;
	position: relative;
`;

export default StExdcTransIndicatorODetail;
