/*
 ############################################################################
 # FiledataField	: KpCloseSearch.tsx
 # Description		: 모니터링 > 물동 > 물동마감 진행 현황 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.08.22
 ############################################################################
*/

// Components
import { RadioBox, SelectBox } from '@/components/common/custom/form';
import DatePicker, { Rangepicker } from '@/components/common/custom/form/Datepicker';
import dayjs from 'dayjs';
// Store
import { getUserDccodeList } from '@/store/core/userStore';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
// Libs

// Utils

const KpCloseSearch = ({ form, searchType, setSearchType, radioOption }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const dateFormat = 'YYYY-MM-DD';

	const { t } = useTranslation();

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 * @param event
	 */
	// 라디오 버튼 변경 핸들러
	const onChangeRadio = (event: any) => {
		setSearchType(event.target.value);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	const setInitialValues = () => {
		const today = dayjs();
		form.setFieldValue('docdtmonth', today.startOf('month'));
		form.setFieldValue('docdtday', [today, today]);
	};

	useEffect(() => {
		setInitialValues();
		form.setFieldValue('fixdccode', gDccode);
	}, []);

	return (
		<>
			<li>
				{/* 물류센터 */}
				<SelectBox
					label={t('lbl.DCCODE')}
					name="fixdccode"
					//rules={[{ required: true, validateTrigger: 'none' }]}
					options={[{ dcname: t('lbl.ALL'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
				/>
			</li>
			<li>
				{/* 조회구분 */}
				<RadioBox
					label={t('lbl.SEARCHTYPE')}
					name="searchtype"
					options={radioOption}
					onChange={onChangeRadio}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{searchType === '0' && (
				<li>
					{/* 월별 */}
					<DatePicker
						label={t('lbl.SEARCH_MONTH')}
						name="docdtmonth"
						picker={'month'}
						allowClear
						showNow={true}
						format="YYYY-MM"
						required={true}
					/>
				</li>
			)}
			{searchType === '1' && (
				<li>
					{/* 일별 */}
					<Rangepicker
						label={t('lbl.SEARCHDT')}
						name="docdtday"
						format={dateFormat}
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
			)}
		</>
	);
};

export default KpCloseSearch;
