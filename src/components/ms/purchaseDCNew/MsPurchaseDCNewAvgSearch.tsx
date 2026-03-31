/*
 ############################################################################
 # FiledataField	: MsPurchaseDCNewSearch.tsx
 # Description		: 기준정보 > 센터기준정보 > 수급마스터관리
 # Author			: JeongHyeongCheol
 # Since			: 25.06.26
 ############################################################################
*/
// component
import CmCustBrandSearch from '@/components/cm/popup/CmCustBrandSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Datepicker, SelectBox } from '@/components/common/custom/form';

// CSS

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';
// lib

interface MsPurchaseDCNewMonthSearchProps {
	form: any;
}
const MsPurchaseDCNewMonthSearch = (props: MsPurchaseDCNewMonthSearchProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { form } = props;
	// const dates = dayjs();
	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<Datepicker
					label={t('lbl.SEARCH_MONTH')} // 조회월
					name="yyyymm"
					allowClear
					showNow={true}
					format="YYYY-MM"
					picker="month"
					// defaultValue={dates} // 초기값 설정
					rules={[{ required: true, validateTrigger: 'none' }]}
					required
				/>
			</li>
			<li>
				<SelectBox
					name="buyerkey"
					span={24}
					options={getCommonCodeList('BUYERKEY', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.POMDCODE')} // 수급담당
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox
					name="dccode"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={t('lbl.DCCODE')} // 물류센터
				/>
			</li>
			<li>
				<SelectBox
					name="reference15"
					span={24}
					options={getCommonCodeList('YN', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.CHAINONLY')} // 체인전용
				/>
			</li>
			<li>
				<CmPartnerSearch form={form} name="partnerName" code="fromCustkey" selectionMode="multipleRows" />
			</li>
			<li>
				<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			<li>
				<SelectBox
					name="storagetype"
					span={24}
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.STORAGETYPE')} // 저장조건
				/>
			</li>
			<li>
				<CmCustBrandSearch
					form={form}
					name="custBrandName"
					code="parentCustkey"
					selectionMode="multipleRows"
					label={t('lbl.BRAND_CUSTKEY')} // 본점코드
				/>
			</li>
			<li>
				<SelectBox
					name="stockYn"
					span={24}
					options={getCommonCodeList('YN', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.STOCKYN')} // 재고유무
				/>
			</li>
		</>
	);
};

export default MsPurchaseDCNewMonthSearch;
