/*
 ############################################################################
 # FiledataField	: IbStoWeightSearch.tsx
 # Description		: 정산 > 정산작업 > 센터별물동량 조회 조건 화면
 # Author			: KimDongHyeon
 # Since			: 2025.10.24
 ############################################################################
*/

// Components
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { CheckBox, InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker, { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

// Store

// Libs

// Utils

const IbStoWeightSearch = ({ form, initialValues, dates, setDates, activeKey }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const dateFormat = 'YYYY-MM-DD';

	const { t } = useTranslation();

	const rangeRef = useRef(null);

	const [expanded, setExpanded] = useState(false);
	const [showToggleBtn, setShowToggleBtn] = useState(false);
	const groupRef = useRef<HTMLUListElement>(null);

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

	return (
		<>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name={'fixdccode'}
					// required
					mode={'multiple'}
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')} // 공급받는센터
				/>
			</li>

			{/* 조회월 */}
			<li>
				<DatePicker
					label={t('lbl.WDMONTH')}
					name="yyyymm"
					picker={'month'}
					allowClear
					showNow={true}
					format="YYYY-MM"
					required={true}
				/>
			</li>
		</>
	);
};

export default IbStoWeightSearch;
