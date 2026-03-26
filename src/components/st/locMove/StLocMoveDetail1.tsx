/*
 ############################################################################
 # FiledataField	: StLocMoveDetail1.tsx
 # Description		: 재고 > 재고현황 > 재고일괄이동(Detail)
 # Author			: sss
 # Since			: 25.08.04
 ############################################################################
 #
 # 주요 기능:
 # 1. handleSelectApply(flag)
 #    - flag='1': 입력한 로케이션을 선택된 행의 toLoc에 일괄 적용
 #    - flag='2': 고정로케이션(fixloc)을 선택된 행의 toLoc에 일괄 적용
 #    - 일괄 업데이트 후 체크 상태 유지
 #
 # 2. rowCheckClick 이벤트 (성능 최적화)
 #    - 단일 행 언체크: 아무 동작 안 함 (입력값 유지, 빠른 처리)
 #    - 전체 체크 중에는 스킵 (bCheckYnFlag)
 #
 # 3. rowAllCheckClick 이벤트
 #    - 전체 체크: 모든 행의 수량을 일괄 세팅
 #    - 전체 언체크: 초기 데이터(initialDataRef) 다시 로드
 #
 # 4. saveMasterList() - 저장 기능
 #    - 체크된 행 필드 검증: toLoc, toOrderqty 필수 입력 확인
 #    - 이동가능수량 체크: 입력 수량이 posbqty를 초과하면 경고
 #    - 저장 확인 팝업 후 API 호출 (apiPostSaveMasterList)
 #    - 저장 성공 시 결과 탭으로 이동하여 처리 결과 표시
 #
 # 5. 엑셀 업로드 기능
 #    - getExcelColumnMapping(): 엑셀 컬럼과 그리드 필드 매핑 정의
 #    - onDataExcel(): 엑셀 데이터 검증 및 그리드 로드
 #    - 조건: toLoc 값 있음 && toOrderqty > 0 이면 체크
 #
 # 6. 그리드 컬럼
 #    - toLoc (이동로케이션): 사용자 입력 또는 handleSelectApply로 세팅
 #    - toOrderqty (이동수량): 체크박스로 자동 세팅 가능
 #    - fixloc (고정로케이션): 읽기 전용, flag=2 시 toLoc에 적용됨
 #
 ############################################################################
*/
import { forwardRef, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import { apiPostSaveMasterList } from '@/api/st/apiStLocMove';
import { InputText, SelectBox } from '@/components/common/custom/form';
import ExcelFileInput from '@/components/common/ExcelFileInput';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Button, Form } from 'antd';
import { useSelector } from 'react-redux/es/hooks/useSelector';
// Utils
import commUtil from '@/util/commUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';

// Redux

// API Call Function

const StLocMoveDetail1 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, formRef } = props; // Antd Form
	const { setTotalCnt, setGridData2 } = props; // Antd Form
	const gStorerkey = useSelector((state: any) => state.global.globalVariable.gStorerkey);
	const bCheckYnFlag = { current: false }; // 그리드 Props

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	const excelInputRef = useRef(null); // 업로드 파일 Ref
	const initialDataRef = useRef<any[]>([]); // 초기 데이터 저장

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 선택적용 - 선택된 행에 사유코드와 사유메시지 적용
	 * 1 : 입력한 로케이션
	 * 2 : 고정로케이션
	 * @param flag
	 */
	const handleSelectApply = (flag: string) => {
		const gridRef = ref.gridRef.current;
		const checkedItems = gridRef.getCheckedRowItemsAll();

		const movelocation = formRef.getFieldValue('movelocation') ?? ''; // 로케이션
		const reasoncode = formRef.getFieldValue('reasoncode') ?? '';
		const reasonmsg = formRef.getFieldValue('reasonmsg') ?? '';
		gridRef.updateRowsById(
			checkedItems.map((item: any) => {
				const toLoc = flag === '2' ? commUtil.nvl(item.fixloc, '') : movelocation || item.toLoc;
				return {
					...item,
					toLoc,
					reasoncode: reasoncode,
					reasonmsg: reasonmsg,
					rowStatus: 'I',
				};
			}),
		);
	};

	/**
	 * 저장
	 */
	const saveMasterList = async () => {
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

		//const gridData = gridRef.getGridData();

		for (let i = 0; i < checkedRows.length; i++) {
			const row = checkedRows[i].item; // row items
			const rowIndex = checkedRows[i].rowIndex; // 원래 Row번호

			const loc = (row.toLoc || '').toUpperCase();
			const qty = Number(row.toOrderqty) || 0;
			const posbqty = Number(row.posbqty) || 0;

			// 로케이션 대문자 처리
			row.toLoc = loc;

			if (posbqty < qty) {
				showAlert(null, `${rowIndex + 1}번째 행의 이동수량이 이동가능 수량을 초과합니다.`);
				ref.gridRef.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('toOrderqty'));
				return;
			}

			if (loc.length < 1) {
				showAlert(null, `${rowIndex + 1}번째 행의 이동로케이션을 입력하시기 바랍니다.`);
				ref.gridRef.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('toLoc'));
				return;
			}

			if (qty <= 0) {
				showAlert(null, `${rowIndex + 1}번째 행의 이동수량을 입력하시기 바랍니다.`);
				ref.gridRef.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('toOrderqty'));
				return;
			}
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				avc_COMMAND: 'BATCHCONFIRM',
				//reasoncode: formRef.getFieldValue('reasoncode') ?? '',
				//reasonmsg: formRef.getFieldValue('reasonmsg') ?? '',
				saveList: ref.gridRef.current.getCheckedRowItemsAll(), // 선택된 행의 데이터
			};

			/*
				-저장 후 2번째 Tab에 처리결과를 조회하여 표시한다.
			*/
			apiPostSaveMasterList(params).then(res => {
				if (res.statusCode > -1) {
					const rtnList: any[] = [];
					let nSucc = 0;
					let nFail = 0;

					for (const objData of res.data.resultList) {
						if (objData.processflag === 'Y') {
							nSucc++;
						} else {
							nFail++;
						}

						rtnList.push(objData);
					}

					ref.gridRef.current.clearGridData();

					if (props.setActiveKeyMaster) {
						props.setActiveKeyMaster('2'); // 2번째 탭으로 이동
					}

					showMessage({
						content: t('성공 : {{0}}건 실패 : {{1}}건 처리되었습니다.', [nSucc, nFail]),
						modalType: 'info',
					});

					props.setGridData2(res.data.resultList);
				}
			});
		});
	};

	/**
	 * 엑셀 업로드
	 */
	const excelUpload = () => {
		excelInputRef.current?.click();
	};

	/**
	 * 엑셀 컬럼 매핑 정의
	 * @returns {object} 엑셀 컬럼 매핑 객체
	 */
	const getExcelColumnMapping = () => {
		return {
			dccode: 'B', // 0. 물류센터
			organize: 'D', // 1. 창고
			stocktype: 'F', // 2. 재고유형
			stockgrade: 'G', // 3. 재고등급
			loc: 'H', // 4. 로케이션
			sku: 'I', // 5. 상품코드
			skuname: 'J', // 6. 상품명
			storagetype: 'K', // 7. 저장조건
			uom: 'L', // 8. 단위
			qty: 'M', // 9. 수량
			qtyallocated: 'N', // 10. 할당수량
			qtypicked: 'O', // 11. 피킹수량
			posbqty: 'P', // 12. 이동가능수량
			fixloc: 'Q', // 13. 고정로케이션
			toLoc: 'R', // 14. 이동로케이션
			toOrderqty: 'S', // 15. 이동수량
			neardurationyn: 'T', // 16. 소비기한임박여부
			lottable01: 'U', // 17. 소비기한일자
			durationTerm: 'V', // 18. 소비기간
			serialno: 'W', // 19. 이력번호
			barcode: 'X', // 20. 바코드
			convserialno: 'Y', // 21. 변환이력번호
			butcherydt: 'Z', // 22. 도축일
			factoryname: 'AA', // 23. 공장명
			contracttype: 'AB', // 24. 계약유형
			contractcompany: 'AC', // 25. 계약업체
			contractcompanyname: 'AD', // 26. 계약업체명
			fromvaliddt: 'AE', // 27. 출발유효일자
			tovaliddt: 'AF', // 28. 도착유효일자
			fromLot: 'AG', // 29. 출발로트
			fromStockid: 'AH', // 30. 출발재고ID
			fromArea: 'AI', // 31. 출발작업구역
		};
	};

	/**
	 * 엑셀 컬럼명을 인덱스로 변환
	 * @param {string} columnName - 엑셀 컬럼명 (A, B, C, AA, AB 등)
	 * @returns {number} 0-based 인덱스
	 */
	const getColumnIndex = (columnName: string): number => {
		let result = 0;
		for (let i = 0; i < columnName.length; i++) {
			result = result * 26 + (columnName.charCodeAt(i) - 64);
		}
		return result - 1; // 0-based index
	};

	/**
	 * 엑셀 데이터 업로드 이벤트
	 * @param {any} data - 엑셀에서 읽어온 데이터 배열
	 */
	const onDataExcel = (data: any) => {
		ref.gridRef.current.clearGridData();

		if (data === undefined || data.length < 1) {
			showAlert(null, t('msg.noExcelData')); // 업로드 파일에 입력 정보가 없습니다.
			return;
		}

		const columnMapping = getExcelColumnMapping();
		const ds_return = [];

		for (let iter = 0; iter < data.length; iter++) {
			const excelRow = data[iter];

			// dccode 컬럼값으로 유효한 데이터 체크
			const dccodeIndex = getColumnIndex(columnMapping.dccode);
			if (excelRow[dccodeIndex]?.toString().trim().length > 0) {
				const row: { [key: string]: any } = {};

				// 컬럼 매핑을 이용한 데이터 할당
				row.dccode = excelRow[getColumnIndex(columnMapping.dccode)];
				row.organize = excelRow[getColumnIndex(columnMapping.organize)];
				row.stocktype = excelRow[getColumnIndex(columnMapping.stocktype)];
				row.stockgrade = excelRow[getColumnIndex(columnMapping.stockgrade)];
				row.loc = excelRow[getColumnIndex(columnMapping.loc)];
				row.sku = excelRow[getColumnIndex(columnMapping.sku)];
				row.skuname = excelRow[getColumnIndex(columnMapping.skuname)];
				row.storagetype = excelRow[getColumnIndex(columnMapping.storagetype)];
				row.uom = excelRow[getColumnIndex(columnMapping.uom)];
				row.qty = excelRow[getColumnIndex(columnMapping.qty)];
				row.qtyallocated = excelRow[getColumnIndex(columnMapping.qtyallocated)];
				row.qtypicked = excelRow[getColumnIndex(columnMapping.qtypicked)];
				row.posbqty = excelRow[getColumnIndex(columnMapping.posbqty)];
				row.fixloc = excelRow[getColumnIndex(columnMapping.fixloc)];
				row.toLoc = excelRow[getColumnIndex(columnMapping.toLoc)];
				row.toOrderqty = excelRow[getColumnIndex(columnMapping.toOrderqty)];
				row.neardurationyn = excelRow[getColumnIndex(columnMapping.neardurationyn)];
				row.lottable01 = excelRow[getColumnIndex(columnMapping.lottable01)];
				row.durationTerm = excelRow[getColumnIndex(columnMapping.durationTerm)];
				row.serialno = excelRow[getColumnIndex(columnMapping.serialno)];
				row.barcode = excelRow[getColumnIndex(columnMapping.barcode)];
				row.convserialno = excelRow[getColumnIndex(columnMapping.convserialno)];
				row.butcherydt = excelRow[getColumnIndex(columnMapping.butcherydt)];
				row.factoryname = excelRow[getColumnIndex(columnMapping.factoryname)];
				row.contracttype = excelRow[getColumnIndex(columnMapping.contracttype)];
				row.contractcompany = excelRow[getColumnIndex(columnMapping.contractcompany)];
				row.contractcompanyname = excelRow[getColumnIndex(columnMapping.contractcompanyname)];
				row.fromvaliddt = excelRow[getColumnIndex(columnMapping.fromvaliddt)];
				row.tovaliddt = excelRow[getColumnIndex(columnMapping.tovaliddt)];

				// 출발 정보 설정
				row.fromDccode = excelRow[getColumnIndex(columnMapping.dccode)];
				row.fromStorerkey = gStorerkey;
				row.fromOrganize = excelRow[getColumnIndex(columnMapping.organize)];
				row.fromArea = excelRow[getColumnIndex(columnMapping.fromArea)];
				row.fromSku = excelRow[getColumnIndex(columnMapping.sku)];
				row.fromLoc = excelRow[getColumnIndex(columnMapping.loc)];
				row.fromLot = excelRow[getColumnIndex(columnMapping.fromLot)];
				row.fromStockid = excelRow[getColumnIndex(columnMapping.fromStockid)];
				row.fromStockgrade = excelRow[getColumnIndex(columnMapping.stockgrade)];
				row.fromStocktype = excelRow[getColumnIndex(columnMapping.stocktype)];
				row.fromOrderqty = excelRow[getColumnIndex(columnMapping.qty)];
				row.fromUom = excelRow[getColumnIndex(columnMapping.uom)];

				// 도착 정보 설정
				row.toDccode = excelRow[getColumnIndex(columnMapping.dccode)];
				row.toStorerkey = gStorerkey;
				row.toOrganize = excelRow[getColumnIndex(columnMapping.organize)];
				row.toArea = excelRow[getColumnIndex(columnMapping.fromArea)];
				row.toSku = excelRow[getColumnIndex(columnMapping.sku)];
				row.toLot = excelRow[getColumnIndex(columnMapping.fromLot)];
				row.toStockgrade = excelRow[getColumnIndex(columnMapping.stockgrade)];
				row.toStocktype = excelRow[getColumnIndex(columnMapping.stocktype)];
				row.toUom = excelRow[getColumnIndex(columnMapping.uom)];
				row.etcqty1 = excelRow[getColumnIndex(columnMapping.qtyallocated)];
				row.etcqty2 = excelRow[getColumnIndex(columnMapping.qtypicked)];
				// 체크 조건: toLoc 값이 있고, toOrderqty가 0보다 크면 체크
				if (commUtil.isNotEmpty(row.toLoc) && Number(row.toOrderqty) > 0) {
					row.customRowCheckYn = 'Y';
				} else {
					row.customRowCheckYn = 'N';
				}

				ds_return.push(row);
			}
		}

		ref.gridRef.current.setGridData(ds_return);
		setTotalCnt(ds_return.length);
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), width: 80, editable: false, dataType: 'code' }, // 물류센터
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), width: 80, editable: false, dataType: 'code' }, // 창고
		{
			headerText: t('lbl.STOCKTYPE'), // 재고위치
			children: [
				{ dataField: 'fromStocktype', headerText: t('lbl.CODE'), width: 80, editable: false, dataType: 'code' }, // 출발재고유형
				{ dataField: 'stocktype', headerText: t('lbl.NAME'), width: 80, editable: false, dataType: 'code' }, // 재고유형 명칭
			],
		},
		{
			headerText: t('lbl.STOCKGRADE'), // 재고속성
			children: [
				{ dataField: 'fromStockgrade', headerText: t('lbl.CODE'), width: 80, editable: false, dataType: 'code' }, // 출발재고등급
				{ dataField: 'stockgrade', headerText: t('lbl.NAME'), width: 80, editable: false, dataType: 'code' }, // 재고등급 명칭
			],
		},
		{ dataField: 'loc', headerText: t('lbl.LOC'), width: 80, editable: false, dataType: 'code' }, // 로케이션
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			width: 80,
			editable: false,
			filter: { showIcon: true },
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(e.item, 'sku');
				},
			},
		}, // 상품코드
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			width: 120,
			editable: false,
			dataType: 'name',
			filter: { showIcon: true },
		}, // 상품명칭
		{ dataField: 'storagetype', headerText: t('lbl.STORAGETYPE'), width: 80, editable: false, dataType: 'code' }, // 저장조건
		{
			headerText: t('lbl.STOCK_INFO'), // 재고정보
			children: [
				{ dataField: 'uom', headerText: t('lbl.UOM_ST'), width: 80, editable: false, dataType: 'code' }, // 단위
				{
					dataField: 'qty',
					headerText: t('lbl.QTY_ST'), // 현재고수량
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
				// {
				// 	dataField: 'qtyexpected',
				// 	headerText: t('입고예정수량'), // 입고예정수량
				// 	width: 80,
				// 	editable: false,
				// 	dataType: 'numeric',
				// 	formatString: '#,##0.###',
				// },
				{
					dataField: 'qtyallocated',
					headerText: t('lbl.QTYALLOCATED_ST'), // 재고할당수량
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
				{
					dataField: 'qtypicked',
					headerText: t('lbl.QTYPICKED_ST'), // 피킹재고
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
				{
					dataField: 'posbqty',
					headerText: t('lbl.MOVE_POSSIBLE_QTY'), // 이동가능수량
					headerTooltip: {
						show: true,
						tooltipHtml: '※이동가능수량 = 재고 - 할당 - 피킹 - 예약<br>입고예정수량은 차감하지 않음',
					},
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
				},
			],
		},
		{ dataField: 'fixloc', headerText: t('lbl.FIXLOC'), width: 80, editable: false, dataType: 'code' }, // 고정로케이션
		{
			headerText: t('lbl.MOVE_INFO'), // 이동정보
			children: [
				{
					dataField: 'toLoc',
					headerText: t('lbl.MOVE_LOC'),
					width: 100,
					editable: true,
					style: 'user12',
					dataType: 'code',
					required: true,
				}, // 이동로케이션
				/*
				############################################################################
				# toOrderqty -> 이동수량 을 입력
				############################################################################
				*/
				{
					dataField: 'toOrderqty',
					headerText: t('lbl.MOVE_QTY'),
					dataType: 'numeric',
					formatString: '#,##0.###',
					editable: true,
					required: true,
					editRenderer: {
						type: 'ConditionRenderer',
						maxlength: 10,
						conditionFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
							if (item.uom === 'KG') {
								return { type: 'InputEditRenderer', onlyNumeric: true, allowPoint: true, allowNegative: false };
							}
							return { type: 'InputEditRenderer', onlyNumeric: true, allowPoint: false, allowNegative: false };
						},
					},
					width: 80,
					// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
					// 	if (isDisabled(item)) {
					// 		ref.gridRef1.current.removeEditClass(columnIndex);
					// 	} else {
					// 		return 'isEdit';
					// 	}
					// },
				}, // 이동수량
			],
		},
		{
			dataField: 'reasoncode',
			headerText: t('lbl.REASONCODE'), // 사유코드
			dataType: 'code',
			width: 120,
			editable: true,
			required: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('REASONCODE_MV'),
			},
		},
		{
			dataField: 'reasonmsg',
			headerText: t('lbl.REASONMSG'), // 사유메시지
			dataType: 'code',
			width: 200,
			editable: true,
			required: true,
		},
		// START.제조일자/소비일자/유효기간/소비기한잔여율
		{
			dataField: 'manufacturedt',
			headerText: t('lbl.MANUFACTUREDT'),
			dataType: 'code',
			editable: false,
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			minWidth: 120,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
				align: 'center',
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},

		{
			dataField: 'expiredt',
			headerText: t('lbl.EXPIREDT'),
			dataType: 'code',
			editable: false,
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			minWidth: 120,
			commRenderer: {
				type: 'calender',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
				align: 'center',
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM2'),
			width: 80,
			editable: false,
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.SERIALINFO'), // 상품이력정보
			children: [
				{ dataField: 'serialno', headerText: t('lbl.SERIALNO'), width: 80, editable: false, dataType: 'code' }, // 이력번호
				{ dataField: 'barcode', headerText: t('lbl.BARCODE'), width: 100, editable: false, dataType: 'code' }, // 바코드
				{ dataField: 'blno', headerText: t('lbl.BLNO'), width: 100, editable: false, dataType: 'code' }, // B/L번호
				{ dataField: 'butcherydt', headerText: t('lbl.BUTCHERYDT'), width: 100, editable: false, dataType: 'code' }, // 도축일자
				{ dataField: 'factoryname', headerText: t('lbl.FACTORYNAME'), width: 100, editable: false, dataType: 'code' }, // 도축장
				{ dataField: 'contracttype', headerText: t('lbl.CONTRACTTYPE'), width: 100, editable: false, dataType: 'code' }, // 계약유형
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'),
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 계약업체
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					width: 120,
					editable: false,
					dataType: 'name',
				}, // 계약업체명
				{ dataField: 'fromvaliddt', headerText: t('lbl.FROMVALIDDT'), width: 100, editable: false, dataType: 'date' }, // 유효일자(FROM)
				{ dataField: 'tovaliddt', headerText: t('lbl.TOVALIDDT'), width: 100, editable: false, dataType: 'date' }, // 유효일자(TO)
			],
		},

		{ dataField: 'fromLot', headerText: t('lbl.LOT'), width: 80, editable: false, dataType: 'code' }, // 로트
		{ dataField: 'fromStockid', headerText: t('lbl.STOCKID'), width: 80, editable: false, dataType: 'code' }, // 개체식별/소비이력
		{ dataField: 'fromArea', headerText: t('lbl.AREA'), width: 80, editable: false, dataType: 'code' }, // 작업구역

		/*START.hidden 컬럼*/
		{ dataField: 'lottable01', visible: false }, // lottable01
		{ dataField: 'duration', visible: false }, // duration
		{ dataField: 'durationtype', visible: false }, // durationtype
		{ dataField: 'lot', visible: false }, // LOT
		{ dataField: 'stockid', visible: false }, // 재고ID
		{ dataField: 'area', visible: false }, // AREA
		{ dataField: 'fromDccode', visible: false }, // 출발물류센터
		{ dataField: 'fromStorerkey', visible: false }, // 출발화주
		{ dataField: 'fromOrganize', visible: false }, // 출발조직
		//{ dataField: 'fromArea', visible: false }, // 출발AREA
		{ dataField: 'fromSku', visible: false }, // 출발SKU
		{ dataField: 'fromLoc', visible: false }, // 출발LOC
		//{ dataField: 'fromLot', visible: false }, // 출발LOT
		//{ dataField: 'fromStockid', visible: false }, // 출발재고ID
		//{ dataField: 'fromStockgrade', visible: false }, // 출발재고등급
		//{ dataField: 'fromStocktype', visible: false }, // 출발재고유형
		//{ dataField: 'fromOrderqty', visible: false }, // 출발수량
		{ dataField: 'toDccode', visible: false }, // 도착물류센터
		{ dataField: 'toStorerkey', visible: false }, // 도착화주
		{ dataField: 'toOrganize', visible: false }, // 도착조직
		{ dataField: 'toArea', visible: false }, // 도착AREA
		{ dataField: 'toSku', visible: false }, // 도착SKU
		//{ dataField: 'toLoc', visible: false }, // 도착LOC
		{ dataField: 'toLot', visible: false }, // 도착LOT
		{ dataField: 'toStockid', visible: false }, // 도착재고ID
		{ dataField: 'toStockgrade', visible: false }, // 도착재고등급
		{ dataField: 'toStocktype', visible: false }, // 도착재고유형
		//{ dataField: 'toOrderqty', visible: false }, // 도착수량
		{ dataField: 'toUom', visible: false }, // 도착단위
		{ dataField: 'etcqty1', visible: false }, // 기타수량1
		{ dataField: 'etcqty2', visible: false }, // 기타수량2
		/*END.hidden 컬럼*/
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 성능개선(1/3)
		independentAllCheckBox: false, // 성능개선(2/3)
		fillColumnSizeMode: false,
		showFooter: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.delYn == 'Y') {
				return 'color-danger';
			}
			return '';
		},
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},
		{
			dataField: 'toOrderqty',
			positionField: 'toOrderqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // 이동수량 합계
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 엑셀업로드
				callBackFn: excelUpload,
			},
			// {
			// 	btnType: 'excelUpload', // 엑셀업로드 - 사용자버튼용
			// },
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			// 초기 데이터 저장
			initialDataRef.current = props.data;

			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
				gridRef.setColumnSizeByDataField?.('skuname', 120);
			}
		}
	}, [props.data]);

	useEffect(() => {
		ref.gridRef.current?.resize?.('100%', '100%');
	}, []);

	// 성능개선(3/3) - 그리드 이벤트 바인딩(rowCheckClick:필요시, rowAllCheckClick:필수)
	useEffect(() => {
		// // 이벤트. 체크박스 클릭 시 - 요건없어 주석처리
		// ref.gridRef.current?.bind('rowCheckClick', function (event: any) {
		// 	if (bCheckYnFlag.current) return; // 전체 체크 처리 중에는 스킵
		// 	const { rowIndex, item, checked, rowIdValue } = event;
		// 	const gridRef = ref.gridRef.current;
		// 	const rowIdField = gridRef.getProp('rowIdField') || '_$uid';
		// 	const buildUpdatedRow = (rowItem: any) => ({
		// 		...rowItem,
		// 		[rowIdField]: rowItem[rowIdField],
		// 		toOrderqty: item.posbqty ?? 0,
		// 	});

		// 	if (checked) {
		// 		gridRef.updateRowsById([buildUpdatedRow(item)], true);
		// 	}
		// 	// 언체크: 아무 동작 없음 (입력값 유지, 최대 속도 최적화)
		// });

		// 이벤트.전체 체크박스 클릭 시
		ref.gridRef.current?.bind('rowAllCheckClick', function (checked: any) {
			const gridRef = ref.gridRef.current;
			bCheckYnFlag.current = true;

			if (checked) {
				const rows = gridRef.getGridData();
				const updatedRows = rows.map((item: any) => ({
					...item,
					//toOrderqty: item.posbqty ?? 0,
				}));

				if (updatedRows.length) {
					gridRef.updateRowsById(updatedRows, true);
				}
			} else {
				// 전체 언체크 시 초기 데이터 다시 로드
				const initialData = initialDataRef.current;
				gridRef?.setGridData(initialData);
				gridRef?.setSelectionByIndex(0, 0);

				if (initialData.length > 0) {
					const colSizeList = gridRef.getFitColumnSizeList(true);
					gridRef.setColumnSizeList(colSizeList);
					gridRef.setColumnSizeByDataField?.('storagetype', 120);
				}
			}
			bCheckYnFlag.current = false;
		});
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt}>
					<Form form={formRef} layout="inline" className="sect">
						{/* 사유코드 */}
						<li>
							<SelectBox
								name="reasoncode"
								label={t('lbl.REASONCODE')}
								options={getCommonCodeList('REASONCODE_MV', t('lbl.SELECT'))}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								defaultValue={t('lbl.SELECT')}
								required
								rules={[{ required: true, message: t('msg.placeholder1', [t('lbl.REASONCODE')]) }]}
								style={{ width: '180px' }}
								className="bg-white"
							/>
						</li>
						<li>
							{/* 사유메세지 */}
							<InputText
								name="reasonmsg"
								className="bg-white"
								placeholder={t('msg.placeholder1', [t('lbl.REASONMSG')])}
								required
								rules={[{ required: true, message: t('msg.placeholder1', [t('lbl.REASONMSG')]) }]}
							/>
						</li>
						<li>
							<InputText label={t('lbl.LOC_ST')} name="movelocation" className="bg-white" />
						</li>
						{/* START.일괄적용영역 */}
						<li>
							<Button onClick={() => handleSelectApply('1')} className="mr5">
								{t('lbl.SELECT_APPLY')} {/* 선택적용 */}
							</Button>
							<Button onClick={() => handleSelectApply('2')}>{t('lbl.FIXLOC_APPLY')}</Button>
							{/* 고정고케이션 */}
						</li>
						{/* END.일괄적용영역 */}
					</Form>
				</GridTopBtn>
				{/* 상품 LIST 그리드 */}
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>

			{/* 엑셀 업로드 영역 정의 */}
			<ExcelFileInput ref={excelInputRef} onData={onDataExcel} startRow={2} />
		</>
	);
});
export default StLocMoveDetail1;
