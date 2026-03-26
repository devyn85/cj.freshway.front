/*
 ############################################################################
 # FiledataField	: StDisuseRequestCenterDetail1.tsx
 # Description		: 재고 > 재고현황 > 재고폐기요청/처리(1/5)
 # Author			: sss
 # Since			: 25.08.04
 ############################################################################

*/
import { Button, Form } from 'antd';
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//React
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

//API
//Component
import { SelectBox } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import { apiSaveMasterList } from '@/api/st/apiStDisuseRequestCenter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
// Utils
import commUtil from '@/util/commUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
// Constants
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import { bindGridEvents, reasoncode1List } from './StDisuseRequestCenter';
// Redux

// API Call Function

const StDisuseRequestCenterDetail1 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, activeKeyMaster, search, formRef, openModal } = props; // Antd Form
	// 공통코드 조회
	const disuseCostCodes = getCommonCodeList('DISUSE_COST', '', ''); // 폐기비용 코드 목록
	const costperkg = disuseCostCodes.find(item => item.comCd === '10')?.data1 || '0'; // comCd가 '10'인 항목의 data1 조회, 없으면 기본값 '0'
	const [popupType, setPopupType] = useState('');
	const islVisibleCol = false; // 컬럼 보이기/숨기기 토글용 변수

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	ref.gridRef1 = useRef(null);
	const refModalPop = useRef(null); // 그리드 팝업용 ref

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 편집 가능한 상태인지 확인하는 함수
	 * @param {any} item - 그리드 행 아이템
	 * @returns {boolean} - 편집 가능 여부
	 */
	const isDisabled = (item: any): boolean => {
		// 값이 없으면 ''가 아니고 null임
		//alert(commUtil.nvl(item.status, ''));
		if (commUtil.nvl(item?.status, '00') == '00') {
			// 00:등록 상태일 때만 편집 가능
			return false;
		}
		return true;
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

		// 입력 값 검증 - 그리드

		// validation
		if (checkedRows.length > 0 && !gridRef.validateRequiredGridData()) {
			return;
		}

		const gridData = gridRef.getGridData();

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
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				avc_COMMAND: 'SAVE_DISUSE_REQUEST',
				requestMm: form.getFieldValue('requestMm').format('YYYYMM') ?? '', // 요청월
				disuseDiv: form.getFieldValue('disuseDiv') ?? '', // 폐기구분
				saveList: ref.gridRef.current.getCheckedRowItemsAll(), // 선택된 행의 데이터
			};

			/*
				-저장 후 2번째 Tab에 처리결과를 조회하여 표시한다.
			*/
			apiSaveMasterList(params).then(res => {
				if (res.statusCode > -1) {
					showAlert(null, t('msg.save1')); // 저장되었습니다
					props.search();
				}
			});
		});
	};

	/**
	 * 삭제
	 */
	const deleteMasterList = async () => {
		const gridRef = ref.gridRef.current;
		const checkedRows = gridRef.getCheckedRowItems();

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 삭제하시겠습니까?
		showConfirm(null, t('msg.confirmDelete'), () => {
			const params = {
				avc_COMMAND: 'SAVE_DISUSE_REQUEST',
				requestMm: form.getFieldValue('requestMm').format('YYYYMM') ?? '', // 요청월
				disuseDiv: form.getFieldValue('disuseDiv') ?? '', // 폐기구분
				rowStatus: 'D',
				saveList: ref.gridRef.current.getCheckedRowItemsAll(), // 선택된 행의 데이터
			};

			apiSaveMasterList(params).then(res => {
				if (res.statusCode > -1) {
					showAlert(null, t('msg.save1')); // 저장되었습니다
					props.search();
				}
			});
		});
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		{ dataField: 'serialkey', headerText: t('lbl.SERIALKEY'), width: 80, dataType: 'name', editable: false }, // 일련번호
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), width: 80, dataType: 'code', editable: false }, // 물류센터
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), width: 80, dataType: 'code', editable: false }, // 창고
		{
			headerText: t('lbl.STOCKTYPE'), // 재고유형
			children: [
				{
					dataField: 'stocktype',
					headerText: t('lbl.CODE'), // 코드
					width: 80,
					dataType: 'code',
					editable: false,
					disableMoving: true,
				}, // 재고유형코드
				{
					dataField: 'stocktypenm',
					headerText: t('lbl.NAME'), // 명칭
					width: 80,
					dataType: 'name',
					editable: false,
					disableMoving: true,
				}, // 재고유형명
			],
		},
		{
			headerText: t('lbl.STOCKGRADE'), // 재고등급
			children: [
				{
					dataField: 'stockgrade',
					headerText: t('lbl.CODE'), // 코드
					width: 80,
					dataType: 'code',
					editable: false,
					disableMoving: true,
				}, // 재고등급코드
				{
					dataField: 'stockgradename',
					headerText: t('lbl.NAME'), // 명칭
					width: 80,
					dataType: 'name',
					editable: false,
					disableMoving: true,
				}, // 재고등급명
			],
		},
		{ dataField: 'zone', headerText: t('lbl.ZONE'), width: 80, dataType: 'code', editable: false }, // 존
		{ dataField: 'loc', headerText: t('lbl.LOC_ST'), width: 80, dataType: 'code', editable: false }, // 로케이션
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'), // 상품코드
					width: 80,
					editable: false,
					filter: { showIcon: true },
					dataType: 'code',
					disableMoving: true,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(e.item, 'sku');
						},
					},
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'), // 상품명
					width: 120,
					editable: false,
					dataType: 'name',
					filter: { showIcon: true },
					disableMoving: true,
				},
			],
		},
		{ dataField: 'seq', headerText: t('lbl.SEQ'), width: 80, dataType: 'code', editable: false }, // SEQ
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'), // 저장유형
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const codeMap = getCommonCodeList('STORAGETYPE_ZONE', '', '');
				const found = codeMap.find(item => item.comCd === value);
				return found ? found.cdNm : value;
			},
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_ST'), // 단위
			width: 80,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'avgweight',
			headerText: t('lbl.AVGWEIGHT') + '(A)', // 평균중량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.##',
		},
		{ dataField: 'qty', headerText: t('lbl.QTY_ST'), width: 80, dataType: 'numeric', editable: false }, // 수량
		{ dataField: 'openqty', headerText: t('lbl.OPENQTY_ST'), width: 80, dataType: 'numeric', editable: false }, // 가용수량
		{
			dataField: 'qtyallocated',
			headerText: t('lbl.QTYALLOCATED_ST'),
			width: 80,
			dataType: 'numeric',
			editable: false,
		}, // 할당수량
		{ dataField: 'qtypicked', headerText: t('lbl.QTYPICKED_ST'), width: 80, dataType: 'numeric', editable: false }, // 피킹수량
		{
			dataField: 'adjustqty',
			headerText: t('lbl.ADJUSTQTY') + '(B)', // 조정수량
			width: 80,
			dataType: 'numeric',
			editable: true,
			required: true,
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
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},

		{
			dataField: 'grossweight',
			headerText: t('lbl.WEIGHT_TOT') + '<BR>C=(A*B)', // 총중량
			width: 80,
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.##',
		},
		{
			dataField: 'purchaseprice',
			headerText: t('lbl.UNITPRICE') + '(D)', // 단가
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0',
		},
		{
			dataField: 'disuseprice',
			headerText: t('lbl.DISUSEPRICE') + '(B*D)', // 폐기금액
			width: 80,
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0',
		},

		{
			dataField: 'disusecost',
			headerText: t('lbl.DISUSECOST2') + '<BR>(C*' + props.bagicAmt + ')', // 폐기비용
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0',
		},
		{
			dataField: 'reference15',
			headerText: '체인전용', // 체인전용
			// editRenderer: {
			// 	type: 'DropDownListRenderer',
			// 	list: getCommonCodeList('YN2'),
			// 	keyField: 'cdNm',
			// 	valueField: 'comCd',
			// },
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('YN2', value)?.cdNm;
			},
		},
		{
			dataField: 'cheiljedang_sku',
			headerText: '제당반품', // 제당반품(Y:제당상품, N:제당외)
			// editRenderer: {
			// 	type: 'DropDownListRenderer',
			// 	list: getCommonCodeList('YN2'),
			// 	keyField: 'cdNm',
			// 	valueField: 'comCd',
			// 	editable: false,
			// },
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('YN2', value)?.cdNm;
			},
		}, // 제당반품

		{
			dataField: 'disusetype',
			headerText: t('lbl.DISUSETYPE'), // 폐기유형
			width: 150,
			dataType: 'code',
			editable: true,

			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DISUSETYPE', '').filter((item: any) => item.comCd !== 'DU03'),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return isDisabled(item);
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

		{
			dataField: 'reasoncode',
			headerText: t('lbl.REASONCODE_AJ'), // 발생사유
			width: 200,
			dataType: 'name',
			editable: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('REASONCODE_AJ'),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return isDisabled(item);
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
		{
			dataField: 'reasoncode1',
			headerText: '발생사유(대분류)', // 발생사유(대분류)
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: reasoncode1List,
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return isDisabled(item);
				},
			},
			editable: true,
			required: true,
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
		{
			dataField: 'logiRespDistbCd',
			headerText: t('lbl.OTHER05_DMD_AJ'), // 물류귀책배부
			dataType: 'string',
			editable: true,
			required: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('CENTER_RESP'),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return isDisabled(item);
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
		{
			dataField: 'toRespPartyCd',
			headerText: t('lbl.REASONCODE2'), // 귀책
			width: 200,
			dataType: 'name',
			required: true,
			editable: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('OTHER01_DMD'),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return isDisabled(item);
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

		{
			headerText: '귀속부서(COST)', //t('lbl.COSTCENTER'), //귀속부서
			children: [
				{
					dataField: 'toRespDeptCd',
					headerText: '귀속부서(COST)', //t('lbl.COSTCENTER'), // 귀속부서
					dataType: 'code',
					editable: true,
					required: true,
					disableMoving: true,
					commRenderer: {
						type: 'search',
						popupType: 'costCenter',
						searchDropdownProps: {
							dataFieldMap: {
								toRespDeptCd: 'code',
								toRespDeptNm: 'name',
							},
							callbackBeforeUpdateRow: (e: any) => {
								const selectedIndex = ref.gridRef?.current?.getSelectedIndex();
								// setPopupType('costCenter');
								// const selectRow = [e];
								// confirmPopup(selectRow);
							},
						},
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							// 편집 불가능한 상태에서는 팝업을 띄우지 않음
							if (isDisabled(e.item)) {
								return;
							}
							refModalPop.current.open({
								gridRef: ref.gridRef,
								rowIndex,
								dataFieldMap: {
									toRespDeptCd: 'code',
									toRespDeptNm: 'name',
								},
								popupType: 'costCenter',
							});
						},
					},
					//
					//
					//
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
				{
					dataField: 'toRespDeptNm',
					headerText: '귀속부서(COST)명', //t('lbl.COSTCENTERNAME'), //귀속부서명
					dataType: 'string',
					editable: false,
					disableMoving: true,
				},
			],
		},
		{
			headerText: t('lbl.CUST'), //거래처
			children: [
				{
					dataField: 'chgCustkey',
					headerText: t('lbl.CUST_CODE'), //거래처
					dataType: 'code',
					editable: true,
					required: true,
					disableMoving: true,
					commRenderer: {
						type: 'search',
						popupType: 'cust',
						searchDropdownProps: {
							dataFieldMap: {
								chgCustkey: 'code',
								chgCustname: 'name',
							},
							callbackBeforeUpdateRow: (e: any) => {
								const selectedIndex = ref.gridRef?.current?.getSelectedIndex();
							},
						},
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							// 편집 불가능한 상태에서는 팝업을 띄우지 않음
							if (isDisabled(e.item)) {
								return;
							}
							refModalPop.current.open({
								gridRef: ref.gridRef,
								rowIndex,
								dataFieldMap: {
									chgCustkey: 'code',
									chgCustname: 'name',
								},
								popupType: 'cust',
							});
						},
					},
					//
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
				{
					dataField: 'chgCustname',
					headerText: t('lbl.CUST_NAME'), //거래처명
					dataType: 'string',
					editable: false,
					disableMoving: true,
				},
			],
		},
		// {
		// 	dataField: 'reasonmsg1',
		// 	headerText: '변경사유', // 변경사유
		// 	dataType: 'string',
		// 	editable: true,
		// },
		// {
		// 	dataField: 'reasonmsg2',
		// 	headerText: '변경사유(세부)', // 변경사유-세부사유
		// 	dataType: 'code',
		// 	editable: true,
		// 	required: true,
		// 	renderer: reasonmsg2List,
		// },
		{
			dataField: 'rmk',
			headerText: t('lbl.REMARK'), // 비고
			dataType: 'name',
			width: 300,
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
		{
			dataField: 'stockRealYn',
			headerText: t('lbl.PACKINGMETHOD'), // 실물여부
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('YN2'),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return isDisabled(item);
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
		{
			dataField: 'returnno',
			headerText: t('lbl.RETURNNO'), // 반품번호
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'returncarno',
			headerText: t('lbl.RETURNCARNO'), // 반품차량번호
			dataType: 'string',
			editable: false,
		},
		{
			headerText: t('lbl.SERIALNO_SKU'),
			/*이력번호*/ dataField: 'serialno',
			dataType: 'string',
			editable: false,
			width: 200,
		},
		{
			headerText: t('lbl.BARCODE'), // 바코드
			dataField: 'barcode',
			dataType: 'string',
			editable: false,
			width: 200,
		},
		{
			dataField: 'statusnm',
			headerText: t('lbl.STATUS'), // 상태
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return {
					backgroundColor: commUtil.nvl(item?.status, '90') === 'Y' ? '#1ad002' : '',
				};
			},
		},

		/*START.hidden 컬럼*/
		{ dataField: 'status', editable: false, visible: islVisibleCol }, // 상태(00:등록,30:요청,50:결재중,90:완료)
		{ dataField: 'toRespPartyCdOri', editable: false, visible: islVisibleCol }, // 원귀책코드
		{ dataField: 'rowStatus', editable: false, visible: islVisibleCol }, // rowStatus
		//
		{ dataField: 'respPartyCd', editable: false, visible: islVisibleCol }, // 귀책주체코드
		{ dataField: 'respDeptCd', editable: false, visible: islVisibleCol }, // 귀속부서코드
		{ dataField: 'custKey', editable: false, visible: islVisibleCol }, // 거래처코드
		/*END.hidden 컬럼*/

		//ROW_STATU
		//
		//
		//
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		independentAllCheckBox: false,
		fillColumnSizeMode: false,
		showFooter: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (isDisabled(item)) {
				return 'aui-grid-row-disabled'; // 행 전체 비활성화 스타일
			}
			return '';
		},
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			return !isDisabled(item); // status > '00'이면 체크박스 비활성화
		},
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},
		{ dataField: 'adjustqty', positionField: 'adjustqty', operation: 'SUM', formatString: '#,##0' }, // 조정수량 합계
		{ dataField: 'grossweight', positionField: 'grossweight', operation: 'SUM', formatString: '#,##0.##' }, // 총중량 합계
		{ dataField: 'disusecost', positionField: 'disusecost', operation: 'SUM', formatString: '#,##0' }, // 폐기비용 합계
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: t('lbl.BASE'), // 제당기준
				authType: 'save', // 권한
				callBackFn: openModal,
			},
			{
				btnType: 'btn3', // 삭제
				callBackFn: deleteMasterList,
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * 팝업조회
	 * @param selectedRow
	 * @returns {void}
	 */
	const confirmPopup = (selectedRow: any) => {
		const gridRef = ref.gridRef.current;

		setTimeout(() => {
			if (popupType === 'cucostCenterst') {
				gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'toRespDeptCd', selectedRow[0].code);
				gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'toRespDeptNm', selectedRow[0].name);
			}
			refModalPop.current.handlerClose();
		}, 0);
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		refModalPop.current.handlerClose();
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
			gridRef?.setGridData(
				props.data.map((item: any) => ({
					...item,
					disuseprice: item.adjustqty * Number(item.purchaseprice),
				})),
			);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	// useEffect(() => {
	// 	const gridRef = ref.gridRef.current;

	// 	/*=====================================================================
	// 	// 그리드.셀 값 변경 시 이벤트
	// 	=====================================================================*/
	// 	gridRef.bind('cellEditEnd', (event: any) => {
	// 		const { rowIndex, value, item, oldValue } = event;

	// 		if (event.dataField === 'adjustqty') {
	// 			// 값이 실제로 변경되었는지 확인
	// 			const newValue = Number(value) || 0;
	// 			const previousValue = Number(oldValue) || 0;

	// 			// 값이 변경되지 않았다면 처리하지 않음
	// 			if (newValue === previousValue) {
	// 				return;
	// 			}

	// 			// 조정수량 변경 시 ▶▶총중량 자동 계산
	// 			const adjustqty = newValue;
	// 			const avgweight = Number(item.avgweight) || 0;

	// 			// avgweight가 0보다 클 때만 처리
	// 			const grossweight = adjustqty * avgweight;
	// 			gridRef.setCellValue(rowIndex, 'grossweight', grossweight); // 총중량(조정수량*평균중량)

	// 			// 조정수량 변경 시 ▶▶폐기비용 자동 계산
	// 			const costperkg = Number(item.costperkg) || 0; // KG당비용
	// 			const disusecost = grossweight * costperkg; // 폐기비용(총중량*420)
	// 			gridRef.setCellValue(rowIndex, 'disusecost', disusecost); // 폐기비용
	// 		}
	// 	});
	// }, []);

	/**
	 * 컴포넌트 마운트 시 그리드 이벤트 초기화
	 * - 셀 편집 완료 이벤트 바인딩
	 */
	useEffect(() => {
		bindGridEvents(ref, t, costperkg);
	}, []);

	/**
	 * 결품사유, 처리결과 입력
	 * @param {*} key 탭번호
	 */
	const onClickInsert = () => {
		const currentGrid = ref.gridRef.current;

		if (!currentGrid) return;

		// getCheckedRowItems()는 현재 페이지에서 체크된 행들의 item과 rowIndex를 함께 반환합니다.
		const checkedItems = currentGrid.getCheckedRowItems();

		if (!checkedItems || checkedItems.length === 0) {
			showAlert('', t('msg.noSelect')); // 필요시 주석 해제하여 사용
			return;
		}

		const formValues = props.form.getFieldsValue();

		// 체크된 각 행에 대해 반복
		for (const checkedItem of checkedItems) {
			const { rowIndex } = checkedItem;
			currentGrid.setCellValue(rowIndex, 'reasoncode', formValues.cmbReasoncode);
		}
	};

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				{/* 폐기등록 목록 */}
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt}>
					{/* {' '}
					<Button size={'small'} style={{ marginRight: 0 }} onClick={() => handleSelectApply()}>
						제당기준
					</Button> */}
					<Form form={props.form} layout="inline">
						<SelectBox
							label={t('lbl.REASONCODE_AJ')}
							name="cmbReasoncode"
							className="bg-white"
							options={getCommonCodeList('REASONCODE_AJ', '--- 전체 ---')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
						<Button onClick={() => onClickInsert()}>{'선택적용'}</Button>
					</Form>
				</GridTopBtn>

				{/* 상품 LIST 그리드 */}
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModalPop} />
		</>
	);
});
export default StDisuseRequestCenterDetail1;
