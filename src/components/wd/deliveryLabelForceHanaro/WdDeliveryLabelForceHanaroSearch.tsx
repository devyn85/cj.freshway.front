/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelForceHanaroSearch.tsx
 # Description		: 이력피킹현황 Search
 # Author			: 공두경
 # Since			: 25.07.14
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

const WdDeliveryLabelForceHanaroSearch = forwardRef((props: any, parentRef: any) => {
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
	// 상태콤보값 세팅
	const printmethodOption = [
		{ label: '신규', value: 'NEW' },
		{ label: '재발행', value: 'OLD' },
	];
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

	if (activeKey === '1' || activeKey === '2') {
		// activeKey가 '1'일 때는 일부만 표시
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
					<CmCustSearch
						form={form}
						name="toCustkeyNm"
						code="toCustkey"
						label={t('lbl.TO_CUSTKEY_WD')}
						/*관리처코드*/ selectionMode="multipleRows"
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
				<li>
					{/* 물류센터 */}
					<CmGMultiDccodeSelectBox
						name="fixdccode"
						placeholder="선택해주세요"
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.DCCODE')} //물류센터(에러)
						mode={'single'}
						//disabled={form.getFieldValue('fixdccodeDisabled')}
						disabled={activeKey === '2' ? false : true}
					/>
				</li>
			</>
		);
	} else {
		// activeKey가 '2'일 때는 다른 필드도 표시
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
					<InputText
						label={t('lbl.PICK_BATCH_NO')} //대배치키
						name="pickbatchno"
						placeholder={t('msg.placeholder1', [t('lbl.PICK_BATCH_NO')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<InputText
						label={t('lbl.PICK_NO')} //피킹번호
						name="pickno"
						placeholder={t('msg.placeholder1', [t('lbl.PICK_NO')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<SelectBox
						label={t('lbl.ORDERTYPE_WD')} //주문유형
						name="ordertype"
						placeholder="선택해주세요"
						options={getCommonCodeList('ORDERTYPE_WD', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<SelectBox
						label={'CROSS센터'} //CROSS센터
						name="crossdc"
						placeholder="선택해주세요"
						options={getCommonCodeList('DELIVERY_CROSS', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<SelectBox
						label={'출력방법'} //출력방법
						name="printmethod"
						placeholder="선택해주세요"
						options={printmethodOption}
					/>
				</li>
				<li>
					<SelectBox
						label={'피킹방법'} //피킹방법
						name="tasksystem"
						placeholder="선택해주세요"
						options={getCommonCodeList('TASKSYSTEM_WD', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
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
					<SelectBox
						label={'출력순서'} //출력순서
						name="printorder"
						placeholder="선택해주세요"
						options={getCommonCodeList('PRINTORDER', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
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
				<li>
					<SelectBox
						label={t('lbl.SKUGROUP')} //상품분류
						name="skugroup"
						placeholder="선택해주세요"
						options={getCommonCodeList('SKUGROUP', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
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
						label={t('lbl.CROSSDOCKTYPE')} //C/D타입
						name="crossdocktype"
						placeholder="선택해주세요"
						options={getCommonCodeList('CROSSDOCKTYPE', '--- 전체 ---')}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
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
	}
});

export default WdDeliveryLabelForceHanaroSearch;
