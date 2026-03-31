/*
 ############################################################################
 # FiledataField	: StExdcManualIndicatorDetail.tsx
 # Description		: 외부비축재고속성변경 페이징 및 상세영역
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.05.25
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineController,
	LineElement,
	PointElement,
	Tooltip,
} from 'chart.js';
import { forwardRef, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Tooltip, Legend);

const StExdcManualIndicatorDetail = forwardRef((props: any, refs: any) => {
	// =====================================================================
	//  01. 변수 선언부
	// =====================================================================
	// ==========================================================================
	// chart
	// ==========================================================================

	const chartRef = useRef(null);
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [],
	});

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: true, // 범례 표시
				position: 'bottom', // 범례 위치를 아래로 변경
			},
			title: {
				display: true,
				text: '발주추이 (그래프)', // 차트 제목 추가
				font: {
					size: 16,
				},
			},
		},
		scales: {
			x: {
				// x축 설정 추가
				title: {
					display: false, // x축 제목은 필요없을 듯
					text: '지역',
				},
			},
			y: {
				suggestedMin: 0,
				beginAtZero: true,
				title: {
					display: false, // y축 제목은 필요없을 듯
					text: '수량',
				},
			},
		},
	} as const;
	const { t } = useTranslation();

	refs.gridRef = useRef();
	refs.gridRef1 = useRef();
	refs.gridRef2 = useRef();

	// =====================================================================
	//  02. 함수
	// =====================================================================

	// 그리드 마스터 컬럼 설정
	const getGridHeaderCol = [
		{ dataField: 'cat', headerText: '구분', dataType: 'text', editable: false, visible: false },
		{ dataField: 'reasonnm', headerText: '구분', dataType: 'text', editable: false, visible: true },
		// 숫자 컬럼
		{
			dataField: 'prevYearAvg',
			headerText: '전년 月평균',
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.##',
		},
		{
			dataField: 'ytdSum',
			headerText: '금년누계건수',
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.##',
		},

		// 3개월 누계건수 (D-2, D-1, D)
		{
			headerText: '3개월 누계건수',
			children: [
				{ dataField: 'DMinus2Cnt', headerText: 'D-2', dataType: 'numeric', editable: false, formatString: '#,##0.##' },
				{ dataField: 'DMinus1Cnt', headerText: 'D-1', dataType: 'numeric', editable: false, formatString: '#,##0.##' },
				{ dataField: 'DCnt', headerText: 'D', dataType: 'numeric', editable: false, formatString: '#,##0.##' },
			],
		},
		// 비교
		{ dataField: 'yoyRate', headerText: '전년比', dataType: 'numeric', editable: false, formatString: '#,##0.##' },
		{
			dataField: 'vsPrevAvgRate',
			headerText: '전년 평균比',
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.##',
		},

		// 내부용(숨김) - 필요 시 디버그/필터에 사용
		{ dataField: 'seq', headerText: '순번', dataType: 'numeric', editable: false, visible: false },
		{ dataField: 'reasoncode', headerText: '사유코드', dataType: 'text', editable: false, visible: false },
	];

	//상세 그리드 컬럼 설정
	const getGridDetailCol = [
		// { dataField: 'cat', headerText: '구분', dataType: 'text', editable: false, cellMerge: true },
		// { dataField: 'seq', headerText: '순번', dataType: 'code', editable: false },
		{ dataField: 'reasonnm', headerText: '사유', dataType: 'text', editable: false },
		{ dataField: 'cnt', headerText: '건수', dataType: 'numeric', editable: false },
		{ dataField: 'rate', headerText: '비중', dataType: 'numeric', editable: false, formatString: '#,##0.##' },
	];

	//상세 그리드 컬럼 설정
	const getGridDetailCol1 = [
		{ dataField: 'docNo', headerText: '오더번호', dataType: 'text', editable: false },
		{ dataField: 'depthrNm', headerText: '담당부서', dataType: 'text', editable: false },
		{ dataField: 'mdName', headerText: '담당자', dataType: 'text', editable: false },
		{ dataField: 'sku', headerText: '상품코드', dataType: 'text', editable: false },
		{ dataField: 'skuName', headerText: '상품명', dataType: 'text', editable: false },

		{ dataField: 'reasonnm', headerText: '사유', dataType: 'text', editable: false, formatString: '#,##0.##' },
	];

	//상세그리드 Props 설정
	const detailGridProps = {
		editable: false,
		fillColumnSizeMode: true,
		enableColumnResize: true,
		enableCellMerge: true,
		cellMergeRowSpan: false,
		// showRowCheckColumn: true,
		// showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		enableFilter: true,
	};

	//마스터 그리드 Props 설정
	const gridProps = {
		editable: false,
		fillColumnSizeMode: true,
		enableColumnResize: true,
		// enableFilter: true,
	};

	//마스터그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: refs.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// =====================================================================
	//  03. react hook event
	//  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	// =====================================================================

	// // grid data 변경 감지
	// useEffect(() => {
	// 	const gridRefCur = refs.gridRef.current;
	// 	const gridRefDtlCur = refs.gridRef1.current;
	// 	////console.log((dayjs(props.searchForm.getFieldValue('date')).format('YYYY'));
	// 	gridRefDtlCur?.clearGridData();
	// 	gridRefCur?.clearGridData();
	// 	//console.log((props.headerData);
	// 	const list = props.headerData.totalList;
	// 	const chartData = props.headerData.monthChartList;
	// 	const monthList = props.headerData.monthList;
	// 	//console.log((list.length);
	// 	if (list.length > 0) {
	// 		// 	gridRefCur?.setGridData(list);
	// 		// 	// 구해진 칼럼 사이즈를 적용 시킴.
	// 		// 	gridRefCur.setColumnSizeList(colSizeList);
	// 		// 	const colSizeList1 = gridRefDtlCur.getFitColumnSizeList(true);
	// 		// 	// 구해진 칼럼 사이즈를 적용 시킴.
	// 		// 	gridRefDtlCur.setColumnSizeList(colSizeList1);
	// 	}
	// }, [props.headerData.list]);
	useEffect(() => {
		const gridRefCur = refs.gridRef.current;
		const gridRefDtlCur = refs.gridRef1.current;

		gridRefDtlCur?.clearGridData?.();
		gridRefCur?.clearGridData?.();

		const totalList = props.headerData?.totalList ?? [];
		const monthChartList = props.headerData?.monthChartList ?? [];
		const monthList = props.headerData?.monthList ?? [];

		//console.log(('totalList len:', monthChartList);
		// const DC_MAPPING: any = [];
		if (totalList.length > 0) {
			gridRefCur?.setGridData?.(totalList);
			gridRefDtlCur?.setGridData?.(monthList);
			gridRefCur?.setColumnSizeList?.(gridRefCur.getFitColumnSizeList(true));
			gridRefDtlCur?.setColumnSizeList?.(gridRefDtlCur.getFitColumnSizeList(true));
		}

		// }
		// 차트도 여기서 쓴다면 monthChartList/monthList도 null-safe로 세팅해서 사용
	}, [props.headerData?.totalList, props.headerData?.monthList]);
	useEffect(() => {
		const gridRefDtlCur = refs.gridRef1.current;

		gridRefDtlCur?.clearGridData?.();

		const totalList = props.headerData?.totalList ?? [];
		const monthChartList = props.headerData?.monthChartList ?? [];
		const monthList = props.headerData?.monthList ?? [];

		//console.log(('totalList len:', monthChartList);
		// const DC_MAPPING: any = [];
		if (totalList.length > 0) {
			gridRefDtlCur?.setGridData?.(monthList);

			gridRefDtlCur?.setColumnSizeList?.(gridRefDtlCur.getFitColumnSizeList(true));
		}

		// }
		// 차트도 여기서 쓴다면 monthChartList/monthList도 null-safe로 세팅해서 사용
	}, [props.headerData?.monthList]);
	useEffect(() => {
		const gridRefDtlCur = refs.gridRef2.current;

		gridRefDtlCur?.clearGridData?.();

		const totalList = props.headerData?.totalList ?? [];
		const monthChartList = props.headerData?.monthChartList ?? [];
		const docList = props.headerData?.docList ?? [];

		//console.log(('totalList len:', monthChartList);
		// const DC_MAPPING: any = [];
		if (totalList.length > 0) {
			gridRefDtlCur?.setGridData?.(docList);

			gridRefDtlCur?.setColumnSizeList?.(gridRefDtlCur.getFitColumnSizeList(true));
		}

		// }
		// 차트도 여기서 쓴다면 monthChartList/monthList도 null-safe로 세팅해서 사용
	}, [props.headerData?.docList]);
	useEffect(() => {
		const monthChartList = props.headerData?.monthChartList ?? [];

		// 데이터 없으면 초기화
		if (monthChartList.length === 0) {
			setChartData({ labels: [], datasets: [] });
			return;
		}

		const labels = monthChartList.map((item: any) => {
			const ym = String(item?.ym ?? '');
			// ym이 'YYYYMM'이면 MM만 뽑기
			const mm = ym.length >= 6 ? ym.substring(4, 6) : '';
			return mm ? `${mm}월` : '';
		});

		const values = monthChartList.map((item: any) => {
			const v = Number(item?.cnt ?? 0);
			return Number.isFinite(v) ? v : 0;
		});

		setChartData({
			labels,
			datasets: [
				{
					label: '수기출고',
					data: values,
					fill: false,
					tension: 0.3,
					borderWidth: 2,
					// 선이 안 보이는 경우가 있어서 필수로 넣어
					borderColor: '#ff7f50',
					pointRadius: 3,
					pointHoverRadius: 5,
				},
			],
		});
	}, [props.headerData?.monthChartList]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		refs.gridRef?.current?.resize?.('100%', '100%');
		refs.gridRef1?.current?.resize?.('100%', '100%');
		refs.gridRef2?.current?.resize?.('100%', '100%');
	}, []);
	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid className="contain-wrap">
							<GridTopBtn gridTitle={t('월별 수기 출고 비율')} gridBtn={gridBtn} totalCnt={props.headerTotalCnt} />
						</AGrid>
						<GridAutoHeight id="monthly-manual-shipment-rate-grid">
							<AUIGrid columnLayout={getGridHeaderCol} gridProps={gridProps} ref={refs.gridRef} />
						</GridAutoHeight>
					</>,
					<Splitter
						key="manual-shipment-occurred-grid-with-chart"
						onResizing={resizeAllGrids}
						onResizeEnd={resizeAllGrids}
						items={[
							<>
								<AGrid className="contain-wrap">
									<GridTopBtn gridTitle={t('수기출고 발생 사유')} gridBtn={gridBtn} totalCnt={props.headerTotalCnt} />
								</AGrid>
								<GridAutoHeight id="manual-shipment-occurred-grid">
									<AUIGrid columnLayout={getGridDetailCol} gridProps={detailGridProps} ref={refs.gridRef1} />
								</GridAutoHeight>
							</>,
							<>
								<AGrid>
									<GridTopBtn gridTitle={'월별 수기출고 건수 추이'} />
								</AGrid>
								<StyledChartWrap>
									<Line id="chart" ref={chartRef} data={chartData} options={chartOptions} />
								</StyledChartWrap>
							</>,
						]}
					/>,
					<>
						<AGrid className="contain-wrap">
							<GridTopBtn gridTitle={t('수기출고 발생 부서/품목')} gridBtn={gridBtn} totalCnt={props.headerTotalCnt} />
						</AGrid>
						<GridAutoHeight id="manual-shipment-occurred-grid">
							<AUIGrid columnLayout={getGridDetailCol1} gridProps={detailGridProps} ref={refs.gridRef2} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
});

export default StExdcManualIndicatorDetail;

const StyledChartWrap = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
	position: relative;
`;
