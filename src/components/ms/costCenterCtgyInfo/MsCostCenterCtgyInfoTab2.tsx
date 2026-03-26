/*
 ############################################################################
 # FiledataField	: MsCostCenterCtgyInfoTab2.tsx
 # Description		: 거래처기준정보 > 마감기준정보 > 사업부상세조직분류
 # Author			: YeoSeungCheol
 # Since			: 25.12.08
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getUserDccodeList } from '@/store/core/userStore';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

const MsCostCenterCtgyInfoTab2 = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

	// 물류센터 목록
	const userDccodeList = getUserDccodeList('') ?? [];

	// 그리드 초기화
	const gridCol = [
		{
			// 조회년월
			headerText: t('lbl.APPLY_YM'),
			dataField: 'applyYm',
			dataType: 'date',
			format: 'YYYY-MM',
			editable: false,
		},
		{
			// 상품코드
			headerText: t('lbl.SKU'),
			dataField: 'sku',
			dataType: 'code',
		},
		{
			// 상품명
			headerText: t('lbl.SKUNM'),
			dataField: 'skuname',
			dataType: 'string',
		},
		{
			// 대분류
			headerText: t('lbl.CLASS_BIG'),
			dataField: 'lclNm',
			dataType: 'string',
			editable: false,
		},
		{
			// 중분류
			headerText: t('lbl.CLASS_MIDDLE'),
			dataField: 'mclNm',
			dataType: 'string',
			editable: false,
		},
		{
			// 소분류
			headerText: t('lbl.CLASS_SMALL'),
			dataField: 'sclNm',
			dataType: 'string',
			editable: false,
		},
		{
			// 미곡여부
			headerText: t('lbl.RICE_YN'),
			dataField: 'sclCd',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				// '10'이라면 Y
				if (value == '200101') {
					return 'Y';
				}
				return 'N';
			},
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		showRowCheckColumn: false,
		enableFilter: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		const gridRef = props.gridRef;
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef?.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.data && props.data.length > 0) {
				// 데이터 설정 후 컬럼 크기 자동 조정
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="h100">
				<GridTopBtn gridTitle="미곡 상품 마스터" gridBtn={gridBtn} totalCnt={props.totalCnt}>
					<span className="msg">※ 적용월 기준이 아닌 현재기준</span>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default MsCostCenterCtgyInfoTab2;
