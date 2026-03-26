/*
 ############################################################################
 # FiledataField	: CmManualViewerPopup.tsx
 # Description		: 매뉴얼 뷰 팝업
 # Author			: jgs
 # Since			: 26.01.30
 ############################################################################
*/
// Lib
import { Button, Tabs } from 'antd';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

import { apiGetCmFileUploadList } from '@/api/cm/apiCmFileUpload';

// Utils
import fileUtil from '@/util/fileUtils';

// pdf worker 설정 (중요)
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

interface PropsType {
	popUpParams?: any; // 팝업에 전달할 파라미터
}

const CmManualViewerPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { popUpParams } = props;
	const [activeWrapper, setActiveWrapper] = useState<HTMLElement | null>(null);
	const [activeKey, setActiveKey] = useState('1');
	const pdfUrl1Ref = useRef<string>(null); // 업무화면 매뉴얼
	const pdfUrl2Ref = useRef<string>(null); // 공통기능 매뉴얼
	const pdfUrl3Ref = useRef<string>(null); // 배송기사 App 매뉴얼
	const pdfUrl4Ref = useRef<string>(null); // 물류센터 App 매뉴얼
	const [numPages1, setNumPages1] = useState<number | null>(null); // 업무화면 매뉴얼 페이징
	const [numPages2, setNumPages2] = useState<number | null>(null); // 공통기능 매뉴얼 페이징
	const [numPages3, setNumPages3] = useState<number | null>(null); // 배송기사 App 매뉴얼 페이징
	const [numPages4, setNumPages4] = useState<number | null>(null); // 물류센터 App 매뉴얼 페이징
	const [pageNumber1, setPageNumber1] = useState(1); // 업무화면 매뉴얼 페이징
	const [pageNumber2, setPageNumber2] = useState(1); // 공통기능 매뉴얼 페이징
	const [pageNumber3, setPageNumber3] = useState(1); // 배송기사 App 매뉴얼 페이징
	const [pageNumber4, setPageNumber4] = useState(1); // 물류센터 App 매뉴얼 페이징

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 파일 조회
	 */
	function searchFileList() {
		const params = {
			type: 'Manual',
			multiRefKey: `${popUpParams?.progCd},WM10`,
		};
		apiGetCmFileUploadList(params).then(res => {
			if (res.statusCode === 0) {
				const retData = res.data;
				retData?.forEach((data: any) => {
					const params = {
						dirType: 'savePath',
						saveFileNm: data['sourceFileNm'],
						savePathNm: data['uploadedDirPath'],
						attchFileNm: data['uploadedFileNm'],
						readOnly: true,
						drmUseYn: 'N',
					};
					fileUtil.downloadFile(params).then((url: string) => {
						if (data['refKey'] === popUpParams?.progCd) {
							pdfUrl1Ref.current = url;
							setActiveKey('1');
						} else if (data['fileSeq'] === '1') {
							pdfUrl2Ref.current = url;
							setActiveKey('2');
						} else if (data['fileSeq'] === '2') {
							pdfUrl3Ref.current = url;
							setActiveKey('3');
						} else if (data['fileSeq'] === '3') {
							pdfUrl4Ref.current = url;
							setActiveKey('4');
						}

						// TAB 맨앞으로 설정
						if (commUtil.isNotEmpty(pdfUrl1Ref.current)) {
							setActiveKey('1');
						} else if (commUtil.isNotEmpty(pdfUrl2Ref.current)) {
							setActiveKey('2');
						} else if (commUtil.isNotEmpty(pdfUrl3Ref.current)) {
							setActiveKey('3');
						}
					});
				});
			}
		});
	}

	/**
	 * 마우스 휠로 페이징 컨트롤
	 * @param {any} e 마우스 이벤트
	 */
	const handleWheel = (e: React.WheelEvent) => {
		if (activeKey === '1') {
			if (!numPages1) return;

			if (e.deltaY > 0 && pageNumber1 < numPages1) {
				setPageNumber1(p => p + 1);
			} else if (e.deltaY < 0 && pageNumber1 > 1) {
				setPageNumber1(p => p - 1);
			}
		} else if (activeKey === '2') {
			if (!setNumPages2) return;

			if (e.deltaY > 0 && pageNumber2 < numPages2) {
				setPageNumber2(p => p + 1);
			} else if (e.deltaY < 0 && pageNumber2 > 1) {
				setPageNumber2(p => p - 1);
			}
		} else if (activeKey === '3') {
			if (!setNumPages3) return;

			if (e.deltaY > 0 && pageNumber3 < numPages3) {
				setPageNumber3(p => p + 1);
			} else if (e.deltaY < 0 && pageNumber3 > 1) {
				setPageNumber3(p => p - 1);
			}
		} else if (activeKey === '4') {
			if (!setNumPages4) return;

			if (e.deltaY > 0 && pageNumber4 < numPages4) {
				setPageNumber4(p => p + 1);
			} else if (e.deltaY < 0 && pageNumber4 > 1) {
				setPageNumber4(p => p - 1);
			}
		}
	};

	// TOP 버튼 구현
	const handleMoveTop = () => {
		activeWrapper?.scrollTo({
			top: 0,
		});

		if (activeKey === '1') {
			setPageNumber1(1);
		} else if (activeKey === '2') {
			setPageNumber2(1);
		} else if (activeKey === '3') {
			setPageNumber3(1);
		} else if (activeKey === '4') {
			setPageNumber4(1);
		}
	};

	/**
	 * ".pdf-viewer-wrapper" 활성화된 <div> 설정
	 * @param {any} e 이벤트
	 */
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		setActiveWrapper(e.currentTarget);
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		searchFileList();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="매뉴얼 조회" />
			<div className="pdf-viewer-fixed-tabs">
				<Tabs defaultActiveKey="1" activeKey={activeKey} onChange={key => setActiveKey(key)}>
					{commUtil.isNotEmpty(pdfUrl1Ref.current) && (
						<Tabs.TabPane tab={popUpParams?.progNm} key="1">
							<div
								className="pdf-viewer-wrapper"
								// onWheel={handleWheel}
								onScroll={handleScroll}
							>
								<Document
									file={pdfUrl1Ref.current}
									onLoadSuccess={({ numPages }) => setNumPages1(numPages)}
									loading={''}
									noData={''}
								>
									{Array.from(new Array(numPages1), (el, index) => (
										<Page key={`page_${index + 1}`} pageNumber={index + 1} scale={1} loading={''} noData={''} />
									))}
									{/* <Page pageNumber={pageNumber1} scale={1} loading={''} noData={''} /> */}
								</Document>
							</div>
						</Tabs.TabPane>
					)}

					{commUtil.isNotEmpty(pdfUrl2Ref.current) && (
						<Tabs.TabPane tab="공통기능" key="2">
							<div
								className="pdf-viewer-wrapper"
								// onWheel={handleWheel}
								onScroll={handleScroll}
							>
								<Document
									file={pdfUrl2Ref.current}
									onLoadSuccess={({ numPages }) => setNumPages2(numPages)}
									loading={''}
									noData={''}
								>
									{Array.from(new Array(numPages2), (el, index) => (
										<Page key={`page_${index + 1}`} pageNumber={index + 1} scale={1} loading={''} noData={''} />
									))}
									{/* <Page pageNumber={pageNumber2} scale={1} loading={''} noData={''} /> */}
								</Document>
							</div>
						</Tabs.TabPane>
					)}

					{commUtil.isNotEmpty(pdfUrl3Ref.current) && (
						<Tabs.TabPane tab="배송기사 App" key="3">
							<div
								className="pdf-viewer-wrapper"
								// onWheel={handleWheel}
								onScroll={handleScroll}
							>
								<Document
									file={pdfUrl3Ref.current}
									onLoadSuccess={({ numPages }) => setNumPages3(numPages)}
									loading={''}
									noData={''}
								>
									{Array.from(new Array(numPages3), (el, index) => (
										<Page key={`page_${index + 1}`} pageNumber={index + 1} scale={1} loading={''} noData={''} />
									))}
									{/* <Page pageNumber={pageNumber3} scale={1} loading={''} noData={''} /> */}
								</Document>
							</div>
						</Tabs.TabPane>
					)}

					{commUtil.isNotEmpty(pdfUrl4Ref.current) && (
						<Tabs.TabPane tab="물류센터 App" key="4">
							<div
								className="pdf-viewer-wrapper"
								// onWheel={handleWheel}
								onScroll={handleScroll}
							>
								<Document
									file={pdfUrl4Ref.current}
									onLoadSuccess={({ numPages }) => setNumPages4(numPages)}
									loading={''}
									noData={''}
								>
									{Array.from(new Array(numPages4), (el, index) => (
										<Page key={`page_${index + 1}`} pageNumber={index + 1} scale={1} loading={''} noData={''} />
									))}
									{/* <Page pageNumber={pageNumber4} scale={1} loading={''} noData={''} /> */}
								</Document>
							</div>
						</Tabs.TabPane>
					)}
				</Tabs>
			</div>
			<ButtonWrap data-props="single">
				{/* {activeKey === '1' && (
					<span>
						{pageNumber1} / {numPages1}
					</span>
				)}
				{activeKey === '2' && (
					<span>
						{pageNumber2} / {numPages2}
					</span>
				)}
				{activeKey === '3' && (
					<span>
						{pageNumber3} / {numPages3}
					</span>
				)}
				{activeKey === '4' && (
					<span>
						{pageNumber4} / {numPages4}
					</span>
				)} */}
				<Button id="btn_close" onClick={handleMoveTop}>
					처음으로
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmManualViewerPopup;
