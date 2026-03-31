// Component
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Rangepicker } from '@/components/common/custom/form';

// Store

interface TmMultiDeliveryPointSearchProps {
	form?: any;
}

const TmMultiDeliveryPointSearch = (props: TmMultiDeliveryPointSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { form } = props;
	// 다국어
	const { t } = useTranslation();
	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODE')} />
			</li>
			<li>
				<Rangepicker
					label={'기준일'}
					name="basedtRange"
					format={'YYYY-MM-DD'} // 화면에 표시될 형식
					span={24}
					allowClear
					showNow={false}
					//nChange={handleDateChange}
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 기준관리처 팝업 */}
				<CmCustSearch form={form} name="stdCustKeyNm" code="stdCustKey" label={'기준관리처'} /*기준관리처*/ />
			</li>
			<li>
				{/* 합산관리처 팝업 */}
				<CmCustSearch form={form} name="partCustKeyNm" code="partCustKey" label={'합산관리처'} />
			</li>
		</>
	);
};

export default TmMultiDeliveryPointSearch;
