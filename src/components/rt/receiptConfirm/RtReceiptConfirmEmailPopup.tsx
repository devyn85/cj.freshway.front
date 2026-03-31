// CSS
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import { Button, Form, Input } from 'antd';

// component
import { InputText, SearchForm } from '@/components/common/custom/form';
import InputQuillEditor from '@/components/common/custom/form/InputQuillEditor';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// API Call Function

const RtReceiptConfirmEmailPopup = ({ popupForm, initValues, close, sendMasterList }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

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

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={'이메일 전송'} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={popupForm} isAlwaysVisible initialValues={initValues}>
				{/*2행*/}
				<UiFilterArea>
					<UiFilterGroup className="grid-column-1">
						<li>
							<InputText name="rcvrEmailAddr" label={'이메일'} width={80} />
						</li>
						<li>
							<InputText name="rcvrNm" label={'대상자'} width={80} />
						</li>
						<li>
							<InputText name="title" label={'제목'} width={80} placeholder={'제목을 입력해주세요.'} />
						</li>
						<li>
							<InputQuillEditor
								name="cnts"
								label={'내용'}
								width={80}
								placeholder={'내용을 입력해주세요.'}
								value={'hi gello'}
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{'닫기'}
				</Button>
				<Button size={'middle'} type="primary" onClick={sendMasterList}>
					{'전송'}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default RtReceiptConfirmEmailPopup;
