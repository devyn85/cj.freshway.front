/*
 ############################################################################
 # FiledataField	: StConvertCGDetail3.tsx
 # Description		: 재고 > 재고조정 > 재고속성변경
 # Author			    : Canal Frame
 # Since			    : 25.09.18
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';

//Lib
import { InputText, SelectBox } from '@/components/common/custom/form';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { useEffect } from 'react';

//types
import GridAutoHeight from '@/components/common/GridAutoHeight';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
import { Button, Form } from 'antd';

const StConvertCGDetail3 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form } = props; // Antd Form

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	ref.gridRef1 = useRef(null);

	// 트랜잭션 팝업 Ref
	const refTranModal = useRef(null);

	// loop transaction params
	const [loopTrParams, setLoopTrParams] = useState({});

	// transaction 처리 건수
	const [trProcessCnt, setTrProcessCnt] = useState({});

	// Declare init value(3/4)

	// 기타(4/4)

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), editable: false, width: 80, dataType: 'code' }, // 물류센터
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), editable: false, width: 80, dataType: 'code' }, // 창고
		{ dataField: 'fromloc', headerText: t('lbl.LOC'), editable: false, width: 100, dataType: 'code' }, // 로케이션
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			filter: { showIcon: true },
			dataType: 'code',
			width: 80,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.skuName,
					};
					ref.current.openPopup(params, 'sku');
				},
			},
			editable: false,
		}, // 상품코드
		{ dataField: 'skuname', headerText: t('lbl.SKUNAME'), editable: false, width: 380, dataType: 'string' }, // 상품명칭
		{ dataField: 'mcname', headerText: t('lbl.MC'), editable: false, width: 150, dataType: 'string' }, // 상품분류
		{ dataField: 'uom', headerText: t('lbl.UOM'), editable: false, width: 50, dataType: 'code' }, // 단위
		{
			dataField: 'qty',
			headerText: t('lbl.QTY_ST'),
			editable: false,
			width: 80,
			dataType: 'numeric',
			formatString: '#,##0.##',
		}, // 현재고수량
		{
			dataField: 'openqty',

			headerText: t('lbl.OPENQTY_ST'),
			editable: false,
			width: 90,
			dataType: 'numeric',
			formatString: '#,##0.##',
		}, // 가용재고수량
		{
			dataField: 'qtyallocated',
			headerText: t('lbl.QTYALLOCATED_ST'),
			editable: false,
			width: 90,
			dataType: 'numeric',
			formatString: '#,##0.##',
		}, // 재고할당수량
		{
			dataField: 'qtypicked',
			headerText: t('lbl.QTYPICKED_ST'),
			editable: false,
			width: 80,
			dataType: 'numeric',
			formatString: '#,##0.##',
		}, // 피킹재고
		{
			dataField: 'tranqty',
			headerText: t('lbl.TRANQTY'),
			editable: true,
			width: 80,
			dataType: 'numeric',
			formatString: '#,##0.##',
			editRenderer: {
				type: 'InputEditRenderer',
				//allowNegative: true, // 음수허용
				allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
			},
		}, // 작업수량
		{ dataField: 'stockgradename', headerText: 'FROM재고속성', editable: false, width: 110, dataType: 'string' }, // FROM재고속성
		{
			dataField: 'tostockgrade',
			headerText: 'TO재고속성',
			editable: true,
			width: 110,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('STOCKGRADE', '선택', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			dataType: 'code',
		}, // TO재고속성
		{
			dataField: 'reasoncode',
			headerText: t('lbl.REASONCODE'),
			editable: true,
			width: 170,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('REASONCODE_MV', '선택', ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			dataType: 'code',
		}, // 사유코드
		{ dataField: 'reasonmsg', headerText: t('lbl.RESULTMSG'), editable: true, width: 150, dataType: 'code' }, // 처리결과
		{
			dataField: 'lottable01',
			headerText: t('lbl.LOTTABLE01'),
			editable: false,
			width: 120,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				if (
					commUtil.isNotEmpty(item?.lottable01) &&
					commUtil.isNotEmpty(item?.duration) &&
					commUtil.isNotEmpty(item?.durationtype)
				) {
					return {
						backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''), // ?는 렌더링 시점에서 속성이 없을 수도 있어 오류 방지용
					};
				}
			},
			dataType: 'string',
		}, // 기준일(유통,제조)
		{
			dataField: 'durationterm',
			headerText: t('lbl.DURATION_TERM'),
			editable: false,
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				if (
					commUtil.isNotEmpty(item?.lottable01) &&
					commUtil.isNotEmpty(item?.duration) &&
					commUtil.isNotEmpty(item?.durationtype)
				) {
					return {
						backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''), // ?는 렌더링 시점에서 속성이 없을 수도 있어 오류 방지용
					};
				}
			},
			dataType: 'string',
		}, // 소비기간(잔여/전체)
		{
			headerText: t('lbl.SERIALINFO'), // 상품이력정보
			children: [
				{
					headerText: t('lbl.SERIALNO'),
					dataField: 'serialno',
					editable: false,
					width: 150,
					dataType: 'string',
					disableMoving: true,
				}, // 이력번호
			],
		},
		{
			dataField: 'fromstockid',
			headerText: t('lbl.FROM_STOCKID'),
			width: 120,
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				if (
					commUtil.isNotEmpty(item?.lottable01) &&
					commUtil.isNotEmpty(item?.duration) &&
					commUtil.isNotEmpty(item?.durationtype)
				) {
					return {
						backgroundColor: commUtil.gfnDurationCheck(item?.lottable01, item?.duration, item?.durationtype, ''), // ?는 렌더링 시점에서 속성이 없을 수도 있어 오류 방지용
					};
				}
			},
			dataType: 'string',
		}, // 재고ID
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		fillColumnSizeMode: false,
		showFooter: true,
		// 숨겨진 컬럼 정의
		columnLayout: [
			...gridCol,
			{ dataField: 'duration', headerText: t('lbl.LOCCATEGORY'), visible: false },
			{ dataField: 'durationtype', headerText: t('lbl.LOCTYPE'), visible: false },
			{ dataField: 'area', headerText: t('lbl.LOCTYPE'), visible: false },
			{ dataField: 'fromlot', headerText: t('lbl.LOCTYPE'), visible: false },
			{ dataField: 'fromstockgrade', headerText: t('lbl.LOCTYPE'), visible: false },
			{ dataField: 'fromstocktype', headerText: t('lbl.LOCTYPE'), visible: false },
		],
	};

	// FooterLayout Props
	const footerLayout = [
		{ labelText: t('lbl.TOTAL'), positionField: gridCol[0].dataField }, // 합계
		{ dataField: 'qty', positionField: 'qty', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 현재고수량 합계
		{ dataField: 'openqty', positionField: 'openqty', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 가용재고수량 합계
		{
			dataField: 'qtyallocated',
			positionField: 'qtyallocated',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 재고할당수량 합계
		{ dataField: 'qtypicked', positionField: 'qtypicked', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 피킹재고 합계
		{ dataField: 'tranqty', positionField: 'tranqty', operation: 'SUM', formatString: '#,##0.##', style: 'right' }, // 작업수량 합계
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 선택적용 버튼 클릭 시
	 * @param flag
	 */
	const handleSelectApply = () => {
		const gridRef = ref.current;
		const checkedItems = gridRef?.getCheckedRowItems();

		const reasoncode = form.getFieldValue('reasoncode') ?? ''; // 사유코드
		const reasonmsg = form.getFieldValue('reasonmsg') ?? ''; // 처리결과
		const tostockgrade = form.getFieldValue('stockgradeSelect') ?? ''; // TO재고속성

		if (!reasoncode && !reasonmsg && !tostockgrade) {
			return;
		}

		if (checkedItems.length < 1) {
			// 선택된 행 체크
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 성능 개선: cell단위 변경 대신 전체 데이터를 한번에 변경
		const allData = gridRef.getGridData();
		// setGridData() 호출 시 체크가 해제되므로, 이전에 체크된 행들의 ID를 저장해 둡니다.
		const rowIdField = gridRef.getProp('rowIdField') || '_$uid';

		const checkedRowIds = checkedItems.map((item: any) => item.item[rowIdField]);
		const checkedRowIndexes = new Set(checkedItems.map((item: any) => item.rowIndex));

		const newData = allData.map((row: any, index: number) => {
			if (checkedRowIndexes.has(index)) {
				return { ...row, reasoncode: reasoncode, reasonmsg: reasonmsg, tostockgrade: tostockgrade };
			}
			return row;
		});

		// setGridData 대신 updateRowsById 사용햐여 변경된 행만 업데이트
		if (newData.length > 0) {
			gridRef.updateRowsById(newData, true); // isMarkEdited: true
		}
		// 이전에 체크된 행들을 다시 체크합니다.
		gridRef.setCheckedRowsByIds(checkedRowIds);
	};

	/**
	 * 저장
	 */
	const saveMasterList = async () => {
		const gridRef = ref.current;
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
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		for (let i = 0; i < checkedRows.length; i++) {
			const row = checkedRows[i].item; // row items
			const rowIndex = checkedRows[i].rowIndex; // 원래 Row번호

			const tranqty = Number(row.tranqty) || 0;
			const tostockgrade = row.tostockgrade || '';
			const reasoncode = row.reasoncode || '';

			if (tranqty <= 0) {
				showAlert(null, `${rowIndex + 1}번째 행의 작업수량을 확인하시기 바랍니다.`);
				ref.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('toOrderqty'));
				return;
			}

			if (tostockgrade.length < 1) {
				showAlert(null, `${rowIndex + 1}번째 행의 TO 재고속성을 입력하시기 바랍니다.`);
				ref.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('tostockgrade'));
				return;
			}

			if (reasoncode.length < 1) {
				showAlert(null, `${rowIndex + 1}번째 행의 사유코드를 입력하시기 바랍니다.`);
				ref.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('reasoncode'));
				return;
			}
		}

		const params = {
			apiUrl: '/api/st/stConvertCG/v1.0/saveMasterList',
			avc_COMMAND: 'CONFIRM',
			dataKey: 'saveList',
			saveDataList: gridRef.getCheckedRowItemsAll(), // 선택된 행의 데이터
		};

		// 저장하시겠습니까
		showConfirm(null, t('msg.confirmSave'), () => {
			setLoopTrParams(params);
			refTranModal.current.handlerOpen();
		});
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		refTranModal.current.handlerClose();
		props.callBackFn?.(); // 콜백 함수 호출
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);
		}
	}, [props.data]);

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref,
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={'상품' + t('lbl.LIST')} totalCnt={props.totalCnt3}>
					{/* START.일괄적용영역 */}
					<Form form={form} layout="inline" className="sect">
						{/* 사유코드 */}
						<li>
							<SelectBox
								name="reasoncode"
								label={t('lbl.REASONCODE')}
								options={getCommonCodeList('REASONCODE_MV', t('lbl.ALL'))}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								defaultValue={t('lbl.ALL')}
								style={{ width: '200px' }}
								className="bg-white"
								required
							/>
						</li>
						{/* 사유메세지*/}
						<li>
							<InputText
								name="reasonmsg"
								placeholder={t('msg.placeholder1', [t('lbl.REASONMSG')])}
								className="bg-white"
								rules={[{ message: t('msg.placeholder1', [t('lbl.REASONMSG')]) }]}
								style={{ width: '250' }}
							/>
						</li>
						{/* 재고속성 */}
						<li>
							<SelectBox
								name="stockgradeSelect"
								label={t('lbl.STOCKGRADE')}
								options={getCommonCodeList('STOCKGRADE', t('lbl.SELECT'))}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								defaultValue={t('lbl.ALL')}
								style={{ width: '200px' }}
								className="bg-white"
								required
							/>
						</li>
						<li className="mr20">
							<Button onClick={() => handleSelectApply()} className="mr5">
								{t('lbl.APPLY_SELECT')} {/* 선택적용 */}
							</Button>
						</li>
						{/* 트랜잭션 팝업 영역 정의 */}
						<CustomModal ref={refTranModal} width="1000px">
							<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
						</CustomModal>
					</Form>
				</GridTopBtn>
				{/* END.일괄적용영역 */}
				{/* 상품 LIST 그리드 */}
			</AGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>
		</>
	);
});
export default StConvertCGDetail3;
