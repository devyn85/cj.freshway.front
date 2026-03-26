/*
 ############################################################################
 # FiledataField	: KpDpShortageResultSearch.tsx
 # Description		: 지표 > 센터 운영 > 입고 결품 현황 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.09.08
 ############################################################################
*/

// Components
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import { SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux/es/hooks/useSelector';
// Libs

// Utils

const KpDpShortageResultSearch = ({ form, activeKey }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	//const dateFormat = 'YYYY-MM-DD';

	const { t } = useTranslation();

	// const rangeRef = useRef(null);

	// const [expanded, setExpanded] = useState(false);
	// const [showToggleBtn, setShowToggleBtn] = useState(false);
	// const groupRef = useRef<HTMLUListElement>(null);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	//const gDcname = useSelector((state: any) => state.global.globalVariable.gDccodeNm);

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
					//options={[{ dcname: t('lbl.ALL'), dccode: '' }, ...getUserDccodeList()]}
					options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 조회일자 */}
				<DatePicker
					label={t('lbl.DOCDT_DP')}
					name="docdt"
					allowClear
					showNow={true}
					format="YYYY-MM-DD"
					required={true}
				/>
			</li>
			{/* 일배요약_탭 */}
			{activeKey === '3' && (
				<>
					<li>
						{/* 결품사유 */}
						<SelectBox
							label={t('lbl.REASONCODE_DP')}
							name="reasoncode"
							options={getCommonCodeList('REASONCODE_WD', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}
			{/* 저장요약_탭 */}
			{activeKey === '4' && (
				<>
					<li>
						{/* 결품사유 */}
						<SelectBox
							label={t('lbl.REASONCODE_DP')}
							name="reasoncode"
							options={getCommonCodeList('REASONCODE_DP', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}

			<li>
				{/* 귀책구분 */}
				<SelectBox
					label={t('lbl.OTHER01_DMD_RT')}
					name="reasontype"
					options={getCommonCodeList('OTHER01_DMD', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 일배_탭 */}
			{activeKey === '1' && (
				<>
					<li>
						{/* 협력사코드 */}
						<CmPartnerSearch
							form={form}
							selectionMode={'multipleRows'}
							name="vendor"
							code="fromCustkey"
							label={t('lbl.FROM_CUSTKEY_DP')}
						/>
					</li>
				</>
			)}
			{/* 저장_탭 */}
			{activeKey === '2' && (
				<>
					<li>
						{/* 수급담당 */}
						<SelectBox
							label={t('lbl.POMDCODE')}
							name="pomdcode"
							options={getCommonCodeList('BUYERKEY', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					<li>
						{/* 협력사코드 */}
						<CmPartnerSearch
							form={form}
							selectionMode={'multipleRows'}
							name="vendor"
							code="fromCustkey"
							label={t('lbl.FROM_CUSTKEY_DP')} /*협력사코드*/
						/>
					</li>
				</>
			)}
			{/* 일배요약_탭 */}
			{activeKey === '3' && (
				<>
					<li>
						{/* 협력사코드 */}
						<CmPartnerSearch
							form={form}
							selectionMode={'multipleRows'}
							name="fromCustkeyNm"
							code="fromCustkey"
							label={t('lbl.FROM_CUSTKEY_DP')} /*협력사코드*/
						/>
					</li>
				</>
			)}
			{/* 저장요약_탭 */}
			{activeKey === '4' && (
				<>
					<li>
						{/* 수급담당 */}
						<SelectBox
							label={t('lbl.POMDCODE')}
							name="pomdcode"
							options={getCommonCodeList('BUYERKEY', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					<li>
						{/* 협력사코드 */}
						<CmPartnerSearch
							form={form}
							selectionMode={'multipleRows'}
							name="fromCustkeyNm"
							code="fromCustkey"
							label={t('lbl.FROM_CUSTKEY_DP')}
						/>
					</li>
				</>
			)}
		</>
	);
};

export default KpDpShortageResultSearch;
