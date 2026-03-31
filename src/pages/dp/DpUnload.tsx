/*
 ############################################################################
 # FiledataField	: DpUnload.tsx
 # Description		: 입고 > 입고작업 > 입고하차관리
 # Author			: KimDongHyeon
 # Since			: 2025.07.28
 ############################################################################
*/
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import { apiPostDetailList, apiPostExcelList, apiPostMasterList } from '@/api/dp/apiDpUnload';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CmUserCdCfgPopup from '@/components/cm/popup/CmUserCdCfgPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import DpUnloadDetail from '@/components/dp/unload/DpUnloadDetail';
import DpUnloadSearch from '@/components/dp/unload/DpUnloadSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import dayjs from 'dayjs';

// Store

const DpUnload = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const coldCode = getCommonCodeList('LIMIT_COLD_TEMP')?.[0]?.comCd;
	const freezeCode = getCommonCodeList('LIMIT_FREEZE_TEMP')?.[0]?.comCd;
	const cold1 = Number(coldCode.split('-')[0]);
	const cold2 = Number(coldCode.split('-')[1]);
	const freeze1 = Number(freezeCode);
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);
	const modalRef1 = useRef(null);
	const modalRef2 = useRef(null);

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const gridRef1 = useRef<any>(null);
	const gridRef2 = useRef<any>(null);
	const gridRef3 = useRef<any>(null);
	const gridRef4 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridDataDetail, setGridDataDetail] = useState([]);
	const [gridDataCarLog, setGridDataCarLog] = useState([]);
	const [gridDataExcel1, setGridDataExcel1] = useState([]);
	const [gridDataExcel2, setGridDataExcel2] = useState([]);

	const [maxCnt, setMaxCnt] = useState(1);

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = useMemo(
		() => ({
			slipdt: dates,
		}),
		[],
	);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	const searchMasterList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		requestParams.unloadtimeFrom = requestParams.unloadtimeFrom?.replace(':', '');
		requestParams.unloadtimeTo = requestParams.unloadtimeTo?.replace(':', '');
		delete requestParams.slipdt;
		//joinfg 조건
		requestParams.joinfg =
			requestParams.tempoptiyn || requestParams.unloadtimeFrom || requestParams.unloadtimeTo ? 'Y' : 'N';
		requestParams.moveYn = requestParams.moveYn ? 'Y' : 'N';

		const { data } = await apiPostMasterList(requestParams);
		gridRef.current.clearGridData();
		gridRef1.current.clearGridData();
		gridRef2.current.clearGridData();
		setGridData(data || []);
	};

	const searchDetailList = async (rowData: any) => {
		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		requestParams.unloadtimeFrom = requestParams.unloadtimeFrom?.replace(':', '');
		requestParams.unloadtimeTo = requestParams.unloadtimeTo?.replace(':', '');
		delete requestParams.slipdt;
		//joinfg 조건
		requestParams.joinfg =
			requestParams.tempoptiyn == 'Y' || requestParams.unloadtimeFrom || requestParams.unloadtimeTo ? 'Y' : 'N';
		requestParams.moveYn = requestParams.moveYn ? 'Y' : 'N';

		const { data } = await apiPostDetailList({ ...requestParams, ...rowData });
		setGridDataCarLog(data.carLogList || []);
		setGridDataDetail(data.detailList || []);
		setMaxCnt(data.maxCnt || 1);
	};

	const searchExcelList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		requestParams.unloadtimeFrom = requestParams.unloadtimeFrom?.replace(':', '');
		requestParams.unloadtimeTo = requestParams.unloadtimeTo?.replace(':', '');
		delete requestParams.slipdt;
		//joinfg 조건
		requestParams.joinfg =
			requestParams.tempoptiyn == 'Y' || requestParams.unloadtimeFrom || requestParams.unloadtimeTo ? 'Y' : 'N';
		requestParams.skuYn = requestParams.skuYn ? 'Y' : 'N';
		requestParams.moveYn = requestParams.moveYn ? 'Y' : 'N';
		const res = await apiPostExcelList(requestParams);
		const { data } = res;
		if (!(res.error == undefined && data?.errorCode == undefined)) {
			return;
		}

		if (requestParams.skuYn === 'Y') {
			setGridDataExcel1(data || []);
		} else {
			setGridDataExcel2(data || []);
		}
	};

	const saveCarLog = async (requestParams: any) => {
		const changed = gridRef1.current.getChangedData({ validationYn: false, andCheckedYn: false });
		if (!changed || changed.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		//QR로그 미생성시 저장 불가
		const isNotQr = changed.some((el: any) => {
			return !el.deliverygroup;
		});
		if (isNotQr) {
			showAlert(null, t('입차(QR로그)후 에 저장 할 수 있습니다.'));
			return;
		}

		// const isEmptyTime = changed.some((el: any) => {
		// 	return !el.deliverytime;
		// });
		// if (isEmptyTime) {
		// 	showAlert(null, t('msg.requiredInput', ['하차검수시간']));
		// 	return;
		// }
		//
		// const isEmptyChannel = changed.some((el: any) => {
		// 	return !el.channel;
		// });
		// if (isEmptyChannel) {
		// 	showAlert(null, t('msg.requiredInput', ['저장유무']));
		// 	return;
		// }
		//
		// const isEmptytEmperature = changed.some((el: any) => {
		// 	return !String(el.temperature1) && !String(el.temperature2);
		// });
		// if (isEmptytEmperature) {
		// 	showAlert(null, t('msg.requiredInput', ['온도']));
		// 	return;
		// }

		gridRef1.current.showConfirmSave(async () => {
			const params = {
				apiUrl: '/api/dp/unload/v1.0/saveCarLog',
				avc_COMMAND: 'CONFIRMUNLOADCARLOG',
				saveDataList: changed.map((el: any, idx: number) => ({
					...el,
					deliverygroup: el.serialkey ? el.deliverygroup : maxCnt + idx,
					iuflag: el.serialkey ? 'U' : 'I', // serialkey가 있으면 수정, 없으면 추가
					carrierkey: el.carrierkey || 'STD',
					deliverytime: el.slipdt + el.deliverytime + '00', // deliverytime은 slipdt와 결합하여 YYYYMMDDHHmmSS 형식으로 변환
				})), // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	const closeEvent = () => {
		modalRef.current.handlerClose();
		searchDetailList(gridRef.current.getSelectedRows()[0]);
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		reset: () => {
			form.resetFields();
			gridRef.current.clearGridData();
			gridRef1.current.clearGridData();
			gridRef2.current.clearGridData();
		},
	};

	const openModal = () => {
		modalRef1.current.handlerOpen();
	};
	const openModal2 = () => {
		modalRef2.current.handlerOpen();
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive {...formProps}>
				<DpUnloadSearch {...formProps} />
			</SearchFormResponsive>

			<DpUnloadDetail
				gridData={gridData}
				gridDataCarLog={gridDataCarLog}
				gridDataDetail={gridDataDetail}
				gridDataExcel1={gridDataExcel1}
				gridDataExcel2={gridDataExcel2}
				searchDetailList={searchDetailList}
				searchExcelList={searchExcelList}
				saveCarLog={saveCarLog}
				gridRef={gridRef}
				gridRef1={gridRef1}
				gridRef2={gridRef2}
				gridRef3={gridRef3}
				gridRef4={gridRef4}
				openModal={openModal}
				openModal2={openModal2}
			/>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>

			<CustomModal ref={modalRef1} width="350px">
				<div className="tbl-view">
					<table>
						<thead>
							<tr>
								<th>저장조건</th>
								<th>적정온도</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="ta-c">
									<strong>냉장</strong>
								</td>
								<td className="ta-c">
									{cold1}℃ ~ {cold2}℃
								</td>
							</tr>
							<tr>
								<td className="ta-c">
									<strong>냉동</strong>
								</td>
								<td className="ta-c">{freeze1}℃ 이하</td>
							</tr>
						</tbody>
					</table>
				</div>
			</CustomModal>

			<CustomModal ref={modalRef2} width="800px">
				<CmUserCdCfgPopup codeType={'LIMIT_FREEZE_TEMP'} close={modalRef2?.current?.handlerClose} />
			</CustomModal>
		</>
	);
};

export default DpUnload;
