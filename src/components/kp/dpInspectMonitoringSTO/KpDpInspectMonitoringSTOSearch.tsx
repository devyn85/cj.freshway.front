/*
 ############################################################################
 # FiledataField	: KpDpInspectMonitoringSTOSearch.tsx
 # Description		: 광역출고검수현황 Search
 # Author			: 공두경
 # Since			: 25.11.29
 ############################################################################
*/

//Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

//Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// API Call Function
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Util

const dateFormat = 'YYYY-MM-DD';

const KpDpInspectMonitoringSTOSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, activeKey } = props;
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const fromDccode = Form.useWatch('fromDccode', props.form);

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
		const initialStart = dayjs();
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		form.setFieldValue('slipdtRange', [initialStart, initialEnd]);
		if (gDccode) {
			props.form.setFieldValue('fromDccode', gDccode);
		}
		props.form.setFieldValue('toDccode', '');
	}, []);

	// 조회생성
	return (
		<>
			<li>
				<Rangepicker
					label={t('lbl.DOCDT_WD')} //출고일자
					name="slipdtRange"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					span={24}
					allowClear
					showNow={false}
					//nChange={handleDateChange}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 공급센터 */}
				<CmGMultiDccodeSelectBox
					name="fromDccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.FROM_DCCODE')} //				{/* 공급센터 */}
					mode={'single'}
					allLabel={t('lbl.ALL')}
					disabled={form.getFieldValue('fromDccodeDisabled')}
				/>
			</li>
			<li>
				{/* 공급받는센터 */}
				<CmGMultiDccodeSelectBox
					name="toDccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.TO_DCCODE')} //				{/* 공급받는센터 */}
					mode={'single'}
					allLabel={t('lbl.ALL')}
					disabled={form.getFieldValue('toDccodeDisabled')}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.STATUS_WD')} //진행상태
					name="status"
					placeholder="선택해주세요"
					options={getCommonCodeList('STATUS_WD', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<CmSkuSearch
					form={form}
					label={t('lbl.SKU')} //상품코드
					name="skuNm"
					code="sku"
				/>
			</li>
			<li>
				<CmCustSearch
					form={form}
					name="toCustkeyNm"
					code="toCustkey"
					label={t('lbl.TO_CUSTKEY_WD')}
					/*관리처코드*/ selectionMode="multipleRows"
				/>
			</li>
			<li>
				<CmPartnerSearch //협력사코드
					form={props.form}
					name="vendorName"
					code="vendor"
					selectionMode="multipleRows"
					returnValueFormat="name"
					label={t('lbl.VENDOR')}
				/>
			</li>
		</>
	);
});

export default KpDpInspectMonitoringSTOSearch;
