/*
 ############################################################################
 # FiledataField	: FormUtil
 # Description		: Form Util
 # Author			: Canal Frame
 # Since			: 23.10.04
 ############################################################################
*/

// Libs
import { FormInstance } from 'antd/lib/form';

// Utils
import { showAlert } from './MessageUtil';

/**
 * form item 영역 validation
 * Antd 요소가 아닌 컴포넌트도 form.item에 rule을 지정하면 검증 가능
 * @param {object} form form 객체
 * @param {Array} fieldNames 검증 field list (null == 전체 fields 검증)
 * @param {boolean} isAlert 에러 문구 노출 방식(true -> alert, false -> field 아래 빨간색 error 문구 노출)
 * @returns {boolean} 검증 결과
 */
async function validateForm(form: FormInstance<any>, fieldNames: Array<string | null> | null = null, isAlert = true) {
	//rules에 지정된 validation 기준으로 검증
	const isValid = await form
		.validateFields(fieldNames)
		.then(() => {
			return true;
		})
		.catch((errorInfo: any) => {
			if (errorInfo?.errorFields?.length > 0) {
				// Error Node의 field name
				const errorId = errorInfo?.errorFields[0]?.name[0];

				// 노출 방식 -> Alert 창
				if (isAlert) {
					showAlert('', errorInfo?.errorFields[0]?.errors[0], () => {
						// 에러 node로 포커싱
						setTimeout(() => {
							document.getElementById(errorId).focus();
						}, 100);
					});

					// Form 아래 요소 error class 제거
					setTimeout(() => {
						const errorFormElement = document.querySelectorAll('.ant-form-item-has-error');
						errorFormElement?.forEach(element => {
							element.classList.remove('ant-form-item-has-error');
							element.classList.remove('ant-form-item-with-help');
						});
					}, 100);

					setTimeout(() => {
						const borderElement = document.querySelectorAll('.ant-input-affix-wrapper-status-error');
						borderElement?.forEach(element => {
							element.classList.remove('ant-input-affix-wrapper-status-error');
						});
					}, 100);
					setTimeout(() => {
						const borderElement = document.querySelectorAll('.ant-select-status-error');
						borderElement?.forEach(element => {
							element.classList.remove('ant-select-status-error');
						});
					}, 100);

					setTimeout(() => {
						const borderElement = document.querySelectorAll('.ant-picker-status-error');
						borderElement?.forEach(element => {
							element.classList.remove('ant-picker-status-error');
						});
					}, 100);

					// Form 아래 요소 error 문구 영역 제거
					setTimeout(() => {
						errorInfo.errorFields?.forEach((errorNode: any) => {
							const explainElement = document.getElementById(errorNode.name[0] + '_help');
							explainElement.style.display = 'none';
						});
					}, 100);

					// Alert 창에 focus 주기 위해 아래 내용 주석 처리
					// error node focus
					// setTimeout(() => {
					// 	document.getElementById(errorId).focus();
					// }, 100);
				}

				return false;
			}
		});

	// 유효성 검증 결과 반환
	return isValid;
}

/**
 * 비밀번호 정책 체크
 * @param {string} value 비밀번호 입력 값
 * @param {string} userId 사용자ID
 * @returns {any} 실패 여부
 */
const validatePassword = (value: string, userId?: string) => {
	if (!value) {
		return Promise.reject(new Error('비밀번호를 입력해주세요.'));
	}

	// 영문, 숫자, 특수문자 혼용 8자리 이상
	const regexComplex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
	if (!regexComplex.test(value)) {
		return Promise.reject(new Error('비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상이어야 합니다.'));
	}

	// ID와 유사한 패스워드 사용 불가 (4자리 이상 일치 금지)
	if (userId) {
		for (let i = 0; i < userId.length - 3; i++) {
			const sub = userId.substring(i, i + 4);
			if (sub && value.includes(sub)) {
				return Promise.reject(new Error('ID와 유사한 비밀번호는 사용할 수 없습니다.'));
			}
		}
	}

	// 동일 문자 또는 숫자 4자리 이상 반복 금지 (예: aaaa, 1111)
	const repeatRegex = /(.)\1{3,}/; // 같은 문자 4번 이상 반복
	if (repeatRegex.test(value)) {
		return Promise.reject(new Error('같은 문자를 4번 이상 반복할 수 없습니다.'));
	}

	// 연속된 숫자/문자열 (예: 1234, abcd)
	const sequentialCheck = (str: any) => {
		const sequences = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		for (let i = 0; i < str.length - 3; i++) {
			const sub = str.substring(i, i + 4);
			if (sequences.includes(sub)) return true;
		}
		return false;
	};
	if (sequentialCheck(value)) {
		return Promise.reject(new Error('연속된 문자나 숫자를 4자리 이상 사용할 수 없습니다.'));
	}

	return Promise.resolve();
};

export { validateForm, validatePassword };
