/*
 ############################################################################
 # FiledataField	: IbTirdPartyMastSearch.tsx
 # Description		: 정산	> 3PL 수수료 > 일배 물류대행 파트너사 수수료 정산 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.09.25
 ############################################################################
*/

// Components
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import { Rangepicker, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Store
import { getUserDccodeList } from '@/store/core/userStore';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
// Libs

// Utils

const IbTirdPartyMastSearch = ({ form, dates, activeKey }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const dateFormat = 'YYYY-MM-DD';

	const { t } = useTranslation();

	// const rangeRef = useRef(null);

	// const [expanded, setExpanded] = useState(false);
	// const [showToggleBtn, setShowToggleBtn] = useState(false);
	// const groupRef = useRef<HTMLUListElement>(null);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	// const gDcname = useSelector((state: any) => state.global.globalVariable.gDccodeNm);

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
		// const today = dayjs();
		// const firstDay = today.startOf('month');
		// const lastDay = today.endOf('month');
		// setDates([firstDay, lastDay]);
		// form.setFieldValue('calSlipdt', [firstDay, lastDay]);
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
			{/* 단가마스터_탭*/}
			{activeKey === '1' && <></>}
			{/* 협력사관리_탭 */}
			{activeKey === '2' && (
				<>
					<li>
						{/* 협력사코드 */}
						<CmPartnerSearch
							form={form}
							name="fromCustkeyNm"
							code="fromCustkey"
							selectionMode={'multipleRows'}
							label={t('lbl.FROM_CUSTKEY_DP')}
						/>
					</li>
				</>
			)}
			{/* 검수관리_탭 */}
			{activeKey === '3' && (
				<>
					<li>
						{/* 입고일자 */}
						<Rangepicker
							label={t('lbl.DOCDT_DP')} //입고일자
							name="calDocdt"
							defaultValue={dates}
							format={dateFormat}
							allowClear
							showNow={false}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					<li>
						{/* 협력사코드 */}
						<CmPartnerSearch
							form={form}
							name="fromCustkeyNm"
							code="fromCustkey"
							selectionMode={'multipleRows'}
							label={t('lbl.FROM_CUSTKEY_DP')}
						/>
					</li>
					<li>
						{/* 일배구분 */}
						<SelectBox
							label={t('lbl.PUTAWAYTYPE_WD')}
							name="ordertype"
							options={getCommonCodeList('PUTAWAYTYPE3PL', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					<li>
						{/* 진행상태 */}
						<SelectBox
							label={t('lbl.STATUS_DP')}
							name="status"
							options={getCommonCodeList('INSPECT_STATUS', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}
			{/* 정산관리_탭 */}
			{activeKey === '4' && (
				<>
					<li>
						{/* 입고일자 */}
						<Rangepicker
							label={t('lbl.DOCDT_DP')} //입고일자
							name="calSlipdt"
							defaultValue={dates} // 초기값 설정
							format={dateFormat} // 화면에 표시될 형식
							allowClear
							showNow={false}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					<li>
						{/* 협력사코드 */}
						<CmPartnerSearch
							form={form}
							name="fromCustkeyNm"
							code="fromCustkey"
							selectionMode={'multipleRows'}
							label={t('lbl.FROM_CUSTKEY_DP')} /*협력사코드*/
						/>
					</li>
					<li>
						{/* 거래처코드 */}
						<CmCustSearch
							form={form}
							name="toCustkeyNm"
							code="toCustkey"
							selectionMode={'multipleRows'}
							label={t('lbl.CUST_CODE')}
						/>
					</li>
					<li>
						{/* 확정유무 */}
						<SelectBox
							label={t('lbl.CONFIRM_YN')}
							name="confirmyn"
							options={getCommonCodeList('CFYN_3PL', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}
		</>
	);
};

export default IbTirdPartyMastSearch;
