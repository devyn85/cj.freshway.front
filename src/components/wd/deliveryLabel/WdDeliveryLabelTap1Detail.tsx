/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelTap1Detail.tsx
 # Description		: 배송라벨출력-분류표출력 Detail
 # Author			: 공두경
 # Since			: 25.11.15
 ############################################################################
*/
import { Form } from 'antd';
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils
// API Call Function
import {
	apiGetTab1DetailList,
	apiGetTab1ReportCrossList,
	apiGetTab1ReportList,
	apiSavePrintDetailList,
	apiSavePrintHeaderList,
} from '@/api/wd/apiWdDeliveryLabel';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import WdDeliveryLabelPrintPopup from '@/components/wd/deliveryLabel/WdDeliveryLabelPrintPopup';

const WdDeliveryLabelTap1Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
	ref.gridRef3 = useRef(null);
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);
	const modalRef1 = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	const searchDtl = () => {
		const selectedRow = ref.gridRef.current.getSelectedRows();
		const searchParams = props.form.getFieldsValue();
		const params = {
			dccode: selectedRow[0].dccode,
			slipdt: selectedRow[0].slipdt,
			tasksystem: selectedRow[0].tasksystem,
			pickBatchNo: selectedRow[0].pickBatchNo,
			pickListNo: selectedRow[0].pickListNo,
			pickNo: selectedRow[0].pickNo,
			toCustkey: searchParams.toCustkey,
			printmethod: searchParams.printmethod,
			sku: searchParams.sku,
			skugroup: searchParams.skugroup,
			crossdocktype: searchParams.crossdocktype,
			zone: searchParams.zone,
			ordertype: searchParams.ordertype,
		};
		if (commUtil.isNull(params.dccode)) {
			return;
		}

		apiGetTab1DetailList(params).then(res => {
			const gridData = res.data;
			setTotalCnt(res.data.length);
			ref.gridRef2.current?.setGridData(gridData);
			const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef2.current?.setColumnSizeList(colSizeList);
		});
	};

	/**
	 * 인쇄(목록그리드)
	 */
	const onPrintHeader = () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		const comfirmMsg = t('msg.MSG_COM_PRT_003', []);
		const searchParams = props.form.getFieldsValue();
		showConfirm(null, comfirmMsg, () => {
			const params = {
				avc_COMMAND: 'BATCHPRINT',
				toCustkey: searchParams.toCustkey,
				printmethod: searchParams.printmethod,
				sku: searchParams.sku,
				skugroup: searchParams.skugroup,
				crossdocktype: searchParams.crossdocktype,
				zone: searchParams.zone,
				ordertype: searchParams.ordertype,
				crossDc: searchParams.crossDc,
				fixdccode: searchParams.fixdccode,
				savePrintHeaderList: checkedRows, // 선택된 행의 데이터
				usePgm: storeUtil.getMenuInfo().progCd,
				printorder: searchParams.printorder,
			};
			apiSavePrintHeaderList(params).then(res => {
				//rd리포트 호출

				if (searchParams.labelPrintYn) {
					ref.gridRef3.current?.setGridData(res.data);
					const colSizeList = ref.gridRef3.current?.getFitColumnSizeList(true);
					// 구해진 칼럼 사이즈를 적용 시킴.
					ref.gridRef3.current?.setColumnSizeList(colSizeList);

					downloadExcel(); // 라벨출력 데이타와 비교하기 위해 엑셀로 다운받는다.
				} else {
					printList(res.data); // 배송라벨 출력
				}
				ref.gridRef2.current.clearGridData();
				props.search();
			});
		});
	};

	/**
	 * 인쇄(상세그리드)
	 */
	const onPrint = () => {
		const checkedRows = ref.gridRef2.current.getCheckedRowItemsAll();
		const mainRows = ref.gridRef.current.getSelectedRows();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		let comfirmMsg = t('msg.MSG_COM_PRT_003', []);
		const validationData = checkedRows.filter(
			(item: any) => (item.deliverygroup || '').length === 0 || (item.carno || '').length === 0,
		);

		// 필터링 행이 있으면 경고 메시지 표시
		if (validationData && validationData.length > 0) {
			comfirmMsg = 'POP 또는 차량번호가 지정되지 않은 배송분류표가 존재합니다 . 프린트 하시겠습니까?';
		}
		const searchParams = props.form.getFieldsValue();
		showConfirm(null, comfirmMsg, () => {
			const params = {
				avc_COMMAND: 'BATCHPRINT',
				crossDc: searchParams.crossDc,
				fixdccode: searchParams.fixdccode,
				invoiceno: checkedRows[0].invoiceno,
				dccode: mainRows[0].dccode,
				slipdt: mainRows[0].slipdt,
				tasksystem: mainRows[0].tasksystem,
				pickBatchNo: mainRows[0].pickBatchNo,
				pickListNo: mainRows[0].pickListNo,
				savePrintDetailList: checkedRows, // 선택된 행의 데이터
				usePgm: storeUtil.getMenuInfo().progCd,
				printorder: searchParams.printorder,
			};

			apiSavePrintDetailList(params).then(res => {
				//rd리포트 호출

				if (searchParams.labelPrintYn) {
					ref.gridRef3.current?.setGridData(res.data);
					const colSizeList = ref.gridRef3.current?.getFitColumnSizeList(true);
					// 구해진 칼럼 사이즈를 적용 시킴.
					ref.gridRef3.current?.setColumnSizeList(colSizeList);

					downloadExcel(); // 라벨출력 데이타와 비교하기 위해 엑셀로 다운받는다.
				} else {
					printList(res.data); // 배송라벨 출력
				}
				ref.gridRef2.current.clearGridData();
				props.search();
			});
		});
	};

	// 그리드 엑셀 다운로드
	const downloadExcel = () => {
		const params = {
			fileName: '배송라벨',
			exportWithStyle: true, // 스타일 적용 여부
			progressBar: true, // 진행바 표시 여부
		};
		ref.gridRef3.current.exportToXlsxGrid(params);
	};

	/**
	 * 배송라벨 출력
	 * @param data
	 */
	const printList = async (data: any) => {
		// 선택된 행이 없으면 경고 메시지 표시
		if (!data || data.length < 1) {
			showAlert(null, '배송라벨 출력 출력대상이 없습니다.');
			return;
		}

		// 3. 체크된 데이터를 담는다.
		const searchParams = props.form.getFieldsValue();
		const labelData1: any[] = [];
		const labelData2: any[] = [];
		for (const row of data) {
			if (row.lblFolabelYn === 'Y' && searchParams.fixdccode === '2260') {
				labelData1.push({
					manudate: row.lblManudate,
					custname1: row.lblCustname1,
					custname2: row.lblCustname2,
					skuname1: row.lblSkuname1,
					skuname2: row.lblSkuname2,
					qty: row.lblQty,
					qty2: row.lblQty2,
					pageno1: row.lblPageno1,
					pageno2: row.lblPageno2,
					placeoforigin: row.lblPlaceoforigin,
					deliverydt: row.lblDeliverydt,
					deliverygroup: row.lblDeliverygroup === 'INPLAN' ? '' : row.lblDeliverygroup,
					cargroup: row.lblCargroup === 'NODATA' ? '' : row.lblCargroup,
					from_custname: row.lblFromCustname,
					from_carname: row.lblFromCarname,
					loc: row.lblLoc,
					sku: row.lblSku,
					barcode1: row.lblBarcode1,
					barcode2: row.lblBarcode2,
					barcodetxt: row.lblBarcodetxt,
					qr_code: row.lblBarcode1,
					memoOfn: row.lblMemoOfn,
					storagetype: row.lblStoragetype,
					storagetype1: row.lblStoragetype1,
					storagetype2: row.lblStoragetype2,
					memo: row.lblMemo,
					etcMsg: row.lblEtcMsg,
					smsYn: row.lblSmsYn,
					Deliverygroup_chg: row.lblDeliverygroup === 'INPLAN' ? '' : row.lblDeliverygroupChg,
					markword: row.lblMarkword,
					title: row.title,
					qty1: row.qty1,
					dcname: row.dcname,
				});
			} else {
				labelData1.push({
					manudate: row.lblManudate,
					custname1: row.lblCustname1,
					custname2: row.lblCustname2,
					skuname1: row.lblSkuname1,
					skuname2: row.lblSkuname2,
					qty: row.lblQty,
					qty2: row.lblQty2,
					pageno1: row.lblPageno1,
					pageno2: row.lblPageno2,
					placeoforigin: row.lblPlaceoforigin,
					deliverydt: row.lblDeliverydt,
					deliverygroup: row.lblDeliverygroup === 'INPLAN' ? '' : row.lblDeliverygroup,
					cargroup: row.lblCargroup === 'NODATA' ? '' : row.lblCargroup,
					from_custname: row.lblFromCustname,
					from_carname: row.lblFromCarname,
					loc: row.lblLoc,
					sku: row.lblSku,
					barcode1: row.lblBarcode1,
					barcode2: row.lblBarcode2,
					barcodetxt: row.lblBarcodetxt,
					qr_code: row.lblBarcode1,
					memoOfn: row.lblMemoOfn,
					storagetype: row.lblStoragetype,
					storagetype1: row.lblStoragetype1,
					storagetype2: row.lblStoragetype2,
					memo: row.lblMemo,
					etcMsg: row.lblEtcMsg,
					smsYn: row.lblSmsYn,
					Deliverygroup_chg: row.lblDeliverygroup === 'INPLAN' ? '' : row.lblDeliverygroupChg,
					markword: row.lblMarkword,
					title: row.title,
					qty1: row.qty1,
					dcname: row.dcname,
				});
			}
		}

		// 4. 리포트 파일명
		const fileName: string[] = ['WD_Label_CJFWWD21.mrd'];

		// 5. 라벨 데이터 XML 생성을 위한 DataSet 생성
		const dataSet = [labelData1];

		// 6. 라벨 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
		const labelId: string[] = ['CJFWWD21'];

		// 7. 라벨 출력 (바로인쇄 or 미리보기)
		reportUtil.openLabelReportViewer(fileName, dataSet, labelId);
	};

	/**
	 * 배송분류표회수리스트 팝업 열기
	 */
	const onPrintListPopup = () => {
		const allRows = ref.gridRef.current.getGridData();
		if (allRows.length === 0) {
			showAlert(null, '인쇄할 정보가 없습니다.');
			return;
		}
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_007', ['출력 항목'])); // {0}을(를) 선택해 주십시오.
			return;
		}

		// if (checkedRows.length > 1) {
		// 	showAlert(null, t('msg.MSG_COM_VAL_011')); // 2건 이상 체크되었습니다. 1건만 선택되어야 합니다.
		// 	return;
		// }

		modalRef1.current.handlerOpen();
	};
	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
	};

	/**
	 * 팝업 닫기
	 * @param flag
	 */
	const closeEvent01 = (flag: string) => {
		if (!commUtil.isNull(flag)) {
			const selectedRow = ref.gridRef.current.getCheckedRowItemsAll();
			const searchParams = props.form.getFieldsValue();
			const params = {
				choice: flag,
				dccode: selectedRow[0].dccode,
				pickListNos: selectedRow.map((row: any) => row.pickListNo).join(','),
				storagetypes: selectedRow.map((row: any) => row.storagetype).join(','),
				slipdt: selectedRow[0].slipdt,
				printmethod: searchParams.printmethod,
				location: searchParams.crossDc,
			};

			if (searchParams.reporttype === '0') {
				apiGetTab1ReportList(params).then(res => {
					viewRdReportMaster(res);
				});
			} else if (searchParams.reporttype === '1') {
				apiGetTab1ReportCrossList(params).then(res => {
					viewRdReportCrossMaster(res);
				});
			}
		}
		modalRef1.current.handlerClose();
	};

	/**
	 * 리포트 뷰어 열기
	 * @param {any} res API 응답 데이터
	 */
	const viewRdReportMaster = (res: any) => {
		const { data } = res;

		if (data.length === 0) {
			showAlert(null, '인쇄할 정보가 없습니다.');
			return;
		}

		// 1. 리포트 파일명
		const fileName = 'WD_DeliveryLabel.mrd';

		// 2. 리포트에 XML 생성을 위한 DataSet 생성
		const dataSet = {
			ds_report: data, // 헤더 정보
		};

		// 3. 리포트에 전송할 파라미터
		const params = {
			TITLE: '배송분류표회수리스트',
		};

		reportUtil.openAgentReportViewer(fileName, dataSet, params);
	};

	/**
	 * 리포트 뷰어 열기
	 * @param {any} res API 응답 데이터
	 */
	const viewRdReportCrossMaster = (res: any) => {
		const { data } = res;

		if (data.length === 0) {
			showAlert(null, '인쇄할 정보가 없습니다.');
			return;
		}

		// 1. 리포트 파일명
		const fileName = 'WD_DeliveryCrossLabel.mrd';

		// 2. 리포트에 XML 생성을 위한 DataSet 생성
		const dataSet = {
			ds_report: data, // 헤더 정보
		};

		// 3. 리포트에 전송할 파라미터
		const params = {
			TITLE: 'CROSS배송분류표회수리스트',
		};

		reportUtil.openAgentReportViewer(fileName, dataSet, params);
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), //창고
			dataType: 'code',
		},
		{
			dataField: 'slipdt',
			headerText: t('lbl.DOCDT_WD'), //출고일자
			dataType: 'date',
		},
		{
			dataField: 'tasksystem',
			headerText: t('lbl.TASKSYSTEM_WD'), //작업방법
			dataType: 'code',
		},
		{
			headerText: t('lbl.BATCHINFO'), //배치정보
			children: [
				{
					dataField: 'plantdesc',
					headerText: t('lbl.BATCHGROUP'), //배치그룹
					dataType: 'code',
				},
				{
					dataField: 'storagetypedesc',
					headerText: t('lbl.STORAGETYPE'), //저장유형
					dataType: 'code',
				},
				{
					dataField: 'distancetype',
					headerText: t('lbl.PICKINGTYPE'), //원거리유형
					dataType: 'code',
				},
			],
		},
		{
			dataField: 'pickBatchNo',
			headerText: t('lbl.PICK_BATCH_NO'), //대배치키
			dataType: 'code',
		},
		{
			dataField: 'pickListNo',
			headerText: t('lbl.PICK_LIST_NO'), //피킹리스트번호
			dataType: 'code',
		},
		{
			dataField: 'pickNo',
			headerText: t('lbl.PICK_NO'), //피킹번호
			dataType: 'code',
		},
		{
			dataField: 'custcnt',
			headerText: t('lbl.CUSTCOUNT'), //고객수
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'docnocnt',
			headerText: t('lbl.DOCNOCOUNT'), //전표수
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'skucnt',
			headerText: t('lbl.SKUCOUNT'), //품목수
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'invoicecnt',
			headerText: t('lbl.CLASS_TICKET_CNT'), //분류표수
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'preprintcnt',
			headerText: t('lbl.NEW_PUBLICATION'), //신규발행
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'modifycnt',
			headerText: t('lbl.CHANGE_TARGET'), //변경대상
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'delcnt',
			headerText: t('lbl.RETURN_TARGET'), //회수대상
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: false, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'organize',
		},
		{
			dataField: 'custcnt',
			positionField: 'custcnt',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'docnocnt',
			positionField: 'docnocnt',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'skucnt',
			positionField: 'skucnt',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'invoicecnt',
			positionField: 'invoicecnt',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'preprintcnt',
			positionField: 'preprintcnt',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'modifycnt',
			positionField: 'modifycnt',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'delcnt',
			positionField: 'delcnt',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1',
				btnLabel: '배송분류표회수리스트',
				callBackFn: onPrintListPopup,
			},
			{
				btnType: 'print',
				callBackFn: () => {
					onPrintHeader();
				},
			},
		],
	};

	//그리드 컬럼(거래처별 그리드)
	const gridCol2 = [
		{
			dataField: 'invoiceno',
			headerText: t('lbl.INVOICENO') /*송장번호*/,
			dataType: 'code',
			styleFunction: function (
				rowIndex: any,
				columnIndex: any,
				value: any,
				headerText: any,
				item: any,
				dataField: any,
			) {
				return {
					color: item.statusColor,
				};
			},
		},
		{
			dataField: 'docno',
			headerText: t('lbl.DOCNO_WD') /*문서번호*/,
			dataType: 'code',
		},
		{
			dataField: 'docline',
			headerText: t('lbl.DOCLINE') /*문서라인*/,
			dataType: 'code',
		},
		{
			dataField: 'carno',
			headerText: t('lbl.CARNO') /*차량번호*/,
			dataType: 'code',
		},
		{
			dataField: 'cargroup',
			headerText: t('lbl.OUTTEAM') /*출차조*/,
			dataType: 'code',
		},
		{
			headerText: t('lbl.CUSTINFO') /*고객정보*/,
			children: [
				{
					dataField: 'deliverygroup',
					headerText: t('lbl.DELIVERYGROUP') /*배송그룹*/,
					dataType: 'code',
				},
				{
					dataField: 'custkey',
					headerText: t('lbl.TO_CUSTKEY_WD') /*관리처코드*/,
					dataType: 'code',
					filter: {
						showIcon: true,
					},
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(
								{
									custkey: e.item.custkey,
								},
								'cust',
							);
						},
					},
				},
				{
					dataField: 'custname',
					headerText: t('lbl.TO_CUSTNAME_WD2') /*관리처명(배송인도처)*/,
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			headerText: t('lbl.SKUINFO') /*상품정보*/,
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU') /*상품코드*/,
					dataType: 'code',
					filter: {
						showIcon: true,
					},
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(
								{
									sku: e.item.sku,
								},
								'sku',
							);
						},
					},
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME') /*상품명*/,
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			dataField: 'storagetypedesc',
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataType: 'code',
		},
		{
			dataField: 'storeruom',
			headerText: t('lbl.STORERUOM') /*단위*/,
			dataType: 'code',
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY_WD') /*주문수량*/,
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'stoYn',
			headerText: t('lbl.STO_FLAG_YN') /*STO주문여부*/,
			dataType: 'code',
		},
		{
			dataField: 'printYn',
			headerText: t('lbl.PRINT_YN') /*출력여부*/,
			dataType: 'code',
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.DELETE_YN') /*삭제여부*/,
			dataType: 'code',
		},
		{
			dataField: 'printDate',
			headerText: t('lbl.PRINTTIME') /*출력시간*/,
			dataType: 'date',
		},
		{
			dataField: 'printCnt',
			headerText: t('lbl.PRINTQTY') /*출력매수*/,
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'smsYn',
			headerText: t('lbl.SORTERTARGET') /*Sorter대상*/,
			dataType: 'code',
		},
	];

	// 그리드 Props(거래처별 그리드)
	const gridProps2 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		rowCheckDisabledFunction: (rowIndex: any, isChecked: any, item: any) => {
			if (item.statusColor == 'red') {
				//if (item.docline == '100') {	//비활성화 테스트용
				return false;
			}
			return true;
		},
	};

	// FooterLayout Props(거래처별 그리드)
	const footerLayout2 = [
		{
			labelText: '합계',
			positionField: 'invoiceno',
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
	];

	// 그리드 버튼
	const gridBtn2: GridBtnPropsType = {
		tGridRef: ref.gridRef2, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'print',
				callBackFn: () => {
					onPrint();
				},
			},
		],
	};

	//그리드 컬럼(거래처별 그리드)
	const gridCol3 = [
		{
			headerText: 'MANUDATE',
			dataField: 'lblManudate',
			dataType: 'date',
		},
		{
			headerText: 'CUSTNAME1',
			dataField: 'lblCustname1',
			dataType: 'code',
		},
		{
			headerText: 'CUSTNAME2',
			dataField: 'lblCustname2',
			dataType: 'code',
		},
		{
			headerText: 'SKUNAME1',
			dataField: 'lblSkuname1',
			dataType: 'code',
		},
		{
			headerText: 'SKUNAME2',
			dataField: 'lblSkuname2',
			dataType: 'code',
		},
		{
			headerText: 'QTY',
			dataField: 'lblQty',
			dataType: 'numeric',
		},
		{
			headerText: 'PAGENO1',
			dataField: 'lblPageno1',
			dataType: 'code',
		},
		{
			headerText: 'PLACEOFORIGIN',
			dataField: 'lblPlaceoforigin',
			dataType: 'code',
		},
		{
			headerText: 'DELIVERYDT',
			dataField: 'lblDeliverydt',
			dataType: 'date',
		},
		{
			headerText: 'DELIVERYGROUP',
			dataField: 'lblDeliverygroup',
			dataType: 'code',
		},
		{
			headerText: 'FROM_CUSTNAME',
			dataField: 'lblFromCustname',
			dataType: 'code',
		},
		{
			headerText: 'LOC',
			dataField: 'lblLoc',
			dataType: 'code',
		},
		{
			headerText: 'PAGENO2',
			dataField: 'lblPageno2',
			dataType: 'code',
		},
		{
			headerText: 'SKU',
			dataField: 'lblSku',
			dataType: 'code',
		},
		{
			headerText: 'ROUTENAME',
			dataField: 'lblRoutename',
			dataType: 'code',
		},
		{
			headerText: 'BARCODETXT',
			dataField: 'lblBarcodetxt',
			dataType: 'code',
		},
		{
			headerText: 'BARCODE1',
			dataField: 'lblBarcode1',
			dataType: 'code',
		},
		{
			headerText: 'BARCODE2',
			dataField: 'lblBarcode2',
			dataType: 'code',
		},
		{
			headerText: 'MEMO_OFN',
			dataField: 'lblMemoOfn',
			dataType: 'code',
		},
	];

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 1);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			} else {
				ref.gridRef2.current.clearGridData();
			}
		}
	}, [props.data]);

	let prevRowItem: any = null;
	useEffect(() => {
		ref.gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row의 item이 다를 경우에만 검색
			if (event.primeCell.item === prevRowItem || event.primeCell.dataField === 'customRowCheckYn') return;

			// 이전 행 item 갱신
			prevRowItem = event.primeCell.item;

			searchDtl();
		});
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridBtn={gridBtn2} gridTitle="상세" totalCnt={totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
						</GridAutoHeight>
					</>,
				]}
			/>

			<AGrid className="dp-none">
				<GridTopBtn gridBtn={gridBtn} gridTitle="배송라벨출력" />
				<AUIGrid ref={ref.gridRef3} columnLayout={gridCol3} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
			{/* 팝업.출력선택 */}
			<CustomModal ref={modalRef1} width="700px">
				<WdDeliveryLabelPrintPopup close={closeEvent01} />
			</CustomModal>
		</>
	);
});

export default WdDeliveryLabelTap1Detail;
