// lib
import { Button, Form } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import { SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// Utils

// Store
import { useAppSelector } from '@/store/core/coreHook';

// API Call Function

interface PropsType {
	callBack?: any;
	searchName?: string;
	selectionMode?: string;
	close?: any;
}

const BatchScheduleSetPop = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, selectionMode, close } = props;

	const { t } = useTranslation();
	const user = useAppSelector(state => state.user.userInfo); // 사용자 정보 가져오기

	const [popupForm] = Form.useForm(); // 팝업 내부 폼

	const [searchBox] = useState({
		popCode: '',
		multiSelect: '',
	});

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 데이터 조회 (API 호출)
	 * @param {boolean} isSearchButtonClicked - 검색 버튼 클릭 여부 (true: 클릭, false: 스크롤)
	 */

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		popupForm.setFieldsValue({ dcCodeSelect: user?.defDccode, popCode: '', multiSelect: '' }); // 물류센터 기본값으로 재설정
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = {
		refresh: onClickRefreshButton,
	};

	/**
	 * 확인
	 */
	const checkRowData = () => {
		if (length === 0) {
			close();
			return;
		}
		callBack();
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="스케쥴 설정" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<div className="schedule-set">
				<dl>
					<dt>주기</dt>
					<dd>
						<div>
							<Button size={'middle'}>일</Button>
						</div>
						<SelectBox label={''} placeholder="전체" />
					</dd>
					<dd>
						<div>
							<Button size={'middle'} className="active">
								주
							</Button>
						</div>
						<SelectBox label={''} placeholder="전체" />
					</dd>
					<dd>
						<div>
							<Button size={'middle'}>월</Button>
						</div>
						<SelectBox label={''} placeholder="전체" />
					</dd>
				</dl>
				<dl>
					<dt>시간</dt>
					<dd>
						<div>
							<Button size={'middle'} className="active">
								매 시
							</Button>
							<span>*다중</span>
						</div>
						<SelectBox label={''} placeholder="전체" />
					</dd>
					<dd>
						<div>
							<Button size={'middle'}>매 분</Button>
							<span>*싱글</span>
						</div>
						<SelectBox label={''} placeholder="전체" />
					</dd>
					<dd>
						<div>
							<Button size={'middle'}>매 초</Button>
							<span>*다중</span>
						</div>
						<SelectBox label={''} placeholder="전체" />
					</dd>
				</dl>
			</div>

			<div className="batch-msg">
				<p>매주 수요일 오전 1시와 오후 2시에 0분/20분/40분 0초에 실행됩니다.</p>
			</div>

			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{t('lbl.BTN_CANCEL')}
				</Button>
				<Button size={'middle'} type="primary" onClick={checkRowData}>
					{t('lbl.BTN_CONFIRM')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default BatchScheduleSetPop;
