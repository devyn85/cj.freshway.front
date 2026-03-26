// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API Call Function
import { getTotalMasterList } from '@/api/om/apiOmInplanMonitoring';

// Store
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

const OmInplanMonitoringTab1 = forwardRef((props: any) => {
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
		},
		{
			dataField: 'ifSendType',
			headerText: t('lbl.IF_SEND_TYPE'),
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const codeList = [
					{ comCd: 'PO', cdNm: '입고' },
					{ comCd: 'SO', cdNm: '출고' },
					{ comCd: 'JASO', cdNm: '자소' },
					{ comCd: 'STOFS', cdNm: 'STO점포' },
					{ comCd: 'STODC', cdNm: '센터' },
					{ comCd: 'WMSPO', cdNm: '협력사반품' },
				];
				const result = codeList.find((el: any) => {
					if (el.comCd === value) {
						return el;
					}
				});
				return result?.cdNm || '';
			},
			cellMerge: true,
		},
		{
			dataField: 'plant',
			headerText: t('lbl.PLANT'),
			dataType: 'code',
		},
		{
			dataField: 'weight',
			headerText: t('lbl.WEIGHT'),
			dataType: 'numeric',
		},
		{
			headerText: '인터페이스(주문,판매단위)',
			children: [
				{
					headerText: '최초',
					children: [
						{
							dataField: 'storerOrderCnt',
							headerText: '건수',
							dataType: 'numeric',
						},
						{
							dataField: 'storerOrderQty',
							headerText: '수량',
							dataType: 'numeric',
						},
					],
				},
				{
					headerText: '최종',
					children: [
						{
							dataField: 'storerOpenCnt',
							headerText: '건수',
							dataType: 'numeric',
						},
						{
							dataField: 'storerOpenQty',
							headerText: '수량',
							dataType: 'numeric',
						},
					],
				},
				{
					headerText: '삭제',
					children: [
						{
							dataField: 'orderDelCnt',
							headerText: '건수',
							dataType: 'numeric',
						},
						{
							dataField: 'orderDelQty',
							headerText: '수량',
							dataType: 'numeric',
						},
					],
				},
				{
					headerText: 'SAP미마감',
					children: [
						{
							dataField: 'orderOmsflagNCnt',
							headerText: '건수',
							dataType: 'numeric',
						},
						{
							dataField: 'orderOmsflagNQty',
							headerText: '수량',
							dataType: 'numeric',
						},
					],
				},
				{
					headerText: '마감',
					children: [
						{
							dataField: 'orderOmsflagCnt',
							headerText: '건수',
							dataType: 'numeric',
						},
						{
							dataField: 'orderOmsflagQty',
							headerText: '수량',
							dataType: 'numeric',
						},
					],
				},
				{
					headerText: '실적',
					children: [
						{
							dataField: 'storerConfirmCnt',
							headerText: '건수',
							dataType: 'numeric',
						},
						{
							dataField: 'storerConfirmQty',
							headerText: '수량',
							dataType: 'numeric',
						},
					],
				},
				{
					headerText: '전송',
					children: [
						{
							dataField: 'orderIfFlagCnt',
							headerText: '건수',
							dataType: 'numeric',
						},
						{
							dataField: 'orderIfFlagQty',
							headerText: '수량',
							dataType: 'numeric',
						},
					],
				},
			],
		},
		{
			headerText: '작업량(기본단위)',
			children: [
				{
					headerText: '예정',
					children: [
						{
							dataField: 'orderCnt',
							headerText: '건수',
							dataType: 'numeric',
						},
						{
							dataField: 'orderQty',
							headerText: '수량',
							dataType: 'numeric',
						},
					],
				},
				{
					headerText: '지시',
					children: [
						{
							dataField: 'processCnt',
							headerText: '건수',
							dataType: 'numeric',
						},
						{
							dataField: 'processQty',
							headerText: '수량',
							dataType: 'numeric',
						},
					],
				},
				{
					headerText: '피킹',
					children: [
						{
							dataField: 'workCnt',
							headerText: '건수',
							dataType: 'numeric',
						},
						{
							dataField: 'workQty',
							headerText: '수량',
							dataType: 'numeric',
						},
					],
				},
				{
					headerText: '상차검수',
					children: [
						{
							dataField: 'inspectCnt',
							headerText: '건수',
							dataType: 'numeric',
						},
						{
							dataField: 'inspectQty',
							headerText: '수량',
							dataType: 'numeric',
						},
					],
				},
				{
					headerText: '확정',
					children: [
						{
							dataField: 'confirmCnt',
							headerText: '건수',
							dataType: 'numeric',
						},
						{
							dataField: 'confirmQty',
							headerText: '수량',
							dataType: 'numeric',
						},
					],
				},
			],
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
			dataField: 'weight',
			positionField: 'weight',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'storerOrderCnt',
			positionField: 'storerOrderCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'storerOrderQty',
			positionField: 'storerOrderQty',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'storerOpenCnt',
			positionField: 'storerOpenCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'storerOpenQty',
			positionField: 'storerOpenQty',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'orderDelCnt',
			positionField: 'orderDelCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'orderDelQty',
			positionField: 'orderDelQty',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'orderOmsflagNCnt',
			positionField: 'orderOmsflagNCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'orderOmsflagNQty',
			positionField: 'orderOmsflagNQty',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'orderOmsflagCnt',
			positionField: 'orderOmsflagCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'orderOmsflagQty',
			positionField: 'orderOmsflagQty',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'storerConfirmCnt',
			positionField: 'storerConfirmCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'storerConfirmQty',
			positionField: 'storerConfirmQty',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'orderIfFlagCnt',
			positionField: 'orderIfFlagCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'orderIfFlagQty',
			positionField: 'orderIfFlagQty',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'orderCnt',
			positionField: 'orderCnt',
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
			dataField: 'processCnt',
			positionField: 'processCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'processQty',
			positionField: 'processQty',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'workCnt',
			positionField: 'workCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'workQty',
			positionField: 'workQty',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'inspectCnt',
			positionField: 'inspectCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'inspectQty',
			positionField: 'inspectQty',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'confirmCnt',
			positionField: 'confirmCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'confirmQty',
			positionField: 'confirmQty',
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
					// 선택된 행의 데이터를 가져온다.
					const selectedRow = gridRefCur.getGridData()[event.toRowIndex];

					// 조회 조건 설정
					const params = {
						...selectedRow,
						deliveryDt: selectedRow.deliveryDate,
						selectType: 'DETAIL',
						multiDcCode: selectedRow.dcCode ? [selectedRow.dcCode] : [],
					};

					// API 호출
					getTotalMasterList(params).then(res => {
						props.detailGridRef.current?.setGridData(res.data || []);
						if (res.data.length > 0) {
							const colSizeList = props.detailGridRef.current.getFitColumnSizeList(true);
							props.detailGridRef.current.setColumnSizeList(colSizeList);
						}
					});
				}
			}
		});

		//마스터 그리드는 plant 칼럼 숨김
		props.gridRef?.current.hideColumnByDataField('plant');
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
					selectType: 'DETAIL',
					multiDcCode: selectedRow.dcCode ? [selectedRow.dcCode] : [],
				};

				// API 호출
				getTotalMasterList(params).then(res => {
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
				<>
					{/* <GridTopBtn gridTitle="마감진행현황 목록" totalCnt={props.totalCnt} gridBtn={gridBtn}></GridTopBtn> */}
					<GridAutoHeight key="omInplanMonitoringTab1-top" style={{ paddingTop: 10 }}>
						<AUIGrid ref={props.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
					</GridAutoHeight>
				</>,
				<>
					<AGrid>
						<GridTopBtn gridTitle="송신파일별 목록" totalCnt={props.totalCnt} gridBtn={gridBtn} />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid
							ref={props.detailGridRef}
							columnLayout={gridCol}
							gridProps={gridProps}
							footerLayout={footerLayout}
						/>
					</GridAutoHeight>
				</>,
			]}
		/>
	);
});

export default OmInplanMonitoringTab1;
