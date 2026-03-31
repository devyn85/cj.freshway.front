/*
 ############################################################################
 # FiledataField	: WdPickingListSN.tsx
 # Description		: 이력피킹현황
 # Author			: 공두경
 # Since			: 25.07.03
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/wd/apiWdPickingListSN';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdPickingListSNDetail from '@/components/wd/pickingListSN/WdPickingListSNDetail';
import WdPickingListSNSearch from '@/components/wd/pickingListSN/WdPickingListSNSearch';
import { useAppSelector } from '@/store/core/coreHook';
//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const WdInplanSN = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [detailForm] = Form.useForm();
	const [totalCnt, setTotalCnt] = useState(0);
	const refs: any = useRef(null);
	const [selectedDateRange, setSelectedDateRange] = useState(null);
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		dccode: globalVariable.gDccode,
		ordertype: null,
		status: null,
		skugroup: null,
		storagetype: null,
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
				<WdPickingListSNSearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<WdPickingListSNDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default WdInplanSN;
