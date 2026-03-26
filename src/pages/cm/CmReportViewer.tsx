/*
############################################################################
# FiledataField : CmReportViewer.tsx
# Description   : 레포트 팝업
# Author        : 김동한
# Since         : 25.07.21
############################################################################
*/
import reportUtil from '@/util/reportUtil';
import { forwardRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * =====================================================================
 *  01. 변수 선언부
 * =====================================================================
 */
// Crownix Viewer 글로벌 선언
declare global {
	interface Window {
		m2soft: any; // Crownix 라이브러리 전역 객체
	}
}

const { VITE_RD_BASE_URL } = import.meta.env; // RD 기본 URL

/**
 * =====================================================================
 *  02. 함수
 * =====================================================================
 */

/**
 * =====================================================================
 *  03. react hook event
 * =====================================================================
 */
// Crownix 리포트 뷰어 컴포넌트
const PopupReportViewer = forwardRef<HTMLDivElement>(ref => {
	// Redux store에서 report 관련 데이터 추출
	const { fileName, dataSet, params, title } = useSelector((state: any) => state.report);

	useEffect(() => {
		// 디버깅용 로그

		// Crownix Viewer 라이브러리 로드 확인
		if (window.m2soft && window.m2soft.crownix && window.m2soft.crownix.Viewer) {
			// Crownix Viewer 서비스 URL 설정
			let viewerUrl = '/report/ReportingServer/service';
			if (import.meta.env.MODE === 'localhost') {
				// 로컬 개발 환경일 경우 외부 서버 사용

				viewerUrl = VITE_RD_BASE_URL + viewerUrl;
			}

			// Crownix Viewer 인스턴스 생성
			const viewer = new window.m2soft.crownix.Viewer(viewerUrl, 'crownix-viewer');

			// 1. 업무 화면에서 전달받은 DataSet
			const inDataSet = dataSet && typeof dataSet === 'object' && !Array.isArray(dataSet) ? dataSet : {};

			// 2. 업무 화면에서 전달받은 파라미터
			const inPparams = params || '';

			// 3. DataSet를 XML로 변환
			const xml = reportUtil.makeRdXml(inDataSet);

			// 4. Crownix 명령어 파라미터 문자열 생성
			// 파라미터가 N 개인 경우(|로 구분)
			// params = 'INVOICE_TITLE1=납품서 (공급받는자용)';
			// params+= '|INVOICE_TITLE2=납품서 (공급받는자용)';
			// params 예시: 'INVOICE_TITLE1=납품서 (공급받는자용)|INVOICE_TITLE2=납품서 (공급받는자용)'
			const rvParam = reportUtil.makeRvParam(inPparams);

			// 5. Crownix Viewer에 XML 데이터 세팅
			viewer.setRData(xml);

			// 디버깅 로그

			// 메뉴얼 114 page 참고: hideToolbarItem 메서드로 툴바 항목 숨김
			// print_pdf 인쇄버튼
			viewer.hideToolbarItem(['save', 'print_pdf']);

			// 6. 리포트 파일 열기 (파라미터 포함)
			viewer.openFile(
				fileName,
				inPparams && inPparams.trim().length > 0 ? rvParam + ' /rxmlreportopt [0]' : '/rxmlreportopt [0]',
			);
		} else {
			// Crownix 라이브러리 미로드 시 에러 출력
		}
	}, [fileName, dataSet, params, title]);

	// 뷰어 렌더링 영역
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				border: '1px solid #ddd',
				borderRadius: 4,
				overflow: 'hidden',
				background: '#fff',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			{/* 헤더 영역: 리포트 제목 표시 */}
			<div
				style={{
					padding: '8px 12px',
					background: '#f5f5f5',
					borderBottom: '1px solid #eee',
					minHeight: 40,
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<strong style={{ fontSize: 16 }}>{title}</strong>
				{/* 닫기 버튼 등 필요시 추가 가능 */}
			</div>
			{/* Crownix Viewer 표시 영역 */}
			<div
				id="crownix-viewer"
				style={{
					flex: 1,
					minHeight: 0,
					background: '#fff',
				}}
			/>
		</div>
	);
});

export default PopupReportViewer;
