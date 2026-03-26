/*
 ############################################################################
 # FiledataField	: StInoutResultSearch.tsx
 # Description		: 수불현황 Search
 # Author			:sss
 # Since			: 25.07.10
 ############################################################################
*/

import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import CheckBox from '@/components/common/custom/form/CheckBox';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dayjs from 'dayjs';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const dateFormat = 'YYYY-MM-DD';

const StInoutResultSearch = forwardRef((props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation(); // 다국어 처리
	const { form } = props; // Antd Form
	const today = dayjs();
	const [dates, setDates] = useState([today.startOf('month'), today.endOf('month')]);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// * 초기값 세팅
	useEffect(() => {
		const today = dayjs();
		const firstDay = today.startOf('month');
		const lastDay = today.endOf('month');
		setDates([firstDay, lastDay]);
		form.setFieldValue('docdt', [firstDay, lastDay]);

		// 사용자 물류센터 기본값 세팅
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	return (
		<>
			{/* 문서일자 */}
			<li>
				<Rangepicker
					label={t('lbl.DOCDT')}
					name="docdt"
					defaultValue={dates}
					format={dateFormat}
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="fixdccode"
					placeholder={t('lbl.SELECT')}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')}
					mode={'single'}
					required
				/>
			</li>
			{/* 조달여부 */}
			<li>
				<SelectBox
					label={'조달여부'}
					name="procLogiYn"
					options={getCommonCodeList('YN2', '전체', null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 상품코드 */}
			<li>
				<CmSkuSearch label={t('lbl.SKUCD')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 재고위치 */}
			<li>
				<SelectBox
					name="stocktype"
					label="재고위치"
					options={getCommonCodeList('STOCKTYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 통합배송 */}
			<li>
				<SelectBox
					label="통합배송"
					name="tplType"
					placeholder="선택해주세요"
					options={getCommonCodeList('ORDR_TPL', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					defaultValue={t('lbl.ALL')}
				/>
			</li>
			{/* 저장조건 */}
			<li>
				<SelectBox
					name="storagetype"
					label="저장조건"
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 위탁물류제외 */}
			<li>
				<CheckBox label="위탁 물류제외" name="logisticsExcept" trueValue={'1'} falseValue={'0'}>
					위탁 물류제외
				</CheckBox>
			</li>
			{/* 통합배송제외 */}
			<li>
				<CheckBox label="통합배송 제외" name="deliveryExcept" trueValue={'1'} falseValue={'0'}>
					통합배송 제외
				</CheckBox>
			</li>
		</>
	);
});

export default StInoutResultSearch;
