import { Modal } from 'antd';
import { t } from 'i18next';
// https://ant.design/components/modal/
type messageModalProps = {
	content: string; // 내용
	modalType?: string; // info, success, error, warning, info
	title?: string; // 제목
	okText?: string; // 확인버튼
	cancelText?: string;
	style?: string;
	zIndex?: string;
	width?: string;

	onCancel?: any;
	onOk?: any;
	afterClose?: any;
};

const info = (props: object) => {
	Modal.info(props);
};

const success = (props: object) => {
	Modal.success(props);
};

const error = (props: object) => {
	Modal.error(props);
};

const warning = (props: object) => {
	Modal.warning(props);
};

export const showMessage = (props: messageModalProps) => {
	const modalType = props.modalType;

	// 가운데 정렬, 노출 모션 OFF
	props = { ...{ transitionName: '', centered: true, ...props } };

	switch (modalType) {
		case 'info':
			info(props);
			break;
		case 'success':
			success(props);
			break;
		case 'error':
			error(props);
			break;
		case 'warning':
			warning(props);
			break;
		default:
			info(props);
			break;
	}
};
/**
 * Alert 메세지
 * @param {*} title 타이틀
 * @param {*} message 메세지 내용
 * @param {*} onOk 확인 callback method
 * @param {object} addOpt 추가 options
 * @returns {void}
 */
export const showAlert = (title: string | null, message: string, onOk?: any, addOpt?: object): void => {
	title = title ? title : '';
	const okText = t('lbl.BTN_CONFIRM'); // 확인

	const defaultOption = {
		title: title || '',
		content: (
			<>
				<div style={{ whiteSpace: 'pre-wrap' }}>{message}</div>
			</>
		),
		okText: okText,
		keyboard: false,
		// bodyStyle: { height: '200px' },
		width: 300,
		icon: <></>,
		centered: true,
		// transitionName: 'none',
		// maskTransitionName: 'none',
		transitionName: '', // 팝업 오픈 애니메이션
		maskTransitionName: '',
		// onOk 내부에서 발생할 수 있는 참조 오류 방지
		onOk() {
			if (typeof onOk === 'function') {
				// 비동기 처리를 통해 호출 스택(Call Stack)을 한 번 비워주면
				// 정적 분석 도구의 재귀 감지를 회피하고 브라우저 프리징을 막을 수 있습니다.
				setTimeout(() => {
					onOk();
				}, 0);
			}
		},
	};
	const opt = { ...defaultOption, ...addOpt };

	Modal.info({ ...opt });
};

/**
 * Confirm 메세지
 * @param {*} title 타이틀 (default 지정)
 * @param {*} message 메세지 내용
 * @param {*} onOk 확인 function
 * @param {*} onCancel 취소 function
 * @param {object} addOpt 추가 option
 * @returns {void}
 */
export const showConfirm = (title: string | null, message: string, onOk?: any, onCancel?: any, addOpt?: object) => {
	const okText = t('lbl.BTN_CONFIRM'); // 확인
	const cancelText = t('lbl.BTN_CANCEL'); // 취소
	const contentStr = message
		.replaceAll('<br/>', '<br/>')
		.replaceAll('</br>', '<br/>')
		.replaceAll('<br>', '<br/>')
		.replaceAll('\n', '<br/>');

	const defaultOption = {
		title: title || '',
		content: (
			<>
				{contentStr.split('<br/>').map((line, index): any => {
					return (
						<div key={index}>
							{line}
							<br />
						</div>
					);
				})}
			</>
		),

		icon: '',
		keyboard: false,
		centered: true,
		transitionName: '',
		//		maskTransitionName: '',
		okText: okText,
		cancelText: cancelText,
		onOk() {
			if (typeof onOk === 'function') {
				setTimeout(() => {
					onOk();
				}, 0);
			}
		},
		onCancel() {
			if (typeof onCancel === 'function') {
				setTimeout(() => {
					onCancel();
				}, 0);
			}
		},
	};

	const opt = { ...defaultOption, ...addOpt };
	Modal.confirm({ ...opt });
};

/**
 * 사용자에게 확인(Confirm) 메시지를 모달로 표시합니다.
 * @param {*} title 타이틀 (default 지정)
 * @param {*} message 메세지 내용
 * @param {*} onOk 확인 function
 * @param {*} onCancel 취소 function
 * @param {object} addOpt 추가 option
 * @returns {void}
 */
export const showConfirmAsync = (
	title: string | null,
	message: string,
	onOk?: () => void,
	onCancel?: () => void,
	addOpt?: object,
): Promise<boolean> => {
	const okText = t('lbl.BTN_CONFIRM'); // 확인
	const cancelText = t('lbl.BTN_CANCEL'); // 취소

	const contentStr = message
		.replaceAll('<br/>', '<br/>')
		.replaceAll('</br>', '<br/>')
		.replaceAll('<br>', '<br/>')
		.replaceAll('\n', '<br/>');

	return new Promise(resolve => {
		const defaultOption = {
			title: title || '',
			content: (
				<>
					{contentStr.split('<br/>').map((line, index) => (
						<div key={index}>
							{line}
							<br />
						</div>
					))}
				</>
			),
			icon: '',
			keyboard: false,
			centered: true,
			transitionName: '',
			okText,
			cancelText,
			onOk: () => {
				if (typeof onOk === 'function') {
					setTimeout(() => {
						onOk();
					}, 0);
				}
				resolve(true);
			},
			onCancel: () => {
				if (typeof onCancel === 'function') {
					setTimeout(() => {
						onCancel();
					}, 0);
				}
				resolve(false);
			},
		};

		const opt = { ...defaultOption, ...addOpt };
		Modal.confirm(opt);
	});
};
