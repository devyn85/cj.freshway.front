/*
 ############################################################################
 # FiledataField	: StLocMoveRPCust.tsx
 # Description		: 피킹취소처리
 # Author			: 공두경
 # Since			: 25.06.30
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetTab1CustkeyList, apiGetTab1SkuList, apiGetTab2MasterList } from '@/api/st/apiStLocMoveRPCust';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import StLocMoveRPCustSearch from '@/components/st/locMoveRPCust/StLocMoveRPCustSearch';
import StLocMoveRPCustTab1Detail from '@/components/st/locMoveRPCust/StLocMoveRPCustTab1Detail';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

//Util
import TabsArray from '@/components/common/TabsArray';
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const StLocMoveRPCust = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [totalCnt3, setTotalCnt3] = useState(0);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');
	const refs: any = useRef(null);
	const refs2: any = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		status: null,
		printyn: null,
		fromzone: null,
		tozone: null,
	});

	const searchMasterList = () => {
		let params = form.getFieldsValue();

		if (commUtil.isNull(params.secrchDate)) {
			showAlert('', '출고일자를 선택해주세요.');
			return;
		}
		params.docdt = params.secrchDate.format('YYYYMMDD');

		params = {
			...params,
			distancetype: commUtil.nvl(form.getFieldValue('distancetype'), []).toString(),
		};

		if (activeKeyMaster === '1') {
			// 보충생성
			// 출고재고보충 대상 관리처 조회
			apiGetTab1CustkeyList(params).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
			// 출고재고보충 대상 상품 조회
			apiGetTab1SkuList(params).then(res => {
				setGridData2(res.data);
				setTotalCnt2(res.data.length);
			});
		} else if (activeKeyMaster === '2') {
			// asrs 결과
			apiGetTab2MasterList(params).then(res => {
				setGridData3(res.data);
				setTotalCnt3(res.data.length);
			});
		}
	};

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string) => {
		if (key === '1') {
			setActiveKeyMaster('1');
			if (refs.gridRef.current) {
				refs.gridRef.current?.resize('100%', '100%');
				refs.gridRef2.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			setActiveKeyMaster('2');
			if (refs2.gridRef.current) {
				refs2.gridRef.current?.resize('100%', '100%');
			}
		}
		return;
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: '보충생성',
			children: (
				<StLocMoveRPCustTab1Detail
					ref={refs}
					form={form}
					data={gridData}
					totalCnt={totalCnt}
					data2={gridData2}
					totalCnt2={totalCnt2}
					search={searchMasterList}
				/>
			),
		},
	];
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StLocMoveRPCustSearch ref={refs} search={searchMasterList} form={form} activeKey={activeKeyMaster} />
			</SearchFormResponsive>
			<TabsArray activeKey={activeKeyMaster} onChange={tabClick} items={tabItems} />
		</>
	);
};

export default StLocMoveRPCust;
