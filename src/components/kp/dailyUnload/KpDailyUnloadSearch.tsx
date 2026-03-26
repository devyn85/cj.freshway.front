/*
 ############################################################################
 # FiledataField	: KpDailyUnloadSearch.tsx
 # Description		: 지표 > 생산성 > 데일리 생산성 하역 지표 관리(조회)
 # Author					: JiHoPark
 # Since					: 2026.01.19.
 ############################################################################
*/

// Lib

// Component
import { SelectBox } from '@/components/common/custom/form';
import DatePicker, { Rangepicker } from '@/components/common/custom/form/Datepicker';

// Util

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// API

// Hooks

// lib

// hook

// type

// asset

interface KpDailyUnloadSearchProps {
	form: any;
	currentTabKey: string;
}

const KpDailyUnloadSearch = (props: KpDailyUnloadSearchProps) => {
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

	/**
	 * 조회조건 focus
	 */
	useEffect(() => {
		let searchId = '';
		if (currentTabKey === '1') {
			searchId = 'dccode1';
		} else if (currentTabKey === '2') {
			searchId = 'dccode2';
		}

		if (commUtil.isNotEmpty(searchId)) {
			const input = document.querySelector('input[id=' + searchId + ']') as HTMLInputElement;
			input?.focus();
		}
	}, [currentTabKey]);

	return (
		<>
			{currentTabKey === '1' && (
				<>
					<li>
						<SelectBox
							name="dccode1" //IF Status
							span={24}
							options={getCommonCodeList('DAILY_PROC_DCCODE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							label={t('lbl.DCCODE')}
						/>
					</li>
					<li>
						<Rangepicker
							label={t('lbl.DATE')} // 일자
							name="deliverydtFromTo"
							format={'YYYY-MM-DD'} // 화면에 표시될 형식
							allowClear
							required
							showNow={false}
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
				</>
			)}
			{currentTabKey === '2' && (
				<>
					<li>
						<SelectBox
							name="dccode2" //IF Status
							span={24}
							options={getCommonCodeList('DAILY_PROC_DCCODE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							label={t('lbl.DCCODE')}
						/>
					</li>
					<li>
						<DatePicker
							label={t('lbl.DATE')} // 일자
							name="deliverydt"
							format={'YYYY-MM'} // 화면에 표시될 형식
							span={24}
							required
							allowClear
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
				</>
			)}
		</>
	);
};

export default KpDailyUnloadSearch;
