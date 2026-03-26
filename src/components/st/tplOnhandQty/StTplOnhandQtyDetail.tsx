/*
  ############################################################################
 # FiledataField	: StTplOnhandQtyDetail.tsx
 # Description		: 정산 > 위탁물류 >  위탁재고확인
 # Author			: ParkYoSep
 # Since			: 2025.11.17
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// Redux
// API Call Function
import { getCommonCodeList } from '@/store/core/comCodeStore';
const StTplOnhandQtyDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { savePrintList } = props;
	const { t } = useTranslation();
	const refModal = useRef(null);

	// Declare react Ref(2/4)

	// Declare init value(3/4)

	// 기타(4/4)
	const getCustomCommonCodeList = (owIndex: any, columnIndex: any, value: any) => {
		const list = getCommonCodeList('EXDC_INOUT_TYPE', '전체').filter(
			(item: any) => !['DP_STO', 'WD_STO'].includes(item.comCd),
		);
		// const convert = list.map(item => ({
		// 	...item,
		// 	display: item.comCd && item.comCd !== 'STD' ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
		// }));
		// let result = null;
		// if (!commUtil.isEmpty(convert)) {
		// 	result = convert.find((el: any) => {
		// 		if (el.comCd === value) {
		// 			return el;
		// 		}
		// 	});
		// }
		// return result ? result.display : null;
		return list.find((el: any) => el.comCd === value)?.cdNm || value;
	};
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 저장로직
	 * @returns
	 */
	const saveMaster = () => {
		{
		}
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================
	//getCommonCodeList('EXDC_INOUT_TYPE', '전체')
	// 그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.TPLUSER') /*입출고일자*/,
			dataField: 'tplUser',
			dataType: 'code',
			width: 90,
		},
		{
			headerText: t('lbl.STOCKTYPE') /*재고위치*/,
			children: [
				{ headerText: t('lbl.CODE'), /*코드*/ dataField: 'stocktype', dataType: 'code', editable: false, width: 80 },
				{
					headerText: t('lbl.DESCR'),
					/*명칭*/ dataField: 'stocktypenm',
					dataType: 'string',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.STOCKGRADE') /*재고속성*/,
			children: [
				{
					headerText: t('lbl.CODE'),
					/*코드*/ dataField: 'stockgrade',
					dataType: 'code',
					editable: false,
				},
				{
					headerText: t('lbl.DESCR'),
					/*명칭*/ dataField: 'stockgradedesc',
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.SKUINFO') /*상품정보*/,
			children: [
				{
					headerText: t('lbl.SKU'),
					/*상품코드*/ dataField: 'sku',
					dataType: 'code',
					editable: false,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.current.openPopup(e.item, 'sku');
						},
					},
				},
				{
					headerText: t('lbl.SKUNM'),
					/*상품명*/ dataField: 'skuNm',
					dataType: 'string',
					width: 250,
				},
			],
		},
		{ dataField: 'uom', headerText: t('lbl.UOM'), dataType: 'code' },
		{ dataField: 'qty', headerText: t('lbl.QTY'), dataType: 'numeric' },
		{
			dataField: 'boxqty',
			headerText: t('lbl.BOXQTY'), //박스수량
			dataType: 'numeric',
		},
		{
			dataField: 'deliverydate',
			headerText: t('lbl.DOCDT_DP'),
			dataType: 'date',
			width: 120,
			formatString: 'yyyy-mm-dd',
		},
		{
			dataField: 'convserialno',
			headerText: t('lbl.BLNO'), // b/l 번호
			dataType: 'string',
			width: 120,
		},
		{
			dataField: 'serialNo',
			headerText: t('lbl.SERIALNO'), // 이력번호
			dataType: 'string',
			width: 180,
		},

		// { dataField: 'requestNo', headerText: t('lbl.REQUESTNO'), dataType: 'string', width: 100 },

		{
			dataField: 'durationRate',
			headerText: t('lbl.USEBYDATE_FREE_RT'),
			dataType: 'code',
			width: 120,
			formatString: '#,##0',
		},
		// {
		// 	dataField: 'lot',
		// 	headerText: t('lbl.MANUFACTUREDT'),
		// 	width: 120,
		// 	dataType: 'date',
		// 	formatString: 'yyyy-mm-dd',
		// },
		//{ dataField: 'lottable01', headerText: '기준일자', width: 80, editable: false },

		{
			dataField: 'duration',
			headerText: t('lbl.BASEDT'),
			width: 120,
			dataType: 'code',
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATIONTERM'),
			dataType: 'code',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// selectionMode: 'multipleRows', // 다중 행 선택 모드
		exportToXlsxGridCustom: () => {
			const params = {
				drmUseYn: 'N', // DRM 해제
			};
			ref.current?.exportToXlsxGrid(params);
		},
	};

	const excelDownload = () => {};

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelDownload', //엑셀다운로드
				callBackFn: excelDownload,
			},
			{
				// 출력
				btnType: 'btn1',
				callBackFn: () => {
					savePrintList();
				},
			},
		],
	};

	/*** =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);
		}
		if (props.data.length > 0) {
			const colSizeList = gridRef.getFitColumnSizeList(true);

			gridRef.setColumnSizeList(colSizeList);
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt}></GridTopBtn>
				<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CmSearchWrapper ref={refModal} />
		</>
	);
});
export default StTplOnhandQtyDetail;
