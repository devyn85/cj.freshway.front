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
import { apiGetMasterList } from '@/api/wd/apiWdInplanSN';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdInplanSNDetail from '@/components/wd/inplanSN/WdInplanSNDetail';
import WdInplanSNSearch from '@/components/wd/inplanSN/WdInplanSNSearch';

//Util
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const WdInplanSN = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [detailForm] = Form.useForm();
	const [totalCnt, setTotalCnt] = useState(0);
	const refs: any = useRef(null);
	const [selectedDateRange, setSelectedDateRange] = useState(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		slipdtRange: null, // 출고일자 범위 (시작일~종료일)
		delYn: null, // 삭제여부
		ordertype: null, // 주문유형
		status: null, // 상태
		channel: null, // 채널
		storagetype: null, // 보관유형
		blno: null, // BL번호
		serialno: null, // 시리얼번호
		contractcompany: null, // 계약업체
		searchserial: null, // 시리얼 검색여부
		fromSlipdt: null, // 출고시작일자
		toSlipdt: null, // 출고종료일자
	}); // 검색영역 초기값

	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();
		refs.gridRef2.current.clearGridData();
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
			params.searchserial = 'Y';
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
				<WdInplanSNSearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<WdInplanSNDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default WdInplanSN;
