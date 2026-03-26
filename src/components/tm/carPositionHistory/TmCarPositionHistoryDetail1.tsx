/*
 ############################################################################
 # FiledataField	: TmCarPositionHistoryDetail1.tsx
 # Description		: 배송 > 차량관제 > 운행일지 (목록)
 # Author					: JiHoPark
 # Since					: 2025.11.14.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Util

// Store

// API

// Hooks

// lib

// type
import { GridBtnPropsType } from '@/types/common';
// asset
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';

interface TmCarPositionHistoryDetail1Props {
	data: any;
	totalCnt: any;
	searchDetailList: any;
	searchCarPositionHistoryPrintInfo: any;
}

const TmCarPositionHistoryDetail1 = forwardRef((props: TmCarPositionHistoryDetail1Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.DELIVERYDATE'), /*배송일자*/ dataField: 'deliverydt', dataType: 'date', editable: false },
		{ headerText: t('lbl.PRIORITY'), /*회차*/ dataField: 'priority', dataType: 'code', editable: false },
		{
			headerText: t('lbl.CARINFO') /*차량정보*/,
			children: [
				{
					headerText: t('lbl.CARNO'),
					/*차량번호*/ dataField: 'carno',
					dataType: 'code',
					editable: false,
				},
				{
					headerText: t('lbl.DRIVERNAME'),
					/*기사명*/ dataField: 'drivername',
					dataType: 'code',
					editable: false,
				},
				{
					headerText: t('lbl.CONTRACTTYPE'),
					/*계약유형*/ dataField: 'contracttypename',
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.DAY_PLAN_DRIVEDISTANCE'),
			/*당일 계획 주행거리*/ dataField: 'dailyExpDrivedistance',
			dataType: 'numeric',
			editable: false,
		},
		{
			headerText: t('lbl.DAY_REAL_DRIVEDISTANCE'),
			/*당일 실 주행거리*/ dataField: 'dailyMileage',
			dataType: 'numeric',
			editable: false,
		},
		{
			headerText: t('lbl.MONTH_PLAN_DRIVEDISTANCE'),
			/*당월 계획 주행거리*/ dataField: 'dailyExpDrivedistancesum',
			dataType: 'numeric',
			editable: false,
		},
		{
			headerText: t('lbl.MONTH_REAL_DRIVEDISTANCE'),
			/*당월 실 주행거리*/ dataField: 'dailyMileagesum',
			dataType: 'numeric',
			editable: false,
		},
		{
			headerText: t('lbl.STORERKEY'),
			/*회사*/ dataField: 'storerkey',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.DOCDT_WD'),
			/*출고일자*/ dataField: 'slipdt',
			dataType: 'date',
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.R_DOCNO'),
			/*전표번호*/ dataField: 'slipno',
			dataType: 'string',
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.SLIPTYPE'),
			/*전표유형*/ dataField: 'sliptype',
			dataType: 'string',
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.STORERTYPE'),
			/*거래처유형*/ dataField: 'custtype',
			dataType: 'string',
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.CUST_CODE'),
			/*거래처코드*/ dataField: 'custkey',
			dataType: 'string',
			editable: false,
			visible: false,
		},
		{ headerText: t('lbl.DCCODE'), /*물류센터*/ dataField: 'dccode', dataType: 'code', visible: false },
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 인쇄버튼 callback function
	 */
	const onPrinkClickCallback = () => {
		// 저장할 데이터 선택여부 확인
		const chkDataList = ref.current.getCheckedRowItemsAll();

		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_007', [t('lbl.PRINT_LIST')]), // 인쇄 목록을(를) 선택해 주십시오.
				modalType: 'info',
			});
			return;
		}

		// 운행일지 출력 데이터 조회
		props.searchCarPositionHistoryPrintInfo(chkDataList);
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref?.current.setSelectionByIndex(0);
		});

		ref?.current.bind('selectionChange', (event: any) => {
			const primeCell = event.primeCell;
			// 선택된 행의 상세 정보를 조회한다.
			props.searchDetailList(primeCell.item);
		});
	};

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'print', // 인쇄
				callBackFn: onPrinkClickCallback,
			},
		],
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

	/**
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			const dataList = props.data;
			gridRef?.setGridData(dataList);
			gridRef?.setSelectionByIndex(0, 0);

			if (dataList.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} />
			</GridAutoHeight>
		</>
	);
});

export default TmCarPositionHistoryDetail1;
