/**
 * @description 입력 관련 함수 ( DatePicker는 따로 관리 )
 */
export const useInput = () => {
	// 포커스 가능한 요소들을 찾는 함수
	const getFocusableElements = (form: HTMLFormElement) => {
		const selector = [
			// 기본 HTML 요소들 (Form.Item 내부의 실제 입력 요소들만)
			'.ant-form-item input:not([disabled]):not([readonly]):not([type="hidden"])',
			'.ant-form-item select:not([disabled])',
			'.ant-form-item textarea:not([disabled]):not([readonly])',

			// Ant Design 컴포넌트들 (Form.Item 내부의 것만)
			'.ant-form-item .ant-select:not(.ant-select-disabled)',
			'.ant-form-item .ant-picker:not(.ant-picker-disabled)',
			'.ant-form-item .ant-input-number:not(.ant-input-number-disabled)',
			'.ant-form-item .ant-input-search:not(.ant-input-search-disabled)', // InputSearch 추가
			'.ant-form-item .ant-switch:not(.ant-switch-disabled)',
			'.ant-form-item .ant-checkbox:not(.ant-checkbox-disabled)',
			'.ant-form-item .ant-radio:not(.ant-radio-disabled)',

			// tabindex를 가진 요소들 (Form.Item 내부이면서 검색 버튼이 아닌 것)
			'.ant-form-item [tabindex]:not([tabindex="-1"]):not([disabled]):not(.ant-btn)',
		].join(', ');

		const elements = form.querySelectorAll(selector);

		// 실제로 포커스 가능한 요소들만 필터링하고 DOM 순서로 정렬
		const filteredElements = Array.from(elements).filter(element => {
			const htmlElement = element as HTMLElement;

			const isSelect = htmlElement.classList.contains('ant-select');
			const isInputSearch = htmlElement.classList.contains('ant-input-search');

			// 숨겨진 요소나 화면에 보이지 않는 요소 제외
			// SelectBox와 InputSearch는 예외 처리
			if (htmlElement.offsetParent === null && !isSelect && !isInputSearch) {
				return false;
			}

			// tabIndex가 -1인 요소 제외 (단, SelectBox와 InputSearch는 예외)
			if (htmlElement.tabIndex === -1 && !isSelect && !isInputSearch) {
				return false;
			}

			// disabled 속성이 있는 요소 제외
			if (htmlElement.hasAttribute('disabled') || htmlElement.getAttribute('aria-disabled') === 'true') {
				return false;
			}

			// 검색 컴포넌트 내부의 버튼들 제외 (돋보기 버튼 등)
			if (
				htmlElement.classList.contains('ant-btn') &&
				(htmlElement.closest('.ant-input-group-addon') ||
					htmlElement.closest('[class*="search"]') ||
					htmlElement.getAttribute('aria-label')?.includes('검색') ||
					htmlElement.getAttribute('aria-label')?.includes('search'))
			) {
				return false;
			}

			return true;
		});

		// querySelectorAll은 이미 DOM 순서대로 반환하므로 그대로 사용
		return filteredElements;
	};

	// 다음 포커스 가능한 요소로 이동하는 함수
	const moveToNextField = (currentElement: HTMLElement) => {
		const form = currentElement.closest('form');
		if (!form) return;

		const focusableElements = getFocusableElements(form);

		// 현재 요소의 인덱스를 찾기
		let currentIndex = -1;
		for (let i = 0; i < focusableElements.length; i++) {
			const element = focusableElements[i] as HTMLElement;

			// 1. 정확히 같은 요소인 경우
			if (element === currentElement) {
				currentIndex = i;
				break;
			}

			// 2. 현재 요소가 해당 요소 안에 포함된 경우 (InputNumber 내부의 input)
			if (element.contains(currentElement)) {
				currentIndex = i;
				break;
			}

			// 3. 현재 요소와 같은 Form.Item 내부에 있는 경우
			const currentFormItem = currentElement.closest('.ant-form-item');
			const elementFormItem = element.closest('.ant-form-item');
			if (currentFormItem && elementFormItem && currentFormItem === elementFormItem) {
				currentIndex = i;
				break;
			}
		}

		const nextIndex = currentIndex + 1;

		if (nextIndex < focusableElements.length) {
			const nextElement = focusableElements[nextIndex] as HTMLElement;

			// Ant Design 컴포넌트인 경우 내부의 실제 input 요소를 찾아서 포커스
			if (nextElement.classList.contains('ant-select')) {
				// 여러 가능한 포커스 요소들을 순서대로 시도
				const selectors = ['.ant-select-selection-search-input', '.ant-select-selector', 'input'];

				let focused = false;
				for (const selector of selectors) {
					const selectInput = nextElement.querySelector(selector) as HTMLElement;
					if (selectInput && selectInput.tabIndex !== -1) {
						selectInput.focus();
						// 포커스가 실제로 이동했는지 확인
						if (document.activeElement === selectInput) {
							focused = true;
							break;
						}
					}
				}

				// 모든 내부 요소 시도가 실패하면 SelectBox 자체에 포커스 시도
				if (!focused) {
					nextElement.focus();
					if (document.activeElement === nextElement) {
						focused = true;
					}
				}

				if (focused) {
					return;
				}
			}

			if (nextElement.classList.contains('ant-picker')) {
				const pickerInput = nextElement.querySelector('input') as HTMLElement;
				if (pickerInput) {
					pickerInput.focus();
					return;
				}
			}

			if (nextElement.classList.contains('ant-input-number')) {
				const numberInput = nextElement.querySelector('input') as HTMLElement;
				if (numberInput) {
					numberInput.focus();
					return;
				}
			}

			if (
				nextElement.classList.contains('ant-input-search') ||
				nextElement.classList.contains('ant-input-group-wrapper')
			) {
				// 여러 가능한 포커스 요소들을 순서대로 시도
				const selectors = ['.ant-input', 'input', '.ant-input-search input'];

				let focused = false;
				for (const selector of selectors) {
					const searchInput = nextElement.querySelector(selector) as HTMLElement;
					if (searchInput && searchInput.tabIndex !== -1) {
						searchInput.focus();
						// 포커스가 실제로 이동했는지 확인
						if (document.activeElement === searchInput) {
							focused = true;
							break;
						}
					}
				}

				if (focused) {
					return;
				}
			}

			// 일반적인 경우 직접 포커스
			nextElement.focus();
		}
	};

	// Enter 키 핸들러
	const handleInputPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			moveToNextField(e.currentTarget);
		}
	};

	return {
		handleInputPressEnter,
	};
};
