/*
 ############################################################################
 # FiledataField	: MgModifyLogDetail1.tsx
 # Description		: 재고 > 재고현황 > 재고변경사유현황(Detail)
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
// Redux

// API Call Function

const StInoutResultDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, activeKeyMaster } = props; // Antd Form

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
	 * 출력 - 라벨지 - 요건에 의해 미사용
	 */
	const printMasterList = () => {
		let gridRef = ref.gridRef.current; // 마스터 그리드
		if (activeKeyMaster === '2') {
			gridRef = ref.gridRef1.current; // 마스터2 그리드
		}

		// printyn이 체크된 행들만 필터링
		const checkedRows = gridRef.getGridData().filter((row: any) => row.printyn === '1');

		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noRowSelect')); // 선택된 정보가 없습니다.
			return;
		}

		// printedqty가 0인 행이 있는지 체크
		const hasZeroPrintedQty = checkedRows.some((row: any) => {
			const printedQty = Number(row.printedqty) || 0;
			return printedQty <= 0;
		});

		if (hasZeroPrintedQty) {
			showAlert(null, t('msg.MSG_COM_VAL_200', [t('lbl.PRINTQTY')])); // {{출력수량}}이/가 없습니다.
			return;
		}

		// printedqty가 0보다 큰 행들만 필터링하고, printedQty 갯수만큼 row 복제
		const filteredRows = checkedRows.flatMap((row: any) => {
			const printedQty = Number(row.printedqty) || 0;
			const strLottable01 =
				row.toLottable01 && row.toLottable01 !== 'STD'
					? `${row.toLottable01?.substring(0, 4)}-${row.toLottable01?.substring(4, 6)}-${row.toLottable01?.substring(
							6,
							8,
					  )}`
					: 'STD';
			const barcode = `B${row.sku}-${row.toLottable01}B`;

			// printedQty 갯수만큼 동일한 row를 복제
			return Array(printedQty)
				.fill(null)
				.map(() => ({
					sku: row.lblSku, // 1. LBL_SKU
					skuname1: row.lblSkuname1, // 2. LBL_SKUNAME1
					skuname2: row.lblSkuname2, // 3. LBL_SKUNAME2
					custkey: row.lblCustkey, // 4. LBL_CUSTKEY
					custname: row.lblCustname, // 5. LBL_CUSTNAME
					lottable01: strLottable01, // 6. strLottable01
					barcode: barcode, // 7. BARCODE
					title: row.lblTitle, // 8. LBL_TITLE
				}));
		});

		// 필터링된 데이터를 리포트 형식으로 구성
		const res = {
			data: {
				reportList: filteredRows, // 필터링된 데이터를 reportList에 담기
			},
		};

		viewRdReportMaster(res); // 리포트 뷰어 열기
	};

	/**
	 * 리포트 뷰어 열기
	 * @param {any} res API 응답 데이터
	 */
	const viewRdReportMaster = (res: any) => {
		if (!res.data.reportList || res.data.reportList.length < 1) {
			showAlert(null, t('msg.noQueriedData')); // 조회된 데이터가 없습니다.
			return;
		}

		// 1. 리포트 파일명
		const fileName: string[] = ['DP_Label_CJFWDP3.mrd'];
		// 2. 리포트에 XML 생성을 위한 DataSet 생성
		const dataSet = [{ ds_report: res.data.reportList }];

		// 3. 리포트 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
		const labelId = ['CJFWDP3'];

		reportUtil.openLabelReportViewer(fileName, dataSet, labelId);
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		{ dataField: 'modifydate', headerText: t('lbl.MODIFYDATE'), dataType: 'date', editable: false }, // 변경일자
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code', editable: false }, // 물류센터코드
		{ dataField: 'modifytypename', headerText: t('lbl.MODIFYTYPE'), dataType: 'code', editable: false }, // 변경유형
		{ dataField: 'reasoncode', headerText: t('lbl.REASONCODE'), dataType: 'code', editable: false }, // 사유코드
		{ dataField: 'reasonmsg', headerText: t('lbl.REASONMSG'), dataType: 'code', editable: false }, // 사유메시지
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), dataType: 'code', editable: false }, // 조직
		{ dataField: 'serialynname', headerText: t('lbl.SERIALYN_ST'), dataType: 'code', editable: false }, // 이력유무
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			disableMoving: true,
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					dataType: 'code',
					filter: { showIcon: true },
					editable: false,
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
					dataType: 'name',
					editable: false,
					filter: { showIcon: true },
				}, // 상품명
			],
		},
		{ dataField: 'uom', headerText: t('lbl.UOM_ST'), dataType: 'code', editable: false }, // 단위
		{ dataField: 'qty', headerText: t('lbl.QTY'), dataType: 'numeric', editable: false }, // 수량
		// 요건.인쇄기능 미사용
		// {
		// 	dataField: 'printyn',
		// 	headerText: t('lbl.PRINTYN'),
		// 	width: 80,
		// 	style: 'center',
		// 	commRenderer: {
		// 		type: 'checkBox',
		// 	},
		// }, // 출력여부
		//{ dataField: 'printedqty', headerText: t('lbl.LABELPRINTEDQTY'), dataType: 'numeric', width: 120 }, // 라벨출력수량
		{
			headerText: t('lbl.FROMLOCLABEL'), // FROM로케이션
			disableMoving: true,
			children: [
				{ dataField: 'fromLoc', headerText: t('lbl.FROM_LOC'), dataType: 'code', editable: false }, // 출발로케이션
				{ dataField: 'fromLot', headerText: t('lbl.FROM_LOT'), dataType: 'code', editable: false }, // 출발LOT
				{ dataField: 'fromLottable01', headerText: t('lbl.LOTTABLE01'), dataType: 'code', editable: false }, // 출발속성1
				{ dataField: 'fromStockid', headerText: t('lbl.FROM_STOCKID'), dataType: 'code', editable: false }, // 출발재고ID
				{ dataField: 'fromStocktype', headerText: t('lbl.FROM_STOCKTYPE'), dataType: 'code', editable: false }, // 출발재고유형
				{ dataField: 'fromStockgrade', headerText: t('lbl.FROM_STOCKGRADE'), dataType: 'code', editable: false }, // 출발재고등급
			],
		},
		{
			headerText: t('lbl.TOLOCLABEL'), // TO로케이션
			disableMoving: true,
			children: [
				{ dataField: 'toLoc', headerText: t('lbl.TO_LOC'), dataType: 'code', editable: false }, // 도착로케이션
				{ dataField: 'toLot', headerText: t('lbl.TO_LOT'), dataType: 'code', editable: false }, // 도착LOT
				{ dataField: 'toLottable01', headerText: t('lbl.LOTTABLE01'), dataType: 'code', editable: false }, // 도착속성1
				{ dataField: 'toStockid', headerText: t('lbl.TO_STOCKID'), dataType: 'code', editable: false }, // 도착재고ID
				{ dataField: 'toStocktype', headerText: t('lbl.TO_STOCKTYPE'), dataType: 'code', editable: false }, // 도착재고유형
				{ dataField: 'toStockgrade', headerText: t('lbl.TO_STOCKGRADE'), dataType: 'code', editable: false }, // 도착재고등급
			],
		},
		{
			headerText: t('lbl.EDITERINFO'), // 수정자정보
			disableMoving: true,
			children: [
				{ dataField: 'editdate', headerText: t('lbl.EDITDATE'), dataType: 'code', editable: false }, // 수정일자
				{ dataField: 'editwho', headerText: t('lbl.EDITWHO'), dataType: 'code', editable: false }, // 수정자
				{ dataField: 'username', headerText: t('lbl.USERNAME'), dataType: 'code', editable: false }, // 사용자명
			],
		},
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
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},
		{ dataField: 'qty', positionField: 'qty', operation: 'SUM', formatString: '#,##0.##' },
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'print', // 프린트
			// 	callBackFn: printMasterList,
			// },
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
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle="상품LIST" totalCnt={props.totalCnt} />
				{/* 상품 LIST 그리드 */}
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});
export default StInoutResultDetail;
