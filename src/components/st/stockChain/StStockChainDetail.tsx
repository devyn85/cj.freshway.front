// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

const StStockChainDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

	const userDccodeList = getUserDccodeList('') ?? [];

	ref.gridRef = useRef();

	// 그리드 초기화
	const gridCol = [
		{ headerText: t('lbl.DCCODE'), dataField: 'dcCode', dataType: 'code' }, // 물류센터코드
		{ headerText: t('lbl.DCNAME'), dataField: 'dcName', dataType: 'string' }, // 물류센터명
		{ headerText: t('lbl.STORAGETYPE'), dataField: 'storageType', dataType: 'code' }, // 저장타입
		{ headerText: t('lbl.ORGANIZE'), dataField: 'organize', dataType: 'string', visible: false }, // 조직(숨김)
		{ headerText: t('lbl.STOCKTYPE'), dataField: 'stockType', dataType: 'code' }, // 재고유형
		{ headerText: t('lbl.STOCKGRADE'), dataField: 'stockGrade', dataType: 'code' }, // 재고등급
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(e.item, 'sku');
				},
			},
		}, // 상품코드
		{ headerText: t('lbl.SKUNAME'), dataField: 'skuName', dataType: 'string' }, // 상품명
		{ headerText: '외식Y/N', dataField: 'reference15', dataType: 'code' }, // 외식여부
		{ headerText: t('lbl.UOM'), dataField: 'uom', dataType: 'code' }, // 단위
		{ headerText: t('lbl.QTY'), dataField: 'qty', dataType: 'numeric' }, // 수량
		{ headerText: t('lbl.QTYPERBOX'), dataField: 'qtyPerBox', dataType: 'numeric' }, // 박스당수량
		{ headerText: t('lbl.BOXPERPLT'), dataField: 'boxPerPlt', dataType: 'numeric' }, // 팔레트당박스
		{ headerText: '현재고(PLT)', dataField: 'boxPerPltQty', dataType: 'numeric' }, // 현재고(PLT)
		{
			dataField: 'pltFlg',
			headerText: t('lbl.PLTFLG'),
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('PLT_FLG', value)?.cdNm;
			},
		}, // 팔레트여부
		{ headerText: t('lbl.LEADTIME'), dataField: 'leadTime', dataType: 'numeric' }, // 리드타임
		{ headerText: 'MOQ', dataField: 'moqSku', dataType: 'numeric' }, // MOQ
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
		ref.detailGridRef?.current.setGridData([]);
		ref.detailGridRef2?.current.setGridData([]);

		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref.gridRef?.current.setSelectionByIndex(0);
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
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
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={props.totalCnt} position={'postfix'} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={masterFooterLayout} />
			</AGrid>
		</>
	);
});

export default StStockChainDetail;
