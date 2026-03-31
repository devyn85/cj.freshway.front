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
import Icon from '@/components/common/Icon';
interface MenuTitleProps {
	name?: string;
	func?: any;
	slotLocation?: 'left' | 'right' | null | undefined;
	children?: any;
}

const PopupMenuTitle2 = (props: MenuTitleProps) => {
	const { name = '', slotLocation = 'right', func, children } = props;

	return (
		<>
			<Title>
				<MenuName name={name} />
			</Title>
			{props.func
				? () => {
						<MenuAuthButton slotLocation={slotLocation} func={func}>
							{children}
						</MenuAuthButton>;
				  }
				: null}
		</>
	);
};

export default PopupMenuTitle2;

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
		<>
			<div className="btn-group flex-just-end flex-align-cen">
				<Button
					key={'refresh'}
					type={'text'}
					icon={<Icon icon={`icon-search-refresh`} />}
					onClick={props.func['refresh']}
				></Button>
				<Button key={'searchYn'} size={'small'} type={'secondary'} onClick={props.func['searchYn']}>
					조회
				</Button>
			</div>
		</>
	);
};
