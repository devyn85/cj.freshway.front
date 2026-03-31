/*
 ############################################################################
 # FiledataField : TmDispatchListVehicle.tsx
 # Description   : 배차목록 차량별 그리드
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

interface ITmDispatchListVehicleProps {
	data: any[];
	totalCnt: number;
	onLoadMore?: () => void;
	customerCurrentPage: number;
}

const TmDispatchListVehicle = ({ data, totalCnt, onLoadMore, customerCurrentPage }: ITmDispatchListVehicleProps) => {
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
			fileName: '배차목록_차량별_' + dateUtils.getToDay('YYYYMMDD'),
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

	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		showFooter: true,
		height: 600,
		showRowAllCheckBox: true,
		enableFilter: true,
		// selectionMode: 'singleRow',
	} as any;

	//푸터 설정
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'dccode',
		},
		{
			dataField: 'carno',
			positionField: 'carno',
			operation: 'COUNT',
			expFunction: function (columnValues: any) {
				const uniqueKeys = new Set(columnValues);
				return uniqueKeys.size;
			},
		},
		{
			dataField: 'totalTruthCustCount',
			positionField: 'totalTruthCustCount',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'totalMajorCustCount',
			positionField: 'totalMajorCustCount',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'totalWeight',
			positionField: 'totalWeight',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
		{
			dataField: 'totalCube',
			positionField: 'totalCube',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
		{
			dataField: 'returnYn',
			positionField: 'returnYn',
			operation: 'COUNT',
			expFunction: function (columnValues: any) {
				return columnValues.map((v: any) => v === 'Y').length;
			},
		},
	];

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
		{
			headerText: '배송일자',
			dataField: 'deliverydt',
			dataType: 'date',
			formatString: 'YYYY-MM-DD',
			textAlign: 'center',
		},
		// 차량정보 (부모 - 자식 7개)
		{
			headerText: '차량정보',
			children: [
				{
					headerText: '차량번호',
					dataField: 'carno',
					dataType: 'code',
				},
				{
					headerText: '운송사',
					dataField: 'couriername',
					dataType: 'text',
				},
				{ headerText: '2차운송사', dataField: 'carriername', dataType: 'text' },
				{
					headerText: '기사명',
					dataField: 'drivername',
					dataType: 'code',
				},
				{
					headerText: '계약구분',
					dataField: 'contractname',
					textAlign: 'center',
					dataType: 'user',
				},
				{
					headerText: '배송유형',
					dataField: 'deliverytypename',
					textAlign: 'center',
					dataType: 'user',
				},
				{
					headerText: '톤급',
					dataField: 'carcapacityName',
					textAlign: 'center',
					dataType: 'user',
				},
				{
					headerText: '회차',
					dataField: 'priority',
					textAlign: 'center',
					dataType: 'user',
				},
			],
		},
		{
			headerText: 'POP번호 수',
			dataField: 'totalPopCount',
			dataType: 'numeric',
			formatString: '#,##0',
		},
		{
			headerText: '권역 수',
			dataField: 'totalDistrictCount',
			dataType: 'numeric',
			formatString: '#,##0',
		},
		{
			headerText: '실착지수',
			dataField: 'totalTruthCustCount',
			dataType: 'numeric',
			formatString: '#,##0',
		},
		{
			headerText: '특수조건 고객사수',
			dataField: 'totalMajorCustCount',
			dataType: 'numeric',
			formatString: '#,##0',
		},
		{
			headerText: '중량(kg)',
			dataField: 'totalWeight',
			dataType: 'numeric',
			formatString: '#,##0.00',
		},
		{
			headerText: '체적(m³)',
			dataField: 'totalCube',
			dataType: 'numeric',
			formatString: '#,##0.00',
			labelFunction: function (rowIndex: number, columnIndex: number, value: any) {
				if (value == null || value === '') {
					return '';
				}

				const numValue = Math.round(Number(value));
				return `${commUtil.changeNumberFormatter(numValue)}`;
			},
		},
		// 반품여부
		{
			headerText: '반품여부',
			dataField: 'returnYn',
			dataType: 'code',
		},
	];

	// 스크롤 페이징 훅 적용
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

export default TmDispatchListVehicle;
