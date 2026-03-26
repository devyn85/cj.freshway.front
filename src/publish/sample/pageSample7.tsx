// CSS
import AGrid from '../../assets/styled/AGrid/AGrid';
import AGridWrap from '../../assets/styled/AGridWrap/AGridWrap';
import UiDetailViewArea from '../../assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '../../assets/styled/Container/UiDetailViewGroup';

// Lib
import { Button, Col, Form, Row, Tabs } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import AUIGrid from '../../lib/AUIGrid/AUIGridReactCanal';
const { TabPane } = Tabs;
// Util
import MenuTitle from '../../components/common/custom/MenuTitle';
import PageGridBtn from '../../components/common/PageGridBtn'; //퍼블전용
import { showAlert, showConfirm } from '../../util/MessageUtil';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '../../types/common';

// Component
import {
	CheckBox,
	CheckboxGroup,
	DateRange,
	Datepicker,
	FileUpload,
	InputSearch,
	InputText,
	LabelText,
	RadioBox,
	Rangepicker,
	SearchFormResponsive,
	SelectBox,
} from '../../components/common/custom/form';
import GridTopBtn from '../../components/common/GridTopBtn';

// API
import { apiPostSaveSysProgram } from '../../api/sys/apiSysProgram';
const pageSample7 = forwardRef((props: any, gridRef: any) => {
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
	const cbxGrpopts = [
		{ label: '사용', value: '' },
		{ label: '미사용', value: '' },
	];

	const radioBasicOptions = [
		{ label: '공지 유형', value: 'BBS_TP' },
		{
			label: '사용자 상태',
			value: 'USER_STATUS',
		},
		{
			label: '타임존',
			value: 'TPL_TIMEZONE',
		},
		{
			label: '언어',
			value: 'LANG_CD',
		},
	];

	const onChangeCbxBasic1 = (e: CheckboxChangeEvent) => {
		//setCbxBasic1State(e.target.checked);
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
				btnType: 'copy', // 행복사
				initValues: {
					menuId: '',
					regId: '',
					regDt: '',
				},
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
				<li style={{ gridColumn: '1 / span 2' }}>
					<Datepicker label={'물류센터'} required />
				</li>
				<li style={{ gridColumn: '3 / span 2' }}>
					<RadioBox
						label="RadioBox"
						name="radioBasic1"
						options={radioBasicOptions}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>

				<li style={{ gridColumn: '1 / span 2' }}>
					{/*<CheckboxGroup label={'CheckboxGroup'} options={cbxGrpopts} />*/}
					<CheckboxGroup
						label="Group Checkbox"
						name="cbxGrp1"
						options={cbxGrpopts}
						required
						//span={24}
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
				<li>
					<span>
						<CheckBox label={'CheckBox단일'} name="cbxBasic1" onChange={onChangeCbxBasic1}>
							사용
						</CheckBox>
					</span>
				</li>
				<li>
					<InputText label={'상품코드'} />
				</li>

				<li style={{ gridColumn: '1 / span 2' }}>
					<span>
						<InputText label={'input 2단'} readOnly /> ~
						<InputText readOnly />
					</span>
				</li>
				<li style={{ gridColumn: '3 / span 2' }}>
					<span>
						<CheckBox label={'CheckBox단일'} name="cbxBasic1" onChange={onChangeCbxBasic1}>
							사용
						</CheckBox>
						<CheckBox name="cbxBasic2">미사용</CheckBox>
						<CheckBox name="cbxBasic2">미사용</CheckBox>
						<CheckBox name="cbxBasic2">미사용</CheckBox>
					</span>
				</li>
				<li>
					<span>
						<InputText label={'상품코드'} />
						<Button type={'default'}>버튼</Button>
					</span>
				</li>
				<li>
					<SelectBox label={'재고위치'} />
				</li>
				<li>
					<SelectBox label={'재고숙성'} />
				</li>
				<li>
					<InputText label={'이력번호'} placeholder="입력" />
				</li>
				<li>
					<InputSearch label={'피킹존'} placeholder="검색어 입력" />
				</li>
				<li>
					<SelectBox label={'로케이션종류'} />
				</li>
				<li>
					<InputSearch label={'기준일(유통,제조)'} placeholder="검색어 입력" />
				</li>
			</SearchFormResponsive>
			<AGridWrap className="overflow-hidden">
				<Row gutter={12}>
					<Col span={12}>
						<AGrid>
							<GridTopBtn gridTitle={'특별관리고객현황'} gridBtn={gridBtn} totalCnt={120}>
								<Button onClick={allApplyFn}> {t('lbl.ALLAPPLY')} </Button>
							</GridTopBtn>
							<AUIGrid columnLayout={getGridCol2()} />
						</AGrid>
					</Col>
					<Col span={12} className={'overflow-y-auto'} style={{ height: '100%' }}>
						<Tabs defaultActiveKey="1">
							<TabPane tab="생성 및 체크1" key="1">
								<AGrid>
									<GridTopBtn gridTitle={'특별관리고객현황'} gridBtn={gridBtn}>
										<Button onClick={allApplyFn}> {t('lbl.ALLAPPLY')} </Button>
									</GridTopBtn>
									<UiDetailViewArea>
										<UiDetailViewGroup className="grid-column-1" ref={groupRef}>
											<li>
												<FileUpload label={'파일업로드'} />
											</li>
											<li>
												<span>
													<InputText label={'input 2단'} readOnly /> ~
													<InputText readOnly />
												</span>
											</li>

											<li>
												<span>
													<InputText label={'상품코드'} />
													<Button type={'default'}>버튼</Button>
												</span>
											</li>
											<li>
												<span>
													<CheckBox label={'CheckBox단일'} name="cbxBasic1" onChange={onChangeCbxBasic1}>
														사용
													</CheckBox>
													<CheckBox name="cbxBasic2">미사용</CheckBox>
													<CheckBox name="cbxBasic2">미사용</CheckBox>
													<CheckBox name="cbxBasic2">미사용</CheckBox>
												</span>
											</li>
											<li>
												{/*<InputSearch label={'코너명'} placeholder="검색어 입력" required />*/}
												<LabelText label={'코너명'} value={'코너명'}>
													ㅇㄹㅇㄹ
												</LabelText>
											</li>
											<li>
												<Datepicker label={'Datepicker'} required />
											</li>
											<li>
												<Rangepicker label={'Rangepicker'} required />
											</li>
											<li>
												<DateRange label={'DateRange'} required />
											</li>

											<li>
												<CheckboxGroup label={'사용여부'} options={cbxGrpopts} />
											</li>

											<li>
												<InputText label={'코너대표 이미지'} placeholder="검색어 입력" />
											</li>
											<li>
												<SelectBox label={'코너대표 이미지'} />
											</li>
											<li>
												<SelectBox label={'표시순서'} />
											</li>
											<li>
												<SelectBox label={'재고위치'} />
											</li>
											<li>
												<SelectBox label={'재고숙성'} />
											</li>
											<li>
												<InputText label={'이력번호'} placeholder="입력" />
											</li>
											<li>
												<InputSearch label={'피킹존'} placeholder="검색어 입력" />
											</li>
											<li>
												<SelectBox label={'로케이션종류'} />
											</li>
											<li>
												<InputSearch label={'기준일(유통,제조)'} placeholder="검색어 입력" />
											</li>
										</UiDetailViewGroup>
									</UiDetailViewArea>

									<GridTopBtn gridTitle={'특별관리고객현황1'} gridBtn={gridBtn}>
										<Button onClick={allApplyFn}> {t('lbl.ALLAPPLY')} </Button>
									</GridTopBtn>
									<UiDetailViewArea>
										<UiDetailViewGroup className="grid-column-2" ref={groupRef}>
											<li>
												<Datepicker label={'코너코드'} required />
											</li>
											<li>
												<span>
													<InputText label={'input 2단'} readOnly /> ~
													<InputText readOnly span={7} />
												</span>
											</li>
											<li>
												<span>
													<InputText label={'상품코드'} />
													<Button type={'default'}>버튼</Button>
												</span>
											</li>
											<li>
												<RadioBox
													label="RadioBox"
													name="radioBasic1"
													options={radioBasicOptions}
													required
													rules={[{ required: true, validateTrigger: 'none' }]}
												/>
											</li>
											<li>
												<SelectBox label={'재고위치'} />
											</li>
											<li>
												<span>
													<CheckBox label={'CheckBox단일'} name="cbxBasic1" onChange={onChangeCbxBasic1}>
														사용
													</CheckBox>
													<CheckBox name="cbxBasic2">미사용</CheckBox>
													<CheckBox name="cbxBasic2">미사용</CheckBox>
													<CheckBox name="cbxBasic2">미사용</CheckBox>
												</span>
											</li>

											<li>
												<InputSearch label={'코너명'} placeholder="검색어 입력" required />
											</li>
											<li>
												<SelectBox label={'코너설명'} />
											</li>

											<li>
												<span>
													<InputText label={'코너대표 이미지'} placeholder="검색어 입력" />
													~
													<InputText placeholder="검색어 입력" />
												</span>
											</li>
											<li>
												<SelectBox label={'코너대표 이미지\n'} />
											</li>
											<li>
												<SelectBox label={'표시순서'} />
											</li>
											<li>
												<SelectBox label={'재고위치'} />
											</li>
											<li>
												<SelectBox label={'재고숙성'} />
											</li>
											<li>
												<InputText label={'이력번호'} placeholder="입력" />
											</li>
											<li>
												<InputSearch label={'피킹존'} placeholder="검색어 입력" />
											</li>
											<li>
												<SelectBox label={'로케이션종류'} />
											</li>
											<li>
												<InputSearch label={'기준일(유통,제조)'} placeholder="검색어 입력" />
											</li>
										</UiDetailViewGroup>
									</UiDetailViewArea>
								</AGrid>
							</TabPane>
							<TabPane tab="생성 및 체크" key="2">
								<AGrid>
									<PageGridBtn gridTitle="차량정보목록" />
									<UiDetailViewArea>
										<UiDetailViewGroup className="grid-column-2" ref={groupRef}>
											<li>
												<Datepicker label={'코너코드'} required />
											</li>

											<li>
												<InputSearch label={'코너명'} placeholder="검색어 입력" required />
											</li>
											<li>
												<SelectBox label={'코너설명'} />
											</li>
											<li>
												<InputText label={'코너대표 이미지'} value="검색어 입력" />
											</li>
											<li>
												<SelectBox label={'코너대표 이미지\n'} />
											</li>
											<li>
												<SelectBox label={'표시순서'} />
											</li>
											<li>
												<SelectBox label={'재고위치'} />
											</li>
											<li>
												<SelectBox label={'재고숙성'} />
											</li>
											<li>
												<InputText label={'이력번호'} placeholder="입력" />
											</li>
											<li>
												<InputSearch label={'피킹존'} placeholder="검색어 입력" />
											</li>
											<li>
												<SelectBox label={'로케이션종류'} />
											</li>
											<li>
												<InputSearch label={'기준일(유통,제조)'} placeholder="검색어 입력" />
											</li>
										</UiDetailViewGroup>
									</UiDetailViewArea>

									<PageGridBtn gridTitle="차량정보목록" />
									<UiDetailViewArea>
										<UiDetailViewGroup className="grid-column-2" ref={groupRef}>
											<li>
												<Datepicker label={'코너코드'} required />
											</li>
											<li>
												<InputSearch label={'코너명'} placeholder="검색어 입력" required />
											</li>
											<li>
												<SelectBox label={'코너설명'} />
											</li>
											<li>
												<InputText label={'코너대표 이미지'} placeholder="검색어 입력" />
											</li>
											<li>
												<SelectBox label={'코너대표 이미지\n'} />
											</li>
											<li>
												<SelectBox label={'표시순서'} />
											</li>
											<li>
												<SelectBox label={'재고위치'} />
											</li>
											<li>
												<SelectBox label={'재고숙성'} />
											</li>
											<li>
												<InputText label={'이력번호'} placeholder="입력" />
											</li>
											<li>
												<InputSearch label={'피킹존'} placeholder="검색어 입력" />
											</li>
											<li>
												<SelectBox label={'로케이션종류'} />
											</li>
											<li>
												<InputSearch label={'기준일(유통,제조)'} placeholder="검색어 입력" />
											</li>
										</UiDetailViewGroup>
									</UiDetailViewArea>
								</AGrid>
							</TabPane>
						</Tabs>
					</Col>
				</Row>
			</AGridWrap>
		</>
	);
});

export default pageSample7;
