// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Util

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import { InputText, SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// Store

// API

const StStockForKX = forwardRef((props: any, gridRef: any) => {
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
				headerText: '제품코드',
			},
			{
				headerText: '제품명',
			},
			{
				headerText: '유통기한',
			},
			{
				headerText: '출고기한',
			},
			{
				headerText: '보관센터',
			},
			{
				headerText: '상태',
			},
			{
				headerText: '총재고량',
			},
			{
				headerText: '가용재고량',
			},
			{
				headerText: '중량',
			},
			{
				headerText: '제조일자',
			},
			{
				headerText: '입고일자',
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

	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 엑셀양식
			},
			{
				btnType: 'excelUpload', // 엑셀업로드
			},
			{
				btnType: 'curPlus', // 행삽입 (선택된 row 바로 아래 행추가)
			},
			{
				btnType: 'plus', // 행추가
				initValues: {
					menuYn: 0,
					useYn: 0,
				},
			},
			{
				btnType: 'delete', // 행삭제
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
			<MenuTitle authority="searchYn|saveYn" name={'저장품재고조회(CJ대한통운)'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<InputText label={'상품코드'} placeholder="상품코드 선택" />
				</li>
				<li>
					<InputText label={'센터코드'} placeholder="센터코드 선택" />
				</li>
				<li>
					<SelectBox label={'정상'} />
				</li>
			</SearchFormResponsive>

			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={'저장품재고목록'} gridBtn={gridBtn} totalCnt={120}></GridTopBtn>
				<AUIGrid columnLayout={getGridCol()} gridProps={getGridProps()} />
			</AGrid>
		</>
	);
});

export default StStockForKX;
