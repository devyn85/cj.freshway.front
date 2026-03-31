// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Col, Form, Row, Tabs } from 'antd';
const { TabPane } = Tabs;

// Util

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import { SearchFormResponsive, InputSearch, InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// Store

// API

const pageSample6 = forwardRef((props: any, gridRef: any) => {
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
	const getGridCol = () => {
		return [
			{
				dataField: 'empNo',
				headerText: '코너코드',
			},
			{
				headerText: '코너명',
			},
			{
				headerText: '표시순서',
			},
			{
				headerText: '사용여부',
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
					btnType: 'down', // 아래로
				},
				{
					btnType: 'up', // 위로
				},
				{
					btnType: 'excelForm', // 엑셀양식
				},
				{
					btnType: 'excelUpload', // 엑셀업로드
				},
				{
					btnType: 'excelDownload', // 엑셀다운로드
				},
				{
					btnType: 'copy', // 행복사
					initValues: {
						menuId: '',
						regId: '',
						regDt: '',
					},
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
				{
					btnType: 'detailView', // 상세보기
				},
				{
					btnType: 'btn1', // 사용자 정의버튼1
				},
				{
					btnType: 'btn2', // 사용자 정의버튼2
				},
				{
					btnType: 'btn3', // 사용자 정의버튼3
				},
				{
					btnType: 'print', // 인쇄
				},
				{
					btnType: 'new', // 신규
				},
				{
					btnType: 'save', // 저장
				},
				{
					btnType: 'elecApproval', // 전자결재
				},
			],
		};

		return gridBtn;
	};

	/**
	 * 표 버튼 함수를 설정한다.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getTableBtn = () => {
		const tableBtn: TableBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'pre', // 이전
				},
				{
					btnType: 'post', // 다음
				},
				{
					btnType: 'delete', // 행삭제
				},
				{
					btnType: 'btn1', // 사용자 정의버튼1
				},
				{
					btnType: 'btn2', // 사용자 정의버튼2
				},
				{
					btnType: 'btn3', // 사용자 정의버튼3
				},
				{
					btnType: 'new', // 신규
				},
				{
					btnType: 'save', // 저장
				},
			],
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
			<MenuTitle authority="searchYn|saveYn" name={'외부비축재고속성변경(추가개발)'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<SelectBox label={'상품코드'} placeholder="상품코드 검색" />
				</li>
				<li>
					<InputText label={'B/L번호'} placeholder="B/L번호 입력" />
				</li>
				<li>
					<SelectBox label={'재고속성'} placeholder="재고속성 선택" />
				</li>
				<li>
					<InputSearch label={'창고'} placeholder="창고 선택" />
				</li>
				<li>
					<InputSearch label={'사유코드'} placeholder="사유코드 선택" />
				</li>
				<li>
					<span>
						<InputSearch label={'재고속성'} placeholder="재고속성 선택" />
						<Button type={'default'}>선택적용</Button>
					</span>
				</li>
			</SearchFormResponsive>

			<Row gutter={8}>
				<Col span={12}>
					<AGrid>
						<GridTopBtn gridTitle={'재고속성'} gridBtn={getGridBtn()} totalCnt={120}></GridTopBtn>
						<AUIGrid columnLayout={getGridCol()} gridProps={getGridProps()} />
					</AGrid>
				</Col>
				<Col span={12}>
					<AGrid>
						<GridTopBtn gridTitle={'재고목록'} gridBtn={getGridBtn()}></GridTopBtn>
						<AUIGrid columnLayout={getGridCol()} gridProps={getGridProps()} />
					</AGrid>
				</Col>
			</Row>
		</>
	);
});

export default pageSample6;
