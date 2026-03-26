// CSS

// Lib
import { Button, Form, Tabs } from 'antd';
// Type
// Component
import axios from '@/api/Axios';
import { apiGetCarPositionHistoryInfo, apiGetMasterList as apiGetMasterList2 } from '@/api/tm/apiTmCarPositionHistory';
import { apiPostDetailList } from '@/api/wd/apiWdInvoiceDriver';
import { apiGetLoadReportInfo, apiGetMasterList } from '@/api/wd/apiWdLoad';
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CustomModal from '@/components/common/custom/CustomModal';
import { Datepicker, RadioBox, SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import WdInvoiceDrivePopup from '@/components/wd/invoiceDriver/WdInvoiceDriverPopup';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import commUtil from '@/util/commUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import dayjs from 'dayjs';
import { useState } from 'react';

const { TabPane } = Tabs;

// Util

// Store

// API
const { VITE_EDMS_IMG_URL } = import.meta.env; // EDMS 이미지 URL

const WdInvoiceDriver = (props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const globalVariable = useAppSelector(state => state.global.globalVariable);
	const gDccode = globalVariable?.gDccode;
	const dsAutodc = getCommonCodeList('AUTO_TM_DC');
	const [autodc, setAutodc] = useState(dsAutodc.find((item: any) => item.comCd === gDccode));
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const modalRef = useRef(null);
	const gridRef = useRef(null);
	const [expanded, setExpanded] = useState(false);
	const [gridData, setGridData] = useState([]);

	//검색영역 초기 세팅
	const now = dayjs();
	const hour18 = now.hour(18).minute(0).second(0);

	const [searchBox] = useState({
		gubun: '0',
		deliverydt: now.isSameOrAfter(hour18) ? now.add(1, 'day') : now,
		docdt: now.isSameOrAfter(hour18) ? now : now.add(-1, 'day'),
		// deliverydt: dayjs('20250301'),
		// carno: '강원80자2174',
		// carnoNm: '[강원80자2174] 김기천',
	});

	const radioOpt1 = [
		{
			// 월별
			label: t('미출력'),
			value: '0',
		},
		{
			// 일별
			label: t('출력'),
			value: '1',
		},
		{
			// 일별
			label: t('부분출력'),
			value: '2',
		},
	];
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	//납품서
	const printDetailList = async () => {
		const params = form.getFieldsValue();

		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		params.deliverydt = params.deliverydt.format('YYYYMMDD');

		const { data } = await apiPostDetailList(params);
		if (data.length < 1) {
			showAlert(null, t('msg.MSG_RPT_ERR_002')); // 데이터가 없습니다.
			return;
		}

		if (params.gubun == '2') {
			setGridData(data);
			modalRef.current.handlerOpen();
			return;
		}

		const dsDetailTemp = data.filter((item: any) => ['01', '04', '12'].includes(item.invoicetype));

		if (dsDetailTemp.length > 0) {
			setCreditSaveData(dsDetailTemp, data); // 여신정보 조회
		} else {
			showConfirm(null, t('msg.MSG_COM_CFM_023', ['인쇄']), () => {
				printDetailListImp(data);
			});
		}
	};

	//출고지
	const printDetailList2 = async () => {
		const params = form.getFieldsValue();
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		params.deliverydt = params.deliverydt.format('YYYYMMDD');
		params.fromSlipdt = params.deliverydt;
		params.toSlipdt = params.deliverydt;

		const { data } = await apiGetMasterList(params);
		if (data.length < 1) {
			showAlert(null, t('msg.MSG_RPT_ERR_002')); // 데이터가 없습니다.
			return;
		}

		searchLoadPrintInfo(data);
	};

	//차량운행일지
	const printDetailList3 = async () => {
		const params = form.getFieldsValue();
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		params.dccode = params.fixdccode;
		params.docdt = params.docdt.format('YYYYMMDD');
		params.fromDocdt = params.docdt;
		params.toDocdt = params.docdt;
		params.deliverydt = params.deliverydt.format('YYYYMMDD');
		params.fromSlipdt = params.deliverydt;
		params.toSlipdt = params.deliverydt;

		const { data } = await apiGetMasterList2(params);
		if (data.length < 1) {
			showAlert(null, t('msg.MSG_RPT_ERR_002')); // 데이터가 없습니다.
			return;
		}

		searchCarPositionHistoryPrintInfo(data);
	};

	//부분출력 팝업 내 출력
	const printDetailListPart = () => {
		const data = gridData;
		const toCustkey = gridRef.current.getCheckedRowItemsAll().map((item: any) => item.custkey);
		const dsDetailTemp = data.filter((item: any) => ['01', '04', '12'].includes(item.invoicetype));

		if (dsDetailTemp.length > 0) {
			setCreditSaveData(dsDetailTemp, data, toCustkey); // 여신정보 조회
		} else {
			showConfirm(null, t('msg.MSG_COM_CFM_023', ['인쇄']), () => {
				printDetailListImp(data, toCustkey);
			});
		}
		modalRef.current.handlerClose();
	};

	/**
	 * 차량운행일지 출력 데이터 조회 TmCarPositionHistory 2026-02-10 복사
	 * @param items
	 */
	const searchCarPositionHistoryPrintInfo = (items: any) => {
		//showConfirm(null, t('msg.MSG_COM_CFM_023', [t('lbl.PRINT')]), () => {
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			const params = {
				processtype: 'TM_DRIVEHISTORY',
				printMasterList: items,
			};

			apiGetCarPositionHistoryInfo(params).then(res => {
				// RD 레포트 xml
				// 1. 리포트 파일명
				const fileName = 'TM_DriveHistoryRP.mrd';

				// 2. 리포트에 XML 생성을 위한 DataSet 생성
				const dataSet = {
					ds_reportHeader: res.data.dsReportHeader,
					ds_reportDetail: res.data.dsReportDetail,
				};

				// // 3. 리포트에 전송할 파라미터
				const params: any = {
					TITLE: t('lbl.CARDELOVERYDOC'), // 차량운행일지
				};

				reportUtil.openAgentReportViewer(fileName, dataSet, params);
			});
		});
	};

	const closeModal = () => {
		modalRef.current.handlerClose();
	};

	/**
	 * 상차지시서 출력 데이터 조회 WdLoad 2026-02-10 복사
	 * @param items
	 */
	const searchLoadPrintInfo = (items: any) => {
		//showConfirm(null, t('msg.MSG_COM_CFM_023', [t('lbl.PRINT')]), () => {
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			const searchParam = form.getFieldsValue();
			const channelCdNm = getCommonCodebyCd('PUTAWAYTYPE', searchParam.channel)?.cdNm;

			const params = {
				processtype: 'WD_LOAD',
				dccode: searchParam.gDccode,
				organize: '',
				channel: '',
				channelnm: commUtil.isNotEmpty(channelCdNm) ? channelCdNm : t('lbl.ALL'),
				toCustkey: '',
				deliverygroup: '',
				searchtype: '0',
				searchgubun: '0',
				printMasterList: items,
			};

			apiGetLoadReportInfo(params).then(res => {
				// RD 레포트 xml
				// 1. 리포트 파일명
				let fileName = '';
				if (autodc && searchParam.searchgubun === '0') {
					fileName = 'WD_Load_Type_ver3.mrd';
				} else {
					fileName = 'WD_Load_Type_ver2.mrd';
				}

				// 2. 리포트에 XML 생성을 위한 DataSet 생성
				const dataSet = {
					ds_reportHeader: res.data.dsReportHeader,
					ds_reportMemo: res.data.dsReportMemo,
					ds_reportDetail: res.data.dsReportDetail,
				};

				// // 3. 리포트에 전송할 파라미터
				const params: any = {
					TITLE: t('lbl.LOADTASKDOC'), // 상차지시서
				};

				reportUtil.openAgentReportViewer(fileName, dataSet, params);
			});
		});
	};

	const setCreditSaveData = (dsDetailTemp: any, data: any, toCustkey?: Array<string>) => {
		const params = {
			saveDetailList: dsDetailTemp, // 선택된 행의 데이터
		};

		apiPostSaveData(params).then(res => {
			if (res.statusCode > -1) {
				printDetailListImp(data, toCustkey);
			}
		});
	};

	const printDetailListImp = (data: any, toCustkey?: Array<string>) => {
		const params = {
			avc_COMMAND: 'CREATION_DELIVERYFORM',
			invoiceprintkey: dateUtil.getToDay('YYYYMMDDHHMMss'),
			invoiceprinttype: 'TOTAL',
			gubun: commUtil.nvl(form.getFieldValue('gubun'), ''),
			saveDetailList: data,
			driverYn: 'Y',
			toCustkey: toCustkey?.toString(),
		};

		apiPostPrintDetailList(params).then(res => {
			if (res.statusCode > -1) {
				viewRdReport(res); // 리포트 뷰어 열기
			}
		});
	};

	/**
	 * 리포트 뷰어 열기 - 차량별 인쇄
	 * @param {any} res API 응답 데이터
	 */
	const viewRdReport = (res: any) => {
		if (!res.data.reportHeader || res.data.reportHeader.length < 1) {
			showAlert(null, t('msg.MSG_RPT_ERR_002')); // 데이터가 없습니다.
			return;
		}

		// 1. 리포트 파일명
		let fileName = 'WD_Invoice_NoAppr_ver8.mrd';
		if (form.getFieldValue('gubun') == '1') {
			fileName = 'WD_Invoice_NoAppr_ver7.mrd';
		}

		// 2. 리포트에 XML 생성을 위한 DataSet 생성
		const ds_file = res.data.reportFileList;
		const ds_crm = res.data.reportCrmCustdlv;
		const URL = `${VITE_EDMS_IMG_URL}/101/`;
		for (const idx in ds_file) {
			ds_file[idx].file1 = `${URL}${ds_file[idx].uploadResDocId}`;
		}
		for (const idx in ds_crm) {
			if (commUtil.isNotEmpty(ds_crm[idx].file12)) {
				const arr = ds_crm[idx].file12.split(',');
				for (const inIdx in arr) {
					ds_crm[idx][`file12_${inIdx + 1}`] = `${URL}${arr[inIdx]}`;
				}
			}
			if (commUtil.isNotEmpty(ds_crm[idx].file13)) {
				const arr = ds_crm[idx].file13.split(',');
				for (const inIdx in arr) {
					ds_crm[idx][`file13_${inIdx + 1}`] = `${URL}${arr[inIdx]}`;
				}
			}
			if (commUtil.isNotEmpty(ds_crm[idx].file14)) {
				const arr = ds_crm[idx].file14.split(',');
				for (const inIdx in arr) {
					ds_crm[idx][`file14_${inIdx + 1}`] = `${URL}${arr[inIdx]}`;
				}
			}
			if (commUtil.isNotEmpty(ds_crm[idx].file15)) {
				const arr = ds_crm[idx].file15.split(',');
				for (const inIdx in arr) {
					ds_crm[idx][`file15_${inIdx + 1}`] = `${URL}${arr[inIdx]}`;
				}
			}
			if (commUtil.isNotEmpty(ds_crm[idx].file16)) {
				const arr = ds_crm[idx].file16.split(',');
				for (const inIdx in arr) {
					ds_crm[idx][`file16_${inIdx + 1}`] = `${URL}${arr[inIdx]}`;
				}
			}
		}

		// 검수자용출력여부 Y 일때 납품서(공급받는자용)만 2장 출력
		const calcHeader: any = res.data.reportHeader.flatMap((item: any) =>
			item.doctype == 'WD' && item.inspectorprintyn === 'Y'
				? [
						{ ...item, copyYn: 'N' },
						{ ...item, copyYn: 'Y' },
				  ]
				: [{ ...item, copyYn: 'N' }],
		);

		//헤더 여러장인데 실착지가 곂칠경우 배송정보는 제일 앞장만 출력
		let prevKey: any = null;
		calcHeader.forEach((item: any) => {
			if (item.truthcustkey === prevKey) {
				delete item.truthcustkey;
			} else {
				prevKey = item.truthcustkey;
			}
		});
		const dataSet = {
			ds_reportHeader: calcHeader, // 헤더 정보
			ds_reportDetail: res.data.reportDetailList, // 상세 정보
			ds_reportCredit01: res.data.reportCredit.filter((item: any) => ['01'].includes(item.invoicetype)), // 크레딧 정보 01
			ds_reportCredit04: res.data.reportCredit.filter((item: any) => ['04'].includes(item.invoicetype)), // 크레딧 정보 02
			ds_reportCredit12: res.data.reportCredit.filter((item: any) => ['12'].includes(item.invoicetype)), // 크레딧 정보 12
			ds_reportDlvCost: res.data.reportDlvCost, // 배송비용
			ds_file, // 파일
			ds_crm, // crm
			//INVOICE_TITLE: doctype == 'RT' ? '반품납품서 (공급받는자용)' : '납품서 (공급받는자용)', // 문서유형에 따라 타이틀 변경
		};

		// 3. 리포트에 전송할 파라미터
		const params: any = {};
		const doctype = res.data.reportHeader[0].doctype; // 문서유형

		if (doctype === 'WD') {
			params.INVOICE_TITLE = '납품서 (공급받는자용)';
		} else if (doctype === 'RT') {
			params.INVOICE_TITLE = '반품납품서 (공급받는자용)';
		}

		reportUtil.openAgentReportViewer(fileName, dataSet, params);
	};

	/**
	 * 출력 - 납품서 정보 조회 ( 거래처별 인쇄 - 하단 그리드 ) API
	 * @param {any} params 등록 파라미터
	 * @returns {object} 성공여부 결과값
	 */
	const apiPostPrintDetailList = (params: any) => {
		return axios.post('/ltx/wd/wdInvoice/v1.0/printDetailList', params).then(res => res.data);
	};

	/**
	 * 여신정보를 현행화하는 처리 API
	 * @param {any} params 등록 파라미터
	 * @returns {object} 성공여부 결과값
	 */
	const apiPostSaveData = (params: any) => {
		return axios.post('/api/ms/creditInfoTotal/v1.0/saveData', params).then(res => res.data);
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={{}} authority="searchYn" isShowSearchFormButton={false} />
			<div className="wd-drive">
				<div className="info">
					<h2>차량번호 발행 버튼을 클릭하세요</h2>
					<p style={{ color: 'red' }}>미상차 및 결품건이 있을 경우 발행이 불가하오니 사전에 상차 내역을 확인하세요.</p>
				</div>
				<SearchFormResponsive form={form} initialValues={searchBox} initialExpanded={true}>
					<li style={{ gridColumn: 'span 4' }}>
						<span>
							<Datepicker label={'납품일자'} name={'deliverydt'} required />
							<Button type="default" onClick={printDetailList} className={'sp-mr-1'}>
								납품서
							</Button>
							<Button type="default" onClick={printDetailList2}>
								상차지시서
							</Button>
						</span>
					</li>
					<li style={{ gridColumn: 'span 4' }}>
						<CmCarSearch
							form={form}
							code="carno"
							name="carnoNm"
							label={t('lbl.CARNO')}
							selectionMode={'single'}
							required
						/>
					</li>
					<li style={{ gridColumn: 'span 4' }}>
						<RadioBox label={'배송정보출력'} options={radioOpt1} name={'gubun'} />
					</li>
					<li style={{ gridColumn: 'span 4' }}>
						<span>
							<Datepicker label={'운행일지'} name={'docdt'} required />
							<Button type="default" onClick={printDetailList3} className={'sp-mr-1'}>
								운행일지
							</Button>
						</span>
					</li>
				</SearchFormResponsive>
			</div>

			<CustomModal ref={modalRef} width="1400px">
				<WdInvoiceDrivePopup
					gridData={gridData}
					printDetailListPart={printDetailListPart}
					gridRef={gridRef}
					closeModal={closeModal}
				/>
			</CustomModal>
		</>
	);
};

export default WdInvoiceDriver;
