/*
 ############################################################################
 # FiledataField	: RadioSample.tsx
 # Description		: Radiobox 샘플 
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Components
import { RadioBox, SelectBox } from '@/components/common/custom/form';
import { CardComponent } from '@/pages/sample/comfunc/sample/InputSample';

// Antd Items
import { Button, Form, Row } from 'antd';

// Utils
import { showAlert } from '@/util/MessageUtil';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { validateForm } from '@/util/FormUtil';

const RadioSample = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// form instance
	const [form] = Form.useForm();

	// form data 초기화
	const initFormData = {
		selectbox: 'USER_STATUS',
		radioBasic2: 'USER_STATUS',
		radioButton1: 'BBS_TP',
		radioButton2: 'TPL_TIMEZONE',
		radioButton3: 'UTC',
	};

	const radioBasicOptions = [
		{ label: '공지 유형', value: 'BBS_TP' },
		{
			label: '사용자 상태',
			value: 'USER_STATUS',
		},
		{
			label: '타임존',
			value: 'TPL_TIMEZONE',
		},
		{
			label: '언어',
			value: 'LANG_CD',
		},
	];
	const radioButtonOptions = getCommonCodeList('TPL_TIMEZONE', '전체');

	const [dynamicRadioOptions, setdDynamicRadioOptions] = useState(getCommonCodeList(initFormData.selectbox + ''));

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// form data onChange Event Handler
	const onFormChange = (changedValues: any, allValues: any) => {};

	/**
	 * 변경 이벤트 (다른 SelectBox option list 변경)
	 * @param {string | number} value 선택된 value
	 */
	const updateComCodeEvent = (value: string | number) => {
		form.setFieldValue('dynamicRadio', '');
		setdDynamicRadioOptions(getCommonCodeList(value + ''));
	};

	/**
	 * Form 전체 데이터 Validate 처리 함수
	 * validation은 Form Item마다 rules prop에 지정된 규칙으로 검증한다.
	 * 실패 시 로직 catch block에 기술
	 */
	const onValidate = async () => {
		//rules에 지정된 validation 기준으로 검증
		const isValid = await validateForm(form);
		if (isValid) {
			showAlert('', 'Validation 통과');
		}
	};

	const selectedValueByRadioBasic1 = Form.useWatch('radioBasic1', form);

	return (
		<>
			<Form form={form} onValuesChange={onFormChange} initialValues={initFormData}>
				<Row gutter={[16, 16]}>
					<CardComponent
						title="Radio Default"
						desc={
							<>
								<h2>options data는 label-value format으로 맞춰주어야합니다.</h2>
							</>
						}
					>
						<Row>
							<RadioBox
								label="기본"
								name="radioBasic1"
								span={24}
								options={radioBasicOptions}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
							<p>{selectedValueByRadioBasic1 === 'USER_STATUS' ? '사용자 상태' : '사용자 상태 아님 '}</p>

							<RadioBox label="기본 비활성화" name="radioBasic2" span={24} options={radioBasicOptions} disabled />
						</Row>
						<Row>
							<h2 style={{ paddingBottom: '15px' }}>Dynamic Options</h2>
						</Row>
						<Row>
							<SelectBox
								name="selectbox"
								span={18}
								placeholder="선택해주세요"
								options={radioBasicOptions}
								onChange={updateComCodeEvent}
							/>

							<RadioBox
								name="dynamicRadio"
								span={24}
								options={dynamicRadioOptions}
								optionValue="comCd"
								optionLabel="cdNm"
							/>
						</Row>
					</CardComponent>
					<CardComponent title="Radio Button" extra={<Button onClick={onValidate}>validate</Button>}>
						<Row>
							<RadioBox
								label="outline style"
								name="radioButton1"
								span={24}
								options={radioBasicOptions}
								optionType="button"
							/>
						</Row>
						<Row>
							<RadioBox
								label="solid style"
								name="radioButton2"
								span={24}
								options={radioBasicOptions}
								optionType="button"
								buttonStyle="solid"
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</Row>

						<Row>
							<RadioBox
								label="버튼 비활성화"
								name="radioButton3"
								span={24}
								options={radioButtonOptions}
								optionLabel="cdNm"
								optionValue="comCd"
								optionType="button"
								buttonStyle="solid"
								disabled
							/>
						</Row>
					</CardComponent>
				</Row>
			</Form>
		</>
	);
};

export default RadioSample;
