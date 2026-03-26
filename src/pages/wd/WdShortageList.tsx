/*
 ############################################################################
 # FiledataField	: WdShortageList.tsx
 # Description		: 출고결품현황
 # Author			: 공두경
 # Since			: 26.03.05
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/wd/apiWdShortageList';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdShortageListDetail from '@/components/wd/shortageList/WdShortageListDetail';
import WdShortageListSearch from '@/components/wd/shortageList/WdShortageListSearch';

//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const WdShortageList = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const refs: any = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		slipdtRange: null, // 출고일자 범위 (시작일~종료일)
		storagetype: null, // 보관유형
		fromSlipdt: null, // 출고시작일자
		toSlipdt: null, // 출고종료일자
		channel: null, // 저장유무
		reason: null, // 조정사유
	}); // 검색영역 초기값

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
				<WdShortageListSearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<WdShortageListDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default WdShortageList;
