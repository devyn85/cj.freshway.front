/*
 ############################################################################
 # FiledataField	: KpWdRequestCancelqtyTab3Detail.tsx
 # Description		: 분류피킹(공급센터)
 # Author			: 공두경
 # Since			: 25.11.18 
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// API Call Function

const KpWdRequestCancelqtyTab3Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 편집 가능한 상태인지 확인하는 함수
	 * @param {any} item - 그리드 행 아이템
	 * @returns {boolean} - 편집 가능 여부
	 */
	const isDisabled = (item: any): boolean => {
		if (commUtil.nvl(item?.stoStatus, '') != '') {
			// STO진행상태가 미등록이면 활성화
			return true;
		}
		return false;
	};
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('이체상태'), //*이체상태*/
			dataField: 'stoStatus',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STO_STATUS', value)?.cdNm;
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.nvl(item.stoStatus, '') === '00' ? 'gc-user54' : '';
			},
			editable: false,
		},
		{
			headerText: t('lbl.SERIALKEY'), //*요청번호*/
			dataField: 'serialkey',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.DOCNO'), //*문서번호*/
			dataField: 'docno',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.DOCLINE'), //*문서라인*/
			dataField: 'docline',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.FROM_DCCODE'), //*공급센터*/
			dataField: 'toDccode',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.LOC'), //*공급센터로케이션*/
			dataField: 'toLoc',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.SKU'),
			/*상품코드*/ dataField: 'sku',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							sku: e.item.sku,
						},
						'sku',
					);
				},
			},
			editable: false,
		},
		{
			headerText: t('lbl.SKUNM'),
			/*상품명*/ dataField: 'skuname',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			headerText: t('lbl.UOM'), //*단위*/
			dataField: 'uom',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.MISS_ORDERQTY'), //*누락분요청수량*/
			dataField: 'missOrderqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			headerText: t('lbl.TO_MOVE_QTY'), //*수급센터처리수량*/
			dataField: 'moveQty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			headerText: t('lbl.CURRENT_STOCK'), //*현재고*/
			dataField: 'stockqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'addwhonm',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'addwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
			editable: false,
		},
		{
			dataField: 'addwho',
			visible: false,
		},
		{ headerText: t('lbl.ADDDATE'), dataField: 'adddate', dataType: 'date', editable: false },
		{
			dataField: 'editwhonm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'editwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
			editable: false,
		},
		{
			dataField: 'editwho',
			visible: false,
		},
		{ headerText: t('lbl.EDITDATE'), dataField: 'editdate', dataType: 'date', editable: false },
		/*START.hidden 컬럼*/
		{ dataField: 'flag', editable: false, visible: false }, // 구분(1:취소,2:누락분)
		{ dataField: 'docdt', editable: false, visible: false }, // docdt
		{ dataField: 'priority', editable: false, visible: false }, // priority
		{ dataField: 'reqStatus', editable: false, visible: false }, // reqStatus - 이거의 용도 알아볼 필요 있음
		/*END.hidden 컬럼*/
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
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
		btnArr: [],
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

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle="분류피킹(공급센터) 목록" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default KpWdRequestCancelqtyTab3Detail;
