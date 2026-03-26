// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import DatePicker from '@/components/common/custom/form/Datepicker';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Col, Form, Row, Tabs } from 'antd';
const { TabPane } = Tabs;

// Util

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import AGridWrap from '@/assets/styled/AGridWrap/AGridWrap';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';
import {
	CheckboxGroup,
	InputNumber,
	InputRange,
	InputSearch,
	RadioBox,
	SelectBox,
} from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import TableTopBtn from '@/components/common/TableTopBtn';

// Store

// API

const OmStockReocation = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const groupRef = useRef<HTMLUListElement>(null);
	const [expanded, setExpanded] = useState(false);

	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
	});

	const radioOptions1 = [{ label: '제한없음', value: '' }];
	const radioOptions2 = [{ label: '제한없음', value: '' }];

	const cbxGrpopts = [
		{ label: '1원화', value: '' },
		{
			label: '2원화',
			value: '',
		},
		{
			label: '3원화',
			value: '',
		},
		{
			label: '4원화',
			value: '',
		},
		{
			label: '5원화',
			value: '',
		},
		{
			label: '(양산제외)',
			value: '',
		},
	];

	const refs1: any = useRef(null);
	const refs2: any = useRef(null);
	const refs3: any = useRef(null);
	const refs4: any = useRef(null);
	const [activeTabKey, setActiveTabKey] = useState('1');
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 컬럼을 설정한다.
	 * @returns {object[]} 그리드 컬럼 설정 객체
	 */
	const getGridCol1 = () => {
		return [
			{
				dataField: 'empNo',
				headerText: '순번',
			},
			{
				headerText: '진행사항',
			},
			{
				headerText: '의뢰일',
			},
			{
				headerText: 'VOC번호',
			},
			{
				headerText: 'VSR유형',
			},
			{
				headerText: '긴급여부',
			},
			{
				headerText: '부서',
			},
			{
				headerText: '판매처',
			},
			{
				headerText: '판매처명',
			},
			{
				headerText: '관리처',
			},
			{
				headerText: '관리처명',
			},
			{
				headerText: '요청부서',
			},
			{
				headerText: '요청자',
			},
			{
				headerText: '의뢰일시',
			},
			{
				headerText: '전달사항',
			},
			{
				headerText: '고객주소',
			},
			{
				headerText: '고객전화 번호',
			},
			{
				headerText: '센터접수 번호',
			},
			{
				headerText: '퀵접수 번호',
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
				headerText: '센터접수번호',
			},
			{
				headerText: 'VOC번호',
			},
			{
				headerText: 'VSR번호',
			},
			{
				headerText: 'VSR유형',
			},
			{
				headerText: '주문번호',
			},
			{
				headerText: '주문순번',
			},
			{
				headerText: '상품코드',
			},
			{
				headerText: '상품내역',
			},
			{
				headerText: '주문량',
			},
			{
				headerText: '주문단위',
			},
			{
				headerText: 'VOC량',
			},
			{
				headerText: 'VOC단위',
			},
			{
				headerText: '재고현황',
				children: [
					{
						headerText: 'A센터',
					},
					{
						headerText: 'B센터',
					},
					{
						headerText: 'C센터',
					},
					{
						headerText: 'DD센터',
					},
					{
						headerText: 'E센터',
					},
				],
			},
		];
	};

	const getGridCol3 = () => {
		return [
			{
				headerText: '경유지 순서',
			},
			{
				headerText: '코드',
			},
			{
				headerText: '센터/상호',
				required: true,
			},
			{
				headerText: '주소',
				required: true,
			},
			{
				headerText: '담당자',
				required: true,
			},
			{
				headerText: '연락처',
				required: true,
			},
			{
				headerText: '로케이션',
			},
			{
				headerText: '상품코드',
			},
			{
				headerText: '상품내역',
			},
			{
				headerText: '단위',
			},
			{
				headerText: '량',
			},
		];
	};

	const getGridCol4 = () => {
		return [
			{
				headerText: '경유지 순서',
			},
			{
				headerText: '고객코드',
			},
			{
				headerText: '고객명',
			},
			{
				headerText: '연락처',
				required: true,
			},
			{
				headerText: '주소',
				required: true,
			},
			{
				headerText: '상품코드',
			},
			{
				headerText: '상품내역',
			},
			{
				headerText: '단위',
			},
			{
				headerText: '량',
			},
		];
	};

	/**
	 * 그리드 속성을 설정한다.
	 * @returns {object} 그리드 속성 설정 객체
	 */
	const getGridProps1 = () => {
		return {
			editable: true,
			fillColumnSizeMode: false,
			enableColumnResize: true,
			showRowCheckColumn: true,
		};
	};
	const getGridProps2 = () => {
		return {
			fillColumnSizeMode: false,
			enableColumnResize: true,
			showRowCheckColumn: true,
		};
	};
	const getGridProps3 = () => {
		return {
			fillColumnSizeMode: false,
			enableColumnResize: true,
			showRowCheckColumn: true,
		};
	};
	const getGridProps4 = () => {
		return {
			fillColumnSizeMode: false,
			enableColumnResize: true,
			showRowCheckColumn: true,
		};
	};
	/**
	 * 그리드 버튼 함수를 설정한다.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */

	// 표 버튼 설정
	const getGridBtn: TableBtnPropsType = {
		tGridRef: gridRef, // 사용자 목록 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'delete',
			// 	callBackFn: deleteFunc,
			// },
		],
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: () => {
			if (activeTabKey === '1') {
				// return searchMaterList1();
			} else if (activeTabKey === '2') {
				// return searchMaterList2();
			}
		},
	};

	// 탭 아이템 영역
	const tabs = [
		{
			key: '1',
			label: '재고재배치설정',
			children: (
				<>
					<AGrid className="h100">
						<h3>1단계 재고기준일 설정</h3>
						<UiDetailViewGroup ref={groupRef}>
							<li style={{ gridColumn: 'span 3' }} className="flex-wrap">
								<DatePicker label="재고기준일자" span={6} />
								<span className="ml10">데이터 전처리를 위한 작업입니다. 가능한 재고배치안을 생성요청 합니다.</span>
							</li>
						</UiDetailViewGroup>
						<h3>2단계 배치안 설정</h3>
						<UiDetailViewGroup className="grid-column-4" ref={groupRef}>
							<li>
								<InputSearch label="상품코드/명" />
							</li>
							<li>
								<InputRange label="이체량(Kg)" fromName="min" toName="max" />
							</li>
							<li>
								<InputNumber
									label="수송비가중치"
									placeholder="숫자를 입력해주세요."
									min={0}
									max={99999}
									step={100}
									showCount
									required
								/>
							</li>
							<li>
								<InputNumber
									label="PLT 확보"
									placeholder="숫자를 입력해주세요."
									min={0}
									max={99999}
									step={100}
									showCount
									required
								/>
							</li>
							<li style={{ gridColumn: 'span 2' }} className="flex-wrap">
								<RadioBox label="현재배치현황" options={radioOptions1} span={7} required />
								<div>
									<CheckboxGroup options={cbxGrpopts} required />
								</div>
							</li>
							<li style={{ gridColumn: 'span 2' }} className="flex-wrap">
								<RadioBox label="배치요건설정" options={radioOptions2} span={7} required />
								<div>
									<CheckboxGroup options={cbxGrpopts} required />
								</div>
							</li>
							<li className="flex-wrap" style={{ gridColumn: 'span 2' }}>
								<SelectBox label="목표 캐파 설정" span={8} />
								<span>
									<InputNumber min={0} max={99999} step={100} showCount />
								</span>
							</li>
						</UiDetailViewGroup>
						<ul className="ntc-list">
							<li>
								상품 필터조건 : <strong>재배치 대상 상품코드, 이체량, 현재 배치현황</strong>을 통해 상품을 필터해서 필터
								되는 상품은 고정분이되고, 선택 되는 상품이 재배치 대상
							</li>
							<li>최적화 수행 조건</li>
							<li className="sub">
								<strong>배치요건 설정</strong>이 "제한없음"의 경우만 최적화를 수행, 수송비 확보, PLT확보 가중치는 이
								경우에 활용
							</li>
							<li className="sub">
								<strong>배치요건 설정</strong>이 "제한없음"이 아닌 경우는 배치요건 설정에서 설정된 것으로 강제 선택
							</li>
							<li>
								캐파 조건: <strong>목표 캐파 설정</strong>이 되는 경우, 해당 캐파만큼 캐파에서 제외 함
							</li>
						</ul>
						<ButtonWrap data-props="single" className="flex-just-cen">
							<Button type="primary" size="middle">
								요청
							</Button>
						</ButtonWrap>
					</AGrid>
				</>
			),
		},
		{
			key: '2',
			label: '실행결과',
			children: (
				<>
					<AGridWrap className="h100">
						<AGrid className="h100">
							<UiDetailViewGroup className="grid-column-4" ref={groupRef}>
								<li>
									<SelectBox label="수행결과" />
								</li>
							</UiDetailViewGroup>
							<TableTopBtn tableTitle={'기본대상'} tableBtn={getGridBtn} />
							<Row gutter={6}>
								<Col span={12}>
									<TableTopBtn tableTitle={'현재고 배차안 요약'} tableBtn={getGridBtn} />
									<AUIGrid ref={refs2} columnLayout={getGridCol2()} gridProps={getGridProps2()} />
								</Col>
								<Col span={12}>
									<TableTopBtn tableTitle={'현재고 배차안 요약'} tableBtn={getGridBtn} />
									<AUIGrid ref={refs2} columnLayout={getGridCol2()} gridProps={getGridProps2()} />
								</Col>
							</Row>
						</AGrid>
						<AGrid className="h100">
							<Row gutter={6}>
								<Col span={6}>
									<TableTopBtn tableTitle={'현재고 배차안 요약'} tableBtn={getGridBtn} />
									<AUIGrid ref={refs2} columnLayout={getGridCol2()} gridProps={getGridProps2()} />
								</Col>
								<Col span={6}>
									<TableTopBtn tableTitle={'현재고 배차안 요약'} tableBtn={getGridBtn} />
									<AUIGrid ref={refs2} columnLayout={getGridCol2()} gridProps={getGridProps2()} />
								</Col>
								<Col span={6}>
									<TableTopBtn tableTitle={'현재고 배차안 요약'} tableBtn={getGridBtn} />
									<AUIGrid ref={refs2} columnLayout={getGridCol2()} gridProps={getGridProps2()} />
								</Col>
								<Col span={6}>
									<TableTopBtn tableTitle={'현재고 배차안 요약'} tableBtn={getGridBtn} />
									<AUIGrid ref={refs2} columnLayout={getGridCol2()} gridProps={getGridProps2()} />
								</Col>
							</Row>
						</AGrid>
						<AGrid className="h100">
							<TableTopBtn tableTitle={'상세결과'} tableBtn={getGridBtn} />
							<AUIGrid ref={refs2} columnLayout={getGridCol2()} gridProps={getGridProps2()} />
						</AGrid>
					</AGridWrap>
				</>
			),
		},
	];

	const tabClick = (key: string, e: any) => {
		if (key === '1') {
			setActiveTabKey('1');
			if (refs1.current) {
				refs1.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			setActiveTabKey('2');
			if (refs2.current) {
				refs2.current?.resize('100%', '100%');
			}
			if (refs3.current) {
				refs3.current?.resize('100%', '100%');
			}
			if (refs4.current) {
				refs4.current?.resize('100%', '100%');
			}
		}
		return;
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} name={'재고재배치조회'} />

			<Tabs items={tabs} activeKey={activeTabKey} onTabClick={tabClick} className="h100" />
		</>
	);
});

export default OmStockReocation;
