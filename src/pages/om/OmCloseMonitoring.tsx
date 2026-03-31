/*
 ############################################################################
 # FiledataField	: OmCloseMonitoring.tsx
 # Description		: 마감주문반영
 # Author			: 공두경
 # Since			: 25.06.23
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/om/apiOmCloseMonitoring';
//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import OmCloseMonitoringDetail from '@/components/om/closeMonitoring/OmCloseMonitoringDetail';
import OmCloseMonitoringSearch from '@/components/om/closeMonitoring/OmCloseMonitoringSearch';

//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const OmCloseMonitoring = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const refs: any = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		serialyn: null,
		closetimeStandard: null,
		closetime: null,
	});

	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();

		const params = form.getFieldsValue();

		if (commUtil.isNull(params.searchDate)) {
			showAlert('', '배송일자를 선택해주세요.');
			return;
		}
		params.deliverydt = params.searchDate.format('YYYYMMDD');

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
				<OmCloseMonitoringSearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<OmCloseMonitoringDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} search={searchMasterList} />
		</>
	);
};

export default OmCloseMonitoring;
