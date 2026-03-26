/*
 ############################################################################
 # FiledataField : TmDispatchListHistory.tsx
 # Description   : 배차목록 차량 변경내역 그리드
*/
import AGrid from '@/assets/styled/AGrid/AGrid';
import AGridWrap from '@/assets/styled/AGridWrap/AGridWrap';
import GridTopBtn from '@/components/common/GridTopBtn';
import PagePagination from '@/components/common/PagePagination';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { useEffect, useRef } from 'react';

const TmDispatchListHistory = ({ data, totalCnt }: any) => {
	const gridRef: any = useRef(null);

	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [{ btnType: 'excelDownload', btnLabel: '엑셀다운로드' }],
	};

	const gridProps = {
		editable: false, // 변경내역은 수정 불가
		fillColumnSizeMode: false,
		showFooter: true,
		showRowAllCheckBox: true,
		enableFilter: true,
		selectionMode: 'singleRow',
	} as any;

	const gridCol = [
		{ headerText: '순번', dataField: 'rowNo', width: 70 },
		{ headerText: '배송일자', dataField: 'shipDate', width: 110 },
		{ headerText: '차량번호', dataField: 'carNo', width: 120 },
		{ headerText: '회차', dataField: 'turnNo', width: 80 },
		{ headerText: '배송유형', dataField: 'shipType', width: 100 },
		{ headerText: '실착지코드', dataField: 'shipToCd', width: 120 },
		{ headerText: '고객명', dataField: 'custNm', width: 200 },
		{ headerText: '변경 전 POP코드', dataField: 'beforePopCd', width: 150 },
		{ headerText: '변경 후 POP코드', dataField: 'afterPopCd', width: 150 },
		{ headerText: '변경 전 차량번호', dataField: 'beforeCarNo', width: 150 },
		{ headerText: '변경 후 차량번호', dataField: 'afterCarNo', width: 150 },
		{ headerText: '키 유무', dataField: 'keyYn', width: 80 },
	];

	useEffect(() => {
		const grid = gridRef.current;
		if (grid && Array.isArray(data)) {
			grid.setGridData(data);
		}
	}, [data]);

	return (
		<>
			<AGridWrap className="h100">
				<AGrid>
					<GridTopBtn gridTitle={'차량 변경내역'} gridBtn={gridBtn} totalCnt={totalCnt} />
					<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
				<div style={{ marginTop: 16 }}>
					<PagePagination
						pageSize={50} // 임시값
						//@ts-ignore
						totalCount={totalCnt}
						currentPage={1} // 임시값
						paginate={() => {}}
						onChangePageSize={() => {}}
						pageSizeOptions={[50, 100, 200]}
					/>
				</div>
			</AGridWrap>
		</>
	);
};

export default TmDispatchListHistory;
