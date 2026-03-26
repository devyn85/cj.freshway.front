/*
 ############################################################################
 # FiledataField	: MgModifyLogExDcSkuSearch.tsx
 # Description		: 외부비축재고변경사유현황 (상품별수불현황) 검색
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.07.11
 ############################################################################
*/
// lib

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputText, Rangepicker } from '@/components/common/custom/form';
import dayjs from 'dayjs';

// component

// store

// api

// util

// hook

// type

// asset
interface MgModifyLogExDcSkuProps {
	form: any;
}
const MgModifyLogExDcSkuSearch = (props: MgModifyLogExDcSkuProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const form = props.form;

	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const { t } = useTranslation();

	const dateFormat = 'YYYY-MM-DD';

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	//날짜 기간 초기화
	useEffect(() => {
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialStart = dayjs().subtract(1, 'month');
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		form.setFieldValue('date', [initialStart, initialEnd]);
	}, []);
	return (
		<>
			<li>
				<Rangepicker
					label="수불일자"
					name="date"
					span={24}
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					// onChange={onChange}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li></li>
			<li></li>
			<li></li>
			<li>
				{' '}
				<li>
					<CmSkuSearch
						form={form}
						name="sku"
						code="sku"
						selectionMode="singleRow"
						returnValueFormat="name"
						label={t('상품코드')}
						// rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
			</li>
			<li>
				<InputText name="blNo" label="B/L번호" maxLength={32} />
			</li>
			<li>
				{' '}
				<CmOrganizeSearch
					form={form}
					selectionMode="singleRow"
					name="organize"
					code="organize"
					returnValueFormat="name"
				/>
			</li>
		</>
	);
};
export default MgModifyLogExDcSkuSearch;
