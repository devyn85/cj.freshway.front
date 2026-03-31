/*
 ############################################################################
 # FiledataField	: DpInplanSTODetail.tsx
 # Description		: 광역입고현황(Detail)
 # Author			: 공두경
 # Since			: 25.06.18
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
import { Tabs } from 'antd';
// Utils
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';
// API Call Function
import { apiGetDataExcelList, apiGetDetailList, apiGetSerialInfoList } from '@/api/dp/apiDpInplanSTO';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';

const { TabPane } = Tabs;

const DpInplanSTODetail = forwardRef((props: any, ref: any) => {
	const { t } = useTranslation(); // 다국어 처리

	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
	ref.gridRef3 = useRef(null);
	ref.gridRef4 = useRef(null);
	// 현재 탭 정보
	const [activeKey, setActiveKey] = useState('1');

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
			dccode: selectedRow[0].toDccode,
			storerkey: selectedRow[0].storerkey,
			docdt: selectedRow[0].slipdt,
			docno: selectedRow[0].docno,
			slipdt: selectedRow[0].slipdt,
			doctype: selectedRow[0].doctype,
			sku: searchParams.sku,
			storagetype: searchParams.storagetype,
			blno: searchParams.blno,
			serialno: searchParams.serialno,
			contractcompany: searchParams.contractcompany,
			serialCheck: '',
		};

		if (
			!commUtil.isNull(params.blno) ||
			!commUtil.isNull(params.serialno) ||
			!commUtil.isNull(params.contractcompany)
		) {
			params.serialCheck = 'Y';
		}

		apiGetDetailList(params).then(res => {
			const gridData = res.data;
			ref.gridRef2.current?.setGridData(gridData);
			ref.gridRef2.current?.resize('100%', '100%');
			const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);

			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef2.current?.setColumnSizeList(colSizeList);
		});
	};

	const searchSerialInfo = () => {
		const selectedRow = ref.gridRef.current.getSelectedRows();
		const searchParams = props.form.getFieldsValue();
		const params = {
			dccode: selectedRow[0].toDccode,
			storerkey: selectedRow[0].storerkey,
			docdt: selectedRow[0].docdt,
			docno: selectedRow[0].docno,
			doctype: selectedRow[0].doctype,
			sku: searchParams.sku,
			storagetype: searchParams.storagetype,
			blno: searchParams.blno,
			serialno: searchParams.serialno,
			contractcompany: searchParams.contractcompany,
			serialCheck: '',
		};

		if (
			!commUtil.isNull(params.blno) ||
			!commUtil.isNull(params.serialno) ||
			!commUtil.isNull(params.contractcompany)
		) {
			params.serialCheck = 'Y';
		}

		apiGetSerialInfoList(params).then(res => {
			const gridData = res.data;
			ref.gridRef3.current?.setGridData(gridData);

			ref.gridRef3.current?.resize('100%', '100%');
			const colSizeList = ref.gridRef3.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef3.current?.setColumnSizeList(colSizeList);
		});
	};
	// 그리드 엑셀 다운로드 정보 조회
	const searchExcel = () => {
		const params = props.form.getFieldsValue();

		if (commUtil.isNull(params.slipdtRange)) {
			showAlert('', '입고일자를 선택해주세요.');
			return;
		}
		if (commUtil.isNull(params.slipdtRange[0]) || commUtil.isNull(params.slipdtRange[1])) {
			showAlert('', '입고일자를 선택해주세요.');
			return;
		}
		params.fromSlipdt = params.slipdtRange[0].format('YYYYMMDD');
		params.toSlipdt = params.slipdtRange[1].format('YYYYMMDD');

		if (
			!commUtil.isNull(params.blno) ||
			!commUtil.isNull(params.serialno) ||
			!commUtil.isNull(params.contractcompany)
		) {
			params.serialCheck = 'Y';
		}

		apiGetDataExcelList(params).then(res => {
			const gridData = res.data;
			ref.gridRef4.current?.setGridData(gridData);
			const colSizeList = ref.gridRef4.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef4.current?.setColumnSizeList(colSizeList);

			if (gridData.length > 0) {
				downloadExcel();
			} else {
				showAlert('', '엑셀다운로드 할 정보가 없습니다.');
			}
		});
	};

	// 그리드 엑셀 다운로드
	const downloadExcel = () => {
		const params = {
			fileName: '광역입고현황',
			exportWithStyle: true, // 스타일 적용 여부
			progressBar: true, // 진행바 표시 여부
		};
		ref.gridRef4.current?.exportToXlsxGrid(params);
	};

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string, e: any) => {
		if (key === '1') {
			setActiveKey('1');
			ref.gridRef2.current?.resize('100%', '100%');
		} else {
			setActiveKey('2');
			//ref.gridRef3.current?.resize('100%', '100%');
			if (ref.gridRef2.current?.getRowCount() > 0) {
				// 주문현황에 데이터가 있을때만 조회
				searchSerialInfo();
			} else {
				ref.gridRef3.current?.resize('100%', '100%');
			}
		}
		return;
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'ordertypeName',
			headerText: t('lbl.ORDERTYPE_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.DCSTOINFO'),
			children: [
				{
					dataField: 'slipdt',
					headerText: t('lbl.DOCDT_DP_STO'),
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'docno',
					headerText: t('lbl.DOCNO_DP_STO'),
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.FROM_DCCODE'),
			children: [
				{
					dataField: 'fromDccode',
					headerText: t('lbl.DCCODE'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'fromDcname',
					headerText: t('lbl.DCNAME'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'fromCustkey',
					headerText: t('lbl.ORGANIZE'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'fromCustname',
					headerText: t('lbl.ORGANIZENAME'),
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'),
			children: [
				{
					dataField: 'toDccode',
					headerText: t('lbl.DCCODE'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'toDcname',
					headerText: t('lbl.DCNAME'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'toCustkey',
					headerText: t('lbl.ORGANIZE'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'toCustname',
					headerText: t('lbl.ORGANIZENAME'),
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			dataField: 'statusName',
			headerText: t('lbl.STATUS_DP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'stotype',
			headerText: t('lbl.STOTYPE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'memo1',
			headerText: t('lbl.MEMO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'code',
			editable: false,
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: false,
	};

	// FooterLayout Props
	const footerLayout = [{}];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelDownload', // excelDownload
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: searchExcel,
			},
		],
	};

	//그리드 컬럼(주문현황 그리드)
	const gridCol2 = [
		{ headerText: '품목번호', dataField: 'docline', dataType: 'code' },
		{
			headerText: '상품코드',
			dataField: 'sku',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.skuName,
					};
					ref.gridRef.current.openPopup(params, 'sku');
				},
			},
		},
		{
			headerText: '상품명칭',
			dataField: 'skuname',
			filter: {
				showIcon: true,
			},
		},
		{ headerText: '플랜트', dataField: 'plantDescr', dataType: 'code' },
		{ headerText: '저장유무', dataField: 'channelname', dataType: 'code' },
		{ headerText: '저장조건', dataField: 'storagetypeName', dataType: 'code' },
		{ headerText: '이체단위', dataField: 'uom', dataType: 'code' },
		{ headerText: '주문수량', dataField: 'orderqty', dataType: 'numeric' },
		{
			headerText: '검수량',
			children: [
				{
					headerText: '출고',
					dataField: 'inspectqtyWd',
					dataType: 'numeric',
					formatString: '#,##0.###',
					styleFunction: function (
						rowIndex: any,
						columnIndex: any,
						value: any,
						headerText: any,
						item: any,
						dataField: any,
					) {
						return {
							color: item.inspectqty != item.inspectqtyWd ? 'red' : 'blue',
						};
					},
				},
				{
					headerText: '입고',
					dataField: 'inspectqty',
					dataType: 'numeric',
					formatString: '#,##0.###',
					styleFunction: function (
						rowIndex: any,
						columnIndex: any,
						value: any,
						headerText: any,
						item: any,
						dataField: any,
					) {
						return {
							color: item.inspectqty != item.inspectqtyWd ? 'red' : 'blue',
						};
					},
				},
			],
		},
		{
			headerText: '확정수량',
			children: [
				{
					headerText: '출고',
					dataField: 'confirmqtyWd',
					dataType: 'numeric',
					formatString: '#,##0.###',
					styleFunction: function (
						rowIndex: any,
						columnIndex: any,
						value: any,
						headerText: any,
						item: any,
						dataField: any,
					) {
						return {
							color: item.confirmqty != item.confirmqtyWd ? 'red' : 'blue',
							backgroundColor: item.orderqty != item.confirmqtyWd ? '#90ee90' : 'white',
						};
					},
				},
				{
					headerText: '입고',
					dataField: 'confirmqty',
					dataType: 'numeric',
					formatString: '#,##0.###',
					styleFunction: function (
						rowIndex: any,
						columnIndex: any,
						value: any,
						headerText: any,
						item: any,
						dataField: any,
					) {
						return {
							color: item.confirmqty != item.confirmqtyWd ? 'red' : 'blue',
							backgroundColor: item?.orderqty != item?.confirmqtyWd ? '#90ee90' : 'white',
						};
					},
				},
			],
		},
		{
			headerText: '중량',
			children: [
				{
					headerText: '출고',
					dataField: 'confirmweightWd',
					dataType: 'numeric',
					formatString: '#,##0.###',
					styleFunction: function (
						rowIndex: any,
						columnIndex: any,
						value: any,
						headerText: any,
						item: any,
						dataField: any,
					) {
						return {
							color: item.confirmweight != item.confirmweightWd ? 'red' : 'blue',
						};
					},
				},
				{
					headerText: '입고',
					dataField: 'confirmweight',
					dataType: 'numeric',
					formatString: '#,##0.###',
					styleFunction: function (
						rowIndex: any,
						columnIndex: any,
						value: any,
						headerText: any,
						item: any,
						dataField: any,
					) {
						return {
							color: item.confirmweight != item.confirmweightWd ? 'red' : 'blue',
						};
					},
				},
			],
		},
		{
			headerText: '진행상태',
			children: [
				{ headerText: '출고', dataField: 'statusnameWd', dataType: 'code' },
				{ headerText: '입고', dataField: 'statusname', dataType: 'code' },
			],
		},
	];

	// 그리드 Props(클레임내역 그리드)
	const gridProps2 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		// rowStyleFunction 함수 정의
		// 이 함수는 각 행이 렌더링될 때마다 호출됩니다.
		rowStyleFunction: function (rowIndex: any, item: any) {
			// item은 현재 행의 데이터 객체입니다.
			//console.log(('rowIndex:' + rowIndex + ', delYn:' + item.delYn);
			if (item.delYn == 'Y') {
				return 'color-danger'; // CSS 클래스 이름 반환
			}
			return ''; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
		},
	};

	// FooterLayout Props(클레임내역 그리드)
	const footerLayout2 = [
		{
			labelText: '합계',
			positionField: 'docline',
			colSpan: 1, // 셀 가로 병합 대상은 4개로 설정
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'inspectqtyWd',
			positionField: 'inspectqtyWd',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqtyWd',
			positionField: 'confirmqtyWd',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmweightWd',
			positionField: 'confirmweightWd',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmweight',
			positionField: 'confirmweight',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	//그리드 컬럼(이력정보 그리드)
	const gridCol3 = [
		{ headerText: '품목번호', dataField: 'docline', dataType: 'code' },
		{
			headerText: '상품코드',
			dataField: 'sku',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: '상품명칭',
			dataField: 'skuname',
			filter: {
				showIcon: true,
			},
		},
		{ headerText: '플랜트', dataField: 'plantDescr', dataType: 'code' },
		{ headerText: '저장유무', dataField: 'channelname', dataType: 'code' },
		{ headerText: '저장조건', dataField: 'storagetypeName', dataType: 'code' },
		{ headerText: '박스입수', dataField: 'qtyperbox', dataType: 'numeric' },
		{ headerText: '단위', dataField: 'uom', dataType: 'code' },
		{
			headerText: '환산수량',
			children: [
				{ headerText: '평균중량', dataField: 'avgweight', dataType: 'numeric' },
				{ headerText: '환산주문박스', dataField: 'calorderbox', dataType: 'numeric' },
				{ headerText: '환산확정박스', dataField: 'calconfirmbox', dataType: 'numeric' },
				{ headerText: '실박스', dataField: 'realbox', dataType: 'numeric' },
			],
		},
		{ headerText: '주문수량', dataField: 'orderqty', dataType: 'numeric' },
		{ headerText: '입고검수량', dataField: 'inspectqty', dataType: 'numeric' },
		{ headerText: '입고확정량', dataField: 'confirmqty', dataType: 'numeric' },
		{ headerText: '입고중량', dataField: 'weight', dataType: 'numeric' },
		{ headerText: '진행상태', dataField: 'status', dataType: 'code' },
		{
			headerText: '기준일(제조)',
			dataField: 'lotManufacture',
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: '기준일(소비)',
			dataField: 'lotExpire',
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: '소비기간(잔여/전체)',
			dataField: 'durationTerm',
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: '상품이력정보',
			children: [
				{ headerText: '이력번호', dataField: 'serialno', dataType: 'code' },
				{ headerText: '바코드', dataField: 'stockid', dataType: 'code' },
				{ headerText: 'B/L 번호', dataField: 'convserialno', dataType: 'code' },
				{ headerText: '도축일자', dataField: 'butcherydt', dataType: 'date' },
				{ headerText: '도축장', dataField: 'factoryname' },
				{ headerText: '계약유형', dataField: 'contracttype', dataType: 'code' },
				{ headerText: '계약업체', dataField: 'contractcompany', dataType: 'code' },
				{ headerText: '계약업체명', dataField: 'contractcompanyname' },
				{ headerText: 'FROM', dataField: 'fromvaliddt', dataType: 'date' },
				{ headerText: 'TO', dataField: 'tovaliddt', dataType: 'date' },
				{ headerText: '스캔예정량', dataField: 'serialorderqty', dataType: 'numeric' },
				{ headerText: '스캔량', dataField: 'serialinspectqty', dataType: 'numeric' },
				{ headerText: '스캔중량', dataField: 'serialscanweight', dataType: 'numeric' },
			],
		},
	];

	// 그리드 Props(이력정보 그리드)
	const gridProps3 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
	};

	// FooterLayout Props(이력정보 그리드)
	const footerLayout3 = [
		{
			dataField: 'calorderbox',
			positionField: 'calorderbox',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'calconfirmbox',
			positionField: 'calconfirmbox',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'realbox',
			positionField: 'realbox',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	//그리드 컬럼(엑셀 그리드)
	const gridCol4 = [
		{ headerText: '구매유형', dataField: 'ordertypeName', dataType: 'code' },
		{
			headerText: '광역이체정보',
			children: [
				{ headerText: '광역입고일자', dataField: 'slipdt', dataType: 'date' },
				{ headerText: '광역주문번호', dataField: 'docno', dataType: 'code' },
			],
		},
		{
			headerText: '공급센터',
			children: [
				{ headerText: '물류센터', dataField: 'fromDccode', dataType: 'code' },
				{ headerText: '물류센터명', dataField: 'fromDcname' },
				{ headerText: '창고', dataField: 'fromCustkey', dataType: 'code' },
				{ headerText: '창고명', dataField: 'fromCustname' },
			],
		},
		{
			headerText: '공급받는센터',
			children: [
				{ headerText: '물류센터', dataField: 'toDccode', dataType: 'code' },
				{ headerText: '물류센터명', dataField: 'toDcname' },
				{ headerText: '창고', dataField: 'toCustkey', dataType: 'code' },
				{ headerText: '창고명', dataField: 'toCustname' },
			],
		},
		{ headerText: '상품코드', dataField: 'sku', dataType: 'code' },
		{ headerText: '상품명칭', dataField: 'skuname' },
		{ headerText: '플랜트', dataField: 'plantDescr', dataType: 'code' },
		{ headerText: '저장유무', dataField: 'channelname', dataType: 'code' },
		{ headerText: '저장조건', dataField: 'storagetypename', dataType: 'code' },
		{ headerText: '박스입수', dataField: 'qtyperbox', dataType: 'numeric' },
		{ headerText: '구매단위', dataField: 'uom', dataType: 'code' },
		{
			headerText: '환산수량',
			children: [
				{ headerText: '평균중량', dataField: 'avgweight', dataType: 'numeric' },
				{ headerText: '환산주문박스', dataField: 'calorderbox', dataType: 'numeric' },
				{ headerText: '환산확정박스', dataField: 'calconfirmbox', dataType: 'numeric' },
				{ headerText: '실박스', dataField: 'realbox', dataType: 'numeric' },
			],
		},
		{ headerText: '주문수량', dataField: 'orderqty', dataType: 'numeric' },
		{
			headerText: '입고검수량',
			children: [
				{
					headerText: '출고',
					dataField: 'inspectqtyWd',
					dataType: 'numeric',
				},
				{
					headerText: '입고',
					dataField: 'inspectqty',
					dataType: 'numeric',
				},
			],
		},
		{
			headerText: '입고확정량',
			children: [
				{
					headerText: '출고',
					dataField: 'confirmqtyWd',
					dataType: 'numeric',
					styleFunction: function (
						rowIndex: any,
						columnIndex: any,
						value: any,
						headerText: any,
						item: any,
						dataField: any,
					) {
						return {
							color: item.confirmqty != item.confirmqtyWd ? 'red' : 'blue',
						};
					},
				},
				{
					headerText: '입고',
					dataField: 'confirmqty',
					dataType: 'numeric',
					styleFunction: function (
						rowIndex: any,
						columnIndex: any,
						value: any,
						headerText: any,
						item: any,
						dataField: any,
					) {
						return {
							color: item.confirmqty != item.confirmqtyWd ? 'red' : 'blue',
						};
					},
				},
			],
		},
		{
			headerText: '입고중량',
			children: [
				{
					headerText: '출고',
					dataField: 'confirmweightWd',
					dataType: 'numeric',
					styleFunction: function (
						rowIndex: any,
						columnIndex: any,
						value: any,
						headerText: any,
						item: any,
						dataField: any,
					) {
						return {
							color: item.confirmweight != item.confirmweightWd ? 'red' : 'blue',
						};
					},
				},
				{
					headerText: '입고',
					dataField: 'confirmweight',
					dataType: 'numeric',
					styleFunction: function (
						rowIndex: any,
						columnIndex: any,
						value: any,
						headerText: any,
						item: any,
						dataField: any,
					) {
						return {
							color: item.confirmweight != item.confirmweightWd ? 'red' : 'blue',
						};
					},
				},
			],
		},
		{ headerText: '진행상태', dataField: 'statusname', dataType: 'code' },
		{ headerText: '생성인', dataField: 'addwho', dataType: 'code' },
		{ headerText: '등록일자', dataField: 'adddate', dataType: 'date' },
		{ headerText: '최종변경자', dataField: 'editwho', dataType: 'code' },
		{ headerText: '최종변경시간', dataField: 'editdate', dataType: 'date' },
	];

	// 그리드 Props(엑셀 그리드)
	const gridProps4 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
	};

	// FooterLayout Props(엑셀 그리드)
	const footerLayout4 = [
		{
			dataField: 'calorderbox',
			positionField: 'calorderbox',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'calconfirmbox',
			positionField: 'calconfirmbox',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'realbox',
			positionField: 'realbox',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			style: 'right',
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
			dataField: 'inspectqtyWd',
			positionField: 'inspectqtyWd',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'confirmqtyWd',
			positionField: 'confirmqtyWd',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'confirmweightWd',
			positionField: 'confirmweightWd',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'confirmweight',
			positionField: 'confirmweight',
			operation: 'SUM',
			formatString: '#,##0',
			postfix: '',
			style: 'right',
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

				ref.gridRef2.current?.resize('100%', '100%');
			}
		}
	}, [props.data]);

	let prevRowIndex: any = null;
	useEffect(() => {
		ref.gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;
			const field = event.primeCell.dataField;
			if (ref.gridRef.current.getColumnItemByDataField(field)?.renderer?.type == 'DropDownListRenderer') {
				return;
			}

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell?.item?._$uid;
			// 상세코드 조회
			setActiveKey('1');
			searchDtl();
		});
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
		ref.gridRef3?.current?.resize?.('100%', '100%');
		ref.gridRef4?.current?.resize?.('100%', '100%');
	}, []);

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: '주문현황',
			children: (
				<GridAutoHeight id="order-status-grid" style={{ marginTop: '15px' }}>
					<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
				</GridAutoHeight>
			),
		},
		{
			key: '2',
			label: '이력현황',
			children: (
				<GridAutoHeight id="history-status-grid" style={{ marginTop: '15px' }}>
					<AUIGrid ref={ref.gridRef3} columnLayout={gridCol3} gridProps={gridProps3} footerLayout={footerLayout3} />
				</GridAutoHeight>
			),
		},
	];

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight id="center-sto-grid">
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<TabsArray
							key="receipt-confirm-detail-tab"
							activeKey={activeKey}
							onChange={key => setActiveKey(key)}
							items={tabItems}
						/>
					</>,
				]}
			/>
			<div id="dp-none-grid" className="dp-none">
				<AUIGrid ref={ref.gridRef4} columnLayout={gridCol4} gridProps={gridProps4} footerLayout={footerLayout4} />
			</div>
		</>
	);
});

export default DpInplanSTODetail;
