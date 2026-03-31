/*
 ############################################################################
 # FiledataField	: MsExDCSimulationDetail1.tsx
 # Description		: 외부창고정산 시뮬레이션 창고비교
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.23
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Utils

// Type
import { GridBtnPropsType } from '@/types/common';

// Store

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API

interface Props {
	gridData: any;
	saveFn: any;
}

const MsExDCSimulationDetail1 = forwardRef((props: Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 그리드 ref
	ref.gridRef = useRef();

	// atnd Form
	const [form] = Form.useForm();

	// 조회 총 건수
	const [totalCount, setTotalCount] = useState(0);

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'sku',
			headerText: t('lbl.SKUCD'), //상품코드
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'), //상품명
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'), //단위
			dataType: 'code',
		},
		{
			dataField: 'qty',
			headerText: t('lbl.QTY'), //수량
			dataType: 'numeric',
		},
		{
			dataField: 'storagetye',
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataType: 'code',
		},
		{
			dataField: 'skuLdesc',
			headerText: t('lbl.CLASS_BIG'), //상품대분류
			dataType: 'code',
		},
		{
			dataField: 'convserialno',
			headerText: t('lbl.CONVSERIALNO'), //B/L번호
			dataType: 'code',
		},
		{
			dataField: 'serialno',
			headerText: t('lbl.SERIALNO'), //이력번호
			dataType: 'code',
		},
		// {
		// 	dataField: 'ioFlag',
		// 	headerText: t('lbl.GUBUN_2'), //구분
		// 	dataType: 'code',
		// },
		// {
		// 	dataField: 'ioType',
		// 	headerText: t('lbl.R_DOCTYPE'), //유형
		// 	dataType: 'code',
		// },
		{
			headerText: '3개월 총금액', //3개월 총금액
			children: [
				{
					dataField: 'baseTotalAmount',
					headerText: t('lbl.BASE'), //기준
					dataType: 'numeric',
				},
				{
					dataField: 'cfTotalAmount',
					headerText: t('lbl.COMPARE'), //비교
					dataType: 'numeric',
				},
				{
					dataField: 'diffAmount',
					headerText: t('lbl.DIFF_AMOUNT'), //차이금액
					dataType: 'numeric',
				},
				{
					dataField: 'diffRate',
					headerText: t('lbl.DIFF_RATE'), //차이율
					dataType: 'numeric',
				},
			],
		},
		{
			headerText: '3개월 평균', //3개월 평균
			children: [
				{
					dataField: 'baseAvgTotalAmount',
					headerText: t('lbl.BASE'), //기준
					dataType: 'numeric',
				},
				{
					dataField: 'cfAvgTotalAmount',
					headerText: t('lbl.COMPARE'), //비교
					dataType: 'numeric',
				},
				{
					dataField: 'avgDiffAmount',
					headerText: t('lbl.DIFF_AMOUNT'), //차이금액
					dataType: 'numeric',
				},
				{
					dataField: 'avgDiffRate',
					headerText: t('lbl.DIFF_RATE'), //차이율
					dataType: 'numeric',
				},
			],
		},
		{
			headerText: '단가', //단가
			children: [
				{
					headerText: t('lbl.BASE'), //기준
					children: [
						{
							dataField: 'baseGrprice',
							headerText: t('lbl.DP_PRICE'), //입고료
							dataType: 'numeric',
						},
						{
							dataField: 'baseGiprice',
							headerText: t('lbl.WD_PRICE'), //출고료
							dataType: 'numeric',
						},
						{
							dataField: 'baseStorageprice',
							headerText: t('lbl.STORAGEPRICE'), //창고료
							dataType: 'numeric',
						},
						{
							dataField: 'basePltprice',
							headerText: t('lbl.PALLETPRICE'), //팔렛료
							dataType: 'numeric',
						},
						{
							dataField: 'baseWghprice',
							headerText: t('lbl.WGHPRICE'), //계근료
							dataType: 'numeric',
						},
						{
							dataField: 'baseWorkprice',
							headerText: t('lbl.WORK_AMOUNT'), //작업료
							dataType: 'numeric',
						},
					],
				},
				{
					headerText: t('lbl.COMPARE'), //비교
					children: [
						{
							dataField: 'cfGrprice',
							headerText: t('lbl.DP_PRICE'), //입고료
							dataType: 'numeric',
						},
						{
							dataField: 'cfGiprice',
							headerText: t('lbl.WD_PRICE'), //출고료
							dataType: 'numeric',
						},
						{
							dataField: 'cfStorageprice',
							headerText: t('lbl.STORAGEPRICE'), //창고료
							dataType: 'numeric',
						},
						{
							dataField: 'cfPltprice',
							headerText: t('lbl.PALLETPRICE'), //팔렛료
							dataType: 'numeric',
						},
						{
							dataField: 'cfWghprice',
							headerText: t('lbl.WGHPRICE'), //계근료
							dataType: 'numeric',
						},
						{
							dataField: 'cfWorkprice',
							headerText: t('lbl.WORK_AMOUNT'), //작업료
							dataType: 'numeric',
						},
					],
				},
			],
		},
		{
			headerText: 'M-2', //M-2
			children: [
				{
					headerText: t('lbl.BASE'), //기준
					children: [
						{
							dataField: 'baseM2SumAmount',
							headerText: t('lbl.SUBTOTAL'), //소계
							dataType: 'numeric',
						},
						{
							dataField: 'baseM2GrAmount',
							headerText: t('lbl.DP_PRICE'), //입고료
							dataType: 'numeric',
						},
						{
							dataField: 'baseM2GiAmount',
							headerText: t('lbl.WD_PRICE'), //출고료
							dataType: 'numeric',
						},
						{
							dataField: 'baseM2StockAmount',
							headerText: t('lbl.STORAGEPRICE'), //창고료
							dataType: 'numeric',
						},
						{
							dataField: 'baseM2PltAmount',
							headerText: t('lbl.PALLETPRICE'), //팔렛료
							dataType: 'numeric',
						},
						{
							dataField: 'baseM2WghAmount',
							headerText: t('lbl.WGHPRICE'), //계근료
							dataType: 'numeric',
						},
						{
							dataField: 'baseM2WorkAmount',
							headerText: t('lbl.WORK_AMOUNT'), //작업료
							dataType: 'numeric',
						},
					],
				},
				{
					headerText: t('lbl.COMPARE'), //비교
					children: [
						{
							dataField: 'cfM2SumAmount',
							headerText: t('lbl.SUBTOTAL'), //소계
							dataType: 'numeric',
						},
						{
							dataField: 'cfM2GrAmount',
							headerText: t('lbl.DP_PRICE'), //입고료
							dataType: 'numeric',
						},
						{
							dataField: 'cfM2GiAmount',
							headerText: t('lbl.WD_PRICE'), //출고료
							dataType: 'numeric',
						},
						{
							dataField: 'cfM2StockAmount',
							headerText: t('lbl.STORAGEPRICE'), //창고료
							dataType: 'numeric',
						},
						{
							dataField: 'cfM2PltAmount',
							headerText: t('lbl.PALLETPRICE'), //팔렛료
							dataType: 'numeric',
						},
						{
							dataField: 'cfM2WghAmount',
							headerText: t('lbl.WGHPRICE'), //계근료
							dataType: 'numeric',
						},
						{
							dataField: 'cfM2WorkAmount',
							headerText: t('lbl.WORK_AMOUNT'), //작업료
							dataType: 'numeric',
						},
					],
				},
			],
		},

		{
			headerText: 'M-1', //M-1
			children: [
				{
					headerText: t('lbl.BASE'), //기준
					children: [
						{
							dataField: 'baseM1SumAmount',
							headerText: t('lbl.SUBTOTAL'), //소계
							dataType: 'numeric',
						},
						{
							dataField: 'baseM1GrAmount',
							headerText: t('lbl.DP_PRICE'), //입고료
							dataType: 'numeric',
						},
						{
							dataField: 'baseM1GiAmount',
							headerText: t('lbl.WD_PRICE'), //출고료
							dataType: 'numeric',
						},
						{
							dataField: 'baseM1StockAmount',
							headerText: t('lbl.STORAGEPRICE'), //창고료
							dataType: 'numeric',
						},
						{
							dataField: 'baseM1PltAmount',
							headerText: t('lbl.PALLETPRICE'), //팔렛료
							dataType: 'numeric',
						},
						{
							dataField: 'baseM1WghAmount',
							headerText: t('lbl.WGHPRICE'), //계근료
							dataType: 'numeric',
						},
						{
							dataField: 'baseM1WorkAmount',
							headerText: t('lbl.WORK_AMOUNT'), //작업료
							dataType: 'numeric',
						},
					],
				},
				{
					headerText: t('lbl.COMPARE'), //비교
					children: [
						{
							dataField: 'cfM1SumAmount',
							headerText: t('lbl.SUBTOTAL'), //소계
							dataType: 'numeric',
						},
						{
							dataField: 'cfM1GrAmount',
							headerText: t('lbl.DP_PRICE'), //입고료
							dataType: 'numeric',
						},
						{
							dataField: 'cfM1GiAmount',
							headerText: t('lbl.WD_PRICE'), //출고료
							dataType: 'numeric',
						},
						{
							dataField: 'cfM1StockAmount',
							headerText: t('lbl.STORAGEPRICE'), //창고료
							dataType: 'numeric',
						},
						{
							dataField: 'cfM1PltAmount',
							headerText: t('lbl.PALLETPRICE'), //팔렛료
							dataType: 'numeric',
						},
						{
							dataField: 'cfM1WghAmount',
							headerText: t('lbl.WGHPRICE'), //계근료
							dataType: 'numeric',
						},
						{
							dataField: 'cfM1WorkAmount',
							headerText: t('lbl.WORK_AMOUNT'), //작업료
							dataType: 'numeric',
						},
					],
				},
			],
		},
		{
			headerText: 'M', //M
			children: [
				{
					headerText: t('lbl.BASE'), //기준
					children: [
						{
							dataField: 'baseMSumAmount',
							headerText: t('lbl.SUBTOTAL'), //소계
							dataType: 'numeric',
						},
						{
							dataField: 'baseMGrAmount',
							headerText: t('lbl.DP_PRICE'), //입고료
							dataType: 'numeric',
						},
						{
							dataField: 'baseMGiAmount',
							headerText: t('lbl.WD_PRICE'), //출고료
							dataType: 'numeric',
						},
						{
							dataField: 'baseMStockAmount',
							headerText: t('lbl.STORAGEPRICE'), //창고료
							dataType: 'numeric',
						},
						{
							dataField: 'baseMPltAmount',
							headerText: t('lbl.PALLETPRICE'), //팔렛료
							dataType: 'numeric',
						},
						{
							dataField: 'baseMWghAmount',
							headerText: t('lbl.WGHPRICE'), //계근료
							dataType: 'numeric',
						},
						{
							dataField: 'baseMWorkAmount',
							headerText: t('lbl.WORK_AMOUNT'), //작업료
							dataType: 'numeric',
						},
					],
				},
				{
					headerText: t('lbl.COMPARE'), //비교
					children: [
						{
							dataField: 'cfMSumAmount',
							headerText: t('lbl.SUBTOTAL'), //소계
							dataType: 'numeric',
						},
						{
							dataField: 'cfMGrAmount',
							headerText: t('lbl.DP_PRICE'), //입고료
							dataType: 'numeric',
						},
						{
							dataField: 'cfMGiAmount',
							headerText: t('lbl.WD_PRICE'), //출고료
							dataType: 'numeric',
						},
						{
							dataField: 'cfMStockAmount',
							headerText: t('lbl.STORAGEPRICE'), //창고료
							dataType: 'numeric',
						},
						{
							dataField: 'cfMPltAmount',
							headerText: t('lbl.PALLETPRICE'), //팔렛료
							dataType: 'numeric',
						},
						{
							dataField: 'cfMWghAmount',
							headerText: t('lbl.WGHPRICE'), //계근료
							dataType: 'numeric',
						},
						{
							dataField: 'cfMWorkAmount',
							headerText: t('lbl.WORK_AMOUNT'), //작업료
							dataType: 'numeric',
						},
					],
				},
			],
		},
	];

	// 그리드 속성 설정
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		enableFilter: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 데이터를 조회하면 그리드에 추가한다.
	 */
	useEffect(() => {
		if (ref.gridRef?.current && props.gridData) {
			ref.gridRef.current.setGridData(props.gridData);

			if (props.gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = ref.gridRef.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef.current.setColumnSizeList(colSizeList);
			}

			setTotalCount(props.gridData.length);
		}
	}, [props.gridData, ref.gridRef]);

	/**
	 * 그리드 버튼 함수 설정. 마스터 그리드.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef, // 타겟 그리드 Ref
			btnArr: [
				// {
				// 	btnType: 'btn1', // 시뮬레이션
				// 	callBackFn: props.saveFn,
				// },
				{
					btnType: 'excelDownload', // 엑셀다운로드
				},
			],
		};

		return gridBtn;
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 셀 더블클릭
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellDoubleClick', (event: any) => {
			if (event.dataField === 'sku') {
				// 상품코드 셀 더블클릭하면 상품상세팝업 표시
				ref.gridRef.current.openPopup(event.item, 'sku');
			}
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 *  초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	return (
		<>
			{/* 그리드 영역 정의 */}
			<AGrid>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn()} totalCnt={totalCount}></GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default MsExDCSimulationDetail1;
