/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelTap2Detail.tsx
 # Description		: 배송라벨출력-STO Detail
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
import ExcelFileInput from '@/components/common/ExcelFileInput';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils
// API Call Function
import { apiGetPrintPickingList } from '@/api/wd/apiWdDeliveryLabelSN';

const WdDeliveryLabelTap2Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);

	// 그리드 컬럼 팝업용 Ref
	const refModal = useRef(null);

	// 업로드 파일 Ref
	const excelInputRef = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 피킹지출력
	 */
	const printPicking = async () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, '피킹지 출력대상이 없습니다.');
			return;
		}

		let barcode_list = '';
		checkedRows.forEach((row: any, idx: number) => {
			const lblBarcode1 = barcode_list === '' ? row.lblBarcode1 : ',' + row.lblBarcode1;
			barcode_list += lblBarcode1;
		});

		if (barcode_list == '') {
			showAlert(null, '바코드1 정보가 없는경우 출력을 진행할 수 없습니다.');
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_023', ['피킹지출력']), () => {
			const searchParams = form.getFieldsValue();
			const params = {
				invoiceno: barcode_list,
				memo: searchParams.printmemo,
				crossDc: searchParams.crossDc,
			};

			apiGetPrintPickingList(params).then(res => {
				//rd리포트 호출

				const fileNm = 'WD_Task_SN.mrd';

				const dataSet = {
					ds_reportHeader: res.data.reportHeaderList,
					ds_reportDetail: res.data.reportDetailList,
				};

				const params = {};

				reportUtil.openAgentReportViewer(fileNm, dataSet, params);
			});
		});
	};

	/**
	 * 엑셀 업로드
	 */
	const excelUpload = () => {
		excelInputRef.current?.click();
	};

	const onDataExcel = (data: any) => {
		// 현재 그리드 데이터
		const gridData = ref.gridRef.current.getGridData();

		if (data === undefined || data.length < 1) {
			showAlert(null, '업로드 파일에 입력 정보가 없습니다.');
			return;
		}

		const filteredData = data.filter((row: any) => row[19] !== null); //LBL_BARCODE1가 null이 아닌것만 그리드에 셋팅

		if (filteredData.length < 1) {
			showAlert(null, '업로드 파일에 바코드1 정보가 없습니다.');
			return;
		}

		data.forEach((row: any, ii: number) => {
			const newGridData = {
				dccode: row[1],
				dcname: row[2],
				toCustkey: row[3],
				lblCustname1: row[4],
				lblCustname2: row[5],
				lblSku: row[6],
				lblSkuname1: row[7],
				lblSkuname2: row[8],
				lblQty: row[9],
				lblPageno1: row[10],
				lblDeliverygroup: row[11],
				lblMemo: row[12],
				lblLoc: row[13],
				lblStoragetype: row[14],
				lblDeliverydt: row[15],
				lblFromCustname: row[16],
				lblPageno2: row[17],
				lblBarcodetxt: row[18],
				lblBarcode1: row[19],
				lblBarcode2: row[20],
				carchange: row[21],
				lblSmsYn: row[22],
				lblCargroup: row[23],
				lblMarkword: row[24],
			};
			ref.gridRef.current.addRow(newGridData);
		});
	};

	/**
	 * 배송라벨 출력
	 */
	const printList = async () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, '배송라벨 출력 출력대상이 없습니다.');
			return;
		}

		// 3. 체크된 데이터를 담는다.
		const labelData: any[] = [];
		// 인쇄 를/을 처리하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_CFM_020', [t('lbl.PRINT')]), async () => {
			for (const row of checkedRows) {
				if (commUtil.isEmpty(row.lblBarcode1)) {
					showAlert(null, t('바코드1 정보가 없는경우 출력을 진행할 수 없습니다.'));
					return;
				}

				labelData.push({
					// manudate: row.lblManudate, // 01.
					// custname1: row.lblCustname1,
					// custname2: row.lblCustname1,
					// skuname1: row.lblSkuname1, // 02.
					// skuname2: row.lblSkuname2, // 03.
					// qty: row.lblQty, // 06.
					// pageno1: row.lblPageno1, // 06.
					// placeoforigin: row.lblPlaceoforigin, // 06.
					// deliverydt: row.lblDeliverydt, // 06.
					// deliverygroup: row.lblDeliverygroup === 'INPLAN' ? '' : ',' + row.lblDeliverygroup, // 06.
					// cargroup: row.lblCargroup === 'NODATA' ? '' : ',' + row.lblCargroup, // 06.
					// fromCustname: row.lblFromCustname, // 04.
					// loc: row.lblLoc, // 04.
					// pageno2: row.lblPageno2, // 04.
					// sku: row.lblSku, // 04.
					// routename: row.lblRoutename, // 04.
					// barcodetxt: row.lblBarcodetxt + 'F', // 04.
					// barcode1: row.lblBarcode1, // 04.
					// barcode2: row.lblBarcode2, // 04.
					// storagetype: row.lblStoragetype, // 04.
					// memo: row.lblMemo, // 04.
					// etcMsg: row.lblEtcMsg, // 04.
					// smsYn: row.lblSmsYn, // 04.
					// DELIVERYGROUP_CHG: row.lblDeliverygroup === 'INPLAN' ? '' : ',' + row.lblDeliverygroupChg, // 06.
					// markword: row.lblMarkword, // 05.
					//
					custname1: row.lblCustname1,
					custname2: row.lblCustname2,
					skuname1: row.lblSkuname1,
					skuname2: row.lblSkuname2,
					qty: row.lblQty,
					pageno2: row.lblPageno2,
					deliverydt: row.lblDeliverydt,
					deliverygroup: row.lblDeliverygroup === 'INPLAN' ? '' : row.lblDeliverygroup,
					from_custname: row.lblFromCustname,
					loc: row.lblLoc,
					sku: row.lblSku,
					barcode2: row.lblBarcode2,
					barcodetxt: row.lblBarcodetxt + ' F',
					storagetype: row.lblStoragetype,
					qr_code: row.lblBarcode2, //AS-IS 소스에는 미정의. 라벨에는 필요한 컬럼임. 임시처리함. 2025.10.15 김동한
					pageno1: row.lblPageno1,
					cargroup: row.lblCargroup === 'NODATA' ? '' : row.lblCargroup,
					memo_ofn: '', //AS-IS 소스에는 미정의. 라벨에는 필요한 컬럼임. 임시처리함. 2025.10.15 김동한
					lbl_stoqty: '', //AS-IS 소스에는 미정의. 라벨에는 필요한 컬럼임. 임시처리함. 2025.10.15 김동한
					markword: row.lblMarkword,
					smsYn: row.lblSmsYn,
					temp1: '본마감[FO울산센터(물류대행)]', //AS-IS 소스에는 미정의. 라벨에는 필요한 컬럼임. 임시처리함. 2025.10.15 김동한(해당컬럼값에 대해서는 박의병님께 문의바람.)
				});
			}

			if (labelData.length === 0) {
				showAlert(null, t('msg.noPrintData')); // 인쇄할 데이터가 없습니다.
				return;
			}

			// 4. 리포트 파일명
			const fileName: string[] = ['WD_Label_CJFWWD22.mrd'];

			// 5. 라벨 데이터 XML 생성을 위한 DataSet 생성
			const dataSet = [labelData];

			// 6. 라벨 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
			const labelId: string[] = ['CJFWWD22'];

			// 7. 라벨 출력 (바로인쇄 or 미리보기)
			reportUtil.openLabelReportViewer(fileName, dataSet, labelId);
		});
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.DCCODE'), /*물류센터코드*/ dataField: 'dccode', dataType: 'code' },
		{ headerText: t('lbl.DCNAME'), /*물류센터명*/ dataField: 'dcname', dataType: 'code' },
		{
			headerText: t('lbl.TO_CUSTKEY_WD'),
			/*출고처관리코드*/ dataField: 'toCustkey',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.toCustkey,
						},
						'cust',
					);
				},
			},
		},
		{
			headerText: t('lbl.LBL_CUSTNAME1'),
			/*고객명1*/ dataField: 'lblCustname1',
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: t('lbl.LBL_CUSTNAME2'),
			/*고객명2*/ dataField: 'lblCustname2',
		},
		{
			headerText: t('lbl.LBL_SKU'),
			/*품목코드*/ dataField: 'lblSku',
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
			headerText: t('lbl.LBL_SKUNAME1'),
			/*품목명1*/ dataField: 'lblSkuname1',
			filter: {
				showIcon: true,
			},
		},
		{ headerText: t('lbl.LBL_SKUNAME2'), /*품목명2*/ dataField: 'lblSkuname2' },
		{ headerText: t('lbl.LBL_QTY'), /*수량*/ dataField: 'lblQty', dataType: 'numeric' }, // 수량(QTY) 필드이므로 'numeric'으로 변환
		{ headerText: t('lbl.LBL_PAGENO1'), /*페이지번호1*/ dataField: 'lblPageno1', dataType: 'code' },
		{ headerText: t('lbl.LBL_DELIVERYGROUP'), /*배송그룹*/ dataField: 'lblDeliverygroup', dataType: 'code' },
		{ headerText: t('lbl.LBL_MEMO'), /*메모*/ dataField: 'lblMemo' },
		{ headerText: t('lbl.LBL_LOC'), /*위치*/ dataField: 'lblLoc', dataType: 'code' },
		{ headerText: t('lbl.LBL_STORAGETYPE'), /*보관유형*/ dataField: 'lblStoragetype', dataType: 'code' },
		{ headerText: t('lbl.LBL_DELIVERYDT'), /*배송일자*/ dataField: 'lblDeliverydt', dataType: 'date' }, // 날짜 필드이므로 'date'로 변환
		{ headerText: t('lbl.LBL_FROM_CUSTNAME'), /*출발처명*/ dataField: 'lblFromCustname' },
		{ headerText: t('lbl.LBL_PAGENO2'), /*페이지번호2*/ dataField: 'lblPageno2', dataType: 'code' },
		{
			headerText: t('lbl.LBL_BARCODETXT'),
			/*바코드텍스트*/ dataField: 'lblBarcodetxt',
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
					color: item.printYn === 'Y' ? 'blue' : 'black',
				};
			},
		},
		{
			headerText: t('lbl.LBL_BARCODE1'),
			/*바코드1*/ dataField: 'lblBarcode1',
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
					color: item.printYn === 'Y' ? 'blue' : 'black',
				};
			},
		},
		{
			headerText: t('lbl.LBL_BARCODE2'),
			/*바코드2*/ dataField: 'lblBarcode2',
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
					color: item.printYn === 'Y' ? 'blue' : 'black',
				};
			},
		},
		{ headerText: t('lbl.CARCHANGE'), /*차량변경*/ dataField: 'carchange', dataType: 'code' },
		{ headerText: t('lbl.SORTERTARGET'), /*Sorter대상*/ dataField: 'lblSmsYn', dataType: 'code' },
		{ headerText: t('lbl.OUTTEAM'), /*출차조*/ dataField: 'lblCargroup', dataType: 'code' },
		{ headerText: t('lbl.VIPCUSTMARK'), /*특별관리고객표기*/ dataField: 'lblMarkword', dataType: 'code' },
		{ headerText: t('lbl.ZONE'), /*피킹존*/ dataField: 'zone', dataType: 'code' },
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: false, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props
	const footerLayout = [{}];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn3', //
				btnLabel: '피킹지출력', // 피킹지출력
				callBackFn: printPicking,
			},
			{
				btnType: 'btn4', //
				btnLabel: '엑셀업로드', // 엑셀업로드
				callBackFn: excelUpload,
			},
			{
				btnType: 'print',
				callBackFn: () => {
					printList();
				},
			},
		],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);

				/*
				const searchParams = form.getFieldsValue();
				const sortingInfo = [];
				// 차례로 각 컬럼에 대하여 각각 오름차순(1), 내림차순(-1) 지정.
				if (searchParams.printorder == 'SKU') {
					//1. SKU순
					sortingInfo[0] = { dataField: 'lblSkuname1', sortType: 1 };
					sortingInfo[1] = { dataField: 'lblSkuname2', sortType: 1 };
					sortingInfo[2] = { dataField: 'lblSku', sortType: 1 };
					sortingInfo[3] = { dataField: 'lblDeliverygroup', sortType: 1 };
					sortingInfo[4] = { dataField: 'lblCustname1', sortType: 1 };
					sortingInfo[5] = { dataField: 'invoicesort', sortType: 1 };
					sortingInfo[6] = { dataField: 'lblBarcode2', sortType: 1 };
				} else if (searchParams.printorder == 'POP') {
					//2. POP순
					sortingInfo[0] = { dataField: 'lblDeliverygroup', sortType: 1 };
					sortingInfo[1] = { dataField: 'lblSkuname1', sortType: 1 };
					sortingInfo[2] = { dataField: 'lblSkuname2', sortType: 1 };
					sortingInfo[3] = { dataField: 'lblSku', sortType: 1 };
					sortingInfo[4] = { dataField: 'lblCustname1', sortType: 1 };
					sortingInfo[5] = { dataField: 'invoicesort', sortType: 1 };
					sortingInfo[6] = { dataField: 'lblBarcode2', sortType: 1 };
				} else if (searchParams.printorder == 'POP_CUST_SKU') {
					//3. POP+고객+SKU순
					sortingInfo[0] = { dataField: 'lblDeliverygroup', sortType: 1 };
					sortingInfo[1] = { dataField: 'lblCustname1', sortType: 1 };
					sortingInfo[2] = { dataField: 'lblSkuname1', sortType: 1 };
					sortingInfo[3] = { dataField: 'lblSkuname2', sortType: 1 };
					sortingInfo[4] = { dataField: 'lblSku', sortType: 1 };
					sortingInfo[5] = { dataField: 'invoicesort', sortType: 1 };
					sortingInfo[6] = { dataField: 'lblBarcode2', sortType: 1 };
				} else if (searchParams.printorder == 'LOC_SKU_POP') {
					//4. 위치+SKU+POP순
					sortingInfo[0] = { dataField: 'locYn', sortType: 1 };
					sortingInfo[1] = { dataField: 'lblLoc', sortType: 1 };
					sortingInfo[2] = { dataField: 'lblSkuname1', sortType: 1 };
					sortingInfo[3] = { dataField: 'lblSkuname2', sortType: 1 };
					sortingInfo[4] = { dataField: 'lblSku', sortType: 1 };
					sortingInfo[5] = { dataField: 'lblDeliverygroup', sortType: 1 };
					sortingInfo[6] = { dataField: 'lblCustname1', sortType: 1 };
					sortingInfo[7] = { dataField: 'invoicesort', sortType: 1 };
					sortingInfo[8] = { dataField: 'lblBarcode2', sortType: 1 };
				} else if (searchParams.printorder == 'SKUPRIORITY') {
					//5. SKU 우선순위
					sortingInfo[0] = { dataField: 'skupriority', sortType: 1 };
					sortingInfo[1] = { dataField: 'locYn', sortType: 1 };
					sortingInfo[2] = { dataField: 'lblLoc', sortType: 1 };
					sortingInfo[3] = { dataField: 'lblSkuname1', sortType: 1 };
					sortingInfo[4] = { dataField: 'lblSkuname2', sortType: 1 };
					sortingInfo[5] = { dataField: 'lblSku', sortType: 1 };
					sortingInfo[6] = { dataField: 'lblDeliverygroup', sortType: 1 };
					sortingInfo[7] = { dataField: 'lblCustname1', sortType: 1 };
					sortingInfo[8] = { dataField: 'invoicesort', sortType: 1 };
					sortingInfo[9] = { dataField: 'lblBarcode2', sortType: 1 };
				} else if (searchParams.printorder == 'POP_LOC_SKU') {
					//6. POP+위치+SKU순
					sortingInfo[0] = { dataField: 'lblDeliverygroup', sortType: 1 };
					sortingInfo[1] = { dataField: 'locYn', sortType: 1 };
					sortingInfo[2] = { dataField: 'lblLoc', sortType: 1 };
					sortingInfo[3] = { dataField: 'lblSkuname1', sortType: 1 };
					sortingInfo[4] = { dataField: 'lblSkuname2', sortType: 1 };
					sortingInfo[5] = { dataField: 'lblSku', sortType: 1 };
					sortingInfo[6] = { dataField: 'lblCustname1', sortType: 1 };
					sortingInfo[7] = { dataField: 'invoicesort', sortType: 1 };
					sortingInfo[8] = { dataField: 'lblBarcode2', sortType: 1 };
				} else if (searchParams.printorder == 'PREPOP_POP_SKU') {
					//7. 선POP+POP+SKU순
					sortingInfo[0] = { dataField: 'predeliverygroup', sortType: 1 };
					sortingInfo[1] = { dataField: 'lblDeliverygroup', sortType: 1 };
					sortingInfo[2] = { dataField: 'lblSkuname1', sortType: 1 };
					sortingInfo[3] = { dataField: 'lblSkuname2', sortType: 1 };
					sortingInfo[4] = { dataField: 'lblSku', sortType: 1 };
					sortingInfo[5] = { dataField: 'lblCustname1', sortType: 1 };
					sortingInfo[6] = { dataField: 'invoicesort', sortType: 1 };
					sortingInfo[7] = { dataField: 'lblBarcode2', sortType: 1 };
				} else if (searchParams.printorder == 'SKU_DELIVERYGROUPSEQ') {
					//8. SKU+배송그룹순
					sortingInfo[0] = { dataField: 'lblSkuname1', sortType: 1 };
					sortingInfo[1] = { dataField: 'lblSkuname2', sortType: 1 };
					sortingInfo[2] = { dataField: 'lblSku', sortType: 1 };
					sortingInfo[3] = { dataField: 'deliverygroupSeq', sortType: 1 };
					sortingInfo[4] = { dataField: 'lblCustname1', sortType: 1 };
					sortingInfo[5] = { dataField: 'invoicesort', sortType: 1 };
					sortingInfo[6] = { dataField: 'lblBarcode2', sortType: 1 };
				} else if (searchParams.printorder == 'POP2') {
					//9. POP2순
					sortingInfo[0] = { dataField: 'deliverygroupSeq', sortType: 1 };
					sortingInfo[1] = { dataField: 'lblSkuname1', sortType: 1 };
					sortingInfo[2] = { dataField: 'lblSkuname2', sortType: 1 };
					sortingInfo[3] = { dataField: 'lblSku', sortType: 1 };
					sortingInfo[4] = { dataField: 'lblCustname1', sortType: 1 };
					sortingInfo[5] = { dataField: 'invoicesort', sortType: 1 };
					sortingInfo[6] = { dataField: 'lblBarcode2', sortType: 1 };
				} else if (searchParams.printorder == 'CARGROUP_ASC') {
					//10. 출차조순
					sortingInfo[0] = { dataField: 'lblCargroup', sortType: 1 };
					sortingInfo[1] = { dataField: 'deliverygroupSeq', sortType: 1 };
					sortingInfo[2] = { dataField: 'lblSkuname1', sortType: 1 };
					sortingInfo[3] = { dataField: 'lblSkuname2', sortType: 1 };
					sortingInfo[4] = { dataField: 'lblSku', sortType: 1 };
				} else if (searchParams.printorder == 'CARGROUP_DESC') {
					//11. 출차조역순
					sortingInfo[0] = { dataField: 'lblCargroup', sortType: -1 };
					sortingInfo[1] = { dataField: 'deliverygroupSeq', sortType: 1 };
					sortingInfo[2] = { dataField: 'lblSkuname1', sortType: 1 };
					sortingInfo[3] = { dataField: 'lblSkuname2', sortType: 1 };
					sortingInfo[4] = { dataField: 'lblSku', sortType: 1 };
				} else if (searchParams.printorder == 'LOC_SKU_POP_BOX') {
					//12. 위치+SKU+POP+BOX순
					sortingInfo[0] = { dataField: 'locYn', sortType: 1 };
					sortingInfo[1] = { dataField: 'lblLoc', sortType: 1 };
					sortingInfo[2] = { dataField: 'lblSkuname1', sortType: 1 };
					sortingInfo[3] = { dataField: 'lblSkuname2', sortType: 1 };
					sortingInfo[4] = { dataField: 'lblSku', sortType: 1 };
					sortingInfo[5] = { dataField: 'lblDeliverygroup', sortType: 1 };
					sortingInfo[6] = { dataField: 'lblCustname1', sortType: 1 };
					sortingInfo[7] = { dataField: 'lblBarcodetxt', sortType: -1 };
					sortingInfo[8] = { dataField: 'invoicesort', sortType: 1 };
				} else if (searchParams.printorder == 'STORAGE_LOC_SKU_POP') {
					//13. 보관위치+SKU+POP순
					sortingInfo[0] = { dataField: 'lblStoragetype', sortType: 1 };
					sortingInfo[1] = { dataField: 'lblLoc', sortType: 1 };
					sortingInfo[2] = { dataField: 'lblSku', sortType: 1 };
					sortingInfo[3] = { dataField: 'lblDeliverygroup', sortType: -1 };
				} else if (searchParams.printorder == 'STORAGE_GUBUN_LOC_SKU_POP') {
					//14. 보관구분+위치+SKU+POP순
					sortingInfo[0] = { dataField: 'storageGubun', sortType: -1 };
					sortingInfo[1] = { dataField: 'lblStoragetype', sortType: 1 };
					sortingInfo[2] = { dataField: 'lblLoc', sortType: 1 };
					sortingInfo[3] = { dataField: 'lblSku', sortType: 1 };
					sortingInfo[4] = { dataField: 'lblDeliverygroup', sortType: -1 };
				}
				gridRefCur1?.setSorting(sortingInfo);
				*/
			}
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>

			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>

			{/* 엑셀 업로드 영역 정의 */}
			<ExcelFileInput ref={excelInputRef} onData={onDataExcel} startRow={2} />
		</>
	);
});

export default WdDeliveryLabelTap2Detail;
