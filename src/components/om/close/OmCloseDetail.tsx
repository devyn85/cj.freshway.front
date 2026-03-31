// CSS

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component

// API Call Function
import { apiGetDetail2List, apiGetDetailList } from '@/api/om/apiOmClose';

// Store
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import { getUserDccodeList } from '@/store/core/userStore';

const OmCloseDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

	const userDccodeList = getUserDccodeList('') ?? [];

	ref.gridRef = useRef();
	ref.detailGridRef = useRef();
	ref.detailGridRef2 = useRef();

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
			dataField: 'deliveryDt',
			headerText: t('lbl.DELIVERYDT'),
			dataType: 'date',
		},
		// {
		// 	dataField: 'docType',
		// 	headerText: t('lbl.DOCTYPE'),
		// 	dataType: 'code',
		// },
		{
			dataField: 'docName',
			headerText: t('lbl.DOCNAME'),
			dataType: 'code',
		},
		{
			dataField: 'workProcessName',
			headerText: t('lbl.WORKPROCESSNAME'),
			dataType: 'code',
		},
		{
			dataField: 'orderCnt',
			headerText: t('lbl.ORDERCNT'),
			dataType: 'numeric',
		},
		{
			dataField: 'weight',
			headerText: t('lbl.WEIGHT'),
			dataType: 'numeric',
		},
		{
			dataField: 'closeYn',
			headerText: t('lbl.CLOSEYN'),
			dataType: 'code',
		},
	];

	const detailGridCol = [
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
			dataField: 'plant',
			headerText: t('lbl.PLANT'),
			dataType: 'code',
		},
		{
			dataField: 'closeKey',
			headerText: t('lbl.CLOSEKEY'),
			dataType: 'code',
		},
		{
			dataField: 'closeName',
			headerText: t('lbl.CLOSENAME'),
			dataType: 'string',
		},
		{
			dataField: 'closeDate',
			headerText: t('lbl.CLOSEDATE'),
			dataType: 'date',
		},
		{
			dataField: 'orderCnt',
			headerText: t('lbl.ORDERCNT'),
			dataType: 'numeric',
		},
		{
			dataField: 'openCnt',
			headerText: t('lbl.OPENCNT'),
			dataType: 'numeric',
		},
		{
			dataField: 'delCnt',
			headerText: t('lbl.DELCNT'),
			dataType: 'numeric',
		},
		{
			dataField: 'orderQty',
			headerText: t('lbl.ORDERQTY'),
			dataType: 'numeric',
		},
		{
			dataField: 'weight',
			headerText: t('lbl.WEIGHT'),
			dataType: 'numeric',
		},
		{
			dataField: 'confirmQty',
			headerText: t('lbl.CONFIRMQTY'),
			dataType: 'numeric',
		},
	];

	const detail2GridCol = [
		{
			dataField: 'docNo',
			headerText: t('lbl.DOCNO'),
			dataType: 'code',
		},
		{
			dataField: 'docName',
			headerText: t('lbl.DOCTYPE'),
			dataType: 'code',
		},
		{
			dataField: 'orderType',
			headerText: t('lbl.ORDERTYPE'),
			dataType: 'code',
		},
		{
			dataField: 'sopoType',
			headerText: 'SOPOTYPE',
			dataType: 'code',
		},
		{
			dataField: 'deliveryDt',
			headerText: t('lbl.DELIVERYDT'),
			dataType: 'date',
		},
		{
			dataField: 'custName',
			headerText: t('lbl.CUSTNAME'),
			dataType: 'string',
		},

		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.detailGridRef2.current.openPopup(e.item, 'sku');
				},
			},
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'skuName',
			headerText: t('lbl.SKUNAME'),
			dataType: 'string',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'countryOfOrigin',
			headerText: t('lbl.COUNTRYOFORIGIN'),
			dataType: 'code',
		},
		{
			dataField: 'closeYn',
			headerText: t('lbl.CLOSEYN'),
			dataType: 'code',
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'),
			dataType: 'code',
		},
		{
			dataField: 'orderQty',
			headerText: t('lbl.ORDERQTY'),
			dataType: 'numeric',
		},
		{
			dataField: 'weight',
			headerText: t('lbl.WEIGHT'),
			dataType: 'numeric',
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

	const detailFooterLayout = [
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
			formatString: '#,##0',
		},
		{
			dataField: 'openCnt',
			positionField: 'openCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'delCnt',
			positionField: 'delCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'orderQty',
			positionField: 'orderQty',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'weight',
			positionField: 'weight',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'confirmQty',
			positionField: 'confirmQty',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
	];

	const detail2FooterLayout = [
		{
			dataField: 'docNo',
			positionField: 'docNo',
			operation: 'COUNT',
			formatString: '#,##0',
			postfix: ' rows',
		},
		{
			dataField: 'orderQty',
			positionField: 'orderQty',
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

	const setDetailGridData = (params: any) => {
		// API 호출
		apiGetDetailList(params).then(res => {
			ref.detailGridRef.current?.setGridData([]);
			ref.detailGridRef2.current?.setGridData([]);
			if (res.data.length > 0) {
				ref.detailGridRef.current?.setGridData(res.data);

				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = ref.detailGridRef.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.detailGridRef.current.setColumnSizeList(colSizeList);

				const item = res.data[0];
				const masterSelectedRow = ref.gridRef.current.getSelectedRows()[0];

				// 조회 조건 설정
				const params = {
					...item,
					deliveryDt: masterSelectedRow.deliveryDt,
					dcCode: masterSelectedRow.dcCode,
					docType: masterSelectedRow.docType,
					workProcessCode: masterSelectedRow.workProcessCode,
				};

				setDetail2GridData(params);
			}
		});
	};

	const setDetail2GridData = (params: any) => {
		// API 호출
		apiGetDetail2List(params).then(res => {
			ref.detailGridRef2.current?.setGridData([]);
			if (res.data.length > 0) {
				ref.detailGridRef2.current?.setGridData(res.data);

				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = ref.detailGridRef2.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.detailGridRef2.current.setColumnSizeList(colSizeList);

				ref.detailGridRef2.current?.setGridData(res.data);
				const colSizeList2 = ref.detailGridRef2.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.detailGridRef2.current.setColumnSizeList(colSizeList2);
			}
		});
	};

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

		/**
		 * 그리드 행 선택 이벤트
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('selectionConstraint', (event: any) => {
			// 선택된 Row가 다를 경우에만 검색
			if (event.rowIndex !== event.toRowIndex) {
				const gridRefCur = ref.gridRef.current;

				if (gridRefCur) {
					// 선택된 행의 데이터를 가져온다.
					const item = gridRefCur.getItemByRowIndex(event.toRowIndex);
					// 조회 조건 설정
					const params = {
						...item,
					};
					setDetailGridData(params);
				}
			}
		});

		/**
		 * 상세 그리드 행 선택 이벤트
		 * @param {any} event 이벤트
		 */
		ref.detailGridRef?.current.bind('selectionConstraint', (event: any) => {
			// 선택된 Row가 다를 경우에만 검색
			if (event.rowIndex !== event.toRowIndex) {
				const gridRefCur = ref.detailGridRef.current;

				if (gridRefCur) {
					// 선택된 행의 데이터를 가져온다.
					const item = gridRefCur.getItemByRowIndex(event.toRowIndex);
					const masterSelectedRow = ref.gridRef.current.getSelectedRows()[0];

					// 조회 조건 설정
					const params = {
						...item,
						deliveryDt: masterSelectedRow.deliveryDt,
						dcCode: masterSelectedRow.dcCode,
						docType: masterSelectedRow.docType,
						workProcessCode: masterSelectedRow.workProcessCode,
					};

					setDetail2GridData(params);
				}
			}
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
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);

			// 선택된 행의 데이터를 가져온다.
			const item = ref.gridRef?.current.getItemByRowIndex(0);
			if (item !== null) {
				// 조회 조건 설정
				const params = {
					...item,
				};
				setDetailGridData(params);
			}

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.detailGridRef?.current?.resize?.('100%', '100%');
		ref.detailGridRef2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<Splitter
			direction="vertical"
			onResizing={resizeAllGrids}
			onResizeEnd={resizeAllGrids}
			items={[
				<Splitter
					key="omClose-top-splitter"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<GridAutoHeight key="omClose-left-grid">
							<AUIGrid
								ref={ref.gridRef}
								columnLayout={gridCol}
								gridProps={gridProps}
								footerLayout={masterFooterLayout}
							/>
						</GridAutoHeight>,
						<GridAutoHeight key="omClose-right-grid">
							<AUIGrid
								ref={ref.detailGridRef}
								columnLayout={detailGridCol}
								gridProps={gridProps}
								footerLayout={detailFooterLayout}
							/>
						</GridAutoHeight>,
					]}
				/>,
				<GridAutoHeight key="omClose-bottom-grid">
					<AUIGrid
						ref={ref.detailGridRef2}
						columnLayout={detail2GridCol}
						gridProps={gridProps}
						footerLayout={detail2FooterLayout}
					/>
				</GridAutoHeight>,
			]}
		/>
	);
});

export default OmCloseDetail;
