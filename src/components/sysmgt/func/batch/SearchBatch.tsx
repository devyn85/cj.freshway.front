// Lib
import { Row } from 'antd';

// Utils

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Component
import { DateRange, SelectBox } from '@/components/common/custom/form';

// API Call Function

const SearchBatch = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	const { t } = useTranslation();

	return (
		<>
			<Row>
				<DateRange
					label={t('sysmgt.batch.search.searchRange')}
					name="searchDt"
					span={8}
					format="YYYY-MM-DD"
					fromName="fromDt"
					toName="thruDt"
				/>
				<SelectBox
					name="bbsTpCd"
					span={7}
					label="Job 결과"
					placeholder="선택해주세요"
					options={getCommonCodeList('BBS_TP', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</Row>
		</>
	);
};

export default SearchBatch;
