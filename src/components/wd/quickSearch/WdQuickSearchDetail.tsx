/*
 ############################################################################
 # FiledataField	: WdQuickSearchDetail.tsx
 # Description		: 출고 > 출고작업 > 퀵배송조회(Detail)
 # Author			: Canal Frame
 # Since			: 25.08.04
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
// Redux
// API Call Function

const WdQuickSearchDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form } = props; // Antd Form
	const refModal = useRef(null);
	const [detailTotalCnt, setDetailTotalCnt] = useState(0);

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	ref.gridRef1 = useRef(null);

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 팝업 취소 버튼
	 */
	const closeEventRdReport = () => {
		refModal.current.handlerClose();
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================
	/**
	 * 퀵 주문상탱 스타일 함수 - 상태명 컬럼
	 * @param rowIndex
	 * @param columnIndex
	 * @param value
	 * @param headerText
	 * @param item
	 */
	const styleBackGround02 = (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
		const status = item?.orderState ?? '';
		if (status === '취소') return 'gc-user50'; // 취소(회색)
		return '';
	};

	// 그리드 컬럼
	// 주문 상세 그리드 컬럼 (2단 헤더)
	const gridCol = [
		{
			headerText: t('주문 정보'),
			children: [
				{ dataField: 'orderDate', headerText: t('접수일자'), dataType: 'code', width: 130 },
				{ dataField: 'serialNumber', headerText: t('퀵주문번호'), dataType: 'code', width: 100 },
				{
					dataField: 'orderState',
					headerText: t('lbl.STATUS_DP'), // 진행상태
					dataType: 'code',
					width: 60,
					styleFunction: styleBackGround02,
				},
				//{ dataField: 'orderRegistType', headerText: t('주문 등록 타입'), dataType: 'code' },
				//{ dataField: 'completeTime', headerText: t('완료 시간'), dataType: 'code' },
				{ dataField: 'summary', headerText: t('주문 요약'), dataType: 'name', width: 200 },
			],
		},
		{
			headerText: t('고객/접수 정보'),
			children: [
				{ dataField: 'customerCode', headerText: t('고객 코드'), dataType: 'code', width: 100 },
				{ dataField: 'customerDepartment', headerText: t('접수부서'), width: 200 },
				{ dataField: 'respEmp', headerText: t('귀책담당자'), editable: false, width: 200 }, // 귀책담당자
				{ dataField: 'customerName', headerText: t('접수담당'), dataType: 'code', width: 200 },
				// { dataField: 'happyCall', headerText: t('해피콜 여부') },
			],
		},
		{
			headerText: t('출발지 정보'),
			children: [
				{ dataField: 'departureDepartment', headerText: t('출발지 부서'), dataType: 'name', width: 150 },
				{ dataField: 'departureStaff', headerText: t('출발지 담당자'), dataType: 'code', width: 100 },
				{ dataField: 'departureCustomer', headerText: t('출발지 고객명'), width: 150 },
				{ dataField: 'departureDongName', headerText: t('출발지 동명'), dataType: 'name', width: 100 },
				{ dataField: 'departureAddress', headerText: t('출발지 주소'), dataType: 'name', width: 200 },
			],
		},
		{
			headerText: t('도착지 정보'),
			children: [
				{ dataField: 'destinationCustomer', headerText: t('도착지 고객명'), dataType: 'code', width: 150 },
				{ dataField: 'destinationDongName', headerText: t('도착지 동명'), dataType: 'name', width: 100 },
				{ dataField: 'destinationAddress', headerText: t('도착지 주소'), dataType: 'name', width: 100 },
			],
		},
		{
			headerText: t('기사 정보'),
			children: [
				{ dataField: 'riderCode', headerText: t('기사 코드'), dataType: 'code', width: 100 },
				{ dataField: 'riderId', headerText: t('기사 ID'), dataType: 'code', width: 100 },
				{ dataField: 'riderName', headerText: t('기사 이름'), dataType: 'code', width: 100 },
				{ dataField: 'riderMobile', headerText: t('기사 연락처'), dataType: 'code', width: 100 },
				// { dataField: 'riderLon', headerText: t('기사 경도') },
				// { dataField: 'riderLat', headerText: t('기사 위도') },
			],
		},
		{
			headerText: t('비용 정보'),
			children: [
				{ dataField: 'totalCost', headerText: t('총 비용'), dataType: 'numeric', width: 100 },
				{ dataField: 'basicCost', headerText: t('기본 요금'), dataType: 'numeric', width: 100 },
				{ dataField: 'additionCost', headerText: t('추가 요금'), dataType: 'numeric', width: 100 },
				{ dataField: 'discountCost', headerText: t('할인 금액'), dataType: 'numeric', width: 100 },
				{ dataField: 'deliveryCost', headerText: t('배송 비용'), dataType: 'numeric', width: 100 },
			],
		},
		{
			headerText: t('기타'),
			children: [
				{ dataField: 'carType', headerText: t('차량 타입'), dataType: 'code', width: 100 },
				{ dataField: 'distince', headerText: t('이동 거리'), dataType: 'name', width: 100 },
				{ dataField: 'OEtc1', headerText: t('센터접수번호)'), dataType: 'name', width: 100 }, // 기타 필드 1(센터접수번호)
				{ dataField: 'OEtc2', headerText: t('VOC번호'), dataType: 'name', width: 100 }, // 기타 필드 2(VOC번호)
				{ dataField: 'OEtc3', headerText: t('센터코드'), dataType: 'name', width: 100 }, // 기타 필드 3(센터코드
				{ dataField: 'OEtc4', headerText: t('귀책사유'), dataType: 'name', width: 100 }, // 기타 필드 4(귀책사유)
				{ dataField: 'OEtc5', headerText: t('귀책부서'), dataType: 'name', width: 100 }, // 기타 필드 5(귀책부서)
				// { dataField: 'OEtc6', headerText: t('기타 필드 6'), dataType: 'name', width: 100 },
				// { dataField: 'OEtc7', headerText: t('기타 필드 7'), dataType: 'name', width: 100 },
				// { dataField: 'OEtc8', headerText: t('기타 필드 8'), dataType: 'name', width: 100 },
				// { dataField: 'OEtc9', headerText: t('기타 필드 9'), dataType: 'name', width: 100 },
				// { dataField: 'OEtc10', headerText: t('기타 필드 10'), dataType: 'name', width: 100 },
			],
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		showStateColumn: true,
		showRowCheckColumn: false,
		independentAllCheckBox: true,
		fillColumnSizeMode: false,
		showFooter: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.delYn == 'Y') {
				return 'color-danger';
			}
			return '';
		},
	};

	// FooterLayout Props
	const footerLayout: any[] = [];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			// if (props.data.length > 0) {
			// 	const colSizeList = gridRef.getFitColumnSizeList(true);
			// 	gridRef.setColumnSizeList(colSizeList);
			// }
		}
	}, [props.data]);

	useEffect(() => {
		//
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});
export default WdQuickSearchDetail;
