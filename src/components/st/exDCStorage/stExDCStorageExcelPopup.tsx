/*
 ############################################################################
 # FiledataField	: StExDCStorageExcelPopup.tsx
 # Description		: 외부창고정산 - 엑셀 업로드 팝업
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.10.20
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils
import fileUtil from '@/util/fileUtils';
import { showAlert } from '@/util/MessageUtil';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store

// API Call Function
import { apiPostSaveExcelList, apiPostValidateExcel } from '@/api/st/apiStExDCStorage';

interface PropsType {
	close?: any;
	dccode?: string;
	closemonth?: any;
}

const StExDCStorageExcelPopupPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, dccode, closemonth } = props;

	// 다국어
	const { t } = useTranslation();

	// 그리드 Ref
	const gridRef = useRef(null);

	// 업로드 파일 Ref
	const excelUploadFileRef = useRef(null);

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
		},
		{
			dataField: 'skuNm',
			headerText: t('lbl.SKUNM'), //상품명
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'quantity',
			headerText: t('lbl.QCCONFIRMQTY_RT'), //처리수량
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'currstock',
			headerText: t('lbl.QTY_ST'), //현재고수량
			dataType: 'numeric',
			editable: false,
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
			editable: false,
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
			headerText: t('lbl.BLNO'), //선하증권번호
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
			headerText: t('lbl.STOCKID'), //개체식별/유통이력
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
			editable: false,
		},
		{
			dataField: 'giAmount',
			headerText: t('lbl.WD_PRICE'), //출고료
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'stockAmount',
			headerText: t('lbl.STORAGEPRICE'), //창고료
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'wghprice',
			headerText: t('lbl.WGHPRICE'), //계근료
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'workAmount',
			headerText: t('lbl.WORK_AMOUNT'), //작업료
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'palletprice',
			headerText: t('lbl.PLT_COST'), //PLT비용
			dataType: 'numeric',
			editable: false,
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
		},
		{
			dataField: 'giprice',
			headerText: t('lbl.WD_CHARGE'), //출고수수료
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'storageprice',
			headerText: t('lbl.STORAGE_CHARGE'), //창고료
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'wghFee',
			headerText: t('lbl.WGH_FEE'), //계근수수료
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'workFee',
			headerText: t('lbl.WORK_FEE'), //작업수수료
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'palletFee',
			headerText: t('lbl.PALLET_FEE'), //PLT수수료
			dataType: 'numeric',
			editable: false,
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
			dataField: 'processflag',
			headerText: 'PROCESSFLAG',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'processmsg',
			headerText: 'PROCESSMSG',
			dataType: 'string',
			editable: false,
		},
	];

	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/*
	 * 엑셀 양식 다운로드
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: '보관료비용정산_양식.xlsx',
		};

		fileUtil.downloadFile(params);
	};

	/**
	 * 엑셀 업로드 버튼 클릭
	 */
	const onClickUploadExcel = () => {
		excelUploadFileRef.current.click();
	};

	/**
	 * 엑셀 업로드 파일 변경 이벤트
	 * @param {object} e 이벤트
	 * @returns {void}
	 */
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, onDataCheckClick);
	};

	/**
	 * 유효성 검증
	 * @returns {void}
	 */
	const onDataCheckClick = () => {
		// 변경 데이터 확인
		const checkedItems = gridRef.current.getGridData();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
				return;
			});
		} else if (gridRef.current.validateRequiredGridData()) {
			gridRef.current.clearGridData();

			const params = {
				dccode: props.dccode,
				closemonth: props.closemonth,
				saveList: checkedItems,
			};
			apiPostValidateExcel(params).then((res: any) => {
				if (res.status == 200) {
					gridRef.current?.addRow(res.data.data);

					// 칼럼 사이즈 재조정
					const colSizeList = gridRef.current?.getFitColumnSizeList(true);
					gridRef.current?.setColumnSizeList(colSizeList);
				}
			});
		}
	};

	/**
	 * 그리드에서 변경된 데이터를 확인하고, 유효성 검사를 거쳐 저장을 진행합니다.
	 * 저장 후 재 조회 실행.
	 */
	const saveMasterList = async () => {
		gridRef.current.showConfirmSave(() => {
			const checkedItems = gridRef.current.getChangedData({ validationYn: false });

			if (!checkedItems || checkedItems.length < 1) {
				showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
					return;
				});
			} else if (gridRef.current.validateRequiredGridData()) {
				gridRef.current.clearGridData();

				const params = {
					fixdccode: props.dccode,
					saveList: checkedItems,
				};

				apiPostSaveExcelList(params).then(res => {
					gridRef.current.setGridData(res.data);

					// 칼럼 사이즈 재조정
					const colSizeList = gridRef.current?.getFitColumnSizeList(true);
					gridRef.current?.setColumnSizeList(colSizeList);
				});
			}
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'excelForm', // 엑셀다운로드
			// },
			{
				btnType: 'excelSelect', // 엑셀선택
				isActionEvent: false,
				callBackFn: () => {
					onClickUploadExcel();
				},
			},
			{
				btnType: 'save',
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */
	/**
	 * 초기화
	 * @param e
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="보관료/비용 정산 엑셀 업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '}>
					<Button onClick={onExcelDownload}>{t('lbl.EXCELFORM')}</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
			</ButtonWrap>

			{/* 엑셀 파일 업로드 INPUT 영역 */}
			<input
				ref={excelUploadFileRef}
				id="excelUploadInput"
				type="file"
				onChange={onFileChange}
				onClick={(e: any) => {
					e.target.value = null;
				}}
				style={{ display: 'none' }}
			/>
		</>
	);
};

export default StExDCStorageExcelPopupPopup;
