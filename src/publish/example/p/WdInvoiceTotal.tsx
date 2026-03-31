import axios from '@/api/Axios';
import { Form } from 'antd';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

//Api

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import WdInvoiceTotalDetail from '@/components/wd/invoiceTotal/WdInvoiceTotalDetail';
import WdInvoiceTotalSearch from '@/components/wd/invoiceTotal/WdInvoiceTotalSearch';
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';
import { showAlert } from '@/util/MessageUtil';

// lib

const WdInvoiceTotal = () => {
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

	// Declare react Ref(2/4)
	const refs: any = useRef(null);

	// Declare init value(3/4)
	const [searchBox] = useState({
		docdt: null,
		invoiceprinttype: null,
		deliverygroup: null,
		carno: null,
		carnoNm: null,
		custkey: null,
		custkeynm: null,
		docno: null,
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
	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();

		const params = {
			dt1: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[0].format('YYYYMMDD'),
			dt2: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[1].format('YYYYMMDD'),
			invoiceprinttype: commUtil.isNull(form.getFieldValue('invoiceprinttype'))
				? 'WD'
				: commUtil.nvl(form.getFieldValue('invoiceprinttype'), ''), // 인쇄유형(default: WD)
			deliverygroup: commUtil.nvl(form.getFieldValue('deliverygroup'), ''),
			carno: commUtil.nvl(form.getFieldValue('carno'), ''),
			custkey: commUtil.nvl(form.getFieldValue('custkey'), ''),
			docno: commUtil.nvl(form.getFieldValue('docno'), ''),
			searchcar: form.getFieldValue('carno')?.length > 0 || form.getFieldValue('deliverygroup')?.length > 0 ? 'Y' : 'N', // 차량번호 또는 관리처가 입력된 경우
		};

		if (storerkey == 'CJFW') {
			showAlert('', '통합납품서 출력은 [FW00]씨제이프레시웨이(주) 에서만 사용가능합니다.');
			return;
		}

		if (commUtil.nvl(params.dt1, '') != commUtil.nvl(params.dt2, '')) {
			if (commUtil.nvl(form.getFieldValue('custkey'), '') == '') {
				showAlert('', '납품일자가 하루이상인경우 관리처코드를 입력하셔야 합니다.');
				return;
			}
		}

		if (commUtil.isNull(params.dt1) || commUtil.isNull(params.dt2)) {
			showAlert('', t('msg.selectPlease1', [t('lbl.INVOICEDT_WD')])); // {납품일자}을/를 선택해주세요
			return;
		}

		searchMasterListImp(params);
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
		return axios.post('/api/wd/wdInvoiceTotal/v1.0/getMasterList', params).then(res => res.data);
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
				<WdInvoiceTotalSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<WdInvoiceTotalDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default WdInvoiceTotal;
