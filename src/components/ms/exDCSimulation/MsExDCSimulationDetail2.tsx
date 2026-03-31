/*
 ############################################################################
 # FiledataField	: MsExDCSimulationDetail2.tsx
 # Description		: 외부창고정산 시뮬레이션 상품
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.23
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';

// Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';

// API
import { apiGetDataSelectSkuForMsExDcRate } from '@/api/ms/apiMsExDcRate';

interface Props {
	gridData: any;
	saveFn: any;
}

const MsExDCSimulationDetail2 = forwardRef((props: Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 그리드 ref
	ref.gridRef2 = useRef();

	// 그리드 컬럼 팝업용 Ref
	const refModal = useRef(null);

	// 조회 총 건수
	const [totalCount, setTotalCount] = useState(0);

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'sku',
			headerText: t('lbl.SKUCD'), //상품코드
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			required: true,
			commRenderer: {
				type: 'search',
				popupType: 'sku',
				searchDropdownProps: {
					dataFieldMap: {
						sku: 'code',
						skuname: 'name',
					},
					callbackBeforeUpdateRow: (e: any) => {
						const selectedIndex = ref.gridRef2?.current?.getSelectedIndex();
						getSkuSelectData(e.code, selectedIndex[0]);
					},
				},
				onClick: (e: any) => {
					const rowIndex = e.rowIndex;
					refModal.current.open({
						gridRef: ref.gridRef2,
						codeName: e.value,
						rowIndex,
						dataFieldMap: {
							sku: 'code',
							skuName: 'name',
						},
						onConfirm: (selectedRows: any[]) => {
							const dataFieldMap = {
								sku: 'code',
								skuName: 'name',
							};

							const rowData = selectedRows[0];
							const updateObj: Record<string, any> = {};
							Object.entries(dataFieldMap).forEach(([targetField, sourceField]) => {
								updateObj[targetField] = rowData[sourceField];
							});
							// 안전한 업데이트를 위해 next tick으로 밀기
							setTimeout(() => {
								getSkuSelectData(rowData.code, rowIndex);
								ref.gridRef2?.current?.updateRow(updateObj, rowIndex);
								refModal.current?.handlerClose();
							}, 0);
							ref.gridRef2?.current?.addCheckedRowsByIds(ref.gridRef2?.current?.indexToRowId(rowIndex));
						},
						popupType: 'sku',
					});
				},
			},
			editable: true,
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'), //상품명
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'), //단위
			dataType: 'code',
		},
		{
			dataField: 'storagetye',
			headerText: t('lbl.STORAGETYPE'), //저장조건
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STORAGETYPE', value)?.cdNm;
			},
		},
		{
			dataField: 'skuLdesc',
			headerText: t('lbl.CLASS_BIG'), //상품대분류
			dataType: 'code',
		},
		{
			dataField: 'grQty',
			headerText: t('lbl.DPQTY'), //입고량
			dataType: 'numeric',
			editable: true,
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowPoint: true,
				allowNegative: true,
				textAlign: 'right',
				autoThousandSeparator: true,
			},
		},
		{
			dataField: 'giQty',
			headerText: t('lbl.WDQTY'), //출고량
			dataType: 'numeric',
			editable: true,
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowPoint: true,
				allowNegative: true,
				textAlign: 'right',
				autoThousandSeparator: true,
			},
		},

		{
			headerText: '단가', //단가
			children: [
				{
					dataField: 'priceUom',
					headerText: t('lbl.UOM'), //단위
					dataType: 'code',
					required: true,
					renderer: {
						type: 'DropDownListRenderer',
						list: getCommonCodeList('UOM', ''),
						keyField: 'comCd',
						valueField: 'cdNm',
					},
				},
				{
					headerText: t('lbl.BASE'), //기준
					children: [
						{
							dataField: 'baseGrprice',
							headerText: t('lbl.DP_PRICE'), //입고료
							dataType: 'numeric',
							editable: true,
							editRenderer: {
								type: 'InputEditRenderer',
								showEditorBtnOver: false,
								onlyNumeric: true,
								allowPoint: true,
								allowNegative: false,
								textAlign: 'right',
								maxlength: 10,
								autoThousandSeparator: true,
							},
						},
						{
							dataField: 'baseGiprice',
							headerText: t('lbl.WD_PRICE'), //출고료
							dataType: 'numeric',
							editable: true,
							editRenderer: {
								type: 'InputEditRenderer',
								showEditorBtnOver: false,
								onlyNumeric: true,
								allowPoint: true,
								allowNegative: false,
								textAlign: 'right',
								maxlength: 10,
								autoThousandSeparator: true,
							},
						},
						{
							dataField: 'baseStorageprice',
							headerText: t('lbl.STORAGEPRICE'), //창고료
							dataType: 'numeric',
							editable: true,
							editRenderer: {
								type: 'InputEditRenderer',
								showEditorBtnOver: false,
								onlyNumeric: true,
								allowPoint: true,
								allowNegative: false,
								textAlign: 'right',
								maxlength: 10,
								autoThousandSeparator: true,
							},
						},
						{
							dataField: 'basePltprice',
							headerText: t('lbl.PALLETPRICE'), //팔렛료
							dataType: 'numeric',
							editable: true,
							editRenderer: {
								type: 'InputEditRenderer',
								showEditorBtnOver: false,
								onlyNumeric: true,
								allowPoint: true,
								allowNegative: false,
								textAlign: 'right',
								maxlength: 10,
								autoThousandSeparator: true,
							},
						},
						{
							dataField: 'baseWghprice',
							headerText: t('lbl.WGHPRICE'), //계근료
							dataType: 'numeric',
							editable: true,
							editRenderer: {
								type: 'InputEditRenderer',
								showEditorBtnOver: false,
								onlyNumeric: true,
								allowPoint: true,
								allowNegative: false,
								textAlign: 'right',
								maxlength: 10,
								autoThousandSeparator: true,
							},
						},
						{
							dataField: 'baseWorkprice',
							headerText: t('lbl.WORK_AMOUNT'), //작업료
							dataType: 'numeric',
							editable: true,
							editRenderer: {
								type: 'InputEditRenderer',
								showEditorBtnOver: false,
								onlyNumeric: true,
								allowPoint: true,
								allowNegative: false,
								textAlign: 'right',
								maxlength: 10,
								autoThousandSeparator: true,
							},
						},
					],
				},
				{
					headerText: t('lbl.COMPARE'), //비교
					children: [
						{
							dataField: 'cfGrprice',
							headerText: t('lbl.DP_PRICE'), //입고료
							dataType: 'numeric',
							editable: true,
							editRenderer: {
								type: 'InputEditRenderer',
								showEditorBtnOver: false,
								onlyNumeric: true,
								allowPoint: true,
								allowNegative: false,
								textAlign: 'right',
								maxlength: 10,
								autoThousandSeparator: true,
							},
						},
						{
							dataField: 'cfGiprice',
							headerText: t('lbl.WD_PRICE'), //출고료
							dataType: 'numeric',
							editable: true,
							editRenderer: {
								type: 'InputEditRenderer',
								showEditorBtnOver: false,
								onlyNumeric: true,
								allowPoint: true,
								allowNegative: false,
								textAlign: 'right',
								maxlength: 10,
								autoThousandSeparator: true,
							},
						},
						{
							dataField: 'cfStorageprice',
							headerText: t('lbl.STORAGEPRICE'), //창고료
							dataType: 'numeric',
							editable: true,
							editRenderer: {
								type: 'InputEditRenderer',
								showEditorBtnOver: false,
								onlyNumeric: true,
								allowPoint: true,
								allowNegative: false,
								textAlign: 'right',
								maxlength: 10,
								autoThousandSeparator: true,
							},
						},
						{
							dataField: 'cfPltprice',
							headerText: t('lbl.PALLETPRICE'), //팔렛료
							dataType: 'numeric',
							editable: true,
							editRenderer: {
								type: 'InputEditRenderer',
								showEditorBtnOver: false,
								onlyNumeric: true,
								allowPoint: true,
								allowNegative: false,
								textAlign: 'right',
								maxlength: 10,
								autoThousandSeparator: true,
							},
						},
						{
							dataField: 'cfWghprice',
							headerText: t('lbl.WGHPRICE'), //계근료
							dataType: 'numeric',
							editable: true,
							editRenderer: {
								type: 'InputEditRenderer',
								showEditorBtnOver: false,
								onlyNumeric: true,
								allowPoint: true,
								allowNegative: false,
								textAlign: 'right',
								maxlength: 10,
								autoThousandSeparator: true,
							},
						},
						{
							dataField: 'cfWorkprice',
							headerText: t('lbl.WORK_AMOUNT'), //작업료
							dataType: 'numeric',
							editable: true,
							editRenderer: {
								type: 'InputEditRenderer',
								showEditorBtnOver: false,
								onlyNumeric: true,
								allowPoint: true,
								allowNegative: false,
								textAlign: 'right',
								maxlength: 10,
								autoThousandSeparator: true,
							},
						},
					],
				},
			],
		},
		{
			headerText: 'M', //M
			children: [
				{
					headerText: t('lbl.BASE'), //기준
					children: [
						{
							dataField: 'baseMSumAmount',
							headerText: t('lbl.SUBTOTAL'), //소계
							dataType: 'numeric',
							editable: false,
						},
						{
							dataField: 'baseMGrAmount',
							headerText: t('lbl.DP_PRICE'), //입고료
							dataType: 'numeric',
							editable: false,
						},
						{
							dataField: 'baseMGiAmount',
							headerText: t('lbl.WD_PRICE'), //출고료
							dataType: 'numeric',
							editable: false,
						},
						{
							dataField: 'baseMStockAmount',
							headerText: t('lbl.STORAGEPRICE'), //창고료
							dataType: 'numeric',
							editable: false,
						},
						{
							dataField: 'baseMPltAmount',
							headerText: t('lbl.PALLETPRICE'), //팔렛료
							dataType: 'numeric',
							editable: false,
						},
						{
							dataField: 'baseMWghAmount',
							headerText: t('lbl.WGHPRICE'), //계근료
							dataType: 'numeric',
							editable: false,
						},
						{
							dataField: 'baseMWorkAmount',
							headerText: t('lbl.WORK_AMOUNT'), //작업료
							dataType: 'numeric',
							editable: false,
						},
					],
				},
				{
					headerText: t('lbl.COMPARE'), //비교
					children: [
						{
							dataField: 'cfMSumAmount',
							headerText: t('lbl.SUBTOTAL'), //소계
							dataType: 'numeric',
							editable: false,
						},
						{
							dataField: 'cfMGrAmount',
							headerText: t('lbl.DP_PRICE'), //입고료
							dataType: 'numeric',
							editable: false,
						},
						{
							dataField: 'cfMGiAmount',
							headerText: t('lbl.WD_PRICE'), //출고료
							dataType: 'numeric',
							editable: false,
						},
						{
							dataField: 'cfMStockAmount',
							headerText: t('lbl.STORAGEPRICE'), //창고료
							dataType: 'numeric',
							editable: false,
						},
						{
							dataField: 'cfMPltAmount',
							headerText: t('lbl.PALLETPRICE'), //팔렛료
							dataType: 'numeric',
							editable: false,
						},
						{
							dataField: 'cfMWghAmount',
							headerText: t('lbl.WGHPRICE'), //계근료
							dataType: 'numeric',
							editable: false,
						},
						{
							dataField: 'cfMWorkAmount',
							headerText: t('lbl.WORK_AMOUNT'), //작업료
							dataType: 'numeric',
							editable: false,
						},
					],
				},
			],
		},
	];

	// 그리드 속성 설정
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		enableFilter: true,
		showRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * SKU 상세 데이터 세팅
	 * @param value
	 * @param selectRow
	 */
	const getSkuSelectData = (value: any, selectRow: number) => {
		const param = {
			sku: value,
		};

		apiGetDataSelectSkuForMsExDcRate(param).then(res => {
			const gridRef = ref.gridRef2.current;
			const data = res.data;
			if (!data) {
				gridRef.setCellValue(selectRow, 'skuname', '');
				gridRef.setCellValue(selectRow, 'uom', '');
				gridRef.setCellValue(selectRow, 'storagetye', '');
				gridRef.setCellValue(selectRow, 'skuLdesc', '');
				return;
			}

			gridRef.setCellValue(selectRow, 'skuname', data.description);
			gridRef.setCellValue(selectRow, 'uom', data.baseUom);
			gridRef.setCellValue(selectRow, 'storagetye', data.storageType);
			gridRef.setCellValue(selectRow, 'skuLdesc', data.skuLdesc);

			const colSizeList = ref.gridRef2.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			ref.gridRef2.current.setColumnSizeList(colSizeList);
		});
	};

	/**
	 * 그리드 버튼 함수 설정. 마스터 그리드.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef2, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'plus', // 행추가
				},
				{
					btnType: 'delete', // 행삭제
				},
				// {
				// 	btnType: 'btn2', // 시뮬레이션
				// 	callBackFn: props.saveFn,
				// },
				{
					btnType: 'excelUpload', // 엑셀업로드
				},
			],
		};

		return gridBtn;
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 셀 더블클릭
		 * @param {any} event 이벤트
		 */
		ref.gridRef2.current.bind('cellDoubleClick', (event: any) => {
			// if (event.dataField === 'sku') {
			// 	// 상품코드 셀 더블클릭하면 상품상세팝업 표시
			// 	ref.gridRef2.current.openPopup(event.item, 'sku');
			// }
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		const gridRefCur = ref.gridRef2.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.gridData);

			if (props.gridData.length > 0) {
				const colSizeList = ref.gridRef2.current.getFitColumnSizeList(true);
				colSizeList[7] = 70;
				ref.gridRef2.current.setColumnSizeList(colSizeList);
			}

			setTotalCount(props.gridData.length);
		}
	}, [props.gridData]);

	useEffect(() => {
		initEvent();
	}, []);

	return (
		<>
			{/* 그리드 영역 정의 */}
			<AGrid>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn()} totalCnt={totalCount}></GridTopBtn>
				<AUIGrid ref={ref.gridRef2} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModal} />
		</>
	);
});

export default MsExDCSimulationDetail2;
