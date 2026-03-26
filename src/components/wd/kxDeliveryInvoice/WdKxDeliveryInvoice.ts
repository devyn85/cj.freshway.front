/*
 ############################################################################
 # FiledataField	: WdKxDeliveryInvoice.ts
 # Description		: 출고 > 출고작업 > 택배송장발행(온라인) (주문 탭)
 # Author			: sss
 # Since			: 25.12.10
 ############################################################################
*/

import { getCommonCodeList } from '@/store/core/comCodeStore';
import commUtil from '@/util/commUtil';

// API 호출 함수를 실제 경로로 교체하세요.

/**
 * 편집 가능한 상태인지 확인하는 함수
 * @param {any} item - 그리드 행 아이템
 * @returns {boolean} - 편집 가능 여부
 */
export const isDisabled = (item: any): boolean => {
	// 상태 택배송장 발행상태(10:업로드,11:업로드삭제,12:접수실패,13:배송제외,14:배송분리,16:접수확정,17:송장분리완료,20:택배접수완료,21:택배접수취소)
	if (commUtil.nvl(item?.status, '00') > '17') {
		return true;
	}
	return false;
};

/**
 * 센터접수 가능한 상태인지 확인하는 함수
 * @param {any} item - 그리드 행 아이템
 * @returns {boolean} - 편집 가능 여부
 */
export const isCanCeterRecpt = (item: any): boolean => {
	// 상태 택배송장 발행상태(10:업로드,11:업로드삭제,12:접수실패,13:배송제외,14:배송분리,16:접수확정,17:송장분리완료,20:택배접수완료,21:택배접수취소)
	if (commUtil.nvl(item?.status, '00') > '14') {
		return true;
	}
	return false;
};

/**
 * 송장분리가 가능한 상태인지 확인하는 함수
 * @param {any} item - 그리드 행 아이템
 * @returns {boolean} - 편집 가능 여부
 */
export const isCanDivide = (item: any): boolean => {
	// 상태 택배송장 발행상태(10:업로드,11:업로드삭제,12:접수실패,13:배송제외,14:배송분리,16:접수확정,17:송장분리완료,20:택배접수완료,21:택배접수취소)
	if (commUtil.nvl(item?.status, '00') == '16') {
		return true;
	}
	return false;
};

/**
 * 접수확정이 가능한 상태인지 확인하는 함수
 * @param {any} item - 그리드 행 아이템
 * @returns {boolean} - 편집 가능 여부
 */
export const isCanRecept01 = (item: any): boolean => {
	// 상태 택배송장 발행상태(10:업로드,11:업로드삭제,12:접수실패,13:배송제외,14:배송분리,16:접수확정,17:송장분리완료,20:택배접수완료,21:택배접수취소)
	if (
		commUtil.nvl(item?.status, '00') == '10' ||
		commUtil.nvl(item?.status, '00') == '12' ||
		commUtil.nvl(item?.status, '00') == '14'
	) {
		return true;
	}
	return false;
};

/**
 * 택배 예약이 가능한 상태인지 확인하는 함수
 * @param {any} item - 그리드 행 아이템
 * @returns {boolean} - 편집 가능 여부
 */
export const isCanInvoiceReceipt = (item: any): boolean => {
	// 상태 택배송장 발행상태(10:업로드,11:업로드삭제,12:접수실패,13:배송제외,14:배송분리,16:접수확정,17:송장분리완료,20:택배접수완료,21:택배접수취소)
	if (commUtil.nvl(item?.status, '00') == '17' || item?.rcptErrYn == 'Y') {
		return true;
	}
	return false;
};

/**
 * 행삭제를 할 수 있는 상태인지 확인하는 함수
 * @param {any} item - 그리드 행 아이템
 * @returns {boolean} - 편집 가능 여부
 */
export const isCanDelete02 = (item: any): boolean => {
	// 상태 택배송장 발행상태(10:업로드,11:업로드삭제,12:접수실패,13:배송제외,14:배송분리,16:접수확정,17:송장분리완료,20:택배접수완료,21:택배접수취소)
	if (commUtil.nvl(item?.status, '00') < '20') {
		return true;
	}
	return false;
};

// 체크박스 disable 함수
export const isDisabledCheckbox = (item: any): boolean => {
	return false;
};

/**
 * 택배 스타일 함수 - 상태명 컬럼
 * @param rowIndex
 * @param columnIndex
 * @param value
 * @param headerText
 * @param item
 */
export const isStockLimit = (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
	const totstockqty = item?.totstockqty ?? '';
	const cumOrderQty = item?.cumOrderQty ?? '';
	// 재고 부족시 배경색 변경
	if (cumOrderQty > totstockqty) return 'gc-user41'; // 21:접수취소->빨강
	return '';
};

/**
 * 택배 스타일 함수 - 접수결과 컬럼
 * @param rowIndex
 * @param columnIndex
 * @param value
 * @param headerText
 * @param item
 */
export const isRcptErrYn = (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
	if ((item?.rcptErrYn ?? '') === 'Y') return 'gc-user41'; // 21:접수취소->빨강
	return '';
};

// 수량 비교용 안전 숫자 변환
const toNumberSafe = (value: any): number => {
	const num = Number(String(value ?? '').replace(/,/g, ''));
	return Number.isNaN(num) ? 0 : num;
};

// 주문수량과 박스수량이 다르면 true
const isOrderQtyMismatch = (item: any): boolean => {
	if (!item || !item.boxqty) return false;

	return toNumberSafe(item.orderqty) !== toNumberSafe(item.boxqty);
};

/**
 * 주문/출고 공용 그리드 컬럼 레이아웃 생성
 * @param t 번역 함수
 * @param islVisibleCol 숨김 컬럼 노출 여부
 * @param opts.gridRef 그리드 ref
 * @param opts.refModalPop 모달 ref
 * @param opts.setPopupType 팝업 타입 설정 함수
 * @param opts.lockEditors true 시 모든 편집/드롭다운 비활성
 * @param opts.extraHiddenCols 추가 히든 컬럼 배열
 * @param {any} opts
 * @param {any} opts.deliverySvcType
 * @param {any} opts.deliverySvcTypeTab
 * @param {any} opts.activeKey
 */
export const buildGridCol = (
	t: any,
	islVisibleCol = true,
	opts?: {
		gridRef?: any;
		refModalPop?: any;
		setPopupType?: any;
		lockEditors?: boolean;
		extraHiddenCols?: Array<Record<string, any>>;
		deliverySvcTypeTab?: string;
		activeKey?: string;
	},
) => {
	const { gridRef, refModalPop, setPopupType, deliverySvcTypeTab, activeKey } = opts || {};
	const isReturn = deliverySvcTypeTab === '02'; // 반품(02)일 경우 재고정보 숨김 여부
	const showStockInfo = !isReturn;
	const isFirstTab = activeKey === '1';
	return [
		{
			headerText: t('lbl.STATUS'),
			dataField: 'statusnm',
			dataType: 'code',
			editable: false,
			styleFunction: commUtil.styleBackGround02,
		}, // 진행상태
		{
			headerText: t('재고제외사유'),
			dataField: 'exceptReasonCd', // 제외
			dataType: 'code',
			width: 80,
			editable: false,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('EXCLUDE_REASON'),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					//return isDisabled(item);
					return true;
				},
			},
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (isDisabled(item)) {
			// 		// 편집 가능 class 삭제
			// 		gridRef.current.removeEditClass(columnIndex);
			// 	} else {
			// 		// 편집 가능 class 추가
			// 		return 'isEdit';
			// 	}
			// },
		},

		{
			headerText: t('lbl.DLV_DV_NEXT'),
			dataField: 'nDeliveryYn', // N배송
			dataType: 'string',
			width: 70,
			editable: false,
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: 'Y',
				unCheckValue: 'N',
				editable: false,
				readOnlySetDisabled: true,
				disabledFunction: function () {
					return true;
				},
			},
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (isDisabled(item)) {
			// 		// 편집 가능 class 삭제
			// 		gridRef.current.removeEditClass(columnIndex);
			// 	} else {
			// 		// 편집 가능 class 추가
			// 		return 'isEdit';
			// 	}
			// },
		},
		{
			headerText: t('접수시간대'),
			dataField: 'rcptHourType', // 접수시간대
			required: true,
			editable: false,
			dataType: 'string',
			commRenderer: {
				type: 'dropDown',
				list: [
					{ comCd: '1', cdNm: t('오전') },
					{ comCd: '2', cdNm: t('오후') },
				],
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					//return isDisabled(item);
					return true;
				},
			},
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (isDisabled(item)) {
			// 		// 편집 가능 class 삭제
			// 		gridRef.current.removeEditClass(columnIndex);
			// 	} else {
			// 		// 편집 가능 class 추가
			// 		return 'isEdit';
			// 	}
			// },
		},
		{ headerText: t('lbl.REQ_DATE'), dataField: 'reqDate', dataType: 'date', editable: false }, // 납품요청일자
		{ headerText: t('lbl.EMP_CUST_DOCNO'), dataField: 'empCustDocno', dataType: 'code', editable: false }, // 판매사이트주문번호
		{ headerText: t('판매사이트코드'), dataField: 'empCustkey', dataType: 'code', editable: false }, // 판매사이트코드
		{ headerText: t('lbl.EMP_CUSTNM'), dataField: 'empCustnm', dataType: 'string', editable: false }, // 판매사이트명
		{
			headerText: t('운송장번호'),
			dataField: 'invoiceno',
			dataType: 'code',
			editable: false,

			commRenderer: {
				type: 'search',
				iconPosition: 'right',
				align: 'left',
				onClick: function (event: { dataField: string; value: any; rowIndex: number; item: any }) {
					// event.value 또는 item.invoiceno에서 운송장번호 추출
					const invoiceNo = event.value || event.item?.invoiceno;

					// null 체크 후 처리
					if (!invoiceNo) {
						showAlert('', '운송장번호 정보가 없습니다.');
						return;
					}

					const params = {
						wblNo: invoiceNo, // 589413892191
					};
					extUtil.openWdTrackingDelivery(params);
				},
			},
		}, // 운송장번호
		{ headerText: t('N상품'), dataField: 'nskuyn', dataType: 'code', editable: false }, // N상품
		{ headerText: t('상품코드'), dataField: 'sku', dataType: 'code', editable: false }, // 상품코드
		{ headerText: t('lbl.SKUNM'), dataField: 'description', dataType: 'string', editable: false }, // 상품명
		{ headerText: t('저장조건'), dataField: 'storagetypenm', dataType: 'code', editable: false }, // 저장조건
		{ headerText: t('가로/세로/높이'), dataField: 'cubedescr', dataType: 'code', editable: false }, // 가로/세로/높이
		{ headerText: t('부피(cm3)'), dataField: 'volume', dataType: 'numeric', editable: false }, // volume
		{ headerText: t('lbl.ORDERQTY'), dataField: 'orderqty', dataType: 'numeric', editable: false }, // 주문수량
		{ headerText: t('체적합(cm3)'), dataField: 'totvolume', dataType: 'numeric', editable: false }, // 체적합
		{
			dataField: 'boxtype',
			headerText: t('박스번호'), // 박스번호
			dataType: 'code',
			editable: true,
			required: true,
			disableMoving: true,

			commRenderer: {
				type: 'search',
				popupType: 'box',
				searchDropdownProps: {
					dataFieldMap: {
						boxtype: 'code',
						boxnm: 'name',
					},
					callbackBeforeUpdateRow: (e: any) => {
						const selectedIndex = gridRef?.current?.getSelectedIndex();
					},
				},
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					// 편집 불가능한 상태에서는 팝업을 띄우지 않음
					if (isDisabled(e.item)) {
						return;
					}
					refModalPop.current.open({
						gridRef: gridRef,
						rowIndex,
						dataFieldMap: {
							boxtype: 'code',
							boxnm: 'name',
						},
						popupType: 'box',
					});
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// isOrderQtyMismatch가 true일 때 글자색을 빨간색으로
					if (isOrderQtyMismatch(item)) {
						return { color: 'blue' };
					}
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'boxnm',
			headerText: t('박스명'), //박스명
			dataType: 'string',
			editable: false,
			disableMoving: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				//return isOrderQtyMismatch(item) ? 'dec-minus' : '';
				if (isOrderQtyMismatch(item)) {
					return { color: 'blue' };
				}
			},
		},
		{ headerText: t('박스부피(cm3)'), dataField: 'cube', dataType: 'numeric', editable: false }, // 체적

		{
			headerText: t('박스순서'), // 박스순서
			headerTooltip: {
				show: true,
				tooltipHtml: '※파란색은 송장이 분리된 건입니다',
			},
			dataField: 'seq',
			dataType: 'numeric',
			editable: true,
			maxlength: 10,
			editRenderer: {
				type: 'InputEditRenderer',
				showEditorBtnOver: false,
				onlyNumeric: true,
				allowPoint: true,
				allowNegative: true,
				textAlign: 'right',
				maxlength: 10,
				autoThousandSeparator: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			headerText: t('포장수량'), // 포장수량
			dataField: 'boxqty',
			dataType: 'numeric',
			editable: true,
			maxlength: 10,
			editRenderer: {
				type: 'InputEditRenderer',
				showEditorBtnOver: false,
				onlyNumeric: true,
				allowPoint: true,
				allowNegative: true,
				textAlign: 'right',
				maxlength: 10,
				autoThousandSeparator: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		//
		//
		// {
		// 	headerText: t('주문누적수량'),
		// 	dataField: 'cumOrderQty',
		// 	dataType: 'numeric',
		// 	editable: false,
		// 	styleFunction: isStockLimit,
		// 	visible: isFirstTab && showStockInfo,
		// }, // 주문누적수량
		{
			headerText: t('lbl.QTY_2600'), // 재고(2600)
			dataField: 'qty2600',
			dataType: 'numeric',
			editable: false,
			width: 120,
			visible: showStockInfo,
		},
		{
			headerText: t('lbl.QTY_2900'), // 재고(2900)
			dataField: 'qty2900',
			dataType: 'numeric',
			editable: false,
			visible: showStockInfo,
		},
		{ headerText: t('총재고'), dataField: 'totstockqty', dataType: 'numeric', editable: false, visible: showStockInfo }, // 총재고
		{ headerText: t('lbl.ORDR_NM'), dataField: 'ordrNm', dataType: 'code', editable: false }, // 구매자명
		{ headerText: t('lbl.ORDR_CELL_NO'), dataField: 'ordrTelNo', dataType: 'code', editable: false }, // 구매자휴대폰번호
		//
		{ headerText: t('lbl.RCVR_NM'), dataField: 'rcvrNm', dataType: 'code', editable: false }, // 수령자명
		{ headerText: t('lbl.RCVR_TEL_NO'), dataField: 'rcvrTelNo', dataType: 'code', editable: false }, // 수령자전화번호
		{ headerText: t('lbl.RCVR_CELL_NO'), dataField: 'rcvrCellNo', dataType: 'code', editable: false }, // 수령자휴대폰번호
		//
		{ headerText: t('lbl.RCVR_ZIP_NO'), dataField: 'rcvrZipNo', dataType: 'code', editable: false }, // 배송지우편번호
		{ headerText: t('lbl.RCVR_ADDR'), dataField: 'rcvrAddr', dataType: 'string', editable: false }, // 배송지주소
		//
		{ headerText: t('lbl.DELIVERY_MSG'), dataField: 'deliveryMsg', dataType: 'string', editable: false }, // 배송메시지
		{ headerText: t('접수구분'), dataField: 'ordertypenm', width: 120, dataType: 'code', editable: false }, // 접수구분
		{ headerText: t('요청구분'), dataField: 'worktypenm', width: 120, dataType: 'code', editable: false }, // 요청구분
		{ headerText: t('출력상태'), dataField: 'prtStnm', width: 120, dataType: 'code', editable: false }, // 출력상태
		{ headerText: t('원운송장번호'), dataField: 'oriInvoiceno', width: 120, dataType: 'code', editable: false }, // 원운송장번호
		{ headerText: t('출력횟수'), dataField: 'printCnt', width: 120, dataType: 'numeric', editable: false }, // 출력횟수

		{
			headerText: t('접수에러여부'),
			dataField: 'rcptErrYn',
			width: 120,
			dataType: 'code',
			editable: false,
			styleFunction: isRcptErrYn,
		}, // 접수에러여부
		{
			headerText: t('접수에러메세지'),
			dataField: 'rcptErrMsg',
			width: 120,
			dataType: 'code',
			editable: false,
			styleFunction: isRcptErrYn,
		}, // 접수에러메세지

		// START.Hidden Column
		{ dataField: 'ordertype', dataType: 'code', visible: islVisibleCol }, // 접수구분
		{ dataField: 'docno', dataType: 'code', visible: islVisibleCol }, // docno
		{ dataField: 'serialkey', dataType: 'string', visible: islVisibleCol },
		{ dataField: 'status', editable: false, visible: islVisibleCol },
		{ dataField: 'deliverySvcType', editable: false, visible: islVisibleCol }, // /*배송서비스구분(01:일반,02:반품,03:N배송)*/
		{ dataField: 'kxcustkey', dataType: 'string', visible: islVisibleCol },
		{ dataField: 'rowStatus', editable: false, visible: islVisibleCol }, // rowStatus
		// END.Hidden Column
		...(opts?.extraHiddenCols || []),
	];
};
/**
 * =====================================================================
 * 그리드 셀 편집 완료 이벤트 처리 함수
 * @param {object} event - AUIGrid 셀 편집 이벤트 객체
 * @param {any} ref - 그리드 ref 객체
 * @param gridRef
 * @param {Function} t - 번역 함수
 * @param {string} costperkg - KG당 폐기비용
 * =====================================================================
 */
export const handleCellEditEnd = (event: any, gridRef: any, t: any) => {
	const { value, item, oldValue } = event;

	// 박스번호 편집 시 처리 - 박스명 클리어
	if (event.dataField === 'boxtype') {
		const updatedRow = {
			...item,
			boxtype: value,
			boxnm: '', // 박스명 클리어
			rowStatus: 'U',
		};
		gridRef.updateRowsById([updatedRow], true);
		return;
	} else {
		const updatedRow = {
			...item,
			rowStatus: 'U',
		};
		gridRef.updateRowsById([updatedRow], true);
	}
};

/**
 * =====================================================================
 * 그리드 이벤트 바인딩 함수
 * - 셀 편집 완료 이벤트를 handleCellEditEnd 함수와 연결
 * - 엑셀 업로드 후에도 호출되어 이벤트 핸들링 유지
 * @param {any} gridRef - 그리드 ref 객체
 * @param {Function} t - 번역 함수
 * @param {any} form - Ant Form 인스턴스
 * @param {Function} fnCmIndividualPopup - 개인정보 팝업 함수
 * @param {string} activeKeyMaster - 활성 탭 키
 * =====================================================================
 * @param deliverySvcTypeTab
 */
export const bindGridEvents = (
	gridRef: any,
	t: any,
	form: any,
	fnCmIndividualPopup: any,
	deliverySvcTypeTab: string,
) => {
	if (gridRef) {
		// 셀 편집 시작 이벤트 바인딩
		gridRef?.unbind('cellEditBegin'); // [필수]기존 이벤트 핸들러 제거 - 안하면 재 랜더링 시 이벤트가 중복으로 발행함
		gridRef?.bind('cellEditBegin', function (event: any) {
			if (!isDisabled(event?.item)) {
				// disable 아니면 편집 허용
				return true;
			} else {
				return false;
			}
		});

		// 셀 편집 완료 이벤트 바인딩
		gridRef.unbind('cellEditEnd'); // [필수]기존 이벤트 핸들러 제거 - 안하면 재 랜더링 시 이벤트가 중복으로 발행함
		gridRef.bind('cellEditEnd', (event: any) => {
			handleCellEditEnd(event, gridRef, t);
		});

		// 더블 클릭 시
		gridRef.unbind('cellDoubleClick'); // [필수]기존 이벤트 핸들러 제거 - 안하면 재 랜더링 시 이벤트가 중복으로 발행함
		gridRef.bind('cellDoubleClick', async (event: { dataField: string; value: any; rowIndex: number }) => {
			const params = {
				...form.getFieldsValue(),
				reqDate: form.getFieldValue('reqDate').format('YYYYMMDD') ?? '', // 요청일
				deliverySvcTypeTab: deliverySvcTypeTab,
				//
				url: 'api/wd/kxdeliveryinvoice/v1.0/getMasterList2', // 팝업 URL 설정
				individualKey: '',
				individualColId: event.dataField, // 개인정보 복호화 컬럼값
				serialkey: gridRef.getCellValue(event.rowIndex, 'serialkey'), // 1건 조회하는 key 설정
				method: 'post',
			}; // 팝업 파라미터 초기화

			// 수신자
			if (event.dataField === 'rcvrNm') {
				params.individualKey = 'userNm'; // 개인정보 키 설정(userNm: 수령자명)
				fnCmIndividualPopup(params);
			} else if (event.dataField === 'ordrNm') {
				params.individualKey = 'userNm'; // 개인정보 키 설정(userNm: 주문자명)
				fnCmIndividualPopup(params);
			} else if (event.dataField === 'rcvrTelNo') {
				params.individualKey = 'handphoneNo'; // 개인정보 키 설정(rcvrTelNo: 휴대폰번호)
				fnCmIndividualPopup(params);
			} else if (event.dataField === 'rcvrCellNo') {
				params.individualKey = 'handphoneNo'; // 개인정보 키 설정(handphoneNo: 휴대폰번호)
				fnCmIndividualPopup(params);
			} else if (event.dataField === 'rcvrAddr') {
				params.individualKey = 'addr'; // 개인정보 키 설정(addr: 주소)
				fnCmIndividualPopup(params);
			} else if (event.dataField === 'ordrTelNo') {
				params.individualKey = 'telNo'; // 개인정보 키 설정(telNo: 전화번호)
				fnCmIndividualPopup(params);
			}
		});
	}
};

/**
 * 주소 패턴 체크 (한글, 영문, 숫자, 공백, -, ., , 만 허용)
 * @param address - 검사할 주소 문자열
 * @returns boolean - 유효하면 true, 아니면 false
 */

/**
 *
 * @param address
 */
export function isValidAddressPattern(address: string): boolean {
	if (!address) return false;

	const trimmed = address.trim();

	if (trimmed.length < 7 || trimmed.length > 120) return false;
	if (!/^[가-힣a-zA-Z0-9\s\-.,()/#]+$/.test(trimmed)) return false;
	if (!/[가-힣a-zA-Z0-9]/.test(trimmed)) return false;
	if (!/[0-9]/.test(trimmed)) return false;
	if (/[ \-.,()/#]{3,}/.test(trimmed)) return false;

	// 선행/후행 특수문자 금지 (괄호는 허용)
	if (/^[\s\-.,/#]/.test(trimmed) || /[\s\-.,/#]$/.test(trimmed)) return false;

	return true;
}
/**
 * 그리드 행 데이터에서 컬럼 레이아웃에 정의된 dataField 필드만 추출하는 함수
 * @param row
 * @param columnLayout
 * @returns
 */
export const pickGridFields = (row: any, columnLayout: Array<{ dataField?: string }>): Record<string, any> => {
	if (!row || !Array.isArray(columnLayout)) return {};
	const fields = new Set<string>((columnLayout || []).map(col => col.dataField).filter(Boolean) as string[]);
	const out: Record<string, any> = {};
	Object.keys(row).forEach(k => {
		if (fields.has(k)) out[k] = row[k];
	});
	return out;
};

/**
 * 송장분리 처리 공통 함수
 * @param gridRef - 그리드 ref 객체
 * @param t - 번역 함수
 * @param apiSaveMasterInvoiceDivide - API 호출 함수
 * @param onSuccess - 성공 콜백
 */
export const handleInvoiceDivide = async (
	gridRef: any,
	t: any,
	apiSaveMasterInvoiceDivide: any,
	onSuccess?: () => void,
) => {
	const checkedRows = gridRef.getCheckedRowItems();

	const buildSaveList = () => {
		return gridRef.getCheckedRowItemsAll().map((row: any) => ({
			serialkey: row.serialkey,
		}));
	};

	const params = {
		deliverySvcType: '03', // 배송서비스구분 - 01:일반,02:반품,03:N배송
		saveList: buildSaveList(),
	};

	try {
		const res = await apiSaveMasterInvoiceDivide(params);
		if (res.statusCode === 0) {
			if (onSuccess) onSuccess();
			return { success: true, processCnt: res.data?.processCnt || 0 };
		}
		return { error: 'Unknown error' };
	} catch (error) {
		return { error };
	}
};

/**
 * 저장 후 저장된 행으로 포커스 이동
 * @param gridRef - 그리드 ref
 * @param savedItems - 저장된 항목 배열 (serialkey, sku 포함)
 * @param targetDataField - 포커스할 컬럼의 dataField (기본값: 'exceptReasonCd')
 */
export const focusOnSavedRow = (
	gridRef: any,
	savedItems: Array<{ serialkey: string; sku: string }>,
	targetDataField = 'exceptReasonCd',
) => {
	if (!gridRef || !savedItems || savedItems.length === 0) return;

	const allData = gridRef.getGridData();

	if (!allData || allData.length === 0) return;

	// serialkey + sku 조합으로 첫 번째 일치하는 행 찾기
	const rowIndex = allData.findIndex((row: any) =>
		savedItems.some((item: any) => item.serialkey === row.serialkey && item.sku === row.sku),
	);

	if (rowIndex >= 0) {
		const colIndex = gridRef.getColumnIndexByDataField(targetDataField) || 0;
		gridRef.setSelectionByIndex(rowIndex, colIndex);
	}
};

/**
 * 운송장번호 포맷/검증 (4-4-4)
 * - 입력된 값에서 숫자만 추출 후 12자리까지 잘라 1234-1234-1234 형태로 변환
 * @param value
 */
export const formatInvoiceNo = (value: string): string => {
	if (!value) return '';
	const digits = String(value).replace(/\D/g, '').slice(0, 12);
	const part1 = digits.slice(0, 4);
	const part2 = digits.slice(4, 8);
	const part3 = digits.slice(8, 12);
	return [part1, part2, part3].filter(Boolean).join('-');
};

export const isValidInvoiceNo = (value: string): boolean => {
	if (!value) return false;
	const normalized = String(value).trim();
	const digitsOnly = normalized.replace(/\D/g, '');
	if (digitsOnly.length !== 12) return false;
	return /^\d{4}-\d{4}-\d{4}$/.test(normalized) || /^\d{12}$/.test(normalized);
};

/**
 * docno별로 그룹화하여 각 그룹의 첫 번째 serialkey만 추출
 * @param checkedItems - 체크된 행 배열
 * @returns 그룹별 첫 번째 serialkey를 쉼표로 구분한 문자열
 */
export const buildUniqueSerialKeysByDocno = (checkedItems: any[]): string => {
	const docnoMap = new Map<string, string>();

	for (const item of checkedItems) {
		const docno = item.docno;
		// 각 docno 그룹에 대해 첫 번째 serialkey만 저장
		if (!docnoMap.has(docno)) {
			docnoMap.set(docno, item.serialkey);
		}
	}

	return Array.from(docnoMap.values()).join(',');
};

/**
 * 저장 전 검증: 운송장번호(invoiceno)별로
 * 포장 대상 수량의 합(= 주문수량 orderqty 합)이 박스수량(boxqty)과 같은지 단순 체크
 * - 행 상태와 관계없이 전달된 배열에서 운송장번호별 합계를 계산
 * - 삭제된 행(rowStatus==='D')는 제외하여 현재 상태만 반영
 * @param rows 대상 행 배열 (예: saveList 또는 전체 그리드 데이터)
 * @returns { valid: boolean, mismatches: Array<{ invoiceno: string, orderSum: number, boxSum: number }> }
 */
export const validateInvoiceQtyEquality = (
	rows: Array<Record<string, any>>,
): { valid: boolean; mismatches: Array<{ invoiceno: string; orderSum: number; boxSum: number }> } => {
	if (!Array.isArray(rows) || rows.length === 0) return { valid: true, mismatches: [] };

	// 삭제된 행은 제외하여 현재 유효한 행만 대상으로 함
	const effectiveRows = rows.filter(r => (r?.rowStatus ?? '') !== 'D');
	if (effectiveRows.length === 0) return { valid: true, mismatches: [] };

	// invoiceno별 주문수량 합과 '그룹의 박스수량(행마다 동일 가정)' 비교
	const map: Record<string, { orderSum: number; boxQty?: number }> = {};
	for (const r of effectiveRows) {
		const key = String(r?.invoiceno ?? '').trim();
		if (!key) continue; // 운송장번호 없으면 스킵
		const order = Number(r?.orderqty ?? 0) || 0;
		const boxVal = Number(r?.boxqty ?? 0) || 0;
		if (!map[key]) map[key] = { orderSum: 0, boxQty: undefined };
		map[key].orderSum += order;
		// 그룹의 박스수량은 행별 동일 가정이므로 첫 값 사용
		if (map[key].boxQty === undefined) {
			map[key].boxQty = boxVal;
		}
	}

	const mismatches: Array<{ invoiceno: string; orderSum: number; boxSum: number }> = [];
	Object.keys(map).forEach(inv => {
		const orderSum = map[inv].orderSum;
		const boxSum = map[inv].boxQty ?? 0;
		if (orderSum !== boxSum) {
			mismatches.push({ invoiceno: inv, orderSum, boxSum });
		}
	});

	return { valid: mismatches.length === 0, mismatches };
};

/**
 * 접수시간대(rcptHourType) 혼재 검증 함수
 * - 체크된 행들이 '1'(오전)과 '2'(오후)가 섞여 있으면 오류 반환
 * @param checkedRows - 체크된 행 배열
 * @returns { valid: boolean, message?: string }
 */
export const validateRcptHourTypeMix = (
	checkedRows: Array<Record<string, any>>,
): { valid: boolean; message?: string } => {
	if (!Array.isArray(checkedRows) || checkedRows.length === 0) {
		return { valid: true };
	}

	const rcptHourTypes = new Set<string>();
	for (const row of checkedRows) {
		const rcptHourType = String(row?.rcptHourType ?? '').trim();
		if (rcptHourType) {
			rcptHourTypes.add(rcptHourType);
		}
	}

	// '1'과 '2'가 모두 포함되어 있으면 오류
	if (rcptHourTypes.size > 1) {
		return {
			valid: false,
			message: '접수시간대가 혼재되어 있습니다. 오전(1)과 오후(2) 별로 처리하세요.',
		};
	}

	return { valid: true };
};
