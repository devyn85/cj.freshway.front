declare module '*.svg' {
	import React = require('react');
	export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
	const src: string;
	export default src;
}

// declare module 'lodash' {}
declare module 'qs';
declare module 'html2pdf.js'; //html2pdf 라이브러리 import
declare module 'tui-time-picker'; // tui time picker
declare module 'quill-blot-formatter/dist/BlotFormatter';
declare module 'quill-image-drop-module';

// Timeline temp module declarations to satisfy missing types
declare module 'lodash.clonedeep';
declare module 'lodash.orderby';
declare module 'lodash.throttle';
