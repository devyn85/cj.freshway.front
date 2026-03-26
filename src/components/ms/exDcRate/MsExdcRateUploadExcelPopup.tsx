/*
 ############################################################################
 # FiledataField	: MsExdcRateUploadExcelPopup.tsx
 # Description		:  엑셀 업로드 예제 팝업
 # Author			: Canal Frame
 # Since			: 25.05.09
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils
import { showAlert } from '@/util/MessageUtil';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// API
import { apiPostExcelUpload } from '@/api/cm/apiCmExcel';
import { apiGetDataSelectSkuForMsExDcRate, apiMsExdcRateExcelCheck } from '@/api/ms/apiMsExDcRate';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import fileUtil from '@/util/fileUtils';
import { isEmpty } from 'lodash';
interface PropsType {
	close?: any;
	save?: any;
	gridCol?: any;
	setSepecCodeDetail?: any;
}

const MsExdcRateUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;
	const refModal = useRef(null);
	// 다국어
	const { t } = useTranslation();

	const gridRef1 = useRef(null);
	const [avgChk, setAvgChk] = useState(false);
	const [gridData, setGridData] = useState([]);
	const excelUploadFileRef = useRef(null);
	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
		enableMovingColumn: false,
		enableAutoColumnLayout: false, // 컬럼 자동 생성/정렬 방지
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'excelForm',
			// },
			{
				btnType: 'excelSelect', // 엑셀선택
				isActionEvent: false,
				callBackFn: () => {
					onClickUploadExcel();
				},
			},
			{
				btnType: 'save',
				callBackFn: () => {
					// 1. 체크된 행들 가져오기

					const gridRef = gridRef1.current;
					const checkedRows = gridRef.getCheckedRowItems?.();
					// 2. 전체 row의 상태 정보 가져오기
					const gridDataWithState = gridRef.getGridDataWithState?.('state');

					const result = checkedRows
						.map((r: any) => gridDataWithState[r.rowIndex])
						.filter(
							(row: any) =>
								(row.state === 'edited' || row.state === 'added' || row.state === 'removed') && row.uploadFlag !== 'E',
						);
					// //console.log(result);
					if (result.length === 0 || result === null) {
						showAlert('', '수정된 데이터가 없습니다.');
						return;
					}
					// if (!avgChk) {
					// 	showAlert('', '유효성검증을 먼저 실행해 주세요.');
					// 	return;
					// }
					props.save(result, true);
				},
			},
		],
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
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
		boxPerPal: number,
		netWeightKg: number,
	): number | null => {
		// 1) 값 검증 + 대문자 변환
		if (!isUnit(fromRaw) || !isUnit(toRaw)) {
			// //console.warn('잘못된 단위:', fromRaw, toRaw);
			return null;
		}
		if (value == null) return 0;
		const from = fromRaw.toUpperCase() as Unit;
		const to = toRaw.toUpperCase() as Unit;

		// …(필수 숫자 체크 생략)…

		const factor: Record<Unit, Record<Unit, number>> = {
			EA: { BOX: 1 / qtyPerBox, PAL: 1 / (qtyPerBox * boxPerPal), KG: netWeightKg, EA: 1 },
			BOX: { EA: qtyPerBox, BOX: 1, PAL: 1 / boxPerPal, KG: qtyPerBox * netWeightKg },
			PAL: { EA: qtyPerBox * boxPerPal, BOX: boxPerPal, PAL: 1, KG: qtyPerBox * boxPerPal * netWeightKg },
			KG: {
				EA: 1 / netWeightKg,
				BOX: 1 / (qtyPerBox * netWeightKg),
				PAL: 1 / (qtyPerBox * boxPerPal * netWeightKg),
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
		const gridRefCur1 = gridRef1.current;

		gridRefCur1?.bind('cellEditBegin', function (event: any) {
			if (event.dataField === 'organize' || event.dataField === 'sku') {
				return false;
			}
		});
		//단가 세팅
		gridRefCur1?.bind('cellEditEnd', function (event: any) {
			const gridRef = gridRef1.current;
			const selectRow = gridRef.getSelectedIndex()[0];

			const gridDataWithState = gridRef.getGridData();
			const rowData = gridDataWithState[selectRow];
			if (event.dataField == 'grPrice') {
				//입고비
				// 상품단가 grPriceUpperTransbaseUom
				// //console.log('grPriceUpperTransbaseUom');
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
				// //console.log(convertgrPriceUpperTransbaseUom);
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
				// //console.log(areaPriceUom);
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
				gridRefCur1.setCellValue(selectRow, 'wghPriceUpperTransbaseUom', converUom);
				gridRefCur1.setCellValue(selectRow, 'wghPriceUpperTransKg', convertKg);
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
				gridRefCur1.setCellValue(selectRow, 'workPriceUpperTransbaseUom', converUom);
				gridRefCur1.setCellValue(selectRow, 'workPriceUpperTransKg', convertKg);
			}
			if (event.dataField == 'sku') {
				const sku = rowData.sku;

				getSkuSelectData(sku, selectRow);
			}
		});
	};
	/**
	 * 엑셀의 내용을 Dataset 에 import 한다.
	 * @param {any} e React.ChangeEvent<HTMLInputElement>
	 * @param {number} nSheetIdx 읽어올 엑셀의 sheet index ('0' base)
	 * @param {any} gridRef 타겟 그리드 Ref
	 * @param {number} nStartRow 읽어올 시작 row. (default = 1)
	 * @returns {void}
	 */
	const excelImport = (e: React.ChangeEvent<HTMLInputElement>, nSheetIdx: number, gridRef: any, nStartRow: number) => {
		const target = e.currentTarget;

		const file = target.files[0];

		if (file === undefined) {
			return;
		} else {
			// 칼럼의 계층형 최대 높이 구하기
			let depth = 1;
			const columnLayout = gridRef?.current?.getColumnLayout();
			const getColumnDepth = (columnLayoutList: any) => {
				columnLayoutList?.map((layout: any) => {
					if (layout.depth > depth) {
						depth = layout.depth;
					}

					if (commUtil.isNotEmpty(layout.children)) {
						getColumnDepth(layout.children);
					}
				});
			};
			getColumnDepth(columnLayout);

			// 그리드 자식들의 칼럼 Key 목록
			const columnKeyList: any[] = [];
			if (gridRef?.current?.props?.gridProps?.showRowNumColumn !== false) {
				// 로우 넘버링 유무에 따른 칼럼 추가
				columnKeyList.push('no');
			}
			const columnInfoList = gridRef?.current?.getColumnInfoList();
			columnInfoList?.map((columnInfo: any) => {
				columnKeyList.push(columnInfo.dataField);
			});

			const jsonData = { startRow: depth, columnNames: columnKeyList };
			const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
			const formData = new FormData();
			formData.append('file', file);
			formData.append('params', jsonBlob);

			const params = formData;

			for (const pair of params.entries()) {
			}
			gridRef?.current?.clearGridData();
			apiPostExcelUpload(params).then((res: any) => {
				if (res.statusCode == 0) {
					gridRef.current?.addRow(res.data.rowsData);

					// 칼럼 사이즈 재조정
					const colSizeList = gridRef.current?.getFitColumnSizeList(true);
					gridRef.current?.setColumnSizeList(colSizeList);

					onDataCheckClick();
				}
			});
		}
	};
	/**
	 * 엑셀 업로드 버튼 클릭
	 */
	const onClickUploadExcel = () => {
		excelUploadFileRef.current.click();
	};
	const uploadSave = () => {
		const codeDtl = gridRef1.current.getGridData();

		const saveList1 = codeDtl.filter(item => item.rowStatus === 'I' && item.errYn === 'N');

		if (saveList1.length == 0) {
			showAlert('', '데이터가 없습니다.');
			return;
		}
		let insertCount = 0;
		const updateCount = 0;
		let deleteCount = 0;

		saveList1?.forEach((item: any) => {
			switch (item.rowStatus) {
				case 'I':
					insertCount++;
					break;
				case 'U':
					insertCount++;
					break;
				case 'D':
					deleteCount++;
					break;
			}
		});

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${insertCount}건
				수정 : ${updateCount}건
				삭제 : ${deleteCount}건`;
		showConfirm(
			null,
			messageWithRowStatusCount,
			() => {
				const saveList = { saveList: saveList1 };
				uploadSave();
			},
			() => {
				return;
			},
		);

		// //console.log(saveList);
	};
	/**
	 * 엑셀 양식 다운로드
	 * 로케이션 일괄업로드만 공통 기능을 사용하지 않고 버튼으로 추가(별도양식)
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: '외부창고요율관리 양식.xlsx',
		};

		fileUtil.downloadFile(params);
	};
	/**
	 * 엑셀 업로드 파일 변경 이벤트
	 * @param {object} e 이벤트
	 * @returns {void}
	 */
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		excelImport(e, 0, gridBtn.tGridRef, 1);
	};
	/**
	 * SKU 상세 데이터 세팅
	 * @param value
	 * @param selectRow
	 */
	const getSkuSelectData = (value: any, selectRow: number) => {
		const param = {
			sku: value,
		};

		apiGetDataSelectSkuForMsExDcRate(param).then(res => {
			const gridRef = gridRef1.current;
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
		});
	};

	// ✅ 값 정규화
	const norm = (v: any) => String(v ?? '').trim();

	// ✅ uploadMsg / uploadFlag 찍기
	const addUploadError = (r: any, msg: string) => {
		r.uploadFlag = 'E';

		const prev = norm(r.uploadMsg);
		if (!prev) {
			r.uploadMsg = msg;
			return;
		}
		if (prev.includes(msg)) return; // 중복 문구 방지
		r.uploadMsg = `${prev} / ${msg}`;
	};

	// ✅ fromDate,toDate,organize,custKey,sku 기준 중복 표시
	const markDuplicateByKey = (rows: any[]) => {
		const dupMsg = '중복된 항목이 있습니다';

		const keyOf = (r: any) =>
			`${norm(r.fromDate)}|${norm(r.toDate)}|${norm(r.organize)}|${norm(r.custKey)}|${norm(r.sku)}`;

		const map = new Map<string, any[]>();

		for (const r of rows) {
			const k = keyOf(r);
			if (!map.has(k)) map.set(k, []);
			map.get(k)!.push(r);
		}

		for (const [, arr] of map) {
			if (arr.length > 1) {
				arr.forEach(row => addUploadError(row, dupMsg));
			}
		}

		return rows;
	};
	// /**
	//  * 유효성 검증
	//  * @returns {void}
	//  */
	// const onDataCheckClick = () => {
	// 	// 변경 데이터 확인
	// 	const gpsList = gridRef1.current.getGridData();

	// 	// if (!gpsList || gpsList.length < 1) {
	// 	// 	// showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
	// 	// 	// 	return;
	// 	// 	// });
	// 	// } else if (gpsList.length > 0 && !gridRef1.current.validateRequiredGridData()) {
	// 	// 	return;
	// 	// } else {
	// 	const params = {
	// 		// processType: 'SPMS_CUSTDLVINFO_EXLCHK',
	// 		excelList: gpsList,
	// 	};
	// 	gridRef1.current.clearGridData();
	// 	apiMsExdcRateExcelCheck(params).then((res: any) => {
	// 		// gridRef.current.addRow(res.data);
	// 		const list = res.data;
	// 		setGridData(res.data);
	// 		gridRef1.current?.setGridData(res.data);
	// 		// const colSizeList = gridRef1.current?.getFitColumnSizeList(true);
	// 		// // 구해진 칼럼 사이즈를 적용 시킴.

	// 		gridRef1.current?.addCheckedRowsByValue('uploadFlag', 'S');
	// 		// setAvgChk(true);
	// 	});
	// 	// }
	// };
	const onDataCheckClick = () => {
		const gpsList = gridRef1.current.getGridData();

		const params = { excelList: gpsList };

		gridRef1.current.clearGridData();

		apiMsExdcRateExcelCheck(params).then((res: any) => {
			// ✅ 1) 서버 검증 결과
			const list = res.data ?? [];

			// ✅ 2) 프론트 중복 검증 추가(여기서 uploadMsg/uploadFlag 변경)
			const checked = markDuplicateByKey(list);

			// ✅ 3) 그리드 반영
			setGridData(checked);
			gridRef1.current?.setGridData(checked);
			const colSizeList = gridRef1.current?.getFitColumnSizeList(true);
			gridRef1.current?.setColumnSizeList(colSizeList);
			gridRef1.current?.setColumnPropByDataField('toDate', { width: 99 });
			gridRef1.current?.setColumnPropByDataField('expenseType', { width: 220 });
			gridRef1.current?.setColumnPropByDataField('areaPriceUom', { width: 60 });
			gridRef1.current?.setColumnPropByDataField('sku', { width: 100 });
			gridRef1.current?.setColumnPropByDataField('organize', { width: 150 });
			gridRef1.current?.setColumnPropByDataField('specCode', { width: 93 });
			gridRef1.current?.setColumnPropByDataField('specCode_M', { width: 145 });
			gridRef1.current?.setColumnPropByDataField('specCode_S', { width: 200 });
			gridRef1.current?.setColumnPropByDataField('specCode_D', { width: 200 });
			gridRef1.current?.setColumnPropByDataField('addDate', { width: 168 });
			gridRef1.current?.setColumnPropByDataField('editDate', { width: 168 });
			// 업로드 성공(S)만 체크하고 싶으면 그대로
			gridRef1.current?.addCheckedRowsByValue('uploadFlag', 'S');
		});
	};

	// 기존 gridCol에 에러 컬럼 추가
	const extendedGridCol = [
		// # Section 1: Main grid

		{
			dataField: 'fromDate',
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
			// labelFnction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
			// },
		},
		{
			dataField: 'toDate',
			required: true,
			headerText: '종료일자',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			// width: 200,
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
				onlyCalendar: false,
			},
			// labelFnction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
			// },
		},
		// {
		// 	dataField: 'delYn',
		// 	headerText: '진행상태',
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
		// 		const code = getCommonCodebyCd('DEL_YN', value);
		// 		return code?.cdNm ?? '신규';
		// 		// return getCommonCodebyCd('DEL_YN', value)?.cdNm;
		// 	},
		// 	dataType: 'code',
		// 	editable: false,
		// },
		{
			dataField: 'dcCode',
			width: 120,
			headerText: '물류센터',
			dataType: 'code',
			editable: false,
			required: true,
			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: { dcCode?: any }) => {
				let cd = '';
				const dcCode = String(item.dcCode);
				if (getCommonCodebyCd('SUPPLY_DC', dcCode)?.cdNm != undefined) {
					cd = `[${dcCode}]` + getCommonCodebyCd('SUPPLY_DC', dcCode)?.cdNm;
				}
				return cd;
			},
		},
		// {
		// 	dataField: 'dcName',
		// 	headerText: '물류센터명',
		// 	dataType: 'code',
		// 	width: 130,
		// 	editable: false,
		// 	labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: { dcCode?: any }) => {
		// 		let cd = '';
		// 		const dcCode = String(item.dcCode);
		// 		if (getCommonCodebyCd('SUPPLY_DC', dcCode)?.cdNm != undefined) {
		// 			cd = `[${dcCode}]` + getCommonCodebyCd('SUPPLY_DC', dcCode)?.cdNm;
		// 		}
		// 		return cd;
		// 	},
		// },
		// { dataField: 'organize', headerText: '창고', required: true },

		{
			dataField: 'organize',
			headerText: '창고',
			width: 95,
			dataType: 'code',
			required: true,
			commRenderer: {
				type: 'search',
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;

					refModal.current.open({
						gridRef: gridRef1,
						rowIndex,
						dataFieldMap: {
							organize: 'code',
							organizeNm: 'name',
						},
						popupType: 'organize',
					});
				},
			},
		},
		{ dataField: 'organizeNm', headerText: '창고명', dataType: 'text', editable: false, width: 125 },
		{
			dataField: 'custKey',
			headerText: '거래처',
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
					if (e.item.delYn !== 'N' || isEmpty(e.item.delYn)) {
						return false;
					}
					refModal.current.open({
						gridRef: gridRef1,
						rowIndex: e.rowIndex,
						dataFieldMap: { custKey: 'code', custname: 'name' },
						popupType: 'cust',
					});
				},
			},
		},
		// { dataField: 'custname', headerText: '거래처명', width: 156, dataType: 'text', editable: false },
		// { dataField: 'organizeNm', headerText: '창고명', editable: false },
		//추후 공통 팝업 추가 예정
		// { dataField: 'specCode', headerText: '상품분류', dataType: 'code', required: true, editable: false },
		// {
		// 	dataField: 'specCode_L',
		// 	headerText: '상품분류(대)',
		// 	width: 80,
		// 	editable: false,
		// 	labelFunction: (
		// 		rowIndex: number,
		// 		colIndex: number,
		// 		value: any,
		// 		headerText: string,
		// 		item: { specCode?: string },
		// 	) => {
		// 		return props.setSepecCodeDetail(0, 2, item.specCode);
		// 	},
		// },
		// {
		// 	dataField: 'specCode_M',
		// 	headerText: '상품분류(중)',
		// 	width: 100,
		// 	editable: false,
		// 	labelFunction: (
		// 		rowIndex: number,
		// 		colIndex: number,
		// 		value: any,
		// 		headerText: string,
		// 		item: { specCode?: string },
		// 	) => {
		// 		return props.setSepecCodeDetail(0, 4, item.specCode);
		// 	},
		// },
		// {
		// 	dataField: 'specCode_S',
		// 	headerText: '상품분류(소)',
		// 	width: 120,
		// 	editable: false,
		// 	labelFunction: (
		// 		rowIndex: number,
		// 		colIndex: number,
		// 		value: any,
		// 		headerText: string,
		// 		item: { specCode?: string },
		// 	) => {
		// 		return props.setSepecCodeDetail(0, 6, item.specCode);
		// 	},
		// },
		// {
		// 	dataField: 'specCode_D',
		// 	headerText: '상품분류(세)',
		// 	width: 150,
		// 	editable: false,
		// 	labelFunction: (
		// 		rowIndex: number,
		// 		colIndex: number,
		// 		value: any,
		// 		headerText: string,
		// 		item: { specCode?: string },
		// 	) => {
		// 		return props.setSepecCodeDetail(0, 8, item.specCode);
		// 	},
		// },

		// # Section 2: 상품 상세정보
		// { dataField: 'sku', headerText: '상품코드', required: true },

		{
			dataField: 'sku',
			headerText: '상품코드',
			width: 109,
			dataType: 'code',
			// editable: false,
			required: true,
			commRenderer: {
				type: 'search',
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					if (e.item.delYn !== 'N' || isEmpty(e.item.delYn)) {
						return false;
					}
					refModal.current.open({
						gridRef: gridRef1,
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
								gridRef1?.current?.updateRow(updateObj, rowIndex);
								refModal.current?.handlerClose();
							}, 0);
							gridRef1?.current?.addCheckedRowsByIds(gridRef1?.current?.indexToRowId(rowIndex));
						},
						popupType: 'sku',
					});
				},
			},
		},
		// { dataField: 'skuName', headerText: '상품명', editable: false, dataType: 'text', width: 300 },

		// { dataField: 'skuName', headerText: '상품명', editable: false, width: 300 },
		// {
		// 	dataField: 'storageTypeSku',
		// 	headerText: '저장조건',
		// 	dataType: 'code',
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
		// 		return getCommonCodebyCd('STORAGETYPE', value)?.cdNm ?? value;
		// 	},
		// 	editable: false,
		// },
		// { dataField: 'netWeight', headerText: '실중량', dataType: 'numeric', editable: false },
		// { dataField: 'qtyPerBox', headerText: '박스입수', dataType: 'numeric', editable: false },

		{
			headerText: '창고단가',
			children: [
				{
					dataField: 'areaPriceUom',

					headerText: '단위',
					width: 60,
					required: true,
					dataType: 'code',
					// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
					// 	return getCommonCodebyCd('EXDCRATE_RANK', value)?.cdNm;
					// },
					// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
					renderer: {
						// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
						type: 'DropDownListRenderer',
						list: getCommonCodeList('UOM', '').filter(
							item => item.comCd === 'EA' || item.comCd === 'KG' || item.comCd == 'PAL' || item.comCd === 'BOX',
						),
						keyField: 'comCd', // key 에 해당되는 필드명
						valueField: 'cdNm',
					},
				},
				{
					dataField: 'grPrice',
					headerText: '입고비',
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
				},
				{
					dataField: 'giPrice',
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
				},
				{
					dataField: 'storagePrice',
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
				},
				{
					dataField: 'wghPrice',
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
				},
				{
					dataField: 'workPrice',
					headerText: '작업비(출고시)',
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
				},
				{
					dataField: 'pltPrice',
					headerText: '팔렛트단가',
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
				},
			],
		},
		// {
		// 	headerText: '상품단가',
		// 	children: [
		// 		{
		// 			dataField: 'baseUom',
		// 			headerText: '단위',
		// 			// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
		// 			// 	return getCommonCodebyCd('EXDCRATE_RANK', value)?.cdNm;
		// 			// },
		// 			editable: false,
		// 		},
		// 		{
		// 			dataField: 'grPriceUpperTransbaseUom',
		// 			headerText: '입고비',
		// 			dataType: 'numeric',
		// 			editable: false,
		// 			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
		// 				// //console.log(item);
		// 				return convertRate(
		// 					item.grPrice,
		// 					item.areaPriceUom,
		// 					item.baseUom,
		// 					item.qtyPerBox,
		// 					item.boxPerPlt,
		// 					item.netWeight,
		// 				);
		// 			},
		// 		},
		// 		{
		// 			dataField: 'giPriceUpperTransbaseUom',
		// 			headerText: '출고비',
		// 			dataType: 'numeric',
		// 			editable: false,
		// 			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
		// 				// //console.log(item);
		// 				return convertRate(
		// 					item.giPrice,
		// 					item.areaPriceUom,
		// 					item.baseUom,
		// 					item.qtyPerBox,
		// 					item.boxPerPlt,
		// 					item.netWeight,
		// 				);
		// 			},
		// 		},
		// 		{
		// 			dataField: 'storagePriceUpperTransbaseUom',
		// 			headerText: '창고료',
		// 			dataType: 'numeric',
		// 			editable: false,
		// 			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
		// 				// //console.log(item);
		// 				return convertRate(
		// 					item.storagePrice,
		// 					item.areaPriceUom,
		// 					item.baseUom,
		// 					item.qtyPerBox,
		// 					item.boxPerPlt,
		// 					item.netWeight,
		// 				);
		// 			},
		// 		},
		// 		{
		// 			dataField: 'wghPriceUpperTransbaseUom',
		// 			headerText: '계근비(출고시)',
		// 			dataType: 'numeric',
		// 			editable: false,
		// 			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
		// 				// //console.log(item);
		// 				return item.wghPrice;
		// 			},
		// 		},

		// 		{
		// 			dataField: 'pltPriceUpperTransbaseUom',
		// 			headerText: '작업비(출고시)',
		// 			dataType: 'numeric',
		// 			editable: false,
		// 			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
		// 				// //console.log(item);
		// 				return item.workPrice;
		// 			},
		// 		},
		// 		{
		// 			dataField: 'workPriceUpperTransbaseUom',
		// 			headerText: '팔렛트단가',
		// 			dataType: 'numeric',
		// 			editable: false,
		// 			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
		// 				// //console.log(item);
		// 				return item.pltPrice;
		// 			},
		// 		},
		// 	],
		// },
		// {
		// 	headerText: '중량단가',
		// 	children: [
		// 		{
		// 			dataField: 'KG',
		// 			headerText: '단위',
		// 			dataType: 'code',
		// 			editable: false,
		// 			// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
		// 			// 	return getCommonCodebyCd('EXDCRATE_RANK', value)?.cdNm;
		// 			// },
		// 			labelFunction: () => 'KG',
		// 		},
		// 		{
		// 			dataField: 'grPriceUpperTransKg',
		// 			headerText: '입고비',
		// 			dataType: 'numeric',
		// 			editable: false,
		// 			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
		// 				return convertRate(
		// 					item.grPrice,
		// 					item.areaPriceUom,
		// 					'KG', // 항상 KG로 변환
		// 					item.qtyPerBox,
		// 					item.boxPerPlt,
		// 					item.netWeight,
		// 				);
		// 			},
		// 		},
		// 		{
		// 			dataField: 'giPriceUpperTransKg',
		// 			headerText: '출고비',
		// 			dataType: 'numeric',
		// 			editable: false,
		// 			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
		// 				return convertRate(
		// 					item.giPrice,
		// 					item.areaPriceUom,
		// 					'KG', // 항상 KG로 변환
		// 					item.qtyPerBox,
		// 					item.boxPerPlt,
		// 					item.netWeight,
		// 				);
		// 			},
		// 		},
		// 		{
		// 			dataField: 'storagePriceUpperTransKg',
		// 			headerText: '창고료',
		// 			dataType: 'numeric',
		// 			editable: false,
		// 			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
		// 				return convertRate(
		// 					item.storagePrice,
		// 					item.areaPriceUom,
		// 					'KG', // 항상 KG로 변환
		// 					item.qtyPerBox,
		// 					item.boxPerPlt,
		// 					item.netWeight,
		// 				);
		// 			},
		// 		},
		// 		{
		// 			dataField: 'wghPriceUpperTransKg',
		// 			headerText: '계근비(출고시)',
		// 			dataType: 'numeric',
		// 			editable: false,
		// 			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
		// 				return item.wghPrice;
		// 			},
		// 		},
		// 		{
		// 			dataField: 'workPriceUpperTransKg',
		// 			headerText: '작업비(출고시)',
		// 			dataType: 'numeric',
		// 			editable: false,
		// 			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
		// 				return item.workPrice;
		// 			},
		// 		},
		// 		{
		// 			dataField: 'pltPriceeUpperTransKg',
		// 			headerText: '팔렛트단가',
		// 			dataType: 'numeric',
		// 			editable: false,
		// 			labelFunction: (rowIndex: number, colIndex: number, value: any, headerText: string, item: any) => {
		// 				return item.pltPrice;
		// 			},
		// 		},
		// 	],
		// },
		// # Section 4: 2순위 환산 (단위: EA)

		// # Section 5: 하단 정보
		{
			dataField: 'expenseType',
			headerText: '입출고비정산구분',
			required: true,
			dataType: 'code',
			width: 220,
			renderer: {
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				list: getCommonCodeList('EXPENSETYPE', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
		},
		// { dataField: 'addWho', headerText: '등록자', dataType: 'code', editable: false, visible: false },
		// {
		// 	dataField: 'addDate',
		// 	headerText: '등록일시',
		// 	dataType: 'date',
		// 	width: 150,
		// 	dateInputFormat: 'yyyymmddHHMMss', // 실제 데이터의 형식 지정
		// 	formatString: 'yyyy-mm-dd HH:MM:ss', // 실제 데이터 형식을 어떻게 표시할지 지정
		// 	editable: false,
		// 	visible: false,
		// },
		// { dataField: 'editWho', headerText: '수정자', dataType: 'code', editable: false, visible: false },
		// {
		// 	dataField: 'editDate',
		// 	headerText: '수정일시',
		// 	editable: false,
		// 	dataType: 'date',
		// 	width: 150,
		// 	dateInputFormat: 'yyyymmddHHMMss', // 실제 데이터의 형식 지정
		// 	formatString: 'yyyy-mm-dd HH:MM:ss', // 실제 데이터 형식을 어떻게 표시할지 지정
		// 	visible: false,
		// },
		{
			dataField: 'uploadFlag',
			headerText: '에러코드',
			editable: false,
			dataType: 'code',
			width: 100,
		},
		{
			dataField: 'uploadMsg',
			headerText: '에러메시지',
			editable: false,
			width: 200,
		},
		// {
		// 	dataField: 'serialKey',
		// 	// headerText: '박스당 낱개수',
		// 	visible: false,
		// },
		// // {
		// // 	dataField: 'fixDcCode',
		// // 	headerText: '박스당 낱개수',
		// // 	visible: false,
		// // },
		// {
		// 	dataField: 'layerPerPlt',
		// 	headerText: '팔렛당적재단수',
		// 	visible: false,
		// },
	];
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		gridInit();
		// //console.log('MsExDcRateDetail useEffect props.data', props.data);
	}, []);

	// // grid data 변경 감지
	// useEffect(() => {
	// 	const gridRefCur1 = gridRef1.current;
	// 	if (gridRefCur1) {
	// 		gridRefCur1?.setGridData(props.data);
	// 		gridRefCur1?.setSelectionByIndex(0, 0);
	// 		if (props.data.length > 0) {
	// 			// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
	// 			// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
	// 			const colSizeList = gridRefCur1.getFitColumnSizeList(true);
	// 			// 구해진 칼럼 사이즈를 적용 시킴.
	// 			gridRefCur1.setColumnSizeList(colSizeList);
	// 			gridRefCur1.setColumnPropByDataField('expenseType', { width: 220 });
	// 			gridRefCur1.setColumnPropByDataField('areaPriceUom', { width: 60 });
	// 			gridRefCur1.setColumnPropByDataField('sku', { width: 75 });
	// 			gridRefCur1.setColumnPropByDataField('organize', { width: 100 });
	// 		}
	// 	}
	// }, [props.data]);
	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="외부창고요율관리 엑셀 업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '}>
					<Button onClick={onExcelDownload}>양식다운로드</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef1} columnLayout={extendedGridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
			</ButtonWrap>
			<CmSearchWrapper ref={refModal} />
			{/* 엑셀 파일 업로드 INPUT 영역 */}
			<input
				ref={excelUploadFileRef}
				id="excelUploadInput"
				type="file"
				onChange={onFileChange}
				onClick={(e: any) => {
					e.target.value = null;
				}}
				style={{ display: 'none' }}
			/>
		</>
	);
};

export default MsExdcRateUploadExcelPopup;
