/*
 ############################################################################
 # FiledataField	: WdInvoiceDetail.tsx
 # Description		: 납품서출력(Detail)
 # Author			: KimDongHyeon
 # Since			: 2025.11.03
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
import axios from '@/api/Axios';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
import commUtil from '@/util/commUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
// Redux
import CustomModal from '@/components/common/custom/CustomModal';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import reportUtil from '@/util/reportUtil';
// API Call Function
const { VITE_EDMS_IMG_URL } = import.meta.env; // EDMS 이미지 URL

const WdInvoiceDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form } = props; // Antd Form
	const [detailTotalCnt, setDetailTotalCnt] = useState(0);

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	ref.gridRef1 = useRef(null);
	const refModal = useRef(null);

	// Declare init value(3/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 상세 조회
	 */
	const searchDetailList = () => {
		const selectedRow = ref.gridRef.current.getSelectedRows()[0];

		const requestParams = form.getFieldsValue();
		requestParams.invoicedt = requestParams.invoicedt.format('YYYYMMDD');

		const params = {
			...selectedRow,
			toCustkey: requestParams.toCustkey,
			fixdccode: requestParams.fixdccode,
			invoiceprinttype: 'TOTAL',
		};

		apiGetDetailList(params).then(res => {
			const gridData = res.data;
			ref.gridRef1.current?.setGridData(gridData);
			setDetailTotalCnt(gridData.length);
		});
	};

	const apiGetDetailList = (params: any) => {
		return axios.post('/api/wd/wdInvoice/v1.0/getDetailList', params).then(res => res.data);
	};

	/**
	 * 출력 - 납품서 정보 조회 ( 상단 인쇄 )
	 */
	const printMasterList = () => {
		const gridRef = ref.gridRef.current; // 차량별 그리드

		if (gridRef.getCheckedRowItemsAll().length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		//showConfirm(null, t('msg.MSG_COM_CFM_023', ['인쇄']), () => {
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			const params = {
				gDccode: form.getFieldValue('fixdccode'),
				avc_COMMAND: 'CREATION_DELIVERYFORM',
				invoiceprintkey: dateUtil.getToDay('YYYYMMDDHHMMss'),
				invoiceprinttype: 'TOTAL',
				gubun: commUtil.nvl(form.getFieldValue('gubun'), ''),
				custkey: commUtil.nvl(form.getFieldValue('toCustkey'), ''),
				saveList: gridRef.getCheckedRowItemsAll(), // 선택된 행의 데이터
			};

			apiPostPrintMasterList(params).then(res => {
				if (res.statusCode > -1) {
					//showAlert(null, t('msg.save1')); // 저장되었습니다
					viewRdReport(res); // 리포트 뷰어 열기)
				}
			});
		});
	};

	/**
	 * 출력 - 납품서 정보 조회 ( 상단 인쇄 ) API
	 * @param params
	 */
	const apiPostPrintMasterList = (params: any) => {
		return axios.post('/api/wd/wdInvoice/v1.0/printMasterList', params).then(res => res.data);
	};

	/**
	 * 출력 - 납품서 정보 조회 ( 거래처별 인쇄 - 하단 그리드)
	 */
	const printDetailList = () => {
		const gridRef = ref.gridRef1.current; // 거래처별 그리드
		const checkedRows = ref.gridRef1.current.getCheckedRowItemsAll();

		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 필터링된 데이터 (납품서 유형이 '01', '04', '12'인 경우만)
		const dsDetailTemp = checkedRows.filter((item: any) => ['01', '04', '12'].includes(item.invoicetype));

		if (dsDetailTemp.length > 0) {
			setCreditSaveData(dsDetailTemp); // 여신정보 조회
		} else {
			// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
			showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
				//showConfirm(null, t('msg.MSG_COM_CFM_023', ['인쇄']), () => {
				// {{0}} 를/을 처리하시겠습니까?
				printDetailListImp();
			});
		}
	};

	/**
	 * 출력 - 납품서 정보 조회 구현( 거래처별 인쇄 - 하단 그리드)
	 * @param params
	 */
	const printDetailListImp = () => {
		const gridRef = ref.gridRef1.current; // 거래처별 그리드

		const params = {
			gDccode: form.getFieldValue('fixdccode'),
			avc_COMMAND: 'CREATION_DELIVERYFORM',
			invoiceprintkey: dateUtil.getToDay('YYYYMMDDHHMMss'),
			invoiceprinttype: 'TOTAL',
			gubun: commUtil.nvl(form.getFieldValue('gubun'), ''),
			saveDetailList: gridRef.getCheckedRowItemsAll(), // 선택된 행의 데이터
		};

		apiPostPrintDetailList(params).then(res => {
			if (res.statusCode > -1) {
				viewRdReport(res); // 리포트 뷰어 열기
			}
		});
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
	 * 여신정보를 현행화하는 처리
	 * @param dsDetailTemp
	 */
	const setCreditSaveData = (dsDetailTemp: any) => {
		const params = {
			saveDetailList: dsDetailTemp, // 선택된 행의 데이터
		};

		apiPostSaveData(params).then(res => {
			if (res.statusCode > -1) {
				printDetailListImp();
			}
		});
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
		if (form.getFieldValue('amtYn')) {
			fileName = 'WD_Invoice_NoAMT.mrd';
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
	 * 팝업 취소 버튼
	 */
	const closeEventRdReport = () => {
		refModal.current.handlerClose();
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		{
			dataField: 'carno',
			headerText: t('lbl.CARNO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'shortno',
			headerText: t('단축번호'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'priority',
			headerText: t('lbl.PRIORITY'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'deliverygroup',
			headerText: t('lbl.DELIVERYGROUP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'custcnt',
			headerText: t('lbl.CUST_CNT'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'slipcnt',
			headerText: t('lbl.SLIPCNT'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		showStateColumn: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		//independentAllCheckBox: true,
		fillColumnSizeMode: false,
		showFooter: false,
		// rowStyleFunction: function (rowIndex: any, item: any) {
		// 	if (item.delYn != 'N') {
		// 		return 'color-danger';
		// 	}
		// 	return '';
		// },
	};

	// FooterLayout Props
	const footerLayout = [{}];
	const footerLayout1 = [{}];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'print', // 프린트
				callBackFn: printMasterList,
			},
		],
	};

	// 그리드 컬럼(상세목록 그리드)
	const gridCol1 = [
		{
			headerText: t('lbl.TRUTH_CUSTKEY'),
			dataField: 'truthcustkey',
			dataType: 'code',
			// width: 150,
		},
		{
			headerText: t('lbl.TRUTH_CUSTNAME'),
			dataField: 'truthcustname',
			// width: 400,
		},
		{
			dataField: 'custkey',
			headerText: t('lbl.TO_VATNO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'custname',
			headerText: t('lbl.TO_VATOWNER'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toCustkey',
			headerText: t('lbl.TO_CUSTKEY_WD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toCustname',
			headerText: t('lbl.TO_CUSTNAME_WD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'invoicetypedesc',
			headerText: t('lbl.INVOICETYPE'),
			dataType: 'code',
			editable: false,
		},
	];

	// 그리드 Props(상세목록 그리드)
	const gridProps1 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		fillColumnSizeMode: false,
		showFooter: true,
		// rowStyleFunction: function (rowIndex: any, item: any) {
		// 	if (item.delYn != 'N') {
		// 		return 'color-danger'; // CSS 클래스 이름 반환
		// 	}
		// 	return ''; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
		// },
	};

	// 그리드 버튼
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 거래처별인쇄
				btnLabel: '거래처별인쇄', // 거래처별인쇄
				callBackFn: printDetailList,
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
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);
				//gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	let prevRowIndex: any = null;
	useEffect(() => {
		ref.gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;
			const field = event.primeCell.dataField;
			if (ref.gridRef.current.getColumnItemByDataField(field)?.renderer?.type == 'DropDownListRenderer') {
				return;
			}

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell?.item?._$uid;
			// 상세코드 조회
			searchDetailList();
		});
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn1} gridTitle={t('lbl.DETAIL_TAB')} totalCnt={detailTotalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef1} columnLayout={gridCol1} gridProps={gridProps1} footerLayout={footerLayout1} />
						</GridAutoHeight>
					</>,
				]}
			/>
			<CustomModal ref={refModal} width="1280px"></CustomModal>
		</>
	);
});
export default WdInvoiceDetail;
