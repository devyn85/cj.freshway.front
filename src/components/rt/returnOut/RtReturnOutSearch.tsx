/*
 ############################################################################
 # FiledataField	: RtReturnOutSearch.tsx
 # Description		: 반품 > 반품작업 > 협력사반품지시 조회 조건 화면
 # Author			: KimDongHyeon
 # Since			: 2025.10.13
 ############################################################################
*/

// Components
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputRange, InputText, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';

// Store

// Libs

// Utils

const RtReturnOutSearch = ({ form, initialValues, dates, setDates, activeKey }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const fixdccodeWatch = Form.useWatch('fixdccode', form);
	const dateFormat = 'YYYY-MM-DD';

	const { t } = useTranslation();

	const rangeRef = useRef(null);

	const [expanded, setExpanded] = useState(false);
	const [showToggleBtn, setShowToggleBtn] = useState(false);
	const groupRef = useRef<HTMLUListElement>(null);

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

	return (
		<>
			{/* 물류센터(물류센터 코드/명) */}
			<li>
				<CmGMultiDccodeSelectBox
					name={'fixdccode'}
					required
					onChange={() => {
						form.setFieldsValue({ organize: '', organizenm: '' });
					}}
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')}
				/>
			</li>
			<li>
				{/* 창고코드/명 */}
				<CmOrganizeSearch
					dccodeDisabled={true}
					form={form}
					label={'창고코드/명'}
					selectionMode="multipleRows"
					name="organizenm"
					code="organize"
					returnValueFormat="name"
					dccode={fixdccodeWatch}
				/>
			</li>
			{/* 재고위치 */}
			<li>
				<SelectBox
					label={t('lbl.STOCKTYPE')}
					name="stocktype"
					placeholder="선택해주세요"
					options={getCommonCodeList('STOCKTYPE').filter(item => item.comCd !== 'GOOD')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 재고속성 */}
			<li>
				<SelectBox
					name="stockgrade"
					span={24}
					options={getCommonCodeList('STOCKGRADE', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.STOCKGRADE')}
				/>
			</li>
			{/* 협력사코드(협력사코드/명) */}
			<li>
				<CmPartnerSearch
					form={form}
					selectionMode={'multipleRows'}
					name="fromCustkeyNm"
					code="fromCustkey"
					label={t('lbl.FROM_CUSTKEY_DP')}
				/>
			</li>
			{/* 상품코드/명 */}
			<li>
				<CmSkuSearch form={form} selectionMode="multipleRows" name="skuName" code="sku" required={false} />
			</li>
			{/* 식별번호유무 */}
			<li>
				<SelectBox
					name="serialyn"
					span={24}
					options={getCommonCodeList('SERIALYN', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.SERIALYN')}
				/>
			</li>
			{/* 로케이션 */}
			<li>
				<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromloc" toName="toloc" />
			</li>
			{/* B/L번호 */}
			<li>
				<InputText
					label={t('lbl.BLNO')}
					name="blno"
					placeholder={t('msg.placeholder1', [t('lbl.BLNO')])}
					// required
					// rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 이력번호 */}
			<li>
				<InputText
					name="serialno"
					label={t('lbl.SERIALNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.SERIALNO')])}
					allowClear
				/>
			</li>
			{/* 계약업체 */}
			<li>
				<CmCustSearch
					form={form}
					name="dpCustkeyName"
					code="dpCustkey"
					selectionMode="multipleRows"
					returnValueFormat="name"
					label={t('lbl.CONTRACTCOMPANY')}
				/>
			</li>
		</>
	);
};

export default RtReturnOutSearch;
