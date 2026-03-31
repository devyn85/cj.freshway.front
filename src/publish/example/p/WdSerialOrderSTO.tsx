// CSS
// Lib
import { Form } from 'antd';
import { Tabs } from 'antd/lib';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Util
// Type
// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
// Store
// API
// import { apiGetDataHeaderList, apiGetDataHeaderList1 } from '@/api/rt/apiWdSerialOrderSTO';
// import WdSerialOrderSTODetailMaster from '@/components/rt/receiptConfirmExDC/WdSerialOrderSTODetailMaster';
// import WdSerialOrderSTODetailMasterSub from '@/components/rt/receiptConfirmExDC/WdSerialOrderSTODetailMasterSub';
// import WdSerialOrderSTOSearch from '@/components/wd/serialOrderSTO/serialOrderSTOSearch';
// import WdSerialOrderSTODetail from '@/components/wd/serialOrderSTO/WdSerialOrderSTODetail';

const WdSerialOrderSTO = () => {
	// =====================================================================
	//  01. 변수 선언부
	// =====================================================================
	const refs: any = useRef(null);
	const refs1: any = useRef(null);
	const isFirstRender = useRef(true);
	const { t } = useTranslation();

	const [activeTabKey, setActiveTabKey] = useState('1');
	const [searchForm] = Form.useForm();

	const searchRef = useRef(null);

	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	const [gridData1, setGridData1] = useState([]);
	const [totalCnt1, setTotalCnt1] = useState(0);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		slipdtRange: [dayjs(), dayjs()],
		returnType: null,
		channel: null,
		serialYn: null,
		status: null,
	});

	// =====================================================================
	//  02. 함수
	// =====================================================================

	/**
	 * 검색 로직
	 * @returns
	 */
	// const searchMasterList = async () => {
	// 	const params = searchForm.getFieldsValue();
	// 	//console.log(params);
	// 	const isValid = await validateForm(searchForm);
	// 	if (!isValid) {
	// 		return;
	// 	}
	// 	const searchVal = {
	// 		...params,
	// 		slipdtFrom: params.slipdtRange[0].format('YYYYMMDD'),
	// 		slipdtTo: params.slipdtRange[1].format('YYYYMMDD'),
	// 	};

	// 	if (activeTabKey === '1') {
	// 		apiGetDataHeaderList(searchVal).then(res => {
	// 			setGridData(res.data);
	// 			setTotalCnt(res.totalCnt);
	// 		});
	// 	} else if (activeTabKey === '2') {
	// 		apiGetDataHeaderList1(searchVal).then(res => {
	// 			setGridData1(res.data);
	// 			setTotalCnt1(res.totalCnt);
	// 		});
	// 	}
	// };

	/**
	 * 버튼 설정
	//
	 */
	// const titleFunc = {
	// 	searchYn: searchMasterList,
	// };

	/**
	 * 탭 설정
	 */
	// const tabs = [
	// 	{
	// 		key: '1',
	// 		label: '입고내역',
	// 		children: (
	// 			<WdSerialOrderSTODetailMaster
	// 				ref={refs}
	// 				data={gridData}
	// 				totalCnt={totalCnt}
	// 				form={searchForm}
	// 				callback={searchMasterList}
	// 			/>
	// 		),
	// 	},
	// 	{
	// 		key: '2',
	// 		label: '출고내역',
	// 		children: (
	// 			<WdSerialOrderSTODetailMasterSub
	// 				ref={refs1}
	// 				data={gridData1}
	// 				totalCnt={totalCnt1}
	// 				form={searchForm}
	// 				callback={searchMasterList}
	// 			/>
	// 		),
	// 	},
	// ];
	// =====================================================================
	//  03. react hook event
	//  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	// =====================================================================

	/**
	 * 탭 내의 그리드 사이즈 초기화
	 */
	useEffect(() => {
		refs.gridRef?.current.resize(); // 그리드 크기 조정
	});

	/**
	 * 탭 변경시 조회
	 */
	useEffect(() => {
		// init시에는 검색 X...?
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		searchMasterList();
	}, [activeTabKey]);
	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn" name={'이력STO출고처리'} />

			{/* 검색 영역 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				{/* <WdSerialOrderSTOSearch ref={searchRef} search={searchMasterList} form={searchForm} /> */}
			</SearchFormResponsive>
			<Tabs items={tabs} activeKey={activeTabKey} onChange={setActiveTabKey} />
		</>
	);
};

export default WdSerialOrderSTO;
