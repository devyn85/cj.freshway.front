/*
 ############################################################################
 # FiledataField	: KpWdRequestCancelqty.tsx
 # Description		: 결품대응현황
 # Author			: 공두경
 # Since			: 25.08.07
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetTab1MasterList, apiGetTab2MasterList, apiGetTab3MasterList } from '@/api/kp/apiKpWdRequestCancelqty';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import KpWdRequestCancelqtySearch from '@/components/kp/wdRequestCancelqty/KpWdRequestCancelqtySearch';
import KpWdRequestCancelqtyTab1Detail from '@/components/kp/wdRequestCancelqty/KpWdRequestCancelqtyTab1Detail';
import KpWdRequestCancelqtyTab2Detail from '@/components/kp/wdRequestCancelqty/KpWdRequestCancelqtyTab2Detail';
import { useAppSelector } from '@/store/core/coreHook';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const KpWdRequestCancelqty = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');
	const [activeKey, setActiveKey] = useState('1');
	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [totalCnt3, setTotalCnt3] = useState(0);
	const [detailForm] = Form.useForm();
	const refs: any = useRef(null);
	const refs2: any = useRef(null);
	const refs3: any = useRef(null);
	const [selectedDateRange, setSelectedDateRange] = useState(null);
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		dccode: null,
		ordertype: null,
		status: null,
		skugroup: null,
		storagetype: null,
	});

	const searchMasterList = () => {
		//refs.gridRef.current.clearGridData();
		// setIsDisabled(true);
		const params = form.getFieldsValue();

		if (commUtil.isNull(params.slipdtRange)) {
			showAlert('', '출고일자를 선택해주세요.');
			return;
		}
		if (commUtil.isNull(params.slipdtRange[0]) || commUtil.isNull(params.slipdtRange[1])) {
			showAlert('', '출고일자를 선택해주세요.');
			return;
		}
		params.fromDeliverydt = params.slipdtRange[0].format('YYYYMMDD');
		params.toDeliverydt = params.slipdtRange[1].format('YYYYMMDD');

		if (activeKeyMaster === '1') {
			apiGetTab1MasterList(params).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		} else if (activeKeyMaster === '2') {
			apiGetTab2MasterList(params).then(res => {
				setGridData2(res.data);
				setTotalCnt2(res.data.length);
			});
		} else if (activeKeyMaster === '3') {
			apiGetTab3MasterList(params).then(res => {
				setGridData3(res.data);
				setTotalCnt3(res.data.length);
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
		} else if (key === '3') {
			setActiveKeyMaster('3');
			if (refs3.gridRef.current) {
				refs3.gridRef.current?.resize('100%', '100%');
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
				<KpWdRequestCancelqtySearch ref={refs} search={searchMasterList} form={form} activeKey={activeKeyMaster} />
			</SearchFormResponsive>
			<Tabs activeKey={activeKeyMaster} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="결품대응현황" key="1">
					<KpWdRequestCancelqtyTab1Detail
						ref={refs}
						form={form}
						data={gridData}
						totalCnt={totalCnt}
						search={searchMasterList}
					/>
				</TabPane>
				<TabPane tab="분류피킹(출고센터)" key="2">
					<KpWdRequestCancelqtyTab2Detail
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

export default KpWdRequestCancelqty;
