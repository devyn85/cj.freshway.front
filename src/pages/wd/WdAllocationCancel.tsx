/*
 ############################################################################
 # FiledataField	: WdAllocationCancel.tsx
 # Description		: 출고분배취소
 # Author			: 공두경
 # Since			: 2025.07.24
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetDetailList, apiGetMasterList, apiGetMasterListCarno } from '@/api/wd/apiWdAllocationCancel';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdAllocationCancelSearch from '@/components/wd/allocationCancel/WdAllocationCancelSearch';
import WdAllocationCancelTap1Detail from '@/components/wd/allocationCancel/WdAllocationCancelTap1Detail';
import WdAllocationCancelTap2Detail from '@/components/wd/allocationCancel/WdAllocationCancelTap2Detail';
import WdAllocationCancelTap3Detail from '@/components/wd/allocationCancel/WdAllocationCancelTap3Detail';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

//Util
import TabsArray from '@/components/common/TabsArray';
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const WdAllocationCancel = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);
	const [activeKey, setActiveKey] = useState('1');
	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [totalCnt3, setTotalCnt3] = useState(0);
	const refs: any = useRef(null);
	const refs2: any = useRef(null);
	const refs3: any = useRef(null);
	const activeKeyRef = useRef(activeKey);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		status: null,
		ordertype: null,
		storagetype: null,
		channel: null,
		workprocesscode: null,
		allocfixtype: null,
		serialyn: 'N',
	});

	const searchMasterList = () => {
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

		if (activeKey === '1') {
			// 자동취소
			apiGetMasterList(params).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
				if (res.data.length <= 0) {
					refs2.gridRef.current.clearGridData();
					refs2.gridRef2.current.clearGridData();
				}
			});
		} else if (activeKey === '2') {
			// 지정분배
			apiGetMasterList(params).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		} else if (activeKey === '3') {
			// 피킹유형 미정의 관리처
			apiGetMasterListCarno(params).then(res => {
				setGridData3(res.data);
				setTotalCnt3(res.data.length);
			});
		}
	};

	const searchDetailList = () => {
		const selectedRow = refs.gridRef.current.getSelectedRows();
		const searchParams = form.getFieldsValue();
		const params = {
			dccode: selectedRow[0].dccode,
			storerkey: selectedRow[0].storerkey,
			slipdt: selectedRow[0].slipdt,
			toCustkey: selectedRow[0].custkey,
			other01: selectedRow[0].other01,
		};
		apiGetDetailList(params).then(res => {
			const gridData = res.data;
			setGridData2(gridData);
			refs.gridRef2.current?.setGridData(gridData);

			//const colSizeList = refs.gridRef2.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			//refs.gridRef2.current?.setColumnSizeList(colSizeList);
		});
	};

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string) => {
		if (key === '1') {
			//setActiveKeyMaster('1');
			if (refs.gridRef?.current) {
				refs.gridRef.current?.resize('100%', '100%');
			}
			if (refs.gridRef2?.current) {
				refs.gridRef2.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			//setActiveKeyMaster('2');
			if (refs2.gridRef?.current) {
				refs2.gridRef.current?.resize('100%', '100%');
			}
			if (refs2.gridRef2?.current) {
				refs2.gridRef2.current?.resize('100%', '100%');
			}
			//setActiveKeyMaster('3');
			if (refs3.gridRef?.current) {
				refs3.gridRef.current?.resize('100%', '100%');
			}
			if (refs3.gridRef2?.current) {
				refs3.gridRef2.current?.resize('100%', '100%');
			}
		}

		return;
	};

	const titleFunc =
		activeKey == '2'
			? {}
			: {
					searchYn: searchMasterList,
			  };

	const tabItems = [
		{
			key: '1',
			label: '자동취소',
			children: (
				<WdAllocationCancelTap1Detail
					ref={refs}
					form={form}
					data={gridData}
					data2={gridData2}
					setGridData2={setGridData2}
					totalCnt2={totalCnt2}
					setTotalCnt2={setTotalCnt2}
					totalCnt={totalCnt}
					search={searchMasterList}
					searchDtl={searchDetailList}
				/>
			),
		},
		{
			key: '2',
			label: '지정취소',
			children: (
				<WdAllocationCancelTap2Detail
					ref={refs2}
					form={form}
					data={gridData2}
					totalCnt={totalCnt2}
					search={searchMasterList}
				/>
			),
		},
		{
			key: '3',
			label: '차량별취소',
			children: (
				<WdAllocationCancelTap3Detail
					ref={refs3}
					form={form}
					data={gridData3}
					data2={gridData2}
					setGridData2={setGridData2}
					totalCnt2={totalCnt2}
					setTotalCnt2={setTotalCnt2}
					totalCnt={totalCnt3}
					search={searchMasterList}
				/>
			),
		},
	];

	useEffect(() => {
		activeKeyRef.current = activeKey;
	}, [activeKey]);

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdAllocationCancelSearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<TabsArray
				activeKey={activeKey}
				onChange={key => {
					setActiveKey(key);
					if (key === '1') {
						//setActiveKeyMaster('1');
						if (refs.gridRef?.current) {
							refs.gridRef.current?.resize('100%', '100%');
						}
						if (refs.gridRef2?.current) {
							refs.gridRef2.current?.resize('100%', '100%');
						}
					} else if (key === '2') {
						//setActiveKeyMaster('2');
						if (refs2.gridRef?.current) {
							refs2.gridRef.current?.resize('100%', '100%');
						}
						if (refs2.gridRef2?.current) {
							refs2.gridRef2.current?.resize('100%', '100%');
						}
					} else if (key === '3') {
						//setActiveKeyMaster('3');
						if (refs3.gridRef?.current) {
							refs3.gridRef.current?.resize('100%', '100%');
						}
						if (refs3.gridRef2?.current) {
							refs3.gridRef2.current?.resize('100%', '100%');
						}
					}
				}}
				items={tabItems}
			/>
		</>
	);
};

export default WdAllocationCancel;
