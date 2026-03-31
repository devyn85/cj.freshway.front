export const returnOrdersGridOpts = {
	columnLayout: [
		{ headerText: '거래처명', dataField: 'custName' },
		{ headerText: '주소', dataField: 'custAddress', width: 250 },
		{ headerText: '중량(kg)', dataField: 'weight' },
		{ headerText: '체적(m³)', dataField: 'cube' },
		{ headerText: 'OTD(from)', dataField: 'reqdlvtime1From' },
		{ headerText: 'OTD(to)', dataField: 'reqdlvtime1To' },
		{ headerText: '키 종류', dataField: 'keyCustType' },
		{ headerText: '차량번호', dataField: 'defCarno' },
	],
	gridProps: {
		editable: false,
		showRowNumColumn: true,
		enableFilter: true,
		height: 220,
		rowIdField: 'uniqueId',
	},
};
