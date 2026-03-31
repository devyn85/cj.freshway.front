/*
 ############################################################################
 # FiledataField	: IbApprovalListSearch.tsx
 # Description		: 비용결재
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.25
 ############################################################################
*/

// CSS

// Lib

// Utils

// Store

// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

// API

interface IbApprovalListSearchProps {
	form: any;
}

const IbApprovalListSearch = (props: IbApprovalListSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 달력 표시 형식
	const [dateType, setDateType] = useState<string>('');

	// 기간 달력 표시 형식
	const [dateFormat] = useState('YYYY-MM-DD');

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 진행상태를 표시한다.
	 * @returns {any} 공통코드
	 */
	const getApprStatus = () => {
		const types = [
			{ comCd: '1', cdNm: '예정' },
			{ comCd: '2', cdNm: '완결' },
			{ comCd: '3', cdNm: '반려' },
			{ comCd: '4', cdNm: '상신취소' },
			{ comCd: '0', cdNm: '전체' },
		];

		return types;
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 날짜를 셋팅한다.
	 */
	useEffect(() => {
		setDateType('ADDDATE');
	}, []);

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODE')} required disabled />
			</li>
			<li>
				<Rangepicker
					label={t('lbl.DATE')} //일자
					name="dtRange"
					//defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.STATUS')} //진행상태
					name="apprStatus"
					span={24}
					options={getApprStatus()}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
		</>
	);
};

export default IbApprovalListSearch;
