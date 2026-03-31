/*
 ############################################################################
 # FiledataField	: StAdjustmentBatchDetail1.tsx
 # Description		: 재고 > 재고조정 > 일괄재고조정 (재고조정)
 # Author					: JiHoPark
 # Since					: 2025.09.24.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputNumber, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import StAdjustmentBatchDetail1UploadExcelPopup from '@/components/st/adjustmentBatch/StAdjustmentBatchDetail1UploadExcelPopup';

// Util

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiSaveMasterList1 } from '@/api/st/apiStAdjustmentBatch';

// Hooks

// lib
import dayjs from 'dayjs';
// type
import { GridBtnPropsType } from '@/types/common';
// asset
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

interface StAdjustmentBatchDetail1Props {
	data: any;
	totalCnt: any;
	form: any;
	initialValues: any;
	dccode: string;
	handleGridData2: any;
}

const StAdjustmentBatchDetail1 = forwardRef((props: StAdjustmentBatchDetail1Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const [form] = Form.useForm();

	const refModal = useRef(null);
	const refModal2 = useRef(null);
	const excelRef = useRef(null);

	const { handleGridData2, initialValues, dccode } = props;

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);
	// 사용자 정보
	const user = useAppSelector(state => state.user.userInfo);

	// WMS자체감모 처리권한자(AJDC)
	const ajdcProcUserCmCd = getCommonCodeList('AJDC_PROC_USER');
	const bAjdcUser = ajdcProcUserCmCd.find(val => val.comCd.toUpperCase() === globalVariable.gUserId.toUpperCase());

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.DCCODE'),
			/*물류센터*/ dataField: 'dccode',
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			headerText: t('lbl.STORE'),
			/*창고*/ dataField: 'organize',
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			headerText: t('lbl.STOCKTYPE') /*재고위치*/,
			children: [
				{ headerText: t('lbl.CODE'), /*코드*/ dataField: 'stocktype', dataType: 'code', editable: false, width: 80 },
				{
					headerText: t('lbl.DESCR'),
					/*명칭*/ dataField: 'stocktypedesc',
					dataType: 'string',
					editable: false,
					width: 100,
				},
			],
		},
		{
			headerText: t('lbl.STOCKGRADE') /*재고속성*/,
			children: [
				{
					headerText: t('lbl.CODE'),
					/*코드*/ dataField: 'stockgrade',
					dataType: 'code',
					editable: false,
					width: 80,
				},
				{
					headerText: t('lbl.DESCR'),
					/*명칭*/ dataField: 'stockgradedesc',
					dataType: 'string',
					editable: false,
					width: 100,
				},
			],
		},
		{
			headerText: t('lbl.LOC_ST'),
			/*로케이션*/ dataField: 'loc',
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			headerText: t('lbl.SKU'),
			/*상품코드*/ dataField: 'sku',
			dataType: 'code',
			editable: false,
			width: 80,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.current.openPopup(e.item, 'sku');
				},
			},
		},
		{
			headerText: t('lbl.SKUNAME'),
			/*상품명칭*/ dataField: 'skuname',
			dataType: 'string',
			editable: false,
			width: 380,
		},
		{
			headerText: t('lbl.STORAGETYPE'),
			/*저장조건*/ dataField: 'storagetype',
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			headerText: t('lbl.STOCK_INFO') /*재고정보*/,
			children: [
				{
					headerText: t('lbl.UOM_RT'),
					/*단위*/ dataField: 'uom',
					dataType: 'code',
					editable: false,
					width: 80,
				},
				{
					headerText: t('lbl.QTY_ST'),
					/*현재고수량*/ dataField: 'qty',
					dataType: 'numeric',
					formatString: '#,##0.##',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.QTYALLOCATED_ST'),
					/*재고할당수량*/ dataField: 'qtyallocated',
					dataType: 'numeric',
					formatString: '#,##0.##',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.QTYPICKED_ST'),
					/*피킹재고*/ dataField: 'qtypicked',
					dataType: 'numeric',
					formatString: '#,##0.##',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.SHOTAGE_QTY'),
					/*가용수량*/ dataField: 'shotageQty',
					dataType: 'numeric',
					formatString: '#,##0.##',
					editable: false,
					width: 120,
				},
			],
		},
		{
			headerText: t('lbl.ETCQTY_WD'),
			/*처리수량*/ dataField: 'tranqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			required: true,
			width: 120,
			editRenderer: {
				type: 'InputEditRenderer',
				allowPoint: true,
				allowNegative: true,
			},
		},
		{
			headerText: t('lbl.WONEARDURATIONYN'),
			/*유통기한임박여부*/ dataField: 'neardurationyn',
			dataType: 'code',
			editable: false,
			width: 120,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.EXPIREDT'),
			/*소비일자*/ dataField: 'expiredt',
			dataType: 'code',
			editable: false,
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.MANUFACTUREDT'),
			/*제조일자*/ dataField: 'manufacturedt',
			dataType: 'code',
			editable: false,
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.DURATIONTERM'),
			/*유통기간(잔여/전체)*/ dataField: 'durationTerm',
			dataType: 'string',
			editable: false,
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.SERIALINFO') /*상품이력정보*/,
			children: [
				{
					headerText: t('lbl.SERIALNO_SKU'),
					/*이력번호*/ dataField: 'serialno',
					dataType: 'string',
					editable: false,
					width: 200,
				},
				{
					headerText: t('lbl.BARCODE'),
					/*바코드*/ dataField: 'barcode',
					dataType: 'string',
					editable: false,
					width: 200,
				},
				{
					headerText: t('lbl.BLNO'),
					/*B/L 번호*/ dataField: 'convserialno',
					dataType: 'string',
					editable: false,
					width: 200,
				},
				{
					headerText: t('lbl.CONVERTLOT'),
					/*도축일자*/ dataField: 'butcherydt',
					dataType: 'date',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.FACTORYNAME'),
					/*도축장*/ dataField: 'factoryname',
					dataType: 'string',
					editable: false,
					width: 200,
				},
				{
					headerText: t('lbl.CONTRACTTYPE'),
					/*계약유형*/ dataField: 'contracttype',
					dataType: 'string',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.CONTRACTCOMPANY'),
					/*계약업체*/ dataField: 'contractcompany',
					dataType: 'code',
					editable: false,
					width: 150,
				},
				{
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					/*계약업체명*/ dataField: 'contractcompanyname',
					dataType: 'string',
					editable: false,
					width: 220,
				},
				{
					headerText: t('lbl.FROMVALIDDT'),
					/*유효일자(FROM)*/ dataField: 'fromvaliddt',
					dataType: 'date',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.TOVALIDDT'),
					/*유효일자(TO)*/ dataField: 'tovaliddt',
					dataType: 'date',
					editable: false,
					width: 120,
				},
			],
		},
		{
			headerText: t('lbl.LOT'),
			/*로트*/ dataField: 'lot',
			dataType: 'string',
			editable: false,
			width: 200,
		},
		{
			headerText: t('lbl.TO_STOCKID'),
			/*재고ID*/ dataField: 'stockid',
			dataType: 'string',
			editable: false,
			width: 250,
		},
		{
			headerText: t('lbl.AREA'),
			/*작업구역*/ dataField: 'area',
			dataType: 'code',
			editable: false,
			required: true,
			width: 80,
		},
		{
			headerText: t('lbl.QTYALLOCATED_ST'),
			/*재고할당수량*/ dataField: 'etcqty1',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.QTYPICKED'),
			/*피킹재고수량*/ dataField: 'etcqty2',
			dataType: 'numeric',
			formatString: '#,##0.##',
			visible: false,
		},
		{
			headerText: t('lbl.STORERKEY'),
			/*회사*/ dataField: 'storerkey',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.LOTTABLE01_MFG_WO'),
			/*기준일(유통,제조)*/ dataField: 'lottable01',
			dataType: 'string',
			editable: false,
			visible: false,
		},
	];

	// FooterLayout Props
	const footerCol = [
		{
			dataField: 'tranqty',
			positionField: 'tranqty',
			operation: 'SUM',
			formatString: '#,##0.#####',
			postfix: '',
			dataType: 'float',
			style: 'right',
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		// autoGridHeight: true, // 자동 높이 조절
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		showFooter: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */
	/*
	 * 센터별 코스트센터 및 대표고객코드 취득
	 *   공통코드 WMS_MNG_DC의 DATA2 항목으로 관리 ( 형태 : 코스트센터|대표고객코드 )
	 *   코스트센터와 대표고객코드를 SCM팀으로 귀속되도록 세팅하기 위함
	 *   Parameter : 센터코드
	 *   Return : data2 값
	 *            -1 센터미입력, -2 코스트센터 및대표고객코드 미입력, -3 코스트센터 및 대표고객코드 형태 오류, -4 코스트센터 미입력, -5 대표고객코드미입력
	 */
	const getCostCdAndCustkey = () => {
		const commWmsMngDc = getCommonCodeList('WMS_MNG_DC'); // 센터별 기준코스트센터 및 대표고객
		const findDccode = commWmsMngDc.find(({ comCd }: { comCd: string }) => comCd === dccode);
		if (!findDccode) {
			return '-1';
		}

		const selectedData2 = findDccode.data2;
		if (commUtil.isEmpty(selectedData2)) {
			return '-2';
		}

		const arrData2 = selectedData2.split('|');
		if (arrData2.length != 2) {
			return '-3';
		} else if (commUtil.isEmpty(arrData2[0])) {
			return '-4';
		} else if (commUtil.isEmpty(arrData2[1])) {
			return '-5';
		}

		return selectedData2;
	};

	/**
	 * 재고조정 저장 callback
	 * @returns {void}
	 */
	const saveCallback = () => {
		let errMsg = ''; // 에러메시지

		// 저장할 데이터 선택여부 확인
		const chkDataList = ref.current.getCheckedRowItemsAll();
		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_ERR_008'), // 저장 대상 자료가 존재하지 않습니다.
				modalType: 'info',
			});
			return;
		}

		// 저장 form data 확인
		const saveFormData = form.getFieldsValue();
		const currGStorerkey = globalVariable?.gStorerkey;
		if (currGStorerkey === 'FW00' && commUtil.isEmpty(saveFormData.processmain)) {
			errMsg = t('msg.MSG_COM_VAL_203'); // 물류귀책배부를 선택하십시요.
		} else if (commUtil.isEmpty(saveFormData.reasoncode)) {
			errMsg = t('msg.MSG_COM_VAL_204'); // 재고조정 발생사유를 선택하시기 바랍니다.
		}

		if (errMsg) {
			showMessage({
				content: errMsg,
				modalType: 'info',
			});
			return;
		}

		// 센터별 코스트센터 및 대표고객코드 취득
		const wmsData2 = getCostCdAndCustkey();
		const arrData2 = wmsData2.split('|');
		if (arrData2.length != 2) {
			errMsg = arrData2[0];
		}

		if (errMsg) {
			showMessage({
				content: t('msg.MSG_COM_VAL_205', [errMsg]), // 센터의 코스트센터 및 대표고객 코드 매핑 정보 오류입니다.(ErrCode:{{0}})\n설정 후 재진행 부탁드립니다.
				modalType: 'info',
			});
			return;
		}

		// grid data required 확인
		if (ref.current.validateRequiredGridData()) {
			// 저장하시겠습니까?
			showConfirm(null, t('msg.confirmSave'), () => {
				const params = {
					avc_COMMAND: 'CONFIRM_AJ_BATCH',
					processtype: 'ST_ADJUSTMENTBATCH',
					temptabletype: 'ST',
					docdt: dayjs(saveFormData.docdt).format('YYYYMMDD'),
					reasoncode: saveFormData.reasoncode,
					costcd: arrData2[0],
					imputetype: '12',
					processmain: saveFormData.processmain,
					custkey: arrData2[1],
					saveMasterList1: chkDataList,
				};

				apiSaveMasterList1(params).then(res => {
					if (res.statusCode === 0) {
						handleGridData2(res.data);
					}
				});
			});
		}
	};

	/**
	 * 선택적용 callback
	 * @returns {void}
	 */
	const applySelectedDataCallback = () => {
		// 처리수량 확인
		const applyFormData = form.getFieldsValue();
		const applyTranqty = applyFormData.tranqty;
		if (commUtil.isEmpty(applyTranqty) || Number(applyTranqty) < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_202'), // 재고조정 수량을 입력하시기 바랍니다.
				modalType: 'info',
			});
			return;
		}

		// 체크된 행 여부 확인
		const chkDataList = ref.current.getCheckedRowItems();
		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.noSelect'), // 선택한 행이 없습니다.
				modalType: 'info',
			});
			return;
		}

		// 선택적용
		chkDataList.forEach((chkData: { rowIndex: number; item: any }) => {
			const { rowIndex, item } = chkData;

			const updateItem = {
				...item,
				tranqty: applyTranqty,
			};

			ref.current.updateRow(updateItem, rowIndex);
		});
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref?.current.setSelectionByIndex(0);
		});
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const onExcelUploadPopupClick = () => {
		// uploadFile.current.click();
		refModal2.current.handlerOpen();
	};

	/**
	 * 엑셀 팝업 닫기
	 * @param popupData
	 */
	const closeExcelPopup = () => {
		refModal2.current.handlerClose();
		ref.current.clearGridData();

		const excelChkDataList = excelRef.current.getCheckedRowItemsAll();
		const excelParams = excelChkDataList.map((item: any) => {
			let rowStatus = '';
			if (commUtil.isNotEmpty(item.tranqty) && Number(item.tranqty) !== 0) {
				rowStatus = 'U';
			}

			// 현재고 수량
			const nQty = commUtil.isEmpty(item.qty) && Number(item.qty) === 0 ? 0 : item.qty;

			// 재고할당수량
			const nQtyallocated =
				commUtil.isEmpty(item.qtyallocated) && Number(item.qtyallocated) === 0 ? 0 : item.qtyallocated;

			// 피킹재고
			const nQtypicked = commUtil.isEmpty(item.qtypicked) && Number(item.qtypicked) === 0 ? 0 : item.qtypicked;

			// 가용수량
			const nShotageQty = commUtil.isEmpty(item.shotageQty) && Number(item.shotageQty) === 0 ? 0 : item.shotageQty;

			const param = {
				...item,
				qty: nQty,
				qtyallocated: nQtyallocated,
				etcqty1: nQtyallocated,
				qtypicked: nQtypicked,
				etcqty2: nQtypicked,
				shotageQty: nShotageQty,
				area: '1000',
				lottable01: item.lottable01.replace(/\D/g, ''),
				storerkey: globalVariable.gStorerkey,
				rowStatus,
			};

			return param;
		});

		ref.current.setGridData(excelParams);
		ref.current.setCheckedRowsByValue('rowStatus', 'U');
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 선택적용
				callBackFn: applySelectedDataCallback,
			},
			{
				btnType: 'btn2', // 엑셀업로드
				callBackFn: onExcelUploadPopupClick,
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveCallback,
			},
		],
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
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			// if (props.data.length > 0) {
			// 	// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
			// 	// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
			// 	const colSizeList = gridRef.getFitColumnSizeList(true);

			// 	// 구해진 칼럼 사이즈를 적용 시킴.
			// 	gridRef.setColumnSizeList(colSizeList);
			// }
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="h-auto">
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				<UiDetailViewArea>
					<Form form={form} initialValues={initialValues}>
						<UiDetailViewGroup>
							<li>
								<DatePicker
									name="docdt"
									label={t('lbl.TASKDT_AJ')} // 조정일자
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li>
								<SelectBox
									name="processmain"
									span={24}
									options={getCommonCodeList('YN', '전체', '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									label={t('lbl.OTHER05_DMD_AJ')} // 물류귀책배부
								/>
							</li>
							<li>
								<SelectBox
									name="reasoncode"
									span={24}
									options={getCommonCodeList('REASONCODE_AJ').filter(item => {
										if (globalVariable.gStorerkey === 'FW00') {
											//if (globalVariable.gAuthority === '00' || globalVariable.gAuthority === '05' || bAjdcUser) {
											if (!user.roles?.includes('000') || !user.roles?.includes('010') || bAjdcUser) {
												return item.comCd === 'MTOM' || item.comCd === 'AJDC';
											} else {
												return item.comCd === 'MTOM';
											}
										} else {
											return item;
										}
									})}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									label={t('lbl.REASONCODE_AJ')} // 발생사유
								/>
							</li>
							<li>
								<InputNumber
									name="tranqty"
									label={t('lbl.ETCQTY_WD')} // 처리수량
									placeholder={'* 처리수량입력은 감모(-)'}
									min={0}
								/>
							</li>
						</UiDetailViewGroup>
					</Form>
				</UiDetailViewArea>
			</AGrid>
			<AGrid className="mt20" style={{ height: 'calc(100vh - 450px)' }}>
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} footerLayout={footerCol} />
			</AGrid>
			<CmSearchWrapper ref={refModal} />
			<CustomModal ref={refModal2} width="1000px">
				<StAdjustmentBatchDetail1UploadExcelPopup
					close={closeExcelPopup}
					ref={excelRef}
					// gridCol={gridCol}
					// gridProps={{ ...gridProps, editable: false }}
					// gridInitValue={gridInitValue}
					// saveMasterList={saveMasterList}
				/>
			</CustomModal>
		</>
	);
});

export default StAdjustmentBatchDetail1;
