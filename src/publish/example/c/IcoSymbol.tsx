/**
 * @file IcoAvatar.tsx
 * @description ico avatar 컴포넌트
 */

import { IcoProps } from './common-ui';
import IcoSvg from './IcoSvg';

const IcoSymbol = ({ label, icoData }: IcoProps) => {
	return (
		<div className="ico-symbol__group">
			<IcoSvg data={icoData} />
			<span className="hidden">{label}</span>
		</div>
	);
};

export default IcoSymbol;
