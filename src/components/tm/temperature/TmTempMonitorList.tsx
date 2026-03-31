/*
############################################################################
# FiledataField		: TmTempMonitorList.tsx
# Description		: 차량 온도 모니터링 - 차량별 목록
# Author		: Park EunKyung(ekmona.park@cj.net)
# Since			: 2025.10.27
# Updated		: 
############################################################################
*/

// assets
import AGrid from '@/assets/styled/AGrid/AGrid';

// components
import GridTopBtn from '@/components/common/GridTopBtn';
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
	annotationPlugin,
);

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// types
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';
import { VehicleChartData, VehicleData } from '@/types/tm/tmTempMonitor';

// util
import { Button, Card } from 'antd';
import {
	CategoryScale,
	Chart as ChartJS,
	Filler,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// Hooks
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

// util
import commUtil from '@/util/commUtil';

// store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';

// 전역변수
const FROZEN_COLOR = '#1890ff';
const REFRIG_COLOR = '#52c41a';
const OUT_COLOR = '#ff4d4f';

interface TmTempMonitorListProps {
	form: any;
	data: VehicleData[];
	totalCnt: number;
	onVehicleSelect: (vehicle: VehicleData) => void;
	onDetailClick: (vehicle: VehicleData, formData: any) => void;
	selectedVehicle: VehicleData | null;
	activeTab?: string;
	onTabChange: (key: string) => void;
	onLoadMore: () => void;
	vehicleChartData?: VehicleChartData[];
}

const TmTempMonitorList = forwardRef<any, TmTempMonitorListProps>(
	(
		{
			form,
			data,
			totalCnt,
			onVehicleSelect,
			onDetailClick,
			selectedVehicle,
			activeTab,
			onTabChange,
			onLoadMore,
			vehicleChartData,
		},
		ref,
	) => {
		const gridRef = useRef<any>(null);
		const { t } = useTranslation();

		useImperativeHandle(ref, () => ({
			gridRef: gridRef.current,
		}));
		//
		/**
		 *적정온도 기준 공통 코드 조회하여 처리
			LEGALTEMPRANGE	3	FREEZE_MAX_TEMP	냉동 최고 온도	-18
			LEGALTEMPRANGE	2	REFRIG_MAX_TEMP	냉장 최고 온도	 10
			LEGALTEMPRANGE	1	REFRIG_MIN_TEMP	냉장 최소 온도		0
		 */
		const legalTempRange = getCommonCodeList('LEGALTEMPRANGE');
		const refrigMinTemp = Number(legalTempRange?.find((item: any) => item.comCd === 'REFRIG_MIN_TEMP')?.data1 ?? 0);
		const refrigMaxTemp = Number(legalTempRange?.find((item: any) => item.comCd === 'REFRIG_MAX_TEMP')?.data1 ?? 10);
		const frozenMinTemp = Number(legalTempRange?.find((item: any) => item.comCd === 'FREEZE_MAX_TEMP')?.data1 ?? -18);
		const frozenMaxTemp = Number(legalTempRange?.find((item: any) => item.comCd === 'FREEZE_MIN_TEMP')?.data1 ?? -30);

		const basedFrozen = frozenMinTemp;
		const isRefrigeratedOut = (v: number) => v < refrigMinTemp || v > refrigMaxTemp; // 냉장 적정: 0~10℃
		const isFrozenOut = (v: number) => v > frozenMinTemp || v < frozenMaxTemp;

		// 도착지 정보가 있는지 여부
		const isExistCust = (rowIndex: number) => {
			const selectedRowData = vehicleChartData?.[rowIndex] as VehicleChartData | undefined;
			const cust = selectedRowData?.cust ?? '';
			return commUtil.isNotEmpty(cust) ?? false;
		};

		// Vehicle columns
		const gridCol = [
			{
				dataField: 'carno',
				headerText: t('lbl.VHCNUM'),
				width: 120,
				dataType: 'code',
			},
			{
				dataField: 'priority',
				headerText: t('lbl.PRIORITY'), // '회차',
				width: 80,
				dataType: 'code',
				labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
					if (value == null || value === '') {
						return '';
					}
					return value;
				},
			},
			{
				dataField: 'drivername',
				headerText: t('lbl.DRIVERNAME'), // '기사명',
				width: 100,
				dataType: 'code',
			},
			{
				dataField: 'contracttype',
				headerText: t('lbl.CONTRACTTYPE'), // '계약유형',
				width: 100,
				dataType: 'code',
				labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
					if (value == null || value === '') {
						return '';
					}
					return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm ?? '';
				},
			},
			{
				dataField: 'temperature1NomlRate',
				headerText: t('lbl.PROPER_REFRI_TEMP_RATE'), // '적정온도율(냉장)',
				width: 150,
				formatString: '#,##0.0',
				dataType: 'numeric',
			},
			{
				dataField: 'temperature2NomlRate',
				headerText: t('lbl.PROPER_FREEZ_TEMP_RATE'), // '적정온도율(냉동)',
				width: 150,
				formatString: '#,##0.0',
				dataType: 'numeric',
			},
			{
				dataField: 'temperature1OutRate',
				headerText: t('lbl.DEVIAT_REFRI_TEMP_RATE'), // '이탈율(냉장)',
				width: 120,
				formatString: '#,##0.0',
				dataType: 'numeric',
			},
			{
				dataField: 'temperature2OutRate',
				headerText: t('lbl.DEVIAT_FREEZ_TEMP_RATE'), // '이탈율(냉동)',
				width: 120,
				formatString: '#,##0.0',
				dataType: 'numeric',
			},
			{
				dataField: 'temperature1Avg',
				headerText: t('lbl.AVG_REFRI_TEMP'), // '평균냉장온도',
				width: 120,
				formatString: '#,##0.0',
				dataType: 'numeric',
			},
			{
				dataField: 'temperature2Avg',
				headerText: t('lbl.AVG_FREEZ_TEMP'), // '평균냉동온도',
				width: 120,
				formatString: '#,##0.0',
				dataType: 'numeric',
			},
			{
				dataField: 'temperature1MinMax',
				headerText: t('lbl.MIN_MAX_REFRI_TEMP'), // '최저/최고 냉장온도',
				width: 120,
				dataType: 'code',
			},
			{
				dataField: 'temperature2MinMax',
				headerText: t('lbl.MIN_MAX_FREEZ_TEMP'), // '최저/최고 냉동온도',
				width: 120,
				dataType: 'code',
			},
			{
				dataField: 'timeRange',
				headerText: t('lbl.TEMP_COLLECT_PERIOD'), // '온도수집구간',
				width: 120,
				dataType: 'code',
			},
		];

		// Chart.js configuration
		const chartData = {
			labels: vehicleChartData?.map((record: VehicleChartData) => record.time),
			datasets: [
				{
					label: t('lbl.REFRIGERATION_TEMP'), // '냉장',
					data: vehicleChartData?.map((record: VehicleChartData) => record.refrig),
					borderColor: REFRIG_COLOR,
					borderWidth: 1,
					backgroundColor: 'rgba(82, 196, 26, 0.1)',
					fill: false,
					tension: 0.4,
					pointRadius: (ctx: any) => {
						return isExistCust(ctx.dataIndex) ? 3 : 0;
					},
					pointHoverRadius: (ctx: any) => {
						return isExistCust(ctx.dataIndex) ? 5 : 0;
					},
					pointBackgroundColor: (ctx: any) => {
						return isExistCust(ctx.dataIndex) ? OUT_COLOR : FROZEN_COLOR;
					},
					pointBorderColor: (ctx: any) => {
						return isExistCust(ctx.dataIndex) ? OUT_COLOR : REFRIG_COLOR;
					},
				},
				{
					label: t('lbl.FREEZING_TEMP'), // '냉동',
					data: vehicleChartData?.map((record: VehicleChartData) => record.freeze),
					borderColor: FROZEN_COLOR,
					borderWidth: 1,
					backgroundColor: 'rgba(24, 144, 255, 0.1)',
					fill: false,
					tension: 0.4,
					pointRadius: (ctx: any) => {
						return isExistCust(ctx.dataIndex) ? 3 : 0;
					},
					pointHoverRadius: (ctx: any) => {
						return isExistCust(ctx.dataIndex) ? 5 : 0;
					},
					pointBackgroundColor: (ctx: any) => {
						return isExistCust(ctx.dataIndex) ? OUT_COLOR : FROZEN_COLOR;
					},
					pointBorderColor: (ctx: any) => {
						return isExistCust(ctx.dataIndex) ? OUT_COLOR : REFRIG_COLOR;
					},
				},
			],
		};

		const chartOptions = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: 'top' as const,
					labels: {
						usePointStyle: false,
						padding: 20,
						font: {
							size: 12,
						},
					},
					onClick: () => {
						// 범례 클릭 시 그래프 토글 기능 비활성화
					},
				},
				tooltip: {
					enabled: false,
					mode: 'nearest' as const,
					intersect: false,
					backgroundColor: 'rgba(0, 0, 0, 0.8)',
					titleColor: '#fff',
					bodyColor: '#fff',
					borderColor: '#ddd',
					borderWidth: 1,
					external: (ctx: any) => {
						const { chart, tooltip } = ctx;
						let el = chart.canvas.parentNode.querySelector('.custom-tooltip');
						if (!el) {
							el = document.createElement('div');
							el.className = 'custom-tooltip';
							el.style.position = 'absolute';
							el.style.pointerEvents = 'none';
							el.style.background = 'rgba(0,0,0,0.8)';
							el.style.color = '#fff';
							el.style.borderRadius = '4px';
							el.style.padding = '8px 10px';
							el.style.fontSize = '12px';
							el.style.whiteSpace = 'nowrap';
							el.style.transform = 'translate(-50%, -120%)';
							chart.canvas.parentNode.appendChild(el);
						}
						if (tooltip.opacity === 0) {
							el.style.opacity = '0';
							return;
						}
						const idx = tooltip.dataPoints?.[0]?.dataIndex ?? 0;
						const dsFrozen = chart.data.datasets.find((d: any) => d.label === '냉동');
						const dsRefrig = chart.data.datasets.find((d: any) => d.label === '냉장');
						const frozen = dsFrozen?.data?.[idx];
						const refrig = dsRefrig?.data?.[idx];

						const rec = vehicleChartData?.[idx] as VehicleChartData | undefined;

						// 도착지 정보가 없으면 툴팁 제공하지 않도록 처리
						if (!rec?.cust) {
							el.style.opacity = '0';
							return;
						}
						const cust = rec.cust ? rec.cust + ' |' : '';
						const time = rec.time ?? '';

						const frozenColor = frozen == null ? '#ccc' : isFrozenOut(frozen) ? OUT_COLOR : FROZEN_COLOR;
						const refrigColor = refrig == null ? '#ccc' : isRefrigeratedOut(refrig) ? OUT_COLOR : REFRIG_COLOR;

						const frozenStr = frozen == null ? '-' : `${frozen}`;
						const refrigStr = refrig == null ? '-' : `${refrig}`;

						const frozenStatus = frozen == null ? '-' : isFrozenOut(frozen) ? '이탈' : '정상';
						const refrigStatus = refrig == null ? '-' : isRefrigeratedOut(refrig) ? '이탈' : '정상';

						// Single-line, colored segments
						el.innerHTML = `
						<div style="text-align:left;">
							<div style="opacity:.7; margin-bottom:4px;">${time}</div>
							<div>
							${cust}
							<span style="color:${refrigColor}">${refrigStr}</span> /
							<span style="color:${frozenColor}">${frozenStr}</span> |
							<span style="color:${refrigColor}">${refrigStatus}</span> /
							<span style="color:${frozenColor}">${frozenStatus}</span>
							</div>
						</div>
						`;
						const { offsetLeft: pl, offsetTop: pt } = chart.canvas;
						const chartWidth = chart.canvas.width;

						// 툴팁 위치 계산
						let tooltipX = pl + tooltip.caretX;
						let tooltipY = pt + tooltip.caretY;

						// 툴팁을 먼저 표시하여 크기를 측정
						el.style.opacity = '1';
						el.style.left = tooltipX + 'px';
						el.style.top = tooltipY + 'px';
						el.style.transform = 'translate(-50%, -120%)';

						// 툴팁 크기 측정
						const tooltipWidth = el.offsetWidth || 200;
						const tooltipHeight = el.offsetHeight || 60;

						// 오른쪽 끝에 가까우면 왼쪽으로 이동
						const rightEdge = tooltipX + tooltipWidth / 2;
						const chartRightEdge = pl + chartWidth;

						if (rightEdge > chartRightEdge) {
							// 오른쪽 끝을 벗어나면 왼쪽으로 이동
							const overflow = rightEdge - chartRightEdge;
							tooltipX = tooltipX - overflow - 10; // 10px 여유 공간
							el.style.transform = 'translate(-50%, -120%)'; // 오른쪽 정렬
						} else if (tooltipX - tooltipWidth / 2 < pl) {
							// 왼쪽 끝을 벗어나면 오른쪽으로 이동
							tooltipX = pl + 10; // 왼쪽에 10px 여유 공간
							el.style.transform = 'translate(0%, -120%)'; // 왼쪽 정렬
						}

						// 위쪽 끝을 벗어나면 아래쪽으로 이동
						if (tooltipY - tooltipHeight * 1.2 < pt) {
							tooltipY = pt + tooltip.caretY + 20; // 포인트 아래쪽에 표시
							el.style.transform = el.style.transform.replace('-120%', '20%');
						}

						// 최종 위치 설정
						el.style.left = tooltipX + 'px';
						el.style.top = tooltipY + 'px';
					},
					callbacks: {
						label: () => '', // suppress default
					},
				},
				title: {
					display: false,
				},
				annotation: {
					annotations: {
						refrigeratedZone: {
							type: 'box' as const,
							yMin: 0,
							yMax: 10,
							backgroundColor: 'rgba(82, 196, 26, 0.1)',
							borderColor: 'rgba(82, 196, 26, 0.3)',
							borderWidth: 1,
							label: {
								content: '냉장 적정온도',
								enabled: true,
								position: 'start' as const,
								backgroundColor: 'rgba(82, 196, 26, 0.8)',
								color: '#fff',
								font: {
									size: 10,
								},
							},
						},
						frozenZone: {
							type: 'box' as const,
							yMin: -30,
							yMax: -18,
							backgroundColor: 'rgba(24, 144, 255, 0.1)',
							borderColor: 'rgba(24, 144, 255, 0.3)',
							borderWidth: 1,
							label: {
								content: '냉동 적정온도',
								enabled: true,
								position: 'start' as const,
								backgroundColor: 'rgba(24, 144, 255, 0.8)',
								color: '#fff',
								font: {
									size: 10,
								},
							},
						},
					},
				},
			},
			scales: {
				x: {
					display: true,
					title: {
						display: true,
						text: '시간 (30분 단위)',
						font: {
							size: 12,
							weight: 'bold' as const,
						},
					},
					grid: {
						display: true,
						color: 'rgba(0, 0, 0, 0.1)',
					},
					ticks: {
						// stepSize: 10,
						// show labels every 30 minutes
						maxTicksLimit: Math.ceil(vehicleChartData?.length / 30), // Limit number of ticks
						font: {
							size: 11,
						},
					},
				},
				y: {
					display: true,
					title: {
						display: true,
						text: '온도(°C)',
						font: {
							size: 12,
							weight: 'bold' as const,
						},
					},
					suggestedMin: -30,
					suggestedMax: 20,
					ticks: {
						stepSize: 10,
						autoSkip: false,
						font: {
							size: 11,
						},
						callback: (v: any) => (v === basedFrozen ? `★ ${v}°C` : `${v}°C`),
					},
					// inject -18 into the tick list
					afterBuildTicks: (scale: any) => {
						const ticks = scale.ticks.slice(); // [{value,label,...}]
						if (!ticks.some((t: any) => t.value === basedFrozen)) {
							ticks.push({ value: basedFrozen, label: `${basedFrozen}°C` });
						}
						ticks.sort((a: any, b: any) => a.value - b.value);
						scale.ticks = ticks;
					},
					grid: {
						display: true,
						color: (ctx: any) => (ctx.tick.value === basedFrozen ? '#18a0ff' : 'rgba(0,0,0,0.1)'),
					},
				},
			},
			elements: {
				point: {
					hoverBorderWidth: 3,
					hoverBorderColor: '#fff',
				},
			},
			animation: {
				duration: 1000,
				easing: 'easeInOutQuart' as const,
			},
		};

		// 그리드 Props
		const gridProps = {
			editable: false,
			showStateColumn: false,
			fillColumnSizeMode: false,
			selectionMode: 'multipleCells',
		};

		// 스크롤 페이징 훅 적용
		useScrollPagingAUIGrid({
			gridRef,
			callbackWhenScrollToEnd: () => {
				if (data.length >= totalCnt) {
					return;
				}

				if (onLoadMore) {
					onLoadMore();
				}
			},
			totalCount: totalCnt,
		});

		// 온도기록상세 탭 온도기록지 버튼, 버튼 없더라도도 빈 배열로 던짐. GridBtnPropsType 던지지 않으면 그리드 그리기 실패
		const gridBtn: GridBtnPropsType = {
			// 타겟 그리드 Ref
			tGridRef: gridRef,
			btnArr: [],
		};

		// 챠트 상단 상세내역 버튼
		const chartBtn: TableBtnPropsType = {
			tGridRef: gridRef,
			btnArr: [
				{
					// 온도기록상세 탭 이동
					btnType: 'btn1',
					btnLabel: t('lbl.DETAIL_VIEW'), // '상세내역',
					callBackFn: () => {
						const { dccode, deliveryDate } = form.getFieldsValue(['dccode', 'deliveryDate']);
						onDetailClick(selectedVehicle, { dccode, deliveryDate });
					},
				},
			],
		};

		// 그리드에서 선택한 행의 인덱스 설정
		const [rowIndex, setRowIndex] = useState();
		useEffect(() => {
			if (gridRef.current) {
				gridRef.current?.bind('selectionChange', function (event: any) {
					setRowIndex(event.primeCell.rowIndex);
				});
				gridRef.current?.bind('copyBegin', (event: any) => {});
			}
		}, []);

		// 그리드에서 선택한 행의 인덱스 변경 시 챠트 데이터 조회
		useEffect(() => {
			if (commUtil.isEmpty(rowIndex)) return;
			const selectedRowData = gridRef.current?.getItemByRowIndex(rowIndex);
			onVehicleSelect(selectedRowData as VehicleData);
		}, [rowIndex]);

		// 그리드에 데이터 설정 시 선택한 행 초기화 및 컬럼 width 자동 조정
		useEffect(() => {
			if (gridRef.current) {
				gridRef.current?.setGridData(data);
				setRowIndex(undefined);

				// 모든 컬럼의 width를 데이터에 맞게 자동 조정
				if (data && data.length > 0) {
					// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
					// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
					const colSizeList = gridRef.current?.getFitColumnSizeList?.(true);
					if (colSizeList) {
						gridRef.current?.setColumnSizeList?.(colSizeList);
					}
				}
			}
		}, [data]);

		// 그리드 크기 조정
		useEffect(() => {
			gridRef.current?.resize('100%', '100%');
		}, [selectedVehicle, activeTab]);

		return (
			<>
				<AGrid style={{ flex: 1, minHeight: 0 }}>
					<GridTopBtn
						gridTitle={t('lbl.LIST')}
						gridBtn={gridBtn}
						customCont={`총 ${commUtil.changeNumberFormatter(totalCnt)}대`}
					/>
					<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>

				{/* Temperature Graph - Only show when vehicle is selected */}
				{selectedVehicle && (
					<AGrid
						// className="form-inner"
						style={{ marginTop: '16px', flex: 1, minHeight: '40%' }}
					>
						<Card>
							{vehicleChartData?.length > 0 ? (
								<>
									<TableHeader>
										<div className="text-area">
											<div className="title-text">온도 그래프</div>
											<div className="sub-title-text">
												{selectedVehicle.carno} ({selectedVehicle.drivername})
											</div>
										</div>

										<div style={{ marginBottom: '3px' }}>
											<div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
												<Button
													type="primary"
													onClick={() => {
														const { dccode, deliveryDate } = form.getFieldsValue(['dccode', 'deliveryDate']);
														onDetailClick(selectedVehicle, { dccode, deliveryDate });
													}}
												>
													{t('lbl.DETAIL_VIEW')}
												</Button>
											</div>
										</div>
									</TableHeader>
									<div style={{ height: '400px', position: 'relative' }}>
										<Line
											data={chartData}
											options={chartOptions}
											// plugins={[gradientLineColorPlugin]}
											className="chart-container"
										/>
									</div>
								</>
							) : (
								<>
									<div style={{ height: '400px', position: 'relative' }}>
										<div
											className="aui-grid-nodata-msg-layer"
											style={{
												textAlign: 'center',
												fontSize: '16px',
												fontWeight: 'bold',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												height: '100%',
												width: '100%',
											}}
										>
											{t('lbl.NO_DATA_EXISTS')}
										</div>
									</div>
								</>
							)}
						</Card>
					</AGrid>
				)}
			</>
		);
	},
);

export default TmTempMonitorList;

export const TableHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;

	.text-area {
		display: flex;
		gap: 10px;
	}

	.title-text {
		font-size: 16px;
		font-weight: bold;
	}

	.sub-title-text {
		font-size: 14px;
		color: #666;
	}
`;
