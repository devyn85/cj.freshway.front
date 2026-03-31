/*
############################################################################
# File: TmPlanDiffGridProps.ts
# Description: TmPlanDiff 페이지의 그리드 컬럼 및 속성 정의
############################################################################
*/

// 좌측 배차결과 비교 그리드 컬럼 
export const diffGridCol: any[] = [
	{
		dataField: 'contractnm',
		dataType: 'code',
		headerText: '구분',
		cellMerge: true,
		mergeRef: 'type',
		mergePolicy: 'restrict',
		style: 'left',
	},
	{
		dataField: 'item',
		dataType: 'code',
		headerText: '항목',
		style: 'left',
	},
	{
		dataField: 'tempDispatch',
		dataType: 'code',
		headerText: '가배차',
		style: 'right',
	},
	{
		dataField: 'confirmed',
		dataType: 'code',
		headerText: '배차확정',
		style: 'right',
	},
	{
		dataField: 'gap',
		dataType: 'code',
		headerText: 'GAP',
		style: 'right',
	},
];

// 우측 상단 차량별 상세 그리드 컬럼
export const vehicleGridCol: any[] = [
	{
		dataField: 'item',
		dataType: 'code',
		headerText: '항목',
		style: 'left',
	},
	{
		dataField: 'tempDispatch',
		dataType: 'code',
		headerText: '가배차',
		style: 'right',
	},
	{
		dataField: 'confirmed',
		dataType: 'code',
		headerText: '배차확정',
		style: 'right',
	},
	{
		dataField: 'gap',
		dataType: 'code',
		headerText: 'GAP',
		style: 'right',
	},
];

// 우측 하단 가착지리스트 그리드 컬럼
export const destinationGridCol: any[] = [
	{
		headerText: '실착지코드',
		dataField: 'code',
		editable: false,
	},
	{
		headerText: '실착지명',
		dataField: 'name',
		editable: false,
		style: 'left',
	},
];

// 그리드 공통 속성
const gridProps: any = {
	editable: false,
	showRowNumColumn: true,
	rowNumHeaderText: 'No.',
	enableFilter: false,
	fillColumnSizeMode: true, // 컬럼 전체 너비 채우기
};

// 좌측 배차결과 비교 그리드 속성
export const diffGridProps: any = {
	...gridProps,
	height: 350,
	showRowNumColumn: false,
	enableCellMerge: true, // 셀병합 활성화
};

// 우측 상단 차량별 상세 그리드 속성
export const vehicleGridProps: any = {
	...gridProps,
	height: 130,
	showRowNumColumn: false,
};

// 우측 하단 착지리스트 그리드 속성
export const destGridProps: any = {
	...gridProps,
	height: 320,
};
