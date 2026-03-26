/*
 ############################################################################
 # FiledataField	: WdTaskSkuSku.tsx
 # Description		: 피킹작업지시(상품별)
 # Author			: 공두경
 # Since			: 25.09.29
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/wd/apiWdTaskSku';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdTaskSkuDetail from '@/components/wd/taskSku/WdTaskSkuDetail';
import WdTaskSkuSearch from '@/components/wd/taskSku/WdTaskSkuSearch';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const WdTaskSku = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');
	const [activeKey, setActiveKey] = useState('1');
	const [totalCnt, setTotalCnt] = useState(0);

	const refs: any = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		tasksystem: null,
		storagetype: null,
		printorder: 'LOCXSKU',
		printpickinglist: 'PICKINGLIST2600',
	});

	const searchMasterList = () => {
		const params = form.getFieldsValue();

		if (commUtil.isNull(params.searchDate)) {
			showAlert('', '작업지시일자를 선택해주세요.');
			return;
		}

		params.taskdt = params.searchDate.format('YYYYMMDD');

		// 조회생성
		apiGetMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdTaskSkuSearch ref={refs} search={searchMasterList} form={form} activeKey={activeKeyMaster} />
			</SearchFormResponsive>
			<WdTaskSkuDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} search={searchMasterList} />
		</>
	);
};

export default WdTaskSku;
