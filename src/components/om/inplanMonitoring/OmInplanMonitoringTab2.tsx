// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API Call Function
import { getCustCloseTypeDetailList, saveOrderCloseStatus } from '@/api/om/apiOmInplanMonitoring';

// Store
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

const OmInplanMonitoringTab2 = forwardRef((props: any) => {
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
			dataField: 'deliveryDate',
			headerText: t('lbl.DELIVERYDATE'),
			dataType: 'date',
		},
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
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				const dcCode = item.dcCode;
				return userDccodeList.find((item: any) => item.dccode === dcCode)?.dcname.split(']')[1] || '';
			},
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'closeCode',
			headerText: '고객마감유형',
			dataType: 'code',
			colSpan: 3,
		},
		{
			dataField: 'closeTime',
		},
		{
			dataField: 'closeCode',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('CUSTORDERCLOSETYPE', value)?.cdNm;
			},
		},
		{
			dataField: 'ordCs',
			headerText: '오더건수',
			dataType: 'numeric',
		},
		{
			dataField: 'delCs',
			headerText: '삭제건수',
			dataType: 'numeric',
		},
		{
			dataField: 'cloCs',
			headerText: '마감건수',
			dataType: 'numeric',
		},
		{
			dataField: 'opnCs',
			headerText: '오픈건수',
			dataType: 'numeric',
		},
		{
			dataField: 'ordQs',
			headerText: '주문수량',
			dataType: 'numeric',
		},
		{
			dataField: 'delQs',
			headerText: '삭제수량',
			dataType: 'numeric',
		},
		{
			dataField: 'cloQs',
			headerText: '마감수량',
			dataType: 'numeric',
		},
		{
			dataField: 'opnQs',
			headerText: '확정수량',
			dataType: 'numeric',
		},
		{
			dataField: 'wmsCloseChk',
			headerText: '마감상태',
			dataType: 'code',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any) {
				if (value === '완료') {
					return { color: '#0079c3' };
				} else {
					return { color: '#ac0c12' };
				}
			},
		},
		{
			dataField: 'wmsCloseRate',
			headerText: '마감율',
			renderer: {
				type: 'BarRenderer',
				min: 0,
				max: 100,
			},
			postfix: '%',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any) {
				if (value < 100) {
					return 'progress-bar-red';
				} else {
					return 'progress-bar-blue';
				}
			},
		},
		{
			dataField: 'btnFlag',
			headerText: '강제마감',
			dataType: 'code',
			renderer: {
				type: 'ButtonRenderer',
				labelText: '강제마감',
				onClick: (event: any) => {
					const params = {
						deliveryDt: event.item.deliveryDate,
						dcCode: event.item.dcCode,
						custOrderCloseType: event.item.closeCode,
					};

					showConfirm(null, '마감처리 하시겠습니까?\n( 일배의 경우 PO번호가 있는건만 처리 가능합니다.)', () => {
						saveOrderCloseStatus(params).then(res => {
							if (res.statusCode > -1) {
								showMessage({
									content: t('msg.MSG_COM_SUC_003'),
									modalType: 'info',
								});
								props.onSearch();
							}
						});
					});
				},
				// disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any) => {
				// 	if (value === 'N') {
				// 		return true;
				// 	}
				// 	return false;
				// },
				visibleFunction: (rowIndex: any, columnIndex: any, value: any, item: any) => {
					if (value === 'N') {
						return false;
					}
					return true;
				},
			},
		},
	];

	// 그리드 초기화
	const detailGridCol = [
		{
			dataField: 'toCustKey',
			headerText: '관리처코드',
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
			dataField: 'toCustName',
			headerText: '관리처명',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'docNo',
			headerText: '주문번호',
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
			dataField: 'skuName',
			headerText: '상품명',
		},
		{
			dataField: 'storerOpenQty',
			headerText: '주문수량',
			dataType: 'numeric',
		},
	];

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
			dataField: 'ordCs',
			positionField: 'ordCs',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'delCs',
			positionField: 'delCs',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'cloCs',
			positionField: 'cloCs',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'opnCs',
			positionField: 'opnCs',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'ordQs',
			positionField: 'ordQs',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'delQs',
			positionField: 'delQs',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'cloQs',
			positionField: 'cloQs',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'opnQs',
			positionField: 'opnQs',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		showRowCheckColumn: false,
		enableFilter: true,
		showFooter: true,
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
				if (event.dataField === 'btnFlag') {
					return;
				}

				if (gridRefCur) {
					// 선택된 행의 데이터를 가져온다.
					const selectedRow = gridRefCur.getGridData()[event.toRowIndex];

					// 조회 조건 설정
					const params = {
						...selectedRow,
						deliveryDt: selectedRow.deliveryDate,
						custOrderCloseType: selectedRow.closeCode,
						multiDcCode: selectedRow.dcCode ? [selectedRow.dcCode] : [],
					};

					// API 호출
					getCustCloseTypeDetailList(params).then(res => {
						props.detailGridRef.current?.setGridData(res.data || []);
						if (res.data.length > 0) {
							const colSizeList = props.detailGridRef.current.getFitColumnSizeList(true);
							props.detailGridRef.current.setColumnSizeList(colSizeList);
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
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = props.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);

				const selectedRow = gridRefCur.getGridData()[0];
				// 조회 조건 설정
				const params = {
					...selectedRow,
					deliveryDt: selectedRow.deliveryDate,
					custOrderCloseType: selectedRow.closeCode,
					multiDcCode: selectedRow.dcCode ? [selectedRow.dcCode] : [],
				};

				// API 호출
				getCustCloseTypeDetailList(params).then(res => {
					props.detailGridRef.current?.setGridData(res.data || []);
					if (res.data.length > 0) {
						const colSizeList = props.detailGridRef.current.getFitColumnSizeList(true);
						props.detailGridRef.current.setColumnSizeList(colSizeList);
					}
				});
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		props.gridRef?.current?.resize?.('100%', '100%');
		props.detailGridRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<Splitter
			direction="vertical"
			onResizing={resizeAllGrids}
			onResizeEnd={resizeAllGrids}
			items={[
				<GridAutoHeight key="omInplanMonitoring-tab2-grid" style={{ paddingTop: 10 }}>
					<AUIGrid ref={props.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
				</GridAutoHeight>,

				<>
					<AGrid>
						<GridTopBtn gridTitle="미마감 목록" totalCnt={props.totalCnt} gridBtn={gridBtn}></GridTopBtn>
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={props.detailGridRef} columnLayout={detailGridCol} gridProps={gridProps} />
					</GridAutoHeight>
				</>,
			]}
		/>
	);
});

export default OmInplanMonitoringTab2;
