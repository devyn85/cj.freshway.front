/*
 ############################################################################
 # FiledataField	: MultiInputText.tsx
 # Description		: Custom MultiInputText
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// CSS
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// Libs
import { Button, Col, Form, Input } from 'antd';

// Types
// import { MultiInputTextProps } from '@/types/input';
import { useInput } from '@/hooks/cm/useInput';
import { usePopupPasteTransform } from '@/hooks/cm/usePopupPasteTransform';
import { FormProps, InputTextProps } from '@/types/input';

// Component
import { InputTextArea } from '@/components/common/custom/form';
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';

const { Search } = Input;

const MultiInputText = (props: InputTextProps) => {
	const {
		refs,
		span = 24,
		label,
		name,
		required = false,
		maxLength,
		disabled = false,
		showCount = false,
		size = 'middle',
		placeholder,
		value,
		onChange,
		onPressEnter,
		allowClear = true,
		rules,
		readOnly,
	} = props;

	const formProps: FormProps = {
		label: label,
		span: span,
		name: name,
		required: required,
		rules: rules,
		colon: props.colon ?? true,
	};

	const form = Form.useFormInstance();
	const { handleInputPressEnter } = useInput();
	const pasteTransform = usePopupPasteTransform();

	// 팝업(레이어)의 표시 여부를 제어하는 상태
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	// 팝업 내 Input 컴포넌트의 값을 저장하는 상태
	const [popupInputValue, setPopupInputValue] = useState('');
	// 팝업 컨테이너에 대한 참조를 생성
	const popupRef = useRef(null);

	// 팝업 외부를 클릭하면 팝업을 닫는 로직
	useEffect(() => {
		/**
		 * 팝업 컨테이너가 존재하고, 클릭된 요소가 팝업 컨테이너 외부에 있는지 확인
		 * @param {any} event 이벤트
		 */
		function handleClickOutside(event: any) {
			if (popupRef.current && !popupRef.current.contains(event.target)) {
				setIsPopupOpen(false);
			}
		}

		// 문서에 'mousedown' 이벤트 리스너를 추가
		document.addEventListener('mousedown', handleClickOutside);

		// 컴포넌트가 언마운트될 때 이벤트 리스너를 제거하는 클린업 함수
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [popupRef]); // popupRef가 변경될 때마다 useEffect를 다시 실행

	// 팝업을 여는 함수
	const showPopup = () => {
		setIsPopupOpen(true);
		// setPopupInputValue('');
	};

	// 팝업에서 "확인" 버튼을 눌렀을 때 실행되는 함수
	const handleOk = () => {
		// 엔터 기준으로 split 후 ","로 join
		const joined = popupInputValue
			.split(/\r?\n/) // \n 또는 \r\n 모두 처리
			.filter(line => line.trim() !== '') // 빈 줄 제거
			.join(',');

		form.setFieldValue(name, joined);
		setIsPopupOpen(false);
	};

	// 팝업에서 "취소" 버튼을 눌렀을 때 실행되는 함수
	const handleCancel = () => {
		setIsPopupOpen(false);
	};

	/**
	 * clearIcon 클릭 시 onSearch 동작을 방지하는 핸들러
	 * @param {string} value value
	 * @param {any} event event
	 * @param {any} info info
	 * @param {any} info.source info.source
	 */
	const handleSearch = (value: string, event?: any, info?: { source?: 'clear' | 'input' }) => {
		if (info?.source === 'clear') {
			if (props.form && props.code) {
				form.setFieldsValue({ [props.code]: '' });
			}
			return;
		}

		if (event?.key !== 'Enter') {
			showPopup();
		}
	};

	// 멀티입력 값 캐치 후 줄바꿈 처리
	const watchedValues = Form.useWatch(name, form);
	useEffect(() => {
		if (typeof watchedValues === 'string') {
			const result = watchedValues?.split(',')?.join('\n');
			setPopupInputValue(result);
		}
	}, [watchedValues]);

	const searchButton = <Button icon={<IcoSvg data={icoSvgData.icoMulti} />} />;

	return (
		<Col span={span}>
			<Form.Item {...formProps}>
				<Search
					{...props}
					ref={refs}
					maxLength={maxLength}
					placeholder={placeholder}
					showCount={showCount}
					size={size}
					value={value}
					enterButton={searchButton}
					onChange={onChange}
					onPaste={pasteTransform(form, name)}
					onPressEnter={onPressEnter || handleInputPressEnter}
					required={required}
					allowClear={allowClear}
					readOnly={readOnly}
					onSearch={handleSearch}
				/>
			</Form.Item>
			<div className="multi-input">
				{/* 레이어 팝업 컴포넌트 */}
				{isPopupOpen && (
					<div ref={popupRef} className="inner">
						<h3>멀티입력</h3>
						<InputTextArea
							value={popupInputValue}
							onChange={(e: any) => setPopupInputValue(e.target.value)}
							autoSize={{ minRows: 5, maxRows: 10 }}
						/>

						<ButtonWrap data-props="single">
							<Button size={'small'} onClick={handleCancel}>
								취소
							</Button>
							<Button size={'small'} type="primary" onClick={handleOk}>
								적용
							</Button>
						</ButtonWrap>
					</div>
				)}
			</div>
		</Col>
	);
};

export default MultiInputText;
