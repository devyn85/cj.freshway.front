/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelSNTap2Detail.tsx
 # Description		: 이력배송라벨출력-분류표출력 Detail
 # Author			: 공두경
 # Since			: 25.10.15
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
import { apiGetPrintPickingList, apiSaveInvoiceNoPrtYn } from '@/api/wd/apiWdDeliveryLabelSN';
import GridAutoHeight from '@/components/common/GridAutoHeight';

const WdDeliveryLabelSNTap2Detail = forwardRef((props: any, ref: any) => {
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
			const searchParams = props.form.getFieldsValue();

			const params = {
				invoiceno: barcode_list,
				memo: searchParams.printmemo,
				crossDc: searchParams.crossDc,
			};

			apiGetPrintPickingList(params).then(res => {
				//rd리포트 호출

				//const fileNm = 'WD_Task_SN.mrd';
				const fileNm = 'WD_Task_Type2600.mrd';

				const dataSet = {
					ds_reportHeader: res.data.reportHeaderList.map((item: any) => ({ ...item, printCnt: '' })),
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
		const checkedItems = ref.gridRef.current?.getCheckedRowItemsAll({ isGetRowIndexInItem: true });
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, '배송라벨 출력 출력대상이 없습니다.');
			return;
		}

		// 체크한 항목은 rowIndex 기준 오름차순 정렬
		const sortItem = checkedItems.sort((a: any, b: any) => (a.rowIndex ?? 0) - (b.rowIndex ?? 0));

		// 3. 체크된 데이터를 담는다.
		const searchParams = props.form.getFieldsValue();
		const labelData: any[] = [];
		// 인쇄 를/을 처리하시겠습니까?
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			//showConfirm(null, t('msg.MSG_COM_CFM_020', [t('lbl.PRINT')]), async () => {
			let strInvoiceNo_prt = '';
			//for (const row of checkedRows) {
			for (const row of sortItem) {
				if (commUtil.isEmpty(row.lblBarcode1)) {
					showAlert(null, t('바코드1 정보가 없는경우 출력을 진행할 수 없습니다.'));
					return;
				}
				if (row.lblFolabelYn === 'Y' && searchParams.fixdccode === '2260') {
					labelData.push({
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
						barcodetxt: row.lblBarcodetxt + ' F',
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
						qty1: row.totalqty,
						dcname: row.dcname,
					});
				} else {
					labelData.push({
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
						qty1: row.totalqty,
						dcname: row.dcname,
					});
				}
				// INVOICE번호 출력여부 저장을 위한 INVOICE번호 셋팅
				if (strInvoiceNo_prt.length > 0) strInvoiceNo_prt += ',';
				strInvoiceNo_prt += row.lblBarcode1;
			}

			if (labelData.length === 0) {
				showAlert(null, t('msg.noPrintData')); // 인쇄할 데이터가 없습니다.
				return;
			}
			const params = {
				invoiceNoPrint: strInvoiceNo_prt,
			};
			apiSaveInvoiceNoPrtYn(params).then(res => {
				// 정상처리
				props.search(); // 검색 함수 호출
			});

			// 4. 리포트 파일명
			//const fileName: string[] = ['WD_Label_CJFWWD22.mrd'];
			const fileName: string[] = ['WD_Label_CJFWWD21.mrd'];

			// 5. 라벨 데이터 XML 생성을 위한 DataSet 생성
			const dataSet = [labelData];

			// 6. 라벨 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
			//const labelId: string[] = ['CJFWWD22'];
			const labelId: string[] = ['CJFWWD21'];

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
		{ headerText: t('lbl.DCCODE'), /*물류센터코드*/ dataField: 'dccode', dataType: 'code', editable: false },
		{ headerText: t('lbl.DCNAME'), /*물류센터명*/ dataField: 'dcname', dataType: 'code', editable: false },
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
			editable: false,
		},
		{
			headerText: t('lbl.LBL_CUSTNAME1'),
			/*고객명1*/ dataField: 'lblCustname1',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			headerText: t('lbl.LBL_CUSTNAME2'),
			/*고객명2*/ dataField: 'lblCustname2',
			editable: false,
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
			editable: false,
		},
		{
			headerText: t('lbl.LBL_SKUNAME1'),
			/*품목명1*/ dataField: 'lblSkuname1',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{ headerText: t('lbl.LBL_SKUNAME2'), /*품목명2*/ dataField: 'lblSkuname2', editable: false },
		{ headerText: t('lbl.LBL_QTY'), /*수량*/ dataField: 'lblQty', dataType: 'numeric', editable: false }, // 수량(QTY) 필드이므로 'numeric'으로 변환
		{ headerText: t('lbl.LBL_PAGENO1'), /*차량번호*/ dataField: 'lblPageno1', dataType: 'code' },
		{ headerText: t('lbl.LBL_DELIVERYGROUP'), /*배송그룹*/ dataField: 'lblDeliverygroup', dataType: 'code' },
		{ headerText: t('lbl.LBL_MEMO'), /*메모*/ dataField: 'lblMemo' },
		{ headerText: t('lbl.LBL_LOC'), /*위치*/ dataField: 'lblLoc', dataType: 'code' },
		{
			headerText: t('lbl.LBL_STORAGETYPE'),
			/*보관유형*/ dataField: 'lblStoragetype',
			dataType: 'code',
			editable: false,
		},
		{ headerText: t('lbl.LBL_DELIVERYDT'), /*배송일자*/ dataField: 'lblDeliverydt', dataType: 'date', editable: false }, // 날짜 필드이므로 'date'로 변환
		{ headerText: t('lbl.LBL_FROM_CUSTNAME'), /*업체명*/ dataField: 'lblFromCustname' },
		{ headerText: t('lbl.LBL_PAGENO2'), /*페이지번호2*/ dataField: 'lblPageno2', dataType: 'code', editable: false },
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
					color: item?.printYn === 'Y' ? 'blue' : 'black',
				};
			},
			editable: false,
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
					color: item?.printYn === 'Y' ? 'blue' : 'black',
				};
			},
			editable: false,
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
					color: item?.printYn === 'Y' ? 'blue' : 'black',
				};
			},
			editable: false,
		},
		{ headerText: t('lbl.CARCHANGE'), /*차량변경*/ dataField: 'carchange', dataType: 'code', editable: false },
		{ headerText: t('lbl.SORTERTARGET'), /*Sorter대상*/ dataField: 'lblSmsYn', dataType: 'code', editable: false },
		{ headerText: t('lbl.OUTTEAM'), /*출차조*/ dataField: 'lblCargroup', dataType: 'code' },
		{
			headerText: t('lbl.VIPCUSTMARK'),
			/*특별관리고객표기*/ dataField: 'lblMarkword',
			dataType: 'code',
			editable: false,
		},
		{ headerText: t('lbl.ZONE'), /*피킹존*/ dataField: 'zone', dataType: 'code', editable: false },
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
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
				props.gridSort();
			}
		}
	}, [props.data]);

	useEffect(() => {
		ref.gridRef.current.bind('cellEditBegin', (event: any) => {
			return ['lblPageno1', 'lblCargroup', 'lblDeliverygroup', 'lblMemo', 'lblLoc', 'lblFromCustname'].includes(
				event.dataField,
			);
		});
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid style={{ padding: '10px 0 ', marginBottom: 0 }}>
				<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>

			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>

			{/* 엑셀 업로드 영역 정의 */}
			<ExcelFileInput ref={excelInputRef} onData={onDataExcel} startRow={1} />
		</>
	);
});

export default WdDeliveryLabelSNTap2Detail;
