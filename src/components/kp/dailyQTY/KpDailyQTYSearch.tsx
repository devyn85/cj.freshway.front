/*
 ############################################################################
 # FiledataField	: KpDailyQTYSearch.tsx
 # Description		: 지표 > 센터 운영 > 일일 물동량 조회 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.09.02
 ############################################################################
*/

// Components
import { SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
// Store
// Libs

// Utils

const KpDailyQTYSearch = ({ form, dates }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const dateFormat = 'YYYY-MM-DD';

	const { t } = useTranslation();

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
		form.setFieldValue('fixdccode', gDccode);
	}, []);

	return (
		<>
			<li>
				{/* 물류센터 */}
				<SelectBox
					label={t('lbl.DCCODE')}
					name="fixdccode"
					options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 출고일자 */}
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_WD')}
					name="docdt"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
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
		</>
	);
};

export default KpDailyQTYSearch;
