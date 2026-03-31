// Lib
import { Row } from 'antd';

// Utils

// Store

// Component
import { DateRange } from '@/components/common/custom/form';

// API Call Function

const SearchExcLog = () => {
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
					label={t('sysmgt.exclog.search.searchDt')}
					name="searchDt"
					span={10}
					format="YYYY-MM-DD"
					fromName="fromDt"
					toName="thruDt"
				/>
			</Row>
		</>
	);
};

export default SearchExcLog;
