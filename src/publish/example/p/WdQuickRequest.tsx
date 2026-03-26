// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Col, Form, Row, Tabs } from 'antd';
const { TabPane } = Tabs;

// Util

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import AGridWrap from '@/assets/styled/AGridWrap/AGridWrap';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';
import {
	InputSearch,
	InputText,
	RadioBox,
	Rangepicker,
	SearchFormResponsive,
	SelectBox,
} from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import TableTopBtn from '@/components/common/TableTopBtn';
import TextArea from 'antd/es/input/TextArea';

// Store

// API

const WdQuickRequest = forwardRef((props: any, gridRef: any) => {
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

	const radioOptions1 = [
		{ label: '전체', value: 'BBS_TP' },
		{
			label: '예',
			value: '',
		},
		{
			label: '아니오',
			value: '',
		},
	];
	const radioOptions2 = [
		{ label: '편도', value: 'BBS_TP' },
		{
			label: '왕복',
			value: '',
		},
		{
			label: '경유',
			value: '',
		},
	];
	const radioOptions3 = [
		{ label: '오토바이', value: 'BBS_TP' },
		{
			label: '다마스',
			value: '',
		},
		{
			label: '라보',
			value: '',
		},
		{
			label: '트럭',
			value: '',
		},
		{
			label: '냉동탑차',
			value: '',
		},
	];
	const radioOptions4 = [
		{ label: '신용거래', value: 'BBS_TP' },
		{
			label: '선불',
			value: '',
		},
		{
			label: '착불',
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
			key: '2',
			label: 'ＶＳＲ접수현황',
			children: (
				<>
					<AGrid className="h100">
						<TableTopBtn tableTitle={'퀵처리요청 Voc목록'} tableBtn={getGridBtn} className="fix-title">
							<Button name="">퀵센터접수</Button>
						</TableTopBtn>
						<AUIGrid ref={refs1} columnLayout={getGridCol1()} gridProps={getGridProps1()} />
					</AGrid>
				</>
			),
		},
		{
			key: '1',
			label: '퀵주문접수',
			children: (
				<>
					<AGridWrap className="h100">
						<AGrid className="h-auto">
							<TableTopBtn tableTitle={''} tableBtn={getGridBtn}>
								<Button>퀵접수확정</Button>
							</TableTopBtn>
							<UiDetailViewGroup className="grid-column-4" ref={groupRef}>
								<li>
									<RadioBox label="배송방법" name="radioBasic1" options={radioOptions2} />
								</li>
								<li style={{ gridColumn: 'span 2' }}>
									<RadioBox label="배송수단" name="radioBasic1" options={radioOptions3} />
								</li>
								<li>
									<SelectBox label="배송선택" />
								</li>
								<li>
									<SelectBox label="물품종류" />
								</li>
								<li>
									<RadioBox label="지급구분" name="radioBasic1" options={radioOptions4} />
								</li>
								<li>
									<Rangepicker label={'예약일시'} />
								</li>
							</UiDetailViewGroup>
							<TableTopBtn tableTitle={'접수목록'} tableBtn={getGridBtn}>
								<Form layout="inline">
									<SelectBox className="bg-white" />
									<SelectBox className="bg-white" />
									<Button>집하지이동</Button>
								</Form>
							</TableTopBtn>
							<AUIGrid ref={refs2} columnLayout={getGridCol2()} gridProps={getGridProps2()} />
						</AGrid>
						<AGrid>
							<Tabs defaultActiveKey="21">
								<TabPane tab="상품제외" key="21">
									<AGrid className="h-auto">
										<TableTopBtn tableTitle={'집하지 목록'} tableBtn={getGridBtn}>
											<Button>퀵접수확정</Button>
										</TableTopBtn>
										<AUIGrid ref={refs3} columnLayout={getGridCol3()} gridProps={getGridProps3()} />
									</AGrid>
								</TabPane>
								<TabPane tab="센터제외" key="22">
									<AGrid className="h-auto">
										<TableTopBtn tableTitle={'도착지 목록'} tableBtn={getGridBtn} />
										<AUIGrid ref={refs4} columnLayout={getGridCol4()} gridProps={getGridProps4()} />
									</AGrid>
								</TabPane>
							</Tabs>
						</AGrid>
						<AGrid className="h-auto">
							<Row gutter={12}>
								<Col span={12}>
									<AGrid>test</AGrid>
								</Col>
								<Col span={12}>
									<TextArea placeholder="입력" autoSize={{ minRows: 3, maxRows: 5 }} style={{ width: '100%' }} />
								</Col>
							</Row>
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
			<MenuTitle func={titleFunc} name={'퀵 접수(VSR) 및 처리'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<Rangepicker label={'의뢰일/희망일'} required />
				</li>
				<li>
					<RadioBox label="긴급여부" name="radioBasic1" required options={radioOptions1} />
				</li>
				<li>
					<SelectBox label="진행사항" />
				</li>
				<li>
					<SelectBox label="VSR유형" />
				</li>
				<li>
					<InputText label="VOC번호" />
				</li>
				<li>
					<InputSearch label="요청부서" />
				</li>
				<li>
					<InputText label="센터접수번호" />
				</li>
				<li>
					<InputSearch label="거래처" />
				</li>
			</SearchFormResponsive>
			<Tabs items={tabs} activeKey={activeTabKey} onTabClick={tabClick} className="contain-wrap" />
		</>
	);
});

export default WdQuickRequest;
