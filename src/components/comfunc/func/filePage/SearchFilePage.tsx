/*
 ############################################################################
 # FiledataField	: SearchFilepage.tsx
 # Description		: 파일업로드 검색
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import { Row } from 'antd';
// component
import { DateRange } from '@/components/common/custom/form';

const SearchFilePage = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	// form 인스턴스
	// const form = Form.useFormInstance();

	return (
		<>
			<Row>
				<DateRange
					label={t('comfunc.bbs.search.daterange')}
					span={10}
					format="YYYY-MM-DD"
					fromName="fromDt"
					toName="thruDt"
				/>
			</Row>
		</>
	);
};

export default SearchFilePage;
