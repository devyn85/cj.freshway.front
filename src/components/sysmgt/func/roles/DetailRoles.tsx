import AGrid from '@/assets/styled/AGrid/AGrid';
import PageGridBtn from '@/components/common/PageGridBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

const DetailRoles = forwardRef((props: any, gridRef: any) => {
	const { t } = useTranslation();
	useEffect(() => {
		const gridRefCur = gridRef.current;
		// 에디팅 시작 이벤트 바인딩
		gridRefCur.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRefCur.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField == 'authority') {
				return gridRefCur.isAddedById(event.item[rowIdField]);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});
	}, []);

	/*
	### 그리드 초기화 ###
	*/
	const gridCol = [
		{
			dataField: 'authority',
			headerText: t('sysmgt.roles.group.authority'), //권한아이디
			required: true,
		},
		{
			dataField: 'roleNm',
			headerText: t('sysmgt.roles.group.roleNm'), //권한명
			style: 'left',
			required: true,
		},
		{
			dataField: 'description',
			headerText: t('sysmgt.roles.group.description'), //설명
			width: '150',
			style: 'left',
			required: true,
		},
		{
			dataField: 'regId',
			headerText: t('com.col.regId'),
			editable: false,
		},
		{
			dataField: 'regDt',
			headerText: t('com.col.regYmd'),
			editable: false,
		},
	];
	// 그리드 속성
	const gridProps = {
		editable: true,
		enterKeyColumnBase: true,
		useContextMenu: true,
		enableFilter: true,
		showStateColumn: true,
	};

	// 그리드 상단 버튼
	const gridBtn = {
		isPlus: true,
		plusFunction: function () {
			gridRef.current.addRow({});
		},
		isMinus: true,
		minusFunction: function () {
			gridRef.current.removeRow('selectedIndex');
		},
	};

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

export default DetailRoles;
