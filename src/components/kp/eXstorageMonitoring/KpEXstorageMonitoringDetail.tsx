/*
 ############################################################################
 # FiledataField	: KpEXstorageMonitoringDetail.tsx
 # Description		: 외부창고재고모니터링 상세
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.15
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';
// Utils

// API Call Function
import {
	getDataDetai1lList,
	getDataDetai2lList,
	getDataDetai3lList,
	getDataDetai4lList,
	getDataDetai5lList,
	getDataDetailList,
} from '@/api/kp/apiKpEXstorageMonitoring';
//type

//hooks
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';
import { useThrottle } from '@/hooks/useThrottle';
import { GridBtnPropsType } from '@/types/common';

const KpEXstorageMonitoringDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef1 = useRef();
	ref.gridRef2 = useRef();
	const [gridDetailTotalCount, setGridDetailTotalCount] = useState(0);
	const [gridDetailTotalCount1, setGridDetailTotalCount1] = useState(0);
	const [detailData, setDetailData] = useState([]);
	const [detailData1, setDetailData1] = useState([]);
	const [activeTabKey, setActiveTabKey] = useState('1');
	const activeTabKeyRef = useRef(activeTabKey);

	const { t } = useTranslation();
	const throttle = useThrottle(); // throttle 함수

	const gridId = uuidv4() + '_gridWrap';
	const detailGridId = uuidv4() + '_gridWrap';
	const detailGridId1 = uuidv4() + '_gridWrap';

	// 그리드 컬럼 세팅
	const MasterGridCol = [
		// 0. 승인번호

		{
			headerText: '승인번호',
			dataField: 'serialinfoCfmYn',
			visible: false,
		},
		{
			headerText: '승인번호',
			dataField: 'mapkeyNo',
			editable: false,
		},

		// 1~2. 구매문서 정보
		{
			headerText: '구매문서 정보',
			children: [
				{
					dataField: 'poKey',
					headerText: 'PO번호',
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'poLine',
					headerText: 'PO항번',
					dataType: 'text',
					editable: false,
				},
			],
		},

		// 3~4. 일자 정보
		{
			headerText: '일자 정보',
			children: [
				{ dataField: 'deliveryDate', headerText: '입고일자', dataType: 'date', editable: false },
				{ dataField: 'docDt', headerText: '생성일자', dataType: 'date', editable: false },
			],
		},

		// 5~6. 납품서번호
		{
			headerText: '납품서번호',
			children: [
				{ dataField: 'tmpDpkey', headerText: '가확정납품번호', dataType: 'text', editable: false },
				{ dataField: 'dpkey', headerText: '진확정납품번호', dataType: 'text', editable: false },
			],
		},

		// 7~8. 협력사정보
		{
			headerText: '협력사정보',
			children: [
				{ dataField: 'fromCustKey', headerText: '협력사코드', dataType: 'code', editable: false },
				{ dataField: 'fromCustName', headerText: '협력사명', dataType: 'text', editable: false },
			],
		},

		// 9~10. 창고정보
		{
			headerText: '창고정보',
			children: [
				{
					dataField: 'organize',
					headerText: '창고코드',
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'organizeName',
					headerText: '창고명',
					dataType: 'text',
					editable: false,
				},
			],
		},

		// 11‒13. 단일 헤더(병합 없음)
		{ headerText: '거래유형', dataField: 'contractType', dataType: 'text', editable: false },
		{ headerText: '이체여부', dataField: 'moveYn', dataType: 'text', editable: false },
		{ headerText: '가중량여부', dataField: 'tempYn', dataType: 'text', editable: false },

		// 14~16. WMS 처리가능여부
		{
			headerText: 'WMS처리가능여부',
			children: [
				{ dataField: 'tmpDpStatus', headerText: '가확정여부', dataType: 'text', editable: false },
				{ dataField: 'dpStatus', headerText: '진확정여부', dataType: 'text', editable: false },
				{ dataField: 'addDpStatus', headerText: '조정여부', dataType: 'text', editable: false },
			],
		},

		// 17~20. 입고정보
		{
			headerText: '입고정보',
			children: [
				{ dataField: 'dpWeight', headerText: '입고수량', dataType: 'number', editable: false },
				{ dataField: 'baseUom', headerText: '단위', dataType: 'text', editable: false },
				{ dataField: 'dpBoxQty', headerText: '입고박스', dataType: 'number', editable: false },
				{ dataField: 'qtyPerBox', headerText: '입수', dataType: 'number', editable: false },
			],
		},

		// 21~23. 출고현황
		{
			headerText: '출고현황',
			children: [
				{ dataField: 'wdQty', headerText: '출고수량', dataType: 'number', editable: false },
				{ dataField: 'baseUom', headerText: '단위', dataType: 'text', editable: false },
				{ dataField: 'wdBoxQty', headerText: '출고박스', dataType: 'number', editable: false },
			],
		},

		// 24~26. 조정현황
		{
			headerText: '조정현황',
			children: [
				{ dataField: 'adQty', headerText: '조정', dataType: 'number', editable: false },
				{ dataField: 'baseUom', headerText: '단위', dataType: 'text', editable: false },
				{ dataField: 'adBoxQty', headerText: '조정박스', dataType: 'number', editable: false },
			],
		},

		// 27~29. 잔여재고현황
		{
			headerText: '잔여재고현황',
			children: [
				{ dataField: 'qty', headerText: '잔여재고수량', dataType: 'number', editable: false },
				{ dataField: 'uom', headerText: '단위', dataType: 'text', editable: false },
				{ dataField: 'boxQty', headerText: '잔여재고박스', dataType: 'number', editable: false },
			],
		},

		// 30~36. 단일 헤더
		{ headerText: '생성인', dataField: 'createWho', dataType: 'text', editable: false },
		{ headerText: '등록인', dataField: 'regWho', dataType: 'text', editable: false },
		{ headerText: '등록일시', dataField: 'regDate', dataType: 'text', editable: false },
		{ headerText: '확정자(최종)', dataField: 'lastWho', dataType: 'text', editable: false },
		{ headerText: '확정처리일시(최종)', dataField: 'lastDate', dataType: 'text', editable: false },
		{ headerText: '진행상태', dataField: 'status', dataType: 'text', editable: false },
		{ headerText: '에러체크', dataField: 'errorStatus', dataType: 'text', editable: false },
	];

	const detailCol = [
		{ dataField: 'mapkeyNo', headerText: '승인번호', dataType: 'text', editable: false },
		{ dataField: 'status', headerText: '진행상태', dataType: 'text', editable: false },

		{
			headerText: '구매 문서 정보',
			children: [
				{ dataField: 'poKey', headerText: 'PO번호', dataType: 'text', editable: false },
				{ dataField: 'poLine', headerText: 'PO항번', dataType: 'text', editable: false },
				{ dataField: 'addPoKey', headerText: '조정PO', dataType: 'text', editable: false },
				{ dataField: 'addPoLine', headerText: '조정PO항번', dataType: 'text', editable: false },
			],
		},

		{ dataField: 'deliveryDate', headerText: '일자정보', dataType: 'text', editable: false },

		{
			headerText: '상품 정보',
			children: [
				{ dataField: 'sku', headerText: '상품코드', dataType: 'text', editable: false },
				{ dataField: 'skuName', headerText: '상품명', dataType: 'text', editable: false },
				{ dataField: 'storageTypeName', headerText: '저장구분', dataType: 'text', editable: false },
				{ dataField: 'org', headerText: '원산지', dataType: 'text', editable: false },
			],
		},

		{
			headerText: '품의 상신 내역',
			children: [
				{ dataField: 'tmpSerialNo', headerText: '이력번호', dataType: 'text', editable: false },
				{ dataField: 'tmpStockId', headerText: '바코드', dataType: 'text', editable: false },
				{ dataField: 'tmpConvSerialNo', headerText: 'B/L번호', dataType: 'text', editable: false },
				{ dataField: 'tmpLottable01', headerText: '기준일', dataType: 'text', editable: false },
				{ dataField: 'tmpQty', headerText: '수량', dataType: 'text', editable: false },
				{ dataField: 'uom', headerText: '단위', dataType: 'text', editable: false },
				{ dataField: 'tmpEtcQty2', headerText: '박스', dataType: 'text', editable: false },
				{ dataField: 'qtyPerBox', headerText: '입수량', dataType: 'text', editable: false },
			],
		},

		{ dataField: 'moveYn', headerText: '이체여부', dataType: 'text', editable: false },
		{ dataField: 'tempYn', headerText: '가중량여부', dataType: 'text', editable: false },

		{
			headerText: '고객정보',
			children: [
				{ dataField: 'contractCompany', headerText: '고객코드', dataType: 'text', editable: false },
				{ dataField: 'contractCompanyName', headerText: '고객명', dataType: 'text', editable: false },
			],
		},

		{ dataField: 'contractType', headerText: '계약구분', dataType: 'text', editable: false },
		{ dataField: 'payymd', headerText: '지급요청일', dataType: 'text', editable: false },
		{ dataField: 'receiveMemo', headerText: '요청사항(등록부서)', dataType: 'text', editable: false },

		{
			headerText: '첨부파일',
			children: [
				{ dataField: 'refDocId', headerText: '내부용', dataType: 'text', editable: false },
				{ dataField: 'refCustDocId', headerText: '외부용', dataType: 'text', editable: false },
			],
		},

		{
			headerText: '이력번호',
			children: [
				{ dataField: 'serialNo', headerText: '이력번호', dataType: 'text', editable: false },
				{ dataField: 'stockId', headerText: '바코드', dataType: 'text', editable: false },
				{ dataField: 'convSerialNo', headerText: 'B/L번호', dataType: 'text', editable: false },
				{ dataField: 'lottable01', headerText: '유통기한기준일', dataType: 'text', editable: false },
				{ dataField: 'durationTerm', headerText: '유통기간(잔여/전체)', dataType: 'text', editable: false },
				{ dataField: 'nearDurationYn', headerText: '임박여부', dataType: 'text', editable: false },
				{ dataField: 'orderQty', headerText: '수량', dataType: 'text', editable: false },
				{ dataField: 'uom', headerText: '단위', dataType: 'text', editable: false },
				{ dataField: 'etcQty', headerText: '박스', dataType: 'text', editable: false },
				{ dataField: 'qtyPerBox', headerText: '입수량', dataType: 'text', editable: false },
			],
		},

		{
			headerText: '조정입고정보',
			children: [
				{ dataField: 'addSerialNo', headerText: '이력번호', dataType: 'text', editable: false },
				{ dataField: 'addStockId', headerText: '바코드', dataType: 'text', editable: false },
				{ dataField: 'addConvSerialNo', headerText: 'B/L번호', dataType: 'text', editable: false },
				{ dataField: 'addDurationTerm', headerText: '유통기한 기준일', dataType: 'text', editable: false },
				{ dataField: 'addNearDurationYn', headerText: '임박여부', dataType: 'text', editable: false },
				{ dataField: 'addDurationTerm', headerText: '유통기간', dataType: 'text', editable: false },
				{ dataField: 'addOrderQty', headerText: '수량', dataType: 'text', editable: false },
				{ dataField: 'uom', headerText: '단위', dataType: 'text', editable: false },
				{ dataField: 'addBoxQty', headerText: '박스', dataType: 'text', editable: false },
				{ dataField: 'qtyPerBox', headerText: '입수량', dataType: 'text', editable: false },
			],
		},

		{ dataField: 'cancelRmk', headerText: '반려사유(SCM)', dataType: 'text', editable: false },
		{ dataField: 'sendMemo', headerText: '취소사유(영업취소종결사유)', dataType: 'text', editable: false },
		{ dataField: 'receiveMemo', headerText: '확인사항(SCM TEXT)', dataType: 'text', editable: false },
	];

	// 마스터 그리드 버튼 설정

	//그리드 Pros 설정

	const detailCol1 = [
		{
			dataField: 'mapkeyNo',
			headerText: '승인번호',
			editable: false,
			dataType: 'text',
		},
		{
			headerText: '출고지시서 정보',
			children: [
				{ dataField: 'faxCnt', headerText: '발송 횟수', dataType: 'text', editable: false },
				{ dataField: 'faxLastTrRslt', headerText: '성공여부(창고 수신여부)', dataType: 'text', editable: false },
				{ dataField: 'faxLastTrSenddate', headerText: '발송시간', dataType: 'text', editable: false },
				{ dataField: 'faxLastTrSendname', headerText: '발송 처리자', dataType: 'text', editable: false },
			],
		},
		{ dataField: 'status', headerText: '진행상태', dataType: 'text', editable: false },

		{
			headerText: '구매 문서 정보',
			children: [
				{ dataField: 'pokey', headerText: 'PO번호', dataType: 'text', editable: false },
				{ dataField: 'poline', headerText: 'PO항번', dataType: 'text', editable: false },
				{ dataField: 'addPoKey', headerText: '조정PO번호', dataType: 'text', editable: false },
				{ dataField: 'addPoLine', headerText: '조정PO항번', dataType: 'text', editable: false },
			],
		},

		{
			headerText: '주문 문서 정보',
			children: [
				{ dataField: 'tmpSoKey', headerText: '가SO번호', dataType: 'text', editable: false },
				{ dataField: 'tmpSoLine', headerText: '가SO 항번', dataType: 'text', editable: false },
				{ dataField: 'soKey', headerText: '진SO 번호', dataType: 'text', editable: false },
				{ dataField: 'soLine', headerText: '진SO항번', dataType: 'text', editable: false },
				{ dataField: 'adSoKey', headerText: '조정SO번호', dataType: 'text', editable: false },
				{ dataField: 'adSoLine', headerText: '조정SO항번', dataType: 'text', editable: false },
			],
		},

		{
			headerText: '상품정보',
			children: [
				{ dataField: 'sku', headerText: '상품코드', dataType: 'text', editable: false },
				{ dataField: 'skuName', headerText: '상품명', dataType: 'text', editable: false },
				{ dataField: 'storageTypeName', headerText: '저장구분', dataType: 'text', editable: false },
				{ dataField: 'org', headerText: '원산지', dataType: 'text', editable: false },
			],
		},

		{
			headerText: '고객정보',
			children: [
				{ dataField: 'fromCustKey', headerText: '고객코드', dataType: 'text', editable: false },
				{ dataField: 'fromCustName', headerText: '고객명', dataType: 'text', editable: false },
			],
		},

		{ dataField: 'contractType', headerText: '계약구분', dataType: 'text', editable: false },

		{
			headerText: '창고정보',
			children: [
				{ dataField: 'organize', headerText: '창고코드', dataType: 'text', editable: false },
				{ dataField: 'organizeName', headerText: '창고명', dataType: 'text', editable: false },
			],
		},

		{
			headerText: '가출고정보',
			children: [
				{ dataField: 'tmpSerialNo', headerText: '이력번호', dataType: 'text', editable: false },
				{ dataField: 'tmpStockId', headerText: '바코드', dataType: 'text', editable: false },
				{ dataField: 'tmpConvSerialNo', headerText: 'B/L번호', dataType: 'text', editable: false },
				{ dataField: 'tmpLottable01', headerText: '유통기한기준일', dataType: 'text', editable: false },
				{ dataField: 'tmpQty', headerText: '수량', dataType: 'text', editable: false },
				{ dataField: 'uom', headerText: '단위', dataType: 'text', editable: false },
				{ dataField: 'tmpEtcQty2', headerText: '박스', dataType: 'text', editable: false },
				{ dataField: 'qtyPerBox', headerText: '입수량', dataType: 'text', editable: false },
			],
		},

		{
			headerText: '첨부파일',
			children: [
				{ dataField: 'refDocId', headerText: '내부용', dataType: 'text', editable: false },
				{ dataField: 'refCustDocId', headerText: '외부용', dataType: 'text', editable: false },
			],
		},

		{
			headerText: '진출고정보',
			children: [
				{ dataField: 'serialNo', headerText: '이력정보', dataType: 'text', editable: false },
				{ dataField: 'stockId', headerText: '바코드', dataType: 'text', editable: false },
				{ dataField: 'convSerialNo', headerText: 'B/L번호', dataType: 'text', editable: false },
				{ dataField: 'lottable01', headerText: '유통기한기준일', dataType: 'text', editable: false },
				{ dataField: 'durationTerm', headerText: '유통기간(잔여/전체)', dataType: 'text', editable: false },
				{ dataField: 'nearDurationYn', headerText: '임박여부', dataType: 'text', editable: false },
				{ dataField: 'orderQty', headerText: '수량', dataType: 'number', editable: false },
				{ dataField: 'uom', headerText: '단위', dataType: 'text', editable: false },
				{ dataField: 'etcQty', headerText: '박스', dataType: 'text', editable: false },
				{ dataField: 'qtyPerBox', headerText: '입수량', dataType: 'text', editable: false },
			],
		},

		{
			headerText: '조정출고정보',
			children: [
				{ dataField: 'addSerialNo', headerText: '이력정보', dataType: 'text', editable: false },
				{ dataField: 'addStockId', headerText: '바코드', dataType: 'text', editable: false },
				{ dataField: 'addConvSerialNo', headerText: 'B/L번호', dataType: 'text', editable: false },
				{ dataField: 'addLottable01', headerText: '유통기한기준일', dataType: 'text', editable: false },
				{ dataField: 'addDurationTerm', headerText: '유통기간(잔여/전체)', dataType: 'text', editable: false },
				{ dataField: 'addNearDurationYn', headerText: '임박여부', dataType: 'text', editable: false },
				{ dataField: 'addOrderQty', headerText: '수량', dataType: 'number', editable: false },
				{ dataField: 'uom', headerText: '단위', dataType: 'text', editable: false },
				{ dataField: 'addBoxQty', headerText: '박스', dataType: 'text', editable: false },
				{ dataField: 'qtyPerBox', headerText: '입수량', dataType: 'text', editable: false },
			],
		},

		{ dataField: 'moveYn', headerText: '이체여부', dataType: 'text', editable: false },
		{ dataField: 'tempYn', headerText: '가중량여부', dataType: 'text', editable: false },
		{ dataField: 'cancelRmk', headerText: '취소사유(영업 취소종결사유)', dataType: 'text', editable: false },

		{
			dataField: 'reasonCode',
			headerText: '반려사유',
			dataType: 'combo',
			editable: true,
			comboData: { dataSource: 'ds_rejectReasonWd', labelField: 'basedescr', valueField: 'basecode' },
		},
		{ dataField: 'reasonMsg', headerText: '확인사항', dataType: 'text', editable: false },
	];

	const MasterGridProps = {
		editable: false,
		// showFooter: true,
	};
	const detailGridProps = {
		editable: false,
		// showFooter: true,
	};
	const detailGridProps1 = {
		editable: false,
		// showFooter: true,
	};
	const MasterFooterLayout = [
		{
			dataField: 'checkMemo',
			positionField: 'checkMemo',
			operation: 'COUNT',
			postfix: ' rows',
		},
		{
			dataField: 'checkCnt',
			positionField: 'checkCnt',
			operation: 'SUM',
			postfix: ' 건',
		},
	];
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};
	// 탭 아이템 영역
	const tabs = [
		{
			key: '1',
			label: '입고내역',
			children: (
				<>
					<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
						<GridTopBtn gridTitle="상세목록" totalCnt={gridDetailTotalCount} gridBtn={gridBtn} />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={ref.gridRef1} name={detailGridId} columnLayout={detailCol} gridProps={detailGridProps} />
					</GridAutoHeight>
				</>
			),
		},
		{
			key: '2',
			label: '출고내역',
			children: (
				<>
					<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
						<GridTopBtn gridTitle="상세목록" totalCnt={gridDetailTotalCount1} gridBtn={gridBtn} />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={ref.gridRef2} name={detailGridId1} columnLayout={detailCol1} gridProps={detailGridProps1} />
					</GridAutoHeight>
				</>
			),
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
		// 초기화
		gridRefCur1.clearGridData();
		setGridDetailTotalCount(0);
		const searchParam = {
			...gridData,
			pokey: gridData.poKey,
			poLine: gridData.poLine,
			mapDiv: props.form.getFieldsValue().mapDiv, // mapDiv 값을 props에서 가져옴
		};

		if (props.form.getFieldsValue().mapDiv === '20') {
			getDataDetailList(searchParam).then(res => {
				ref.gridRef1.current.setGridData(res.data);
				setDetailData(res.data);
				setGridDetailTotalCount(res.data.length);
			});
		} else if (props.form.getFieldsValue().mapDiv === '10' || props.form.getFieldsValue().mapDiv === '30') {
			getDataDetai1lList(searchParam).then(res => {
				ref.gridRef1.current.setGridData(res.data);
				setDetailData(res.data);
				setGridDetailTotalCount(res.data.length);
			});
		} else if (props.form.getFieldsValue().mapDiv === '40') {
			getDataDetai3lList(searchParam).then(res => {
				ref.gridRef1.current.setGridData(res.data);
				setDetailData(res.data);
				setGridDetailTotalCount(res.data.length);
			});
		}
	};

	//셀 클릭시 조회
	const searchDetailSub = () => {
		const gridRefCur = ref.gridRef.current;
		const gridRefCur2 = ref.gridRef2.current;
		const selectRow = gridRefCur?.getSelectedIndex()[0];
		const gridData = gridRefCur?.getGridData()[selectRow];

		// 초기화
		gridRefCur2.clearGridData();
		const searchParam = {
			...gridData,
			pokey: gridData.poKey,
			poLine: gridData.poLine,
			mapDiv: props.form.getFieldsValue().mapDiv, // mapDiv 값을 props에서 가져옴
		};

		if (props.form.getFieldsValue().mapDiv === '20') {
			getDataDetai2lList(searchParam).then(res => {
				ref.gridRef2.current.setGridData(res.data);
				setDetailData1(res.data);
				setGridDetailTotalCount1(res.data.length);
			});
		} else if (props.form.getFieldsValue().mapDiv === '10' || props.form.getFieldsValue().mapDiv === '30') {
			getDataDetai4lList(searchParam).then(res => {
				ref.gridRef2.current.setGridData(res.data);
				setDetailData1(res.data);
				setGridDetailTotalCount1(res.data.length);
			});
		} else if (props.form.getFieldsValue().mapDiv === '40') {
			getDataDetai5lList(searchParam).then(res => {
				ref.gridRef2.current.setGridData(res.data);
				setDetailData1(res.data);
				setGridDetailTotalCount1(res.data.length);
			});
		}
	};

	/* * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	//데이터 치 세팅
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

	//데이터 치 세팅
	useEffect(() => {
		const gridRefDtlCur = ref.gridRef1.current;
		if (gridRefDtlCur) {
			gridRefDtlCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefDtlCur.getFitColumnSizeList(true);
				gridRefDtlCur.setColumnSizeList(colSizeList);
			}
		}
	}, [detailData]);
	//데이터 치 세팅
	useEffect(() => {
		const gridRefDtl1Cur = ref.gridRef2.current;
		if (gridRefDtl1Cur) {
			gridRefDtl1Cur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefDtl1Cur.getFitColumnSizeList(true);
				gridRefDtl1Cur.setColumnSizeList(colSizeList);
			}
		}
	}, [detailData1]);
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur.bind('selectionChange', function () {
				if (props.totalCnt > 0) {
					if (activeTabKey === '1') {
						searchDetail();
					} else if (activeTabKey === '2') {
						searchDetailSub();
					}
				}
			});
		}
	}, []);

	useEffect(() => {
		const gridRefCur1 = ref.gridRef1?.current;
		const gridRefCur2 = ref.gridRef2?.current;
		if (props.totalCnt > 0) {
			if (activeTabKey === '1') {
				searchDetail();
			} else if (activeTabKey === '2') {
				searchDetailSub();
			}
		}
	}, [activeTabKey]);

	useEffect(() => {
		// initEvent();
		ref.gridRef1?.current.resize(); // 그리드 크기 조정
	});

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef1?.current?.resize?.('100%', '100%');
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
							<GridTopBtn gridTitle="목록" totalCnt={props.totalCnt} gridBtn={gridBtn} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid
								ref={ref.gridRef}
								name={gridId}
								columnLayout={MasterGridCol}
								gridProps={MasterGridProps}
								footerLayout={MasterFooterLayout}
							/>
						</GridAutoHeight>
					</>,
					<TabsArray
						key="KpEXstorageMonitoring-tabs"
						activeKey={activeTabKey}
						onChange={setActiveTabKey}
						items={tabs}
					/>,
				]}
			/>
		</>
	);
});
export default KpEXstorageMonitoringDetail;
