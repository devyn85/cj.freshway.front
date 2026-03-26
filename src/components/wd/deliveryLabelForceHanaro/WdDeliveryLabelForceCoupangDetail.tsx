/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelForceCoupangDetail.tsx
 # Description		: 이력상품출고현황(Detail)
 # Author			: 공두경
 # Since			: 25.07.14
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
import { Button } from 'antd';
// Utils
// API Call Function
import { apiSaveInvoiceNoPrtYn } from '@/api/wd/apiWdDeliveryLabelSN';

const WdDeliveryLabelForceCoupangDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 인쇄
	 */
	const onPrint = () => {
		// 1. 체크된 데이터
		const list = ref.gridRef.current.getCheckedRowItemsAll();

		// 2. 체크된 데이터 확인
		if (list.length === 0) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 3. 체크된 데이터를 담는다.
		const labelData: any[] = [];
		// 인쇄 를/을 처리하시겠습니까?
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			//showConfirm(null, t('msg.MSG_COM_CFM_020', [t('lbl.PRINT')]), async () => {
			let strInvoiceNo_prt = '';
			for (const row of list) {
				if (commUtil.isEmpty(row.lblBarcode1)) {
					showAlert(null, t('바코드1 정보가 없는경우 출력을 진행할 수 없습니다.'));
					return;
				}
				// CJFWWD16	배송분류표라벨(하나로마트전용)_20230620
				labelData.push({
					sku: row.lblSku, // 1.  상품코드
					custname1: row.lblCustname1, // 2.  납품처명
					deliverydt: row.lblDeliverydt, // 3.  배송일자
					skuname1: row.lblSkuname1, // 4.  상품명1
					skuname2: row.lblSkuname2, // 5.  상품명2
					custname2: row.lblCustname2, // 6.  납품처명
					stock_lottable01: row.lblStockLottable01, // 7. 유통기한
					eabarcodetxt: row.lblEabarcode, // 8. 유통기한
					boxbarcode: row.lblBoxbarcode, // 9.  BOX 바코드
					boxbarcodetxt: row.lblBoxbarcode, // 10.  BOX 바코드 텍스트
				});
				// INVOICE번호 출력여부 저장을 위한 INVOICE번호 셋팅
				if (strInvoiceNo_prt.length > 0) strInvoiceNo_prt += ',';
				strInvoiceNo_prt += row.lblBarcode1;
			}

			if (labelData.length === 0) {
				showAlert(null, t('msg.noPrintData')); // 인쇄할 데이터가 없습니다.
				return;
			}
			const params = {
				invoiceNoPrint: strInvoiceNo_prt,
			};

			apiSaveInvoiceNoPrtYn(params).then(res => {
				// 정상처리
			});

			// 4. 리포트 파일명
			const fileName: string[] = ['WD_Label_CJFWWD18.mrd'];

			// 5. 라벨 데이터 XML 생성을 위한 DataSet 생성
			const dataSet = [labelData];

			// 6. 라벨 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
			const labelId: string[] = ['CJFWWD18'];

			// 7. 라벨 출력 (바로인쇄 or 미리보기)
			reportUtil.openLabelReportViewer(fileName, dataSet, labelId);
		});
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			headerText: '관리처코드',
			dataField: 'toCustkey',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.toCustkey,
						},
						'cust',
					);
				},
			},
		},
		{
			headerText: '납품처명1',
			dataField: 'lblCustname1',
			filter: {
				showIcon: true,
			},
		},
		{ headerText: '입수량', dataField: 'lblCustname2' },
		{
			headerText: '상품코드',
			dataField: 'lblSku',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							sku: e.item.lblSku,
						},
						'sku',
					);
				},
			},
		},
		{
			headerText: '상품명1',
			dataField: 'lblSkuname1',
			filter: {
				showIcon: true,
			},
		},
		{ headerText: '상품명2', dataField: 'lblSkuname2' },
		{ headerText: '수량', dataField: 'lblQty', dataType: 'code' },
		{ headerText: '차량번호', dataField: 'lblPageno1', dataType: 'code' },
		{ headerText: '출차조', dataField: 'lblCargroup', dataType: 'code' },
		{ headerText: 'POP', dataField: 'lblDeliverygroup', dataType: 'code' },
		{ headerText: 'POP2', dataField: 'lblDeliverygroupChg', dataType: 'code' },
		{ headerText: '로케이션', dataField: 'lblLoc', dataType: 'code' },
		{ headerText: '저장조건', dataField: 'lblStoragetype', dataType: 'code' },
		{ headerText: '배송일자', dataField: 'lblDeliverydt', dataType: 'date' },
		{ headerText: '페이지번호', dataField: 'lblPageno2', dataType: 'code' },
		{ headerText: '바코드1', dataField: 'lblBarcode1', dataType: 'code' },
		{ headerText: '박스바코드', dataField: 'lblBoxbarcode', dataType: 'code' },
		{ headerText: 'EA바코드', dataField: 'lblEabarcode', dataType: 'code' },
		{ headerText: '유통기한', dataField: 'lblStockLottable01', dataType: 'code' },
		{ headerText: '피킹번호', dataField: 'pickNo', dataType: 'code' },
		{ headerText: '대배치키', dataField: 'pickBatchNo', dataType: 'code' },
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props
	const footerLayout = [{}];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelUpload',
				callBackFn: () => {
					const g = ref.gridRef.current;
					if (!g) return;
					g.clearGridData();
				},
			},
		],
	};

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
			}
		}
	}, [props.data]);

	useEffect(() => {
		ref.gridRef.current.bind('addRow', function (event: any) {
			// event.type: 'add', 'remove', 'update' 등
			// event.items: 변경된 행 데이터 배열
			// event.rowIndex: 변경된 행 인덱스(단일 행일 때)

			ref.gridRef.current.resetUpdatedItems();
		});
	}, []);

	return (
		<>
			{/* 그리드 영역 */}

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle="분류표출력" totalCnt={props.totalCnt}>
					<Button onClick={onPrint}>{'인쇄'}</Button>
				</GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default WdDeliveryLabelForceCoupangDetail;
