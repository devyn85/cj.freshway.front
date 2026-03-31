/*
 ############################################################################
 # FiledataField	: OmOrderCustDaily.tsx
 # Description		: 일배협력사별주문현황
 # Author			: 공두경
 # Since			: 25.06.20
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/om/apiOmOrderCustDaily';
//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import OmOrderCustDailyDetail from '@/components/om/orderCustDaily/OmOrderCustDailyDetail';
import OmOrderCustDailySearch from '@/components/om/orderCustDaily/OmOrderCustDailySearch';

//Util
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const OmOrderCustDaily = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [detailForm] = Form.useForm();
	const [totalCnt, setTotalCnt] = useState(0);
	const refs: any = useRef(null);
	const [selectedDateRange, setSelectedDateRange] = useState(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		status: null,
		storagetype: null,
		delYn: null,
	});

	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();
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
		params.fromSlipdt = params.slipdtRange[0].format('YYYYMMDD');
		params.toSlipdt = params.slipdtRange[1].format('YYYYMMDD');

		if (dateUtil.getDaysDiff(params.fromSlipdt, params.toSlipdt) > 31) {
			showAlert('', '최대 한 달 간의 데이터만\n조회 가능합니다.');
			return;
		}

		if (
			!commUtil.isNull(params.blno) ||
			!commUtil.isNull(params.serialno) ||
			!commUtil.isNull(params.contractcompany)
		) {
			params.serialCheck = 'Y';
		}

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
				<OmOrderCustDailySearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<OmOrderCustDailyDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default OmOrderCustDaily;
