/*
 ############################################################################
 # FiledataField	: StAdjustmentRequestSearch.tsx
 # Description		: 재고 > 재고조정 > 재고조정처리 (조회)
 # Author					: JiHoPark
 # Since					: 2025.10.10.
 ############################################################################
*/

// Lib

// Component
import { CheckBox, InputRange, InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

// Util
// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import styled from 'styled-components';
import { useAppSelector } from '@/store/core/coreHook';

// API

// Hooks

// lib

// hook

// type

// asset

interface StAdjustmentRequestSearchProps {
	form: any;
	getFilterZoneList: any;
	currentTabKey: string;
}

const StAdjustmentRequestSearch = (props: StAdjustmentRequestSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	const user = useAppSelector(state => state.user.userInfo);
	const userRoleArr = user.roles.split('|');
	const isUnder400 = userRoleArr.some(role => Number(role) < 400);
	const { form, getFilterZoneList, currentTabKey } = props;

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

	return (
		<>
			{/* 재고조정 요청 탭 */}
			{currentTabKey === '1' && (
				<>
					{/* 물류센터 */}
					<li>
						<CmGMultiDccodeSelectBox disabled={true} required />
					</li>
					{/* 창고 */}
					<li>
						<CmOrganizeSearch
							label={t('lbl.STORE')}
							form={form}
							name="oranizeName"
							dccode={form.gMultiDccode}
							code="organize"
							returnValueFormat="name"
							selectionMode="multipleRows"
						/>
					</li>
					{/* 상품코드/명 */}
					<li>
						<CmSkuSearch form={form} name="skuNm" code="sku" returnValueFormat="name" selectionMode="multipleRows" />
					</li>
					{/* 저장조건 */}
					<li>
						<SelectBox
							label={t('lbl.STORAGETYPE')}
							name="storagetype"
							options={getCommonCodeList('STORAGETYPE', '전체', '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 로케이션 */}
					<li>
						<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromloc" toName="toloc" />
					</li>
					{/* 피킹존 */}
					<li>
						<SelectBox
							label={t('lbl.ZONE')}
							name="zone"
							options={getFilterZoneList(form.gMultiDccode)}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
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
					{/* B/L번호 */}
					<li>
						<InputText label={t('lbl.CONVSERIALNO')} name="convserialno" />
					</li>
					{/* 이력번호 */}
					<li>
						<InputText label={t('lbl.SERIALNO')} name="serialno" />
					</li>
				</>
			)}
			{/* 재고조정 결재 탭 */}
			{currentTabKey === '3' && (
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
					{/* 물류센터 */}
					<li>
						<CmGMultiDccodeSelectBox disabled={true} required />
					</li>
					{/* 창고 */}
					<li>
						<CmOrganizeSearch
							label={t('lbl.STORE')}
							form={form}
							name="oranizeName3"
							dccode={form.gMultiDccode}
							selectionMode={'multipleRows'}
							code="organize3"
							returnValueFormat="name"
						/>
					</li>
					{/* 상품 */}
					<li>
						<CmSkuSearch
							label={t('lbl.SKU2')}
							form={form}
							name="skuNm3"
							code="sku3"
							returnValueFormat="name"
							selectionMode="multipleRows"
						/>
					</li>
				</>
			)}
			{/* 재고조정처리 */}
			{currentTabKey === '4' && (
				<>
					{/* 조회기간 */}
					<li>
						<Rangepicker
							label={t('lbl.SEARCH_TERM')}
							name="searchTermDt"
							format={'YYYY-MM-DD'}
							allowClear
							showNow={false}
						/>
					</li>
					{/* 물류센터 */}
					<li>
						<CmGMultiDccodeSelectBox disabled={true} required />
					</li>
					{/* 창고 */}
					<li>
						<CmOrganizeSearch
							label={t('lbl.STORE')}
							form={form}
							name="oranizeName4"
							dccode={form.gMultiDccode}
							code="organize4"
							returnValueFormat="name"
							selectionMode="multipleRows"
						/>
					</li>
					{/* 저장조건 */}
					<li>
						<SelectBox
							label={t('lbl.STORAGETYPE')}
							name="storagetype4"
							options={getCommonCodeList('STORAGETYPE', '전체', '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 상품 */}
					<li>
						<CmSkuSearch
							label={t('lbl.SKU2')}
							form={form}
							name="skuNm4"
							code="sku4"
							returnValueFormat="name"
							selectionMode="multipleRows"
						/>
					</li>
					{/* 피킹존 */}
					<li>
						<SelectBox
							label={t('lbl.ZONE')}
							name="zone4"
							options={getFilterZoneList(form.gMultiDccode)}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 재고위치 */}
					<li>
						<SelectBox
							label={t('lbl.STOCKTYPE')}
							name="stocktype4"
							options={getCommonCodeList('STOCKTYPE', '전체', '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 재고속성 */}
					<li>
						<SelectBox
							label={t('lbl.STOCKGRADE')}
							name="stockgrade4"
							options={getCommonCodeList('STOCKGRADE', '전체', '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* B/L번호 */}
					<li>
						<InputText label={t('lbl.CONVSERIALNO')} name="convserialno4" />
					</li>
					{/* 이력번호 */}
					<li>
						<InputText label={t('lbl.SERIALNO')} name="serialno4" />
					</li>
					{/* 진행상태 */}
					<li>
						<SelectBox
							label={t('lbl.STATUS_WD')}
							name="apprstatus"
							options={getCommonCodeList('APPROVALSTATUS', '전체', '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 구분 */}
					<li>
						<SelectBox
							label={t('lbl.GUBUN_2')}
							name="searchDate"
							options={getCommonCodeList('DATETYPE_ADJUST')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}
			{/* 재고금액 roles 400 이하 한개라도 있으면 표시 */}
			{isUnder400 && ['3', '4'].includes(currentTabKey) && (
				<>
					<InventoryAmountWrap>
						<CheckBox label={t('lbl.STOCK_AMOUNT')} name="viewPriceYn" trueValue={'Y'} falseValue={'N'}>
							{t('lbl.AMOUNT_DISP')}
						</CheckBox>
					</InventoryAmountWrap>
				</>
			)}
		</>
	);
};

export default StAdjustmentRequestSearch;

const InventoryAmountWrap = styled.li`
	.ant-checkbox + span {
		padding-inline-start: 4px;
		padding-inline-end: 4px;
	}
`;
