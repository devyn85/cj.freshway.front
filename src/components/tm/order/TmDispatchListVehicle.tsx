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

const TmDispatchListVehicle = ({ data, totalCnt }: any) => {
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
		{ headerText: '차량번호', dataField: 'carNo', width: 120 },
		{ headerText: '기사명', dataField: 'driverNm', width: 100 },
		{ headerText: '전화번호', dataField: 'phoneNo', width: 120 },
		{ headerText: '계약유형', dataField: 'contractType', width: 100 },
		{ headerText: '배송유형', dataField: 'shipType', width: 100 },
		{ headerText: '회차', dataField: 'turnNo', width: 80 },
		{ headerText: 'POP여부', dataField: 'popYn', width: 80 },
		{ headerText: '권역', dataField: 'areaNm', width: 120 },
		{ headerText: '권역그룹', dataField: 'areaGroupNm', width: 120 },
		{ headerText: '주소', dataField: 'addr', width: 250 },
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
			<GridTopBtn gridTitle={'차량별 배차목록'} gridBtn={gridBtn} totalCnt={totalCnt} />
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
};

export default TmDispatchListVehicle;
