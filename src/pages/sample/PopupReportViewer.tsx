import { forwardRef, useRef } from 'react';

declare global {
	interface Window {
		m2soft: any;
	}
}

interface ReportViewerProps {
	fileName: string; // 보고서 URL 또는 파일 경로
	title?: string;
	dataSet?: []; // 보고서에 전달할 파라미터
	closeEvent?: () => void; // 리포트 뷰어 닫기 이벤트
	height?: string | number;
	width?: string | number;
	params?: string; // 리포트 뷰어에 전달할 추가 인자
}

const { VITE_RD_BASE_URL } = import.meta.env; // RD 기본 URL

const PopupReportViewer = forwardRef<HTMLDivElement, ReportViewerProps>((props, ref) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// props
	const { fileName, title, height = '100%', width = '100%', closeEvent } = props;
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const reportUrl = `${VITE_RD_BASE_URL}/report/ReportingServer/html5/sample/sample.html`;
	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 * @param params
	 */
	const getRdXml = (params: Record<string, any[]>) => {
		const toXmlSafe = (str: any) => {
			if (typeof str !== 'string') str = String(str ?? '');
			return str
				.replace(/&/g, '&amp;') // 앰퍼샌드
				.replace(/</g, '&lt;') // 꺾쇠괄호 <
				.replace(/>/g, '&gt;') // 꺾쇠괄호 >
				.replace(/"/g, '&quot;') // 큰따옴표
				.replace(/'/g, '&apos;') // 작은따옴표
				.replace(/ /g, '&#32;'); // 공백
		};

		let xml = '<?xml version="1.0" encoding="euc-kr"?>\n<root>';
		Object.entries(params).forEach(([dsName, dataList]) => {
			if (!Array.isArray(dataList)) return; // dataList가 배열이 아니면 건너뜀
			xml += `\n\t<dataset id="${dsName}">\n`;

			if (dataList.length > 0 && dataList[0]) {
				Object.keys(dataList[0]).forEach(key => {
					//const type = key.toUpperCase() === 'QTY' ? 'DECIMAL' : 'STRING';
					//const type = ['QTY', 'QTY_2'].includes(key.toUpperCase()) ? 'DECIMAL' : 'STRING';
					const type = ['QTY'].includes(key.toUpperCase()) ? 'DECIMAL' : 'STRING';
					xml += `\t\t<colinfo id="${key
						.replace(/([A-Z])/g, '_$1')
						.toUpperCase()}" size="256" summ="default" type="${type}"/>\n`;
				});
			}

			dataList.forEach(row => {
				if (row && typeof row === 'object') {
					xml += '\t\t<record>\n';
					Object.entries(row).forEach(([key, value]) => {
						xml += `\t\t\t<${key.replace(/([A-Z])/g, '_$1').toUpperCase()}>${toXmlSafe(value)}</${key
							.replace(/([A-Z])/g, '_$1')
							.toUpperCase()}>\n`;
					});
					xml += '\t\t</record>\n';
				}
			});
			xml += '\t</dataset>';
		});
		xml += '\n</root>';
		return xml;
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		if (window.m2soft && window.m2soft.crownix && window.m2soft.crownix.Viewer) {
			// POST로 전달된 input hidden 값 읽기 (타입 안전하게)
			const fileName = (document.querySelector('input[name="fileName"]') as HTMLInputElement | null)?.value;
			const params = (document.querySelector('input[name="params"]') as HTMLInputElement | null)?.value;
			const dataSetRaw = (document.querySelector('input[name="dataSet"]') as HTMLInputElement | null)?.value;
			//const titleInput = (document.querySelector('input[name="title"]') as HTMLInputElement | null)?.value;

			let dataSet: Record<string, any[]> = {};
			if (dataSetRaw) {
				try {
					const parsed = JSON.parse(dataSetRaw);
					if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
						dataSet = parsed;
					}
				} catch (e) {}
			} else if (props.dataSet && typeof props.dataSet === 'object' && !Array.isArray(props.dataSet)) {
				dataSet = props.dataSet as Record<string, any[]>;
			}

			let viewerUrl = '/report/ReportingServer/service';
			if (import.meta.env.MODE === 'localhost') {
				viewerUrl = VITE_RD_BASE_URL + viewerUrl;
			}

			const viewer = new window.m2soft.crownix.Viewer(viewerUrl, 'crownix-viewer');

			// DataSet을 XML로 변환
			const xml = getRdXml(dataSet);

			// 파라미터 설정
			let dbParam = '/rv';
			if (params && params.trim().length > 0) {
				const arrParam = params.split('|');
				arrParam.forEach(param => {
					const [key, value] = param.split('=');
					if (key && value !== undefined) {
						dbParam += ` ${key}[${value}]`;
					}
				});
			}

			// XML 세팅
			viewer.setRData(xml);

			// 리포트 파일 열기
			viewer.openFile(fileName, dbParam && dbParam !== '/rv' ? dbParam + ' /rxmlreportopt [0]' : '/rxmlreportopt [0]');
		} else {
		}
	}, []);

	return (
		<div style={{ width, height, border: '1px solid #ddd', borderRadius: 4, overflow: 'hidden' }}>
			<div style={{ padding: '8px 12px', background: '#f5f5f5', borderBottom: '1px solid #eee' }}>
				<strong>{title}</strong>
			</div>
			{/* <iframe
				ref={iframeRef}
				src={reportUrl}
				title={title}
				style={{ width: '100%', height: `calc(100% - 40px)`, border: 'none' }}
				frameBorder={0}
			/> */}
			<div id="crownix-viewer" />
		</div>
	);
});

export default PopupReportViewer;
