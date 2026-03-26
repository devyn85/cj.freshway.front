// CSS
import { apiSaveKxRP, apiSaveKxRPEx } from '@/api/kp/apiKpKxClose';
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';

// Lib
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';

// Component

// Type

// API

const KpKxCloseT07Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	ref.gridRef = useRef<any>(null);
	ref.gridRef1 = useRef<any>(null);
	const [totalResultCnt, setTotalResultCnt] = useState(0);
	const modalRef1 = useRef(null);
	const { t } = useTranslation();
	const getGridCol = [
		{
			headerText: t('lbl.DCCODE'), //물류센터
			dataField: 'dccode',
			dataType: 'code',
			cellMerge: true,
		},
		{
			headerText: t('lbl.ORGANIZE'), // 창고
			dataField: 'organize',
			dataType: 'code',
			cellMerge: true,
		},
		{
			headerText: t('lbl.DOCNO'), // 문서번호
			dataField: 'docno',
			dataType: 'text',
			cellMerge: true,
		},
		{
			headerText: t('lbl.DOCLINE'), // 품목번호
			dataField: 'docline', //확인필요
			dataType: 'text',
		},
		{
			headerText: t('lbl.SKU'), // 상품코드
			dataField: 'sku',
			dataType: 'code',
		},
		{
			headerText: '수신건수', // 수신건수
			dataField: 'cnt',
			dataType: 'numeric',
		},
		{
			headerText: 'IF_MEMO', // IF_MEMO
			dataField: 'ifMemo',
			dataType: 'text',
		},
		{
			headerText: 'DMD 처리기준', // DMD 처리기준
			dataField: 'dmdTimestamp',
			dataType: 'date',
		},
		{
			headerText: 'DMH 처리기준', // DMD 처리기준
			dataField: 'dmhTimestamp',
			dataType: 'date',
		},
		{
			headerText: '가용 재고', // 가용재고
			dataField: 'stQty',
			dataType: 'numeric',
			// styleFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
			// 	if (Number(item.kxqty) > Number(item.qty)) {
			// 		return 'color-danger';
			// 	}
			// 	return null; // 기본 스타일
			// },
		},
		{
			headerText: '가용 외(속성)', // 가용 외(속성)
			dataField: 'stSQty',
			dataType: 'numeric',
		},
		{
			headerText: '가용 (속성)', // 가용 ( 속성)
			dataField: 'stStdQty',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.REQ_QTY'), // 요청량
			dataField: 'reqQty',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.REQUEST') + t('lbl.UOM'), // 요청단위
			dataField: 'reqUom',
			dataType: 'code',
		},
	];
	const getGridCol1 = [
		...getGridCol.filter(col => col.dataField !== 'stSQty' && col.dataField !== 'stStdQty'),
		{
			headerText: t('lbl.PROCESSFLAG'), // 처리결과
			dataField: 'processflag',
			dataType: 'code',
		},
		{
			headerText: t('lbl.PROCESSMSG'), // 처리메세지
			dataField: 'processmsg',
			dataType: 'text',
		},
	];
	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	const saveEx = () => {
		const checkedItems = ref.gridRef.current.getCheckedRowItems();

		if (checkedItems.length === 0) {
			showMessage({
				content: t('msg.MSG_COM_VAL_061'), // 체크된 항목이 없습니다.
				modalType: 'info',
			});
			return;
		}

		const saveData = checkedItems.map((row: any) => row.item);
		const requestBody = { saveList4: saveData };
		apiSaveKxRPEx(requestBody).then((res: any) => {
			props.search?.();
		});
	};

	const saveSet = () => {
		const checkedItems = ref.gridRef.current.getCheckedRowItems();

		if (checkedItems.length === 0) {
			showMessage({
				content: t('msg.MSG_COM_VAL_061'), // 체크된 항목이 없습니다.
				modalType: 'info',
			});
			return;
		}
		// 저장 전 체크로직 추가예정
		//
		//
		//

		const saveData = checkedItems.map((row: any) => row.item);
		const requestBody = { saveList4: saveData };
		saveKxAj(requestBody);
	};

	const saveKxAj = (requestBody: any) => {
		apiSaveKxRP(requestBody).then((res: any) => {
			ref.gridRef1.current.setGridData(res.data.data);
			if (res.data.data.length > 0) {
				const colSizeList2 = ref.gridRef1.current.getFitColumnSizeList(true);
				ref.gridRef1.current.setColumnSizeList(colSizeList2);
				setTotalResultCnt(res.data.data.length);
			}
		});
	};
	// 그리드 속성 설정
	const gridProps = {
		showCustomRowCheckColumn: true,
		editable: false,
		enableCellMerge: true,
		rowStyleFunction: (rowIndex: number, item: any) => {
			// item 객체가 유효하고 processflag 속성이 있는지 확인합니다.
			if (item && item.stQty >= item.reqQty) {
				return 'color-info';
			} else {
				return 'color-danger';
			}
		},
	};
	const gridProps1 = {
		showCustomRowCheckColumn: true,
		editable: false,
		enableCellMerge: true,
		rowStyleFunction: (rowIndex: number, item: any) => {
			if (item.processflag != 'Y') {
				return 'color-danger';
			} else {
				return 'color-info';
			}
		},
	};

	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn2', // 예외처리
				callBackFn: saveEx,
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveSet,
			},
		],
	};
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		ref.gridRef1?.current.clearGridData();
		const grid = ref.gridRef?.current;
		if (!grid) return;

		const handleRowCheckClick = (event: any) => {
			// 1. 클릭된 행의 docno를 가져옵니다.
			const targetDocNo = event.item.docno;

			// 클릭 '전'의 값(event.value)을 기준으로 새로운 체크 상태('Y' 또는 'N')를 결정합니다.
			// event.value가 'Y'이면 'N'으로, 그 외의 경우(null, 'N' 등)는 'Y'로 변경합니다.
			const newCheckStatus = event.value;
			const new11 = grid.getRowIndexesByValue('docno', targetDocNo);
			const rowIdArray = new11.map((index: number) => grid.indexToRowId(index));
			if (newCheckStatus === 'Y') {
				grid.addCheckedRowsByIds(rowIdArray);
			} else {
				grid.addUncheckedRowsByIds(rowIdArray);
			}
		};

		grid.bind('rowCheckClick', handleRowCheckClick);

		return () => grid.unbind('rowCheckClick', handleRowCheckClick);
	}, []);
	//"customRowCheckYn"
	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);
			setTotalResultCnt(0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRefGrp?.current?.resize?.('100%', '100%');
		ref.gridBtnDtl?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid className="contain-wrap" style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn
								gridBtn={gridBtn}
								gridTitle={t('lbl.PARTNER') + t('lbl.RO') + ' ' + t('lbl.QCSTATUS_RT') + ' ' + t('lbl.BTN_CONFIRM')}
								totalCnt={props.totalCnt}
								extraContentLeft={
									<span className="msg">* 저장시 IF_DATE만 금일로 갱신하며 재처리 프로세스에서 재수행한다.</span>
								}
							/>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={getGridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid className="contain-wrap" style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn
								gridBtn={{ tGridRef: ref.gridRef1 }}
								gridTitle={t('lbl.PROCESSFLAG')}
								totalCnt={totalResultCnt}
							/>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef1} columnLayout={getGridCol1} gridProps={gridProps1} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
});

export default KpKxCloseT07Detail;
