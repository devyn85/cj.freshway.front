/* eslint-disable react/jsx-no-undef */
/*
 ############################################################################
 # FiledataField	: WdInvoiceTotalSearch.tsx
 # Description		: 통합납품서출력 Search
 # Author			: Canal Frame
 # Since			: 25.06.10
 ############################################################################
*/

//Component
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
//Lib
import dayjs from 'dayjs';

// API Call Function
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
//Util

const dateFormat = 'YYYY-MM-DD';

const WdInvoiceTotalSearch = forwardRef((props: any, parentRef: any) => {
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
	/**
	 * 현재날짜를 셋팅한다.
	 */
	useEffect(() => {
		const dt1 = dayjs();
		const dt2 = dayjs();
		setDates([dt1, dt2]);
		form.setFieldValue('docdt', [dt1, dt2]);

		form.setFieldValue('invoiceprinttype', 'WD'); // 초기값 설정
	}, []);

	return (
		<>
			<li>
				<Rangepicker
					label="납품일자" // 납품일자
					name="docdt"
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
				<InputText
					label={t('lbl.DOCNO_WD')} //주문번호
					name="docno"
					placeholder={t('msg.placeholder1', [t('lbl.DOCNO_WD')])}
					onPressEnter={search}
				/>
			</li>
			<li>
				{/* 거래처 팝업 */}
				<CmCustSearch
					form={form}
					label={t('lbl.CUSTCODENAME')}
					code="custkey"
					name="custkeynm"
					returnValueFormat="name"
				/>
			</li>
			<li>
				{/* 차량 팝업 */}
				<CmCarSearch form={form} code="carno" name="carnoNm" label={t('lbl.CARNO')} />
			</li>
			<li>
				<SelectBox
					label="출력유형" // 출력유형
					name="invoiceprinttype"
					placeholder="선택해주세요"
					options={getCommonCodeList('INVOICEPRINTTYPE', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
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
		</>
	);
});

export default WdInvoiceTotalSearch;
