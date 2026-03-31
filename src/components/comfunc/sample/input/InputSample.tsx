/*
 ############################################################################
 # FiledataField	: InputRange.tsx
 # Description		: InputRange 샘플 
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Components
import CustomModal from '@/components/common/custom/CustomModal';
import {
	InputNumber,
	InputPassword,
	InputRange,
	InputSearch,
	InputText,
	InputTextArea,
	MultiInputText,
} from '@/components/common/custom/form';
import { CardComponent } from '@/pages/sample/comfunc/sample/InputSample';

// Utils
import commUtil from '@/util/commUtil';
import { validateForm } from '@/util/FormUtil';
import { showAlert } from '@/util/MessageUtil';

// Libs
import { Alert, Button, Col, Form, Input, Row, Space } from 'antd';

const InputSample = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// form instance
	const [form] = Form.useForm();

	// form data 초기화
	const initFormData = {
		inputText2: '한글만입력가능',
		inputText3: '입력 비활성화',
		inputNumber2: 24000,
		inputNumber3: 100,
	};

	const refModal01 = useRef(null);
	const [data01, setData01] = useState(null);
	const refModal02 = useRef(null);
	const [data02, setData02] = useState(null);
	const refModal03 = useRef(null);
	const [data03, setData03] = useState(null);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 검색 팝업 01
	 * @param  {string} value 입력 값
	 * @returns {void}
	 */
	// 팝업 오픈
	const showModal1 = (value: string) => {
		setData01(value);
		refModal01.current.handlerOpen();
	};
	// 팝업 닫기
	const closeModal1 = (value: any) => {
		form.setFieldsValue({
			inputSearchNm1: value.userNm,
		});
	};

	/**
	 * 검색 팝업 02
	 * @param  {string} value 입력 값
	 * @returns {void}
	 */
	// 팝업 오픈
	const showModal2 = (value: string) => {
		setData02(value);
		refModal02.current.handlerOpen();
	};
	// 팝업 닫기
	const closeModal2 = (value: any) => {
		form.setFieldsValue({
			inputSearchNm2: value.userNm,
			inputSearchVal2: value.userId,
		});
	};

	/**
	 * 검색 팝업 03
	 * @param  {string} value 입력 값
	 * @returns {void}
	 */
	// 팝업 오픈
	const showModal3 = (value: string) => {
		setData03(value);
		refModal03.current.handlerOpen();
	};
	// 팝업 닫기
	const closeModal3 = (value: any) => {
		form.setFieldsValue({
			inputSearchNm3: value.userNm,
			inputSearchVal3: value.userId,
		});
	};

	// form data onChange Event Handler
	const onFormChange = (changedValues: any, allValues: any) => {};

	// input data onChange Event Handler
	const onChange = (value: string) => {};

	// input data onPressEnter Event Handler
	const onPressEnter = (e: any) => {};

	/**
	 * Form 전체 데이터 Validate 처리 함수
	 * validation은 Form Item마다 rules prop에 지정된 규칙으로 검증한다.
	 * 실패 시 로직 catch block에 기술
	 * @returns {void}
	 */
	const onValidate = async () => {
		//rules에 지정된 validation 기준으로 검증
		const isValid = await validateForm(form);
		if (isValid) {
			showAlert('', 'Validation 통과');
		}
	};

	return (
		<>
			<Form form={form} onValuesChange={onFormChange} initialValues={initFormData} className="w100">
				<Row gutter={[8, 8]}>
					<CardComponent title="Text" extra={<Button onClick={onValidate}>validate</Button>}>
						<Row>
							<li>
								<InputText
									label="기본+validation1+label colon 제거"
									name="inputText1"
									span={24}
									placeholder="텍스트를 입력해주세요."
									maxLength={20}
									onChange={onChange}
									onPressEnter={onPressEnter}
									allowClear
									colon={false}
									showCount
									required
									rules={[
										{ required: true, validateTrigger: 'none' },
										() => ({
											validator(_, value) {
												if (commUtil.isNotEmpty(value) && value.length < 3) {
													return Promise.reject(new Error('3글자 이상 입력해주세요'));
												}
												return Promise.resolve();
											},
											validateTrigger: 'none',
										}),
									]}
								/>
							</li>
							<li>
								<InputText
									label="기본+validation2"
									name="inputText2"
									placeholder="텍스트를 입력해주세요."
									maxLength={20}
									onChange={onChange}
									onPressEnter={onPressEnter}
									allowClear
									showCount
									required
									rules={[
										{ required: true, validateTrigger: 'none' },
										() => ({
											validator(_, value) {
												const koreanReg = new RegExp(/^[ㄱ-ㅎㅏ-ㅣ가-힣]+$/);
												if (commUtil.isNotEmpty(value) && !koreanReg.test(value)) {
													return Promise.reject(new Error('한글만 입력 가능합니다.'));
												}

												return Promise.resolve();
											},
											validateTrigger: 'none',
										}),
									]}
								/>
							</li>
						</Row>
						<Row>
							<li>
								<InputText
									label="비활성화"
									name="inputText3"
									placeholder="텍스트를 입력해주세요."
									maxLength={20}
									onChange={onChange}
									onPressEnter={onPressEnter}
									allowClear
									disabled
									showCount
								/>
							</li>
							<li>
								<InputText
									name="inputText4"
									placeholder="텍스트를 입력해주세요."
									maxLength={20}
									onChange={onChange}
									onPressEnter={onPressEnter}
									allowClear
									showCount
								/>
							</li>
						</Row>
					</CardComponent>
					<CardComponent title="Search">
						<Row>
							<li>
								<InputSearch
									label="검색"
									name="inputSearchNm1"
									placeholder="텍스트를 입력해주세요."
									maxLength={20}
									onSearch={showModal1}
									hidden
									showCount
								/>
							</li>
							<li>
								<InputSearch
									label="검색+값(hidden)"
									name="inputSearchNm2"
									nameSearch="inputSearchVal2"
									placeholder="텍스트를 입력해주세요."
									maxLength={20}
									onSearch={showModal2}
									hidden
									showCount
								/>
							</li>
							<li>
								<InputSearch
									label="검색+값(disabled)"
									name="inputSearchNm3"
									nameSearch="inputSearchVal3"
									spanSearch={8}
									placeholder="텍스트를 입력해주세요."
									onSearch={showModal3}
									maxLength={20}
									required
									showCount
								/>
							</li>
							<li>
								<InputSearch
									name="inputSearchNm4"
									nameSearch="inputSearchVal4"
									placeholder="텍스트를 입력해주세요."
									maxLength={20}
									onSearch={showModal2}
									showCount
								/>
							</li>
						</Row>
					</CardComponent>
					<CardComponent title="TexArea">
						<Row>
							<li>
								<InputTextArea
									label="TextArea"
									name="inputTextArea1"
									placeholder="텍스트를 입력해주세요."
									maxLength={100}
									allowClear
									showCount
								/>
							</li>
							<li>
								<InputTextArea
									label="Auto Sizing"
									name="inputTextArea2"
									placeholder="텍스트를 입력해주세요."
									maxLength={100}
									allowClear
									showCount
									autoSize
								/>
							</li>
							<li>
								<InputTextArea
									name="inputTextArea3"
									placeholder="텍스트를 입력해주세요."
									maxLength={100}
									allowClear
									showCount
								/>
							</li>
						</Row>
					</CardComponent>
				</Row>
				<Row gutter={[8, 8]}>
					<CardComponent title="Number">
						<Row>
							<li>
								<InputNumber
									label="Number"
									name="inputNumber1"
									placeholder="숫자를 입력해주세요."
									min={0}
									max={99999}
									step={100}
									width={'200px'}
									showCount
								/>
							</li>
							<li>
								<InputNumber
									label="Number Format 1"
									name="inputNumber2"
									placeholder="숫자를 입력해주세요."
									min={0}
									max={99999}
									step={100}
									width={'200px'}
									formatter={(value: string) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(value: string) => value?.replace(/\$\s?|(,*)/g, '')}
									showCount
								/>
							</li>
							<li>
								<InputRange
									label="Number Format InputRange"
									name="inputNumber2"
									placeholder="숫자를 입력해주세요."
									min={0}
									max={99999}
									step={100}
									width={'200px'}
									formatter={(value: string) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(value: string) => value?.replace(/\$\s?|(,*)/g, '')}
									showCount
								/>
							</li>
							<li>
								<InputNumber
									label="Number Format 2"
									name="inputNumber3"
									placeholder="숫자를 입력해주세요."
									min={0}
									max={100}
									step={10}
									width={'200px'}
									formatter={(value: string) => `${value}%`}
									parser={(value: string) => value?.replace('%', '')}
									showCount
									required
								/>
							</li>
						</Row>
					</CardComponent>
					<CardComponent title="Password">
						<Row>
							<InputPassword
								label="Password"
								name="inputPassword"
								span={24}
								placeholder="비밀번호를 입력해주세요."
								maxLength={20}
								allowClear
								showCount
								required
								rules={[
									{ required: true, validateTrigger: 'none' },
									() => ({
										validator(_, value) {
											const passwordRegex = new RegExp(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/);
											if (commUtil.isNotEmpty(value) && !passwordRegex.test(value)) {
												return Promise.reject(
													new Error(
														'비밀번호는 대문자 1개 이상, 길이 8글자 이상, 특수문자 1개 이상, 숫자 포함해야합니다.',
													),
												);
											}

											return Promise.resolve();
										},
										validateTrigger: 'none',
									}),
								]}
							/>
						</Row>
					</CardComponent>
					<CardComponent title="InputRange">
						<li>
							<InputRange label="InputRange" fromName="fromloc" toName="toloc" />
						</li>
					</CardComponent>
				</Row>
				<Row gutter={[8, 8]}>
					<CardComponent title="MultiInputText">
						<li>
							<MultiInputText label={'MultiInputText'} />
						</li>
					</CardComponent>
					<CardComponent title="sample">sample</CardComponent>
					<CardComponent title="sample">sample</CardComponent>
				</Row>
			</Form>
			{/* 검색 팝업 3종 */}
			<CustomModal ref={refModal01} width="636px">
				<PopupSample ref={refModal01} data={data01} onOk={closeModal1}></PopupSample>
			</CustomModal>
			<CustomModal ref={refModal02} width="636px">
				<PopupSample ref={refModal02} data={data02} onOk={closeModal2}></PopupSample>
			</CustomModal>
			<CustomModal ref={refModal03} width="636px">
				<PopupSample ref={refModal03} data={data03} onOk={closeModal3}></PopupSample>
			</CustomModal>
		</>
	);
};

export default InputSample;

/**
 * 팝업 샘플
 * @returns {*} 팝업 샘플 컴포넌트
 */
const PopupSample = forwardRef((props: any, ref: any) => {
	const { data, onOk } = props;

	const [postData] = useState({
		userId: 'gildong.hong',
		userNm: '홍길동',
	});

	const divStyle: React.CSSProperties = {
		lineHeight: '48px',
		backgroundColor: '#fff',
		display: 'flex',
		flexDirection: 'column',
	};
	/**
	 * 클릭 이벤트
	 * @param  {string} value 입력 값
	 */
	const onClickEvent = (value: boolean) => {
		const returnObj = {
			userId: '',
			userNm: '',
		};
		// 확인
		if (value) {
			returnObj.userId = 'gildong.hong';
			returnObj.userNm = '홍길동';
		}
		onOk(returnObj);
		ref.current.handlerClose();
	};

	/**
	 * 닫기 이벤트
	 */
	const onClickCloseEvent = () => {
		ref.current.handlerClose();
	};
	return (
		<div style={divStyle}>
			<Row>
				<Col offset={6} span={4}>
					전달 받은 data
				</Col>
				<Col span={8}>
					<Input value={data} disabled />
				</Col>
			</Row>
			<Row>
				<Col offset={6} span={12}>
					<Alert message="확인 버튼 클릭 시 아래 샘플 데이터 전달" />
				</Col>
			</Row>
			<Row>
				<Col offset={6} span={4}>
					ID
				</Col>
				<Col span={8}>
					<Input value={postData.userId} disabled />
				</Col>
			</Row>
			<Row>
				<Col offset={6} span={4}>
					Name
				</Col>
				<Col span={8}>
					<Input value={postData.userNm} disabled />
				</Col>
			</Row>
			<Row>
				<Col offset={8}>
					<Space wrap>
						<Button
							onClick={() => {
								onClickEvent(true);
							}}
						>
							확인
						</Button>
						<Button onClick={onClickCloseEvent}>닫기</Button>
						<Button
							onClick={() => {
								onClickEvent(false);
							}}
						>
							초기화
						</Button>
					</Space>
				</Col>
			</Row>
		</div>
	);
});
