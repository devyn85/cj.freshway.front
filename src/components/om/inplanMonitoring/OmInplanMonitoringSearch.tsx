// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import Datepicker from '@/components/common/custom/form/Datepicker';

// Lib

//Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

const OmInplanMonitoringSearch = (props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { form, activeKey } = props;
	// 다국어
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<Datepicker
					label={'배송일자'}
					name="deliveryDt"
					allowClear
					showNow={true}
					rules={[{ required: true, validateTrigger: 'none' }]}
					required
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox
					name="multiDcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={'물류센터'}
					mode="multiple"
				/>
			</li>
			{(activeKey === '2' || activeKey === '4' || activeKey === '5') && (
				<li>
					<SelectBox
						name="custOrderCloseType"
						placeholder="선택해주세요"
						options={getCommonCodeList('CUSTORDERCLOSETYPE', '--- 선택 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						label={'고객마감유형'}
					/>
				</li>
			)}
			{activeKey === '1' && (
				<li>
					<SelectBox
						name="channel"
						placeholder="선택해주세요"
						options={getCommonCodeList('PUTAWAYTYPE', '--- 선택 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						label={'저장유무'}
					/>
				</li>
			)}
		</>
	);
};

export default OmInplanMonitoringSearch;
