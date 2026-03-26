/*
 ############################################################################
 # FileName     : WdKxDeliveryInvoiceDetail1.tsx
 # Description  : 출고 > 출고작업 > 택배송장발행(온라인) > 주문 탭
 # Author       : sss
 # Since        : 2025.12.22
 ############################################################################
 
 ■ 주요 기능
 --------------------------------------------------
 1. 일반/N배송 주문 관리 (배송서비스구분: 01-일반, 03-N배송)
    - 재고제외사유 선택 및 저장
    - N배송 여부 설정
    - 접수시간대 선택
    - 재고 정보 조회 및 확인 (일반배송만 표시)
 
 2. N배송 분리 처리
    - 당일 업로드된 N배송 주문을 자동 분리
    - 요청일 기준으로 처리
 
 3. 접수 처리
    - 업로드 상태의 주문을 접수 확정
    - 체크된 행만 일괄 처리
 
 4. 데이터 검증
    - 필수 입력값 검증
    - 상태별 작업 가능 여부 검증 (업로드/접수실패 상태만 접수 가능)
    - 재고 부족 시 시각적 경고 표시
 
 ■ 주요 함수
 --------------------------------------------------
 - saveMasterList01()            : 재고제외사유 등 기본 정보 저장
 - saveMasterNDeliveryDivide()   : N배송 주문 분리 처리 (요청일 기준)
 - saveMasterReceipt()           : 접수 처리 (업로드 상태만 가능)
 
 ■ 상태 코드
 --------------------------------------------------
 - 10: 업로드 → 접수 가능, 저장 가능
 - 11: 업로드삭제
 - 12: 접수실패 → 접수 가능
 - 13: 배송제외
 - 16: 접수확정
 - 17: 송장분리완료
 - 20: 택배접수완료 → 수정 불가
 - 21: 택배접수취소 → 수정 불가
 
 ■ 특이사항
 --------------------------------------------------
 - 상태가 17(송장분리완료) 초과 시 모든 편집 비활성화
 - 재고 부족 시 주문누적수량 셀 배경색 경고 (빨강)
 - 일반배송(01)에서만 재고 정보 표시, 반품(02)에서는 숨김
 
*/
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import { Address } from 'react-daum-postcode';

// asset
import { apiSaveMasterList01, apiSaveMasterNDeliveryDivide, apiSaveMasterReceipt } from '@/api/wd/apiKxDeliveryInvoice';
import AGrid from '@/assets/styled/AGrid/AGrid';
import CmIndividualPopup from '@/components/cm/popup/CmIndividualPopup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import CmUserCdCfgPopup from '@/components/cm/popup/CmUserCdCfgPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { Button, SelectBox } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import {
	isCanCeterRecpt,
	isCanRecept01,
	validateRcptHourTypeMix,
} from '@/components/wd/kxDeliveryInvoice/WdKxDeliveryInvoice';
import { useOpenDaumPostcode } from '@/components/wd/quickRequest/WdQuickRequest';
import { GridBtnPropsType } from '@/types/common';
const WdKxDeliveryInvoiceDetail1 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, search } = props; // Antd Form
	const refModal = useRef(null);
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const [formRef] = Form.useForm();
	const [popUpParams, setPopUpParams] = useState({}); // 팝업 파마리터
	const islVisibleCol = false; // 컬럼 보이기/숨기기 토글용 변수

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	const refModalPop = useRef(null); // 그리드 팝업용 ref
	const refModalIndividualPop = useRef(null);

	// 편집 가능한 상태인지 확인하는 함수(1/3)
	/**
	 * 편집 가능한 상태인지 확인하는 함수
	 * @param {any} item - 그리드 행 아이템
	 * @returns {boolean} - 편집 가능 여부
	 */
	const isDisabled = (item: any): boolean => {
		// 값이 없으면 ''가 아니고 null임

		if (commUtil.nvl(item.status, '10') == '10') {
			// 10:업로드 상태일 때만 편집 가능
			return false;
		}
		return true;
	};

	const openDaumPostcode = useOpenDaumPostcode();
	const zipPopupContext = useRef<{ dataField: string; gridRef: any; rowIndex: number } | null>(null);
	const fnZipPopup = (dataField: string, gridRef: any, rowIndex: any) => {
		// 컨텍스트 저장
		zipPopupContext.current = { dataField, gridRef, rowIndex };
		openDaumPostcode({ onComplete: handleComplete });
	};

	// 우편번호 팝업 완료 콜백
	const handleComplete = (data: Address) => {
		let fullAddress = data.address;
		let extraAddress = '';

		if (data.addressType === 'R') {
			if (data.bname !== '') {
				extraAddress += data.bname;
			}
			if (data.buildingName !== '') {
				extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
			}
			fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
		}

		// 저장된 컨텍스트 사용
		if (zipPopupContext.current) {
			const { dataField, gridRef, rowIndex } = zipPopupContext.current;
			const addressInfo = { fullAddress: '', zonecode: '' };
			addressInfo.zonecode = data.zonecode;
			addressInfo.fullAddress = fullAddress;

			// 그리드에 적용
			gridRef.current.setCellValue(rowIndex, dataField, addressInfo.fullAddress);

			// dataField에 해당하는 열로 포커스 이동
			const columnIndex = gridRef.current.getColumnIndexByDataField(dataField);
			gridRef.current.setSelectionByIndex(rowIndex, columnIndex);
		}
	};
	// END.그리드 우편번호 팝업

	/**
	 * 택배 스타일 함수 - 접수결과 컬럼
	 * @param rowIndex
	 * @param columnIndex
	 * @param value
	 * @param headerText
	 * @param item
	 */
	const isRcptErrYn = (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
		if ((item?.rcptErrYn ?? '') === 'Y') return 'gc-user41'; // 21:접수취소->빨강
		return '';
	};

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.STATUS'),
			dataField: 'statusnm',
			dataType: 'code',
			editable: false,
			styleFunction: commUtil.styleBackGround02,
		}, // 진행상태
		{
			headerText: t('제외사유'),
			dataField: 'exceptReasonCd', // 제외
			dataType: 'code',
			width: 80,
			renderer: {
				type: 'DropDownListRenderer',
				list: [{ comCd: '', cdNm: '' }, ...getCommonCodeList('EXCLUDE_REASON')],
				keyField: 'comCd',
				valueField: 'cdNm',
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return isCanCeterRecpt(item);
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isCanCeterRecpt(item)) {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
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
				// 체크박스 disabled 함수
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return true;
				},
			},
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (isDisabled(item)) {
			// 		// 편집 가능 class 삭제
			// 		ref.gridRef.current.removeEditClass(columnIndex);
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
			dataType: 'string',
			renderer: {
				type: 'DropDownListRenderer',
				list: [
					{ comCd: '1', cdNm: t('오전') },
					{ comCd: '2', cdNm: t('오후') },
				],
				keyField: 'comCd',
				valueField: 'cdNm',
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return isCanCeterRecpt(item);
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isCanCeterRecpt(item)) {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{ headerText: t('lbl.REQ_DATE'), dataField: 'reqDate', dataType: 'date', editable: false }, // 납품요청일자
		{ headerText: t('lbl.EMP_DOCNO'), dataField: 'docno', dataType: 'code', editable: false }, // 주문고유번호
		{ headerText: t('lbl.EMP_CUST_DOCNO'), dataField: 'empCustDocno', dataType: 'code', editable: false }, // 판매사이트주문번호
		{ headerText: t('판매사이트코드'), dataField: 'empCustkey', dataType: 'code', editable: false }, // 판매사이트코드
		{ headerText: t('lbl.EMP_CUSTNM'), dataField: 'empCustnm', dataType: 'string', editable: false }, // 판매사이트명
		{ headerText: t('N상품'), dataField: 'nskuyn', dataType: 'code', editable: false }, // N상품
		{ headerText: t('lbl.MAST_SKU_CD'), dataField: 'sku', dataType: 'code', editable: false }, // 상품코드
		{ headerText: t('lbl.SKUNM'), dataField: 'description', dataType: 'string', editable: false }, // 상품명
		{ headerText: t('저장조건'), dataField: 'storagetypenm', dataType: 'code', editable: false }, // 저장조건
		{ headerText: t('가로/세로/높이'), dataField: 'cubedescr', dataType: 'code', editable: false }, // 가로/세로/높이
		{ headerText: t('체적(cm3)'), dataField: 'volume', dataType: 'numeric', editable: false }, // 체적
		{ headerText: t('lbl.ORDERQTY'), dataField: 'orderqty', dataType: 'numeric', editable: false }, // 주문수량
		{ headerText: t('체적합(cm3)'), dataField: 'totvolume', dataType: 'numeric', editable: false }, // 체적합
		// {
		// 	headerText: t('주문누적수량'),
		// 	dataField: 'cumOrderQty',
		// 	dataType: 'numeric',
		// 	editable: false,
		// 	styleFunction: isStockLimit,
		// }, // 주문누적수량
		{ headerText: t('lbl.QTY_2600'), dataField: 'qty2600', dataType: 'numeric', editable: false, width: 120 }, // 재고(2600)
		{ headerText: t('lbl.QTY_2900'), dataField: 'qty2900', dataType: 'numeric', editable: false }, // 재고(2900)
		{ headerText: t('총재고'), dataField: 'totstockqty', dataType: 'numeric', editable: false }, // 총재고
		{ headerText: t('lbl.ORDR_NM'), dataField: 'ordrNm', dataType: 'code', editable: false }, // 구매자명
		{ headerText: t('lbl.ORDR_CELL_NO'), dataField: 'ordrTelNo', dataType: 'code', editable: false }, // 구매자휴대폰번호
		{ headerText: t('lbl.RCVR_NM'), dataField: 'rcvrNm', dataType: 'code', editable: false }, // 수령자명

		{ headerText: t('lbl.RCVR_CELL_NO'), dataField: 'rcvrCellNo', dataType: 'code', editable: false }, // 수령자휴대폰번호
		{ headerText: t('lbl.RCVR_ZIP_NO'), dataField: 'rcvrZipNo', dataType: 'code', editable: false }, // 배송지우편번호
		{
			headerText: t('lbl.RCVR_ADDR'), // 배송지주소
			headerTooltip: {
				show: true,
				tooltipHtml: '※체크박스 체크 후 수정을 할 수 있습니다.',
			},
			dataField: 'rcvrAddr',
			dataType: 'string',
			editable: true,
			required: true,
			commRenderer: {
				type: 'search',
				//iconPosition: 'aisleRight',
				onClick: function (e: any) {
					// 편집 불가능한 상태에서는 팝업을 띄우지 않음
					if (isDisabled(e.item)) {
						return;
					}
					fnZipPopup('rcvrAddr', ref.gridRef, e.rowIndex);
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{ headerText: t('lbl.DELIVERY_MSG'), dataField: 'deliveryMsg', dataType: 'string', editable: false }, // 배송메시지
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
		{ dataField: 'serialkey', dataType: 'string', visible: islVisibleCol },
		{ dataField: 'status', editable: false, visible: islVisibleCol },
		{ dataField: 'deliverySvcType', editable: false, visible: islVisibleCol }, // /*배송서비스구분(01:일반,02:반품,03:N배송)*/
		{ dataField: 'rcvrAddrOri', editable: false, visible: islVisibleCol }, // 원수화인 주소
		// END.Hidden Column
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
		//
		enableCellMerge: true, // 셀 병합 실행
		// 행 체크 칼럼(엑스트라 체크박스)의 병합은 rcptNo 필드와 동일하게 병합 설정
		rowCheckMergeField: 'rcptNo',
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (isCanCeterRecpt(item)) {
				return 'aui-grid-row-disabled'; // 행 전체 비활성화 스타일
			}
			return '';
		},
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			return !isCanCeterRecpt(item); // status > '00'이면 체크박스 비활성화
		},
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 저장된 행으로 포커스 이동
	 * @param gridRef
	 * @param modifiedItems
	 * @param focusField
	 */
	const focusOnSavedRow = (gridRef: any, modifiedItems: any[], focusField: string) => {
		if (modifiedItems.length > 0) {
			const firstItem = modifiedItems[0];
			const rowIndex = gridRef.getRowIndexByValue('serialkey', firstItem.serialkey);
			if (rowIndex >= 0) {
				gridRef.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField(focusField));
				gridRef.scrollToItem(rowIndex);
			}
		}
	};

	/**
	 * 선택적용 - 선택된 행에 사유코드와 사유메시지 적용
	 */
	const handleSelectApply = () => {
		const gridRef = ref.gridRef.current;
		const checkedItems = gridRef.getCheckedRowItemsAll();

		const exceptReasonCd = formRef.getFieldValue('exceptReasonCd') ?? ''; // 사유코드
		const rcptHourType = formRef.getFieldValue('rcptHourType') ?? ''; // 시간구분

		gridRef.updateRowsById(
			checkedItems.map((item: any) => ({
				...item,
				exceptReasonCd: exceptReasonCd,
				rcptHourType: rcptHourType,
			})),
		);
	};

	/**
	 * 저장 - 주문내역 저장
	 */
	const saveMasterList01 = async () => {
		const gridRef = ref.gridRef.current;
		const checkedRows = gridRef.getCheckedRowItems();

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		const isChanged = gridRef.getChangedData({ validationYn: false });
		if (!isChanged || isChanged.length < 1) {
			showAlert(null, t('msg.noChange')); // 변경사항이 없습니다.
			return;
		}

		// 입력 값 검증
		// const isValid = await validateForm(formRef);
		// if (!isValid) {
		// 	return;
		// }

		// validation
		if (!gridRef.validateRequiredGridData()) return;

		const params = {
			...form.getFieldsValue(),
			reqDate: form.getFieldValue('reqDate').format('YYYYMMDD') ?? '', // 요청일
			saveList: gridRef.getCheckedRowItemsAll(), // 선택된 행의 데이터
		};

		// 저장하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_CFM_003'), async () => {
			apiSaveMasterList01(params).then(async res => {
				if (res?.statusCode === 0) {
					showAlert(null, t('msg.save1')); // 저장되었습니다

					await props.search();

					// 저장 후 저장된 행으로 포커스 이동
					setTimeout(() => {
						const g = ref.gridRef.current;
						if (g) {
							const modifiedItems = params.saveList.map((item: any) => ({
								serialkey: item.serialkey,
								sku: item.sku,
							}));
							focusOnSavedRow(g, modifiedItems, 'exceptReasonCd');
						}
					}, 300);
				}
			});
		});
	};

	/**
	 * 저장 - N배송 분리 처리
	 * @param {any} params
	 * @param {any} params.saveList
	 */
	const saveMasterNDeliveryDivide = async () => {
		const gridRef = ref.gridRef.current;

		// validation
		// 조회조건의 접수시간대 필수 체크
		const rcptHourType = form.getFieldValue('rcptHourType');
		if (!rcptHourType) {
			showAlert(null, '상단의 조회조건에서 접수시간대를 선택하세요.');
			return;
		}

		// 그리드의 모든 데이터에서 접수시간대가 비어있는 행이 있는지 확인
		const allGridData = gridRef.getGridData();
		const emptyRcptHourTypeRows = allGridData.filter((item: any) => !item.rcptHourType);
		if (emptyRcptHourTypeRows.length > 0) {
			showAlert(null, '접수시간대가 입력되지 않은 행이 있습니다. 먼저 입력 및 저장 후 처리해 주세요.');
			return;
		}

		// 접수시간대(오전/오후) 혼재 검증
		const rcptHourValidation = validateRcptHourTypeMix(allGridData);
		if (!rcptHourValidation.valid) {
			showAlert(null, rcptHourValidation.message || '접수시간대 검증에 실패했습니다.');
			return;
		}

		// 선택된 행이 없으면 경고 메시지 표시
		// if (checkedRows.length < 1) {
		// 	showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
		// 	return;
		// }

		// const isChanged = gridRef.getChangedData({ validationYn: false });
		// if (!isChanged || isChanged.length < 1) {
		// 	showAlert(null, t('msg.noChange')); // 변경사항이 없습니다.
		// 	return;
		// }

		// 입력 값 검증
		// const isValid = await validateForm(formRef);
		// if (!isValid) {
		// 	return;
		// }

		// validation
		//if (!gridRef.validateRequiredGridData()) return;

		// 저장 시 전송할 필드를 선택해 구성
		const buildSaveList = () => {
			const gridRef = ref.gridRef.current;
			return gridRef.getCheckedRowItemsAll().map((row: any) => ({
				sku: row.sku,
				empCustkey: row.empCustkey,
				serialkey: row.serialkey,
			}));
		};

		const reqDate2 = form.getFieldValue('reqDate').format('YYYY.MM.DD') ?? '';

		const params = {
			...form.getFieldsValue(),
			fixdccode: '2900', // TODO임시용
			reqDate: form.getFieldValue('reqDate').format('YYYYMMDD') ?? '', // 요청일
			//saveList: buildSaveList(), // 선택된 행의 데이터
		};

		// 저장하시겠습니까?
		showConfirm(
			null,
			t(`${form.getFieldValue('reqDate').format('YYYY-MM-DD')} 자의 N배송 상품을 분리 처리를 진행하시겠습니까?`),
			() => {
				apiSaveMasterNDeliveryDivide(params).then(res => {
					if (res.statusCode === 0) {
						//showAlert(null, t('msg.save1')); // 저장되었습니다
						showAlert(null, `N배송주문 ${res.data.processCnt || 0}건 분리되었습니다`);

						props.search();
					}
				});
			},
		);
	};

	/**
	 * 저장 - 센터접수 처리
	 * @param {any} params
	 * @param {any} params.saveList
	 */
	const saveMasterReceipt = async () => {
		const gridRef = ref.gridRef.current;
		const checkedRows = gridRef.getCheckedRowItems();
		const allGridData = gridRef.getGridData();

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// const isChanged = gridRef.getChangedData({ validationYn: false });
		// if (isChanged || isChanged.length > 0) {
		// 	showAlert(null, t('변경사항이 존재하여 저장 후 처리하세요.')); // 변경사항이 없습니다.
		// 	return;
		// }

		// 입력 값 검증
		// const isValid = await validateForm(formRef);
		// if (!isValid) {
		// 	return;
		// }

		// validation
		// 조회조건의 접수시간대 필수 체크
		const rcptHourType = form.getFieldValue('rcptHourType');
		if (!rcptHourType) {
			showAlert(null, '상단의 조회조건에서 접수시간대를 선택하세요.');
			return;
		}

		// validation
		if (!gridRef.validateRequiredGridData()) return;

		const allCheckedItems = gridRef.getCheckedRowItemsAll();

		// kxcustkey가 없는 행이 있는지 확인
		const noKxCustkeyRows = allCheckedItems.filter((item: any) => !item.kxCustkey);
		if (noKxCustkeyRows.length > 0) {
			showAlert(null, '저장 하지 않는 행이 있습니다. 먼저 저장 후 처리해 주세요.');
			return;
		}

		// 송장을 접수할 수 없는 상태의 행이 있으면 메시지 표시
		const disabledRows = checkedRows.filter((row: any) => !isCanRecept01(row.item ?? row));
		if (disabledRows.length > 0) {
			showAlert('', '업로드 상태가 아닌 행이 선택되어 있습니다.[업로드인 상태만 가능]');
			return;
		}
		// 접수시간대(오전/오후) 혼재 검증
		const rcptHourValidation = validateRcptHourTypeMix(allGridData);
		if (!rcptHourValidation.valid) {
			showAlert(null, rcptHourValidation.message || '접수시간대 검증에 실패했습니다.');
			return;
		}

		const params = {
			...form.getFieldsValue(),
			reqDate: form.getFieldValue('reqDate').format('YYYYMMDD') ?? '', // 요청일
			//saveList: buildSaveList(),
			fixdccode: '2900', // TODO임시용
			serialkey: gridRef
				.getCheckedRowItemsAll()
				.map((row: any) => row.serialkey)
				.join(','),
		};

		const totalCnt = gridRef.getCheckedRowItemsAll().length;

		// 저장하시겠습니까?
		showConfirm(null, t('접수 처리를 진행하시겠습니까?'), () => {
			apiSaveMasterReceipt(params).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, `총 ${totalCnt}개 중 ${res.data?.processCnt || 0}건 처리되었습니다`);
					props.search();
				}
			});
		});
	};

	/**
	 *  팝업
	 */
	const btnCode01PopupCallback = async () => {
		refModal.current.handlerOpen();
	};

	/**
	 * 팝업 닫기 이벤트
	 */
	const closeEvent01 = () => {
		refModalIndividualPop.current.handlerClose();
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef,
		btnArr: [
			// {
			// 	btnType: 'btn1' as const,
			// 	btnLabel: t('N배송기준관리'), // N배송기준관리
			// 	authType: 'save', // 권한
			// 	callBackFn: btnCode01PopupCallback,
			// },
			{
				btnType: 'btn1' as const,
				btnLabel: t('주문저장'), // 주문저장
				authType: 'save', // 권한
				callBackFn: saveMasterList01, // 주문내역 저장
			},
			{
				btnType: 'btn2' as const,
				btnLabel: t('N배송분리'), // N배송분리
				authType: 'save', // 권한
				callBackFn: saveMasterNDeliveryDivide,
			},
			{
				btnType: 'btn3' as const,
				btnLabel: t('센터접수'), // 센터접수
				authType: 'save', // 권한
				callBackFn: saveMasterReceipt,
			},
		],
	};

	// N배송기준관리 팝업 닫기
	const handleClosePopPopup = () => {
		refModal.current?.handlerClose();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 팝업 열기 이벤트
	 * @param params
	 */
	const fnCmIndividualPopup = (params: any) => {
		setPopUpParams(params);
		refModalIndividualPop.current.handlerOpen();
	};

	useEffect(() => {
		const gridRef = ref.gridRef.current;

		// 더블 클릭 시
		gridRef.unbind('cellDoubleClick');
		gridRef.bind('cellDoubleClick', async (event: { dataField: string; value: any; rowIndex: number }) => {
			const params = {
				...form.getFieldsValue(),
				reqDate: form.getFieldValue('reqDate').format('YYYYMMDD') ?? '', // 요청일
				//
				url: 'api/wd/kxdeliveryinvoice/v1.0/getMasterList', // 팝업 URL 설정
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
			} else if (event.dataField === 'rcvrCellNo') {
				params.individualKey = 'handphoneNo'; // 개인정보 키 설정(handphoneNo: 휴대폰번호)
				fnCmIndividualPopup(params);
			} else if (event.dataField === 'rcvrAddr') {
				// rcvrAddr과 rcvrAddrOri이 다르면 skip - 주소가 수정되었다면 팝업을 띄우지 않음
				// 또는 체크되어 있으면 skip
				const rcvrAddr = gridRef.getCellValue(event.rowIndex, 'rcvrAddr');
				const rcvrAddrOri = gridRef.getCellValue(event.rowIndex, 'rcvrAddrOri');
				const chk = gridRef.getCellValue(event.rowIndex, 'chk');
				if (rcvrAddr !== rcvrAddrOri || chk === '1') {
					return;
				}
				params.individualKey = 'addr'; // 개인정보 키 설정(addr: 주소)
				fnCmIndividualPopup(params);
			} else if (event.dataField === 'ordrTelNo') {
				params.individualKey = 'telNo'; // 개인정보 키 설정(telNo: 전화번호)
				fnCmIndividualPopup(params);
			}
		});
	}, []);

	/**
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef && props.data) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}

			<AGrid className="">
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt}>
					<Form form={formRef} layout="inline">
						{/* START.N배송기준관리 */}
						<Button size={'small'} className="mr20" onClick={() => btnCode01PopupCallback()}>
							{t('N배송기준관리')} {/* N배송기준관리 */}
						</Button>
						{/* END.N배송기준관리 */}

						<SelectBox
							name="exceptReasonCd"
							label={t('제외')} /*제외*/
							options={[{ comCd: '', cdNm: t('lbl.SELECT') }, ...getCommonCodeList('EXCLUDE_REASON')]}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							rules={[{ required: false, validateTrigger: 'none' }]}
							className="bg-white"
							style={{ width: '100px' }}
							initval={''}
						/>
						<SelectBox
							name="rcptHourType"
							label={t('접수시간대')} /*접수시간대*/
							options={[
								{ comCd: '1', cdNm: t('오전') },
								{ comCd: '2', cdNm: t('오후') },
							]}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							rules={[{ required: false, validateTrigger: 'none' }]}
							className="bg-white"
							style={{ width: '100px' }}
							initval={''}
						/>
						{/* START.선택적용 */}
						<Button size={'small'} className="mr20" onClick={() => handleSelectApply()}>
							{t('lbl.APPLY_SELECT')} {/* 선택적용 */}
						</Button>
						{/* END.선택적용 */}
					</Form>
				</GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			{/* 거래처별 상품관리 팝업 */}
			<CustomModal ref={refModal} width="1200px">
				<CmUserCdCfgPopup codeType={'N_DELIVERY_CUST_SKU'} close={handleClosePopPopup} />
			</CustomModal>
			{/* 개인정보 팝업 */}
			<CustomModal ref={refModalIndividualPop} width="700px" draggable={true}>
				<CmIndividualPopup popUpParams={popUpParams} close={closeEvent01} />
			</CustomModal>

			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModalPop} />
		</>
	);
});

export default WdKxDeliveryInvoiceDetail1;
