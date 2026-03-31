/*
 ############################################################################
 # FiledataField	: WdShipmentETCEXDCSearch.tsx
 # Description		: 출고 > 기타출고 > 외부센터매각출고처리 (조회)
 # Author					: JiHoPark
 # Since					: 2025.09.11.
 ############################################################################
*/

// Lib

// Component
import { InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';

// Util

// Store
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// API

// Hooks

// lib

// hook

// type

// asset

interface WdShipmentETCEXDCSearchProps {
	form: any;
	currentTabKey: string;
}

const WdShipmentETCEXDCSearch = (props: WdShipmentETCEXDCSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const { form, currentTabKey } = props;

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	/**
	 * 조회조건 focus
	 */
	useEffect(() => {
		let searchId = '';
		if (currentTabKey === '1') {
			searchId = 'oranizeName';
		} else if (currentTabKey === '2') {
			searchId = 'basedtFromTo';
		} else if (currentTabKey === '3') {
			searchId = 'oranizeName3';
		}

		if (commUtil.isNotEmpty(searchId)) {
			const input = document.querySelector('input[id=' + searchId + ']') as HTMLInputElement;
			input?.focus();
		}
	}, [currentTabKey]);

	return (
		<>
			{currentTabKey === '1' && (
				<>
					<li>
						<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODENAME')} required disabled />
					</li>
					<li>
						<CmOrganizeSearch // 창고
							form={form}
							name="oranizeName"
							dccode={'2170'}
							code="organize"
							returnValueFormat="name"
						/>
					</li>
					<li>
						<CmSkuSearch // 상품
							form={form}
							name="skuNm"
							code="sku"
							returnValueFormat="name"
							selectionMode="multipleRows"
						/>
					</li>
					<li></li>
					<li>
						<MultiInputText
							label={t('lbl.CONVSERIALNO')} // B/L번호
							name="convserialno"
						/>
					</li>
					<li>
						<SelectBox
							label={t('lbl.STOCKGRADE')} // 재고속성
							name="stockgrade"
							options={getCommonCodeList('STOCKGRADE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}
			{currentTabKey === '2' && (
				<>
					<li>
						<Rangepicker
							label={t('lbl.BASEDT')} // 기준일
							name="basedtFromTo"
							format={'YYYY-MM-DD'} // 화면에 표시될 형식
							allowClear
							showNow={false}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					<li>
						<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODENAME')} required disabled />
					</li>
					<li>
						<CmOrganizeSearch // 창고
							form={form}
							name="oranizeName2"
							dccode={'2170'}
							selectionMode={'multipleRows'}
							code="organize2"
							returnValueFormat="name"
						/>
					</li>
					<li>
						<CmSkuSearch // 상품
							form={form}
							name="skuNm2"
							code="sku2"
							returnValueFormat="name"
							selectionMode="multipleRows"
						/>
					</li>
				</>
			)}
			{currentTabKey === '3' && (
				<>
					<li>
						<Rangepicker
							label={'조정요청일자'}
							name="apprreqdtSlipdtFromTo"
							format={'YYYY-MM-DD'} // 화면에 표시될 형식
							allowClear
							showNow={false}
						/>
					</li>
					<li>
						<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODENAME')} required disabled />
					</li>
					<li>
						<CmOrganizeSearch // 창고
							form={form}
							name="oranizeName3"
							dccode={'2170'}
							selectionMode={'multipleRows'}
							code="organize3"
							returnValueFormat="name"
						/>
					</li>
					<li>
						<CmSkuSearch // 상품
							form={form}
							name="skuNm3"
							code="sku3"
							returnValueFormat="name"
							selectionMode="multipleRows"
						/>
					</li>
					<li>
						<MultiInputText
							label={t('lbl.CONVSERIALNO')} // B/L번호
							name="convserialno3"
						/>
					</li>
					<li>
						<InputText
							label={t('lbl.SERIALNO')} // 이력번호
							name="serialno3"
						/>
					</li>
					<li>
						<SelectBox
							label={t('lbl.STOCKTYPE')} // 재고위치
							name="stocktype3"
							options={getCommonCodeList('STOCKTYPE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					<li>
						<SelectBox
							label={t('lbl.STOCKGRADE')} // 재고속성
							name="stockgrade3"
							options={getCommonCodeList('STOCKGRADE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					<li>
						<SelectBox
							label={t('lbl.STATUS')} // 진행상태
							name="apprstatus"
							options={getCommonCodeList('APPROVALSTATUS', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					<li>
						<SelectBox
							label={t('lbl.DATE_TYPE')} // 일자유형
							name="searchDate"
							options={getCommonCodeList('DATETYPE_ADJUST')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}
		</>
	);
};

export default WdShipmentETCEXDCSearch;
