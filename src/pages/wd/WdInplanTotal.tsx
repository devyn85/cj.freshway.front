/*
 ############################################################################
 # FiledataField	: WdInplanTotal.tsx
 # Description		: 출고진행현황
 # Author			: 공두경
 # Since			: 25.05.16
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList } from '@/api/wd/apiWdInplan';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdInplanTotalDetail from '@/components/wd/inplanTotal/WdInplanTotalDetail';
import WdInplanTotalSearch from '@/components/wd/inplanTotal/WdInplanTotalSearch';

//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

import { useAppSelector } from '@/store/core/coreHook';

// lib
const WdInplanTotal = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [detailForm] = Form.useForm();
	const [totalCnt, setTotalCnt] = useState(0);
	const refs: any = useRef(null);
	const [selectedDateRange, setSelectedDateRange] = useState(null);

	const globalVariable = useAppSelector(state => state.global.globalVariable);
	const gUserId = globalVariable['gUserId'];

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		delYn: null,
		tpltype: null,
		sotype: null,
		ordertype: null,
		saledepartment: null,
		status: null,
		channel: null,
		storagetype: null,
		closeyn: null,
		beforeshotage: null,
		ordergrp: null,
		serialtype: null,
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

		if (params.fromSlipdt != params.toSlipdt) {
			if (commUtil.isNull(params.toCustkey) && commUtil.isNull(params.sku)) {
				showAlert('', '출고일자가 하루이상인 경우\n관리처코드,상품코드 중 하나를 \n입력하셔야 합니다.');
				if (gUserId?.toUpperCase() !== 'DEV01') {
					return;
				}
			}
		}

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
				<WdInplanTotalSearch ref={refs} search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<WdInplanTotalDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default WdInplanTotal;
