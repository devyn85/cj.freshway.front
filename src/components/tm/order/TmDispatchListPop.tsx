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

const TmDispatchListPop = ({ data, totalCnt }: any) => {
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
		{ headerText: 'POP 수', dataField: 'popCnt', width: 100 },
		{ headerText: '배송유형', dataField: 'shipType', width: 100 },
		{ headerText: '차량번호', dataField: 'carNo', width: 120 },
		{ headerText: '회차', dataField: 'turnNo', width: 80 },
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
			<GridTopBtn gridTitle={'POP별 배차목록'} gridBtn={gridBtn} totalCnt={totalCnt} />
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
};

export default TmDispatchListPop;
