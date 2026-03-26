/*
 ############################################################################
 # FiledataField	: WdInplanSTODetail.tsx
 # Description		: 광역출고현황 상단 그리드
 # Author			: YeoSeungCheol
 # Since			: 25.11.12
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { Button } from 'antd';

// Type
import { GridBtnPropsType } from '@/types/common';

// Lib
import { apiGetExcellist } from '@/api/wd/apiWdInplanSTO';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Store
// Type

// api

const WdInplanSTODetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	props.gridRef.gridRefExcel = useRef();
	// 다국어
	const { t } = useTranslation();

	// 그리드 초기화
	const gridCol = [
		{
			// 주문유형
			headerText: t('lbl.ORDERTYPE'),
			dataField: 'ordertype',
			dataType: 'code',
			editable: false,
		},
		{
			// 광역이체정보
			headerText: t('lbl.DCSTOINFO'), //- dcstoinfo
			children: [
				{
					// 광역출고일자
					headerText: t('lbl.DOCDT_WD_STO'),
					dataField: 'docdt',
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
				},
				{
					// 광역주문번호
					headerText: t('lbl.DOCNO_WD_STO'),
					dataField: 'docno',
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			// 공급센터
			headerText: t('lbl.FROM_DCCODE'), //- fromDccode
			children: [
				{
					// 물류센터
					headerText: t('lbl.DCCODE'),
					dataField: 'fromDccode',
					dataType: 'code',
					editable: false,
				},
				{
					// 물류센터명
					headerText: t('lbl.DCNAME'),
					dataField: 'fromDcname',
					dataType: 'code',
					editable: false,
				},
				{
					// 창고
					headerText: t('lbl.ORGANIZE'),
					dataField: 'fromOrganize',
					dataType: 'code',
					editable: false,
				},
				{
					// 창고명
					headerText: t('lbl.ORGANIZENAME'),
					dataField: 'fromCustname',
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			// 공급받는센터
			headerText: t('lbl.TO_DCCODE'), //- toDccode
			children: [
				{
					// 물류센터
					headerText: t('lbl.DCCODE'),
					dataField: 'toDccode',
					dataType: 'code',
					editable: false,
				},
				{
					// 물류센터명
					headerText: t('lbl.DCNAME'),
					dataField: 'toDcname',
					dataType: 'code',
					editable: false,
				},
				{
					// 창고
					headerText: t('lbl.ORGANIZE'),
					dataField: 'toOrganize',
					dataType: 'code',
					editable: false,
				},
				{
					// 창고명
					headerText: t('lbl.ORGANIZENAME'),
					dataField: 'toCustname',
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			// 진행상태
			headerText: t('lbl.STATUS_WD'),
			dataField: 'status',
			dataType: 'code',
			editable: false,
		},
		{
			// 차량번호
			headerText: t('lbl.CARNO'),
			dataField: 'carno',
			editable: false,
		},
		{
			// 출차시간
			headerText: t('lbl.OUTCARTIME'),
			dataField: 'dcdeparturedt',
			dataType: 'date',
			editable: false,
		},
		{
			// 이체유형
			headerText: t('lbl.STOTYPE'),
			dataField: 'stotype',
			dataType: 'code',
			editable: false,
		},
		{
			// 메모
			headerText: t('lbl.MEMO'),
			dataField: 'memo1',
			dataType: 'default',
			editable: false,
		},
		{
			// 등록자
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addwhoId',
			editable: false,
		},
		{
			dataField: 'addwhoId',
			visible: false,
		},
		{
			// 등록일시
			headerText: t('lbl.ADDDATE'),
			dataField: 'adddate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'), // 수정자
			dataType: 'manager',
			managerDataField: 'editwhoId',
			editable: false,
		},
		{
			dataField: 'editwhoId',
			visible: false,
		},
		{
			// 수정일시
			headerText: t('lbl.EDITDATE'),
			dataField: 'editdate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		enableFilter: true,
		rowStyleFunction: (rowIndex: any, item: any) => {
			if (commUtil.isEmpty(item.status)) {
				return 'color-danger';
			}
			return '';
		},
		//showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// customRowCheckColumnDataField: 'check', // 커스텀 엑스트라 체크박스 DataField
		// customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		// customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	const gridColExcel = [
		{ headerText: t('lbl.ORDERTYPE'), /*주문유형*/ dataField: 'ordertype', dataType: 'code' },
		{
			// 광역이체정보
			headerText: t('lbl.DCSTOINFO'), //- dcstoinfo
			children: [
				{
					// 광역출고일자
					headerText: t('lbl.DOCDT_WD_STO'),
					dataField: 'docdt',
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
				},
				{
					// 광역주문번호
					headerText: t('lbl.DOCNO_WD_STO'),
					dataField: 'docno',
					dataType: 'code',
				},
			],
		},
		{
			// 공급센터
			headerText: t('lbl.FROM_DCCODE'), //- fromDccode
			children: [
				{
					// 물류센터
					headerText: t('lbl.DCCODE'),
					dataField: 'fromDccode',
					dataType: 'code',
				},
				{
					// 물류센터명
					headerText: t('lbl.DCNAME'),
					dataField: 'fromDcname',
					dataType: 'code',
				},
				{
					// 창고
					headerText: t('lbl.ORGANIZE'),
					dataField: 'fromOrganize',
					dataType: 'code',
				},
				{
					// 창고명
					headerText: t('lbl.ORGANIZENAME'),
					dataField: 'fromCustname',
					dataType: 'code',
				},
			],
		},
		{
			// 공급받는센터
			headerText: t('lbl.TO_DCCODE'), //- toDccode
			children: [
				{
					// 물류센터
					headerText: t('lbl.DCCODE'),
					dataField: 'toDccode',
					dataType: 'code',
				},
				{
					// 물류센터명
					headerText: t('lbl.DCNAME'),
					dataField: 'toDcname',
					dataType: 'code',
				},
				{
					// 창고
					headerText: t('lbl.ORGANIZE'),
					dataField: 'toOrganize',
					dataType: 'code',
				},
				{
					// 창고명
					headerText: t('lbl.ORGANIZENAME'),
					dataField: 'toCustname',
					dataType: 'code',
				},
			],
		},
		{ headerText: t('lbl.CARNO'), /*차량번호*/ dataField: 'carno', dataType: 'code' },
		{ headerText: t('lbl.OUTCARTIME'), /*출차시간*/ dataField: 'dcdeparturedt', dataType: 'date' },
		{ headerText: t('lbl.DOCLINE'), /*품목번호*/ dataField: 'docline', dataType: 'code' },
		{ headerText: t('lbl.SKU'), /*상품코드*/ dataField: 'sku', dataType: 'code' },
		{ headerText: t('lbl.SKUNAME'), /*상품명*/ dataField: 'skuname', dataType: 'code' },
		{ headerText: t('lbl.PLANT'), /*플랜트명*/ dataField: 'plantDescr', dataType: 'code' },
		{ headerText: t('lbl.CHANNEL_DMD'), /*저장유무*/ dataField: 'channel', dataType: 'code' },
		{ headerText: t('lbl.STORAGETYPE'), /*저장조건*/ dataField: 'storagetype', dataType: 'code' },
		{ headerText: t('lbl.UOM_STO'), /*이체단위*/ dataField: 'uom', dataType: 'code' },
		{
			headerText: t('lbl.ORDERQTY_WD'),
			/*주문수량*/ dataField: 'orderqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.DISTRIBUTEQTY_WD'),
			/*분배량*/ dataField: 'processqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{ headerText: t('lbl.WORKQTY_WD'), /*피킹량*/ dataField: 'workqty', dataType: 'numeric', formatString: '#,##0.##' },
		{
			headerText: t('lbl.INSPECTQTY_TASK'), //- 검수량
			children: [
				{
					// 출고
					headerText: t('lbl.WD'),
					dataField: 'inspectqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						return 'color-danger';
					},
				},
				{
					// 입고
					headerText: t('lbl.DP'),
					dataField: 'tostoInspectqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						return 'color-danger';
					},
				},
			],
		},
		{
			headerText: t('lbl.CONFIRMQTY'), //- 확정수량
			children: [
				{
					// 출고
					headerText: t('lbl.WD'),
					dataField: 'confirmqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						return 'color-info';
					},
				},
				{
					// 입고
					headerText: t('lbl.DP'),
					dataField: 'tostoConfirmqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						return 'color-info';
					},
				},
			],
		},
		{
			headerText: t('lbl.WEIGHT_KG'), //- 중량
			children: [
				{
					// 출고
					headerText: t('lbl.WD'),
					dataField: 'confirmweight',
					dataType: 'numeric',
					formatString: '#,##0.##',
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						return 'color-info';
					},
				},
				{
					// 입고
					headerText: t('lbl.DP'),
					dataField: 'tostoConfirmweight',
					dataType: 'numeric',
					formatString: '#,##0.##',
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						return 'color-info';
					},
				},
			],
		},
		{
			headerText: t('lbl.STATUS'), //- 진행상태
			children: [
				{
					// 출고
					headerText: t('lbl.WD'),
					dataField: 'status',
					dataType: 'code',
				},
				{
					// 입고
					headerText: t('lbl.DP'),
					dataField: 'tostoStatus',
					dataType: 'code',
				},
			],
		},
		{ headerText: t('lbl.ADDWHO'), /*등록자*/ dataField: 'addwho', dataType: 'code' },
		{ headerText: t('lbl.ADDDATE'), /*등록일시*/ dataField: 'adddate', dataType: 'date' },
		{ headerText: t('lbl.EDITWHO'), /*수정자*/ dataField: 'editwho', dataType: 'code' },
		{ headerText: t('lbl.EDITDATE'), /*수정일시*/ dataField: 'editdate', dataType: 'date' },
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 저장 함수
	 */
	// const saveMasterList = () => {
	// 	if (props.onSave) {
	// 		props.onSave();
	// 	}
	// };

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 */
		const gridRef = props.gridRef;

		gridRef?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			if (props.data && props.data.length > 0) {
				gridRef?.current.setSelectionByIndex(0);
			}
		});

		// /**
		//  * 그리드 셀 편집 종료
		//  * @param {any} event 이벤트
		//  */
		// gridRef?.current.bind('cellEditEnd', (event: any) => {
		// 	// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.

		// 	gridRef.current.addCheckedRowsByValue('issueno', event.item.issueno);
		// 	gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
		// });
	};

	/**
	 * 인쇄(상세그리드)
	 */
	const onPrint = () => {
		const params = props.form.getFieldsValue();
		params.fromSlipdt = params.docdtWdSto[0].format('YYYYMMDD');
		params.toSlipdt = params.docdtWdSto[1].format('YYYYMMDD');
		params.fromDccode = [].concat(params.fromDccode).join(',');
		params.toDccode = [].concat(params.toDccode).join(',');

		apiGetExcellist(params).then(res => {
			//rd리포트 호출

			props.gridRef.gridRefExcel.current?.setGridData(res.data);
			const colSizeList = props.gridRef.gridRefExcel.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			props.gridRef.gridRefExcel.current?.setColumnSizeList(colSizeList);

			onExcelDownloadClick(); // 라벨출력 데이타와 비교하기 위해 엑셀로 다운받는다.
		});
	};

	/**
	 * 대용량 엑셀 다운로드
	 */
	const onExcelDownloadClick = () => {
		// const params = props.form.getFieldsValue();
		// params.fromDccode = [].concat(params.fromDccode).join(',');
		// params.toDccode = [].concat(params.toDccode).join(',');

		// apiPostLargeDataExcel(params).then(res => {
		// 	FileSaver.saveAs(res.data, dataRegex.decodeDisposition(res.headers['content-disposition']));
		// });
		const params = {
			fileName: '센터간STO출고현황',
			exportWithStyle: true, // 스타일 적용 여부
			progressBar: true, // 진행바 표시 여부
		};
		props.gridRef.gridRefExcel.current.exportToXlsxGrid(params);
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: props.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'print',
				callBackFn: props.printMasterList,
			},
		],
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
		const gridRefToUse = ref || props.gridRef;
		const gridRefCur = gridRefToUse.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.data && props.data.length > 0) {
				// 데이터 설정 후 컬럼 크기 자동 조정
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data, ref, props.gridRef]);

	return (
		<>
			<AGrid className="h100">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={props.totalCnt}>
					<Button onClick={onPrint}>{t('lbl.EXCELDOWNLOAD')}</Button>
				</GridTopBtn>
				<AUIGrid ref={props.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<AGrid className="dp-none">
				<GridTopBtn gridBtn={gridBtn} gridTitle="센터간STO출고현황" />
				<AUIGrid ref={props.gridRef.gridRefExcel} columnLayout={gridColExcel} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default WdInplanSTODetail;
