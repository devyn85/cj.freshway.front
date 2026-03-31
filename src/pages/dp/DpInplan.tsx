/*
 ############################################################################
 # FiledataField	: DpInplan.tsx
 # Description		: 입고진행현황
 # Author			: 공두경
 # Since			: 25.06.16
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/dp/apiDpInplan';
//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import DpInplanDetail from '@/components/dp/inplan/DpInplanDetail';
import DpInplanSearch from '@/components/dp/inplan/DpInplanSearch';

//Util
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const DpInplan = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [detailForm] = Form.useForm();
	const [totalCnt, setTotalCnt] = useState(0);
	const refs: any = useRef(null);
	const [selectedDateRange, setSelectedDateRange] = useState(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		status: null,
		tpltype: null,
		ordertype: null,
		channel: null,
		storagetype: null,
		serialtype: null,
	});

	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();
		// setIsDisabled(true);
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
		params.ordertype = params?.ordertype?.join(',');

		if (dateUtil.getDaysDiff(params.fromSlipdt, params.toSlipdt) > 31) {
			showAlert('', '최대 한 달 간의 데이터만\n조회 가능합니다.');
			return;
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
				<DpInplanSearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<DpInplanDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default DpInplan;
