/*
 ############################################################################
 # FiledataField	: IbExpenseSearch.tsx
 # Description		: 비용기표
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.05
 ############################################################################
*/

// CSS

// Lib
import { Col, Form, Input } from 'antd';
import dayjs from 'dayjs';

// Utils

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker, { Rangepicker } from '@/components/common/custom/form/Datepicker';

// API

interface IbExpenseSearchProps {
	form: any;
}

const IbExpenseSearch = (props: IbExpenseSearchProps) => {
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

	// 입고일자 기간 초기값
	const [rangeDates, setRangeDates] = useState([dayjs(), dayjs()]);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 날짜 선택 조건 변경 이벤트
	 * @param value
	 * @param option
	 */
	const onChangeSelectDate = (value: string | number, option: object) => {
		setDateType(value);

		if (value) {
			props.form.setFieldValue('searchDateCategory', value.toLowerCase().replaceAll('_', ''));
		} else {
			props.form.setFieldValue('searchDateCategory', null);
		}
	};

	/**
	 * 조건 선택 조건 변경 이벤트
	 * @param value
	 * @param option
	 */
	const onChangeSelectType = (value: string | number, option: object) => {
		if (value) {
			props.form.setFieldValue('searchTypeCategory', value.toLowerCase().replaceAll('_', ''));
		} else {
			props.form.setFieldValue('searchTypeCategory', null);
		}
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
				<span>
					<Col span={10}>
						<SelectBox //날짜선택조건
							name="dateType"
							span={24}
							options={getCommonCodeList('SEARCHDATE_EXPENSE', '', '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							placeholder="선택해주세요"
							onChange={onChangeSelectDate}
							required
						/>
					</Col>
					<Col span={16}>
						{dateType !== 'YYYYMM' && (
							<Rangepicker //기간
								name="dtRange"
								defaultValue={rangeDates} // 초기값 설정
								format={dateFormat} // 화면에 표시될 형식
								span={24}
								showNow={false}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						)}
						{dateType === 'YYYYMM' && (
							<DatePicker //재고월
								name="stockmonth"
								format="YYYY-MM"
								showSearch
								picker="month"
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						)}
					</Col>
				</span>
			</li>
			<li>
				<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODENAME')} required disabled />
			</li>
			<li>
				<CmOrganizeSearch
					form={props.form}
					selectionMode="multipleRows"
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={props.form.getFieldValue('fixdccode')}
				/>
			</li>
			<li>
				<CmPartnerSearch
					form={props.form}
					selectionMode="multipleRows"
					name="supplierName"
					code="supplierCode"
					returnValueFormat="name"
					label={t('lbl.SUPPLIER')}
				/>
			</li>
			<li>
				<SelectBox
					name="ifStatus" //IF Status
					span={24}
					options={getCommonCodeList('STATUS_EXPENSE_IF', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.IF_STATUS')}
				/>
			</li>
			<li>
				<SelectBox
					name="expensegubun" //비용종류
					span={24}
					options={getCommonCodeList('EXPENSEGUBUN', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.COSTCATEGORY')}
				/>
			</li>
			<li>
				<span>
					<Col span={10}>
						<SelectBox
							name="searchType" //조회조건
							span={24}
							options={getCommonCodeList('SEARCHTYPE_EXPENSE', t('lbl.ALL'), null)}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							placeholder="선택해주세요"
							onChange={onChangeSelectType}
						/>
					</Col>
					<Col span={16}>
						<InputText name="searchVal" allowClear />
					</Col>
				</span>
			</li>
			<li>
				<SelectBox
					name="status" //Status
					span={24}
					options={getCommonCodeList('STATUS_EXPENSE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.STATUS')}
				/>
			</li>

			<Form.Item name="searchDateCategory" hidden>
				<Input />
			</Form.Item>
			<Form.Item name="searchTypeCategory" hidden>
				<Input />
			</Form.Item>
		</>
	);
};

export default IbExpenseSearch;
