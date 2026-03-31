/*
 ############################################################################
 # FiledataField	: DpInplanDetail.tsx
 # Description		: 입고진행현황(Detail)
 # Author			: Canal Frame
 # Since			: 25.06.16
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
import dateUtil from '@/util/dateUtil';
import { showAlert } from '@/util/MessageUtil';
// API Call Function
import { apiGetDataExcelList, apiGetDetailList } from '@/api/dp/apiDpInplan';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import FileSaver from 'file-saver';

const DpInplanDetail = forwardRef((props: any, ref: any) => {
	const excelParams = {
		fileName: '입고진행현황',
		//columnSizeOfDataField: result,
		exportWithStyle: true, // 스타일 적용 여부
		progressBar: true,
	};
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
		searchParams.ordertype = searchParams?.ordertype?.join(',');
		const params = {
			fixdccode: searchParams.fixdccode,
			dccode: selectedRow[0].dccode,
			storerkey: selectedRow[0].storerkey,
			organize: selectedRow[0].organize,
			slipdt: selectedRow[0].slipdt,
			slipno: selectedRow[0].slipno,

			fromcustkey: searchParams.fromcustkey,
			sku: searchParams.sku,
			ordertype: searchParams.ordertype,
			channel: searchParams.channel,
			storagetype: searchParams.storagetype,
		};

		apiGetDetailList({ ...searchParams, ...selectedRow[0] }).then(res => {
			const gridData = res.data;
			ref.gridRef2.current?.setGridData(gridData);
			//setTotalCnt(res.data.length);
			const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef2.current?.setColumnSizeList(colSizeList);
		});
	};

	// 그리드 엑셀 다운로드 정보 조회
	const searchExcel = () => {
		const params = props.form.getFieldsValue();

		if (commUtil.isNull(params.slipdtRange)) {
			showAlert('', '입고일자를 선택해주세요.');
			return;
		}
		if (commUtil.isNull(params.slipdtRange[0]) || commUtil.isNull(params.slipdtRange[1])) {
			showAlert('', '입고일자를 선택해주세요.');
			return;
		}

		params.fromSlipdt = params.slipdtRange[0].format('YYYYMMDD');
		params.toSlipdt = params.slipdtRange[1].format('YYYYMMDD');
		params.ordertype = params?.ordertype?.join(',');

		if (dateUtil.getDaysDiff(params.fromSlipdt, params.toSlipdt) > 31) {
			showAlert('', '최대 한 달 간의 데이터만\n조회 가능합니다.');
			return;
		}

		apiGetDataExcelList(params).then(res => {
			FileSaver.saveAs(res.data, dataRegex.decodeDisposition(res.headers['content-disposition']));
		});
	};

	/**
	 *
	 * @param cols
	 * @param sizes
	 * @param result
	 * @param idx
	 */
	function collectColumnSizes(cols: any[], sizes: any[], result: any, idx = { i: 0 }) {
		for (const col of cols) {
			if (col.children) {
				collectColumnSizes(col.children, sizes, result, idx);
			} else if (col.dataField) {
				result[String(col.dataField)] = sizes[idx.i];
				idx.i++;
			}
		}
	}

	// 그리드 엑셀 다운로드
	const downloadExcel = (colSizeList: any) => {
		const result: any = {};
		// gridCol 배열을 순회하면서 dataField와 colsize를 매칭
		/*
		for (let i = 0; i < gridCol.length; i++) {
			const dataField = gridCol[i].dataField;
			const size = colSizeList[i];
			if (dataField) {
				result[dataField] = size;
			}
		}*/
		// collectColumnSizes(gridCol3, colSizeList, result);

		const params = {
			fileName: '입고진행현황',
			//columnSizeOfDataField: result,
			exportWithStyle: true, // 스타일 적용 여부
			progressBar: true,
		};
		ref.gridRef3.current?.exportToXlsxGrid(params);
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{ headerText: '물류센터', dataField: 'dccode', dataType: 'code' }, //물류센터
		{ headerText: '창고', dataField: 'organizedesc', dataType: 'code' }, //창고
		{ headerText: '입고전표번호', dataField: 'slipno', dataType: 'code' }, //입고전표번호
		{ headerText: '구매유형', dataField: 'ordertypeName', dataType: 'code' }, //구매유형
		{ headerText: '통합배송 주문유형', dataField: 'tplTypeNm', dataType: 'code' }, //통합배송 주문유형
		{ headerText: '입고일자', dataField: 'slipdt', dataType: 'date' }, //입고일자
		{
			headerText: '협력사코드',
			dataField: 'fromCustkey',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
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
		}, //협력사코드
		{
			headerText: '협력사명',
			dataField: 'fromCustname',
			filter: {
				showIcon: true,
			},
		}, //협력사명
		{ headerText: '진행상태', dataField: 'status', dataType: 'code' }, //진행상태
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
				btnType: 'excelDownload', // excelDownload
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: searchExcel,
			},
		],
	};

	//그리드 컬럼(상세목록 그리드)
	const gridCol2 = [
		{ headerText: '품목번호', dataField: 'docline', dataType: 'code' }, //품목번호
		{
			headerText: '상품코드',
			dataField: 'sku',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.skuName,
					};
					ref.gridRef2.current.openPopup(params, 'sku');
				},
			},
		}, //상품코드
		{
			headerText: '상품명칭',
			dataField: 'skuname',
			filter: {
				showIcon: true,
			},
			dataType: 'code',
		}, //상품명칭
		{ headerText: '플랜트', dataField: 'plantDescr', dataType: 'code' }, //플랜트
		{ headerText: '저장유무', dataField: 'channelName', dataType: 'code' }, //저장유무
		{ headerText: '저장조건', dataField: 'storagetypeName', dataType: 'code' }, //저장조건
		{ headerText: '이력관리기관', dataField: 'serialtypeName', dataType: 'code' }, //이력관리기관
		{ headerText: '박스입수', dataField: 'qtyperbox', dataType: 'numeric', formatString: '#,##0.##' }, //박스입수
		{ headerText: '구매단위', dataField: 'uom', dataType: 'code' }, //구매단위
		{ headerText: '구매수량', dataField: 'orderqty', dataType: 'numeric', formatString: '#,##0.##' }, //구매수량
		{ headerText: '발주수량', dataField: 'purchaseqty', dataType: 'numeric', formatString: '#,##0.##' }, //발주수량
		{ headerText: '결품수량', dataField: 'shortageqty', dataType: 'numeric', formatString: '#,##0.##' }, //결품수량
		{ headerText: '입고예정량', dataField: 'orderadjustqty', dataType: 'numeric', formatString: '#,##0.##' }, //입고예정량
		{
			headerText: '입고예정확정량',
			dataField: 'openqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, //입고예정확정량
		{
			headerText: '입고검수량',
			dataField: 'inspectqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, //입고검수량
		{
			headerText: '입고확정량',
			dataField: 'confirmqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, //입고확정량
		{
			headerText: '입고중량',
			dataField: 'confirmweight',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, //입고중량
		// { headerText: 'SAP실적전송', dataField: 'ifAuditFile', dataType: 'code' }, //SAP실적전송
		// { headerText: '전송시간', dataField: 'ifSendFile', dataType: 'date' }, //전송시간
	];

	// 그리드 Props(상세목록 그리드)
	const gridProps2 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		// rowStyleFunction 함수 정의
		// 이 함수는 각 행이 렌더링될 때마다 호출됩니다.
		// rowStyleFunction: function (rowIndex: any, item: any) {
		// 	// item은 현재 행의 데이터 객체입니다.
		// 	//console.log(('rowIndex:' + rowIndex + ', delYn:' + item.delYn);
		// 	if (item.delYn == 'Y') {
		// 		return 'color-danger'; // CSS 클래스 이름 반환
		// 	} else if (item.confirmqty != item.inspectqty) {
		// 		return 'color-info'; // CSS 클래스 이름 반환
		// 	}
		// 	return ''; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
		// },
	};

	// FooterLayout Props(상세목록 그리드)
	const footerLayout2 = [
		{
			labelText: '합계',
			positionField: 'docline',
			colSpan: 2, // 셀 가로 병합 대상은 2개로 설정
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'purchaseqty',
			positionField: 'purchaseqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'shortageqty',
			positionField: 'shortageqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},

		{
			dataField: 'orderadjustqty',
			positionField: 'orderadjustqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'openqty',
			positionField: 'openqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmweight',
			positionField: 'confirmweight',
			operation: 'SUM',
			formatString: '#,##0.###',
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

	//그리드 컬럼(엑셀 그리드)
	const gridCol3 = [
		{ headerText: '입고전표번호', dataField: 'slipno', dataType: 'code' }, //입고전표번호
		{ headerText: '구매유형', dataField: 'ordertypeName', dataType: 'code' }, //구매유형
		{ headerText: '입고일자', dataField: 'slipdt', dataType: 'date' }, //입고일자
		{ headerText: '협력사코드', dataField: 'fromCustkey', dataType: 'code' }, //협력사코드
		{ headerText: '협력사명', dataField: 'fromCustname' }, //협력사명
		{ headerText: '진행상태', dataField: 'statusname', dataType: 'code' }, //진행상태
		{ headerText: '품목번호', dataField: 'docline', dataType: 'code' }, //품목번호
		{ headerText: '상품코드', dataField: 'sku', dataType: 'code' }, //상품코드
		{ headerText: '상품명칭', dataField: 'skuname' }, //상품명칭
		{ headerText: '플랜트', dataField: 'plantDescr', dataType: 'code' }, //플랜트
		{ headerText: '저장유무', dataField: 'channelName', dataType: 'code' }, //저장유무
		{ headerText: '저장조건', dataField: 'storagetypeName', dataType: 'code' }, //저장조건
		{ headerText: '이력관리기관', dataField: 'serialtypeName', dataType: 'code' }, //이력관리기관
		{ headerText: '박스입수', dataField: 'qtyperbox', dataType: 'numeric', formatString: '#,##0.##' }, //박스입수
		{ headerText: '구매단위', dataField: 'uom', dataType: 'code' }, //구매단위
		{ headerText: '구매수량', dataField: 'orderqty', dataType: 'numeric', formatString: '#,##0.##' }, //구매수량
		{ headerText: '발주수량', dataField: 'purchaseQty', dataType: 'numeric', formatString: '#,##0.##' }, //발주수량
		{ headerText: '결품수량', dataField: 'shortageqty', dataType: 'numeric', formatString: '#,##0.##' }, //결품수량
		{ headerText: '입고예정량', dataField: 'orderadjustqty', dataType: 'numeric', formatString: '#,##0.##' }, //입고예정량
		{ headerText: '입고예정확정량', dataField: 'openqty', dataType: 'numeric', formatString: '#,##0.##' }, //입고예정확정량
		{
			headerText: '입고검수량',
			dataField: 'inspectqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, //입고검수량
		{
			headerText: '입고확정량',
			dataField: 'confirmqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, //입고확정량
		{
			headerText: '입고중량',
			dataField: 'confirmweight',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, //입고중량
		//{ headerText: 'SAP실적전송', dataField: 'ifAuditFile', dataType: 'code' }, //SAP실적전송
		//{ headerText: '전송시간', dataField: 'ifSendFile', dataType: 'code' }, //전송시간
	];

	// 그리드 Props(상세목록 그리드)
	const gridProps3 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		// rowStyleFunction 함수 정의
		// 이 함수는 각 행이 렌더링될 때마다 호출됩니다.
		// rowStyleFunction: function (rowIndex: any, item: any) {
		// 	// item은 현재 행의 데이터 객체입니다.
		// 	//console.log(('rowIndex:' + rowIndex + ', delYn:' + item.delYn);
		// 	if (item.delYn == 'Y') {
		// 		return 'color-danger'; // CSS 클래스 이름 반환
		// 	} else if (item.confirmqty != item.inspectqty) {
		// 		return 'color-info'; // CSS 클래스 이름 반환
		// 	}
		// 	return ''; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
		// },
	};

	// FooterLayout Props(상세목록 그리드)
	const footerLayout3 = [
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'purchaseqty',
			positionField: 'purchaseqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'shortageqty',
			positionField: 'shortageqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},

		{
			dataField: 'orderadjustqty',
			positionField: 'orderadjustqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'openqty',
			positionField: 'openqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmweight',
			positionField: 'confirmweight',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

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
			searchDtl();
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
							<GridTopBtn gridBtn={gridBtn2} gridTitle={t('lbl.DETAIL_TAB')} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
						</GridAutoHeight>
					</>,
				]}
			/>

			<AGrid className={'dp-none'}>
				<AUIGrid ref={ref.gridRef3} columnLayout={gridCol3} gridProps={gridProps3} footerLayout={footerLayout3} />
			</AGrid>
		</>
	);
});

export default DpInplanDetail;
