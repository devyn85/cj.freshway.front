/*
 ############################################################################
 # FiledataField	: MsCostCenterCtgyInfoTab3.tsx
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

// Component
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import MsCostCenterCtgyInfoTab3UploadExcelPopup from '@/components/ms/costCenterCtgyInfo/MsCostCenterCtgyInfoTab3UploadExcelPopup';

// Store

const MsCostCenterCtgyInfoTab3 = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

	// 엑셀 업로드 모달/핸들러
	const refModalExcel = useRef(null);
	const openUploadPopup = () => {
		refModalExcel.current?.handlerOpen();
	};
	const closeEvent = (refresh?: boolean) => {
		refModalExcel.current?.handlerClose();
		// 업로드 후 재조회 필요 시 호출
		if (refresh === true && props.search) props.search();
	};
	// 그리드 초기화
	const gridCol = [
		{
			// 조회년월
			headerText: t('lbl.APPLY_YM'),
			dataField: 'applyYm',
			dataType: 'code',
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
			// 구분(전용/범용)
			headerText: '전용(Y) / 범용(N)',
			dataField: 'dedicYn',
			dataType: 'code',
		},
		// {
		// 	// 등록자
		// 	dataField: 'addwho',
		// 	headerText: t('lbl.ADDWHO'), // 등록자
		// 	dataType: 'manager',
		// 	managerDataField: 'addWhoId',
		// 	editable: false,
		// },
		// {
		// 	dataField: 'addWhoId',
		// 	visible: false,
		// },
		// {
		// 	// 등록일시
		// 	dataField: 'adddate',
		// 	headerText: t('lbl.ADDDATE'), // 등록일시
		// 	dataType: 'date',
		// 	formatString: 'yyyy-mm-dd hh:MM:ss',
		// 	editable: false,
		// },
		// {
		// 	// 수정자
		// 	dataField: 'editwho',
		// 	headerText: t('lbl.EDITWHO'), // 수정자
		// 	dataType: 'manager',
		// 	managerDataField: 'editWhoId',
		// 	editable: false,
		// },
		// {
		// 	dataField: 'editWhoId',
		// 	visible: false,
		// },
		// {
		// 	// 수정일시
		// 	dataField: 'editdate',
		// 	headerText: t('lbl.EDITDATE'), // 수정일시
		// 	dataType: 'date',
		// 	formatString: 'yyyy-mm-dd hh:MM:ss',
		// 	editable: false,
		// },
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
	const onExcelUploadPopupClick = () => {
		refModalExcel.current.handlerOpen();
	};
	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 엑셀업로드
				callBackFn: onExcelUploadPopupClick,
			},
		],
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
		const gridRefCur = gridRef.current;
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
				<GridTopBtn gridTitle="전용상품 마스터" gridBtn={gridBtn} totalCnt={props.totalCnt}>
					<span className="msg">※ 적용월 기준이 아닌 현재기준</span>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CustomModal ref={refModalExcel} width="1000px">
				<MsCostCenterCtgyInfoTab3UploadExcelPopup close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default MsCostCenterCtgyInfoTab3;
