// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form, Tabs } from 'antd';
const { TabPane } = Tabs;

// Util

// Type
import { TableBtnPropsType } from '@/types/common';

// Component
import AGridWrap from '@/assets/styled/AGridWrap/AGridWrap';
import { RadioBox, Rangepicker, SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import TableTopBtn from '@/components/common/TableTopBtn';

const StExdcTransIndicatorY = forwardRef((props: any, gridRef: any) => {
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

	const radioOpt1 = [
		{
			label: '전체',
			value: '0',
		},
		{
			label: '실온',
			value: '1',
		},
		{
			label: 'D+냉장',
			value: '2',
		},
		{
			label: '냉동',
			value: '3',
		},
	];

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
				headerText: '코너코드',
			},
		];
	};
	const getGridCol2 = () => {
		return [
			{
				dataField: 'empNo',
				headerText: '코너코드',
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
			enableFilter: true,
		};
	};
	const getGridProps2 = () => {
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

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn|saveYn" name={'년도별 운송료지표'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<Rangepicker label={'기준년도'} />
				</li>
				<li>
					<RadioBox label={'저장조건'} options={radioOpt1} />
				</li>
			</SearchFormResponsive>
			<AGridWrap className="contain-wrap">
				<div className="chart-form" style={{ height: '300px', border: '1px solid #ccc' }}>
					<h3>년도별운송료(단위:억원)</h3>
					<div>chart area</div>
				</div>
				<AGrid>
					<AUIGrid columnLayout={getGridCol1()} gridProps={getGridProps1()} />
				</AGrid>
				<AGrid>
					<TableTopBtn tableTitle={'출고량(단위:억원)'} tableBtn={getGridBtn} />
					<AUIGrid columnLayout={getGridCol1()} gridProps={getGridProps1()} />
				</AGrid>
				<AGrid>
					<TableTopBtn tableTitle={'KG당운송료(단위:억원)'} tableBtn={getGridBtn} />
					<AUIGrid columnLayout={getGridCol2()} gridProps={getGridProps2()} />
				</AGrid>
			</AGridWrap>
		</>
	);
});

export default StExdcTransIndicatorY;
