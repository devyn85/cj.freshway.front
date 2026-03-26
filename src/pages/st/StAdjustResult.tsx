/*
 ############################################################################
 # FiledataField	: StAdjustResult.tsx
 # Description		: 재고감모현황
 # Author			: 공두경
 # Since			: 25.05.16
 ############################################################################
*/
import { Form } from 'antd';
import { useRef, useState } from 'react';

//Api
import { apiGetMasterList } from '@/api/st/apiStAdjustResult';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import StAdjustResultDetail from '@/components/st/adjustResult/StAdjustResultDetail';
import StAdjustResultSearch from '@/components/st/adjustResult/StAdjustResultSearch';

//Util
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';
import { t } from 'i18next';

// lib
const StAdjustResult = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// Declare react Ref(2/4)
	const refs: any = useRef(null);

	// Declare init value(3/4)

	// 기타(4/4)

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		fixdccode: null, // 물류센터
		trandtRange: null, // 조정일자 범위
		sku: null, // 상품코드
		skuNm: null, // 상품명
		reasoncode: null, // 발생사유
		other01: null, // 귀책
		other05: null, // 물류귀책배부
		iotype: null, // 증감여부
		stocktype: null, // 재고위치
		blno: null, // B/L 번호
		serialno: null, // 이력번호
		contractcompany: null, // 계약업체 코드
		contractcompanyNm: null, // 계약업체명
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 	조회
	 * @returns 조회
	 */
	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();
		// setIsDisabled(true);
		const params = form.getFieldsValue();

		// if (commUtil.isNull(params.trandtRange)) {
		// 	showAlert('', '조정일자를 선택해주세요.');
		// 	return;
		// }
		if (commUtil.isNull(params.trandtRange[0]) || commUtil.isNull(params.trandtRange[1])) {
			showAlert('', t('msg.selectPlease1', [t('lbl.TRANDATE_AJ')])); // {조정일자}을/를 선택해주세요
			form.scrollToField('trandtRange');
			(document.querySelector('input[name="trandtRange"]') as HTMLInputElement)?.focus();
			return;
		}

		params.fromTrandt = params.trandtRange[0].format('YYYYMMDD');
		params.toTrandt = params.trandtRange[1].format('YYYYMMDD');
		if (
			!commUtil.isNull(params.blno) ||
			!commUtil.isNull(params.serialno) ||
			!commUtil.isNull(params.contractcompany)
		) {
			params.searchserial = 'Y';
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
				<StAdjustResultSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<StAdjustResultDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default StAdjustResult;
