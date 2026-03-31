/*
 ############################################################################
 # FiledataField	: WdAllocationCancelDetail2.tsx
 # Description		: 지정취소 Detail
 # Author			: 공두경
 # Since			: 25.07.24
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
import { apiGetDetailSubList } from '@/api/wd/apiWdAllocationCancel';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';

const WdAllocationCancelDetail2 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
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
		const params = {
			dccode: selectedRow[0].dccode,
			storerkey: selectedRow[0].storerkey,
			organize: selectedRow[0].organize,
			slipdt: selectedRow[0].slipdt,
			slipno: selectedRow[0].slipno,
			slipline: selectedRow[0].slipline,
			sku: selectedRow[0].sku,
			serialyn: selectedRow[0].serialyn,
		};

		apiGetDetailSubList(params).then(res => {
			const gridData = res.data;
			ref.gridRef2.current?.setGridData(gridData);
			//const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			//ref.gridRef2.current?.setColumnSizeList(colSizeList);
		});
	};

	/**
	 * 특정 그리드 데이터에서 2개의 지정된 컬럼를 비교하는 함수
	 * @param gridData - 비교할 데이터 배열
	 * @param colName1 - 비교 컬럼1
	 * @param colName2 - 비교 컬럼2
	 * @returns 정상 : 0, 비정상 : > 0
	 */
	const getGridColCompare = (gridData: any[], colName1: string, colName2: string): number => {
		return gridData.reduce((acc: number, row: any) => {
			return acc + (Number(row[colName1]) > Number(row[colName2]) ? 1 : 0);
		}, 0);
	};

	/**
	 * 배치별분배
	 */
	const onClickBatch = () => {
		const checkedRows = ref.gridRef2.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		const searchParams = props.form.getFieldsValue();
		const selectedRow = ref.gridRef.current.getSelectedRows();

		const gridData = ref.gridRef2.current?.getGridData?.() || [];

		if (getGridColCompare(gridData, 'cancelqty', 'processQty') > 0) {
			showAlert(null, t('msg.MSG_COM_VAL_003', ['취소량|할당량'])); // 취소량 항목의 최대값은 할당량 이하입니다.
			return;
		}

		if (selectedRow[0].dccode)
			showConfirm(null, t('msg.MSG_COM_CFM_020', ['배치별분배']), () => {
				const params = {
					apiUrl: '/api/wd/allocationCancel/v1.0/saveAllocatonBatch',
					avc_COMMAND: 'CANCEL_FIXSKU',
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
		ref.gridRef.current.clearGridData();
		ref.gridRef2.current.clearGridData();
		props.search(); // 검색 함수 호출
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{ headerText: '전표번호', dataField: 'slipno', dataType: 'code' },
		{ headerText: '품목번호', dataField: 'slipline', dataType: 'code' },
		{ headerText: '상품분류', dataField: 'skugroup', dataType: 'code' },
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
			headerText: '상품명칭',
			dataField: 'skuname',
			filter: {
				showIcon: true,
			},
		},
		{ headerText: '플랜트', dataField: 'plantDescr', dataType: 'code' },
		{ headerText: '단위', dataField: 'uom', dataType: 'code' },
		{ headerText: '저장유무', dataField: 'channel', dataType: 'code' },
		{ headerText: '저장조건', dataField: 'storagetype', dataType: 'code' },
		{ headerText: '식별번호유무', dataField: 'serialyn', dataType: 'code' },
		{ headerText: '주문수량', dataField: 'orderqty', dataType: 'numeric', formatString: '#,##0.##' },
		{ headerText: '분배량', dataField: 'processqty', dataType: 'numeric', formatString: '#,##0.##' },
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
	};

	// FooterLayout Props
	const footerLayout = [
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
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	//그리드 컬럼(거래처별 그리드)
	const gridCol2 = [
		{ headerText: '물류센터', dataField: 'dccode', dataType: 'code', editable: false },
		{ headerText: '창고', dataField: 'organize', dataType: 'code', editable: false },
		{
			headerText: '상품코드',
			dataField: 'sku',
			dataType: 'code',
			editable: false,
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
			headerText: '상품명칭',
			dataField: 'skuname',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{ headerText: '분배장소', dataField: 'loc', dataType: 'code', editable: false },
		{ headerText: '현재고수량', dataField: 'qty', dataType: 'numeric', formatString: '#,##0.##', editable: false },
		{
			headerText: '가용재고수량',
			dataField: 'openqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{ headerText: '분배량', dataField: 'processqty', dataType: 'numeric', formatString: '#,##0.##', editable: false },
		{
			headerText: '피킹재고수량',
			dataField: 'workqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{ headerText: '취소량', dataField: 'cancelqty', dataType: 'numeric', required: true, formatString: '#,##0.##' },
		{ headerText: '단위', dataField: 'uom', dataType: 'code', editable: false },
		{ headerText: '재고위치', dataField: 'stocktype', dataType: 'code', editable: false },
		{ headerText: '기준일(소비,제조)', dataField: 'lottable01', dataType: 'code', editable: false },
		{ headerText: '이력번호', dataField: 'serialno', dataType: 'code', editable: false },
		{ headerText: '박스바코드', dataField: 'boxbarcode', dataType: 'code', editable: false },
	];

	// 그리드 Props(거래처별 그리드)
	const gridProps2 = {
		editable: true,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props(거래처별 그리드)
	const footerLayout2 = [
		{
			labelText: '합계',
			positionField: 'dccode',
		},
		{
			dataField: 'qty',
			positionField: 'qty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'openqty',
			positionField: 'openqty',
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
		btnArr: [
			{
				btnType: 'btn2',
				btnLabel: '삭제', // 지정취소상세
				callBackFn: onClickBatch,
			},
		],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 1);

			ref.gridRef2.current.clearGridData();
			/*
			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			}*/
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

		ref.gridRef2.current.bind('cellEditBegin', function (event: any) {
			const rowIdField = ref.gridRef2.current.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField == 'cancelqty') {
				return true;
			} else {
				return false; // 다른 필드들은 편집 허용 안함
			}
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
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridBtn={gridBtn} gridTitle="지정취소목록" totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridBtn={gridBtn2} gridTitle="지정취소상세" />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
						</GridAutoHeight>
					</>,
				]}
			/>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default WdAllocationCancelDetail2;
