/*
 ############################################################################
 # FiledataField	: StAdjustResultSearch.tsx
 # Description		: 재고감모현황 Search
 # Author			: 공두경
 # Since			: 25.05.16
 ############################################################################
*/
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const dateFormat = 'YYYY-MM-DD';

const StAdjustResultSearch = (props: any) => {
	const { search, form } = props;
	const { t } = useTranslation();
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// * 초기값 설정 (컴포넌트 마운트 시)
	useEffect(() => {
		const initialStart = dayjs();
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		form.setFieldValue('trandtRange', [initialStart, initialEnd]);

		// 사용자 물류센터 기본값 세팅
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	return (
		<>
			{/* 조정일자 */}
			<li>
				<Rangepicker
					label={t('lbl.TRANDATE_AJ')}
					name="trandtRange"
					defaultValue={dates}
					format={dateFormat}
					span={24}
					allowClear
					showNow={false}
					required
				/>
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="fixdccode"
					placeholder={t('lbl.SELECT')}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')}
					mode={'single'}
					required
				/>
			</li>
			{/* 발생사유 */}
			<li>
				<SelectBox
					label={t('lbl.REASONCODE_AJ')}
					name="reasoncode"
					placeholder={t('lbl.SELECT')}
					options={getCommonCodeList('REASONCODE_AJ', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 상품코드 */}
			<li>
				<CmSkuSearch selectionMode="multipleRows" form={form} name="skuNm" code="sku" label={t('lbl.SKU')} />
			</li>
			{/* 재고위치 */}
			<li>
				<SelectBox
					label={t('lbl.STOCKTYPE')}
					name="stocktype"
					placeholder="선택해주세요"
					options={getCommonCodeList('STOCKTYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 귀책 */}
			<li>
				<SelectBox
					label={t('lbl.OTHER01_DMD_AJ')}
					name="other01"
					placeholder="선택해주세요"
					options={getCommonCodeList('OTHER01_DMD', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 물류귀책배부 */}
			<li>
				<SelectBox
					label={t('lbl.OTHER05_DMD_AJ')}
					name="other05"
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* B/L 번호 */}
			<li>
				<InputText
					label={t('lbl.BLNO')}
					name="blno"
					placeholder={t('msg.placeholder1', [t('lbl.BLNO')])}
					onPressEnter={search}
				/>
			</li>
			{/* 이력번호 */}
			<li>
				<InputText
					label={t('lbl.SERIALNO')}
					name="serialno"
					placeholder={t('msg.placeholder1', [t('lbl.SERIALNO')])}
					onPressEnter={search}
				/>
			</li>
			{/* 계약업체 */}
			<li>
				<CmCustSearch form={form} name="contractcompanyNm" code="contractcompany" label={t('lbl.CONTRACTCOMPANY')} />
			</li>
			{/* 증감여부 */}
			<li>
				<SelectBox
					label={t('lbl.AJWDDPYN')}
					name="iotype"
					placeholder="선택해주세요"
					options={getCommonCodeList('IOTYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default StAdjustResultSearch;
