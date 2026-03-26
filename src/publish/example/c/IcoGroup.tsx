/**
 * @file IcoGroup.tsx
 * @description ico 모음
 */

import IcoSvg from './IcoSvg';
import icoSvgData from './icoSvgData.json';

export const IcoRequired = () => {
	return (
		<strong className="ico-required">
			<span className="hidden">필수</span>
		</strong>
	);
};

export const IcoTooltip = () => {
	return (
		<span className="ico-tooltip">
			<IcoSvg data={icoSvgData.icoInfoCircle} />
			<span className="hidden">툴팁(부연설명)</span>
		</span>
	);
};

export const IcoQuestionTooltip = () => {
	return (
		<span className="ico-tooltip">
			<IcoSvg data={icoSvgData.icoInfoCircle} />
			<span className="hidden">툴팁 물음표(부연설명)</span>
		</span>
	);
};

export const IcoChevronThickLeft = () => {
	return (
		<span className="ico-chevron-thick-left">
			<IcoSvg data={icoSvgData.icoArrowLeft} />
			<span className="hidden">이전</span>
		</span>
	);
};

export const IcoChevronThickRight = () => {
	return (
		<span className="ico-chevron-thick-right">
			<IcoSvg data={icoSvgData.icoArrowRight} />
			<span className="hidden">다음</span>
		</span>
	);
};
