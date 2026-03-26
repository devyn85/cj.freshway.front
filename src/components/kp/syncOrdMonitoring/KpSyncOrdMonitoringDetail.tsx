/*
 ############################################################################
 # FiledataField	: KpSyncOrdMonitoringDetail.tsx
 # Description		: 주문동기화 모니터링 상세
 # Author			    :
 # Since			    :
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
// Utils

// API Call Function
import { apiGetDetailList } from '@/api/kp/apiKpSyncOrdMonitoring';

//type
import { GridBtnPropsType } from '@/types/common';

//hooks
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import { useThrottle } from '@/hooks/useThrottle';

const KpSyncOrdMonitoringDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	ref.gridRef = useRef();
	ref.gridRef1 = useRef();

	const [gridDetailTotalCount, setGridDetailTotalCount] = useState(0);
	const [detailGridData, setDetailGridData] = useState([]);
	const [currentPageSrc, setCurrentPageSrc] = useState(1); // 현재 페이지 번호
	const [pageSize] = useState(constants.PAGE_INFO.PAGE_SIZE); // 페이지당 행 수

	const throttle = useThrottle(); // throttle 함수

	const lastSelectedRowIndexRef = useRef<number | null>(null);

	const gridId = uuidv4() + '_gridWrap';
	const gridId1 = uuidv4() + '_gridWrap';

	// 그리드 컬럼 세팅 (Header)
	const gridCol = [
		{ headerText: t('lbl.DCCODE'), dataField: 'dccode', width: 100 },
		{ headerText: t('lbl.DOCNO'), dataField: 'docno', width: 140 },
		{ headerText: t('lbl.DOCDT'), dataField: 'docdt', width: 100 },
		{ headerText: t('lbl.STATUS'), dataField: 'status', width: 80 },
		{ headerText: t('lbl.CHK_STATUS'), dataField: 'chkStatus', width: 90 },
		{ headerText: t('lbl.DOCTYPE'), dataField: 'doctype', width: 90 },
		{ headerText: t('lbl.CHK_DOCTYPE'), dataField: 'chkDoctype', width: 100 },
		{ headerText: t('lbl.WORKPROCESSCODE'), dataField: 'workprocesscode', width: 140 },
		{ headerText: t('lbl.CHK_WORKPROCESSCODE'), dataField: 'chkWorkprocesscode', width: 160 },
		{ headerText: t('lbl.ORDERTYPE'), dataField: 'ordertype', width: 90 },
		{ headerText: t('lbl.CHK_ORDERTYPE'), dataField: 'chkOrdertype', width: 110 },
		{ headerText: t('lbl.CHK_ORDERQTY'), dataField: 'chkOrderqty', width: 110, dataType: 'numeric' },
		{ headerText: t('lbl.CHK_OPENQTY'), dataField: 'chkOpenqty', width: 110, dataType: 'numeric' },
		{ headerText: t('lbl.CHK_PROCESSQTY'), dataField: 'chkProcessqty', width: 120, dataType: 'numeric' },
		{ headerText: t('lbl.CHK_WORKQTY'), dataField: 'chkWorkqty', width: 110, dataType: 'numeric' },
		{ headerText: t('lbl.CHK_CONFIRMQTY'), dataField: 'chkConfirmqty', width: 120, dataType: 'numeric' },
		{ headerText: t('lbl.CHK_CANCELQTY'), dataField: 'chkCancelqty', width: 120, dataType: 'numeric' },
		{ headerText: t('lbl.CHK_SUM'), dataField: 'chkSum', width: 90, dataType: 'numeric' },
	];

	// 그리드 컬럼 세팅 (Detail)
	const gridCol1 = [
		{ headerText: t('lbl.DCCODE'), dataField: 'dccode', width: 100 },
		{ headerText: t('lbl.DOCDT'), dataField: 'docdt', width: 100 },
		{ headerText: t('lbl.DOCNO'), dataField: 'docno', width: 140 },
		{ headerText: t('lbl.DOCLINE'), dataField: 'docline', width: 80, dataType: 'numeric' },
		{ headerText: t('lbl.SKU'), dataField: 'sku', width: 120 },
		{ headerText: t('lbl.STATUS'), dataField: 'status', width: 80 },
		{ headerText: t('lbl.CHK_STATUS'), dataField: 'chkStatus', width: 90 },
		{ headerText: t('lbl.DOCTYPE'), dataField: 'doctype', width: 90 },
		{ headerText: t('lbl.CHK_DOCTYPE'), dataField: 'chkDoctype', width: 100 },
		{ headerText: t('lbl.WORKPROCESSCODE'), dataField: 'workprocesscode', width: 140 },
		{ headerText: t('lbl.CHK_WORKPROCESSCODE'), dataField: 'chkWorkprocesscode', width: 160 },
		{ headerText: t('lbl.IOTYPE'), dataField: 'iotype', width: 80 },
		{ headerText: t('lbl.CHK_IOTYPE'), dataField: 'chkIotype', width: 100 },
		{ headerText: t('lbl.ORDERTYPE'), dataField: 'ordertype', width: 90 },
		{ headerText: t('lbl.CHK_ORDERTYPE'), dataField: 'chkOrdertype', width: 110 },
		{ headerText: t('lbl.ORDERQTY'), dataField: 'orderqty', width: 90, dataType: 'numeric' },
		{ headerText: t('lbl.CHK_ORDERQTY'), dataField: 'chkOrderqty', width: 110, dataType: 'numeric' },
		{ headerText: t('lbl.ORDERADJUSTQTY'), dataField: 'orderadjustqty', width: 120, dataType: 'numeric' },
		{ headerText: t('lbl.CHK_ORDERADJUSTQTY'), dataField: 'chkOrderadjustqty', width: 140, dataType: 'numeric' },
		{ headerText: t('lbl.OPENQTY'), dataField: 'openqty', width: 90, dataType: 'numeric' },
		{ headerText: t('lbl.CHK_OPENQTY'), dataField: 'chkOpenqty', width: 110, dataType: 'numeric' },
		{ headerText: t('lbl.OPENADJUSTQTY'), dataField: 'openadjustqty', width: 120, dataType: 'numeric' },
		{ headerText: t('lbl.CHK_OPENADJUSTQTY'), dataField: 'chkOpenadjustqty', width: 140, dataType: 'numeric' },
		{ headerText: t('lbl.PROCESSQTY'), dataField: 'processqty', width: 100, dataType: 'numeric' },
		{ headerText: t('lbl.CHK_PROCESSQTY'), dataField: 'chkProcessqty', width: 120, dataType: 'numeric' },
		{ headerText: t('lbl.CONFIRMQTY'), dataField: 'confirmqty', width: 100, dataType: 'numeric' },
		{ headerText: t('lbl.CHK_CONFIRMQTY'), dataField: 'chkConfirmqty', width: 120, dataType: 'numeric' },
		{ headerText: t('lbl.CONFIRMWEIGHT'), dataField: 'confirmweight', width: 110, dataType: 'numeric' },
		{ headerText: t('lbl.CHK_CONFIRMWEIGHT'), dataField: 'chkConfirmweight', width: 130, dataType: 'numeric' },
		{ headerText: t('lbl.CANCELQTY'), dataField: 'cancelqty', width: 100, dataType: 'numeric' },
		{ headerText: t('lbl.CHK_CANCELQTY'), dataField: 'chkCancelqty', width: 110, dataType: 'numeric' },
		{ headerText: t('lbl.LOT'), dataField: 'lot', width: 120 },
		{ headerText: t('lbl.CHK_LOT'), dataField: 'chkLot', width: 120 },
		{ headerText: t('lbl.LOTTABLE01'), dataField: 'lottable01', width: 100 },
		{ headerText: t('lbl.CHK_LOTTABLE01'), dataField: 'chkLottable01', width: 120 },
		{ headerText: t('lbl.LOTTABLE02'), dataField: 'lottable02', width: 100 },
		{ headerText: t('lbl.CHK_LOTTABLE02'), dataField: 'chkLottable02', width: 120 },
		{ headerText: t('lbl.LOTTABLE03'), dataField: 'lottable03', width: 100 },
		{ headerText: t('lbl.CHK_LOTTABLE03'), dataField: 'chkLottable03', width: 120 },
		{ headerText: t('lbl.LOTTABLE04'), dataField: 'lottable04', width: 100 },
		{ headerText: t('lbl.CHK_LOTTABLE04'), dataField: 'chkLottable04', width: 120 },
		{ headerText: t('lbl.LOTTABLE05'), dataField: 'lottable05', width: 100 },
		{ headerText: t('lbl.CHK_LOTTABLE05'), dataField: 'chkLottable05', width: 120 },
		{ headerText: t('lbl.STOCKGRADE'), dataField: 'stockgrade', width: 100 },
		{ headerText: t('lbl.CHK_STOCKGRADE'), dataField: 'chkStockgrade', width: 120 },
		{ headerText: t('lbl.CHK_SUM'), dataField: 'chkSum', width: 90, dataType: 'numeric' },
	];

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef,
		btnArr: [],
	};
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1,
		btnArr: [],
	};

	//그리드 Pros 설정
	const gridProps = {
		editable: false,
	};
	const gridProps1 = {
		editable: false,
	};
	const footerLayout = [
		{
			dataField: 'docno',
			positionField: 'docno',
			operation: 'COUNT',
			postfix: ' rows',
		},
	];
	const footerLayout1 = [
		{
			dataField: 'docline',
			positionField: 'docline',
			operation: 'COUNT',
			postfix: ' rows',
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	// 셀 클릭시 조회 (Header에서 DOCNO 기준으로 Detail 조회)
	const searchDetail = () => {
		const gridRefCur = ref.gridRef.current;
		const gridRefCur1 = ref.gridRef1.current;
		const selectRow = gridRefCur?.getSelectedIndex()?.[0];
		if (selectRow == null || selectRow < 0) {
			gridRefCur1?.clearGridData();
			setDetailGridData([]);
			setGridDetailTotalCount(0);
			return;
		}
		gridRefCur1?.clearGridData();
		setCurrentPageSrc(1);
		searchScroll(1);
	};

	// 페이징 처리 (선택된 Header 행의 dccode, docno로 Detail 조회)
	const searchScroll = throttle((pageNo: number) => {
		const gridRefCur = ref.gridRef.current;
		const selectRow = gridRefCur?.getSelectedIndex()?.[0];
		if (selectRow == null || selectRow < 0) return;

		const row = gridRefCur?.getGridData()?.[selectRow];
		if (!row) return;

		// master 선택 행에서 dccode, docno 추출 (camelCase / snake_case 모두 처리)
		const dccode = row.dccode ?? row.DCCODE;
		const docno = row.docno ?? row.DOCNO;
		if (dccode == null || docno == null) {
			setDetailGridData([]);
			setGridDetailTotalCount(0);
			return;
		}

		const tt = pageNo || currentPageSrc;
		const searchParams = {
			dccode,
			docno,
			startRow: 0 + (tt - 1) * pageSize,
			listCount: pageSize,
		};

		setDetailGridData([]);

		apiGetDetailList(searchParams).then(res => {
			const list = Array.isArray(res?.data) ? res.data : res?.data?.list ?? [];
			const total = res?.data?.totalCount ?? list?.length ?? 0;
			setDetailGridData(list);
			setGridDetailTotalCount(total);
			if (res?.data?.pageNum != null && res.data.pageNum > -1) {
				setCurrentPageSrc(res.data.pageNum);
			}
		});
	}, 500);

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	//데이터 치 세팅
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		const gridRefDtlCur = ref.gridRef1.current;
		if (gridRefCur) {
			gridRefDtlCur?.clearGridData();
			gridRefCur?.setGridData(props.data);
			if (props.data?.length > 0) {
				gridRefCur?.setSelectionByIndex(0, 0);
				lastSelectedRowIndexRef.current = 0;
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
				setTimeout(() => searchDetail(), 0);
			}
		}
	}, [props.data]);

	//상단 그리드 클릭시 하단 그리드 데이터 세팅 (다른 로우를 선택했을 때만 Detail 조회)
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur.bind('selectionChange', function () {
				const selectRow = gridRefCur?.getSelectedIndex()?.[0];
				const prevRow = lastSelectedRowIndexRef.current;
				if (selectRow !== prevRow) {
					lastSelectedRowIndexRef.current = selectRow ?? null;
					searchDetail();
				}
			});
		}
	}, []);

	// Detail 그리드 로우 더블클릭 시 상세 모니터링 화면으로 이동 (dccode, docno, docline, doctype 전달)
	useEffect(() => {
		const gridRefDtlCur = ref.gridRef1.current;
		if (!gridRefDtlCur || typeof props.onDetailRowDoubleClick !== 'function') return;
		gridRefDtlCur.bind('cellDoubleClick', function (event: any) {
			const row = event?.item ?? gridRefDtlCur.getGridData?.()?.[event?.rowIndex];
			if (!row) return;
			const dccode = row.dccode ?? row.DCCODE;
			const docno = row.docno ?? row.DOCNO;
			const docline = row.docline ?? row.DOCLINE ?? '';
			const doctype = (row.doctype ?? row.DOCTYPE ?? '').toString().toUpperCase();
			if (dccode != null && docno != null) {
				props.onDetailRowDoubleClick({ dccode, docno, docline, doctype });
			}
		});
	}, [props.onDetailRowDoubleClick]);

	useScrollPagingAUIGrid({
		gridRef: ref.gridRef1,
		callbackWhenScrollToEnd: () => {
			setCurrentPageSrc((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount: gridDetailTotalCount,
	});

	//페이징 처리
	useEffect(() => {
		if (currentPageSrc > 1) {
			searchScroll();
		}
	}, [currentPageSrc]);

	// 페이징 처리
	useEffect(() => {
		const gridRefDtlCur = ref.gridRef1.current;
		if (gridRefDtlCur) {
			gridRefDtlCur.appendData(detailGridData);

			if (detailGridData.length > 0) {
				const colSizeList = gridRefDtlCur.getFitColumnSizeList(true);
				gridRefDtlCur.setColumnSizeList(colSizeList);
			}
		}
	}, [detailGridData]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef1?.current?.resize?.('100%', '100%');
		ref.gridRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} gridBtn={gridBtn} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid
								ref={ref.gridRef}
								name={gridId}
								columnLayout={gridCol}
								gridProps={gridProps}
								footerLayout={footerLayout}
							/>
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridTitle={t('lbl.DETAIL')} totalCnt={gridDetailTotalCount} gridBtn={gridBtn1} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid
								ref={ref.gridRef1}
								name={gridId1}
								columnLayout={gridCol1}
								gridProps={gridProps1}
								footerLayout={footerLayout1}
							/>
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
});
export default KpSyncOrdMonitoringDetail;
