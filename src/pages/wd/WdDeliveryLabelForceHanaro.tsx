/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelForceHanaro.tsx
 # Description		: 이력피킹현황
 # Author			: 공두경
 # Since			: 25.07.14
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetTab1MasterList, apiGetTab2MasterList } from '@/api/wd/apiWdDeliveryLabelForceHanaro';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdDeliveryLabelForceCoupangDetail from '@/components/wd/deliveryLabelForceHanaro/WdDeliveryLabelForceCoupangDetail';
import WdDeliveryLabelForceHanaroDetail from '@/components/wd/deliveryLabelForceHanaro/WdDeliveryLabelForceHanaroDetail';
import WdDeliveryLabelForceHanaroSearch from '@/components/wd/deliveryLabelForceHanaro/WdDeliveryLabelForceHanaroSearch';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const WdInplanSN = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');
	const refs: any = useRef(null);
	const refs2: any = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		ordertype: null,
		crossdc: null,
		tasksystem: null,
		printorder: null,
		skugroup: null,
		storagetype: null,
		crossdocktype: null,
		printmethod: 'NEW',
	});

	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();
		// setIsDisabled(true);
		const params = form.getFieldsValue();

		if (commUtil.isNull(params.secrchDate)) {
			showAlert('', '출고일자를 선택해주세요.');
			return;
		}
		params.taskdt = params.secrchDate.format('YYYYMMDD');

		if (activeKeyMaster === '1') {
			// 하나로
			apiGetTab1MasterList(params).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		} else if (activeKeyMaster === '2') {
			// 쿠팡
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
	const tabClick = (key: string, e: any) => {
		if (key === '1') {
			setActiveKeyMaster('1');
			if (refs.gridRef.current) {
				refs.gridRef.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			setActiveKeyMaster('2');
			if (refs2.gridRef.current) {
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
				<WdDeliveryLabelForceHanaroSearch
					ref={refs}
					search={searchMasterList}
					form={form}
					activeKey={activeKeyMaster}
				/>
			</SearchFormResponsive>
			<Tabs activeKey={activeKeyMaster} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="하나로" key="1">
					<WdDeliveryLabelForceHanaroDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
				</TabPane>
				<TabPane tab="쿠팡" key="2">
					<WdDeliveryLabelForceCoupangDetail ref={refs2} form={form} data={gridData2} totalCnt={totalCnt2} />
				</TabPane>
			</Tabs>
		</>
	);
};

export default WdInplanSN;
