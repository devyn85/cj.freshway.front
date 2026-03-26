/*
 ############################################################################
 # FiledataField	: StDailyOnhandQtyAPIDetail.tsx
 # Description		: 외부창고 API 재고현황
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.09.04
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import dayjs from 'dayjs';

// Utils

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { useAppSelector } from '@/store/core/coreHook';

// Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';

// API

interface StDailyOnhandQtyAPIDetailProps {
	gridData: any;
	totalCount: any;
	callBackFn: any;
	searchForm: any;
}

const StDailyOnhandQtyAPIDetail = forwardRef((props: StDailyOnhandQtyAPIDetailProps, ref: any) => {
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

	// grid Ref
	ref.gridRef = useRef();

	// 그리드 컬럼 팝업용 Ref
	const refModal = useRef(null);

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), //창고코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'organizeName',
			headerText: t('lbl.ORGANIZENAME'), //창고명
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), //상품코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'skuName',
			headerText: t('lbl.SKUNM'), //상품명
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'), //단위
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'convserialno',
			headerText: t('lbl.BLNO'), //B/L  NO 식별번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'weight',
			headerText: t('lbl.WEIGHT_KG'), //중량
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'stQty',
			headerText: t('lbl.CURRENT_STOCK'), //현재고
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'wmsCurrStock',
			headerText: t('lbl.WMS_CURR_STOCK'), //WMS 현재고
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'diff',
			headerText: t('lbl.DIFFQTY_WD'), //차이
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'qtyperpallet',
			headerText: t('lbl.QTYPERPALLET'), //팔렛당입수
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'palletqty',
			headerText: t('lbl.PALLETQTY'), //팔렛수량
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'usebydate',
			headerText: t('lbl.USEBYDATE'), //소비기한
			dataType: 'code',
			editable: false,
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value.trim()) || value === 'STD' ? '' : dayjs(value).format('YYYY-MM-DD') ?? '';
			},
		},
		{
			dataField: 'factorydate',
			headerText: t('lbl.MANUFACTUREDT'), //제조일자
			dataType: 'code',
			editable: false,
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.isEmpty(value.trim()) || value === 'STD' ? '' : dayjs(value).format('YYYY-MM-DD') ?? '';
			},
		},
		{
			dataField: 'placeoforigin',
			headerText: t('lbl.CLEARANCE_PLACEOFORIGIN'), //통관구분원산지
			dataType: 'code',
			editable: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: false,
		enableFilter: false,
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
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef, // 타겟 그리드 Ref
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
		ref.gridRef.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref.gridRef.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditEnd', (event: any) => {});

		/**
		 * 그리드 셀 더블클릭
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellDoubleClick', (event: any) => {
			if (event.dataField === 'sku') {
				// 상품코드 셀 더블클릭하면 상품상세팝업 표시
				ref.gridRef.current.openPopup(event.item, 'sku');
			}
		});

		/**
		 * 그리드 체크박스 클릭
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('rowCheckClick', (event: any) => {});

		/**
		 * 그리드 체크박스 전체 클릭
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('rowAllChkClick', (event: any) => {});
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
		if (ref.gridRef?.current && props.gridData) {
			ref.gridRef.current.setGridData(props.gridData);

			if (props.gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = ref.gridRef.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [props.gridData, ref.gridRef]);

	return (
		<>
			{/* 그리드 영역 정의 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn()} totalCnt={props.totalCount}></GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModal} />
		</>
	);
});

export default StDailyOnhandQtyAPIDetail;
