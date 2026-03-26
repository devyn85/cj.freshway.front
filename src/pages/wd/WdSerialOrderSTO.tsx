/*
 ############################################################################
 # FiledataField	: WdSerialOrderSTO.tsx
 # Description		: 이력STO출고처리
 # Author			: 공두경
 # Since			: 25.08.29
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetTab1MasterList, apiGetTab2MasterList } from '@/api/wd/apiWdSerialOrderSTO';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdSerialOrderSTOSearch from '@/components/wd/serialOrderSTO/WdSerialOrderSTOSearch';
import WdSerialOrderSTOTap1Detail from '@/components/wd/serialOrderSTO/WdSerialOrderSTOTap1Detail';
import WdSerialOrderSTOTap2Detail from '@/components/wd/serialOrderSTO/WdSerialOrderSTOTap2Detail';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

//Util
import TabsArray from '@/components/common/TabsArray';
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const WdSerialOrderSTO = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');
	const [activeKey, setActiveKey] = useState('1');
	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);

	const refs: any = useRef(null);
	const refs2: any = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		ordertype: null,
		skugroup: null,
		storagetype: null,
	});

	const searchMasterList = () => {
		const params = form.getFieldsValue();

		if (commUtil.isNull(params.slipdtRange)) {
			showAlert('', '출고일자를 선택해주세요.');
			return;
		}
		if (commUtil.isNull(params.slipdtRange[0]) || commUtil.isNull(params.slipdtRange[1])) {
			showAlert('', '출고일자를 선택해주세요.');
			return;
		}
		params.fromSlipdt = params.slipdtRange[0].format('YYYYMMDD');
		params.toSlipdt = params.slipdtRange[1].format('YYYYMMDD');

		if (activeKeyMaster === '1') {
			// 조회생성
			apiGetTab1MasterList(params).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		} else if (activeKeyMaster === '2') {
			// 진행현황
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
	const tabClick = (key: string) => {
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
			if (refs2.gridRef2.current) {
				refs2.gridRef2.current?.resize('100%', '100%');
			}
			if (refs2.gridRef3.current) {
				refs2.gridRef3.current?.resize('100%', '100%');
			}
		}
		return;
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: 'STO생성',
			children: (
				<WdSerialOrderSTOTap1Detail
					key="WdSerialOrderSTOTap1Detail"
					ref={refs}
					form={form}
					data={gridData}
					totalCnt={totalCnt}
					search={searchMasterList}
				/>
			),
		},
		{
			key: '2',
			label: 'STO출고확정',
			children: (
				<WdSerialOrderSTOTap2Detail
					key="WdSerialOrderSTOTap2Detail"
					ref={refs2}
					form={form}
					data={gridData2}
					totalCnt={totalCnt2}
					search={searchMasterList}
				/>
			),
		},
	];
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdSerialOrderSTOSearch ref={refs} search={searchMasterList} form={form} activeKey={activeKeyMaster} />
			</SearchFormResponsive>
			<TabsArray activeKey={activeKeyMaster} onChange={tabClick} items={tabItems} />
		</>
	);
};

export default WdSerialOrderSTO;
