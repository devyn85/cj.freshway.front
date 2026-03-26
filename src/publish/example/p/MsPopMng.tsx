// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Util

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import { InputSearch, InputText, SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// Store

// API

const MsPopMng = forwardRef((props: any, gridRef: any) => {
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
				headerText: 'POP번호',
			},
			{
				headerText: 'BCR사용',
			},
			{
				headerText: '롤테이너',
			},
			{
				headerText: '거래처코드',
			},
			{
				headerText: '거래처명',
			},
			{
				headerText: '거래처 유형',
			},
			{
				headerText: '영업그룹',
			},
			{
				headerText: '변경시작일자',
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
			<MenuTitle authority="searchYn|saveYn" name={'거래처별POP관리'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<InputText label={'물류센터'} placeholder="저장조건 선택" />
				</li>
				<li>
					<InputSearch label={'거래처'} placeholder="거래처 선택" />
				</li>
				<li>
					<InputText label={'POP번호'} placeholder="POP번호 검색" />
				</li>
				<li>
					<InputSearch label={'차량번호'} placeholder="차량번호 선택" />
				</li>
			</SearchFormResponsive>

			<AGrid>
				<GridTopBtn gridTitle={'센터별거래처관리 목록'} gridBtn={gridBtn} totalCnt={120}></GridTopBtn>
				<AUIGrid columnLayout={getGridCol()} gridProps={getGridProps()} />
			</AGrid>
		</>
	);
});

export default MsPopMng;
