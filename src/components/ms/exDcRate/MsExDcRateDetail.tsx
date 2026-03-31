/*
############################################################################
# FiledataField	: MsExDcRateDetail.tsx
# Description	: 외부창고 요율관리 상세 그리드
# Author		: JinWoo.Park (pjw@company.com)
# Since			: 2025.06.11
############################################################################
*/
// API
import {
	apiGetDataSelectSkuForMsExDcRate,
	apiGetgetSkuSpecForMsExDcRate,
	apiMsExdcRateCheckRateAvg,
	apiMsExdcRateDeleteConfirm,
	apiMsExdcRateSaveConfirm,
} from '@/api/ms/apiMsExDcRate';
// Lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
// Utils
import { showAlert, showConfirm } from '@/util/MessageUtil';
//components
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
// Type
import { apiGetOrganizePopupList } from '@/api/cm/apiCmSearch';
import CustomModal from '@/components/common/custom/CustomModal';
import MsExdcRateUploadExcelPopup from '@/components/ms/exDcRate/MsExdcRateUploadExcelPopup';
import { GridBtnPropsType } from '@/types/common';
import { Button } from 'antd';
import dayjs from 'dayjs';

const MsExDcRateDetail = forwardRef((props: any, ref: any) => {
	// =====================================================================
	//  01. 변수 선언부
	// =====================================================================
	ref.gridRef = useRef();
	const uploadFile = useRef(null);
	const modalRef = useRef(null);
	const modalRef1 = useRef(null);
	const [specCodeMap, setspecCodeMap] = useState<{ [key: string]: string }>({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSizeScr] = useState(constants.PAGE_INFO.PAGE_SIZE);
	const refModal = useRef(null);
	const { t } = useTranslation();

	// =====================================================================
	//  02. 함수
	//======================================================================

	/**
	 * 유효성 체크
	 * @param saveList
	 * @param isExcel
	 * @returns
	 */
	const validChk = async (saveList: any, isExcel: boolean) => {
		const isValid = ref.gridRef.current.getChangedData({ validationYn: false });
		const wrongRows = saveList.filter((item: any) => String(item.fromDate) > String(item.toDate));
		// //console.log((ref.gridRef.current.validateRequiredGridData());
		if (wrongRows.length > 0) {
			showAlert('유효성 체크', '시작일자는 종료일자보다 작아야 합니다.');
			return false;
		} else if (!ref.gridRef.current.validateRequiredGridData()) {
			return false;
		}
		try {
			const hasOnlyRemoved =
				Array.isArray(saveList) && saveList.length > 0 && saveList.every(row => row.state === 'removed');
			if (hasOnlyRemoved) {
				saveMaster(saveList, isExcel);
			} else {
				apiMsExdcRateCheckRateAvg(saveList).then(res => {
					const hasZero = res.data.some((item: any) => item.checkCnt === 0);
					if (hasZero) {
						showAlert('요율 체크 결과', '신규 등록 건이 평균 요율에서 벗어납니다.', () =>
							saveMaster(saveList, isExcel),
						);
					} else {
						// 정상 처리
						saveMaster(saveList, isExcel);
					}
				});
			}
			// 정상 처리
		} catch (err) {}
	};
	const getExpenseType = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('EXPENSETYPE', value)?.cdNm;

		// return list;getCommonCodeList('ADJUST_APPLY_TYPE', '');
	};
	const getUomCd = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('UOM', value)?.cdNm;

		// return list;getCommonCodeList('ADJUST_APPLY_TYPE', '');
	};
	/**
	 * 상품 분류 세팅
	 * @param startIndex
	 * @param endIndex
	 * @param specCode
	 * @returns
	 */
	const setSepecCodeDetail = (startIndex: number, endIndex: number, specCode: string) => {
		if (specCode === '' || specCode === undefined) return;
		const code = String(specCode); // 숫자든 뭐든 문자열로 변환
		const prefix = code.substring(startIndex, endIndex); // 대분류 예시
		// //console.log((code);
		if (typeof code !== 'string' || prefix.length != endIndex) return '';
		//		//console.log(specCodeMap[prefix] ?? '');
		return specCodeMap[prefix] ?? '';
	};

	/**
	 * SKU 상세 데이터 세팅
	 * @param value
	 * @param selectRow
	 */
	const getSkuSelectData = (value: any, selectRow: number) => {
		const param = {
			sku: value,
			organize: ref.gridRef.current.getGridData()[selectRow].organize,
		};
		// //console.log(ref.gridRef.current.getGridData()[selectRow].organize);

		apiGetDataSelectSkuForMsExDcRate(param).then(res => {
			const gridRef = ref.gridRef.current;
			const data = res.data;
			if (!data) {
				gridRef.setCellValue(selectRow, 'storageTypeSku', '');
				gridRef.setCellValue(selectRow, 'netWeight', '');
				gridRef.setCellValue(selectRow, 'qtyPerBox', '');
				gridRef.setCellValue(selectRow, 'baseUom', '');
				gridRef.setCellValue(selectRow, 'specCode', '');
				gridRef.setCellValue(selectRow, 'skuName', '');
				gridRef.setCellValue(selectRow, 'boxPerPlt', '');
				gridRef.setCellValue(selectRow, 'layerPerPlt', '');
				return;
			}

			gridRef.setCellValue(selectRow, 'storageTypeSku', data.storageType);
			gridRef.setCellValue(selectRow, 'netWeight', data.netWeight);
			gridRef.setCellValue(selectRow, 'qtyPerBox', data.qtyPerBox);
			gridRef.setCellValue(selectRow, 'baseUom', data.baseUom);
			gridRef.setCellValue(selectRow, 'specCode', data.skuGroup);
			gridRef.setCellValue(selectRow, 'skuName', data.description);
			gridRef.setCellValue(selectRow, 'boxPerPlt', data.boxPerPlt);
			gridRef.setCellValue(selectRow, 'layerPerPlt', data.layerPerPlt);
			ref.gridRef?.current?.addCheckedRowsByIds(ref.gridRef?.current?.indexToRowId(selectRow));
		});
	};

	//삭제
	const deleteConfirm = () => {
		const gridRef = ref.gridRef.current;
		if (!gridRef) return;
		// if (props.user !== '2170') {
		// 	return false;
		// }
		const checkedRows = gridRef.getCheckedRowItems?.();
		const gridDataWithState = gridRef.getGridDataWithState?.('state');
		const result = checkedRows
			.map((r: any) => gridDataWithState[r.rowIndex])
			.filter((row: any) => row.state !== 'edited' && row.state !== 'added');
		if (checkedRows.length === 0 || result.length === 0) {
			showAlert('error', '삭제할 데이터를 선택해주세요.');
			return;
		}

		const param = checkedRows.map((e: any) => e.item);

		// 2. 전체 row의 상태 정보 가져오기
		apiMsExdcRateDeleteConfirm(result).then(res => {
			props.searchMaster();
		});
	};

	/**
	 * 요율 체크
	 * @returns
	 */
	const avgCheck = async () => {
		// if (props.user !== '2170') {
		// 	return false;
		// }
		const gridRef = ref.gridRef.current;
		if (!gridRef) return;

		// 1. 체크된 행들 가져오기
		const checkedRows = gridRef.getCheckedRowItems?.();
		// 2. 전체 row의 상태 정보 가져오기
		const gridDataWithState = gridRef.getGridDataWithState?.('state');

		const result = checkedRows
			.map((r: any) => gridDataWithState[r.rowIndex])
			.filter((row: any) => row.state === 'edited' || row.state === 'added' || row.state === 'removed');
		if (result.length === 0 || result === null) {
			showAlert('', '수정된 데이터가 없습니다.');
			return;
		}
		validChk(result, false);
	};

	/**
	 * 저장
	 * @param param
	 */
	const saveMaster1 = (param: any) => {
		showConfirm(
			'저장 확인',
			'저장하시겠습니까?',
			() => {
				apiMsExdcRateSaveConfirm(param).then(res => {
					if (res.statusCode === 0) {
						showAlert('저장', '저장되었습니다.');
						if (isModalOpen) {
							closeEvent();
						}
						props.callBackFn();
					} else {
						// showAlert('저장 결과', '저장에 실패하였습니다. 다시 시도해주세요.');
					}
				});
			},
			() => {
				return;
			},
		);
	};
	const saveMaster = (param: any, isExcel: boolean) => {
		let insertCount = 0;
		let updateCount = 0;
		let deleteCount = 0;
		//console.log((param);
		if (isExcel) {
			//console.log((isExcel);
			param?.forEach((item: any) => {
				switch (item.state) {
					case 'added':
						insertCount++;
						break;
					case 'edited':
						insertCount++;
						break;
					case 'removed':
						deleteCount++;
						break;
				}
			});
		} else if (!isExcel) {
			//console.log((isExcel);
			param?.forEach((item: any) => {
				switch (item.state) {
					case 'added':
						insertCount++;
						break;
					case 'edited':
						updateCount++;
						break;
					case 'removed':
						deleteCount++;
						break;
				}
			});
		}

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${insertCount}건
				수정 : ${updateCount}건
				삭제 : ${deleteCount}건`;
		showConfirm(
			null,
			messageWithRowStatusCount,
			() => {
				const saveList = { saveList: param };
				apiMsExdcRateSaveConfirm(param)
					.then(res => {
						if (res.statusCode === 0) {
							showAlert('저장', '저장되었습니다.');
							if (isModalOpen) {
								closeEvent();
							}
							props.callBackFn();
						} else {
							return false;
						}
					})
					.catch(() => false);
			},
			() => {
				return;
			},
		);
	};

	// ────────────────────────────────────────────────────────────────
	//  단가 / 수량 직접-환산 (EA·BOX·PAL·KG 전용)
	//  --------------------------------------------------------------
	//  • qtyPerBox   : EA per BOX
	//  • boxPerPal   : BOX per PAL
	//  • netWeightKg : kg  per EA
	// ────────────────────────────────────────────────────────────────
	type Unit = 'EA' | 'BOX' | 'PAL' | 'KG';

	const units: Unit[] = ['EA', 'BOX', 'PAL', 'KG'];
	const isUnit = (u: string | undefined | null): u is Unit => !!u && units.includes(u.toUpperCase() as Unit);

	const convertRate = (
		value: number,
		fromRaw: string | null | undefined,
		toRaw: string | null | undefined,
		qtyPerBox: number,
		boxPerPlt: number,
		netWeightKg: number,
	): number | null => {
		// 1) 값 검증 + 대문자 변환
		if (!isUnit(fromRaw) || !isUnit(toRaw)) {
			return null;
		}
		if (value == null) return 0;
		const from = fromRaw.toUpperCase() as Unit;
		const to = toRaw.toUpperCase() as Unit;
		// …(필수 숫자 체크 생략)…

		const factor: Record<Unit, Record<Unit, number>> = {
			EA: { BOX: 1 / qtyPerBox, PAL: 1 / (qtyPerBox * boxPerPlt), KG: netWeightKg, EA: 1 },
			BOX: { EA: qtyPerBox, BOX: 1, PAL: 1 / boxPerPlt, KG: qtyPerBox * netWeightKg },
			PAL: { EA: qtyPerBox * boxPerPlt, BOX: boxPerPlt, PAL: 1, KG: qtyPerBox * boxPerPlt * netWeightKg },
			KG: {
				EA: 1 / netWeightKg,
				BOX: 1 / (qtyPerBox * netWeightKg),
				PAL: 1 / (qtyPerBox * boxPerPlt * netWeightKg),
				KG: 1,
			},
		};

		const k = 1 / factor[from][to]; // ← 역수!
		if (k === Infinity || isNaN(k)) {
			return 0;
		} else {
			return Math.round(value * k * 100) / 100;
		}
	};
	const gridInit = () => {
		//console.log((gridInit);
		//console.log((ref.gridRef.current);
		const gridRefCur1 = ref.gridRef.current;
		gridRefCur1?.bind('cellEditEnd', function (event: any) {
			//	//console.log('cellEditEnd', event);
			const gridRef = ref.gridRef.current;
			const selectRow = event.rowIndex;
			const gridDataWithState = gridRef.getGridData();
			const rowData = gridDataWithState[selectRow];

			if (event.dataField == 'grPrice') {
				//입고비
				// 상품단가 grPriceUpperTransbaseUom
				const value = rowData.grPrice;
				const from = rowData.areaPriceUom;
				const tobaseUom = rowData.baseUom;
				const toKg = 'KG';
				const convertgrPriceUpperTransbaseUom = convertRate(
					value,
					from,
					tobaseUom,
					rowData.qtyPerBox,
					rowData.boxPerPlt,
					rowData.netWeight,
				);
				// 중량단가 grPriceUpperTransKg
				const convertgrPriceUpperTransKg = convertRate(
					value,
					from,
					toKg,
					rowData.qtyPerBox,
					rowData.boxPerPlt,
					rowData.netWeight,
				);
				gridRefCur1.setCellValue(selectRow, 'grPriceUpperTransbaseUom', convertgrPriceUpperTransbaseUom);
				gridRefCur1.setCellValue(selectRow, 'grPriceUpperTransKg', convertgrPriceUpperTransKg);
			}
			if (event.dataField == 'giPrice') {
				//출고비
				// 상품단가 giPriceUpperTransbaseUom
				const value = rowData.giPrice;
				const from = rowData.areaPriceUom;
				const tobaseUom = rowData.baseUom;
				const toKg = 'KG';
				const converUom = convertRate(value, from, tobaseUom, rowData.qtyPerBox, rowData.boxPerPlt, rowData.netWeight);
				// 중량단가 giPriceUpperTransKg
				const convertKg = convertRate(value, from, toKg, rowData.qtyPerBox, rowData.boxPerPlt, rowData.netWeight);
				gridRefCur1.setCellValue(selectRow, 'giPriceUpperTransbaseUom', converUom);
				gridRefCur1.setCellValue(selectRow, 'giPriceUpperTransKg', convertKg);
			}
			if (event.dataField == 'storagePrice') {
				//창고료
				// 상품단가 storagePriceUpperTransbaseUom
				const value = rowData.storagePrice;
				const from = rowData.areaPriceUom;
				const tobaseUom = rowData.baseUom;
				const toKg = 'KG';
				const converUom = convertRate(value, from, tobaseUom, rowData.qtyPerBox, rowData.boxPerPlt, rowData.netWeight);

				// 중량단가 storagePriceUpperTransKg
				const convertKg = convertRate(value, from, toKg, rowData.qtyPerBox, rowData.boxPerPlt, rowData.netWeight);
				gridRefCur1.setCellValue(selectRow, 'storagePriceUpperTransbaseUom', converUom);
				gridRefCur1.setCellValue(selectRow, 'storagePriceUpperTransKg', convertKg);
			}
			if (event.dataField == 'wghPrice') {
				//계근비(출고시)
				// 상품단가 wghPriceUpperTransbaseUom
				const value = rowData.wghPrice;
				const from = rowData.areaPriceUom;
				const tobaseUom = rowData.baseUom;
				const toKg = 'KG';
				const converUom = convertRate(value, from, tobaseUom, rowData.qtyPerBox, rowData.boxPerPlt, rowData.netWeight);
				// 중량단가 wghPriceUpperTransKg
				const convertKg = convertRate(value, from, toKg, rowData.qtyPerBox, rowData.boxPerPlt, rowData.netWeight);
				// gridRefCur1.setCellValue(selectRow, 'wghPriceUpperTransbaseUom', converUom);
				// gridRefCur1.setCellValue(selectRow, 'wghPriceUpperTransKg', convertKg);
				gridRefCur1.setCellValue(selectRow, 'wghPriceUpperTransbaseUom', value);
				gridRefCur1.setCellValue(selectRow, 'wghPriceUpperTransKg', value);
			}
			if (event.dataField == 'workPrice') {
				//작업비(출고시)
				// 상품단가 workPriceUpperTransbaseUom
				const value = rowData.workPrice;
				const from = rowData.areaPriceUom;
				const tobaseUom = rowData.baseUom;
				const toKg = 'KG';
				const converUom = convertRate(value, from, tobaseUom, rowData.qtyPerBox, rowData.boxPerPlt, rowData.netWeight);
				// 중량단가 workPriceUpperTransKg
				const convertKg = convertRate(value, from, toKg, rowData.qtyPerBox, rowData.boxPerPlt, rowData.netWeight);
				// gridRefCur1.setCellValue(selectRow, 'workPriceUpperTransbaseUom', converUom);
				// gridRefCur1.setCellValue(selectRow, 'workPriceUpperTransKg', convertKg);
				gridRefCur1.setCellValue(selectRow, 'storagePriceUpperTransbaseUom', value);
				gridRefCur1.setCellValue(selectRow, 'storagePriceUpperTransKg', value);
			}

			if (event.dataField == 'sku') {
				const sku = rowData.sku;

				getSkuSelectData(sku, selectRow);
			}
			if (event.dataField == 'organize') {
				// const sku = rowData.sku;
				const tt = currentPage - 1;
				const params = {
					name: event.item.organize,
					// dccode: gDccode,
					// dccode: props.customDccode ? props.customDccode : gDccode,
					startRow: 0 + tt * pageSizeScr,
					listCount: pageSizeScr,
					skipCount: currentPage !== 1,
					// userNm: props.type === 'user' ? value : '',
					customDccode: '2170', // 추가: customDccode 파라미터 설정
				};

				apiGetOrganizePopupList(params).then(res => {
					const list = res.data.list;
					if (list.length === 1) {
						gridRefCur1.setCellValue(selectRow, 'organizeNm', list[0].name);
					}
				});
			}
		});
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const onExcelUploadPopupClick = () => {
		// if (props.user !== '2170') return;
		if (ref.gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			showConfirm(
				null,
				t('msg.MSG_COM_CFM_009'),
				() => {
					modalRef1.current.handlerOpen();
					setIsModalOpen(true);
				},
				() => {
					return false;
				},
			);
		} else {
			modalRef1.current.handlerOpen();
			setIsModalOpen(true);
		}
	};

	const gridCol = [
		{
			dataField: 'fromDate',
			notBeginEventNewRowsOnPaste: true,
			headerText: '시작일자',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			required: true,
			// width: 120,
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (!item || item.delYn == null) {
					// item이 없거나 delYn이 없으면 기본값 반환 또는 아무것도 안함
					return;
				}
				if (item.delYn !== 'N') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			// labelFnction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
			// },
		},
		{
			dataField: 'toDate',
			notBeginEventNewRowsOnPaste: true,
			required: false,
			headerText: '종료일자',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			// width: 200,
			// renderer: {
			// 	type: 'CalendarRenderer',
			// 	onlyCalendar: true, // true: 텍스트 입력 비활성화, false: 입력 가능
			// 	showExtraDays: false,
			// },
			// editRenderer: {
			// 	type: 'ConditionRenderer',
			// 	conditionFunction: function (rowIndex, columnIndex, value, item) {
			// 		if (item.delYn === 'N') {
			// 			return {
			// 				type: 'CalendarRenderer',
			// 				onlyCalendar: true, // true: 텍스트 입력 비활성화, false: 입력 가능
			// 			};
			// 		}
			// 		return { type: 'InputEditRenderer' };
			// 	},
			// },
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (!item || item.delYn == null) {
					// item이 없거나 delYn이 없으면 기본값 반환 또는 아무것도 안함
					return;
				}
				if (item?.delYn !== 'N') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			// labelFnction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
			// },
		},
		{
			dataField: 'delYn',
			notBeginEventNewRowsOnPaste: true,
			headerText: '진행상태',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const code = getCommonCodebyCd('MS_USE_YN', value);
				return code?.cdNm ?? '신규';
			},
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'dcCode',
			headerText: '물류센터',
			dataType: 'code',
			editable: false,
			required: true,
			notBeginEventNewRowsOnPaste: true,
		},
		{
			dataField: 'dcName',
			headerText: '물류센터명',
			dataType: 'text',
			notBeginEventNewRowsOnPaste: true,
			editable: false,
			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: { dcCode?: any }) => {
				let cd = '';
				const dcCode = String(item.dcCode);
				if (getCommonCodebyCd('SUPPLY_DC', dcCode)?.cdNm != undefined) {
					cd = `[${dcCode}]` + getCommonCodebyCd('SUPPLY_DC', dcCode)?.cdNm;
				}
				return cd;
			},
		},
		{
			dataField: 'organize',
			notBeginEventNewRowsOnPaste: true,
			headerText: '창고',
			width: 109,
			dataType: 'code',
			required: true,

			commRenderer: {
				type: 'search',
				popupType: 'organize',
				searchDropdownProps: {
					dataFieldMap: {
						organize: 'code',
						organizeNm: 'name',
					},
				},
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					if (e.item.delYn !== 'N') {
						return false;
					}
					refModal.current.open({
						gridRef: ref.gridRef,
						rowIndex,
						codeName: e.value, // 돋보기 눌러서는 모달 열 때 value는 undefined입니다. ( event type이 다름 )
						customDccode: e.item.dcCode,
						dataFieldMap: {
							organize: 'code',
							organizeNm: 'name',
						},
						popupType: 'organize',
					});
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (!item || item.delYn == null) {
					// item이 없거나 delYn이 없으면 기본값 반환 또는 아무것도 안함
					return;
				}
				if (item.delYn !== 'N') {
					// 편집 가능 class 삭제

					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},

		{
			dataField: 'organizeNm',
			notBeginEventNewRowsOnPaste: true,
			headerText: '창고명',
			dataType: 'text',
			editable: false,
		},
		{
			dataField: 'custKey',
			notBeginEventNewRowsOnPaste: true,
			headerText: t('lbl.CUSTKEY_WD'),
			width: 109,
			dataType: 'text',
			required: false,
			editable: true,
			commRenderer: {
				type: 'search',
				popupType: 'cust',
				searchDropdownProps: {
					dataFieldMap: {
						custKey: 'code',
						custname: 'name',
					},
				},
				onClick: function (e: any) {
					if (e.item.delYn !== 'N') {
						return false;
					}
					refModal.current.open({
						gridRef: ref.gridRef,
						rowIndex: e.rowIndex,
						dataFieldMap: { custKey: 'code', custname: 'name' },
						popupType: 'cust',
					});
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (!item || item.delYn == null) {
					// item이 없거나 delYn이 없으면 기본값 반환 또는 아무것도 안함
					return;
				}
				if (item.delYn !== 'N') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'custname',
			headerText: t('lbl.CUSTNAME_WD'),
			width: 156,
			dataType: 'text',
			editable: false,
			notBeginEventNewRowsOnPaste: true,
		},

		// { dataField: 'organizeNm', headerText: '창고명', editable: false },
		//추후 공통 팝업 추가 예정
		{
			dataField: 'specCode',
			headerText: '상품분류',
			dataType: 'code',
			required: true,
			editable: false,
			notBeginEventNewRowsOnPaste: true,
		},
		{
			dataField: 'specCodeL',
			headerText: '상품분류(대)',
			width: 80,

			editable: false,
			notBeginEventNewRowsOnPaste: true,
			labelFunction: (
				rowIndex: number,
				colIndex: number,
				value: any,
				headerText: string,
				item: { specCode?: string },
			) => {
				return setSepecCodeDetail(0, 2, item.specCode);
			},
		},
		{
			dataField: 'specCodeM',
			headerText: '상품분류(중)',
			width: 100,
			editable: false,
			// copyDisplayValue: false,
			notBeginEventNewRowsOnPaste: true,

			labelFunction: (
				rowIndex: number,
				colIndex: number,
				value: any,
				headerText: string,
				item: { specCode?: string },
			) => {
				return setSepecCodeDetail(0, 4, item.specCode);
			},
		},
		{
			dataField: 'specCodeS',
			headerText: '상품분류(소)',
			notBeginEventNewRowsOnPaste: true,
			// copyDisplayValue: true,
			width: 120,
			editable: false,
			labelFunction: (
				rowIndex: number,
				colIndex: number,
				value: any,
				headerText: string,
				item: { specCode?: string },
			) => {
				return setSepecCodeDetail(0, 6, item.specCode);
			},
		},
		{
			dataField: 'specCodeD',
			headerText: '상품분류(세)',
			notBeginEventNewRowsOnPaste: true,
			width: 150,
			editable: false,
			labelFunction: (
				rowIndex: number,
				colIndex: number,
				value: any,
				headerText: string,
				item: { specCode?: string },
			) => {
				return setSepecCodeDetail(0, 8, item.specCode);
			},
		},

		// # Section 2: 상품 상세정보
		// { dataField: 'sku', headerText: '상품코드', required: true },

		{
			dataField: 'sku',
			headerText: '상품코드',
			notBeginEventNewRowsOnPaste: true,
			width: 109,
			dataType: 'code',
			// editable: false,
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (!item || item.delYn == null) {
					// item이 없거나 delYn이 없으면 기본값 반환 또는 아무것도 안함
					return;
				}
				if (item.delYn !== 'N') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			commRenderer: {
				type: 'search',
				popupType: 'sku',
				searchDropdownProps: {
					dataFieldMap: {
						sku: 'code',
						skuName: 'name',
					},
					callbackBeforeUpdateRow: (e: any) => {
						const selectedIndex = ref.gridRef?.current?.getSelectedIndex();

						getSkuSelectData(e.code, e.rowIndex);
					},
				},

				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					if (e.item.delYn !== 'N') {
						return false;
					}
					refModal.current.open({
						gridRef: ref.gridRef,
						codeName: e.value, // 돋보기 눌러서는 모달 열 때 value는 undefined입니다. ( event type이 다름 )
						rowIndex,
						dataFieldMap: {
							sku: 'code',
							skuName: 'name',
						},
						onConfirm: (selectedRows: any[]) => {
							const dataFieldMap = {
								sku: 'code',
								skuName: 'name',
							};

							const rowData = selectedRows[0];
							const updateObj: Record<string, any> = {};
							Object.entries(dataFieldMap).forEach(([targetField, sourceField]) => {
								updateObj[targetField] = rowData[sourceField];
							});
							// 안전한 업데이트를 위해 next tick으로 밀기
							setTimeout(() => {
								getSkuSelectData(rowData.code, rowIndex);
								ref.gridRef?.current?.updateRow(updateObj, rowIndex);
								refModal.current?.handlerClose();
							}, 0);
							// ref.gridRef?.current?.addCheckedRowsByIds(ref.gridRef?.current?.indexToRowId(rowIndex));
						},
						popupType: 'sku',
					});
				},
			},
		},
		{
			dataField: 'skuName',
			headerText: '상품명',
			notBeginEventNewRowsOnPaste: true,
			dataType: 'text',
			width: 300,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				ref.gridRef.current.removeEditClass(columnIndex);
			},
		},

		// { dataField: 'skuName', headerText: '상품명', editable: false, width: 300 },
		{
			dataField: 'storageTypeSku',
			notBeginEventNewRowsOnPaste: true,
			headerText: '저장조건',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STORAGETYPE', value)?.cdNm;
			},
			editable: false,
		},
		{
			dataField: 'netWeight',
			notBeginEventNewRowsOnPaste: true,
			headerText: '실중량',
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'qtyPerBox',
			notBeginEventNewRowsOnPaste: true,
			headerText: '박스입수',
			dataType: 'numeric',
			editable: false,
		},

		{
			headerText: '창고단가',
			children: [
				{
					dataField: 'areaPriceUom',
					labelFunction: getUomCd,
					headerText: '단위',
					notBeginEventNewRowsOnPaste: true,
					width: 60,
					required: true,
					dataType: 'code',
					// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
					// 	return getCommonCodebyCd('EXDCRATE_RANK', value)?.cdNm;
					// },
					// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (!item || item.delYn == null) {
							// item이 없거나 delYn이 없으면 기본값 반환 또는 아무것도 안함
							return;
						}
						if (item.delYn !== 'N') {
							// 편집 가능 class 삭제
							ref.gridRef.current.removeEditClass(columnIndex);
						} else {
							// 편집 가능 class 추가
							return 'isEdit';
						}
					},
					editRenderer: {
						// 	// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
						// 	type: 'DropDownListRenderer',
						// 	list: getCommonCodeList('UOM', '').filter(
						// 		item => item.comCd === 'EA' || item.comCd === 'KG' || item.comCd == 'PAL' || item.comCd === 'BOX',
						// 	),
						// 	keyField: 'comCd', // key 에 해당되는 필드명
						// 	valueField: 'cdNm',
						// },
						type: 'ConditionRenderer',
						conditionFunction: function (rowIndex, columnIndex, value, item) {
							if (item.delYn === 'N') {
								return {
									type: 'DropDownListRenderer',
									list: getCommonCodeList('UOM', '').filter(
										item => item.comCd === 'EA' || item.comCd === 'KG' || item.comCd == 'PAL' || item.comCd === 'BOX',
									),
									keyField: 'comCd', // key 에 해당되는 필드명
									valueField: 'cdNm',
								};
							}
							return { type: 'InputEditRenderer' };
						},
					},
				},
				{
					dataField: 'grPrice',
					headerText: '입고비',
					notBeginEventNewRowsOnPaste: true,
					dataType: 'numeric',
					formatString: '#,##0.##', // 표시 포맷
					editable: true, // ← 편집 가능
					required: true,
					editRenderer: {
						type: 'InputEditRenderer',
						// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
						// onlyNumeric: true, // 0~9만 입력가능
						onlyNumeric: false,
						allowPoint: true, // 소수점( . ) 도 허용할지 여부
						allowNegative: true, // 마이너스 부호(-) 허용 여부
						textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
						maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
						autoThousandSeparator: true, // 천단위 구분자 삽입 여부
						// decimalPrecision: 2, // 소숫점 2자리까지 허용
						regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (!item || item.delYn == null) {
							// item이 없거나 delYn이 없으면 기본값 반환 또는 아무것도 안함
							return;
						}
						if (item.delYn !== 'N') {
							// 편집 가능 class 삭제
							ref.gridRef.current.removeEditClass(columnIndex);
						} else {
							// 편집 가능 class 추가
							return 'isEdit';
						}
					},
				},
				{
					dataField: 'giPrice',
					notBeginEventNewRowsOnPaste: true,
					headerText: '출고비',
					dataType: 'numeric',
					required: true,
					// dataType: 'numeric',
					formatString: '#,##0.##', // 표시 포맷
					editable: true, // ← 편집 가능
					editRenderer: {
						type: 'InputEditRenderer',
						// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
						// onlyNumeric: true, // 0~9만 입력가능
						onlyNumeric: false,
						allowPoint: true, // 소수점( . ) 도 허용할지 여부
						allowNegative: true, // 마이너스 부호(-) 허용 여부
						textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
						maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
						autoThousandSeparator: true, // 천단위 구분자 삽입 여부
						// decimalPrecision: 2, // 소숫점 2자리까지 허용
						regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (!item || item.delYn == null) {
							// item이 없거나 delYn이 없으면 기본값 반환 또는 아무것도 안함
							return;
						}
						if (item.delYn !== 'N') {
							// 편집 가능 class 삭제
							ref.gridRef.current.removeEditClass(columnIndex);
						} else {
							// 편집 가능 class 추가
							return 'isEdit';
						}
					},
				},
				{
					dataField: 'storagePrice',
					notBeginEventNewRowsOnPaste: true,
					headerText: '창고료',
					dataType: 'numeric',
					required: true,
					formatString: '#,##0.##', // 표시 포맷
					editable: true, // ← 편집 가능
					editRenderer: {
						type: 'InputEditRenderer',
						// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
						// onlyNumeric: true, // 0~9만 입력가능
						onlyNumeric: false,
						allowPoint: true, // 소수점( . ) 도 허용할지 여부
						allowNegative: true, // 마이너스 부호(-) 허용 여부
						textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
						maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
						autoThousandSeparator: true, // 천단위 구분자 삽입 여부
						// decimalPrecision: 2, // 소숫점 2자리까지 허용
						regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (!item || item.delYn == null) {
							// item이 없거나 delYn이 없으면 기본값 반환 또는 아무것도 안함
							return;
						}
						if (item.delYn !== 'N') {
							// 편집 가능 class 삭제
							ref.gridRef.current.removeEditClass(columnIndex);
						} else {
							// 편집 가능 class 추가
							return 'isEdit';
						}
					},
				},
				{
					dataField: 'wghPrice',
					notBeginEventNewRowsOnPaste: true,
					headerText: '계근비(출고시)',
					dataType: 'numeric',
					// required: true,
					formatString: '#,##0.##', // 표시 포맷
					editable: true, // ← 편집 가능
					editRenderer: {
						type: 'InputEditRenderer',
						// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
						// onlyNumeric: true, // 0~9만 입력가능
						onlyNumeric: false,
						allowPoint: true, // 소수점( . ) 도 허용할지 여부
						allowNegative: true, // 마이너스 부호(-) 허용 여부
						textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
						maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
						autoThousandSeparator: true, // 천단위 구분자 삽입 여부
						// decimalPrecision: 2, // 소숫점 2자리까지 허용
						regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (!item || item.delYn == null) {
							// item이 없거나 delYn이 없으면 기본값 반환 또는 아무것도 안함
							return;
						}
						if (item.delYn !== 'N') {
							// 편집 가능 class 삭제
							ref.gridRef.current.removeEditClass(columnIndex);
						} else {
							// 편집 가능 class 추가
							return 'isEdit';
						}
					},
				},
				{
					dataField: 'workPrice',
					headerText: '작업비(출고시)',
					notBeginEventNewRowsOnPaste: true,
					dataType: 'numeric',
					// required: true,
					formatString: '#,##0.##', // 표시 포맷
					editable: true, // ← 편집 가능
					editRenderer: {
						type: 'InputEditRenderer',
						// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
						// onlyNumeric: true, // 0~9만 입력가능
						onlyNumeric: false,
						allowPoint: true, // 소수점( . ) 도 허용할지 여부
						allowNegative: true, // 마이너스 부호(-) 허용 여부
						textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
						maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
						autoThousandSeparator: true, // 천단위 구분자 삽입 여부
						// decimalPrecision: 2, // 소숫점 2자리까지 허용
						regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (!item || item.delYn == null) {
							// item이 없거나 delYn이 없으면 기본값 반환 또는 아무것도 안함
							return;
						}
						if (item.delYn !== 'N') {
							// 편집 가능 class 삭제
							ref.gridRef.current.removeEditClass(columnIndex);
						} else {
							// 편집 가능 class 추가
							return 'isEdit';
						}
					},
				},
				{
					dataField: 'pltPrice',
					headerText: '팔렛트단가',
					notBeginEventNewRowsOnPaste: true,
					dataType: 'numeric',
					// required: true,
					formatString: '#,##0.##', // 표시 포맷
					editable: true,
					editRenderer: {
						type: 'InputEditRenderer',
						// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
						// onlyNumeric: true, // 0~9만 입력가능
						onlyNumeric: false,
						allowPoint: true, // 소수점( . ) 도 허용할지 여부
						allowNegative: true, // 마이너스 부호(-) 허용 여부
						textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
						maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
						autoThousandSeparator: true, // 천단위 구분자 삽입 여부
						// decimalPrecision: 2, // 소숫점 2자리까지 허용
						regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (!item || item.delYn == null) {
							// item이 없거나 delYn이 없으면 기본값 반환 또는 아무것도 안함
							return;
						}
						if (item.delYn !== 'N') {
							// 편집 가능 class 삭제
							ref.gridRef.current.removeEditClass(columnIndex);
						} else {
							// 편집 가능 class 추가
							return 'isEdit';
						}
					},
				},
			],
		},
		{
			headerText: '상품단가',
			children: [
				{
					dataField: 'baseUom',
					headerText: '단위',
					notBeginEventNewRowsOnPaste: true,
					dataType: 'code',
					// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
					// 	return getCommonCodebyCd('EXDCRATE_RANK', value)?.cdNm;
					// },
					editable: false,
				},
				{
					dataField: 'grPriceUpperTransbaseUom',
					headerText: '입고비',
					notBeginEventNewRowsOnPaste: true,
					formatString: '#,##0.##', // 표시 포맷
					dataType: 'numeric',
					editable: false,
					labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
						return convertRate(
							item.grPrice,
							item.areaPriceUom,
							item.baseUom,
							item.qtyPerBox,
							item.boxPerPlt,
							item.netWeight,
						);
					},
				},
				{
					dataField: 'giPriceUpperTransbaseUom',
					headerText: '출고비',
					notBeginEventNewRowsOnPaste: true,
					formatString: '#,##0.##', // 표시 포맷
					dataType: 'numeric',
					editable: false,
					labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
						return convertRate(
							item.giPrice,
							item.areaPriceUom,
							item.baseUom,
							item.qtyPerBox,
							item.boxPerPlt,
							item.netWeight,
						);
					},
				},
				{
					dataField: 'storagePriceUpperTransbaseUom',
					headerText: '창고료',
					formatString: '#,##0.##', // 표시 포맷notBeginEventNewRowsOnPaste : true,
					dataType: 'numeric',
					editable: false,
					labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
						return convertRate(
							item.storagePrice,
							item.areaPriceUom,
							item.baseUom,
							item.qtyPerBox,
							item.boxPerPlt,
							item.netWeight,
						);
					},
				},
				{
					dataField: 'wghPriceUpperTransbaseUom',
					headerText: '계근비(출고시)',
					dataType: 'numeric',
					notBeginEventNewRowsOnPaste: true,
					formatString: '#,##0.##', // 표시 포맷
					editable: false,
					labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
						return item.wghPrice;
					},
				},

				{
					dataField: 'workPriceUpperTransbaseUom',
					headerText: '작업비(출고시)',
					notBeginEventNewRowsOnPaste: true,
					dataType: 'numeric',
					formatString: '#,##0.##', // 표시 포맷
					editable: false,
					labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
						return item.workPrice;
					},
				},
				{
					dataField: 'pltPriceUpperTransbaseUom',
					headerText: '팔렛트단가',
					notBeginEventNewRowsOnPaste: true,
					dataType: 'numeric',
					formatString: '#,##0.##', // 표시 포맷
					editable: false,
					labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
						return item.pltPrice;
					},
				},
			],
		},
		{
			headerText: '중량단가',
			children: [
				{
					dataField: 'KG',
					headerText: '단위',
					notBeginEventNewRowsOnPaste: true,
					formatString: '#,##0.##', // 표시 포맷
					dataType: 'code',
					editable: false,
					// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
					// 	return getCommonCodebyCd('EXDCRATE_RANK', value)?.cdNm;
					// },
					labelFunction: () => 'KG',
				},
				{
					dataField: 'grPriceUpperTransKg',
					headerText: '입고비',
					notBeginEventNewRowsOnPaste: true,
					formatString: '#,##0.##', // 표시 포맷
					dataType: 'numeric',
					editable: false,
					labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
						return convertRate(
							item.grPrice,
							item.areaPriceUom,
							'KG', // 항상 KG로 변환
							item.qtyPerBox,
							item.boxPerPlt,
							item.netWeight,
						);
					},
				},
				{
					dataField: 'giPriceUpperTransKg',
					notBeginEventNewRowsOnPaste: true,
					headerText: '출고비',
					dataType: 'numeric',
					formatString: '#,##0.##', // 표시 포맷
					editable: false,
					labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
						return convertRate(
							item.giPrice,
							item.areaPriceUom,
							'KG', // 항상 KG로 변환
							item.qtyPerBox,
							item.boxPerPlt,
							item.netWeight,
						);
					},
				},
				{
					dataField: 'storagePriceUpperTransKg',
					headerText: '창고료',
					notBeginEventNewRowsOnPaste: true,
					formatString: '#,##0.##', // 표시 포맷
					dataType: 'numeric',
					editable: false,
					labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
						return convertRate(
							item.storagePrice,
							item.areaPriceUom,
							'KG', // 항상 KG로 변환
							item.qtyPerBox,
							item.boxPerPlt,
							item.netWeight,
						);
					},
				},
				{
					dataField: 'wghPriceUpperTransKg',
					headerText: '계근비(출고시)',
					notBeginEventNewRowsOnPaste: true,
					dataType: 'numeric',
					formatString: '#,##0.##', // 표시 포맷
					editable: false,
					labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
						return item.wghPrice;
					},
				},
				{
					dataField: 'workPriceUpperTransKg',
					headerText: '작업비(출고시)',
					notBeginEventNewRowsOnPaste: true,
					dataType: 'numeric',
					formatString: '#,##0.##', // 표시 포맷
					editable: false,
					labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
						return item.workPrice;
					},
				},
				{
					dataField: 'pltPriceeUpperTransKg',
					headerText: '팔렛트단가',
					notBeginEventNewRowsOnPaste: true,
					dataType: 'numeric',
					formatString: '#,##0.##', // 표시 포맷
					editable: false,
					labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
						return item.pltPrice;
					},
				},
			],
		},
		// # Section 4: 2순위 환산 (단위: EA)

		// # Section 5: 하단 정보
		{
			dataField: 'expenseType',
			headerText: '입출고비정산구분',
			required: true,
			notBeginEventNewRowsOnPaste: true,
			dataType: 'code',
			width: 220,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (!item || item.delYn == null) {
					// item이 없거나 delYn이 없으면 기본값 반환 또는 아무것도 안함
					return;
				}
				if (item.delYn !== 'N') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			labelFunction: getExpenseType,
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex, columnIndex, value, item) {
					if (item.delYn === 'N') {
						return {
							type: 'DropDownListRenderer',
							list: getCommonCodeList('EXPENSETYPE', ''),
							keyField: 'comCd', // key 에 해당되는 필드명
							valueField: 'cdNm',
						};
					}
					return { type: 'InputEditRenderer' };
				},
			},
		},
		{
			dataField: 'addWho',
			headerText: '등록자',
			width: 90,
			notBeginEventNewRowsOnPaste: true,
			dataType: 'manager',
			managerDataField: 'addWhoId',
			editable: false,
		},
		{
			dataField: 'addDate',
			notBeginEventNewRowsOnPaste: true,
			headerText: '등록일시',
			dataType: 'date',

			dateInputFormat: 'yyyymmddHHMMss', // 실제 데이터의 형식 지정
			formatString: 'yyyy-mm-dd HH:MM:ss', // 실제 데이터 형식을 어떻게 표시할지 지정
			editable: false,
		},
		{
			dataField: 'editWho',
			notBeginEventNewRowsOnPaste: true,
			headerText: '수정자',
			width: 90,
			dataType: 'manager',
			managerDataField: 'editWhoId',
			editable: false,
		},
		{
			dataField: 'editDate',
			notBeginEventNewRowsOnPaste: true,
			headerText: '수정일시',
			editable: false,
			dataType: 'date',

			dateInputFormat: 'yyyymmddHHMMss', // 실제 데이터의 형식 지정
			formatString: 'yyyy-mm-dd HH:MM:ss', // 실제 데이터 형식을 어떻게 표시할지 지정
		},
		// # Section 1: Main grid
		{
			dataField: 'serialKey',
			// headerText: '박스당 낱개수',
			visible: false,
		},
		{
			dataField: 'layerPerPlt',
			headerText: '팔렛당적재단수',
			visible: false,
		},
	];

	const addRow = () => {
		const gridRef = ref.gridRef.current;
		const newRow = {
			dcCode: '2170',
			delYn: '신규',
		};
		const indexRow = gridRef.addRow(newRow);
		// gridRef.current.setCheckedRows(indexRow);
	};

	const deleteRow = () => {
		const gridRef = ref.gridRef.current;
		const selectRow = gridRef.getSelectedIndex()[0];

		if (selectRow < 0 || typeof selectRow !== 'number') {
			return false;
		}
		const gridDataWithState = gridRef.getGridDataWithState('state');
		const rowData = gridDataWithState[selectRow];

		if (rowData.state == 'added') {
			gridRef.removeRow(selectRow);
		} else {
			showAlert('', '신규행만 삭제 가능합니다');
		}
	};

	// 그리드 엑셀 다운로드
	const excelDownload = () => {
		const params = {
			fileName: storeUtil.getMenuInfo().progNm || t('lbl.EXCEL_DOWNLOAD'),
			exportWithStyle: true, // 스타일 적용 여부
			progressBar: true,
		};
		ref.gridRef.current?.exportToXlsxGrid(params);
	};

	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'copy',
				initValues: {
					dcCode: '2170',
					delYn: 'N',
					// fromDate: dayjs().startOf('month').format('YYYYMMDD'),
					// toDate: dayjs().endOf('year').format('YYYYMMDD'),
					rowStatus: 'I',
					serialKey: null,
				},
			},
			{
				btnType: 'plus', // 행추가
				initValues: {
					dcCode: '2170',
					delYn: 'N',
					fromDate: dayjs().startOf('month').format('YYYYMMDD'),
					toDate: dayjs().endOf('year').format('YYYYMMDD'),
					rowStatus: 'I',
				},
			},
			{
				btnType: 'delete', // 행삭제
				isActionEvent: false,
				callBackFn: () => {
					const gridRef = ref.gridRef.current;
					const chk = gridRef.getCheckedRowItems();
					if (chk.length === 0) {
						showAlert('', '삭제할 행을 선택해 주세요.');
						return;
					}
					if (chk.filter(row => row.item.delYn === 'Y').length > 0) {
						// gridRef.addCheckedRowsByIds(chk.filter(row => row.item.delYn === 'Y').map(row => row.item._$uid));
						showAlert('', '이미 삭제된 행이 존재합니다.');
						return;
					}
					// delYn === 'Y' 인 것만 골라 rowId로 언체크
					// const yRows = checked.filter(r => r.item?.delYn === 'Y');
					// if (yRows.length > 0) {
					// 	const rowIds = yRows.map(r => r.item._$uid); // ★ 여기!
					// 	// gridRef.addUncheckedRowsByValue('_$uid', rowIds);
					// 	gridRef.addUncheckedRowsByValue('delYn', 'Y'); // ✅ 'Y'인 행 모두 체크 해제
					// 	showAlert('', '이미 삭제된 행입니다.');
					// 	return;
					// }
					chk
						// .filter(row => row.item.rowStatus === 'I')
						.forEach(row => {
							gridRef.removeRowByRowId(row.item._$uid);
						});
				},
			},
			{ btnType: 'save', callBackFn: avgCheck },
		],
	};

	// 그리드 Props
	const gridProps = {
		editable: true,
		// showStateColumn: true,
		// editable: true,
		//editBeginMode: 'doubleClick',
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		enableFilter: true,
		matchColumnName: 'dataField', // ← headerText 말고 dataField 기준 매칭
		enableMovingColumn: false,
		isLegacyRemove: true,
		copyDisplayValue: true, //데이터 값을 복사할지 그리드에 의해 포매팅된 값을 복사할지 여부를 나타냅니다.
		// showFooter: true,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			dataField: 'fromDate',
			positionField: 'fromDate',
			operation: 'COUNT',
			postfix: ' rows',
		},
	];
	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef1.current.handlerClose();
		setIsModalOpen(false);
	};

	// =====================================================================
	//  03. React Hook Event
	// =====================================================================

	// // grid data 변경 감지
	// useEffect(() => {
	// 	const gridRefCur = ref.gridRef.current;
	// 	gridRefCur?.bind('ready', function (event: any) {
	// 		if (gridRefCur) {
	// 			gridInit(); // 이벤트 바인딩 함수
	// 		}
	// 	});
	// }, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
				gridRefCur1.setColumnPropByDataField('toDate', { width: 99 });
				gridRefCur1.setColumnPropByDataField('expenseType', { width: 220 });
				gridRefCur1.setColumnPropByDataField('areaPriceUom', { width: 60 });
				gridRefCur1.setColumnPropByDataField('sku', { width: 100 });

				gridRefCur1.setColumnPropByDataField('organize', { width: 150 });
				gridRefCur1.setColumnPropByDataField('specCode', { width: 93 });
				gridRefCur1.setColumnPropByDataField('specCodeM', { width: 145 });
				gridRefCur1.setColumnPropByDataField('specCodeS', { width: 200 });
				gridRefCur1.setColumnPropByDataField('specCodeD', { width: 200 });
				gridRefCur1.setColumnPropByDataField('addDate', { width: 168 });
				gridRefCur1.setColumnPropByDataField('editDate', { width: 168 });
			}
		}
	}, [props.data]);

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		// gridInit();
		if (gridRefCur) {
		}
	}, [ref.gridRef.current]);
	// useEffect(() => {
	// 	gridInit();
	// }, []);
	//상품 코드 전체 조회
	useEffect(() => {
		const param = {
			specCategory: 'SKUGROUP',
		};
		apiGetgetSkuSpecForMsExDcRate(param).then(res => {
			const map: { [key: string]: string } = {};
			res.data.forEach((item: { specCode: string; specDescr: string }) => {
				map[item.specCode] = item.specDescr;
			});
			setspecCodeMap(map);
		});
	}, []);

	if (Object.keys(specCodeMap).length === 0) {
		return <></>;
	}

	return (
		<>
			<AGrid>
				<GridTopBtn gridTitle={'외부창고요율관리'} gridBtn={gridBtn} totalCnt={props.totalCount}>
					<h3 className="mr10" style={{ color: 'red', width: '85%', marginLeft: '10px' }}>
						계근비, 작업비는 BOX단위기준입니다.
					</h3>
					<Button onClick={onExcelUploadPopupClick}>{t('lbl.EXCELUPLOAD')}</Button>
					<input ref={uploadFile} id="uploadInput" type="file" style={{ display: 'none' }} />
				</GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
			<CmSearchWrapper ref={refModal} />
			<CustomModal ref={modalRef1} width="1000px">
				<MsExdcRateUploadExcelPopup
					gridCol={gridCol}
					close={closeEvent}
					save={validChk}
					setSepecCodeDetail={setSepecCodeDetail}
				/>
			</CustomModal>
		</>
	);
});

export default MsExDcRateDetail;
