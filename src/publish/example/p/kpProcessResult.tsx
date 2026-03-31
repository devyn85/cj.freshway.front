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
import { InputSearch, SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// Store

// API

const kpProcessResult = forwardRef((props: any, gridRef: any) => {
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
				headerText: '물량',
			},
		];
	};
	const getGridCol3 = () => {
		return [
			{
				headerText: '소속센터',
			},
			{
				headerText: '스캔대상',
			},
			{
				headerText: '라벨값',
			},
			{
				headerText: '출고센터',
			},
			{
				headerText: '저장유무',
			},
			{
				headerText: '온도대',
			},
			{
				headerText: '물량',
			},
			{
				headerText: '상태값',
			},
			{
				headerText: '생산성측정',
			},
			{
				headerText: '상세정보',
			},
			{
				headerText: '스캔시간',
			},
			{
				headerText: '주문삭제',
			},
		];
	};
	const getGridCol4 = () => {
		return [
			{
				headerText: '소속센터',
			},
			{
				headerText: 'ID',
			},
			{
				headerText: '계정On/Off',
			},
			{
				headerText: '첫 작업시간',
			},
			{
				headerText: '마지막 작업시간',
			},
			{
				headerText: '총 스캔건수',
			},
			{
				headerText: '반영',
			},
			{
				headerText: '미반영',
			},
			{
				headerText: '공정1',
			},
			{
				headerText: '공정2',
			},
			{
				headerText: '공정3',
			},
			{
				headerText: '공정4',
			},
			{
				headerText: '공정5',
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
			label: '센터별',
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
			label: '작업자별',
			children: (
				<>
					<AGrid>
						<GridTopBtn gridTitle={'목록'} gridBtn={getGridBtn()} />
						<AUIGrid ref={refs1} columnLayout={getGridCol2()} gridProps={getGridProps2()} />
					</AGrid>
				</>
			),
		},
		{
			key: '3',
			label: 'RAW',
			children: (
				<>
					<AGrid>
						<GridTopBtn gridTitle={'목록'} gridBtn={getGridBtn()} />
						<AUIGrid ref={refs1} columnLayout={getGridCol3()} gridProps={getGridProps3()} />
					</AGrid>
				</>
			),
		},
		{
			key: '4',
			label: '관리자用',
			children: (
				<>
					<AGrid>
						<GridTopBtn gridTitle={'목록'} gridBtn={getGridBtn()} />
						<AUIGrid ref={refs1} columnLayout={getGridCol4()} gridProps={getGridProps4()} />
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
			<MenuTitle name={'공정별 생산성'} />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<Rangepicker label="조회일자" />
				</li>
				<li>
					<SelectBox label="물류센터" />
				</li>
				<li>
					<SelectBox label="공정" />
				</li>
				{activeTabKey === '1' && <></>}
				{activeTabKey === '2' && (
					<>
						<li>
							<InputSearch label="ID" />
						</li>
					</>
				)}
				{activeTabKey === '3' && (
					<>
						<li>
							<InputSearch label="ID" />
						</li>
					</>
				)}
			</SearchFormResponsive>
			<Tabs items={tabs} activeKey={activeTabKey} onTabClick={tabClick} className="contain-wrap" />
		</>
	);
});

export default kpProcessResult;
