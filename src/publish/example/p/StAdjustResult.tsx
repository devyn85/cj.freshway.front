/*
 ############################################################################
 # FiledataField	: StAdjustResult.tsx
 # Description		: 재고감모현황
 # Author			: 공두경
 # Since			: 25.05.16
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/st/apiStAdjustResult';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import StAdjustResultDetail from '@/components/st/adjustResult/StAdjustResultDetail';
import StAdjustResultSearch from '@/components/st/adjustResult/StAdjustResultSearch';

//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const StAdjustResult = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const refs: any = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		reasoncode: null,
		other01: null,
		other05: null,
		iotype: null,
		stocktype: null,
	});

	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();
		// setIsDisabled(true);
		const params = form.getFieldsValue();

		if (commUtil.isNull(params.trandtRange)) {
			showAlert('', '조정일자를 선택해주세요.');
			return;
		}
		if (commUtil.isNull(params.trandtRange[0]) || commUtil.isNull(params.trandtRange[1])) {
			showAlert('', '조정일자를 선택해주세요.');
			return;
		}

		params.fromTrandt = params.trandtRange[0].format('YYYYMMDD');
		params.toTrandt = params.trandtRange[1].format('YYYYMMDD');
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
			<MenuTitle func={titleFunc} authority="searchYn" name="재고감모현황" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StAdjustResultSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<StAdjustResultDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default StAdjustResult;
