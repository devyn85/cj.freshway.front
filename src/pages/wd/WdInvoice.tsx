/*
 ############################################################################
 # FiledataField	: WdInvoice.tsx
 # Description		: 납품서출력
 # Author			: KimDongHyeon
 # Since			: 2025.11.03
 ############################################################################
*/
import axios from '@/api/Axios';
import { Form } from 'antd';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

//Api

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import WdInvoiceDetail from '@/components/wd/invoice/WdInvoiceDetail';
import WdInvoiceSearch from '@/components/wd/invoice/WdInvoiceSearch';
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';
import { showAlert } from '@/util/MessageUtil';
import dayjs from 'dayjs';
import { validateForm } from '@/util/FormUtil';

// lib

const WdInvoice = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const today = dateUtil.getToDay('YYYY-MM-DD');
	const storerkey = useSelector((state: any) => state.global.globalVariable.gStorerkey);
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// Declare react Ref(2/4)
	const refs: any = useRef(null);

	// Declare init value(3/4)
	const [searchBox] = useState({
		invoicedt: dayjs(),
		gubun: '0',
	}); // 검색영역

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 	조회
	 * @param {string} dt1 - 시작 납품일자
	 * @param {string} dt2 - 종료 납품일자
	 * @param {string} invoiceprinttype - 인쇄유형 (WD: 일반, CD: 세금계산서, SD: 매출전표)
	 */
	const searchMasterList = async () => {
		refs.gridRef.current.clearGridData();
		refs.gridRef1.current.clearGridData();

		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		const requestParams = form.getFieldsValue();
		requestParams.invoicedt = requestParams.invoicedt.format('YYYYMMDD');

		searchMasterListImp(requestParams);
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp = (params: any) => {
		// API 호출
		apiGetMasterList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			}
		});
	};

	/**
	 * 조회 api 함수
	 * @param {object} params - 파라미터
	 * @returns {Promise<any>} Axios response data
	 */
	const apiGetMasterList = (params: any) => {
		return axios.post('/api/wd/wdInvoice/v1.0/getMasterList', params).then(res => res.data);
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

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdInvoiceSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<WdInvoiceDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default WdInvoice;
