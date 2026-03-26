/*
 ############################################################################
 # FiledataField : TmDispatchListPop.tsx
 # Description   : 배차목록 POP별 그리드
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

interface ITmDispatchListPopProps {
	data: any[];
	totalCnt: number;
	onLoadMore?: () => void;
	customerCurrentPage: number;
}

const TmDispatchListPop = ({ data, totalCnt, onLoadMore, customerCurrentPage }: ITmDispatchListPopProps) => {
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
			fileName: '배차목록_POP별_' + dateUtils.getToDay('YYYYMMDD'),
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
			dataField: 'truthcustCount',
			positionField: 'truthcustCount',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'weight',
			positionField: 'weight',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
		{
			dataField: 'cube',
			positionField: 'cube',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
	];

	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		showFooter: true,
		height: 600,
		showRowAllCheckBox: true,
		enableFilter: true,
	} as any;

	const gridCol = [
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
		{
			headerText: '배송일자',
			dataField: 'deliverydt',
			dataType: 'date',
			textAlign: 'center',
		},
		// {
		// 	headerText: '대표 POP',
		// 	dataField: 'basePopno',
		// 	dataType: 'code',
		// },
		{
			headerText: 'POP 번호',
			dataField: 'popno',
			dataType: 'code',
		},
		{
			headerText: '롤테이너 번호',
			dataField: 'rolltainerNo',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return value === '0' || value === 0 ? '미지정' : value;
			},
		},
		{
			headerText: '차량번호',
			dataField: 'carno',
			dataType: 'code',
		},
		{
			headerText: '고객처 수',
			dataField: 'truthcustCount',
			dataType: 'numeric',
			formatString: '#,##0',
		},
		{
			headerText: '중량(kg)',
			dataField: 'weight',
			dataType: 'numeric',
			formatString: '#,##0.00',
		},
		{
			headerText: '체적(m³)',
			dataField: 'cube',
			dataType: 'numeric',
			formatString: '#,##0.00',
		},
	];

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

	useEffect(() => {
		if (gridRef.current && data) {
			// gridRef.current.setGridData(data);
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

export default TmDispatchListPop;
