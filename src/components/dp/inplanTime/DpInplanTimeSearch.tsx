/*
 ############################################################################
 # FiledataField	: DpInplanTimeSearch.tsx
 # Description		: 입고 > 입고현황 > 입고 예정진행 현황(입차시간) 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.12.01
 ############################################################################
*/

// Components
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import { InputRange, InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { useSelector } from 'react-redux';

// Store

// Libs

// Utils

const DpInplanTimeSearch = ({ form, dates, complyList }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const dateFormat = 'YYYY-MM-DD';

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

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
	useEffect(() => {
		form.setFieldValue('dccode', gDccode);
	}, []);

	return (
		<>
			<li>
				{/* 물류센터 */}
				<SelectBox
					label={t('lbl.DCCODE')}
					name="dccode"
					options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 입고일자 */}
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_DP')}
					name="deliverydate"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* <li>
				예정입고 차이 시간
				<InputNumber
					// onPressEnter={searchMasterList}
					name="diffHour"
					label={t('lbl.DP_DIFF_HOUR')}
					placeholder={t('msg.placeholder1', [t('lbl.DP_DIFF_HOUR')])}
				/>
			</li> */}

			<li>
				{/* 예정입고 차이 시간 */}
				<InputRange
					label={t('lbl.DP_DIFF_HOUR')}
					//showCount
					fromName="diffHourFrom"
					toName="diffHourTo"
					placeholder={t('msg.placeholder1', [t('lbl.DP_DIFF_HOUR')])}
					min={0}
					max={99999}
					step={100}
					formatter={(value: string) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					parser={(value: string) => value?.replace(/\$\s?|(,*)/g, '')}
				/>
			</li>
			<li>
				{/* 준수여부 */}
				<SelectBox
					label={t('lbl.COMPLY_YN')}
					name="complyYn"
					options={[...complyList]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* <InputNumber //결품수량
							name="shortagetranqtyShortage"
							label={t('lbl.SHORTAGEQTY')}
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.SHORTAGEQTY')])}
							showSearch
							allowClear
							span={4}
						/> */}

			<li>
				{/* 협력사 */}
				<CmPartnerSearch
					form={form}
					name="custkeyName"
					code="custkey"
					label={t('lbl.VENDOR')}
					selectionMode={'multipleRows'}
				/>
			</li>
			{/* 저장유무 */}
			<li>
				<SelectBox
					label={t('lbl.CHANNEL_DMD')}
					name="channel"
					options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 입고전표번호 */}
			<li>
				<InputText label={t('lbl.SLIPNO_DP')} name="docno" placeholder={t('msg.placeholder2', [t('lbl.SLIPNO_DP')])} />
			</li>
		</>
	);
};

export default DpInplanTimeSearch;
