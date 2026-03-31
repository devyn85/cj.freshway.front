/**
 * @file IcoAvatar.tsx
 * @description ico avatar 컴포넌트
 */

import { IcoProps } from './common-ui';
import IcoSvg from './IcoSvg';

const IcoAvatar = ({ label, icoData, size, icoSize, style, className }: IcoProps) => {
	return (
		<div className={`ico-avatar__group size-${size} icoSize-${icoSize} ${className}`} style={style}>
			<IcoSvg data={icoData} />
			<span className="hidden">{label}</span>
		</div>
	);
};

IcoAvatar.defaultProps = {
	size: 's48',
	icoSize: 's24',
};

export default IcoAvatar;
