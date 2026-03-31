import AGrid from '@/assets/styled/AGrid/AGrid';
import PageGridBtn from '@/components/common/PageGridBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
const DetailCntrPickingGroup = forwardRef((props: any, ref: any) => {
	ref.gridRef = useRef();

	const gridCol = [
		{ dataField: 'dccode', headerText: '물류센터' },
		{ dataField: 'plant', headerText: '플랜트', width: '20%', style: 'left' },
		{ dataField: 'organize', headerText: '창고' },
		{ dataField: 'area', headerText: '작업구역' },
		{ dataField: 'storagetype', headerText: '저장조건' },
		{ dataField: 'distancetype', headerText: '원거리유형' },
		{ dataField: 'batchgroup', headerText: '배치그룹' },
		{ dataField: 'description', headerText: '내역', width: '25%', style: 'left' },
		{ dataField: 'etcode1', headerText: 'etcode1' },
		{ dataField: 'etcode2', headerText: 'etcode2' },
		{ dataField: 'etcode3', headerText: 'etcode3' },
		{ dataField: 'etcode4', headerText: 'etcode4' },
		{ dataField: 'status', headerText: '진행상태' },
		{
			dataField: 'editdate',
			headerText: '변경일자',
			style: 'left',
			width: '20%',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{ dataField: 'serialkey', visible: false },
	];

	const gridProps = {
		editable: false, // 편집 가능 여부
		editBeginMode: 'doubleClick', //cell 더블클릭시 에디트 활성화 (또는 F2)
		//selectionMode: 'multipleCells', //드래그하여 cell 멀티셀렉트
		// showStateColumn: true, // row 편집 여부
		//enableColumnResize: true, // 열 사이즈 조정 여부
		// showRowCheckColumn: true, // 체크박스 컬럼 표시 여부
		//fixedColumnCount: 2,
		fillColumnSizeMode: false, // 그리드 너비에 맞춰서 열 크기 조정 여부
		showFooter: true, // 푸터 표시 여부
	};
	// FooterLayout Props
	const footerLayout = [
		{
			dataField: 'dccode',
			positionField: 'dccode',
			operation: 'COUNT',
			prefix: '총 ',
			postfix: '개',
		},
	];
	// 그리드 버튼
	const gridBtn = {};
	// grid data 변경 감지
	useEffect(() => {
		if (!ref.gridRef.current) {
			//console.warn('AUIGrid ref 연결 안됨');
			return;
		}
		const gridRefCur1 = ref.gridRef.current;

		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);
		}
	}, [props.data]);

	return (
		<>
			<div className="flex-wrap">
				<AGrid>
					<PageGridBtn gridBtn={gridBtn} gridTitle="피킹그룹정보" />
					<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
				</AGrid>
			</div>
		</>
	);
});

export default DetailCntrPickingGroup;
