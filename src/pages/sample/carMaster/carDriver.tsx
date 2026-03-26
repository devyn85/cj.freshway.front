/*
 ############################################################################
 # FiledataField	: CarDriver.tsx
 # Description		: 샘플화면
 # Author			: Canal Frame
 # Since			: 25.04.17
 ############################################################################
 */

// Lib
import { showConfirm } from '@/util/MessageUtil';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';

// Utils
// Store

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import DetailCarDriver from '@/components/sample/carMaster/carDriver/DetailCarDriver';
import SearchCarDriver from '@/components/sample/carMaster/carDriver/SearchCarDriver';

// API Call Function
import { apiGetCarDriverList, apiPostInsertCarMaster } from '@/api/sample/apiCarMaster';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import DatePicker from '@/components/common/custom/form/Datepicker';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';

const CarDriver = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	const [detailForm] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [searchBox] = useState({});
	const [isDisabled, setIsDisabled] = useState(true);
	const [totalCnt, setTotalCnt] = useState(0);

	// 다국어
	const { t } = useTranslation();

	// form data 초기화
	const initFormData = {
		datePickerBasic1: dayjs(),
		datePickerBasic2: dayjs(),
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/*
    ### 조회 ###
    */
	const search = () => {
		refs.gridRef.current.clearGridData();
		setIsDisabled(true);
		const params = form.getFieldsValue();

		apiGetCarDriverList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	/*
    ### 저장 ###
    */
	const save = () => {
		// 변경 데이터 확인
		// const roleMenus = refs.gridRef.current.getChangedData();
		// if (!roleMenus || roleMenus.length < 1) {
		// 	showAlert(null, t('com.msg.noChange')); // 변경사항이 없습니다
		// 	return;
		// }

		//저장하시겠습니까
		showConfirm(null, t('msg.confirmSave'), () => {
			const params = detailForm.getFieldsValue();
			apiPostInsertCarMaster(params).then(() => {
				setIsDisabled(true);
				search();
			});
		});
	};

	/*
	### 신규 ###
	*/
	const new1 = () => {
		//입력폼 clear
		detailForm.resetFields();
		setIsDisabled(false);
	};

	const titleFunc = {
		searchYn: search,
		saveYn: save,
		newYn: new1,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 검색상자 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);
	// HTML 랜더링이 완료되면
	useEffect(() => {
		// search();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn|newYn|btn1Yn|saveYn" />
			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={initFormData}>
				<UiFilterArea>
					<UiFilterGroup>
						<li>
							<SelectBox
								name="defDccode"
								placeholder="선택해주세요"
								label={'물류센터'}
								//options={getCommonCodeList('BBS_TP', '--- 선택 ---')}
								options={[
									{ cdNm: '이천물류센터', comCd: '2600' },
									{ cdNm: '수원물류센터', comCd: '2620' },
									{ cdNm: '동탄2물류센터', comCd: '2660' },
								]}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								// defaultValue={'2600'}
								// onChange={}
								// required
								// rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</li>
						<li>
							<InputText
								label={t('lbl.CARNO')}
								name="carNo"
								placeholder={t('msg.placeholder2', [t('sysmgt.roles.group.authority')])}
								onPressEnter={search}
							/>
						</li>
						<li>
							<InputText
								label={'운전자이름'}
								name="driverName"
								placeholder={t('msg.placeholder2', [t('sysmgt.roles.group.authority')])}
								onPressEnter={search}
							/>
						</li>
						<li>
							<SelectBox
								label={'삭제여부'}
								name="delYn"
								placeholder="선택해주세요"
								options={getCommonCodeList('DEL_YN', '--- 전체 ---')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								// onChange={}
								// required
								// rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</li>
						<li>
							<SelectBox
								label={'계약유형'}
								name="contractType"
								placeholder="선택해주세요"
								options={getCommonCodeList('CONTRACTTYPE', '--- 선택 ---')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								// onChange={}
								// required
								// rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</li>
						<li>
							<span>
								<DatePicker
									label={'차량소독증 유효기간TO'}
									name="datePickerBasic1"
									// onChange={onChange}
									required
									allowClear
									showNow={true}
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
								<Button
									type="default"
									onClick={() => {
										return;
									}}
								>
									선택적용
								</Button>
							</span>
						</li>
						<li>
							<span>
								<DatePicker
									label={'보건증 유효기간TO'}
									name="datePickerBasic2"
									// onChange={onChange}
									required
									allowClear
									showNow={true}
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
								<Button
									type="default"
									onClick={() => {
										return;
									}}
								>
									선택적용
								</Button>
							</span>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>
			<DetailCarDriver ref={refs} form={detailForm} data={gridData} isDisabled={isDisabled} totalCnt={totalCnt} />
		</>
	);
};

export default CarDriver;
