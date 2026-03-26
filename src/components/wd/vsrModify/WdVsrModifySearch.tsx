/*
 ############################################################################
 # FiledataField	: WdVsrModifySearch.tsx
 # Description		: 출고 > 출고 > CS 출고 정정 요청 대응 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.10.21
 ############################################################################
*/

import { Rangepicker, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

// Components
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
// Store

// Libs

// Utils

const WdVsrModifySearch = ({ form, dates }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const dateFormat = 'YYYY-MM-DD';

	const { t } = useTranslation();

	//const rangeRef = useRef(null);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// const [expanded, setExpanded] = useState(false);
	// const [showToggleBtn, setShowToggleBtn] = useState(false);
	// const groupRef = useRef<HTMLUListElement>(null);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		form.setFieldValue('dccode', gDccode);
	}, []);

	return (
		<>
			<li>
				{/* 물류센터 */}
				<CmGMultiDccodeSelectBox
					name={'fixdccode'}
					required
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')}
				/>
			</li>
			{/* 조회일자 */}
			<li>
				<Rangepicker
					label={t('lbl.SEARCHDT')}
					name="ifDate"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 처리구분 */}
			<li>
				<SelectBox
					label={t('lbl.QCTYPE_RT')}
					name="status"
					options={getCommonCodeList('WD_AMEND', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default WdVsrModifySearch;
