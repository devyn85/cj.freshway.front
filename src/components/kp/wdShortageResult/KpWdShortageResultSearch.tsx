/*
 ############################################################################
 # FiledataField	: KpWdShortageResultSearch.tsx
 # Description		: 지표/모니터링 > 센터운영지표> 출고결품실적 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.12.02
 ############################################################################
*/

// Components
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import { CheckBox, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// Store

// Libs

// Utils

const KpWdShortageResultSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// const dateFormat = 'YYYY-MM-DD';
	const { searchColList, form, activeKey } = props;

	const { t } = useTranslation();

	const dateFormat = 'YYYY-MM-DD';

	const [dates, setDates] = useState(dayjs());
	// const rangeRef = useRef(null);

	// const [expanded, setExpanded] = useState(false);
	// const [showToggleBtn, setShowToggleBtn] = useState(false);
	// const groupRef = useRef<HTMLUListElement>(null);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

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
		const initialDate = dayjs();
		setDates(initialDate);
		form.setFieldValue('searchDate', initialDate);
	}, []);

	return (
		<>
			<li style={{ display: activeKey === '1' ? '' : 'none' }}>
				{/* 협력사코드 */}
				<DatePicker
					label={t('lbl.WD_MONTH')}
					name="docdt"
					picker={'month'}
					allowClear
					showNow={true}
					format="YYYY-MM"
					//span={14}
					required={true}
					onChange={searchColList}
				/>
			</li>
			<li style={{ display: activeKey === '2' ? '' : 'none' }}>
				<DatePicker
					label={t('lbl.TASKDT_WD')} //작업지시일자
					name="searchDate"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					span={24}
					required
					allowClear
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 물류센터 */}
				<SelectBox
					label={t('lbl.DCCODE')}
					name="dccode"
					options={[{ dcname: t('lbl.ALL'), dccode: '' }, ...getUserDccodeList()]}
					//options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					rules={[{ required: false, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 협력사코드 */}
				<CmPartnerSearch
					form={form}
					name="vendorNm"
					code="vendor"
					selectionMode={'multipleRows'}
					label={t('lbl.FROM_CUSTKEY_DP')}
				/>
			</li>
			<li>
				{/* 일배구분 */}
				<SelectBox
					label={t('lbl.CHANNEL_DMD')}
					name="channel"
					options={getCommonCodeList('PUTAWAYTYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li style={{ gridColumn: ' span 2' }} className="flex-wrap">
				{/* 결품사유 */}
				<SelectBox
					label={t('lbl.REASONCODE_DP')}
					name="reasoncode"
					options={getCommonCodeList('REASONCODE_WD', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
				<CheckBox name={'exReasoncodeYn'} trueValue="1" falseValue="0">
					{' '}
					결품제외미포함
				</CheckBox>
			</li>
		</>
	);
});

export default KpWdShortageResultSearch;
