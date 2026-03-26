/*
 ############################################################################
 # FiledataField	: WdAllocationBatchGroup.tsx
 # Description		: 출고재고분배
 # Author			: 공두경
 # Since			: 25.07.08
 ############################################################################
*/
import { Form } from 'antd';
//Api
import {
	apiGetTab1MasterList,
	apiGetTab2MasterList,
	apiGetTab3MasterList,
	apiGetTab4CarInfo,
	apiGetTab4MasterList,
	apiGetTab5MasterList,
	apiGetTab6MasterList,
	apiGetTab7MasterList,
} from '@/api/wd/apiWdAllocationBatchGroup';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdAllocationBatchGroupSearch from '@/components/wd/allocationBatchGroup/WdAllocationBatchGroupSearch';
import WdAllocationBatchGroupTap1Detail from '@/components/wd/allocationBatchGroup/WdAllocationBatchGroupTap1Detail';
import WdAllocationBatchGroupTap2Detail from '@/components/wd/allocationBatchGroup/WdAllocationBatchGroupTap2Detail';
import WdAllocationBatchGroupTap3Detail from '@/components/wd/allocationBatchGroup/WdAllocationBatchGroupTap3Detail';
import WdAllocationBatchGroupTap4Detail from '@/components/wd/allocationBatchGroup/WdAllocationBatchGroupTap4Detail';
import WdAllocationBatchGroupTap5Detail from '@/components/wd/allocationBatchGroup/WdAllocationBatchGroupTap5Detail';
import WdAllocationBatchGroupTap6Detail from '@/components/wd/allocationBatchGroup/WdAllocationBatchGroupTap6Detail';
import WdAllocationBatchGroupTap7Detail from '@/components/wd/allocationBatchGroup/WdAllocationBatchGroupTap7Detail';

import TabsArray from '@/components/common/TabsArray';

//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';
import { useRef, useState } from 'react';

// lib
const WdAllocationBatchGroup = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);
	const [gridData4, setGridData4] = useState([]);
	const [gridData5, setGridData5] = useState([]);
	const [gridData6, setGridData6] = useState([]);
	const [gridData7, setGridData7] = useState([]);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');
	const [activeKey, setActiveKey] = useState('1');
	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [totalCnt3, setTotalCnt3] = useState(0);
	const [totalCnt4, setTotalCnt4] = useState(0);
	const [totalCnt5, setTotalCnt5] = useState(0);
	const [totalCnt6, setTotalCnt6] = useState(0);
	const [totalCnt7, setTotalCnt7] = useState(0);

	const refs: any = useRef(null);
	const refs2: any = useRef(null);
	const refs3: any = useRef(null);
	const refs4: any = useRef(null);
	const refs5: any = useRef(null);
	const refs6: any = useRef(null);
	const refs7: any = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		status: null,
		ordertype: null,
		storagetype: null,
		channel: null,
		workprocesscode: null,
		allocfixtype: null,
		serialyn: 'N',
		zone: null,
		useYn: 'Y',
	});

	const searchMasterList = () => {
		//		activeKey === '1' ? refs.gridRef2.current.clearGridData() : refs.gridRef3.current.clearGridData();

		const params = form.getFieldsValue();

		if (activeKeyMaster != '5' && activeKeyMaster != '6' && activeKeyMaster != '7') {
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
		}

		if (activeKeyMaster === '1') {
			// 자동분배
			apiGetTab1MasterList(params).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		} else if (activeKeyMaster === '2') {
			// 지정분배
		} else if (activeKeyMaster === '3') {
			// 피킹유형 미정의 관리처
			apiGetTab3MasterList(params).then(res => {
				setGridData3(res.data);
				setTotalCnt3(res.data.length);
			});
		} else if (activeKeyMaster === '4') {
			// 차량별분배
			apiGetTab4MasterList(params).then(res => {
				setGridData4(res.data);
				setTotalCnt4(res.data.length);
			});
		} else if (activeKeyMaster === '5') {
			// 거래처상품 상미율
			apiGetTab5MasterList(params).then(res => {
				setGridData5(res.data);
				setTotalCnt5(res.data.length);
			});
		} else if (activeKeyMaster === '6') {
			// 거래처상품 상미율
			apiGetTab6MasterList(params).then(res => {
				setGridData6(res.data);
				setTotalCnt6(res.data.length);
			});
		} else if (activeKeyMaster === '7') {
			// 거래처상품 상미율
			apiGetTab7MasterList(params).then(res => {
				setGridData7(res.data);
				setTotalCnt7(res.data.length);
			});
		}
	};

	const searchTab2MasterList = () => {
		const selectedRow = refs.gridRef1.current.getSelectedRows();
		const searchParams = form.getFieldsValue();

		const params = {
			dccode: selectedRow[0].dccode,
			storerkey: selectedRow[0].storerkey,
			toCustkey: selectedRow[0].toCustkey,
			ordertype: selectedRow[0].ordertype,
			plant: selectedRow[0].plant,
			batchgroup: selectedRow[0].batchgroup,
			storagetype: selectedRow[0].storagetype,
			distancetype: selectedRow[0].distancetype,
			slipdt: selectedRow[0].slipdt,
			serialyn: selectedRow[0].serialyn,
			sku: searchParams.sku,
			zone: searchParams.zone,
			fixdccode: searchParams.fixdccode,
		};

		setActiveKeyMaster('2');

		apiGetTab2MasterList(params).then(res => {
			setGridData2(res.data);
			setTotalCnt2(res.data.length);
			if (refs2.gridRef.current) {
				refs2.gridRef.current?.resize('100%', '100%');
			}
			if (refs2.gridRef2.current) {
				refs2.gridRef2.current?.resize('100%', '100%');
			}
		});
	};

	const searchTab4CarInfo = () => {
		const params = form.getFieldsValue();

		apiGetTab4CarInfo(params).then(res => {
			const carExistYn = res.data[0].carExistYn;
			if (carExistYn === 'N') {
				showAlert('', '센터 피킹그룹의 피킹(원거리)유형 중 CAR 정보가 없습니다.\n상세조건 관리에서 등록 해주십시오.');
				return;
			}
		});
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
			if (refs.gridRef1.current) {
				refs.gridRef1.current?.resize('100%', '100%');
			}
			if (refs.gridRef2.current) {
				refs.gridRef2.current?.resize('100%', '100%');
			}
			if (refs.gridRef3.current) {
				refs.gridRef3.current?.resize('100%', '100%');
			}
			if (refs.gridRef4.current) {
				refs.gridRef4.current?.resize('100%', '100%');
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
			if (refs4.gridRef?.current) {
				refs4.gridRef?.current?.resize('100%', '100%');
			}
			if (refs4.gridRef2?.current) {
				refs4.gridRef2?.current?.resize('100%', '100%');
			}
			searchTab4CarInfo();
		} else if (key === '5') {
			setActiveKeyMaster('5');
			if (refs5.gridRef.current) {
				refs5.gridRef.current?.resize('100%', '100%');
			}
		} else if (key === '6') {
			setActiveKeyMaster('6');
			if (refs6.gridRef.current) {
				refs6.gridRef.current?.resize('100%', '100%');
			}
		} else if (key === '7') {
			setActiveKeyMaster('7');
			if (refs7.gridRef.current) {
				refs7.gridRef.current?.resize('100%', '100%');
			}
		}
		return;
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};

	const tabItems = [
		{
			key: '1',
			label: '자동분배',
			children: (
				<WdAllocationBatchGroupTap1Detail
					ref={refs}
					form={form}
					data={gridData}
					totalCnt={totalCnt}
					search={searchMasterList}
					activeKey={activeKey}
					setActiveKey={setActiveKey}
					callBack={searchTab2MasterList}
				/>
			),
		},
		{
			key: '4',
			label: '차량별분배',
			children: (
				<WdAllocationBatchGroupTap4Detail
					ref={refs4}
					form={form}
					data={gridData4}
					totalCnt={totalCnt4}
					search={searchMasterList}
					callBack={(params: any) => {
						setActiveKeyMaster('2');
						apiGetTab2MasterList(params).then(res => {
							setGridData2(res.data);
							setTotalCnt2(res.data.length);
							if (refs2.gridRef.current) {
								refs2.gridRef.current?.resize('100%', '100%');
							}
							if (refs2.gridRef2.current) {
								refs2.gridRef2.current?.resize('100%', '100%');
							}
						});
					}}
				/>
			),
		},
		{
			key: '2',
			label: '지정분배',
			children: (
				<WdAllocationBatchGroupTap2Detail
					ref={refs2}
					form={form}
					data={gridData2}
					totalCnt={totalCnt2}
					search={searchTab2MasterList}
				/>
			),
		},
		{
			key: '3',
			label: '피킹유형 미정의 관리처',
			children: (
				<WdAllocationBatchGroupTap3Detail
					ref={refs3}
					form={form}
					data={gridData3}
					totalCnt={totalCnt3}
					callBackFn={searchMasterList}
				/>
			),
		},
		{
			key: '5',
			label: '거래처상품 상미율',
			children: (
				<WdAllocationBatchGroupTap5Detail
					ref={refs5}
					form={form}
					data={gridData5}
					totalCnt={totalCnt5}
					callBackFn={searchMasterList}
				/>
			),
		},
		{
			key: '6',
			label: '분배예외처리거래처',
			children: (
				<WdAllocationBatchGroupTap6Detail
					ref={refs6}
					form={form}
					data={gridData6}
					totalCnt={totalCnt6}
					callBackFn={searchMasterList}
				/>
			),
		},
		{
			key: '7',
			label: '분배예외처리상품',
			children: (
				<WdAllocationBatchGroupTap7Detail
					ref={refs7}
					form={form}
					data={gridData7}
					totalCnt={totalCnt7}
					callBackFn={searchMasterList}
				/>
			),
		},
	];

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdAllocationBatchGroupSearch ref={refs} search={searchMasterList} form={form} activeKey={activeKeyMaster} />
			</SearchFormResponsive>

			<TabsArray
				items={tabItems}
				activeKey={activeKeyMaster}
				onChange={key => tabClick(key, null)}
				className="contain-wrap"
			/>
		</>
	);
};

export default WdAllocationBatchGroup;
