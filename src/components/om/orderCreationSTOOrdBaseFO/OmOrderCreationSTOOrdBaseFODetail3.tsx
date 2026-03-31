/*
 ############################################################################
 # FiledataField	: OmOrderCreationSTOOrdBaseFODetail3.tsx
 # Description		: 당일광역보충발주(FO) - 이체대상현황
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 26.03.10
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Utils

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { useAppSelector } from '@/store/core/coreHook';

// Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';

// API

interface OmOrderCreationSTOOrdBaseFODetail3Props {
	gridData: any;
	totalCount: any;
	searchForm: any;
}

const OmOrderCreationSTOOrdBaseFODetail3 = forwardRef((props: OmOrderCreationSTOOrdBaseFODetail3Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const [form] = Form.useForm();

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 그리드 표시된 데이터 건수
	const [currentCount, setCurrentCount] = useState(0);

	const deliverydate = Form.useWatch('deliverydate', props.searchForm);
	const fromDccode = Form.useWatch('fromDccode', props.searchForm);
	const toDccode = Form.useWatch('toDccode', props.searchForm);

	// grid Ref
	ref.gridRef3 = useRef();

	// 그리드 컬럼 팝업용 Ref
	const refModal = useRef(null);

	// 그리드 컬럼 설정
	const gridCol3 = [
		{
			headerText: t('lbl.FROM_DCCODE'), //공급센터
			children: [
				{
					dataField: 'stoDccode',
					headerText: t('lbl.DCCODE'), //물류센터
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'stoDccodename',
					headerText: t('lbl.DCNAME'), //물류센터명
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'), //공급받는센터
			children: [
				{
					dataField: 'dccode',
					headerText: t('lbl.DCCODE'), //물류센터
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'dccodename',
					headerText: t('lbl.DCNAME'), //물류센터명
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.DOCUMENT_STO'), //이체문서
			children: [
				{
					dataField: 'stoDocno',
					headerText: t('lbl.ORDRNUM'), //주문번호
					dataType: 'code',
					editable: false,
				},
				// {
				// 	dataField: 'stoDocline',
				// 	headerText: t('lbl.LINENO'), //항번
				// 	dataType: 'code',
				// 	editable: false,
				// },
				{
					dataField: 'stoOrderqty',
					headerText: t('lbl.STO_PROC_QTY'), //이체량
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
			],
		},
		{
			headerText: t('lbl.WD_DOCUMENT'), //출고문서
			children: [
				{
					dataField: 'docno',
					headerText: t('lbl.ORDRNUM'), //주문번호
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'docline',
					headerText: t('lbl.LINENO'), //항번
					editable: false,
					dataType: 'code',
				},
				// {
				// 	dataField: 'orderqty',
				// 	headerText: t('lbl.STOREROPENQTY'), //주문량
				// 	dataType: 'numeric',
				// 	editable: false,
				// 	formatString: '#,##0.###',
				// },
			],
		},
		{
			headerText: t('lbl.CUST'), //고객
			children: [
				{
					dataField: 'toCustkey',
					headerText: t('lbl.TO_CUSTKEY_WD'), //관리처
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'toCustkeyname',
					headerText: t('lbl.TO_CUSTNAME_WD'), //관리처명
					editable: false,
				},
			],
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'fromCrossdocktypeName',
			headerText: t('lbl.FROM_CROSSDOCKTYPE'), //공급센터CROSS타입
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toCrossdocktypeName',
			headerText: t('lbl.TO_CROSSDOCKTYPE'), //공급받는센터CROSS타입
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), //상품코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNM'), //상품명
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'), //단위
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'addwhoname',
			headerText: t('lbl.REGISTER'), //등록자
			dataType: 'manager',
			managerDataField: 'addwho',
			editable: false,
		},
		{
			dataField: 'adddate',
			headerText: t('lbl.REGDATTM'), //등록일시
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'addwho',
			visible: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps3 = {
		editable: false,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		//showRowCheckColumn: true,
		enableFilter: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn3 = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef3, // 타겟 그리드 Ref
			btnArr: [],
		};

		return gridBtn;
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref.gridRef3.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			//ref.gridRef.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 더블클릭
		 * @param {any} event 이벤트
		 */
		ref.gridRef3.current.bind('cellDoubleClick', (event: any) => {
			if (event.dataField === 'sku') {
				// 상품코드 셀 더블클릭하면 상품상세팝업 표시
				ref.gridRef.current.openPopup(event.item, 'sku');
			}
		});

		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		ref.gridRef3.current.bind('selectionChange', (event: any) => {
			return;
		});

		/**
		 * 그리드 스크롤
		 * @param {any} event 이벤트
		 */
		ref.gridRef3.current.bind('vScrollChange', (event: any) => {
			return;
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	/**
	 * 그리드 이벤트 바인딩
	 */
	useEffect(() => {
		initEvent();
	}, []);

	/**
	 * 데이터를 조회하면 그리드에 추가한다.
	 */
	useEffect(() => {
		if (ref.gridRef3?.current && props.gridData) {
			ref.gridRef3.current.setGridData(props.gridData);

			if (props.gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = ref.gridRef3.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef3.current.setColumnSizeList(colSizeList);
			}

			setCurrentCount(ref.gridRef3.current.getRowCount());
		}
	}, [props.gridData, ref.gridRef3]);

	return (
		<>
			<AGrid style={{ padding: '10px 0', marginBottom: 0, height: 'auto' }}>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn3()} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref.gridRef3} columnLayout={gridCol3} gridProps={gridProps3} />
			</GridAutoHeight>
			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModal} />
		</>
	);
});

export default OmOrderCreationSTOOrdBaseFODetail3;
