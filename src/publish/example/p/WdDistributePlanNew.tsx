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
import {
	InputSearch,
	InputText,
	RadioBox,
	Rangepicker,
	SearchFormResponsive,
	SelectBox,
} from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// Store

// API

const WdDistributePlanNew = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const groupRef = useRef<HTMLUListElement>(null);
	const [expanded, setExpanded] = useState(false);

	const { activeKey } = props;
	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
	});

	const radioOpt1 = [
		{
			label: '입고예정',
			value: '1',
		},
		{
			label: '입고예정(츨고전일)',
			value: '2',
		},
		{
			label: '없음',
			value: '3',
		},
	];
	const radioOpt2 = [
		{
			label: '이동중재고(수급센터)',
			value: '1',
		},
		{
			label: '이동중재고(츨고센터)',
			value: '2',
		},
		{
			label: '없음',
			value: '3',
		},
	];
	const radioOpt3 = [
		{
			label: '전체',
			value: '1',
		},
		{
			label: '양산',
			value: '2',
		},
		{
			label: '수도권',
			value: '3',
		},
		{
			label: '장성',
			value: '4',
		},
		{
			label: '제조',
			value: '5',
		},
		{
			label: 'CJL',
			value: '6',
		},
		{
			label: '선마감',
			value: '7',
		},
		{
			label: '본마감',
			value: '8',
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
			<MenuTitle authority="searchYn|saveYn" name={'미출예정확인(New)'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<Rangepicker label={'출고일자'} />
				</li>
				<li>
					<InputText label={'주문번호'} placeholder="주문번호 입력" />
				</li>
				<li style={{ gridColumn: 'span 2' }} className="flex-wrap">
					<InputSearch label={'상품코드'} placeholder="상품코드 검색" />
					<RadioBox options={radioOpt1} />
				</li>
				<li>
					<InputSearch label={'관리처코드'} placeholder="관리처코드 검색" />
				</li>
				<li>
					<SelectBox label={'조정사유'} />
				</li>
				<li>
					<InputSearch label={'수급센터'} placeholder="수급센터 검색" />
				</li>
				<li>
					<InputSearch label={'출고센터'} placeholder="출고센터 검색" />
				</li>
				<li>
					<InputSearch label={'상품유형-1'} placeholder="상품유형-1 검색" />
				</li>
				<li>
					<SelectBox label={'외식전용구분'} />
				</li>
				<li style={{ gridColumn: 'span 2' }} className="flex-wrap">
					<InputSearch label={'수급담당'} placeholder="수급담당 검색" />
					<RadioBox options={radioOpt1} />
				</li>
				<li style={{ gridColumn: 'span 2' }}>
					<RadioBox options={radioOpt3} />
				</li>
			</SearchFormResponsive>

			<Tabs defaultActiveKey="1" className="contain-wrap">
				<TabPane tab="미출예정" key="1">
					<AGrid>
						<AUIGrid columnLayout={getGridCol()} gridProps={getGridProps()} />
					</AGrid>
				</TabPane>
				<TabPane tab="상품별" key="2">
					<AGrid>
						<AUIGrid columnLayout={getGridCol()} gridProps={getGridProps()} />
					</AGrid>
				</TabPane>
			</Tabs>
		</>
	);
});

export default WdDistributePlanNew;
