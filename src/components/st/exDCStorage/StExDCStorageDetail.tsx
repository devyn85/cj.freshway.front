/*
 ############################################################################
 # FiledataField	: StExDCStorageDetail.tsx
 # Description		: 외부창고정산
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.21
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import { Button } from 'antd/lib';

// Utils
import { showAlert } from '@/util/MessageUtil';
6;
// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// Component
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import StExDCEtcFeePopup from '@/components/st/exDCStorage/StExDCEtcFeePopup';
import StExDCStorageExcelPopup from '@/components/st/exDCStorage/stExDCStorageExcelPopup';
import StExDCStoragePopup from '@/components/st/exDCStorage/StExDCStoragePopup';

// API
import { apiPostAuthority, apiPostSaveMasterList, apiPostSaveQtyEdit } from '@/api/st/apiStExDCStorage';

interface StExDCStorageDetailProps {
	dccode: any;
	gridData: any;
	totalCount: any;
	callBackFn: any;
	form: any;
}

const StExDCStorageDetail = forwardRef((props: StExDCStorageDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 그리드 표시된 데이터 건수
	const [currentCount, setCurrentCount] = useState(0);

	// 그리드에서 선택한 데이터
	const [checkedList, setCheckedList] = useState(null);

	// 보관료계산/보관료비용마감 구분
	const [popupProcType, setPopupProcType] = useState(null);

	// 권한 정보
	const authorityRef = useRef<any>(null);

	// 편집 모드 여부
	const isEditRef = useRef(false);

	// grid Ref
	ref.gridRef = useRef();

	// 기타비용등록  팝업용 Ref
	const refEtcFeeModal = useRef(null);

	// 비용마감  팝업용 Ref
	const refStorageFeeModal = useRef(null);

	// 엑셀 업로드 팝업 Ref
	const modalExcelRef = useRef(null);

	const closemonth = Form.useWatch('stockmonth', props.form);
	const organize = Form.useWatch('organize', props.form);
	const organizeName = Form.useWatch('organizeName', props.form);

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'serialkey',
			headerText: t('lbl.SERIALKEY'), //테이블 시리얼번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'status',
			headerText: t('lbl.STATUS'), //진행상태
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'yyyymm',
			headerText: t('lbl.STOCKMONTH'), //재고월
			dataType: 'date',
			formatString: 'yyyy-mm',
			editable: false,
		},
		{
			dataField: 'docno',
			headerText: t('lbl.DOCNO'), //문서번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toCustkey',
			headerText: t('lbl.TO_CUSTKEY_WD'), //관리처코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toCustname',
			headerText: t('lbl.TO_CUSTNAME_WD'), //관리처명
			editable: false,
		},
		{
			dataField: 'docline',
			headerText: t('lbl.R_DOCLINE'), //라인번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'parentDocno',
			headerText: t('lbl.TRANDP_NO'), //이전 입고 번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'parentDocline',
			headerText: t('lbl.TRANDP_LINENO'), //이전 입고 라인번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'ioFlag',
			headerText: t('lbl.GUBUN_2'), //구분
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'ioType',
			headerText: t('lbl.R_DOCTYPE'), //유형
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storagedaycnt',
			headerText: t('lbl.STORAGEDAYCNT'), //보관일수
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'deliverydate',
			headerText: t('lbl.EFFECTIVEDATE'), //적용일자
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			editable: false,
		},
		{
			dataField: 'inventoryDate',
			headerText: t('lbl.EXDC_FIRSTDPDT'), //외부창고 최초 입고일
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			editable: false,
		},
		{
			dataField: 'warehouseDate',
			headerText: t('lbl.DC_FIRSTDPDT'), //해당창고 최초 입고일
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			editable: false,
		},
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), //창고
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'organizename',
			headerText: t('lbl.ORGANIZENAME'), //창고명
			editable: false,
		},
		{
			dataField: 'custkey',
			headerText: t('lbl.CUSTKEY'), //거래처
			editable: false,
		},
		{
			dataField: 'itemStatus',
			headerText: t('lbl.STOCKGRADE'), //재고속성
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'somdname',
			headerText: 'MD', //MD
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'skuLdesc',
			headerText: t('lbl.CLASS_BIG'), //대분류
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'skuDdesc',
			headerText: t('lbl.CLASS_DETAIL'), //세분류
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), //상품코드
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'skuNm',
			headerText: t('lbl.SKUNM'), //상품명
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'quantity',
			headerText: t('lbl.QCCONFIRMQTY_RT'), //처리수량
			dataType: 'numeric',
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				showEditorBtnOver: false,
				onlyNumeric: true,
				allowPoint: true,
				allowNegative: true,
				textAlign: 'right',
				maxlength: 10,
				autoThousandSeparator: true,
			},
			formatString: '#,##0.###',
		},
		{
			dataField: 'currstock',
			headerText: t('lbl.QTY_ST'), //현재고수량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'), //단위
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'boxqty',
			headerText: t('lbl.BOXQTY'), //박스수량
			dataType: 'numeric',
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				showEditorBtnOver: false,
				onlyNumeric: true,
				allowPoint: true,
				allowNegative: true,
				textAlign: 'right',
				maxlength: 10,
				autoThousandSeparator: true,
			},
		},
		{
			dataField: 'qtybox',
			headerText: t('lbl.BOXQTY_ST'), //현재고박스수량
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'boxuom',
			headerText: t('lbl.UOM'), //단위
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'qtyperbox',
			headerText: t('lbl.QTYPERBOX'), //박스입수
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'netweight',
			headerText: t('lbl.WEIGHTPERUNIT'), //순중량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'pokey',
			headerText: t('lbl.POKEY_EXDC'), //발주번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'poline',
			headerText: t('lbl.LINENO'), //항번
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'tcspokey',
			headerText: t('lbl.TCSPOKEY'), //수출입발주번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'convserialno',
			headerText: t('lbl.BLNO'), //BL번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'containerno',
			headerText: t('lbl.CONTAINERNO'), //콘테이너번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'serialno',
			headerText: t('lbl.SERIALNO'), //유통이력번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'stockid',
			headerText: t('lbl.STOCKID'), //바코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'contracttype',
			headerText: t('lbl.CONTRACTTYPE'), //계약유형
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'grAmount',
			headerText: t('lbl.DP_PRICE'), //입고료
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowPoint: true,
				disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					return item.editflag !== 'Y';
				},
			},
			styleFunction: (
				rowIndex: number,
				columnIndex: number,
				value: any,
				headerText: string,
				item: any,
				dataField: any,
			) => {
				if (item && item.editflag === 'Y') {
					return 'isEdit';
				}
				ref.gridRef.current.removeEditClass(columnIndex);
			},
			editable: true,
		},
		{
			dataField: 'giAmount',
			headerText: t('lbl.WD_PRICE'), //출고료
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowPoint: true,
				disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					return item.editflag !== 'Y';
				},
			},
			styleFunction: (
				rowIndex: number,
				columnIndex: number,
				value: any,
				headerText: string,
				item: any,
				dataField: any,
			) => {
				if (item && item.editflag === 'Y') {
					return 'isEdit';
				}
				ref.gridRef.current.removeEditClass(columnIndex);
			},
			editable: true,
		},
		{
			dataField: 'stockAmount',
			headerText: t('lbl.STORAGEPRICE'), //창고료
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowPoint: true,
				disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					return item.editflag !== 'Y';
				},
			},
			styleFunction: (
				rowIndex: number,
				columnIndex: number,
				value: any,
				headerText: string,
				item: any,
				dataField: any,
			) => {
				if (item && item.editflag === 'Y') {
					return 'isEdit';
				}
				ref.gridRef.current.removeEditClass(columnIndex);
			},
			editable: true,
		},
		{
			dataField: 'wghprice',
			headerText: t('lbl.WGHPRICE'), //계근료
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowPoint: true,
				disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					return item.editflag !== 'Y';
				},
			},
			styleFunction: (
				rowIndex: number,
				columnIndex: number,
				value: any,
				headerText: string,
				item: any,
				dataField: any,
			) => {
				if (item && item.editflag === 'Y') {
					return 'isEdit';
				}
				ref.gridRef.current.removeEditClass(columnIndex);
			},
			editable: true,
		},
		{
			dataField: 'workAmount',
			headerText: t('lbl.WORK_AMOUNT'), //작업료
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowPoint: true,
				disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					return item.editflag !== 'Y';
				},
			},
			styleFunction: (
				rowIndex: number,
				columnIndex: number,
				value: any,
				headerText: string,
				item: any,
				dataField: any,
			) => {
				if (item && item.editflag === 'Y') {
					return 'isEdit';
				}
				ref.gridRef.current.removeEditClass(columnIndex);
			},
			editable: true,
		},
		{
			dataField: 'palletprice',
			headerText: t('lbl.PLT_COST'), //PLT비용
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowPoint: true,
				disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					return item.editflag !== 'Y';
				},
			},
			styleFunction: (
				rowIndex: number,
				columnIndex: number,
				value: any,
				headerText: string,
				item: any,
				dataField: any,
			) => {
				if (item && item.editflag === 'Y') {
					return 'isEdit';
				}
				ref.gridRef.current.removeEditClass(columnIndex);
			},
			editable: true,
		},
		{
			dataField: 'sumAmount',
			headerText: t('lbl.SUM_STORAGEFEE'), //보관료합계
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'monthExpNo',
			headerText: t('lbl.CLOSEFEE_NO'), //마감비용번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'ifStorageAmount',
			headerText: '기정산보관료', //기정산보관료
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'ifEtcAmount',
			headerText: '기정산운송료', //기정산운송료
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'stockAmountSafs',
			headerText: '보관료(영업공가)', //보관료(영업공가)
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'stockAmountSafsTaxcls',
			headerText: '보관료(영업)', //보관료(영업)
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'transprice',
			headerText: '운송료(비용전표)', //운송료(비용전표)
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'etcprice',
			headerText: t('lbl.ETC_COST'), //기타비용
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'deliveryflag',
			headerText: t('lbl.MOVEYN'), //이체여부
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'claimFlag',
			headerText: t('lbl.CLAIM_YN'), //클레임생성여부
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'taxCls',
			headerText: t('lbl.TAXCODE'), //세금코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'costcd',
			headerText: t('lbl.COSTCENTERCODE'), //코스트센터코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'expensetype',
			headerText: t('lbl.COSTTYPE'), //비용구분
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'grprice',
			headerText: t('lbl.DP_CHARGE'), //입고수수료
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.##',
		},
		{
			dataField: 'giprice',
			headerText: t('lbl.WD_CHARGE'), //출고수수료
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.##',
		},
		{
			dataField: 'storageprice',
			headerText: t('lbl.STORAGE_CHARGE'), //창고료
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.##',
		},
		{
			dataField: 'wghFee',
			headerText: t('lbl.WGH_FEE'), //계근수수료
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.##',
		},
		{
			dataField: 'workFee',
			headerText: t('lbl.WORK_FEE'), //작업수수료
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.##',
		},
		{
			dataField: 'palletFee',
			headerText: t('lbl.PALLET_FEE'), //PLT수수료
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.##',
		},
		// {
		// 	dataField: 'stogrprice',
		// 	headerText: t('lbl.STOGRPRICE'), //이체입고료
		// 	dataType: 'numeric',
		// 	editable: false,
		// },
		// {
		// 	dataField: 'stogiprice',
		// 	headerText: t('lbl.STOGIPRICE'), //이체출고료
		// 	dataType: 'numeric',
		// 	editable: false,
		// },
		{
			dataField: 'bgrprice',
			headerText: '전년 입고수수료', //전년 입고수수료
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'bgiprice',
			headerText: '전년 출고수수료', //전년 출고수수료
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'bstorageprice',
			headerText: '전년 창고수수료', //전년 창고수수료
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'grrate',
			headerText: '입고료 증감율(%)', //입고료 증감율
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'girate',
			headerText: '출고료 증감율(%)', //출고료 증감율
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storate',
			headerText: '창고료 증감율(%)', //창고료 증감율
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'grrateamt',
			headerText: '입고료 증감금액', //입고료 증감금액
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'girateamt',
			headerText: '출고료 증감금액', //출고료 증감금액
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'storateamt',
			headerText: '창고료 증감금액', //창고료 증감금액
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'addwhoNm',
			headerText: t('lbl.ADDWHO'), //생성인
			dataType: 'manager',
			managerDataField: 'addWho',
			editable: false,
		},
		{
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'), //등록일자
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'editwhoNm',
			headerText: t('lbl.EDITWHO'), //최종변경자
			dataType: 'manager',
			managerDataField: 'editwho',
			editable: false,
		},
		{
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'), //최종변경시간
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'dccode',
			headerText: t('lbl.PLANT'), //플랜트
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'dcname',
			headerText: t('lbl.PLANT_NM'), //플랜트명
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'storerkey',
			visible: false,
		},
		{
			dataField: 'editflag',
			visible: false,
		},
		{
			dataField: 'addwho',
			visible: false,
			dataType: 'manager',
			managerDataField: 'addwho',
		},
		{
			dataField: 'editwho',
			visible: false,
		},
		{
			dataField: 'tplYn',
			visible: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		enableFilter: true,
		showFooter: true,
	};

	// 그리드 푸터 레이아웃 설정
	const footerLayout = [
		{
			dataField: 'quantity',
			positionField: 'quantity',
			operation: 'SUM',
			formatString: '#,###.###',
		},
		{
			dataField: 'currstock',
			positionField: 'currstock',
			operation: 'SUM',
			formatString: '#,###.###',
		},
		{
			dataField: 'boxqty',
			positionField: 'boxqty',
			operation: 'SUM',
			formatString: '#,###.###',
		},
		{
			dataField: 'qtybox',
			positionField: 'qtybox',
			operation: 'SUM',
			formatString: '#,###.###',
		},
		{
			dataField: 'grAmount',
			positionField: 'grAmount',
			operation: 'SUM',
			formatString: '#,###.##',
		},
		{
			dataField: 'giAmount',
			positionField: 'giAmount',
			operation: 'SUM',
			formatString: '#,###.##',
		},
		{
			dataField: 'stockAmount',
			positionField: 'stockAmount',
			operation: 'SUM',
			formatString: '#,###.##',
		},

		{
			dataField: 'wghprice',
			positionField: 'wghprice',
			operation: 'SUM',
			formatString: '#,###.##',
		},
		{
			dataField: 'workAmount',
			positionField: 'workAmount',
			operation: 'SUM',
			formatString: '#,###.##',
		},
		{
			dataField: 'palletprice',
			positionField: 'palletprice',
			operation: 'SUM',
			formatString: '#,###.##',
		},

		{
			dataField: 'sumAmount',
			positionField: 'sumAmount',
			operation: 'SUM',
			formatString: '#,###.##',
		},
		{
			dataField: 'ifStorageAmount',
			positionField: 'ifStorageAmount',
			operation: 'SUM',
			formatString: '#,###.##',
		},
		{
			dataField: 'ifEtcAmount',
			positionField: 'ifEtcAmount',
			operation: 'SUM',
			formatString: '#,###.##',
		},
		{
			dataField: 'stockAmountSafs',
			positionField: 'stockAmountSafs',
			operation: 'SUM',
			formatString: '#,###.##',
		},
		{
			dataField: 'stockAmountSafsTaxcls',
			positionField: 'stockAmountSafsTaxcls',
			operation: 'SUM',
			formatString: '#,###.##',
		},
		{
			dataField: 'grprice',
			positionField: 'grprice',
			operation: 'SUM',
			formatString: '#,###.##',
		},
		{
			dataField: 'giprice',
			positionField: 'giprice',
			operation: 'SUM',
			formatString: '#,###.##',
		},
		{
			dataField: 'storageprice',
			positionField: 'storageprice',
			operation: 'SUM',
			formatString: '#,###.##',
		},
		{
			dataField: 'stogrprice',
			positionField: 'stogrprice',
			operation: 'SUM',
			formatString: '#,###.##',
		},
	];

	const [columnLayout, setColumnLayout] = useState<any[]>(gridCol); // 초기값 설정

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드에서 선택한 데이터를 확인하고, 저장을 진행합니다.
	 * 저장 후 재 조회 실행.
	 */
	const saveMasterList = () => {
		// 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const checkedItems = ref.gridRef.current.getChangedData({ validationYn: false });

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		ref.gridRef.current.showConfirmSave(() => {
			const params = {
				fixdccode: props.dccode,
				saveList: checkedItems,
			};

			apiPostSaveMasterList(params).then(res => {
				if (res.statusCode === 0) {
					props.callBackFn?.(true);
				}
			});
		});
	};

	/**
	 * 기타비용등록 팝업을 실행한다.
	 * 저장 후 재 조회 실행.
	 */
	const saveEtcFee = () => {
		// 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		// 데이터를 검증한다.
		let docTypePrev = 'DEFAULT';
		let docTypeCurr = 'DEFAULT';

		for (const item of checkedItems) {
			docTypePrev = docTypeCurr;
			docTypeCurr = item.ioFlag;
			const ioType = item.ioType;
			const tplYn = item.tplYn;

			if (docTypePrev === 'DEFAULT') {
				docTypePrev = docTypeCurr;
			}

			if (tplYn === 'Y') {
				showAlert(null, '기타비용 등록시 위탁물류상품은 선택할 수 없습니다.');
				return;
			} else if (docTypeCurr !== 'DEFAULT' && docTypeCurr !== docTypePrev) {
				showAlert(null, '기타비용 등록시 입/출고 구분은 한 종류로만 선택 가능합니다.');
				return;
			} else if (ioType !== '상품') {
				showAlert(null, '기타비용 등록은 품목유형이 상품인 경우에만 가능합니다.');
				return;
			}
		}

		// 그리드에서 선택한 데이터
		setCheckedList(ref.gridRef.current.getCheckedRowItemsAll());

		// 저장 팝업을 실행한다.
		refEtcFeeModal.current.handlerOpen();
	};

	/**
	 * 기타비용계산 팝업 닫기
	 */
	const closeEventEtcFeePopup = () => {
		refEtcFeeModal.current.handlerClose();
	};

	/**
	 * 기티비용계산 팝업 적용 콜백
	 */
	const callBackEtcFeePopup = () => {
		props.callBackFn?.(true);
		closeEventEtcFeePopup();
	};

	/**
	 * 보관료계산 팝업을 실행한다.
	 * 저장 후 재 조회 실행.
	 */
	const saveCalcMonthlyFee = useCallback(async () => {
		// 입력 값 검증
		const isValid = await validateForm(props.form);
		if (!isValid) {
			return;
		}

		// 저장 팝업을 실행한다.
		setPopupProcType('CALC_STORAGEFEE');
		refStorageFeeModal.current.handlerOpen();
	}, [props.form, setPopupProcType, refStorageFeeModal]);

	/**
	 * 보관료마감 팝업을 실행한다.
	 * 저장 후 재 조회 실행.
	 */
	const saveMonthlyFee = useCallback(async () => {
		// 입력 값 검증
		const isValid = await validateForm(props.form);
		if (!isValid) {
			return;
		}
		// 저장 팝업을 실행한다.
		setPopupProcType('CLOSE_STORAGEFEE');
		refStorageFeeModal.current.handlerOpen();
	}, [props.form, setPopupProcType, refStorageFeeModal]);

	/**
	 * 보관료계산 팝업 적용 콜백
	 */
	const callBackStorageFeePopup = () => {
		props.callBackFn?.(true);
		closeEventStorageFeePopup();
	};

	/**
	 * 보관료계산 팝업 닫기
	 */
	const closeEventStorageFeePopup = () => {
		refStorageFeeModal.current.handlerClose();
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const uploadExcel = () => {
		modalExcelRef.current.handlerOpen();
	};

	/**
	 * 엑셀 업로드 팝업 닫기
	 */
	const closeEventExcel = () => {
		modalExcelRef.current.handlerClose();
	};

	/**
	 * 그리드에서 선택한 데이터를 확인하고, 수량조정을 실행한다.
	 * 저장 후 재 조회 실행.
	 */
	const saveQtyEdit = () => {
		// 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		ref.gridRef.current.showConfirmSave(() => {
			const params = {
				fixdccode: props.dccode,
				saveList: checkedItems,
			};

			apiPostSaveQtyEdit(params).then(res => {
				if (res.statusCode === 0) {
					props.callBackFn?.(true);
				}
			});
		});
	};

	/**
	 * 권한 조회
	 */
	const searchAuthority = async () => {
		// API 호출
		const params = {};
		const res = await apiPostAuthority(params);
		authorityRef.current = res.data;
		return res.data;
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'excelUpload',
					isActionEvent: false,
					callBackFn: () => {
						uploadExcel();
					},
				},
				{
					btnType: 'excelDownload', // 엑셀다운로드
				},
				{
					btnType: 'btn1', // 기타비용등록
					callBackFn: saveEtcFee,
				},
				{
					btnType: 'btn2', // 보관료계산
					callBackFn: saveCalcMonthlyFee,
				},
				{
					btnType: 'btn3', // 보관료마감
					callBackFn: saveMonthlyFee,
				},
				{
					btnType: 'save', // 저장
					callBackFn: saveMasterList,
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
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref.gridRef.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 시작
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditBegin', (event: any) => {
			if (
				//처리수량,박스수량
				event.dataField === 'quantity' ||
				event.dataField === 'boxqty'
			) {
				//컬럼 편집 가능 여부
				if (isEditRef.current) {
					return true;
				} else {
					return false;
				}
			} else if (event.item.editflag !== 'Y') {
				//입고료,출고료,창고료,계근료,작업료,팔렛료
				//마감 상태이면 수량 입력 불가
				return false;
			}

			return true;
		});

		/**
		 * 그리드 셀 더블클릭
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellDoubleClick', (event: any) => {
			if (event.dataField === 'sku') {
				// 상품코드 셀 더블클릭하면 상품상세팝업 표시
				ref.gridRef.current.openPopup(event.item, 'sku');
			} else if (event.dataField === 'quantity' || event.dataField === 'boxqty') {
				if (!isEditRef.current) {
					// 처리수량, 박스수량 셀 더블클릭
					const userRoles = getCommonCodeList('QTY_EDIT_USER');
					const editUsers = userRoles.filter((v: any) => {
						return v.comCd === globalVariable.gUserId;
					});

					if (editUsers && editUsers.length > 0) {
						const msg = '수량조정 작업을 진행 하시겠습니까?';
						showConfirm(null, msg, () => {
							isEditRef.current = true;
						});
					}
				}
			}
		});

		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		//ref.gridRef.current.bind('selectionChange', (event: any) => {});

		/**
		 * 그리드 스크롤
		 * @param {any} event 이벤트
		 */
		//ref.gridRef.current.bind('vScrollChange', (event: any) => {});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	/**
	 * 초기화
	 */
	useEffect(() => {
		// 그리드 이벤트 바인딩
		initEvent();
		// 권한 조회
		searchAuthority();
	}, []);

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

			setCurrentCount(ref.gridRef.current.getRowCount());
		}

		isEditRef.current = false;
	}, [props.gridData, ref.gridRef]);

	return (
		<>
			{/* 그리드 영역 정의 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn()} totalCnt={props.totalCount}>
					<Button onClick={saveQtyEdit}>수량조정</Button>
				</GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>

			{/* 기타비용등록 팝업 영역 정의 */}
			<CustomModal ref={refEtcFeeModal} width="1000px">
				<StExDCEtcFeePopup
					dccode={props.dccode}
					callBack={callBackEtcFeePopup}
					close={closeEventEtcFeePopup}
					checkedList={checkedList}
				></StExDCEtcFeePopup>
			</CustomModal>

			{/* 비용마감 팝업 영역 정의 */}
			<CustomModal ref={refStorageFeeModal} width="600px">
				<StExDCStoragePopup
					dccode={props.form.getFieldValue('fixdccode')}
					organize={organize}
					organizeName={organizeName}
					closemonth={closemonth}
					callBack={callBackStorageFeePopup}
					close={closeEventStorageFeePopup}
					popupProcType={popupProcType}
				></StExDCStoragePopup>
			</CustomModal>

			{/* 엑셀 업로드 팝업 영역 정의 */}
			<CustomModal ref={modalExcelRef} width="1000px">
				<StExDCStorageExcelPopup
					close={closeEventExcel}
					dccode={props.form.getFieldValue('fixdccode')}
					closemonth={closemonth}
				/>
			</CustomModal>
		</>
	);
});

export default StExDCStorageDetail;
