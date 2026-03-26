/**
 * @file IcoSvg.tsx
 * @description ico svg 컴포넌트
 */

import { DataProps } from './common-ui';

const IcoSvg = ({ data, label }: DataProps) => {
	return (
		<span className="ico-svg">
			<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
				{data?.map((d: string, i: number) => (
					<path d={d} fill="currentColor" key={i} />
				))}
			</svg>
		</span>
	);
};

export default IcoSvg;
