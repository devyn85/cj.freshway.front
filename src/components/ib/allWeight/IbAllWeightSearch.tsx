/*
 ############################################################################
 # FiledataField	: IbAllWeightSearch.tsx
 # Description		: 정산 > 정산작업 > 센터별물동량 정산 조회 조건 화면
 # Author			: KimDongHyeon
 # Since			: 2025.11.12
 ############################################################################
*/

// Components
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import DatePicker, { Rangepicker } from '@/components/common/custom/form/Datepicker';

// Store

// Libs

// Utils

const IbAllWeightSearch = ({ form, initialValues, dates, setDates, activeKey }: any) => {
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
					required
					// mode={'multiple'}
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')} // 공급받는센터
				/>
			</li>

			{/* 조회월 */}
			{activeKey === '1' && (
				<li>
					<DatePicker
						label={t('lbl.SEARCH_MONTH')}
						name="yyyymm"
						picker={'month'}
						allowClear
						showNow={true}
						format="YYYY-MM"
						required={true}
					/>
				</li>
			)}
			{activeKey === '2' && (
				<li>
					<Rangepicker
						label={t('lbl.SEARCHDT')} //광역입고일자
						name="slipdt"
						format={dateFormat} // 화면에 표시될 형식
						span={24}
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
			)}
			<li>
				<CmPartnerSearch //협력사코드
					// required={true} //TODO 필수 테스트용으로 필수 풀어놈
					form={form}
					name="custkeyName"
					code="custkey"
					// selectionMode={'multipleRows'}
					returnValueFormat="name"
					label={t('lbl.VENDOR')}
				/>
			</li>
		</>
	);
};

export default IbAllWeightSearch;
