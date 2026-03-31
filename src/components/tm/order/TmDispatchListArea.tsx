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

const TmDispatchListArea = ({ data, totalCnt }: any) => {
	const gridRef: any = useRef(null);

	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [{ btnType: 'excelDownload', btnLabel: '엑셀다운로드' }],
	};

	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		showFooter: true,
		height: 600,
		showRowAllCheckBox: true,
		enableFilter: true,
		selectionMode: 'singleRow',
	} as any;

	const gridCol = [
		{ headerText: '순서', dataField: 'rowNo', width: 70 },
		{ headerText: '물류센터', dataField: 'dcNm', width: 120 },
		{ headerText: '배송일자', dataField: 'shipDate', width: 110 },
		{ headerText: '대표 POP', dataField: 'popNm', width: 120 },
		{ headerText: '권역구분', dataField: 'areaType', width: 100 },
		{ headerText: '권역', dataField: 'areaNm', width: 120 },
		{ headerText: '차량 수', dataField: 'carCnt', width: 100 },
		{ headerText: 'POP 수', dataField: 'popCnt', width: 100 },
		{ headerText: '고객사 수', dataField: 'custCnt', width: 100 },
		{ headerText: '물량', dataField: 'qty', width: 100 },
		{ headerText: 'CBM', dataField: 'cbm', width: 100 },
	];

	useEffect(() => {
		const grid = gridRef.current;
		if (grid && Array.isArray(data)) {
			grid.setGridData(data);
		}
	}, [data]);

	return (
		<AGrid>
			<GridTopBtn gridTitle={'권역별 배차목록'} gridBtn={gridBtn} totalCnt={totalCnt} />
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
};

export default TmDispatchListArea;
