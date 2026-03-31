/**
 * @file common-ui.d.ts
 * @description common-ui 관련 타입 정의
 */

import { CSSProperties } from 'react';
import { PlacesType } from 'react-tooltip';
import { Group } from 'next/dist/shared/lib/router/utils/route-regex';

export type stringType = {
	[key: string]: string;
};

export interface objStringProp {
	[key: string]: string;
}

export interface InputTextProps {
	title?: string;
	inputType?: string;
	placeholder?: string;
	value?: string;
	required?: boolean;
	tooltip?: boolean;
	children?: undefined | JSX.Element;
	disabled?: boolean;
	msg?: string;
	succeeded?: boolean;
	failed?: boolean;
	addBtn?: boolean;
	readonly?: boolean;
	minusBtn?: boolean;
	width?: string;
}

export interface DataProps {
	data: string[] | undefined;
	label?: string;
}

export interface InputBtnProps {
	name: string;
	id: string;
	type?: string;
	title?: string;
	required?: boolean;
	tooltip?: boolean;
	label?: string;
	checked?: boolean;
	disabled?: boolean;
	msg?: string;
	succeeded?: boolean;
	failed?: boolean;
	reverse?: boolean;
	count?: number;
	subLabel?: string;
	desc?: string;
	history?: string;
}

export interface IRenderCustomerHeaderProps {
	date: Date;
	changeYear: (year: number) => void;
	changeMonth: (month: number) => void;
	decreaseMonth: () => void;
	increaseMonth: () => void;
	prevMonthButtonDisabled: boolean;
	nextMonthButtonDisabled: boolean;
}

export interface TooltipProps {
	tooltipId: string | undefined;
	tooltipPlace: PlacesType;
	tooltipHtml: string | undefined;
	tooltipComponent?: undefined | JSX.Element;
	tooltipContents?: string;
	url?: string;
	target?: string;
}

export interface SelectStyleProps {
	small?: boolean;
	outline?: boolean;
	direction?: string;
	icoSize?: number;
}

export interface SelectDefaultProps {
	small?: boolean;
	outline?: boolean;
	options: { [key: string]: string }[];
	placeholder?: string;
	direction?: string;
	icoData?: string[];
	icoSize: number;
}

export interface SelectDefaultGroupProps extends Omit<SelectDefaultProps, 'options'> {
	options: { group: string; name: string; data: { [key: string]: string }[] }[];
}

// 정리
export interface IcoProps {
	label: string;
	icoData: string[];
	size?: string;
	icoSize?: string;
	style?: CSSProperties;
	className?: string;
}

export interface ButtonProps {
	c?: string;

	eClick(): void;
}

export interface ButtonsProps {
	elem: string;
	url: string;
	target: string;
	label: string;
	size: string;
	cate: string;
	color: string;
	count: number | null;
	icoLeft: boolean;
	icoLeftData: string[] | undefined;
	icoRight: boolean;
	icoRightData: string[] | undefined;
	icoSize: number | null;
	disabled: boolean;
	title: string;
	onClick: () => void;
}

export interface TagsProps {
	label: string;
	cate: string;
	shape: string;
	close: boolean;
	subLabel?: string;
}

export interface FlagsProps {
	label: string;
	color: string;
	size: string;
}

export interface PaginationProps {
	cate: string;
	option: number[];
}

export interface ApexChartsOptionsProps {
	options: ApexCharts.ApexOptions;
}

export interface HeaderReportProps {
	menuMain?: boolean;
	menuReporter?: boolean;
}
