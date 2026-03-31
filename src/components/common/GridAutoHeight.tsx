import { CSSProperties, ReactNode, useMemo } from 'react';
import styled from 'styled-components';

type GridAutoHeightProps = {
	id?: string;
	height?: number | string;
	width?: number | string;
	className?: string;
	style?: CSSProperties;
	children: ReactNode;
};

const toCssSize = (v?: number | string) => {
	if (v === undefined) return undefined;
	return typeof v === 'number' ? `${v}px` : v;
};

const GridAutoHeight = ({ id, height = '100%', width = '100%', className, style, children }: GridAutoHeightProps) => {
	const mergedStyle = useMemo<CSSProperties>(
		() => ({
			height: toCssSize(height),
			width: toCssSize(width),
			...style,
		}),
		[height, width, style],
	);

	return (
		<GridHost id={id} className={className} style={mergedStyle}>
			{children}
		</GridHost>
	);
};

export default GridAutoHeight;

const GridHost = styled.div`
	position: relative;
	min-height: 0;
	min-width: 0;

	& > div {
		width: auto;
		height: auto;
		min-height: 0 !important;
	}

	.aui-grid,
	.aui-grid-root,
	.aui-grid-container,
	.aui-grid-wrap,
	.aui-grid-wrapper,
	.aui-grid-main,
	.aui-grid-panel,
	.aui-grid-parent {
		height: 100% !important;
		min-height: 0 !important;
	}
`;
