/*
############################################################################
# FiledataField : reportUtil.ts
# Description   : 레포트 관련 유틸리티.(추후 Email, Fax 관련 추가 예정)
# Author        : 김동한
# Since         : 25.07.23
############################################################################
*/
import store from '@/store/core/coreStore';
import { setReportParams } from '@/store/report/reportStore';
import i18next from 'i18next'; // i18next를 사용하여 다국어 처리

const { VITE_RD_BASE_URL } = import.meta.env; // RD 기본 URL

/**
 * Crownix 리포트 관련 유틸리티 클래스
 */
class reportUtil {
	static formatDateTime(): string {
		const d = new Date();
		const pad = (n: number) => String(n).padStart(2, '0');
		const yyyy = d.getFullYear();
		const mm = pad(d.getMonth() + 1);
		const dd = pad(d.getDate());
		const hh = pad(d.getHours());
		const min = pad(d.getMinutes());
		const ss = pad(d.getSeconds());
		return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
	}
	/*
	 * ClientAgentInvoker.invoke 호출을 공통 처리합니다.
	 * 에러 발생 시 사용자에게 Agent 설치(다운로드) 안내를 띄웁니다.
	 * options.downloadFileName 으로 파일명 커스터마이징 가능.
	 * @param invoker
	 * @param onError
	 */
	static checkInvoke(): Promise<boolean> {
		const releaseVersion = '8.2.2.76'; //window.m2soft?.crownix?.ClientAgentInvoker?.version || 'Unknown';
		const downloadFile = 'Crownix Client Agent 8.0u.exe';
		const downloadUrl = `${VITE_RD_BASE_URL}/report/ReportingServer/${encodeURIComponent(downloadFile)}`;

		return new Promise(resolve => {
			const invokerchk = new window.m2soft.crownix.ClientAgentInvoker('ws://localhost:8571/');
			invokerchk.addParameter('opcode', 'version');

			invokerchk.invoke(function (e: any) {
				try {
					// data는 JSON 문자열이므로 파싱하여 Message 추출
					const responseData = JSON.parse(e.data);
					const localAgentVersion = responseData?.Message.trim();
					//console.log('11111111111checkInvoke response ===> ', localAgentVersion);

					// 로컬 pc에 Agent 설치가 안되어 있거나, Agent가 실행되고 있지 않거나
					if (e?.type === 'error') {
						showConfirm(null, i18next.t('Agent가 실행되고 있지 않습니다. Agent 실행 확인 해 주세요'), () => {
							window.open(downloadUrl, '_blank');
						});
						//console.log('aaaaaaaaaaaaaaa');
						resolve(false);
					} else {
						// 버전 비교 체크
						if (releaseVersion !== localAgentVersion) {
							showConfirm(
								null,
								i18next.t(
									'새로운 버전' +
										releaseVersion +
										'의 Agent 패치되었습니다.다운로드 파일을 실행한 뒤 삭제 후 관리자권한으로 재설치 해주세요.',
								),
								() => {
									window.open(downloadUrl, '_blank');
								},
							);
							//console.log('bbbbbbbbbbbbbbbbb');
							resolve(false);
						} else {
							resolve(true);
						}
					}
				} catch (error) {
					showConfirm(
						null,
						i18next.t(
							'Crownix Agent Viewer가 설치되어 있지 않습니다.\n설치 파일을 다운로드 하시겠습니까?\n반드시 설치 시 관리자 권한으로 실행하세요.',
						),
						() => {
							window.open(downloadUrl, '_blank');
						},
					);
					//console.log('ccccccccccccc');
					resolve(false);
				}
			});
		});
	}
	/*
	 * XML 특수문자 변환 함수
	 * Crownix XML 생성 시 데이터 내 특수문자를 안전하게 변환합니다.
	 * - & → &amp;
	 * - < → &lt;
	 * - > → &gt;
	 * - " → &quot;
	 * - ' → &apos;
	 * - 공백 → &#32;
	 * @param str 변환할 값(문자열/숫자 등)
	 * @returns 변환된 XML 안전 문자열
	 */
	static toXmlSafe(str: any): string {
		if (typeof str !== 'string') str = String(str ?? '');
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;')
			.replace(/ /g, '&#32;');
	}

	/*
	 * DataSet 객체를 Crownix 라벨용 XML 포맷으로 변환하는 함수
	 * (dataset id, colinfo id 없이 record만 생성)
	 * @param params - DataSet 객체 (각 데이터셋 이름별 배열 또는 배열 자체)
	 * @returns Crownix 라벨용 XML 문자열
	 *
	 * - 루트 태그는 <ROOT>
	 * - 각 record는 <record> 태그로 감싸짐
	 * - 모든 필드는 대문자 태그로 변환되어 출력됨 (언더스코어 변환 없음)
	 * - 특수문자는 XML 안전 문자로 변환됨
	 * - 들여쓰기 적용
	 * - 예시:
	 *   <?xml version="1.0" encoding="utf-8" ?>
	 *   <ROOT>
	 *     <record>
	 *       <PRINTYN>1</PRINTYN>
	 *       <SKUNAME1>행복한콩&#32;부드러운찌개용두부</SKUNAME1>
	 *       ...
	 *     </record>
	 *   </ROOT>
	 */
	static makeLabelRdXml(params: Record<string, any[]>): string {
		if (!params) return '<?xml version="1.0" encoding="utf-8" ?>\n<ROOT>\n</ROOT>';
		let dataArr = Array.isArray(params) ? params : Object.values(params)[0];
		if (!Array.isArray(dataArr)) dataArr = [params];

		let records = '';
		dataArr.forEach(recordObj => {
			// 모든 필드를 태그로 출력 (주석 처리 없음)
			const xmlRecord = Object.entries(recordObj)
				.map(([k, v]) => {
					return `\t\t<${k.toUpperCase()}>${reportUtil.toXmlSafe(v)}</${k.toUpperCase()}>`;
				})
				.join('\n');

			records += `\t<record>\n${xmlRecord}\n\t</record>\n`;
		});

		return `<?xml version="1.0" encoding="utf-8" ?>\n<ROOT>\n${records}</ROOT>`;
	}

	/*
	 * DataSet 객체를 Crownix에서 요구하는 XML 포맷으로 변환하는 함수
	 * @param params - DataSet 객체 (각 데이터셋 이름별 배열)
	 * @returns XML 문자열
	 *
	 * 동작 설명:
	 * - params는 {ds_report: [{...}, {...}]} 형태의 객체여야 함
	 * - 루트 태그는 <root>
	 * - 각 데이터셋마다 <dataset id="데이터셋명"> 태그 생성
	 * - 첫 번째 레코드의 키를 기준으로 <colinfo> 태그(컬럼 정보) 자동 생성
	 *   - 타입은 값이 숫자면 DECIMAL, 아니면 STRING
	 * - 각 데이터 레코드는 <record> 태그로 감싸짐
	 * - 모든 필드는 대문자+언더스코어로 태그 변환됨 (예: custname1 → CUSTNAME1)
	 * - 값은 XML 특수문자 변환 처리됨
	 * - 최종 XML은 Crownix 서버에서 인쇄/미리보기용으로 사용
	 *
	 * 예시:
	 * <?xml version="1.0" encoding="euc-kr"?>
	 * <root>
	 *   <dataset id="ds_report">
	 *     <colinfo id="CUSTNAME1" size="256" summ="default" type="STRING"/>
	 *     <colinfo id="QTY" size="256" summ="default" type="DECIMAL"/>
	 *     ...
	 *     <record>
	 *       <CUSTNAME1>홍길동</CUSTNAME1>
	 *       <QTY>10</QTY>
	 *       ...
	 *     </record>
	 *     ...
	 *   </dataset>
	 * </root>
	 */
	static makeRdXml(params: Record<string, any[]>): string {
		let xml = '<?xml version="1.0" encoding="utf-8"?>\n<root>';
		Object.entries(params).forEach(([dsName, dataList]) => {
			if (!Array.isArray(dataList)) return;
			xml += `\n\t<dataset id="${dsName}">\n`;

			// 컬럼 정보 생성
			if (dataList.length > 0 && dataList[0]) {
				Object.keys(dataList[0]).forEach(key => {
					if (key === '_$uid') return; // _$UID 컬럼 제외
					//const sampleValue = dataList[0][key];
					// const isDecimal =
					// 	typeof sampleValue === 'number' ||
					// 	(typeof sampleValue === 'string' && /^[0-9]+(\.[0-9]+)?$/.test(sampleValue));
					//const type = isDecimal ? 'DECIMAL' : 'STRING';
					const type = 'STRING';
					xml += `\t\t<colinfo id="${key
						.replace(/([A-Z])/g, '_$1')
						.toUpperCase()}" size="256" summ="default" type="${type}"/>\n`;
				});
			}

			// 데이터 레코드 생성
			dataList.forEach(row => {
				if (row && typeof row === 'object') {
					xml += '\t\t<record>\n';
					Object.entries(row).forEach(([key, value]) => {
						if (key === '_$uid') return; // _$uid 태그 제외
						xml += `\t\t\t<${key.replace(/([A-Z])/g, '_$1').toUpperCase()}>${reportUtil.toXmlSafe(value)}</${key
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
	}

	/*
	 * Crownix 명령어 파라미터 문자열 생성 함수
	 * @param params - 파라미터 객체 (예: { KEY1: VAL1, KEY2: VAL2 })
	 * @returns Crownix 명령어 파라미터 문자열 (예: /rv KEY1[VAL1] KEY2[VAL2])
	 *
	 * 동작 설명:
	 * - params가 없거나 빈 객체면 빈 문자열 반환
	 * - params가 있으면 /rv로 시작하는 파라미터 문자열 생성
	 * - 각 키-값 쌍을 "KEY[VAL]" 형태로 이어붙임
	 * - 예: { TITLE: "테스트", PAGE: 1 } → "/rv TITLE[테스트] PAGE[1]"
	 * - Crownix 리포트 서버에 전달할 mrdParam 용도로 사용
	 */
	static makeRvParam(params?: Record<string, any>): string {
		let rvParam = '/rv';
		if (params && typeof params === 'object' && Object.keys(params).length > 0) {
			Object.entries(params).forEach(([key, value]) => {
				if (key && value !== undefined) {
					rvParam += ` ${key}[${value}]`;
				}
			});
		} else {
			rvParam = '';
		}
		return rvParam;
	}

	/*
	 * 리포트 뷰어(HTML5 Viewer) 팝업 열기 함수
	 * @param fileName - 리포트 파일명 (예: 'WD_Label_CJFWWD16.mrd')
	 * @param dataSet  - 리포트 데이터셋 (XML 변환 전 객체)
	 * @param params   - 리포트 파라미터 문자열 (예: '/rv TITLE[테스트]')
	 * @param title    - 리포트 제목 (팝업 타이틀)
	 */
	static openHtmlReportViewer(fileName: string, dataSet: any, params?: string, title?: string) {
		// 필수값 예외처리
		if (!fileName || typeof fileName !== 'string' || fileName.trim() === '') {
			// 파일명을 찾을 수 없습니다.
			showAlert(null, i18next.t('msg.MSG_RPT_ERR_001'));
			return;
		}
		if (!dataSet || typeof dataSet !== 'object' || Object.keys(dataSet).length === 0) {
			// 데이터를 찾을 수 없습니다.
			showAlert(null, i18next.t('msg.MSG_RPT_ERR_002'));
			return;
		}

		// 디버깅 로그

		// Redux store에 리포트 파라미터 저장
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

	/*
	 * 리포트 뷰어(Agent Viewer) 팝업 열기 함수
	 * @param fileName    - 리포트 파일명(필수)
	 * @param dataSet     - 리포트 데이터셋(필수)
	 * @param params      - 리포트 파라미터
	 * @param title       - 리포트 제목
	 */
	static async openAgentReportViewer(fileName: string, dataSet: any, params?: any, title?: string) {
		// 필수값 예외처리
		if (!fileName || typeof fileName !== 'string' || fileName.trim() === '') {
			// 파일명을 찾을 수 없습니다.
			showAlert(null, i18next.t('msg.MSG_RPT_ERR_001'));
			return;
		}
		if (!dataSet || typeof dataSet !== 'object' || Object.keys(dataSet).length === 0) {
			// 데이터를 찾을 수 없습니다.
			showAlert(null, i18next.t('msg.MSG_RPT_ERR_002'));
			return;
		}

		// 1. url 설정
		const reportUrl = `${VITE_RD_BASE_URL}/report/ReportingServer/mrd/${fileName}`;

		// 2. dataSet xml 변환
		const xml = reportUtil.makeRdXml(dataSet);

		// 3. 파라미터 문자열 생성
		// 파라미터가 N 개인 경우(|로 구분)
		// params = 'INVOICE_TITLE1=납품서 (공급받는자용)';
		// params+= '|INVOICE_TITLE2=납품서 (공급받는자용)';
		// params 예시: 'INVOICE_TITLE1=납품서 (공급받는자용)|INVOICE_TITLE2=납품서 (공급받는자용)'
		const rvParam = reportUtil.makeRvParam(params);

		// //console.log('openAgentReportViewer reportUrl ===> ', reportUrl);
		// //console.log('openAgentReportViewer rvParam ===> ', rvParam);
		// //console.log('openAgentReportViewer fileName ===> ', fileName);
		// //console.log('openAgentReportViewer dataSet ===> ', dataSet);
		// //console.log('openAgentReportViewer ===> ', xml);
		// 디버깅 로그

		// ClientAgentInvoker 인스턴스 생성 및 설정
		if (window.m2soft?.crownix?.ClientAgentInvoker) {
			// 1. 일반 레포트
			const result = await reportUtil.checkInvoke();
			if (!result) {
				return;
			}
			const invoker = new window.m2soft.crownix.ClientAgentInvoker('ws://localhost:8571/');

			invoker.setReadTimeout(30 * 1000);
			invoker.setConnectTimeout(30 * 1000);
			invoker.setStayConnection(false);
			invoker.setUseAliveCheck(false);

			invoker.addParameter('opcode', 'preview');
			invoker.addParameter('protocol', 'async');
			invoker.addParameter('mrdList', [
				{
					mrdPath: reportUrl,
					mrdParam: rvParam,
					// 파라미터 예시: "mrdParam": '/rv [TITLE=TEST] /rpaperlength [1000] /rpaperwidth [1000]',
					setRData: xml,
				},
			]);

			invoker.addParameter('previewOption', {
				width: 1200,
				height: 1000,
				title: title || 'ClientAgent',
				zoomRatio: 100,
			});

			invoker.invoke(function (e: any) {
				//console.log('invokerchk e?.type ===> ', e?.type);
				//console.log('checkInvoke response ===> ', e);
				if (e.type === 'error') {
					const downloadUrl = `${VITE_RD_BASE_URL}/report/ReportingServer/Crownix%20Client%20Agent%208.0u.exe`;
					showConfirm(null, i18next.t('msg.MSG_RPT_CFM_001'), () => {
						window.open(downloadUrl, '_blank');
					});
					return;
				}
			});
		} else {
			// "Crownix Agent Viewer가 설치되어 있지 않습니다.
			showAlert(null, i18next.t('Crownix Agent Viewer 실행에 실패했습니다. 설치 여부를 확인해주세요.'));
		}
	}

	static openRdToAttachFile(
		fileName: string,
		dataSet: any,
		params?: any,
		title?: string,
		makeFileName?: any,
		exe?: any,
	) {
		// 필수값 예외처리
		if (!fileName || typeof fileName !== 'string' || fileName.trim() === '') {
			// 파일명을 찾을 수 없습니다.
			showAlert(null, i18next.t('msg.MSG_RPT_ERR_001'));
			return;
		}
		if (!dataSet || typeof dataSet !== 'object' || Object.keys(dataSet).length === 0) {
			// 데이터를 찾을 수 없습니다.
			showAlert(null, i18next.t('msg.MSG_RPT_ERR_002'));
			return;
		}

		// 1. url 설정
		//const reportUrl = `${VITE_RD_BASE_URL}/report/ReportingServer/mrd/${fileName}`;
		const reportUrl = `/app/deploy/report/ReportingServer/mrd/${fileName}`;

		// 2. dataSet xml 변환
		const xml = reportUtil.makeRdXml(dataSet);

		// 3. 파라미터 문자열 생성
		// 파라미터가 N 개인 경우(|로 구분)
		// params = 'INVOICE_TITLE1=납품서 (공급받는자용)';
		// params+= '|INVOICE_TITLE2=납품서 (공급받는자용)';
		// params 예시: 'INVOICE_TITLE1=납품서 (공급받는자용)|INVOICE_TITLE2=납품서 (공급받는자용)'
		const rvParam = reportUtil.makeRvParam(params);

		// 디버깅 로그

		// ClientAgentInvoker 인스턴스 생성 및 설정
		if (window.m2soft?.crownix?.ReportingServerInvoker) {
			const invoker = new window.m2soft.crownix.ReportingServerInvoker(
				`${VITE_RD_BASE_URL}/report/ReportingServer/service`,
			);

			invoker.addParameter('opcode', '500');
			invoker.addParameter('protocol', 'async');
			// invoker.addParameter('mrdList', [
			// 	{
			// 		mrdPath: reportUrl,
			// 		mrdParam: rvParam,
			// 		// 파라미터 예시: "mrdParam": '/rv [TITLE=TEST] /rpaperlength [1000] /rpaperwidth [1000]',
			// 		setRData: xml,
			// 	},
			// ]);

			const dpiparam = '/rimagexdpi [300] /rimageydpi [300]';

			invoker.addParameter('mrd_path', reportUrl);
			//invoker.addParameter('mrd_param', params);
			invoker.addParameter('mrd_param', dpiparam);
			invoker.addParameter('mrd_data', xml);
			invoker.addParameter('export_name', makeFileName); // 파일명
			invoker.addParameter('export_type', exe); // 확장자
			invoker.addParameter('protocol', 'sync');
			invoker.invoke((response: any, xhr: any) => {
				try {
					// 컴포넌트에서 window.addEventListener('reportAgentResponse', (e) => ...) 로 수신 가능
					const event = new CustomEvent('reportAgentResponse', { detail: { response, xhr } });
					window.dispatchEvent(event);
				} catch (err) {
					// CustomEvent가 지원되지 않을 경우 전역에 폴백 저장
					// 컴포넌트는 (window as any).reportAgentResponse를 읽을 수 있음
					(window as any).reportAgentResponse = { response, xhr };
				}
				// 기본 로그
			});
		} else {
		}
	}

	/*
	 * Crownix 라벨 리포트 뷰어(Agent Viewer) 팝업 열기 함수
	 * @param fileName   - 리포트 파일명(필수)
	 * @param dataSet    - 리포트 데이터셋(필수, 라벨 데이터)
	 * @param params     - 리포트 파라미터 문자열 (예: 'KEY1=VAL1|KEY2=VAL2')
	 * @param labelId    - 라벨 코드(필수, 용지 크기 분기용)
	 * @param previewYn  - 미리보기 여부('Y'면 미리보기, 아니면 인쇄)
	 * @param count      - 인쇄매수(라벨 반복 개수)
	 */
	static async openLabelReportViewer(
		fileName: any[],
		dataSet: any[],
		labelId?: any[],
		isPriview = true,
		printDialog = false,
	) {
		// 배열 파라미터 예외처리
		if (!Array.isArray(fileName) || fileName.length === 0) {
			showAlert(null, i18next.t('msg.MSG_RPT_ERR_001'));
			return;
		}
		if (!Array.isArray(dataSet) || dataSet.length === 0) {
			showAlert(null, i18next.t('msg.MSG_RPT_ERR_002'));
			return;
		}
		/*
    if (!labelId || typeof labelId !== 'string' || labelId.trim() === '') {
      // 파일명을 찾을 수 없습니다.
      showAlert(null, i18next.t('msg.MSG_RPT_ERR_001'));
      return;
    }
      */

		// // 1. url 설정
		// const reportUrl = `${VITE_RD_BASE_URL}/report/ReportingServer/mrd/label/${fileName}`;

		// // 2. dataSet xml 변환
		// const xml = reportUtil.makeLabelRdXml(dataSet);

		// // 일반 용지 사이즈만 배열로 담는다.
		// const labelList = [
		//   'CJFWWD13', 'CJFWWD15', 'CJFWWD11', 'CJFWWD20',
		//   'CJFWWD18', 'CJFWWD16', 'CJFWDP3', 'CJFWDP2'
		// ];

		// let param = '';
		// if (labelList.includes(labelId)) {
		//   param = '/rpaperlength [1000] /rpaperwidth [1000]'
		// } else {
		//   param = '/rpaperlength [1000] /rpaperwidth [1650]'
		// }

		// ...existing code...
		const mrdList = fileName
			.map((fn, idx) => {
				const ds = dataSet[idx] ?? dataSet[dataSet.length - 1];
				// 배열이 아니거나 0개면 undefined 반환
				if (!Array.isArray(ds) || ds.length === 0) return undefined;
				const lid = Array.isArray(labelId) ? labelId[idx] : labelId;
				const reportUrl = `${VITE_RD_BASE_URL}/report/ReportingServer/mrd/label/${fn}`;
				const xml = Array.isArray(ds) ? reportUtil.makeLabelRdXml({ data: ds }) : reportUtil.makeLabelRdXml(ds);

				const labelList = [
					// 기존
					'CJFWWD11', // 배송분류표라벨(축육)_개선_20220401
					'CJFWWD13', // 배송분류표라벨(동탄축육)_개선_20220401
					'CJFWWD15', // 배송분류표라벨(양산전용)_개선_20220927
					'CJFWWD16', // 배송분류표라벨(하나로마트전용)_20230620 : 출고 > 출고작업 > 배송라벨출력(하나로엑셀)
					'CJFWWD18', // 배송분류표라벨(쿠팡전용)_20230914
					'CJFWWD20', // 배송분류표라벨(통합)_20241226 : 출고 > 출고작업 > 배송라벨출력
					// 신규
					'CJFWWD21', // 배송분류표라벨(통합)_신규_일반 : 출고 > 출고작업 > 배송라벨출력(엑셀)
					'CJFWWD22', // 배송분류표라벨(통합)_신규_축육 : 출고 > 출고작업 > 이력배송라벨출력
				];
				// 긴라벨
				const labelListLong = [
					// 신규
					'CJFWMS1', // 로케이션바코드 출력 (QR)
					'CJFWMS2', // 로케이션바코드 출력 (바코드)
					'CJFWDP2', // 입고라벨(축육)
					'CJFWDP3', // 입고라벨(소)
				];
				// 긴라벨 (세로)
				const labelListLongVertical = [
					// 기존
					'CJFWDP1', // 입고라벨(대)
					// 신규
					'CJFWST1', // 재고라벨출력(대)
					'CJFWWD23', // 피킹작업지시_진행현황탭 (PLT 바코드 출력)
					,
					'CJFWMS3', // P-BOX 등록_배부_현황 (QR 출력)
					,
					'CJFWWD23', // 피킹작업지시_진행현황탭 (PLT 바코드 출력)
					,
					'CJFWWD24', // 피킹작업지시_진행현황탭 (QR  출력)
				];

				// 긴라벨(세로) - 택배전용
				const labelListLongVerticalDeliveryLabel = [
					'CJFWWD25', // 택배
				];

				let param = '';
				if (labelList.includes(lid)) {
					//param = '/rpaperlength [1000] /rpaperwidth [1000] /rpdrv [ZDesigner_2]';
					param = '/rpaperlength [1000] /rpaperwidth [1000]';
				} else if (labelListLong.includes(lid)) {
					//param = '/rpaperlength [1700] /rpaperwidth [1000] /rpdrv [ZDesigner_2]';
					param = '/rpaperlength [1700] /rpaperwidth [1000]';
				} else if (labelListLongVertical.includes(lid)) {
					//param = '/rsetpageinfo [2] /rpaperlength [1700] /rpaperwidth [1000] /rpdrv [ZDesigner_2]';
					param = '/rsetpageinfo [2] /rpaperlength [1700] /rpaperwidth [1000]';
				} else if (labelListLongVerticalDeliveryLabel.includes(lid)) {
					//param = '/rsetpageinfo [2] /rpaperlength [1700] /rpaperwidth [1000] /rpdrv [ZDesigner_2]';
					param = '/rsetpageinfo [2] /rpaperlength [1250] /rpaperwidth [1000]';
				} else {
					// 기본값 또는 에러 처리
					//param = '/rpaperlength [1000] /rpaperwidth [1000] /rpdrv [ZDesigner_2]';
					param = '/rpaperlength [1000] /rpaperwidth [1000]';
				}
				//const paramDefault = '/rpbarcodeimage [1] /rsppage [10] /rpdrv [ZDesigner ZT411-203dpi ZPL]'; // 프린터명 직접 지정 예시

				let paramDefault = '/rpbarcodeimage [1] /rsppage [10]';
				if (printDialog) {
					paramDefault = '/rpbarcodeimage [1] /rsppage [10] /rprndlgtype [1]'; // /rprndlgtype [1] : 프린트 다이얼로그 바로 출력, [2] : 프린트 다이얼로그 숨김
				}
				////console.log('paramDefault ===> ', paramDefault);
				param = paramDefault + ' ' + param;

				// //console.log('openAgentReportViewer reportUrl ===> ', reportUrl);
				// //console.log('openAgentReportViewer fileName ===> ', fileName);
				//// //console.log('openAgentReportViewer dataSet ===> ', dataSet);
				// //console.log('xml ===> ', xml);

				return {
					mrdPath: reportUrl,
					mrdParam: param,
					setRData: xml,
				};
			})
			.filter(Boolean); // undefined 제거		// ClientAgentInvoker 인스턴스 생성 및 설정
		if (window.m2soft?.crownix?.ClientAgentInvoker) {
			// 2. 라벨지
			const result = await reportUtil.checkInvoke();
			//console.log('22222222222222222result->' + result);
			if (!result) {
				return;
			}
			const invoker = new window.m2soft.crownix.ClientAgentInvoker('ws://localhost:8571/');

			invoker.setReadTimeout(30 * 1000);
			invoker.setConnectTimeout(30 * 1000);
			invoker.setStayConnection(false);
			invoker.setUseAliveCheck(false);

			let opcode = 'print'; // print or preview

			if (isPriview) {
				opcode = 'preview'; // 바로출력
			}

			invoker.addParameter('opcode', opcode); // 미리보기
			//invoker.addParameter('opcode', 'print'); // 바로인쇄
			//invoker.addParameter('opcode', 'api'); // 바로인쇄
			//invoker.addParameter('apiList', [{ api: 'CMprint', args: '' }]);
			invoker.addParameter('protocol', 'async');
			invoker.addParameter('mrdList', mrdList);

			if (isPriview) {
				invoker.addParameter('previewOption', {
					width: 1200,
					height: 1000,
					title: 'ClientAgent',
					zoomRatio: 100,
				});
			} else {
				//console.log('333333333333333333333333->');

				//바로인쇄 옵션 설정
				invoker.addParameter('prnOptionList', [
					{
						PrnDrvName: '',
						Copy: '1',
						PageRange: '',
						TrayName: '',
						TrayIndex: '',
						OneBook: '0',
						PrnPageList: '',
						//PrintDialog: 'false', // true: 프린트 다이얼로그 표시, false: 표시 안함
						PrintDialog: printDialog, // true: 프린트 다이얼로그 표시, false: 표시 안함
						PrintDialogSimple: 'false',
						PrintDialogSimple_MaxCopy: '10',
					},
				]);
			}

			//console.log('44444444444444444444444444444->');
			invoker.invoke(function (e: any) {
				//console.log('5555555555555555555555555555555555->');
				//console.log('55555555invokerchk e?.type ===> ', e?.type);
				//console.log('55555555555checkInvoke response ===> ', e);
				if (e.type === 'error') {
					const downloadUrl = `${VITE_RD_BASE_URL}/report/ReportingServer/Crownix%20Client%20Agent%208.0u.exe`;
					showConfirm(null, i18next.t('msg.MSG_RPT_CFM_001'), () => {
						window.open(downloadUrl, '_blank');
					});
					return;
				}
			});
		} else {
		}
	}
}

export default reportUtil;
