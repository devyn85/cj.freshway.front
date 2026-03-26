// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form, Tabs } from 'antd';
const { TabPane } = Tabs;

// Util

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import {
	Datepicker,
	FileUpload,
	InputSearch,
	InputText,
	LabelText,
	Rangepicker,
	SearchFormResponsive,
	SelectBox,
} from '@/components/common/custom/form';
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
			<MenuTitle authority="searchYn|saveYn" name={'외부창고현황관리'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<Rangepicker label={'시작일자'} />
				</li>
				<li>
					<SelectBox label={'저장조건'} placeholder="저장조건 선택" />
				</li>
				<li>
					<InputSearch label={'창고'} placeholder="창고 검색" />
				</li>
				<li>
					<SelectBox label={'권역'} placeholder="권역 선택" />
				</li>
				<li>
					<SelectBox label={'지역'} placeholder="지역 선택" />
				</li>
			</SearchFormResponsive>

			<AGrid>
				<GridTopBtn gridTitle={'창고목록'} gridBtn={getGridBtn()} totalCnt={120}></GridTopBtn>
				<AUIGrid columnLayout={getGridCol()} gridProps={getGridProps()} />
			</AGrid>

			<AGrid>
				<GridTopBtn gridTitle={'창고 세부내역'} gridBtn={getGridBtn()} totalCnt={120}></GridTopBtn>
				<UiDetailViewArea>
					<UiDetailViewGroup className="grid-column-4" ref={groupRef}>
						<li>
							<LabelText label={'물류센터'} />
						</li>
						<li>
							<LabelText label={'플랜트'} required />
						</li>
						<li>
							<LabelText label={'저장위치'} required />
						</li>
						<li>
							<LabelText label={'내역'} required />
						</li>
						<li>
							<InputSearch label={'기본주소'} placeholder="기본주소 검색" />
						</li>
						<li>
							<InputText label={'상세주소'} placeholder="상세주소" />
						</li>
						<li>
							<InputText label={'전화번호'} placeholder="전화번호" />
						</li>
						<li>
							<InputText label={'팩스번호1'} placeholder="팩스번호1" />
						</li>
						<li>
							<InputText label={'팩스번호2'} placeholder="팩스번호2" />
						</li>
						<li>
							<InputText label={'E-mail1'} placeholder="E-mail1" />
						</li>
						<li>
							<InputText label={'E-mail2'} placeholder="E-mail2" />
						</li>
						<li>
							<InputSearch label={'협력사코드'} placeholder="협력사코드 검색" />
						</li>
						<li>
							<InputText label={'권역'} placeholder="권역" />
						</li>
						<li>
							<InputText label={'지역'} placeholder="지역" />
						</li>
						<li>
							<InputText label={'저장품목'} placeholder="저장품목" />
						</li>
						<li>
							<Datepicker label={'계약시작'} required />
						</li>
						<li>
							<Datepicker label={'계약종료'} required />
						</li>
						<li>
							<SelectBox label={'계약여부'} placeholder="계약여부 선택" />
						</li>
						<li>
							<SelectBox label={'계약갱신알림'} placeholder="계약갱신알림 선택" />
						</li>
						<li>
							<InputText label={'계약유의사항'} placeholder="계약유의사항" />
						</li>
						<li>
							<FileUpload label={'첨부파일'} />
						</li>
						<li>
							<InputText label={'비고'} placeholder="비고" />
						</li>
						<li>
							<InputText label={'사이트아이디'} placeholder="사이트아이디" />
						</li>
						<li>
							<InputText label={'사이트번호'} placeholder="사이트번호" />
						</li>
						<li>
							<InputText label={'사이트주소'} placeholder="사이트주소" />
						</li>
						<li>
							<InputText label={'등록자'} placeholder="등록자" />
						</li>
						<li>
							<InputText label={'등록일시'} placeholder="등록일시" />
						</li>
						<li>
							<InputText label={'수정자'} placeholder="수정자" />
						</li>
						<li>
							<InputText label={'수정일지'} placeholder="수정일지" />
						</li>
					</UiDetailViewGroup>
				</UiDetailViewArea>
			</AGrid>

			<AGrid>
				<AUIGrid columnLayout={getGridCol()} gridProps={getGridProps()} />
			</AGrid>
		</>
	);
});

export default pageSample6;
