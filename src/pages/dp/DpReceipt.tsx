/*
 ############################################################################
 # FiledataField	: DpReceipt.tsx
 # Description		: 입고 > 입고작업 > 입고확정처리
 # Author			: KimDongHyeon
 # Since			: 2025.08.22
 ############################################################################
*/
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import {
	apiGetBillYn,
	apiPostDetailList,
	apiPostDetailList2,
	apiPostExcelList,
	apiPostExcelList2,
	apiPostMasterList,
	apiPostMasterList2,
	apiPostPrintList,
	apiPostPrintList2,
	apiPostReverseSto,
} from '@/api/dp/apiDpReceipt';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import TabsArray from '@/components/common/TabsArray';
import DpReceiptDetail from '@/components/dp/receipt/DpReceiptDetail';
import DpReceiptDetail2 from '@/components/dp/receipt/DpReceiptDetail2';
import DpReceiptDetail3 from '@/components/dp/receipt/DpReceiptDetail3';
import DpReceiptSearch from '@/components/dp/receipt/DpReceiptSearch';
import { useMoveMenu } from '@/hooks/useMoveMenu';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import commUtil from '@/util/commUtil';
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import reportUtil from '@/util/reportUtil';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';

// Store

const DpReceipt = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { moveMenu } = useMoveMenu();
	const location = useLocation();
	const [queryParam, setQueryParam] = useState<any>({});
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
	const gridRef3 = useRef<any>(null);
	const gridRef4 = useRef<any>(null);
	const gridRef5 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();
	const [form1] = Form.useForm();
	const [form2] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridDataDetail, setGridDataDetail] = useState([]);
	const [gridDataExcel, setGridDataExcel] = useState([]);
	const [gridDataExcel2, setGridDataExcel2] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridDataDetail2, setGridDataDetail2] = useState([]);
	const [gridDataResult, setGridDataResult] = useState([]);

	const [activeKey, setActiveKey] = useState('1');
	const activeKeyRef = useRef(activeKey);

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = useMemo(
		() => ({
			slipdt: dates,
			ordertype: [] as string[],
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
			const { channel, dccode, stoFlag, confirmqtyWd, confirmqty, slipdt, shortageqtyWd } = item;
			const diffDay = dayjs(slipdt).diff(dayjs(), 'day');
			const findCnt =
				WMS_MNG_DC_LIST.find((code: any) => {
					return code.comCd == dccode;
				})?.data1 || 0;

			if (['2', '3'].includes(channel) && diffDay >= parseInt(findCnt)) {
				if (findCnt == '0') {
					showAlert('', '당일 이후 입고건은 처리 할 수 없습니다.');
				} else {
					showAlert('', `D ${findCnt}일 이후 일자의 입고건은 처리 할 수 없습니다.`);
				}
				return true;
			}

			//디테일 STO일때 출고 확정안했으면 처리 불가
			if (stoFlag && stoFlag == '1' && confirmqtyWd == 0 && shortageqtyWd == 0) {
				showAlert('', '출고센터에서 출고확정을 완료해야 입고 처리할 수 있습니다.');
				return true;
			}
		});
		return !isNotValid;
	};

	const searchMasterList = async () => {
		if (!['1', '2'].includes(activeKey)) {
			return;
		}
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		if (activeKey == '1') {
			gridRef.current.clearGridData();
			gridRef1.current?.clearGridData();
		}
		if (activeKey == '2') {
			gridRef2.current?.clearGridData();
			gridRef3.current?.clearGridData();
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
		requestParams.ordertype = requestParams?.ordertype?.join(',');
		delete requestParams.slipdt;
		if (
			!commUtil.isNull(requestParams.blno) ||
			!commUtil.isNull(requestParams.serialno) ||
			!commUtil.isNull(requestParams.wdCustkey)
		) {
			requestParams.serialCheck = 'Y';
		}

		const { data } =
			activeKey === '1' ? await apiPostMasterList(requestParams) : await apiPostMasterList2(requestParams);
		if (activeKey === '1') {
			setGridData(data || []);
		} else {
			setGridData2(data || []);
		}
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
		requestParams.ordertype = requestParams?.ordertype?.join(',');
		delete requestParams.slipdt;

		const excelFn = activeKey === '1' ? apiPostExcelList : apiPostExcelList2;
		excelFn(requestParams).then(res => {
			FileSaver.saveAs(res.data, dataRegex.decodeDisposition(res.headers['content-disposition']));
		});
	};

	const searchDetailList = async (row: any) => {
		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
		requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		requestParams.crossyn = requestParams.crossyn ? 'Y' : 'N';
		requestParams.ordertype = requestParams?.ordertype?.join(',');
		delete requestParams.slipdt;
		if (
			!commUtil.isNull(requestParams.blno) ||
			!commUtil.isNull(requestParams.serialno) ||
			!commUtil.isNull(requestParams.wdCustkey)
		) {
			requestParams.serialCheck = 'Y';
		}

		const activeKey = activeKeyRef.current;
		const { data } =
			activeKey === '1'
				? await apiPostDetailList({ ...row, ...requestParams })
				: await apiPostDetailList2({ ...row, ...requestParams });
		if (activeKey === '1') {
			setGridDataDetail(data || []);
		} else {
			setGridDataDetail2(data || []);
		}
	};

	const closeEvent = () => {
		modalRef.current.handlerClose();
		searchMasterList();
		(activeKeyRef.current === '1' ? gridRef1 : gridRef3).current.clearGridData();
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
	const applyReason = (gridNo: number) => {
		const gridMap: any = {
			1: {
				ref: gridRef1,
				form: form1,
			},
			3: {
				ref: gridRef3,
				form: form2,
			},
		};

		const checkedItems = gridMap[gridNo].ref.current.getCheckedRowItemsAll();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		const { reasonCode, reasonMsg } = gridMap[gridNo].form.getFieldsValue() || {};
		gridMap[gridNo].ref.current.updateRowsById(
			checkedItems.map((item: any) => ({
				...item,
				reasoncode: reasonCode,
				reasonmsg: reasonMsg,
			})),
		);
	};

	//예외저장
	const saveExcept = async (gridNo: number) => {
		const gridMap: any = {
			1: {
				ref: gridRef1,
			},
			3: {
				ref: gridRef3,
			},
		};

		const checkedItems = gridMap[gridNo].ref.current
			.getChangedData({ validationYn: false, andCheckedYn: false })
			.filter((item: any) => item.rowStatus === 'U');

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		gridMap[gridNo].ref.current.showConfirmSave(async () => {
			const params = {
				apiUrl: '/api/dp/skuLabel/v1.0/saveDpSkuLabel',
				saveDataList: checkedItems,
			};

			setLoopTrParams(params);
			modalRef2.current.handlerOpen();
		});
	};

	//저장
	const saveDpReceiptMaster = async (gridNo: number) => {
		const gridMap: any = {
			0: {
				ref: gridRef,
			},
			2: {
				ref: gridRef2,
			},
		};

		const checkedItems = gridMap[gridNo].ref.current.getCheckedRowItems();
		const checkedItemsWithIndex = gridMap[gridNo].ref.current.getCheckedRowItems();
		if (checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		//STO 출고확정 검사
		let rowIndex = 0;
		const isNotStoDp = checkedItemsWithIndex.some((el: any) => {
			rowIndex = gridMap[gridNo].ref.current.getRowIndexesByValue('_$uid', el.item._$uid)[0];
			const { workprocesscode, stoDpYn } = el.item;
			return workprocesscode == 'STO' && stoDpYn != 'Y';
		});
		if (isNotStoDp) {
			showAlert(
				null,
				`출고센터에서 미확정내역이 존재합니다. 
출고확정을 완료해야 입고 처리할 수 있습니다.
부분확정 필요시 상세내역에서 대상확정을 사용하세요.`,
			);
			gridMap[gridNo].ref.current.setSelectionByIndex(
				rowIndex,
				gridMap[gridNo].ref.current?.getColumnIndexByDataField('slipno'),
			);
			return;
		}

		if (!isDpValid(checkedItems.map((item: any) => item.item))) {
			return;
		}

		showConfirm(null, t('msg.confirmSave'), async () => {
			const requestParams = form.getFieldsValue();
			const [slipdtFrom, slipdtTo] = requestParams.slipdt;
			requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
			requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
			requestParams.crossyn = requestParams.crossyn ? 'Y' : 'N';
			requestParams.ordertype = requestParams?.ordertype?.join(',');
			delete requestParams.slipdt;

			const params = {
				...requestParams,
				apiUrl: '/api/dp/receipt/v1.0/saveMaster',
				avc_COMMAND: 'BATCHCONFIRM',
				saveDataList: checkedItems.map((item: any) => item.item),
				dataKey: 'saveMasterList',
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	//대상확정
	const saveDpReceiptDetail = async (gridNo: number) => {
		const gridMap: any = {
			1: {
				ref: gridRef1,
				parentRef: gridRef,
				gridData: gridDataDetail,
			},
			3: {
				ref: gridRef3,
				parentRef: gridRef2,
				gridData: gridDataDetail2,
			},
		};

		const checkedItems = gridMap[gridNo].ref.current.getCheckedRowItems();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		if (!isDpValid(checkedItems.map((item: any) => item.item))) {
			return;
		}

		//수량확인
		const isNotValidQty = checkedItems.some((item: any) => {
			const { docorderqty, orderqty, confirmqty, shortageqty, tranqty, shortagetranqty } = item.item;
			return (gridNo == 3 ? docorderqty : orderqty) - confirmqty - shortageqty - tranqty - shortagetranqty < 0;
		});
		if (isNotValidQty) {
			showAlert(null, t('입고 / 결품 가능량보다 많은 수량을 입력 하셨습니다.'));
			return;
		}

		const isStoNotValidQty = checkedItems.some((item: any) => {
			const { confirmqty, shortageqty, tranqty, shortagetranqty, stoFlag, confirmqtyWd, shortageqtyWd } = item.item;
			//defauilt: orderqty, STO: 출고확정수량이 모수
			if (stoFlag == '1') {
				return confirmqtyWd - confirmqty - tranqty < 0 || shortageqtyWd - shortageqty - shortagetranqty < 0;
			}
		});
		if (isStoNotValidQty) {
			showAlert(null, t('입고 / 결품 가능량보다 많은 수량을 입력 하셨습니다.'));
			return;
		}

		//결품시 사유확인
		const isNotReason = checkedItems.some((item: any) => {
			const { shortagetranqty, reasoncode } = item.item;
			if (shortagetranqty > 0 && commUtil.isEmpty(reasoncode)) {
				return true;
			}
		});
		if (isNotReason) {
			showAlert(null, t('msg.required', [t('lbl.REASONCODE_DP')]));
			return;
		}

		//확정취소,결품취소시 수량확인
		const isNotCancelPossible = checkedItems.some((item: any) => {
			const { confirmqty, shortageqty, tranqty, shortagetranqty, stoFlag, confirmqtyWd, shortageqtyWd } = item.item;
			if (tranqty < 0 || shortagetranqty < 0) {
				return confirmqty - Math.abs(tranqty) < 0 || shortageqty - Math.abs(shortagetranqty) < 0;
			}
		});
		if (isNotCancelPossible) {
			showAlert(null, t('입고 / 결품 가능량보다 많은 수량을 입력 하셨습니다.'));
			return;
		}

		// 잔여율 확인
		const isRateInvalid = checkedItems.some((item: any) => {
			return !commUtil.isDpPossible(item.item, expCodeListMap);
		});
		//표준센터이동 체크 X
		const parentRow = gridMap[gridNo].parentRef.current.getSelectedRows()[0] || {};
		const channel = String(parentRow.channel ?? '');
		// channel이 2 또는 3일 경우에는 소비기한 검사 제외 (일배:2,광역일배:3)
		if (channel !== '2' && channel !== '3') {
			if (parentRow.ordertype != 'ZUB' && isRateInvalid) {
				showAlert(null, t('소비기한임박율이 미만입니다.'));
				return;
			}
		}
		// if (gridMap[gridNo].parentRef.current.getSelectedRows()[0].ordertype != 'ZUB' && isRateInvalid) {
		// 	showAlert(null, t('소비기한임박율이 미만입니다.'));
		// 	return;
		// }

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
					showAlert(null, '세금계산서가 발행되었습니다');
					return false;
				}
			}
		}

		gridMap[gridNo].ref.current.showConfirmSave(async () => {
			const requestParams = form.getFieldsValue();
			const [slipdtFrom, slipdtTo] = requestParams.slipdt;
			requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
			requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
			requestParams.crossyn = requestParams.crossyn ? 'Y' : 'N';
			requestParams.ordertype = requestParams?.ordertype?.join(',');
			delete requestParams.slipdt;

			const params = {
				...requestParams,
				apiUrl: '/api/dp/receipt/v1.0/saveDetail',
				avc_COMMAND: 'CONFIRM',
				saveDataList: checkedItems.map((item: any) => item.item),
			};

			setLoopTrParams(params);
			modalRef2.current.handlerOpen();
		});
	};

	//방단적용
	const savePlt = async (gridNo: number) => {
		const gridMap: any = {
			1: {
				ref: gridRef1,
				parentRef: gridRef,
			},
			3: {
				ref: gridRef3,
				parentRef: gridRef2,
			},
		};

		const checkedItems = gridMap[gridNo].ref.current.getCheckedRowItemsAll();
		const custkey = gridMap[gridNo].parentRef.current.getSelectedRows()[0].fromCustkey;

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

		gridMap[gridNo].ref.current.showConfirmSave(async () => {
			const params = {
				apiUrl: '/api/dp/receipt/v1.0/saveBoxPlt',
				saveDataList: checkedItems.map((item: any) => ({ ...item, custkey })),
			};

			setLoopTrParams(params);
			modalRef2.current.handlerOpen();
		});
	};

	//수량적용
	const applyQty = (gridNo: number) => {
		const gridMap: any = {
			1: {
				ref: gridRef1,
				form: form1,
			},
			3: {
				ref: gridRef3,
				form: form2,
			},
		};

		const checkedItems = gridMap[gridNo].ref.current.getCheckedRowItemsAll();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}
		gridMap[gridNo].ref.current.updateRowsById(
			checkedItems.map((item: any) => {
				const {
					orderqty,
					confirmqty,
					confirmqtyWd,
					shortageqty,
					inspectqty,
					serialorderqty,
					serialinspectqty,
					channel,
					stoFlag,
					shortageqtyWd,
				} = item;

				let calcTranqty = 0;
				if (stoFlag == '1') {
					calcTranqty = parseFloat(confirmqtyWd) - parseFloat(confirmqty);
				} else if (gridNo == 3 && channel == '1') {
					calcTranqty = parseFloat(serialorderqty) - parseFloat(serialinspectqty);
				} else if (inspectqty != 0 && confirmqty == 0 && shortageqty == 0) {
					calcTranqty = parseFloat(inspectqty) - parseFloat(confirmqty) - parseFloat(shortageqty);
				} else {
					calcTranqty = parseFloat(orderqty) - parseFloat(confirmqty) - parseFloat(shortageqty);
				}

				return {
					...item,
					tranqty: calcTranqty,
					shortagetranqty: stoFlag == '1' ? parseFloat(shortageqtyWd) - parseFloat(shortageqty) : 0,
				};
			}),
		);
	};

	// 인쇄
	const printDetailList = (gridNo: number) => {
		const gridMap: any = {
			0: {
				ref: gridRef,
				fileName: 'DP_Receipt.mrd',
				fileNameCd: 'DP_ReceiptCd.mrd',
			},
			2: {
				ref: gridRef2,
				fileName: 'DP_Receipt.mrd',
				fileNameCd: 'DP_ReceiptCd.mrd',
			},
		};

		if (gridMap[gridNo].ref.current?.getCheckedRowItemsAll().length < 1) {
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
			requestParams.ordertype = requestParams?.ordertype?.join(',');
			delete requestParams.slipdt;
			const slipnos = gridMap[gridNo].ref.current
				?.getCheckedRowItemsAll()
				.map((row: any) => row.slipno)
				.join(',');
			requestParams.slipno = slipnos;

			const res = gridNo == 0 ? await apiPostPrintList(requestParams) : await apiPostPrintList2(requestParams);
			const { data } = res;
			if (res.error == undefined && data?.errorCode == undefined) {
				if (!data.length) {
					showAlert(null, t('msg.noPrintData'));
					return;
				}
				// 2. 리포트에 XML 생성을 위한 DataSet 생성
				const dataSet = {
					ds_report: data.map((item: any) => ({
						...item,
						fromdt: dayjs(item.slipdt).format('YYYY.MM.DD'),
						todt: '',
					})),
				};

				// 3. 리포트에 전송할 파라미터
				const params: any = {
					fromdt: dayjs(data[0].slipdt).format('YYYY.MM.DD'),
					todt: data.length > 1 ? dayjs(data[data.length - 1].slipdt).format('YYYY.MM.DD') : '',
					channel: [...new Set(data.map((v: any) => v.channelName))].join('/'),
				};
				// params.INVOICE_TITLE = '저장품 입고예정 현황';

				reportUtil.openAgentReportViewer(
					requestParams.crossyn == 'Y' ? gridMap[gridNo].fileNameCd : gridMap[gridNo].fileName,
					dataSet,
					params,
				);
			}
		});
	};

	const reverseSto = (gridNo: number) => {
		const gridMap: any = {
			1: {
				parentRef: gridRef,
				ref: gridRef1,
				form: form1,
			},
			3: {
				parentRef: gridRef2,
				ref: gridRef3,
				form: form2,
			},
		};

		const checkedItems = gridMap[gridNo].ref.current.getCheckedRowItemsAll({ isGetRowIndexInItem: true });
		if (checkedItems.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		let rowIndex = 0;
		let fieldName = '';
		const isNotValid = checkedItems.some((el: any) => {
			rowIndex = gridMap[gridNo].ref.current.getRowIndexesByValue('_$uid', el._$uid)[0];
			const { restono, restoqty, stoFlag, confirmqty } = el;
			//STO확인
			if (stoFlag != '1') {
				fieldName = 'docline';
				showAlert(null, 'STO 출고건만 처리할 수 있습니다.');
				return true;
			}
			//이미 STO 처리되었는지확인
			if (restono) {
				fieldName = 'restono';
				showAlert(null, '이미 역STO 처리되었습니다.');
				return true;
			}
			//STO 수량 확인
			if (!restoqty) {
				fieldName = 'restoqty';
				showAlert(null, t('msg.required', [t('역STO 수량')]));
				return true;
			}
			//STO 수량 확인
			if (confirmqty - restoqty < 0) {
				fieldName = 'restoqty';
				showAlert(null, t('역STO 가능량보다 많은 수량을 입력 하셨습니다.'));
				return true;
			}
			//STO - 수량 확인
			if (restoqty < 0) {
				fieldName = 'restoqty';
				showAlert(null, t('역STO는 양수만 입력 할 수 있습니다..'));
				return true;
			}
		});
		if (isNotValid) {
			gridMap[gridNo].ref.current.setSelectionByIndex(
				rowIndex,
				gridMap[gridNo].ref.current?.getColumnIndexByDataField(fieldName),
			);
			return;
		}

		showConfirm(null, t('msg.confirmSave'), async () => {
			const params = {
				fixdccode: form.getFieldValue('fixdccode'),
				saveList: checkedItems,
				stoDccode: gridMap[gridNo].parentRef.current.getSelectedRows()[0].fromCustkey,
			};
			const res = await apiPostReverseSto(params);
			const { data } = res;
			if (res.error == undefined && data?.errorCode == undefined && !(res?.statusCode < 0)) {
				if (data?.sto.length > 0) {
					setActiveKey('3');
					setTimeout(() => {
						setGridData([]);
						setGridDataDetail([]);
						setGridData2([]);
						setGridDataDetail2([]);
						setGridDataResult(data?.sto || []);
					}, 10);
				}
				showAlert(null, t('msg.MSG_COM_VAL_201')); // 처리되었습니다. 결과탭으로 이동합니다.
			}
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		reset: () => {
			form.resetFields();
			gridRef.current.clearGridData();
			gridRef1.current?.clearGridData();
			gridRef2.current?.clearGridData();
			gridRef3.current?.clearGridData();
		},
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
		activeKey,
		search: searchMasterList,
	};

	const tabItems = [
		{
			key: '1',
			label: '일반상품',
			children: (
				<DpReceiptDetail
					form={form}
					form1={form1}
					isShow={activeKey == '1'}
					gridRef={gridRef}
					gridRef1={gridRef1}
					gridRef4={gridRef4}
					gridData={gridData}
					gridDataDetail={gridDataDetail}
					gridDataExcel={gridDataExcel}
					searchDetailList={searchDetailList}
					openModal={openModal}
					applyReason={applyReason}
					saveExcept={saveExcept}
					saveDpReceiptMaster={saveDpReceiptMaster}
					saveDpReceiptDetail={saveDpReceiptDetail}
					savePlt={savePlt}
					applyQty={applyQty}
					printDetailList={printDetailList}
					searchExcelList={searchExcelList}
					reverseSto={reverseSto}
				/>
			),
		},
		{
			key: '2',
			label: '이력상품',
			children: (
				<DpReceiptDetail2
					form={form}
					form2={form2}
					isShow={activeKey == '2'}
					gridRef2={gridRef2}
					gridRef3={gridRef3}
					gridRef5={gridRef5}
					gridData2={gridData2}
					gridDataDetail2={gridDataDetail2}
					searchDetailList={searchDetailList}
					gridDataExcel2={gridDataExcel2}
					openModal={openModal}
					applyReason={applyReason}
					saveExcept={saveExcept}
					saveDpReceiptMaster={saveDpReceiptMaster}
					saveDpReceiptDetail={saveDpReceiptDetail}
					savePlt={savePlt}
					applyQty={applyQty}
					printDetailList={printDetailList}
					searchExcelList={searchExcelList}
					reverseSto={reverseSto}
				/>
			),
		},
		{
			key: '3',
			label: '이동결과',
			children: <DpReceiptDetail3 gridRef4={gridRef4} gridDataResult={gridDataResult} />,
		},
	];

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
		gridRef1.current?.resize('100%', '100%');
		gridRef2.current?.resize('100%', '100%');
		gridRef3.current?.resize('100%', '100%');
		gridRef4.current?.resize('100%', '100%');
		activeKeyRef.current = activeKey;
	}, [activeKey]);

	useEffect(() => {
		setQueryParam(location.state);
	}, [location]);

	useEffect(() => {
		if (queryParam.docno) {
			form.resetFields(); // 기존 값 초기화

			const dccode = queryParam.dccode;
			const fixDccodeValue = Array.isArray(dccode) ? dccode[0] : dccode;
			form.setFieldsValue({
				...(fixDccodeValue ? { fixdccode: fixDccodeValue } : {}),
				slipdt: [dayjs(queryParam.slipdtFrom), dayjs(queryParam.slipdtTo)],
				docno: queryParam.docno,
				sku: queryParam.sku,
				skuName: decodeURIComponent(queryParam.skuName),
			});
			searchMasterList();
		}
	}, [queryParam]);

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<DpReceiptSearch {...formProps} />
			</SearchFormResponsive>

			<TabsArray activeKey={activeKey} onChange={key => setActiveKey(key)} items={tabItems} />

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
								<tr key={index}>
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

export default DpReceipt;
