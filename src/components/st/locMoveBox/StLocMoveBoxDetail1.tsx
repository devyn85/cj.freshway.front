/*
 ############################################################################
 # FiledataField	: StLocMoveBoxDetail1.tsx
 # Description		: 재고 > 재고현황 > 재고일괄이동(수원3층)(Detail)
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
 #    - 단일 행 체크: posbqty 값을 toOrderqty에 자동 세팅
 #    - 단일 행 언체크: 아무 동작 안 함 (입력값 유지, 빠른 처리)
 #    - 전체 체크 중에는 스킵 (bCheckYnFlag)
 #
 # 3. rowAllCheckClick 이벤트
 #    - 전체 체크: 모든 행의 수량을 일괄 세팅
 #    - 전체 언체크: 초기 데이터(initialDataRef) 다시 로드
 #
 # 4. saveMasterList() - 저장 기능
 #    - 체크된 행 필드 검증: toLoc, toOrderqtyBox/Ea 필수 입력 확인
 #    - 이동가능수량 체크: 입력 수량이 posbqty를 초과하면 경고
 #    - 저장 확인 팝업 후 API 호출 (apiPostSaveMasterList)
 #    - 저장 성공 시 결과 탭으로 이동하여 처리 결과 표시
 #
 # 5. 그리드 컬럼
 #    - toLoc (이동로케이션): 사용자 입력 또는 handleSelectApply로 세팅
 #    - toOrderqtyBox/Ea (이동수량): 체크박스로 자동 세팅 가능
 #    - fixloc (고정로케이션): 읽기 전용, flag=2 시 toLoc에 적용됨
 #
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import { forwardRef, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

//API
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import { apiPostSaveMasterList } from '@/api/st/apiStLocMoveBox';
import { InputText, SelectBox } from '@/components/common/custom/form';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Button, Form } from 'antd';
// Utils
import commUtil from '@/util/commUtil';
// Redux

// API Call Function

const StLocMoveBoxDetail1 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, formRef } = props; // Antd Form
	const bCheckYnFlag = { current: false }; // 그리드 Props

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	const initialDataRef = useRef<any[]>([]); // 초기 데이터 저장

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 선택적용 버튼 클릭 시
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
		// // 입력 값 검증
		// const isValid = await validateForm(formRef);
		// if (!isValid) {
		// 	return;
		// }

		// validation
		if (!gridRef.validateRequiredGridData()) return;

		//checkedRows.forEach((row: any) => {
		for (let i = 0; i < checkedRows.length; i++) {
			const row = checkedRows[i].item; // row items
			const rowIndex = checkedRows[i].rowIndex; // 원래 Row번호
			// 체크박스 continue

			const loc = (row.toLoc || '').toUpperCase();
			const qtyBox = Number(row.toOrderqtyBox) || 0;
			const qtyEa = Number(row.toOrderqtyEa) || 0;
			//
			const posbqtyBox = Number(row.posbqtyBox) || 0;
			const posbqtyEa = Number(row.posbqtyEa) || 0;

			// 로케이션 대문자 처리
			row.toLoc = loc;

			// 이동가능수량(BOX) 체크
			if (posbqtyBox < qtyBox) {
				showAlert(null, `${rowIndex + 1}번째 행의 이동수량(BOX)이 이동가능 수량을 초과합니다.`);
				ref.gridRef.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('toOrderqtyBox'));
				return;
			}

			// 이동로케이션 입력 체크
			if (loc.length < 1) {
				showAlert(null, `${rowIndex + 1}번째 행의 이동로케이션을 입력하시기 바랍니다.`);
				ref.gridRef.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('toLoc'));
				return;
			}

			if (qtyBox < 1 && qtyEa < 1) {
				showAlert(null, `${rowIndex + 1}번째 행의 이동수량을 입력하시기 바랍니다.`);
				ref.gridRef.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('toOrderqtyBox'));
				return;
			}
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				avc_COMMAND: 'BATCHCONFIRM_BOX',
				//reasoncode: formRef.getFieldValue('reasoncode') ?? '',
				//reasonmsg: formRef.getFieldValue('reasonmsg') ?? '',
				saveList: ref.gridRef.current.getCheckedRowItemsAll(), // 선택된 행의 데이터
			};

			/*
				-저장 후 2번째 Tab에 처리결과를 조회하여 표시한다.
			*/
			apiPostSaveMasterList(params).then(res => {
				if (res.statusCode > -1) {
					//showAlert(null, t('msg.save1')); // 저장되었습니다
					ref.gridRef.current.clearGridData();

					if (props.setActiveKeyMaster) {
						props.setActiveKeyMaster('2'); // 2번째 탭으로 이동
					}

					// 결과 데이터 유무에 따라 메시지
					if (!res.data.resultList || res.data.resultList.length <= 0) {
						showAlert(null, t('msg.MSG_COM_ERR_007')); // 검색된 결과가 없습니다.
					} else {
						props.setGridData2(res.data.resultList);
					}

					showAlert(null, t('msg.MSG_COM_VAL_201')); // 처리되었습니다. 결과탭으로 이동합니다.
				}
			});
		});
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), width: 80, editable: false, dataType: 'code' }, // 물류센터
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), width: 80, editable: false, dataType: 'code' }, // 창고
		{
			headerText: t('lbl.STOCKTYPE'), // 재고유형
			children: [
				{
					dataField: 'fromStocktype',
					headerText: t('lbl.CODE'), // 코드
					width: 80,
					editable: false,
					dataType: 'code',
					disableMoving: true,
				}, // 출발재고유형
				{
					dataField: 'stocktype',
					headerText: t('lbl.NAME'), // 명칭
					width: 80,
					editable: false,
					dataType: 'code',
					disableMoving: true,
				}, // 재고유형
			],
		},
		{
			headerText: t('lbl.STOCKGRADE'), // 재고등급
			children: [
				{
					dataField: 'fromStockgrade',
					headerText: t('lbl.CODE'), // 코드
					width: 80,
					editable: false,
					dataType: 'code',
					disableMoving: true,
				}, // 출발재고등급
				{
					dataField: 'stockgrade',
					headerText: t('lbl.NAME'), // 명칭
					width: 80,
					editable: false,
					dataType: 'code',
					disableMoving: true,
				}, // 재고등급
			],
		},
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
		}, // 상품명
		{ dataField: 'storagetype', headerText: t('lbl.STORAGETYPE'), width: 80, editable: false, dataType: 'code' }, // 저장조건
		{ dataField: 'loc', headerText: t('lbl.LOC'), width: 80, editable: false, dataType: 'code' }, // 로케이션
		{
			headerText: t('lbl.POSBQTY'), // 이동가능수량
			children: [
				{
					dataField: 'qtyperbox',
					headerText: t('lbl.QTYPERBOX'), // 박스입수
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
					disableMoving: true,
				}, // QTYPERBOX
				{
					dataField: 'posbqtyBox',
					headerText: 'BOX',
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
					disableMoving: true,
				}, // POSBQTY_BOX
				{
					dataField: 'posbqtyEa',
					headerText: 'EA',
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
					disableMoving: true,
				}, // POSBQTY_EA
			],
		},
		{
			headerText: t('lbl.MOVE_INFO'), // 이동정보
			children: [
				{
					dataField: 'toLoc',
					headerText: t('lbl.TO_LOC'), // 이동로케이션
					width: 100,
					editable: true,
					style: 'user12',
					dataType: 'code',
					required: true, // 필수 입력
					disableMoving: true,
				}, // 이동로케이션
				{
					dataField: 'toOrderqtyBox',
					headerText: 'BOX',
					width: 80,
					editable: true,
					style: 'user12',
					dataType: 'numeric',
					formatString: '#,##0.###',
					required: true, // 필수 입력
					disableMoving: true,
				}, // 이동수량 - BOX
				{
					dataField: 'toOrderqtyEa',
					headerText: 'EA',
					width: 80,
					editable: true,
					style: 'user12',
					dataType: 'numeric',
					formatString: '#,##0.###',
					required: true, // 필수 입력
					disableMoving: true,
				}, // 이동수량 - EA
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

		{
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN'),
			width: 100,
			editable: false,
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 유통임박여부
		// START.제조일자/소비일자/유효기간/소비기한잔여(%)
		{
			headerText: t('lbl.MANUFACTUREDT'), // 제조일자
			dataField: 'manufacturedt',
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.EXPIREDT'), // 소비일자
			dataField: 'expiredt',
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			width: 100,
			editable: false,
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 소비기간(잔여/전체)

		{
			headerText: t('lbl.STOCK_INFO'), // 재고정보
			children: [
				{
					dataField: 'uom',
					headerText: t('lbl.UOM_ST'),
					width: 80,
					editable: false,
					dataType: 'code',
					disableMoving: true,
				}, // 단위
				{
					dataField: 'qty',
					headerText: t('lbl.QTY_ST'),
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
					disableMoving: true,
				}, // 수량
				{
					dataField: 'qtyallocated',
					headerText: t('lbl.QTYALLOCATED_ST'),
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
					disableMoving: true,
				}, // 할당수량
				{
					dataField: 'qtypicked',
					headerText: t('lbl.QTYPICKED_ST'),
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
					disableMoving: true,
				}, // 피킹수량
				{
					dataField: 'posbqty',
					headerText: t('lbl.POSBQTY'), // 이동가능수량
					width: 80,
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.###',
					disableMoving: true,
				}, // 이동가능수량
			],
		},
		{
			dataField: 'fixloc', // 고정로케이션
			headerText: t('lbl.FIXLOC'),
			width: 80,
			editable: false,
			dataType: 'code',
		},

		{
			headerText: t('lbl.SERIALINFO'), // 이력정보
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'),
					width: 80,
					editable: false,
					dataType: 'code',
					disableMoving: true,
				}, // 이력번호
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'),
					width: 100,
					editable: false,
					dataType: 'code',
					disableMoving: true,
				}, // 바코드
				{
					dataField: 'blno',
					headerText: t('lbl.BLNO'),
					width: 100,
					editable: false,
					dataType: 'code',
					disableMoving: true,
				}, // BL번호
				{
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT'),
					width: 100,
					editable: false,
					dataType: 'code',
					disableMoving: true,
				}, // 도축일
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'),
					width: 100,
					editable: false,
					dataType: 'code',
					disableMoving: true,
				}, // 공장명
				{
					dataField: 'contracttype',
					headerText: t('lbl.CONTRACTTYPE'),
					width: 100,
					editable: false,
					dataType: 'code',
					disableMoving: true,
				}, // 계약유형
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'),
					width: 100,
					editable: false,
					dataType: 'code',
					disableMoving: true,
				}, // 계약업체
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					width: 120,
					editable: false,
					dataType: 'name',
					disableMoving: true,
				}, // 계약업체명
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT'),
					width: 100,
					editable: false,
					dataType: 'date',
					disableMoving: true,
				}, // 출발유효일자
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT'),
					width: 100,
					editable: false,
					dataType: 'date',
					disableMoving: true,
				}, // 도착유효일자
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

	const gridProps = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 성능개선(1/3)
		independentAllCheckBox: false, // 성능개선(2/3)
		fillColumnSizeMode: false,
		showFooter: true,
		// 전체 선택 체크박스가 독립적인 역할을 할지 여부
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
			dataField: 'toOrderqtyBox',
			positionField: 'toOrderqtyBox',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // Box 합계
		{
			dataField: 'toOrderqtyEa',
			positionField: 'toOrderqtyEa',
			operation: 'SUM',
			formatString: '#,##0.###',
			style: 'right',
		}, // Ea 합계
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
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
			}
		}
	}, [props.data]);

	// 성능개선(3/3) - 그리드 이벤트 바인딩(rowCheckClick:필요시, rowAllCheckClick:필수)
	useEffect(() => {
		// 이벤트. 체크박스 클릭 시
		ref.gridRef.current?.bind('rowCheckClick', function (event: any) {
			if (bCheckYnFlag.current) return; // 전체 체크 처리 중에는 스킵
			const { rowIndex, item, checked, rowIdValue } = event;
			const gridRef = ref.gridRef.current;
			const rowIdField = gridRef.getProp('rowIdField') || '_$uid';
			const buildUpdatedRow = (rowItem: any) => ({
				...rowItem,
				[rowIdField]: rowItem[rowIdField],
				toOrderqtyBox: rowItem.posbqtyBox ?? 0,
				toOrderqtyEa: rowItem.posbqtyEa ?? 0,
			});

			if (checked) {
				gridRef.updateRowsById([buildUpdatedRow(item)], true);
			} else {
				// 언체크: 편집 내용 복원 (addUncheckedRowsByIds 보다 빠름)
				gridRef.restoreEditedRows(rowIndex);
			}
		});

		// 이벤트.전체 체크박스 클릭 시
		ref.gridRef.current?.bind('rowAllCheckClick', function (checked: any) {
			const gridRef = ref.gridRef.current;
			bCheckYnFlag.current = true;

			if (checked) {
				const rows = gridRef.getGridData();
				const updatedRows = rows.map((item: any) => ({
					...item,
					toOrderqtyBox: item.posbqtyBox ?? 0,
					toOrderqtyEa: item.posbqtyEa ?? 0,
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
					{/* START.일괄적용영역 */}
					<Form form={formRef} layout="inline">
						{/* 사유코드 */}
						<li>
							<SelectBox
								name="reasoncode"
								label={t('lbl.REASONCODE')}
								defaultValue={t('lbl.SELECT')}
								options={getCommonCodeList('REASONCODE_MV', t('lbl.SELECT'))}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								span={50}
								required
								rules={[{ required: true, message: t('msg.placeholder1', [t('lbl.REASONCODE')]) }]}
								style={{ width: '200px' }}
								className="bg-white"
							/>
						</li>
						{/* 사유메세지 */}
						<li>
							<InputText
								name="reasonmsg"
								className="bg-white"
								placeholder={t('msg.placeholder1', [t('lbl.REASONMSG')])}
								required
								rules={[{ required: true, message: t('msg.placeholder1', [t('lbl.REASONMSG')]) }]}
							/>
						</li>
						<li>
							{/* 로케이션 */}
							<InputText label={t('lbl.LOC_ST')} name="movelocation" className="bg-white" />
						</li>
						{/* START.일괄적용영역 */}
						<li className="mr20">
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
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={{ ...gridProps }} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});
export default StLocMoveBoxDetail1;
