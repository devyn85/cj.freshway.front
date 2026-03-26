// CSS
import AGrid from '../../assets/styled/AGrid/AGrid';
import AGridWrap from '../../assets/styled/AGridWrap/AGridWrap';

// Lib
import { Button, Form, Tabs } from 'antd';
import AUIGrid from '../../lib/AUIGrid/AUIGridReactCanal';
const { TabPane } = Tabs;

// Util
import MenuTitle from '../../components/common/custom/MenuTitle';
import { showAlert, showConfirm } from '../../util/MessageUtil';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '../../types/common';

// Component
import { InputNumber, SearchFormResponsive, SelectBox } from '../../components/common/custom/form';
import DatePicker, { Rangepicker } from '../../components/common/custom/form/Datepicker';
import GridTopBtn from '../../components/common/GridTopBtn';

// API
import { apiPostSaveSysProgram } from '../../api/sys/apiSysProgram';
const pageSample3 = forwardRef((props: any, gridRef: any) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [expanded, setExpanded] = useState(false);
	const [showToggleBtn, setShowToggleBtn] = useState(false);
	const groupRef = useRef<HTMLUListElement>(null);

	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
	});

	const onChange = (value: string) => {};

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'useYn',
			headerText: t('lbl.USE'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'progCd',
			headerText: t('lbl.PROG_CD'),
		},
		{
			dataField: 'progNm',
			headerText: t('lbl.PROG_NM'),
			style: 'left',
		},
		{
			dataField: 'progLvl',
			headerText: t('lbl.PROG_LVL'),
		},
		{
			dataField: 'progNo',
			headerText: t('lbl.PROG_NO'),
			style: 'left',
		},
		{
			dataField: 'authority',
			headerText: t('lbl.AUTHORITY'),
			style: 'left',
		},
		{
			dataField: 'progUrl',
			headerText: t('lbl.PROG_URL'),
			style: 'left',
		},
		{
			dataField: 'progArgs',
			headerText: t('lbl.PROG_ARGS'),
			style: 'left',
		},
		{
			dataField: 'systemCl',
			headerText: t('lbl.SYSTEM_CL'),
		},
		{
			dataField: 'proghelpUrl',
			headerText: t('lbl.PROGHELP_URL'),
		},
		{
			dataField: 'menuYn',
			headerText: t('lbl.MENU_YN'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'topmenuYn',
			headerText: t('lbl.TOPMENU_YN'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'btn1Nm',
			headerText: t('lbl.BTN1_NM'),
		},
		{
			dataField: 'btn2Nm',
			headerText: t('lbl.BTN2_NM'),
		},
		{
			dataField: 'btn3Nm',
			headerText: t('lbl.BTN3_NM'),
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

	const getGridCol2 = () => {
		return [
			{
				dataField: 'empNo',
				headerText: '코너코드',
			},
			{
				headerText: '코너명',
			},
			{
				headerText: '표시순서',
			},
			{
				headerText: '사용여부',
			},
		];
	};
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 저장
	 * @returns {void}
	 */
	const saveFunc = () => {
		// 변경 데이터 확인
		const menus = gridRef.current.getChangedData();
		if (!menus || menus.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		// validation
		if (menus.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		}

		showConfirm(null, t('msg.confirmSave'), () => {
			apiPostSaveSysProgram(menus).then(() => {
				// 콜백 처리
				props.callBackFn && props.callBackFn instanceof Function ? props.callBackFn() : null;
			});
		});
	};

	/**
	 * 일괄적용
	 * @returns {void}
	 */
	const allApplyFn = () => {};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'down', // 아래로
			},
			{
				btnType: 'up', // 위로
			},
			{
				btnType: 'excelForm', // 엑셀양식
			},
			{
				btnType: 'excelUpload', // 엑셀업로드
			},
			{
				btnType: 'excelDownload', // 엑셀다운로드
			},
			{
				btnType: 'copy', // 행복사
				initValues: {
					menuId: '',
					regId: '',
					regDt: '',
				},
			},
			{
				btnType: 'curPlus', // 행삽입 (선택된 row 바로 아래 행추가)
			},
			{
				btnType: 'plus', // 행추가
				initValues: {
					menuYn: 0,
					useYn: 0,
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'detailView', // 상세보기
			},
			{
				btnType: 'btn1', // 사용자 정의버튼1
			},
			{
				btnType: 'btn2', // 사용자 정의버튼2
			},
			{
				btnType: 'btn3', // 사용자 정의버튼3
			},
			{
				btnType: 'print', // 인쇄
			},
			{
				btnType: 'new', // 신규
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveFunc,
			},
			{
				btnType: 'elecApproval', // 전자결재
			},
		],
	};

	// 표 버튼 설정
	const tableBtn: TableBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'pre', // 이전
			},
			{
				btnType: 'post', // 다음
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'btn1', // 사용자 정의버튼1
			},
			{
				btnType: 'btn2', // 사용자 정의버튼2
			},
			{
				btnType: 'btn3', // 사용자 정의버튼3
			},
			{
				btnType: 'new', // 신규
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveFunc,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	//검색영역 줄 높이
	useEffect(() => {
		setExpanded(true);

		setTimeout(() => {
			const el = groupRef.current;
			if (!el) return;

			const liElements = el.querySelectorAll('li');
			if (liElements.length === 0) return;

			const firstLiHeight = liElements[0].offsetHeight;
			const totalHeight = el.offsetHeight;
			const lineCount = totalHeight / firstLiHeight;

			setShowToggleBtn(lineCount > 3);
			setExpanded(false); // 다시 닫기
		}, 100);
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn|saveYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<DatePicker
						label="기본"
						name="datePickerBasic"
						span={24}
						onChange={onChange}
						required
						allowClear
						readOnly={true}
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>

				<li style={{ gridColumn: '2 / span 2' }}>
					<Rangepicker
						label="Rangepicker"
						name="rangeBasic"
						span={24}
						onChange={onChange}
						allowClear
						showNow={false}
						readOnly={true}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
				<li>
					<InputNumber label={'정렬순서'} />
				</li>
				<li>
					<SelectBox label={'저장조건'} />
				</li>
				<li>
					<SelectBox label={'유통기한여부'} />
				</li>
				<li>
					<SelectBox label={'재고위치'} />
				</li>
				<li>
					<SelectBox label={'재고숙성'} />
				</li>
			</SearchFormResponsive>
			<AGridWrap>
				<Tabs defaultActiveKey="1">
					<TabPane tab="생성 및 체크" key="1">
						<AGrid className="flexWarp">
							<GridTopBtn gridTitle={'특별관리고객현황'} gridBtn={gridBtn} totalCnt={120}>
								<Button onClick={allApplyFn}> {t('lbl.ALLAPPLY')} </Button>
							</GridTopBtn>
							<AUIGrid columnLayout={getGridCol2()} />

							<GridTopBtn gridTitle={'특별관리고객현황'} gridBtn={gridBtn} totalCnt={120}>
								<Button onClick={allApplyFn}> {t('lbl.ALLAPPLY')} </Button>
							</GridTopBtn>
							<AUIGrid columnLayout={getGridCol2()} />
						</AGrid>
					</TabPane>
					<TabPane tab="일괄배차" key="2">
						<AGrid className="flexWarp">
							<AUIGrid columnLayout={getGridCol2()} />
						</AGrid>
					</TabPane>
				</Tabs>
			</AGridWrap>
		</>
	);
});

export default pageSample3;
