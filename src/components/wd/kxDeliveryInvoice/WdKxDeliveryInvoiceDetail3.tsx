// /*
//  ############################################################################
//  # FiledataField	: WdKxDeliveryInvoiceDetail3.tsx
//  # Description		: 출고 > 출고작업 > 택배송장발행(온라인) (일반택배 탭) - 현재미사용
//  # Author					:
//  # Since					: 2025.12.22.
//  ############################################################################
// */

// // Lib
// import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// // Component
// import GridTopBtn from '@/components/common/GridTopBtn';

// // Util

// // Store

// // API

// // Hooks

// // lib

// // type
// import { GridBtnPropsType } from '@/types/common';
// // asset
// import AGrid from '@/assets/styled/AGrid/AGrid';

// interface WdKxDeliveryInvoiceDetail3Props {
// 	data: any;
// 	totalCnt: any;
// 	form: any;
// }

// const WdKxDeliveryInvoiceDetail3 = forwardRef((props: WdKxDeliveryInvoiceDetail3Props, ref: any) => {
// 	/**
// 	 * =====================================================================
// 	 *  01. 변수 선언부
// 	 * =====================================================================
// 	 */
// 	// 다국어
// 	const { t } = useTranslation();

// 	//그리드 컬럼
// 	const gridCol = [
// 		{ headerText: t('lbl.DCCODE'), /*물류센터*/ dataField: 'dccode', dataType: 'code', editable: false, width: 80 },
// 	];

// 	// 그리드 속성을 설정
// 	const gridProps = {
// 		editable: true,
// 		//Row Status 영역 여부
// 		showStateColumn: true, // row 편집 여부
// 		fillColumnSizeMode: false,
// 		enableColumnResize: true, // 열 사이즈 조정 여부
// 		showRowCheckColumn: false,
// 		isLegacyRemove: true,
// 		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
// 		customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
// 		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
// 		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
// 	};

// 	/**
// 	 * =====================================================================
// 	 *  02. 함수
// 	 * =====================================================================
// 	 * @param authority
// 	 */

// 	/**
// 	 * 그리드 이벤트 설정
// 	 */
// 	const initEvent = () => {
// 		/**
// 		 * 그리드 바인딩 완료
// 		 * @param {any} event 이벤트
// 		 */
// 		ref?.current.bind('ready', () => {
// 			// 그리드가 준비되면 첫 번째 행을 선택한다.
// 			ref?.current.setSelectionByIndex(0);
// 		});
// 	};

// 	/**
// 	 * 그리드 버튼 함수 설정
// 	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
// 	 */
// 	// 그리드 버튼
// 	const gridBtn: GridBtnPropsType = {
// 		tGridRef: ref, // 타겟 그리드 Ref
// 		btnArr: [],
// 	};
// 	/**
// 	 * =====================================================================
// 	 *  03. react hook event
// 	 * =====================================================================
// 	 */

// 	/**
// 	 * 화면 초기화
// 	 */
// 	useEffect(() => {
// 		initEvent();
// 	}, []);

// 	/**
// 	 * Grid data 변경
// 	 */
// 	useEffect(() => {
// 		const gridRef = ref.current;
// 		if (gridRef && props.data) {
// 			gridRef?.setGridData(props.data);
// 			gridRef?.setSelectionByIndex(0, 0);

// 			if (props.data.length > 0) {
// 				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
// 				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
// 				const colSizeList = gridRef.getFitColumnSizeList(true);

// 				// 구해진 칼럼 사이즈를 적용 시킴.
// 				gridRef.setColumnSizeList(colSizeList);
// 			}
// 		}
// 	}, [props.data]);

// 	return (
// 		<>
// 			{/* 그리드 영역 */}
// 			<AGrid>
// 				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
// 				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} />
// 			</AGrid>
// 		</>
// 	);
// });

// export default WdKxDeliveryInvoiceDetail3;
