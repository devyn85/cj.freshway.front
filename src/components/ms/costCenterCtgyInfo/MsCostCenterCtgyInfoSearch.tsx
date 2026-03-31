/*
 ############################################################################
 # FiledataField	: MsCostCenterCtgyInfoSearch.tsx
 # Description		: 거래처기준정보 > 마감기준정보 > 사업부상세조직분류
 # Author			: YeoSeungCheol
 # Since			: 25.12.08
 ############################################################################
*/
// Component
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { Datepicker, InputText, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface MsCostCenterCtgyInfoSearchProps {
	form: any;
	activeTabKey: string;
}

const MsCostCenterCtgyInfoSearch = (props: MsCostCenterCtgyInfoSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { form, activeTabKey } = props;
	// 다국어
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 탭별 조회조건 렌더링
	 * Tab1 (고객 조회조건) : 조회월 / 고객코드 / 대분류 / 중분류 / 소분류 / 군납여부(N/Y)
	 * Tab2 (미곡 조회조건) : 조회월 / 상품코드 / 중분류 / 소분류 / 미곡여부
	 * Tab3 (전용상품 조회조건) : 적용월 / 상품코드
	 */
	return (
		<>
			{/* Tab1: 고객 조회조건 */}
			{activeTabKey === '1' && (
				<>
					{/* 조회월 */}
					<li>
						<Datepicker
							label={t('lbl.SEARCH_MONTH')}
							name="applyYm"
							format="YYYY-MM"
							picker="month"
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.SEARCH_MONTH')])}
							required
						/>
					</li>
					{/* 고객코드 */}
					<li>
						<CmCustSearch form={form} name="custName" code="custkey" selectionMode="multipleRows" />
					</li>
					{/* 대분류 */}
					<li>
						<InputText
							name="lclNm"
							label={t('lbl.CLASS_BIG')}
							placeholder={t('msg.MSG_COM_VAL_055', [t('lbl.CLASS_BIG')])}
						/>
					</li>
					{/* 중분류 */}
					<li>
						<InputText
							name="mclNm"
							label={t('lbl.CLASS_MIDDLE')}
							placeholder={t('msg.MSG_COM_VAL_055', [t('lbl.CLASS_MIDDLE')])}
						/>
					</li>
					{/* 소분류 */}
					<li>
						<InputText
							name="sclNm"
							label={t('lbl.CLASS_SMALL')}
							placeholder={t('msg.MSG_COM_VAL_055', [t('lbl.CLASS_SMALL')])}
						/>
					</li>
					{/* 군납여부 */}
					<li>
						<SelectBox
							name="riceYn"
							label={t('lbl.ARMY_YN')}
							options={getCommonCodeList('YN', t('lbl.ALL'), null)}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.RICE_YN')])}
						/>
					</li>
				</>
			)}

			{/* Tab2: 미곡 조회조건 */}
			{activeTabKey === '2' && (
				<>
					{/* 조회월 */}
					<li>
						<Datepicker
							label={t('lbl.SEARCH_MONTH')}
							name="applyYm"
							format="YYYY-MM"
							picker="month"
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.SEARCH_MONTH')])}
							required
						/>
					</li>
					{/* 상품코드 */}
					<li>
						<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
					</li>
					{/* 대분류 */}
					<li>
						<InputText
							name="lclNm"
							label={t('lbl.CLASS_BIG')}
							placeholder={t('msg.MSG_COM_VAL_055', [t('lbl.CLASS_BIG')])}
						/>
					</li>
					{/* 중분류 */}
					<li>
						<InputText
							name="mclNm"
							label={t('lbl.CLASS_MIDDLE')}
							placeholder={t('msg.MSG_COM_VAL_055', [t('lbl.CLASS_MIDDLE')])}
						/>
					</li>
					{/* 소분류 */}
					<li>
						<InputText
							name="sclNm"
							label={t('lbl.CLASS_SMALL')}
							placeholder={t('msg.MSG_COM_VAL_055', [t('lbl.CLASS_SMALL')])}
						/>
					</li>
					{/* 미곡여부 */}
					<li>
						<SelectBox
							name="riceYn"
							label={t('lbl.RICE_YN')}
							options={getCommonCodeList('YN', t('lbl.ALL'), null)}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.RICE_YN')])}
						/>
					</li>
				</>
			)}

			{/* Tab3: 전용상품 조회조건 */}
			{activeTabKey === '3' && (
				<>
					{/* 적용월 */}
					<li>
						<Datepicker
							label={t('lbl.APPLY_MONTH')}
							name="applyYm"
							format="YYYY-MM"
							picker="month"
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.APPLY_MONTH')])}
							required
						/>
					</li>
					{/* 상품코드 */}
					<li>
						<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
					</li>
				</>
			)}
		</>
	);
};

export default MsCostCenterCtgyInfoSearch;
