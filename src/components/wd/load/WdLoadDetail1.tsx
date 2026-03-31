/*
 ############################################################################
 # FiledataField	: WdLoadDetail1.tsx
 # Description		: 출고 > 출차지시 > 출차지시처리 (목록)
 # Author					: JiHoPark
 # Since					: 2025.11.12.
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

interface WdLoadDetail1Props {
	data: any;
	totalCnt: any;
	searchDetailList: any;
	searchLoadPrintInfo: any;
}

const WdLoadDetail1 = forwardRef((props: WdLoadDetail1Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.DCCODE'), /*물류센터*/ dataField: 'dccode', dataType: 'code' },
		{ headerText: t('lbl.DOCDT_WD'), /*출고일자*/ dataField: 'slipdt', dataType: 'date' },
		{ headerText: t('lbl.DELIVERYPOP'), /*배송POP*/ dataField: 'deliverygroup', dataType: 'code' },
		{ headerText: t('lbl.RETURNDRIVECNT'), /*회차*/ dataField: 'priority', dataType: 'code' },
		{ headerText: t('lbl.CARNO'), /*차량번호*/ dataField: 'carno', dataType: 'string' },
		{ headerText: t('lbl.DRIVERNAME'), /*기사명*/ dataField: 'drivername', dataType: 'string' },
		{ headerText: t('lbl.OUTCARTIME'), /*출차시간*/ dataField: 'dcdeparturedt', dataType: 'code' },
		{
			headerText: t('lbl.ORDERQTY'), //주문수량
			dataField: 'orderqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.LOADCMPQTY'), //상차완료량
			dataField: 'loadcmpqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.RATEPER'), //진행률(%)
			dataField: 'loadrate',
			dataType: 'numeric',
			formatString: '#,##0.##',
			renderer: {
				type: 'BarRenderer',
				min: 0,
				max: 100,
			},
			styleFunction: (rowIndex: number, columnIndex: number, value: any) => {
				if (value <= 30) {
					return 'progress-bar-red';
				} else if (value > 30 && value <= 70) {
					return 'progress-bar-blue';
				} else {
					return 'progress-bar-green';
				}
			},
		},
		{
			headerText: t('lbl.SHORTAGEQTY'), //결품수량
			dataField: 'shortageqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.SHORTAGERATE'), //결품율(%)
			dataField: 'shortagerate',
			dataType: 'numeric',
			formatString: '#,##0.##',
			renderer: {
				type: 'BarRenderer',
				min: 0,
				max: 100,
			},
			styleFunction: (rowIndex: number, columnIndex: number, value: any) => {
				if (value <= 30) {
					return 'progress-bar-green';
				} else if (value > 30 && value <= 70) {
					return 'progress-bar-blue';
				} else {
					return 'progress-bar-red';
				}
			},
		},
		{
			headerText: t('lbl.FORCECMPQTY'), //강제완료량
			ataField: 'forcecmpqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.FORCECMPRATEPER'), //강제완료률(%)
			dataField: 'forcecmprate',
			dataType: 'numeric',
			formatString: '#,##0.##',
			renderer: {
				type: 'BarRenderer',
				min: 0,
				max: 100,
			},
			styleFunction: (rowIndex: number, columnIndex: number, value: any) => {
				if (value <= 30) {
					return 'progress-bar-green';
				} else if (value > 30 && value <= 70) {
					return 'progress-bar-blue';
				} else {
					return 'progress-bar-red';
				}
			},
		},
		{
			headerText: t('lbl.UNCONFIRMQTY_WD'), //미확정수량
			dataField: 'unconfirmqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.CONFIRMQTY'), //확정수량
			dataField: 'confirmqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			headerText: t('lbl.CONFIRMRATEPER'), //확정율(%)
			dataField: 'confirmrate',
			dataType: 'numeric',
			formatString: '#,##0.##',
			renderer: {
				type: 'BarRenderer',
				min: 0,
				max: 100,
			},
			styleFunction: (rowIndex: number, columnIndex: number, value: any) => {
				if (value <= 30) {
					return 'progress-bar-red';
				} else if (value > 30 && value <= 70) {
					return 'progress-bar-blue';
				} else {
					return 'progress-bar-green';
				}
			},
		},
		{
			headerText: t('lbl.INSPECTED_YN'), //검수완료여부
			dataField: 'forccmpyn',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DELIVERYDATE'), //배송일자
			dataField: 'deliverydt',
			dataType: 'string',
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.STORERKEY'), //회사
			dataField: 'storerkey',
			dataType: 'string',
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.R_DOCNO'), //전표번호
			dataField: 'slipno',
			dataType: 'string',
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.SLIPTYPE'), //전표유형
			dataField: 'sliptype',
			dataType: 'string',
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.CUST_CODE'), //거래처코드
			dataField: 'custkey',
			dataType: 'string',
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.STORERTYPE'), //거래처유형
			dataField: 'custtype',
			dataType: 'string',
			editable: false,
			visible: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
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
				content: t('msg.MSG_COM_VAL_007', [t('lbl.PRINT_LIST')]), // {{0}}을(를) 선택해 주십시오.
				modalType: 'info',
			});
			return;
		}

		// 상차지시서 출력 데이터 조회
		props.searchLoadPrintInfo(chkDataList);
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

export default WdLoadDetail1;
