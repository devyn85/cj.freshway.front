/*
 ############################################################################
 # FiledataField	: KpWdLoadMonitoringDetail.tsx
 # Description		: 상차검수현황(Detail)
 # Author			: 박요셉		
 # Since			: 25.12.12 
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import { GridBtnPropsType } from '@/types/common';
//Lib
import { apiPostDetailList } from '@/api/kp/apiKpWdLoadMonitoring';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
// Utils
// API Call Function

const KpWdLoadMonitoringDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef1 = useRef();
	const { form } = props; // Antd Form
	// Declare variable(1/4)
	const { t } = useTranslation();
	const [totalCnt1, setTotalCnt1] = useState(0);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 컬럼을 설정한다.
	 * @returns {object[]} 그리드 컬럼 설정 객체
	 */
	const getGridCol1 = () => {
		return [
			{
				dataField: 'slipdt',
				headerText: t('lbl.SOURCECONFIRMDATE_RT'), //출고일자
				dataType: 'code',
			},
			{
				headerText: t('lbl.DCCODE'), // 물류센터코드
				dataField: 'dccode',
				dataType: 'code',
			},
			{
				headerText: t('lbl.DCNAME'), // 물류센터명
				dataField: 'dcname',
				dataType: 'code',
			},
			{
				headerText: t('lbl.COURIER'), // 배송그룹
				dataField: 'courier',
				dataType: 'code',
			},
			{
				headerText: t('lbl.DELIVERYGROUP_WD'), //POP번호
				dataField: 'deliverygroup',
				dataType: 'code',
			},
			{
				headerText: t('lbl.PRIORITY'), //회차
				dataField: 'priority',
				dataType: 'code',
			},
			{
				headerText: t('lbl.VHCNUM'), //차량번호
				dataField: 'carno',
				dataType: 'code',
			},
			{
				headerText: t('lbl.CONTRACTTYPE'), //계약유형
				dataField: 'contracttype',
				dataType: 'code',
				labelFunction: (rowIndex: any, field: any, value: any, item: any) => {
					const list = getCommonCodeList('CONTRACTTYPE');
					const targetValue = value ?? '';
					const match = list.find(i => i.comCd == targetValue);
					return match ? match.cdNm : value;
				},
			},
			{
				headerText: t('lbl.DRIVERNAME'), //기사명
				dataField: 'drivername',
				dataType: 'string',
			},
			{
				headerText: t('lbl.OUTCARTIME'), // 출차시간
				dataField: 'dcdeparturedt',
				dataType: 'numeric',
			},
			{
				headerText: t('lbl.ORDERQTY'), // 주문수량
				dataField: 'orderqty',
				dataType: 'numeric',
			},
			{
				headerText: t('lbl.LOADCMPQTY'), //상차완료량
				dataField: 'loadcmpqty',
				dataType: 'numeric',
			},
			{
				headerText: t('lbl.LOADRATE'), //상차진행률
				dataField: 'loadrate',
				dataType: 'numeric',
				renderer: {
					type: 'BarRenderer',
					min: 0,
					max: 100,
				},
				styleFunction: (rowIndex: number, columnIndex: number, value: any) => {
					if (value <= 30) {
						return 'progress-bar-red';
					} else if (value > 30 && value <= 70) {
						return 'progress-bar-blue';
					} else {
						return 'progress-bar-green';
					}
				},
			},
			{
				headerText: t('lbl.SHORTAGEQTY'), //결품수량
				dataField: 'shortageqty',
				dataType: 'numeric',
			},
			{
				headerText: t('lbl.SHORTAGERATE'), //결품율
				dataField: 'shortagerate',
				dataType: 'numeric',
				renderer: {
					type: 'BarRenderer',
					min: 0,
					max: 100,
				},
				styleFunction: (rowIndex: number, columnIndex: number, value: any) => {
					if (value <= 30) {
						return 'progress-bar-red';
					} else if (value > 30 && value <= 70) {
						return 'progress-bar-blue';
					} else {
						return 'progress-bar-green';
					}
				},
			},
			{
				headerText: t('lbl.FORCECMPQTY'), //강제완료량
				dataField: 'forcecmpqty',
				dataType: 'numeric',
			},
			{
				headerText: t('lbl.FORCECMPRATE'), //강제완료률
				dataField: 'forcecmprate',
				dataType: 'numeric',
				renderer: {
					type: 'BarRenderer',
					min: 0,
					max: 100,
				},
				styleFunction: (rowIndex: number, columnIndex: number, value: any) => {
					if (value <= 30) {
						return 'progress-bar-red';
					} else if (value > 30 && value <= 70) {
						return 'progress-bar-blue';
					} else {
						return 'progress-bar-green';
					}
				},
			},
			{
				headerText: t('lbl.UNCONFIRMQTY_WD'), //미확정수량
				dataField: 'unconfirmqty',
				dataType: 'numeric',
			},
			{
				headerText: t('lbl.CONFIRMQTY_TASK'), //확정수량
				dataField: 'confirmqty',
				dataType: 'numeric',
			},
			{
				headerText: t('lbl.CONFIRMRATEPER'), //확정율
				dataField: 'confirmrate',
				dataType: 'numeric',
				renderer: {
					type: 'BarRenderer',
					min: 0,
					max: 100,
				},
				styleFunction: (rowIndex: number, columnIndex: number, value: any) => {
					if (value <= 30) {
						return 'progress-bar-red';
					} else if (value > 30 && value <= 70) {
						return 'progress-bar-blue';
					} else {
						return 'progress-bar-green';
					}
				},
			},
			{
				headerText: t('lbl.INSPECTED_YN'), // 검수완료여부
				dataField: 'forcecmpyn',
				dataType: 'code',
			},
		];
	};
	const getGridCol2 = () => {
		return [
			{
				headerText: t('lbl.VHCNUM'), //차량번호
				dataField: 'carno',
				dataType: 'code',
			},
			{
				headerText: t('lbl.DELIVERYGROUP_WD'), //POP번호
				dataField: 'deliverygroup',
				dataType: 'code',
			},
			{
				headerText: t('lbl.SKU'), // 상품코드
				dataField: 'sku',
				dataType: 'code',
			},
			{
				headerText: t('lbl.SKUNAME'), // 상품명
				dataField: 'skuname',
				dataType: 'string',
			},
			{
				headerText: t('lbl.ASSORTPICKCUST'), // 분류피킹업체
				dataField: 'assortpickcust',
			},
			{
				headerText: t('lbl.CHANNEL_DMD'), // 저장유무
				dataField: 'channel',
				dataType: 'code',
			},
			{
				headerText: t('lbl.ORDERQTY_WD'), // 주문수량
				dataField: 'orderqty',
				dataType: 'numeric',
			},
			{
				headerText: t('lbl.SCANQTY_WD'), //스캔완료수량
				dataField: 'scanqty',
				dataType: 'numeric',
			},
			{
				headerText: t('lbl.SHORTAGEQTY_WD'), // 현결품수량
				dataField: 'shortageqty',
				dataType: 'numeric',
			},
			{
				headerText: t('lbl.UOM_WD'), // 주문단위
				dataField: 'uom',
				dataType: 'code',
			},
			{
				headerText: t('lbl.VENDORNAME'), // 협력사명
				dataField: 'fromCustname',
				dataType: 'string',
			},
			{
				headerText: t('lbl.TO_VATOWNER'), //판매처명
				dataField: 'toCustname',
				dataType: 'string',
			},
			{
				headerText: t('lbl.INSPECTSTATUS_WD'), // 검수진행상태
				dataField: 'inspectstatus',
				dataType: 'code',
				labelFunction: (rowIndex: any, columnIndex: any, value: any, item: any) => {
					return value === '진행완료' ? '' : value;
				},
			},
		];
	};
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'carno',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'scanqty',
			positionField: 'scanqty',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'shortageqty',
			positionField: 'shortageqty',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			style: 'right',
		},
	];

	/**
	 * 그리드 속성을 설정한다.
	 * @returns {object} 그리드 속성 설정 객체
	 */
	const getGridProps1 = () => {
		return {
			editable: false,
			fillColumnSizeMode: false,
			enableColumnResize: true,
			enableFilter: true,
		};
	};
	const getGridProps2 = () => {
		return {
			editable: false,
			fillColumnSizeMode: false,
			enableColumnResize: true,
			enableFilter: true,
			showFooter: true,
		};
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [],
	};

	const searchDetailList = async (param: any) => {
		ref.gridRef1.current.clearGridData();
		// 조회 조건 설정
		const params = {
			dccode: param.dccode,
			carno: param.carno,
			slipdt: param.slipdt,
		};
		// API 호출
		apiPostDetailList(params).then(res => {
			ref.gridRef1.current.setGridData(res.data);
			setTotalCnt1(res.data.length);
			if (res.data != null && res.data.length > 0) {
				const colSizeList = ref.gridRef1.current.getFitColumnSizeList(true);
				ref.gridRef1.current.setColumnSizeList(colSizeList);
			}
		});
	};
	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);
		}
	}, [props.data]);

	useEffect(() => {
		ref.gridRef1?.current.clearGridData();
		const grid = ref.gridRef.current;
		grid.bind('selectionChange', (event: any) => {
			const selectedItem = grid.getItemByRowIndex(event.primeCell.rowIndex);
			searchDetailList(selectedItem);
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
							<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={getGridCol1()} gridProps={getGridProps1()} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.DETAIL')} totalCnt={totalCnt1} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid
								ref={ref.gridRef1}
								columnLayout={getGridCol2()}
								gridProps={getGridProps2()}
								footerLayout={footerLayout}
							/>
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
});

export default KpWdLoadMonitoringDetail;
