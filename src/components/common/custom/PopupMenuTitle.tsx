/*
 ############################################################################
 # FiledataField	: MenuTitle.tsx
 # Description		: 메뉴타이틀
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import { Button } from 'antd';
// utils
import { getFindMenu } from '@/store/core/menuStore';
// component
import Title from '@/assets/styled/Title/Title';
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';
interface MenuTitleProps {
	name?: string;
	func?: any;
	slotLocation?: 'left' | 'right' | null | undefined;
	children?: any;
	showButtons?: boolean;
	showChildrens?: boolean;
}

const PopupMenuTitle = (props: MenuTitleProps) => {
	const { name = '', slotLocation = 'right', func, children, showButtons = true, showChildrens = false } = props;

	return (
		<>
			<Title>
				<MenuName name={name} />
			</Title>
			{showButtons && (
				<MenuAuthButton slotLocation={slotLocation} func={func}>
					{children}
				</MenuAuthButton>
			)}
			{!showButtons && showChildrens && <ChildrenButton>{children}</ChildrenButton>}
		</>
	);
};

export default PopupMenuTitle;

/**
 * 메뉴 이름: 메뉴 이름 없는 경우 현재 주소 메뉴 이름 설정
 * @param {MenuTitleProps} props 메뉴 명 컴포넌트 props
 * @returns {*} 메뉴 명 컴포넌트
 */
const MenuName = (props: MenuTitleProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { name } = props;
	const location = useLocation();
	// variable
	const [currentMenuName, setCurrentMenuName] = useState('');

	/**
	 * =====================================================================
	 *	03. react hook
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		setCurrentMenuName(getFindMenu(location.pathname)?.menuNm);
	}, []);

	return <>{name ? <h2>{name}</h2> : <h2>{currentMenuName}</h2>}</>;
};

/**
 * 메뉴 권한 버튼
 * @param {MenuTitleProps} props 메뉴 권한 버튼 컴포넌트 Props
 * @returns {void}
 */
const MenuAuthButton = (props: MenuTitleProps) => {
	return (
		<div className="btn-group flex-just-end flex-align-cen">
			{props.func && props.func['refresh'] && (
				<Button
					label={'새로고침'}
					key={'refresh'}
					icon={<IcoSvg data={icoSvgData.icoRefresh} />}
					onClick={props.func['refresh']}
				/>
			)}
			{props.func && props.func['searchYn'] && (
				<Button key={'searchYn'} type={'secondary'} onClick={props.func['searchYn']}>
					조회
				</Button>
			)}
		</div>
	);
};

/**
 * 메뉴 권한 버튼
 * @param {MenuTitleProps} props 메뉴 권한 버튼 컴포넌트 Props
 * @returns {void}
 */
const ChildrenButton = (props: MenuTitleProps) => {
	return <div className="btn-group flex-just-end flex-align-cen">{<>{props.children}</>}</div>;
};
