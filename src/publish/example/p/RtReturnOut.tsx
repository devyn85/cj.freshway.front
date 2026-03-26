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
import { InputSearch, InputText, SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// Store

// API

const RtReturnOut = forwardRef((props: any, gridRef: any) => {
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
				headerText: '순번',
			},
			{
				headerText: '물류센터',
			},
			{
				headerText: '창고',
			},
			{
				headerText: '협력사코드',
			},
			{
				headerText: '협력사명',
			},
			{
				headerText: '상품정보',
				children: [
					{
						headerText: '상품코드',
					},
					{
						headerText: '상품명칭',
					},
				],
			},
			{
				headerText: '재고속성',
			},
			{
				headerText: '플랜트',
			},
			{
				headerText: '저장조건',
			},
			{
				headerText: '식별번호유무',
			},
			{
				headerText: '보류재고',
			},
			{
				headerText: '반품수량',
			},
			{
				headerText: '단위',
			},
			{
				headerText: 'BOX수량',
			},
			{
				headerText: '로케이션',
			},
			{
				headerText: '재고위치',
			},
			{
				headerText: 'VoC(소)',
			},
			{
				headerText: 'VoC(세)',
			},
			{
				headerText: '귀책',
			},
			{
				headerText: '물류귀책배부',
			},
			{
				headerText: '귀속구분',
			},
			{
				headerText: '기준일(유통,제조)',
			},
			{
				headerText: '유통기간(잔여/전체)',
			},
			{
				headerText: '상품이력정보',
				children: [
					{
						headerText: '이력번호',
					},
					{
						headerText: '바코드',
					},
					{
						headerText: 'B/L 번호',
					},
					{
						headerText: '도축일자',
					},
					{
						headerText: '도축장',
					},
					{
						headerText: '계약유형',
					},
					{
						headerText: '계약업체',
					},
					{
						headerText: '계약업체명',
					},
					{
						headerText: 'FROM',
					},
					{
						headerText: 'TO',
					},
				],
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
					btnLabel: '인쇄',
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

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'copy', // 행복사
				initValues: {
					menuId: '',
					regId: '',
					regDt: '',
				},
			},

			{
				btnType: 'elecApproval', // 전자결재
			},
		],
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
			<MenuTitle authority="searchYn|saveYn" name={'협력사반품지시'} />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<InputSearch label={'상품코드'} placeholder="상품코드 검색" />
				</li>
				<li>
					<InputSearch label={'협력사코드'} placeholder="협력사코드 검색" />
				</li>
				<li>
					<SelectBox label={'처리방안'} />
				</li>
				<li>
					<InputText label="FROM" />
				</li>
				<li>
					<InputText label="TO" />
				</li>
				<li>
					<SelectBox label={'재고위치'} />
				</li>
				<li>
					<SelectBox label={'식별번호유무'} />
				</li>
				<li>
					<InputText label="B/L 번호" />
				</li>
				<li>
					<InputText label="이력번호" />
				</li>
				<li>
					<InputSearch label="계약업체" />
				</li>
				<li>
					<SelectBox label={'재고속성'} />
				</li>
			</SearchFormResponsive>

			{/* <RtReturnOutDetail gridRef={gridRef} data={gridData} totalCnt={totalCnt} /> */}
			<AGrid className="contain-wrap">
				<AUIGrid columnLayout={getGridCol()} gridProps={getGridProps()} />
			</AGrid>
		</>
	);
});

export default RtReturnOut;
