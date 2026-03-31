/*
 ############################################################################
 # FiledataField	: StDailyInoutExDcDetail.tsx
 # Description		: 외부비축상품별수불현황
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/
//CSS

//Component

//Lib
import { v4 as uuidv4 } from 'uuid';
// Utils

// API Call Function
import { apiGetDetailList } from '@/api/st/apiStDailyInoutEXDC';
//type
import { GridBtnPropsType } from '@/types/common';

//hooks

//store
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReact';
import { Form } from 'antd';

const StDailyInoutExDcDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef1 = useRef();

	const dcCode = Form.useWatch('fixDcCode', props.form);
	const [gridDetailTotalCount, setGridDetailTotalCount] = useState(0);
	const [detailGridData, setDetailGridData] = useState([]);

	// 수불 유형 맵 세팅
	const ioTypeMap = {
		DP_STO: '입고(STO)',
		DP_PO: '입고(PO)',
		DP_AJ_DC: '역감모',
		RT: '반품',

		WD_STO: '출고(STO)',
		WD_SO: '출고(SO)',
		WD_PO: '협력사 반품',
		WD_AJ_DC: '감모',
		WD_AJ_DU: '폐기',
		WD_AJ_SA: '매각',
	};

	const gridId = uuidv4() + '_gridWrap';
	const gridId1 = uuidv4() + '_gridWrap';

	// 그리드 컬럼 세팅
	const gridCol = [
		{ headerText: '창고', dataField: 'organize', width: 80, dataType: 'code' },
		{ headerText: '창고명', dataField: 'organizeNm', width: 80, dataType: 'text' },
		// { headerText: '상품코드', dataField: 'sku', width: 80, dataType: 'code' },
		{
			dataField: 'sku',
			headerText: '상품코드',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(e.item, 'sku');
				},
			},
		},
		{ headerText: '상품명', dataField: 'skuNm', width: 80, dataType: 'text' },
		{ headerText: 'UOM', dataField: 'uom', width: 60, dataType: 'code' },
		{ headerText: '입수', dataField: 'qtyPerBox', width: 60, dataType: 'numeric' },
		{ headerText: '현재고', dataField: 'stockQty', width: 90, dataType: 'numeric' },
		{ headerText: '기초재고', dataField: 'baseQty', width: 90, dataType: 'numeric', formatString: '#,##0' },

		// { headerText: 'ENDQTY', dataField: 'endQty', width: 90, dataType: 'numeric' },

		{
			headerText: '입고',
			children: [
				{
					headerText: '입고(PO)',
					children: [
						/* 입고-PO */
						{ headerText: '기본', dataField: 'dpPoQty', width: 80, dataType: 'numeric' },
						{ headerText: 'BOX', dataField: 'dpPoBoxDisp', width: 90, dataType: 'numeric' },
						// { headerText: 'BOX', dataField: 'dpPoBox', width: 80, dataType: 'numeric' },
					],
				},
				/* 입고-STO */
				{
					headerText: '입고(STO)',
					children: [
						{ headerText: '기본', dataField: 'dpStoQty', width: 80, dataType: 'numeric' },
						{ headerText: 'BOX', dataField: 'dpStoBoxDisp', width: 90, dataType: 'numeric' },
						// { headerText: 'BOX', dataField: 'dpStoBox', width: 80, dataType: 'numeric' },
					],
				},

				{
					headerText: '반품',
					children: [
						/* 입고-PO */
						{ headerText: '기본', dataField: 'rtQty', width: 80, dataType: 'numeric' },
						{ headerText: 'BOX', dataField: 'rtBoxDisp', width: 90, dataType: 'numeric' },
						// { headerText: 'BOX', dataField: 'rtBox', width: 80, dataType: 'numeric' },
					],
				},
				/* 역감모 */

				{
					headerText: '역감모',
					children: [
						/* 입고-PO */
						{ headerText: '기본', dataField: 'dpAjDcQty', width: 80, dataType: 'numeric' },
						{ headerText: 'BOX', dataField: 'dpAjDcBoxDisp', width: 90, dataType: 'numeric' },
						// { headerText: 'BOX', dataField: 'dpAjDcBox', width: 80, dataType: 'numeric' },
					],
				},
				{
					headerText: '입고계',
					children: [
						{ headerText: '입고계', dataField: 'inTotalQty', width: 90, dataType: 'numeric' },
						{ headerText: 'BOX', dataField: 'inTotalBoxDisp', width: 100, dataType: 'numeric' },
					],
				},
			],
		},
		{
			headerText: '출고',
			children: [
				{
					headerText: '출고(SO)',
					children: [
						/* 입고-PO */
						{ headerText: '기본', dataField: 'wdSoQty', width: 80, dataType: 'numeric' },
						{ headerText: 'BOX', dataField: 'wdSoBoxDisp', width: 90, dataType: 'numeric' },
						// { headerText: 'BOX', dataField: 'wdSoBox', width: 80, dataType: 'numeric' },
					],
				},
				/* 출고-STO */
				{
					headerText: '출고(STO)',
					children: [
						/* 입고-PO */
						{ headerText: '기본', dataField: 'wdStoQty', width: 80, dataType: 'numeric' },
						{ headerText: 'BOX', dataField: 'wdStoBoxDisp', width: 90, dataType: 'numeric' },
						// { headerText: 'BOX', dataField: 'wdStoBox', width: 80, dataType: 'numeric' },
					],
				},
				/* 출고-SO */

				{
					headerText: '협력사 반품',
					children: [
						/* 입고-PO */
						{ headerText: '기본', dataField: 'wdPoQty', width: 80, dataType: 'numeric' },
						{ headerText: 'BOX', dataField: 'wdPoBoxDisp', width: 90, dataType: 'numeric' },
						// { headerText: 'BOX', dataField: 'wdPoBox', width: 80, dataType: 'numeric' },
					],
				},
				/* 감모 */
				{
					headerText: '감모',
					children: [
						/* 입고-PO */
						{ headerText: '기본', dataField: 'wdAjDcQty', width: 80, dataType: 'numeric' },
						{ headerText: 'BOX', dataField: 'wdAjDcBoxDisp', width: 90, dataType: 'numeric' },
						// { headerText: 'BOX', dataField: 'wdAjDcBox', width: 80, dataType: 'numeric' },
					],
				},
				{
					headerText: '매각',
					children: [
						/* 입고-PO */
						{ headerText: '기본', dataField: 'wdAjSaQty', width: 80, dataType: 'numeric' },
						{ headerText: 'BOX', dataField: 'wdAjSaBoxDisp', width: 90, dataType: 'numeric' },
						// { headerText: 'BOX', dataField: 'wdAjDcBox', width: 80, dataType: 'numeric' },
					],
				},
				/* 감모 */
				{
					headerText: '폐기',
					children: [
						/* 입고-PO */
						{ headerText: '기본', dataField: 'wdAjDuQty', width: 80, dataType: 'numeric' },
						{ headerText: 'BOX', dataField: 'wdAjDuBox', width: 90, dataType: 'numeric' },
						// { headerText: 'BOX', dataField: 'wdAjDcBox', width: 80, dataType: 'numeric' },
					],
				},
				/* 일합계 · 누적합계 */

				{
					headerText: '출고계',
					children: [
						/* 입고-PO */
						{ headerText: '출고계', dataField: 'outTotalQty', width: 90, dataType: 'numeric' },
						{ headerText: 'BOX', dataField: 'outTotalBoxDisp', width: 100, dataType: 'numeric' },
					],
				},
			],
		},
		{
			headerText: '기말재고',
			children: [
				/* 입고-PO */
				{ headerText: '기본', dataField: 'endQty', width: 90, dataType: 'numeric' },
				{ headerText: 'BOX', dataField: 'endBoxDisp', width: 100, dataType: 'numeric' },
			],
		},
	];

	const gridCol1 = [
		/* ── 기본 정보 ─────────────────────────────── */
		{
			dataField: 'deliveryDate',
			headerText: '수불일자',
			width: 110,

			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			dataField: 'docType',
			headerText: '수불유형',
			width: 80,
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: keyof typeof ioTypeMap) => {
				//커스텀 매핑
				return ioTypeMap[value];
			},
		},
		// {
		// 	dataField: 'deliveryType',
		// 	headerText: '배송유형',
		// 	width: 110,
		// 	dataType: 'code',
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: string, item: any) => {
		// 		// docType에 'WD'가 포함되어 있을 때만 값 반환
		// 		if (typeof item.docType === 'string' && item.docType.includes('WD')) {
		// 			return getCommonCodebyCd('DELIVERYTYPE', value)?.cdNm ?? value;
		// 		}
		// 		return '';
		// 	},
		// },

		/* ── 수량/BOX ─────────────────────────────── */
		{
			headerText: '수량',
			children: [
				{
					dataField: 'confirmQty',
					headerText: '확정수량',
					width: 100,
					dataType: 'numeric',
				},
				{
					dataField: 'confirmBox',
					headerText: '확정BOX',
					width: 90,
					dataType: 'numeric',
				},
			],
		},
		/* ── 거래처 정보 ───────────────────────────── */
		{
			headerText: '입/출고 업체',
			children: [
				// { dataField: 'custKey', headerText: '거래처코드', width: 110, dataType: 'code' },
				{
					dataField: 'custkey',
					headerText: '거래처코드',
					dataType: 'code',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(e.item, 'cust');
						},
					},
				},
				{ dataField: 'custName', headerText: '거래처명', width: 160, dataType: 'text' },
			],
		},

		/* ── BL / 계약 정보 ───────────────────────── */
		{
			headerText: '이력정보',
			children: [
				{ dataField: 'contractType', headerText: '계약유형', width: 90, dataType: 'code' },
				{ dataField: 'contractCustKey', headerText: '계약업체', width: 110, dataType: 'code' },
				{ dataField: 'contractCustName', headerText: '계약업체명', width: 160, dataType: 'text' },
				{ dataField: 'serialNo', headerText: '이력번호', width: 150, dataType: 'code' },
				{ dataField: 'convSerialNo', headerText: 'BL번호', width: 150 },

				/* ── PO 정보 ─────────────────────────────── */
				{ dataField: 'poKey', headerText: 'PO Key', width: 110, dataType: 'code' },
				{ dataField: 'poLine', headerText: 'PO Line', width: 80, dataType: 'code' },
			],
		},

		{
			headerText: '등록정보',
			children: [
				/* ── 등록·수정자 및 일시 ─────────────────── */
				{ dataField: 'addWho', headerText: '등록자', width: 90, dataType: 'manager', managerDataField: 'addWhoId' },

				{
					dataField: 'addDate',
					headerText: '등록일시',
					width: 160,
					dataType: 'date',
					formatString: 'yyyy-mm-dd HH:mm:ss',
				},

				{ dataField: 'editWho', headerText: '수정자', width: 90, dataType: 'manager', managerDataField: 'editWhoId' },
				{
					dataField: 'editDate',
					headerText: '수정일시',
					width: 160,
					dataType: 'date',
					formatString: 'yyyy-mm-dd HH:mm:ss',
				},
			],
		},
	];

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	//그리드 Pros 설정
	const gridProps = {
		editable: false,
		// showFooter: true,
	};
	const gridProps1 = {
		editable: false,
		// showFooter: true,
	};

	// 푸터 레이아웃 설정
	const footerLayout = [
		{
			dataField: 'organizeNm',
			positionField: 'organizeNm',
			operation: 'COUNT',
			postfix: ' rows',
		},
	];
	const footerLayout1 = [
		{
			dataField: 'deliveryDate',
			positionField: 'deliveryDate',
			operation: 'COUNT',
			postfix: ' rows',
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	//셀 클릭시 조회
	const searchDetail = () => {
		const gridRefCur = ref.gridRef.current;
		const gridRefCur1 = ref.gridRef1.current;
		const selectRow = gridRefCur?.getSelectedIndex()[0];
		const gridData = gridRefCur?.getGridData()[selectRow];
		const params = props.form.getFieldsValue();
		const searchParams = {
			sku: gridData.sku,
			organize: gridData.organize,
			blNo: params.blNo,
			fromDeliveryDate: params.date[0].format('YYYYMMDD'),
			toDeliveryDate: params.date[1].format('YYYYMMDD'),
			fixDcCode: dcCode ? dcCode : props.form.getFieldsValue().fixDcCode,
		};

		// 초기화
		gridRefCur1.clearGridData();
		// 상세 영역 초기화
		setDetailGridData([]);

		// API 호출
		apiGetDetailList(searchParams).then(res => {
			setDetailGridData(res.data);
			if (res.data.totalCount > -1) {
				setGridDetailTotalCount(res.data.totalCount);
			}
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	//데이터 세팅
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		const gridRefDtlCur = ref.gridRef1.current;
		if (gridRefCur) {
			gridRefDtlCur?.clearGridData();
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	//상단 그리드 클릭시 하단 그리드 데이터 세팅
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		const gridRefDtlCur = ref.gridRef1.current;
		if (gridRefCur) {
			gridRefCur.bind('selectionChange', function () {
				const selectRow = gridRefCur.getSelectedIndex()[0];
				const rowData = gridRefCur.getGridData()[selectRow];
				searchDetail();
			});
		}
	}, []);

	// 상세 데이터 조회
	useEffect(() => {
		const gridRefDtlCur = ref.gridRef1.current;
		if (gridRefDtlCur) {
			gridRefDtlCur.setGridData(detailGridData);

			if (detailGridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefDtlCur.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefDtlCur.setColumnSizeList(colSizeList);
			}
		}
	}, [detailGridData]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef1?.current?.resize?.('100%', '100%');
		ref.gridRef?.current?.resize?.('100%', '100%');
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
							<GridTopBtn gridTitle="수불내역" totalCnt={props.totalCnt} gridBtn={gridBtn} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid
								ref={ref.gridRef}
								name={gridId}
								columnLayout={gridCol}
								gridProps={gridProps}
								footerLayout={footerLayout}
							/>
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridTitle="수불상세내역" totalCnt={gridDetailTotalCount} gridBtn={gridBtn1} />
							<GridAutoHeight>
								<AUIGrid
									ref={ref.gridRef1}
									name={gridId1}
									columnLayout={gridCol1}
									gridProps={gridProps1}
									footerLayout={footerLayout1}
								/>
							</GridAutoHeight>
						</AGrid>
					</>,
				]}
			/>
		</>
	);
});
export default StDailyInoutExDcDetail;
