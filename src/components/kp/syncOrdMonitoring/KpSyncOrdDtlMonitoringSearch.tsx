/*
 ############################################################################
 # File name    : KpSyncOrdDtlMonitoringSearch.tsx
 # Description  : 주문동기화 상세 모니터링 검색
 # Author       :
 # Since        :
 ############################################################################
*/
// lib
import { Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';

// component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Rangepicker, SelectBox } from '@/components/common/custom/form';

// store
// api
// util
// hook
// type
import type { KpSyncOrdDtlTabType } from '@/components/kp/syncOrdMonitoring/KpSyncOrdDtlMonitoringDetail';
// asset

interface KpSyncOrdDtlMonitoringSearchProps {
	form: any;
	/** KpSyncOrdMonitoring에서 진입 시 조회 조건 비활성화 */
	disabled?: boolean;
	/** 재고(ST) 탭 선택 시 TASKTYPE SelectBox 노출 */
	activeTabKey?: KpSyncOrdDtlTabType;
}

const KpSyncOrdDtlMonitoringSearch = (props: KpSyncOrdDtlMonitoringSearchProps) => {
	const { form, disabled = false, activeTabKey = 'DP' } = props;
	const { t } = useTranslation();

	/** 문서번호·전표일자 둘 다 비면 조회 불가 (둘 중 하나는 필수) */
	const requireDocnoOrSlipdt = (_: any, value: any) => {
		const docnoFilled = value != null && String(value).trim() !== '';
		const slipdt = form?.getFieldValue?.('pvcSlipdt');
		const slipdtFilled = Array.isArray(slipdt) && slipdt[0] != null && slipdt[1] != null;
		if (docnoFilled || slipdtFilled) return Promise.resolve();
		return Promise.reject(new Error('문서번호 또는 전표일자(기간)를 입력해주세요.'));
	};

	const tasktypeOptions = [
		{ value: '', label: '전체' },
		{ value: 'CG', label: t('lbl.CG') },
		{ value: 'CCL', label: t('lbl.CCL') },
		{ value: 'RP', label: t('lbl.RP') },
		{ value: 'MV', label: t('lbl.MV') },
	];

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={'물류센터'}
					required
					disabled={disabled}
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
				<Form.Item
					label="문서번호"
					name="docno"
					dependencies={['pvcSlipdt']}
					rules={[{ validator: requireDocnoOrSlipdt, validateTrigger: 'onSubmit' }]}
				>
					<Input placeholder="문서번호를 입력해 주세요." allowClear disabled={disabled} />
				</Form.Item>
			</li>
			<li>
				<Form.Item label="문서라인" name="docline">
					<Input placeholder="문서라인을 입력해 주세요." allowClear disabled={disabled} />
				</Form.Item>
			</li>
			<li>
				<Rangepicker
					label={t('lbl.SLIPDT')}
					name="pvcSlipdt"
					format="YYYY-MM-DD"
					allowClear
					showNow={false}
					disabled={disabled}
				/>
			</li>
			{activeTabKey === 'ST' && (
				<li>
					<SelectBox
						name="tasktype"
						label={t('lbl.TASKTYPE')}
						options={tasktypeOptions}
						fieldNames={{ label: 'label', value: 'value' }}
						placeholder="선택해주세요"
						disabled={disabled}
						initval=""
					/>
				</li>
			)}
		</>
	);
};

export default KpSyncOrdDtlMonitoringSearch;
