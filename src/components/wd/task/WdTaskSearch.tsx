/*
 ############################################################################
 # FiledataField	: WdTaskSearch.tsx
 # Description		: 출고재고분배 Search
 # Author			: 공두경
 # Since			: 25.08.29
 ############################################################################
*/

//Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

//Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// API Call Function
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Util

const dateFormat = 'YYYY-MM-DD';

const WdTaskSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, activeKey } = props;
	const [dates, setDates] = useState(dayjs());
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const fixdccode = Form.useWatch('fixdccode', props.form);

	// const sampleForm = Form.useFormInstance();

	// const [form] = Form.useForm();
	const { t } = useTranslation();

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
		const initialDate = dayjs();
		setDates(initialDate);
		form.setFieldValue('searchDate', initialDate);
		if (gDccode) {
			props.form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	if (activeKey === '1' || activeKey === '4') {
		// 조회생성
		return (
			<>
				<li>
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
					<CmGMultiDccodeSelectBox
						name="fixdccode"
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.DCCODE')} //물류센터(에러)
						mode={'single'}
						disabled={form.getFieldValue('fixdccodeDisabled')}
					/>
				</li>
			</>
		);
	} else if (activeKey === '2') {
		// 진행현황
		return (
			<>
				<li>
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
					<CmGMultiDccodeSelectBox
						name="fixdccode"
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.DCCODE')} //물류센터(에러)
						mode={'single'}
						disabled={form.getFieldValue('fixdccodeDisabled')}
					/>
				</li>
				<li>
					<CmCustSearch form={form} name="toCustkeyNm" code="toCustkey" label={t('lbl.TO_CUSTKEY_WD')} /*관리처코드*/ />
				</li>
				<li>
					<SelectBox
						label={t('lbl.TASKSYSTEM_WD')} //작업방법
						name="tasksystem"
						placeholder="선택해주세요"
						options={getCommonCodeList('TASKSYSTEM_WD', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.DELIVERYGROUP_WD')} //POP번호
						name="deliverygroup"
						placeholder={t('msg.placeholder1', [t('lbl.DELIVERYGROUP_WD')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.STORAGETYPE')} //저장조건
						name="storagetype"
						placeholder="선택해주세요"
						options={getCommonCodeList('STORAGETYPE', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.PRINTORDER')} //출력순서
						name="printorder"
						placeholder="선택해주세요"
						options={getCommonCodeList('ORDERBY_PICK', '')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li style={{ gridColumn: ' span 2' }} className="flex-wrap">
					<SelectBox
						label={t('lbl.PRINTPICKINGLIST')} //출력유형
						name="printpickinglist"
						placeholder="선택해주세요"
						options={getCommonCodeList('PICKINGLIST', '')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
					<CheckBox name={'crossYn'} trueValue="1" falseValue="0">
						{' '}
						CROSS로케이션 제외출력
					</CheckBox>
				</li>
				<li style={{ gridColumn: ' span 2' }}>
					<InputText
						label={t('출력메모')} //출력메모
						name="printmemo"
						placeholder={t('msg.placeholder1', [t('출력메모')])}
					/>
				</li>
			</>
		);
	} else if (activeKey === '3') {
		// 진행현황
		return (
			<>
				<li>
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
					<CmGMultiDccodeSelectBox
						name="fixdccode"
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.DCCODE')} //물류센터(에러)
						mode={'single'}
						disabled={form.getFieldValue('fixdccodeDisabled')}
					/>
				</li>
				<li>
					<CmCustSearch form={form} name="custkeyNm" code="custkey" label={t('lbl.TO_CUSTKEY_WD')} /*관리처코드*/ />
				</li>
				<li>
					<SelectBox
						label={t('lbl.TASKSYSTEM_WD')} //작업방법
						name="tasksystem"
						placeholder="선택해주세요"
						options={getCommonCodeList('TASKSYSTEM_WD', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.DELIVERYGROUP_WD')} //POP번호
						name="deliverygroup"
						placeholder={t('msg.placeholder1', [t('lbl.DELIVERYGROUP_WD')])}
						onPressEnter={search}
					/>
				</li>

				<li>
					<SelectBox
						label={t('lbl.TASKTYPE_WD')} //출고작업지시유형
						name="tasktype"
						placeholder="선택해주세요"
						options={[
							{ comCd: '', cdNm: '전체' },
							{ comCd: 'AL', cdNm: '할당완료' },
							{ comCd: 'PK', cdNm: '피킹완료' },
						]}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
			</>
		);
	}
});

export default WdTaskSearch;
