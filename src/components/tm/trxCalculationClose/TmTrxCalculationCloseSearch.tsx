/*
 ############################################################################
 # FiledataField	: TmTrxCalculationCloseSearch.tsx
 # Description		: 운송비정산마감
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 26.02.04
 ############################################################################
*/
// lib
// component
import { SelectBox } from '@/components/common/custom/form';

// store
import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Datepicker } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// api

// util

// hook

// type

// asset

const TmTrxCalculationCloseSearch = forwardRef((props: any, ref) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<Datepicker
					label={t('lbl.STDYYMM')} //기준년월
					name="sttlYm"
					format="YYYY-MM"
					picker="month"
					placeholder={'기준년월'}
					// onChange={onChange}
					allowClear
					required
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="single"
					label={t('lbl.DCCODENAME')} //물류센터
					required
					allLabel={t('lbl.SELECT')} //전체
					// disabled
				/>
			</li>
			<li>
				{/* 운송사조회 팝업 */}
				<CmCarrierSearch
					form={props.form}
					selectionMode="singleRow"
					name="courierName"
					code="courier"
					returnValueFormat="name"
					carrierType="LOCAL"
				/>
			</li>
			<li>
				{' '}
				<SelectBox
					name="closeYn"
					label={t('lbl.CLOSEYN')} //마감여부
					options={getCommonCodeList('YN2', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
});
export default TmTrxCalculationCloseSearch;
