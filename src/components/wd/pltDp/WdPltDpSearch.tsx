/*
 ############################################################################
 # FiledataField	: WdPltDpSearch.tsx
 # Description		: 재고 > 공용기 관리업 > PLT 수불 관리 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.09.22
 ############################################################################
*/

import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import { Rangepicker, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import dayjs from 'dayjs';

// Components

// Store

// Libs

// Utils

const WdPltDpSearch = ({ form, dates, setDates, gDccode }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const dateFormat = 'YYYY-MM-DD';

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
	/**
	 * 현재날짜를 셋팅한다.
	 */
	useEffect(() => {
		form.setFieldValue('dccode', gDccode);
		const today = dayjs();
		const firstDay = today.startOf('month');
		const lastDay = today.endOf('month');
		setDates([firstDay, lastDay]);
		form.setFieldValue('deliverydt', [firstDay, lastDay]);
	}, []);

	return (
		<>
			{/* 물류센터 */}
			<li>
				<SelectBox
					label={t('lbl.DCCODE')}
					name="dccode"
					options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 입출고일자 */}
				<Rangepicker
					label={t('lbl.DOCDT_PLT')}
					name="deliverydt"
					defaultValue={dates}
					format={dateFormat}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 파렛트 구분 */}
				<SelectBox
					label={t('lbl.PLT_TYPE')}
					name="pltComDv"
					options={getCommonCodeList('PLT_COMPANY', t('lbl.SELECT'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 협력사 */}
				<CmPartnerSearch
					form={form}
					selectionMode={'multipleRows'}
					name="custkeyNm"
					code="custkey"
					label={t('lbl.PARTNER')}
				/>
			</li>
		</>
	);
};

export default WdPltDpSearch;
