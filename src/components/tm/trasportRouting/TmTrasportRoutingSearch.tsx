/*
  ############################################################################
 # FiledataField	: TmTrasportRoutingSearch.tsx
 # Description		: 정산 > 운송비정산 >  수송경로관리 API
 # Author			: ParkYoSep
 # Since			: 2025.10.14
 ############################################################################
*/

import { Form } from 'antd';
//Component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Rangepicker, SelectBox } from '@/components/common/custom/form';

//Lib
import dayjs from 'dayjs';

// Store

const TmTrasportRoutingSearch = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation(); // 다국어 처리
	const { search, form, dcCodeOptions } = props; // Antd Form
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const fromDcCode = Form.useWatch('fromDcCode', form);
	const toDcCode = Form.useWatch('toDcCode', form);
	const dateFormat = 'YYYY-MM-DD';
	// Declare react Ref(2/4)

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	/**
	 * 현재날짜를 셋팅한다.
	 */
	useEffect(() => {
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialStart = dayjs();
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		props.form.setFieldValue('date', [initialStart, initialEnd]);
	}, []);
	/**
	 * fromDcCode(출발물류센터) 변경 시, fromOranizeName(출발창고) 초기화
	 */
	useEffect(() => {
		if (fromDcCode) {
			form.setFieldsValue({ fromOranizeName: null, fromOrganize: null });
		}
	}, [fromDcCode]);

	/**
	 * toDcCode(도착물류센터) 변경 시, toOranizeName(도착창고) 초기화
	 */
	useEffect(() => {
		if (toDcCode) {
			form.setFieldsValue({ toOranizeName: null, toOrganize: null });
		}
	}, [toDcCode]);
	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="fromDcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'fromDcname', value: 'fromDcCode' }}
					mode="single"
					label={t('lbl.FROMDCCODE')} //출발센터
					required
					allLabel={t('lbl.ALL')}
				/>
			</li>
			<li>
				<CmOrganizeSearch
					label={t('lbl.FROMORGANIZE')} //출발창고
					form={form}
					name="fromOranizeName"
					code="fromOrganize"
					returnValueFormat="name"
					selectionMode="singleRow"
					dccode={fromDcCode}
				/>
			</li>

			<li>
				<SelectBox
					name="toDcCode"
					placeholder="선택해주세요" //IF Status
					span={24}
					options={dcCodeOptions}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.TODCCODE')} //도착센터
				/>
			</li>
			<li>
				<CmOrganizeSearch
					label={t('lbl.TOORGANIZE')} //도착창고
					form={props.form}
					name="toOranizeName"
					code="toOrganize"
					selectionMode="singleRow"
					returnValueFormat="name"
					dccode={toDcCode}
					disabled={!toDcCode}
				/>
			</li>
			<li>
				<Rangepicker
					label={t('lbl.TERM')} //기간
					name="date"
					defaultValue={dates}
					format={dateFormat}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
		</>
	);
});

export default TmTrasportRoutingSearch;
