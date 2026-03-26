// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Col, Form, Row, Tabs } from 'antd';
const { TabPane } = Tabs;

// Util

// Type
import { TableBtnPropsType } from '@/types/common';

// Component
import { Rangepicker, SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import TableTopBtn from '@/components/common/TableTopBtn';

const StExdcTransIndicatorV = forwardRef((props: any, gridRef: any) => {
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
			showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
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
			<MenuTitle authority="searchYn|saveYn" name={'입출고지표'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<Rangepicker label={'재고월'} />
				</li>
			</SearchFormResponsive>

			<div>
				<h3>전월대비</h3>
				<Row gutter={8}>
					<Col span={6}>
						<table className="tbl-view">
							<thead>
								<tr>
									<th colSpan={2}>매출액</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td rowSpan={2}>221.7억</td>
									<td>▲2.4%</td>
								</tr>
								<tr>
									<td>▼2.4%</td>
								</tr>
							</tbody>
						</table>
					</Col>
					<Col span={6}>
						<table className="tbl-view">
							<thead>
								<tr>
									<th colSpan={2}>입고</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td rowSpan={2}>221.7억</td>
									<td>▲2.4%</td>
								</tr>
								<tr>
									<td>▼2.4%</td>
								</tr>
							</tbody>
						</table>
					</Col>
					<Col span={6}>
						<table className="tbl-view">
							<thead>
								<tr>
									<th colSpan={2}>출고</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td rowSpan={2}>221.7억</td>
									<td>▲2.4%</td>
								</tr>
								<tr>
									<td>▼2.4%</td>
								</tr>
							</tbody>
						</table>
					</Col>
					<Col span={6}>
						<table className="tbl-view">
							<thead>
								<tr>
									<th colSpan={2}>보관료</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td rowSpan={2}>221.7억</td>
									<td>▲2.4%</td>
								</tr>
								<tr>
									<td>▼2.4%</td>
								</tr>
							</tbody>
						</table>
					</Col>
				</Row>
			</div>
			<div className="chart-form mt20" style={{ height: '250px', border: '1px solid #ccc' }}>
				chart area
			</div>
			<AGrid>
				<TableTopBtn tableTitle={'외부창고정산/마감현황'} tableBtn={getGridBtn} />
				<AUIGrid columnLayout={getGridCol1()} gridProps={getGridProps1()} />
			</AGrid>
			<AGrid>
				<TableTopBtn tableTitle={'외부창고물동현황'} tableBtn={getGridBtn} />
				<AUIGrid columnLayout={getGridCol2()} gridProps={getGridProps2()} />
			</AGrid>
		</>
	);
});

export default StExdcTransIndicatorV;
