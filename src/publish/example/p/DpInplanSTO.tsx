import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/dp/apiDpInplanSTO';
//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import DpInplanSTODetail from '@/components/dp/inplanSTO/DpInplanSTODetail';
import DpInplanSTOSearch from '@/components/dp/inplanSTO/DpInplanSTOSearch';

//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const DpInplanSTO = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const refs: any = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		storagetype: null,
		status: null,
	});

	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();
		const params = form.getFieldsValue();

		if (commUtil.isNull(params.slipdtRange)) {
			showAlert('', '입고일자를 선택해주세요.');
			return;
		}
		if (commUtil.isNull(params.slipdtRange[0]) || commUtil.isNull(params.slipdtRange[1])) {
			showAlert('', '입고일자를 선택해주세요.');
			return;
		}
		params.fromSlipdt = params.slipdtRange[0].format('YYYYMMDD');
		params.toSlipdt = params.slipdtRange[1].format('YYYYMMDD');

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
				<DpInplanSTOSearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<DpInplanSTODetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default DpInplanSTO;
