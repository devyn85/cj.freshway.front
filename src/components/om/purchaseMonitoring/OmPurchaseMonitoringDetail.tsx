/*
 ############################################################################
 # FiledataField	: OmPurchaseMonitoringDetail.tsx
 # Description		: 주문 > 주문등록 > 저장품발주현황
 # Author			: JeongHyeongCheol
 # Since			: 25.09.10
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import GridTopBtn from '@/components/common/GridTopBtn';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Tooltip, Legend);

// store

// API Call Function

// util

// types
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';
import { GridBtnPropsType } from '@/types/common';
interface OmPurchaseMonitoringDetailProps {
	gridRef2?: any;
	gridData?: Array<object>;
	gridData2?: Array<object>;
	dccodeList?: Array<object>;
	activeTabKey?: string;
	setActiveTabKey?: any;
	tlevel?: number;
	totalCnt?: number;
}

const OmPurchaseMonitoringDetail = forwardRef((props: OmPurchaseMonitoringDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { gridRef2, gridData, gridData2, dccodeList, activeTabKey, setActiveTabKey, tlevel, totalCnt } = props;

	//Antd Form 사용
	const { t } = useTranslation();

	const [totalCnt2, setTotalCnt2] = useState(0);

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
				suggestedMax: 0.01, // 오른쪽 차트 y축 최대값에 맞춰 조절
				title: {
					// 2026-03-10 KSH y축 제목 표시 WNEXTWMS-7961
					// display: false, // y축 제목은 필요없을 듯
					// text: '수량',
					display: true, // y축 제목 필요
					text: 'ton',
				},
			},
		},
	} as const;

	// ==========================================================================
	// grid
	// ==========================================================================

	// 자동발주내역 그리드 초기화
	const gridCol1 = [
		{
			dataField: 'id',
			headerText: '행번호',
			visible: false,
		},
		{
			dataField: 'requestdt',
			headerText: t('lbl.RECEIVING_SCHEDULED_DATE'), // 입고예정일
		},
		{
			dataField: 'dccode',
			headerText: t('lbl.DP_CENTER'), // 입고센터
			filter: {
				showIcon: true,
			},
			dataType: 'code',
		},
		// {
		// 	dataField: 'buyerkey',
		// 	headerText: '수급담당',
		// 	filter: {
		// 		showIcon: true,
		// 	},
		// 	dataType: 'code',
		// },
		{
			dataField: 'buyername',
			headerText: t('lbl.POMDCODE'), // 수급담당
		},
		{
			dataField: 'custkey',
			headerText: t('lbl.PARTNER_CD'), // 협력사코드
			filter: {
				showIcon: true,
			},
			dataType: 'code',
		},
		{
			dataField: 'custkeyname',
			headerText: t('lbl.PARTNER_NAME'), // 협력사명
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), // 상품코드
			filter: {
				showIcon: true,
			},
			dataType: 'code',
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNM'), // 상품명
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'custkeyCnt',
			headerText: '입고업체수',
			dataType: 'numeric',
		},
		{
			dataField: 'skuCnt',
			headerText: t('lbl.SKUCNT'), // 상품수
			dataType: 'numeric',
		},
		{
			dataField: 'weight2',
			headerText: '입고물량(TON)',
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				allowPoint: true,
				// allowNegative: true,
			},
			formatString: '#,##0.00', // 2026-03-20 KSH 소수점 2자리로 표시 WNEXTWMS-7961
		},
		{
			dataField: 'plt',
			headerText: '입고물량(PLT)',
			dataType: 'numeric',
		},
		{
			dataField: 'bulkPoMemo',
			headerText: '대물량발주내역',
		},
	];
	// 자동발주내역 그리드 속성
	const gridProps1 = {
		editable: false,
		enableFilter: true,
		fillColumnSizeMode: true,
		enableColumnResize: true,
		enableSorting: false,

		rowIdField: 'id',
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.lev == 11111) {
				return 'gc-user13';
			} else if (item.tlevel == 0) {
				return 'gc-user10';
			} else if (item.tlevel == 1) {
				return 'gc-user12';
			} else if (item.tlevel == 2) {
				return 'gc-user11';
			} else if (item.tlevel == 3) {
				return 'gc-user14';
			}
		},
		// selectionMode: 'multipleRows',
		// onlyEnterKeyEditEnd: true,
		// displayTreeOpen: true,
		// showStateColumn: true,
	};
	const gridCol2 = [
		{
			dataField: 'dt',
			headerText: t('lbl.DOCDT_DP'), // 입고일자
		},
		{
			headerText: t('lbl.DP_CENTER'), // 입고센터
			dataField: 'weights',
			children: [{ dataField: 'weight2600', headerText: '이천물류센터', dataType: 'numeric' }],
		},
	];
	const gridProps2 = {
		editable: false,
		enableFilter: true,
		fillColumnSizeMode: true,
		enableColumnResize: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *	grid button set
	 * =====================================================================
	 */

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const setGridBtn1 = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'excelDownload', // 엑셀다운로드
				},
			],
		};
		return gridBtn;
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const setGridBtn2 = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef2, // 타겟 그리드 Ref
		};
		return gridBtn;
	};

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	// 탭 아이템 영역
	const tabs = [
		{
			key: '1',
			label: '저장품 발주현황',
			children: (
				<>
					<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
						<GridTopBtn
							gridTitle={t('lbl.LIST')} //목록
							gridBtn={setGridBtn1()}
							totalCnt={totalCnt}
						/>
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={gridRef} columnLayout={gridCol1} gridProps={gridProps1} />
					</GridAutoHeight>
				</>
			),
		},
		{
			key: '2',
			label: '발주추이',
			children: (
				<Splitter
					key="omPurchaseMonitoringDetail-splitter"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<>
							<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
								<GridTopBtn
									gridTitle={t('lbl.LIST')} //목록
									gridBtn={setGridBtn2()}
									totalCnt={totalCnt2}
								>
									<p>{t('lbl.UOM')}(ton)</p>
								</GridTopBtn>
							</AGrid>
							<GridAutoHeight>
								<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
							</GridAutoHeight>
						</>,
						<>
							<div className="chart-container" style={{ padding: '10px 0', height: '100%' }}>
								<h3>저장품 발주 추이</h3>
								<div
									id="chart"
									className="chart-form"
									style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
								>
									<div className="chart-block" style={{ display: 'flex', flexDirection: 'column', height: '60%' }}>
										<Line ref={chartRef} data={chartData} options={chartOptions} />
									</div>
								</div>
							</div>
						</>,
					]}
				/>
			),
		},
	];

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string) => {
		if (key === '1') {
			setActiveTabKey('1');
			if (gridRef.current) {
				gridRef.current.resize('100%', '100%');
			}
		} else {
			setActiveTabKey('2');
			if (gridRef2.current) {
				gridRef2.current.resize('100%', '100%');
			}
		}
	};

	// level 변경에 따른 컬럼 컨트롤
	const levelControll = (level: number) => {
		// 1. 각 레벨에서 "보여줘야 할" 컬럼들을 정의합니다.
		const columnsByLevel: any = {
			0: [],
			1: ['dccode'],
			2: ['dccode', 'buyername'],
			3: ['dccode', 'buyername', 'custkey', 'custkeyname'], // 2개 추가
			4: ['dccode', 'buyername', 'custkey', 'custkeyname', 'sku', 'skuname'], // 2개 추가
		};

		// 2. 전체 제어 대상 컬럼 리스트
		const allFields = ['dccode', 'buyername', 'custkey', 'custkeyname', 'sku', 'skuname'];

		// 3. 현재 레벨에 맞는 컬럼들을 가져옵니다. (없으면 빈 배열)
		const showFields = columnsByLevel[level] || [];

		// 4. 전체 컬럼을 돌면서 보여줄지 숨길지 결정
		allFields.forEach(field => {
			if (showFields.includes(field)) {
				gridRef.current.showColumnByDataField(field);
			} else {
				gridRef.current.hideColumnByDataField(field);
			}
		});
		// 조회된 결과에 맞게 칼럼 넓이를 구한다.
		const colSizeList = gridRef.current.getFitColumnSizeList(true);
		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRef.current.setColumnSizeList(colSizeList);
	};

	const initEvent = () => {
		gridRef.current.bind('cellClick', (event: any) => {
			const isOpen = gridRef.current.isItemOpenByRowId(event.item.id);
			// 확장/축소 대상이 되는 컬럼 맵을 정의
			const expandableColumns: Record<number, string> = {
				0: 'requestdt',
				1: 'dccode',
				2: 'buyername',
				3: 'custkey',
			};

			// 현재 아이템의 tlevel에 해당하는 dataField가 클릭되었는지 확인
			const targetDataField = expandableColumns[event.item.tlevel];

			if (event.dataField === targetDataField) {
				// 조건이 만족하면 단 한 번만 확장/축소 함수 호출
				gridRef.current.expandItemByRowId(event.item.id, !isOpen);

				let level = 0;
				gridRef.current.getGridData().map((item: any) => {
					if (item.tlevel > level) {
						level = Number(item.tlevel);
					}
				});
				levelControll(level);
			}
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		initEvent();
	}, []);

	// 발주현황
	useEffect(() => {
		if (gridRef.current) {
			gridRef.current.setGridData(gridData);
			gridRef.current.showItemsOnDepth(tlevel);
			levelControll(tlevel - 1);
		}
	}, [gridData]);

	// 발주추이
	useEffect(() => {
		if (gridRef2.current) {
			// 삭제할 기존 컬럼 수
			const count = gridRef2.current.getColumnCount();
			// chart
			const DC_MAPPING: any = [];
			// chart line color set
			const getRandomInt = () => {
				return Math.floor(commUtil.secureRandom(256));
			};
			const getRandomRgbColor = () => {
				const r = getRandomInt();
				const g = getRandomInt();
				const b = getRandomInt();
				return `rgb(${r}, ${g}, ${b})`;
			};
			// grid set, chart data set
			dccodeList.forEach((code: any) => {
				const columnObj = {
					headerText: code.dcnameOnlyNm,
					dataField: 'weight' + code.dccode, // dataField 는 중복되지 않게 설정
					dataType: 'numeric',
					style: 'right',
					formatString: '#,##0.00', // 2026-03-20 KSH 소수점 2자리로 표시 WNEXTWMS-7961
				};

				DC_MAPPING.push({ label: code.dcnameOnlyNm, field: 'weight' + code.dccode, color: getRandomRgbColor() });
				gridRef2.current.addTreeColumn(columnObj, 'weights', 'last');
			});

			// 기존 컬럼 삭제
			for (let i = 1; i < count; i++) {
				gridRef2.current.removeColumn(1);
			}
			if (gridData2.length > 0) {
				gridRef2.current.setGridData(gridData2);
				setTotalCnt2(gridData2.length);
				// 조회된 결과에 맞게 칼럼 넓이를 구한다.
				const colSizeList = gridRef2.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef2.current.setColumnSizeList(colSizeList);
				gridRef2?.current.setSelectionByIndex(0);

				// chart set
				const labels = gridData2.map((item: any) => {
					const dateStr = item.dt;
					return `${dateStr.substring(5, 7)}월 ${dateStr.substring(8, 10)}일 ${dateStr.substring(11, 14)}`;
				});
				const datasets = DC_MAPPING.map((mapping: any) => {
					const data = gridData2.map((item: any) => {
						const value = item[mapping.field];
						return value ? parseFloat(value) : 0;
					});
					return {
						label: mapping.label,
						data: data,
						borderColor: mapping.color,
						backgroundColor: mapping.color.replace(')', ', 0.5)'),
					};
				});
				// 차트 load
				setChartData({
					labels: labels, // X축 레이블
					datasets: datasets,
				});
			} else {
				gridRef2.current.setGridData(gridData2);
				setTotalCnt2(gridData2.length);
				setChartData({
					labels: [], // X축 레이블
					datasets: [],
				});
			}
		}
	}, [gridData2, dccodeList]);

	return <TabsArray items={tabs} activeKey={activeTabKey} onChange={tabClick} />;
});

export default OmPurchaseMonitoringDetail;
