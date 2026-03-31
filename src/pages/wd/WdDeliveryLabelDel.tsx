/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelDel.tsx
 # Description		: 배송라벨삭제현황
 # Author			: 공두경
 # Since			: 25.06.23
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/wd/apiWdDeliveryLabelDel';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdDeliveryLabelDelDetail from '@/components/wd/deliveryLabelDel/WdDeliveryLabelDelDetail';
import WdDeliveryLabelDelSearch from '@/components/wd/deliveryLabelDel/WdDeliveryLabelDelSearch';

//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const WdDeliveryLabelDel = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [detailForm] = Form.useForm();
	const [totalCnt, setTotalCnt] = useState(0);
	const refs: any = useRef(null);
	const [selectedDateRange, setSelectedDateRange] = useState(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		deletelabelstatus: null,
	});

	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();
		// setIsDisabled(true);
		const params = form.getFieldsValue();

		if (commUtil.isNull(params.secrchDate)) {
			showAlert('', '출고일자를 선택해주세요.');
			return;
		}
		params.slipdt = params.secrchDate.format('YYYYMMDD');

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
				<WdDeliveryLabelDelSearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<WdDeliveryLabelDelDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default WdDeliveryLabelDel;
