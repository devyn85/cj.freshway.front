// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Col, Form, Tabs } from 'antd';
const { TabPane } = Tabs;

// Util

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import { CheckBox, InputSearch, SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// Store

// API

const OmOrderCreationSTOOrdBase = forwardRef((props: any, gridRef: any) => {
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

	const refs1: any = useRef(null);
	const refs2: any = useRef(null);
	const [activeTabKey, setActiveTabKey] = useState('1');
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

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
				headerText: '상품정보',
				children: [
					{
						headerText: '상품코드',
					},
					{
						headerText: '상품명칭',
					},
				],
			},
			{
				headerText: '재고속성',
			},
			{
				headerText: '주문단위',
			},
			{
				headerText: '재고량',
				children: [
					{
						headerText: '수원광역',
					},
					{
						headerText: '수원',
					},
					{
						headerText: '미선택',
					},
					{
						headerText: '미선택',
					},
					{
						headerText: '미선택',
					},
					{
						headerText: '미선택',
					},
					{
						headerText: '발주센터',
					},
				],
			},
			{
				headerText: '입고예정',
			},
			{
				headerText: '주문량',
			},
			{
				headerText: '분배량',
			},
			{
				headerText: '발주예정',
			},
			{
				headerText: '미발주량',
			},
			{
				headerText: '발주량(STO)',
				children: [
					{
						headerText: '합계',
					},
					{
						headerText: '수원광역',
					},
					{
						headerText: '수원',
					},
					{
						headerText: '미선택',
					},
					{
						headerText: '미선택',
					},
					{
						headerText: '미선택',
					},
					{
						headerText: '미선택',
					},
				],
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
				headerText: '공급센터',
				children: [
					{
						headerText: '물류센터',
					},
					{
						headerText: '물류센터명',
					},
				],
			},
			{
				headerText: '공급받는센터',
				children: [
					{
						headerText: '물류센터',
					},
					{
						headerText: '물류센터명',
					},
				],
			},
			{
				headerText: '상품코드',
			},
			{
				headerText: '상품명칭',
			},
			{
				headerText: '단위',
			},
			{
				headerText: '재고속성',
			},
			{
				headerText: '작업수량',
			},
			{
				headerText: '',
				children: [
					{
						headerText: 'PROCESSFLAG',
					},
					{
						headerText: 'PROCESSMSG',
					},
				],
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

	// 탭 아이템 영역
	const tabs = [
		{
			key: '1',
			label: '이체대상',
			children: (
				<>
					<AGrid className="h100">
						<GridTopBtn gridTitle={'목록'} gridBtn={getGridBtn()} />
						<AUIGrid ref={refs1} columnLayout={getGridCol()} gridProps={getGridProps()} />
					</AGrid>
				</>
			),
		},
		{
			key: '2',
			label: '처리결과',
			children: (
				<>
					<AGrid className="h100">
						<GridTopBtn gridTitle={'목록'} gridBtn={getGridBtn()} />
						<AUIGrid ref={refs2} columnLayout={getGridCol1()} gridProps={getGridProps()} />
					</AGrid>
				</>
			),
		},
	];

	const tabClick = (key: string, e: any) => {
		if (key === '1') {
			setActiveTabKey('1');
			if (refs1.gridRef.current) {
				refs1.gridRef.current?.resize('100%', '100%');
			}
			if (refs1.gridRef2.current) {
				refs1.gridRef2.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			setActiveTabKey('2');
			if (refs2.gridRef.current) {
				refs2.gridRef.current?.resize('100%', '100%');
			}
			if (refs2.gridRef2.current) {
				refs2.gridRef2.current?.resize('100%', '100%');
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
			<MenuTitle func={titleFunc} name={'당일광역보충발주'} />

			{activeTabKey === '1' && (
				<SearchFormResponsive form={form} initialValues={searchBox}>
					<li>
						<DatePicker label="이체일자" />
					</li>
					<li>
						<SelectBox label="공급센터" />
					</li>
					<li style={{ gridColumn: 'span 2' }} className="flex-wrap">
						<SelectBox label="공급센터" placeholder="1순위" style={{ width: '100px' }} />
						<SelectBox placeholder="2순위" />
						<SelectBox placeholder="3순위" />
						<SelectBox placeholder="4순위" />
						<SelectBox placeholder="5순위" />
						<SelectBox placeholder="6순위" />
					</li>
					<li>
						<CheckBox name="" label="재고량발주" />
					</li>
					<li>
						<InputSearch label="상품코드" />
					</li>
					<li style={{ gridColumn: 'span 2' }} className="flex-wrap">
						<SelectBox label="고객마감유형" span={12} />
						<CheckBox name="" span={6}>
							축육상품제외
						</CheckBox>
						<CheckBox name="" span={6}>
							주문량강제발주
						</CheckBox>
					</li>
					<li>
						<SelectBox label="저장조건" />
					</li>
					<li style={{ gridColumn: 'span 2' }} className="flex-wrap">
						<Col span={10}>
							<CheckBox name="" label="입고량산정조건">
								PO제외
							</CheckBox>
						</Col>
						<Col span={7}>
							<CheckBox name="">STO제외</CheckBox>
						</Col>
						<Col span={7}>
							<CheckBox name="">KX STO제외</CheckBox>
						</Col>
					</li>
					<li>
						<CheckBox name="" label="재고량산정조건" />
					</li>
					<li>
						<InputSearch label="제외원거리유형" />
					</li>
					<li style={{ gridColumn: 'span 2' }} className="flex-wrap">
						<InputSearch label="예외상품" />
						<CheckBox name="">CROSS 재고포함</CheckBox>
					</li>
					<li>
						<InputSearch label="저장원거리유형" />
					</li>
				</SearchFormResponsive>
			)}
			{activeTabKey === '2' && <SearchFormResponsive form={form} initialValues={searchBox}></SearchFormResponsive>}

			<Tabs items={tabs} activeKey={activeTabKey} onTabClick={tabClick} className="contain-wrap" />
		</>
	);
});

export default OmOrderCreationSTOOrdBase;
