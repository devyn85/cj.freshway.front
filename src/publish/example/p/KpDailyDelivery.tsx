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
import { SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// Store

// API

const KpDailyDelivery = forwardRef((props: any, gridRef: any) => {
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
				headerText: '물류센터',
			},
			{
				headerText: '구분1',
			},
			{
				headerText: '구분2',
			},
			{
				headerText: '구분3',
			},
			{
				headerText: '배송비',
			},
			{
				headerText: '배송량',
			},
			{
				headerText: '차량대수',
			},
			{
				headerText: '착지',
			},
		];
	};
	const getGridCol2 = () => {
		return [
			{
				dataField: 'empNo',
				headerText: 'www',
			},
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
			label: '차량일일현황',
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
			label: '배송시간/서비스',
			children: (
				<>
					<AGrid>
						<GridTopBtn gridTitle={'목록'} gridBtn={getGridBtn()} />
						<AUIGrid ref={refs3} columnLayout={getGridCol2()} gridProps={getGridProps2()} />
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
			<MenuTitle name={'데일리생산성(배송)'} />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<Rangepicker label="일자" />
				</li>
				<li>
					<SelectBox label="물류센터" />
				</li>
			</SearchFormResponsive>
			<Tabs items={tabs} activeKey={activeTabKey} onTabClick={tabClick} className="contain-wrap" />
		</>
	);
});

export default KpDailyDelivery;
