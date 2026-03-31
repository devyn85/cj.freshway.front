/*
 ############################################################################
 # FiledataField	: KpOrderQtyStoInfoSearch.tsx
 # Description		: 지표 > 센터운영지표 > 이체 및 출고현황
 # Author			: JeongHyeongCheol
 # Since			: 25.11.20
 ############################################################################
*/
// component
import { Datepicker } from '@/components/common/custom/form';

// CSS

// store

// API Call Function

const KpOrderQtyStoInfoSearch = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<Datepicker
					label={'기준월'}
					name="deliverydate"
					allowClear
					showNow={true}
					format="YYYY-MM"
					picker="month"
					// defaultValue={dates} // 초기값 설정
					rules={[{ required: true, validateTrigger: 'none' }]}
					required
				/>
			</li>
		</>
	);
};

export default KpOrderQtyStoInfoSearch;
