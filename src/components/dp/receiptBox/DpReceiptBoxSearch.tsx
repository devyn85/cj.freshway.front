/*
 ############################################################################
 # FiledataField	: DpReceiptBoxSearch.tsx
 # Description		: 입고 > 입고작업 > 입고확정처리(수원3층) 조회 조건 화면
 # Author			: KimDongHyeon
 # Since			: 2025.09.08
 ############################################################################
*/

// Components
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import { Form } from 'antd';

// Store

// Libs

// Utils

const DpReceiptBoxSearch = ({ form, initialValues, dates, setDates, activeKey }: any) => {
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
				<InputText
					label={t('lbl.DOCNO_DP')} //구매번호
					name="docno"
					placeholder={t('msg.placeholder1', [t('lbl.DOCNO_DP')])}
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
					placeholder="선택해주세요"
					options={getCommonCodeList('ORDERTYPE_DP', t('lbl.ALL')).filter((item: any) => !['90'].includes(item.comCd))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default DpReceiptBoxSearch;
