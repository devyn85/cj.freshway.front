/*
 ############################################################################
 # FiledataField	: OmCkApprovalSearch.tsx
 # Description		: 주문 > 주문요청 > CK주문결재내역
 # Author			: JeongHyeongCheol
 # Since			: 25.09.29
 ############################################################################
*/

import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputText, Rangepicker, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dayjs from 'dayjs';

interface OmCkApprovalSearchProps {
	form?: any;
}

const OmCkApprovalSearch = (props: OmCkApprovalSearchProps) => {
	const { form } = props;
	const { t } = useTranslation();

	/**
	 * 날짜 set
	 */
	useEffect(() => {
		//fromDate는 오늘 toDate는 내일
		const fromDate = dayjs();
		const toDate = dayjs().add(1, 'day');
		form.setFieldValue('deliverydate', [fromDate, toDate]);
	}, []);

	return (
		<>
			{/* 납품일 */}
			<li>
				<Rangepicker name="deliverydate" allowClear showNow={false} label={'납품일'} format="YYYY-MM-DD" />
			</li>
			{/* 상품코드(상품코드/명) */}
			<li>
				<CmSkuSearch label={t('lbl.SKU')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 승인/반려 */}
			<li>
				<SelectBox
					name="apprStatus"
					label={'승인/반려'}
					options={getCommonCodeList('STATUS_APPR_CK', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 요청번호 */}
			<li>
				<InputText name="requestno" label={t('lbl.REQUESTNO')} />
			</li>
		</>
	);
};

export default OmCkApprovalSearch;
