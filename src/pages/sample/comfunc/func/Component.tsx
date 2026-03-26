/*
 ############################################################################
 # FiledataField	: Component.tsx
 # Description		: 컴포넌트
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/
// lib
import htmlToPdf from '@/lib/htmlToPdf';
import { Button, Col, Form, Popover, Row, Tooltip } from 'antd';
// utils
import { getCommonCodeList } from '@/store/core/comCodeStore';
// component
import FormWrap from '@/assets/styled/FormWrap/FormWrap';
import Title from '@/assets/styled/Title/Title';
import CustomModal from '@/components/common/custom/CustomModal';
import CustomTimePicker from '@/components/common/custom/CustomTimePicker';
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SelectBox } from '@/components/common/custom/form';

// API Call Function
import { apiGetPopupEmpGetData } from '@/api/common/apiComfunc';

const Component = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// const { menu } = useLocation().state;

	const [form] = Form.useForm();
	const pdfArea = useRef(null);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 클릭 이벤트
	 */
	function onClick() {
		const params1 = form.getFieldsValue(true);
	}

	/**
	 * 윈도우 팝업
	 */
	const openWindow = () => {
		// 도메인 URL 확인
		// var apiUrl = import.meta.env.VITE_API_URL;
		const url = '/sysmgt/func/menu?window=open';
		const name = 'window popup';
		const width = 900;
		const height = 600;
		const left = window.screen.width / 2 - width / 2;
		const top = window.screen.height / 2 - height / 2;
		const winPop = window.open(
			url,
			name,
			'menubar=no, status=no, titlebar=no' +
				', resizable=yes, scrollbars=no, toolbar=no' +
				', width=' +
				width +
				', height=' +
				height +
				', left=' +
				left +
				', top=' +
				top,
		);
		setTimeout(function () {
			winPop.focus();
		}, 100);
	};

	/**
	 * PDF
	 */
	const htmlToPDF = () => {
		const fileName = '컴포넌트';
		htmlToPdf.downPdf(pdfArea.current, fileName);
	};

	return (
		<>
			<div ref={pdfArea}>
				{/* 상단 타이틀 및 페이지버튼 */}
				<MenuTitle slotLocation="left">
					<Button onClick={onClick}>값 가져오기</Button>
				</MenuTitle>

				{/* 컴포넌트 영역 */}
				<FormWrap form={form} preserve={false} data-props={'page'}>
					{/* SelectBox 예제 */}
					<SelectBoxExample form={form}></SelectBoxExample>
					{/* Modal 예제 */}
					<ModalExample></ModalExample>
					{/* 레이어 토글 예제 */}
					<LayerPopoverExample></LayerPopoverExample>
					{/* 윈도우 팝업 */}
					<Row>
						<Col span={24}>
							<Form.Item label={'윈도우팝업'}>
								<Button onClick={openWindow}>화면중앙 윈도우</Button>
							</Form.Item>
						</Col>
					</Row>
					{/* PDF */}
					<Row>
						<Col span={24}>
							<Form.Item label={'PDF'}>
								<Button onClick={htmlToPDF}>PDF</Button>
							</Form.Item>
						</Col>
					</Row>
					{/* Tooltup 예제 */}
					<TooltipExample></TooltipExample>
					{/* TimePicker 예제 */}
					<TimePickerExample></TimePickerExample>
				</FormWrap>
			</div>
		</>
	);
};

export default Component;

/**
 * selectbox 예제
 * @param {any} root0 props
 * @param {any} root0.form form 객체
 * @returns {*} selectbox 예제 컴포넌트
 */
const SelectBoxExample = ({ form }: any) => {
	// 담당자 조회
	const [empOptions, setEmpOptions] = useState([]);
	const [empLoading, setEmpLoading] = useState(false);

	/**
	 * 기본 코드 변경 이벤트
	 * @param {string | number} value 선택된 값
	 * @param {object} option option
	 */
	const selectEvent = (value: string | number, option: object) => {};

	/**
	 * 변경 이벤트 (다른 SelectBox 값 변경)
	 * @param {string|number} value 변경된 value
	 * @returns {void}
	 */
	const changeComCodeEvent = (value: string | number) => {
		form.setFieldValue('selectChgTwo', 'ko_kr');
		if (value === 'ko_kr') {
			form.setFieldValue('selectChgTwo', 'Asia/Seoul');
		} else if (value === 'en_us') {
			form.setFieldValue('selectChgTwo', 'US/Central');
		} else {
			form.setFieldValue('selectChgTwo', '');
		}
	};

	/**
	 * 관리자 검색 데이터
	 * @param {string} value 조회할 관리자명
	 * @returns {void}
	 */
	const searchEmpGetData = async (value: string) => {
		let params = {};
		params = { userNm: value };

		setEmpLoading(true);
		if (value) {
			await apiGetPopupEmpGetData(params).then(res => {
				setEmpOptions(res.data);
			});
		} else {
			setEmpOptions([]);
		}
		setEmpLoading(false);
	};

	/**
	 * 담당자 정보 초기화
	 */
	const initEmpOption = () => {
		setEmpOptions([]);
	};

	return (
		<>
			{/* 공통코드 기본 단일 */}
			<Row>
				<SelectBox
					name="selectSingle"
					span={24}
					label="공통코드(기본 단일)"
					placeholder="선택해주세요"
					options={getCommonCodeList('BBS_TP', '--- 선택 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					onSelect={selectEvent}
				/>
			</Row>
			{/* SelectBox 변경 이벤트 */}
			<Row>
				<SelectBox
					name="selectChgOne"
					span={12}
					label="공통코드 변경 이벤트"
					placeholder="선택해주세요"
					options={getCommonCodeList('LANG_CD', '--- 선택 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					onSelect={changeComCodeEvent}
				/>
				<SelectBox
					name="selectChgTwo"
					span={12}
					placeholder="선택해주세요"
					options={getCommonCodeList('TPL_TIMEZONE', '--- 선택 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</Row>
			{/* 공통코드(검색+단일+선택) */}
			<Row>
				<SelectBox
					name="selectSearchSingle"
					span={24}
					label="공통코드(검색+단일+선택)"
					options={getCommonCodeList('BBS_TP')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					showSearch
					placeholder="선택해주세요"
					onSelect={selectEvent}
				/>
			</Row>
			{/* 공통코드(검색+다중+입력) */}
			<Row>
				<SelectBox
					name="selectSearchMultiple"
					span={24}
					label="공통코드(검색+다중+입력)"
					mode="multiple"
					options={getCommonCodeList('BBS_TP')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					showSearch
					placeholder="선택해주세요"
					onSelect={selectEvent}
				/>
			</Row>
			{/* 담당자(검색+싱글) */}
			<Row>
				<SelectBox
					name="selectEmpSingle"
					span={24}
					label="담당자(검색+싱글)"
					options={empOptions}
					fieldNames={{ label: 'userNm', value: 'userId' }}
					showSearch
					placeholder="선택해주세요"
					notFoundContent={empLoading ? undefined : null}
					allowClear
					filterOption={false}
					onSearch={searchEmpGetData}
					onSelect={selectEvent}
					onBlur={initEmpOption}
				/>
			</Row>
			{/* 담당자(검색+다중) */}
			<Row>
				<SelectBox
					name="selectEmpMultiple"
					span={24}
					label="담당자(검색+다중)"
					mode="multiple"
					options={empOptions}
					fieldNames={{ label: 'userNm', value: 'userId' }}
					showSearch
					placeholder="입력해주세요"
					notFoundContent={empLoading ? undefined : null}
					allowClear
					filterOption={false}
					onSearch={searchEmpGetData}
					onSelect={selectEvent}
					onBlur={initEmpOption}
				/>
			</Row>
		</>
	);
};

/**
 * Modal 예제
 * @returns {*} modal 예제 컴포넌트
 */
const ModalExample = () => {
	const refModal = useRef(null);
	const refSubModal = useRef(null);

	return (
		<>
			<Row>
				<Col span={24}>
					<Form.Item label={'레이어팝업 (기본)'}>
						<Button
							onClick={() => {
								refModal.current.handlerOpen();
							}}
						>
							화면 중앙 & 다중
						</Button>
					</Form.Item>
					{/* 메인 팝업 */}
					<CustomModal ref={refModal}>
						<Title>
							<h1>중앙 레이어 팝업</h1>
						</Title>
						<p>하단 레이어 팝업 본문 내용 1</p>
						<p>하단 레이어 팝업 본문 내용 2</p>
						<p>하단 레이어 팝업 본문 내용 3</p>
						<Button
							onClick={() => {
								refSubModal.current.handlerOpen();
							}}
						>
							다중 팝업 열기
						</Button>
					</CustomModal>
					{/* 서브 팝업 */}
					<CustomModal ref={refSubModal}>
						<Title>
							<h1>다중 레이어 팝업</h1>
						</Title>
						<p>다중 레이어 팝업 본문 내용 1</p>
						<p>다중 레이어 팝업 본문 내용 2</p>
						<p>다중 레이어 팝업 본문 내용 3</p>
					</CustomModal>
				</Col>
			</Row>
		</>
	);
};

/**
 * 레이어 토글
 * @returns {*} 레이어 토글 컴포넌트
 */
const LayerPopoverExample = () => {
	const buttonWidth = 100;
	const text = <span>레이어 토글 Title</span>;
	const content = (
		<div>
			<p>Content</p>
			<p>Content</p>
		</div>
	);
	return (
		<>
			<Col span={24}>
				<Form.Item label={'레이어팝업 (토글)'}>
					<div>
						<div style={{ marginLeft: buttonWidth, whiteSpace: 'nowrap' }}>
							<Popover placement="topLeft" title={text} content={content} trigger="click">
								<Button style={{ width: 100 }}>TL</Button>
							</Popover>
							<Popover placement="top" title={text} content={content} trigger="click">
								<Button style={{ width: 100 }}>Top</Button>
							</Popover>
							<Popover placement="topRight" title={text} content={content} trigger="click">
								<Button style={{ width: 100 }}>TR</Button>
							</Popover>
						</div>
						<div style={{ width: buttonWidth, float: 'left' }}>
							<Popover placement="leftTop" title={text} content={content} trigger="click">
								<Button style={{ width: 100 }}>LT</Button>
							</Popover>
							<Popover placement="left" title={text} content={content} trigger="click">
								<Button style={{ width: 100 }}>Left</Button>
							</Popover>
							<Popover placement="leftBottom" title={text} content={content} trigger="click">
								<Button style={{ width: 100 }}>LB</Button>
							</Popover>
						</div>
						<div
							style={{
								width: buttonWidth,
								marginLeft: buttonWidth * 4 + 24,
							}}
						>
							<Popover placement="rightTop" title={text} content={content} trigger="click">
								<Button style={{ width: 100 }}>RT</Button>
							</Popover>
							<Popover placement="right" title={text} content={content} trigger="click">
								<Button style={{ width: 100 }}>Right</Button>
							</Popover>
							<Popover placement="rightBottom" title={text} content={content} trigger="click">
								<Button style={{ width: 100 }}>RB</Button>
							</Popover>
						</div>
						<div
							style={{
								marginLeft: buttonWidth,
								clear: 'both',
								whiteSpace: 'nowrap',
							}}
						>
							<Popover placement="bottomLeft" title={text} content={content} trigger="click">
								<Button style={{ width: 100 }}>BL</Button>
							</Popover>
							<Popover placement="bottom" title={text} content={content} trigger="click">
								<Button style={{ width: 100 }}>Bottom</Button>
							</Popover>
							<Popover placement="bottomRight" title={text} content={content} trigger="click">
								<Button style={{ width: 100 }}>BR</Button>
							</Popover>
						</div>
					</div>
				</Form.Item>
			</Col>
		</>
	);
};

/**
 * 툴팁 예제
 * @returns {*} 툴팁 예제 컴포넌트
 */
const TooltipExample = () => {
	const text = 'tooltip';
	const buttonWidth = 100;
	return (
		<>
			<Row>
				<Col span={24}>
					<Form.Item label={'tooltip'}>
						<div>
							<div style={{ marginLeft: buttonWidth, whiteSpace: 'nowrap' }}>
								<Tooltip placement="topLeft" title={text} color={'pink'}>
									<Button style={{ width: 100 }}>TL</Button>
								</Tooltip>
								<Tooltip placement="top" title={text} color={'red'}>
									<Button style={{ width: 100 }}>Top</Button>
								</Tooltip>
								<Tooltip placement="topRight" title={text} color={'yellow'}>
									<Button style={{ width: 100 }}>TR</Button>
								</Tooltip>
							</div>
							<div style={{ width: buttonWidth, float: 'left' }}>
								<Tooltip placement="leftTop" title={text} color={'orange'}>
									<Button style={{ width: 100 }}>LT</Button>
								</Tooltip>
								<Tooltip placement="left" title={text} color={'green'}>
									<Button style={{ width: 100 }}>Left</Button>
								</Tooltip>
								<Tooltip placement="leftBottom" title={text} color={'blue'}>
									<Button style={{ width: 100 }}>LB</Button>
								</Tooltip>
							</div>
							<div
								style={{
									width: buttonWidth,
									marginLeft: buttonWidth * 4 + 24,
								}}
							>
								<Tooltip placement="rightTop" title={text} color={'#f50'}>
									<Button style={{ width: 100 }}>RT</Button>
								</Tooltip>
								<Tooltip placement="right" title={text} color={'#2db7f5'}>
									<Button style={{ width: 100 }}>Right</Button>
								</Tooltip>
								<Tooltip placement="rightBottom" title={text} color={'#87d068'}>
									<Button style={{ width: 100 }}>RB</Button>
								</Tooltip>
							</div>
							<div
								style={{
									marginLeft: buttonWidth,
									clear: 'both',
									whiteSpace: 'nowrap',
								}}
							>
								<Tooltip placement="bottomLeft" title={text}>
									<Button style={{ width: 100 }}>BL</Button>
								</Tooltip>
								<Tooltip placement="bottom" title={text}>
									<Button style={{ width: 100 }}>Bottom</Button>
								</Tooltip>
								<Tooltip placement="bottomRight" title={text}>
									<Button style={{ width: 100 }}>BR</Button>
								</Tooltip>
							</div>
						</div>
					</Form.Item>
				</Col>
			</Row>
		</>
	);
};

/**
 * TimePicker 예제
 * @returns {*} timePicker 예제 컴포넌트
 */
const TimePickerExample = () => {
	const [selectTime] = useState({
		hour: 21,
		minute: 23,
	});

	const [selectMeridTime] = useState({
		hour: 21,
		minute: 23,
	});

	const [spinTime] = useState({
		hour: 20,
		minute: 15,
	});

	const [spinMeridTime] = useState({
		hour: 20,
		minute: 15,
	});

	const getTimePickerValue = (value: any) => {};

	return (
		<>
			{/* Selectbox 예제  */}
			<Row>
				<Col span={24}>
					<Form.Item label={'시간선택(selectbox)'}>
						<CustomTimePicker data={selectTime} onSelect={getTimePickerValue} />
						<CustomTimePicker data={selectMeridTime} meridiem={true} onSelect={getTimePickerValue} />
					</Form.Item>
				</Col>
			</Row>
			{/* SpinBox 예제 */}
			<Row>
				<Col span={24}>
					<Form.Item label={'시간선택(selectbox)'}>
						<CustomTimePicker data={spinTime} input="spinbox" onSelect={getTimePickerValue} />
						<CustomTimePicker data={spinMeridTime} meridiem={true} input="spinbox" onSelect={getTimePickerValue} />
					</Form.Item>
				</Col>
			</Row>
		</>
	);
};
