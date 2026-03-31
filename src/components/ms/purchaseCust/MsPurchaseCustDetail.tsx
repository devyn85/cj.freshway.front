/*
 ############################################################################
 # FiledataField	: MsPurchaseCustDetail.tsx
 # Description		: 수발주정보 - 디테일
 # Author			: jh.jang
 # Since			: 25.07.24
 ############################################################################
 
 ■ 컴포넌트 설명
   - 수발주 정보를 관리하는 상세 화면 컴포넌트
   - 상품별 수발주 설정 및 재고 현황을 확인하고 관리
   - 이중 그리드 구조로 마스터-디테일 정보 표시
 
 ■ 주요 기능
   - 수발주 정보 목록 조회 및 편집
   - 수발주 정보 저장 (추가/수정/삭제)
   - 복사 등록: 선택된 상품의 수발주 정보를 다른 상품에 복사
   - 수급담당이력 조회: 상품별 수급담당자 이력 확인
   - 엑셀 업로드: 대량의 수발주 정보를 엑셀로 일괄 등록
   - 대용량 엑셀 다운로드: 수발주 정보를 엑셀로 다운로드
   - 상품 팝업: SKU 검색 및 선택
   - 자동 생성 설정: 요일별, 시간대별 자동 발주 생성 설정
 
 ■ Props
   - callBackFn: 저장 후 재조회를 위한 콜백 함수
   - form: 검색 조건 폼 데이터
 
 ■ Ref
   - gridRef: 수발주 정보 마스터 그리드 참조
   - gridRef2: 상세 정보 그리드 참조
   - gridRefPopup: 팝업 내 그리드 참조
 
 ■ 주요 함수
   - savePurchaseCustList: 수발주 정보 저장 (추가/수정)
   - onClickCopyReg: 복사 등록 팝업 열기
   - onClickSearchBuyer: 수급담당이력 팝업 열기
   - handleUploadModal: 엑셀 업로드 모달 열기
   - largeDataExcel: 대용량 엑셀 다운로드 실행
   - initEvent: 그리드 이벤트 초기화 및 설정
 
 ############################################################################
 */
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import { useSelector } from 'react-redux';

// Component
import CmPurchaseBuyerHstPopup from '@/components/cm/popup/CmPurchaseBuyerHstPopup';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import MsPurchaseCustPopup from '@/components/ms/popup/MsPurchaseCustPopup';
import MsPurchaseCustUploadExcelPopup from '@/components/ms/purchaseCust/MsPurchaseCustUploadExcelPopup';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

// API
import { apiGetPurchaseBuyerHstList } from '@/api/cm/apiCmPurchaseBuyerHstPopup';
import {
	apiGetDetailList,
	apiPostDeleteMasterList,
	apiPostLargeDataExcel,
	apiPostSaveMasterList,
} from '@/api/ms/apiMsPurchaseCust';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';

const MsPurchaseCustDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
	ref.gridRefPopup = useRef(null);
	const copyRegModal = useRef(null);
	const searchBuyerModal = useRef(null);
	const modalRef = useRef(null);
	const uploadModalRef = useRef(null);
	const refModal = useRef(null);
	const refModal2 = useRef(null);
	const [popupForm] = Form.useForm();

	// grid data
	const [grid2Data, setGrid2Data] = useState([]);
	const [copySerialKeys, setCopySerialKeys] = useState('');

	const [searchBuyerPopupList, setSearchBuyerPopupList] = useState([]);
	const [searchBuyerPopupTotalCount, setSearchBuyerPopupTotalCount] = useState(0);
	const [currentPageScr, setCurrentPageScr] = useState(1);

	const userDccodeList = getUserDccodeList('') ?? [];
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// 다국어
	const { t } = useTranslation();

	// 그리드 컬럼 정의 - 기본 정보
	const gridCol = [
		// 기본 발주 정보
		{
			dataField: 'purchaseType',
			headerText: t('lbl.PURCHASETYPE_PO'),
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('PURCHASETYPE_PO', value)?.cdNm;
			},
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('PURCHASETYPE_PO', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		}, // 발주유형
		{
			dataField: 'reference05',
			headerText: '자동생성유형',
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('PURCHASE_AUTOTIME', '선택', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		}, // 자동생성유형
		{
			dataField: 'deliveryType',
			headerText: t('lbl.DELIVERYTYPE_PO'),
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('DIRECTTYPE', value)?.cdNm;
			},
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('DIRECTTYPE', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		}, // 배송유형
		// 상품 정보
		{
			dataField: 'dcCode',
			headerText: t('lbl.PODCCODE'),
			dataType: 'code',
			filter: { showIcon: true },
			editable: false,
		}, // 센터코드
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					e.item.skuDescr = e.item.skuName;
					ref.gridRef.current.openPopup(e.item, 'sku');
				},
			},
			editable: false,
		}, // SKU
		{ dataField: 'skuName', headerText: t('lbl.SKUNAME'), dataType: 'string', editable: false }, // 상품명
		{ dataField: 'plantDescr', headerText: t('lbl.PLANT'), dataType: 'string', editable: false }, // 플랜트
		{ dataField: 'qtyYn', headerText: '수발주연결여부', dataType: 'code', editable: false }, // 수발주연결여부
		{
			dataField: 'channel',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('PUTAWAYTYPE', value)?.cdNm;
			},
			editable: false,
		}, // 채널
		{
			dataField: 'serialYn',
			headerText: t('lbl.SERIALYN'),
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('SERIALYN', value)?.cdNm;
			},
			editable: false,
		}, // 시리얼여부
		{
			dataField: 'line01',
			headerText: '비정량여부',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('YN', value)?.cdNm;
			},
			editable: false,
		}, // 비정량여부
		{
			dataField: 'controlType',
			headerText: t('lbl.CONTROLTYPE'),
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('CONTROLTYPE', value)?.cdNm;
			},
			editable: false,
		}, // 관리유형
		// 기간 정보
		{ dataField: 'fromDate', headerText: t('lbl.FROMDATE'), dataType: 'date', editable: false }, // 시작일
		{ dataField: 'toDate', headerText: t('lbl.TODATE'), dataType: 'date', editable: false }, // 종료일
		{
			dataField: 'storageType',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STORAGETYPE', value)?.cdNm;
			},
			editable: false,
		}, // 보관유형
		// 거래처 정보
		{
			dataField: 'custType',
			headerText: t('lbl.CUSTTYPE_PO'),
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('CUSTTYPE_PO', value)?.cdNm;
			},
			editable: false,
		}, // 구매처유형
		{ dataField: 'custKey', headerText: t('lbl.CUSTKEY_PO'), dataType: 'code', editable: false }, // 구매처코드
		{ dataField: 'custName', headerText: t('lbl.CUSTNAME_PO'), dataType: 'string', editable: false }, // 구매처명
		{ dataField: 'slaveCustKey', headerText: '실공급 협력사코드', dataType: 'string', editable: false }, // 실공급 협력사코드
		{ dataField: 'slaveCustName', headerText: '실공급 협력사명', dataType: 'string', editable: false }, // 실공급 협력사명
		// 라우팅 정보
		{
			dataField: 'route',
			headerText: t('lbl.ROUTE_PO'),
			dataType: 'code',
			editRenderer: { type: 'DropDownListRenderer', list: userDccodeList, keyField: 'dccode', valueField: 'dcname' },
			filter: { showIcon: true },
		}, // 라우트(센터)
		{
			dataField: 'routeOrganize',
			headerText: t('lbl.ROUTEORGANIZE'),
			dataType: 'code',
			commRenderer: {
				type: 'search',
				popupType: 'allOrganize',
				searchDropdownProps: { dataFieldMap: { routeOrganize: 'code', routeOrganizeNm: 'name' } },
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					refModal2.current.open({
						gridRef: ref.gridRef,
						rowIndex,
						customDccode: '',
						dataFieldMap: { routeOrganize: 'code', routeOrganizeNm: 'name' },
						popupType: 'allOrganize',
					});
				},
			},
		}, // 경유지코드
		{ dataField: 'routeOrganizeNm', headerText: t('lbl.ROUTEORGANIZENM'), dataType: 'string', editable: false }, // 경유지명
		// 담당자 정보
		{ dataField: 'buyerKey', headerText: '수급담당ID', dataType: 'string', editable: false }, // 수급담당ID
		{
			dataField: 'buyerKeyNm',
			headerText: t('lbl.POMDCODE'),
			dataType: 'user',
			editRenderer: {
				type: 'ComboBoxRenderer',
				autoCompleteMode: true,
				autoEasyMode: true,
				showEditorBtnOver: true,
				list: getCommonCodeList('BUYERKEY', ''),
				keyField: 'cdNm',
				valueField: 'cdNm',
				doValidatorFromItemClick: true,
				validator: function (oldValue: any, newValue: any, item: any, dataField: any, fromClipboard: any, which: any) {
					const valueField = this.valueField;
					const isValid = getCommonCodeList('BUYERKEY', '').some(v => v[valueField] === newValue);
					if (isValid) {
						item['buyerKey'] = getCommonCodeList('BUYERKEY', '').find(v => v[valueField] === newValue).comCd;
					}
					return { validate: isValid };
				},
			},
		}, // 수급담당명
		{
			dataField: 'purchaseGroup',
			headerText: t('lbl.PURCHASEGROUP'),
			dataType: 'user',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('PURCHASEGROUP', value)?.cdNm;
			},
			editable: false,
		}, // 구매그룹
		{
			dataField: 'saleGroupCd',
			headerText: t('lbl.SALEGROUP'),
			dataType: 'user',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('SALEGROUP', value)?.cdNm;
			},
			editable: false,
		}, // 영업그룹
		// 발주수량 정보
		{
			headerText: '발주수량단위',
			children: [
				{ dataField: 'orderQtyUnit', headerText: 'BOX', dataType: 'numeric' },
				{ dataField: 'orderQtyUnitEA', headerText: 'EA', dataType: 'numeric', editable: false },
			],
		}, // 발주수량단위 (BOX/EA)
		{ dataField: 'qtyPerBox', headerText: t('lbl.QTYPERBOX'), dataType: 'numeric', editable: false }, // 박스당수량
		// { dataField: 'ccc', headerText: '재고단가(이평)', dataType: 'numeric', editable: false }, // 재고단가(이평)
		{ dataField: 'uom', headerText: t('lbl.UOM'), dataType: 'code', editable: false }, // 단위
		// PLT 정보
		{ dataField: 'layerPerPlt', headerText: t('lbl.LAYERPERPLT'), dataType: 'numeric', editable: false }, // PLT당층수
		{ dataField: 'pltChange', headerText: 'PLT변환값(환산값)', dataType: 'numeric', editable: false }, // PLT변환값(환산값)
		{ dataField: 'boxPerLayer', headerText: t('lbl.BOXPERLAYER'), dataType: 'numeric', editable: false }, // 층당박스수
		// 안전계수 정보
		{
			dataField: 'coefficientSafety',
			headerText: t('lbl.COEFFICIENTSAFETY'),
			dataType: 'numeric',
			editRenderer: { type: 'InputEditRenderer', onlyNumeric: true, allowPoint: true, textAlign: 'right' },
			formatString: '#,##0.###',
		}, // 안전계수
		{
			dataField: 'selectCoefficientSafety',
			headerText: '추천안전계수',
			commRenderer: {
				type: 'dropDown',
				keyField: 'value',
				valueField: 'label',
				list: [
					{ label: '선택', value: '' },
					{ label: 'D-1월', value: 'coefficientSafety1W' },
					{ label: 'D-2월 ', value: 'coefficientSafety2W' },
					{ label: 'D-3월 ', value: 'coefficientSafety3W' },
				],
			},
		}, // 추천안전계수
		{
			dataField: 'coefficientSafetyYn',
			headerText: '추천적용여부',
			commRenderer: { type: 'checkBox', checkValue: 'Y', unCheckValue: 'N' },
		}, // 추천적용여부
		// 발주 주기 및 수량 정보
		{ dataField: 'leadTime', headerText: t('lbl.LEADTIME'), dataType: 'numeric', required: true }, // 리드타임
		{
			headerText: 'MOQ(상품)',
			children: [
				{ dataField: 'moqSku', headerText: 'BOX', dataType: 'numeric' },
				{ dataField: 'moqSkuPlt', headerText: 'PLT', dataType: 'numeric' },
			],
		}, // MOQ(상품)
		{
			headerText: 'MOQ(협력사)',
			children: [
				{ dataField: 'moqVender', headerText: 'BOX', dataType: 'numeric' },
				{ dataField: 'moqVenderPlt', headerText: 'PLT', dataType: 'numeric' },
			],
		}, // MOQ(협력사)
		{ dataField: 'purInterval', headerText: t('lbl.PURINTERVAL'), dataType: 'numeric' }, // 발주주기
		{ dataField: 'minOrderQty', headerText: '최소발주수량', dataType: 'numeric' }, // 최소발주수량
		// 수기 정보
		{ dataField: 'editReorderPoint', headerText: '수기재발주점', dataType: 'numeric' }, // 수기재발주점
		{ dataField: 'editStockGoal', headerText: '수기목표재고수량', dataType: 'numeric' }, // 수기목표재고수량
		// 배송 요일 정보
		{
			dataField: 'reference04',
			headerText: '토요일입고가능여부',
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('SATDLVYN', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		}, // 토요일입고가능여부
		{ dataField: 'allYn', headerText: '발주요일전체', commRenderer: { type: 'checkBox' } }, // 발주요일전체
		{ dataField: 'monYn', headerText: '월', commRenderer: { type: 'checkBox' } }, // 월요일발주
		{ dataField: 'tueYn', headerText: '화', commRenderer: { type: 'checkBox' } }, // 화요일발주
		{ dataField: 'wedYn', headerText: '수', commRenderer: { type: 'checkBox' } }, // 수요일발주
		{ dataField: 'thuYn', headerText: '목', commRenderer: { type: 'checkBox' } }, // 목요일발주
		{ dataField: 'friYn', headerText: '금', commRenderer: { type: 'checkBox' } }, // 금요일발주
		{ dataField: 'satYn', headerText: '토', commRenderer: { type: 'checkBox' } }, // 토요일발주
		{ dataField: 'sunYn', headerText: '일', commRenderer: { type: 'checkBox' } }, // 일요일발주
		// 마감 정보
		{ dataField: 'returnType', headerText: t('lbl.RETURNTYPE_PO'), dataType: 'code', editable: false }, // 반품유형
		{ dataField: 'closeDay', headerText: '마감기일', dataType: 'numeric', editable: false }, // 마감기일
		{
			dataField: 'closeTime',
			headerText: '마감시간',
			dataType: 'numeric',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				if (!value) return '';
				return dayjs(value).format('HH:mm');
			},
		}, // 마감시간
		// 기타 정보
		{
			dataField: 'alterSku',
			headerText: '대체상품',
			dataType: 'code',
			commRenderer: {
				type: 'search',
				iconPosition: 'right',
				align: 'center',
				onClick: function (event: any) {
					modalRef.current.handlerOpen();
				},
			},
		}, // 대체상품
		{
			dataField: 'spclNoteYn',
			headerText: '특이사항',
			commRenderer: { type: 'checkBox', checkValue: 'Y', unCheckValue: 'N' },
		}, // 특이사항
		{
			dataField: 'excptDpApprYn',
			headerText: '예외입고품의',
			commRenderer: { type: 'checkBox', checkValue: 'Y', unCheckValue: 'N' },
		}, // 예외입고품의
		// 참조 필드
		{ dataField: 'reference01', headerText: t('lbl.REFERENCE01'), dataType: 'string' }, // 참조1
		{ dataField: 'reference02', headerText: t('lbl.REFERENCE02'), dataType: 'string' }, // 참조2
		{ dataField: 'reference03', headerText: t('lbl.REFERENCE03'), dataType: 'string' }, // 참조3
		{ dataField: 'reference06', headerText: t('lbl.REFERENCE04'), dataType: 'string' }, // 참조4
		// 할당 정보
		{
			dataField: 'stopStatus',
			headerText: '할당정보',
			dataType: 'code',
			editable: false,
			colSpan: 2,
			renderer: {
				type: 'ImageRenderer',
				imgHeight: 16,
				srcFunction: function (rowIndex: any, columnIndex: any, value: any) {
					return `/img/icon/${value}.png`;
				},
			},
		}, // 할당상태(이미지)
		{ dataField: 'stopInfo', dataType: 'string', editable: false }, // 할당정보(텍스트)
		// 자동발주 설정
		{
			headerText: '자동발주 설정',
			children: [
				{ dataField: 'autoExecDay', headerText: '산정기간', dataType: 'numeric' },
				{ dataField: 'autoMonYn', headerText: '월', commRenderer: { type: 'checkBox' } },
				{ dataField: 'autoTueYn', headerText: '화', commRenderer: { type: 'checkBox' } },
				{ dataField: 'autoWedYn', headerText: '수', commRenderer: { type: 'checkBox' } },
				{ dataField: 'autoThuYn', headerText: '목', commRenderer: { type: 'checkBox' } },
				{ dataField: 'autoFriYn', headerText: '금', commRenderer: { type: 'checkBox' } },
				{ dataField: 'autoSatYn', headerText: '토', commRenderer: { type: 'checkBox' } },
				{ dataField: 'autoSunYn', headerText: '일', commRenderer: { type: 'checkBox' } },
				{ dataField: 'batchTimePeriod1', headerText: '1차', commRenderer: { type: 'checkBox' } },
				{ dataField: 'batchTimePeriod2', headerText: '2차', commRenderer: { type: 'checkBox' } },
				{ dataField: 'batchTimePeriod3', headerText: '3차', commRenderer: { type: 'checkBox' } },
			],
		}, // 자동발주설정
		// 엑셀업로드 결과
		{ dataField: 'errMsg', headerText: '엑셀업로드 결과', dataType: 'string', editable: false }, // 엑셀업로드 결과
		{ dataField: 'aaaaa', headerText: '양산 마감기일', dataType: 'string', editable: false }, // 양산마감기일
		{ dataField: 'aaaaaaa', headerText: '양산 마감시간', dataType: 'string', editable: false }, // 양산마감시간
		// { dataField: 'boxPerPlt', headerText: 'PLT변환값', dataType: 'numeric', editable: false }, // PLT변환값
		{ dataField: 'pltChange', headerText: 'PLT변환값', dataType: 'numeric', editable: false }, // PLT변환값
		// 기타 필드
		{ dataField: 'leadTime2', headerText: '리드타임2', dataType: 'numeric', editable: false }, // 리드타임2
		{
			dataField: 'exhaustionStopYn',
			headerText: '소진후중단',
			commRenderer: { type: 'checkBox', checkValue: 'Y', unCheckValue: 'N' },
		}, // 소진후중단
		{ dataField: 'custSku', headerText: 'CJ코드', dataType: 'string', editable: false }, // CJ코드
		{ dataField: 'reference07', headerText: '키맨번호', dataType: 'string' }, // 키맨번호
		// 생성/수정 정보
		{ dataField: 'addWho', visible: false }, // 생성자ID(숨김)
		{
			dataField: 'addWhoNm',
			headerText: t('lbl.ADDWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'addWho',
		}, // 생성자명
		{ dataField: 'addDate', headerText: t('lbl.ADDDATE'), dataType: 'date', editable: false }, // 생성일
		{ dataField: 'editWho', visible: false }, // 수정자ID(숨김)
		{
			dataField: 'editWhoNm',
			headerText: t('lbl.EDITWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'editWho',
		}, // 수정자명
		{ dataField: 'editDate', headerText: t('lbl.EDITDATE'), dataType: 'date', editable: false }, // 수정일
	];

	// 그리드 컬럼 정의 - 상세 정보 (gridCol2)
	const gridCol2 = [
		// 기본 정보
		{ dataField: 'dcCode', headerText: t('lbl.DCCODE'), dataType: 'code' }, // 센터코드
		{ dataField: 'custKey', headerText: '구매처', dataType: 'code' }, // 구매처코드
		{ dataField: 'custName', headerText: '구매처명', dataType: 'string' }, // 구매처명
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					e.item.skuDescr = e.item.skuName;
					ref.gridRef2.current.openPopup(e.item, 'sku');
				},
			},
		}, // SKU
		{ dataField: 'skuName', headerText: t('lbl.SKUNAME'), dataType: 'string' }, // 상품명
		{ dataField: 'plantDescr', headerText: t('lbl.PLANT'), dataType: 'string' }, // 플랜트
		{ dataField: 'uom', headerText: t('lbl.UOM'), dataType: 'code' }, // 단위
		// 재고 기본 정보
		{ dataField: 'reorderPoint', headerText: t('lbl.REORDERPOINT'), dataType: 'numeric' }, // 재주문점
		{ dataField: 'stockGoal', headerText: t('lbl.GOAL_STOCKQTY'), dataType: 'numeric' }, // 목표재고
		{ dataField: 'stockMinDay', headerText: t('lbl.STOCKMINDAY'), dataType: 'numeric' }, // 최소재고일수
		{ dataField: 'stockMaxDay', headerText: t('lbl.STOCKMAXDAY'), dataType: 'numeric' }, // 최대재고일수
		{ dataField: 'stockDay', headerText: t('lbl.STOCKDAY'), dataType: 'numeric' }, // 현재재고일수
		{ dataField: 'stockAvgDay', headerText: t('lbl.DAYAVG'), dataType: 'numeric' }, // 평균재고일수
		{
			dataField: 'stdDeviation',
			headerText: t('lbl.STDDEVIATION'),
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, // 표준편차
		{ dataField: 'maxStock', headerText: 'MAX', dataType: 'numeric' }, // 최대재고
		{ dataField: 'stockQty', headerText: t('lbl.QTY_ST'), dataType: 'numeric' }, // 재고수량
		// 발주정보
		{
			dataField: 'coefficientSafety',
			headerText: t('lbl.COEFFICIENTSAFETY'),
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, // 안전계수
		{ dataField: 'leadTime', headerText: t('lbl.LEADTIME'), dataType: 'numeric' }, // 리드타임
		{ dataField: 'purInterval', headerText: t('lbl.PURINTERVAL'), dataType: 'numeric' }, // 발주주기
		{ dataField: 'stockSafety', headerText: t('lbl.STOCKSAFETY'), dataType: 'numeric' }, // 안전재고
		{ dataField: 'stockOptimal', headerText: t('lbl.STOCKOPTIMAL'), dataType: 'numeric' }, // 최적재고
		{ dataField: 'noShipDay', headerText: '무출고일수', dataType: 'numeric' }, // 무출고일수
		// 무출고일수
		{
			headerText: '무출고일수(월)',
			children: [
				{ dataField: 'shipDay1W', headerText: t('lbl.SHIPDAY1W'), dataType: 'numeric' }, // 1주출하일수
				{ dataField: 'shipDay2W', headerText: t('lbl.SHIPDAY2W'), dataType: 'numeric' }, // 2주출하일수
				{ dataField: 'shipDay3W', headerText: t('lbl.SHIPDAY3W'), dataType: 'numeric' }, // 3주출하일수
			],
		},
		// 출하수량 - 1개월
		{
			headerText: '출고량(월)',
			children: [
				{
					dataField: 'shipQty1W',
					headerText: 'D-1월',
					dataType: 'numeric',
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						// 상태에 따른 스타일 적용 - CLASS명 반환
						if (item.shipQtyChg1W > 0) {
							return 'row-contract-non10-blue';
						} else if (item.shipQtyChg1W < 0) {
							return 'row-contract-non10';
						} else {
							return '';
						}
					},
				}, // 1개월출하수량
				{
					dataField: 'shipQty2W',
					headerText: 'D-2월',
					dataType: 'numeric',
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						// 상태에 따른 스타일 적용 - CLASS명 반환
						if (item.shipQtyChg2W > 0) {
							return 'row-contract-non10-blue';
						} else if (item.shipQtyChg2W < 0) {
							return 'row-contract-non10';
						} else {
							return '';
						}
					},
				}, // 2개월출하수량
				{ dataField: 'shipQty3W', headerText: 'D-3월', dataType: 'numeric' }, // 3개월출하수량
			],
		},
		// 출하수량변화
		{ dataField: 'shipQtyChg1W', headerText: 'D-1월', dataType: 'numeric', visible: false }, // 1개월출하수량변화
		{ dataField: 'shipQtyChg2W', headerText: 'D-2월', dataType: 'numeric', visible: false }, // 2개월출하수량변화
		{ dataField: 'shipQtyChg3W', headerText: 'D-3월', dataType: 'numeric', visible: false }, // 3개월출하수량변화
		// 발주수량 - 일별
		{
			headerText: '출고량(일)',
			children: [
				{ dataField: 'ord1Day', headerText: 'D-1일', dataType: 'numeric' }, // 1일발주수량
				{ dataField: 'ord2Day', headerText: 'D-2일', dataType: 'numeric' }, // 2일발주수량
				{ dataField: 'ord3Day', headerText: 'D-3일', dataType: 'numeric' }, // 3일발주수량
				{ dataField: 'ord4Day', headerText: 'D-4일', dataType: 'numeric' }, // 4일발주수량
				{ dataField: 'ord5Day', headerText: 'D-5일', dataType: 'numeric' }, // 5일발주수량
				{ dataField: 'ord6Day', headerText: 'D-6일', dataType: 'numeric' }, // 6일발주수량
				{ dataField: 'ord7Day', headerText: 'D-7일', dataType: 'numeric' }, // 7일발주수량
				{ dataField: 'ord8Day', headerText: 'D-8일', dataType: 'numeric' }, // 8일발주수량
				{ dataField: 'ord9Day', headerText: 'D-9일', dataType: 'numeric' }, // 9일발주수량
				{ dataField: 'ord10Day', headerText: 'D-10일', dataType: 'numeric' }, // 10일발주수량
				{ dataField: 'ord11Day', headerText: 'D-11일', dataType: 'numeric' }, // 11일발주수량
				{ dataField: 'ord12Day', headerText: 'D-12일', dataType: 'numeric' }, // 12일발주수량
				{ dataField: 'ord13Day', headerText: 'D-13일', dataType: 'numeric' }, // 13일발주수량
				{ dataField: 'ord14Day', headerText: 'D-14일', dataType: 'numeric' }, // 14일발주수량
			],
		},
		// 영업일수 그룹
		{
			headerText: '영업일수',
			children: [
				{ dataField: 'bizDateMonth1', headerText: 'D-1월', dataType: 'numeric' }, // 1개월영업일수
				{ dataField: 'bizDateMonth2', headerText: 'D-2월', dataType: 'numeric' }, // 2개월영업일수
				{ dataField: 'bizDateMonth3', headerText: 'D-3월', dataType: 'numeric' }, // 3개월영업일수
			],
		},
		// 안전재고 그룹
		{
			headerText: '안전재고',
			children: [
				{ dataField: 'stockSafety2', headerText: '수량', dataType: 'numeric' }, // 안전재고수량
				{ dataField: 'stockDay2', headerText: '보유일', dataType: 'numeric' }, // 안전재고보유일
			],
		},
		// 입고정보
		{ dataField: 'preOpenQty', headerText: '입고전까지<br>일출고가능량', dataType: 'numeric' }, // 입고전일출고가능량
		{ dataField: 'coefficientSafetyTemp', visible: false }, // 숨김필드
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
		defaultColumnWidth: 100,
	};

	const gridProps2 = {
		editable: false,
		showRowCheckColumn: false,
		enableFilter: true,
		defaultColumnWidth: 100,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref.gridRef.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('cellEditEnd', (event: any) => {
			const gridRef = ref.gridRef.current;
			const { value, item, oldValue } = event;

			if (event.dataField === 'allYn') {
				if (event.value === '1') {
					ref.gridRef.current.setCellValue(event.rowIndex, 'monYn', 1);
					ref.gridRef.current.setCellValue(event.rowIndex, 'tueYn', 1);
					ref.gridRef.current.setCellValue(event.rowIndex, 'wedYn', 1);
					ref.gridRef.current.setCellValue(event.rowIndex, 'thuYn', 1);
					ref.gridRef.current.setCellValue(event.rowIndex, 'friYn', 1);
					ref.gridRef.current.setCellValue(event.rowIndex, 'satYn', 1);
					ref.gridRef.current.setCellValue(event.rowIndex, 'sunYn', 1);
				} else {
					ref.gridRef.current.setCellValue(event.rowIndex, 'monYn', 0);
					ref.gridRef.current.setCellValue(event.rowIndex, 'tueYn', 0);
					ref.gridRef.current.setCellValue(event.rowIndex, 'wedYn', 0);
					ref.gridRef.current.setCellValue(event.rowIndex, 'thuYn', 0);
					ref.gridRef.current.setCellValue(event.rowIndex, 'friYn', 0);
					ref.gridRef.current.setCellValue(event.rowIndex, 'satYn', 0);
					ref.gridRef.current.setCellValue(event.rowIndex, 'sunYn', 0);
				}
			}

			if (event.dataField === 'coefficientSafetyYn') {
				const coefficientSafetyYn = event.value;

				if (coefficientSafetyYn === 'Y') {
					const selectCoeffValue = ref.gridRef.current.getCellValue(event.rowIndex, 'selectCoefficientSafety') || '';
					if (selectCoeffValue === 'coefficientSafety1W') {
						const coeffValue1W = ref.gridRef.current.getCellValue(event.rowIndex, 'coefficientSafety1W') || 0;
						ref.gridRef.current.setCellValue(event.rowIndex, 'coefficientSafety', coeffValue1W);
					} else if (selectCoeffValue === 'coefficientSafety2W') {
						const coeffValue2W = ref.gridRef.current.getCellValue(event.rowIndex, 'coefficientSafety2W') || 0;
						ref.gridRef.current.setCellValue(event.rowIndex, 'coefficientSafety', coeffValue2W);
					} else if (selectCoeffValue === 'coefficientSafety3W') {
						const coeffValue3W = ref.gridRef.current.getCellValue(event.rowIndex, 'coefficientSafety3W') || 0;
						ref.gridRef.current.setCellValue(event.rowIndex, 'coefficientSafety', coeffValue3W);
					}
				} else {
					ref.gridRef.current.restoreEditedCells([event.rowIndex, 'coefficientSafety']);
					ref.gridRef.current.restoreEditedCells([event.rowIndex, 'selectCoefficientSafety']);
				}
			}

			if (event.dataField === 'selectCoefficientSafety') {
				const selectCoeffValue = event.value;
				if (selectCoeffValue === 'coefficientSafety1W') {
					const coeffValue1W = ref.gridRef.current.getCellValue(event.rowIndex, 'coefficientSafety1W') || 0;
					ref.gridRef.current.setCellValue(event.rowIndex, 'coefficientSafety', coeffValue1W);
				} else if (selectCoeffValue === 'coefficientSafety2W') {
					const coeffValue2W = ref.gridRef.current.getCellValue(event.rowIndex, 'coefficientSafety2W') || 0;
					ref.gridRef.current.setCellValue(event.rowIndex, 'coefficientSafety', coeffValue2W);
				} else if (selectCoeffValue === 'coefficientSafety3W') {
					const coeffValue3W = ref.gridRef.current.getCellValue(event.rowIndex, 'coefficientSafety3W') || 0;
					ref.gridRef.current.setCellValue(event.rowIndex, 'coefficientSafety', coeffValue3W);
				} else {
					ref.gridRef.current.restoreEditedCells([event.rowIndex, 'coefficientSafety']);
					ref.gridRef.current.restoreEditedCells([event.rowIndex, 'selectCoefficientSafety']);
				}
			}

			const qtyPerBox = ref.gridRef.current.getCellValue(event.rowIndex, 'qtyPerBox') || 0;
			if (event.dataField === 'minOrderQty') {
				ref.gridRef.current.setCellValue(event.rowIndex, 'minOrderQtyEA', qtyPerBox * event.value);
			}

			if (event.dataField === 'orderQtyUnit') {
				ref.gridRef.current.setCellValue(event.rowIndex, 'orderQtyUnitEA', qtyPerBox * event.value);
			}

			// 경유지 센터일 경우 경유지창고 clear - 경유지 센터와 경유지와 무관하다고 함
			// if (event.dataField === 'route') {
			// 	const updatedRow = {
			// 		...item,
			// 		route: value,
			// 		routeOrganize: '', // 경유지코드 클리어
			// 		routeOrganizeNm: '', // 경유지명 클리어
			// 		rowStatus: 'U',
			// 	};
			// 	gridRef.updateRowsById([updatedRow], true);
			// 	return;
			// }

			// 경유지코드 변경시 경유지명 클리어
			if (event.dataField === 'routeOrganize') {
				const updatedRow = {
					...item,
					routeOrganize: value,
					routeOrganizeNm: '', // 경유지명 클리어
					rowStatus: 'U',
				};
				gridRef.updateRowsById([updatedRow], true);
				return;
			}

			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			if (ref.gridRef.current.getCellValue(event.rowIndex, 'rowStatus') !== 'I') {
				ref.gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
			}
		});

		let prevRowIndex: any = null;
		ref.gridRef?.current.bind('selectionChange', (event: any) => {
			if (
				event.primeCell.dataField === 'monYn' ||
				event.primeCell.dataField === 'tueYn' ||
				event.primeCell.dataField === 'wedYn' ||
				event.primeCell.dataField === 'thuYn' ||
				event.primeCell.dataField === 'friYn' ||
				event.primeCell.dataField === 'satYn' ||
				event.primeCell.dataField === 'sunYn' ||
				event.primeCell.dataField === 'allYn' ||
				event.primeCell.dataField === 'autoMonYn' ||
				event.primeCell.dataField === 'autoTueYn' ||
				event.primeCell.dataField === 'autoWedYn' ||
				event.primeCell.dataField === 'autoThuYn' ||
				event.primeCell.dataField === 'autoFriYn' ||
				event.primeCell.dataField === 'autoSatYn' ||
				event.primeCell.dataField === 'autoSunYn' ||
				// event.primeCell.dataField === 'autoExecDay' ||
				event.primeCell.dataField === 'batchTimePeriod1' ||
				event.primeCell.dataField === 'batchTimePeriod2' ||
				event.primeCell.dataField === 'batchTimePeriod3' ||
				event.primeCell.dataField === 'coefficientSafetyYn' ||
				event.primeCell.dataField === 'selectCoefficientSafety'
			) {
				return false;
			}
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell.rowIndex !== prevRowIndex) {
				// 이전 행 인덱스 갱신
				prevRowIndex = event.primeCell.rowIndex;

				const item = ref.gridRef?.current.getItemByRowIndex(event.primeCell.rowIndex);
				// item.dcCode = item.dcCode;
				// 상세 조회 API 호출
				apiGetDetailList(item).then(res => {
					for (let i = 0; i < res.data.length; i++) {
						res.data[i].noShipDay = res.data[i].shipDay1W + res.data[i].shipDay2W + res.data[i].shipDay3W; // 무출고일수 계산
					}
					setGrid2Data(res.data);
				});
			}
		});

		/**
		 * 그리드 셀 클릭 이벤트 조회 팝업 호출
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('cellClick', (event: any) => {
			if (event.dataField === 'alterSku') {
				modalRef.current.handlerOpen();
			}
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const savePurchaseCustList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = ref.gridRef.current.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (!ref.gridRef.current.validateRequiredGridData()) return;

		//MOQ(상품), MOQ(협력사) 에서 1개는 입력되어야 함
		for (const element of updatedItems) {
			const item = element;
			if (item.moqSku + item.moqSkuPlt + item.moqVender + item.moqVenderPlt === 0) {
				showMessage({
					content: 'MOQ 가 1개 이상 입력되어야 저장품자동발주에서 발주 생성이 가능합니다.',
					modalType: 'info',
					onOk: () => {
						ref.gridRef.current.showConfirmSave(() => {
							apiPostSaveMasterList(updatedItems).then(res => {
								if (res.statusCode > -1) {
									ref.gridRef.current.getCheckedRowItems().map((item: any, index: any) => {
										ref.gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
									});
									ref.gridRef.current.setAllCheckedRows(false);
									ref.gridRef.current.resetUpdatedItems();

									showMessage({
										content: t('msg.MSG_COM_SUC_003'),
										modalType: 'info',
										onOk: () => {
											props.callBackFn();
										},
									});
								}
							});
						});
					},
				});
				return;
			}
		}

		// 저장 실행
		// showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
		ref.gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(updatedItems).then(res => {
				if (res.statusCode > -1) {
					ref.gridRef.current.getCheckedRowItems().map((item: any, index: any) => {
						ref.gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
					});
					ref.gridRef.current.setAllCheckedRows(false);
					ref.gridRef.current.resetUpdatedItems();

					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							props.callBackFn();
						},
					});
				}
			});
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'excelUpload', // 엑셀업로드
			// },
			// {
			// 	btnType: 'excelDownload', // 엑셀다운로드
			// },
			{
				btnType: 'save', // 저장
				callBackFn: savePurchaseCustList,
			},
		],
	};

	//복사등록 팝업 열기
	const onClickCopyReg = (item: any) => {
		const selectedItems = ref.gridRef.current.getCheckedRowItems();
		let copySerialKeysStr = '';

		if (selectedItems.length < 1) {
			showMessage({
				content: '수발주 정보를 변경할 상품을 선택해주세요.',
				modalType: 'info',
			});
			return;
		}

		for (let i = 0; i < selectedItems.length; i++) {
			if (selectedItems[i].item.custType === 'D') {
				showMessage({
					content: '구매처가 물류센터인 상품은 복사등록이 불가능합니다.',
					modalType: 'info',
				});
				return;
			}
			copySerialKeysStr += selectedItems[i].item.serialKey;
			if (i < selectedItems.length - 1) {
				copySerialKeysStr += ',';
			}
		}
		setCopySerialKeys(copySerialKeysStr);
	};

	//복사등록 팝업 닫기
	const copyRegCloseEvent = () => {
		setCopySerialKeys('');
		props.callBackFn?.();
		copyRegModal.current.handlerClose();
	};

	//수급담당이력 팝업 열기
	const onClickSearchBuyer = (item: any) => {
		popupForm.setFieldValue('sku', props.form.getFieldValue('skuCode') || '');
		searchBuyerModal.current.handlerOpen();
	};

	//수급담당이력 팝업 닫기
	const searchBuyerCloseEvent = () => {
		searchBuyerModal.current.handlerClose();
	};

	/**
	 * 수급담당이력 조회
	 * @param {string} value 검색어
	 */
	const searchBuyerPopup = (value: string): void => {
		const params = {
			sku: popupForm.getFieldValue('sku') || '',
			dcCode: popupForm.getFieldValue('gMultiDccode') || gDccode,
			multiSelect: '',
			startRow: 0,
			listCount: 500,
		};

		apiGetPurchaseBuyerHstList(params).then(res => {
			// 팝업 발생 후 데이터 적용
			setSearchBuyerPopupList(res.data.list);
			if (res.data.totalCount > -1) {
				setSearchBuyerPopupTotalCount(res.data.totalCount);
			}
		});
	};

	const confirmPopup = (selectedRow: any) => {
		ref.gridRef.current.setCellValue(ref.gridRef.current.getSelectedIndex()[0], 'alterSku', selectedRow[0].code);
		modalRef.current.handlerClose();
	};

	const closeEvent = () => {
		modalRef.current.handlerClose();
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const onExcelUploadPopupClick = () => {
		uploadModalRef.current.handlerOpen();
	};

	const closeEvent2 = () => {
		uploadModalRef.current.handlerClose();
	};

	const onExcelDownloadClick = () => {
		const params = {
			...props.form.getFieldsValue(),
			purchaseYn: props.form.getFieldValue('purchaseYn') ? 'Y' : 'N',
			chkPurchasemst:
				!commUtil.isEmpty(props.form.getFieldValue('buyerKey')) ||
				!commUtil.isEmpty(props.form.getFieldValue('purchaseType')) ||
				!commUtil.isEmpty(props.form.getFieldValue('deliveryType')) ||
				!commUtil.isEmpty(props.form.getFieldValue('leadTime')) ||
				!commUtil.isEmpty(props.form.getFieldValue('coefficientSafety')) ||
				!commUtil.isEmpty(props.form.getFieldValue('purInterval'))
					? 'Y'
					: 'N',
		};

		apiPostLargeDataExcel(params).then(res => {
			FileSaver.saveAs(res.data, dataRegex.decodeDisposition(res.headers['content-disposition']));
		});
	};

	//복사등록된 정보 삭제
	const onClickDelete = (item: any) => {
		const selectedItems = ref.gridRef.current.getCheckedRowItemsAll();

		if (selectedItems.length < 1) {
			showMessage({
				content: '삭제할 수발주정보를 선택해주세요.',
				modalType: 'info',
			});
			return;
		}

		let holdExists = 0;
		for (let i = 0; i < selectedItems.length; i++) {
			if (
				commUtil.isNotEmpty(selectedItems[i].purchaseType) &&
				selectedItems[i].purchaseType.includes('STO') &&
				selectedItems[i].custType === 'D'
			) {
				holdExists++;
			}
		}

		if (holdExists === selectedItems.length) {
			showConfirm(null, '삭제하시겠습니까?', () => {
				apiPostDeleteMasterList(selectedItems).then(res => {
					if (res.statusCode > -1) {
						showMessage({
							content: t('msg.MSG_COM_SUC_006'),
							modalType: 'info',
							onOk: () => {
								props.callBackFn?.();
							},
						});
					}
				});
			});
		} else {
			showMessage({
				content: '복사등록된 일반STO 상품만 삭제가 가능합니다.',
				modalType: 'info',
			});
			return;
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		if (props.data.length < 1) {
			return;
		}

		for (let i = 0; i < props.data.length; i++) {
			props.data[i].minOrderQtyEA = props.data[i].minOrderQty * props.data[i].qtyPerBox;
			props.data[i].orderQtyUnitEA = props.data[i].orderQtyUnit * props.data[i].qtyPerBox;
			let qtyYn = props.data[i].qtyYn;
			//item.toDate가 오늘 날짜보다 이전이면 삭제
			dayjs(props.data[i].toDate).isBefore(dayjs().format('YYYY-MM-DD')) ? (qtyYn = 'N') : (qtyYn = 'Y');
			if (props.data[i].controlType === 'GPE') {
				qtyYn = 'N';
			}
			props.data[i].qtyYn = qtyYn === 'Y' ? '연결' : '삭제';
		}

		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
		}
		// 조회된 결과에 맞게 칼럼 넓이를 구한다.
		const colSizeList = gridRefCur.getFitColumnSizeList(true);
		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRefCur.setColumnSizeList(colSizeList);

		//상세조회
		const item = props.data[0];

		// 상세 조회 API 호출
		apiGetDetailList(item).then(res => {
			for (let i = 0; i < res.data.length; i++) {
				res.data[i].noShipDay = res.data[i].shipDay1W + res.data[i].shipDay2W + res.data[i].shipDay3W; // 무출고일수 계산
			}
			setGrid2Data(res.data);
		});
	}, [props.data]);

	// grid data 변경 감지
	useEffect(() => {
		if (props.data.length < 1) {
			return;
		}
		const gridRefCur = ref.gridRef2.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(grid2Data);
		}
		// 조회된 결과에 맞게 칼럼 넓이를 구한다.
		const colSizeList = gridRefCur.getFitColumnSizeList(true);
		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRefCur.setColumnSizeList(colSizeList);
	}, [grid2Data]);

	// 복사등록 팝업
	useEffect(() => {
		if (copySerialKeys === '') return;
		copyRegModal.current.handlerOpen();
	}, [copySerialKeys]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
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
							<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={props.totalCnt}>
								<Button onClick={onClickCopyReg}>복사등록</Button>
								<Button onClick={onClickSearchBuyer}>수급담당이력</Button>
								<Button onClick={onClickDelete}>행 삭제</Button>
								<Button onClick={onExcelUploadPopupClick}>{t('lbl.EXCELUPLOAD')}</Button>
								<Button onClick={onExcelDownloadClick}>{t('lbl.EXCELDOWNLOAD')}</Button>
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
						</GridAutoHeight>
					</>,
				]}
			/>

			{/* 복사등록 팝업 */}
			<CustomModal ref={copyRegModal} width="1084px">
				<MsPurchaseCustPopup serialKey={copySerialKeys} close={copyRegCloseEvent} />
			</CustomModal>
			{/* 수급담당이력 팝업 */}
			<CustomModal ref={searchBuyerModal} width="1280px">
				<CmPurchaseBuyerHstPopup
					close={searchBuyerCloseEvent}
					gridData={searchBuyerPopupList}
					search={searchBuyerPopup}
					selectionMode={'singleRow'}
					setCurrentPage={setCurrentPageScr}
					totalCount={searchBuyerPopupTotalCount}
					gridRef={ref.gridRefPopup}
					form={popupForm}
					name={'sku'}
				/>
			</CustomModal>
			<CustomModal ref={modalRef} width="1000px">
				<CmSearchPopup type={'sku'} callBack={confirmPopup} close={closeEvent} />
			</CustomModal>
			<CustomModal ref={uploadModalRef} width="1000px">
				<MsPurchaseCustUploadExcelPopup close={closeEvent2} />
			</CustomModal>
			<CmSearchWrapper ref={refModal2} />
		</>
	);
});

export default MsPurchaseCustDetail;
