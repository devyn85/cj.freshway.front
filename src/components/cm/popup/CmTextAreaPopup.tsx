/*
 ############################################################################
 # FiledataField	: CmTextAreaPopup.tsx
 # Description		: 텍스트 영역 팝업
 # Author			: sss	
 # Since			: 25.12.09
 ############################################################################
*/
import { Button, Form } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import SearchForm from '@/components/common/custom/form/SearchForm';
// Component
import { InputTextArea } from '@/components/common/custom/form';

// CSS
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
interface PropsType {
	titleName?: any;
	params?: any;
	callBack?: any;
	close?: any;
}
const CmTextAreaPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { close, titleName = '배송메모', params } = props;
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldValue('rmk', params?.rmk || '');
	}, []);

	/**
	 * =====================================================================
	 *  02. useImperativeHandle - ref 메소드 노출
	 * =====================================================================
	 * @param e
	 */

	const [searchBox] = useState({
		searchVal: '',
		multiSelect: '',
	});

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={titleName} showButtons={false} />
			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox}>
				<InputTextArea name="rmk" maxLength={100} disabled={true} autoSize={{ minRows: 17.5, maxRows: 15 }} />
			</SearchForm>

			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{'닫기'}
				</Button>
			</ButtonWrap>
		</>
	);
};
export default CmTextAreaPopup;
