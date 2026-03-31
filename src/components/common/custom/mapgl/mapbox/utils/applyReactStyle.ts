import { CSSProperties } from 'react';

const unitlessNumber = /box|flex|grid|column|lineHeight|fontWeight|opacity|order|tabSize|zIndex/;

export const applyReactStyle = (element: HTMLElement, styles: CSSProperties | undefined) => {
	if (!element || !styles) return;

	const style = element.style;

	for (const key in styles) {
		const cssKey = key as keyof CSSProperties;
		const value = styles[cssKey];
		if (value === undefined || value === null) continue;
		if (typeof value === 'number' && !unitlessNumber.test(key)) (style as any)[key] = `${value}px`;
		else (style as any)[key] = value;
	}
};
