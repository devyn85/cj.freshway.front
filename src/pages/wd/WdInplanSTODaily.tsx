/*
 ############################################################################
 # FiledataField	: WdInplanSTODaily.tsx
 # Description		: 광역일배검수현황
 # Author			: 공두경
 # Since			: 25.11.29
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/wd/apiWdInplanSTODaily';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdInplanSTODailyDetail from '@/components/wd/inplanSTODaily/WdInplanSTODailyDetail';
import WdInplanSTODailySearch from '@/components/wd/inplanSTODaily/WdInplanSTODailySearch';

//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const WdInplanSTODaily = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
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
		params.fromDccode = [].concat(params.fromDccode).join(',');
		params.toDccode = [].concat(params.toDccode).join(',');
		params.fromCustkey = [].concat(params.fromCustkey).join(',');
		params.toCustkey = [].concat(params.toCustkey).join(',');
		params.sku = [].concat(params.sku).join(',');

		if (commUtil.isNull(params.slipdtRange)) {
			showAlert('', '광역출고일자를 선택해주세요.');
			return;
		}
		if (commUtil.isNull(params.slipdtRange[0]) || commUtil.isNull(params.slipdtRange[1])) {
			showAlert('', '광역출고일자를 선택해주세요.');
			return;
		}
		params.fromSlipdt = params.slipdtRange[0].format('YYYYMMDD');
		params.toSlipdt = params.slipdtRange[1].format('YYYYMMDD');

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
				<WdInplanSTODailySearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<WdInplanSTODailyDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} search={searchMasterList} />
		</>
	);
};

export default WdInplanSTODaily;
