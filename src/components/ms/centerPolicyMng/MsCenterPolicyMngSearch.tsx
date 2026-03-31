/*
 ############################################################################
 # FiledataField	: MsCenterPolicyMngSearch.tsx
 # Description		: 기준정보 > 센터기준정보 > 센터정책관리
 # Author			: JeongHyeongCheol
 # Since			: 25.08.06
 ############################################################################
*/
// component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

// type

// API Call Function

// CSS

// store

// lib

const MsCenterPolicyMngSearch = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form } = props;
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
	useEffect(() => {
		// initEvent();
	}, []);

	return (
		<>
			{/* 그리드 영역 */}

			<li>
				<CmGMultiDccodeSelectBox
					name="dccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={'물류센터'}
				/>
			</li>
		</>
	);
};

export default MsCenterPolicyMngSearch;
