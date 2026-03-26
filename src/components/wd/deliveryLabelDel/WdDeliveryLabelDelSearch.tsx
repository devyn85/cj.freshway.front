/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelDelSearch.tsx
 # Description		: 배송라벨삭제현황 Search
 # Author			: 공두경
 # Since			: 25.06.23
 ############################################################################
*/

//Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

//Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// API Call Function
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Util

const dateFormat = 'YYYY-MM-DD';

const WdDeliveryLabelDelSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form } = props;
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
		form.setFieldValue('secrchDate', initialDate);
		if (gDccode) {
			props.form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	return (
		<>
			<li>
				<DatePicker
					label={t('lbl.DOCDT_WD')} //출고일자
					name="secrchDate"
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
				{/* 창고코드 */}
				<InputText
					name="name"
					label={'창고코드/명'}
					placeholder={t('msg.placeholder2', ['창고코드 또는 이름'])}
					// onPressEnter={onClickSearchButton}
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
				<CmCustSearch
					form={form}
					label={t('lbl.TO_CUSTKEY_WD')} //관리처코드
					name="toCustkeyNm"
					code="toCustkey"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<CmSkuSearch
					form={form}
					label={t('lbl.SKU')} //상품코드
					name="skuNm"
					code="sku"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.DELETE_YN')} //삭제여부
					name="deletelabelstatus"
					placeholder="선택해주세요"
					options={
						getCommonCodeList('DELETE_LABEL_STATUS', '--- 전체 ---')?.filter(code => !['1'].includes(code.comCd)) || []
					}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
});

export default WdDeliveryLabelDelSearch;
