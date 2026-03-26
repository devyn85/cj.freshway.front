/*
 ############################################################################
 # FiledataField	: StAdjustmentBatchSearch.tsx
 # Description		: 재고 > 재고조정 > 일괄재고조정 (조회)
 # Author					: JiHoPark
 # Since					: 2025.09.15.
 ############################################################################
*/

// Lib

// Component
import { InputText, SelectBox } from '@/components/common/custom/form';

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

// Util

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// API

// Hooks

// lib

// hook

// type

// asset

interface StAdjustmentBatchSearchProps {
	form: any;
	zoneList: any;
}

const StAdjustmentBatchSearch = (props: StAdjustmentBatchSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const { form, zoneList } = props;

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
			<li>
				<CmGMultiDccodeSelectBox disabled={true} required />
			</li>
			<li>
				<CmOrganizeSearch
					label={t('lbl.STORE')} // 창고
					form={form}
					name="oranizeName"
					dccode={form.gMultiDccode}
					code="organize"
					returnValueFormat="name"
				/>
			</li>
			<li>
				<CmSkuSearch
					label={t('lbl.SKU2')} // 상품
					form={form}
					name="skuNm"
					code="sku"
					returnValueFormat="name"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.STORAGETYPE')} // 저장조건
					name="storagetype"
					options={getCommonCodeList('STORAGETYPE', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.WODURATIOYN')} // 유통기한여부
					name="lottable01yn"
					options={getCommonCodeList('YN', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.STOCKTYPE')} // 재고위치
					name="stocktype"
					options={getCommonCodeList('STOCKTYPE', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.STOCKGRADE')} // 재고속성
					name="stockgrade"
					options={getCommonCodeList('STOCKGRADE', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<InputText
					label={t('lbl.SERIALNO')} // 이력번호
					name="serialno"
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.ZONE')} // 피킹존
					name="zone"
					options={zoneList}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<InputText
					label={t('lbl.FROMLOC')} // FROM 로케이션
					name="fromloc"
				/>
			</li>
			<li>
				<InputText
					label={t('lbl.TOLOCLABEL')} // TO 로케이션
					name="toloc"
				/>
			</li>
			<li>
				<InputText
					label={t('lbl.CONVSERIALNO')} // B/L번호
					name="convserialno"
				/>
			</li>
		</>
	);
};

export default StAdjustmentBatchSearch;
