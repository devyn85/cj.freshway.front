/*
 ############################################################################
 # FiledataField	: KpCenterDayStateSearch.tsx
 # Description		: 지표 > 센터 운영 > 출고 유형별 물동 현황 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.09.03
 ############################################################################
*/

// Components
import { SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Store
import { getUserDccodeList } from '@/store/core/userStore';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
// Libs

// Utils

const KpCenterDayStateSearch = ({ form, activeKey }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
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
			<li>
				{/* 조회일자 */}
				<DatePicker
					label={t('lbl.SEARCHDT')}
					name="docdt"
					allowClear
					showNow={true}
					format="YYYY-MM-DD"
					required={true}
				/>
			</li>
			{/* 배송물동 */}
			{activeKey === '1' && (
				<>
					<li>
						{/* 경로 */}
						<SelectBox
							label={t('lbl.COURSE')}
							name="course"
							options={getCommonCodeList('CUSTORG_KP', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					<li>
						{/* 저장유무 */}
						<SelectBox
							label={t('lbl.CHANNEL_DMD')}
							name="channel"
							options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL'), '').filter(
								v => v.comCd === '' || v.comCd === '1' || v.comCd === '2',
							)}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}
			{/* 수동물동 */}
			{activeKey === '2' && (
				<>
					<li>
						{/* 저장유무 */}
						<SelectBox
							label={t('lbl.CHANNEL_DMD')}
							name="channel"
							options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL'), '').filter(
								v => v.comCd === '' || v.comCd === '1' || v.comCd === '2',
							)}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}
			{/* 배송차량 */}
			{activeKey === '3' && (
				<>
					<li>
						{/* 차량종류 */}
						<SelectBox
							label={t('lbl.CARCONTRACTTYPE')}
							name="contracttype"
							options={getCommonCodeList('CONTRACTTYPE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					<li>
						{/* 차량톤수 */}
						<SelectBox
							label={t('lbl.CARCAPACITY')}
							name="carcapacity"
							options={getCommonCodeList('CARCAPACITY', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}
		</>
	);
};

export default KpCenterDayStateSearch;
