/*
 ############################################################################
 # FiledataField	: InputSample.tsx
 # Description		: 입력 샘플
 # Author			: Canal Frame
 # Since			: 23.09.09
 ############################################################################
*/

// Components
import CheckboxSample from '@/components/comfunc/sample/input/CheckboxSample';
import DatePickerSample from '@/components/comfunc/sample/input/DatePickerSample';
import InputSample from '@/components/comfunc/sample/input/InputSample';
import RadioSample from '@/components/comfunc/sample/input/RadioSample';
import SelectSample from '@/components/comfunc/sample/input/SelectSample';

// CSS
import Title from '@/assets/styled/Title/Title';

// Antd Items
import { Button, Card, Col, Image, Layout, Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';

const descStyle: React.CSSProperties = {
	lineHeight: '22px',
	marginBottom: '20px',
};

const cardStyle: React.CSSProperties = {
	minHeight: '200px',
	padding: '0 24px !important',
};

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

const siderStyle: React.CSSProperties = {
	color: '#fff',
	backgroundColor: '#fff',
	minHeight: '300px',
};

type MenuItem = Required<MenuProps>['items'][number];

const FormSample = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const [activeKey, setActiveKey] = useState<string>('input');
	const getItem = (
		label: React.ReactNode,
		key: React.Key,
		icon?: React.ReactNode,
		children?: MenuItem[],
		type?: 'group',
	): MenuItem => {
		return {
			key,
			icon,
			children,
			label,
			type,
		} as MenuItem;
	};

	const items: MenuProps['items'] = [
		getItem('Input', 'input'),
		getItem('Select', 'select'),
		getItem('Radio', 'radio'),
		getItem('Checkbox', 'checkbox'),
		getItem('DatePicker', 'datePicker'),
	];

	const onClick: MenuProps['onClick'] = e => {
		setActiveKey(e.key);
	};

	const moveAntd = () => {
		window.open('https://ant.design/components/input', '_blank');
	};

	return (
		<>
			<div>
				{/* 상단 타이틀 및 페이지버튼 */}
				<Title>
					<h1>입력 샘플</h1>
					<Button onClick={moveAntd}>
						<Image src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" height={18} />
						Ant Design 바로가기
					</Button>
				</Title>
				<Layout>
					<Sider style={siderStyle}>
						<Menu
							onClick={onClick}
							defaultSelectedKeys={['input']}
							defaultOpenKeys={['input']}
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

export default FormSample;

const SampleComponent = ({ activeKey }: any) => {
	useEffect(() => {
		//console.log((activeKey);
	}, [activeKey]);
	switch (activeKey) {
		case 'input':
			return <InputSample />;
		case 'select':
			return <SelectSample />;
		case 'radio':
			return <RadioSample />;
		case 'checkbox':
			return <CheckboxSample />;
		case 'datePicker':
			return <DatePickerSample />;
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

export const CardComponent = (props: any) => {
	const { title, span = 24, desc, children, extra = <></> } = props;
	return (
		<Col span={span}>
			<Card title={title} extra={extra} style={cardStyle}>
				<div style={descStyle}>{desc}</div>
				{children}
			</Card>
		</Col>
	);
};
