/*
 ############################################################################
 # FiledataField	: StAdjustResultDetail.tsx
 # Description		: 재고감모현황 Detail
 # Author			: 공두경
 # Since			: 25.05.16
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
import commUtil from '@/util/commUtil';
// API Call Function
import { apiGetDetailList } from '@/api/st/apiStAdjustResult';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';

const StAdjustResultDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef1 = useRef(null);
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
			fixdccode: selectedRow[0].dccode,
			storerkey: selectedRow[0].storerkey,
			docdt: selectedRow[0].docdt,
			docno: selectedRow[0].docno,
			sku: selectedRow[0].sku,
			reasoncode: searchParams.reasoncode,
			other01: searchParams.other01,
			other05: searchParams.other05,
			serialno: searchParams.serialno,
			iotype: searchParams.iotype,
			stocktype: searchParams.stocktype,
			blno: searchParams.blno,
			contractcompany: searchParams.contractcompany,
			searchserial: searchParams.searchserial,
		};
		if (
			!commUtil.isNull(params.blno) ||
			!commUtil.isNull(params.serialno) ||
			!commUtil.isNull(params.contractcompany)
		) {
			params.searchserial = 'Y';
		}

		apiGetDetailList(params).then(res => {
			const gridData = res.data;
			ref.gridRef1.current?.setGridData(gridData);
			setTotalCnt(res.data.length);
			const colSizeList = ref.gridRef1.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef1.current?.setColumnSizeList(colSizeList);
		});
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.DCCODE'), //물류센터
			dataField: 'dccode',
			dataType: 'code',
		},
		{
			headerText: t('lbl.ORGANIZE'), //창고
			dataField: 'organize',
			dataType: 'code',
		},
		{
			headerText: t('lbl.STOCKTYPE'), //재고위치
			dataField: 'stocktype',
			dataType: 'code',
		},
		{
			headerText: t('lbl.TRANDATE_AJ'), //조정일자
			dataField: 'trandt',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			width: 80,
			editable: false,
			filter: { showIcon: true },
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(e.item, 'sku');
				},
			},
		}, // 상품코드
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			width: 120,
			editable: false,
			dataType: 'name',
			filter: { showIcon: true },
		}, // 상품명
		{
			headerText: t('lbl.SERIALYN'), //식별번호유무
			dataField: 'serialyn',
			dataType: 'code',
		},
		{
			headerText: t('lbl.CONFIRMQTY_AJ'), //조정수량
			dataField: 'confirmqty',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.UOM'), //구매단위
			dataField: 'uom',
			dataType: 'code',
		},
		{
			headerText: t('lbl.REASONCODE_AJ'), //발생사유
			dataField: 'reasoncode',
			dataType: 'code',
		},
		{
			headerText: t('lbl.OTHER01_DMD_AJ'), //귀책
			dataField: 'other01',
			dataType: 'code',
		},
		{
			headerText: t('lbl.OTHER05_DMD_AJ'), //물류귀책배부
			dataField: 'other05',
			dataType: 'code',
		},
		{
			headerText: t('lbl.AJWDDPYN'), //증감여부
			dataField: 'iotype',
			dataType: 'code',
		},
		{
			headerText: t('lbl.REMARK_REASON'), // 비고(사유)
			dataField: 'memo2',
		},
		{
			headerText: t('lbl.ADDWHO'), //생성인
			dataField: 'addwho',
			dataType: 'manager',
			manager: 'addwho',
		},
		{
			headerText: t('lbl.ADDDATE'), //등록일자
			dataField: 'adddate',
			dataType: 'date',
		},
		{
			headerText: t('lbl.ADDTIME'), //생성시간
			dataField: 'addtime',
			dataType: 'code',
		},
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
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	//그리드 컬럼(상세목록 그리드)
	const gridCol1 = [
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					width: 80,
					editable: false,
					filter: { showIcon: true },
					dataType: 'code',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(e.item, 'sku');
						},
					},
				}, // 상품코드
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'),
					width: 120,
					editable: false,
					dataType: 'name',
					filter: { showIcon: true },
				}, // 상품명
			],
		},
		{
			headerText: t('lbl.LBL_LOC'), //로케이션
			dataField: 'loc',
		},
		{
			headerText: t('lbl.MANUFACTUREDT'), // 제조일자
			dataField: 'manufacturedt',
			editable: false,
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.EXPIREDT'), // 소비일자
			dataField: 'expiredt',
			editable: false,
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			width: 80,
			editable: false,
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 소비기간(잔여/전체)
		{
			headerText: t('lbl.SERIALINFO'), //상품이력정보
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'), //이력번호
					dataType: 'code',
				},
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'), //바코드
					dataType: 'code',
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'), //B/L번호
					dataType: 'code',
				},
				{
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT'), //도축일자
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'), //도축장
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT'), //유효일자(FROM)
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT'), //유효일자(TO)
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
				},
				{
					dataField: 'contracttype', //계약유형
					headerText: t('lbl.CONTRACTTYPE'),
					dataType: 'code',
				},
				{
					dataField: 'contractcompany', //계약업체
					headerText: t('lbl.CONTRACTCOMPANY'),
				},
				{
					dataField: 'contractcompanyname', // 계약업체명
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
				},
			],
		},
		{
			headerText: t('lbl.CONFIRMQTY_AJ'), //조정수량
			dataField: 'confirmqty',
			dataType: 'numeric',
		},
		{
			headerText: '귀속부서',
			children: [
				{
					dataField: 'costcd',
					headerText: '코드',
					dataType: 'code',
				},
				{
					dataField: 'costname',
					headerText: '명',
				},
			],
		},
		{
			headerText: t('lbl.UOM'), //구매단위
			dataField: 'uom',
			dataType: 'code',
		},
		{
			headerText: t('lbl.IOTYPE'), //입출고타입
			dataField: 'iotype',
			dataType: 'code',
		},
	];

	// 그리드 Props(상세목록 그리드)
	const gridProps1 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
	};

	// FooterLayout Props(상세목록 그리드)
	const footerLayout1 = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
			postfix: '',
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
		ref.gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn} gridTitle="재고감모목록" totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn} gridTitle="재고감모상세" totalCnt={totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef1} columnLayout={gridCol1} gridProps={gridProps1} footerLayout={footerLayout1} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
});

export default StAdjustResultDetail;
