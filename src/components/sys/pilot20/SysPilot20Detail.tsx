// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Components
import PageGridBtn from '@/components/common/PageGridBtn';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Style
import AGrid from '@/assets/styled/AGrid/AGrid';

const SysPilot20Detail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	/*
	### 그리드 변수 ###
	*/
	const gridCol = [
		{
			dataField: 'serialkey',
			headerText: '일련번호',
			visible: false,
			//width: '150',
		},
		{
			dataField: 'dccode',
			headerText: '물류센터',
			//width: '150',
		},
		{
			dataField: 'carriertype',
			headerText: '운송사유형',
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('CARRIERTYPE', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
		},
		{
			dataField: 'carrierkey',
			headerText: '운송사',
			// editRenderer: {
			// 	type: CustomCarrierSearchEditor,
			// },
			// renderer: {
			// 	type: 'CustomRenderer',
			// 	jsClass: CustomCarrierSearchEditor,
			// },
		},
		{
			dataField: 'customkey',
			headerText: '커스텀',
			editable: false,
			// editRenderer: {
			// 	type: CustomInputEditRenderer,
			// },
			// renderer: {
			// 	type: 'CustomRenderer',
			// 	jsClass: CustomInputEditRenderer,
			// },
		},
		{
			dataField: 'price',
			headerText: '$',
		},
		{
			dataField: 'status',
			headerText: '진행상태',
			style: 'left',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: true, // 편집 가능 여부
		editBeginMode: 'doubleClick', //cell 더블클릭시 에디트 활성화 (또는 F2)
		//selectionMode: 'multipleCells', //드래그하여 cell 멀티셀렉트
		//showStateColumn: true, // row 편집 여부
		//enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스 컬럼 표시 여부
		//fixedColumnCount: 2,
		fillColumnSizeMode: false, // 그리드 너비에 맞춰서 열 크기 조정 여부
		showFooter: true, // 푸터 표시 여부
		//rowIdField: 'No', // 그리드에서 사용할 row id 필드명
		// 행 드래그&드랍을 도와주는 엑스트라 칼럼을 최좌측에 생성합니다.
		//showDragKnobColumn: false,
		// 드래깅 행 이동 가능 여부 (기본값 : false)
		//enableDrag: false,
		// 다수의 행을 한번에 이동 가능 여부(기본값 : true)
		//enableMultipleDrag: true,
		// 셀에서 바로  드래깅 해 이동 가능 여부 (기본값 : false) - enableDrag=true 설정이 선행
		//enableDragByCellDrag: true,
		// 드랍 가능 여부 (기본값 : true)
		//enableDrop: true,
	};

	// 그리드 상단 버튼
	const gridBtn = {
		isPlus: true,
		plusFunction: function () {
			const item = {
				menuYn: 0,
				useYn: 0,
				price: 125.55,
			};
			gridRef.current.addRow(item);
		},
		isMinus: true,
		minusFunction: function () {
			gridRef.current.removeRow('selectedIndex');
		},
		isCopy: true,
		copyFunction: function () {
			const selectedRow = gridRef.current.getSelectedRows();
			if (selectedRow && selectedRow.length > 0) {
				const item = selectedRow[0];
				item.menuId = '';
				item.regId = '';
				item.regDt = '';
				gridRef.current.addRow(item, 'selectionDown');
			}
		},
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<AGrid>
				<PageGridBtn gridBtn={gridBtn} totalCnt={props.totalCnt} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default SysPilot20Detail;
