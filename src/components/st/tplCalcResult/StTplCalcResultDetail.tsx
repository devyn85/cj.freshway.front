/*
  ############################################################################
 # FiledataField	: StTplCalcResultDetail.tsx
 # Description		: 정산 > 위탁물류 >  위탁정산내역현황
 # Author			: ParkYoSep
 # Since			: 2025.11.12
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// Redux
// API Call Function
const StTplCalcResultDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { savePrintList } = props;
	const { t } = useTranslation();
	const refModal = useRef(null);

	// Declare react Ref(2/4)

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================
	//getCommonCodeList('EXDC_INOUT_TYPE', '전체')
	// 그리드 컬럼
	const gridCol = [
		{
			dataField: 'yyyymm',
			headerText: t('lbl.STOCKMONTH'), //재고월
			dataType: 'date',
			formatString: 'yyyy-mm',
			width: 90,
		},
		{
			dataField: 'storagedaycnt',
			headerText: t('lbl.STORAGEDAYCNT'), //보관일수
			dataType: 'numeric',
			width: 60,
		},
		{
			dataField: 'deliverydate',
			headerText: t('lbl.EFFECTIVEDATE'), //적용일자
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			width: 90,
		},
		{
			dataField: 'inventoryDate',
			headerText: '최초입고일', //외부창고 최초 입고일t('lbl.EXDC_FIRSTDPDT')
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			width: 90,
		},

		{
			dataField: 'ioFlag',
			headerText: t('lbl.GUBUN_2'), //구분
			dataType: 'code',
			width: 40,
		},
		{
			dataField: 'toCustkey',
			headerText: t('lbl.TO_CUSTKEY_WD'), //관리처코드
			dataType: 'code',
			width: 90,
		},
		{
			dataField: 'toCustname',
			headerText: t('lbl.TO_CUSTNAME_WD'), //관리처명
			width: 200,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), //상품코드
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			width: 90,
		},
		{
			dataField: 'skuNm',
			headerText: t('lbl.SKUNM'), //상품명
			filter: {
				showIcon: true,
			},
			width: 250,
		},
		{
			dataField: 'quantity',
			headerText: '수량', //t('lbl.QCCONFIRMQTY_RT'), //처리수량
			dataType: 'numeric',
		},
		{
			dataField: 'currstock',
			headerText: '잔여수량', //t('lbl.QTY_ST'), //현재고수량->잔여수량
			dataType: 'numeric',
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'), //단위
			dataType: 'code',
		},
		{
			dataField: 'boxqty',
			headerText: t('lbl.BOXQTY'), //박스수량
			dataType: 'numeric',
		},

		// {
		// 	dataField: 'qtybox',
		// 	headerText: t('lbl.BOXQTY_ST'), //현재고박스수량
		// 	dataType: 'numeric',
		// },
		{
			dataField: 'boxuom',
			headerText: t('lbl.UOM'), //단위
			dataType: 'code',
		},
		{
			dataField: 'convserialno',
			headerText: t('lbl.CONVSERIALNO'), //선하증권번호
			dataType: 'code',
			editable: false,
			width: 140,
		},
		{
			dataField: 'grAmount',
			headerText: t('lbl.DP_PRICE'), //입고료
			dataType: 'numeric',
			width: 100,
		},
		{
			dataField: 'giAmount',
			headerText: t('lbl.WD_PRICE'), //출고료
			dataType: 'numeric',
			width: 100,
		},
		{
			dataField: 'stockAmount',
			headerText: t('lbl.STORAGEPRICE'), //창고료
			dataType: 'numeric',
			width: 100,
		},
		{
			dataField: 'wghprice',
			headerText: t('lbl.WGHPRICE'), //계근료
			dataType: 'numeric',
			width: 100,
		},
		{
			dataField: 'workAmount',
			headerText: t('lbl.WORK_AMOUNT'), //작업료
			dataType: 'numeric',
			width: 100,
		},
		{
			dataField: 'palletprice',
			headerText: t('lbl.PLT_COST'), //PLT비용
			dataType: 'numeric',
			width: 100,
		},
		{
			dataField: 'transprice',
			headerText: t('lbl.DELIVERYFEE_EXDC'), //운송료
			dataType: 'numeric',
			width: 100,
		},
		{
			dataField: 'sumAmount',
			headerText: t('lbl.SUM_STORAGEFEE'), //보관료합계
			dataType: 'numeric',
			width: 100,
		},
		{
			dataField: 'grPriceUpperTransbaseUom',
			headerText: '입고요율',
			formatString: '#,##0.##', // 표시 포맷
			dataType: 'numeric',
		},
		{
			dataField: 'giPriceUpperTransbaseUom',
			headerText: '출고요율', //t('lbl.'),
			formatString: '#,##0.##', // 표시 포맷
			dataType: 'numeric',
			width: 100,
		},
		{
			dataField: 'storagePriceUpperTransbaseUom',
			headerText: '보관요율', //t('lbl.'),
			formatString: '#,##0.##', // 표시 포맷
			dataType: 'numeric',
			width: 100,
		},
		{
			dataField: 'wghPriceUpperTransbaseUom',
			headerText: '계근요율', //t('lbl.'),
			formatString: '#,##0.##', // 표시 포맷
			dataType: 'numeric',
			width: 100,
		},
		{
			dataField: 'workPriceUpperTransbaseUom',
			headerText: '파레트요율', //t('lbl.'),
			formatString: '#,##0.##', // 표시 포맷
			dataType: 'numeric',
			width: 100,
		},
		{
			dataField: 'pltPriceUpperTransbaseUom',
			headerText: '작업비요율', //t('lbl.'),
			formatString: '#,##0.##', // 표시 포맷
			dataType: 'numeric',
			width: 100,
		},
		{
			dataField: 'addwho',
			visible: false,
		},
		{
			dataField: 'addwhoNm',
			headerText: t('lbl.ADDWHO'), //생성인
			dataType: 'manager',
			managerDataField: 'addWho',
		},
		{
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'), //등록일자
			dataType: 'code',
		},
		{
			dataField: 'editwho',
			visible: false,
		},
		{
			dataField: 'editwhoNm',
			headerText: t('lbl.EDITWHO'), //최종변경자
			dataType: 'manager',
			managerDataField: 'editwho',
		},
		{
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'), //최종변경시간
			dataType: 'code',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// selectionMode: 'multipleRows', // 다중 행 선택 모드
		exportToXlsxGridCustom: () => {
			const params = {
				drmUseYn: 'N', // DRM 해제
			};
			ref.current?.exportToXlsxGrid(params);
		},
	};

	const excelDownload = () => {};

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelDownload', //엑셀다운로드
				callBackFn: excelDownload,
			},
			{
				// 출력
				btnType: 'btn1',
				callBackFn: () => {
					savePrintList();
				},
			},
		],
	};

	/*** =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);
		}
		if (props.data.length > 0) {
			const colSizeList = gridRef.getFitColumnSizeList(true);

			gridRef.setColumnSizeList(colSizeList);
			//console.log((props.data);
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt}></GridTopBtn>
				<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CmSearchWrapper ref={refModal} />
		</>
	);
});
export default StTplCalcResultDetail;
