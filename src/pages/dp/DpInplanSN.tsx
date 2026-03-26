/*
 ############################################################################
 # FiledataField	: DpInplanSN.tsx
 # Description		: 이력상품입고현황
 # Author			: 공두경
 # Since			: 25.06.17
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/dp/apiDpInplanSN';
//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import DpInplanSNDetail from '@/components/dp/inplanSN/DpInplanSNDetail';
import DpInplanSNSearch from '@/components/dp/inplanSN/DpInplanSNSearch';

//Util
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';
import { showAlert } from '@/util/MessageUtil';
import dayjs from 'dayjs';

// lib
const DpInplanSN = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [detailForm] = Form.useForm();
	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const refs: any = useRef(null);
	const [selectedDateRange, setSelectedDateRange] = useState(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		slipdtRange: [dayjs(), dayjs()],
	});

	const searchMasterList = () => {
		refs.gridRef?.current?.clearGridData();
		refs.gridRef1?.current?.clearGridData();
		refs.gridRef2?.current?.clearGridData();
		refs.gridRef3?.current?.clearGridData();
		// setIsDisabled(true);
		const params = form.getFieldsValue();
		params.ordertype = params?.ordertype?.join(',');

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

		if (dateUtil.getDaysDiff(params.fromSlipdt, params.toSlipdt) > 31) {
			showAlert('', '최대 한 달 간의 데이터만\n조회 가능합니다.');
			return;
		}

		if (
			!commUtil.isNull(params.blno) ||
			!commUtil.isNull(params.serialno) ||
			!commUtil.isNull(params.barcode) ||
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
				<DpInplanSNSearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<DpInplanSNDetail
				ref={refs}
				form={form}
				data={gridData}
				totalCnt={totalCnt}
				totalCnt2={totalCnt2}
				setTotalCnt2={setTotalCnt2}
			/>
		</>
	);
};

export default DpInplanSN;
