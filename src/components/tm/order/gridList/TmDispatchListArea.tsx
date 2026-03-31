/*
 ############################################################################
 # FiledataField : TmDispatchListArea.tsx
 # Description   : 배차목록 권역별 그리드
*/
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { useEffect, useRef } from 'react';

// components

// utils
import dateUtils from '@/util/dateUtil';

// hooks
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

interface ITmDispatchListAreaProps {
	data: any[];
	totalCnt: number;
	onLoadMore?: () => void;
	customerCurrentPage: number;
}

const TmDispatchListArea = ({ data, totalCnt, onLoadMore, customerCurrentPage }: ITmDispatchListAreaProps) => {
	const gridRef: any = useRef(null);

	const downloadExcel = (e: any) => {
		// 그리드 데이터 체크
		const gridData = gridRef.current.getGridData();
		if (!gridData || gridData.length === 0) {
			showAlert(null, '다운로드할 데이터가 없습니다.');
			return;
		}

		// 엑셀 다운로드 파라미터 설정
		const params = {
			fileName: '배차목록_권역별_' + dateUtils.getToDay('YYYYMMDD'),
			progressBar: true, // 진행바 표시 여부
		};

		// 엑셀 다운로드
		gridRef.current.exportToXlsxGrid(params);
	};

	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: 'excelDownload',
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: downloadExcel,
			},
		],
	};

	//푸터 설정
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'dccode',
		},
		{
			dataField: 'mealCount',
			positionField: 'mealCount',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'mealWeight',
			positionField: 'mealWeight',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
		{
			dataField: 'restaurantCount',
			positionField: 'restaurantCount',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'restaurantWeight',
			positionField: 'restaurantWeight',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
		{
			dataField: 'o2oCount',
			positionField: 'o2oCount',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'o2oWeight',
			positionField: 'o2oWeight',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
		{
			dataField: 'totalCount',
			positionField: 'totalCount',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'totalWeight',
			positionField: 'totalWeight',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
	];

	const gridProps = {
		editable: false, //   수정 불가능하도록 변경
		fillColumnSizeMode: false,
		showFooter: true,
		height: 600,
		showRowAllCheckBox: true,
		enableFilter: true,
	} as any;

	//   화면 정의서에 맞는 컬럼 구조로 변경
	const gridCol = [
		// 물류센터 (단일 컬럼)
		{
			headerText: '물류코드',
			dataField: 'dccode',
			dataType: 'code',
		},
		{
			headerText: '물류센터',
			dataField: 'dcname',
			dataType: 'code',
		},
		// 배송일자 (단일 컬럼)
		{
			headerText: '배송일자',
			dataField: 'deliverydt',
			dataType: 'date',
		},
		// 권역정보 (부모 - 자식 4개)
		{
			headerText: '권역정보',
			children: [
				{
					headerText: '시/도',
					dataField: 'ctpKorNm',
					dataType: 'text',
					editable: false,
				},
				{
					headerText: '시/군/구',
					dataField: 'sigKorNm',
					dataType: 'text',
					editable: false,
				},
				{
					headerText: '행정동',
					dataField: 'hjdongNm',
					dataType: 'text',
					editable: false,
				},
			],
		},
		// 고객 (부모 - 자식 8개)
		{
			headerText: '고객',
			children: [
				{
					headerText: '급식개수',
					dataField: 'mealCount',
					dataType: 'numeric',
					formatString: '#,##0',
					editable: false,
				},
				{
					headerText: '급식물량',
					dataField: 'mealWeight',
					dataType: 'numeric',
					formatString: '#,##0.00',
					editable: false,
				},
				{
					headerText: '외식개수',
					dataField: 'restaurantCount',
					dataType: 'numeric',
					formatString: '#,##0',
					editable: false,
				},
				{
					headerText: '외식물량',
					dataField: 'restaurantWeight',
					dataType: 'numeric',
					formatString: '#,##0.00',
					editable: false,
				},
				{
					headerText: 'O2O 개수',
					dataField: 'o2oCount',
					dataType: 'numeric',
					formatString: '#,##0',
				},
				{
					headerText: 'O2O 물량',
					dataField: 'o2oWeight',
					dataType: 'numeric',
					formatString: '#,##0.00',
					editable: false,
				},
				{
					headerText: '총 개수',
					dataField: 'totalCount',
					dataType: 'numeric',
					formatString: '#,##0',
					editable: false,
				},
				{
					headerText: '총 물량',
					dataField: 'totalWeight',
					dataType: 'numeric',
					formatString: '#,##0.00',
					editable: false,
				},
			],
		},
	];

	//   스크롤 페이징 훅 적용
	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			if (data.length >= totalCnt) {
				return;
			}

			if (onLoadMore) {
				onLoadMore();
			}
		},
		totalCount: totalCnt,
	});

	//   데이터 변경 시 그리드 업데이트
	useEffect(() => {
		if (gridRef.current && data) {
			if (customerCurrentPage === 1) {
				gridRef.current.setGridData(data);
			} else {
				gridRef.current.appendData(data);
			}

			// 컬럼 사이즈 자동 조정
			if (data.length > 0) {
				gridRef.current.setFooter(footerLayout);
				const colSizeList = gridRef.current.getFitColumnSizeList(true);
				gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [data]);

	return (
		<AGrid>
			<GridTopBtn gridTitle="목록" totalCnt={totalCnt} gridBtn={gridBtn} />

			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
};

export default TmDispatchListArea;
