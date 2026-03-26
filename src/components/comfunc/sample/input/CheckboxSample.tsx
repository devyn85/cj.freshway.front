/*
 ############################################################################
 # FiledataField	: CheckboxSample.tsx
 # Description		: checkbox 샘플 
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Components
import { InputText } from '@/components/common/custom/form';
import CheckBox from '@/components/common/custom/form/CheckBox';
import CheckboxGroup from '@/components/common/custom/form/CheckboxGroup';
import { CardComponent } from '@/pages/sample/comfunc/sample/InputSample';

// Antd Items
import { Button, Col, Divider, Form, Row } from 'antd';
import Checkbox, { CheckboxChangeEvent } from 'antd/es/checkbox';

// Utils
import { showAlert } from '@/util/MessageUtil';

// Types
import { CommonCodeType } from '@/types/common';

// APIs
import { apiGetCommonI18NCommonCode } from '@/api/common/apiSysmgt';
import { validateForm } from '@/util/FormUtil';

const CheckboxSample = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// form instance
	const [form] = Form.useForm();

	// form data 초기화
	const initFormData = {
		cbxBasic1: true,
		cbxBasic2: '1',
		cbxBasic3: true,
		cbxGrp1: ['BBS_TP'], // checkbox group의 초기값은 배열에 담는다.
		cbxGrp2: ['USER_STATUS'],
		checkTarget: ['Asia/Dubai', 'US/Central'],
	};

	/**
	 * option의 data는 { label:${label}, value:${value} } 포맷으로 넘겨줍니다.
	 */
	const cbxGrpopts = [
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

	// checked 확인을 위한 State(디버깅용)
	const [cbxBasic1State, setCbxBasic1State] = useState(initFormData.cbxBasic1);

	// checked 확인을 위한 State(디버깅용)
	const [cbxBasic2State, setCbxBasic2State] = useState(initFormData.cbxBasic2);

	// 비활성화 여부 상태 관리
	const [isDisabled, setIsDisabled] = useState(initFormData.cbxBasic3);

	// Check All & Uncheck All 대상 Checkbox Group 옵션 상태 관리
	const [cbxCtrlopts, setCbxCtrlopts] = useState<CommonCodeType[]>([]);

	// checkbox group 전체 선택/해제 동작을 위한 상태 관리
	const [checkAll, setCheckAll] = useState(cbxCtrlopts?.length === initFormData?.checkTarget?.length);

	// indeterminate 속성 제어를 위한 상태 관리
	const [indeterminate, setIndeterminate] = useState(
		initFormData?.checkTarget?.length > 0 && initFormData?.checkTarget?.length < cbxCtrlopts?.length,
	);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// form data onChange Event Handler
	const onFormChange = (changedValues: any, allValues: any) => {};

	/**
	 * 기본 체크박스 onChage Event Handler
	 * @param {CheckboxChangeEvent} e onChange Event
	 * e.target.checked: checked 상태
	 * e.target.value: {
	 * 					trueValue: ${trueValue}
	 * 					falseValue: ${falseValue}
	 * 					}
	 */
	const onChangeCbxBasic1 = (e: CheckboxChangeEvent) => {
		setCbxBasic1State(e.target.checked);
	};

	/**
	 * TF 값 지정 체크박스 onChage Event Handler
	 * @param {CheckboxChangeEvent} e onChange Event
	 * e.target.checked: checked 상태
	 * e.target.value: {
	 * 					trueValue: ${trueValue}
	 * 					falseValue: ${falseValue}
	 * 					}
	 */
	const onChangeCbxBasic2 = (e: CheckboxChangeEvent) => {
		setCbxBasic2State(e.target.checked ? e.target.value.trueValue : e.target.value.falseValue);
	};

	/**
	 * Input 비활성화 item의 onChange Event Handler
	 * 우측 Input 요소를 (비)활성화
	 * @param {CheckboxChangeEvent} e Checkbox onChange Event
	 */
	const onChangeDisalbe = (e: CheckboxChangeEvent) => {
		setIsDisabled(e.target.checked);
	};

	/**
	 * 전체 선택/해제 checkbox onChange Event Handler
	 * @param {CheckboxChangeEvent} e Checkbox onChange Event
	 */
	const checkAllChange = (e: CheckboxChangeEvent) => {
		if (e.target.checked) {
			const checkedList: string[] = [];
			cbxCtrlopts.map(opt => {
				checkedList.push(opt.comCd);
			});
			setCheckAll(true);
			form.setFieldValue('checkTarget', checkedList);
		} else {
			setCheckAll(false);
			form.setFieldValue('checkTarget', []);
		}
	};

	/**
	 * 전체 선택/해제 대상 checkbox group의 onChange Event Handler
	 * @param list current checked option list
	 */
	const onChangeTarget = (list: any) => {
		setIndeterminate(list?.length > 0 && list?.length < cbxCtrlopts?.length);
		setCheckAll(cbxCtrlopts?.length === list?.length);
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

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// Component Mounted
	useEffect(() => {
		// checkbox group option API 연동
		// apiGetCommonCdList({
		// 	comGrpCd: 'TPL_TIMEZONE', // 타임존
		// }).then(res => {
		// 	setCbxCtrlopts(res.data);
		// });

		apiGetCommonI18NCommonCode({
			comGrpCd: 'TPL_TIMEZONE', // 공지사항 게시 구분
		}).then(res => {
			setCbxCtrlopts(res.data);
		});
	}, []);

	return (
		<>
			<Form form={form} onValuesChange={onFormChange} initialValues={initFormData}>
				<Row gutter={[16, 16]}>
					<CardComponent title="Checkbox">
						<Row>
							<CheckBox label="기본" name="cbxBasic1" onChange={onChangeCbxBasic1}></CheckBox>
							<Col span={6}>
								<span>value: {cbxBasic1State ? 'true' : 'false'}</span>
							</Col>
						</Row>
						<Row>
							<CheckBox
								label="TF 값 지정"
								name="cbxBasic2"
								trueValue={'1'}
								falseValue={'0'}
								onChange={onChangeCbxBasic2}
							></CheckBox>
							<Col span={6}>
								<span>value: {cbxBasic2State}</span>
							</Col>
						</Row>
						<Divider />
						<Row>
							<CheckBox
								span={10}
								label="Input 비활성화(데이터 연계)"
								name="cbxBasic3"
								onChange={onChangeDisalbe}
							></CheckBox>
							<InputText
								span={12}
								placeholder="텍스트를 입력해주세요."
								maxLength={20}
								allowClear
								showCount
								disabled={isDisabled} // checkbox state와 연동
							/>
						</Row>
					</CardComponent>

					<CardComponent
						title="Checkbox Group"
						desc={
							<>
								<h2>options data는 label-value format으로 맞춰주어야합니다.</h2>
							</>
						}
						extra={<Button onClick={onValidate}>validate</Button>}
					>
						<Row>
							<CheckboxGroup
								label="Group Checkbox"
								name="cbxGrp1"
								span={24}
								options={cbxGrpopts}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</Row>
						<Row>
							<CheckboxGroup
								label="Group Checkbox(disabled)"
								name="cbxGrp2"
								span={24}
								options={cbxGrpopts}
								optionSpan={12}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
								disabled
							/>
						</Row>
						<Divider />
						<Row>
							<Checkbox checked={checkAll} indeterminate={indeterminate} onChange={checkAllChange}>
								Check All
							</Checkbox>
						</Row>
						<Row>
							{/* label, value의 필드값이 다를 경우 직접 매핑 */}
							<CheckboxGroup
								label="전체 선택/해제"
								name="checkTarget"
								span={24}
								optionSpan={24}
								options={cbxCtrlopts}
								onChange={onChangeTarget}
								optionLabel="cdNm"
								optionValue="comCd"
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</Row>
					</CardComponent>
				</Row>
			</Form>
		</>
	);
};

export default CheckboxSample;
