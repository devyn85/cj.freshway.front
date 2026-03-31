// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Col, Form, Row, Tabs } from 'antd';
const { TabPane } = Tabs;

// Util

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputSearch, SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// Store

// API

const OmPurchaseMonitoring = forwardRef((props: any, gridRef: any) => {
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

	const radioBasicOptions = [
		{ label: '전체', value: 'BBS_TP' },
		{
			label: 'CRM',
			value: '',
		},
		{
			label: 'WMS',
			value: '',
		},
	];

	const refs1: any = useRef(null);
	const refs2: any = useRef(null);
	const [activeTabKey, setActiveTabKey] = useState('1');
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
				headerText: '입고예정일',
			},
			{
				headerText: '입고센터',
			},
			{
				headerText: '수급담당',
			},
			{
				headerText: '협력사코드',
			},
			{
				headerText: '협력사명',
			},
			{
				headerText: '상품코드',
			},
			{
				headerText: '상품명',
			},
			{
				headerText: '입고업체수',
			},
			{
				headerText: '상품수',
			},
			{
				headerText: '입고물량(TON)',
			},
			{
				headerText: '입고물량(PLT)',
			},
		];
	};
	const getGridCol1 = () => {
		return [
			{
				dataField: 'empNo',
				headerText: '순번',
			},
			{
				headerText: '입고센터',
			},
			{
				headerText: '입고일자',
				children: [
					{
						headerText: '이천',
					},
					{
						headerText: '수원',
					},
					{
						headerText: '수원2',
					},
					{
						headerText: '동탄',
					},
					{
						headerText: '동탄2',
					},
					{
						headerText: '양산',
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
					btnType: 'save', // 저장
				},
			],
		};

		return gridBtn;
	};

	// 표 버튼 설정
	const tableBtn: TableBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
			},
		],
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: () => {
			if (activeTabKey === '1') {
				return searchMaterList1();
			} else if (activeTabKey === '2') {
				return searchMaterList2();
			}
		},
	};
	// 탭 아이템 영역
	const tabs = [
		{
			key: '1',
			label: 'PO 발주현황',
			children: (
				<>
					<AGrid className="h100">
						<GridTopBtn gridTitle={'PO 저장품 발주 목록'} gridBtn={getGridBtn()} />
						<AUIGrid ref={refs1} columnLayout={getGridCol()} gridProps={getGridProps()} />
					</AGrid>
				</>
			),
		},
		{
			key: '2',
			label: '발주추이',
			children: (
				<Row gutter={8} className="h100">
					<Col span={12}>
						<AGrid className="h100">
							<GridTopBtn gridTitle={'처리이력 목록'} gridBtn={getGridBtn()} />
							<AUIGrid ref={refs2} columnLayout={getGridCol1()} gridProps={getGridProps()} />
						</AGrid>
					</Col>
					<Col span={12}>
						<AGrid className="h100">
							<div>chart 영역</div>
						</AGrid>
					</Col>
				</Row>
			),
		},
	];

	const tabClick = (key: string, e: any) => {
		if (key === '1') {
			setActiveTabKey('1');
			if (refs1.gridRef.current) {
				refs1.gridRef.current?.resize('100%', '100%');
			}
			if (refs1.gridRef2.current) {
				refs1.gridRef2.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			setActiveTabKey('2');
			if (refs2.gridRef.current) {
				refs2.gridRef.current?.resize('100%', '100%');
			}
			if (refs2.gridRef2.current) {
				refs2.gridRef2.current?.resize('100%', '100%');
			}
		}
		return;
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
			<MenuTitle func={titleFunc} name={'저장품자동발주현황'} />

			{activeTabKey === '1' && (
				<SearchFormResponsive form={form} initialValues={searchBox}>
					<li>
						<CmPartnerSearch form={form} name="fromcustkeyNm" code="fromcustkey" label={t('협력사코드')} />
					</li>
					<li>
						<Rangepicker label="입고일자" />
					</li>
					<li>
						<CmGMultiDccodeSelectBox
							name="multiDcCode"
							placeholder="선택해주세요"
							fieldNames={{ label: 'dcname', value: 'dccode' }}
							mode="multiple"
							label={'입고센터'}
						/>
					</li>
					<li>
						<SelectBox label="수급담당" />
					</li>
					<li>
						<SelectBox label="차량조건" />
					</li>
					<li>
						<InputSearch label="상품코드" />
					</li>
					<li>
						<SelectBox label="발주구분" />
					</li>
					<li>
						<SelectBox label="단계" />
					</li>
				</SearchFormResponsive>
			)}
			{activeTabKey === '2' && (
				<SearchFormResponsive form={form} initialValues={searchBox}>
					<li>
						<DateRange label="입고일자" />
					</li>
					<li>
						<SelectBox label="수급담당" />
					</li>
					<li>
						<SelectBox label="입고센터" />
					</li>
					<li>
						<SelectBox label="저장조건" />
					</li>
					<li>
						<SelectBox label="발주구분" />
					</li>
				</SearchFormResponsive>
			)}

			<Tabs items={tabs} activeKey={activeTabKey} onTabClick={tabClick} className="contain-wrap" />
		</>
	);
});

export default OmPurchaseMonitoring;
