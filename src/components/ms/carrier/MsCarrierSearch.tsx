// Component
import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import { SelectBox } from '@/components/common/custom/form';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface MsCarrierSearchProps {
	form?: any;
}

const MsCarrierSearch = (props: MsCarrierSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { form } = props;

	// 다국어
	const { t } = useTranslation();

	return (
		<>
			<li>
				{/* 운송사 유형 */}
				<SelectBox
					name="carrierType"
					placeholder="선택해주세요"
					options={getCommonCodeList('CARRIERTYPE', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.CARRIERTYPE')}
				/>
			</li>
			<li>
				{/* 운송사조회 팝업 */}
				<CmCarrierSearch
					form={form}
					selectionMode="multipleRows"
					name="carrierName"
					code="carrierKey"
					// returnValueFormat="name"
				/>
			</li>
			<li>
				{/* 진행상태 */}
				<SelectBox
					name="delYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('DEL_YN', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.DEL_YN')}
				/>
			</li>
		</>
	);
};

export default MsCarrierSearch;
