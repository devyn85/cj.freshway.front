/*
 ############################################################################
 # FiledataField	: WdInvoiceTotalDetail.tsx
 # Description		: 통합납품서출력(Detail)
 # Author			: Canal Frame
 # Since			: 25.06.10
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

const WdInvoiceTotalDetail = forwardRef((props: any, ref: any) => {
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
		const selectedRow = ref.gridRef.current.getSelectedRows();

		const params = {
			fixdccode: form.getFieldValue('fixdccode'),
			dt1: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[0].format('YYYYMMDD'),
			dt2: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[1].format('YYYYMMDD'),
			deliverygroup: form.getFieldValue('deliverygroup'),
			carno: form.getFieldValue('carno'),
			custkey: selectedRow[0].custkey,
			invoiceprinttype: commUtil.isNull(form.getFieldValue('invoiceprinttype'))
				? 'WD'
				: commUtil.nvl(form.getFieldValue('invoiceprinttype'), ''),
			invoicetype: selectedRow[0].invoicetype,
			searchcar: form.getFieldValue('carno')?.length > 0 || form.getFieldValue('deliverygroup')?.length > 0 ? 'Y' : 'N',
		};

		apiGetDetailList(params).then(res => {
			const gridData = res.data;
			ref.gridRef1.current?.setGridData(gridData);
			setDetailTotalCnt(gridData.length);
		});
	};

	const apiGetDetailList = (params: any) => {
		return axios.get('/api/wd/wdInvoiceTotal/v1.0/getDetailList', { params }).then(res => res.data);
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
				avc_COMMAND: form.getFieldValue('invoiceprinttype') === 'RTP' ? 'CREATION_TOTALFORM_RTP' : 'CREATION_TOTALFORM',
				invoiceprintkey: dateUtil.getToDay('YYYYMMDDHHMMss'),
				dt1: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[0].format('YYYYMMDD'),
				dt2: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[1].format('YYYYMMDD'),
				invoiceprinttype: commUtil.nvl(form.getFieldValue('invoiceprinttype'), ''),
				saveList: gridRef.getCheckedRowItemsAll(), // 선택된 행의 데이터
			};

			apiPostPrintMasterList(params).then(res => {
				if (res.statusCode > -1) {
					//showAlert(null, t('msg.save1')); // 저장되었습니다
					viewRdReportMaster(res); // 리포트 뷰어 열기)
				}
			});
		});
	};

	/**
	 * 출력 - 납품서 정보 조회 ( 상단 인쇄 ) API
	 * @param params
	 */
	const apiPostPrintMasterList = (params: any) => {
		return axios.post('/api/wd/wdInvoiceTotal/v1.0/printMasterList', params).then(res => res.data);
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
		//console.log(dsDetailTemp); // Now it's used

		if (dsDetailTemp.length > 0) {
			setCreditSaveData(dsDetailTemp); // 여신정보 조회
		} else {
			//showConfirm(null, t('msg.MSG_COM_CFM_023', ['인쇄']), () => {
			// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
			showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
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
			avc_COMMAND: form.getFieldValue('invoiceprinttype') === 'RTP' ? 'CREATION_TOTALFORM_RTP' : 'CREATION_TOTALFORM',
			invoiceprintkey: dateUtil.getToDay('YYYYMMDDHHMMss'),
			invoiceprinttype: commUtil.nvl(form.getFieldValue('invoiceprinttype'), ''),
			saveDetailList: gridRef.getCheckedRowItemsAll(), // 선택된 행의 데이터
		};

		apiPostPrintDetailList(params).then(res => {
			if (res.statusCode > -1) {
				//showAlert(null, t('msg.save1')); // 저장되었습니다
				viewRdReportDetail(res); // 리포트 뷰어 열기
			}
		});
	};

	/**
	 * 출력 - 납품서 정보 조회 ( 거래처별 인쇄 - 하단 그리드 ) API
	 * @param {any} params 등록 파라미터
	 * @returns {object} 성공여부 결과값
	 */
	const apiPostPrintDetailList = (params: any) => {
		return axios.post('/api/wd/wdInvoiceTotal/v1.0/printDetailList', params).then(res => res.data);
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
	const viewRdReportMaster = (res: any) => {
		if (!res.data.reportHeader || res.data.reportHeader.length < 1) {
			showAlert(null, t('msg.MSG_RPT_ERR_002')); // 데이터가 없습니다.
			return;
		}

		// 1. 리포트 파일명
		const fileName = 'WD_Invoice_NoAppr_ver6.mrd';

		// 2. 리포트에 XML 생성을 위한 DataSet 생성
		const dataSet = {
			ds_reportHeader: res.data.reportHeader,
			ds_reportDetail: res.data.reportDetailList, // 상세 정보
			ds_reportCredit01: res.data.reportCredit.filter((item: any) => ['01'].includes(item.invoicetype)), // 크레딧 정보 01
			ds_reportCredit04: res.data.reportCredit.filter((item: any) => ['04'].includes(item.invoicetype)), // 크레딧 정보 02
			ds_reportCredit12: res.data.reportCredit.filter((item: any) => ['12'].includes(item.invoicetype)), // 크레딧 정보 12
			ds_reportDlvCost: res.data.reportDlvCost, // 배송비용
			//INVOICE_TITLE: doctype == 'RT' ? '반품납품서 (공급받는자용)' : '납품서 (공급받는자용)', // 문서유형에 따라 타이틀 변경
		};

		// 3. 리포트에 전송할 파라미터
		const params: any = {};
		const doctype = res.data.reportHeader[0].doctype; // 문서유형

		if (doctype === 'WD') {
			params.INVOICE_TITLE = '납품서 (공급받는자용)';
		} else if (doctype === 'RT') {
			params.INVOICE_TITLE = '납품서 (공급받는자용)';
		}

		reportUtil.openAgentReportViewer(fileName, dataSet, params);
	};

	/**
	 * 리포트 뷰어 열기 - 거래처별 인쇄
	 * @param {any} res API 응답 데이터
	 */
	const viewRdReportDetail = (res: any) => {
		if (res.data.reportHeader[0].length < 1) {
			showAlert(null, t('msg.MSG_RPT_ERR_002')); // 데이터가 없습니다.
			return;
		}

		// 1. 리포트 파일명
		const fileName = 'WD_Invoice_NoAppr_ver6.mrd';

		// 2. 리포트에 XML 생성을 위한 DataSet 생성
		const dataSet = {
			ds_reportHeader: res.data.reportHeader, // 헤더 정보
			ds_reportDetail: res.data.reportDetailList, // 상세 정보
			ds_reportCredit01: res.data.reportCredit.filter((item: any) => ['01'].includes(item.invoicetype)), // 크레딧 정보 01
			ds_reportCredit04: res.data.reportCredit.filter((item: any) => ['04'].includes(item.invoicetype)), // 크레딧 정보 02
			ds_reportCredit12: res.data.reportCredit.filter((item: any) => ['12'].includes(item.invoicetype)), // 크레딧 정보 12
			ds_reportDlvCost: res.data.reportDlvCost, // 배송비용
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
			headerText: t('lbl.CARNO'), // 차량번호
			dataField: 'carno',
			dataType: 'code',
			// width: 150,
		},
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
			headerText: t('lbl.TO_CUSTKEY_WD'), // 관리처코드
			dataField: 'custkey',
			dataType: 'code',
			// width: 150,
		},
		{
			headerText: t('lbl.TO_CUSTNAME_WD'), // 관리처명
			dataField: 'custname',
			// width: 400,
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		showStateColumn: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		//independentAllCheckBox: true,
		fillColumnSizeMode: true,
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
			headerText: t('lbl.SOURCECONFIRMDATE_RT'), // 출고일자
			dataField: 'deliverydt',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			headerText: t('lbl.CARNO'), // 차량번호
			dataField: 'carno',
			dataType: 'code',
			width: 150,
		},
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
			headerText: t('lbl.TO_VATNO'), // 판매처코드
			dataField: 'custkey',
			dataType: 'code',
			width: 150,
		},
		{
			headerText: t('lbl.TO_VATOWNER'), // 판매처명
			dataField: 'custname',
			width: 400,
		},
		{
			headerText: t('lbl.TO_CUSTKEY_WD'), // 분할관리처코드
			dataField: 'mngplcid',
			dataType: 'code',
			width: 150,
		},
		{
			headerText: t('lbl.TO_CUSTNAME_WD'), // 분할관리처명
			dataField: 'mngplcname',
			width: 400,
		},
		{
			headerText: t('lbl.INVOICETYPE'), // 납품서유형
			dataField: 'invoicetypedesc',
			width: 400,
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
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	let prevRowIndex: any = null;
	useEffect(() => {
		ref.gridRef.current?.resize('100%', '100%');
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
		ref.gridRefFile?.current?.resize?.('100%', '100%');
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
			<CustomModal ref={refModal} width="1280px" />
		</>
	);
});
export default WdInvoiceTotalDetail;
