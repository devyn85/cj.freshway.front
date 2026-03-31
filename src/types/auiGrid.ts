import { ReactNode } from 'react';

type AUIGridPropsType = {
	ref: any;
	name?: string;
	autoResize?: boolean;
	dataProps?: string;
	resizeDelayTime?: any;
	gridProps: object;
	columnLayout: object[];
	footerLayout?: object[];
};

export type ButtonConfig = {
	label?: string;
	icon?: keyof typeof import('@/components/common/icoSvgData.json'); // 또는 직접 ButtonIconKey를 정의
	onClick?: () => void;
	type?: 'default' | 'primary' | 'outline-primary' | 'danger';
	visible?: boolean;
	customRender?: React.ReactNode;
};

// pageGridBtn 컴포넌트 props
interface pageGridBtnPropsType {
	gridTitle?: string;
	gridBtn?: AUIGridBtnProps;
	position?: 'prefix' | 'postfix';
	children?: ReactNode;
	totalCnt?: number;
	order?: number;
	msg?: boolean;
	extraContentLeft?: ReactNode;
	extraContentRight?: React.ReactNode;
	buttons?: ButtonConfig[];
}

type AUIGridBtnProps = {
	isPlus?: boolean; // +
	isMinus?: boolean; // -
	isCopy?: boolean; // 복사

	plusFunction?: any;
	minusFunction?: any;
	copyFunction?: any;

	isAddBtn1?: boolean;
	isAddBtn2?: boolean;
	isAddBtn3?: boolean;

	addFunction1?: any;
	addFunction2?: any;
	addFunction3?: any;
	addLabel1?: string;
	addLabel2?: string;
	addLabel3?: string;

	isCustom?: boolean;
	customComponent?: any;
};

export type { AUIGridBtnProps, AUIGridPropsType, pageGridBtnPropsType };
