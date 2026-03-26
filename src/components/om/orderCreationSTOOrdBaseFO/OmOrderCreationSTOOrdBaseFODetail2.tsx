/*
 ############################################################################
 # FiledataField	: OmOrderCreationSTOOrdBaseFODetail2.tsx
 # Description		: 당일광역보충발주(FO) - 처리결과
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
import GridTopBtn from '@/components/common/GridTopBtn';

// API

interface OmOrderCreationSTOOrdBaseFODetail2Props {
	gridData: any;
	totalCount: any;
	searchForm: any;
}

const OmOrderCreationSTOOrdBaseFODetail2 = forwardRef((props: OmOrderCreationSTOOrdBaseFODetail2Props, ref: any) => {
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
	ref.gridRef2 = useRef();

	// 그리드 컬럼 팝업용 Ref
	const refModal = useRef(null);

	// 그리드 컬럼 설정
	const gridCol2 = [
		{
			headerText: t('lbl.FROM_DCCODE'), //공급센터
			children: [
				{
					dataField: 'fromDccode',
					headerText: t('lbl.DCCODE'), //물류센터
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'fromDcname',
					headerText: t('lbl.DCNAME'), //물류센터명
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'), //공급받는센터
			children: [
				{
					dataField: 'toDccode',
					headerText: t('lbl.DCCODE'), //물류센터
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'toDcname',
					headerText: t('lbl.DCNAME'), //물류센터명
					editable: false,
				},
			],
		},
		{
			dataField: 'toSku',
			headerText: t('lbl.SKU'), //상품코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'description',
			headerText: t('lbl.SKUNM'), //상품명
			editable: false,
		},
		{
			dataField: 'toUom',
			headerText: t('lbl.UOM'), //단위
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toStockgrade',
			headerText: t('lbl.STOCKGRADE'), //재고속성
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toOrderqty',
			headerText: t('lbl.TRANQTY'), //작업수량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'processflag',
			headerText: 'PROCESSFLAG',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'processmsg',
			headerText: 'PROCESSMSG',
			editable: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps2 = {
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
	const getGridBtn2 = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef2, // 타겟 그리드 Ref
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
		ref.gridRef2.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			//ref.gridRef2.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 더블클릭
		 * @param {any} event 이벤트
		 */
		ref.gridRef2.current.bind('cellDoubleClick', (event: any) => {
			if (event.dataField === 'sku') {
				// 상품코드 셀 더블클릭하면 상품상세팝업 표시
				ref.gridRef2.current.openPopup(event.item, 'sku');
			}
		});

		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		ref.gridRef2.current.bind('selectionChange', (event: any) => {});

		/**
		 * 그리드 스크롤
		 * @param {any} event 이벤트
		 */
		ref.gridRef2.current.bind('vScrollChange', (event: any) => {});
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
		if (ref.gridRef2?.current && props.gridData) {
			ref.gridRef2.current.setGridData(props.gridData);

			if (props.gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = ref.gridRef2.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef2.current.setColumnSizeList(colSizeList);
			}

			setCurrentCount(ref.gridRef2.current.getRowCount());
		}
	}, [props.gridData, ref.gridRef2]);

	return (
		<>
			<AGrid>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn2()}></GridTopBtn>
				<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
			</AGrid>

			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModal} />
		</>
	);
});

export default OmOrderCreationSTOOrdBaseFODetail2;
