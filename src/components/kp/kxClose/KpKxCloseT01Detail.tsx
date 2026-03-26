// lib

// component
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';

// store

// API Call Function
import { apiGetKxCloseDetail, apiGetKxCloseDetailIF } from '@/api/kp/apiKpKxClose';

// util

// hook

// type

// asset
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';

const KpKxCloseT01Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// grid Ref
	ref.gridRefDoc = useRef();
	ref.gridRefIF = useRef();
	ref.gridRefDocDtl = useRef();
	ref.gridRefIFDtl = useRef();
	const [totalCntDocDtl, setTotalCntDocDtl] = useState(0);
	const [totalCntIFDtl, setTotalCntIFDtl] = useState(0);

	//마스터 그리드 생성시 필요한 변수들
	const gridCol = [
		{
			headerText: t('lbl.GUBUN_2'), // 구분
			dataField: 'doctype',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				switch (value) {
					case 'STOWD':
						return '광역출고';
					case 'STODP':
						return '광역입고';
					case 'AJ':
						return '조정';
					case 'DP':
						return '입고';
					case 'WD':
						return '출고';
					case 'RT':
						return '반품';
					default:
						return '';
				}
			},
		},
		{
			headerText: t('lbl.DOC_CNT'), // 문서수
			dataField: 'docCnt',
			dataType: 'numeric',
			// width: 256,
		},
		{
			headerText: t('lbl.ITEM_CNT'), // 항목수
			dataField: 'lineCnt',
			dataType: 'numeric',
			// width: 256,
		},
		{
			headerText: t('lbl.DELETE_ITEM'), // 삭제항목
			dataField: 'delLineCnt',
			dataType: 'numeric',
			// width: 256,
		},
		{
			headerText: t('lbl.VALID_ITEM'), // 유효항목
			dataField: 'useLineCnt',
			dataType: 'numeric',
			// width: 256,
		},
		{
			headerText: t('lbl.CONFIRM_ITEM'), // 확정항목
			dataField: 'confirmLineCnt',
			dataType: 'numeric',
			// width: 256,
		},
		{
			headerText: t('lbl.CONFIRMRATE'), // 확정율
			dataField: 'TRate',
			// dataType: 'numeric',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
				// 상태에 따른 스타일 적용 - CLASS명 반환
				if (value === '100') {
					return 'color-info';
				} else {
					return 'color-danger';
				}
			},
		},
		{
			headerText: t('lbl.STATUS_1'), // 상태
			dataField: 'status',
			dataType: 'text',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
				// 상태에 따른 스타일 적용 - CLASS명 반환
				if (value === '완료') {
					return 'color-info';
				} else {
					return 'color-danger';
				}
			},
		},
	];

	// 그리드 버튼
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRefDoc, // 타겟 그리드 Ref
		btnArr: [],
	};

	// AUIGrid 옵션
	const gridProps = {
		fillColumnSizeMode: false,
		enableColumnResize: true,
		enableFilter: true,
	};

	const gridColIF = [
		{
			headerText: t('lbl.SEND_RECEIVE'),
			dataField: 'tranType',
			align: 'center',
		},
		{
			headerText: t('lbl.IF_ID'),
			dataField: 'ifId',
			align: 'center',
		},
		{
			headerText: t('lbl.GUBUN_2'),
			dataField: 'doctype',
			align: 'left',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				switch (value) {
					case 'AJDP':
						return '조정 입고';
					case 'AJWD':
						return '조정 출고';
					case 'MVDP':
						return '저장위치 이동 입고';
					case 'MVWD':
						return '저장위치 이동 출고';
					case 'PODP':
						return 'KX 지방센터 이체 요청';
					case 'POWD':
						return 'KX 지방센터 이체 실적';
					case 'WD':
						return '출고';
					case 'RT':
						return '반품';
					case 'AJ':
						return '조정';
					case 'DP':
						return '입고';
					case 'ST':
						return '재고';
					case 'STOWD':
						return '광역출고';
					case 'STODP':
						return '광역입고';
					default:
						return '';
				}
			},
		},
		{
			headerText: t('lbl.DOC_CNT'),
			dataField: 'docCnt',
			align: 'right',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.ITEM_CNT'),
			dataField: 'lineCnt',
			align: 'right',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.SUCCESS_ITEM'),
			dataField: 'sucCnt',
			align: 'right',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.INVALID_ITEM'),
			dataField: 'nonCnt',
			align: 'right',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.FAIL_ITEM'),
			dataField: 'errCnt',
			align: 'right',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.CONFIRMRATE'),
			dataField: 'TRate',
			align: 'right',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
				// 상태에 따른 스타일 적용 - CLASS명 반환
				if (value === 100) {
					return 'color-info';
				} else {
					return 'color-danger';
				}
			},
		},
	];

	const gridColDtl = [
		{
			headerText: t('lbl.DOCDT_PLT'),
			dataField: 'deliverydate',
			align: 'center',
			cellMerge: true, // 셀 병합
		},
		{
			headerText: t('lbl.DOCNO'),
			dataField: 'docno',
			align: 'left',
			cellMerge: true, // 셀 병합
			renderer: {
				type: 'LinkRenderer',
				baseUrl: 'javascript',
				jsCallback: function () {
					//
				},
			},
		},
		{
			headerText: t('lbl.DOCLINE'),
			dataField: 'docline',
			align: 'left',
		},
		{
			headerText: t('lbl.SKU'),
			dataField: 'sku',
			align: 'center',
		},
		{
			headerText: t('lbl.ORDERQTY'),
			dataField: 'openqty',
			align: 'right',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.CONFIRMQTY_TASK'),
			dataField: 'confirmqty',
			align: 'right',
			dataType: 'numeric',
		},
	];

	// AUIGrid 옵션
	const gridRefDocDtlProps = {
		fillColumnSizeMode: false,
		enableColumnResize: true,
		enableFilter: true,
		enableCellMerge: true, // 셀 병합 기능 활성화
	};

	const gridColDetailIF = [
		{
			headerText: t('lbl.DOCNO'),
			dataField: 'docno',
			align: 'left',
			renderer: {
				type: 'LinkRenderer',
				baseUrl: 'javascript',
				jsCallback: function () {
					//
				},
			},
		},
		{
			headerText: t('lbl.DOCLINE'),
			dataField: 'docline',
			align: 'left',
		},
		{
			headerText: t('lbl.SLIPNO'),
			dataField: 'slipno',
			align: 'left',
			renderer: {
				type: 'LinkRenderer',
				baseUrl: 'javascript',
				jsCallback: function () {
					//
				},
			},
		},
		{
			headerText: t('lbl.SLIPLINE'),
			dataField: 'slipline',
			align: 'left',
		},
		{
			headerText: t('lbl.SKU'),
			dataField: 'sku',
			align: 'center',
		},
		{
			headerText: t('lbl.ORDERQTY'),
			dataField: 'orderqty',
			align: 'right',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.CONFIRMQTY_TASK'),
			dataField: 'confirmqty',
			align: 'right',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.IF_FLAG'),
			dataField: 'ifFlag',
			align: 'center',
		},
		{
			headerText: t('lbl.IF_MEMO'),
			dataField: 'ifMemo',
			align: 'left',
		},
		{
			headerText: t('lbl.IF_SEND_FILE_SAP'),
			dataField: 'ifDate',
			align: 'center',
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 초기화
	 */
	// const initEvent = () => {};

	/**
	 * KX마감진행 현황 상세 조회
	 * @param {number} rowIndex 선택된 Row Index
	 * @returns {void}
	 */
	const searchDtl = () => {
		ref.gridRefDocDtl.current.clearGridData();

		const selectedRow = ref.gridRefDoc.current?.getSelectedRows();
		if (selectedRow.length > 0 && !ref.gridRefDoc.current.isAddedById(selectedRow[0]._$uid)) {
			// setSelectedRowIndex(ref.gridRef.current.getSelectedIndex()[0]); // rowIndex 저장

			const params = {
				doctype: selectedRow[0].doctype,
				deliveryDate: selectedRow[0].deliveryDate,
			};

			apiGetKxCloseDetail(params).then(res => {
				const gridData = res.data;
				ref.gridRefDocDtl.current.setGridData(gridData);
				setTotalCntDocDtl(gridData.length);

				// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
				ref.gridRefDocDtl.current.setColumnSizeList(ref.gridRefDocDtl.current.getFitColumnSizeList(true));
			});
		} else {
			return;
		}
	};

	/**
	 * KX마감진행 현황 상세 조회 - I/F
	 * @param {number} rowIndex 선택된 Row Index
	 * @returns {void}
	 */
	const searchDtlIF = () => {
		ref.gridRefIFDtl.current.clearGridData();

		const selectedRow = ref.gridRefIF.current?.getSelectedRows();
		if (selectedRow.length > 0 && !ref.gridRefIF.current.isAddedById(selectedRow[0]._$uid)) {
			// setSelectedRowIndex(ref.gridRef.current.getSelectedIndex()[0]); // rowIndex 저장

			const params = {
				tranType: selectedRow[0].tranType,
				ifId: selectedRow[0].ifId,
				doctype: selectedRow[0].doctype,
				deliveryDate: selectedRow[0].deliveryDate,
			};

			apiGetKxCloseDetailIF(params).then(res => {
				const gridData = res.data;
				ref.gridRefIFDtl.current.setGridData(gridData);
				setTotalCntIFDtl(gridData.length);

				// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
				ref.gridRefIFDtl.current.setColumnSizeList(ref.gridRefIFDtl.current.getFitColumnSizeList(true));
			});
		} else {
			return;
		}
	};

	let prevRowIndex: any = null;
	useEffect(() => {
		// initEvent();
		ref.gridRefDoc?.current.resize(); // 그리드 크기 조정
		ref.gridRefIF?.current.resize(); // 그리드 크기 조정
		ref.gridRefDocDtl?.current.resize(); // 그리드 크기 조정
		ref.gridRefIFDtl?.current.resize(); // 그리드 크기 조정

		const gridRefCur = ref.gridRefDoc.current;

		// 그룹 코드 그리드 행 변경 시
		gridRefCur.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell.rowIndex === prevRowIndex) return;

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell.rowIndex;

			searchDtl();
		});

		let prevRowIndex2: any = null;
		// 그룹 코드 그리드 행 변경 시
		ref.gridRefIF?.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell.rowIndex === prevRowIndex2) return;

			// 이전 행 인덱스 갱신
			prevRowIndex2 = event.primeCell.rowIndex;

			searchDtlIF();
		});

		ref.gridRefDocDtl?.current.bind('cellClick', function (event: any) {
			// 예: 문서번호 컬럼 클릭 시
			if (event.dataField === 'docno') {
				// 원하는 탭 key로 이동
				props.setSelectedEvent(event.item); // 문서내역 탭으로 param전달
				props.setActiveTabKey('3'); // 예시: 두 번째 탭으로 이동
			}
		});

		ref.gridRefIFDtl?.current.bind('cellClick', function (event: any) {
			// 예: 문서번호 컬럼 클릭 시
			if (event.dataField === 'docno' || event.dataField === 'slipno') {
				// 원하는 탭 key로 이동
				props.setSelectedEvent(event.item); // 문서내역 탭으로 param전달
				props.setActiveTabKey('3'); // 예시: 두 번째 탭으로 이동
			}
		});
	}, []);

	useEffect(() => {
		// 상세 초기화
		const gridRefCur1 = ref.gridRefDoc.current;

		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			searchDtl();

			if (props.data.length > 0) {
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	useEffect(() => {
		const gridRefCur2 = ref.gridRefIF.current;

		if (props.dataList?.length < 1) {
			gridRefCur2.clearGridData();
		}

		if (gridRefCur2) {
			gridRefCur2?.setGridData(props.dataList);
			gridRefCur2.setSelectionByIndex(0, 0);

			searchDtlIF();

			if (props.dataList?.length > 0) {
				const colSizeList = gridRefCur2.getFitColumnSizeList(true);
				gridRefCur2.setColumnSizeList(colSizeList);
			}
		}
	}, [props.dataList]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRefDoc?.current?.resize?.('100%', '100%');
		ref.gridRefIF?.current?.resize?.('100%', '100%');
		ref.gridRefDocDtl?.current?.resize?.('100%', '100%');
		ref.gridRefIFDtl?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<Splitter
						key="KpKxClose-top-splitter"
						onResizing={resizeAllGrids}
						onResizeEnd={resizeAllGrids}
						items={[
							<>
								<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
									<GridTopBtn gridBtn={gridBtn1} gridTitle={'문서 기준 처리현황'} totalCnt={props.totalCnt} />
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={ref.gridRefDoc} columnLayout={gridCol} gridProps={gridProps} />
								</GridAutoHeight>
							</>,
							<>
								<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
									<GridTopBtn gridBtn={gridBtn1} gridTitle={'I/F 기준 처리현황'} totalCnt={props.dataList.length} />
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={ref.gridRefIF} columnLayout={gridColIF} />
								</GridAutoHeight>
							</>,
						]}
					/>,
					<Splitter
						key="KpKxClose-bottom-splitter"
						onResizing={resizeAllGrids}
						onResizeEnd={resizeAllGrids}
						items={[
							<>
								<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
									<GridTopBtn gridBtn={gridBtn1} gridTitle={'문서 기준 미처리 내역'} totalCnt={totalCntDocDtl} />
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={ref.gridRefDocDtl} columnLayout={gridColDtl} gridProps={gridRefDocDtlProps} />
								</GridAutoHeight>
							</>,
							<>
								<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
									<GridTopBtn gridBtn={gridBtn1} gridTitle={'I/F 기준 미처리 내역'} totalCnt={totalCntIFDtl} />
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={ref.gridRefIFDtl} columnLayout={gridColDetailIF} />
								</GridAutoHeight>
							</>,
						]}
					/>,
				]}
			/>
		</>
	);
});

export default KpKxCloseT01Detail;
