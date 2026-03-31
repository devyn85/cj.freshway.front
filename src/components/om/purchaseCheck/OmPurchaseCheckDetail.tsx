// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API Call Function

// Store
import { getUserDccodeList } from '@/store/core/userStore';

const OmPurchaseCheckDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();
	const userDccodeList = getUserDccodeList('') ?? [];

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: userDccodeList,
				keyField: 'dccode', // key 에 해당되는 필드명
				valueField: 'dcname',
			},
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'dcName',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				const dcCode = item.dcCode;
				return userDccodeList.find((item: any) => item.dccode === dcCode)?.dcname.split(']')[1] || '';
			},
		},
		{
			dataField: 'storerKey',
			visible: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					props.gridRef.current.openPopup(e.item, 'sku');
				},
			},
		},
		{
			dataField: 'skuName',
			headerText: t('lbl.SKUNAME'),
			dataType: 'string',
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'),
			dataType: 'code',
		},
		{
			dataField: 'theDay',
			headerText: t('lbl.THEDAY'),
			dataType: 'numeric',
		},
		{
			dataField: 'weekAvg',
			headerText: t('lbl.WEEK_AVG'),
			dataType: 'numeric',
		},
		{
			dataField: 'weekMax',
			headerText: t('lbl.WEEK_MAX'),
			dataType: 'numeric',
		},
		{
			dataField: 'weekMin',
			headerText: t('lbl.WEEK_MIN'),
			dataType: 'numeric',
		},
		{
			dataField: 'monthTotalQty',
			headerText: '월 총 입고량(30일)',
			dataType: 'numeric',
		},
		{
			dataField: 'monthCount',
			headerText: '월 입고일수(30일)',
			dataType: 'numeric',
		},
		{
			dataField: 'monthAvg',
			headerText: '일 평균 입고량',
			dataType: 'numeric',
		},
		{
			dataField: 'monthMax',
			headerText: '월 최고(30일)',
			dataType: 'numeric',
		},
		{
			dataField: 'monthMin',
			headerText: '월 최소(30일)',
			dataType: 'numeric',
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		showRowCheckColumn: false,
		enableFilter: true,
		showFooter: true,
	};

	// FooterLayout Props
	const footerLayout = [
		// {
		// 	dataField: 'dcCode',
		// 	positionField: 'dcCode',
		// 	operation: 'COUNT',
		// 	formatString: '#,##0',
		// 	postfix: ' rows',
		// },
		{
			labelText: '합계',
			positionField: 'dcCode',
		},
		{
			dataField: 'theDay',
			positionField: 'theDay',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'weekAvg',
			positionField: 'weekAvg',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'weekMax',
			positionField: 'weekMax',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'weekMin',
			positionField: 'weekMin',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'monthTotalQty',
			positionField: 'monthTotalQty',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'monthCount',
			positionField: 'monthCount',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'monthAvg',
			positionField: 'monthAvg',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'monthMax',
			positionField: 'monthMax',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'monthMin',
			positionField: 'monthMin',
			operation: 'SUM',
			formatString: '#,##0',
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
		props.gridRef?.current.bind('ready', (event: any) => {
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
		<AGrid className="contain-wrap">
			<GridTopBtn gridTitle="목록" totalCnt={props.totalCnt} gridBtn={gridBtn}></GridTopBtn>
			<AUIGrid ref={props.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
		</AGrid>
	);
});

export default OmPurchaseCheckDetail;
