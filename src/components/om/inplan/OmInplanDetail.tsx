// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API Call Function
import { apiGetDetailList } from '@/api/om/apiOmInplan';

// Store
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

const OmInplanDetail = forwardRef((props: any, ref: any) => {
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

	// 조회 총 건수
	const [detailTotalCnt, setDetailTotalCnt] = useState(0);

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
		// {
		// 	dataField: 'storerKey',
		// 	headerText: t('lbl.STORERKEY'),
		// 	dataType: 'string',
		// }
		{
			dataField: 'docNo',
			headerText: t('lbl.DOCNO_WD'),
			dataType: 'code',
		},
		{
			dataField: 'docType',
			headerText: t('lbl.DOCTYPE'),
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('DOCTYPE', value)?.cdNm;
			},
		},
		{
			dataField: 'other04',
			headerText: '영업조직',
			dataType: 'string',
		},
		// {
		// 	dataField: 'organize',
		// 	headerText: t('lbl.ORGANIZE'),
		// 	dataType: 'string',
		// },
		// {
		// 	dataField: 'area',
		// 	headerText: t('lbl.AREA'),
		// 	dataType: 'string',
		// },
		// {
		// 	dataField: 'docDt',
		// 	headerText: t('lbl.DOCDT'),
		// 	dataType: 'string',
		// },
		{
			dataField: 'poType',
			headerText: t('lbl.POTYPE_WD'),
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('POTYPE', value)?.cdNm;
			},
		},
		// {
		// 	dataField: 'orderType',
		// 	headerText: t('lbl.ORDERTYPE'),
		// 	dataType: 'code',
		// },
		{
			dataField: 'status',
			headerText: t('lbl.OMS_FLAG_DM'),
			dataType: 'code',
		},
		{
			dataField: 'deliveryDate',
			headerText: t('lbl.DOCDT_WD'),
			dataType: 'date',
		},
		{
			dataField: 'toCustKey',
			headerText: t('lbl.TO_CUSTKEY_WD'),
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
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
			headerText: t('lbl.TO_CUSTNAME_WD'),
			dataType: 'string',
		},
		{
			dataField: 'docLine',
			headerText: t('lbl.DOCLINE'),
			dataType: 'code',
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					e.item.skuDescr = e.item.skuName;
					ref.gridRef.current.openPopup(e.item, 'sku');
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
			headerText: '주문량',
			children: [
				{
					dataField: 'orderQty',
					headerText: t('lbl.FIRSTORDER'),
					dataType: 'numeric',
					formatString: '#,##0.99', // 2026-03-23 KSH 숫자 포맷 추가 (소수점 2자리)
				},
				{
					dataField: 'storerOrderQty',
					headerText: t('lbl.ORDERADJUST'),
					dataType: 'numeric',
					labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
						const orderQty = item.storerOrderQty || 0;
						const openQty = item.storerOpenQty || 0;
						return openQty - orderQty;
					},
					formatString: '#,##0.99', // 2026-03-23 KSH 숫자 포맷 추가 (소수점 2자리)
				},
				{
					dataField: 'storerOpenQty',
					headerText: t('lbl.LASTORDER'),
					dataType: 'numeric',
					formatString: '#,##0.99', // 2026-03-24 KSH 숫자 포맷 추가 (소수점 2자리)
				},
			],
		},
		// {
		// 	dataField: 'orderAdjustQty',
		// 	headerText: t('lbl.ORDERADJUSTQTY'),
		// 	dataType: 'numeric',
		// },
		{
			dataField: 'inspectQty',
			headerText: t('lbl.INSPECTQTY_TASK'),
			dataType: 'numeric',
			formatString: '#,##0.99', // 2026-03-23 KSH 숫자 포맷 추가 (소수점 2자리)
		},
		{
			dataField: 'confirmQty',
			headerText: t('lbl.QTY_WD'),
			dataType: 'numeric',
			formatString: '#,##0.99', // 2026-03-23 KSH 숫자 포맷 추가 (소수점 2자리)
		},
		// {
		// 	dataField: 'deliveryDate',
		// 	headerText: t('lbl.DELIVERYDATE'),
		// 	dataType: 'string',
		// },
		// {
		// 	dataField: 'delYn',
		// 	headerText: t('lbl.DEL_YN'),
		// 	dataType: 'string',
		// },
	];

	const detailGridCol = [
		{
			dataField: 'docNo',
			headerText: t('lbl.DOCNO_WD'),
			dataType: 'code',
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					e.item.skuDescr = e.item.description;
					ref.gridRef.current.openPopup(e.item, 'sku');
				},
			},
		},
		{
			dataField: 'description',
			headerText: t('lbl.SKUNAME'),
			dataType: 'string',
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
			formatString: '#,##0.99', // 2026-03-23 KSH 숫자 포맷 추가 (소수점 2자리)
		},
		{
			dataField: 'orderAdjustQty',
			headerText: t('lbl.ADJUSTQTY_AJ'),
			dataType: 'numeric',
			formatString: '#,##0.99', // 2026-03-23 KSH 숫자 포맷 추가 (소수점 2자리)
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.DEL_YN'),
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return value === 'C' ? '취소' : value;
			},
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
		},
		{
			dataField: 'editWho',
			visible: false,
		},
		{
			dataField: 'editWhoNm',
			headerText: t('lbl.EDITWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'editWho',
		},
		// {
		// 	dataField: 'openQty',
		// 	headerText: t('lbl.OPENQTY'),
		// 	dataType: 'numeric',
		// },
		// {
		// 	dataField: 'docLine',
		// 	headerText: t('lbl.DOCLINE'),
		// 	dataType: 'code',
		// },
		// {
		// 	dataField: 'area',
		// 	headerText: t('lbl.AREA'),
		// 	dataType: 'code',
		// },
		// {
		// 	dataField: 'delYnDescr',
		// 	headerText: t('lbl.DEL_YN_DESCR'),
		// 	dataType: 'string',
		// },
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		enableFilter: true,
		fillColumnSizeMode: true,
		rowStyleFunction: (rowIndex: any, item: any) => {
			// if (item.orderQty === 0) {
			if (item.delYn === 'C') {
				return 'color-danger';
			}
			return '';
		},
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
		ref.gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref.gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 행 선택 이벤트
		 * @param {any} event 이벤트
		 */
		let prevRowIndex: any = null;
		ref.gridRef?.current.bind('selectionChange', (event: any) => {
			// 선택된 Row가 다를 경우에만 검색
			if (prevRowIndex !== event.primeCell.rowIndex) {
				// 이전 행 인덱스 갱신
				prevRowIndex = event.primeCell.rowIndex;

				const gridRefCur = ref.gridRef.current;

				if (gridRefCur) {
					// 선택된 행의 데이터를 가져온다.
					const selectedRow = gridRefCur.getGridData()[event.primeCell.rowIndex];

					// 조회 조건 설정
					const params = {
						...selectedRow,
					};

					// API 호출
					apiGetDetailList(params).then(res => {
						setDetailTotalCnt(0);
						ref.detailGridRef.current?.setGridData([]);
						if (res.data.length > 0) {
							setDetailTotalCnt(res.data.length);
							ref.detailGridRef.current?.setGridData(res.data);
							const colSizeList = ref.detailGridRef.current.getFitColumnSizeList(true);
							ref.detailGridRef.current.setColumnSizeList(colSizeList);
						}
					});
				}
			}
		});
	};

	// useScrollPagingAUIGrid({
	// 	gridRef: ref.gridRef,
	// 	callbackWhenScrollToEnd: () => {
	// 		props.setCurrentPage((currentPageScr: any) => currentPageScr + 1);
	// 	},
	// 	totalCount: props.totalCount,
	// });

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
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
		const gridRefCur = ref.gridRef.current;
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
				};

				// API 호출
				apiGetDetailList(params).then(res => {
					setDetailTotalCnt(0);
					ref.detailGridRef.current?.setGridData([]);
					if (res.data.length > 0) {
						setDetailTotalCnt(res.data.length);
						ref.detailGridRef.current?.setGridData(res.data);
						const colSizeList = ref.detailGridRef.current.getFitColumnSizeList(true);
						ref.detailGridRef.current.setColumnSizeList(colSizeList);
					}
				});
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.detailGridRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<Splitter
			direction="vertical"
			onResizing={resizeAllGrids}
			onResizeEnd={resizeAllGrids}
			items={[
				<>
					<AGrid dataProps={'row-single'}>
						<GridTopBtn gridTitle="목록" totalCnt={props.totalCnt} gridBtn={gridBtn} />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
					</GridAutoHeight>
				</>,
				<>
					<AGrid dataProps={'row-single'}>
						<GridTopBtn gridTitle="상세목록" totalCnt={detailTotalCnt} gridBtn={gridBtn} />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={ref.detailGridRef} columnLayout={detailGridCol} gridProps={gridProps} />
					</GridAutoHeight>
				</>,
			]}
		/>
	);
});

export default OmInplanDetail;
