/*
 ############################################################################
 # FiledataField	: CmZipPopup.tsx
 # Description		: 우편번호 조회 팝업 - 현재 미사용
 # Author			: sss	
 # Since			: 25.12.09
 ############################################################################
*/
// lib
import CmZipSearch from '@/components/cm/popup/CmZipSearch';
import { InputText } from '@/components/common/custom/form';
import { Form } from 'antd';
import { forwardRef } from 'react';
// utils
// component
// API Call Function

interface SearchProps {
	form: any;
	param: any;
	callback: (addressInfo: { fullAddress: string; zonecode: string }) => void;
	close: () => void;
}

const CmZipPopup = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form } = props; // Antd Form
	const [formRef] = Form.useForm(); // 귀책정보 form
	/**
	 * 팝업 콜백 함수 (주소)
	 * @param idx
	 * @param gridRef
	 * @param {object} addressInfo 주소 정보
	 */
	const handleAddressCallback = (addressInfo: any) => {
		formRef.setFieldValue('address1', addressInfo.fullAddress);
		formRef.setFieldValue('zonecode', addressInfo.zonecode);

		(document.querySelector('input[name="address2"]') as HTMLInputElement)?.focus();
	};

	return (
		<>
			<Form form={formRef} layout="inline" className="sect">
				<li className="flex-wrap">
					<InputText
						name="address1"
						disabled
						className="bg-white"
						maxLength={100}
						style={{ width: '190px', marginRight: '5px' }}
						required
					/>
					<CmZipSearch form={formRef} callback={handleAddressCallback}></CmZipSearch>
					<InputText name="address2" className="bg-white" maxLength={100} style={{ width: '160px' }} required />
					<input type="hidden" name="zonecode" />
					<input type="text" name="activeKey" />
				</li>
			</Form>
		</>
	);
});
export default CmZipPopup;
