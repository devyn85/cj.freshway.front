/*
 ############################################################################
 # FiledataField	: StateGridSample.tsx
 # Description		: 그리드 표현 샘플
 # Author			: 
 # Since			: 25.06.05
 ############################################################################
 */

// Libs
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Components
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import { GridBtnPropsType } from '@/types/common';

// Style & CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

const imageRendererFakeURL = 'calcalFrame-Gnb-Ci.svg';

const StateGridSample = () => {
	// AUI Grid Component 제어를 위한 Ref
	const gridRef = useRef(null);

	const gridDate = [
		{
			id: '#Cust0',
			date: '20241008',
			name: 'Anna',
			country: 'Japan',
			flag: 'japan.png',
			product: 'Galaxy S25 Ultra',
			sku: '810681',
			color: 'Green',
			quantity: 3.123456789,
			price: 500000,
			regId: 'hyeyeon822',
			imageRenderer: 'icon-aui-grid-type-0.svg',
			progress: Math.floor(commUtil.secureRandom(100)),
		},
		{
			id: '#Cust1',
			date: '2024-10-07 13:30:10',
			name: 'Emma',
			country: 'Korea',
			flag: 'korea.png',
			product: 'Galaxy Note21',
			sku: 'S03710',
			color: 'Orange',
			quantity: 23.554477,
			price: 52700,
			regId: 'hyeyeon822',
			imageRenderer: 'icon-aui-grid-type-1.svg',
			progress: Math.floor(commUtil.secureRandom(100)),
		},
		{
			id: '#Cust2',
			date: '20241006140000',
			name: 'Steve',
			country: 'China',
			flag: 'china.png',
			product: 'Galaxy Note21',
			sku: '810681',
			color: 'Violet',
			quantity: 10.7366,
			price: 287100,
			regId: 'hyeyeon822',
			imageRenderer: 'icon-aui-grid-type-2.svg',
			progress: Math.floor(commUtil.secureRandom(100)),
		},
		{
			id: '#Cust3',
			date: '2024-10-05',
			name: 'Kim',
			country: 'Ireland',
			flag: 'ireland.png',
			product: 'Galaxy Note21',
			sku: '810681',
			color: 'Gray',
			quantity: 12,
			price: 368700,
			regId: 'hyeyeon822',
			imageRenderer: imageRendererFakeURL,
		},
		{
			id: '#Cust4',
			date: '2024-10-04',
			name: 'Lowrence',
			country: 'Ireland',
			flag: 'ireland.png',
			product: 'IPhone 16',
			sku: '810681',
			color: 'Yellow',
			quantity: 12,
			price: 188800,
			regId: 'hyeyeon822',
			imageRenderer: imageRendererFakeURL,
			progress: Math.floor(commUtil.secureRandom(100)),
		},
		{
			id: '#Cust5',
			date: '2024-10-03',
			name: 'Steve',
			country: 'Italy',
			flag: 'italy.png',
			product: 'IPhone 16',
			sku: '810681',
			color: 'Green',
			quantity: 15,
			price: 425800,
			regId: 'hyeyeon822',
			imageRenderer: imageRendererFakeURL,
			progress: Math.floor(commUtil.secureRandom(100)),
		},
		{
			id: '#Cust6',
			date: '2024-10-02',
			name: 'Jennifer',
			country: 'Japan',
			flag: 'japan.png',
			product: 'Galaxy Note21',
			sku: '810681',
			color: 'Gray',
			quantity: 7,
			price: 199100,
			regId: 'hyeyeon822',
			imageRenderer: imageRendererFakeURL,
			progress: Math.floor(commUtil.secureRandom(100)),
		},
		{
			id: '#Cust7',
			date: '2024-10-01',
			name: 'Anna',
			country: 'China',
			flag: 'china.png',
			product: 'Galaxy S25 Ultra',
			sku: '810681',
			color: 'Blue',
			quantity: 10,
			price: 870800,
			regId: 'hyeyeon822',
			imageRenderer: imageRendererFakeURL,
			progress: Math.floor(commUtil.secureRandom(100)),
		},
		{
			id: '#Cust8',
			date: '2024-09-30',
			name: 'Kim',
			country: 'Korea',
			flag: 'korea.png',
			product: 'IPhone 16',
			sku: '810681',
			color: 'Pink',
			quantity: 1.22338,
			price: 379900,
			regId: 'hyeyeon822',
			imageRenderer: imageRendererFakeURL,
			progress: Math.floor(commUtil.secureRandom(100)),
		},
		{
			id: '#Cust9',
			date: '2024-09-29',
			name: 'Kim',
			country: 'UK',
			flag: 'uk.png',
			product: 'Galaxy S25 Ultra',
			sku: '810681',
			color: 'Yellow',
			quantity: 9,
			price: 848000,
			regId: 'hyeyeon822',
			imageRenderer: imageRendererFakeURL,
			progress: Math.floor(commUtil.secureRandom(100)),
		},
		{
			id: '#Cust10',
			date: '2024-09-28',
			name: 'Emma',
			country: 'UK',
			flag: 'uk.png',
			product: 'Galaxy S25',
			sku: '810681',
			color: 'Green',
			quantity: 9,
			price: 701900,
			regId: 'hyeyeon822',
			imageRenderer: imageRendererFakeURL,
			progress: Math.floor(commUtil.secureRandom(100)),
		},
		{
			id: '#Cust11',
			date: '2024-09-27',
			name: 'Anna',
			country: 'China',
			flag: 'china.png',
			product: 'Galaxy Note21',
			sku: '810681',
			color: 'Pink',
			quantity: 10,
			price: 605300,
			regId: 'hyeyeon822',
			imageRenderer: imageRendererFakeURL,
			progress: Math.floor(commUtil.secureRandom(100)),
		},
		{
			id: '#Cust12',
			date: '2024-09-26',
			name: 'Jennifer',
			country: 'USA',
			flag: 'usa.png',
			product: 'IPhone 16 Pro',
			sku: '810681',
			color: 'Yellow',
			quantity: 3,
			price: 158100,
			regId: 'hyeyeon822',
			imageRenderer: imageRendererFakeURL,
			progress: Math.floor(commUtil.secureRandom(100)),
		},
		{
			id: '#Cust13',
			date: '2024-09-25',
			name: 'Lowrence',
			country: 'France',
			flag: 'france.png',
			product: 'IPhone 16 Pro',
			sku: '810681',
			color: 'Pink',
			quantity: 1,
			price: 453600,
			regId: 'hyeyeon822',
			imageRenderer: imageRendererFakeURL,
			progress: Math.floor(commUtil.secureRandom(100)),
		},
		{
			id: '#Cust14',
			date: '2024-09-24',
			name: 'Kim',
			country: 'Japan',
			flag: 'japan.png',
			product: 'IPhone 16',
			sku: '810681',
			color: 'Green',
			quantity: 7,
			price: 254800,
			regId: 'hyeyeon822',
			imageRenderer: imageRendererFakeURL,
			progress: 100,
		},
		{
			id: '#Cust15',
			date: '2024-09-23',
			name: 'Emma',
			country: 'China',
			flag: 'china.png',
			product: 'Galaxy S25 Ultra',
			sku: '810681',
			color: 'Green',
			quantity: 10,
			price: 617500,
			regId: 'hyeyeon822',
			imageRenderer: imageRendererFakeURL,
			progress: Math.floor(commUtil.secureRandom(100)),
		},
		{
			id: '#Cust16',
			date: '2024-09-22',
			name: 'Emma',
			country: 'Italy',
			flag: 'italy.png',
			product: 'IPhone 16 Pro',
			sku: '810681',
			color: 'Blue',
			quantity: 15,
			price: 140800,
			regId: 'hyeyeon822',
			imageRenderer: imageRendererFakeURL,
			progress: Math.floor(commUtil.secureRandom(100)),
		},
		{
			id: '#Cust17',
			date: '2024-09-21',
			name: 'Kim',
			country: 'USA',
			flag: 'usa.png',
			product: 'Galaxy S25',
			sku: '810681',
			color: 'Yellow',
			quantity: 3,
			price: 215000,
			regId: 'hyeyeon822',
			imageRenderer: imageRendererFakeURL,
			progress: Math.floor(commUtil.secureRandom(100)),
		},
		{
			id: '#Cust18',
			date: '2024-09-20',
			name: 'Steve',
			country: 'Ireland',
			flag: 'ireland.png',
			product: 'IPhone 16',
			sku: '810681',
			color: 'Green',
			quantity: 12,
			price: 3500,
			regId: 'hyeyeon822',
			imageRenderer: imageRendererFakeURL,
			progress: Math.floor(commUtil.secureRandom(100)),
		},
	];

	// 그리드 칼럼 레이아웃 설정
	const columnLayout = [
		{
			dataField: 'name',
			headerText: 'Name',
			required: true,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any) {
				return 'bg-red'; // CSS 클래스명 반환
			},
		},
		{
			dataField: 'country',
			headerText: 'Country',
			required: true,
		},
		{
			dataField: 'product',
			headerText: 'Product',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any) {
				if (value === 'IPhone 16') {
					return 'color-info';
				} else {
					return '';
				}
			},
		},
		{
			dataField: 'sku',
			headerText: '상품코드',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current.openPopup(e.item, 'sku');
				},
			},
		},
		{
			dataField: 'quantity',
			headerText: 'Quantity',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'price',
			headerText: 'Price',
			dataType: 'numeric',
			labelFunction: function (rowIndex: any, columnIndex: any, value: any) {
				return commUtil.changeNumberFormatter(value) + ' (원)';
			},
		},
		{
			dataField: 'date',
			dataType: 'date',
			headerText: 'Date',
			editable: false,
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
			},
		},
		{
			dataField: 'regId',
			dataType: 'manager',
			headerText: '등록자',
			editable: false,
		},
		{
			dataField: 'imageRenderer',
			headerText: '이미지렌더러',
			width: 120,
			renderer: {
				type: 'imageRenderer',
				// imgHeight: 10,
				// iconWidth: 10,
				srcFunction: (rowIndex: number, columnIndex: number, value: any) => {
					return `/img/icon/${value}`;
				},
			},
		},
		{
			dataField: 'progress',
			headerText: '프로그레스바',
			width: 200,
			renderer: {
				type: 'BarRenderer',
				min: 0,
				max: 100,
			},
			styleFunction: (rowIndex: number, columnIndex: number, value: any) => {
				if (value >= 80) {
					return 'progress-bar-red';
				} else {
					return 'progress-bar-green';
				}
			},
		},
	];

	// 그리드 속성 설정
	const gridProps = {
		editable: true,
		selectionMode: 'multipleCells',
		// 행 고유 id 에 속하는 필드명 (필드의 값은 중복되지 않은 고유값이여야 함)
		rowIdField: 'id',
		// 새 행 제거 제외 정책 사용
		softRemovePolicy: 'exceptNew',
		// 체크박스 사용
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		// 이전 상태로 복구 사용 (기본값 : true)
		enableRestore: true,
		// 칼럼 끝에서 오른쪽 이동 시 다음 행, 처음 칼럼으로 이동할지 여부
		wrapSelectionMove: true,
		// 엔터키가 다음 행이 아닌 다음 칼럼으로 이동할지 여부 (기본값 : false)
		enterKeyColumnBase: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.country === 'USA') {
				return 'color-danger';
			} else {
				return '';
			}
		},
		isLegacyRemove: true,
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'down', // 아래로
			},
			{
				btnType: 'up', // 위로
			},
			{
				btnType: 'excelForm', // 엑셀양식
			},
			{
				btnType: 'excelUpload', // 엑셀업로드
			},
			{
				btnType: 'excelDownload', // 엑셀다운로드
			},
			{
				btnType: 'copy', // 행복사
			},
			{
				btnType: 'curPlus', // 행삽입 (선택된 row 바로 아래 행추가)
			},
			{
				btnType: 'plus', // 행추가
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'detailView', // 상세보기
			},
			{
				btnType: 'btn1', // 사용자 정의버튼1
			},
			{
				btnType: 'btn2', // 사용자 정의버튼2
			},
			{
				btnType: 'btn3', // 사용자 정의버튼3
			},
			{
				btnType: 'print', // 인쇄
				callBackFn: () => {
					showAlert(null, '인쇄 버튼 호출!!!');
				},
			},
			{
				btnType: 'new', // 신규
			},
			{
				btnType: 'save', // 저장
				callBackFn: () => {
					showAlert(null, '저장 버튼 호출!!!');
				},
			},
			{
				btnType: 'elecApproval', // 전자결재
			},
		],
	};

	// 강제로 수정, 삭제, 행 추가 시키기
	const forceEditing = () => {
		// 강제로 5개 행 수정한 걸로 간주하기 위해 updateRow 실행
		const items2editing: any = [];
		for (let i = 0, len = 5; i < len; i++) {
			items2editing[i] = {
				id: '#Cust' + i,
				name: 'Name 강제 수정' + i,
				country: 'Country 강제 수정' + i,
				product: 'PRD 강제 수정' + i,
				price: Math.floor(commUtil.secureRandom(100000)),
			};
			if (i % 2 === 0) items2editing[i]['quantity'] = Math.floor(commUtil.secureRandom(10));
		}

		// 수정 취소를 보여주기 위해 강제로 수정 만듬.
		gridRef.current.updateRowsById(items2editing);

		// 행인덱스 5,6,7 삭제 하기
		gridRef.current.removeRow([5, 6, 7]);

		// 8번째 인덱스에 행 2개 추가하기
		gridRef.current.addRow(
			[
				{ name: 'New Name', country: 'New Country', product: 'New Product', sku: '810681' },
				{ name: 'New Name', country: 'New Country', product: 'New Product', sku: '810681' },
			],
			8,
		);

		// 0, 0에 포커싱
		gridRef.current.setSelectionByIndex(0, 0);
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(gridDate);

			// 강제로 수정, 삭제, 행 추가 시키기
			forceEditing();
		}
	}, []);

	return (
		<AGrid dataProps={'row-single'}>
			<GridTopBtn gridBtn={gridBtn} />
			<AUIGrid ref={gridRef} columnLayout={columnLayout} gridProps={gridProps} />
		</AGrid>
	);
};

export default StateGridSample;
