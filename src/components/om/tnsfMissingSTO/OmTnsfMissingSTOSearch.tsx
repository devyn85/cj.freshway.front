/*
 ############################################################################
 # FiledataField	: OmTnsfMissingSTOSearch.tsx
 # Description		: 주문 > 주문등록 > 누락분STO이체
 # Author			: JeongHyeongCheol
 # Since			: 25.09.29
 ############################################################################
*/

import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Datepicker, InputText, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dayjs from 'dayjs';

interface OmTnsfMissingSTOSearchProps {
	form?: any;
	activeKey?: any;
}

const OmTnsfMissingSTOSearch = (props: OmTnsfMissingSTOSearchProps) => {
	const { form, activeKey } = props;
	const { t } = useTranslation();

	/**
	 * 날짜 set
	 */
	useEffect(() => {
		// 이체일자 초기 세팅
		// //console.log(activeKey);
		form.setFieldValue('deliverydate', dayjs());
	}, []);

	return (
		<>
			{/* 출고일자 */}
			<li>
				<Datepicker
					label={t('lbl.DOCDT_WD')}
					name="deliverydate"
					allowClear
					showNow={false}
					format="YYYY-MM-DD"
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 공급받는센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="dccode"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.TO_DCCODE')}
					rules={activeKey === '1' ? [{ required: true, validateTrigger: 'none' }] : []}
					required={activeKey === '1' ? true : false}
				/>
			</li>
			{/* 공급센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="toDccode"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.FROM_DCCODE')}
					rules={activeKey === '2' ? [{ required: true, validateTrigger: 'none' }] : []}
					required={activeKey === '2' ? true : false}
				/>
			</li>
			{/* 문서번호 */}
			<li>
				<InputText label={t('lbl.DOCNO')} name="docno" />
			</li>
			{/* 상품코드/명 */}
			<li>
				<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 대응여부 */}
			<li>
				<SelectBox
					label={t('lbl.RESPONSE_YN')}
					name="respYn"
					options={getCommonCodeList('YN', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 상태코드/명 */}
			<li>
				<SelectBox
					label="진행상태"
					name="stoStatus"
					options={getCommonCodeList('STO_STATUS', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label="저장유형"
					name="multistorageType"
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					mode="multiple"
				/>
			</li>
			{/* 고객코드/명 */}
			{/* <li>
				<CmCustSearch
					form={form}
					name="custName"
					code="custkey"
					selectionMode="multipleRows"
					returnValueFormat="code"
				/>
			</li> */}
		</>
	);
};

export default OmTnsfMissingSTOSearch;
