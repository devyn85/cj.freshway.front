/*
 ############################################################################
 # FiledataField	: StStockLabelDetail.tsx
 # Description		: 재고 > 재고현황 > 재고라벨출력(Detail)
 # Author			: sss
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
import { showAlert } from '@/util/MessageUtil';
// Redux
import reportUtil from '@/util/reportUtil';
// API Call Function

const StStockLabelDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form } = props; // Antd Form
	const refModal = useRef(null);

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
	 * 출력 - 일반재고라벨 / 이력상품재고라벨  => 각각 출력(양식다름)
	 */
	const printMasterList = () => {
		const gridRef = ref.gridRef.current; // 마스터 그리드

		// 1. 체크된 데이터
		const list = gridRef.getGridData().filter((row: any) => row.printyn === '1');

		// 2. 체크된 데이터 확인
		if (list.length === 0) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 추후 로직 필요하면 주석 제거
		// // printedqty가 0인 행이 있는지 체크
		// const hasZeroPrintedQty = checkedRows.some((row: any) => {
		// 	const printedQty = Number(row.printedqty) || 0;
		// 	return printedQty <= 0;
		// });

		// if (hasZeroPrintedQty) {
		// 	showAlert(null, t('msg.MSG_COM_VAL_022', [t('lbl.PRINTQTY')])); // {{출력수량}}이/가 없습니다.
		// 	return;
		// }

		// 3. 체크된 데이터를 담는다.
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			//showConfirm(null, t('msg.MSG_COM_CFM_020', [t('lbl.PRINT')]), async () => {
			// CJFWDP3	입고라벨(소)
			const labelData = list
				.filter((row: any) => Number(row.printedqty) > 0 && row.serialyn === 'N') // 0 보다 크고 serialyn이 'N'인 것만
				.flatMap((row: any) => {
					const printedQty = Number(row.printedqty);
					const strLottable01 =
						row.lottable01 && row.lottable01 !== 'STD'
							? `${row.lottable01?.substring(0, 4)}-${row.lottable01?.substring(4, 6)}-${row.lottable01?.substring(
									6,
									8,
							  )}`
							: 'STD';
					const barcode = `B${row.lblSku}-${row.lottable01}B`;

					// printedQty 갯수만큼 동일한 row를 복제
					return Array(printedQty)
						.fill(null)
						.map(() => ({
							custkey: row.lblCustkey, // 01. 거래처코드
							slipdt: row.lblSlipdt, // 02. 전표일자
							custname: row.lblCustname, // 03. 거래처명
							sku: row.lblSku, // 04. 상품코드
							qtyperbox: row.lblQtyperbox, // 05. 입수량
							placeoforigin: row.lblPlaceoforigin, // 06. 원산지
							skuname1: row.lblSkuname1, // 07. 상품명1
							skuname2: row.lblSkuname2, // 08. 상품명2
							title: row.lblTitle, // 09. 상단타이틀
							lottable01: strLottable01, // 10. 유통기한
							barcode: barcode, // 11. 바코드
						}));
				});

			// CJFWDP2	입고라벨(축육)
			const labelData1 = list
				.filter((row: any) => Number(row.printedqty) > 0 && row.serialyn === 'Y') // 0 보다 크고 serialyn이 'Y'인 것만
				.flatMap((row: any) => {
					const printedQty = Number(row.printedqty);

					// printedQty 갯수만큼 동일한 row를 복제
					return Array(printedQty)
						.fill(null)
						.map(() => ({
							sku: row.lblSku, // 01. 상품코드
							weight: row.lblWeight, // 02. 중량
							skuname1: row.lblSkuname1, // 03. 상품명1
							skuname2: row.lblSkuname2, // 04. 상품명2
							serialno: row.lblSerialno, // 05. 유통이력번호
							barcode: row.lblStockid, // 06. 바코드
							lottable01: row.lblLottable01, // 07. 유통기한
							convertlot: row.lblConvertlot, // 08. 도축일
							qtyperbox: row.lblQtyperbox, // 09. 입수량
							placeoforigin: row.lblPlaceoforigin, // 10. 원산지
							storagetype: row.lblStoragetype, // 11. 저장조건
						}));
				});

			if (labelData.length === 0 && labelData1.length === 0) {
				showAlert(null, t('msg.noPrintData')); // 인쇄할 데이터가 없습니다.
				return;
			}

			/* 4,5,6번을 세트로 배열에 담아준다. */
			/* 임시로 지정된 라벨 : row.serialyn === 'N' , 입고라벨(축육) : row.serialyn === 'Y' 
				 둘 중에 하나가 출력되는 구조다.
			*/

			// 4. 라벨 파일명
			const fileName: string[] = ['DP_Label_CJFWDP3.mrd', 'DP_Label_CJFWDP2.mrd'];

			// 5. 라벨 데이터 XML 생성을 위한 DataSet 생성
			const dataSet = [labelData, labelData1];

			// 6. 라벨 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
			const labelId: string[] = ['CJFWDP3', 'CJFWDP2'];

			// 7. 라벨 출력 (바로인쇄 or 미리보기)
			reportUtil.openLabelReportViewer(fileName, dataSet, labelId);
		});
	};

	/**
	 * 출력 - 상품라벨지  => 모두 출력
	 */
	const printMasterList2 = () => {
		const gridRef = ref.gridRef.current; // 마스터 그리드

		// 1. 체크된 데이터
		const list = gridRef.getGridData().filter((row: any) => row.printyn === '1');

		// 2. 체크된 데이터 확인
		if (list.length === 0) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 추후 로직 필요하면 주석 제거
		// // printedqty가 0인 행이 있는지 체크
		// const hasZeroPrintedQty = checkedRows.some((row: any) => {
		// 	const printedQty = Number(row.printedqty) || 0;
		// 	return printedQty <= 0;
		// });

		// if (hasZeroPrintedQty) {
		// 	showAlert(null, t('msg.MSG_COM_VAL_022', [t('lbl.PRINTQTY')])); // {{출력수량}}이/가 없습니다.
		// 	return;
		// }

		// 3. 체크된 데이터를 담는다.
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			//showConfirm(null, t('msg.MSG_COM_CFM_020', [t('lbl.PRINT')]), async () => {
			// CJFWDP3	입고라벨(소)
			const labelData = list
				.filter((row: any) => Number(row.printedqty) > 0) // 0 보다 큰거
				.flatMap((row: any) => {
					const printedQty = Number(row.printedqty);
					const strLottable01 =
						row.lottable01 && row.lottable01 !== 'STD'
							? `${row.lottable01?.substring(0, 4)}-${row.lottable01?.substring(4, 6)}-${row.lottable01?.substring(
									6,
									8,
							  )}`
							: 'STD';
					const barcode = `B${row.lblSku}-${row.lottable01}B`;

					// printedQty 갯수만큼 동일한 row를 복제
					return Array(printedQty)
						.fill(null)
						.map(() => ({
							loc: row.loc, // 01. 로케이션
							sku: row.lblSku, // 02. 상품코드
							skuname1: row.lblSkuname1, // 03. 상품명1
							skuname2: row.lblSkuname2, // 04. 상품명2
							qty: row.lblQtyperbox, // 05 .입수
							unit: row.uom, // 06 .출고단위
							storagetype: row.storagetype, // 07. 저장조건
							flag: row.flag, // 08. 화살표 구분자(U:끝에 2자리가 02 이상인 경우, D:U에 미해당)
						}));
				});

			if (labelData.length === 0) {
				showAlert(null, t('msg.noPrintData')); // 인쇄할 데이터가 없습니다.
				return;
			}

			/* 4,5,6번을 세트로 배열에 담아준다. */
			/* 임시로 지정된 라벨 : row.serialyn === 'N' , 입고라벨(축육) : row.serialyn === 'Y' 
				 둘 중에 하나가 출력되는 구조다.
			*/

			// 4. 라벨 파일명
			const fileName: string[] = ['ST_Label_CJFWST1.mrd'];

			// 5. 라벨 데이터 XML 생성을 위한 DataSet 생성
			const dataSet = [labelData];

			// 6. 라벨 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
			const labelId: string[] = ['CJFWST1'];

			// 7. 라벨 출력 (바로인쇄 or 미리보기)
			reportUtil.openLabelReportViewer(fileName, dataSet, labelId);
		});
	};

	/**
	 * 리포트 뷰어 열기
	 * @param {any} res API 응답 데이터
	 */
	// const viewRdReportMaster = (res: any) => {
	// 	//console.log('viewRdReportMaster start');

	// 	if (!res.data.reportList || res.data.reportList.length < 1) {
	// 		showAlert(null, t('msg.noQueriedData')); // 조회된 데이터가 없습니다.
	// 		return;
	// 	}

	// 	// 이력라벨 데이터셋 테스트 데이터(임시)
	// 	const ds_report2 = [{
	// 		weight: '2.5KG',
	// 		sku: '256914',
	// 		barcode: 'S0000428487S',
	// 		skuname1: '이삭푸드 생등심',
	// 		skuname2: '(최고당돈까스용 NEW_박스단위발주 2.5Kg/EA)',
	// 		qtyperbox: '2EA/BOX',
	// 		placeoforigin: '(한국)',
	// 		convertlot: '2025/08/08',
	// 		storagetype: '<냉장>',
	// 		lottable01: '2024/04/24',
	// 		serialno: 'L12403299195304',
	// 	}];

	// 	// 1. 리포트 파일명
	// 	const fileName: string[] = ['DP_Label_CJFWDP3.mrd', 'DP_Label_CJFWDP2.mrd'];

	// 	// 2. 리포트에 XML 생성을 위한 DataSet 생성
	// 	const dataSet = [
	// 		res.data.reportList,
	// 		ds_report2,
	// 	];

	// 	// 3. 리포트 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
	// 	const labelId: string[] = ['CJFWDP3', 'CJFWDP2'];

	// 	/*
	// 	2025.08.08 김동한 라벨 관련 파라미터는 배열로 변경
	// 	*/
	// 	reportUtil.openLabelReportViewer(fileName, dataSet, labelId);
	// };
	/**
	 * 팝업 취소 버튼
	 */
	const closeEventRdReport = () => {
		refModal.current.handlerClose();
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼 정의
	const gridCol = [
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code', editable: false }, // 물류센터
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), dataType: 'code', editable: false }, // 조직
		{ dataField: 'stocktype', headerText: t('lbl.STOCKTYPE'), dataType: 'code', editable: false }, // 재고위치
		{ dataField: 'stockgrade', headerText: t('lbl.STOCKGRADE'), dataType: 'code', editable: false }, // 재고속성
		{ dataField: 'zone', headerText: t('lbl.ZONE'), dataType: 'code', editable: false }, // 존
		{ dataField: 'loc', headerText: t('lbl.LOC'), dataType: 'code', editable: false }, // 로케이션
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			width: 80,
			editable: false,
			filter: { showIcon: true },
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(e.item, 'sku');
				},
			},
		}, // 상품코드
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			width: 120,
			editable: false,
			dataType: 'name',
			filter: { showIcon: true },
		}, // 상품명
		{
			dataField: 'printyn',
			headerText: t('lbl.PRINTYN'),
			width: 80,
			style: 'center',
			commRenderer: {
				type: 'checkBox',
			},
		}, // 출력여부
		{ dataField: 'printedqty', headerText: t('lbl.LABELPRINTEDQTY'), dataType: 'numeric' }, // 라벨출력수량

		{ dataField: 'storagetype', headerText: t('lbl.STORAGETYPE'), dataType: 'code', editable: false }, // 저장조건
		{
			headerText: t('lbl.CURRENT_STOCK'), // 현재고
			editable: false,
			children: [
				{
					dataField: 'qty1',
					headerText: t('lbl.QTY'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					disableMoving: true,
				}, // 수량1
				{ dataField: 'uom1', headerText: t('lbl.UOM'), dataType: 'code', editable: false, disableMoving: true }, // 단위1
				{
					dataField: 'qty2',
					headerText: t('lbl.QTY'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					disableMoving: true,
				}, // 수량2
				{ dataField: 'uom2', headerText: t('lbl.UOM'), dataType: 'code', editable: false, disableMoving: true }, // 단위2
			],
		},
		{
			headerText: t('lbl.STOCK_INFO'), // 재고정보
			editable: false,
			children: [
				{ dataField: 'uom', headerText: t('lbl.UOM_ST'), dataType: 'numeric', editable: false, disableMoving: true }, // 재고단위
				{
					dataField: 'qty',
					headerText: t('lbl.QTY_ST'),
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
					disableMoving: true,
				}, // 재고수량
				{
					dataField: 'openqty',
					headerText: t('lbl.OPENQTY_ST'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					disableMoving: true,
				}, // 가용수량
				{
					dataField: 'qtyallocated',
					headerText: t('lbl.QTYALLOCATED_ST'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					disableMoving: true,
				}, // 할당수량
				{
					dataField: 'qtypicked',
					headerText: t('lbl.QTYPICKED_ST'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: false,
					disableMoving: true,
				}, // 피킹수량
			],
		},

		{
			headerText: t('lbl.NEARDURATIONYN'),
			dataField: 'neardurationyn',
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 소비기한임박여부
		//
		// START.제조일자/소비일자/유효기간/소비기한잔여(%)
		{
			headerText: t('lbl.MANUFACTUREDT'),
			dataField: 'manufacturedt',
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 제조일자
		{
			headerText: t('lbl.EXPIREDT'),
			dataField: 'expiredt',
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 소비일자
		{
			headerText: t('lbl.DURATION_TERM'),
			dataField: 'durationTerm',
			dataType: 'code',
			editable: false,
			formatString: 'yyyy-mm-dd',
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 유효기간-소비기간(잔여/전체)
		{
			headerText: t('lbl.USEBYDATE_FREE_RT'), // 소비기한잔여(%)
			dataField: 'usebydatefreert',
			dataType: 'code',
			editable: false,
			formatString: '#,##0',
		}, // 소비기한잔여(%)
		// END.제조일자/소비일자/유효기간/소비기한잔여(%)
		//

		{
			headerText: t('lbl.SERIALINFO'), // 이력정보
			editable: false,
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'),
					dataType: 'code',
					editable: false,
					disableMoving: true,
				}, // 이력번호
				{
					dataField: 'lblStockid',
					headerText: t('lbl.STOCKID'),
					dataType: 'code',
					editable: false,
					disableMoving: true,
				}, // 재고ID
			],
		},
		// hidden
		{ dataField: 'serialyn', headerText: t('lbl.SERIALYN'), visible: false }, // 이력유무(hidden)
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: false,
		//independentAllCheckBox: true,
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
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'dccode',
		},
		{
			dataField: 'printedqty',
			positionField: 'printedqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 라벨출력수량 합계
		{ dataField: 'qty_1', positionField: 'qty_1', operation: 'SUM', formatString: '#,##0.###', style: 'right' }, // 수량1 합계
		{ dataField: 'qty_2', positionField: 'qty_2', operation: 'SUM', formatString: '#,##0.###', style: 'right' }, // 수량2 합계
		{ dataField: 'qty', positionField: 'qty', operation: 'SUM', formatString: '#,##0.###' }, // 재고수량 합계
		{ dataField: 'openqty', positionField: 'openqty', operation: 'SUM', formatString: '#,##0.###', style: 'right' }, // 가용수량 합계
		{
			dataField: 'qtyallocated',
			positionField: 'qtyallocated',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 할당수량 합계
		{ dataField: 'qtypicked', positionField: 'qtypicked', operation: 'SUM', formatString: '#,##0.###', style: 'right' }, // 피킹수량 합계
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'print', // 프린트
				btnLabel: '재고라벨인쇄',
				callBackFn: printMasterList,
			},
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: '상품라벨인쇄',
				callBackFn: printMasterList2,
			},
		],
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

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	useEffect(() => {
		//
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});
export default StStockLabelDetail;
