/*
 ############################################################################
 # FiledataField	: MsPurchaseDCNewDetail.tsx
 # Description		: 기준정보 > 센터기준정보 > 수급마스터관리
 # Author			: JeongHyeongCheol
 # Since			: 25.06.26
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import GridTopBtn from '@/components/common/GridTopBtn';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store

// util

// API Call Function

// types
import { GridBtnPropsType } from '@/types/common';

interface MsPurchaseDCNewDetailProps {
	gridData?: Array<object>;
}
const MsPurchaseDCNewDetail = forwardRef((props: MsPurchaseDCNewDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const [totalCnt, setTotalCnt] = useState(0);

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'purchaseIn',
			headerText: '수발주IN',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			dataField: 'stockin',
			headerText: '재고IN',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			dataField: 'purchaseOut',
			headerText: '수발주OUT',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			dataField: 'stockout',
			headerText: '재고OUT',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), // 상품코드
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current.openPopup(
						{
							sku: e.item.sku,
						},
						'sku',
					);
				},
			},
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNM'), // 상품명
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'storagetypenm',
			headerText: t('lbl.STORAGETYPE'), // 저장조건
			dataType: 'code',
		},
		{
			dataField: 'skutypedescr',
			headerText: '상품유형구분',
			dataType: 'code',
		},
		{
			dataField: 'skuLdesc',
			headerText: '상품범주(대)',
			dataType: 'code',
		},
		{
			dataField: 'custsku',
			headerText: 'CJ상품코드',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'reference15',
			headerText: '체인전용구분',
		},
		{
			dataField: 'netweight',
			headerText: '단위중량(KG)',
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'qtyperbox',
			headerText: t('lbl.QTYPERBOX'), // 박스입수
			dataType: 'numeric',
		},
		{
			dataField: 'boxperplt',
			headerText: t('lbl.QTYPERPLT'), // PLT입수
			dataType: 'numeric',
		},
		{
			dataField: 'parentcustkey',
			headerText: t('lbl.BRAND_CUSTKEY'), // 본점코드
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'parentcustname',
			headerText: t('lbl.BRAND_CUSTNAME'), // 본점
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'brandnameFc',
			headerText: '브랜드마스터',
		},
		{
			dataField: 'custkey',
			headerText: '구매처코드',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'custname',
			headerText: t('lbl.CUSTNAME_PO'), // 구매처명
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'slaveCustkey',
			headerText: '실공급 협력사코드',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'slaveCustname',
			headerText: '실공급 협력사명',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'leadtime',
			headerText: t('lbl.LEADTIME'), // 리드타임
			dataType: 'numeric',
		},
		{
			dataField: 'moqVender',
			headerText: 'MOQ(업체 단위)',
			dataType: 'numeric',
		},
		{
			dataField: 'moqSku',
			headerText: 'MOQ(상품 단위)',
			dataType: 'numeric',
		},
		{
			dataField: 'lastbuyernm',
			headerText: '수급담당(최종)',
		},
		{
			dataField: 'supplycm',
			headerText: '공급SITE',
			dataType: 'code',
		},
		{
			dataField: 'stockdc',
			headerText: '재고배치',
			dataType: 'code',
		},
		{
			dataField: 'dupyn',
			headerText: '다원화유무',
			dataType: 'code',
		},
		{
			headerText: t('lbl.PODCCODE'), // 수급센터
			children: [
				{
					dataField: 'poDc2600',
					headerText: '이천(2600)',
					dataType: 'code',
				},
				{
					dataField: 'poDc2620',
					headerText: '수원(2620)',
					dataType: 'code',
				},
				{
					dataField: 'poDc2630',
					headerText: '수원2(2630)',
					dataType: 'code',
				},
				{
					dataField: 'poDc2650',
					headerText: '동탄(2650)',
					dataType: 'code',
				},
				{
					dataField: 'poDc2660',
					headerText: '동탄2(2660)',
					dataType: 'code',
				},
				{
					dataField: 'poDc2260',
					headerText: '양산(2260)',
					dataType: 'code',
				},
				{
					dataField: 'poDc2250',
					headerText: '양산직수입(2250)',
					dataType: 'code',
				},
				{
					dataField: 'poDc2230',
					headerText: '장성(2230)',
					dataType: 'code',
				},
				{
					dataField: 'poDc2270',
					headerText: '장성직수입(2270)',
					dataType: 'code',
				},
				{
					dataField: 'poDc1000',
					headerText: 'CJL(1000)',
					dataType: 'code',
				},
				{
					dataField: 'poDc2900',
					headerText: '인천유통(2900)',
					dataType: 'code',
				},
			],
		},
		{
			dataField: 'purchaseYn',
			headerText: '수발주유무',
			dataType: 'code',
		},
		{
			headerText: '이천',
			children: [
				{ dataField: 'buyerkeynm2600', headerText: '수급', dataType: 'code' },
				{ dataField: 'purchasetype2600', headerText: '발주', dataType: 'code' },
			],
		},
		{
			headerText: '수원',
			children: [
				{ dataField: 'buyerkeynm2620', headerText: '수급', dataType: 'code' },
				{ dataField: 'purchasetype2620', headerText: '발주', dataType: 'code' },
			],
		},
		{
			headerText: '수원2',
			children: [
				{ dataField: 'buyerkeynm2630', headerText: '수급', dataType: 'code' },
				{ dataField: 'purchasetype2630', headerText: '발주', dataType: 'code' },
			],
		},
		{
			headerText: '동탄',
			children: [
				{ dataField: 'buyerkeynm2650', headerText: '수급', dataType: 'code' },
				{ dataField: 'purchasetype2650', headerText: '발주', dataType: 'code' },
			],
		},
		{
			headerText: '동탄2',
			children: [
				{ dataField: 'buyerkeynm2660', headerText: '수급', dataType: 'code' },
				{ dataField: 'purchasetype2660', headerText: '발주', dataType: 'code' },
			],
		},
		{
			headerText: '양산',
			children: [
				{ dataField: 'buyerkeynm2260', headerText: '수급', dataType: 'code' },
				{ dataField: 'purchasetype2260', headerText: '발주', dataType: 'code' },
			],
		},
		{
			headerText: '양산직수입',
			children: [
				{ dataField: 'buyerkeynm2250', headerText: '수급', dataType: 'code' },
				{ dataField: 'purchasetype2250', headerText: '발주', dataType: 'code' },
			],
		},
		{
			headerText: '장성',
			children: [
				{ dataField: 'buyerkeynm2230', headerText: '수급', dataType: 'code' },
				{ dataField: 'purchasetype2230', headerText: '발주', dataType: 'code' },
			],
		},
		{
			headerText: '장성직수입',
			children: [
				{ dataField: 'buyerkeynm2270', headerText: '수급', dataType: 'code' },
				{ dataField: 'purchasetype2270', headerText: '발주', dataType: 'code' },
			],
		},
		{
			headerText: '제주센터',
			children: [
				{ dataField: 'buyerkeynm2041', headerText: '수급', dataType: 'code' },
				{ dataField: 'purchasetype2041', headerText: '발주', dataType: 'code' },
			],
		},
		{
			headerText: '1000',
			children: [
				{ dataField: 'buyerkeynm1000', headerText: '수급', dataType: 'code' },
				{ dataField: 'purchasetype1000', headerText: '발주', dataType: 'code' },
			],
		},
		{
			headerText: '2900',
			children: [
				{ dataField: 'buyerkeynm2900', headerText: '수급', dataType: 'code' },
				{ dataField: 'purchasetype2900', headerText: '발주', dataType: 'code' },
			],
		},
		{
			dataField: 'stockavgday',
			headerText: '일평균(EA)',
			dataType: 'numeric',
		},
		{
			dataField: 'stockday',
			headerText: t('lbl.STOCKDAY'), // 보유일
			dataType: 'numeric',
		},
		{
			dataField: 'stockuom',
			headerText: t('lbl.STOCKUOM'), // 재고단위
			dataType: 'numeric',
		},
		{
			dataField: 'stoInQty',
			headerText: '총이체입고량(EA)',
			dataType: 'numeric',
		},
		{
			dataField: 'stoOutQty',
			headerText: '총이체출고량(EA)',
			dataType: 'numeric',
		},
		{
			dataField: 'turnoverday',
			headerText: '회전일수',
			dataType: 'numeric',
		},
		{
			headerText: '재고(정상/가용)',
			children: [
				{ dataField: 'qtyTotal', headerText: '합계', dataType: 'code' },
				{ dataField: 'qtyTotalFw', headerText: 'FW합계', dataType: 'code' },
				{ dataField: 'qty2600', headerText: '이천', dataType: 'code' },
				{ dataField: 'qty2620', headerText: '수원', dataType: 'code' },
				{ dataField: 'qty2630', headerText: '수원2', dataType: 'code' },
				{ dataField: 'qty2650', headerText: '동탄', dataType: 'code' },
				{ dataField: 'qty2660', headerText: '동탄2', dataType: 'code' },
				{ dataField: 'qty2260', headerText: '양산', dataType: 'code' },
				{ dataField: 'qty2250', headerText: '양산직수입', dataType: 'code' },
				{ dataField: 'qty2230', headerText: '장성', dataType: 'code' },
				{ dataField: 'qty2270', headerText: '장성직수입', dataType: 'code' },
				{ dataField: 'qty2041', headerText: '제주', dataType: 'code' },
				{ dataField: 'qty1000', headerText: '1000', dataType: 'code' },
				{ dataField: 'qty2930', headerText: '백사', dataType: 'code' },
			],
		},
		{
			headerText: 'PLT수',
			children: [
				{ dataField: 'boxperpltQtyTotal', headerText: '합계', dataType: 'code' },
				{ dataField: 'boxperpltQtyTotalFw', headerText: 'FW합계', dataType: 'code' },
				{ dataField: 'plt2600', headerText: '이천', dataType: 'code' },
				{ dataField: 'plt2620', headerText: '수원', dataType: 'code' },
				{ dataField: 'plt2630', headerText: '수원2', dataType: 'code' },
				{ dataField: 'plt2650', headerText: '동탄', dataType: 'code' },
				{ dataField: 'plt2660', headerText: '동탄2', dataType: 'code' },
				{ dataField: 'plt2260', headerText: '양산', dataType: 'code' },
				{ dataField: 'plt2250', headerText: '양산직수입', dataType: 'code' },
				{ dataField: 'plt2230', headerText: '장성', dataType: 'code' },
				{ dataField: 'plt2270', headerText: '장성직수입', dataType: 'code' },
				{ dataField: 'plt2041', headerText: '제주', dataType: 'code' },
				{ dataField: 'plt1000', headerText: '1000', dataType: 'code' },
				{ dataField: 'plt2930', headerText: '백사', dataType: 'code' },
			],
		},
		{
			headerText: '주문량산정',
			children: [
				{ dataField: 'route2600', headerText: '이천' },
				{ dataField: 'route2620', headerText: '수원' },
				{ dataField: 'route2630', headerText: '수원2' },
				{ dataField: 'route2650', headerText: '동탄' },
				{ dataField: 'route2660', headerText: '동탄2' },
				{ dataField: 'route2260', headerText: '양산' },
				{ dataField: 'route2230', headerText: '장성' },
				{ dataField: 'route2041', headerText: '제주' },
				{ dataField: 'route1000', headerText: '1000' },
			],
		},
		{
			headerText: '월출고중량(D-1,KG)',
			children: [
				{ dataField: 'shipqty1wTotal', headerText: '전체', dataType: 'code' },
				{ dataField: 'shipqty1w2600', headerText: '이천', dataType: 'code' },
				{ dataField: 'shipqty1w2620', headerText: '수원', dataType: 'code' },
				{ dataField: 'shipqty1w2630', headerText: '수원2', dataType: 'code' },
				{ dataField: 'shipqty1w2650', headerText: '동탄', dataType: 'code' },
				{ dataField: 'shipqty1w2660', headerText: '동탄2', dataType: 'code' },
				{ dataField: 'shipqty1w2260', headerText: '양산', dataType: 'code' },
				{ dataField: 'shipqty1w2250', headerText: '양산직수입', dataType: 'code' },
				{ dataField: 'shipqty1w2230', headerText: '장성', dataType: 'code' },
				{ dataField: 'shipqty1w2270', headerText: '장성직수입', dataType: 'code' },
				{ dataField: 'shipqty1w2041', headerText: '제주', dataType: 'code' },
				{ dataField: 'shipqty1w1000', headerText: '1000', dataType: 'code' },
			],
		},
		{
			headerText: '월출고중량(D-2,KG)',
			children: [
				{ dataField: 'shipqty2wTotal', headerText: '전체', dataType: 'code' },
				{ dataField: 'shipqty2w2600', headerText: '이천', dataType: 'code' },
				{ dataField: 'shipqty2w2620', headerText: '수원', dataType: 'code' },
				{ dataField: 'shipqty2w2630', headerText: '수원2', dataType: 'code' },
				{ dataField: 'shipqty2w2650', headerText: '동탄', dataType: 'code' },
				{ dataField: 'shipqty2w2660', headerText: '동탄2', dataType: 'code' },
				{ dataField: 'shipqty2w2260', headerText: '양산', dataType: 'code' },
				{ dataField: 'shipqty2w2250', headerText: '양산직수입', dataType: 'code' },
				{ dataField: 'shipqty2w2230', headerText: '장성', dataType: 'code' },
				{ dataField: 'shipqty2w2270', headerText: '장성직수입', dataType: 'code' },
				{ dataField: 'shipqty2w2041', headerText: '제주', dataType: 'code' },
				{ dataField: 'shipqty2w1000', headerText: '1000', dataType: 'code' },
			],
		},
		{
			headerText: '월출고중량(D-3,KG)',
			children: [
				{ dataField: 'shipqty3wTotal', headerText: '전체', dataType: 'code' },
				{ dataField: 'shipqty3w2600', headerText: '이천', dataType: 'code' },
				{ dataField: 'shipqty3w2620', headerText: '수원', dataType: 'code' },
				{ dataField: 'shipqty3w2630', headerText: '수원2', dataType: 'code' },
				{ dataField: 'shipqty3w2650', headerText: '동탄', dataType: 'code' },
				{ dataField: 'shipqty3w2660', headerText: '동탄2', dataType: 'code' },
				{ dataField: 'shipqty3w2260', headerText: '양산', dataType: 'code' },
				{ dataField: 'shipqty3w2250', headerText: '양산직수입', dataType: 'code' },
				{ dataField: 'shipqty3w2230', headerText: '장성', dataType: 'code' },
				{ dataField: 'shipqty3w2270', headerText: '장성직수입', dataType: 'code' },
				{ dataField: 'shipqty3w2041', headerText: '제주', dataType: 'code' },
				{ dataField: 'shipqty3w1000', headerText: '1000', dataType: 'code' },
			],
		},
	];
	// 그리드 속성
	const gridProps = {
		editable: false,
		showRowCheckColumn: false,
		enableFilter: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
	};

	const initEvent = () => {
		// 에디팅 시작 이벤트 바인딩
		gridRef.current.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRef.current.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField == 'dccode') {
				return gridRef.current.isAddedById(event.item[rowIdField]);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 에디팅 시작 이벤트
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			setTotalCnt(props.gridData.length);
			gridRefCur?.setGridData(props.gridData);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.gridData]);

	return (
		<AGrid>
			<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={totalCnt} />
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

export default MsPurchaseDCNewDetail;
