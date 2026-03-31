/*
 ############################################################################
 # FiledataField	: StInoutResultSearch.tsx
 # Description		: 재고 > 재고현황 > 센터자체감모 Search
 # Author			:sss
 # Since			: 25.07.10
 ############################################################################
*/

import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputRange, InputText, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const StAdjustmentSearch = forwardRef((props: any) => {
	const { t } = useTranslation(); // 다국어 처리
	const { search, form } = props; // Antd Form

	// 화면 로드 시 select 필드들을 '전체'로 초기화
	useEffect(() => {
		setTimeout(() => {
			form.setFieldsValue({
				lottable01yn: getCommonCodeList('YN2', t('lbl.ALL'))[0]?.comCd, // 소비기한여부 - 전체
				stocktype: getCommonCodeList('STOCKTYPE', t('lbl.ALL'))[0]?.comCd, // 재고위치 - 전체
				stockgrade: getCommonCodeList('STOCKGRADE', t('lbl.ALL'))[0]?.comCd, // 재고속성 - 전체
			});
		}, 100);
	}, [form, t]);

	return (
		<>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="fixdccode"
					placeholder={t('lbl.SELECT')}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')}
					mode={'single'}
					required
					disabled={true}
				/>
			</li>
			{/* 상품코드 */}
			<li>
				<span>
					<CmSkuSearch label={t('lbl.SKUCD')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
				</span>
			</li>
			{/* 소비기한여부 */}
			<li>
				<SelectBox
					label={t('lbl.LOTTABLE01YN')}
					name="lottable01yn"
					options={getCommonCodeList('YN2', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 로케이션 */}
			<li>
				<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromloc" toName="toloc" />
			</li>
			{/* 재고위치 */}
			<li>
				<SelectBox
					label="재고위치"
					name="stocktype"
					options={getCommonCodeList('STOCKTYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 재고속성 */}
			<li>
				<SelectBox
					label="재고속성"
					name="stockgrade"
					options={getCommonCodeList('STOCKGRADE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* B/L 번호 */}
			<li>
				<InputText
					label={t('lbl.BLNO')}
					name="blno"
					placeholder={t('msg.placeholder1', [t('lbl.BLNO')])}
					onPressEnter={search}
				/>
			</li>
			{/* 이력번호 */}
			<li style={{ gridColumn: ' / span 0' }}>
				<InputText label="이력번호" name="serialno" />
			</li>
			{/* 계약업체 */}
			<li>
				<CmCustSearch form={form} name="contractcompanyNm" code="contractcompany" label={t('lbl.CONTRACTCOMPANY')} />
			</li>
		</>
	);
});

export default StAdjustmentSearch;
