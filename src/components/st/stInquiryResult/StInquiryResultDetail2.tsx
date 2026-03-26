/*
 ############################################################################
 # FiledataField	: StInquiryResultDetail2.tsx
 # Description		: 재고 > 재고현황 > 조사지시현황(Detail)
 # Author			: Canal Frame
 # Since			: 25.08.04
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import {
	getFooterLayout,
	getGridColumns,
	isDisabled,
	saveCloseMasterListImp,
	saveMasterListImp,
	saveReserveMasterListImp,
} from '@/components/st/stInquiryResult/StInquiryResultGridColumns';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Redux
// API Call Function
// Grid Columns

const StInquiryResultDetail2 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { activeKeyMaster, form } = props; // Props
	const [detailTotalCnt, setDetailTotalCnt] = useState(0);
	const [loopTrParams, setLoopTrParams] = useState({});

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	const refLoopModal = useRef(null);
	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼 (공용 함수 사용)
	const gridCol = getGridColumns(2, t);

	// 그리드 Props
	const gridProps = {
		editable: false,
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
	const footerLayout = getFooterLayout(2);

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: '재지시',
				authType: 'save', // 권한
				callBackFn: () => saveMasterList(),
			},
			{
				btnType: 'btn2', // 예약재고조사(일일)
				btnLabel: '예약재고조사(일일)',
				callBackFn: () => saveReserveMasterList(),
			},
			{
				btnType: 'btn3', // 종료
				btnLabel: '종료',
				callBackFn: () => saveCloseMasterList(),
			},
		],
	};

	/**
	 * 저장
	 */
	const saveMasterList = async () => {
		// 저장 공용 함수 사용
		saveMasterListImp(props, ref.gridRef.current, t, form, activeKeyMaster, setLoopTrParams, refLoopModal);
	};

	/**
	 * 예약재고조사(일일)
	 */
	const saveReserveMasterList = async () => {
		// 예약재고조사(일일) 공용 함수 사용
		saveReserveMasterListImp(props, ref.gridRef.current, t, form, activeKeyMaster, setLoopTrParams, refLoopModal);
	};

	/**
	 * 종료
	 */
	const saveCloseMasterList = async () => {
		// 종료 공용 함수 사용
		saveCloseMasterListImp(props, ref.gridRef.current, t, form, activeKeyMaster);
	};

	/**
	 * 팝업 닫기
	 */
	const closeEventLoop = () => {
		refLoopModal.current.handlerClose();
		props.search();
	};

	//비교 부등호에따라 리턴값
	/*
	  { label: '>', value: '1' },
		{ label: '>=', value: '2' },
		{ label: '=', value: '3' },
		{ label: '<=', value: '4' },
		{ label: '<', value: '5' },
		* */
	const compare = (value: number, target: number | string, type?: string) => {
		if (target === undefined || target === null || target === '') return true;

		switch (type) {
			case '1':
				return value > target;
			case '2':
				return value >= target;
			case '3':
				return value === target;
			case '4':
				return value <= target;
			case '5':
				return value < target;
			default:
				return true;
		}
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
			const { compareAmt1, compareAmt2, amt1, amt2 } = props.form.getFieldsValue();
			const filteredData = props.data.filter((item: any) => {
				const value = item.totaldiffamt;

				const cond1 = compare(value, amt1, compareAmt1);
				const cond2 = compare(value, amt2, compareAmt2);

				if (amt1 && !amt2) {
					return cond1;
				}
				if (amt2 && !amt1) {
					return cond2;
				}

				return cond1 || cond2;
			});
			gridRef?.setGridData(filteredData);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	let tempName = '';
	useEffect(() => {
		// 이벤트. 체크박스 클릭 시만 발생
		ref.gridRef.current?.unbind('rowCheckClick'); // [필수]기존 이벤트 핸들러 제거 - 안하면 재 랜더링 시 이벤트가 중복으로 발행함
		ref.gridRef.current?.bind('rowCheckClick', function (event: any) {
			const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();

			const rowIndex = event.rowIndex;

			const { inquiryName, _$uid } = ref.gridRef.current?.getGridData()[rowIndex];

			if (checkedItems.length === 0) {
				tempName = '';
			}

			if (checkedItems.length === 1) {
				tempName = inquiryName;
			}
			if (checkedItems.length > 1) {
				if (tempName !== inquiryName) {
					showAlert(null, t('서로 다른 재고조사 별칭을 선택할 수 없습니다.', []), () => {
						ref.gridRef.current?.addUncheckedRowsByIdsBefore([_$uid]);
					});
				}
			}
		});

		/**
		 * 결품대상 그리드 전체 체크
		 * @param {boolean} chkFlag chkFlag
		 */
		ref.gridRef.current?.unbind('rowAllCheckClick'); // [필수]기존 이벤트 핸들러 제거 - 안하면 재 랜더링 시 이벤트가 중복으로 발행함
		ref.gridRef.current?.bind('rowAllCheckClick', function (event: any) {
			if (event) {
				const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();
				if (checkedItems.length > 0) {
					const firstInquiryName = checkedItems[0].inquiryName;
					const isSame = checkedItems.every((item: any) => item.inquiryName === firstInquiryName);

					if (!isSame) {
						showAlert(null, t('서로 다른 재고조사 별칭을 선택할 수 없습니다.', []), () => {
							ref.gridRef.current.setAllCheckedRows(false);
						});
					} else {
						tempName = firstInquiryName;
					}
				}
			}
		});
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				{/* 상품LIST */}
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
			<CustomModal ref={refLoopModal} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEventLoop} />
			</CustomModal>
		</>
	);
});
export default StInquiryResultDetail2;
