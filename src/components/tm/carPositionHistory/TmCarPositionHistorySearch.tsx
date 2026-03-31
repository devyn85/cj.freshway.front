/*
 ############################################################################
 # FiledataField	: TmCarPositionHistorySearch.tsx
 # Description		: 배송 > 차량관제 > 운행일지 (조회)
 # Author					: JiHoPark
 # Since					: 2025.11.14.
 ############################################################################
*/

import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmMngPlcSearch from '@/components/cm/popup/CmMngPlcSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface TmCarPositionHistorySearchProps {
	form: any;
}

const TmCarPositionHistorySearch = (props: TmCarPositionHistorySearchProps) => {
	const { t } = useTranslation();
	const { form } = props;

	return (
		<>
			{/* 배송일자 */}
			<li>
				<Rangepicker
					label={t('lbl.DELIVERYDATE')}
					name="docdt"
					format={'YYYY-MM-DD'}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox />
			</li>
			{/* 거래처 */}
			<li>
				<CmMngPlcSearch
					label={t('lbl.LB_VENDOR')}
					form={form}
					name="toCustkeyName"
					code="toCustkey"
					returnValueFormat="name"
					selectionMode="multipleRows"
				/>
			</li>
			{/* 차량번호 */}
			<li>
				<CmCarSearch label={t('lbl.VHCNUM')} form={form} code="carno" name="carnoNm" selectionMode="multipleRows" />
			</li>
			{/* 계약유형 */}
			<li>
				<SelectBox
					label={t('lbl.CONTRACTTYPE')}
					name="contracttype"
					options={getCommonCodeList('CONTRACTTYPE', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default TmCarPositionHistorySearch;
