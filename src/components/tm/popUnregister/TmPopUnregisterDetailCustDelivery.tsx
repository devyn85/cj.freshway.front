/*
 ############################################################################
 # FiledataField	: TmPopUnregisterDetailCustDelivery.tsx
 # Description		: 거래처별POP미등록현황 - 배송이력
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.02
 ############################################################################
*/
// CSS

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils

// Type

// Store

// Component
import GridAutoHeight from '@/components/common/GridAutoHeight';
import TmPopUnregisterRolltaninerPopup from '@/components/tm/popUnregister/TmPopUnregisterRolltaninerPopup';

// API

interface TmPopUnregisterCustDeliveryProps {
	gridData: any;
	save: any;
}

const TmPopUnregisterDetailCustDelivery = forwardRef((props: TmPopUnregisterCustDeliveryProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 그리드 ref
	ref.gridRef2 = useRef();

	// 롤테이너별 배송 조회 팝업 팝업용 Ref
	const refGridModal = useRef(null);

	const gridCol = [
		{
			dataField: 'dccode',
			visible: false,
		},
		{
			dataField: 'custtype',
			visible: false,
		},
		{
			dataField: 'custkey',
			visible: false,
		},
		{
			dataField: 'deliverydate',
			headerText: t('lbl.DATE'),
			dataType: 'date',
			editable: false,
			formatString: 'yyyy-mm-dd',
		},
		{
			dataField: 'popno',
			headerText: t('lbl.LBL_DELIVERYGROUP'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'carno',
			headerText: t('lbl.CARNO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'orderweight',
			headerText: t('lbl.WEIGHT_KG_UOM'),
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'ordercbm',
			headerText: t('lbl.CUBE_UOM'),
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'rolltainerNo',
			headerText: t('lbl.ROLLTAINER_NO'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'search',
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					const rowItem = e.item;
					refGridModal.current.open({
						srcGridRef: ref.gridRef2,
						rowIndex,
						dccode: rowItem.dccode,
						carno: rowItem.carno,
						popno: rowItem.popno,
						onConfirm: (selectedRows: any[]) => {
							if (!selectedRows || selectedRows.length === 0) return;
							const selectedData = selectedRows[0];
							const updatedRow = {
								...rowItem,
								rolltainerNo: selectedData.rolltainerNo,
							};
							// 해당 행에 값 업데이트
							ref.gridRef2.current.updateRow(updatedRow, rowIndex);
							// 팝업 닫기
							refGridModal.current?.handlerClose();
						},
					});
				},
			},
		},
		{
			dataField: 'regPop',
			headerText: t('lbl.POP_REG'),
			dataType: 'code',
			editable: false,
			renderer: {
				type: 'ButtonRenderer',
				labelText: t('lbl.REG_TAB'),
				onClick: (event: any) => {
					// 거래처 POP 등록
					props.save([event.item]);
				},
				disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					// 행 아이템의 롤테이너 컬럼의 값이 있으면 버튼 활성화 처리
					return commUtil.isEmpty(item.rolltainerNo ? item.rolltainerNo.trim() : '');
				},
			},
		},
	];

	// 거래처별 POP 미등록 그리드 속성 설정
	const gridProps = {
		editable: true,
		fillColumnSizeMode: true,
		enableColumnResize: true,
		enableFilter: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		ref.gridRef2?.current?.resize('100%', '100%');
	}, []);

	/**
	 * 데이터를 조회하면 그리드에 추가한다.
	 */
	useEffect(() => {
		const gridRefCur = ref.gridRef2.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.gridData);
			//gridRefCur?.setSelectionByIndex(0, 0);

			if (props.gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);

				// 컬럼 사이즈 고정
				gridRefCur.setColumnPropByDataField('carno', { width: 160 });
			}

			ref.gridRef2?.current?.resize('100%', '100%');
		}
	}, [props.gridData]);

	return (
		<>
			<GridAutoHeight style={{ paddingTop: 10 }}>
				<AUIGrid ref={ref.gridRef2} columnLayout={gridCol} gridProps={gridProps} name="my-auigrid" />
			</GridAutoHeight>

			{/* 롤테이너별 배송 조회 팝업 영역 정의 */}
			<TmPopUnregisterRolltaninerPopup ref={refGridModal} />
		</>
	);
});

export default TmPopUnregisterDetailCustDelivery;
