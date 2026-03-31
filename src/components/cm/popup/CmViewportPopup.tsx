// CSS
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import { Button, Form } from 'antd';

// component
import { InputText, SearchForm } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// API Call Function

// utils

interface PropsType {
	callBack?: any;
	close?: any;
	popupType?: string;
	params?: any;
}

const CmViewportPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, callBack } = props;

	const [popupForm] = Form.useForm(); // 팝업 내부 폼

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	const titleName = '화면 비율 설정';

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={titleName} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={popupForm} isAlwaysVisible>
				{/*2행*/}
				<UiFilterArea>
					<UiFilterGroup className="grid-column-1">
						<li>
							<InputText name="percent" label={'비율 설정(%)'} width={120} />
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{'닫기'}
				</Button>
				<Button size={'middle'} type="primary">
					{'저장'}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmViewportPopup;
