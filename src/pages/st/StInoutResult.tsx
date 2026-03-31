/*
 ############################################################################
 # FiledataField	: StInoutResult.tsx
 # Description		: 재고 > 재고현황 > 수불현황
 # Author			: sss
 # Since			: 25.07.10
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
import StInoutResultDetail from '@/components/st/inoutResult/StInoutResultDetail';
import StInoutResultSearch from '@/components/st/inoutResult/StInoutResultSearch';
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';
import { showAlert } from '@/util/MessageUtil';

// lib

const StInoutResult = () => {
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
		sku: null,
		skuName: null,
		stocktype: null,
		storagetype: null,
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
		refs.gridRef1.current.clearGridData();

		const commonParams = form.getFieldsValue();
		const docdt = form.getFieldValue('docdt');
		const params = {
			...commonParams,
			dt1: docdt?.[0]?.format('YYYYMMDD') ?? '',
			dt2: docdt?.[1]?.format('YYYYMMDD') ?? '',
		};

		const fromValue = docdt?.[0]?.format('YYYYMMDD') ?? '';
		const toValue = docdt?.[1]?.format('YYYYMMDD') ?? '';

		const fromYm = Number(fromValue.substring(0, 6));
		const toYm = Number(toValue.substring(0, 6));

		if (commUtil.isNull(params.dt1) || commUtil.isNull(params.dt2)) {
			showAlert('', t('msg.selectPlease1', [t('lbl.INOUTDT')])); // {수불일자}을/를 선택해주세요
			form.scrollToField('docdt');
			(document.querySelector('input[name="docdt"]') as HTMLInputElement)?.focus();
			return;
		}

		if (fromYm !== toYm) {
			showAlert('', '수불일자는 From기준 해당 월 내에서 선택 가능합니다');
			form.scrollToField('docdt');
			(document.querySelector('input[name="docdt"]') as HTMLInputElement)?.focus();
			return;
		}

		if (!checkDateFromTo(fromValue, toValue)) {
			showAlert('', t('msg.MSG_COM_VAL_016')); // 시작일은 종료일보다 작거나 같아야 합니다.
			form.scrollToField('docdt');
			(document.querySelector('input[name="docdt"]') as HTMLInputElement)?.focus();
			return;
		}

		// 유틸 함수 예시
		/**
		 *
		 * @param from
		 * @param to
		 */
		function checkDateFromTo(from: string, to: string): boolean {
			// YYYYMMDD 형식 기준
			return from <= to;
		}

		searchMasterListImp(params);
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp = (params: any) => {
		// API 호출
		apiPostMasterList(params).then(res => {
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
	const apiPostMasterList = (params: any) => {
		return axios.post('/api/st/inoutResult/v1.0/getMasterList', params).then(res => res.data);
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
				<StInoutResultSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<StInoutResultDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default StInoutResult;
