/*
 ############################################################################
 # FiledataField	: WdTask.tsx
 # Description		: 피킹작업지시
 # Author			: 공두경
 # Since			: 25.08.29
 ############################################################################
*/
import { Form } from 'antd';

//Api
import {
	apiGetTab1MasterList,
	apiGetTab2MasterList,
	apiGetTab3MasterList,
	apiGetTab4MasterList,
} from '@/api/wd/apiWdTask';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdTaskSearch from '@/components/wd/task/WdTaskSearch';
import WdTaskTap1Detail from '@/components/wd/task/WdTaskTap1Detail';
import WdTaskTap2Detail from '@/components/wd/task/WdTaskTap2Detail';
import WdTaskTap3Detail from '@/components/wd/task/WdTaskTap3Detail';
import WdTaskTap4Detail from '@/components/wd/task/WdTaskTap4Detail';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

//Util
import TabsArray from '@/components/common/TabsArray';
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const WdTask = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);
	const [gridData4, setGridData4] = useState([]);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');
	const [activeKey, setActiveKey] = useState('1');
	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [totalCnt3, setTotalCnt3] = useState(0);
	const [totalCnt4, setTotalCnt4] = useState(0);

	const refs: any = useRef(null);
	const refs2: any = useRef(null);
	const refs3: any = useRef(null);
	const refs4: any = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		tasksystem: null,
		tasktype: '',
		storagetype: null,
		printorder: 'LOCXSKU',
		printpickinglist: 'PICKINGLIST2600',
	});

	const searchMasterList = () => {
		const params = form.getFieldsValue();

		if (commUtil.isNull(params.searchDate)) {
			showAlert('', '작업지시일자를 선택해주세요.');
			return;
		}

		params.taskdt = params.searchDate.format('YYYYMMDD');

		if (activeKeyMaster === '1') {
			// 조회생성(일반)
			apiGetTab1MasterList(params).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		} else if (activeKeyMaster === '2') {
			// 진행현황
			apiGetTab2MasterList(params).then(res => {
				setGridData2(res.data);
				setTotalCnt2(res.data.length);
			});
		} else if (activeKeyMaster === '3') {
			// 피킹작업자현황
			apiGetTab3MasterList(params).then(res => {
				setGridData3(res.data);
				setTotalCnt3(res.data.length);
			});
		} else if (activeKeyMaster === '4') {
			// 조회생성(차량)
			apiGetTab4MasterList(params).then(res => {
				setGridData4(res.data);
				setTotalCnt4(res.data.length);
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
			}
			if (refs.gridRef2.current) {
				refs.gridRef2.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			setActiveKeyMaster('2');
			if (refs2.gridRef.current) {
				refs2.gridRef.current?.resize('100%', '100%');
			}
			if (refs2.gridRef2.current) {
				refs2.gridRef2.current?.resize('100%', '100%');
			}
		} else if (key === '3') {
			setActiveKeyMaster('3');
			if (refs3.gridRef.current) {
				refs3.gridRef.current?.resize('100%', '100%');
			}
		} else if (key === '4') {
			setActiveKeyMaster('4');
			if (refs4.gridRef.current) {
				refs4.gridRef.current?.resize('100%', '100%');
			}
			if (refs4.gridRef2.current) {
				refs4.gridRef2.current?.resize('100%', '100%');
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
			label: '조회생성(일반)',
			children: (
				<WdTaskTap1Detail ref={refs} form={form} data={gridData} totalCnt={totalCnt} search={searchMasterList} />
			),
		},
		{
			key: '4',
			label: '조회생성(차량)',
			children: (
				<WdTaskTap4Detail ref={refs4} form={form} data={gridData4} totalCnt={totalCnt4} search={searchMasterList} />
			),
		},
		{
			key: '2',
			label: '진행현황',
			children: (
				<WdTaskTap2Detail ref={refs2} form={form} data={gridData2} totalCnt={totalCnt2} search={searchMasterList} />
			),
		},
		{
			key: '3',
			label: '피킹작업자현황',
			children: (
				<WdTaskTap3Detail ref={refs3} form={form} data={gridData3} totalCnt={totalCnt3} search={searchMasterList} />
			),
		},
	];

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdTaskSearch ref={refs} search={searchMasterList} form={form} activeKey={activeKeyMaster} />
			</SearchFormResponsive>
			<TabsArray activeKey={activeKeyMaster} onChange={tabClick} items={tabItems} />
		</>
	);
};

export default WdTask;
