/*
 ############################################################################
 # FiledataField	: KpDailyUnloadMasterPopupSearch.tsx
 # Description		:지표 > 생산성 > 데일리 생산성 하역 지표 관리(투입인원) 마스터관리 팝업 (조회)
 # Author					: JiHoPark
 # Since					: 2026.01.21.
 ############################################################################
*/

// Lib

// Component
import DatePicker from '@/components/common/custom/form/Datepicker';

// Util

// Store

// API

// Hooks

// lib

// hook

// type

// asset

interface KpDailyUnloadMasterPopupSearchProps {
	form: any;
	currentTabKey: string;
}

const KpDailyUnloadMasterPopupSearch = (props: KpDailyUnloadMasterPopupSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const { form, currentTabKey } = props;

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{currentTabKey === '1' && (
				<li>
					<DatePicker
						label={t('lbl.YEAR_COND')} // 조회년도
						name="contractDate"
						format={'YYYY'} // 화면에 표시될 형식
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
			)}
			{currentTabKey === '2' && (
				<li>
					<DatePicker
						label={t('lbl.YEAR_COND')} // 조회년도
						name="contractDate2"
						format={'YYYY'} // 화면에 표시될 형식
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
			)}
			{currentTabKey === '3' && (
				<li>
					<DatePicker
						label={t('lbl.YEAR_COND')} // 조회년도
						name="excptDate"
						format={'YYYY'} // 화면에 표시될 형식
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

export default KpDailyUnloadMasterPopupSearch;
