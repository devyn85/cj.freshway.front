/*
 ############################################################################
 # FiledataField	: MgModifyLogExDcDetail.tsx
 # Description		: 외부비축재고변경사유현황 (변경이력) 
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.07.11
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';
// Utils

// API Call Function
//type
import { GridBtnPropsType } from '@/types/common';

//hooks

//store

const MgModifyLogExDcDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();

	const gridId = uuidv4() + '_gridWrap';

	// 그리드 컬럼 세팅
	const gridCol = [
		/* ▼ 기본 정보 --------------------------------------------- */
		{
			headerText: '변경일자',
			dataField: 'modifyDate',
			width: 110,
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			// required: true,
			// width: 120,
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: true, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
			},
			// labelFnction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
			// },

			// align: 'center',
		},
		{
			headerText: '변경유형',
			dataField: 'modifyTypeName',
			width: 80, //등록자
			dataType: 'code',
		},
		{
			headerText: '사유코드',
			dataField: 'reasonCode',
			width: 80,
			align: 'left', //등록자
			dataType: 'code',
		},
		// { headerText: '물류센터', dataField: 'dcCode', width: 80, align: 'center' },

		{
			headerText: '사유메시지',
			dataField: 'reasonMsg',
			width: 80,
			align: 'left', //등록자
			dataType: 'text',
		},
		{
			headerText: '창고',
			dataField: 'organize',
			width: 80,
			align: 'left', //등록자
			dataType: 'code',
		},
		{
			headerText: '창고명',
			dataField: 'organizeNm',
			width: 80,
			align: 'left', //등록자
			dataType: 'text',
		},
		// { headerText: 'SERIALYN_ST', dataField: 'serialynName', width: 80, align: 'left' },

		/* ▼ 상품 --------------------------------------------------- */
		{
			headerText: '상품정보',
			children: [
				{
					dataField: 'sku',
					headerText: '상품코드',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(e.item, 'sku');
						},
					},
				},
				{
					headerText: '상품명',
					dataField: 'skuName',
					width: 320,
					autoEllipsis: true, //등록자
					dataType: 'text',
				},
			],
		},
		/* ▼ 수량/무게 --------------------------------------------- */
		{
			headerText: '단위',
			dataField: 'uom',
			width: 50, //등록자
			dataType: 'code',
		},
		{ headerText: '수량', dataField: 'qty', width: 80, dataType: 'numeric', formatString: '#,##0.###', align: 'right' },
		{
			headerText: '환산재고',
			children: [
				{
					headerText: '평균중령',
					dataField: 'avgWeight',
					width: 80,
					dataType: 'numeric',
					formatString: '#,##0.##',
					// align: 'right',
				},
				{
					headerText: '환산박스',
					dataField: 'calBox',
					width: 80,
					dataType: 'numeric',
					formatString: '#,##0.##',
					align: 'right',
				},
				{
					headerText: '실박스예정',
					dataField: 'realOrderBox',
					width: 80,
					dataType: 'numeric',
					formatString: '#,##0.###',
					align: 'right',
				},
				{
					headerText: '실박스확정',
					dataField: 'realCfmBox',
					width: 80,
					dataType: 'numeric',
					formatString: '#,##0.###',
					align: 'right',
				},
			],
		},

		/* ▼ 라벨·출력 --------------------------------------------- */
		// {
		// 	headerText: '출력여부',
		// 	dataField: 'printYn',
		// 	width: 50,
		// 	align: 'center',
		// 	editRenderer: { type: 'CheckBox' }, // 체크박스 편집
		// },
		// {
		// 	headerText: '라벨출력수량',
		// 	dataField: 'printedQty',
		// 	width: 80,
		// 	dataType: 'numeric',
		// 	formatString: '#,##0',
		// 	align: 'right',
		// 	editRenderer: { type: 'InputEdit' }, // 숫자 입력 가능
		// },

		/* ▼ 출발지 ------------------------------------------------- */
		{
			headerText: 'From로케이션',
			children: [
				{ headerText: '이력번호', dataField: 'fromSerialNo', width: 90, dataType: 'text' },
				{ headerText: 'B/L번호', dataField: 'fromConvSerialNo', width: 90, dataType: 'text' },
				{ headerText: 'LOC', dataField: 'fromLoc', width: 90, dataType: 'text' },
				{ headerText: 'LOT', dataField: 'fromLot', width: 80, dataType: 'code' },
				{ headerText: '기준일(유통,제조)', dataField: 'fromLottable01', width: 80, dataType: 'code' },
				{ headerText: '재고ID', dataField: 'fromStockId', width: 80, dataType: 'text' },
				{ headerText: '재고위치', dataField: 'fromStockType', width: 90, dataType: 'code' },
				{ headerText: 'FROM 재고 속성', dataField: 'fromStockGrade', width: 90, dataType: 'code' },
			],
		},

		{
			headerText: 'TO로케이션',
			children: [
				/* ▼ 도착지 ------------------------------------------------- */
				{ headerText: '이력번호', dataField: 'toSerialNo', width: 90, dataType: 'text' },
				{ headerText: 'B/L번호', dataField: 'toConvSerialNo', width: 90, dataType: 'text' },
				{ headerText: 'LOC', dataField: 'toLoc', width: 80, dataType: 'text' },
				{ headerText: 'LOT', dataField: 'toLot', width: 80, dataType: 'code' },
				{ headerText: '기준일(유통,제조)', dataField: 'toLottable01', width: 80, dataType: 'code' },
				{ headerText: '재고ID', dataField: 'toStockId', width: 80, dataType: 'text' },
				{ headerText: '재고위치', dataField: 'toStockType', width: 80, dataType: 'code' },
				{ headerText: 'TO 재고 속성', dataField: 'toStockGrade', width: 80, dataType: 'code' },
			],
		},

		/* ▼ 편집---------------------------------------------------- */
		{
			headerText: '수정자정보',
			children: [
				{
					headerText: '수정자',
					dataField: 'userName',
					width: 65,
					dataType: 'manager', // dataType을 'manager'로 설정
					managerDataField: 'editWho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
				},
				{
					headerText: '수정일시',
					dataField: 'editDate',
					width: 65,
					dataType: 'date',
					formatString: 'yyyy-mm-dd HH:mm:ss',
				},
				// {
				// 	headerText: '수정자',
				// 	dataField: 'editWho',
				// 	width: 65,
				// 	// dataType: 'code',
				// 	dataType: 'manager', // dataType을 'manager'로 설정
				// 	managerDataField: 'editWho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
				// },
			],
		},
	];

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	//그리드 Pros 설정
	const gridProps = {
		editable: false,
		// showFooter: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	//데이터 세팅
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;

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
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle="목록" totalCnt={props.totalCount} gridBtn={gridBtn} />
				<AUIGrid
					ref={ref.gridRef}
					name={gridId}
					columnLayout={gridCol}
					gridProps={gridProps}
					// footerLayout={footerLayout}
				/>
			</AGrid>
		</>
	);
});
export default MgModifyLogExDcDetail;
