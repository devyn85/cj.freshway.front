/*
 ############################################################################
 # FiledataField	: DpReceiptSearch.tsx
 # Description		: 입고 > 입고작업 > 입고확정처리 조회 조건 화면
 # Author			: KimDongHyeon
 # Since			: 2025.08.22
 ############################################################################
*/

// Components
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, InputText, SelectBox, MultiInputText } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';

// Store

// Libs

// Utils

const DpReceiptSearch = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, initialValues, dates, setDates, activeKey, search } = props;

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
				<CmOrganizeSearch //창고
					form={props.form}
					selectionMode="multipleRows"
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={fixdccodeWatch}
					dccodeDisabled={true}
					placeholder={'해당 칸은 2170과 1000센터 대상에 한정됩니다.'}
					disabled={(() => {
						return fixdccodeWatch !== '2170' && fixdccodeWatch !== '1000';
					})()}
				/>
			</li>
			<li>
				<MultiInputText
					label={t('lbl.DOCNO_DP')} //구매번호
					name="docno"
					placeholder={t('msg.placeholder1', [t('lbl.DOCNO_DP')])}
					// required
					// rules={[{ required: true, validateTrigger: 'none' }]}
					onPressEnter={() => search()}
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
				<SelectBox //저장유무
					name="channel"
					span={24}
					options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.CHANNEL_DMD')}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.STATUS_DP')} //진행상태
					name="status"
					placeholder="선택해주세요"
					options={getCommonCodeList('STATUS_DP', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.ORDERTYPE_DP')} //구매유형
					name="ordertype"
					mode={'multiple'}
					placeholder="선택해주세요"
					options={getCommonCodeList('ORDERTYPE_DP', t('lbl.ALL'), 'all').filter((item: any) => !['90'].includes(item.comCd))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<CheckBox name={'crossyn'} label="C/D 상품만 표시" value={'Y'}></CheckBox>
			</li>
			<li></li>
			{activeKey === '2' && (
				<>
					<li>
						<InputText
							label={t('lbl.BLNO')} //B/L번호
							name="blno"
							placeholder={t('msg.placeholder1', [t('lbl.BLNO')])}
							onPressEnter={() => search()}
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
							onPressEnter={() => search()}
						/>
					</li>
					<li>
						<CmCustSearch
							form={form}
							selectionMode={'multipleRows'}
							name="wdCustkeyNm"
							code="wdCustkey"
							label={t('lbl.CONTRACTCOMPANY')} /*협력사코드*/
						/>
					</li>
				</>
			)}
		</>
	);
};

export default DpReceiptSearch;
