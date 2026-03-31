import { InputText, SelectBox } from '@/components/common/custom/form';

import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { RangePickerProps } from 'antd/es/date-picker';

// component
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';

// Libs

// API Call Function
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import { Form } from 'antd';

const DpInspectSearch = (props: any) => {
	const { form } = props;
	const { t } = useTranslation();
	const fixdccodeWatch = Form.useWatch('fixdccode', form);

	/**
	 * data onChange Event Handler
	 * @param  {string} value 변경 후 data
	 */
	const onChangeDocDtDp = (value: any) => {};

	/**
	 * 오늘 포함 이전 날짜 || 한달 이후 비활성화
	 * @param  {object} current 현재 날짜 & 시간
	 * @returns {boolean} 비활성화 여부
	 */
	const disabledDate: RangePickerProps['disabledDate'] = (current: any) => {
		// return true인 경우 비활성화
		// return current && (current < dayjs().endOf('day') || current > dayjs().add(1, 'month').endOf('day'));
		return false;
	};

	return (
		<>
			<li>
				<Rangepicker
					name="docDtDp"
					onChange={onChangeDocDtDp}
					allowClear
					showNow={false}
					disabledDate={disabledDate}
					label={t('lbl.DOCDT_DP')}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 물류센터 */}
				<CmGMultiDccodeSelectBox
					name={'fixdccode'}
					required
					onChange={() => {
						form.setFieldsValue({ organize: '', organizenm: '' });
					}}
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')} // 공급받는센터
				/>
			</li>
			<li>
				{/* 창고코드 */}
				<CmOrganizeSearch
					dccodeDisabled={true}
					form={form}
					label={'창고코드/명'}
					selectionMode="multipleRows"
					name="organizenm"
					code="organize"
					returnValueFormat="name"
					dccode={fixdccodeWatch}
				/>
			</li>
			<li></li>
			<li>
				<CmPartnerSearch form={form} selectionMode="multipleRows" name="partnerName" code="partnerCode" />
			</li>
			<li>
				<CmSkuSearch form={form} selectionMode="multipleRows" name="skuName" code="skuCode" />
			</li>
			<li>
				<SelectBox
					name="status"
					placeholder="선택해주세요"
					options={getCommonCodeList('STATUS_DP', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.STATUS_DP')}
				/>
			</li>
			<li>
				<SelectBox
					name="channel"
					placeholder="선택해주세요"
					options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.CHANNEL_DMD')}
				/>
			</li>
			<li>
				<SelectBox
					name="undoneYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.UNDONEYN_DP')}
				/>
			</li>
			<li>
				<SelectBox
					name="reasonCode"
					placeholder="선택해주세요"
					options={getCommonCodeList('REASONCODE_DPINSPECT', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.REASON_NONDPINSPECT')}
				/>
			</li>
		</>
	);
};

export default DpInspectSearch;
