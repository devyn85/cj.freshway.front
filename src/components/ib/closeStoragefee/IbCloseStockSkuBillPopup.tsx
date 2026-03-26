/*
 ############################################################################
 # FiledataField	: MsExdcRateUploadExcelPopup.tsx
 # Description		:  엑셀 업로드 예제 팝업
 # Author			: Canal Frame
 # Since			: 25.05.09
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// utils

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';

// API

const IbCloseStockSkuBillPopup = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;

	// 다국어
	const { t } = useTranslation();

	const gridRef = useRef(null);
	const [avgChk, setAvgChk] = useState(false);
	const [gridData, setGridData] = useState([]);
	const gridProps = {
		// editable: true,
		// showRowCheckColumn: true,
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};
	/**
	 * 공통 코드 호출([comCd]cdNm)
	 * @param owIndex
	 * @param columnIndex
	 * @param rowIndex
	 * @param colIndex
	 * @param value
	 * @param headerText
	 * @param item
	 * @returns
	 */
	const getCustomCommonCodeList = (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
		const list = getCommonCodeList('SUPPLY_DC');
		// //console.log(item);
		const convert = list.map(item => ({
			...item,
			display: item.comCd && item.comCd !== 'STD' ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
		}));
		let result = null;
		if (!commUtil.isEmpty(convert)) {
			result = convert.find((el: any) => {
				if (el.comCd === value) {
					return el;
				}
			});
		}
		return result ? result.display : null;
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// 기존 gridCol에 에러 컬럼 추가
	const extendedGridCol = [
		{ dataField: 'dcCode', headerText: '물류센터', dataType: 'code', labelFunction: getCustomCommonCodeList },
		{ dataField: 'storageLoc', headerText: '저장위치', dataType: 'code' },
		{ dataField: 'sku', headerText: '상품코드', dataType: 'code' },
		{ dataField: 'orderQty', headerText: '수량', dataType: 'numeric' },
		{ dataField: 'uom', headerText: '단위', dataType: 'code' },
		{ dataField: 'convSerialNo', headerText: 'BL번호', dataType: 'string' },
		{ dataField: 'serialNo', headerText: '이력번호', dataType: 'string' },
		{ dataField: 'zebeln', headerText: '문서번호', dataType: 'string' },
		{ dataField: 'poLine', headerText: 'POLINE', dataType: 'string' },
		{ dataField: 'slipDt', headerText: '전기일자', dataType: 'date' },
		// { dataField: 'slipNo', headerText: '전표번호(ROWID)', dataType: 'string' },
		// { dataField: 'slipLine', headerText: '전표라인', dataType: 'string' },
		{ dataField: 'zwrbtrOut', headerText: '가정산금액', dataType: 'numeric' },
		{ dataField: 'zwrbtrIn', headerText: '송장금액', dataType: 'numeric' },
		{ dataField: 'wrbtr', headerText: '차이금액', dataType: 'numeric' },
		{ dataField: 'stockAmt', headerText: '재고금액', dataType: 'numeric' },
		{ dataField: 'price', headerText: '단가', dataType: 'numeric' },

		{ dataField: 'stockQty', headerText: 'SAP재고량', dataType: 'numeric' },
		{ dataField: 'stockAmtMsg', headerText: '재고금액메시지', dataType: 'string' },
		// { dataField: 'chkAmt', headerText: '타입', dataType: 'string' },
	];
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);

			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);
	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="마감내역" showButtons={false} />

			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={extendedGridCol} gridProps={gridProps} />
			</AGrid>
			<ButtonWrap data-props="single">
				<Button onClick={close}>닫기</Button>
			</ButtonWrap>
		</>
	);
};

export default IbCloseStockSkuBillPopup;
