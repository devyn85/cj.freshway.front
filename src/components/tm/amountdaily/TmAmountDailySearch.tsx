// Component
import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Rangepicker, SelectBox } from '@/components/common/custom/form';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';

interface TmAmountDailySearchProps {
	form?: any;
}

const TmAmountDailySearch = (props: TmAmountDailySearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { form } = props;
	const dccode = Form.useWatch('fixdccode', props.form);
	// 다국어
	const { t } = useTranslation();
	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODE')} required={true} />
			</li>
			{/* <li style={{ gridColumn: '1 / span 1' }}> */}
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
					required
				/>
			</li>
			<li>
				{/* 운송사조회 팝업 */}
				<CmCarrierSearch
					form={form}
					selectionMode="multipleRows"
					name="courierName"
					code="courier"
					returnValueFormat="name"
					carrierType="LOCAL"
				/>
			</li>
			<li>
				{/* 차량번호 팝업 */}
				<CmCarSearch
					form={form}
					selectionMode="multipleRows"
					name="carnoName"
					code="carno"
					returnValueFormat="name"
					// customDccode={dccode}
				/>
			</li>
			<li>
				{/* 정산항목 */}
				<SelectBox
					name="sttlitemcd"
					placeholder="선택해주세요"
					options={getCommonCodeList('TM_CALC_ITEM', '전체', '').filter(item => item.data1 !== 'M')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.STTLITEM')}
				/>
			</li>

			<li>
				{/* 톤급 */}
				<SelectBox
					name="carcapacity"
					placeholder="선택해주세요"
					options={getCommonCodeList('CARCAPACITY', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.CARCAPACITY')}
				/>
			</li>
			<li>
				<SelectBox
					name="contractType"
					label="계약유형"
					options={getCommonCodeList('CONTRACTTYPE', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					// span={24}
				/>
			</li>
		</>
	);
};

export default TmAmountDailySearch;
