// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Col, Form, Row, Tabs } from 'antd';
const { TabPane } = Tabs;

// Util

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import {
	DateRange,
	InputSearch,
	InputText,
	InputTextArea,
	RadioBox,
	SearchFormResponsive,
	SelectBox,
} from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';

// Store

// API

const MsCrmWmsMemo = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const groupRef = useRef<HTMLUListElement>(null);
	const [expanded, setExpanded] = useState(false);

	const refs: any = useRef(null);
	const refs1: any = useRef(null);

	const [activeTabKey, setActiveTabKey] = useState('1');

	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
	});

	const radioBasicOptions = [
		{ label: '전체', value: 'BBS_TP' },
		{
			label: 'CRM',
			value: '',
		},
		{
			label: 'WMS',
			value: '',
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 탭 내의 그리드 사이즈 초기화
	 */
	useEffect(() => {
		refs.gridRef?.current.resize(); // 그리드 크기 조정
		refs1.gridRef?.current.resize(); // 그리드 크기 조정
	}, [activeTabKey]);

	/**
	 * 그리드 컬럼을 설정한다.
	 * @returns {object[]} 그리드 컬럼 설정 객체
	 */
	const getGridCol = () => {
		return [
			{
				dataField: 'empNo',
				headerText: '순번',
			},
			{
				headerText: '작성출처',
			},
			{
				headerText: '관리처코드',
			},
			{
				headerText: '관리처',
			},
			{
				headerText: '작성자',
			},
			{
				headerText: '처리상태',
			},
			{
				headerText: '차량번호',
			},
			{
				headerText: '전화번호',
			},
			{
				headerText: '메모',
			},
		];
	};

	const getGridCol1 = () => {
		return [
			{
				dataField: 'empNo',
				headerText: '순번',
			},
			{
				headerText: '일시',
			},
			{
				headerText: '작성출처',
			},
			{
				headerText: '작성자',
			},
			{
				headerText: '메모유형',
			},
			{
				headerText: '내용',
			},
			{
				headerText: '처리상태',
			},
			{
				headerText: '파일첨부',
			},
			{
				headerText: 'DRM전송',
			},
			{
				headerText: '노출기간',
			},
		];
	};

	const getGridCol2 = () => {
		return [
			{
				dataField: 'empNo',
				headerText: '순번',
			},
			{
				headerText: '배송이슈번호',
			},
			{
				headerText: '출고일자',
			},
			{
				headerText: '관리처코드',
			},
			{
				headerText: '관리처명',
			},
			{
				headerText: '배송이슈코드',
			},
			{
				headerText: '상품코드',
			},
			{
				headerText: '상품명칭',
			},
			{
				headerText: '상태',
			},
			{
				headerText: '주문수량',
			},
			{
				headerText: '출고수량',
			},
			{
				headerText: '확인수량',
			},
			{
				headerText: '단위',
			},
			{
				headerText: '기사명',
			},
			{
				headerText: '전화번호',
			},
			{
				headerText: '도착시간',
			},
			{
				headerText: '배송장소',
			},
			{
				headerText: '사유코드',
			},
			{
				headerText: '기타',
			},
			{
				headerText: '첨부파일',
			},
			{
				headerText: '진행상태',
			},
			{
				headerText: '생성인',
			},
			{
				headerText: '등록일자',
			},
			{
				headerText: '최종변경자',
			},
			{
				headerText: '최종변경시간',
			},
		];
	};

	/**
	 * 그리드 속성을 설정한다.
	 * @returns {object} 그리드 속성 설정 객체
	 */
	const getGridProps = () => {
		return {
			editable: true,
			fillColumnSizeMode: false,
			enableColumnResize: true,
			showRowCheckColumn: true,
			enableFilter: true,
		};
	};

	/**
	 * 그리드 버튼 함수를 설정한다.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'save', // 저장
				},
			],
		};

		return gridBtn;
	};

	// 표 버튼 설정
	const tableBtn: TableBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
			},
		],
	};

	/**
	 * 탭 설정
	 */
	const tabs = [
		{
			key: '1',
			label: '일별 메모',
			children: (
				<Row gutter={8}>
					<Col span={12}>
						<AGrid className="h100">
							<GridTopBtn gridTitle={'CRM요청관리 목록'} gridBtn={getGridBtn()} totalCnt={props.totalCnt}>
								<li>
									<RadioBox name="radioBasic1" options={radioBasicOptions} className="bg-white" />
								</li>
							</GridTopBtn>
							<AUIGrid columnLayout={getGridCol()} gridProps={getGridProps()} />
						</AGrid>
					</Col>
					<Col span={12} className="">
						<AGrid className="h-auto">
							<GridTopBtn gridTitle={'처리이력 목록'} gridBtn={getGridBtn()} />
							<AUIGrid columnLayout={getGridCol1()} gridProps={getGridProps()} />
							<TableTopBtn tableTitle={'처리상세'} tableBtn={tableBtn} />
							<Row gutter={0}>
								<Col span={24}>
									<UiDetailViewArea>
										<UiDetailViewGroup className="grid-column-2" ref={groupRef}>
											<li>
												<InputText label={'상위메모ID'} placeholder="상위메모ID 입력" />
											</li>
											<li>
												<SelectBox label="메모유형" />
											</li>
											<li>
												<SelectBox label="전송대상" />
											</li>
											<li>
												<InputText label="작성자" placeholder="작성자 입력" />
											</li>
											<li>
												<InputText label="작성일시" placeholder="작성일시 입력" />
											</li>
											<li>
												<InputSearch label="차량번호" placeholder="차량번호 입력" />
											</li>
											<li>
												<InputSearch label="차량번호" placeholder="차량번호 입력" />
											</li>
											<li>
												<DatePicker
													label="노출기간"
													name="date"
													picker={'day'}
													allowClear
													showNow={true}
													format="YYYY-MM"
												/>
											</li>
											<li>
												<SelectBox label="처리상태" />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputTextArea
													label="내용"
													name="inputTextArea1"
													placeholder="텍스트를 입력해주세요."
													maxLength={100}
													autoSize={{ minRows: 8, maxRows: 15 }}
												/>
											</li>
										</UiDetailViewGroup>
									</UiDetailViewArea>
								</Col>
							</Row>
						</AGrid>
					</Col>
				</Row>
			),
		},
		{
			key: '2',
			label: '배송이슈',
			children: (
				<AGrid className="h100">
					<GridTopBtn gridTitle={'배송이슈 목록'} gridBtn={getGridBtn()} />
					<AUIGrid columnLayout={getGridCol2()} gridProps={getGridProps()} />
				</AGrid>
			),
		},
	];
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 탭 내의 그리드 사이즈 초기화
	 */
	useEffect(() => {
		refs.gridRef?.current.resize(); // 그리드 크기 조정
		refs1.gridRef?.current.resize(); // 그리드 크기 조정
	}, [activeTabKey]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn|saveYn" name={'CRM요청관리'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<DateRange label="조회일자" />
				</li>
				<li>
					<SelectBox label="작성출처" />
				</li>
				<li>
					<SelectBox label="처리상태" />
				</li>
				<li>
					<InputSearch label="관리처코드" />
				</li>
				<li>
					<InputSearch label="차량번호" />
				</li>
				<li>
					<SelectBox label="메모유형" />
				</li>
				{/*
				// 배송이슈 탭
				<li>
					<DateRange label="배송일자" />
				</li>
				<li>
					<InputSearch label="관리처코드" />
				</li>
				<li>
					<SelectBox label="진행상태" />
				</li>
				*/}
			</SearchFormResponsive>

			<Tabs items={tabs} activeKey={activeTabKey} onChange={setActiveTabKey} className="contain-wrap" />
		</>
	);
});

export default MsCrmWmsMemo;
