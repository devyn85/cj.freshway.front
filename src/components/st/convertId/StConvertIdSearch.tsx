/*
 ############################################################################
 # FiledataField	: StConvertIdSearch.tsx
 # Description		: 재고 > 재고현황 > PLT-ID변경 Search
 # Author			:sss
 # Since			: 25.07.10
 ############################################################################
*/

import CmSkuGroup2Search from '@/components/cm/popup/CmSkuGroup2Search';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputRange, InputText } from '@/components/common/custom/form';
import dayjs from 'dayjs';
import { forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const StConvertIdSearch = forwardRef((props: any) => {
	const { t } = useTranslation(); // 다국어 처리
	const { form } = props; // Antd Form
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// *  기본 값 세팅
	useEffect(() => {
		const dt1 = dayjs();
		const dt2 = dayjs();
		form.setFieldValue('docdt', [dt1, dt2]);

		// sku 검색 input에 DOM 방식으로 포커스 이동
		setTimeout(() => {
			form.scrollToField('skuName');
			(document.querySelector('input[name="skuName"]') as HTMLInputElement)?.focus();
		}, 500);

		// 사용자 물류센터 기본값 세팅
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

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
				/>
			</li>
			{/* 상품코드 */}
			<li>
				<CmSkuSearch label={t('lbl.SKUCD')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 상품세분류 */}
			<li>
				<CmSkuGroup2Search form={form} name="skugroupName" code="skugroup" returnValueFormat="name" />
			</li>
			{/* 로케이션(From~To) */}
			<li>
				<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromloc" toName="toloc" />
			</li>
			<li>
				{/* 존(From~To) */}
				<InputRange label={t('존')} fromName="fromzone" toName="tozone" />
			</li>
			{/* 재고ID */}
			<li>
				<InputText label={t('lbl.TO_STOCKID')} name="toStockid" onPressEnter={null} />
			</li>
		</>
	);
});

export default StConvertIdSearch;
