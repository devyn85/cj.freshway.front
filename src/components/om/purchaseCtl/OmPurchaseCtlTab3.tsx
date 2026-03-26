// CSS

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component

// API Call Function
import { getTab3Detail2List, getTab3DetailList } from '@/api/om/apiOmPurchaseCtl';

// Store
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

const OmPurchaseCtlTab3 = forwardRef((props: any) => {
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
			dataField: 'LEVEL1',
			headerText: 'LEVEL1',
			dataType: 'text',
		},
		{
			dataField: 'LEVEL2',
			headerText: 'LEVEL2',
			dataType: 'code',
		},
		{
			dataField: 'LEVEL3',
			headerText: 'LEVEL3',
			dataType: 'code',
		},
		{
			dataField: 'ALL_SKU_COUNT',
			headerText: '전체',
			dataType: 'numeric',
		},
	];

	const detailGridCol = [
		// {
		// 	dataField: 'DCCODE',
		// 	headerText: t('lbl.DCCODE'),
		// 	dataType: 'code',
		// 	editRenderer: {
		// 		type: 'DropDownListRenderer',
		// 		list: userDccodeList,
		// 		keyField: 'dccode', // key 에 해당되는 필드명
		// 		valueField: 'dcname',
		// 	},
		// 	filter: {
		// 		showIcon: true,
		// 	},
		// },
		// {
		// 	dataField: 'DCNAME',
		// 	headerText: t('lbl.DCNAME'),
		// 	dataType: 'code',
		// 	editable: false,
		// 	filter: {
		// 		showIcon: true,
		// 	},
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
		// 		const dcCode = item.DCCODE;
		// 		return userDccodeList.find((item: any) => item.dccode === dcCode)?.dcname.split(']')[1] || '';
		// 	},
		// },
		{
			dataField: 'CUSTKEY',
			headerText: t('lbl.CUSTKEY'),
			dataType: 'code',
		},
		{
			dataField: 'CUSTNAME',
			headerText: '고객명',
		},
		{
			dataField: 'SKU',
			headerText: t('lbl.SKU'),
			dataType: 'code',
		},
		{
			dataField: 'SKUNAME',
			headerText: '상품명',
		},
		{
			dataField: 'STORAGETYPENM',
			headerText: '저장조건',
			dataType: 'code',
		},
		{
			dataField: 'REFERENCE15',
			headerText: '전/범용',
			dataType: 'code',
		},
		{
			dataField: 'LEADTIME',
			headerText: t('lbl.LEADTIME'),
			dataType: 'numeric',
		},
		{
			dataField: 'STOCKDAY',
			headerText: t('lbl.STOCKDAY'),
			dataType: 'numeric',
		},
		{
			dataField: 'QTY_TOTAL',
			headerText: '현재고(EA)',
			dataType: 'numeric',
		},
		{
			dataField: 'BOXPERPLT',
			headerText: '현재고(PLT)',
			dataType: 'numeric',
		},
		{
			dataField: 'REORDERPOINT',
			headerText: '재발주점',
			dataType: 'numeric',
		},
		{
			dataField: 'TARGETSTOCKQTY',
			headerText: '목표재고량',
			dataType: 'numeric',
		},
		{
			dataField: 'ISNOSTOCK',
			headerText: '미출예정(O/X)',
			dataType: 'code',
		},
		{
			dataField: 'DURATION',
			headerText: '소비기한(잔여/전체)',
		},
		{
			headerText: '당일입고 PO',
			children: [
				{
					dataField: 'ISNOSTOCK',
					headerText: '당일입고예정',
					dataType: 'code',
				},
				{
					dataField: 'DURATION',
					headerText: '업체확정수량',
				},
				{
					dataField: 'DURATION',
					headerText: '최종입고수량',
				},
			],
		},
		{
			dataField: 'DURATION',
			headerText: '급증감여부(증가/감소)',
		},
		{
			dataField: 'DURATION',
			headerText: '이벤트(ESPN)',
		},
	];

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

	const detail2GridCol = [
		{
			dataField: 'DCCODE',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
		},
		{
			dataField: 'STORAGETYPENM',
			headerText: '저장조건',
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
			formatString: '#,##0',
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
		getTab3DetailList(params).then(res => {
			props.detailGridRef.current?.setGridData([]);
			props.detail2GridRef.current?.setGridData([]);
			if (res.data.length > 0) {
				props.detailGridRef.current?.setGridData(res.data);

				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = props.detailGridRef.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				props.detailGridRef.current.setColumnSizeList(colSizeList);

				// 조회 조건 설정
				const params = {
					...props.form.getFieldsValue(),
				};

				setDetail2GridData(params);
			}
		});
	};

	const setDetail2GridData = (params: any) => {
		// API 호출
		getTab3Detail2List(params).then(res => {
			props.detail2GridRef.current?.setGridData([]);
			if (res.data.length > 0) {
				props.detail2GridRef.current?.setGridData(res.data);

				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = props.detail2GridRef.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				props.detail2GridRef.current.setColumnSizeList(colSizeList);

				props.detail2GridRef.current?.setGridData(res.data);
				const colSizeList2 = props.detail2GridRef.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				props.detail2GridRef.current.setColumnSizeList(colSizeList2);
			}
		});
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		props.detailGridRef?.current.setGridData([]);
		props.detail2GridRef?.current.setGridData([]);

		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		props.gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			props.gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 행 선택 이벤트
		 * @param {any} event 이벤트
		 */
		props.gridRef?.current.bind('selectionConstraint', (event: any) => {
			// 선택된 Row가 다를 경우에만 검색
			if (event.rowIndex !== event.toRowIndex) {
				const gridRefCur = props.gridRef.current;

				if (gridRefCur) {
					// 조회 조건 설정
					const params = {
						...props.form.getFieldsValue(),
					};
					setDetailGridData(params);
				}
			}
		});

		/**
		 * 상세 그리드 행 선택 이벤트
		 * @param {any} event 이벤트
		 */
		props.detailGridRef?.current.bind('selectionConstraint', (event: any) => {
			// 선택된 Row가 다를 경우에만 검색
			if (event.rowIndex !== event.toRowIndex) {
				const gridRefCur = props.detailGridRef.current;

				if (gridRefCur) {
					// 선택된 행의 데이터를 가져온다.
					const item = gridRefCur.getItemByRowIndex(event.toRowIndex);
					const masterSelectedRow = props.gridRef.current.getSelectedRows()[0];

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
		const gridRefCur = props.gridRef.current;
		if (gridRefCur) {
			// 기존 DC_로 시작하는 컬럼들을 모두 제거한다.
			const currentColLength = gridRefCur.getColumnLayout().length;
			for (let i = currentColLength - 1; i >= 5; i--) {
				gridRefCur.removeColumn(i);
			}
			//DC_로 시작하는 데이터 개수만큼 그리드의 컬럼을 추가한다.
			for (const key in props.data[0]) {
				if (key.startsWith('DC_')) {
					const dcCode = key.split('_')[1];
					const dcName =
						userDccodeList
							.find((item: any) => item.dccode === dcCode)
							?.dcname.split(']')[1]
							.replace('물류센터', '')
							.replace('센터(물류대행)', '') || '';
					const cItem = { dataField: key, dataType: 'numeric', headerText: dcName };
					gridRefCur.addColumn(cItem);
				}
			}

			// 그리드 데이터 세팅
			gridRefCur.setGridData(props.data);

			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);

				// 선택된 행의 데이터를 가져온다.
				const params = {
					...props.form.getFieldsValue(),
				};
				setDetailGridData(params);
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		props.gridRef?.current?.resize?.('100%', '100%');
		props.gridRef2?.current?.resize?.('100%', '100%');
		props.detail2GridRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<Splitter
			onResizing={resizeAllGrids}
			onResizeEnd={resizeAllGrids}
			items={[
				<GridAutoHeight key="omPurchaseCtl-tab3-left-grid" style={{ paddingTop: 10 }}>
					<AUIGrid ref={props.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={masterFooterLayout} />
				</GridAutoHeight>,
				<Splitter
					key="omPurchaseCtl-tab3-right-splitter"
					direction="vertical"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<GridAutoHeight key="omPurchaseCtl-tab3-right-grid-top" style={{ paddingTop: 10 }}>
							<AUIGrid
								ref={props.detailGridRef}
								columnLayout={detailGridCol}
								gridProps={gridProps}
								footerLayout={detailFooterLayout}
							/>
						</GridAutoHeight>,
						<GridAutoHeight key="omPurchaseCtl-tab3-right-grid-bottom" style={{ paddingTop: 10 }}>
							<AUIGrid
								ref={props.detail2GridRef}
								columnLayout={detail2GridCol}
								gridProps={gridProps}
								footerLayout={detail2FooterLayout}
							/>
						</GridAutoHeight>,
					]}
				/>,
			]}
		/>
	);
});

export default OmPurchaseCtlTab3;
