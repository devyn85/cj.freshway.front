/*
 ############################################################################
 # FiledataField	: WdInplanSN.tsx
 # Description		: 이력상품출고현황
 # Author			: 공두경
 # Since			: 25.06.10
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/wd/apiWdShipmentBatch';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdShipmentBatchDetail from '@/components/wd/shipmentBatch/WdShipmentBatchDetail';
import WdShipmentBatchSearch from '@/components/wd/shipmentBatch/WdShipmentBatchSearch';

//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';
import dayjs from 'dayjs';

// lib
const WdInplanSN = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [detailForm] = Form.useForm();
	const [totalCnt, setTotalCnt] = useState(0);
	const refs: any = useRef(null);
	const [selectedDateRange, setSelectedDateRange] = useState(null);
	const location = useLocation();
	const [queryParam, setQueryParam] = useState<any>({});

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		ordertype: null,
		status: null,
		inspectstatus: null,
		channel: null,
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

		if (
			!commUtil.isNull(params.blno) ||
			!commUtil.isNull(params.serialno) ||
			!commUtil.isNull(params.contractcompany)
		) {
			params.searchserial = 'Y';
		}

		apiGetMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	useEffect(() => {
		setQueryParam(location.state);
	}, [location]);

	useEffect(() => {
		if (queryParam.docno) {
			form.resetFields(); // 기존 값 초기화

			const dccode = queryParam.dccode;
			const fixDccodeValue = Array.isArray(dccode) ? dccode[0] : dccode;
			form.setFieldsValue({
				...(fixDccodeValue ? { fixdccode: fixDccodeValue } : {}),
				slipdtRange: [dayjs(queryParam.fromSlipdt), dayjs(queryParam.toSlipdt)],
				docno: queryParam.docno,
				sku: queryParam.sku,
				skuNm: commUtil.isNull(decodeURIComponent(queryParam.skuName)) ? '' : decodeURIComponent(queryParam.skuName),
			});
			searchMasterList();
		}
	}, [queryParam]);

	const titleFunc = {
		searchYn: searchMasterList,
	};
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdShipmentBatchSearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<WdShipmentBatchDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} search={searchMasterList} />
		</>
	);
};

export default WdInplanSN;
