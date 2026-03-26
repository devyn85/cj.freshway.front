/*
 ############################################################################
 # FiledataField	: StExdcTransIndicatorVSearch.tsx
 # Description		: 주문유형별 운송료지표 검색영역
 # Author			    :
 # Since			    : 26.03.18
 ############################################################################
*/

import DatePicker from '@/components/common/custom/form/Datepicker';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

export const StExdcTransIndicatorVSearch = forwardRef((props: any) => {
	const { t } = useTranslation();
	const { form } = props;

	useEffect(() => {
		form.setFieldValue('year', dayjs());
	}, []);

	return (
		<>
			<Form form={form}>
				<li>
					<DatePicker
						name="year"
						label={t('lbl.YY')}
						format="YYYY"
						showSearch
						allowClear
						picker="year"
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
			</Form>
		</>
	);
});
