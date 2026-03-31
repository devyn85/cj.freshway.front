/*
 ############################################################################
 # FiledataField	: GridSamlple.tsx
 # Description		: 그리드 샘플
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/

// Libs
import { Layout, Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';

// Components
import Title from '@/assets/styled/Title/Title';
import GridEventSample from '@/components/comfunc/sample/grid/GridEventSample';
import HorizonGridSample from '@/components/comfunc/sample/grid/HorizonGridSample';
import SingleGridSample from '@/components/comfunc/sample/grid/SingleGridSample';
import StateGridSample from '@/components/comfunc/sample/grid/StateGridSample';
import VerticalGridSample from '@/components/comfunc/sample/grid/VerticalGridSample';

// Sider 영역 style
const siderStyle: React.CSSProperties = {
	color: '#fff',
	backgroundColor: '#fff',
	minHeight: '300px',
};
// Content 영역 style
const contentStyle: React.CSSProperties = {
	minHeight: '300px',
	lineHeight: '22px',

	minWidth: '100% - 300px',
	margin: '10px',
	padding: '10px',
	display: 'flex',
	flexDirection: 'column',

	backgroundColor: '#fff',
};

const GridSample = () => {
	/**
	- =====================================================================
	- 변수 선언부
	- =====================================================================
	 */

	// 활성화된 메뉴 관리를 위한 state
	const [activeKey, setActiveKey] = useState<string>('state');

	// 메뉴 아이템 선언
	const getItem = (
		label: React.ReactNode,
		key: React.Key,
		icon?: React.ReactNode,
		children?: Required<MenuProps>['items'][number][],
		type?: 'group',
	): Required<MenuProps>['items'][number] => {
		return {
			key,
			icon,
			children,
			label,
			type,
		} as Required<MenuProps>['items'][number];
	};

	// 메뉴 리스트 지정
	const items: MenuProps['items'] = [
		getItem('그리드 표현', 'state'),
		getItem('Single', 'single'),
		getItem('Multi(vertical)', 'multiV'),
		getItem('Multi(horizon)', 'multiH'),
		getItem('Events', 'event'),
		getItem('Splitter', 'splitter'),
	];

	const onClick: MenuProps['onClick'] = e => {
		setActiveKey(e.key);
	};

	// const moveAntd = () => {
	// 	window.open('https://www.auisoft.net/', '_blank');
	// 	// window.open('https://ui.toast.com/tui-grid', '_blank');
	// };

	return (
		<>
			<div>
				{/* 상단 타이틀 및 페이지 버튼 */}
				<Title>
					<h1>Grid 샘플</h1>
					{/* <Button onClick={moveAntd}>AUIGrid 바로가기</Button> */}
					{/* <Button onClick={moveAntd}>TUIGrid 바로가기</Button> */}
				</Title>
				<Layout>
					<Sider style={siderStyle}>
						<Menu
							onClick={onClick}
							defaultSelectedKeys={['state']}
							defaultOpenKeys={['state']}
							mode="inline"
							items={items}
						/>
					</Sider>
					<Layout>
						<Content style={contentStyle} id="content-scroll">
							<SampleComponent activeKey={activeKey} />
						</Content>
					</Layout>
				</Layout>
			</div>
		</>
	);
};

export default GridSample;

const SampleComponent = ({ activeKey }: any) => {
	switch (activeKey) {
		// TUI 사용 시 (single 을 제외한 나머지 컴퍼넌트 삭제)
		case 'single':
			return <SingleGridSample />;
		case 'multiV':
			return <VerticalGridSample />;
		case 'multiH':
			return <HorizonGridSample />;
		case 'event':
			return <GridEventSample />;
		case 'state':
			return <StateGridSample />;
		default:
			return (
				<>
					<div
						style={{
							height: '500px',
						}}
					>
						<h1>준비 중</h1>
					</div>
				</>
			);
	}
};
