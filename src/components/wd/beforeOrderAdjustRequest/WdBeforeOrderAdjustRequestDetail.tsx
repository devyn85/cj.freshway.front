/*
 ############################################################################
 # FiledataField	: WdBeforeOrderAdjustRequest.tsx
 # Description		: 출고 > 출고작업 > 사전주문 조정의뢰 - 디테일
 # Author			: jangjaehyun
 # Since			: 25.09.25
 #
 # ■ 컴포넌트 설명
 #   - 사전주문 조정의뢰 정보를 관리하는 상세 화면 컴포넌트
 #   - 재고부족 상품에 대한 조정의뢰 정보를 입력 및 관리
 #   - 선택된 행에 대해 사유코드, 사유내용, 대체상품, 재입고일자 등 설정 가능
 #
 # ■ 주요 기능
 #   - 사전주문 조정의뢰 목록 조회 및 편집
 #   - 사유코드 및 사유내용 입력 관리
 #   - 대체상품 검색 및 선택
 #   - 재입고일자 설정 (오늘 이후 날짜만 가능)
 #   - 일괄 적용: 선택된 행들에 동일한 조정정보 일괄 적용
 #   - 삭제: 조정의뢰 정보 삭제
 #   - 저장: 조정의뢰 정보 저장 (추가/수정) 및 루프 트랜잭션 처리
 #
 # ■ Props
 #   - callBackFn: 저장 후 재조회를 위한 콜백 함수
 #   - data: 조정의뢰 목록 데이터
 #   - totalCnt: 조정의뢰 목록 총 건수
 #
 # ■ Ref
 #   - gridRef: 조정의뢰 정보 그리드 참조
 #
 # ■ 주요 함수
 #   - initEvent: 그리드 이벤트 초기화 (ready, cellEditEnd)
 #   - saveMasterList: 조정의뢰 정보 저장 (체크된 행 기준)
 #   - deleteMasterList: 조정의뢰 정보 삭제
 #   - 선택적용 버튼: 폼 데이터를 선택된 행들에 일괄 적용
 #
 ############################################################################
*/
// CSS

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import dayjs from 'dayjs';

// Component
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { Button, InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';

// API Call Function

import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import styled from 'styled-components';

const WdBeforeOrderAdjustRequestDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	const [gridForm] = Form.useForm();
	const modalRef = useRef(null);
	const refModal = useRef(null);

	// loop transaction params
	const [loopTrParams, setLoopTrParams] = useState({});

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'delYn',
			headerText: '상태값',
			editable: false,
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				if (value === 'Y') {
					return '삭제';
				} else if (value === 'N') {
					return '등재';
				} else {
					return '';
				}
			},
		}, // 삭제여부
		{ dataField: 'courier', headerText: t('lbl.COURIER'), editable: false, dataType: 'code', visible: false }, // 배송사
		{ dataField: 'deliveryDate', headerText: t('lbl.DOCDT_WD'), editable: false, dataType: 'date' }, // 문서일자
		{ dataField: 'docNo', headerText: t('lbl.DOCNO_WD'), editable: false, dataType: 'code' }, // 문서번호
		{ dataField: 'toVatno', headerText: t('lbl.TO_VATNO'), editable: false, dataType: 'code' }, // 수령사업자등록번호
		{ dataField: 'toVatowner', headerText: t('lbl.TO_VATOWNER'), editable: false }, // 수령사업자명
		{ dataField: 'saleCusHrc1', headerText: t('lbl.SALECUSHRC1'), editable: false, dataType: 'code' }, // 판매고객계층
		{ dataField: 'orderType', headerText: t('lbl.ORDERTYPE'), editable: false, dataType: 'code' }, // 주문유형
		{ dataField: 'toEmpName', headerText: '영업사원명', editable: false, dataType: 'code' }, // 영업사원명
		{ dataField: 'orderDate', headerText: '주문일자', editable: false, dataType: 'date' }, // 주문일자
		{ dataField: 'orderTime', headerText: '주문시간', editable: false, dataType: 'code' }, // 주문시간
		{
			dataField: 'toCustKey',
			headerText: t('lbl.TO_CUSTKEY_WD'),
			editable: false,
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current.openPopup({ custkey: e.item.toCustKey, custtype: 'C' }, 'cust');
				},
			},
		}, // 수령고객키
		{ dataField: 'toCustName', headerText: t('lbl.TO_CUSTNAME_WD'), editable: false }, // 수령고객명
		{ dataField: 'mngplcId', headerText: t('lbl.MNGPLCID'), editable: false, dataType: 'code' }, // 관리처ID
		{ dataField: 'mngplcName', headerText: t('lbl.MNGPLCIDNM'), editable: false }, // 관리처명
		{ dataField: 'docLine', headerText: t('lbl.DOCLINE'), dataType: 'code', editable: false }, // 문서라인
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			editable: false,
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					e.item.skuDescr = e.item.skuName;
					gridRef.current.openPopup(e.item, 'sku');
				},
			},
		}, // 상품코드
		{ dataField: 'skuName', headerText: t('lbl.SKUNAME'), editable: false }, // 상품명
		{ dataField: 'plant', headerText: t('lbl.PLANT'), editable: false, visible: false }, // 플랜트
		{ dataField: 'plantDescr', headerText: t('lbl.PLANT'), editable: false }, // 플랜트명
		{ dataField: 'channel', headerText: t('lbl.CHANNEL_DMD'), editable: false, dataType: 'code' }, // 채널
		{
			headerText: t('lbl.STOCKINFO_WD'),
			children: [
				{ dataField: 'qty', headerText: t('lbl.QTY_ST'), dataType: 'numeric', editable: false }, // 수량
				{ dataField: 'stOpenQty', headerText: t('lbl.OPENQTY_ST'), dataType: 'numeric', editable: false }, // 개방수량
				{ dataField: 'shortageQty', headerText: t('lbl.SHORTAGE_QTY'), dataType: 'numeric', editable: false }, // 부족수량
				{ dataField: 'qtyAllocated', headerText: t('lbl.QTYALLOCATED_ST'), dataType: 'numeric', editable: false }, // 할당수량
				{ dataField: 'qtyPicked', headerText: t('lbl.QTYPICKED_ST'), dataType: 'numeric', editable: false }, // 피킹수량
				{ dataField: 'baseUom', headerText: t('lbl.UOM_STD'), editable: false, dataType: 'code' }, // 기본단위
			],
		},
		{
			headerText: t('lbl.ORDERINFO_WD'),
			children: [
				{ dataField: 'orderQty', headerText: t('lbl.OPENQTY_WD'), dataType: 'numeric', editable: false }, // 주문수량
				{ dataField: 'uom', headerText: t('lbl.STORERUOM'), editable: false, dataType: 'code' }, // 단위
			],
		},
		{
			dataField: 'reDeliveryDate',
			headerText: '재입고일자',
			dataType: 'date',
			dateInputFormat: 'yyyymmdd',
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: false,
				showExtraDays: false,
				validator: (oldValue: any, newValue: any, item: any) => {
					const selectedDate = dayjs(newValue);
					const today = dayjs().startOf('day');
					const deliveryDate = dayjs(item.deliveryDate, 'YYYYMMDD');
					const isValid = !selectedDate.isBefore(today) && !selectedDate.isBefore(deliveryDate);
					return { validate: isValid, message: '오늘 이후의 날짜를 입력해주세요.' };
				},
			},
		}, // 재입고일자
		{
			dataField: 'mdRmk',
			headerText: t('lbl.REASONCODE'),
			width: 200,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('REASONCODE_WD', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => getCommonCodebyCd('REASONCODE_WD', value)?.cdNm,
		}, // 사유코드
		{ dataField: 'text', headerText: '사유내용', width: 200 }, // 사유내용

		{
			dataField: 'altSku',
			headerText: '대체상품코드',
			width: 109,
			dataType: 'code',
			// required: true,
			commRenderer: {
				type: 'search',
				popupType: 'sku',
				searchDropdownProps: {
					dataFieldMap: {
						altSku: 'code',
						altSkuNm: 'name',
					},
					// callbackBeforeUpdateRow: (e: any) => { // 상품 내린다음 더 가져올게 있을 때
					// 	const selectedIndex = gridRef.current?.current?.getSelectedIndex();
					// 	getSkuSelectData(e.code, selectedIndex[0]);
					// },
				},
				onClick: function (e: any) {
					refModal.current.handlerOpen();
				},
			},
		},

		// {
		// 	dataField: 'altSku',
		// 	headerText: '대체상품코드',
		// 	commRenderer: {
		// 		type: 'search',
		// 		iconPosition: 'right',
		// 		align: 'center',
		// 		onClick: function (event: any) {
		// 			refModal.current.handlerOpen();
		// 		},
		// 	},
		// }, // 대체상품코드
		{ dataField: 'altSkuNm', headerText: '대체상품명', editable: false }, // 대체상품명
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
		showFooter: true,
		// fillColumnSizeMode: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.delYn === 'Y') {
				return 'color-danger';
			} else if (item.shortageDocNo !== 'X') {
				return 'color-info';
			} else {
				return '';
			}
		},
		// rowCheckDisabledFunction: (rowIndex: any, isChecked: any, item: any) => {
		// 	if (item.shortageDocNo !== 'X' && item.delYn === 'N') {
		// 		return false;
		// 	}
		// 	return true;
		// },
	};

	// FooterLayout Props
	const masterFooterLayout = [
		{
			dataField: 'dcCode',
			positionField: 'dcCode',
			operation: 'COUNT',
			formatString: '#,##0',
			postfix: ' rows',
		},
		{
			dataField: 'orderCnt',
			positionField: 'orderCnt',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'weight',
			positionField: 'weight',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
	];

	const footerLayout = [
		{
			dataField: 'delYn',
			positionField: 'delYn',
			operation: 'COUNT',
			formatString: '#,##0',
			postfix: ' rows',
		},
		{
			dataField: 'qty',
			positionField: 'qty',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'stOpenQty',
			positionField: 'stOpenQty',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'shortageQty',
			positionField: 'shortageQty',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'qtyAllocated',
			positionField: 'qtyAllocated',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'qtyPicked',
			positionField: 'qtyPicked',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'orderQty',
			positionField: 'orderQty',
			operation: 'SUM',
			formatString: '#,##0',
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditEnd', (event: any) => {
			const { value, item, oldValue } = event;
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'I');

			//  대체상품코드
			if (event.dataField === 'altSku') {
				const updatedRow = {
					...item,
					altSku: value,
					altSkuNm: '', // 대체상품명 클리어
					rowStatus: 'U',
				};
				gridRef.updateRowsById([updatedRow], true);
				return;
			}
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef.current.getCheckedRowItemsAll();

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		// if (!gridRef.current.validateRequiredGridData()) return;

		for (const item of updatedItems) {
			const shortageDocNo = item.shortageDocNo;
			const delYn = item.delYn;
			const mdRmk = item.mdRmk;
			const text = item.text;
			const altSku = item.altSku;

			if (shortageDocNo !== 'X' && delYn === 'N') {
				showMessage({
					content: '사전 주문 조정 의뢰 전인 상품만 저장 가능합니다.',
					modalType: 'warning',
				});
				return;
			}
			if (commUtil.isEmpty(mdRmk)) {
				showMessage({
					content: '사유코드는 필수로 입력되어야 합니다.',
					modalType: 'warning',
				});
				return;
			}
			if (commUtil.isEmpty(text)) {
				showMessage({
					content: '사유내용은 필수로 입력되어야 합니다.',
					modalType: 'warning',
				});
				return;
			}
			// if (commUtil.isEmpty(altSku)) {
			// 	showMessage({
			// 		content: '대체상품은 필수로 입력되어야 합니다.',
			// 		modalType: 'warning',
			// 	});
			// 	return;
			// }
		}

		// 저장 실행
		gridRef.current.showConfirmSave(() => {
			const saveParams = {
				apiUrl: '/api/wd/beforeOrderAdjustRequest/v1.0/saveOrderRequest',
				avc_COMMAND: 'PLANCONFIRM',
				saveDataList: updatedItems,
			};

			setLoopTrParams(saveParams);
			modalRef.current.handlerOpen();
		});
	};

	/**
	 * 삭제
	 * @returns {void}
	 */
	const deleteMasterList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const checkedItems = gridRef.current.getCheckedRowItemsAll();

		if (checkedItems.length < 1) {
			showMessage({
				content: '선택한 행이 없습니다.',
				modalType: 'warning',
			});
			return;
		}

		for (const item of checkedItems) {
			const shortageDocNo = gridRef.current.getCellValue(item.rowIndex, 'shortageDocNo');

			if (shortageDocNo === 'X') {
				showMessage({
					content: '사전 주문 조정의뢰한 상품만 삭제가능합니다.',
					modalType: 'warning',
				});
				return;
			}
		}

		// 삭제 실행
		// gridRef.current.showConfirmSave(() => {
		showConfirm(null, t('msg.MSG_COM_CFM_001'), () => {
			const saveParams = {
				apiUrl: '/api/wd/beforeOrderAdjustRequest/v1.0/saveOrderRequest',
				avc_COMMAND: 'CANCEL',
				saveDataList: checkedItems,
			};

			setLoopTrParams(saveParams);
			modalRef.current.handlerOpen();
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
		// AUIGrid 변경이력 Cache 삭제
		gridRef.current.resetUpdatedItems();
		props.callBackFn();
	};

	const closeEvent2 = () => {
		refModal.current.handlerClose();
		// AUIGrid 변경이력 Cache 삭제
		gridRef.current.resetUpdatedItems();
		props.callBackFn();
	};

	const confirmPopup = (selectedRow: any) => {
		gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'altSku', selectedRow[0].code);
		gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'altSkuNm', selectedRow[0].name);
		refModal.current.handlerClose();

		const colSizeList = gridRef.current.getFitColumnSizeList(true);
		gridRef.current.setColumnSizeList(colSizeList);
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

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
		}
	}, [props.data]);

	const disabledDate = (current: any) => {
		return current < dayjs().startOf('day');
	};

	return (
		<>
			<Form form={gridForm} className="contain-wrap">
				<Wrap>
					<GridTopBtnWrap>
						<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={props.totalCnt}>
							<Form form={gridForm} layout="inline">
								<DatePicker
									name="reDeliveryDate"
									label={'재입고일자'}
									className="bg-white"
									disabledDate={disabledDate}
								/>
								<SelectBox
									name="reasonCode"
									options={getCommonCodeList('REASONCODE_WD', '--- 선택 ---')}
									label={'사유코드'}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									className="bg-white"
								/>
								<CmSkuSearch
									form={gridForm}
									label="대체상품"
									name="alterSkuNm"
									code="alterSkuCd"
									className="bg-white"
								/>
								<InputText
									label={'사유내용'}
									name="reasonText"
									placeholder={t('msg.MSG_COM_VAL_054', ['사유내용'])}
									className="bg-white"
								/>
							</Form>
							<Button
								type="default"
								onClick={() => {
									const checkedItems = gridRef.current.getCheckedRowItems();

									if (checkedItems.length < 1) {
										showAlert(null, t('msg.MSG_COM_VAL_010'));
										return;
									}

									const alterSkuCd = gridForm.getFieldValue('alterSkuCd');
									const reasonCode = gridForm.getFieldValue('reasonCode');
									const reasonText = gridForm.getFieldValue('reasonText');
									const reDeliveryDate = gridForm.getFieldValue('reDeliveryDate');
									let alterSkuNm = gridForm.getFieldValue('alterSkuNm');

									if (!commUtil.isEmpty(alterSkuCd) && alterSkuCd.length !== 6) {
										showAlert(null, '유효한 상품코드를 입력해 주세요.');
										return;
									}

									if (!commUtil.isEmpty(alterSkuNm)) {
										alterSkuNm = alterSkuNm.split(']')[1].trim();
									}

									for (const item of checkedItems) {
										gridRef.current.setCellValue(item.rowIndex, 'mdRmk', reasonCode);
										gridRef.current.setCellValue(item.rowIndex, 'text', reasonText);
										gridRef.current.setCellValue(item.rowIndex, 'altSku', alterSkuCd);
										gridRef.current.setCellValue(item.rowIndex, 'altSkuNm', alterSkuNm);

										//item.deliveryDate 보다 reDeliveryDate가 이전일 경우 return
										const deliveryDate = dayjs(item.item.deliveryDate, 'YYYYMMDD');
										if (dayjs(reDeliveryDate).isBefore(deliveryDate)) {
											showAlert(null, '재입고일자는 기존 출고일자 이후로 입력해 주세요.');
											return;
										}

										gridRef.current.setCellValue(
											item.rowIndex,
											'reDeliveryDate',
											dayjs(reDeliveryDate).format('YYYYMMDD'),
										);
									}
								}}
							>
								선택적용
							</Button>
							<Button
								type="default"
								onClick={() => {
									deleteMasterList();
								}}
							>
								삭제
							</Button>
						</GridTopBtn>
					</GridTopBtnWrap>
					<GridAutoHeight id="pre-order-adjustment">
						<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
					</GridAutoHeight>
				</Wrap>
				<CustomModal ref={modalRef} width="1000px">
					<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
				</CustomModal>
			</Form>
			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CustomModal ref={refModal} width="1000px">
				<CmSearchPopup type={'sku'} callBack={confirmPopup} close={closeEvent2}></CmSearchPopup>
			</CustomModal>
		</>
	);
});

const Wrap = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
`;

const GridTopBtnWrap = styled.div`
	.title-area {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 5px;
		.title {
			display: flex;
			width: fit-content;
		}
		.ant-form-inline {
			.ant-form-item-inline {
				margin-inline-end: 5px;
				.ant-row {
					flex-flow: nowrap;
				}
				.ant-form-item-label {
					flex: none;
					> label {
						::after {
							margin-inline-start: 0px;
						}
					}
				}
			}
		}

		.grid-flex-wrap {
			display: flex;
			align-items: center;
			button {
				margin-right: 5px;
				&:last-of-type {
					margin-right: 0px;
				}
			}
		}
	}
`;

export default WdBeforeOrderAdjustRequestDetail;
