/*
 ############################################################################
 # FiledataField	: GridEventSample.tsx
 # Description		: 그리드 이벤트 샘플 
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Libs
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils
import { showAlert } from '@/util/MessageUtil';

// Components
import PageGridBtn from '@/components/common/PageGridBtn';

// API Call Function
import { apiGetUserList } from '@/api/common/apiSysmgt';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Style & CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import { useMoveMenu } from '@/hooks/useMoveMenu';
import { Input } from 'antd';

const GridEventSample = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { moveMenu } = useMoveMenu();

	// AUI Grid Component 제어를 위한 Ref
	const gridRef = useRef(null);

	// AUI Grid Props
	const gridProps = {
		editable: true,
		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
	};

	const [selectedUser, setSelectedUser] = useState('');

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// AUI Grid Columns
	const getGridCol = () => {
		return [
			{
				dataField: 'userId',
				headerText: t('sysmgt.users.user.userId') + '(메뉴이동)',
				width: '15%',
				required: true,
				maxlength: 12,
				style: 'aui-grid-cell-link',
				/**
				 * [AUIGrid_style.scss]
				 * .aui-grid-cell-link {
				 * 		text-decoration: underline;
				 * 		opacity: 0.6;
				 * 		&:hover {
				 * 			cursor: pointer;
				 * 			opacity: 1;
				 * 		}
				 * 	}
				 */
			},
			{
				dataField: 'userNm',
				headerText: t('sysmgt.users.user.userNm'),
				width: '15%',
				required: true,
				maxlength: 200,
			},
			{
				dataField: 'empNo',
				headerText: t('sysmgt.users.user.empNo'),
				width: '10%',
				maxlength: 20,
			},
			{
				dataField: 'mailAddr',
				headerText: '이메일',
				width: '15%',
				maxlength: 20,
			},
			{
				dataField: 'userStatus',
				headerText: t('sysmgt.users.user.userStatus'),
				width: '10%',
				required: true,
				filter: {
					showIcon: true,
				},
				commRenderer: {
					type: 'dropDown',
					list: getCommonCodeList('USER_STATUS'),
				},
			},
			{
				dataField: 'userEnable',
				headerText: t('sysmgt.users.user.userEnable'),
				width: '10%',
				renderer: {
					type: 'CheckBoxEditRenderer',
					checkValue: '1',
					unCheckValue: '0',
					editable: true,
				},
			},
			{
				dataField: 'regId',
				headerText: t('com.col.regId'),
				width: '10%',
				editable: false,
				filter: {
					showIcon: true,
				},
			},
			{
				dataField: 'regDt',
				headerText: t('com.col.regDt'),
				width: '10%',
				editable: false,
			},
		];
	};

	// data 조회 method
	const onClickSearchButton = () => {
		// Grid Data 초기화
		gridRef.current?.clearGridData();

		// 사용자 정보 조회
		apiGetUserList({}).then(res => {
			const gridData = res.data;
			// data setting
			gridRef.current?.setGridData(gridData);
		});
	};

	/**
	 * ==========================================================================
	-  AUI Grid Event Initailize
	- [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */
	const initEvent = () => {
		/**
		 * 셀 편집 시작 시 발생하는 이벤트 바인딩
		 * @event cellEditBegin
		 * @param {object} event 이벤트
		 * @returns {void}
		 * 			- type : 이벤트 유형
		 * 			- pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
		 * 			- rowIndex : 행(Row) 인덱스
		 * 			- columnIndex : 열(Column) 인덱스
		 * 			- value : 원래 데이터의 해당 셀 값(value)
		 * 			- headerText : 현재 열(Column)의 헤더 텍스트
		 * 			- item : 해당 행(Row)에 출력되고 있는 행 아이템 객체 (Object)
		 * 			- dataField : 행(Row) 아이템에서 현재 열(Column)이 출력되고 있는 데이터의 KeyField
		 * 			- position : 셀의 전역 좌표계(Body 기준) 또는 지역 좌표계(그리드 부모 기준) 위치(x좌표 : event.position.x, y좌표 : event.position.y, x지역좌표 : event.position.localX, y지역좌표 : event.position.localY)
		 * 			- size : 해당 셀의 가로, 세로 사이즈(width : event.size.width, height : event.size.height)
		 * 			- isClipboard : 붙여 넣기(Ctrl+V) 로 이벤트가 발생했는지 여부 (Boolean)
		 * 			- which : 편집 시작을 어떤 방식으로 수행 했는지에 대한 정보(String or Number)
		 */
		gridRef.current?.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRef.current?.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField == 'userId') {
				return gridRef.current?.isAddedById(event.item[rowIdField]);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});

		/**
		 * 셀 편집 종료 직전 이벤트 바인딩 - 입력 값 validation 혹은 후처리 시 사용
		 * @event cellEditEndBefore
		 * @param {object} event 이벤트
		 * 			- type : 이벤트 유형
		 * 			- pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
		 * 			- rowIndex : 행(Row) 인덱스
		 * 			- columnIndex : 열(Column) 인덱스
		 * 			- oldValue : 변경 전 셀 값(value)
		 * 			- value : 원래 데이터의 해당 셀 값(value)
		 * 			- headerText : 현재 열(Column)의 헤더 텍스트
		 * 			- item : 해당 행(Row)에 출력되고 있는 행 아이템 객체 (Object)
		 * 			- dataField : 행(Row) 아이템에서 현재 열(Column)이 출력되고 있는 데이터의 KeyField
		 * 			- isClipboard : 붙여 넣기(Ctrl+V) 로 이벤트가 발생했는지 여부 (Boolean)
		 * 			- which : 편집 시작을 어떤 방식으로 수행 했는지에 대한 정보(String or Number)
		 * @returns {void} 최종 수정값
		 */
		gridRef.current?.bind('cellEditEndBefore', function (event: any) {
			// 공백 문자 제거
			if (['userId', 'userNm', 'empNo', 'mailAddr'].includes(event.dataField)) {
				return event.value.replace(' ', '');
			}
		});

		/**
		 * 셀 편집 종료 이벤트 바인딩 - 입력 값 validation 혹은 후처리 시 사용
		 * @event cellEditEnd
		 * @param {object} event 이벤트
		 * 			- type : 이벤트 유형
		 * 			- pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
		 * 			- rowIndex : 행(Row) 인덱스
		 * 			- columnIndex : 열(Column) 인덱스
		 * 			- oldValue : 변경 전 셀 값(value)
		 * 			- value : 원래 데이터의 해당 셀 값(value)
		 * 			- headerText : 현재 열(Column)의 헤더 텍스트
		 * 			- item : 해당 행(Row)에 출력되고 있는 행 아이템 객체 (Object)
		 * 			- dataField : 행(Row) 아이템에서 현재 열(Column)이 출력되고 있는 데이터의 KeyField
		 * 			- isClipboard : 붙여 넣기(Ctrl+V) 로 이벤트가 발생했는지 여부 (Boolean)
		 * 			- which : 편집 시작을 어떤 방식으로 수행 했는지에 대한 정보(String or Number)
		 */
		gridRef.current?.bind('cellEditEnd', function (event: any) {
			// 사용 여부 컬럼 비활성화 시 사용자 상태를 사용 안 함으로 변경
			if (event.dataField == 'userEnable') {
				if (event.value === '0') {
					gridRef.current.setCellValue(event.rowIndex, 'userStatus', '99');
				} else if (event.value === '1') {
					gridRef.current.setCellValue(event.rowIndex, 'userStatus', '01');
				}
			}
		});

		/**
		 * selectionMode 가 "none" 이 아닌 경우 셀 또는 행 선택이 변경되었을 때 발생하는 이벤트 바인딩
		 * @event selectionChange
		 * @param {object} event 이벤트
		 * 			- type : 이벤트 유형
		 * 			- pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
		 * 			- primeCell : 다수의 선택 셀 중 기본이 되는 주요 셀 정보 (Object) - Ver. 2.13 이상 사용 가능
		 * 				> rowIndex : 행(Row)의 인덱스
		 * 				> columnIndex : 열(Column)의 인덱스
		 * 				> dataField : 선택 열(Column)이 출력하고 있는 그리드 데이터의 필드명
		 * 				> headerText : 선택 열(Column)의 헤더 텍스트
		 * 				> editable : 선택 열(Column)의 수정 가능 여부
		 * 				> value : 선택 셀의 현재 그리드 값
		 * 				> rowIdValue : rowIdField 로 지정한 키에 대한 값. 즉, 행의 고유값 (rowIdField 설정 선행 필수)
		 * 				> item : 선택 행 아이템들을 갖는 Object
		 * 			- selectedItems : 선택된 아이템들을 요소로 갖는 배열(Array-Object)
		 */
		gridRef.current?.bind('selectionChange', function (event: any) {
			// 우측 상단 input에 현재 선택된 사용자 setting
			const primeCell = event.primeCell;
			setSelectedUser(primeCell.item['userNm']);
		});

		/**
		 * 단일 셀 클릭 시 발생하는 이벤트 바인딩
		 * @event cellClick
		 * @param {object} event 이벤트
		 * 			- type : 이벤트 유형
		 * 			- pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
		 * 			- rowIndex : 행(Row) 인덱스
		 * 			- columnIndex : 열(Column) 인덱스
		 * 			- dataField : 행(Row) 아이템에서 현재 열(Column)이 출력되고 있는 데이터의 KeyField
		 * 			- editable : 해당 셀의 수정 가능 여부
		 * 			- value : 셀에 출력되고 있는 값(value)
		 * 			- rowIdValue : rowIdField 로 지정한 키에 대한 값. 즉, 행(Row)의 고유값 (rowIdField 설정 선행 필수)
		 * 			- headerText : 현재 열(Column)의 헤더 텍스트
		 * 			- item : 해당 행(Row)에 출력되고 있는 행 아이템 객체 (Object)
		 * 			- treeIcon : 트리그리드인 경우 트리그리드의 열기/닫기 버턴 클릭 여부(Boolean)
		 * 			- orgEvent : 자바스크립트의 오리지널 이벤트 객체 (Object)
		 */
		gridRef.current?.bind('cellClick', function (event: any) {
			// 셀 클릭으로 row의 checkbox (un)check
			const isChecked = gridRef.current.isCheckedRowById(event.rowIdValue);
			if (isChecked) {
				gridRef.current.addUncheckedRowsByIds(event.rowIdValue);
			} else {
				gridRef.current.addCheckedRowsByIds(event.rowIdValue);
			}
		});

		/**
		 * 단일 셀 더블 클릭 시 발생하는 이벤트 바인딩
		 * @event cellDoubleClick
		 * @param {object} event 이벤트
		 * 			- type : 이벤트 유형
		 * 			- pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
		 * 			- rowIndex : 행(Row) 인덱스
		 * 			- columnIndex : 열(Column) 인덱스
		 * 			- dataField : 행(Row) 아이템에서 현재 열(Column)이 출력되고 있는 데이터의 KeyField
		 * 			- editable : 해당 셀의 수정 가능 여부
		 * 			- value : 셀에 출력되고 있는 값(value)
		 * 			- rowIdValue : rowIdField 로 지정한 키에 대한 값. 즉, 행(Row)의 고유값 (rowIdField 설정 선행 필수)
		 * 			- headerText : 현재 열(Column)의 헤더 텍스트
		 * 			- item : 해당 행(Row)에 출력되고 있는 행 아이템 객체 (Object)
		 * 			- treeIcon : 트리그리드인 경우 트리그리드의 열기/닫기 버턴 클릭 여부(Boolean)
		 * 			- orgEvent : 자바스크립트의 오리지널 이벤트 객체 (Object)
		 */
		gridRef.current?.bind('cellDoubleClick', function (event: any) {
			// 사용자 ID 더블 클릭 시 권한별 사용자 관리 화면으로 이동
			// 이동한 컴포넌트에서 useLocation() hook을 이용하여 값을 받아줍니다.
			if (event.dataField == 'userId') {
				const userId = event.value;
				const params = { userId: userId };
				// 권한별 사용자관리 화면으로 이동 -> 검색 영역 '사용자명' 필드 setting
				moveMenu('/sysmgt/func/rolesmappingusers', params);
			}
		});

		/**
		 * 그리드에서 키보드를 누른 경우 발생하는 키다운 이벤트 바인딩
		 * @event keyDown
		 * @param {object} event 이벤트
		 * 			- type : 이벤트 유형
		 * 			- pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
		 * 			- keyCode : 키보드 누른 경우 해당 키코드 번호 (Number)
		 * 			- ctrlKey : Ctrl 키 같이 눌렀는지 여부 (Boolean)
		 * 			- shiftKey : Shift 키 같이 눌렀는지 여부 (Boolean)
		 * 			- orgEvent : 자바스크립트의 오리지널 이벤트 객체 (Object)
		 * @returns false 반환 시 아무 동작하지 않음.
		 */
		gridRef.current?.bind('keyDown', function (event: any) {
			switch (event.keyCode) {
				case 13:
					showAlert('', 'Enter KeyDown Event', false);
					break;
				case 37:
					showAlert('', 'Left Arrow keyDown Event', false);
					break;
				case 38:
					showAlert('', 'Up Arrow keyDown Event', false);
					break;
				case 39:
					showAlert('', 'Right Arrow keyDown Event', false);
					break;
				case 40:
					showAlert('', 'Down Arrow keyDown Event', false);
					break;
			}
		});

		/**
		 * 데이터 그리드 렌더링이 완료되고 사용자에 의해 접근 가능해진 경우 발생하는 이벤트 바인딩
		 * @event ready
		 * @param {object} event 이벤트
		 * 			- type : 이벤트 유형
		 * 			- pid : 사용자에 의해 작성된 그리드의 부모 DIV ID (샘플 상의 myGridID 와 일치함)
		 */
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		gridRef.current?.bind('ready', function (event: any) {
			showAlert('', '그리드가 준비되었습니다.');
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// Component Mounted
	useEffect(() => {
		onClickSearchButton();
	}, []);

	// Component Updated
	useEffect(() => {
		// [중요] aui grid의 bind 함수는 updated hook 안에서 호출합니다.
		// aui grid의 bind함수는 상태 관리(ref, state) 객체/변수가 동기화되지 않으므로 update 될 때마다 bind 해줍니다.
		// 단, eventhandler 내부에 상태 관리 객체/변수가 없을 경우 mount 시에만 bind 해주어도 됩니다.
		initEvent();
	});

	return (
		<AGrid>
			<PageGridBtn gridTitle="Event Sample Grid">
				<Input placeholder="선택된 사용자" value={selectedUser} size="large" />
			</PageGridBtn>
			<AUIGrid ref={gridRef} columnLayout={getGridCol()} gridProps={gridProps} />
		</AGrid>
	);
};

export default GridEventSample;
