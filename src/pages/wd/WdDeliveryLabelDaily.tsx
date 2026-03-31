/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelDaily.tsx
 # Description		: 일배분류서출력
 # Author			: 공두경
 # Since			: 26.02.19
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetTab1MasterList, apiGetTab2MasterList } from '@/api/wd/apiWdDeliveryLabelDaily';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdDeliveryLabelDailySearch from '@/components/wd/deliveryLabelDaily/WdDeliveryLabelDailySearch';
import WdDeliveryLabelDailyTap1Detail from '@/components/wd/deliveryLabelDaily/WdDeliveryLabelDailyTap1Detail';
import WdDeliveryLabelDailyTap2Detail from '@/components/wd/deliveryLabelDaily/WdDeliveryLabelDailyTap2Detail';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
const WdDeliveryLabel = () => {
	// 다국어
	const { t } = useTranslation();

	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');
	const [activeKey, setActiveKey] = useState('1');
	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);

	const refs: any = useRef(null);
	const refs2: any = useRef(null);

	const [searchBox] = useState({
		pickingMethod: null,
		ordertype: null,
		skugroup: null,
		crossDc: '',
		printmethod: 'NEW',
		crossdocktype: null,
		reporttype: '0',
		storagetype: null,
		distancetype: null,
		searchtype: '0',
	});

	const searchMasterList = () => {
		let params = form.getFieldsValue();

		if (commUtil.isNull(params.searchDate)) {
			showAlert('', '납품일자를 선택해주세요.');
			return;
		}
		params.slipdt = params.searchDate.format('YYYYMMDD');

		params = {
			...params,
			toCustkey: commUtil.nvl(form.getFieldValue('toCustkey'), []).toString(),
			carno: commUtil.nvl(form.getFieldValue('carno'), []).toString(),
		};

		if (activeKeyMaster === '1') {
			apiGetTab1MasterList(params).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		} else if (activeKeyMaster === '2') {
			// 광역일배
			// 조회생성(일반)
			apiGetTab2MasterList(params).then(res => {
				setGridData2(res.data);
				setTotalCnt2(res.data.length);
			});
		}
	};

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const [dates, setDates] = useState(dayjs());
	const tabClick = (key: string, e: any) => {
		if (key === '1') {
			setActiveKeyMaster('1');
			if (refs.gridRef?.current) {
				refs.gridRef.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			setActiveKeyMaster('2');
			if (refs2.gridRef?.current) {
				refs2.gridRef.current?.resize('100%', '100%');
			}
		}
		return;
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdDeliveryLabelDailySearch
					ref={refs}
					search={searchMasterList}
					form={form}
					dates={dates}
					setDates={setDates}
					activeKey={activeKeyMaster}
				/>
			</SearchFormResponsive>
			<Tabs activeKey={activeKeyMaster} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="일배" key="1">
					<WdDeliveryLabelDailyTap1Detail
						ref={refs}
						form={form}
						data={gridData}
						totalCnt={totalCnt}
						search={searchMasterList}
					/>
				</TabPane>
				<TabPane tab="광역일배" key="2">
					<WdDeliveryLabelDailyTap2Detail
						ref={refs2}
						form={form}
						data={gridData2}
						totalCnt={totalCnt2}
						search={searchMasterList}
					/>
				</TabPane>
			</Tabs>
		</>
	);
};

export default WdDeliveryLabel;
