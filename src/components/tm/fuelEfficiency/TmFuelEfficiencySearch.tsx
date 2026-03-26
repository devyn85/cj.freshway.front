/*
 ############################################################################
 # FiledataField	: TmFuelEfficiencySearch.tsx
 # Description		: 연비관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.09.10
 ############################################################################
*/
// lib
import { Form } from 'antd';
import dayjs from 'dayjs';
// component
import { CheckBox, Rangepicker, SelectBox } from '@/components/common/custom/form';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

// api

// util

// hook

// type

// asset

const TmFuelEfficiencySearch = forwardRef((props: any, ref) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const [dcCodeList, setDcCodeList] = useState([]);
	const dateFormat = 'YYYY-MM-DD';
	const dcCode = Form.useWatch('dcCode', props.form);
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 공통 코드 호출([comCd]cdNm)
	 * @returns
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	useEffect(() => {
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialStart = dayjs();
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		props.form.setFieldValue('date', [initialStart, initialEnd]);

		const list = getUserDccodeList('STD') || [];
		list.filter(item => {
			item.dccode !== 'STD';
		});
		setDcCodeList(list.filter(item => item.dccode !== 'STD'));
	}, []);
	return (
		<>
			<li>
				<SelectBox
					name="dcCode" //IF Status
					span={24}
					options={dcCodeList}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={'물류센터'}
					required
				/>
			</li>

			<li>
				<Rangepicker
					name="date"
					label="기준일자"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<SelectBox
					name="fuelType" //IF Status
					span={24}
					options={getCommonCodeList('FUELTYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'유종'}
				/>
			</li>
			<li>
				{/* 톤급 */}
				<SelectBox
					name="ton"
					placeholder="선택해주세요"
					options={getCommonCodeList('CARCAPACITY', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.CARCAPACITY')}
				/>
			</li>
			<li>
				{' '}
				<CheckBox name={'serialYn'} label="이력조회" value={'N'}></CheckBox>
			</li>
		</>
	);
});
export default TmFuelEfficiencySearch;
