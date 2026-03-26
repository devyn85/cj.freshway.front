/*
 ############################################################################
 # FiledataField	: DpReceiptBox.tsx
 # Description		: 입고 > 입고작업 > 입고확정처리(수원3층)
 # Author			: KimDongHyeon
 # Since			: 2025.09.08
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
import { apiGetBillYn } from '@/api/dp/apiDpReceipt';
import {
	apiPostDetailList,
	apiPostExcelList,
	apiPostMasterList,
	apiPostMaxStockId,
	apiPostPrintList,
} from '@/api/dp/apiDpReceiptBox';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import DpReceiptBoxDetail from '@/components/dp/receiptBox/DpReceiptBoxDetail';
import DpReceiptBoxSearch from '@/components/dp/receiptBox/DpReceiptBoxSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import commUtil from '@/util/commUtil';
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import reportUtil from '@/util/reportUtil';
import dayjs from 'dayjs';

// Store

const DpReceiptBox = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const BILL_YN_DP_WD = getCommonCodeList('BILL_YN_DP_WD');
	const WMS_MNG_DC_LIST = getCommonCodeList('WMS_MNG_DC');
	const expCodeList = getCommonCodeList('EXPIRATION_DATE_DP');
	const expCodeListMap = expCodeList.map((item: any) => {
		const [storagetype, start, end, rate] = item.comCd.split('_');
		return {
			cdNm: item.cdNm,
			storagetype,
			start,
			end,
			rate,
		};
	});
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);
	const modalRef1 = useRef(null);
	const modalRef2 = useRef(null);

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const gridRef1 = useRef<any>(null);
	const gridRef2 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();
	const [form1] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]); //todo 오늘날짜

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridDataDetail, setGridDataDetail] = useState([]);
	const [gridDataExcel, setGridDataExcel] = useState([]);

	const [activeKey, setActiveKey] = useState('1');
	const activeKeyRef = useRef(activeKey);

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
	 *  02. 함수
	 * =====================================================================
	 * @param item
	 * @param items
	 */
	//공통코드 nDdayCnt
	const isDpValid = (items: any) => {
		const isNotValid = items.some((item: any) => {
			const { channel, dccode, stoFlag, confirmqtyWd, confirmqty, slipdt } = item;
			const diffDay = dayjs(item.slipdt).diff(dayjs(), 'day');
			const findCnt =
				WMS_MNG_DC_LIST.find((code: any) => {
					return code.comCd == item.dccode;
				})?.data1 || 0;

			if (['2', '3'].includes(channel) && diffDay >= parseInt(findCnt)) {
				if (findCnt == '0') {
					showAlert('', '당일 이후 입고건은 처리 할 수 없습니다.');
				} else {
					showAlert('', `D ${findCnt}일 이후 일자의 입고건은 처리 할 수 없습니다.`);
				}
				return true;
			}
		});
		return !isNotValid;
	};

	const searchMasterList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		// 날짜 check
		const dateDifference = slipdtTo.diff(slipdtFrom, 'days') + 1;
		if (dateDifference > 31) {
			showAlert(null, t('msg.MSG_IB_TIRD_PARTY_MAST_001', [dateDifference]));
			return;
		}

		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		requestParams.crossyn = requestParams.crossyn ? 'Y' : 'N';
		delete requestParams.slipdt;

		const { data } = await apiPostMasterList(requestParams);
		setGridData(data || []);
	};

	const searchExcelList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		// 날짜 check
		const dateDifference = slipdtTo.diff(slipdtFrom, 'days') + 1;
		if (dateDifference > 31) {
			showAlert(null, t('msg.MSG_IB_TIRD_PARTY_MAST_001', [dateDifference]));
			return;
		}

		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		requestParams.crossyn = requestParams.crossyn ? 'Y' : 'N';
		delete requestParams.slipdt;

		const { data } = await apiPostExcelList(requestParams);

		setGridDataExcel(data || []);
	};

	const searchDetailList = async (rowData: any) => {
		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		// 날짜 check
		const dateDifference = slipdtTo.diff(slipdtFrom, 'days') + 1;
		if (dateDifference > 31) {
			showAlert(null, t('msg.MSG_IB_TIRD_PARTY_MAST_001', [dateDifference]));
			return;
		}

		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		requestParams.crossyn = requestParams.crossyn ? 'Y' : 'N';
		delete requestParams.slipdt;

		const { data } = await apiPostDetailList({ ...requestParams, ...rowData });
		setGridDataDetail(data || []);
	};

	const closeEvent = () => {
		modalRef.current.handlerClose();
		searchMasterList();
		gridRef1.current.clearGridData();
	};

	const closeEvent2 = () => {
		modalRef2.current.handlerClose();
		searchMasterList();
	};

	const openModal = () => {
		modalRef1.current.handlerOpen();
	};

	const closeModal = () => {
		modalRef1.current.handlerClose();
	};

	//선택적용
	const applyReason = () => {
		const checkedItems = gridRef1.current.getCheckedRowItemsAll();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		const { reasonCode, reasonMsg } = form1.getFieldsValue() || {};
		gridRef1.current.updateRowsById(
			checkedItems.map((item: any) => ({
				...item,
				reasoncode: reasonCode,
				reasonmsg: reasonMsg,
			})),
		);
	};

	//예외저장
	const saveExcept = async () => {
		const checkedItems = gridRef1.current
			.getChangedData({ validationYn: false, andCheckedYn: false })
			.filter((item: any) => item.rowStatus === 'U');

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		gridRef1.current.showConfirmSave(async () => {
			const params = {
				apiUrl: '/api/dp/skuLabel/v1.0/saveDpSkuLabel',
				saveDataList: checkedItems,
			};

			setLoopTrParams(params);
			modalRef2.current.handlerOpen();
		});
	};

	//저장
	const saveDpReceiptBoxMaster = async () => {
		const checkedItems = gridRef.current.getCheckedRowItems();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		if (!isDpValid(checkedItems.map((item: any) => item.item))) {
			return;
		}

		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		requestParams.crossyn = requestParams.crossyn ? 'Y' : 'N';
		requestParams.ordertype = requestParams?.ordertype?.join(',');
		delete requestParams.slipdt;

		showConfirm(null, t('msg.confirmSave'), async () => {
			const params = {
				...requestParams,
				apiUrl: '/api/dp/receiptBox/v1.0/saveMaster',
				avc_COMMAND: 'BATCHCONFIRM',
				saveDataList: checkedItems.map((item: any) => item.item),
				dataKey: 'saveMasterList',
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	//대상확정
	const saveDpReceiptBoxDetail = async () => {
		const checkedItems = gridRef1.current.getCheckedRowItems();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		if (!isDpValid(checkedItems.map((item: any) => item.item))) {
			return;
		}

		//수량확인
		const isValidQty = checkedItems.some((item: any) => {
			const { orderqty, confirmqty, shortageqty, tranqty, shortagetranqty } =
				gridRef1.current.getGridData()[item.rowIndex];
			return orderqty - confirmqty - shortageqty - tranqty - shortagetranqty < 0;
		});
		if (isValidQty) {
			showAlert(null, t('입고 / 결품 가능량보다 많은 수량을 입력 하셨습니다.'));
			return;
		}

		// 잔여율 확인
		const isRateInvalid = checkedItems.some((item: any) => {
			return !commUtil.isDpPossible(item.item, expCodeListMap);
		});
		//표준센터이동 체크 X
		if (gridRef.current.getSelectedRows()[0].ordertype != 'ZUB' && isRateInvalid) {
			showAlert(null, t('소비기한임박율이 미만입니다.'));
			return;
		}

		//발행확인 BILL_YN_DP_WD Y일때만 체크
		if (BILL_YN_DP_WD?.[0]?.comCd == 'Y') {
			for (let i = 0; i < checkedItems.length; i++) {
				const params = {
					docno: checkedItems[i].item.docno,
					docline: checkedItems[i].item.docline,
					deliverydate: checkedItems[i].item.slipdt,
				};

				const res2 = await apiGetBillYn(params);
				if (res2.data.zbillyn === 'Y') {
					showAlert(null, '세금계산서가 발행되었습니다'); //
					return false;
				}
			}
		}

		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		requestParams.crossyn = requestParams.crossyn ? 'Y' : 'N';
		requestParams.ordertype = requestParams?.ordertype?.join(',');
		delete requestParams.slipdt;

		gridRef1.current.showConfirmSave(async () => {
			const params = {
				...requestParams,
				apiUrl: '/api/dp/receiptBox/v1.0/saveDetail',
				avc_COMMAND: 'CONFIRM_BOX',
				saveDataList: checkedItems.map((item: any) => item.item),
			};

			setLoopTrParams(params);
			modalRef2.current.handlerOpen();
		});
	};

	//방단적용
	const savePlt = async () => {
		const checkedItems = gridRef1.current.getCheckedRowItemsAll();
		const custkey = gridRef.current.getSelectedRows()[0].fromCustkey;

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noSelect'));
			return;
		}

		//필수체크
		const isEmpty = checkedItems.some(
			(item: any) => commUtil.isEmpty(item.boxperlayer) || commUtil.isEmpty(item.layerperplt),
		);
		if (isEmpty) {
			showAlert(null, t('msg.required', ['PLT(방), PLT(단)']));
			return;
		}

		gridRef1.current.showConfirmSave(async () => {
			const params = {
				apiUrl: '/api/dp/receipt/v1.0/saveBoxPlt',
				saveDataList: checkedItems.map((item: any) => ({ ...item, custkey })),
			};

			setLoopTrParams(params);
			modalRef2.current.handlerOpen();
		});
	};

	//수량적용
	const applyQty = () => {
		const checkedItems = gridRef1.current.getCheckedRowItemsAll();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}
		gridRef1.current.updateRowsById(
			checkedItems.map((item: any) => {
				const { orderqtyBox, orderqtyEa, confirmqtyBox, confirmqtyEa, shortageqtyBox, shortageqtyEa } = item;
				return {
					...item,
					tranqtyBox: parseFloat(orderqtyBox) - parseFloat(confirmqtyBox) - parseFloat(shortageqtyBox),
					tranqtyEa: parseFloat(orderqtyEa) - parseFloat(confirmqtyEa) - parseFloat(shortageqtyEa),
				};
			}),
		);
	};

	//PLT ID 자동부여
	const applyPlt = async () => {
		const checkedItems = gridRef1.current.getCheckedRowItems();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		if (checkedItems.length > 1) {
			showAlert(null, t('PLT ID 자동부여는 다중으로 처리할 수 없습니다. 한개만 선택해 주세요'));
			return;
		}
		const checkedItem = checkedItems[0];
		const { rowIndex } = checkedItem;
		const { dccode, orderqtyBox, orderqtyEa } = checkedItem.item;
		const formData = {
			dccode,
		};
		const { data } = await apiPostMaxStockId(formData);
		const maxStockId = parseInt(data);
		if (!maxStockId) {
			return;
		}

		//첫행수정
		for (let i = 0; i < orderqtyBox; i++) {
			if (i == 0) {
				gridRef1.current.setCellValue(rowIndex, 'tranqtyBox', 1);
				gridRef1.current.setCellValue(rowIndex, 'pltid', `D${commUtil.padNumber(data + i, 6)}`);
				continue;
			}
			gridRef1.current.addRow(
				{
					...checkedItem.item,
					tranqtyBox: 1,
					pltid: `D${commUtil.padNumber(data + i, 6)}`,
				},
				rowIndex + i,
			);
		}
		if (orderqtyEa > 0) {
			//ea만있으면 수정
			if (orderqtyBox == 0) {
				gridRef1.current.setCellValue(rowIndex, 'tranqtyEa', orderqtyEa);
				gridRef1.current.setCellValue(rowIndex, 'pltid', `D${commUtil.padNumber(data, 6)}`);
				return;
			}
			gridRef1.current.addRow(
				{
					...checkedItem.item,
					tranqtyEa: orderqtyEa,
					pltid: `D${commUtil.padNumber(data + orderqtyBox, 6)}`,
				},
				rowIndex + parseInt(orderqtyBox),
			);
		}
	};

	// 인쇄
	const printDetailList = () => {
		if (gridRef1.current?.getCheckedRowItemsAll().length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		//showConfirm(null, t('msg.MSG_COM_CFM_023', ['인쇄']), async () => {
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			const requestParams = form.getFieldsValue();
			const [slipdtFrom, slipdtTo] = requestParams.slipdt;
			requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
			requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
			requestParams.crossyn = requestParams.crossyn ? 'Y' : 'N';
			delete requestParams.slipdt;
			const slipnos = gridRef1.current
				?.getCheckedRowItemsAll()
				.map((row: any) => row.slipno)
				.join(',');
			requestParams.slipno = slipnos;

			const res = await apiPostPrintList(requestParams);
			const { data } = res;
			if (res.error == undefined && data?.errorCode == undefined) {
				// 2. 리포트에 XML 생성을 위한 DataSet 생성
				const dataSet = {
					ds_report: data,
				};

				// 3. 리포트에 전송할 파라미터
				const params: any = {};
				// params.INVOICE_TITLE = '저장품 입고예정 현황';

				reportUtil.openAgentReportViewer('DP_Receipt.mrd', dataSet, params);
			}
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		reset: () => {
			form.resetFields();
			gridRef.current.clearGridData();
			gridRef1.current.clearGridData();
		},
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
		activeKey,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<DpReceiptBoxSearch {...formProps} />
			</SearchFormResponsive>

			<DpReceiptBoxDetail
				form1={form1}
				isShow={activeKey == '1'}
				gridRef={gridRef}
				gridRef1={gridRef1}
				gridRef2={gridRef2}
				gridData={gridData}
				gridDataDetail={gridDataDetail}
				gridDataExcel={gridDataExcel}
				searchDetailList={searchDetailList}
				openModal={openModal}
				applyReason={applyReason}
				saveExcept={saveExcept}
				saveDpReceiptBoxMaster={saveDpReceiptBoxMaster}
				saveDpReceiptBoxDetail={saveDpReceiptBoxDetail}
				savePlt={savePlt}
				applyQty={applyQty}
				printDetailList={printDetailList}
				searchExcelList={searchExcelList}
				applyPlt={applyPlt}
			/>

			{/*마스터저장*/}
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>

			{/*상세저장*/}
			<CustomModal ref={modalRef2} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent2} />
			</CustomModal>

			{/*<CustomModal ref={modalRef1} width="800px">*/}
			{/*	<DpReceiptMstPop1 codeType={'EXPIRATION_DATE_DP'} close={closeModal} />*/}
			{/*</CustomModal>*/}

			<CustomModal ref={modalRef1} width="350px">
				<div className="tbl-view">
					<table>
						<thead>
							<tr>
								<th rowSpan={2}>저장타입</th>
								<th colSpan={2}>소비기간</th>
								<th rowSpan={2}>입고기준(%)</th>
							</tr>
							<tr>
								<th>시작일</th>
								<th>종료일</th>
							</tr>
						</thead>
						<tbody>
							{expCodeListMap.map((item: any, index: number) => (
								<tr key="expCodeListMap-tr">
									<td className="ta-c">{item.cdNm}</td>
									<td className="ta-c">{item.start}</td>
									<td className="ta-c">{item.end}</td>
									<td className="ta-c">{item.rate}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</CustomModal>
		</>
	);
};

export default DpReceiptBox;
