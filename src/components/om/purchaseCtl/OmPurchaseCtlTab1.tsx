// CSS
import GridAutoHeight from '@/components/common/GridAutoHeight';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

const OmPurchaseCtlTab1 = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

	const userDccodeList = getUserDccodeList('') ?? [];

	const gridBuyerList: { dataField: any; headerText: any; dataType: string }[] = [];

	const buyerKeyList = getCommonCodeList('BUYERKEY', '');
	//buyerKeyList 목록만큰 detail2GridCol에 컬럼 추가
	buyerKeyList.forEach((item: any) => {
		gridBuyerList.push({
			dataField: item.cdNm,
			headerText: item.cdNm,
			dataType: 'numeric',
		});
	});

	const gridCol = [
		{
			dataField: 'LEVEL1',
			headerText: 'LEVEL1',
			dataType: 'code',
		},
		{
			dataField: 'LEVEL2',
			headerText: 'LEVEL2',
			dataType: 'code',
		},
		{
			headerText: '수급담당',
			children: gridBuyerList,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		enableFilter: true,
		showFooter: true,
	};

	// FooterLayout Props
	const masterFooterLayout = [
		{
			dataField: 'dcCode',
			positionField: 'dcCode',
			operation: 'COUNT',
			formatString: '#,##0',
			postfix: ' rows',
		},
		{
			dataField: 'orderCnt',
			positionField: 'orderCnt',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'weight',
			positionField: 'weight',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = props.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);

			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<GridAutoHeight style={{ paddingTop: 10 }}>
			<AUIGrid ref={props.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={masterFooterLayout} />
		</GridAutoHeight>
	);
});

export default OmPurchaseCtlTab1;
