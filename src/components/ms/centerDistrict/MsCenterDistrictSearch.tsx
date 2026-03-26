/*
 ############################################################################
 # FiledataField	: MsCenterDistrictSearch.tsx
 # Description		: 센터권역 관리 조회조건
 # Author			:  손인성
 # Since			:  26.03.20
 ############################################################################
 */

// Lib
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import DatePicker from '@/components/common/custom/form/Datepicker';

// Const
const dateFormat = 'YYYY-MM-DD'; // dayjs date format

interface IMsCenterDistrictSearchProps {
	form: any;
}

const MsCenterDistrictSearch = (props: IMsCenterDistrictSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation(); // 다국어 처리

	const { form } = props; // Antd Form
	const [date] = useState(dayjs()); // 적용일자

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
	useEffect(() => {
		// 현재날짜를 셋팅한다.
		form.setFieldValue('effectiveDate', date);
	}, []);

	return (
		<>
			<li>
				{/* 물류센터 */}
				<CmGMultiDccodeSelectBox mode={'multiple'} name={'dccode'} rules={[{ required: true }]} />
			</li>
			<li>
				{/* 적용일자  */}
				<DatePicker
					name="effectiveDate"
					label={t('lbl.EFFECTIVEDATE')}
					allowClear
					defaultValue={date} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					required={true}
				/>
			</li>
		</>
	);
};

export default MsCenterDistrictSearch;
