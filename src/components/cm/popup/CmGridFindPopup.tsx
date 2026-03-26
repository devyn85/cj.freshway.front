// CSS
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import { Button, Form, Space } from 'antd';
import { useEffect, useRef } from 'react';

// component
import { InputSearch, RadioBox, SearchForm } from '@/components/common/custom/form';

// API Call Function

interface PropsType {
	gridRef?: any; // AUIGrid 참조 추가
}

/**
 * 라디오 박스 옵션
 */
const radioBasicOptions = [
	{ label: 'Up', value: 'up' },
	{
		label: 'Down',
		value: 'down',
	},
];

const initialValues = {
	searchTerm: '',
	radioBasic1: 'down',
};

const CmGridFindPopup = (props: PropsType) => {
	const { gridRef } = props;
	const [popupForm] = Form.useForm(); // 팝업 내부 폼
	const inputSearchRef = useRef<HTMLInputElement>(null);

	// 폼 초기값 설정
	useEffect(() => {
		popupForm.setFieldsValue(initialValues);
	}, [popupForm]);

	useEffect(
		/**
		 * 검색 포커스 컨트롤
		 * @description 팝업이 열린 후 inputSearchRef가 생성되면 포커스를 주고, 팝업이 닫히면 그리드에 포커스를 준다.
		 * @returns {void}
		 */
		function focusControl() {
			// 포커스 컨트롤 지연 ( 컨텍스트 메뉴로 찾기 팝업이 열릴 때 포커스가 그리드밖으로 잡히는 문제로 인해 지연처리 )
			setTimeout(() => {
				inputSearchRef.current?.focus();
			}, 100);

			return () => {
				gridRef?.setFocus();
			};
		},
		[inputSearchRef],
	);

	/**
	 * 검색 실행
	 */
	const handleSearch = async () => {
		const values = await popupForm.validateFields();
		const { searchTerm, radioBasic1: direction } = values;

		if (!searchTerm || searchTerm.trim() === '') {
			return;
		}

		if (!gridRef) {
			return;
		}

		// 검색 옵션 설정
		const searchOptions = {
			direction: direction === 'down', // true면 다음, false면 이전
			caseSensitive: true,
			wholeWord: false,
			wrapSearch: true,
		};

		// 모든 컬럼에서 검색
		gridRef?.searchAll(searchTerm.trim(), searchOptions);
	};

	/**
	 * 검색 초기화
	 */
	const handleClear = () => {
		// 폼 초기화
		popupForm.setFieldsValue(initialValues);

		// 그리드 선택 해제 및 포커스 제거
		gridRef.clearSelection();
		gridRef.setFocus();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearch();
			e.preventDefault();
			e.stopPropagation();
		}
	};

	return (
		<>
			{/* 조회 컴포넌트 */}
			<SearchForm form={popupForm} isAlwaysVisible>
				{/*2행*/}
				<UiFilterGroup className="grid-column-1">
					<li>
						<InputSearch
							refs={inputSearchRef}
							name="searchTerm"
							label={'검색어'}
							width={80}
							placeholder={'입력해주세요.'}
							onSearch={handleSearch}
							onPressEnter={handleSearch}
							onKeyDown={handleKeyDown}
						/>
					</li>
					<li>
						<RadioBox
							label="Direction"
							name="radioBasic1"
							options={radioBasicOptions}
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
				</UiFilterGroup>
			</SearchForm>

			{/* 검색 버튼 영역 */}
			<div style={{ marginTop: '16px', textAlign: 'center' }}>
				<Space>
					<Button type="primary" onClick={handleSearch}>
						검색
					</Button>
					<Button onClick={handleClear}>초기화</Button>
				</Space>
			</div>
		</>
	);
};

export default CmGridFindPopup;
