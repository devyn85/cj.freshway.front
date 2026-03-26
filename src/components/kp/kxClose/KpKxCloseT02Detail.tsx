// CSS

// Lib
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component

// Type

// API
import { apiSaveKxCheck } from '@/api/kp/apiKpKxClose';
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';

const KpKxCloseT02Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	ref.gridRef = useRef<any>(null);
	const { t } = useTranslation();

	const getGridCol = () => {
		return [
			{
				headerText: 'SERIALKEY',
				dataField: 'serialkey',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: 'KX' + t('lbl.BASEDT'),
				dataField: 'kxorderdate',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: 'KX' + t('lbl.TYPE'),
				dataField: 'kxordertype',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: 'KX' + t('lbl.CENTER'),
				dataField: 'kxdccode',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: 'KX' + t('lbl.ORDER_NO'),
				dataField: 'kxorderkey',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: 'KX' + t('lbl.LINE_NO'), //LINE_NO
				dataField: 'kxlineno',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: 'FW' + t('lbl.DOCDT'), //DOCDT
				dataField: 'docdt',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: 'FW' + t('lbl.DOCTYPE'), //DOCTYPE
				dataField: 'doctype',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: 'FW' + t('lbl.DOCNO'), //DOCNO
				dataField: 'docno',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: 'FW' + t('lbl.DOCLINE_NO'), //DOCLINE_NO
				dataField: 'docline',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: 'FW' + t('lbl.SLIPDT'), //SLIPDT
				dataField: 'slipdt',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: 'FW' + t('lbl.SLIPNO'), //SLIPNO
				dataField: 'slipno',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: 'FW' + t('lbl.SLIPLINE_NO'), //SLIPLINE_NO
				dataField: 'slipline',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: 'FW' + t('lbl.CENTER'), //CENTER
				dataField: 'dccode',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: t('lbl.STORERKEY') + t('lbl.CODE'), //STORERKEY + CODE
				dataField: 'storerkey',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: t('lbl.ORGANIZE'), //ORGANIZE
				dataField: 'organize',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: t('lbl.TRANSQTY'), //TRANSQTY
				dataField: 'confirmqty',
				dataType: 'numeric',
				editable: true,
			},
			{
				headerText: 'IF' + t('lbl.STATUS_1'), // STATUS_1
				dataField: 'ifFlag',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: 'IF' + t('lbl.DATE'), //DATE
				dataField: 'ifDate',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: t('lbl.LBL_SKU'), //LBL_SKU
				dataField: 'sku',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: t('lbl.DOCSKU'), //DOCSKU
				dataField: 'dmSku',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: t('lbl.DOCQTY'), //DOCQTY
				dataField: 'dmQty',
				dataType: 'numeric',
				editable: false,
			},
			{
				headerText: 'RT' + t('lbl.SKU'), //RT+SKU
				dataField: 'rtSku',
				dataType: 'text',
				editable: false,
			},
			{
				headerText: 'RT' + t('lbl.QTY'), //RT+QTY
				dataField: 'rtQty',
				dataType: 'numeric',
				editable: false,
			},
		];
	};

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	// 그리드 속성 설정
	const gridProps = {
		enableCellMerge: true, // 셀 병합 기능 활성화
		editable: true,
	};

	const saveIfStatus = () => {
		const selectedRow = ref.gridRef.current?.getSelectedRows();
		if (selectedRow.length > 0 && !ref.gridRef.current.isAddedById(selectedRow[0]._$uid)) {
			const params = {
				checkyn: selectedRow[0].checkyn,
				docno: selectedRow[0].docno,
				docline: selectedRow[0].docline,
				serialkey: selectedRow[0].serialkey,
				ifFlag: selectedRow[0].ifFlag,
				confirmqty: selectedRow[0].confirmqty,
			};

			const requestBody = { saveList: [params] };

			apiSaveKxCheck(requestBody).then(() => {
				// 콜백 처리
				props.search && props.search instanceof Function ? props.search() : null;
			});
		} else {
			return;
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		const gridRef = ref.gridRef?.current;

		gridRef.bind('cellEditEnd', function (event: any) {
			const allRows = gridRef.getGridData(); // 전체 row 데이터 배열
			const filtered = allRows.filter((row: any) => row.ifFlag === 'QTY_EDIT'); // 전체 row 중 IF_FLAG가 'QTY_EDIT'인 행들만 필터링
			// 예: 문서번호 컬럼 클릭 시
			if (event.dataField === 'confirmqty') {
				// 원하는 탭 key로 이동
				if (filtered.length === 0) {
					showAlert(
						null,
						"수량조정 작업을 진행 하시겠습니까? \n (진행시 IF_FLAG가 'QTY_EDIT'로 바뀌며, 이후 IF_FLAG를 더블클릭하여 저장처리해야함)",
					);
				}

				const { rowIndex, columnIndex } = event;
				// gridRef.setSelectionByIndex(rowIndex + 1, columnIndex);

				// IF_FLAG가 'QTY_EDIT'인 경우에만 수정 가능
				if (filtered.length === 0) gridRef.setCellValue(rowIndex, 'ifFlag', 'QTY_EDIT'); // PR 내부에 'QTY_EDIT' 조건이 있어 수정불가한 문구임
			}
		});

		gridRef.bind('cellDoubleClick', function (event: any) {
			if (event.dataField === 'ifFlag' && event.value === 'QTY_EDIT') {
				showConfirm(null, "재전송 되도록 인터페이스 상태를 갱신(to 'N') 하시겠습니까?", async () => {
					// 저장 프로시저 호출
					saveIfStatus();
				});
			}
		});
	}, []);

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

	return (
		<>
			<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
				<GridTopBtn gridBtn={{ tGridRef: ref.gridRef }} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref.gridRef} columnLayout={getGridCol()} gridProps={gridProps} />
			</GridAutoHeight>
		</>
	);
});

export default KpKxCloseT02Detail;
