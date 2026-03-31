import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

const DpInspectDetail = forwardRef((props: any, ref: any) => {
	ref.gridRef2 = useRef();
	const { t } = useTranslation();

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef2.current.openPopup(e.item, 'sku');
				},
			},
		},
		{
			dataField: 'skuName',
			dataType: 'string',
			headerText: t('lbl.SKUNAME'),
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'plantDescr',
			headerText: t('lbl.PLANT'),
			dataType: 'string',
		},
		{
			dataField: 'channelName',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
		},
		{
			dataField: 'orderQty',
			headerText: t('lbl.ORDERQTY'),
			dataType: 'numeric',
		},
		{
			dataField: 'inspectQty',
			headerText: t('lbl.INSPECTQTY_DP'),
			dataType: 'numeric',
		},
		{
			dataField: 'shortageQty',
			headerText: t('lbl.INSPECTQTY_WD'),
			dataType: 'numeric',
		},
		{
			dataField: 'qtyPerBox',
			headerText: t('lbl.QTYPERBOX'),
			dataType: 'numeric',
		},
		{
			dataField: 'storerUom',
			headerText: t('lbl.STORERUOM'),
			dataType: 'code',
		},
		{
			dataField: 'statusName',
			headerText: t('lbl.STATUS'),
			dataType: 'code',
		},
		{
			dataField: 'dailyToCustKey',
			headerText: t('lbl.DAILY_TO_CUSTKEY'),
			dataType: 'code',
		},
		{
			dataField: 'dailyToCustName',
			headerText: t('lbl.DAILY_TO_CUSTNAME'),
			dataType: 'string',
		},
	];

	// 그리드 Props
	const gridProps = {
		showFooter: true,
		fillColumnSizeMode: false,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'),
			positionField: 'sku',
			// colSpan: 2, // 셀 가로 병합 대상은 2개로 설정
		},
		{
			dataField: 'orderQty',
			positionField: 'orderQty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'inspectQty',
			positionField: 'inspectQty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'shortageQty',
			positionField: 'shortageQty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
	];

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = ref.gridRef2.current;
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
		<>
			<AGrid>
				<GridTopBtn gridTitle={t('lbl.DETAIL_TAB')} totalCnt={props.data?.length} style={{ marginTop: '15px' }} />
			</AGrid>
			<GridAutoHeight id="dpInspect-detail.grid">
				<AUIGrid ref={ref.gridRef2} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>
		</>
	);
});

export default DpInspectDetail;
