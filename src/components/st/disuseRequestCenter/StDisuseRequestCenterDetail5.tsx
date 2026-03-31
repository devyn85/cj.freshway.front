/*
 ############################################################################
 # FiledataField	: StDisuseRequestCenterDetail5.tsx
 # Description		: 재고 > 재고현황 > 폐기처리(5/5)
 # Author			: sss
 # Since			: 25.08.04
 ############################################################################
*/
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
import commUtil from '@/util/commUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
// Utils
// Redux
// API Call Function

const StDisuseRequestCenterDetail5 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const [loopTrParams, setLoopTrParams] = useState({});
	const islVisibleCol = false; // 컬럼 보이기/숨기기 토글용 변수

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
	/**
	 * 편집 가능한 상태인지 확인하는 함수
	 * @param {any} item - 그리드 행 아이템
	 * @returns {boolean} - 편집 가능 여부
	 */
	const isDisabled = (item: any): boolean => {
		// 값이 없으면 ''가 아니고 null임
		//alert(commUtil.nvl(item.status, ''));
		//if (commUtil.nvl(item?.approvalstatus, '0') == '3' || commUtil.nvl(item?.approvalstatus, '0') == '9') {
		// 3:최종결재면 수정불가
		// 9:요청이면 수정불가
		// if (commUtil.nvl(item?.approvalstatus, '0') == '3') {
		// 	// 3:최종결재만 수정가능 FWNEXTWMS-7797
		// 	return false;
		// }
		// return true;

		/*
		20260317@지라요건에 의한 재정의(FWNEXTWMS-8230) by sss
		  ->결재진행상태 : 최종결재완료
		   ->체크 후 저장 클릭 후 폐기처리
		  ->결재진행상태 : 반려건
			 ->체크 후 저장 클릭 후 요청상태로 변경
		*/
		// 처리상태(00:조정예정,30:조정예정,00:조정예정,85:부분조정,85:부분조정,90:조정확정,90:조정확정)
		if (commUtil.nvl(item?.statusAj, 'xx') == '90') {
			// 최종 전자결재 최종결재완료 후 폐기처리(조정) 이면 종결
			return true;
		}

		return false;
	};

	// 스타일 함수
	const styleFunction = (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
		return item.processflag === 'E' ? { backgroundColor: 'darkorange' } : {};
	};
	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'approvalReqNo',
			headerText: t('lbl.APPROVALREQNO'), // 품의요청번호
			width: 80,
			styleFunction: styleFunction,
		},
		{
			dataField: 'approvalno',
			headerText: t('lbl.APPROVALNO'), // 전자문서번호
			width: 80,
			styleFunction: styleFunction,
		},
		{
			dataField: 'approvaldate',
			headerText: t('lbl.APPROVALDATE'), // 전자문서시간
			width: 80,
			dataType: 'date',
			formatString: 'yyyy-MM-dd HH:mm:ss',
			styleFunction: styleFunction,
		},
		{
			dataField: 'approvalstatusname',
			headerText: t('lbl.APPROVALSTATUS'), // 결재진행상태
			width: 80,
			styleFunction: styleFunction,
		},
		{
			dataField: 'statusAjnm',
			headerText: t('lbl.QCSTATUS_RT'), // 처리상태
			width: 80,
			styleFunction: styleFunction,
		},
		{
			dataField: 'slipdt',
			headerText: t('lbl.TASKDT_AJ'), // 작업일자
			width: 80,
			styleFunction: styleFunction,
		},
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'), // 물류센터
			width: 80,
			styleFunction: styleFunction,
		},
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), // 창고
			width: 80,
			styleFunction: styleFunction,
		},
		{
			dataField: 'stocktypenm',
			headerText: t('lbl.STOCKTYPE'), // 재고위치
			width: 80,
			styleFunction: styleFunction,
		},
		{
			dataField: 'stockgradename',
			headerText: t('lbl.STOCKGRADE'), // 재고속성
			width: 80,
			styleFunction: styleFunction,
		},
		{
			dataField: 'zone',
			headerText: t('lbl.ZONE'), // 피킹존
			width: 80,
			styleFunction: styleFunction,
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC_ST'), // 로케이션
			width: 80,
			styleFunction: styleFunction,
		},
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'), // 상품코드
					width: 80,
					editable: false,
					dataType: 'code',
					align: 'center',
					styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'), // 상품명칭
					width: 320,
					editable: false,
					dataType: 'name',
					align: 'left',
					autosizing: 'keep',
					styleFunction,
					disableMoving: true,
				},
			],
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM_ST'), // 단위
			dataType: 'code',
			width: 80,
			styleFunction: styleFunction,
		},
		{
			dataField: 'tranqty',
			headerText: t('lbl.ADJUSTQTY'), // 조정수량
			width: 80,
			dataType: 'numeric',
			formatString: '#,##0',
			editable: true,
			styleFunction: styleFunction,
		},
		{
			headerText: t('lbl.AMT'),
			dataField: 'purchaseprice', /*금액*/
			dataType: 'numeric',
			formatString: '#,##0.###',
			width: 140,
		},
		{
			dataField: 'disusetypename',
			headerText: t('lbl.DECREASETYPE'), // 감모유형
			dataType: 'code',
			width: 80,
			styleFunction: styleFunction,
		},
		{
			dataField: 'reasoncodename',
			headerText: t('lbl.REASONCODE_AJ'), // 발생사유
			dataType: 'code',
			width: 80,
			styleFunction: styleFunction,
		},
		{
			dataField: 'imputetypename',
			headerText: t('lbl.OTHER01_DMD_AJ'), // 귀책
			dataType: 'code',
			width: 80,
			styleFunction: styleFunction,
		},
		{
			dataField: 'processmain',
			headerText: t('lbl.OTHER05_DMD_AJ'), // 물류귀책배부
			dataType: 'code',
			width: 80,
			styleFunction: styleFunction,
		},
		{
			headerText: t('lbl.COSTCENTER'), // 비용센터
			children: [
				{
					dataField: 'costcd',
					headerText: t('lbl.COSTCENTER'), // 귀속부서
					dataType: 'code',
					width: 109,
					styleFunction: styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'costcdname',
					headerText: t('lbl.COSTCENTERNAME'), // 귀속부서명
					width: 156,
					styleFunction: styleFunction,
					disableMoving: true,
				},
			],
		},
		{
			headerText: t('lbl.CUST'), // 고객
			children: [
				{
					dataField: 'chgCustkey',
					headerText: t('lbl.CUST'), // 고객코드
					dataType: 'code',
					width: 109,
					styleFunction: styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'chgCustname',
					headerText: t('lbl.CUST_NAME'), // 거래처명
					width: 156,
					styleFunction: styleFunction,
					disableMoving: true,
				},
			],
		},

		// START.제조일자/소비일자/유효기간/소비기한잔여(%)
		{
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN'), // 소비기한임박여부
			dataType: 'code',
			width: 80,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.MANUFACTUREDT'), // 제조일자
			dataField: 'manufacturedt',
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'lottable01',
			headerText: t('lbl.LOTTABLE01'), // 기준일(소비,제조)
			dataType: 'code',
			width: 80,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'), // 소비기간(잔여/전체)
			dataType: 'code',
			width: 80,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.SERIALINFO'), // 상품이력정보
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'), // 이력번호
					dataType: 'code',
					width: 80,
					styleFunction: styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'), // 바코드
					dataType: 'code',
					width: 80,
					styleFunction: styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'), // BL번호
					dataType: 'code',
					width: 80,
					styleFunction: styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT'), // 도축일자
					dataType: 'code',
					width: 80,
					styleFunction: styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'), // 공장명
					width: 80,
					styleFunction: styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'contracttype',
					headerText: t('lbl.CONTRACTTYPE'), // 계약형태
					width: 80,
					styleFunction: styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'), // 계약업체
					dataType: 'code',
					width: 80,
					styleFunction: styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'), // 계약업체명
					width: 80,
					styleFunction: styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT'), // 유효일자(FROM)
					dataType: 'code',
					width: 80,
					styleFunction: styleFunction,
					disableMoving: true,
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT'), // 유효일자(TO)
					dataType: 'code',
					width: 80,
					styleFunction: styleFunction,
					disableMoving: true,
				},
			],
		},
		/*START.hidden 컬럼*/
		{ dataField: 'approvalstatus', editable: false, visible: islVisibleCol }, // 결재상태(코드값)
		{ dataField: 'statusAj', editable: false, visible: islVisibleCol }, // 처리상태(00:조정예정,30:조정예정,00:조정예정,85:부분조정,85:부분조정,90:조정확정))
		// PK
		{ dataField: 'serialkey', editable: false, visible: islVisibleCol }, // 1.SERIALKEY
		{ dataField: 'requestMm', editable: false, visible: islVisibleCol }, // 2.요청월
		{ dataField: 'storerkey', editable: false, visible: islVisibleCol }, // 3.고객사코드
		{ dataField: 'disuseDiv', editable: false, visible: islVisibleCol }, // 4.폐기구분(1:일반,2:반품)
		{ dataField: 'respDeptCd', editable: false, visible: islVisibleCol }, // 8.귀속부서코드
		{ dataField: 'custKey', editable: false, visible: islVisibleCol }, // 9.거래처코드
		{ dataField: 'seq', editable: false, visible: islVisibleCol }, // 10.SEQ
		/* END.hidden 컬럼 */
	];

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},
		{
			dataField: 'tranqty',
			positionField: 'tranqty',
			operation: 'SUM',
			formatString: '#,##0',
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		isLegacyRemove: true,
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

	/**
	 * 저장
	 */
	const saveMasterList = async () => {
		const checkedRows = ref.gridRef?.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 최종결재(approvalstatus === '3') 여부 확인
		const invalidRow = checkedRows.find((row: any) => row.approvalstatus !== '3');
		if (invalidRow) {
			showAlert(null, t('msg.MSG_COM_VAL_209')); // 최종결재완료건만 처리 가능합니다.
			return;
		}

		showConfirm(null, t('msg.confirmSave'), () => {
			// 저장하시겠습니까?
			const params = {
				apiUrl: '/api/st/disuseRequestCenter/v1.0/processMasterList',
				avc_COMMAND: 'CONFIRM_DU',
				dataKey: 'saveProcessList',
				saveDataList: checkedRows, // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			refLoopModal.current.handlerOpen();
		});
	};

	/**
	 * 삭제
	 */
	const deleteMasterList = async () => {
		const checkedRows = ref.gridRef?.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		showConfirm(null, '삭제하시겠습니까??', () => {
			const params = {
				apiUrl: '/api/st/disuseRequestCenter/v1.0/deleteMasterList',
				avc_COMMAND: 'APPROVAL_CANCELDU',
				dataKey: 'saveElectApprovalList',
				saveDataList: checkedRows, // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			refLoopModal.current.handlerOpen();
		});
	};

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn3', // 삭제
				callBackFn: deleteMasterList,
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
			,
		],
	};

	/**
	 * 팝업 닫기
	 */
	const closeEventLoop = () => {
		refLoopModal.current.handlerClose();
		props.callBackFn();
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
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	useEffect(() => {
		//
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				{/* 요청처리결과 */}
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
			<CustomModal ref={refLoopModal} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEventLoop} />
			</CustomModal>
		</>
	);
});
export default StDisuseRequestCenterDetail5;
