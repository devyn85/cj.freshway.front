/*
 ############################################################################
 # FiledataField	: DevPilot02.tsx
 # Description		: 파일럿
 # Author			: sss
 # Since			: 25.05.23
 ############################################################################
*/

// Libs
import { Form, Layout, Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';

// Components
import Title from '@/assets/styled/Title/Title';
import DevPilot02Sub01 from '@/pages/dev/DevPilot02Sub01';
import DevPilot02Sub02 from '@/pages/dev/DevPilot02Sub02';
import { useSelector } from 'react-redux';

// Sider 영역 style
const siderStyle: React.CSSProperties = {
	color: '#fff',
	backgroundColor: '#fff',
};
// Content 영역 style
const contentStyle: React.CSSProperties = {
	minHeight: '500px',
	lineHeight: '22px',
	height: 'auto',
	margin: '5px',
	padding: '5px',
	display: 'flex',
	flexDirection: 'column',

	backgroundColor: '#fff',
};

const DevPilot02 = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation(); // 다국어 처리
	const [form] = Form.useForm(); // Antd Form

	// 컴포넌트 접근을 위한 Ref(2/4)
	const PilotGateWayRef = useRef(null); // 파일럿 컴포넌트 접근을 위한 Ref

	// 초기 값(3/4)
	const searchBox = {
		storerkey: useSelector((state: any) => state.global.globalVariable.gStorerkey),
		dccode: useSelector((state: any) => state.global.globalVariable.gDccode),
	};

	// 기타(4/4)
	// 메뉴
	const [menuName, setmenuName] = useState<string>(''); // 활성화된 메뉴 관리를 위한 state
	// 메뉴 아이템 선언
	const getItem = (key: React.Key, label: React.ReactNode) => {
		return {
			key,
			label,
		};
	};

	// 메뉴 리스트 지정

	/**
	 * ====================================================================
	 *  메뉴 아이템
	 * ====================================================================
	 * 메뉴 아이템은 getItem 함수를 통해 생성되며, key와 label을 인자로 받습니다.
	 * 	각 메뉴 아이템은 key를 통해 식별되며, label은 메뉴에 표시되는 텍스트입니다.
	 * 이 예시에서는 'Oracle패키지호출', 'p02_events1', 'p03_events2' 세 가지 메뉴 아이템이 정의되어 있습니다.
	 * 각 아이템은 getItem 함수를 호출하여 생성되며, key와 label을 인자로 전달합니다.
	 * 이 메뉴 아이템들은 나중에 Menu 컴포넌트에 전달되어 사용됩니다.
	 */
	const items: MenuProps['items'] = [
		getItem('Oracle패키지호출', 'Oracle패키지호출'),
		getItem('개인정보마스킹', '개인정보마스킹'),
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// 메뉴 클릭 이벤트 핸들러
	const menuOnClick: MenuProps['onClick'] = e => {
		setmenuName(e.key);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 화면 초기 세팅
	 * 	- 컴포넌트가 마운트될 때 초기 활성화된 메뉴를 설정합니다.
	 */
	useEffect(() => {
		setmenuName('Oracle패키지호출'); // 초기 활성화된 탭 설정
	}, []);

	return (
		<>
			<div>
				{/* 상단 타이틀 및 페이지 버튼 */}
				<Title>
					<h1>파일럿</h1>
				</Title>
				<Layout>
					<Sider style={siderStyle}>
						<Menu onClick={menuOnClick} items={items} />
					</Sider>
					<Layout>
						<Content style={contentStyle} id="content-scroll">
							<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
								{/* 부모에 Button 컴포넌트가 있다면, 아래 버튼을 사용하여 서브 컴포넌트의 메서드를 호출할 수 있습니다.
								<Button
									onClick={() => PilotGateWayRef.current?.resetFn && PilotGateWayRef.current.resetFn()}
									icon={<IcoSvg data={icoSvgData.icoRefresh} label={'새로고침'} />}
									style={{ marginRight: '1px' }}
								/>
								<Button
									type="secondary"
									onClick={() => PilotGateWayRef.current?.search && PilotGateWayRef.current.search()}
								>
									{'조회'}
								</Button> */}
							</div>

							<PilotGateWay ref={PilotGateWayRef} menuName={menuName} />
						</Content>
					</Layout>
				</Layout>
			</div>
		</>
	);
};

/**
 * DevPilot02 컴포넌트
 * 		- 파일럿 페이지의 메인 컴포넌트
 * 		- 사이드 메뉴와 컨텐츠 영역을 포함
 * 	- 사이드 메뉴는 파일럿 관련 기능을 선택할 수 있는 메뉴를 제공
 * 		- 컨텐츠 영역은 선택된 메뉴에 따라 다른 컴포넌트를 렌더링
 * 	- useRef를 사용하여 사이드 메뉴에서 선택된 기능에 접근할 수 있도록 설정
 * 		- useEffect를 사용하여 초기 활성화된 메뉴를 설정
 */
export default DevPilot02;

/**
 * 	PilotGateWay 컴포넌트
 * 	- 메뉴에 따라 다른 컴포넌트를 렌더링하는 역할
 */
const PilotGateWay = forwardRef<any, { menuName: string }>((props, ref) => {
	let content = null;
	const subRef = useRef(null);

	/**
	 * 부모에서 호출 시 useImperativeHandle을 통해 서브 컴포넌트의 메서드를 호출할 수 있도록 설정
	 * 		- resetFn: 서브 컴포넌트의 resetFn을 호출
	 * 		- search: 서브 컴포넌트의 searchMaster를 호출
	 */
	useImperativeHandle(ref, () => ({
		resetFn: () => {
			subRef.current?.resetFn();
		},
		search: () => {
			subRef.current?.searchMaster();
		},
	}));

	/**
	 * 메뉴에 따라 다른 컴포넌트를 렌더링
	 */
	switch (props.menuName) {
		case 'Oracle패키지호출':
			content = <DevPilot02Sub01 ref={subRef} menuName={props.menuName} />;
			break;
		case '개인정보마스킹':
			content = <DevPilot02Sub02 ref={subRef} menuName={props.menuName} />;
			break;
		default:
			content = null;
	}

	return (
		<>
			<div>{props.menuName}</div>
			{content}
		</>
	);
});
