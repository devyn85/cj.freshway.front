// CSS
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form, Tabs } from 'antd';
const { TabPane } = Tabs;

// Util

// Type

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdDistributePlanNewSearch from '@/components/wd/distributePlanNew/WdDistributePlanNewSearch';
import WdDistributePlanNewTab1 from '@/components/wd/distributePlanNew/WdDistributePlanNewTab1';
import WdDistributePlanNewTab2 from '@/components/wd/distributePlanNew/WdDistributePlanNewTab2';
import dayjs from 'dayjs';

// Store

// API
import { getMasterListTab1, getMasterListTab2 } from '@/api/wd/apiWdDistributePlanNew';

const WdDistributePlanNew = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();

	// 그리드 접근을 위한 Ref Tab 순서대로
	const gridRef1 = useRef(null);
	const gridRef2 = useRef(null);

	// grid 데이터 (Tab1, Tab2)
	const [gridData1, setGridData1] = useState([]);
	const [gridData2, setGridData2] = useState([]);

	// 조회 초기 건수 (Tab1, Tab2)
	const [totalCount1, setTotalCount1] = useState(0);
	const [totalCount2, setTotalCount2] = useState(0);

	// 현재 탭 정보
	const [activeTabKey, setActiveTabKey] = useState('1');

	//검색영역 초기 세팅
	const [searchBox] = useState({
		// 금일, 익일로 변경
		slipdtWd: [dayjs(), dayjs().add(1, 'day')], // 출고전표일자(slipdtFrom, slipdtTo)
		docnoWd: '', // 주문번호
		sku: '', // 상품코드

		/**
		 * 상단 라디오 (입고예정, 입고예정(출고전일), 없음)
		 *
		 */
		chkyn: '1',

		toCustkeyWd: '', // 관리처코드
		reason: null, // 조정사유
		poDccode: null, // 수급센터
		soDccode: null, // 출고센터
		skutype: null, // 상품유형-1
		reference15: null, // 외식전용구분
		// pomdcode: null, // 수급담당
		buyerkey: null, // 수급담당

		/**
		 * 중단 라디오 (이동중재고(수급센터), 이동중재고(출고센터), 없음)
		 */
		stochkyn: '1',

		/**
		 * 하단 라디오 (전체, 양산, 수도권, 장성, 제조, CJL, 선마감, 본마감)
		 */
		quick: '',
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const titleFunc = {
		searchYn: () => {
			if (activeTabKey === '1') {
				runGetMasterListTab1();
			} else if (activeTabKey === '2') {
				runGetMasterListTab2();
			}
		},
	};

	const runGetMasterListTab1 = async () => {
		try {
			const params = form.getFieldsValue();

			params.slipdtFrom = params.slipdtWd[0].format('YYYYMMDD'); // 조회 시작일
			params.slipdtTo = params.slipdtWd[1].format('YYYYMMDD'); // 조회 종료일
			params.multiSku = params.sku ? params.sku.split(',') : null;

			// pre-scan: 2/3/4/5 기존 + 7(선마감:2+3 결합) + 8(본마감:1~6 결합)
			if (['2', '3', '4', '5', '7', '8'].includes(params.quick)) {
				const preParams: any = {
					slipdtFrom: params.slipdtFrom,
					slipdtTo: params.slipdtTo,
					chkyn: params.chkyn,
					stochkyn: params.stochkyn,
					quick: params.quick,
					poDccode: params.poDccode,
					soDccode: params.soDccode,
				};

				// 상품코드 조회해서 추가되기때문에 조회 조건과 동일하게 조회되지 않음..히스토리를 몰라 일단 주석처리
				// const pre = await getMasterListTab1WithCondition(preParams);

				// const list = pre?.data || pre || [];
				// // SKU 중복 제거
				// const skuSet = new Set<string>();
				// (list || []).forEach((r: any) => {
				// 	const v = r?.sku || r?.SKU;
				// 	if (v) skuSet.add(String(v));
				// });
				// params.multiSku = Array.from(skuSet);
			}
			// params.poDccode = params.poDccode ? String(params.poDccode) : null;
			// params.soDccode = params.soDccode ? String(params.soDccode) : null;

			// poDccode, soDccode가 배열이 아니면 배열로 변환
			params.poDccode = params.poDccode
				? Array.isArray(params.poDccode)
					? params.poDccode
					: [String(params.poDccode)]
				: null;
			params.soDccode = params.soDccode
				? Array.isArray(params.soDccode)
					? params.soDccode
					: [String(params.soDccode)]
				: null;

			const res = await getMasterListTab1(params);

			setGridData1(res?.data || res || []);
			setTotalCount1(res?.data?.length || res?.length || 0);
		} catch (error) {}
	};

	const runGetMasterListTab2 = async () => {
		try {
			const params = form.getFieldsValue();

			params.slipdtFrom = params.slipdtWd[0].format('YYYYMMDD'); // 조회 시작일
			params.slipdtTo = params.slipdtWd[1].format('YYYYMMDD'); // 조회 종료일
			// params.poDccode = params.poDccode ? String(params.poDccode) : null;
			// params.soDccode = params.soDccode ? String(params.soDccode) : null;
			// poDccode, soDccode가 배열이 아니면 배열로 변환
			params.poDccode = params.poDccode
				? Array.isArray(params.poDccode)
					? params.poDccode
					: [String(params.poDccode)]
				: null;
			params.soDccode = params.soDccode
				? Array.isArray(params.soDccode)
					? params.soDccode
					: [String(params.soDccode)]
				: null;

			params.multiSku = params.sku ? params.sku.split(',') : null;

			const res = await getMasterListTab2(params);

			setGridData2(res?.data || res || []);
			setTotalCount2(res?.data?.length || res?.length || 0);
		} catch (error) {}
	};

	/**
	 * 탭 클릭
	 * @param {string} key 탭 키
	 */
	const tabClick = (key: string) => {
		setActiveTabKey(key);
		if (key === '1') {
			gridRef1?.current?.resize('100%', '100%');
		} else {
			gridRef2?.current?.resize('100%', '100%');
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
			<MenuTitle func={titleFunc} authority="searchYn|saveYn" />

			<SearchFormResponsive form={form} initialValues={searchBox} initialExpanded={true}>
				<WdDistributePlanNewSearch form={form} activeKey={activeTabKey} />
			</SearchFormResponsive>

			<Tabs defaultActiveKey="1" onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="미출예정" key="1">
					<WdDistributePlanNewTab1 gridRef={gridRef1} form={form} data={gridData1} totalCnt={totalCount1} />
				</TabPane>
				<TabPane tab="상품별" key="2">
					<WdDistributePlanNewTab2 gridRef={gridRef2} form={form} data={gridData2} totalCnt={totalCount2} />
				</TabPane>
			</Tabs>
		</>
	);
});

export default WdDistributePlanNew;
