// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import DatePicker from '@/components/common/custom/form/Datepicker';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form, Tabs } from 'antd';
const { TabPane } = Tabs;

// Util

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// Store

// API

const IbKxStoragefeeExpenseWM = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const gridRef1 = useRef();
	const gridRef2 = useRef(null);

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
	 * data onChange Event Handler
	 * @param  {string} value 변경 후 data
	 */
	const onChange = (value: string) => {};

	/**
	 * 그리드 컬럼을 설정한다.
	 * @returns {object[]} 그리드 컬럼 설정 객체
	 */
	const getGridCol1 = () => {
		return [
			{
				headerText: '선택',
			},
			{
				headerText: '일자',
			},
			{
				headerText: '물류센터',
			},
			{
				headerText: 'MM전송번호',
			},
			{
				headerText: '세금계산서번호',
			},
			{
				headerText: 'MM송장번호',
			},
			{
				headerText: 'Slip No',
			},
			{
				headerText: '상태',
			},
			{
				headerText: 'IF Status',
			},
			{
				headerText: '수량',
			},
			{
				headerText: '단위',
			},
			{
				headerText: '송장금액',
			},
			{
				headerText: '부가세',
			},
			{
				headerText: 'Supplier Code',
			},
			{
				headerText: 'Supplier Name',
			},
			{
				headerText: 'Summary',
			},
			{
				headerText: '최종변경자',
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
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef1, // 타겟 그리드 Ref
			btnArr: [],
		};

		return gridBtn;
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * 표 버튼 함수를 설정한다.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getTableBtn = () => {
		const tableBtn: TableBtnPropsType = {
			tGridRef: gridRef1, // 타겟 그리드 Ref
			btnArr: [],
		};

		return tableBtn;
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
			<MenuTitle authority="searchYn|saveYn" name={'비용기표(1000센터)'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<DatePicker
						label="마감월"
						name="yyyyMm"
						format="YYYY-MM"
						picker="month"
						placeholder={'월 선택'}
						onChange={onChange}
						allowClear
						renderExtraFooter={() => (
							<div className="flex-wrap jc-center pd5">
								<Button size="small" type="primary" onClick={() => alert('확인')}>
									오늘
								</Button>
							</div>
						)}
					/>
				</li>
			</SearchFormResponsive>

			<AGrid className="contain-wrap">
				<AUIGrid ref={gridRef1} columnLayout={getGridCol1()} gridProps={getGridProps1()} />
			</AGrid>
		</>
	);
});

export default IbKxStoragefeeExpenseWM;
