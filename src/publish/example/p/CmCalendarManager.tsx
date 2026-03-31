// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Util

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import { DateRange, InputText, SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// Store

// API

const CmCalendarManager = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();

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
	const getGridCol = () => {
		return [
			{
				dataField: 'empNo',
				headerText: '순번',
			},
			{
				headerText: '물류센터',
			},
			{
				headerText: '구분',
			},
			{
				headerText: '연',
			},
			{
				headerText: '월',
			},
			{
				headerText: '일',
			},
			{
				headerText: '요일',
			},
			{
				headerText: '휴일유무',
			},
			{
				headerText: '휴일내용',
			},
			{
				headerText: '등록일자',
			},
			{
				headerText: '최종변경시간',
			},
			{
				headerText: '생성인',
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

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
			},
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
			<MenuTitle authority="searchYn|saveYn" name={'발주용휴일관리'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<DateRange label={'일자'} />
				</li>
				<li>
					<SelectBox label={'휴일유무'} />
				</li>
				<li>
					<InputText label={'휴일내용'}></InputText>
				</li>
				<li>
					<SelectBox label={'물류센터'} />
				</li>
				<li>
					<SelectBox label={'구분'} />
				</li>
			</SearchFormResponsive>

			<AGrid>
				<GridTopBtn gridTitle={'발주용휴일관리 목록'} gridBtn={gridBtn} totalCnt={120} />
				<AUIGrid columnLayout={getGridCol()} gridProps={getGridProps()} />
			</AGrid>
		</>
	);
});

export default CmCalendarManager;
