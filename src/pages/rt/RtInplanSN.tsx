/*
 ############################################################################
 # FiledataField	: RtInplanSN.tsx
 # Description		: 이력상품반품현황
 # Author			: 공두경
 # Since			: 25.05.28
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/rt/apiRtInplanSN';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import RtInplanSNDetail from '@/components/rt/inplanSN/RtInplanSNDetail';
import RtInplanSNSearch from '@/components/rt/inplanSN/RtInplanSNSearch';

//Util
import commUtil from '@/util/commUtil';
import dayjs from 'dayjs';

// lib
const RtInplanSN = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const refs: any = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		searchDateType: 'DOCDT',
		vendoreturn: null,
		returntype: null,
		channel: null,
		potype: null,
		status: null,
		ordertype: null,
		storagetype: null,
		docdtRange: [dayjs(), dayjs()],
	});

	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();
		// setIsDisabled(true);
		const params = form.getFieldsValue();

		// 조회 날짜구분에 따른 처리
		if (params.searchDateType == 'DOCDT') {
			params.fromSlipdt = params.docdtRange[0].format('YYYYMMDD');
			params.toSlipdt = params.docdtRange[1].format('YYYYMMDD');
		} else if (params.searchDateType == 'CONFIRMDT') {
			params.fromConfirmdate = params.docdtRange[0].format('YYYYMMDD');
			params.toConfirmdate = params.docdtRange[1].format('YYYYMMDD');
		}
		// 이력정보 조회 조건 입력 체크
		// 조건 추가에 따른 EXISTS 절 추가
		if (!commUtil.isNull(params.blno) || !commUtil.isNull(params.serialno) || !commUtil.isNull(params.custkey)) {
			params.serialCheck = '1';
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
				<RtInplanSNSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<RtInplanSNDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default RtInplanSN;
