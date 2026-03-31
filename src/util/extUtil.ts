/**
 * 유틸 : 유틸 > extUtil
 * @module util/extUtil
 * @author canalFrame <canalframe@cj.net>
 * @since 1.0.0
 */
import React from 'react';

import { apiGetSSOTicket } from '@/api/cm/apiCmExt';

const { VITE_EDMS_URL, VITE_WD_DELIVERY_TRACKING_URL, VITE_APPROVAL_URL } = import.meta.env; // EDMS URL

class extUtil extends React.Component {
	/**
	 * 택배 운송장 추적 사이트 열기
	 * @param {any} params 파라미터
	 */
	static openWdTrackingDelivery(params: any) {
		extUtil.openWindowAndGet(`${VITE_WD_DELIVERY_TRACKING_URL}`, params);
	}

	/**
	 * EDMS 사이트 열기
	 * @param {any} params 파라미터
	 */
	static openEdms(params: any) {
		extUtil.openWindowAndPost(`${VITE_EDMS_URL}`, params);
	}

	/**
	 * 전자결재 사이트 열기
	 * @param {any} params 파라미터
	 */
	static openApproval(params: any) {
		if (commUtil.isEmpty(params.OTU_ID)) {
			apiGetSSOTicket().then((result: any) => {
				if (result.statusCode === 0) {
					params['OTU_ID'] = result.data;
					extUtil.openWindowAndPost(`${VITE_APPROVAL_URL}`, params, { width: 400, height: 400 });
				}
			});
		} else {
			extUtil.openWindowAndPost(`${VITE_APPROVAL_URL}`, params, { width: 400, height: 400 });
		}
		// const urlParams = new URLSearchParams(params);
		// const queryString = urlParams.toString();
		// window.open(`${VITE_APPROVAL_URL}?${queryString}`, '_blank');
	}

	/**
	 * POST 방식으로 팝업창 열기
	 * @param {any} url 타겟 URL
	 * @param {any} params 파라미터
	 * @param {any} options 옵션
	 */
	static openWindowAndPost = (url: any, params: any, options?: any) => {
		const width = options?.width ?? 1200;
		const height = options?.height ?? 900;
		const left = window.screenX + (window.outerWidth - width) / 2;
		const top = window.screenY + (window.outerHeight - height) / 2;
		const windowFeatures = `width=${width},height=${height},left=${left},top=${top},popup=yes`;
		const newWindow = window.open('', 'EDMS', windowFeatures);

		if (newWindow) {
			const form = document.createElement('form');
			form.method = 'POST';
			form.action = url;
			form.target = 'EDMS';

			Object.keys(params).forEach(key => {
				const input = document.createElement('input');
				input.type = 'hidden';
				input.name = key;
				input.value = params[key];
				form.appendChild(input);
			});

			newWindow.document.body.appendChild(form);
			form.submit();
		} else {
			showAlert('', '[팝업 차단]을 해제해주세요.');
		}
	};

	/**
	 * GET 방식으로 팝업창 열기
	 * @param {any} url 타겟 URL
	 * @param {any} params 파라미터
	 * @param {any} options 옵션
	 */
	static openWindowAndGet = (url: any, params: any, options?: any) => {
		const width = options?.width ?? 1200;
		const height = options?.height ?? 900;
		const left = window.screenX + (window.outerWidth - width) / 2;
		const top = window.screenY + (window.outerHeight - height) / 2;
		const windowFeatures = `width=${width},height=${height},left=${left},top=${top},popup=yes`;

		// URL에 쿼리 파라미터 추가
		const queryString = new URLSearchParams(params).toString();
		const fullUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;

		const newWindow = window.open(fullUrl, 'GET_WINDOW', windowFeatures);

		if (!newWindow) {
			showAlert('', '[팝업 차단]을 해제해주세요.');
		}
	};

	/**
	 * 리포트 뷰어 열기
	 * @param {string} fileName 파일명
	 * @param {any} dataSet 데이터셋
	 * @param {string} params 파라미터
	 * @param {string} title 제목
	 */
	/*
	static openReportViewer = (fileName: string, dataSet: any, params?: string, title?: string) => {





		
		// store에 값 저장
		store.dispatch(setReportParams({ fileName, dataSet, params, title }));

		// 팝업 오픈 (GET/POST 불필요, 단순 window.open)
		const reportViewerUrl = '/cm/CmReportViewer?window=open';
		const width = 1200;
		const height = 900;
		const left = window.screenX + (window.outerWidth - width) / 2;
		const top = window.screenY + (window.outerHeight - height) / 2;
		const windowFeatures = `width=${width},height=${height},left=${left},top=${top},popup=yes`;
		window.open(reportViewerUrl, 'ReportViewer', windowFeatures);

	}
		*/
}

export default extUtil;
