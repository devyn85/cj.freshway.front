/**
 * @file IcoSvg.tsx
 * @description ico svg 컴포넌트
 */

interface SvgProps {
	data: string[];
	fill?: string;
	label?: string;
}

const IcoSvg = ({ data, fill = 'currentColor', label }: SvgProps) => {
	return (
		<span className="ico-svg" aria-label={label}>
			<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
				{data?.map((d: string, i: number) => (
					<path d={d} fill={fill} key={i} />
				))}
			</svg>
		</span>
	);
};

export default IcoSvg;
