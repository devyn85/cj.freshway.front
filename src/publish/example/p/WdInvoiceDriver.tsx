// CSS

// Lib
import { Button, Form, Tabs } from 'antd';
const { TabPane } = Tabs;

// Util

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import { CheckBox, Datepicker, InputSearch, RadioBox, SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// Store

// API

const WdInvoiceDriver = forwardRef((props: any, gridRef: any) => {
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
			label: '초도배송고객',
			value: '1',
		},
		{
			label: '전체고객',
			value: '2',
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
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn|saveYn" name={'납품서출력(배송기사용)'} />
			<div className="wd-drive">
				<div className="info">
					<h2>차량번호 발행 버튼을 클릭하세요</h2>
					<p>미상차 및 결품건이 있을 경우 발행이 불가하오니 사전에 상차 내역을 확인하세요.</p>
				</div>
				<SearchFormResponsive form={form} initialValues={searchBox}>
					<li style={{ gridColumn: 'span 4' }}>
						<span>
							<Datepicker label={'납품일자'} />
							<CheckBox>하계용납품서</CheckBox>
							<Button type="default" className={'sp-mr-1'}>
								납품서
							</Button>
							<Button type="default">출고지</Button>
						</span>
					</li>
					<li style={{ gridColumn: 'span 4' }}>
						<InputSearch label={'차량번호'} placeholder="차량번호 검색" />
					</li>
					<li style={{ gridColumn: 'span 4' }}>
						<RadioBox label={'초도배송정보'} options={radioOpt1} />
					</li>
				</SearchFormResponsive>
			</div>
		</>
	);
});

export default WdInvoiceDriver;
