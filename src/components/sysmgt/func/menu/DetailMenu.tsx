//Components
import AGrid from '@/assets/styled/AGrid/AGrid';
import PageGridBtn from '@/components/common/PageGridBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

const DetailMenu = forwardRef((props: any, gridRef: any) => {
	const { t } = useTranslation();
	/*
	### 그리드 초기화 ###
	*/
	const gridCol = [
		{
			dataField: 'menuId',
			headerText: t('sysmgt.menu.menuId'),
		},
		{
			dataField: 'menuNm',
			headerText: t('sysmgt.menu.menuNm'),
			style: 'left',
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
			width: '80',
		},
		{
			dataField: 'useYn',
			headerText: t('com.col.useYn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
			width: '80',
		},
		{
			dataField: 'isPopup',
			headerText: t('sysmgt.menu.isPopup'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
			width: '80',
			visible: false,
		},
		{
			dataField: 'menuUrl',
			headerText: t('sysmgt.menu.menuUrl'),
			style: 'left',
		},
		{
			dataField: 'description',
			headerText: t('sysmgt.menu.description'),
			visible: false,
		},
		{
			dataField: 'sortOrder',
			headerText: t('sysmgt.menu.sortOrder'),
			width: '80',
		},
		{
			dataField: 'refMenuId',
			headerText: t('sysmgt.menu.upperMenuId'),
			visible: false,
		},
		{
			dataField: 'upperMenuId',
			headerText: t('sysmgt.menu.upperMenuId'),
			style: 'left',
			width: '150',
		},
		{
			dataField: 'regId',
			headerText: t('com.col.regId'),
			editable: false,
			width: '100',
		},
		{
			dataField: 'regDt',
			headerText: t('com.col.regYmd'),
			editable: false,
			width: '100',
		},
		{
			dataField: 'refUpperMenuId',
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
		treeColumnIndex: 0,
		// 최초 보여질 때 모두 열린 상태로 출력 여부
		displayTreeOpen: true,
		flat2tree: true,
		rowIdField: 'rowId',
		treeIdField: 'menuId',
		treeIdRefField: 'refUpperMenuId',
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
			if (event.dataField == 'menuId') {
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
			<AGrid>
				<PageGridBtn gridBtn={gridBtn} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default DetailMenu;
