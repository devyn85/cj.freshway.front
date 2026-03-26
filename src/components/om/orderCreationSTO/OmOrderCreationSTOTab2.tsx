// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';

const OmOrderCreationSTOTab2 = forwardRef((props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

	// 그리드 초기화
	const gridCol = [
		{
			headerText: t('lbl.FROM_DCCODE'), // 공급센터
			children: [
				{
					dataField: 'fromDccode',
					headerText: t('lbl.DCCODE'), // 물류센터
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'fromDcname',
					headerText: t('lbl.DCNAME'), // 물류센터명
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'), // 공급받는센터
			children: [
				{
					dataField: 'toDccode',
					headerText: t('lbl.DCCODE'), // 물류센터
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'toDcname',
					headerText: t('lbl.DCNAME'), // 물류센터명
					editable: false,
				},
			],
		},
		{
			dataField: 'toSku',
			headerText: t('lbl.SKU'), // 상품코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'skuName',
			headerText: t('lbl.SKUNM'), // 상품명
			editable: false,
		},
		{
			dataField: 'fromUom',
			headerText: t('lbl.UOM'), // 단위
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toStockgradeName',
			headerText: t('lbl.STOCKGRADE'), // 재고속성
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toOrderqty',
			headerText: t('lbl.TRANQTY'), // 작업수량
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			// 처리결과
			dataField: 'processflag',
			headerText: t('lbl.PROCESSFLAG'),
			dataType: 'code',
			editable: false,
		},
		{
			// 처리메시지
			dataField: 'processmsg',
			headerText: t('lbl.PROCESSMSG'),
			dataType: 'default',
			editable: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		fillColumnSizeMode: true,
		showRowCheckColumn: false,
		enableFilter: true,
	};

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
		props.gridRef?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			props.gridRef?.current.setSelectionByIndex(0);
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: props.gridRef, // 타겟 그리드 Ref
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
		const gridRefCur = props.gridRef.current;
		if (gridRefCur) {
			gridRefCur.resize('100%', '100%');
			gridRefCur.setGridData(props.data);
			gridRefCur.setSelectionByIndex(0, 0);

			if (props.data && props.data.length > 0) {
				// 데이터 설정 후 컬럼 크기 자동 조정
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid style={{ padding: '10px 0 ', marginBottom: 0 }}>
				<GridTopBtn gridTitle={t('lbl.DETAIL_TAB')} gridBtn={gridBtn} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={props.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</GridAutoHeight>
		</>
	);
});

export default OmOrderCreationSTOTab2;
