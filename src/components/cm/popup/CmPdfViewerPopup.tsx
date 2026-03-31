/*
 ############################################################################
 # FiledataField	: CmImageViewerPopup.tsx
 # Description		: 이미지 팝업
 # Author			: jgs
 # Since			: 25.07.21
 ############################################################################
*/
// Lib
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// pdf worker 설정 (중요)

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

interface PropsType {
	dirType?: string;
	attchFileNm?: string;
	savePathNm?: string;
	saveFileNm?: string;
	readOnly?: boolean;
}

const CmPdfViewerPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const [pdfUrl, setPdfUrl] = useState('');
	const [numPages, setNumPages] = useState<number | null>(null);
	const [pageNumber, setPageNumber] = useState(1);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 * @param {any} root0
	 * @param {any} root0.numPages
	 */
	const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
		setNumPages(numPages);
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		// const params = {
		// 	dirType: props.dirType,
		// 	attchFileNm: props.attchFileNm,
		// 	savePathNm: props.savePathNm,
		// 	saveFileNm: props.saveFileNm,
		// 	readOnly: props.readOnly ?? true,
		// };
		// fileUtil.downloadFile(params).then((data: string) => {
		// 	setImgUrl(data);
		// });
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="PDF 뷰어" />
			<div className="img-preview">
				<Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
					{Array.from(new Array(numPages), (el, index) => (
						<Page key={`page_${index + 1}`} pageNumber={index + 1} />
					))}
				</Document>
			</div>
		</>
	);
};

export default CmPdfViewerPopup;
