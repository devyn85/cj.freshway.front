/*
 ############################################################################
 # FiledataField	: StInquiryResultDetail1.tsx
 # Description		: 재고 > 재고현황 > 조사지시현황(Detail)
 # Author			: sss
 # Since			: 25.08.04
 ############################################################################
 
 ■ 컴포넌트 설명
   - 재고조사 지시현황의 상세 정보를 표시하는 그리드 컴포넌트
   - 재고조사 항목에 대한 상태 관리 및 처리 기능 제공
 
 ■ 주요 기능
   - 재고조사 상세 목록 조회 및 표시
   - 재지시: 선택된 조사 항목을 재지시 처리
   - 예약재고조사(일일): 일일 단위로 예약 재고조사 등록
   - 종료: 선택된 조사 항목을 종료 처리
   - 동일한 재고조사 별칭만 선택 가능 (다중 선택 시 검증)
 
 ■ Props
   - data: 그리드에 표시될 데이터 목록
   - totalCnt: 전체 데이터 건수
   - activeKeyMaster: 마스터 탭의 활성화 키
   - form: 검색 조건 form 데이터
   - search: 재조회 함수
 
 ■ Ref
   - gridRef: 그리드 참조 객체
 
 ■ 주요 함수
   - saveMasterList: 선택된 재고조사 항목을 재지시 처리
   - saveReserveMasterList: 선택된 항목에 대해 일일 단위 예약재고조사 등록
   - saveCloseMasterList: 선택된 재고조사 항목을 종료 처리
   - closeEventLoop: 처리 완료 후 팝업을 닫고 목록 재조회
 
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

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
// Grid Columns
// Redux

const StInquiryResultDetail1 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { activeKeyMaster, form } = props; // Props
	const [loopTrParams, setLoopTrParams] = useState({});

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	const refLoopModal = useRef(null);
	const isAllCheckingRef = useRef(false); // 전체 체크 중 플래그
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
	const gridCol = getGridColumns(1, t);

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

	// FooterLayout Props - 공용 함수 사용
	const footerLayout = getFooterLayout(1);

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
	 * 재지시
	 */
	const saveMasterList = async () => {
		// 재지시 공용 함수 사용
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
			// 전체 체크 중이면 이벤트 무시
			if (isAllCheckingRef.current) {
				return;
			}

			// 전체 체크 항목
			const checkedItems = ref.gridRef.current.getCheckedRowItemsAll().filter((item: any) => !isDisabled(item));
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
		 * 그리드 전체 체크
		 * @param {boolean} chkFlag chkFlag
		 */
		ref.gridRef.current?.unbind('rowAllCheckClick'); // [필수]기존 이벤트 핸들러 제거 - 안하면 재 랜더링 시 이벤트가 중복으로 발행함
		ref.gridRef.current?.bind('rowAllCheckClick', function (event: any) {
			// 그리드의 모든 체크박스가 disabled이면 return
			const allGridData = ref.gridRef.current.getGridData();
			const allDisabled = allGridData.every((item: any) => isDisabled(item));
			if (allDisabled) {
				return;
			}

			// rowAllCheckClick 이벤트는 체크 상태가 변경된 후에 발생하므로
			// 상태 변경이 완료된 후 체크
			const checkedItems = ref.gridRef.current.getCheckedRowItemsAll().filter((item: any) => !isDisabled(item));

			// 체크된 항목이 있을 때만 검증
			if (checkedItems.length > 0) {
				const firstInquiryName = checkedItems[0].inquiryName;
				const isSame = checkedItems.every((item: any) => item.inquiryName === firstInquiryName);

				if (!isSame) {
					showAlert(null, t('서로 다른 재고조사 별칭을 선택할 수 없습니다.', []), () => {
						// setTimeout으로 메시지 닫힌 후에 체크 해제
						setTimeout(() => {
							const checkedRowIds = checkedItems.map((item: any) => item._$uid);
							ref.gridRef.current.addUncheckedRowsByIdsBefore(checkedRowIds);
						}, 100);
					});
				} else {
					tempName = firstInquiryName;
				}
			} else {
				// 모든 항목이 언체크되었을 때
				tempName = '';
			}
		});
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				{/* 상품 LIST 그리드 */}
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
			{/* 저장 시 loopTrParams 팝업 */}
			<CustomModal ref={refLoopModal} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEventLoop} />
			</CustomModal>
		</>
	);
});
export default StInquiryResultDetail1;
