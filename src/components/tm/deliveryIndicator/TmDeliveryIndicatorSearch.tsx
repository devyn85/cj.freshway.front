/*
 ############################################################################
 # FiledataField	: TmDeliveryIndicatorSearch.tsx
 # Description		: 일별임시차현황
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.06
 ############################################################################
*/
// lib
// component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Datepicker } from '@/components/common/custom/form';
// store

// api

// util

// hook

// type

// asset
interface TmResultTempCarProps {
	form: any;
}
const TmDeliveryIndicatorSearch = (props: TmResultTempCarProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 // * =====================================================================
	 */

	const { t } = useTranslation();
	// const dateFormat = 'YYYY-MM';
	const form = props.form;

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	useEffect(() => {
		// setDates([dayjs()]);
		// form.setFieldValue('date', dates); // dates 준비된 뒤 한 번만
	}, []);
	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="single"
					label={'물류센터'}
					required
				/>
			</li>

			<li>
				<Datepicker
					name="deliverydt"
					allowClear
					showNow={false}
					label={t('lbl.BASEDT')}
					rules={[{ required: true, validateTrigger: 'none' }]}
					picker="date"
					required
					// defaultValue={dayjs()}
					// value={dates}
					// dataformat={dateFormat}
				/>
			</li>
		</>
	);
};
export default TmDeliveryIndicatorSearch;
