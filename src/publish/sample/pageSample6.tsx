// CSS
import AGrid from '../../assets/styled/AGrid/AGrid';
import UiDetailViewArea from '../../assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '../../assets/styled/Container/UiDetailViewGroup';

// Lib
import { Button, Form, Tabs } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import AUIGrid from '../../lib/AUIGrid/AUIGridReactCanal';
const { TabPane } = Tabs;

// Util
import MenuTitle from '../../components/common/custom/MenuTitle';
import { showAlert, showConfirm } from '../../util/MessageUtil';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '../../types/common';

// Component
import {
	CheckBox,
	Datepicker,
	InputSearch,
	InputText,
	RadioBox,
	SearchFormResponsive,
	SelectBox,
} from '../../components/common/custom/form';
import GridTopBtn from '../../components/common/GridTopBtn';

// API
import { apiPostSaveSysProgram } from '../../api/sys/apiSysProgram';
const pageSample6 = forwardRef((props: any, gridRef: any) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [showToggleBtn, setShowToggleBtn] = useState(false);
	const groupRef = useRef<HTMLUListElement>(null);
	const [expanded, setExpanded] = useState(false);
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
	// 그리드
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
					<Datepicker label={'이체일자'} required />
				</li>
				<li>
					<Datepicker label={'이체일자'} required />
				</li>

				<li>
					<Datepicker label={'이체일자'} required />
				</li>
				<li>
					<Datepicker label={'이체일자'} required />
				</li>
				<li>
					<Datepicker label={'이체일자'} required />
				</li>
				<li>
					<Datepicker label={'이체일자'} required />
				</li>
				<li>
					<Datepicker label={'이체일자'} required />
				</li>
				<li>
					<SelectBox label={'저장조건'} />
				</li>
				<li>
					<InputSearch label={'피킹존'} placeholder="검색어 입력" />
				</li>
				<li>
					<SelectBox label={'유통기한여부'} />
				</li>
			</SearchFormResponsive>

			<AGrid>
				<GridTopBtn gridTitle={'특별관리고객현황'} gridBtn={gridBtn} totalCnt={120}>
					<Button onClick={allApplyFn}> {t('lbl.ALLAPPLY')} </Button>
				</GridTopBtn>
				<AUIGrid columnLayout={getGridCol2()} />

				<GridTopBtn gridTitle={'특별관리고객현황'} gridBtn={gridBtn} totalCnt={120}>
					<Button onClick={allApplyFn}> {t('lbl.ALLAPPLY')} </Button>
				</GridTopBtn>
				<UiDetailViewArea>
					<UiDetailViewGroup className="grid-column-4" ref={groupRef}>
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
							<span>
								<InputText label={'코너대표 이미지'} placeholder="검색어 입력" />
								~
								<InputText placeholder="검색어 입력" />
							</span>
						</li>
						<li>
							<InputSearch label={'코너명'} placeholder="검색어 입력" required />
						</li>
						<li>
							<SelectBox label={'코너설명'} />
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
						<li>
							<InputSearch label={'피킹존'} placeholder="검색어 입력" />
						</li>
						<li>
							<SelectBox label={'로케이션종류'} />
						</li>
						<li>
							<InputSearch label={'마지막줄'} placeholder="검색어 입력" />
						</li>
						<li>
							<InputSearch label={'기준일(유통,제조)'} placeholder="검색어 입력" />
						</li>
						<li>
							<InputSearch label={'피킹존'} placeholder="검색어 입력" />
						</li>
						<li>
							<SelectBox label={'로케이션종류'} />
						</li>
						<li>
							<InputSearch label={'마지막줄'} placeholder="검색어 입력" />
						</li>
						<li>
							<InputSearch label={'기준일(유통,제조)'} placeholder="검색어 입력" />
						</li>
						<li>
							<InputSearch label={'피킹존'} placeholder="검색어 입력" />
						</li>
						<li>
							<SelectBox label={'로케이션종류'} />
						</li>
						<li>
							<InputSearch label={'마지막줄'} placeholder="검색어 입력" />
						</li>
						<li>
							<InputSearch label={'기준일(유통,제조)'} placeholder="검색어 입력" />
						</li>
						<li>
							<InputSearch label={'피킹존'} placeholder="검색어 입력" />
						</li>
						<li>
							<SelectBox label={'로케이션종류'} />
						</li>
						<li>
							<InputSearch label={'마지막줄'} placeholder="검색어 입력" />
						</li>
					</UiDetailViewGroup>
				</UiDetailViewArea>
			</AGrid>
		</>
	);
});

export default pageSample6;
