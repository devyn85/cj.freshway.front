// Components
import AGrid from '@/assets/styled/AGrid/AGrid';
import PageGridBtn from '@/components/common/PageGridBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

const SysPilot01Detail = forwardRef((props: any, gridRef: any) => {
	const { t } = useTranslation();
	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'useYn',
			headerText: '사용',
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
			width: '40',
		},
		{
			dataField: 'progCd',
			headerText: '프로그램 코드',
			width: '200',
		},
		{
			dataField: 'progNm',
			headerText: '프로그램명',
			style: 'left',
		},
		{
			dataField: 'progLvl',
			headerText: '레벨',
			width: '40',
		},
		{
			dataField: 'progNo',
			headerText: '내부순서',
			style: 'left',
			width: '80',
		},
		{
			dataField: 'authority',
			headerText: '권한코드',
			style: 'left',
		},
		{
			dataField: 'systemCl',
			headerText: '시스템구분',
			width: '80',
		},
		{
			dataField: 'menuYn',
			headerText: t('sysmgt.menu.menuYn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
			width: '60',
		},
		{
			dataField: 'topmenuYn',
			headerText: 'TOP메뉴',
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
			width: '60',
		},
		{
			dataField: 'progUrl',
			headerText: '프로그램URL',
			style: 'left',
		},
		{
			dataField: 'refUpperProgCd',
			visible: false,
		},
		{
			dataField: 'rowId',
			visible: false,
		},
	];
	// 그리드 속성
	const gridProps = {
		editable: true,
		enterKeyColumnBase: true,
		useContextMenu: true,
		enableFilter: true,
		showStateColumn: true,
		// 트리 컬럼(즉, 폴딩 아이콘 출력 칼럼) 을 인덱스1번으로 설정함(디폴트 0번임)
		treeColumnIndex: 1,
		// 최초 보여질 때 모두 열린 상태로 출력 여부
		displayTreeOpen: true,
		flat2tree: true,
		rowIdField: 'rowId',
		treeIdField: 'progCd',
		treeIdRefField: 'refUpperProgCd',
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		autoGridHeight: true, // 자동 높이 조절
	};

	// 그리드 상단 버튼
	const gridBtn = {
		isPlus: true,
		plusFunction: function () {
			const item = {
				menuYn: 0,
				useYn: 0,
			};
			gridRef.current.addRow(item);
		},
		isMinus: true,
		minusFunction: function () {
			gridRef.current.removeRow('selectedIndex');
		},
		isCopy: true,
		copyFunction: function () {
			const selectedRow = gridRef.current.getSelectedRows();
			if (selectedRow && selectedRow.length > 0) {
				const item = selectedRow[0];
				item.menuId = '';
				item.regId = '';
				item.regDt = '';
				gridRef.current.addRow(item, 'selectionDown');
			}
		},
	};

	useEffect(() => {
		const gridRefCur = gridRef.current;

		// 에디팅 시작 이벤트 바인딩
		gridRefCur.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRefCur.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField == 'progCd') {
				return gridRefCur.isAddedById(event.item[rowIdField]);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
		}
	}, [props.data]);

	return (
		<>
			<AGrid style={{ height: '100%' }}>
				<PageGridBtn gridBtn={gridBtn} totalCnt={props.totalCnt} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default SysPilot01Detail;
