/*
 ############################################################################
 # FiledataField	: StKitPlanSearch.tsx
 # Description		: 재고 > 재고작업 > KIT상품 계획등록
 # Author			    : 고혜미
 # Since		    	: 25.10.21
 ############################################################################
*/

import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const StKitPlanSearch = (props: any) => {
	const form = props.form;
	const { t } = useTranslation();
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// * 사용자 물류센터 기본값 세팅
	useEffect(() => {
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	return (
		<>
			{/*조회월*/}
			<li>
				<DatePicker label={t('lbl.SEARCH_MONTH')} name="month" format="YYYY-MM" picker="month" required allowClear />
			</li>
			{/* 물류센터*/}
			<li>
				<CmGMultiDccodeSelectBox
					name="fixdccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="single"
					label={t('lbl.DCCODE')}
				/>
			</li>
			{/* 키트상품 */}
			<li>
				<CmSkuSearch
					form={form}
					selectionMode="multipleRows"
					name="kitSkuName"
					label={'키트상품'}
					code="kitSku"
					returnValueFormat="name"
					kit={'Y'}
				/>
			</li>
		</>
	);
};

export default StKitPlanSearch;
