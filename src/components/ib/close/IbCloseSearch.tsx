/*
 ############################################################################
 # FiledataField	: IbCloseSearch.tsx
 # Description		: Admin > 모니터링 > 마감상태 관리 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.08.21
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

const IbCloseSearch = ({ form, initialValues, dates, setDates }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// const rangeRef = useRef(null); // ?

	// const [expanded, setExpanded] = useState(false); // 조회조건이 4줄 이상인 경우 필요
	// const [showToggleBtn, setShowToggleBtn] = useState(false); // ?
	// const groupRef = useRef<HTMLUListElement>(null); // ?

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	//const gDcname = useSelector((state: any) => state.global.globalVariable.gDccodeNm);

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
		//form.setFieldValue('docdt', dayjs().startOf('month'));
	}, []);

	return (
		<>
			{/* 물류센터 */}
			<li>
				<SelectBox
					label={t('lbl.DCCODE')}
					name="dccode"
					options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>

			{/* 조회월 */}
			<li>
				<DatePicker
					label={t('lbl.SEARCH_MONTH')}
					name="docdt"
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

export default IbCloseSearch;
