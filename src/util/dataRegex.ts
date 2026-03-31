import React from 'react';
class dataRegex extends React.Component {
	/***************** 유효성 체크 *****************/
	/**
	 * 이메일 유효성 검사
	 * @param {string} email 이메일
	 * @returns {boolean} 이메일 유효 여부 반환
	 */
	static validEmail(email: string) {
		const reg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

		return reg.test(email);
	}

	/**
	 * 숫자인지 판별
	 * @param {string} num 검사 대상 문자열
	 * @returns {boolean} 숫자 여부 반환
	 */
	static validNumber(num: string) {
		const reg = /[0-9]/;
		return reg.test(num);
	}

	/**
	 * 특수문자인지 판별
	 * @param {string} str 검사 대상 문자열
	 * @returns {boolean} 특수문자 여부 반환
	 */
	static validSpecial(str: string) {
		const reg = /[~!@#$%^&*()_+|<>?:{}]/;
		return reg.test(str);
	}

	/**
	 * 영문 (대소문자) 판별
	 * @param {string} str 검사 대상 문자열
	 * @returns {boolean} 영문 여부 반환
	 */
	static validEng(str: string) {
		const reg = /[a-zA-Z]/;
		return reg.test(str);
	}

	/**
	 * 연속된 숫자 확인
	 * @param {string} num 검사 대상 문자열
	 * @param {number} cnt 연속 횟수
	 * @returns {boolean} 연속된 숫자 여부 반환
	 */
	static repeatNumber(num: string, cnt: number) {
		const replace = '[0-9]{' + cnt + '}';
		const reg = new RegExp(replace);
		return reg.test(num);
	}

	/**
	 * 연속된 영문 확인
	 * @param {string} str 검사 대상 문자열
	 * @param {number} cnt 연속 횟수
	 * @returns {boolean} 연속된 문자 여부 반환
	 */
	static repeatEng(str: string, cnt: number) {
		const replace = '[a-zA-Z]{' + cnt + '}';
		const reg = new RegExp(replace);
		return reg.test(str);
	}

	/**
	 * 연속된 특수문자 확인
	 * @param {string} str 검사 대상 문자열
	 * @param {number} cnt 연속 횟수
	 * @returns {boolean} 연속된 특수문자 여부 반환
	 */
	static repeatSpecial(str: string, cnt: number) {
		const replace = '[~!@#$%^&*()_+|<>?:{}]{' + cnt + '}';
		const reg = new RegExp(replace);
		return reg.test(str);
	}

	/**
	 * 검색어 valid
	 * [] 포함 확인
	 * @param {string} char 검사 대상 query param
	 * @returns {boolean} 포함(true), 미포함(false)
	 */
	static validSearchChar(char: string) {
		const reg = /[\[\]]/g;
		return reg.test(char ?? '');
	}

	/***************** File Upload *****************/
	/**
	 * 확장자가 이미지인지 확인
	 * @param {string} str 검사대상 확장자
	 * @returns {boolean} 확장자의 이미지 여부 반환
	 */
	static isImage(str: string) {
		const reg = new RegExp('gif|jpe?g|tiff?|png|webp|bmp$/i');
		return reg.test(str);
	}

	/**
	 * FormData로 전송받은 decodeDisposition decoding
	 * @param {string} disposition content-disposition
	 * @returns {boolean} 파일명
	 */
	static decodeDisposition(disposition: string) {
		return decodeURI(disposition?.split('filename=')[1].replace(/\"/g, '')).replace(/\;/g, '');
	}

	/**
	 * 전화번호에 "-" 추가하기
	 * @param {string} value 변환시킬 전화번호
	 * @returns {string} 변환된 전화번호
	 */
	static formatPhone(value: string): string {
		if (!value) return value;
		// 숫자만 추출
		const onlyNumber = value.replace(/\D/g, '');

		// 010-1234-5678 형태로 변환
		if (onlyNumber.length === 11) {
			return onlyNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
		}
		// 02-123-4567 같은 패턴도 허용
		if (onlyNumber.length === 9 || onlyNumber.length === 10) {
			if (onlyNumber.startsWith('02')) {
				return onlyNumber.replace(/(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3');
			} else {
				return onlyNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
			}
		}
		return value; // 매칭 안 되면 그대로
	}

	/**
	 * 파일 제한 조건(사이즈, 파일 종류) 검증
	 * @param	file  : 선택된 파일
	 *			sizeLimit  : 제한 파일 사이즈
	 *			extLimit : 제한 확장자 목록 (;구분자로 여러 파일 지정 - 서버 설정)
	 
	static checkUploadFile(file: any, sizeLimit: number, extLimit: number) {
		// 파일 용량 제한 확인.
		const limit = toNum(decode(sizeLimit, null, -1, sizeLimit));
		if (limit != -1) {
			if (file.size > limit * 1024) {
				showMessage('업로드 가능한 용량을 초과하였습니다.');
				return false;
			}
		}
		const fileName = file.name;
		// 파일 확장자 체크. 파일명에 . 이 들어갔을 경우 업로드 가능해야 한다.
		const ext = String(fileName).substr(fileName.lastIndexOf('.') + 1);
		const arrExt = String(extLimit).split('|');
		if (length(arrExt) > 0) {
			let extValid = false;
			for (let i = 0; i < length(arrExt); i++) {
				if (arrExt[i] == toLower(ext)) {
					extValid = true;
					break;
				}
			}
			if (!extValid) {
				showAlert('업로드 가능한 파일이 아닙니다.');
				return false;
			}
		}
		return true;
	}
	 */

	/**
	 * 필수 입력 체크
	static checkRequired(obj) {
		const $objInput = $(obj);
		let text = $objInput.attr('id');
		try {
			text = $objInput.prev('label').text();
			if (isNull(text)) {
				text = $objInput.parent().prev().find('label').text();
			}
			if (isNull(text)) {
				text = $objInput.attr('title');
			}
		} catch (e) {}
		if ($objInput.hasClass('number')) {
			if ($objInput.val() == '' || parseFloat($objInput.val().trim()) == 0) {
				showMessage('MSG.COM.VAL.006', text).done(function () {
					$objInput.focus();
				}); // {0}을(를) 입력해 주십시오.
				return false;
			} else {
				return true;
			}
		} else {
			if ($objInput.get(0).type == 'checkbox' || $objInput.get(0).type == 'radio') {
				const objName = $objInput.get(0).name;
				if ($("input[name='" + objName + "']:checked").length == 0) {
					showMessage('MSG.COM.VAL.006', text).done(function () {
						$objInput.focus();
					}); // {0}을(를) 입력해 주십시오.
					return false;
				} else {
					return true;
				}
			} else if ($objInput.hasClass('calendarM')) {
				if ($objInput.val() == '') {
					showMessage('MSG.COM.VAL.006', text); // {0}을(를) 입력해 주십시오.
					return false;
				} else {
					return true;
				}
			} else {
				if ($.trim($objInput.val()) == '') {
					showMessage('MSG.COM.VAL.006', text).done(function () {
						$objInput.focus();
					}); // {0}을(를) 입력해 주십시오.
					return false;
				} else {
					return true;
				}
			}
		}
	}
	 */
	/**
	 * 입력유효성체크
	 * @param  parentId
	 * @returns {boolean} bool(true:유효하지않음, false:유효함)
	 * @example
	 *   if (isNotValid('searchForm')) return;
	 *   if (isNotValid('saveForm')) return;
	 *   if (isNotValid('otherDiv')) return;
	static isNotValid(parentId) {
		let isValid = true;
		$('#' + parentId)
			.find(':input:not(:disabled)')
			.each(function () {
				const input = $(this);
				if (input.attr('required') != undefined) {
					isValid = checkRequired(input);
					if (!isValid) return isValid;
				}
				if (input.attr('maxbyte') != undefined) {
					isValid = checkMaxbyte(input, input.attr('maxbyte'));
					if (!isValid) return isValid;
				}
				if (input.attr('maxnumber') != undefined) {
					isValid = checkMaxNumber(input, input.attr('maxnumber'));
					if (!isValid) return isValid;
				}
			});
		return !isValid;
	}
	 */
}
export default dataRegex;
