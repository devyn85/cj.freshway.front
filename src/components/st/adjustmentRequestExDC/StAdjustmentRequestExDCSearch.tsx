/*
 ############################################################################
 # FiledataField	: StAdjustmentRequestExDCSearch.tsx
 # Description		: 재고 > 재고조정 > 외부비축재고조정처리 (재고 조정 요청 조회)
 # Author					: JiHoPark
 # Since					: 2025.08.25.
 ############################################################################
*/

// Lib
import { Form } from 'antd';

// Component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

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

interface StAdjustmentRequestExDCSearchProps {
	form: any;
	currentTabKey: string;
}

const StAdjustmentRequestExDCSearch = (props: StAdjustmentRequestExDCSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const { form, currentTabKey } = props;

	const dateCondType = Form.useWatch('searchDate', form);

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
					{/* 물류센터코드/명 */}
					<li>
						<SelectBox
							name="fixdccode"
							span={24}
							options={getCommonCodeList('SUPPLY_DC').map(item => ({
								...item,
								cdNm: item.comCd ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
							}))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							label={t('lbl.DCCODENAME')}
							required
							disabled
						/>
					</li>
					{/* 창고코드/명 */}
					<li>
						<CmOrganizeSearch
							form={form}
							name="oranizeName"
							selectionMode={'multipleRows'}
							dccode={'2170'}
							code="organize"
							returnValueFormat="name"
						/>
					</li>
					{/* 상품코드/명 */}
					<li>
						<CmSkuSearch form={form} name="skuNm" code="sku" returnValueFormat="name" selectionMode="multipleRows" />
					</li>
					{/* B/L번호 */}
					<li>
						<MultiInputText label={t('lbl.CONVSERIALNO')} name="convserialno" />
					</li>
					{/* 이력번호 */}
					<li>
						<InputText label={t('lbl.SERIALNO')} name="serialno" />
					</li>
					{/* 재고위치 */}
					<li>
						<SelectBox
							label={t('lbl.STOCKTYPE')}
							name="stocktype"
							options={getCommonCodeList('STOCKTYPE', '전체', '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 재고속성 */}
					<li>
						<SelectBox
							label={t('lbl.STOCKGRADE')}
							name="stockgrade"
							options={getCommonCodeList('STOCKGRADE', '전체', '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}
			{currentTabKey === '2' && (
				<>
					{/* 기준일 */}
					<li>
						<Rangepicker
							label={t('lbl.BASEDT')}
							name="basedtFromTo"
							format={'YYYY-MM-DD'}
							allowClear
							showNow={false}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					{/* 물류센터코드/명 */}
					<li>
						<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODENAME')} required disabled />
					</li>
					{/* 창고코드/명 */}
					<li>
						<CmOrganizeSearch
							form={form}
							name="oranizeName2"
							dccode={'2170'}
							selectionMode={'multipleRows'}
							code="organize2"
							returnValueFormat="name"
						/>
					</li>
					{/* 상품코드/명 */}
					<li>
						<CmSkuSearch form={form} name="skuNm2" code="sku2" returnValueFormat="name" selectionMode="multipleRows" />
					</li>
				</>
			)}
			{currentTabKey === '3' && (
				<>
					{/* 조정요청일자 */}
					<li>
						<Rangepicker
							label={dateCondType === 'APPRREQDT' ? t('lbl.ADJUST_REQ_DATE') : t('lbl.TASKDT_AJ')}
							name="apprreqdtSlipdtFromTo"
							format={'YYYY-MM-DD'}
							allowClear
							showNow={false}
						/>
					</li>
					{/* 물류센터코드/명 */}
					<li>
						<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODENAME')} required disabled />
					</li>
					{/* 창고코드/명 */}
					<li>
						<CmOrganizeSearch
							form={form}
							name="oranizeName3"
							dccode={'2170'}
							selectionMode={'multipleRows'}
							code="organize3"
							returnValueFormat="name"
						/>
					</li>
					{/* 상품코드/명 */}
					<li>
						<CmSkuSearch form={form} name="skuNm3" code="sku3" returnValueFormat="name" selectionMode="multipleRows" />
					</li>
					{/* B/L번호 */}
					<li>
						<MultiInputText label={t('lbl.CONVSERIALNO')} name="convserialno3" />
					</li>
					{/* 이력번호 */}
					<li>
						<InputText label={t('lbl.SERIALNO')} name="serialno3" />
					</li>
					{/* 재고위치 */}
					<li>
						<SelectBox
							label={t('lbl.STOCKTYPE')}
							name="stocktype3"
							options={getCommonCodeList('STOCKTYPE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 재고속성 */}
					<li>
						<SelectBox
							label={t('lbl.STOCKGRADE')}
							name="stockgrade3"
							options={getCommonCodeList('STOCKGRADE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 진행상태 */}
					<li>
						<SelectBox
							label={t('lbl.STATUS')}
							name="apprstatus"
							options={getCommonCodeList('APPROVALSTATUS', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 일자유형 */}
					<li>
						<SelectBox
							label={t('lbl.DATE_TYPE')}
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

export default StAdjustmentRequestExDCSearch;
