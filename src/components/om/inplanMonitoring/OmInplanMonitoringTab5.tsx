// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API Call Function
import { getChkRsltFsDetailList, getOrderListChkRsltFSIF } from '@/api/om/apiOmInplanMonitoring';

// Store
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

const OmInplanMonitoringTab5 = forwardRef((props: any, gridRef: any) => {
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
			cellMerge: true,
		},
		{
			dataField: 'dcName',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				const dcCode = item.dcCode;
				return userDccodeList.find((item: any) => item.dccode === dcCode)?.dcname.split(']')[1] || '';
			},
			filter: {
				showIcon: true,
			},
			cellMerge: true,
		},
		{
			dataField: 'deliveryDate',
			headerText: t('lbl.DELIVERYDATE'),
			dataType: 'date',
			cellMerge: true,
			mergeRef: 'dcCode',
			mergePolicy: 'restrict',
		},
		{
			dataField: 'docType',
			headerText: t('lbl.DOCTYPE'),
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('DOCTYPE', value)?.cdNm;
			},
			cellMerge: true,
			mergeRef: 'dcCode',
			mergePolicy: 'restrict',
		},
		{
			dataField: 'plant',
			headerText: t('lbl.PLANT'),
			dataType: 'code',
		},
		{
			dataField: 'closeCode',
			headerText: '고객마감유형',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('CUSTORDERCLOSETYPE', value)?.cdNm;
			},
		},
		{
			dataField: 'toCustKey',
			headerText: t('lbl.CUSTKEY'),
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					props.gridRef.current.openPopup(
						{
							custkey: e.item.toCustKey,
							custtype: 'C',
						},
						'cust',
					);
				},
			},
		},
		{
			headerText: '실적수량',
			children: [
				{
					dataField: 'cfmQf',
					headerText: '영업FS',
					dataType: 'numeric',
				},
				{
					dataField: 'cfmQs',
					headerText: 'WMS',
					dataType: 'numeric',
				},
			],
		},
		{
			headerText: '취소수량',
			children: [
				{
					dataField: 'cnlQf',
					headerText: '영업FS',
					dataType: 'numeric',
				},
				{
					dataField: 'cnlQs',
					headerText: 'WMS',
					dataType: 'numeric',
				},
			],
		},
	];

	// 그리드 초기화
	const detail1GridCol = [
		{
			dataField: 'docNo',
			headerText: '문서번호',
			dataType: 'code',
		},
		{
			dataField: 'docLine',
			headerText: '품목번호',
			dataType: 'code',
		},
		{
			dataField: 'sku',
			headerText: '상품코드',
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					e.item.skuDescr = e.item.description; // skuDescr 필드에 description 값을 설정
					props.detailGridRef.current.openPopup(e.item, 'sku');
				},
			},
		},
		{
			headerText: '확정수량',
			children: [
				{
					dataField: 'cfmQf',
					headerText: '영업FS',
					dataType: 'numeric',
				},
				{
					dataField: 'cfmQs',
					headerText: 'WMS',
					dataType: 'numeric',
				},
			],
		},
		{
			headerText: '취소수량',
			children: [
				{
					dataField: 'cnlQf',
					headerText: '영업FS',
					dataType: 'numeric',
				},
				{
					dataField: 'cnlQs',
					headerText: 'WMS',
					dataType: 'numeric',
				},
			],
		},
	];

	const detail2GridCol = [
		{
			dataField: 'ifId',
			headerText: 'IF_ID',
			dataType: 'date',
		},
		{
			dataField: 'ifDestination',
			headerText: '목적지',
		},
		{
			dataField: 'ifFlag',
			headerText: 'I/F구분',
			dataType: 'code',
		},
		{
			dataField: 'ifDate',
			headerText: '전송시간',
			dataType: 'date',
		},
		{
			headerText: '고객',
			children: [
				{
					dataField: 'storeUom',
					headerText: '단위',
					dataType: 'code',
				},
				{
					dataField: 'storeConfirmQty',
					headerText: '확정수량',
					dataType: 'numeric',
				},
				{
					dataField: 'storeCancelQty',
					headerText: '취소량',
					dataType: 'numeric',
				},
			],
		},
		{
			headerText: 'WMS',
			children: [
				{
					dataField: 'uom',
					headerText: '단위',
					dataType: 'numeric',
				},
				{
					dataField: 'confirmQty',
					headerText: '확정수량',
					dataType: 'numeric',
				},
				{
					dataField: 'confirmQty',
					headerText: '확정중량',
					dataType: 'numeric',
				},
				{
					dataField: 'cancelQty',
					headerText: '취소량',
					dataType: 'numeric',
				},
			],
		},
		{
			dataField: 'ifMemo',
			headerText: 'IF메모',
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		showRowCheckColumn: false,
		enableFilter: true,
		showFooter: true,
		enableCellMerge: true,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			dataField: 'dcCode',
			positionField: 'dcCode',
			operation: 'COUNT',
			formatString: '#,##0',
			postfix: ' rows',
		},
		{
			dataField: 'cfmQf',
			positionField: 'cfmQf',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'cfmQs',
			positionField: 'cfmQs',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'cnlQf',
			positionField: 'cnlQf',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'cnlQs',
			positionField: 'cnlQs',
			operation: 'SUM',
			formatString: '#,##0.##',
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
		gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
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
					// 선택된 행의 데이터를 가져온다.
					const selectedRow = gridRefCur.getGridData()[event.toRowIndex];

					// 조회 조건 설정
					const params = {
						...selectedRow,
						deliveryDt: selectedRow.deliveryDate,
					};

					// API 호출
					getChkRsltFsDetailList(params).then(res => {
						props.detailGridRef.current?.setGridData(res.data || []);
						if (res.data.length > 0) {
							const colSizeList = props.detailGridRef.current.getFitColumnSizeList(true);
							props.detailGridRef.current.setColumnSizeList(colSizeList);
						}
					});
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
				const gridRefCur = props.gridRef.current;
				const detailGridRefCur = props.detailGridRef.current;

				if (gridRefCur) {
					// 선택된 행의 데이터를 가져온다.
					const selectedRow = detailGridRefCur.getGridData()[event.toRowIndex];
					const masterSelectedRow = gridRefCur.getSelectedRows()[0];

					// 조회 조건 설정
					const params = {
						...selectedRow,
						deliveryDt: masterSelectedRow.deliveryDate,
						dcCode: masterSelectedRow.dcCode,
						docType: masterSelectedRow.docType,
					};

					// API 호출
					getOrderListChkRsltFSIF(params).then(res => {
						props.detail2GridRef.current?.setGridData(res.data || []);
						if (res.data.length > 0) {
							const colSizeList = props.detail2GridRef.current.getFitColumnSizeList(true);
							props.detail2GridRef.current.setColumnSizeList(colSizeList);
						}
					});
				}
			}
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
	});

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = props.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const selectedRow = gridRefCur.getGridData()[0];
				// 조회 조건 설정
				const params = {
					...selectedRow,
					deliveryDt: selectedRow.deliveryDate,
				};

				// API 호출
				getChkRsltFsDetailList(params).then(res => {
					props.detailGridRef.current?.setGridData(res.data || []);
					if (res.data.length > 0) {
						const colSizeList = props.detailGridRef.current.getFitColumnSizeList(true);
						props.detailGridRef.current.setColumnSizeList(colSizeList);
					}
				});

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
		props.gridRef?.current?.resize?.('100%', '100%');
		props.detailGridRef?.current?.resize?.('100%', '100%');
		props.detail2GridRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<Splitter
			direction="vertical"
			onResizing={resizeAllGrids}
			onResizeEnd={resizeAllGrids}
			items={[
				<GridAutoHeight key="omInplanMonitoring-tab5-grid" style={{ paddingTop: 10 }}>
					<AUIGrid ref={props.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
				</GridAutoHeight>,
				<Splitter
					key="omInplanMonitoring-tab5-splitter-bottom"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<>
							<AGrid>
								<GridTopBtn gridTitle="상세현황" totalCnt={props.totalCnt} gridBtn={gridBtn} />
							</AGrid>
							<GridAutoHeight>
								<AUIGrid
									ref={props.detailGridRef}
									columnLayout={detail1GridCol}
									gridProps={gridProps}
									footerLayout={footerLayout}
								/>
							</GridAutoHeight>
						</>,
						<>
							<AGrid>
								<GridTopBtn gridTitle=" " totalCnt={props.totalCnt} gridBtn={gridBtn} />
							</AGrid>
							<GridAutoHeight>
								<AUIGrid
									ref={props.detail2GridRef}
									columnLayout={detail2GridCol}
									gridProps={gridProps}
									footerLayout={footerLayout}
								/>
							</GridAutoHeight>
						</>,
					]}
				/>,
			]}
		/>
	);
});

export default OmInplanMonitoringTab5;
