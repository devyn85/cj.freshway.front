/*
 ############################################################################
 # FiledataField	: OmOrderCustDailyDetail.tsx
 # Description		: 일배협력사별주문현황(Detail)
 # Author			: 공두경
 # Since			: 25.06.17
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';
// API Call Function
import { apiGetDataPrintList, apiGetDetailList } from '@/api/om/apiOmOrderCustDaily';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import reportUtil from '@/util/reportUtil';

const OmOrderCustDailyDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
	ref.gridRef3 = useRef(null);
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);

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
			fixdccode: searchParams.fixdccode,
			fromcustkey: selectedRow[0].fromCustkey,
			fromSlipdt: searchParams.slipdtRange[0].format('YYYYMMDD'),
			toSlipdt: searchParams.slipdtRange[1].format('YYYYMMDD'),
			tocustkey: searchParams.tocustkey,
			sku: searchParams.sku,
			status: searchParams.status,
			storagetype: searchParams.storagetype,
			docno: searchParams.docno,
			serialno: searchParams.serialno,
			blno: searchParams.blno,
			contractcompany: searchParams.contractcompany,
			delYn: searchParams.delYn,
			serialCheck: '',
		};

		if (
			!commUtil.isNull(searchParams.blno) ||
			!commUtil.isNull(searchParams.serialno) ||
			!commUtil.isNull(searchParams.contractcompany)
		) {
			params.serialCheck = 'Y';
		}

		apiGetDetailList(params).then(res => {
			const gridData = res.data;
			ref.gridRef2.current?.setGridData(gridData);
			//setTotalCnt(res.data.length);
			const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef2.current?.setColumnSizeList(colSizeList);
		});
	};

	// 그리드 엑셀 다운로드 정보 조회
	const searchPrint = () => {
		const selectedRow = ref.gridRef.current.getSelectedRows();
		const searchParams = props.form.getFieldsValue();

		const params = {
			fixdccode: searchParams.fixdccode,
			fromcustkey: '',
			fromSlipdt: searchParams.slipdtRange[0].format('YYYYMMDD'),
			toSlipdt: searchParams.slipdtRange[1].format('YYYYMMDD'),
			tocustkey: searchParams.tocustkey,
			sku: searchParams.sku,
			status: searchParams.status,
			storagetype: searchParams.storagetype,
			docno: searchParams.docno,
			serialno: searchParams.serialno,
			blno: searchParams.blno,
			contractcompany: searchParams.contractcompany,
			delYn: searchParams.delYn,
			serialCheck: '',
		};

		if (selectedRow.length === 1) {
			params.fromcustkey = selectedRow[0].fromCustkey;
		}

		if (
			!commUtil.isNull(searchParams.blno) ||
			!commUtil.isNull(searchParams.serialno) ||
			!commUtil.isNull(searchParams.contractcompany)
		) {
			params.serialCheck = 'Y';
		}

		apiGetDataPrintList(params).then(res => {
			const printData = res.data;

			if (printData.length > 0) {
				//RD 호출
				const dataSet = {
					ds_report: printData, // 헤더 정보
				};

				// 3. 리포트에 전송할 파라미터
				const selectedRow = ref.gridRef.current.getSelectedRows()[0];
				const params: any = {};
				params.TITLE = '일배 협력사별 주문현황';
				params.FROMDT = searchParams.slipdtRange[0].format('YYYYMMDD');
				params.TODT = searchParams.slipdtRange[1].format('YYYYMMDD');
				params.FROMCUSTKEY = selectedRow.fromCustkey;
				params.FROMCUSTNAME = selectedRow.fromCustname;
				params.ORDERCNT = selectedRow.ordercnt;
				params.DP_CONFIRMWEIGHT = selectedRow.dpConfirmweight;
				params.WD_CONFIRMWEIGHT = selectedRow.wdConfirmweight;
				params.CANCELCNT = selectedRow.cancelcnt;

				reportUtil.openAgentReportViewer('OM_OrderCustDaily.mrd', dataSet, params);
			} else {
				showAlert(null, t('msg.MSG_RPT_ERR_002')); // 데이터가 없습니다.
			}
		});
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'fromCustkey',
			headerText: '협력사코드',
			dataType: 'code',
			filter: { showIcon: true },
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.fromCustkey,
							custtype: 'P' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
						},
						'cust',
					);
				},
			},
		},
		{ headerText: '협력사명', dataField: 'fromCustname', filter: { showIcon: true } },
		{ headerText: '오더건수', dataField: 'ordercnt', dataType: 'numeric' },
		{ headerText: '주문중량(kg)', dataField: 'dpConfirmweight', dataType: 'numeric' },
		{ headerText: '출고중량(kg)', dataField: 'wdConfirmweight', dataType: 'numeric' },
		{ headerText: '결품건수', dataField: 'cancelcnt', dataType: 'numeric' },
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
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
				btnType: 'print', // print
				callBackFn: searchPrint,
			},
		],
	};

	//그리드 컬럼(상세목록 그리드)
	const gridCol2 = [
		{ headerText: '출고일자', dataField: 'deliverydate', dataType: 'date' },
		{
			dataField: 'fromCustkey',
			headerText: '협력사코드',
			dataType: 'code',
			filter: { showIcon: true },
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						custkey: e.item.fromCustkey,
						storerkey: e.item.fromStorerKey,
						custtype: 'P' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
					};
					ref.gridRef.current.openPopup(params, 'cust');
				},
			},
		},
		{ headerText: '협력사명', dataField: 'fromCustname', filter: { showIcon: true } },
		{
			dataField: 'toCustkey',
			headerText: '관리처코드',
			dataType: 'code',
			filter: { showIcon: true },
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						custkey: e.item.toCustkey,
						storerkey: e.item.toStorerKey,
					};
					ref.gridRef.current.openPopup(params, 'cust');
				},
			},
		},
		{ headerText: '관리처명', dataField: 'toCustname', filter: { showIcon: true } },
		{ headerText: '상품코드', dataField: 'sku', dataType: 'code', filter: { showIcon: true } },
		{ headerText: '상품명칭', dataField: 'skuname', filter: { showIcon: true } },
		{ headerText: '저장유무', dataField: 'putawaytype', dataType: 'code' },
		{ headerText: '저장조건', dataField: 'storagetype', dataType: 'code' },
		{ headerText: '박스입수', dataField: 'qtyperbox', dataType: 'numeric' },
		{ headerText: '판매단위', dataField: 'storeruom', dataType: 'code' },
		{ headerText: '주문수량', dataField: 'storeropenqty', dataType: 'numeric' },
		{ headerText: '주문중량', dataField: 'storeropenweight', dataType: 'numeric' },
		{ headerText: '출고수량', dataField: 'confirmqty', dataType: 'numeric' },
		{ headerText: '출고중량', dataField: 'confirmweight', dataType: 'numeric' },
		{ headerText: '결품수량', dataField: 'cancelqty', dataType: 'numeric' },
	];

	// 그리드 Props(상세목록 그리드)
	const gridProps2 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
	};

	// FooterLayout Props(상세목록 그리드)
	const footerLayout2 = [
		{
			dataField: 'storeropenqty',
			positionField: 'storeropenqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'storeropenweight',
			positionField: 'storeropenweight',
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
			dataField: 'confirmweight',
			positionField: 'confirmweight',
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

	// 그리드 버튼
	const gridBtn2: GridBtnPropsType = {
		tGridRef: ref.gridRef2, // 타겟 그리드 Ref
		btnArr: [],
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
			} else {
				ref.gridRef2.current.clearGridData();
			}
		}
	}, [props.data]);

	useEffect(() => {
		ref.gridRef.current.bind('selectionChange', function () {
			// 상세코드 조회
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
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn} gridTitle="일배협력사별주문현황목록" totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn2} gridTitle="일배협력사별주문현황상세" />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
});

export default OmOrderCustDailyDetail;
