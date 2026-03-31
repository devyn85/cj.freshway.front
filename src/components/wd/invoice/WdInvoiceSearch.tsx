/* eslint-disable react/jsx-no-undef */
/*
 ############################################################################
 # FiledataField	: WdInvoiceSearch.tsx
 # Description		: 납품서출력 Search
 # Author			: KimDongHyeon
 # Since			: 2025.11.03
 ############################################################################
*/

//Component
import { CheckBox, InputText, RadioBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
//Lib
import dayjs from 'dayjs';

// API Call Function
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Form } from 'antd';
//Util

const dateFormat = 'YYYY-MM-DD';

const WdInvoiceSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation(); // 다국어 처리
	const { search, form } = props; // Antd Form
	const fixdccodeWatch = Form.useWatch('fixdccode', form);
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const radioOptions = [
		{
			// 월별
			label: t('미출력'),
			value: '0',
		},
		{
			// 일별
			label: t('출력'),
			value: '1',
		},
	];

	// 컴포넌트 접근을 위한 Ref(2/4)

	// 초기 값(3/4)

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

	return (
		<>
			<li>
				<DatePicker //협력사반품일자
					name="invoicedt"
					label={t('납품일자')}
					showSearch
					allowClear
					showNow={false}
					required
				/>
			</li>
			<li>
				{/* 물류센터 */}
				<CmGMultiDccodeSelectBox
					name={'fixdccode'}
					required
					onChange={() => {
						form.setFieldsValue({ organize: '', organizenm: '' });
					}}
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')} // 공급받는센터
				/>
			</li>
			<li>
				{/* 창고코드 */}
				<CmOrganizeSearch
					dccodeDisabled={true}
					form={form}
					label={'창고코드/명'}
					selectionMode="multipleRows"
					name="organizenm"
					code="organize"
					returnValueFormat="name"
					dccode={fixdccodeWatch}
				/>
			</li>
			<li>
				{/* 차량 팝업 */}
				<CmCarSearch form={form} code="carno" name="carnoNm" label={t('lbl.CARNO')} selectionMode={'multipleRows'} />
			</li>
			<li>
				{/* 거래처 팝업 */}
				<CmCustSearch
					form={form}
					label={t('lbl.CUSTCODENAME')}
					code="toCustkey"
					name="toCustkeynm"
					selectionMode={'multipleRows'}
					returnValueFormat="name"
				/>
			</li>
			<li>
				<InputText
					label="POP번호" // POP번호
					name="deliverygroup"
					placeholder={t('msg.placeholder1', ['POP번호'])}
					onPressEnter={search}
				/>
			</li>
			<li>
				{/* 배송정보출력 */}
				<RadioBox
					label={t('배송정보출력')}
					name="gubun"
					options={radioOptions}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CheckBox name={'amtYn'} label="상품금액제외" value={'Y'}></CheckBox>
			</li>
		</>
	);
});

export default WdInvoiceSearch;
