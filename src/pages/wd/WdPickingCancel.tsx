/*
 ############################################################################
 # FiledataField	: WdPickingCancel.tsx
 # Description		: 피킹취소처리
 # Author			: 공두경
 # Since			: 25.06.30
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/wd/apiWdPickingCancel';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdPickingCancelDetail from '@/components/wd/pickingCancel/WdPickingCancelDetail';
import WdPickingCancelSearch from '@/components/wd/pickingCancel/WdPickingCancelSearch';

//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const WdPickingCancel = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [activeKey, setActiveKey] = useState('1');
	const [detailForm] = Form.useForm();
	const [totalCnt, setTotalCnt] = useState(0);
	const refs: any = useRef(null);
	const [selectedDateRange, setSelectedDateRange] = useState(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		tasksystem: null,
	});

	const searchMasterList = () => {
		activeKey === '1' ? refs.gridRef1.current.clearGridData() : refs.gridRef3.current.clearGridData();

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
				<WdPickingCancelSearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<WdPickingCancelDetail
				ref={refs}
				form={form}
				data={gridData}
				totalCnt={totalCnt}
				activeKey={activeKey}
				setActiveKey={setActiveKey}
				search={searchMasterList}
			/>
		</>
	);
};

export default WdPickingCancel;
