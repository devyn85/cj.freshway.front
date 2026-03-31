/*
 ############################################################################
 # FiledataField	: WdPickingCancelSearch.tsx
 # Description		: 피킹취소처리 Search
 # Author			: 공두경
 # Since			: 25.06.30
 ############################################################################
*/

//Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
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

const WdPickingCancelSearch = forwardRef((props: any, parentRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, exception } = props;
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
				<InputText
					label={t('lbl.DELIVERYGROUP_WD')} //POP번호
					name="deliverygroup"
					placeholder={t('msg.placeholder1', [t('lbl.DELIVERYGROUP_WD')])}
					onPressEnter={search}
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
					options={getCommonCodeList('TASKSYSTEM_WD', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<MultiInputText
					label={t('lbl.DOCNO_WD')} //문서번호
					name="docno"
					placeholder={t('msg.placeholder1', [t('lbl.DOCNO_WD')])}
					onPressEnter={search}
				/>
			</li>
			<li>
				<CmSkuSearch
					form={form}
					name="skuNm"
					code="sku"
					label={t('lbl.SKU')}
					/*상품코드*/ selectionMode="multipleRows"
				/>
			</li>
		</>
	);
});

export default WdPickingCancelSearch;
