/*
 ############################################################################
 # FiledataField	: KpSyncOrdMonitoringSearch.tsx
 # Description		: 주문동기화 모니터링 검색
 # Author			    :
 # Since			    :
 ############################################################################
*/
// lib
import { useTranslation } from 'react-i18next';

// component

import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

// store

// api

// util

// hook

// type

// asset
// 부모 SearchFormResponsive가 Form 컨텍스트를 제공하므로 form 인스턴스 prop 불필요
const KpSyncOrdMonitoringSearch = () => {
	const { t } = useTranslation();
	// 옵션: 전체 + DP, RT, WD, AJ, ST (value는 코드, label은 t('lbl.DP') 등)
	const doctypeOptions = [
		{ value: '', label: '전체' }, // 또는 t('lbl.ALL') 등
		{ value: 'DP', label: t('lbl.DP') },
		{ value: 'RT', label: t('lbl.RT') },
		{ value: 'WD', label: t('lbl.WD') },
		{ value: 'AJ', label: t('lbl.AJ') },
	];
	return (
		<>
			{/* 1행: 물류센터, 배송일자, 문서유형 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={'물류센터'}
					required
					rules={[
						{
							required: true,
							validateTrigger: 'none',
							message: '물류센터를 선택해주세요.',
						},
					]}
				/>
			</li>
			<li>
				<Rangepicker
					label={'배송일자'}
					name="pvcDeliveryDt"
					format="YYYY-MM-DD"
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<SelectBox name="docType" label={t('lbl.DOCTYPE')} options={doctypeOptions} initval={''} />
			</li>
			{/* 2행: 주문완료여부, 작업프로세스코드 */}
			<li style={{ gridColumn: '1', gridRow: '2' }}>
				<CheckBox name="orderCompleteYn" label={t('lbl.ORDERCOMPLETE_YN')} trueValue={'1'} falseValue={'0'}>
					*체크 시, 완료주문만 표기
				</CheckBox>
			</li>
			<li style={{ gridColumn: '2', gridRow: '2' }}>
				<InputText
					name="workProcessCode"
					label={t('lbl.WORKPROCESSCODE')}
					placeholder={t('lbl.WORKPROCESSCODE') + ' 입력'}
				/>
			</li>
		</>
	);
};
export default KpSyncOrdMonitoringSearch;
