/*
 ############################################################################
 # FiledataField	: RtReceiptConfirmExDcSearch.tsx
 # Description		: 외부치축반품확정처리 검색조건
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.22
 ############################################################################
*/

// CSS
// Component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputText, MultiInputText, Rangepicker, SelectBox } from '@/components/common/custom/form';
// Lib
import { Form } from 'antd';
// Utils
//store
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { getCommonCodeList } from '@/store/core/comCodeStore';
// API Call Function

const RtReceiptConfirmExDcSearch = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const form = props.form;
	const { t } = useTranslation();
	const dccode = Form.useWatch('fixdccode', form);

	// 피킹존 옵션 상태
	const [zoneOptions, setZoneOptions] = useState([]);
	const dcCode = Form.useWatch('fixDcCode', props.form);

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		// 대
	}, []);

	return (
		<>
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_RT')}
					name="slipdtRange"
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox
					mode={'single'}
					name={'fixDcCode'}
					label={t('lbl.DCCODENAME')}
					rules={[{ required: true }]}
					disabled
				/>
			</li>
			<li>
				<CmOrganizeSearch //창고
					form={props.form}
					selectionMode="singlRow"
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={props.form.getFieldValue('fixDcCode')}
				/>
			</li>
			<li>
				{/* 고객주문번호 */}
				<InputText name="docnoWd" label={t('lbl.DOCNO_RT')} />
			</li>
			<li>
				{/* 회수여부 */}
				<SelectBox
					name="returnType"
					label={t('lbl.RETURNYN')}
					options={getCommonCodeList('RETURNTYPE_RT', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				{/* 상품 */}
				<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			<li>
				<SelectBox //저장조건
					name="storagetype"
					label={t('lbl.STORAGETYPE')}
					span={24}
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
				/>
			</li>
			<li>
				{/* 저장유무 */}
				<SelectBox
					name="channel"
					label={t('lbl.CHANNEL_DMD')}
					options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				{/* B/L번호 */}
				<MultiInputText name="blNo" label={t('lbl.BLNO')} />
			</li>
			<li>
				{/* 이력번호 */}
				<InputText name="serialNo" label={t('lbl.SERIALNO')} />
			</li>
			<li>
				{/* 계약업체 */}
				<CmCustSearch
					form={form}
					selectionMode="multipleRows"
					name="wdCustKeyNm"
					code="wdCustKey"
					returnValueFormat="name"
					label={t('lbl.CONTRACTCOMPANY')}
				/>
			</li>
			<li>
				{/* 진행상태 */}
				<SelectBox
					name="status"
					label={t('lbl.STATUS')}
					options={getCommonCodeList('STATUS_RT', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				{/* 고객반품주문번호  */}
				<InputText name="docNo" label={t('lbl.SOURCEKEY_RT')} />
			</li>
			<li>
				{/* 이력번호유무 */}
				<SelectBox
					name="serialYn"
					label={t('lbl.SERIALNO_YN')}
					options={getCommonCodeList('SERIALYN', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default RtReceiptConfirmExDcSearch;
