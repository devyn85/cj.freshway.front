/*
 ############################################################################
 # FiledataField	: WdAllocationCancelTap3Detail.tsx
 # Description		: 차량별취소(Detail)
 # Author			: 공두경
 # Since			: 25.08.28
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// API Call Function
import { apiGetDetailList, apiSaveCarnoBatch } from '@/api/wd/apiWdAllocationCancel';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';

const WdAllocationCancelTap3Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
	ref.gridRef3 = useRef(null);
	ref.gridRef4 = useRef(null);
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);

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
			storerkey: selectedRow[0].storerkey,
			slipdt: selectedRow[0].slipdt,
			carno: selectedRow[0].carno,
			other01: selectedRow[0].other01,
		};
		apiGetDetailList(params).then(res => {
			const gridData = res.data;
			props.setGridData2(gridData);
			ref.gridRef2.current?.setGridData(gridData);

			//const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			//ref.gridRef2.current?.setColumnSizeList(colSizeList);
		});
	};

	/**
	 * 차량별취소
	 */
	const onClickBatch = () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003', []), () => {
			const params = {
				avc_COMMAND: 'BATCHCANCEL_CARNO',
				saveAutoBatchList: checkedRows, // 선택된 행의 데이터
			};

			apiSaveCarnoBatch(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', t('msg.MSG_COM_SUC_003'), () => {
						ref.gridRef.current.clearGridData();
						props.search(); // 검색 함수 호출
					});
				}
			});
		});
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{ headerText: '출고일자', dataField: 'slipdt', dataType: 'date' },
		{ headerText: '진행상태', dataField: 'status', dataType: 'code' },
		{ headerText: '차량번호', dataField: 'carno', dataType: 'code' },
		{ headerText: '저장조건', dataField: 'storagetype', dataType: 'code' },
		{ headerText: '전표수', dataField: 'slipcnt', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '상품수', dataField: 'skucnt', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '출고량', dataField: 'wdqty', dataType: 'numeric', formatString: '#,##0.##' },
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'slipdt',
		},
		{
			dataField: 'slipcnt',
			positionField: 'slipcnt',
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
			dataField: 'wdqty',
			positionField: 'wdqty',
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
				btnType: 'btn3',
				btnLabel: '삭제', // 차량별취소목록
				callBackFn: onClickBatch,
			},
		],
	};

	//그리드 컬럼(거래처별 그리드)
	const gridCol2 = [
		{ headerText: '전표번호', dataField: 'slipno', dataType: 'code' },
		{ headerText: '품목번호', dataField: 'slipline', dataType: 'code' },
		{ headerText: '상품분류', dataField: 'skugroup', dataType: 'code' },
		{ headerText: '상품코드', dataField: 'sku', dataType: 'code' },
		{ headerText: '상품명칭', dataField: 'skuname' },
		{ headerText: '플랜트', dataField: 'plantDescr', dataType: 'code' },
		{ headerText: '단위', dataField: 'uom', dataType: 'code' },
		{ headerText: '저장유무', dataField: 'channel', dataType: 'code' },
		{ headerText: '저장조건', dataField: 'storagetype', dataType: 'code' },
		{ headerText: '식별번호유무', dataField: 'serialyn', dataType: 'code' },
		{ headerText: '주문수량', dataField: 'orderqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '분배량', dataField: 'processqty', dataType: 'numeric', formatString: '#,##0.##' },
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
	};

	// FooterLayout Props(거래처별 그리드)
	const footerLayout2 = [
		{
			labelText: '합계',
			positionField: 'slipno',
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
			dataField: 'processqty',
			positionField: 'processqty',
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
		gridRefCur1?.setGridData(props.data);
		gridRefCur1?.setSelectionByIndex(0, 0);

		ref.gridRef2.current.clearGridData();

		if (props.data.length > 0) {
			// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
			// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
			//const colSizeList = gridRefCur1.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			//gridRefCur1.setColumnSizeList(colSizeList);
		}
	}, [props.data]);

	let prevRowItem: any = null;
	useEffect(() => {
		ref.gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row의 item이 다를 경우에만 검색
			if (event.primeCell.item === prevRowItem) return;

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
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridBtn={gridBtn} gridTitle="차량별취소목록" totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridBtn={gridBtn2} gridTitle="차량별취소상세" />
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

export default WdAllocationCancelTap3Detail;
