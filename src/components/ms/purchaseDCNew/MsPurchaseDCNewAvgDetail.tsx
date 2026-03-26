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

interface MsPurchaseDCNewMonthDetailProps {
	gridData?: Array<object>;
}
const MsPurchaseDCNewMonthDetail = forwardRef((props: MsPurchaseDCNewMonthDetailProps, gridRef: any) => {
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
			headerText: t('lbl.UOM_WEIGHT_RATE'), // 단위중량
			dataType: 'numeric',
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
				{
					dataField: 'qtyTotal',
					headerText: t('lbl.TOTAL'), // 합계
					dataType: 'code',
				},
				{
					dataField: 'qtyAvg',
					headerText: t('lbl.MONTH_AVG'), // 월평균
					dataType: 'code',
				},
				{
					dataField: 'qty01',
					headerText: '1일',
					dataType: 'code',
				},
				{
					dataField: 'qty02',
					headerText: '2일',
					dataType: 'code',
				},
				{
					dataField: 'qty03',
					headerText: '3일',
					dataType: 'code',
				},
				{
					dataField: 'qty04',
					headerText: '4일',
					dataType: 'code',
				},
				{
					dataField: 'qty05',
					headerText: '5일',
					dataType: 'code',
				},
				{
					dataField: 'qty06',
					headerText: '6일',
					dataType: 'code',
				},
				{
					dataField: 'qty07',
					headerText: '7일',
					dataType: 'code',
				},
				{
					dataField: 'qty08',
					headerText: '8일',
					dataType: 'code',
				},
				{
					dataField: 'qty09',
					headerText: '9일',
					dataType: 'code',
				},
				{
					dataField: 'qty10',
					headerText: '10일',
					dataType: 'code',
				},
				{
					dataField: 'qty11',
					headerText: '11일',
					dataType: 'code',
				},
				{
					dataField: 'qty12',
					headerText: '12일',
					dataType: 'code',
				},
				{
					dataField: 'qty13',
					headerText: '13일',
					dataType: 'code',
				},
				{
					dataField: 'qty14',
					headerText: '14일',
					dataType: 'code',
				},
				{
					dataField: 'qty15',
					headerText: '15일',
					dataType: 'code',
				},
				{
					dataField: 'qty16',
					headerText: '16일',
					dataType: 'code',
				},
				{
					dataField: 'qty17',
					headerText: '17일',
					dataType: 'code',
				},
				{
					dataField: 'qty18',
					headerText: '18일',
					dataType: 'code',
				},
				{
					dataField: 'qty19',
					headerText: '19일',
					dataType: 'code',
				},
				{
					dataField: 'qty20',
					headerText: '20일',
					dataType: 'code',
				},
				{
					dataField: 'qty21',
					headerText: '21일',
					dataType: 'code',
				},
				{
					dataField: 'qty22',
					headerText: '22일',
					dataType: 'code',
				},
				{
					dataField: 'qty23',
					headerText: '23일',
					dataType: 'code',
				},
				{
					dataField: 'qty24',
					headerText: '24일',
					dataType: 'code',
				},
				{
					dataField: 'qty25',
					headerText: '25일',
					dataType: 'code',
				},
				{
					dataField: 'qty26',
					headerText: '26일',
					dataType: 'code',
				},
				{
					dataField: 'qty27',
					headerText: '27일',
					dataType: 'code',
				},
				{
					dataField: 'qty28',
					headerText: '28일',
					dataType: 'code',
				},
				{
					dataField: 'qty29',
					headerText: '29일',
					dataType: 'code',
				},
				{
					dataField: 'qty30',
					headerText: '30일',
					dataType: 'code',
				},
				{
					dataField: 'qty31',
					headerText: '31일',
					dataType: 'code',
				},
			],
		},
		{
			headerText: 'PLT수',
			children: [
				{
					dataField: 'pltTotal',
					headerText: t('lbl.TOTAL'), // 합계
					dataType: 'code',
				},
				{
					dataField: 'pltAvg',
					headerText: t('lbl.MONTH_AVG'), // 월평균
					dataType: 'code',
				},
				{
					dataField: 'plt01',
					headerText: '1일',
					dataType: 'code',
				},
				{
					dataField: 'plt02',
					headerText: '2일',
					dataType: 'code',
				},
				{
					dataField: 'plt03',
					headerText: '3일',
					dataType: 'code',
				},
				{
					dataField: 'plt04',
					headerText: '4일',
					dataType: 'code',
				},
				{
					dataField: 'plt05',
					headerText: '5일',
					dataType: 'code',
				},
				{
					dataField: 'plt06',
					headerText: '6일',
					dataType: 'code',
				},
				{
					dataField: 'plt07',
					headerText: '7일',
					dataType: 'code',
				},
				{
					dataField: 'plt08',
					headerText: '8일',
					dataType: 'code',
				},
				{
					dataField: 'plt09',
					headerText: '9일',
					dataType: 'code',
				},
				{
					dataField: 'plt10',
					headerText: '10일',
					dataType: 'code',
				},
				{
					dataField: 'plt11',
					headerText: '11일',
					dataType: 'code',
				},
				{
					dataField: 'plt12',
					headerText: '12일',
					dataType: 'code',
				},
				{
					dataField: 'plt13',
					headerText: '13일',
					dataType: 'code',
				},
				{
					dataField: 'plt14',
					headerText: '14일',
					dataType: 'code',
				},
				{
					dataField: 'plt15',
					headerText: '15일',
					dataType: 'code',
				},
				{
					dataField: 'plt16',
					headerText: '16일',
					dataType: 'code',
				},
				{
					dataField: 'plt17',
					headerText: '17일',
					dataType: 'code',
				},
				{
					dataField: 'plt18',
					headerText: '18일',
					dataType: 'code',
				},
				{
					dataField: 'plt19',
					headerText: '19일',
					dataType: 'code',
				},
				{
					dataField: 'plt20',
					headerText: '20일',
					dataType: 'code',
				},
				{
					dataField: 'plt21',
					headerText: '21일',
					dataType: 'code',
				},
				{
					dataField: 'plt22',
					headerText: '22일',
					dataType: 'code',
				},
				{
					dataField: 'plt23',
					headerText: '23일',
					dataType: 'code',
				},
				{
					dataField: 'plt24',
					headerText: '24일',
					dataType: 'code',
				},
				{
					dataField: 'plt25',
					headerText: '25일',
					dataType: 'code',
				},
				{
					dataField: 'plt26',
					headerText: '26일',
					dataType: 'code',
				},
				{
					dataField: 'plt27',
					headerText: '27일',
					dataType: 'code',
				},
				{
					dataField: 'plt28',
					headerText: '28일',
					dataType: 'code',
				},
				{
					dataField: 'plt29',
					headerText: '29일',
					dataType: 'code',
				},
				{
					dataField: 'plt30',
					headerText: '30일',
					dataType: 'code',
				},
				{
					dataField: 'plt31',
					headerText: '31일',
					dataType: 'code',
				},
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
			<GridTopBtn
				gridTitle={t('lbl.LIST')} // 목록
				gridBtn={gridBtn}
				totalCnt={totalCnt}
			/>
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

export default MsPurchaseDCNewMonthDetail;
