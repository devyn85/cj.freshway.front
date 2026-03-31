/*
 ############################################################################
 # FiledataField	: StLocMoveAsrs.tsx
 # Description		: 자동창고보충
 # Author			: 공두경
 # Since			: 25.09.16
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/st/apiStLocMoveAsrs';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import StLocMoveAsrsSearch from '@/components/st/locMoveAsrs/StLocMoveAsrsSearch';
import StLocMoveAsrsTap1Detail from '@/components/st/locMoveAsrs/StLocMoveAsrsTap1Detail';
import StLocMoveAsrsTap2Detail from '@/components/st/locMoveAsrs/StLocMoveAsrsTap2Detail';
import { useAppSelector } from '@/store/core/coreHook';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

//Util

// lib
const WdAllocationBatchGroup = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');
	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const refs: any = useRef(null);
	const refs2: any = useRef(null);
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		dccode: globalVariable.gDccode,
		storagetype: null,
		lottable01yn: null,
		stocktype: null,
		stockGrade: null,
		zone: null,
	});

	const searchMasterList = () => {
		const params = form.getFieldsValue();

		params.loccategory = '';
		if (
			!commUtil.isNull(params.blno) ||
			!commUtil.isNull(params.serialno) ||
			!commUtil.isNull(params.contractcompany)
		) {
			params.searchserial = 'Y';
		}

		if (activeKeyMaster === '1') {
			// 이동대상
			apiGetMasterList(params).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		} else if (activeKeyMaster === '2') {
			// 이동결과
		}
	};

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string, e: any) => {
		if (key === '1') {
			setActiveKeyMaster('1');
			if (refs.gridRef.current) {
				refs.gridRef.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			setActiveKeyMaster('2');
			if (refs2.gridRef?.current) {
				refs2.gridRef?.current?.resize('100%', '100%');
			}
		}
		return;
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StLocMoveAsrsSearch ref={refs} search={searchMasterList} form={form} activeKey={activeKeyMaster} />
			</SearchFormResponsive>
			<Tabs activeKey={activeKeyMaster} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="이동대상" key="1">
					<StLocMoveAsrsTap1Detail
						ref={refs}
						form={form}
						data={gridData}
						totalCnt={totalCnt}
						callBack={(res: any) => {
							setActiveKeyMaster('2');
							setGridData2(res.data);
							setTotalCnt2(res.data.length);
						}}
					/>
				</TabPane>
				<TabPane tab="이동결과" key="2">
					<StLocMoveAsrsTap2Detail ref={refs2} form={form} data={gridData2} totalCnt={totalCnt2} />
				</TabPane>
			</Tabs>
		</>
	);
};

export default WdAllocationBatchGroup;
