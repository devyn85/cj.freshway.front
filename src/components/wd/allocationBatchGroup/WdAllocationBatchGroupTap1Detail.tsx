/*
 ############################################################################
 # FiledataField	: WdAllocationBatchGroupTap1Detail.tsx
 # Description		: 출고재고분배-자동분배(Detail)
 # Author			: 공두경
 # Since			: 25.07.08
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
import { Button } from 'antd';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// API Call Function
import { apiGetMasterList } from '@/api/ms/apiMsPickBatchGroup';
import {
	apiGetTab1CustList,
	apiGetTab1SkuList,
	apiGetTab1SlipList,
	apiGetTab1ZoneList,
} from '@/api/wd/apiWdAllocationBatchGroup';
import CmPickingPopup from '@/components/cm/popup/CmPickingPopup';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';

// hooks

const WdAllocationBatchGroupTap1Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef1 = useRef(null);
	ref.gridRef2 = useRef(null);
	ref.gridRef3 = useRef(null);
	ref.gridRef4 = useRef(null);

	ref.popupGridRef = useRef(null);

	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);
	const refModal = useRef(null);

	const [popupList, setPopupList] = useState([]);

	const [totalCount, setTotalCount] = useState(0);
	const [activeDetailKey, setActiveDetailKey] = useState('1');

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	const resizeAllGridsRaf = useCallback(() => {
		// rAF 2번으로 레이아웃 확정 이후 resize되게 보강(탭/스크롤 복귀 시 footer/sticky 안정화)
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				ref.gridRef?.current?.resize?.('100%', '100%');
				ref.gridRef1?.current?.resize?.('100%', '100%');
				ref.gridRef2?.current?.resize?.('100%', '100%');
				ref.gridRef3?.current?.resize?.('100%', '100%');
				ref.gridRef4?.current?.resize?.('100%', '100%');
			});
		});
	}, [ref]);

	const searchDtl = (key: any) => {
		const selectedRow = ref.gridRef.current.getSelectedRows();
		const searchParams = props.form.getFieldsValue();
		const params = {
			dccode: selectedRow[0].dccode,
			storerkey: selectedRow[0].storerkey,
			plant: selectedRow[0].plant,
			batchgroup: selectedRow[0].batchgroup,
			storagetype: selectedRow[0].storagetype,
			distancetype: selectedRow[0].distancetype,
			createkey: selectedRow[0].createkey,
			createtype: 'BATCHGROUP',
			slipdt: selectedRow[0].slipdt,
			serialyn: selectedRow[0].serialyn,
			toCustkey: searchParams.toCustkey,
			sku: searchParams.sku,
			zone: searchParams.zone,
			fixdccode: searchParams.fixdccode,
		};

		if (key === '1') {
			ref.gridRef1.current?.resize('100%', '100%');
			apiGetTab1CustList(params).then(res => {
				const gridData = res.data;
				ref.gridRef1.current?.setGridData(gridData);
				//setTotalCnt(res.data.length);
				const colSizeList = ref.gridRef1.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef1.current?.setColumnSizeList(colSizeList);
			});
		} else if (key === '2') {
			ref.gridRef2.current?.resize('100%', '100%');
			apiGetTab1SlipList(params).then(res => {
				const gridData = res.data;
				ref.gridRef2.current?.setGridData(gridData);
				//setTotalCnt(res.data.length);
				const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef2.current?.setColumnSizeList(colSizeList);
			});
		} else if (key === '3') {
			ref.gridRef3.current?.resize('100%', '100%');
			apiGetTab1SkuList(params).then(res => {
				const gridData = res.data;
				ref.gridRef3.current?.setGridData(gridData);
				//setTotalCnt(res.data.length);
				const colSizeList = ref.gridRef3.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef3.current?.setColumnSizeList(colSizeList);
			});
		} else if (key === '4') {
			ref.gridRef4.current?.resize('100%', '100%');
			apiGetTab1ZoneList(params).then(res => {
				const gridData = res.data;
				ref.gridRef4.current?.setGridData(gridData);
				//setTotalCnt(res.data.length);
				const colSizeList = ref.gridRef4.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef4.current?.setColumnSizeList(colSizeList);
			});
		}
	};

	/**
	 * 배치별분배
	 */
	const onClickBatch = () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		if (ref.gridRef.current.getGridData()[0].serialyn == 'Y') {
			showAlert(null, '식별번호유무 대상 상품은 지정분배로 처리하시기 바랍니다.'); // 식별번호가 있는 배치별분배는 선택할 수 없습니다.
			return;
		}
		const searchParams = props.form.getFieldsValue();

		showConfirm(null, '주문마감 반영 진행하셨나요?\n\n선택한 생성키 전체가 분배됩니다. 분배하시겠습니까?', () => {
			const params = {
				apiUrl: '/ltx/wd/allocationBatchGroup/v1.0/saveBatch',
				avc_COMMAND: 'CONFIRM_BATCHGROUP',
				allocfixtype: searchParams.allocfixtype,
				saveDataList: checkedRows, // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	/**
	 * STO분배
	 */
	const onClickSTOBatch = () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		if (ref.gridRef.current.getGridData()[0].serialyn == 'Y') {
			showAlert(null, '식별번호유무 대상 상품은 지정분배로 처리하시기 바랍니다.'); // 식별번호가 있는 배치별분배는 선택할 수 없습니다.
			return;
		}
		const searchParams = props.form.getFieldsValue();

		showConfirm(null, '주문마감 반영 진행하셨나요?\n\n선택한 생성키 중 STO대상이 분배됩니다. 분배하시겠습니까?', () => {
			const params = {
				apiUrl: '/api/wd/allocationBatchGroup/v1.0/saveSTOBatch',
				avc_COMMAND: 'CONFIRM_BATCHGROUP_STO',
				searchtype: 'NORMAL',
				saveDataList: checkedRows, // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	/**
	 * 거래처/전표/상품별 분배
	 * @param key
	 */
	const onClickBatchDetail = (key: string) => {
		const searchParams = props.form.getFieldsValue();

		const selectedRow = ref.gridRef.current.getSelectedRows();
		if (selectedRow[0].serialyn === 'Y') {
			showAlert(null, '식별번호유무 대상 상품은 지정분배로 처리하시기 바랍니다.'); // 선택된 행이 없습니다.
			return;
		}

		if (key === '1') {
			const checkedRows = ref.gridRef1.current.getCheckedRowItemsAll();
			// 선택된 행이 없으면 경고 메시지 표시
			if (!checkedRows || checkedRows.length < 1) {
				showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
				return;
			}
			showConfirm(null, t('msg.MSG_COM_CFM_020', ['거래처별분배']), () => {
				const params = {
					apiUrl: '/api/wd/allocationBatchGroup/v1.0/saveBatchDetail1',
					avc_COMMAND: 'CONFIRM_BATCHGROUP_CUST',
					allocfixtype: searchParams.allocfixtype,
					dataKey: 'saveDetail1List',
					saveDataList: checkedRows, // 선택된 행의 데이터
				};

				setLoopTrParams(params);
				modalRef.current.handlerOpen();
			});
		} else if (key === '2') {
			const checkedRows = ref.gridRef2.current.getCheckedRowItemsAll();
			// 선택된 행이 없으면 경고 메시지 표시
			if (!checkedRows || checkedRows.length < 1) {
				showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
				return;
			}
			showConfirm(null, t('msg.MSG_COM_CFM_020', ['전표별분배']), () => {
				const params = {
					apiUrl: '/api/wd/allocationBatchGroup/v1.0/saveBatchDetail2',
					avc_COMMAND: 'CONFIRM_BATCHGROUP_SLIP',
					allocfixtype: searchParams.allocfixtype,
					dataKey: 'saveDetail2List',
					saveDataList: checkedRows, // 선택된 행의 데이터
				};

				setLoopTrParams(params);
				modalRef.current.handlerOpen();
			});
		} else if (key === '3') {
			const checkedRows = ref.gridRef3.current.getCheckedRowItemsAll();
			// 선택된 행이 없으면 경고 메시지 표시
			if (!checkedRows || checkedRows.length < 1) {
				showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
				return;
			}
			showConfirm(null, t('msg.MSG_COM_CFM_020', ['상품별분배']), () => {
				const params = {
					apiUrl: '/api/wd/allocationBatchGroup/v1.0/saveBatchDetail3',
					avc_COMMAND: 'CONFIRM_BATCHGROUP_CUST',
					allocfixtype: searchParams.allocfixtype,
					dataKey: 'saveDetail3List',
					saveDataList: checkedRows, // 선택된 행의 데이터
				};

				setLoopTrParams(params);
				modalRef.current.handlerOpen();
			});
		} else if (key === '4') {
			const checkedRows = ref.gridRef4.current.getCheckedRowItemsAll();
			// 선택된 행이 없으면 경고 메시지 표시
			if (!checkedRows || checkedRows.length < 1) {
				showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
				return;
			}
			showConfirm(null, t('msg.MSG_COM_CFM_020', ['피킹존별분배']), () => {
				const params = {
					apiUrl: '/api/wd/allocationBatchGroup/v1.0/saveBatchDetail4',
					avc_COMMAND: 'CONFIRM_BATCHGROUP_ZONE',
					allocfixtype: searchParams.allocfixtype,
					dataKey: 'saveDetail4List',
					saveDataList: checkedRows, // 선택된 행의 데이터
				};

				setLoopTrParams(params);
				modalRef.current.handlerOpen();
			});
		}
	};

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */

	const tabClick = (key: string, e: any) => {
		// props.setActiveKey(key);
		if (ref.gridRef.current?.getGridData?.().length > 0) {
			searchDtl(key);
		}
		// 탭 전환 직후 레이아웃/높이 확정 후 resize 보강
		resizeAllGridsRaf();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
		props.search();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEventPopup = () => {
		refModal.current?.handlerClose();
	};
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.TASKDT_WD'), //작업지시일자
			dataField: 'slipdt',
			dataType: 'date',
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8); // 날짜 형식으로 변환
			},
		},
		{
			headerText: t('lbl.BATCHINFO'), //배치정보
			children: [
				{ headerText: t('lbl.PLANT'), /*플랜트*/ dataField: 'plant', dataType: 'code' },
				{ headerText: t('lbl.STORAGETYPE'), /*저장조건*/ dataField: 'storagetypedesc', dataType: 'code' },
				{ headerText: t('lbl.PICKING_DISTANCETYPE'), /*피킹(원거리)유형*/ dataField: 'distancetype', dataType: 'code' },
			],
		},
		{
			headerText: t('lbl.CREATEBASELINE'), //생성기준
			children: [
				{ headerText: t('lbl.CREATEKEY'), /*생성키*/ dataField: 'createkey', dataType: 'code' },
				{ headerText: t('lbl.CREATEDESCR'), /*생성키명*/ dataField: 'createdescr' },
			],
		},
		{ headerText: t('lbl.SERIALYN'), /*식별번호유무*/ dataField: 'serialyn', dataType: 'code' },
		{
			headerText: t('lbl.STOREROPENQTY'),
			/*주문량*/ dataField: 'orderqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.QTYALLOCATED'),
			/*분배량*/ dataField: 'processqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.WD_STO_QTY'),
			/*STO할당량*/ dataField: 'stoqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			headerText: t('lbl.PROCESSOPENQTY'),
			/*미분배량*/ dataField: 'processopenqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		autoGridHeight: false, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: true,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'slipdt',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'processqty',
			positionField: 'processqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'stoqty',
			positionField: 'stoqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'processopenqty',
			positionField: 'processopenqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1',
				btnLabel: '배치별분배', // 배치별분배
				callBackFn: onClickBatch,
			},
			{
				btnType: 'btn9',
				btnLabel: 'STO분배', // STO분배
				callBackFn: onClickSTOBatch,
			},
		],
	};

	//그리드 컬럼(거래처별 그리드)
	const gridCol1 = [
		{
			headerText: t('lbl.TO_CUSTKEY_WD'), //관리처코드
			dataField: 'toCustkey',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.toCustkey,
						},
						'cust',
					);
				},
			},
		},
		{
			headerText: t('lbl.TO_CUSTNAME'), //배송인도처명
			dataField: 'toCustname',
			filter: {
				showIcon: true,
			},
		},
		{ headerText: t('lbl.ORDERTYPE_WD'), /*주문유형*/ dataField: 'ordertypeDescr', dataType: 'code' },
		{
			headerText: t('lbl.CLOSEYN'), //마감여부
			dataField: 'omsFlag',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				// omsFlag가 0이면 'Y', 0이 아니면 'N' 반환
				return value === 0 || value === '0' ? 'Y' : 'N';
			},
		},
		{ headerText: t('lbl.NONCLOSEQTY'), /*미마감건수*/ dataField: 'omsFlag', dataType: 'code' },
		{ headerText: t('lbl.SLIPCNT'), /*전표수*/ dataField: 'slipcnt', dataType: 'code' },
		{ headerText: t('lbl.SKUCNT'), /*상품수*/ dataField: 'skucnt', dataType: 'code' },
		{
			headerText: t('lbl.QTYINFO') /*수량정보*/,
			children: [
				{
					headerText: t('lbl.ORDERQTY_2'),
					/*주문량*/ dataField: 'orderqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.PROCESSQTY_WD'),
					/*분배량*/ dataField: 'processqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.WORKQTY_WD'),
					/*피킹량*/ dataField: 'workqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.LOADSCANQTY'),
					/*상차스캔량*/ dataField: 'inspectqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.WDCONFIRMQTY_WD2'),
					/*출고확정량*/ dataField: 'confirmqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
			],
		},
		{ headerText: t('lbl.WORKPROCESSCODE'), /*작업프로세스코드*/ dataField: 'workprocesscode', dataType: 'code' },
	];

	// 그리드 Props(거래처별 그리드)
	const gridProps1 = {
		editable: false,
		autoGridHeight: false, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: true,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// rowStyleFunction 함수 정의
		// 이 함수는 각 행이 렌더링될 때마다 호출됩니다.
		rowStyleFunction: function (rowIndex: any, item: any) {
			// item은 현재 행의 데이터 객체입니다.
			//console.log(('rowIndex:' + rowIndex + ', orderqty:' + item.orderqty + ', processqty:' + item.processqty);
			if (item.orderqty == item.processqty) {
				return 'color-info'; // CSS 클래스 이름 반환
			}
			return ''; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
		},
	};

	// FooterLayout Props(거래처별 그리드)
	const footerLayout1 = [
		{
			labelText: '합계',
			positionField: 'toCustkey',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'processqty',
			positionField: 'processqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'workqty',
			positionField: 'workqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn2',
				btnLabel: '거래처별분배', // 거래처별분배
				callBackFn: () => {
					onClickBatchDetail('1');
				},
			},
		],
	};

	//그리드 컬럼(전표별 그리드)
	const gridCol2 = [
		{ headerText: t('lbl.SLIPNO'), /*전표번호*/ dataField: 'slipno', dataType: 'code' },
		{
			headerText: t('lbl.TO_CUSTKEY_WD') /*관리처코드*/,
			dataField: 'toCustkey',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.toCustkey,
						},
						'cust',
					);
				},
			},
		},
		{
			headerText: t('lbl.TO_CUSTNAME') /*배송인도처명*/,
			dataField: 'toCustname',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{ headerText: t('lbl.ORDERTYPE_WD'), /*주문유형*/ dataField: 'ordertypeDescr', dataType: 'code' },
		{
			headerText: t('lbl.OMS_CLOSE_YN') /*OMS마감여부*/,
			dataField: 'omsFlag',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				// omsFlag가 0이면 'Y', 0이 아니면 'N' 반환
				return value === 0 || value === '0' ? 'Y' : 'N';
			},
		},
		{ headerText: t('lbl.OMS_NONCLOSE_QTY'), /*OMS미마감건수*/ dataField: 'omsFlag', dataType: 'code' },
		{
			headerText: t('lbl.QTYINFO') /*수량정보*/,
			children: [
				{
					headerText: t('lbl.ORDERQTY_2'),
					/*주문량*/ dataField: 'orderqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.PROCESSQTY_WD'),
					/*분배량*/ dataField: 'processqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.WORKQTY_WD'),
					/*피킹량*/ dataField: 'workqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.LOADSCANQTY'),
					/*상차스캔량*/ dataField: 'inspectqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.WDCONFIRMQTY_WD2'),
					/*출고확정량*/ dataField: 'confirmqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
			],
		},
	];

	// FooterLayout Props(전표별 그리드)
	const footerLayout2 = [
		{
			labelText: '합계',
			positionField: 'slipno',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'processqty',
			positionField: 'processqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'workqty',
			positionField: 'workqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn2: GridBtnPropsType = {
		tGridRef: ref.gridRef2, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn3',
				btnLabel: '전표별분배', // 전표별분배
				callBackFn: () => {
					onClickBatchDetail('2');
				},
			},
		],
	};

	//그리드 컬럼(상품별 그리드)
	const gridCol3 = [
		{
			headerText: t('lbl.SKU'), //상품코드
			dataField: 'sku',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							sku: e.item.sku,
						},
						'sku',
					);
				},
			},
		},
		{
			headerText: t('lbl.SKUNAME'), //상품명칭
			dataField: 'skuname',
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: t('lbl.CLOSEYN'), //마감여부
			dataField: 'omsFlag',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				// omsFlag가 0이면 'Y', 0이 아니면 'N' 반환
				return value === 0 || value === '0' ? 'Y' : 'N';
			},
		},
		{ headerText: t('lbl.NONCLOSEQTY'), /*미마감건수*/ dataField: 'omsFlag', dataType: 'code' },
		{ headerText: t('lbl.SLIPCNT'), /*전표수*/ dataField: 'slipcnt', dataType: 'code' },
		{ headerText: t('lbl.SKUCNT'), /*상품수*/ dataField: 'skucnt', dataType: 'code' },
		{
			headerText: t('lbl.QTYINFO') /*수량정보*/,
			children: [
				{
					headerText: t('lbl.ORDERQTY_2'),
					/*주문량*/ dataField: 'orderqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.PROCESSQTY_WD'),
					/*분배량*/ dataField: 'processqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.WORKQTY_WD'),
					/*피킹량*/ dataField: 'workqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.LOADSCANQTY'),
					/*상차스캔량*/ dataField: 'inspectqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.WDCONFIRMQTY_WD2'),
					/*출고확정량*/ dataField: 'confirmqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
			],
		},
		{ headerText: t('lbl.WORKPROCESSCODE'), dataField: 'workprocesscode', dataType: 'code' },
	];

	// FooterLayout Props(상품별 그리드)
	const footerLayout3 = [
		{
			labelText: '합계',
			positionField: 'sku',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'processqty',
			positionField: 'processqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'workqty',
			positionField: 'workqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn3: GridBtnPropsType = {
		tGridRef: ref.gridRef3, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn4',
				btnLabel: '상품별분배', // 상품별분배
				callBackFn: () => {
					onClickBatchDetail('3');
				},
			},
		],
	};

	//그리드 컬럼(피킹존별 그리드)
	const gridCol4 = [
		{ headerText: t('lbl.ZONE'), /*피킹존*/ dataField: 'zone', dataType: 'code' },
		{
			headerText: t('lbl.CLOSEYN') /*마감여부*/,
			dataField: 'omsFlag',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				// omsFlag가 0이면 'Y', 0이 아니면 'N' 반환
				return value === 0 || value === '0' ? 'Y' : 'N';
			},
		},
		{ headerText: t('lbl.NONCLOSEQTY'), /*미마감건수*/ dataField: 'omsFlag', dataType: 'code' },
		{ headerText: t('lbl.SLIPCNT'), /*전표수*/ dataField: 'slipcnt', dataType: 'code' },
		{ headerText: t('lbl.SKUCNT'), /*상품수*/ dataField: 'skucnt', dataType: 'code' },
		{
			headerText: t('lbl.QTYINFO') /*수량정보*/,
			children: [
				{
					headerText: t('lbl.ORDERQTY_2'),
					/*주문량*/ dataField: 'orderqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.PROCESSQTY_WD'),
					/*분배량*/ dataField: 'processqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.WORKQTY_WD'),
					/*피킹량*/ dataField: 'workqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.LOADSCANQTY'),
					/*상차스캔량*/ dataField: 'inspectqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
				{
					headerText: t('lbl.WDCONFIRMQTY_WD2'),
					/*출고확정량*/ dataField: 'confirmqty',
					dataType: 'numeric',
					formatString: '#,##0.##',
				},
			],
		},
	];

	// FooterLayout Props(피킹존별 그리드)
	const footerLayout4 = [
		{
			labelText: '합계',
			positionField: 'zone',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'processqty',
			positionField: 'processqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'workqty',
			positionField: 'workqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'inspectqty',
			positionField: 'inspectqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn4: GridBtnPropsType = {
		tGridRef: ref.gridRef4, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn5',
				btnLabel: '피킹존별분배', // 피킹존별분배
				callBackFn: () => {
					onClickBatchDetail('4');
				},
			},
		],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			if (ref.gridRef1.current) {
				ref.gridRef1.current.clearGridData();
			}
			if (ref.gridRef2.current) {
				ref.gridRef2.current.clearGridData();
			}
			if (ref.gridRef3.current) {
				ref.gridRef3.current.clearGridData();
			}
			if (ref.gridRef4.current) {
				ref.gridRef4.current.clearGridData();
			}
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 1);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);

				searchDtl(activeDetailKey);
			}
		}
	}, [props.data]);

	let prevRowItem: any = null;
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (!gridRefCur) return;

		// 기존 이벤트 해제(중복 방지)
		gridRefCur?.unbind && gridRefCur?.unbind('selectionChange');

		// 새로운 이벤트 바인딩
		gridRefCur?.bind('selectionChange', function (event: any) {
			// 선택된 Row의 item이 다를 경우에만 검색
			if (event.primeCell.item === prevRowItem || event.primeCell.dataField === 'customRowCheckYn') return;

			// 이전 행 item 갱신
			prevRowItem = event.primeCell.item;

			searchDtl(activeDetailKey);
		});
	}, [activeDetailKey]);

	/**
	 * gridRef1 cellDoubleClick 이벤트 바인딩
	 */
	const initGridRef1CellDoubleClick = () => {
		ref.gridRef1.current?.unbind('cellDoubleClick');
		ref.gridRef1.current?.bind('cellDoubleClick', function (event: any) {
			if (event.item.serialyn === 'Y' && event.item.workprocesscode === 'SO' && event.item.dccode !== '2170') {
				showAlert(null, '물류센터 식별번호유무 대상 고객출고는 PDA로 피킹작업을 하시기 바랍니다.');
				return;
			}
			props.callBack();
		});
	};

	useEffect(() => {
		// ref.gridRef1.current?.unbind('cellDoubleClick');
		// ref.gridRef1.current?.bind('cellDoubleClick', function (event: any) {
		// 	if (event.item.serialyn === 'Y' && event.item.workprocesscode === 'SO' && event.item.dccode !== '2170') {
		// 		showAlert(null, '물류센터 식별번호유무 대상 고객출고는 PDA로 피킹작업을 하시기 바랍니다.');
		// 		return;
		// 	}
		// 	props.callBack();
		// });

		// 202260301@tab이 같은 화일에 있어 컴퍼넌트 렌더링이 초기화되어 함수로 변경하여 바인딩이 풀리는 현상으로 인해 useEffect로 감싸서 탭 변경 시마다
		setTimeout(() => {
			initGridRef1CellDoubleClick();
		}, 10);
	}, [activeDetailKey]);

	// 탭 활성 변경 시(스크롤로 화면 밖/복귀 포함) resize 보강
	useEffect(() => {
		resizeAllGridsRaf();
	}, [props.activeKey, resizeAllGridsRaf]);

	/**
	 * API 조회
	 * @returns {void}
	 */
	const popupPicking = () => {
		setPopupList([]);
		setTotalCount(0);
		const params = {
			multiDcCode: [props.form.getFieldValue('fixdccode')],
		};
		apiGetMasterList(params).then((res: any) => {
			const popData = res.data;
			refModal.current?.handlerOpen();
			//popData = _.uniqBy(popData, 'distanceType');
			setPopupList(popData);
			// 팝업 발생 후 데이터 적용
			if (popData.length > -1) {
				setTotalCount(popData.length);
			}
		});
	};

	const tabItems = [
		{
			key: '1',
			label: '거래처별',
			children: (
				<>
					<AGrid className="form-inner" style={{ marginTop: '15px', marginBottom: '10px' }}>
						<GridTopBtn gridBtn={gridBtn1} gridTitle="거래처별" />
					</AGrid>
					<GridAutoHeight id="cust">
						<AUIGrid ref={ref.gridRef1} columnLayout={gridCol1} gridProps={gridProps1} footerLayout={footerLayout1} />
					</GridAutoHeight>
				</>
			),
		},
		{
			key: '2',
			label: '전표별',
			children: (
				<>
					<AGrid className="form-inner" style={{ marginTop: '15px' }}>
						<div className="fix-title">
							<GridTopBtn gridBtn={gridBtn2} gridTitle="전표별" />
						</div>
					</AGrid>
					<GridAutoHeight id="slip">
						<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps1} footerLayout={footerLayout2} />
					</GridAutoHeight>
				</>
			),
		},
		{
			key: '3',
			label: '상품별',
			children: (
				<>
					<AGrid className="form-inner" style={{ marginTop: '15px' }}>
						<div className="fix-title">
							<GridTopBtn gridBtn={gridBtn3} gridTitle="상품별" />
						</div>
					</AGrid>
					<GridAutoHeight id="item">
						<AUIGrid ref={ref.gridRef3} columnLayout={gridCol3} gridProps={gridProps1} footerLayout={footerLayout3} />
					</GridAutoHeight>
				</>
			),
		},
		{
			key: '4',
			label: '피킹존별',
			children: (
				<>
					<AGrid className="form-inner" style={{ marginTop: '15px' }}>
						<div className="fix-title">
							<GridTopBtn gridBtn={gridBtn4} gridTitle="피킹존별" />
						</div>
					</AGrid>
					<GridAutoHeight id="picking-zone">
						<AUIGrid ref={ref.gridRef4} columnLayout={gridCol4} gridProps={gridProps1} footerLayout={footerLayout4} />
					</GridAutoHeight>
				</>
			),
		},
	];

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef1?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
		ref.gridRef3?.current?.resize?.('100%', '100%');
		ref.gridRef4?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn
								gridBtn={gridBtn}
								gridTitle="자동분배목록"
								totalCnt={props.totalCnt}
								style={{ marginTop: '15px', marginBottom: '10px' }}
							>
								<Button onClick={() => popupPicking()}>{'피킹그룹'}</Button>
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight id="picking-group">
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<TabsArray
						key="picking-groups-tabs"
						activeKey={activeDetailKey}
						onChange={key => {
							// props.setActiveKey(key);
							setActiveDetailKey(key);
							tabClick(key, null);
						}}
						items={tabItems}
					/>,
				]}
			/>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
			<CustomModal ref={refModal} width="1280px">
				<CmPickingPopup
					callBack={closeEventPopup}
					close={closeEventPopup}
					gridData={popupList}
					totalCount={totalCount}
					gridRef={ref.popupGridRef}
					form={props.form}
					name="pickinggroup"
					dccode={props.form.getFieldValue('fixdccode')}
				/>
			</CustomModal>
		</>
	);
});

export default WdAllocationBatchGroupTap1Detail;
