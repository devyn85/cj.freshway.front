import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import GridAutoHeight from '@/components/common/GridAutoHeight';
import { GridBtnPropsType } from '@/types/common';

const DpInspectHeader = forwardRef((props: any, ref: any) => {
	ref.gridRef = useRef();
	const { t } = useTranslation();

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'slipDt',
			headerText: t('lbl.CONFIRMDATE_DP'),
			dataType: 'date',
		},
		{
			dataField: 'fromCustKey',
			headerText: t('lbl.VENDOR'),
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.fromCustKey,
							custtype: 'P' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
						},
						'cust',
					);
				},
			},
		},
		{
			dataField: 'fromCustName',
			headerText: t('lbl.FROM_CUSTNAME_DP'),
			dataType: 'string',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'inspectPlanCnt',
			headerText: t('lbl.INSPECTPLANCNT_DP'),
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'inspectedCnt',
			headerText: t('lbl.INSPECTEDCNT_DP'),
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'inspectRate',
			headerText: t('lbl.INSPECTRATE_DP'),
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'statusName',
			headerText: t('lbl.STATUS'),
			dataType: 'code',
		},
		{
			dataField: 'slipNo',
			headerText: t('lbl.SLIPNO'),
			dataType: 'code',
		},
		{
			dataField: 'issueTypeName',
			headerText: t('lbl.ISSUETYPE_CUST'),
		},
	];

	// 그리드 Props
	const gridProps = {};

	// FooterLayout Props
	const footerLayout = [
		{
			dataField: 'inspectPlanCnt',
			positionField: 'inspectPlanCnt',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
		{
			dataField: 'inspectedCnt',
			positionField: 'inspectedCnt',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRefGrp, // 타겟 그리드 Ref
		btnArr: [],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
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
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
			</AGrid>
			<GridAutoHeight id="dpInspect-grid">
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>
		</>
	);
});

export default DpInspectHeader;
