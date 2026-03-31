/*
 ############################################################################
 # FiledataField	: RtInplanTotal.tsx
 # Description		: 반품진행현황
 # Author			: 공두경
 # Since			: 25.06.04
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/rt/apiRtInplanTotal';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import RtInplanTotalDetail from '@/components/rt/inplanTotal/RtInplanTotalDetail';
import RtInplanTotalSearch from '@/components/rt/inplanTotal/RtInplanTotalSearch';

//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';
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
		returnInfoYn: '0',
		claimdtlids: '',
		docdtRange: [dayjs(), dayjs()],
	});

	const searchMasterList = () => {
		refs.gridRef.current?.clearGridData();
		refs.gridRef2.current?.clearGridData();
		refs.gridRef3.current?.clearGridData();
		// setIsDisabled(true);
		const params = form.getFieldsValue();

		if (commUtil.isNull(params.docdtRange)) {
			showAlert('', '기간을 선택해주세요.');
			return;
		}
		if (commUtil.isNull(params.docdtRange[0]) || commUtil.isNull(params.docdtRange[1])) {
			showAlert('', '기간을 선택해주세요.');
			return;
		}

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

		//반품진행현황 목록 조회
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
				<RtInplanTotalSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<RtInplanTotalDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default RtInplanSN;
