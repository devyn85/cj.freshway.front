// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form, Tabs } from 'antd';
const { TabPane } = Tabs;

// Util

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import {
	DateRange,
	InputSearch,
	InputText,
	RadioBox,
	SearchFormResponsive,
	SelectBox,
} from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// Store

// API

const WdKxDeliveryInvoice = forwardRef((props: any, gridRef: any) => {
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

	const radOptions1 = [
		{ label: '요청일자', value: '' },
		{
			label: '택배접수일자',
			value: '',
		},
	];
	const radOptions2 = [
		{ label: '예', value: '' },
		{
			label: '아니오',
			value: '',
		},
	];

	const refs1: any = useRef(null);
	const refs2: any = useRef(null);
	const refs3: any = useRef(null);
	const refs4: any = useRef(null);
	const refs5: any = useRef(null);
	const refs6: any = useRef(null);
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
				headerText: '소속센터',
			},
			{
				headerText: '출고센터',
			},
			{
				headerText: '공정',
			},
			{
				headerText: '저장유무',
			},
			{
				headerText: '온도대',
			},
			{
				headerText: '인시생산성(라벨)',
			},
			{
				headerText: '인시생산성(물량)',
			},
			{
				headerText: '업무시간',
			},
			{
				headerText: '이동횟수',
			},
			{
				headerText: '라벨건수',
			},
			{
				headerText: '작업자 수',
			},
			{
				headerText: '8h 기준 투입인력',
			},
		];
	};
	const getGridCol2 = () => {
		return [
			{
				headerText: 'www',
			},
		];
	};
	const getGridCol3 = () => {
		return [
			{
				headerText: 'wwww',
			},
		];
	};
	const getGridCol4 = () => {
		return [
			{
				headerText: '소속센터',
			},
			{
				headerText: 'wwww',
			},
		];
	};
	const getGridCol5 = () => {
		return [
			{
				headerText: 'www',
			},
		];
	};
	const getGridCol6 = () => {
		return [
			{
				headerText: 'www',
			},
		];
	};

	/**
	 * 그리드 속성을 설정한다.
	 * @returns {object} 그리드 속성 설정 객체
	 */
	const getGridProps1 = () => {
		return {
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
	const getGridProps5 = () => {
		return {
			fillColumnSizeMode: false,
			enableColumnResize: true,
			showRowCheckColumn: true,
		};
	};
	const getGridProps6 = () => {
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
			label: '주문',
			children: (
				<>
					<AGrid>
						<GridTopBtn gridTitle={'목록'} gridBtn={getGridBtn()} />
						<AUIGrid ref={refs1} columnLayout={getGridCol1()} gridProps={getGridProps1()} />
					</AGrid>
				</>
			),
		},
		{
			key: '2',
			label: 'N배송',
			children: (
				<>
					<AGrid>
						<GridTopBtn gridTitle={'목록'} gridBtn={getGridBtn()} />
						<AUIGrid ref={refs2} columnLayout={getGridCol2()} gridProps={getGridProps2()} />
					</AGrid>
				</>
			),
		},
		{
			key: '3',
			label: '일단택배',
			children: (
				<>
					<AGrid>
						<GridTopBtn gridTitle={'목록'} gridBtn={getGridBtn()} />
						<AUIGrid ref={refs3} columnLayout={getGridCol3()} gridProps={getGridProps3()} />
					</AGrid>
				</>
			),
		},
		{
			key: '4',
			label: '반품택배',
			children: (
				<>
					<AGrid>
						<GridTopBtn gridTitle={'목록'} gridBtn={getGridBtn()} />
						<AUIGrid ref={refs4} columnLayout={getGridCol4()} gridProps={getGridProps4()} />
					</AGrid>
				</>
			),
		},
		{
			key: '5',
			label: '택배기준',
			children: (
				<>
					<AGrid>
						<GridTopBtn gridTitle={'목록'} gridBtn={getGridBtn()} />
						<AUIGrid ref={refs5} columnLayout={getGridCol5()} gridProps={getGridProps5()} />
					</AGrid>
				</>
			),
		},
		{
			key: '6',
			label: '정렬기준정보',
			children: (
				<>
					<AGrid>
						<GridTopBtn gridTitle={'목록'} gridBtn={getGridBtn()} />
						<AUIGrid ref={refs6} columnLayout={getGridCol6()} gridProps={getGridProps6()} />
					</AGrid>
				</>
			),
		},
	];

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string, e: any) => {
		if (key === '1') {
			setActiveTabKey('1');
			if (refs1.gridRef.current) {
				refs1.gridRef.current.resize('100%', '100%');
			}
		} else if (key === '2') {
			setActiveTabKey('2');
			if (refs2.gridRef.current) {
				refs2.gridRef.current.resize('100%', '100%');
			}
		} else if (key === '3') {
			setActiveTabKey('3');
			if (refs3.gridRef.current) {
				refs3.gridRef.current.resize('100%', '100%');
			}
		} else if (key === '4') {
			setActiveTabKey('4');
			if (refs4.gridRef.current) {
				refs4.gridRef.current.resize('100%', '100%');
			}
		} else if (key === '5') {
			setActiveTabKey('5');
			if (refs5.gridRef.current) {
				refs5.gridRef.current.resize('100%', '100%');
			}
		} else if (key === '6') {
			setActiveTabKey('6');
			if (refs6.gridRef.current) {
				refs6.gridRef.current.resize('100%', '100%');
			}
		}
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
			<MenuTitle name={'택배송장'} />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				{activeTabKey === '1' && (
					<>
						<li>
							<RadioBox label="일자구분" name="radioBasic1" required options={radOptions1} />
						</li>
						<li>
							<DateRange label="일자" name="datePickerBasic" />
						</li>
						<li>
							<SelectBox label="물류센터" />
						</li>
						<li>
							<SelectBox label="제외여부" />
						</li>
						<li>
							<InputText label="주문고유번호" />
						</li>
						<li>
							<InputText label="운송장번호" />
						</li>
						<li>
							<SelectBox label="접수구분" />
						</li>
						<li>
							<SelectBox label="접수시간대" />
						</li>
						<li>
							<SelectBox label="상품코드" />
						</li>
						<li>
							<RadioBox label="재고검수여부" name="radioBasic2" required options={radOptions2} />
						</li>
					</>
				)}
				{activeTabKey === '5' && (
					<>
						<li>
							<DateRange label="접수일자" required name="datePickerBasic" />
						</li>
						<li>
							<SelectBox label="진행상태" />
						</li>
						<li>
							<SelectBox label="삭제여부" />
						</li>
						<li>
							<InputText label="주민번호" />
						</li>
						<li>
							<InputText label="운송장번호" />
						</li>
						<li>
							<InputSearch label="상품코드" />
						</li>
					</>
				)}
			</SearchFormResponsive>
			<Tabs items={tabs} activeKey={activeTabKey} onTabClick={tabClick} className="contain-wrap" />
		</>
	);
});

export default WdKxDeliveryInvoice;
