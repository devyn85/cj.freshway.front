/*
 ############################################################################
 # FiledataField	: KpCenterDayTMDlvStateSearch.tsx
 # Description		: 지표 > 센터 운영 > 배송조별 출자 평균시간 현황 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.09.01
 ############################################################################
*/

// Components
import { SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
// Store
import { getUserDccodeList } from '@/store/core/userStore';
import { useSelector } from 'react-redux';
// Libs

// Utils

const KpCenterDayTMDlvStateSearch = ({ form }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// const dateFormat = 'YYYY-MM-DD';

	const { t } = useTranslation();

	// const rangeRef = useRef(null);

	// const [expanded, setExpanded] = useState(false);
	// const [showToggleBtn, setShowToggleBtn] = useState(false);
	// const groupRef = useRef<HTMLUListElement>(null);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	// const gDcname = useSelector((state: any) => state.global.globalVariable.gDccodeNm);
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
				<SelectBox
					label={t('lbl.DCCODE')}
					name="dccode"
					//options={[{ dcname: t('lbl.ALL'), dccode: '' }, ...getUserDccodeList()]}
					options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 배송일자 */}
				<DatePicker
					label={t('lbl.DELIVERYDATE')}
					name="deliverydt"
					allowClear
					showNow={true}
					format="YYYY-MM-DD"
					required={true}
				/>
			</li>
		</>
	);
};

export default KpCenterDayTMDlvStateSearch;
