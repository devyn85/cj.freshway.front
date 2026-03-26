/*
 ############################################################################
 # FiledataField	: DpUnloadSearch.tsx
 # Description		: 입고 > 입고작업 > 입고하차관리 조회 조건 화면
 # Author			: KimDongHyeon
 # Since			: 2025.07.28
 ############################################################################
*/

// Components
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, InputText, SelectBox, TimeRangeInput } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import { Form } from 'antd';

// Store

// Libs

// Utils

const DpUnloadSearch = ({ form, dates, setDates }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const dateFormat = 'YYYY-MM-DD';
	const fixdccodeWatch = Form.useWatch('fixdccode', form);

	const { t } = useTranslation();
	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// const handleChangeTime = (e: any) => {
	// 	let v = e.target.value.replace(/\D/g, ''); // 숫자만 추출
	// 	if (v.length >= 3) {
	// 		v = v.slice(0, 2) + ':' + v.slice(2, 4);
	// 	}
	// 	form.setFieldValue(e.target.name, v);
	// };

	// const handleBlurTime = (name: string) => {
	// 	const value = form.getFieldValue(name);
	// 	if (!/^\d{2}:\d{2}$/.test(value)) {
	// 		form.setFieldValue(name, '');
	// 		return;
	// 	}
	// 	const [hh, mm] = value.split(':').map(Number);
	// 	if (hh > 23 || mm > 59) {
	// 		form.setFieldValue(name, '');
	// 	}
	// };

	return (
		<>
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_DP')} //광역입고일자
					name="slipdt"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					span={24}
					allowClear
					showNow={false}
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
			<li>
				<SelectBox //온도옵션
					name="tempoptiyn"
					span={24}
					options={[
						{ label: t('lbl.ALL'), value: '' },
						{ label: '적정', value: 'S' },
						{ label: '이탈', value: 'F' },
					]}
					placeholder="선택해주세요"
					label={t('lbl.TEMPOPTIYN')}
				/>
			</li>
			<li>
				<CmPartnerSearch
					form={form}
					selectionMode={'multipleRows'}
					name="fromCustkeyNm"
					code="fromCustkey"
					label={t('lbl.FROM_CUSTKEY_DP')} /*협력사코드*/
				/>
			</li>
			<li>
				<CmSkuSearch
					form={form} //상품
					selectionMode="multipleRows"
					name="skuName"
					code="sku"
					required={false}
				/>
			</li>
			<li>
				<SelectBox //저장조건
					name="storagetype"
					span={24}
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.STORAGETYPE')}
				/>
			</li>
			<li>
				<SelectBox //저장유무
					name="channel"
					span={24}
					options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.CHANNEL_DMD')}
				/>
			</li>
			<li>
				<TimeRangeInput
					label={t('lbl.UNLOADTIME')}
					fromName="unloadtimeFrom"
					toName="unloadtimeTo"
					fromPlaceholder="HH:MM"
					toPlaceholder="HH:MM"
					// onFromChange={handleChangeTime}
					// onToChange={handleChangeTime}
					// onFromBlur={() => handleBlurTime('unloadtimeFrom')}
					// onToBlur={() => handleBlurTime('unloadtimeTo')}
					// fromValue={form.getFieldValue('unloadtimeFrom')}
					// toValue={form.getFieldValue('unloadtimeTo')}
					// onFromChange={e => form.setFieldValue('unloadtimeFrom', e.target.value)}
					// onToChange={e => form.setFieldValue('unloadtimeTo', e.target.value)}
					fromMaxLength={5}
					toMaxLength={5}
				/>
			</li>
			<li>
				<CheckBox name={'moveYn'} label="센터간 이동 제외" value={'Y'}></CheckBox>
			</li>
			<li>
				<CheckBox name={'skuYn'} label="엑셀 다운시 상품포함" value={'Y'}></CheckBox>
			</li>
		</>
	);
};

export default DpUnloadSearch;
