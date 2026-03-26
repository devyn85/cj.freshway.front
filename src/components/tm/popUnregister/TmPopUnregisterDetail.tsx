/*
 ############################################################################
 # FiledataField	: TmPopUnregisterDetail.tsx
 # Description		: 거래처별POP미등록현황 - 거래처별  POP 미등록 목록
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.02
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Utils

// Type

// Store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';
import TmPopUnregisterDetailCustDelivery from '@/components/tm/popUnregister/TmPopUnregisterDetailCustDelivery';
import TmPopUnregisterDetailRcmdPop from '@/components/tm/popUnregister/TmPopUnregisterDetailRcmdPop';
import TmPopUnregisterRolltaninerPopup from '@/components/tm/popUnregister/TmPopUnregisterRolltaninerPopup';
// import PageGridBtn from '@/components/common/PageGridBtn';

// Type

// API
import { apiPostCustDeliveryList, apiPostRecommendPOPList } from '@/api/tm/apiTmPopUnregister';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';

interface TmPopUnregisterCustListProps {
	gridData: any;
	totalCount: any;
	saveCustXPop: any;
	carRolltainerData: any;
	onChangeCust: (custtype: any, custkey: any) => void;
}

const TmPopUnregisterDetail = forwardRef((props: TmPopUnregisterCustListProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//그리드 ref
	ref.gridRef1 = useRef();
	ref.gridRef2 = useRef();
	ref.gridRef3 = useRef();

	// antd Form 사용
	const [form] = Form.useForm();

	// 그리드 데이터
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);
	const [activeKey, setActiveKey] = useState('1');

	// 롤테이너별 배송 조회 팝업 팝업용 Ref
	const refGridModal = useRef(null);

	// 거래처유형 컬럼 표시
	const custtypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CUSTTYPE', value)?.cdNm;
	};

	// 마감유형 컬럼 표시
	const crossdocktypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CUSTORDERCLOSETYPE', value)?.cdNm;
	};

	// 거래처별 POP 미등록 그리드 컬럼 설정
	const gridCol = [
		// {
		// 	dataField: 'custorderclosetype',
		// 	headerText: t('lbl.CUSTORDERCLOSETYPE'),
		// 	dataType: 'code',
		// 	editable: false,
		// 	labelFunction: crossdocktypeLabelFunc,
		// },
		{
			dataField: 'custtype',
			headerText: t('lbl.STORERTYPE'),
			dataType: 'code',
			editable: false,
			labelFunction: custtypeLabelFunc,
		},
		{
			dataField: 'custkey',
			headerText: t('lbl.CUSTKEY_WD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'custname',
			headerText: t('lbl.CUSTNAME_WD'),
			editable: false,
		},
		{
			dataField: 'diffDays',
			headerText: t('lbl.UNREGISTERED_DAYS'),
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'deliverydateCnt',
			headerText: t('lbl.ORDERDAYS'),
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'skuCnt',
			headerText: t('lbl.DAY_ORDERCOUNT'),
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'orderWeight',
			headerText: t('lbl.WEIGHT_KG_UOM_TODAY'),
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'orderCbm',
			headerText: t('lbl.CUBE_UOM_TODAY'),
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.###',
		},
		{
			dataField: 'address',
			headerText: t('lbl.ADDRESS'),
			editable: false,
		},
	];

	/// 거래처별 POP 미등록 그리드 속성 설정
	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		enableFilter: true,
	};

	// // 배송이력 그리드 컬럼 설정
	// const gridCol2 = [
	// 	{
	// 		dataField: 'dccode',
	// 		visible: false,
	// 	},
	// 	{
	// 		dataField: 'custtype',
	// 		visible: false,
	// 	},
	// 	{
	// 		dataField: 'custkey',
	// 		visible: false,
	// 	},
	// 	{
	// 		dataField: 'deliverydate',
	// 		headerText: t('lbl.DATE'),
	// 		dataType: 'date',
	// 		editable: false,
	// 		formatString: 'yyyy-mm-dd',
	// 	},
	// 	{
	// 		dataField: 'popno',
	// 		headerText: t('lbl.LBL_DELIVERYGROUP'),
	// 		dataType: 'code',
	// 		editable: false,
	// 	},
	// 	{
	// 		dataField: 'carno',
	// 		headerText: t('lbl.CARNO'),
	// 		dataType: 'code',
	// 		editable: false,
	// 	},
	// 	{
	// 		dataField: 'orderweight',
	// 		headerText: t('lbl.ORDERQTY_KG'),
	// 		dataType: 'numeric',
	// 		editable: false,
	// 	},
	// 	{
	// 		dataField: 'rolltainerNo',
	// 		headerText: t('lbl.ROLLTAINER_NO'),
	// 		dataType: 'code',
	// 		editable: false,
	// 		commRenderer: {
	// 			type: 'search',
	// 			onClick: function (e: any) {
	// 				const rowIndex = e.rowIndex;
	// 				const rowItem = e.item;
	// 				refGridModal.current.open({
	// 					srcGridRef: ref.gridRef2,
	// 					rowIndex,
	// 					dccode: rowItem.dccode,
	// 					carno: rowItem.carno,
	// 					popno: rowItem.popno,
	// 					onConfirm: (selectedRows: any[]) => {
	// 						if (!selectedRows || selectedRows.length === 0) return;
	// 						const selectedData = selectedRows[0];
	// 						const updatedRow = {
	// 							...rowItem,
	// 							rolltainerNo: selectedData.rolltainerNo,
	// 						};
	// 						// 해당 행에 값 업데이트
	// 						ref.gridRef2.current.updateRow(updatedRow, rowIndex);
	// 						// 팝업 닫기
	// 						refGridModal.current?.handlerClose();
	// 					},
	// 				});
	// 			},
	// 		},

	// 		// renderer: {
	// 		// 	type: IGrid.RendererKind.IconRenderer,
	// 		// 	iconWidth: 16, // icon 사이즈, 지정하지 않으면 rowHeight에 맞게 기본값 적용됨
	// 		// 	iconHeight: 16,
	// 		// 	iconPosition: 'aisleRight',
	// 		// 	iconTableRef: {
	// 		// 		// icon 값 참조할 테이블 레퍼런스
	// 		// 		//default: iconDate, // default
	// 		// 		default: '/src/lib/AUIGrid/images/search_ico.png',
	// 		// 	},
	// 		// 	onClick: (event: IGrid.IconClickEvent) => {
	// 		// 		// 달력 아이콘 클릭하면 실제로 달력을 띄움.
	// 		// 		// 즉, 수정으로 진입함.
	// 		// 		props.searchCarRolltainerList({}).then((res: any) => {
	// 		// 			handleRolltainerDropdown(event.rowIndex, event.columnIndex);
	// 		// 		});
	// 		// 	},
	// 		// },
	// 	},
	// 	{
	// 		dataField: 'regPop',
	// 		headerText: t('lbl.POP_REG'),
	// 		dataType: 'code',
	// 		editable: false,
	// 		renderer: {
	// 			type: 'ButtonRenderer',
	// 			labelText: t('lbl.REG_TAB'),
	// 			onClick: (event: any) => {
	// 				// 거래처 POP 등록
	// 				props.saveCustXPop([event.item]);
	// 			},
	// 			disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
	// 				// 행 아이템의 롤테이너 컬럼의 값이 있으면 버튼 활성화 처리
	// 				return commUtil.isEmpty(item.rolltainerNo ? item.rolltainerNo.trim() : '');
	// 			},
	// 		},
	// 	},
	// ];

	// // 배송이력 그리드 속성 설정
	// const gridProps2 = {
	// 	editable: true,
	// 	fillColumnSizeMode: false,
	// 	enableColumnResize: true,
	// 	enableFilter: true,
	// };

	// // 추천POP 그리드 컬럼 설정
	// const gridCol3 = [
	// 	{
	// 		dataField: 'popno',
	// 		headerText: t('lbl.LBL_DELIVERYGROUP'),
	// 		dataType: 'code',
	// 		editable: false,
	// 	},
	// 	{
	// 		dataField: 'carno',
	// 		headerText: t('lbl.CARNO'),
	// 		dataType: 'code',
	// 		editable: false,
	// 	},
	// 	{
	// 		dataField: 'avgweight',
	// 		headerText: t('lbl.DAYAVG_DELIVERYWEIGHT_KG'),
	// 		dataType: 'numeric',
	// 		editable: false,
	// 	},
	// 	{
	// 		dataField: 'rolltainerNo',
	// 		headerText: t('lbl.ROLLTAINER_NO'),
	// 		dataType: 'code',
	// 		editable: false,
	// 		commRenderer: {
	// 			type: 'search',
	// 			onClick: function (e: any) {
	// 				const rowIndex = e.rowIndex;
	// 				const rowItem = e.item;
	// 				refGridModal.current.open({
	// 					srcGridRef: ref.gridRef3,
	// 					rowIndex,
	// 					dccode: rowItem.dccode,
	// 					carno: rowItem.carno,
	// 					popno: rowItem.popno,
	// 					onConfirm: (selectedRows: any[]) => {
	// 						if (!selectedRows || selectedRows.length === 0) return;
	// 						const selectedData = selectedRows[0];
	// 						const updatedRow = {
	// 							...rowItem,
	// 							rolltainerNo: selectedData.rolltainerNo,
	// 						};
	// 						// 해당 행에 값 업데이트
	// 						ref.gridRef3.current.updateRow(updatedRow, rowIndex);
	// 						// 팝업 닫기
	// 						refGridModal.current?.handlerClose();
	// 					},
	// 				});
	// 			},
	// 		},
	// 		// renderer: {
	// 		// 	type: IGrid.RendererKind.IconRenderer,
	// 		// 	iconWidth: 16, // icon 사이즈, 지정하지 않으면 rowHeight에 맞게 기본값 적용됨
	// 		// 	iconHeight: 16,
	// 		// 	iconPosition: 'aisleRight',
	// 		// 	iconTableRef: {
	// 		// 		// icon 값 참조할 테이블 레퍼런스
	// 		// 		// default: iconDate, // default
	// 		// 		default: '/src/lib/AUIGrid/images/search_ico.png',
	// 		// 	},
	// 		// 	onClick: (event: IGrid.IconClickEvent) => {
	// 		// 		// 달력 아이콘 클릭하면 실제로 달력을 띄움.
	// 		// 		// 즉, 수정으로 진입함.
	// 		// 		props.searchCarRolltainerList({}).then((res: any) => {
	// 		// 			handleRolltainerDropdown(event.rowIndex, event.columnIndex);
	// 		// 		});
	// 		// 	},
	// 		// },
	// 	},
	// 	{
	// 		dataField: 'regPop',
	// 		headerText: t('lbl.POP_REG'),
	// 		dataType: 'code',
	// 		editable: false,
	// 		renderer: {
	// 			type: 'ButtonRenderer',
	// 			labelText: t('lbl.REG_TAB'),
	// 			onClick: (event: any) => {
	// 				// 거래처 POP 등록
	// 				props.saveCustXPop([event.item]);
	// 			},
	// 			disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
	// 				// 행 아이템의 롤테이너 컬럼의 값이 있으면 버튼 활성화 처리
	// 				return commUtil.isEmpty(item.rolltainerNo ? item.rolltainerNo.trim() : '');
	// 			},
	// 		},
	// 	},
	// 	{
	// 		dataField: 'custtype',
	// 		visible: false,
	// 	},
	// 	{
	// 		dataField: 'custkey',
	// 		visible: false,
	// 	},
	// ];

	// // 추천POP 그리드 속성 설정
	// const gridProps3 = {
	// 	editable: true,
	// 	fillColumnSizeMode: false,
	// 	enableColumnResize: true,
	// 	enableFilter: true,
	// };

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 고객사코드 전달
	 * @param custtype
	 * @param custkey
	 */
	const sendValueToParent = (custtype: any, custkey: any) => {
		props.onChangeCust(custtype, custkey);
	};

	/**
	 * 거래처별 배송이력 조회 및 추천 POP 조회
	 * @param param
	 */
	const searchDetailList = async (param: any) => {
		// 조회 조건 설정
		const params = {
			dccode: param.dccode,
			custtype: param.custtype,
			custkey: param.custkey,
		};

		const [resCustDeliveryList, resRecommendPOPList] = await Promise.all([
			apiPostCustDeliveryList(params),
			apiPostRecommendPOPList(params),
		]);
		setGridData2(resCustDeliveryList.data);
		setGridData3(resRecommendPOPList.data);

		if (ref.gridRef2?.current) {
			ref.gridRef2?.current?.resize('100%', '100%');
		}
		if (ref.gridRef3?.current) {
			ref.gridRef3?.current?.resize('100%', '100%');
		}

		sendValueToParent(param.custtype, param.custkey);
	};

	/**
	 * 탭 클릭 이벤트
	 * @param {string} activeKey 탭 번호
	 */
	const onTabChange = (activeKey: string) => {
		if (activeKey === '1') {
			ref.gridRef2?.current?.resize('100%', '100%');
		} else if (activeKey === '2') {
			ref.gridRef3?.current?.resize('100%', '100%');
		}

		// window.dispatchEvent(new Event('resize'));
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 행 선택 변경
		 * @param {any} event 이벤트
		 */
		// ref.gridRef1?.current.bind('selectionConstraint', (event: any) => {
		// 	// 선택된 Row가 다를 경우에만 검색
		// 	if (event.rowIndex !== event.toRowIndex) {
		// 		// 선택된 행의 상세 정보를 조회한다.
		// 		const selectedRow = ref.gridRef1.current.getItemByRowIndex(event.toRowIndex);
		// 		searchDetailList(selectedRow);
		// 	}
		// });

		// 우클릭시 그리드 기능 미 실행으로 이벤트 변경
		ref.gridRef1?.current.bind('selectionChange', (event: any) => {
			// 선택된 행의 상세 정보를 조회한다.
			const selectedRow = ref.gridRef1.current.getItemByRowIndex(event.primeCell.rowIndex);
			searchDetailList(selectedRow);
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	/**
	 * 데이터를 조회하면 그리드에 추가한다.
	 */
	useEffect(() => {
		const gridRefCur = ref.gridRef1.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.gridData);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.gridData]);

	/**
	 * 데이터를 조회하면 그리드에 추가한다.
	 */
	useEffect(() => {
		const gridRefCur = ref.gridRef2.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(gridData2);

			if (gridData2.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData2]);

	/**
	 * 데이터를 조회하면 그리드에 추가한다.
	 */
	useEffect(() => {
		const gridRefCur = ref.gridRef3.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(gridData3);

			if (gridData3.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData3, ref.gridRef3]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRefFile?.current?.resize?.('100%', '100%');
	}, []);

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: t('lbl.DELIVERY_HISOTY'),
			children: <TmPopUnregisterDetailCustDelivery ref={ref} gridData={gridData2} save={props.saveCustXPop} />,
		},
		{
			key: '2',
			label: t('lbl.RECOMMEND_POP'),
			children: <TmPopUnregisterDetailRcmdPop ref={ref} gridData={gridData3} save={props.saveCustXPop} />,
		},
	];

	return (
		<>
			{/* 상세 영역 정의 */}
			<Splitter
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn
								gridTitle={t('lbl.LIST')}
								totalCnt={props.totalCount}
								gridBtn={{ tGridRef: ref.gridRef1, btnArr: [] }}
							/>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef1} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<TabsArray
						key="TmPopUnregisterDetail-tabs"
						activeKey={activeKey}
						onChange={key => setActiveKey(key)}
						items={tabItems}
					/>,
				]}
			/>

			{/* 롤테이너별 배송 조회 팝업 영역 정의 */}
			<TmPopUnregisterRolltaninerPopup ref={refGridModal} />
		</>
	);
});

export default TmPopUnregisterDetail;
