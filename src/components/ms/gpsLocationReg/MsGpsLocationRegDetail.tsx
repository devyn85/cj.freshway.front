/*
 ############################################################################
 # FiledataField	: MsGpsLocationRegDetail.tsx
 # Description		:  기준정보 > 고객 정보 > 고객 GPS 좌표 관리
 # Author			: JeongHyeongCheol
 # Since			: 25.08.29
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import { Button } from '@/components/common/custom/form';
import SearchlatlngUploadExcelPopup from '@/components/ms/gpsLocationReg/MsGpsLocationRegExcelPopup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store

// hooks
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

// API Call Function

// types
import { GridBtnPropsType } from '@/types/common';
interface SearchlatlngDetailProps {
	form?: any;
	gridData?: Array<object>;
	setGridData?: any;
	totalCount?: number;
	setCurrentPage?: any;
}
const SearchlatlngDetail = forwardRef((props: SearchlatlngDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { totalCount, setCurrentPage, gridData, setGridData } = props;
	const { t } = useTranslation();
	const refModalExcel = useRef(null);
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'dlvDccode',
			headerText: '물류센터',
			dataType: 'code',
		},
		{
			dataField: 'custtypeNm',
			headerText: '거래처유형',
			dataType: 'code',
		},
		{
			dataField: 'fromCustkey',
			headerText: '고객코드',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current.openPopup(
						{
							custkey: e.item.fromCustkey,
						},
						'cust',
					);
				},
			},
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'fromCustname',
			headerText: '고객명',
			commRenderer: {
				type: 'popup',
				align: 'left',
				onClick: function (e: any) {
					gridRef.current.openPopup(
						{
							custkey: e.item.fromCustkey,
						},
						'cust',
					);
				},
			},
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'address',
			headerText: '주소',
		},
		{
			dataField: 'latitude',
			headerText: '위도',
			dataType: 'numeric',
			formatString: '#,##0.0000',
		},
		{
			dataField: 'longitude',
			headerText: '경도',
			dataType: 'numeric',
			formatString: '#,##0.0000',
		},
		{
			dataField: 'addwho',
			headerText: '등록자',
			visible: false,
		},
		{
			dataField: 'regNm',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addwho',
			editable: false,
		},
		{
			dataField: 'adddate',
			headerText: '등록일시',
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			dataField: 'editwho',
			headerText: '수정자',
			visible: false,
		},
		{
			dataField: 'updNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'editwho',
			editable: false,
		},
		{
			dataField: 'editdate',
			headerText: '수정일시',
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
	];
	// 그리드 속성
	const gridProps = {
		editable: false,
		// showRowCheckColumn: true,
		isLegacyRemove: true,
		enableFilter: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
	};

	/**
	 * 엑셀업로드 클릭
	 */
	const excelUpload = () => {
		refModalExcel.current.handlerOpen();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		refModalExcel.current.handlerClose();
	};

	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			setCurrentPage((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount,
	});

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.appendData(gridData);
			if (gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={totalCount}>
					<Button onClick={excelUpload}>엑셀업로드</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CustomModal ref={refModalExcel} width="1000px">
				<SearchlatlngUploadExcelPopup close={closeEvent} setMasterGridData={setGridData} />
			</CustomModal>
		</>
	);
});

export default SearchlatlngDetail;
