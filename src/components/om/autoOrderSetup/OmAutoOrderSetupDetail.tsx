/*
 ############################################################################
 # FiledataField	: OmAutoOrderSetupDetail.tsx
 # Description		: 주문 > 주문등록 > 저장품자동발주관리
 # Author			: JeongHyeongCheol
 # Since			: 25.07.25
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import OmAutoOrderSetupDetailTab from '@/components/om/autoOrderSetup/OmAutoOrderSetupDetailTab';
import OmAutoOrderSetupPopup from '@/components/om/autoOrderSetup/OmAutoOrderSetupPopup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import dayjs from 'dayjs';

// store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';

// API Call Function
import {
	apiGetDetailList,
	apiGetHistoryList,
	apiGetMasterInfo,
	apiSaveAutoOrderList,
	apiSaveDetailList,
} from '@/api/om/apiOmAutoOrderSetup';

// util
import { showConfirm, showMessage } from '@/util/MessageUtil';

// types
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';
import { GridBtnPropsType } from '@/types/common';
interface OmAutoOrderSetupDetailProps {
	form?: any;
	gridData?: Array<object>;
	activeKey?: string;
	setActiveKey?: any;
}
interface MasterInfo {
	purchaseCd?: string;
	purchaseName?: string;
	purchaseInfo?: string;
	delYn?: string;
	status?: string;
}
const OmAutoOrderSetupDetail = forwardRef((props: OmAutoOrderSetupDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { form, gridData, activeKey, setActiveKey } = props;

	//Antd Form 사용
	const { t } = useTranslation();
	const gridRef2 = useRef(null);
	const gridRef3 = useRef(null);
	const tabRef = useRef(null);
	const refModal1 = useRef(null);
	const refModal2 = useRef(null);
	const [totalCnt1, setTotalCnt1] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [totalCnt3, setTotalCnt3] = useState(0);
	const [popupType, setPopupType] = useState('');
	const [popupGrid, setPopupGrid] = useState([]);
	const [masterInfo, setMasterInfo] = useState({});
	const [changeMasterInfo, setChangeMasterInfo] = useState<MasterInfo>({});
	const [skuCode, setSkuCode] = useState('');

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================
	// 사용여부
	const delYnLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('DEL_YN', value)?.cdNm;
	};
	// 거래처 유형명
	const resultSendYnLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('AUTO_ORD_ALERT_STATUS', value)?.cdNm;
	};

	// 자동발주내역 그리드 초기화
	const gridCol1 = [
		{
			dataField: 'purchaseCd',
			headerText: '발주코드',
			filter: {
				showIcon: true,
			},
			dataType: 'code',
		},
		{
			dataField: 'purchaseName',
			headerText: '발주명',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'purchaseInfo',
			headerText: '발주정보요약',
		},
		{
			dataField: 'skuCnt',
			headerText: '대상건수',
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.DEL_YN'),
			labelFunction: delYnLabelFunc,
			dataType: 'code',
		},
	];
	// 자동발주내역 그리드 속성
	const gridProps1 = {
		editable: false,
		enableFilter: true,
		fillColumnSizeMode: true,
	};

	// 대상상품 그리드 초기화
	const gridCol2 = [
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), // 상품코드
			// commRenderer: {
			// 	type: 'popup',
			// 	onClick: function (e: any) {
			// 		gridRef.current.openPopup(e.item, 'sku');
			// 	},
			// },
			commRenderer: {
				type: 'search',
				iconPosition: 'right',
				popupType: 'sku',
				searchDropdownProps: {
					dataFieldMap: {
						sku: 'code',
						skuName: 'name',
					},
				},
				onClick: function () {
					const param = gridRef2.current.getSelectedRows()[0];
					if (param.rowStatus === 'I') {
						setPopupType('sku');
						refModal2.current.handlerOpen();
					}
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef2.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'skuName',
			headerText: t('lbl.SKUNM'), // 상품명
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			dataField: 'uomDivCd',
			headerText: '발주단위구분',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('AUTO_ORD_UOM_DIV'),
			},
			required: true,
		},
		{
			dataField: 'qty',
			headerText: '목표재고',
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
			editable: false,
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (item.rowStatus !== 'I') {
			// 		// 편집 가능 class 삭제
			// 		gridRef2.current.removeEditClass(columnIndex);
			// 	} else {
			// 		// 편집 가능 class 추가
			// 		return 'isEdit';
			// 	}
			// },
		},
	];
	// 대상상품 그리드 속성
	const gridProps2 = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
		fillColumnSizeMode: true,
		isLegacyRemove: true,
		showCustomRowCheckColumn: true,
	};

	// 수행이력 그리드 초기화
	const gridCol3 = [
		{
			dataField: 'startdate',
			headerText: '수행시작일시',
		},
		{
			dataField: 'enddate',
			headerText: '수행종료일시',
		},
		{
			dataField: 'runmode',
			headerText: t('lbl.GUBUN_2'), // 구분
		},
		{
			dataField: 'orderDt',
			headerText: '주문일',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			dataField: 'purchaseDt',
			headerText: '입고일',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
		},
		{
			dataField: 'docno',
			headerText: '이체번호',
		},
		{
			dataField: 'procrmsg',
			headerText: '결과메세지',
		},
		{
			dataField: 'resultSendYn',
			headerText: '알람여부',
			labelFunction: resultSendYnLabelFunc,
		},
		{
			dataField: 'addwho',
			headerText: '수행자',
			visible: false,
		},
		{
			dataField: 'regNm',
			headerText: '수행자',
			dataType: 'manager',
			managerDataField: 'addwho',
		},
	];
	// 수행이력 그리드 속성
	const gridProps3 = {
		editable: false,
		fillColumnSizeMode: false,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	const isSelectedMessage = () => {
		return showMessage({
			content: '실행할 자동발주를 선택 하세요.',
			modalType: 'info',
		});
	};

	/**
	 * =====================================================================
	 *	master(발주용휴일관리 목록)
	 * =====================================================================
	 */
	/**
	 * 강제실행
	 * @returns {void}
	 */
	const forcedExecution = () => {
		const params = gridRef.current.getSelectedRows()[0];
		if (!params) {
			isSelectedMessage();
			return;
		}
		showConfirm(null, '[발주코드:' + params.purchaseCd + ']를 강제실행 하시겠습니까?', () => {
			params.processtype = 'MRUN_AUTO_ORD';
			params.avc_COMMAND = 'CREATE_AUTO_ORD';
			params.queryId = 'getHistoryList';
			apiSaveAutoOrderList(params).then(res => {
				if (res?.data?.statusCode > -1) {
					gridRef3.current.clearGridData();
					gridRef3.current.appendData(res.data.data);
					// 세팅 속도 이슈로 컬럼이 작아지는 현상 방지
					setTimeout(() => {
						gridRef3.current.resize();
						const colSizeList = gridRef3.current.getFitColumnSizeList(true);
						gridRef3.current.setColumnSizeList(colSizeList);
					}, 50);
				}
			});
		});
	};

	/**
	 * =====================================================================
	 *	detail(대상상품)
	 * =====================================================================
	 */

	/**
	 * 대상상품 리스트 조회
	 * @param {any} params 조회 데이터
	 * @returns {void}
	 */
	const searchDetailList = (params: any) => {
		return apiGetDetailList(params).then(res => {
			if (res?.data) {
				gridRef2.current.clearGridData();
				gridRef2.current.appendData(res.data);
				setTotalCnt2(res.data.length);

				// 세팅 속도 이슈로 컬럼이 작아지는 현상 방지
				setTimeout(() => {
					gridRef2.current.resize();
					const colSizeList = gridRef2.current.getFitColumnSizeList(true);
					gridRef2.current.setColumnSizeList(colSizeList);
				}, 50);
			}
		});
	};

	/**
	 * excel upload
	 * @returns {void}
	 */
	const uploadExcel = () => {
		const params = gridRef.current.getSelectedRows()[0];
		if (!params) {
			isSelectedMessage();
			return;
		}
		setPopupType('excel');
		setPopupGrid(params);
		refModal1.current.handlerOpen();
	};

	/**
	 * 대상상품 수정사항 저장
	 * @returns {void}
	 */
	const saveDetailList = async () => {
		const masterParam = gridRef.current.getSelectedRows()[0];
		if (!masterParam) {
			isSelectedMessage();
			return;
		}
		const params = gridRef2.current.getChangedData().map((item: any) => {
			return {
				...item,
				purchaseCd: masterParam?.purchaseCd,
				storerkey: masterParam?.storerkey,
			};
		});
		// 변경 데이터 확인
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		const skuName = params.some((item: any) => item.skuName);
		if (!skuName) {
			showMessage({
				content: '상품코드를 확인해주세요',
				modalType: 'info',
			});
			return;
		}

		// 중복건 확인
		const allGridData = gridRef2.current.getGridData();
		// 2. 기존에 존재하던 SKU 목록 추출 (신규 추가 건 제외하고 기존 데이터의 SKU만 추출)
		// 현재 추가 중인 데이터들을 제외한 '기존' 데이터들의 SKU Set을 만듭니다.
		const existingSkus = new Set(
			allGridData
				.filter((item: any) => item.rowStatus !== 'I') // 이미 저장되어 있던 데이터만
				.map((item: any) => item.sku),
		);

		// 3. params를 순회하며 실제 '신규'와 '수정' 건수 계산
		let insertCount = 0;
		let updateCount = 0;
		let deleteCount = 0; // 2026-03-14 KSH - 삭제 건수 메시지 추가 FWNEXTWMS-7958 양준영

		let isDuplicateFound = false; // 중복 발생 여부 플래그

		params.forEach((item: any) => {
			if (item.rowStatus === 'I') {
				// 신규 표시('I')지만 이미 존재하는 SKU라면 수정으로 간주
				if (existingSkus.has(item.sku)) {
					updateCount++;
					isDuplicateFound = true;
				} else {
					insertCount++;
				}
			} else if (item.rowStatus === 'U') {
				// 기존 수정 건
				updateCount++;
			} else if (item.rowStatus === 'D') {
				// 2026-03-14 KSH - 삭제 건수 메시지 추가 FWNEXTWMS-7958 양준영
				// 기존 삭제 건
				deleteCount++;
			}
		});

		// 3. 중복 여부에 따른 메시지 제목 결정
		const baseMessage = isDuplicateFound ? '기존 내용의 변경사항이 있습니다. 저장하시겠습니까?' : t('msg.confirmSave');

		// 저장하시겠습니까?
		const messageWithRowStatusCount = `${baseMessage}
				신규 : ${insertCount}건
				수정 : ${updateCount}건
				삭제 : ${deleteCount}건`; // 2026-03-14 KSH - 삭제 건수 메시지 추가 FWNEXTWMS-7958 양준영

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiSaveDetailList(params).then(async (res: any) => {
				showMessage({
					content:
						res.data.data.resultMessage === 'MSG_COM_SUC_003'
							? t('msg.' + res.data.data.resultMessage)
							: res.data.data.resultMessage,
					modalType: 'info',
				});

				await searchDetailList(masterParam);
				const updateMaster = {
					skuCnt: gridRef2.current.getRowCount(),
				};
				gridRef.current.setSelectedRowValue({ ...updateMaster });
				gridRef.current.resetUpdatedItems();
			});
		});
	};

	/**
	 * =====================================================================
	 *	history(수행이력)
	 * =====================================================================
	 */

	/**
	 * 수행이력 리스트 조회
	 * @param {any} params 조회 데이터
	 * @returns {void}
	 */
	const searchHistoryList = (params: any) => {
		apiGetHistoryList(params).then(res => {
			if (res?.data?.data) {
				gridRef3.current.clearGridData();
				gridRef3.current.appendData(res.data.data);
				setTotalCnt3(res.data.length);

				// 세팅 속도 이슈로 컬럼이 작아지는 현상 방지
				setTimeout(() => {
					gridRef3.current.resize();
					const colSizeList = gridRef3.current.getFitColumnSizeList(true);
					gridRef3.current.setColumnSizeList(colSizeList);
				}, 50);
			}
		});
	};

	/**
	 * 에정량확인
	 * @returns {void}
	 */
	const checkedEstimate = () => {
		setPopupType('check');
		const params = gridRef.current.getSelectedRows()[0];
		if (!params) {
			isSelectedMessage();
			return;
		}
		showConfirm(null, '[발주코드:' + params.purchaseCd + ']에 대해 예정량 확인을 하시겠습니까?', () => {
			params.processtype = 'MCALC_AUTO_ORD';
			params.avc_COMMAND = 'CALC_AUTO_ORD';
			params.queryId = 'getDataCalcRsltlist';
			apiSaveAutoOrderList(params).then(res => {
				if (res?.data?.statusCode > -1) {
					setPopupGrid(res.data.data);
					refModal1.current.handlerOpen();
				}
			});
		});
	};

	/**
	 * =====================================================================
	 *	masterInfo(상세설정)
	 * =====================================================================
	 */

	/**
	 * 상세설정 조회
	 * @param {any} params 조회 데이터
	 * @returns {void}
	 */
	const searchMasterInfo = (params: any) => {
		apiGetMasterInfo(params).then(res => {
			const masterInfo = res?.data?.data;
			if (masterInfo) {
				for (const key in masterInfo) {
					if (key.endsWith('Yn') && key !== 'delYn') {
						masterInfo[`${key}_checkbox`] = masterInfo[key] === '1';
					}
				}
				setMasterInfo(masterInfo);
			}
		});
	};

	/**
	 * =====================================================================
	 *	grid button set
	 * =====================================================================
	 */

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const setGridBtn1 = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'btn1', // 사용자 정의버튼1
					btnLabel: '강제실행',
					authType: 'new',
					callBackFn: forcedExecution,
				},
				{
					btnType: 'new', // 신규
					callBackFn: () => {
						setActiveKey('2');
						form.resetFields();
						form.setFieldsValue({
							expiryDate: [dayjs(), dayjs('9999-12-31')],
							rowStatus: 'I',
							ordDay: '1',
							purchaseDay: '1',
							purchaseHoliydayCd: '0',
							ordQtyDivCd: '1',
							chdDcYn: '0',
							chdDcYn_checkbox: false,
							exSerialYn: '0',
							exSerialYn_checkbox: false,
							incClosetypeYn: '0',
							incClosetypeYn_checkbox: false,
							incCustkeyYn: '0',
							incCustkeyYn_checkbox: false,
							incDistancetypeYn: '0',
							incDistancetypeYn_checkbox: false,
							runDivCd: '2',
							runMonYn: '1',
							runMonYn_checkbox: true,
							runTueYn: '1',
							runTueYn_checkbox: true,
							runWedYn: '1',
							runWedYn_checkbox: true,
							runThuYn: '1',
							runThuYn_checkbox: true,
							runFriYn: '1',
							runFriYn_checkbox: true,
							runSatYn: '1',
							runSatYn_checkbox: true,
							runSunYn: '1',
							runSunYn_checkbox: true,
							runHolidaychkYn: '1',
							runHolidaychkYn_checkbox: true,
							delYn: 'N',
						});
					},
				},
			],
		};
		return gridBtn;
	};

	const setGridBtn2 = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef2, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'plus', // 행추가
					initValues: {
						uomDivCd: 1,
						rowStatus: 'I',
					},
					callBeforeFn: () => {
						const params = gridRef.current.getSelectedRows()[0];
						if (!params) {
							isSelectedMessage();
							return true;
						}
					},
				},
				{
					btnType: 'delete', // 행삭제
				},
				{
					btnType: 'save',
					callBackFn: saveDetailList,
				},
			],
		};
		return gridBtn;
	};

	const setGridBtn3 = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef3, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'btn2', // 사용자 정의버튼2
					btnLabel: '예정량확인',
					authType: 'new',
					callBackFn: checkedEstimate,
				},
			],
		};
		return gridBtn;
	};

	/**
	 * =====================================================================
	 *	popup func
	 * =====================================================================
	 */

	/**
	 * 상품코드 팝업조회
	 * @param selectedRow
	 * @returns {void}
	 */
	const confirmPopup = (selectedRow: any) => {
		setTimeout(() => {
			gridRef2.current.setCellValue(gridRef2.current.getSelectedIndex()[0], 'sku', selectedRow[0].code);
			gridRef2.current.setCellValue(gridRef2.current.getSelectedIndex()[0], 'skuName', selectedRow[0].name);
			refModal2.current.handlerClose();
		}, 0);
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		if (refModal1.current && gridRef2.current) {
			const updateMaster = {
				skuCnt: gridRef2.current.getRowCount(),
			};
			gridRef.current.setSelectedRowValue({ ...updateMaster });
			gridRef.current.resetUpdatedItems();
		}
		refModal1.current.handlerClose();
		refModal2.current.handlerClose();
	};

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		gridRef2?.current?.resize?.('100%', '100%');
		gridRef3?.current?.resize?.('100%', '100%');
	}, []);

	// 탭 아이템 영역
	const tabs = [
		{
			key: '1',
			label: '상세내역',
			children: (
				<Splitter
					direction="vertical"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<>
							<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
								<GridTopBtn gridTitle="대상상품" gridBtn={setGridBtn2()} totalCnt={totalCnt2}>
									<Button onClick={uploadExcel}>{t('lbl.EXCELUPLOAD')}</Button>
								</GridTopBtn>
							</AGrid>
							<GridAutoHeight>
								<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
							</GridAutoHeight>
						</>,
						<>
							<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
								<GridTopBtn gridTitle="수행이력" gridBtn={setGridBtn3()} totalCnt={totalCnt3} />
							</AGrid>
							<GridAutoHeight>
								<AUIGrid ref={gridRef3} columnLayout={gridCol3} gridProps={gridProps3} />
							</GridAutoHeight>
						</>,
					]}
				/>
			),
		},
		{
			key: '2',
			label: '상세설정',
			children: (
				<OmAutoOrderSetupDetailTab
					form={form}
					ref={tabRef}
					gridRowData={gridRef?.current?.getSelectedRows()}
					setChangeMasterInfo={setChangeMasterInfo}
					masterInfo={masterInfo}
					activeKey={activeKey}
				/>
			),
		},
	];

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string) => {
		if (key === '1') {
			setActiveKey('1');
			if (gridRef2.current) {
				// 세팅 속도 이슈로 컬럼이 작아지는 현상 방지
				setTimeout(() => {
					gridRef2.current.resize();
					const colSizeList2 = gridRef2.current.getFitColumnSizeList(true);
					gridRef2.current.setColumnSizeList(colSizeList2);
				}, 50);
			}
			if (gridRef3.current) {
				setTimeout(() => {
					gridRef3.current.resize();
					const colSizeList3 = gridRef3.current.getFitColumnSizeList(true);
					gridRef3.current.setColumnSizeList(colSizeList3);
				}, 50);
			}
		} else if (key === '2') {
			setActiveKey('2');
		}
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionChange', (event: any) => {
			const primeCell = event.primeCell;
			searchDetailList(primeCell.item);
			searchHistoryList(primeCell.item);
			searchMasterInfo(primeCell.item);
		});

		// 에디팅 시작 이벤트 바인딩
		gridRef2.current.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRef2.current.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField === 'sku' || event.dataField === 'qty') {
				return gridRef2.current.isAddedById(event.item[rowIdField]);
			}
			return true; // 다른 필드들은 편집 허용
		});

		// 에디팅 종료 이벤트 바인딩
		// gridRef2.current?.bind('cellEditEnd', function (event: any) {
		// 	if (event.dataField === 'sku' && event.which === 13) {
		// 		setSkuCode(event.item.sku);
		// 		setPopupType('sku');
		// 		refModal2.current.handlerOpen();
		// 	}
		// });
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// 그리드 다음 페이지 Data 조회되면 그리드에 추가
	useEffect(() => {
		if (gridData.length > 0) {
			gridRef.current.appendData(gridData);
			setTotalCnt1(gridData.length);

			// 세팅 속도 이슈로 컬럼이 작아지는 현상 방지
			setTimeout(() => {
				// 조회된 결과에 맞게 칼럼 넓이를 구한다.
				const colSizeList1 = gridRef.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.current.setColumnSizeList(colSizeList1);
				gridRef?.current.setSelectionByIndex(0);
				const colSizeList2 = gridRef2.current.getFitColumnSizeList(true);
				gridRef2.current.setColumnSizeList(colSizeList2);
				const colSizeList3 = gridRef3.current.getFitColumnSizeList(true);
				gridRef3.current.setColumnSizeList(colSizeList3);
			}, 50);
		}
	}, [gridData]);

	// 상세설정 변경시
	useEffect(() => {
		if (changeMasterInfo.status === 'I') {
			gridRef.current.appendData(changeMasterInfo);
		} else {
			gridRef.current.setSelectedRowValue({ ...changeMasterInfo });
		}
		// AUIGrid 변경이력 Cache 삭제
		gridRef.current.resetUpdatedItems();
	}, [changeMasterInfo]);

	return (
		<>
			<Splitter
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridTitle="목록" gridBtn={setGridBtn1()} totalCnt={totalCnt1} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef} columnLayout={gridCol1} gridProps={gridProps1} />
						</GridAutoHeight>
					</>,
					<TabsArray key="omAutoOrderSetup-tabs" items={tabs} activeKey={activeKey} onChange={tabClick} />,
				]}
			/>
			<CustomModal ref={refModal1} width="1000px">
				<OmAutoOrderSetupPopup
					popupType={popupType}
					gridData={popupGrid}
					search={searchDetailList}
					close={closeEvent}
				/>
			</CustomModal>
			<CustomModal ref={refModal2} width="1000px">
				<CmSearchPopup type={popupType} codeName={skuCode} callBack={confirmPopup} close={closeEvent}></CmSearchPopup>
			</CustomModal>
		</>
	);
});

export default OmAutoOrderSetupDetail;
