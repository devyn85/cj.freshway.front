/*
 ############################################################################
 # FiledataField	: OmAutoOrderMonitoringDetail.tsx
 # Description		: 시스템운영 > 시스템운영현황 > 자동발주 모니터링(Detail)
 # Author			: JiSooKim
 # Since			: 2025.08.12
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
// Redux
// API Call Function
// import { apiGetMasterList } from '@/api/om/apiOmAutoOrderMonitoring';

const OmAutoOrderMonitoringDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();

	ref.gridRef = useRef();
	ref.gridRef1 = useRef();
	const [totalCnt, setTotalCnt] = useState(0);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	useEffect(() => {
		// if (props.data.length > 0 && props.dataList.length > 0) {
		if (props.data.length > 0) {
			const gridRef = ref.gridRef?.current;

			if (gridRef) {
				for (let i = 0; i < props.data.length; i++) {
					const targetKey = props.data[i].comCd;
					props.data[i].status = props.dataList.some((item: any) => item.purchaseAutoTime === targetKey) ? 'Y' : 'N';
				}
				// 그리드 데이터 세팅
				gridRef?.setGridData(props.data);

				if (props.data.length > 0) {
					const colSizeList = gridRef.getFitColumnSizeList(true);
					gridRef.setColumnSizeList(colSizeList);
				}

				ref.gridRef?.current?.bind('selectionChange', (event: any) => {
					searchDetailList(props.dataList);
				});
				ref.gridRef?.current?.setSelectionByIndex(0);
			}
		}
	}, [props.dataList, ref.gridRef.current]);

	/**
	 * 상세 조회
	 * @param detailDataList
	 */
	const searchDetailList = (detailDataList: any) => {
		const selectedRow = ref.gridRef?.current?.getSelectedRows();
		const selectedRowIndex = ref.gridRef?.current?.getSelectedIndex()[0]; // 선택된 행의 인덱스

		if (!selectedRow || selectedRow.length === 0) return;
		const colSizeList = ref.gridRef1.current.getFitColumnSizeList(true);
		ref.gridRef1.current.setColumnSizeList(colSizeList);

		if (selectedRowIndex === 0) {
			// 첫 번째 row 선택 시 전체 데이터
			ref.gridRef1.current?.setGridData(detailDataList);
			setTotalCnt(detailDataList.length);
		} else {
			// 두 번째 row부터는 key값으로 필터
			const targetKey = selectedRow[0].comCd;
			const filteredData = detailDataList.filter((item: any) => item.purchaseAutoTime === targetKey);
			ref.gridRef1.current?.setGridData(filteredData);
			setTotalCnt(filteredData.length);
		}
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		{ dataField: 'comCd', headerText: t('lbl.BASECODE'), dataType: 'string', visible: false }, // 숨김 처리
		{ dataField: 'cdNm', headerText: t('lbl.DESCR'), dataType: 'string' },
		{ dataField: 'status', headerText: t('lbl.EXECUTION_STATUS'), dataType: 'string' },
	];

	// 그리드 Props
	const gridProps = {
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.status == 'Y') {
				return 'bg-warning'; // CSS 클래스 이름 반환
			}
			return '';
		},
	};

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 컬럼(상세목록 그리드)
	const gridCol1 = [
		{ dataField: 'purchaseType', headerText: t('lbl.ORDER_TYPE'), dataType: 'string' },
		{ dataField: 'purchaseTypeNm', headerText: t('lbl.ORDER_TYPE_NM'), dataType: 'string' },
		{ dataField: 'purchaseAutoTime', headerText: t('lbl.AUTOORDER_TYPE'), dataType: 'string' },
		{ dataField: 'purchaseAutoTimeNm', headerText: t('lbl.AUTOORDERTYPE_NM'), dataType: 'string' },
		{ dataField: 'targetDate', headerText: t('lbl.DELIVERYDATE'), dataType: 'string' },
		{ dataField: 'docNo', headerText: t('lbl.DOCNO'), dataType: 'string' },
		{ dataField: 'frDcCode', headerText: t('lbl.WD_CENTER'), dataType: 'string' },
		{ dataField: 'frOrganize', headerText: t('lbl.WD_ORGANIZE'), dataType: 'string' },
		{ dataField: 'toDcCode', headerText: t('lbl.DP_CENTER'), dataType: 'string' },
		{ dataField: 'toOrganize', headerText: t('lbl.DP_ORGANIZE'), dataType: 'string' },
		{ dataField: 'addDate', headerText: t('lbl.ADDDATE'), dataType: 'string' },
		{ dataField: 'addWho', headerText: t('lbl.ADDWHO'), dataType: 'string' },
	];

	// 그리드 Props(상세목록 그리드)
	const gridProps1 = {
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.delYn == 'Y') {
				return 'color-danger'; // CSS 클래스 이름 반환
			}
			return ''; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
		},
	};

	// 그리드 버튼
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [],
	};

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				sizes={[25, 75]}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.AUTOORDER_TYPE')} totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn1} gridTitle={t('lbl.EXECUTION_HISTORY')} totalCnt={totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
});
export default OmAutoOrderMonitoringDetail;
