// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Util

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import {
	apiGetDataExcelList,
	apiGetDetailList,
	apiGetPrintData,
	apiPostSaveInspect,
	apiPostSaveInspectAll,
	apiPostSaveSendSMS,
	apiPostSaveSendSMSAll,
	apiPostSaveSendSMSAllResend,
	apiPostSaveSendSMSResend,
} from '@/api/kp/apiKpDpInspectMonitoring';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';

// Store

const KpDpInspectMonitoringDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { form } = props;
	ref.gridRef1 = useRef<any>(null);
	ref.gridRef2 = useRef<any>(null);
	ref.gridRef3 = useRef<any>(null);

	// grid data
	const [totalCntDtl, setTotalCntDtl] = useState(0);
	const [selItem, setSelItem] = useState<any>({});

	/**
	 * 그리드 컬럼을 설정한다.
	 * @returns {object[]} 그리드 컬럼 설정 객체
	 */
	const getGridCol1 = () => {
		return [
			{
				headerText: t('lbl.SLIPDT_DP'), // 입고전표일자
				dataField: 'slipdt',
				dataType: 'date',
			},

			{
				headerText: t('lbl.DCCODE'), // 물류센터
				dataField: 'dccode',
				dataType: 'code',
			},

			{
				headerText: t('lbl.VENDOR'), // 협력사코드
				dataField: 'fromcustkey',
				dataType: 'code',
				filter: {
					showIcon: true,
				},
				commRenderer: {
					type: 'popup',
					onClick: function (e: any) {
						ref.gridRef1.current.openPopup(
							{
								custkey: e.item.fromcustkey,
								custtype: 'P',
							},
							'cust',
						);
					},
				},
			},

			{
				headerText: t('lbl.VENDORNAME'), // 협력사명
				dataField: 'fromcustname',
			},

			{
				headerText: t('lbl.CHANNEL_DMD'), // 저장유무
				dataField: 'channelname',
				dataType: 'code',
			},

			{
				headerText: t('lbl.INSPECT_START_TIME'), // 검수시작시간
				dataField: 'inspectStartTime',
				dataType: 'code',
			},

			{
				headerText: t('lbl.INSPECT_END_TIME'), // 검수종료시간
				dataField: 'inspectEndTime',
				dataType: 'code',
			},

			{
				headerText: t('lbl.TAKETIME_MIN'), // 소요시간(시간:분)
				dataField: 'taketimeMin',
				dataType: 'code',
			},

			{
				headerText: t('lbl.INSPECTOPENCNT_DP'), // 입고검수예정건수
				dataField: 'inspectopencnt',
				dataType: 'numeric',
				formatString: '#,##0.##',
				editRenderer: {
					type: 'InputEditRenderer',
					//allowNegative: true, // 음수허용
					allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
					// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
					// onlyNumeric: true, // 0~9만 입력가능
					//onlyNumeric: false,
					//textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
					//maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
					//autoThousandSeparator: true, // 천단위 구분자 삽입 여부
					// decimalPrecision: 2, // 소숫점 2자리까지 허용
					//regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
				},
			},

			{
				headerText: t('lbl.INSPECTPROCESSCNT_DP'), // 입고검수진행건수
				dataField: 'inspectprocesscnt',
				dataType: 'numeric',
				formatString: '#,##0.##',
				editRenderer: {
					type: 'InputEditRenderer',
					//allowNegative: true, // 음수허용
					allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
					// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
					// onlyNumeric: true, // 0~9만 입력가능
					//onlyNumeric: false,
					//textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
					//maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
					//autoThousandSeparator: true, // 천단위 구분자 삽입 여부
					// decimalPrecision: 2, // 소숫점 2자리까지 허용
					//regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
				},
			},

			{
				headerText: t('lbl.INSPECTPROCESSCNT_DP') + '2', // 입고검수진행건수2
				dataField: 'inspectprocesscnt2',
				dataType: 'numeric',
				formatString: '#,##0.##',
				editRenderer: {
					type: 'InputEditRenderer',
					//allowNegative: true, // 음수허용
					allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
					// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
					// onlyNumeric: true, // 0~9만 입력가능
					//onlyNumeric: false,
					//textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
					//maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
					//autoThousandSeparator: true, // 천단위 구분자 삽입 여부
					// decimalPrecision: 2, // 소숫점 2자리까지 허용
					//regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
				},
			},

			{
				headerText: t('lbl.INSPECTPROCESSRATE_DP'), // 입고진행율(%)
				dataField: 'inspectprocessrate',
				dataType: 'code',
			},

			{
				headerText: t('lbl.RESULT_TAB'), // 처리결과
				dataField: 'result',
				dataType: 'code',
			},

			{
				headerText: t('lbl.UNDONEYN_DP'), // 미완료여부
				dataField: 'undoneyn',
				dataType: 'code',
			},

			{
				headerText: t('lbl.INSPECTION_COMPLETED'), // 검수완료
				dataField: 'inspectcommit',
				dataType: 'code',
				renderer: {
					type: 'ButtonRenderer',
					onClick: (event: any) => {
						onClickSaveInspect([event.item]);
					},
					labelText: '검수완료', // 버튼에 표시할 텍스트
					visibleFunction: (rowIndex: any, columnIndex: any, value: any, item: any) => {
						return item.btnflag === 'Y' ? true : false;
					},
				},
			},

			{
				headerText: 'SMS' + t('lbl.SEND1'), // SMS1차발송
				dataField: 'smssend1',
				dataType: 'code',
				renderer: {
					type: 'ButtonRenderer',
					onClick: (event: any) => {
						onClickSendSMS([event.item], '1차');
					},
					labelText: '1차발송', // 버튼에 표시할 텍스트
					visibleFunction: (rowIndex: any, columnIndex: any, value: any, item: any) => {
						return item.sms1flag === 'Y' ? true : false;
					},
				},
			},

			{
				headerText: 'SMS' + t('lbl.SEND2'), // SMS2차발송
				dataField: 'smssend2',
				dataType: 'code',
				renderer: {
					type: 'ButtonRenderer',
					onClick: (event: any) => {
						onClickSendSMSResend([event.item], '2차');
					},
					labelText: '2차발송', // 버튼에 표시할 텍스트
					visibleFunction: (rowIndex: any, columnIndex: any, value: any, item: any) => {
						return item.sms2flag === 'Y' ? true : false;
					},
				},
			},

			{
				headerText: '검수확인서',
				dataField: 'inspectprt',
				dataType: 'code',
				renderer: {
					type: 'ButtonRenderer',
					onClick: (event: any) => {
						onClickPrintMasterList([event.item]);
					},
					labelText: '검수확인서', // 버튼에 표시할 텍스트
					visibleFunction: (rowIndex: any, columnIndex: any, value: any, item: any) => {
						return item.btnflag3 === 'Y' ? true : false;
					},
				},
			},
		];
	};

	const getGridCol2 = () => {
		return [
			{
				headerText: t('lbl.SLIPNO_DP'), // 입고전표번호
				dataField: 'docno',
				dataType: 'code',
			},

			{
				headerText: t('lbl.SKUCD'), // 상품코드
				dataField: 'sku',
				dataType: 'code',
				filter: {
					showIcon: true,
				},
				commRenderer: {
					type: 'popup',
					onClick: function (e: any) {
						ref.gridRef2.current.openPopup(
							{
								sku: e.item.sku,
							},
							'sku',
						);
					},
				},
			},

			{
				headerText: t('lbl.SKUNAME'), // 상품명칭
				dataField: 'skuname',
				filter: {
					showIcon: true,
				},
			},

			{
				headerText: t('lbl.STORAGETYPE'), // 저장조건
				dataField: 'storagetype',
				dataType: 'code',
			},

			{
				headerText: t('lbl.DELIVERYGROUP_WD'), // POP번호
				dataField: 'deliverygroup',
				dataType: 'code',
			},

			{
				headerText: t('lbl.CUST_CODE'), // 고객코드
				dataField: 'toCustkey',
				dataType: 'code',
				filter: {
					showIcon: true,
				},
				commRenderer: {
					type: 'popup',
					onClick: function (e: any) {
						ref.gridRef2.current.openPopup(
							{
								custkey: e.item.toCustkey,
							},
							'cust',
						);
					},
				},
			},
			{
				headerText: t('lbl.CUST_NAME'), // 고객명
				dataField: 'toCustname',
				filter: {
					showIcon: true,
				},
			},
			{
				headerText: t('lbl.ORDERQTY_DP'), // 구매수량
				dataField: 'orderqty',
				dataType: 'numeric',
				formatString: '#,##0.##',
				editRenderer: {
					type: 'InputEditRenderer',
					//allowNegative: true, // 음수허용
					allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
					// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
					// onlyNumeric: true, // 0~9만 입력가능
					//onlyNumeric: false,
					//textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
					//maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
					//autoThousandSeparator: true, // 천단위 구분자 삽입 여부
					// decimalPrecision: 2, // 소숫점 2자리까지 허용
					//regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
				},
			},

			{
				headerText: t('lbl.SCANQTY'), // 스캔수량
				dataField: 'inspectqty',
				dataType: 'numeric',
				formatString: '#,##0.##',
				editRenderer: {
					type: 'InputEditRenderer',
					//allowNegative: true, // 음수허용
					allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
					// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
					// onlyNumeric: true, // 0~9만 입력가능
					//onlyNumeric: false,
					//textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
					//maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
					//autoThousandSeparator: true, // 천단위 구분자 삽입 여부
					// decimalPrecision: 2, // 소숫점 2자리까지 허용
					//regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
				},
			},

			{
				headerText: t('lbl.SHORTAGEQTY'), // 결품수량
				dataField: 'shortageqty',
				dataType: 'numeric',
				formatString: '#,##0.##',
				editRenderer: {
					type: 'InputEditRenderer',
					//allowNegative: true, // 음수허용
					allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
					// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
					// onlyNumeric: true, // 0~9만 입력가능
					//onlyNumeric: false,
					//textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
					//maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
					//autoThousandSeparator: true, // 천단위 구분자 삽입 여부
					// decimalPrecision: 2, // 소숫점 2자리까지 허용
					//regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
				},
			},

			{
				headerText: t('lbl.UOM_DP'), // 구매단위
				dataField: 'uom',
				dataType: 'code',
			},

			{
				headerText: t('lbl.RESULT_TAB'), // 처리결과
				dataField: 'result',
				dataType: 'code',
			},

			{
				headerText: t('lbl.REASONCODE_DP'), // 결품사유
				dataField: 'reasoncode',
				dataType: 'code',
			},

			{
				headerText: t('lbl.REASONRESULTMSG'), // 결품처리결과(TEXT)
				dataField: 'reasonmsg',
			},

			{
				headerText: t('lbl.INSPECTOR'), // 검수자
				dataField: 'editwho',
				dataType: 'code',
			},
			{
				headerText: t('lbl.INSPECT_START_TIME'), // 검수시작시간
				dataField: 'inspectStartTime',
				dataType: 'date',
			},
		];
	};

	/**
	 * 그리드 속성을 설정한다.
	 * @returns {object} 그리드 속성 설정 객체
	 */
	const getGridProps1 = () => {
		return {
			// fillColumnSizeMode: false,
			// enableColumnResize: true,
			showRowCheckColumn: true,
			// enableFilter: true,
		};
	};
	const getGridProps2 = () => {
		return {
			// fillColumnSizeMode: true,
			// enableColumnResize: true,
			// enableFilter: true,
		};
	};

	const gridProps3 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
	};

	// 엑셀다운로드용 그리드 컬럼
	const gridCol3 = [
		{
			headerText: '입고전표일자',
			dataField: 'slipdt',
			dataType: 'code',
		},
		{
			headerText: '물류센터',
			dataField: 'dccode',
			dataType: 'code',
		},
		{
			headerText: '협력사코드',
			dataField: 'fromCustkey',
			dataType: 'code',
		},
		{
			headerText: '협력사명',
			dataField: 'fromCustname',
			dataType: 'code',
		},
		{
			headerText: '저장유무',
			dataField: 'channelname',
			dataType: 'code',
		},
		{
			headerText: '검수시작시간',
			dataField: 'inspectStartTime',
			dataType: 'code',
		},

		{
			headerText: '검수종료시간',
			dataField: 'inspectEndTime',
			dataType: 'code',
		},
		{
			headerText: '소요시간(시간:분)',
			dataField: 'taketimeMin',
			dataType: 'code',
		},
		{
			headerText: '입고검수예정건수',
			dataField: 'inspectopencnt',
			dataType: 'code',
		},
		{
			headerText: '입고검수진행건수',
			dataField: 'inspectprocesscnt',
			dataType: 'code',
		},
		{
			headerText: '입고검수진행건수2',
			dataField: 'inspectprocesscnt2',
			dataType: 'code',
		},
		{
			headerText: '입고진행율(%)',
			dataField: 'inspectprocessrate',
			dataType: 'code',
		},
		{
			headerText: '입고전표번호',
			dataField: 'docno',
			dataType: 'code',
		},
		{
			headerText: '상품코드',
			dataField: 'sku',
			dataType: 'code',
		},
		{
			headerText: '상품명칭',
			dataField: 'skuname',
			dataType: 'code',
		},
		{
			headerText: '저장조건',
			dataField: 'storagetype',
			dataType: 'code',
		},
		{
			headerText: 'POP번호',
			dataField: 'deliverygroup',
			dataType: 'code',
		},
		{
			headerText: '고객코드',
			dataField: 'toCustkey',
			dataType: 'code',
		},
		{
			headerText: '고객명',
			dataField: 'toCustname',
			dataType: 'code',
		},
		{
			headerText: '구매수량',
			dataField: 'orderqty',
			dataType: 'number',
		},
		{
			headerText: '스캔수량',
			dataField: 'inspectqty',
			dataType: 'number',
		},
		{
			headerText: '결품수량',
			dataField: 'shortageqty',
			dataType: 'number',
		},
		{
			headerText: '구매단위',
			dataField: 'uom',
			dataType: 'code',
		},
		{
			headerText: '처리결과',
			dataField: 'result',
			dataType: 'code',
		},
		{
			headerText: '결품사유',
			dataField: 'reasoncode',
			dataType: 'code',
		},
		{
			headerText: '결품처리결과(TEXT)',
			dataField: 'reasonmsg',
			dataType: 'code',
		},
		{
			headerText: '검수자',
			dataField: 'editwho',
			dataType: 'code',
		},
		{
			headerText: '검수시간',
			dataField: 'inspectStartTime',
			dataType: 'code',
		},
	];

	// FooterLayout Props(상세목록 그리드)
	const footerLayout3 = [
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
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'shortageqty',
			positionField: 'shortageqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

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

		// Test Data
		// params.fromSlipdt = '20240304';
		// params.toSlipdt = '20240304';

		if (dateUtil.getDaysDiff(params.fromSlipdt, params.toSlipdt) > 31) {
			showAlert('', '최대 한 달 간의 데이터만\n조회 가능합니다.');
			return;
		}

		apiGetDataExcelList(params).then(res => {
			const gridData = res.data;
			ref.gridRef3.current?.setGridData(gridData);
			ref.gridRef3.current?.setSelectionByIndex(0, 0);

			if (gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = ref.gridRef3.current.getFitColumnSizeList(true);

				const excelParams = {
					fileName: '입고검수관리',
					//columnSizeOfDataField: result,
					exportWithStyle: true, // 스타일 적용 여부
					progressBar: true,
				};

				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef3.current.setColumnSizeList(colSizeList);
				ref.gridRef3.current?.exportToXlsxGrid(excelParams);
			} else {
				showAlert('', '엑셀다운로드 할 정보가 없습니다.');
			}
		});
	};

	/**
	 * 그리드 버튼 함수를 설정한다.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				// 검수완료
				btnType: 'btn1',
				callBackFn: () => {
					onClickSaveInspectAll();
				},
			},
			{
				// SMS 1차발송
				btnType: 'btn2',
				callBackFn: () => {
					onClickSendSMSAll('1차');
				},
			},
			{
				// SMS 2차발송
				btnType: 'btn3',
				callBackFn: () => {
					onClickSendSMSAll('2차');
				},
			},
			{
				// 검수확인서
				btnType: 'btn4',
				callBackFn: () => {
					onClickPrintMasterListAll();
				},
			},
			{
				btnType: 'excelDownload', //엑셀다운로드
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: searchExcel,
			},
		],
	};
	const gridBtn2: GridBtnPropsType = {
		tGridRef: ref.gridRef2, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 수신그룹 상세 조회
	 * @param {number} rowIndex 선택된 Row Index
	 * @returns {void}
	 */
	const searchDtl = (rowIndex: number) => {
		ref.gridRef2.current.clearGridData();

		if (commUtil.isNotEmpty(rowIndex)) {
			const selectedRow = ref.gridRef1.current.getItemByRowIndex(rowIndex);
			if (commUtil.isNotEmpty(selectedRow) && !ref.gridRef1.current.isAddedById(selectedRow._$uid)) {
				setSelItem(selectedRow);

				const params = {
					...form.getFieldsValue(),
					slipdt: selectedRow.slipdt,
					dccode: selectedRow.dccode,
					fromcustkey: selectedRow.fromcustkey,
					channel: selectedRow.channel,
					// result: selectedRow.result,
					// fixdccode: gDccode,
				};

				apiGetDetailList(params).then(res => {
					const gridData = res.data;
					ref.gridRef2.current.setGridData(gridData);
					setTotalCntDtl(gridData.length);

					// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
					ref.gridRef2.current.setColumnSizeList(ref.gridRef2.current.getFitColumnSizeList(true));
				});
			} else {
				return;
			}
		}
	};

	/**
	 * 검수완료 버튼 (일괄)
	 */
	const onClickSaveInspectAll = () => {
		const checkedRows = ref.gridRef1?.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			// showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			showAlert(null, '검수 완료 할 ROW를 선택하여 주시기 바랍니다.'); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, '일괄 검수 완료 하시겠습니까?', () => {
			const params = {
				saveList: checkedRows,
			};
			apiPostSaveInspectAll(params).then(res => {
				// 콜백 처리
				if (props.callBackFn && props.callBackFn instanceof Function) {
					if (res.data.statusCode > -1) {
						showAlert(null, res.data.statusMessage);
					}
					props.callBackFn();
				}
			});
		});
	};

	/**
	 * 검수완료 버튼
	 * @param items
	 * @param saveList
	 */
	const onClickSaveInspect = (saveList: any) => {
		showConfirm(null, '검수완료를 하시겠습니까?', () => {
			const params = {
				saveList: saveList,
			};
			apiPostSaveInspect(params).then(res => {
				// 콜백 처리
				if (props.callBackFn && props.callBackFn instanceof Function) {
					if (res.data.statusCode > -1) {
						showAlert(null, res.data.statusMessage);
					}
					props.callBackFn();
				}
			});
		});
	};

	/**
	 * SMS 발송 버튼 (일괄)
	 * @param cnt
	 */
	const onClickSendSMSAll = (cnt: string) => {
		const checkedRows = ref.gridRef1?.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			// showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			showAlert(null, 'SMS 발송 할 ROW를 선택하여 주시기 바랍니다.'); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, `일괄 SMS ${cnt}발송 하시겠습니까?`, () => {
			for (let i = 0; i < checkedRows.length; i++) {
				const row = checkedRows[i];
				const params = { saveList: [row] };
				if (row.smscnt === 0) {
					// smscnt가 0이면
					apiPostSaveSendSMSAll(params).then(res => {
						// 콜백 처리
						if (props.callBackFn && props.callBackFn instanceof Function) {
							if (res.data.statusCode > -1) {
								showAlert(null, res.data.statusMessage);
							}
							props.callBackFn();
						}
					});
				} else {
					// smscnt가 0이 아니면
					apiPostSaveSendSMSAllResend(params).then(res => {
						// 콜백 처리
						if (props.callBackFn && props.callBackFn instanceof Function) {
							if (res.data.statusCode > -1) {
								showAlert(null, res.data.statusMessage);
							}
							props.callBackFn();
						}
					});
				}
			}
		});
	};

	/**
	 * SMS 발송 버튼 (단건)
	 * @param items
	 * @param saveList
	 * @param cnt
	 */
	const onClickSendSMS = (saveList: any, cnt: string) => {
		showConfirm(null, `SMS ${cnt}발송을 하시겠습니까?`, () => {
			const params = {
				saveList: saveList,
			};
			apiPostSaveSendSMS(params).then(res => {
				// 콜백 처리
				if (props.callBackFn && props.callBackFn instanceof Function) {
					showConfirm(null, '이미 ' + res.data.statusMessage + '회를 발송하셨습니다. \n 발송 하시겠습니까?', () => {
						onClickSendSMSResend(saveList, cnt);
					});
					props.callBackFn();
				}
			});
		});
	};

	/**
	 * SMS 발송 버튼 (단건)
	 * @param items
	 * @param saveList
	 * @param cnt
	 */
	const onClickSendSMSResend = (saveList: any, cnt: string) => {
		showConfirm(null, `SMS ${cnt}발송을 하시겠습니까?`, () => {
			const params = {
				saveList: saveList,
			};
			apiPostSaveSendSMSResend(params).then(res => {
				if (props.callBackFn && props.callBackFn instanceof Function) {
					if (res.data.statusCode > -1) {
						showAlert(null, res.data.statusMessage);
					}
					props.callBackFn();
				}
			});
		});
	};

	/**
	 * 검수확인서 출력 (일괄)
	 */
	const onClickPrintMasterListAll = () => {
		// 리스트 로직 구현

		const checkedRows = ref.gridRef1.current?.getCheckedRowItemsAll(); // 커스텀 체크박스 대응

		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length === 0) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 모든 행의 btnflag가 'Y'면 알림 표시 후 리턴 (btnflag === 'N'이 하나도 없을 때)
		if (checkedRows.every((row: any) => row.btnflag !== 'N')) {
			showAlert(null, '출력 할 내용이 없습니다.');
			return;
		}

		// btnflag === 'N'인 행만 필터링
		const filteredRows = checkedRows.filter((row: any) => row.btnflag === 'N');
		if (filteredRows.length === 0) {
			showAlert(null, '출력 할 내용이 없습니다.');
			return;
		}

		const params = {
			reqList: filteredRows,
		};

		showConfirm(null, '일괄 검수확인서 출력 하시겠습니까?', () => {
			apiGetPrintData(params).then(res => {
				let data = res.data;

				// data가 비어있으면 기본값 추가
				if (!data || data.length === 0) {
					data = [
						{
							dcname: filteredRows[0].dcname,
							fromCustname: filteredRows[0].fromcustname,
							slipdt: filteredRows[0].slipdt,
							skuname: '미입고 상품이 없습니다.',
						},
					];
				}
				//rd리포트 호출
				viewRdReportMaster(data); // 리포트 뷰어 열기)
			});
		});
	};

	/**
	 * 검수확인서 출력
	 * @param eventRow
	 */
	const onClickPrintMasterList = (eventRow: any[]) => {
		// 리스트 로직 구현

		const params = {
			// ...eventRow[0],
			reqList: eventRow,
		};

		showConfirm(null, '검수확인서를 출력 하시겠습니까?', () => {
			apiGetPrintData(params).then(res => {
				let data = res.data;

				// data가 비어있으면 기본값 추가
				if (!data || data.length === 0) {
					data = [
						{
							dcname: eventRow[0].dcname,
							fromCustname: eventRow[0].fromcustname,
							slipdt: eventRow[0].slipdt,
							skuname: '미입고 상품이 없습니다.',
						},
					];
				}

				//rd리포트 호출
				if (res.statusCode > -1) {
					viewRdReportMaster(data); // 리포트 뷰어 열기)
				}
			});
		});
	};

	/**
	 * 리포트 뷰어 열기
	 * @param {any} res API 응답 데이터
	 */
	const viewRdReportMaster = (res: any) => {
		// 1. 리포트 파일명
		const fileName = 'KP_DpInspect_Daily.mrd';

		// 2. 리포트에 XML 생성을 위한 DataSet 생성
		const dataSet = {
			ds_reportHeader: res, // 헤더 정보
		};

		// 3. 리포트에 전송할 파라미터
		const params = {
			// TITLE: '검수확인서(일배)', // 리포트 타이틀
		};

		reportUtil.openAgentReportViewer(fileName, dataSet, params);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	let prevRowIndex: any = null;
	useEffect(() => {
		const gridRefCur = ref.gridRef1.current;

		// 그룹 코드 그리드 행 변경 시
		gridRefCur.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell.rowIndex === prevRowIndex) return;

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell.rowIndex;

			searchDtl(event.primeCell.rowIndex);
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef1.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);
			searchDtl(0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef1?.current?.resize?.('100%', '100%');
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
							<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')}></GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef1} columnLayout={getGridCol1()} gridProps={getGridProps1()} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn2} gridTitle={t('lbl.DETAIL')}>
								{/* </div> */}
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef2} columnLayout={getGridCol2()} gridProps={getGridProps2()} />
						</GridAutoHeight>
					</>,
				]}
			/>

			<AGrid className={'dp-none'}>
				<AUIGrid ref={ref.gridRef3} columnLayout={gridCol3} gridProps={gridProps3} footerLayout={footerLayout3} />
			</AGrid>
		</>
	);
});

export default KpDpInspectMonitoringDetail;
