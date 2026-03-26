/*
 ############################################################################
 # FiledataField	: SelectSample.tsx
 # Description		: Select 샘플 
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// Components
import { SelectBox, SelectRange } from '@/components/common/custom/form';
import { CardComponent } from '@/pages/sample/comfunc/sample/InputSample';

// APIs
import { apiGetPopupEmpGetData } from '@/api/common/apiComfunc';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Utils
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// Antd Items
import { validateForm } from '@/util/FormUtil';
import { Button, Form, Row } from 'antd';

const SelectSample = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// form instance
	const [form] = Form.useForm();

	// form data 초기화
	const initFormData = {
		selectSingle: 'kr공지사항',
		selectUpdateOne: '',
		selectUpdateTwo: '',
		selectChgOne: '',
		selectChgTwo: '',
	};

	// static select options case
	const selectUpdateOneOptions = [
		{ label: '--- 선택 ---', value: '' },
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

	// dynamic select options case
	const [selectUpdateTwoOptions, setSelectUpdateTwoOptions] = useState([{ cdNm: '--- 선택 ---', comCd: '' }]);

	// 담당자 조회
	const [empOptions, setEmpOptions] = useState([]);
	const [empLoading, setEmpLoading] = useState(false);

	const [isSelected1, setIsSelected1] = useState(true);
	const [isSelected2, setIsSelected2] = useState(true);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// form data onChange Event Handler
	const onFormChange = (changedValues: any, allValues: any) => {};

	/**
	 * 기본 코드 변경 이벤트
	 * @param  {string} value 선택된 값
	 * @param {object} option 선택 option
	 */
	const selectEvent = (value: string | number, option: object) => {};

	/**
	 * 변경 이벤트 (다른 SelectBox option list 변경)
	 * @param  {string} value 선택된 값
	 */
	const updateComCodeEvent = (value: string | number) => {
		if (commUtil.isEmpty(value)) {
			setIsSelected1(true);
		} else {
			setIsSelected1(false);
			form.setFieldValue('selectUpdateTwo', '');
			setSelectUpdateTwoOptions(getCommonCodeList(value + '', '--- 선택 ---'));
		}
	};

	/**
	 * 변경 이벤트 (다른 SelectBox 값 변경)
	 * @param  {string} value 선택된 값
	 */
	const changeComCodeEvent = (value: string | number) => {
		commUtil.isEmpty(value) ? setIsSelected2(true) : setIsSelected2(false);
		form.setFieldValue('selectChgTwo', 'ko_kr');
		if (value === 'ko_kr') {
			form.setFieldValue('selectChgTwo', 'Asia/Seoul');
		} else if (value === 'en_us') {
			form.setFieldValue('selectChgTwo', 'US/Central');
		} else {
			form.setFieldValue('selectChgTwo', '');
		}
	};

	/**
	 * 관리자 검색 데이터
	 * @param  {string} value 선택된 값
	 */
	const searchEmpGetData = async (value: string) => {
		let params = {};
		params = { userNm: value };

		setEmpLoading(true);
		if (value) {
			await apiGetPopupEmpGetData(params).then(res => {
				setEmpOptions(res.data);
			});
		} else {
			setEmpOptions([]);
		}
		setEmpLoading(false);
	};

	/**
	 * 담당자 정보 초기화
	 */
	const initEmpOption = () => {
		setEmpOptions([]);
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

	return (
		<>
			<Form form={form} onValuesChange={onFormChange} initialValues={initFormData}>
				<Row gutter={[16, 16]}>
					<CardComponent
						style={{ width: '100%', border: '1px solid #d9d9d9' }}
						title="SelectBox"
						desc={
							<>
								<h2>options data는 label-value format으로 맞춰주어야합니다.</h2>
							</>
						}
						extra={<Button onClick={onValidate}>validate</Button>}
					>
						<Row>
							<SelectBox
								name="selectSingle"
								span={24}
								label="공통코드(기본 단일)"
								placeholder="선택해주세요"
								options={getCommonCodeList('CONTRACTTYPE', '--- 선택 ---')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								onChange={selectEvent}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</Row>
						{/* SelectBox 변경 이벤트 */}
						<Row>
							<SelectBox
								name="selectUpdateOne"
								span={12}
								label="공통코드(단일+동적옵션)"
								placeholder="선택해주세요"
								options={selectUpdateOneOptions}
								onChange={updateComCodeEvent}
							/>
							<SelectBox
								name="selectUpdateTwo"
								span={12}
								placeholder="선택해주세요"
								options={selectUpdateTwoOptions}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								disabled={isSelected1}
							/>
						</Row>
						{/* SelectBox 변경 이벤트 */}
						<Row>
							<SelectBox
								name="selectChgOne"
								span={12}
								label="공통코드 변경 이벤트"
								placeholder="선택해주세요"
								options={getCommonCodeList('LANG_CD', '--- 선택 ---')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								onSelect={changeComCodeEvent}
							/>
							<SelectBox
								name="selectChgTwo"
								span={12}
								placeholder="선택해주세요"
								options={getCommonCodeList('TPL_TIMEZONE', '--- 선택 ---')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								disabled={isSelected2}
							/>
						</Row>
						{/* 공통코드(검색+단일+선택) */}
						<Row>
							<SelectBox
								name="selectSearchSingle"
								span={24}
								label="공통코드(검색+단일+선택)"
								options={getCommonCodeList('CONTRACTTYPE')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								showSearch
								allowClear
								placeholder="선택해주세요"
								onChange={selectEvent}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</Row>
						{/* 공통코드(검색+다중+입력) */}
						<Row>
							<SelectBox
								name="selectSearchMultiple"
								span={24}
								label="공통코드(검색+다중+입력)"
								mode="multiple"
								options={getCommonCodeList('CONTRACTTYPE')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								showSearch
								allowClear
								placeholder="선택해주세요"
								onSelect={selectEvent}
							/>
						</Row>
						{/* 담당자(검색+싱글) */}
						<Row>
							<SelectBox
								name="selectEmpSingle"
								span={24}
								label="담당자(검색+싱글)"
								options={empOptions}
								fieldNames={{ label: 'userNm', value: 'userId' }}
								showSearch
								placeholder="선택해주세요"
								notFoundContent={empLoading ? undefined : null}
								allowClear
								filterOption={false}
								onSearch={searchEmpGetData}
								onSelect={selectEvent}
								onBlur={initEmpOption}
							/>
						</Row>
						{/* 담당자(검색+다중) */}
						<Row>
							<SelectBox
								name="selectEmpMultiple"
								span={24}
								label="담당자(검색+다중)"
								mode="multiple"
								options={empOptions}
								fieldNames={{ label: 'userNm', value: 'userId' }}
								showSearch
								placeholder="입력해주세요"
								notFoundContent={empLoading ? undefined : null}
								allowClear
								filterOption={false}
								onSearch={searchEmpGetData}
								onChange={selectEvent}
								onBlur={initEmpOption}
								rules={[
									{ required: true, validateTrigger: 'none' },
									() => ({
										validator(_, value) {
											if (commUtil.isNotEmpty(value) && value.length < 2) {
												return Promise.reject(new Error('2명 이상 선택되어야합니다.'));
											}
											return Promise.resolve();
										},
										validateTrigger: 'none',
									}),
								]}
							/>
						</Row>
						<Row>
							<SelectRange
								name="selectRange"
								span={24}
								label="구간 선택"
								placeholder="선택해주세요"
								options={getCommonCodeList('CONTRACTTYPE', '--- 선택 ---')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								onChange={selectEvent}
								rules={[{ required: false, validateTrigger: 'none' }]}
							/>
						</Row>
						<Row className="range-align">
							<SelectBox label={'InputRange'} />
							<span>~</span>
							<SelectBox />
						</Row>
					</CardComponent>
				</Row>
			</Form>
		</>
	);
};

export default SelectSample;
