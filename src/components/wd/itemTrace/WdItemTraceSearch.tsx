/*
 ############################################################################
 # FiledataField	: WdItemTraceSearch.tsx
 # Description		: 모니터링 > 검수 > 검수 공정별 현황 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.11.17
 ############################################################################
*/

// Components
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { useSelector } from 'react-redux';

// Store

// Libs

// Utils

const WdItemTraceSearch = ({ form }: any) => {
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
					name="deliverydate"
					allowClear
					showNow={true}
					format="YYYY-MM-DD"
					required={true}
				/>
			</li>
			<li>
				{/* 저장유무 */}
				<SelectBox
					name="channel"
					options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.CHANNEL_DMD')}
				/>
			</li>
			<li>
				{/* 상품코드 */}
				<CmSkuSearch label={t('lbl.SKUCD')} form={form} code="sku" name="skuName" selectionMode="multipleRows" />
			</li>
			<li>
				{/* 저장조건 */}
				<SelectBox
					label={t('lbl.STORAGETYPE')}
					name="storagetype"
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				{/* 협력사 */}
				<CmPartnerSearch
					form={form}
					name="fromCustkeyName"
					code="fromCustkey"
					label={t('lbl.VENDOR')}
					selectionMode={'multipleRows'}
				/>
			</li>
			<li>
				{/* 관리처 */}
				<CmCustSearch
					form={form}
					name="toCustkeyName"
					code="toCustkey"
					label={t('lbl.FROM_CUSTKEY_RT')}
					selectionMode={'multipleRows'}
				/>
			</li>
			<li>
				{/* 주문번호 */}
				<InputText
					// onPressEnter={searchMasterList}
					label={t('lbl.ORDRNUM')}
					name="docno"
					placeholder={t('msg.placeholder1', [t('lbl.ORDRNUM')])}
				/>
			</li>
			<li>
				{/* 결품여부 */}
				<SelectBox
					label={t('lbl.SHORTAGE_YN2')}
					name="shortageYn"
					options={[
						{ cdNm: t('lbl.ALL'), comCd: '' },
						{ cdNm: 'Yes', comCd: 'Y' },
						{ cdNm: 'No', comCd: 'N' },
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default WdItemTraceSearch;
