// CSS
import { apiSaveKxAj } from '@/api/kp/apiKpKxClose';
import AGrid from '@/assets/styled/AGrid/AGrid';
import CustomModal from '@/components/common/custom/CustomModal';
import GridAutoHeight from '@/components/common/GridAutoHeight';

// Lib
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import KpKxCloseT06ExcelUpload from '@/components/kp/kxClose/KpKxCloseT06ExcelUpload';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';

// Component

// Type

// API

const KpKxCloseT06Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	ref.gridRef = useRef<any>(null);
	ref.gridRef2 = useRef<any>(null);
	const [totalResultCnt, setTotalResultCnt] = useState(0);
	const modalRef1 = useRef(null);
	const closeEvent = () => {
		modalRef1.current.handlerClose();
	};
	const { t } = useTranslation();
	const getGridCol = () => [
		{
			headerText: t('lbl.DOCTYPE'), //DOCTYPE
			dataField: 'doctype',
			dataType: 'code',
		},
		{
			headerText: 'KXTYPE', // KXTYPE
			dataField: 'kxtype',
			dataType: 'code',
		},
		{
			headerText: t('lbl.DATE'), // 일자
			dataField: 'deliverydate',
			dataType: 'date',
		},
		{
			headerText: t('lbl.CENTER'), // 센터
			dataField: 'kxdccode', //확인필요
			dataType: 'code',
		},
		{
			headerText: 'KX' + t('lbl.SLIP'), // KX전표
			dataField: 'kxslipno',
			dataType: 'text',
		},
		{
			headerText: t('lbl.ITEM_COUNT'), // 좌수
			dataField: 'kxsliplineno',
			dataType: 'text',
		},
		{
			headerText: 'FX' + t('lbl.SLIP'), // FX전표
			dataField: 'docno',
			dataType: 'text',
		},
		{
			headerText: t('lbl.MATERIAL') + t('lbl.CODE'), // 자재코드
			dataField: 'sku',
			dataType: 'code',
		},
		{
			headerText: 'KX' + t('lbl.CALQTY'), // KX환산물량
			dataField: 'kxqty',
			dataType: 'numeric',
			styleFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				if (Number(item.kxqty) > Number(item.qty)) {
					return 'color-danger';
				}
				return null; // 기본 스타일
			},
		},
		{
			headerText: 'KX' + t('lbl.UOM'), // KX단위
			dataField: 'kxuom',
			dataType: 'code',
		},
		{
			headerText: 'FX' + t('lbl.CALQTY'), // FX환산물량
			dataField: 'qty',
			dataType: 'numeric',
			styleFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				if (Number(item.kxqty) > Number(item.qty)) {
					return 'color-danger';
				}
				return null; // 기본 스타일
			},
		},
		{
			headerText: 'FX' + t('lbl.UOM'), // FX단위
			dataField: 'uom',
			dataType: 'code',
		},
		{
			headerText: t('lbl.PROCESSFLAG'), // 처리결과
			dataField: 'processflag',
			dataType: 'code',
		},
		{
			headerText: t('lbl.PROCESSMSG'), // 처리메세지
			dataField: 'processmsg',
			dataType: 'text',
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	/**
	 * 엑셀 업로드 팝업
	 */
	const onExcelUploadPopupClick = () => {
		ref.gridRef.current?.clearGridData();
		ref.gridRef2.current?.clearGridData();
		setTotalResultCnt(0);
		// propssetTotalCnt6(0);
		modalRef1.current.handlerOpen();
	};

	const saveSet = () => {
		const checkedItems = ref.gridRef.current.getCheckedRowItems();

		if (checkedItems.length === 0) {
			showMessage({
				content: t('msg.MSG_COM_VAL_061'),
				modalType: 'info',
			});
			return;
		}

		const saveData = checkedItems.map((row: { item: any }) => row.item);
		const requestBody = { saveList2: saveData };
		saveKxAj(requestBody);
	};

	const saveKxAj = (requestBody: any) => {
		apiSaveKxAj(requestBody).then((res: any) => {
			ref.gridRef2.current.setGridData(res.data.data);
			if (res.data.data.length > 0) {
				const colSizeList2 = ref.gridRef2.current.getFitColumnSizeList(true);
				ref.gridRef2.current.setColumnSizeList(colSizeList2);
				setTotalResultCnt(res.data.data.length);
			}
		});
	};
	// 그리드 속성 설정
	const gridProps = {
		showCustomRowCheckColumn: true,
		editable: false,
		rowStyleFunction: (rowIndex: number, item: any) => {
			// item 객체가 유효하고 processflag 속성이 있는지 확인합니다.
			if (item && item.processflag) {
				if (item.processflag != 'Y') {
					return 'color-danger';
				} else {
					return 'color-info';
				}
			}
		},
	};
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 엑셀업로드
				callBackFn: onExcelUploadPopupClick,
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveSet,
			},
		],
	};
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		ref.gridRef2?.current.clearGridData();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);
			setTotalResultCnt(0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
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
						<AGrid className="contain-wrap" style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn
								gridBtn={gridBtn}
								gridTitle={t('lbl.ADJUSTQTY_ST') + t('lbl.REQUEST') + t('lbl.DESCRIPTION')}
								totalCnt={props.totalCnt}
								extraContentLeft={<span className="msg">* 엑셀 생성시 물량 필드에 콤마(,) 제거할 것!!!</span>}
							/>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={getGridCol()} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid className="contain-wrap" style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn
								gridBtn={{ tGridRef: ref.gridRef2 }}
								gridTitle={t('lbl.PROCESSFLAG')}
								totalCnt={totalResultCnt}
							/>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef2} columnLayout={getGridCol()} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
				]}
			/>
			<CustomModal ref={modalRef1} width="1000px">
				<KpKxCloseT06ExcelUpload gridCol={getGridCol()} close={closeEvent} save={saveKxAj} />
			</CustomModal>
		</>
	);
});

export default KpKxCloseT06Detail;
