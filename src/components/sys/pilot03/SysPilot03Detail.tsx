// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import PageGridBtn from '@/components/common/PageGridBtn';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

const SysPilot03Detail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
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
		},
		{
			dataField: 'progCd',
			headerText: '프로그램 코드',
		},
		{
			dataField: 'progNm',
			headerText: '프로그램명',
			style: 'left',
		},
		{
			dataField: 'progLvl',
			headerText: '레벨',
		},
		{
			dataField: 'progNo',
			headerText: '내부순서',
			style: 'left',
		},
		{
			dataField: 'authority',
			headerText: '권한코드',
			style: 'left',
		},
		{
			dataField: 'systemCl',
			headerText: '시스템구분',
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
		},
		{
			dataField: 'progUrl',
			headerText: '프로그램URL',
			style: 'left',
		},
		{
			dataField: 'progArgs',
			headerText: '프로그램인자값',
			style: 'left',
		},
		{
			dataField: 'btn1Nm',
			headerText: '사용버튼1',
		},
		{
			dataField: 'btn2Nm',
			headerText: '사용버튼2',
		},
		{
			dataField: 'btn3Nm',
			headerText: '사용버튼3',
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
		showStateColumn: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		selectionMode: 'multipleCells', // 셀 선택모드
		rowIdField: 'rowId',

		// 트리 구조 관련 속성
		treeColumnIndex: 1, // 계층형 그리드(트리 그리드) 에서 트리 아이콘을 출력시킬 칼럼 인덱스를 지정
		displayTreeOpen: true, // 최초 보여질 때 모두 열린 상태로 출력 여부
		flat2tree: true,
		treeIdField: 'progCd',
		treeIdRefField: 'refUpperProgCd',
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

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
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
			<AGrid>
				<PageGridBtn gridBtn={gridBtn} totalCnt={props.totalCnt} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default SysPilot03Detail;
