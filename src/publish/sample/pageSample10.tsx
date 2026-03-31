// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Col, Form, Row } from 'antd';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';
import { CheckBox, InputText, InputTextArea, SearchFormResponsive } from '@/components/common/custom/form';
import Datepicker from '@/components/common/custom/form/Datepicker';

// API

const pageSample10 = forwardRef((props: any, gridRef: any) => {
	const [form] = Form.useForm();
	const [expanded, setExpanded] = useState(false);
	const [showToggleBtn, setShowToggleBtn] = useState(false);
	const groupRef = useRef<HTMLUListElement>(null);

	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	const { t } = useTranslation();
	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
	});
	const onChange = (value: string) => {};

	const getGridCol2 = () => {
		return [
			{
				dataField: 'empNo',
				headerText: '순번',
			},
			{
				headerText: '실행일자',
			},
			{
				headerText: '오브젝트명',
			},
			{
				headerText: '시스템명',
			},
			{
				headerText: '처리명령',
			},
			{
				headerText: '작업자',
			},
			{
				headerText: 'DB SPID',
			},
			{
				headerText: '실햍시간',
			},
			{
				headerText: '실행소요시간',
			},
			{
				headerText: '에러코드',
			},
			{
				headerText: '에러사항',
			},
			{
				headerText: '사용자표시메세지',
			},
			{
				headerText: 'RETURNMSG',
			},
			{
				headerText: '물류센터',
			},
			{
				headerText: '회사',
			},
			{
				headerText: '창고',
			},
			{
				headerText: '작업구역',
			},
			{
				headerText: '요청코드',
			},
			{
				headerText: '요청메세지',
			},
		];
	};
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn|saveYn" name={t('프로시저실행로그')} />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<Datepicker label={'실행일자'} />
				</li>
				<li>
					<InputText label={'오브젝트명'} placeholder="" />
				</li>
				<li>
					<InputText label={'처리명령'} placeholder="" />
				</li>
				<li>
					<InputText label={'작업자'} placeholder="" />
				</li>
				<li>
					<InputText label={'DB SPID'} placeholder="" />
				</li>
				<li>
					<InputText label={'요청메세지'} placeholder="" />
				</li>
				<li>
					<CheckBox label={'ERROR'}>ERROR</CheckBox>
				</li>
			</SearchFormResponsive>

			<Form form={form}>
				<Row>
					<Col span={24}>
						<AGrid>
							<AUIGrid columnLayout={getGridCol2()} />
						</AGrid>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<li>
							<InputTextArea
								name="resultMessage"
								placeholder="입력"
								autoSize={{ minRows: 15, maxRows: 15 }}
								style={{ width: '100%' }}
							/>
						</li>
					</Col>
				</Row>
			</Form>
		</>
	);
});

export default pageSample10;
