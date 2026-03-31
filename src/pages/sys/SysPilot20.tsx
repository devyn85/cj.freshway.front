/* eslint-disable @typescript-eslint/no-empty-function */
/*
 ############################################################################
 # FiledataField	: Pilot20.tsx
 # Description		: 팝업 테스트
 # Author			: KimSunHo
 # Since			: 25.05.09
 ############################################################################
*/
// Lib
import { Button, Divider, Form } from 'antd';
// Utils
// Store
// Component
import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import CmSkuSpecSearch from '@/components/cm/popup/CmSkuSpecSearch';
import { SearchForm } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import SysPilot20Detail from '@/components/sys/pilot20/SysPilot20Detail';
import SysPilot20Search from '@/components/sys/pilot20/SysPilot20Search';

// API Call Function

const Pilot20 = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();

	// form data 초기화
	const initFormData = {
		carrierName: '',
		carrierCode: '',
		skuSpecName: '',
		skuSpecCode: '',
	};

	const gridRef = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 화면 초기화
	 */
	const initForm = () => {};

	/**
	 * Form 수정된값 출력
	 * @param changedValues
	 * @param allValues
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		//console.log((allValues);
	};

	const onChangeInput = (params: any) => {};

	const onClickButton = () => {
		const formData = form.getFieldsValue();
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 화면 초기 세팅
	useEffect(() => {
		initForm();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle />

			<Button onClick={onClickButton}>확인</Button>

			{/* 팝업 */}
			<SearchForm form={form} initialValues={initFormData} onValuesChange={onValuesChange}>
				<Divider orientation="left">운송사 조회 팝업</Divider>
				<CmCarrierSearch
					form={form}
					selectionMode="multipleRows"
					name="carrierName"
					code="carrierCode"
					returnValueFormat="name"
				/>

				<Divider orientation="left">상품 분류 조회 팝업</Divider>
				<CmSkuSpecSearch
					form={form}
					selectionMode="singleRow"
					name="skuSpecName"
					code="skuSpecCode"
					returnValueFormat="name"
				/>
			</SearchForm>

			{/* 조회 조건 */}
			<Divider orientation="left">조회 조건</Divider>
			<SearchForm form={form} initialValues={initFormData} onValuesChange={onValuesChange}>
				<SysPilot20Search form={form}></SysPilot20Search>
			</SearchForm>

			{/* 그리드 */}
			<SysPilot20Detail ref={gridRef}></SysPilot20Detail>
		</>
	);
};

export default Pilot20;
