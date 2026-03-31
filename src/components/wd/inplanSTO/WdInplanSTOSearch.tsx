/*
 ############################################################################
 # FiledataField	: WdInplanSTOSearch.tsx
 # Description		: 광역출고현황 조회영역
 # Author			: YeoSeungCheol
 # Since			: 25.11.12
 ############################################################################
*/

import { Form } from 'antd';
// Component
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputText, MultiInputText, Rangepicker, SelectBox } from '@/components/common/custom/form';

// Lib

//Store
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useEffect } from 'react';

// API

const WdInplanSTOSearch = (props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { form, activeKey, fromDccode, toDccode } = props;
	// 다국어
	const { t } = useTranslation();

	const fixFromDccode = Form.useWatch('fromDccode', form);
	const fixToDccode = Form.useWatch('toDccode', form);
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	useEffect(() => {
		form.setFieldsValue({
			organizenm: '',
			organize: '',
		});
	}, [fixFromDccode]);

	useEffect(() => {
		form.setFieldsValue({
			organizenm2: '',
			organize2: '',
		});
	}, [fixToDccode]);

	return (
		<>
			<li>
				{/* 광역출고일자 */}
				<Rangepicker name="docdtWdSto" label={t('lbl.DOCDT_WD_STO')} />
			</li>
			<li>
				<CmGMultiDccodeSelectBox
					label={t('lbl.FROM_DCCODE')} // 공급센터
					name={'fromDccode'}
					// required
					mode={'single'}
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
				/>
			</li>
			<li>
				{/* 창고 - 공급센터 */}
				<CmOrganizeSearch
					form={form}
					selectionMode="multipleRows"
					name="organizenm"
					code="organize"
					returnValueFormat="name"
					dccode={Array.isArray(fixFromDccode) ? fixFromDccode[0] : fixFromDccode}
					label="창고(공급센터)"
					dccodeDisabled={true}
					placeholder={'해당 칸은 2170과 1000센터 대상에 한정됩니다.'}
					disabled={(() => {
						if (Array.isArray(fixFromDccode)) {
							if (fixFromDccode.length < 1) {
								return true;
							}
							return fixFromDccode.some((row: any) => row !== '2170' && row !== '1000');
						} else {
							return fixFromDccode !== '2170' && fixFromDccode !== '1000';
						}
					})()}
				/>
			</li>
			<li>
				{/* 주문번호 */}
				<MultiInputText name="docno" label="주문번호" />
			</li>
			<li>
				{/* 상품코드 */}
				<CmSkuSearch form={form} selectionMode="multipleRows" label={t('lbl.SKU')} name="skuName" code="sku" />
			</li>
			<li>
				<CmGMultiDccodeSelectBox
					name={'toDccode'}
					// required
					mode={'single'}
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.TO_DCCODE')} // 공급받는센터
				/>
			</li>
			<li>
				{/* 창고 - 공급받는센터 */}
				<CmOrganizeSearch
					form={form}
					selectionMode="multipleRows"
					name="organizenm2"
					code="organize2"
					returnValueFormat="name"
					dccode={Array.isArray(fixToDccode) ? fixToDccode[0] : fixToDccode}
					label="창고(공급받는센터)"
					dccodeDisabled={true}
					placeholder={'해당 칸은 2170과 1000센터 대상에 한정됩니다.'}
					disabled={(() => {
						if (Array.isArray(fixToDccode)) {
							if (fixToDccode.length < 1) {
								return true;
							}
							return fixToDccode.some((row: any) => row !== '2170' && row !== '1000');
						} else {
							return fixToDccode !== '2170' && fixToDccode !== '1000';
						}
					})()}
				/>
			</li>
			<li>
				{/* 진행상태 */}
				<SelectBox
					name="status"
					label="진행상태"
					options={getCommonCodeList('STATUS_WD', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>

			<li>
				{/* 저장조건 */}
				<SelectBox
					name="storagetype"
					label="저장조건"
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				{/* 삭제여부 */}
				<SelectBox
					name="delYn"
					label="삭제여부"
					options={getCommonCodeList('YN', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				{/* B/L 번호 */}
				<InputText name="blno" label="B/L 번호" />
			</li>
			<li>
				{/* 이력번호 */}
				<InputText name="serialno" label="이력번호" />
			</li>
			<li>
				{/* 계약업체 */}
				<CmCustSearch form={form} name="contractcompany" label="계약업체" code="custkey" />
			</li>
		</>
	);
};

export default WdInplanSTOSearch;
