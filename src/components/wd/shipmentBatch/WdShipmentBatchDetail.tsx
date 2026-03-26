// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Utils
import { showAlert, showConfirm, showMessage } from '@/util/MessageUtil';
import commUtil from '@/util/commUtil';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';

// API
import { apiGetStatus } from '@/api/cm/apiCmCheckSAPClose';
import {
	apiGetBillYn,
	apiGetTab1DetailList,
	apiGetTab2DetailList,
	apiGetTab3DetailList,
	apiSaveShortage,
	apiSaveWD,
} from '@/api/wd/apiWdShipmentBatch';

import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';
import InputText from '@/components/common/custom/form/InputText';
import SelectBox from '@/components/common/custom/form/SelectBox';
import { getCommonCodeList } from '@/store/core/comCodeStore';

const WdShipmentBatchDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// grid Ref
	ref.gridRef = useRef();
	ref.gridRef2 = useRef();
	ref.gridRef3 = useRef();
	ref.gridRef4 = useRef();

	// 다국어
	const { t } = useTranslation();

	const [activeKeyMaster, setActiveKeyMaster] = useState('1');
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef<any>(null);

	const prevRowItemRef = useRef<any>(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	const searchDtl = (key: any) => {
		const selectedRow = ref.gridRef.current?.getSelectedRows?.() || [];
		const searchParams = props.form.getFieldsValue();

		if (!selectedRow[0]) return;

		const params: any = {
			dccode: selectedRow[0].dccode,
			storerkey: selectedRow[0].storerkey,
			doctype: selectedRow[0].doctype,
			deliverydt: selectedRow[0].deliverydt,
			priority: selectedRow[0].priority,
			slipdt: selectedRow[0].slipdt,
			deliverygroup: selectedRow[0].deliverygroup,
			carno: selectedRow[0].carno,
			docno: searchParams.docno,
			toCustkey: searchParams.toCustkey,
			sku: searchParams.sku,
			channel: searchParams.channel,
			serialno: searchParams.serialno,
			blno: searchParams.blno,
			contractcompany: searchParams.contractcompany,
			organize: searchParams.organize,
			ordertype: searchParams.ordertype,
			status: searchParams.status,
			inspectstatus: searchParams.inspectstatus,
			searchserial: '',
		};

		if (
			!commUtil.isNull(params.blno) ||
			!commUtil.isNull(params.serialno) ||
			!commUtil.isNull(params.contractcompany)
		) {
			params.searchserial = 'Y';
		}

		if (key === '1') {
			ref.gridRef2.current?.resize?.('100%', '100%');
			apiGetTab1DetailList(params).then((res: any) => {
				const gridData = res.data;
				ref.gridRef2.current?.setGridData?.(gridData);
				const colSizeList = ref.gridRef2.current?.getFitColumnSizeList?.(true);
				if (colSizeList) ref.gridRef2.current?.setColumnSizeList?.(colSizeList);
			});
		} else if (key === '2') {
			ref.gridRef3.current?.resize?.('100%', '100%');
			apiGetTab2DetailList(params).then((res: any) => {
				const gridData = res.data;
				ref.gridRef3.current?.setGridData?.(gridData);
				const colSizeList = ref.gridRef3.current?.getFitColumnSizeList?.(true);
				if (colSizeList) ref.gridRef3.current?.setColumnSizeList?.(colSizeList);
			});
		} else if (key === '3') {
			ref.gridRef4.current?.resize?.('100%', '100%');
			apiGetTab3DetailList(params).then((res: any) => {
				const gridData = res.data;
				ref.gridRef4.current?.setGridData?.(gridData);
				const colSizeList = ref.gridRef4.current?.getFitColumnSizeList?.(true);
				if (colSizeList) ref.gridRef4.current?.setColumnSizeList?.(colSizeList);
			});
		}
	};

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string, e: any) => {
		setActiveKeyMaster(key);

		requestAnimationFrame(() => {
			if (key === '1') {
				if ((ref.gridRef.current?.getGridData?.() || []).length > 0) searchDtl(key);
				else ref.gridRef2.current?.resize?.('100%', '100%');
			} else if (key === '2') {
				if ((ref.gridRef.current?.getGridData?.() || []).length > 0) searchDtl(key);
				else ref.gridRef3.current?.resize?.('100%', '100%');
			} else if (key === '3') {
				if ((ref.gridRef.current?.getGridData?.() || []).length > 0) searchDtl(key);
				else ref.gridRef4.current?.resize?.('100%', '100%');
			}
		});
	};

	/**
	 * 출고확정(메인그리드)
	 * @returns {void}
	 */
	const saveBatchMain = () => {
		const checkedRows = ref.gridRef.current?.getCheckedRowItemsAll?.() || [];

		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect'));
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_020', ['출고확정']), () => {
			const params = {
				apiUrl: '/api/wd/shipment/v1.0/saveConfirm',
				avc_COMMAND: 'BATCHCONFIRMCAR',
				dataKey: 'saveConfirmList',
				saveDataList: checkedRows,
			};

			setLoopTrParams(params);
			modalRef.current?.handlerOpen?.();
		});
	};

	/**
	 * 출고대상확정(tab1그리드)
	 * @returns {void}
	 */
	const saveBatchTab1 = async () => {
		const checkedRows = ref.gridRef2.current?.getCheckedRowItemsAll?.() || [];

		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect'));
			return;
		}

		if (checkedRows.some((row: any) => row.tasktype === 'AL')) {
			showAlert(null, '모바일 피킹중인건은 출고확정할 수 없습니다.');
			return;
		}

		if (checkedRows.some((row: any) => row.statusCode === '90' && row.workprocesscode === 'STO')) {
			showAlert(null, '센터간 STO는 출고확정/결품확정 시, 수정할 수 없습니다.');
			return;
		}

		if (!ref.gridRef2.current?.validateRequiredGridData?.()) {
			return false;
		}

		if (checkedRows.some((row: any) => row.confirmqty == 0 || row.confirmqty == null)) {
			showAlert(null, '출고작업량을 입력하십시오.');
			return;
		}

		if (checkedRows.some((row: any) => row.confirmyn === 'N')) {
			showAlert(null, '피킹하지 않은 건이 있습니다.');
			return;
		}

		const existingRows = checkedRows.filter(
			(r: any) => (r.ordertype === 'NB' && r.ifSendType === 'WMSPO') === false && r.ordertype !== 'DSGO',
		);
		const billYn = getCommonCodeList('BILL_YN_DP_WD').map((code: any) => code.comCd);

		for (let i = 0; i < existingRows.length; i++) {
			const params = {
				docno: existingRows[i].docno,
				docline: existingRows[i].docline,
				deliverydate: existingRows[i].slipdt,
			};

			const res = await apiGetStatus(params);
			if (res.data.result !== 'Y') {
				showAlert(null, 'SAP 마감처리되었습니다.');
				return false;
			}

			if (billYn.includes('Y')) {
				const res2 = await apiGetBillYn(params);
				if (res2.data.zbillyn === 'Y') {
					showAlert(null, '세금계산서가 발행되었습니다');
					return false;
				}
			}
		}

		showConfirm(null, t('msg.MSG_COM_CFM_020', ['출고대상확정']), () => {
			const params = {
				avc_COMMAND: 'BATCHCONFIRM',
				saveTab1List: checkedRows,
			};

			apiSaveWD(params).then(async (res: any) => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							props.search();
						},
					});
				}
			});
		});
	};

	/**
	 * 결품대상확정(tab2그리드)
	 * @returns {void}
	 */
	const saveBatchTab2 = async () => {
		const checkedRows = ref.gridRef3.current?.getCheckedRowItemsAll?.() || [];

		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect'));
			return;
		}

		if (!ref.gridRef3.current?.validateRequiredGridData?.()) {
			return false;
		}

		if (checkedRows.some((row: any) => row.etcqty1 == 0 || row.etcqty1 == null)) {
			showAlert(null, '결품작업량을 입력하십시오.');
			return;
		}

		if (checkedRows.some((row: any) => Number(row.etcqty1) > Number(row.orderqty - row.processqty))) {
			showAlert(null, '결품작업량은 주문수량-피킹수량을 초과할 수 없습니다.');
			return;
		}

		for (const row of checkedRows) {
			if (row.uom !== 'KG') {
				const newValue = Number(row.etcqty1 || 0);
				const bunmo = Number(row.BUNMO || 1);
				const bunja = Number(row.BUNJA || 1);

				if (bunja > 0) {
					const calculation = (Math.abs(newValue) * bunmo) / bunja;
					if (calculation - Math.trunc(calculation) > 0) {
						showAlert(null, '수량이 주문 단위에 맞지 않습니다. 정수 단위로 입력 가능한지 확인해주세요.');
						return;
					}
				}
			}
		}

		showConfirm(null, t('msg.MSG_COM_CFM_020', ['결품대상확정']), () => {
			const params = {
				avc_COMMAND: 'BATCHCONFIRM',
				saveTab2List: checkedRows,
			};

			apiSaveShortage(params).then(async (res: any) => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							props.search();
						},
					});
				}
			});
		});
	};

	/**
	 * 상차검수취소(tab3그리드)
	 * @returns {void}
	 */
	const saveBatchTab3 = async () => {
		const checkedRows = ref.gridRef4.current?.getCheckedRowItemsAll?.() || [];

		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect'));
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_020', ['상차검수취소']), () => {
			const params = {
				apiUrl: '/api/wd/shipment/v1.0/saveWdInspect',
				avc_COMMAND: 'CANCEL_INSPECTION',
				dataKey: 'saveTab3List',
				saveDataList: checkedRows,
			};

			setLoopTrParams(params);
			modalRef.current?.handlerOpen?.();
		});
	};

	/**
	 * 결품사유, 처리결과 입력
	 */
	const onClickInsert = () => {
		let currentGrid: any;
		if (activeKeyMaster === '1') currentGrid = ref.gridRef2.current;
		else if (activeKeyMaster === '2') currentGrid = ref.gridRef3.current;

		if (!currentGrid) return;

		const formValues = props.form.getFieldsValue();
		const checkedItems = currentGrid.getCheckedRowItems?.() || [];

		if (!checkedItems || checkedItems.length === 0) {
			showAlert('', t('msg.noSelect'));
			return;
		}

		for (const checkedItem of checkedItems) {
			const { rowIndex } = checkedItem;
			if (activeKeyMaster === '1') {
				currentGrid.setCellValue(rowIndex, 'other02', formValues.reasonmsg1);
			} else if (activeKeyMaster === '2') {
				currentGrid.setCellValue(rowIndex, 'other01', formValues.reasoncode2);
				currentGrid.setCellValue(rowIndex, 'other02', formValues.reasonmsg2);
			}
		}
	};

	/**
	 * ref 준비 후 콜백 실행 (탭/keep-alive에서 null 순간 방지)
	 */
	function useWaitForRef(targetRef: any, callback: any, deps: any = []) {
		useEffect(() => {
			let cancelled = false;

			function check() {
				if (targetRef.current) {
					if (!cancelled) callback(targetRef.current);
				} else {
					if (!cancelled) requestAnimationFrame(check);
				}
			}

			check();

			return () => {
				cancelled = true;
			};
		}, deps);
	}

	/**
	 * 팝업 닫기
	 */
	const closeEvent = async () => {
		modalRef.current?.handlerClose?.();
		await props.search();
		searchDtl(activeKeyMaster);
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol1: any[] = [
		{
			dataField: 'slipdt',
			headerText: t('lbl.DOCDT_WD'),
			dataType: 'date',
		},
		{
			dataField: 'courier',
			headerText: t('lbl.COURIER_WD'),
			dataType: 'code',
		},
		{
			dataField: 'deliverygroup',
			headerText: t('lbl.DELIVERYGROUP'),
			dataType: 'code',
		},
		{
			dataField: 'priority',
			headerText: t('lbl.PRIORITY'),
			dataType: 'code',
		},
		{
			dataField: 'carno',
			headerText: t('lbl.CARNO'),
			dataType: 'code',
		},
		{
			dataField: 'drivername',
			headerText: t('lbl.DRIVERNAME'),
			dataType: 'code',
		},
		{
			dataField: 'dcdeparturedt',
			headerText: t('lbl.OUTCARTIME'),
			dataType: 'date',
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY'),
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'loadcmpqty',
			headerText: t('lbl.LOADCMPQTY'),
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.LOADRATE'),
			children: [
				{
					dataField: 'loadrate',
					headerText: '상차진행률',
					dataType: 'code',
					formatString: '#,##0.##',
					width: 200,
					renderer: {
						type: 'BarRenderer',
						min: 0,
						max: 100,
					},
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						if (item.loadrate <= 30) return 'bar-color-red';
						if (item.loadrate > 30 && item.loadrate <= 70) return 'bar-color-blue';
						return 'bar-color-green';
					},
				},
				{
					dataField: 'loadrateText',
					headerText: '%',
					dataType: 'numeric',
				},
			],
		},
		{
			dataField: 'unloadcmpqty',
			headerText: t('하차완료량'),
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('하차진행률'),
			children: [
				{
					dataField: 'unloadrate',
					headerText: t('하차진행률'),
					dataType: 'code',
					formatString: '#,##0.##',
					width: 200,
					renderer: {
						type: 'BarRenderer',
						min: 0,
						max: 100,
					},
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						if (item.unloadrate <= 30) return 'bar-color-red';
						if (item.unloadrate > 30 && item.unloadrate <= 70) return 'bar-color-blue';
						return 'bar-color-green';
					},
				},
				{
					dataField: 'unloadrateText',
					headerText: '%',
					dataType: 'numeric',
				},
			],
		},
		{
			dataField: 'shortageqty',
			headerText: t('lbl.SHORTAGEQTY'),
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.SHORTAGERATE'),
			children: [
				{
					dataField: 'shortagerate',
					headerText: t('결품율'),
					dataType: 'code',
					formatString: '#,##0.##',
					width: 200,
					renderer: {
						type: 'BarRenderer',
						min: 0,
						max: 100,
					},
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						if (item.shortagerate <= 30) return 'bar-color-green';
						if (item.shortagerate > 30 && item.shortagerate <= 70) return 'bar-color-blue';
						return 'bar-color-red';
					},
				},
				{
					dataField: 'shortagerateText',
					headerText: '%',
					dataType: 'numeric',
				},
			],
		},
		{
			dataField: 'forcecmpqty',
			headerText: t('lbl.FORCECMPQTY'),
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.FORCECMPRATE'),
			children: [
				{
					dataField: 'forcecmprate',
					headerText: t('강제완료률'),
					dataType: 'code',
					formatString: '#,##0.##',
					width: 200,
					renderer: {
						type: 'BarRenderer',
						min: 0,
						max: 100,
					},
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						if (item.forcecmprate <= 30) return 'bar-color-green';
						if (item.forcecmprate > 30 && item.forcecmprate <= 70) return 'bar-color-blue';
						return 'bar-color-red';
					},
				},
				{
					dataField: 'forcecmprateText',
					headerText: '%',
					dataType: 'numeric',
				},
			],
		},
		{
			dataField: 'unconfirmqty',
			headerText: t('lbl.UNCONFIRMQTY_WD'),
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'confirmqty',
			headerText: t('lbl.CONFIRMQTY'),
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.CONFIRMRATE'),
			children: [
				{
					dataField: 'confirmrate',
					headerText: t('확정율'),
					dataType: 'code',
					formatString: '#,##0.##',
					width: 200,
					renderer: {
						type: 'BarRenderer',
						min: 0,
						max: 100,
					},
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						if (item.confirmrate <= 30) return 'bar-color-red';
						if (item.confirmrate > 30 && item.confirmrate <= 70) return 'bar-color-blue';
						return 'bar-color-green';
					},
				},
				{
					dataField: 'confirmrateText',
					headerText: '%',
					dataType: 'numeric',
				},
			],
		},
		{
			dataField: 'forcecmpyn',
			headerText: t('lbl.FORCECMPYN'),
			dataType: 'code',
		},
	];

	// 그리드 속성
	const gridProps1: any = {
		editable: false,
		showStateColumn: true,
		fillColumnSizeMode: false,
		showFooter: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
	};

	// FooterLayout Props
	const footerLayout1: any[] = [{}];

	// 그리드 버튼
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef,
		btnArr: [],
	};

	//그리드 컬럼 (tab1)
	const gridCol2: any[] = [
		{
			dataField: 'taskdescr',
			headerText: t('lbl.TASKTYPE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			editable: false,
			filter: { showIcon: true },
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current?.openPopup?.({ sku: e.item.sku }, 'sku');
				},
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			editable: false,
			filter: { showIcon: true },
		},
		{
			dataField: 'countryoforigin',
			headerText: t('lbl.COUNTRYOFORIGIN'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'plantDescr',
			headerText: t('lbl.PLANT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toCustkey',
			headerText: '관리처코드',
			dataType: 'code',
			editable: false,
			filter: { showIcon: true },
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current?.openPopup?.({ custkey: e.item.toCustkey }, 'cust');
				},
			},
		},
		{
			dataField: 'toCustname',
			headerText: t('관리처명'),
			editable: false,
			filter: { showIcon: true },
		},
		{
			dataField: 'mngplcId',
			headerText: t('분할관리처코드'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'mngplcName',
			headerText: t('분할관리처명'),
			editable: false,
		},
		{
			dataField: 'qtyperbox',
			headerText: t('lbl.QTYPERBOX'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'lottable01',
			headerText: t('lbl.LOTTABLE01'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'processqty',
			headerText: t('lbl.PROCESSQTY_WD'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'workqty',
			headerText: t('lbl.WORKQTY_WD'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'inspectqty',
			headerText: t('lbl.LOADINSPQTY'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'unloadqty',
			headerText: t('하차수량'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'rmk',
			headerText: t('하차검수 특이사항'),
			editable: false,
		},
		{
			dataField: 'inspectstatus',
			headerText: t('lbl.INSPECTSTATUS_WD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'confirmedqty',
			headerText: t('lbl.CONFIRMQTY_WD'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'confirmqty',
			headerText: t('lbl.TRANQTY_WD'),
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				allowNegative: true,
				allowPoint: true,
			},
			formatString: '#,##0.##',
			required: true,
		},
		{
			dataField: 'slipno',
			headerText: t('lbl.SLIPNO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'slipline',
			headerText: t('lbl.SLIPLINE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY_WD'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'cancelqty',
			headerText: t('lbl.SHORTAGEQTY'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'etcqty1',
			headerText: t('lbl.SHORTAGETRANQTY'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'other01',
			headerText: t('lbl.REASONCODE_WD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'other02',
			headerText: t('lbl.REASONRESULTMSG'),
		},
		{
			dataField: 'confirmweight',
			headerText: t('lbl.CONFIRMWEIGHT_WD'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'status',
			headerText: t('lbl.STATUS_WD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'pickernm',
			headerText: t('lbl.PICKER'),
			dataType: 'manager',
			managerDataField: 'picker',
			editable: false,
		},
		{ dataField: 'picker', visible: false },
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'organizename',
			headerText: t('lbl.ORGANIZENAME'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'slipdt',
			headerText: t('lbl.DOCDT_WD'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'ordertypeDescr',
			headerText: t('lbl.ORDERTYPE_WD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'channeldescr',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.SERIALINFO'),
			children: [
				{ dataField: 'serialno', headerText: t('lbl.SERIALNO'), dataType: 'code', editable: false },
				{ dataField: 'barcode', headerText: t('lbl.BARCODE'), dataType: 'code', editable: false },
				{ dataField: 'convserialno', headerText: t('lbl.BLNO'), dataType: 'code', editable: false },
				{ dataField: 'butcherydt', headerText: t('lbl.BUTCHERYDT'), dataType: 'date', editable: false },
				{ dataField: 'factoryname', headerText: t('lbl.FACTORYNAME'), dataType: 'code', editable: false },
				{ dataField: 'contracttype', headerText: t('lbl.CONTRACTTYPE'), dataType: 'code', editable: false },
				{ dataField: 'contractcompany', headerText: t('lbl.CONTRACTCOMPANY'), dataType: 'code', editable: false },
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataType: 'code',
					editable: false,
				},
				{ dataField: 'fromvaliddt', headerText: t('lbl.FROMVALIDDT'), dataType: 'date', editable: false },
				{ dataField: 'tovaliddt', headerText: t('lbl.TOVALIDDT'), dataType: 'date', editable: false },
				{
					dataField: 'serialorderqty',
					headerText: t('lbl.SERIALORDERQTY'),
					dataType: 'numeric',
					formatString: '#,##0.##',
					editable: false,
				},
				{
					dataField: 'serialinspectqty',
					headerText: t('lbl.SERIALINSPECTQTY'),
					dataType: 'numeric',
					formatString: '#,##0.##',
					editable: false,
				},
				{
					dataField: 'serialscanweight',
					headerText: t('lbl.SERIALSCANWEIGHT'),
					dataType: 'numeric',
					formatString: '#,##0.##',
					editable: false,
				},
			],
		},
		{
			dataField: 'stotype',
			headerText: t('lbl.STOTYPE'),
			dataType: 'code',
			editable: false,
		},
	];

	// 그리드 속성
	const gridProps2: any = {
		editable: true,
		showStateColumn: true,
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
	};

	// FooterLayout Props
	const footerLayout2: any[] = [
		{
			dataField: 'processqty',
			positionField: 'processqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'workqty',
			positionField: 'workqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmedqty',
			positionField: 'confirmedqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'cancelqty',
			positionField: 'cancelqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'serialorderqty',
			positionField: 'serialorderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'serialinspectqty',
			positionField: 'serialinspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'cancserialscanweightelqty',
			positionField: 'serialscanweight',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼 (tab1) - ref.gridRef1 사용 금지
	const gridBtn2: GridBtnPropsType = {
		tGridRef: ref.gridRef2,
		btnArr: [],
	};

	//그리드 컬럼 (tab2)
	const gridCol3: any[] = [
		{
			dataField: 'taskdescr',
			headerText: t('lbl.TASKTYPE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			editable: false,
			filter: { showIcon: true },
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current?.openPopup?.({ sku: e.item.sku }, 'sku');
				},
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			editable: false,
			filter: { showIcon: true },
		},
		{
			dataField: 'countryoforigin',
			headerText: t('lbl.COUNTRYOFORIGIN'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'plantDescr',
			headerText: t('lbl.PLANT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toCustkey',
			headerText: '관리처코드',
			dataType: 'code',
			editable: false,
			filter: { showIcon: true },
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current?.openPopup?.({ custkey: e.item.toCustkey }, 'cust');
				},
			},
		},
		{
			dataField: 'toCustname',
			headerText: '관리처명',
			editable: false,
			filter: { showIcon: true },
		},
		{ dataField: 'mngplcId', headerText: '분할관리처코드', dataType: 'code', editable: false },
		{ dataField: 'mngplcName', headerText: '분할관리처명', editable: false },
		{
			dataField: 'qtyperbox',
			headerText: t('lbl.QTYPERBOX'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{ dataField: 'uom', headerText: t('lbl.UOM'), dataType: 'code', editable: false },
		{ dataField: 'lottable01', headerText: t('lbl.LOTTABLE01'), dataType: 'code', editable: false },
		{ dataField: 'loc', headerText: t('lbl.LOC'), dataType: 'code', editable: false },
		{
			dataField: 'processqty',
			headerText: t('lbl.PROCESSQTY_WD'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'workqty',
			headerText: t('lbl.WORKQTY_WD'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'inspectqty',
			headerText: t('lbl.INSPECTQTY_WD'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{ dataField: 'inspectstatus', headerText: t('lbl.INSPECTSTATUS_WD'), dataType: 'code', editable: false },
		{
			dataField: 'confirmedqty',
			headerText: t('lbl.CONFIRMQTY_WD'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'confirmqty',
			headerText: t('lbl.TRANQTY_WD'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{ dataField: 'slipno', headerText: t('lbl.SLIPNO'), dataType: 'code', editable: false },
		{ dataField: 'slipline', headerText: t('lbl.SLIPLINE'), dataType: 'code', editable: false },
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY_WD'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'cancelqty',
			headerText: t('lbl.SHORTAGEQTY'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'etcqty1',
			headerText: t('lbl.SHORTAGETRANQTY'),
			dataType: 'numeric',
			editRenderer: { type: 'InputEditRenderer', allowNegative: true, allowPoint: true },
			formatString: '#,##0.##',
			required: true,
		},
		{
			dataField: 'other01',
			headerText: t('lbl.REASONCODE_WD'),
			dataType: 'code',
			commRenderer: { type: 'dropDown', list: getCommonCodeList('REASONCODE_WD') },
		},
		{ dataField: 'other02', headerText: t('lbl.REASONRESULTMSG'), dataType: 'code' },
		{
			dataField: 'other04',
			headerText: t('lbl.SHORTAGEACTION'),
			dataType: 'code',
			commRenderer: { type: 'dropDown', list: getCommonCodeList('SHORTAGEACTION') },
		},
		{
			dataField: 'confirmweight',
			headerText: t('lbl.CONFIRMWEIGHT_WD'),
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{ dataField: 'status', headerText: t('lbl.STATUS_WD'), dataType: 'code', editable: false },
		{ dataField: 'durationTerm', headerText: t('lbl.DURATION_TERM'), dataType: 'code', editable: false },
		{ dataField: 'picker', headerText: t('lbl.PICKER'), dataType: 'code', editable: false },
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), dataType: 'code', editable: false },
		{ dataField: 'organizename', headerText: t('lbl.ORGANIZENAME'), editable: false },
		{ dataField: 'slipdt', headerText: t('lbl.DOCDT_WD'), dataType: 'date', editable: false },
		{ dataField: 'ordertype', headerText: t('lbl.ORDERTYPE_WD'), dataType: 'code', editable: false },
		{ dataField: 'channel', headerText: t('lbl.CHANNEL_DMD'), dataType: 'code', editable: false },
		{ dataField: 'storagetype', headerText: t('lbl.STORAGETYPE'), dataType: 'code', editable: false },
		{ dataField: 'stotype', headerText: t('lbl.STOTYPE'), dataType: 'code', editable: false },
	];

	// 그리드 속성
	const gridProps3: any = {
		editable: true,
		showStateColumn: true,
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
	};

	// FooterLayout Props
	const footerLayout3: any[] = [
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'cancelqty',
			positionField: 'cancelqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼 (tab2)
	const gridBtn3: GridBtnPropsType = {
		tGridRef: ref.gridRef3,
		btnArr: [],
	};

	//그리드 컬럼 (tab3)
	const gridCol4: any[] = [
		{ dataField: 'invoiceno', headerText: t('lbl.INVOICENO'), dataType: 'code' },
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			filter: { showIcon: true },
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current?.openPopup?.({ sku: e.item.sku }, 'sku');
				},
			},
		},
		{ dataField: 'skuname', headerText: t('lbl.SKUNAME'), filter: { showIcon: true } },
		{ dataField: 'countryoforigin', headerText: t('lbl.COUNTRYOFORIGIN'), dataType: 'code' },
		{ dataField: 'plantDescr', headerText: t('lbl.PLANT'), dataType: 'code' },
		{ dataField: 'channeldescr', headerText: t('lbl.CHANNEL_DMD'), dataType: 'code' },
		{ dataField: 'toCustkey', headerText: t('lbl.TO_CUSTKEY_WDLABEL'), dataType: 'code' },
		{ dataField: 'toCustname', headerText: t('lbl.TO_CUSTNAME_WDLABEL') },
		{ dataField: 'mngplcId', headerText: '분할관리처코드', dataType: 'code' },
		{ dataField: 'mngplcName', headerText: '분할관리처명' },
		{ dataField: 'uom', headerText: t('lbl.UOM'), dataType: 'code' },
		{ dataField: 'inspectqty', headerText: t('lbl.INSPECTQTY_WD'), dataType: 'numeric' },
		{ dataField: 'docno', headerText: t('lbl.DOCNO'), dataType: 'code' },
		{ dataField: 'docline', headerText: t('lbl.DOCLINE'), dataType: 'code' },
		{ dataField: 'addwho', headerText: t('lbl.ADDWHO'), dataType: 'code' },
		{ dataField: 'adddate', headerText: t('lbl.ADDDATE'), dataType: 'date' },
		{
			headerText: t('lbl.SERIALINFO'),
			children: [
				{ dataField: 'serialno', headerText: t('lbl.SERIALNO'), dataType: 'code' },
				{ dataField: 'barcode', headerText: t('lbl.BARCODE'), dataType: 'code' },
				{ dataField: 'convserialno', headerText: t('lbl.BLNO'), dataType: 'code' },
				{ dataField: 'butcherydt', headerText: t('lbl.BUTCHERYDT'), dataType: 'date' },
				{ dataField: 'factoryname', headerText: t('lbl.FACTORYNAME') },
				{ dataField: 'contracttype', headerText: t('lbl.CONTRACTTYPE'), dataType: 'code' },
				{ dataField: 'contractcompany', headerText: t('lbl.CONTRACTCOMPANY'), dataType: 'code' },
				{ dataField: 'contractcompanyname', headerText: t('lbl.CONTRACTCOMPANYNAME') },
				{ dataField: 'fromvaliddt', headerText: t('lbl.FROMVALIDDT'), dataType: 'date' },
				{ dataField: 'tovaliddt', headerText: t('lbl.TOVALIDDT'), dataType: 'date' },
				{
					dataField: 'serialorderqty',
					headerText: t('lbl.SERIALORDERQTY'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'serialinspectqty',
					headerText: t('lbl.SERIALINSPECTQTY'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					dataField: 'serialscanweight',
					headerText: t('lbl.SERIALSCANWEIGHT'),
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
			],
		},
	];

	// 그리드 속성
	const gridProps4: any = {
		editable: false,
		showStateColumn: true,
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
	};

	// FooterLayout Props
	const footerLayout4: any[] = [
		{
			dataField: 'serialorderqty',
			positionField: 'serialorderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'serialinspectqty',
			positionField: 'serialinspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'cancserialscanweightelqty',
			positionField: 'serialscanweight',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼 (tab3)
	const gridBtn4: GridBtnPropsType = {
		tGridRef: ref.gridRef4,
		btnArr: [],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (!gridRefCur1?.setGridData) return;

		gridRefCur1.setGridData(props.data);
		gridRefCur1?.setSelectionByIndex?.(0, 1);

		if ((props.data || []).length > 0) {
			const colSizeList = gridRefCur1?.getFitColumnSizeList?.(true);
			if (colSizeList) gridRefCur1?.setColumnSizeList?.(colSizeList);
		} else {
			ref.gridRef2.current?.clearGridData?.();
			ref.gridRef3.current?.clearGridData?.();
			ref.gridRef4.current?.clearGridData?.();
		}
	}, [props.data]);

	// gridRef2: ref 준비 후 edit 제어 바인딩 (탭 전환 null 순간 방지)
	useWaitForRef(
		ref.gridRef2,
		(grid2: any) => {
			grid2.unbind?.('cellEditBegin');
			grid2.bind?.('cellEditBegin', (event: any) => {
				return event.dataField === 'confirmqty' || event.dataField === 'other02';
			});
		},
		[],
	);

	// gridRef(메인): selectionChange (탭/keep-alive에서 ref null 방지)
	useWaitForRef(
		ref.gridRef,
		(grid1: any) => {
			grid1.unbind?.('selectionChange');
			grid1.bind?.('selectionChange', (event: any) => {
				if (!event?.primeCell) return;
				if (event.primeCell.item === prevRowItemRef.current || event.primeCell.dataField === 'customRowCheckYn') return;

				prevRowItemRef.current = event.primeCell.item;
				searchDtl(activeKeyMaster);
			});
		},
		[activeKeyMaster],
	);

	// gridRef2: 체크 이벤트 (탭/keep-alive에서 ref null 방지)
	useWaitForRef(
		ref.gridRef2,
		(grid2: any) => {
			grid2.unbind?.('rowCheckClick');
			grid2.bind?.('rowCheckClick', (event: any) => {
				const { item, checked, rowIndex } = event || {};
				if (!checked) return;
				if (!item) return;

				if (item.status !== '출고확정') {
					if (item.channel === '1') {
						if (item.other05 === 'Y') {
							grid2.setCellValue(rowIndex, 'confirmqty', item.orderqty - item.confirmedqty);
						} else {
							grid2.setCellValue(rowIndex, 'confirmqty', item.workqty - item.confirmedqty);
						}
					} else {
						grid2.setCellValue(rowIndex, 'confirmqty', item.orderqty - item.confirmedqty);
					}
				}
			});

			grid2.unbind?.('rowAllCheckClick');
			grid2.bind?.('rowAllCheckClick', (checked: any) => {
				const gridAllData = grid2.getGridData?.() || [];
				gridAllData.forEach((item: any, rowIndex: number) => {
					if (!checked) return;
					if (item.status === '출고확정') return;

					let qty = item.orderqty - item.confirmedqty;
					if (item.channel === '1' && item.other05 !== 'Y') qty = item.workqty - item.confirmedqty;

					grid2.updateRow({ ...item, confirmqty: qty }, rowIndex);
				});
			});
		},
		[activeKeyMaster],
	);

	// gridRef3: 기존 로직 유지 (ref 준비 후 바인딩)
	useWaitForRef(
		ref.gridRef3,
		(gridRef3: any) => {
			if (activeKeyMaster === '2') {
				gridRef3.unbind?.('cellEditBegin');
				gridRef3.bind?.('cellEditBegin', (event: any) => {
					return ['etcqty1', 'other01', 'other02', 'other04'].includes(event.dataField);
				});

				gridRef3.unbind?.('rowCheckClick');
				gridRef3.bind?.('rowCheckClick', (event: any) => {
					const { item, checked, rowIndex } = event;

					if (checked) {
						if (item.status !== '출고확정') {
							let etcqty1 = item.orderqty - item.processqty - item.cancelqty;
							if (item.storeruom === 'KG') {
								etcqty1 = (((etcqty1 * item.bunmo) / item.bunja) * item.bunja) / item.bunmo;
							} else {
								etcqty1 = Math.trunc((((etcqty1 * item.bunmo) / item.bunja) * item.bunja) / item.bunmo);
							}
							gridRef3.setCellValue(rowIndex, 'etcqty1', etcqty1);
						}
					}
				});

				gridRef3.unbind?.('rowAllCheckClick');
				gridRef3.bind?.('rowAllCheckClick', (checked: any) => {
					const gridAllData = gridRef3.getGridData();

					gridAllData.forEach((item: any, rowIndex: number) => {
						if (checked) {
							if (item.status !== '출고확정') {
								let etcqty1 = item.orderqty - item.processqty - item.cancelqty;
								if (item.storeruom === 'KG') {
									etcqty1 = (((etcqty1 * item.bunmo) / item.bunja) * item.bunja) / item.bunmo;
								} else {
									etcqty1 = Math.trunc((((etcqty1 * item.bunmo) / item.bunja) * item.bunja) / item.bunmo);
								}

								gridRef3.updateRow({ ...item, etcqty1 }, rowIndex);
							}
						}
					});
				});
			}
		},
		[activeKeyMaster],
	);

	const tabItems = [
		{
			key: '1',
			label: '출고대상',
			children: (
				<>
					<AGrid className="form-inner" style={{ marginTop: '10px' }}>
						<div className="fix-title">
							<GridTopBtn gridBtn={gridBtn2}>
								<Form form={props.form} layout="inline">
									<InputText label={'처리결과'} name="reasonmsg1" className="bg-white" />
									<Button onClick={() => onClickInsert()} style={{ marginLeft: '5px', marginRight: '5px' }}>
										{'선택적용'}
									</Button>
									<Button onClick={() => saveBatchTab1()}>{'출고대상확정'}</Button>
								</Form>
							</GridTopBtn>
						</div>
					</AGrid>
					<GridAutoHeight id="confirmed-shipment-list">
						<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
					</GridAutoHeight>
				</>
			),
		},
		{
			key: '2',
			label: '결품대상',
			children: (
				<>
					<AGrid className="form-inner" style={{ marginTop: '10px', marginBottom: '10px' }}>
						<GridTopBtn gridBtn={gridBtn3}>
							<Form form={props.form} layout="inline">
								<SelectBox
									label={'결품사유'}
									name="reasoncode2"
									className="bg-white"
									options={getCommonCodeList('REASONCODE_WD', '--- 전체 ---')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
								/>
								<InputText label={'처리결과'} name="reasonmsg2" className="bg-white" />
								<Button onClick={() => onClickInsert()} style={{ marginLeft: '5px', marginRight: '5px' }}>
									{'선택적용'}
								</Button>
								<Button onClick={() => saveBatchTab2()}>{'결품대상확정'}</Button>
							</Form>
						</GridTopBtn>
					</AGrid>
					<GridAutoHeight id="item-subject-to-shortage">
						<AUIGrid ref={ref.gridRef3} columnLayout={gridCol3} gridProps={gridProps3} footerLayout={footerLayout3} />
					</GridAutoHeight>
				</>
			),
		},
		{
			key: '3',
			label: '상차검수취소',
			children: (
				<>
					<AGrid className="form-inner" style={{ marginTop: '10px' }}>
						<div className="fix-title">
							<GridTopBtn gridBtn={gridBtn4}>
								<Button onClick={() => saveBatchTab3()}>{'상차검수취소'}</Button>
							</GridTopBtn>
						</div>
					</AGrid>
					<GridAutoHeight id="loading-inspection-cancellation">
						<AUIGrid ref={ref.gridRef4} columnLayout={gridCol4} gridProps={gridProps4} footerLayout={footerLayout4} />
					</GridAutoHeight>
				</>
			),
		},
	];

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
		ref.gridRef3?.current?.resize?.('100%', '100%');
		ref.gridRef4?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Form form={props.form} className="contain-wrap">
				<Splitter
					direction="vertical"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<>
							<AGrid>
								<GridTopBtn gridBtn={gridBtn1} gridTitle="출고확정목록" totalCnt={props.totalCnt}>
									<Button onClick={() => saveBatchMain()}>{'출고확정'}</Button>
								</GridTopBtn>
							</AGrid>
							<GridAutoHeight id="confirmed-shipment-list" style={{ marginTop: '10px' }}>
								<AUIGrid
									ref={ref.gridRef}
									columnLayout={gridCol1}
									gridProps={gridProps1}
									footerLayout={footerLayout1}
								/>
							</GridAutoHeight>
						</>,
						<TabsArray
							key="confirmed-shipment-tabs"
							activeKey={activeKeyMaster}
							onChange={key => {
								tabClick(key, null);
							}}
							items={tabItems}
						/>,
					]}
				/>
			</Form>

			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default WdShipmentBatchDetail;
