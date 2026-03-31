/*
 ############################################################################
 # FiledataField	: MsCostCenterCtgyInfoTab1.tsx
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
import MsCostCenterCtgyInfoUploadExcelPopup from '@/components/ms/costCenterCtgyInfo/MsCostCenterCtgyInfoUploadExcelPopup';
import { Button } from 'antd';

const MsCostCenterCtgyInfoTab1 = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

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
			// 고객코드
			headerText: t('lbl.CUST_CODE'),
			dataField: 'custkey',
			dataType: 'code',
			editable: false,
		},
		{
			// 고객명
			headerText: t('lbl.CUST_NAME'),
			dataField: 'description',
			dataType: 'string',
			editable: false,
		},
		// {
		// 	// 사업부코드
		// 	// 원랜 공통코드 SALEDEPARTMENT가 적용되어야 하나, 엑셀 업로드 데이터 그대로 사용
		// 	headerText: t('lbl.DEPT_CD'),
		// 	dataField: 'deptCd',
		// 	dataType: 'code',
		// 	editable: false,
		// },
		{
			// 사업부
			headerText: t('lbl.DEPT_NM'),
			dataField: 'deptNm',
			dataType: 'string',
			editable: false,
		},
		{
			// 경로/영업
			// 공통라벨 CHANNEL_DMH(영업경로)? 확인필요
			headerText: '경로/영업',
			dataField: 'hierachyNm',
			dataType: 'string',
			editable: false,
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
			// 군납여부
			headerText: t('lbl.ARMY_YN'),
			dataField: 'armyYn',
			dataType: 'code',
			editable: false,
		},
		{
			// 등록자
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'), // 등록자
			dataType: 'manager',
			managerDataField: 'addWhoId',
			editable: false,
		},
		{
			dataField: 'addWhoId',
			visible: false,
		},
		{
			// 등록일시
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'), // 등록일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			// 수정자
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'), // 수정자
			dataType: 'manager',
			managerDataField: 'editWhoId',
			editable: false,
		},
		{
			dataField: 'editWhoId',
			visible: false,
		},
		{
			// 수정일시
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'), // 수정일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		showRowCheckColumn: true,
		enableFilter: true,
	};

	// 엑셀 업로드 모달/핸들러
	const refModalExcel = useRef(null);
	const openUploadPopup = () => {
		refModalExcel.current?.handlerOpen();
	};
	const closeEvent = () => {
		refModalExcel.current?.handlerClose();
		// 업로드 후 재조회 필요 시 호출
		// props.callBackFn && props.callBackFn();
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
				<GridTopBtn gridTitle={'고객마스터'} gridBtn={gridBtn} totalCnt={props.totalCnt}>
					<Button onClick={openUploadPopup}>{t('lbl.EXCELUPLOAD')}</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
				<CustomModal ref={refModalExcel} width="1000px">
					<MsCostCenterCtgyInfoUploadExcelPopup close={closeEvent} />
				</CustomModal>
			</AGrid>
		</>
	);
});

export default MsCostCenterCtgyInfoTab1;
