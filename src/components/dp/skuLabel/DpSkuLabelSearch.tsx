/*
 ############################################################################
 # FiledataField	: DpSkuLabelSearch.tsx
 # Description		: 입고 > 입고작업 > 입고라벨출력 조회 조건 화면
 # Author			: KimDongHyeon
 # Since			: 2025.08.07
 ############################################################################
*/

// Components
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';

// Store

// Libs

// Utils

const DpSkuLabelSearch = ({ form, initialValues, dates, setDates, activeKey }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const dateFormat = 'YYYY-MM-DD';
	const fixdccodeWatch = Form.useWatch('fixdccode', form);

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
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_DP')} //광역입고일자
					name="slipdt"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 물류센터 */}
				<CmGMultiDccodeSelectBox
					name={'fixdccode'}
					required
					onChange={() => {
						form.setFieldsValue({ organize: '', organizenm: '' });
					}}
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')} // 공급받는센터
				/>
			</li>
			<li>
				{/* 창고코드 */}
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
			<li>
				<MultiInputText
					label={t('lbl.SLIPNO_DP')} //입고전표번호
					name="docno"
					placeholder={t('msg.placeholder1', [t('lbl.SLIPNO_DP')])}
					// required
					// rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CmPartnerSearch
					form={form}
					selectionMode={'multipleRows'}
					name="fromCustkeyNm"
					code="fromCustkey"
					label={t('lbl.FROM_CUSTKEY_DP')} /*협력사코드*/
				/>
			</li>
			<li>
				<CmSkuSearch
					form={form} //상품
					selectionMode="multipleRows"
					name="skuName"
					code="sku"
					required={false}
				/>
			</li>
			<li>
				<SelectBox //저장조건
					name="storagetype"
					span={24}
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.STORAGETYPE')}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.ORDERTYPE_DP')} //구매유형
					name="ordertype"
					placeholder="선택해주세요"
					options={getCommonCodeList('ORDERTYPE_DP', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{activeKey === '2' && (
				<>
					<li>
						<InputText
							label={t('lbl.BLNO')} //B/L번호
							name="blno"
							placeholder={t('msg.placeholder1', [t('lbl.BLNO')])}
							// required
							// rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					<li>
						<InputText
							label={t('lbl.SERIALNO')} //이력번호
							name="serialno"
							placeholder={t('msg.placeholder1', [t('lbl.SERIALNO')])}
							// required
							// rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					<li>
						<CmCustSearch
							form={form}
							selectionMode={'singleRow'}
							name="contractcompanyNm"
							code="contractcompany"
							label={t('lbl.CONTRACTCOMPANY')} /*협력사코드*/
						/>
					</li>
					{/* 저장과 인쇄 같이인데, 요건삭제*/}
					{/*<li>*/}
					{/*	<CheckBox name={'labelPrintYn'} label="라벨출력여부" value={'Y'}></CheckBox>*/}
					{/*</li>*/}
				</>
			)}
		</>
	);
};

export default DpSkuLabelSearch;
