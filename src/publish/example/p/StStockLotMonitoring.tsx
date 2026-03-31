// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form, Tabs } from 'antd';

// Util

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import { InputRange, InputSearch, InputText, SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// Store

// API

const StStockLotMonitoring = forwardRef((props: any, gridRef: any) => {
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

	const refs1: any = useRef(null);
	const refs2: any = useRef(null);
	const refs3: any = useRef(null);
	const [activeTabKey, setActiveTabKey] = useState('1');

	/**
	 * 그리드 컬럼을 설정한다.
	 * @returns {object[]} 그리드 컬럼 설정 객체
	 */
	const getGridCol1 = () => {
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
				headerText: '재고위치',
			},
			{
				headerText: '재고속성',
			},
			{
				headerText: '피킹존',
			},
			{
				headerText: '로케이션',
			},
			{
				headerText: '상품코드',
			},
			{
				headerText: '상품명칭',
			},
			{
				headerText: '저장조건',
			},
			{
				headerText: '박스입수',
			},
			{
				headerText: '재고정보',
				children: [
					{
						headerText: '단위',
					},
					{
						headerText: '현재고수량',
					},
				],
			},
			{
				headerText: '유통기한임박여부',
			},
			{
				headerText: '기준일(유통,제조)',
			},
			{
				headerText: '기준일(구분)',
			},
			{
				headerText: '유통기간(잔여/전체)',
			},
			{
				headerText: '유통기한 잔여(%)',
			},
			{
				headerText: '유통기한 잔여(구분)',
			},
			{
				headerText: '수급 담당',
			},
			{
				headerText: '주문량(월)',
				children: [
					{
						headerText: 'D-1월',
					},
					{
						headerText: 'D-2월',
					},
					{
						headerText: 'D-3월',
					},
				],
			},
			{
				headerText: '주문건수(월)',
				children: [
					{
						headerText: 'D-1월',
					},
					{
						headerText: 'D-2월',
					},
					{
						headerText: 'D-3월',
					},
				],
			},
			{
				headerText: '출고량',
				children: [
					{
						headerText: 'D-1월',
					},
					{
						headerText: 'D-2월',
					},
					{
						headerText: 'D-3월',
					},
				],
			},
			{
				headerText: '일평균',
			},
			{
				headerText: '소진예상시점',
			},
			{
				headerText: '소진가능여부',
			},
		];
	};
	const getGridCol2 = () => {
		return [
			{
				headerText: '구분',
			},
			{
				headerText: '잔여 소비기한(전용/범용)',
			},
			{
				headerText: '소비기한 도래 SKU 잔여 소비기한',
				children: [
					{
						headerText: '5월',
					},
					{
						headerText: '6월',
					},
					{
						headerText: '7월',
					},
					{
						headerText: '8월',
					},
					{
						headerText: '9월',
					},
				],
			},
		];
	};
	const getGridCol3 = () => {
		return [
			{
				headerText: '구분',
			},
			{
				headerText: '잔여 소비기한(전용/범용)',
			},
			{
				headerText: '소비기한 도래 SKU 수',
				children: [
					{
						headerText: '5월',
					},
					{
						headerText: '6월',
					},
					{
						headerText: '7월',
					},
					{
						headerText: '8월',
					},
					{
						headerText: '9월',
					},
				],
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
	const getGridProps3 = () => {
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
		btnArr: [],
	};

	// 탭 아이템 영역
	const tabs = [
		{
			key: '1',
			label: '상품별',
			children: (
				<>
					<AGrid>
						<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={120}>
							<Form className="flex-wrap">
								<Button htmlType="submit">상품별 합계</Button>
								<Button htmlType="submit" className="ml5">
									로케이션/상품별 합계
								</Button>
							</Form>
						</GridTopBtn>
						<AUIGrid ref={refs1.gridRef} columnLayout={getGridCol1()} gridProps={getGridProps1()} />
					</AGrid>
				</>
			),
		},
		{
			key: '2',
			label: '요약(소비기한)',
			children: (
				<>
					<AGrid>
						<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={120} />
						<AUIGrid ref={refs2.gridRef} columnLayout={getGridCol2()} gridProps={getGridProps2()} />
					</AGrid>
				</>
			),
		},
		{
			key: '3',
			label: '요약(저장조건)',
			children: (
				<>
					<AGrid>
						<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={120} />
						<AUIGrid ref={refs3.gridRef} columnLayout={getGridCol3()} gridProps={getGridProps3()} />
					</AGrid>
				</>
			),
		},
	];

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string, e: any) => {
		if (key === '1') {
			setActiveTabKey('1');
			if (refs1.gridRef.current) {
				refs1.gridRef.current.resize('100%', '100%');
			}
		} else if (key === '2') {
			setActiveTabKey('2');
			if (refs2.gridRef.current) {
				refs2.gridRef.current.resize('100%', '100%');
			}
		} else if (key === '3') {
			setActiveTabKey('3');
			if (refs3.gridRef.current) {
				refs3.gridRef.current.resize('100%', '100%');
			}
		}
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
			<MenuTitle authority="searchYn|saveYn" name={'유통기한점검'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<SelectBox label={'물류센터'} />
				</li>
				<li>
					<InputSearch label={'창고'} placeholder="창고 선택" />
				</li>
				<li>
					<SelectBox label={'정렬순서'} />
				</li>
				<li>
					<InputSearch label={'상품코드'} placeholder="상품코드 선택" />
				</li>
				<li>
					<SelectBox label={'저장조건'} />
				</li>
				<li>
					<SelectBox label={'유통기한여부'} />
				</li>
				<li>
					<SelectBox label={'재고위치'} />
				</li>
				<li>
					<SelectBox label={'재고속성'} />
				</li>
				<li>
					<InputText label={'이력번호'} placeholder="이력번호 선택" />
				</li>
				<li>
					<InputSearch label={'피킹존'} placeholder="피킹존 선택" />
				</li>
				<li>
					<SelectBox label={'로케이션종류'} />
				</li>
				<li>
					<InputText label={'기준일(유통,제조)'} placeholder="기준일(유통,제조) 검색" />
				</li>
				<li>
					<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromloc" toName="toloc" />
				</li>
			</SearchFormResponsive>

			<Tabs items={tabs} activeKey={activeTabKey} onTabClick={tabClick} className="contain-wrap" />
		</>
	);
});

export default StStockLotMonitoring;
