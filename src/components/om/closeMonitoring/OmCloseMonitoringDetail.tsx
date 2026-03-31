/*
 ############################################################################
 # FiledataField	: OmCloseMonitoringDetail.tsx
 # Description		: 마감주문반영 Detail
 # Author			: 공두경
 # Since			: 25.06.23
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
import { showAlert, showConfirm } from '@/util/MessageUtil';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// API Call Function

const OmCloseMonitoringDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);
	const { form } = props;

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 마감주문반영
	 */
	const onClickCloseSave = () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		showConfirm(null, t('msg.MSG_COM_CFM_020', ['마감주문반영']), () => {
			const searchParams = form.getFieldsValue();

			const params = {
				apiUrl: '/api/om/omCloseMonitoring/v1.0/saveConfirm',
				avc_COMMAND: 'ORDERCLOSE',
				deliverydt: searchParams.searchDate.format('YYYYMMDD'),
				dataKey: 'saveList',
				saveDataList: checkedRows, // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
		props.search();
	};

	// 그리드 엑셀 다운로드
	const downloadExcel = () => {
		const params = {
			fileName: '마감주문반영목록',
			exportWithStyle: true, // 스타일 적용 여부
			progressBar: true, // 진행바 표시 여부
		};
		ref.gridRef.current.exportToXlsxGrid(params);
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.DCCODE'), dataField: 'dccode', dataType: 'code' },
		{
			headerText: t('lbl.DELIVERYDATE'),
			dataField: 'deliverydate',
			dataType: 'date',
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8); // 날짜 형식으로 변환
			},
		},
		{ headerText: t('lbl.DOCTYPE'), dataField: 'doctype', dataType: 'code' },
		{ headerText: t('lbl.DOCNO'), dataField: 'docno', dataType: 'code' },
		{ headerText: t('lbl.DOCLINE'), dataField: 'docline', dataType: 'code' },
		{
			headerText: t('lbl.SKU'),
			dataField: 'sku',
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
			headerText: t('lbl.SKUNAME'),
			dataField: 'skuname',
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: t('lbl.STORERORDERQTY2'),
			dataField: 'storerorderqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.STORERCONFIRMQTY'),
			dataField: 'storerconfirmqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{ headerText: t('lbl.ORDERQTY'), dataField: 'orderqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: t('lbl.PROCESSQTY'), dataField: 'processqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: t('lbl.WORKQTY'), dataField: 'workqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: t('lbl.INSPECTQTY'), dataField: 'inspectqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: t('lbl.INVOICEQTY'), dataField: 'invoiceqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: t('lbl.CONFIRMQTY'), dataField: 'confirmqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: t('lbl.CHANNEL_DMD'), dataField: 'channel', dataType: 'code' },
		{ headerText: t('lbl.ERRMSG'), dataField: 'errmsg' },
		{ headerText: t('lbl.CLOSETIME_STANDARD'), dataField: 'closetimeStandard' },
		{ headerText: t('lbl.CUST'), dataField: 'custkey', dataType: 'code' },
		{ headerText: t('lbl.CUST_NAME'), dataField: 'custname' },
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		showRowCheckColumn: true,
		fillColumnSizeMode: false,
		showFooter: false,
	};

	// FooterLayout Props
	const footerLayout = [{}];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelDownload', // excelDownload
				callBackFn: downloadExcel,
			},
			{
				btnType: 'btn1',
				btnLabel: '마감주문반영', // 마감주문반영
				callBackFn: onClickCloseSave,
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
			}
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle="전표모니터링" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default OmCloseMonitoringDetail;
