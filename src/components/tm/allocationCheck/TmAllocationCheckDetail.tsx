/*
 ############################################################################
 # FiledataField	: TmAllocationCheckDetail.tsx
 # Description		: 배차마스터체크결과
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';
// Utils

// API Call Function
import { apiGetDetailList } from '@/api/tm/apiTmAllocationCheck';

//type
import { GridBtnPropsType } from '@/types/common';

//hooks
import GridAutoHeight from '@/components/common/GridAutoHeight';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import { useThrottle } from '@/hooks/useThrottle';
import Splitter from '@/components/common/Splitter';

const TmAllocationCheckDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef1 = useRef();

	const [gridDetailTotalCount, setGridDetailTotalCount] = useState(0);
	const [detailGridData, setDetailGridData] = useState([]);
	const [currentPageSrc, setCurrentPageSrc] = useState(1); // 현재 페이지 번호
	const [pageSize] = useState(constants.PAGE_INFO.PAGE_SIZE); // 페이지당 행 수

	const throttle = useThrottle(); // throttle 함수

	const gridId = uuidv4() + '_gridWrap';
	const gridId1 = uuidv4() + '_gridWrap';

	// 그리드 컬럼 세팅
	const gridCol = [
		{ headerText: '체크 코드', dataField: 'checkCode', width: 160, visible: false },
		{ headerText: '설명', dataField: 'checkMemo' },
		{ headerText: '건수', dataField: 'checkCnt', dataType: 'numeric' },
		{ headerText: 'CHECKKEY1', dataField: 'checkKey1', width: 120, visible: false },
		{ headerText: 'CHECKKEY2', dataField: 'checkKey2', width: 120, visible: false },
		{ headerText: 'CHECKKEY3', dataField: 'checkKey3', width: 120, visible: false },
	];

	const gridCol1 = [
		{ headerText: '상세 메시지', dataField: 'message' },
		{ headerText: 'CHECKKEY1', dataField: 'checkKey1' },
		{ headerText: 'CHECKKEY2', dataField: 'checkKey2' },
		{ headerText: 'CHECKKEY3', dataField: 'checkKey3' },
	];

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	//그리드 Pros 설정
	const gridProps = {
		editable: false,
		// showFooter: true,
	};
	const gridProps1 = {
		editable: false,
		// showFooter: true,
	};
	const footerLayout = [
		{
			dataField: 'checkMemo',
			positionField: 'checkMemo',
			operation: 'COUNT',
			postfix: ' rows',
		},
		{
			dataField: 'checkCnt',
			positionField: 'checkCnt',
			operation: 'SUM',
			postfix: ' 건',
		},
	];
	const footerLayout1 = [
		{
			dataField: 'message',
			positionField: 'message',
			operation: 'COUNT',
			postfix: ' rows',
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	//셀 클릭시 조회
	const searchDetail = () => {
		const gridRefCur = ref.gridRef.current;
		const gridRefCur1 = ref.gridRef1.current;
		const selectRow = gridRefCur?.getSelectedIndex()[0];
		const gridData = gridRefCur?.getGridData()[selectRow];

		// 초기화
		gridRefCur1.clearGridData();
		setCurrentPageSrc(1);
		searchScroll(1);
	};

	//페이징 처리
	const searchScroll = throttle((pageNo: number) => {
		// 조회 조건 설정
		const gridRefCur = ref.gridRef.current;
		const selectRow = gridRefCur?.getSelectedIndex()[0];
		const gridData = gridRefCur?.getGridData()[selectRow];

		const tt = pageNo || currentPageSrc;

		const searchParams = {
			...gridData,
			startRow: 0 + (tt - 1) * pageSize,
			listCount: pageSize,
		};

		// 상세 영역 초기화
		setDetailGridData([]);

		// API 호출
		apiGetDetailList(searchParams).then(res => {
			setDetailGridData(res.data.list);
			if (res.data.totalCount > -1) {
				setGridDetailTotalCount(res.data.totalCount);
			}
			if (res.data.pageNum > -1) {
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
			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	//상단 그리드 클릭시 하단 그리드 데이터 세팅
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		const gridRefDtlCur = ref.gridRef1.current;
		if (gridRefCur) {
			gridRefCur.bind('selectionChange', function () {
				const selectRow = gridRefCur.getSelectedIndex()[0];
				const rowData = gridRefCur.getGridData()[selectRow];
				searchDetail();
			});
		}
	}, []);

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
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefDtlCur.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefDtlCur.setColumnSizeList(colSizeList);
			}
		}
	}, [detailGridData]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<Splitter
			direction="vertical"
			onResizing={resizeAllGrids}
			onResizeEnd={resizeAllGrids}
			items={[
				<>
					<AGrid>
						<GridTopBtn gridTitle="목록" totalCnt={props.totalCnt} gridBtn={gridBtn} />
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
						<GridTopBtn gridTitle="상세목록" totalCnt={gridDetailTotalCount} gridBtn={gridBtn1} />
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
	);
});
export default TmAllocationCheckDetail;
