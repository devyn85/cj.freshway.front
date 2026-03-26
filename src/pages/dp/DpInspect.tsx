/*
 ############################################################################
 # FiledataField	: DpInspect.tsx
 # Description		: 입고검수처리
 # Author			: jh.jang
 # Since			: 25.05.27
 ############################################################################
 */

// Lib
import { Form, Tabs } from 'antd';
import dayjs from 'dayjs';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import DpInspectDetail from '@/components/dp/inspect/DpInspectDetail';
import DpInspectMaster from '@/components/dp/inspect/DpInspectMaster';
import DpInspectSearch from '@/components/dp/inspect/DpInspectSearch';

// Util
import { validateForm } from '@/util/FormUtil';

// API Call Function
import { apiGetDpInspectDetailList, apiGetDpInspectMasterList, apiGetDpInspectTotalList } from '@/api/dp/apiDpInspect';

import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';
import DpInspectTotal from '@/components/dp/inspect/DpInspectTotal';

const DpInspect = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	const [detailForm] = Form.useForm();
	const { TabPane } = Tabs;
	const modalRef = useRef(null);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridData1, setGridData1] = useState([]);
	const [gridData2, setGridData2] = useState([]);

	const [isDisabled, setIsDisabled] = useState(true);
	const [totalCnt, setTotalCnt] = useState(0);

	// loop transaction params
	const [loopTrParams, setLoopTrParams] = useState({});

	// 현재 탭 정보
	const [activeKey, setActiveKey] = useState('1');

	// 다국어
	const { t } = useTranslation();

	// 그리드 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		docDtDp: [dayjs(), dayjs()],
		status: null,
		partnerName: null,
		partnerCode: null,
		skuName: null,
		skuCode: null,
		undoneYn: null,
		reasonCode: null,
		channel: null,
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회
	 */
	const searchInspectMasterList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		refs.gridRef.current.clearGridData();
		refs.gridRef1.current.clearGridData();
		refs.gridRef2?.current.clearGridData();

		setIsDisabled(true);
		const params = form.getFieldsValue();
		params.fromSlipdt = params.docDtDp[0].format('YYYYMMDD');
		params.toSlipdt = params.docDtDp[1].format('YYYYMMDD');

		apiGetDpInspectMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	const searchDetailList = () => {
		const selectedRow = refs.gridRef.current.getSelectedRows();
		const params = Object.assign({}, form.getFieldsValue(), selectedRow[0]);

		setActiveKey('1');
		apiGetDpInspectTotalList(params).then(res => {
			refs.gridRef1.current.resize('100%', '100%');
			refs.gridRef1.current.clearGridData();
			refs.gridRef2?.current.clearGridData();
			setGridData1(res.data);
		});
	};

	/**
	 * 저장
	 */
	const saveInspectTotalList = () => {
		const checkedItems = refs.gridRef1.current.getCheckedRowItemsAll();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		//저장하시겠습니까
		showConfirm(null, t('msg.MSG_DP_INSPECT_SAVE'), () => {
			if (refs.gridRef1.current.getCheckedRowItemsAll().length > 0) {
				const saveParams = {
					gDccode: form.getFieldValue('fixdccode'),
					apiUrl: '/api/dp/inspect/v1.0/saveMaster',
					avc_COMMAND: 'CONFIRM',
					saveDataList: refs.gridRef1.current.getCheckedRowItemsAll(),
				};

				setLoopTrParams(saveParams);
				modalRef.current.handlerOpen();
			}
		});
	};

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string, e: any) => {
		const items = refs.gridRef.current.getSelectedItems();
		if (items.length === 0) {
			if (key === '1') {
				setActiveKey('1');
				refs.gridRef1.current.resize('100%', '100%');
			} else {
				setActiveKey('2');
				refs.gridRef2?.current.resize('100%', '100%');
			}
			return;
		}

		//상단 조회FORM 값도 함께 전달
		const params = Object.assign({}, form.getFieldsValue(), items[0].item);

		if (key === '1') {
			setActiveKey('1');
			if (refs.gridRef1.current.getGridData().length !== 0) {
				return;
			} else {
				refs.gridRef1.current.clearGridData();
				apiGetDpInspectTotalList(params).then(res => {
					refs.gridRef1.current.resize('100%', '100%');
					setGridData1(res.data);
				});
			}
		} else {
			setActiveKey('2');
			const grid2Length = refs.gridRef2?.current.getGridData().length ?? 0;
			if (grid2Length !== 0) {
				return;
			} else {
				refs.gridRef2?.current.clearGridData();
				apiGetDpInspectDetailList(params).then(res => {
					refs.gridRef2?.current.resize('100%', '100%');
					setGridData2(res.data);
				});
			}
		}
	};

	/**
	 * 상단 버튼 함수 정의
	 */
	const titleFunc = {
		searchYn: searchInspectMasterList,
	};

	/**
	 * 총량 탭 선택적용 버튼 클릭
	 */
	const clickApplySelect = () => {
		const checkedItems = refs.gridRef1.current.getCheckedRowItemsAll();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		const reasonCode = detailForm.getFieldValue('reasonCode') || '';
		const reasonMsg = detailForm.getFieldValue('reasonMsg') || '';
		refs.gridRef1.current.updateRowsById(
			checkedItems.map((item: any) => ({
				...item,
				inspectReason: reasonCode,
				inspectMsg: reasonMsg,
			})),
		);
	};

	/**
	 * 그리드 이벤트 설정
	 */
	let prevRowIndex: any = null;
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		refs.gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			refs.gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 헤더 그리드 셀 클릭시 상세정보 표시
		 */
		refs.gridRef?.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;
			const field = event.primeCell.dataField;
			if (refs.gridRef.current.getColumnItemByDataField(field)?.renderer?.type == 'DropDownListRenderer') {
				return;
			}

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell?.item?._$uid;
			searchDetailList();
		});
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
		searchInspectMasterList();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	// HTML 랜더링이 완료되면
	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		refs.gridRef?.current?.resize('100%', '100%');
		refs.gridRef1?.current?.resize('100%', '100%');
		refs.gridRef2?.current?.resize('100%', '100%');
	}, [activeKey]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		refs.gridRef?.current?.resize('100%', '100%');
		refs.gridRef1?.current?.resize('100%', '100%');
		refs.gridRef2?.current?.resize('100%', '100%');
	}, []);

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: '총량',
			children: (
				<DpInspectTotal
					key={'DpInspectTotal'}
					ref={refs}
					form={detailForm}
					data={gridData1}
					isDisabled={isDisabled}
					clickApplySelect={clickApplySelect}
					clickSave={saveInspectTotalList}
				/>
			),
		},
		{
			key: '2',
			label: '일배상세',
			children: <DpInspectDetail key={'DpInspectDetail'} ref={refs} data={gridData2} />,
		},
	];

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />
			{/* 조회 컴포넌트 */}
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<DpInspectSearch form={form} />
			</SearchFormResponsive>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<DpInspectMaster
						key="DpInspectMaster"
						ref={refs}
						data={gridData}
						isDisabled={isDisabled}
						totalCnt={totalCnt}
					/>,
					<TabsArray
						key="receipt-confirm-detail-tab"
						activeKey={activeKey}
						onChange={key => tabClick(key, null)}
						items={tabItems}
					/>,
				]}
			/>

			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
};

export default DpInspect;
