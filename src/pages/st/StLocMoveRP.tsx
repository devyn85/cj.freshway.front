/*
 ############################################################################
 # FiledataField	: StLocMoveRP.tsx
 # Description		: 출고재고보충(수원3층)
 # Author			: 공두경
 # Since			: 25.06.30
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetTab1MasterList, apiGetTab2MasterList } from '@/api/st/apiStLocMoveRP';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import StLocMoveRPSearch from '@/components/st/locMoveRP/StLocMoveRPSearch';
import StLocMoveRPTab1Detail from '@/components/st/locMoveRP/StLocMoveRPTab1Detail';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const StLocMoveRP = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');
	const refs: any = useRef(null);
	const refs2: any = useRef(null);

	// Declare react Ref(2/4)
	const [resizeTarget, setResizeTarget] = useState({ ref: refs.gridRef, searchConditonLiCnt: 2, moreHeight: 0 }); // 최초load시 조정

	// Declare init value(3/4)

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		status: null,
		printyn: null,
		fromzone: null,
		tozone: null,
	});

	// 기타(4/4)

	const searchMasterList = () => {
		const params = form.getFieldsValue();

		if (commUtil.isNull(params.secrchDate)) {
			showAlert('', '출고일자를 선택해주세요.');
			return;
		}

		params.docdt = params.secrchDate.format('YYYYMMDD');

		if (activeKeyMaster === '1') {
			// 하나로
			apiGetTab1MasterList(params).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		} else if (activeKeyMaster === '2') {
			// 쿠팡
			apiGetTab2MasterList(params).then(res => {
				setGridData2(res.data);
				setTotalCnt2(res.data.length);
			});
		}
	};

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string, e: any) => {
		setActiveKeyMaster(key);
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	/*
	useEffect(() => {
		setTimeout(() => {
			if (activeKeyMaster === '1') {
				setResizeTarget({ ref: refs.gridRef, searchConditonLiCnt: 2, moreHeight: 0 });
			} else if (activeKeyMaster === '2') {
				setResizeTarget({ ref: refs2.gridRef, searchConditonLiCnt: 2, moreHeight: 0 });
			}
		}, 100);
	}, [activeKeyMaster]);

	// 그리드 자동 리사이즈
	useAutoResize(resizeTarget);
*/
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StLocMoveRPSearch ref={refs} search={searchMasterList} form={form} activeKey={activeKeyMaster} />
			</SearchFormResponsive>
			<Tabs activeKey={activeKeyMaster} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="보충생성" key="1">
					<StLocMoveRPTab1Detail ref={refs} form={form} data={gridData} totalCnt={totalCnt} search={searchMasterList} />
				</TabPane>
			</Tabs>
		</>
	);
};

export default StLocMoveRP;
