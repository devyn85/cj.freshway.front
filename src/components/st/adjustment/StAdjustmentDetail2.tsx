/*
 ############################################################################
 # FiledataField	: StAdjustmentDetail1.tsx
 # Description		: 재고 > 재고현황 > 센터자체감모(Detail)
 # Author			: sss
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
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { fetchMsOrganize } from '@/store/biz/msOrganize';
import { getCommonCodebyCd, getCommonCodeList, getCommonCodeListByData } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Utils
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import { showAlert, showConfirm } from '@/util/MessageUtil';
// Redux StAdjustment
// API Call Function

const StInoutResultDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, activeKeyMaster, formRef, refs3 } = props; // Antd Form
	//
	const userAuthInfo = useAppSelector(state => state.user.userInfo);
	const globalVariable = useAppSelector(state => state.global.globalVariable); // 전역 변수
	let reasonCodeList = []; // 감모사유코드, 권한자 코드 상태
	const [privAjdcProcList, setPrivAjdcProcList] = useState([]);
	const [dates, setDates] = useState(dayjs());
	const dccode = Form.useWatch('fixdccode', form);
	const [detailTotalCnt, setDetailTotalCnt] = useState(0);

	// 공통코드 WMS_MNG_DC 데이터 세팅
	const ds_WMS_MNG_DC = getCommonCodeListByData('WMS_MNG_DC', null, null, null, '', '');

	// Declare react Ref(2/4)
	ref.gridRef1 = useRef();
	ref.gridRef2 = useRef(null);
	const modalRef = useRef(null);
	const modalRef1 = useRef(null);
	const [loopTrParams, setLoopTrParams] = useState({}); // 팝업 파라미터
	const [popUp01Params, setPopUp01Params] = useState({}); // 팝업 팝업01 - ZERO 재고생성
	// Declare init value(3/4)

	// 기타(4/4)

	// START.감모사유 필터
	const reasonCodes = getCommonCodeListByData('REASONCODE_AJ', null, null, null, '', ''); // 감모사유코드 조회
	const privCodes = getCommonCodeListByData('AJDC_PROC_USER', null, null, null, '', ''); // 권한자 코드 조회
	const upperPrivCodes = privCodes.map((row: any) => ({
		...row,
		comCd: (row.comCd || '').toUpperCase(),
	})); // comCd 대문자 변환
	const isAuthority =
		userAuthInfo.roles?.includes('00') ||
		userAuthInfo.roles?.includes('05') ||
		userAuthInfo.roles?.includes('000') ||
		userAuthInfo.roles?.includes('010') ||
		upperPrivCodes.some((row: any) => (row.comCd || '') === (globalVariable.gUserId || '').toUpperCase()); // 권한 체크

	let filteredReasonCodes = reasonCodes; // 권한 없으면 감모사유코드에서 'AJDC' 제외

	if (!isAuthority) {
		filteredReasonCodes = reasonCodes.filter((row: any) => row.comCd !== 'AJDC');
	}
	//	//console.log('filteredReasonCodes:', filteredReasonCodes);
	reasonCodeList = filteredReasonCodes; // 감모사유코드 상태 설정
	//
	//setPrivAjdcProcList(upperPrivCodes); // 권한자 코드 상태 설정
	// END.감모사유 필터

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 저장
	 */
	const saveMasterList2 = async () => {
		const gridRef = ref.gridRef2.current;
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

		// validation
		//if (!gridRef2.validateRequiredGridData()) return;
		const gridData = gridRef.getGridData();
		let chkRow = -1;
		for (let i = 0; i < checkedRows.length; i++) {
			const row = checkedRows[i].item; // row items
			const rowIndex = checkedRows[i].rowIndex; // 원래 Row번호

			const tranqty = Number(row.tranqty) || 0; // 조정수량
			const reasoncode = row.reasoncode || ''; // 이동사유코드
			const processmain = row.processmain || ''; // 물류귀책배부

			// if (tranqty == 0) {
			// 	showAlert(null, `${rowIndex + 1}번째 행의 조정수량을 입력하시기 바랍니다.`);
			// 	gridRef.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('tranqty'));
			// 	return;
			// }

			if (reasoncode.length < 1) {
				showAlert(null, `${rowIndex + 1}번째 행의 발생사유코드를 입력하시기 바랍니다.`);
				gridRef.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('reasoncode'));
				return;
			}

			if (processmain.length < 1) {
				showAlert(null, `${rowIndex + 1}번째 행의 물류귀책배부를 입력하시기 바랍니다.`);
				gridRef.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('processmain'));
				return;
			}

			chkRow = i;
		}

		// 센터별 코스트센터 및 대표고객 자동 설정 (20160817, 한민구님 요청)
		let nCostCd = '';
		let nCustkey = '';
		// 센터코드 추출 (예시: ds_header[chkRow].DCCODE)
		const dccode = checkedRows[chkRow]?.item?.dccode;
		const findDcRow = fn_getCostCdForDc(dccode);

		if (findDcRow < 0) {
			showAlert(
				null,
				`센터의 코스트센터 및 대표고객 코드 매핑 정보 오류입니다.(ErrCode:${findDcRow})\n설정 후 재진행 부탁드립니다.`,
			);
			return;
		} else {
			// DATA2 필드에서 코스트센터와 대표고객코드 추출
			const findDcArr = ds_WMS_MNG_DC[findDcRow].data2.split('|');
			nCostCd = findDcArr[0];
			nCustkey = findDcArr[1];
		}

		const params = {
			apiUrl: '/api/st/adjustment/v1.0/saveMasterList', // 감모저장
			avc_COMMAND: 'CONFIRM',
			docdt: formRef.getFieldValue('taskdt')?.format('YYYYMMDD') ?? '',
			converttype: 'AJ',
			stocktranstype: '947',
			ifSendType: 'WMSAJ',
			workprocesscode: 'WMSAJ',
			omsFlag: 'Y',
			costcd: nCostCd,
			imputetype: '12',
			custkey: nCustkey,
			setYn: 'Y', // 세트 여부
			//
			dataKey: 'saveList',
			saveDataList: gridRef.getCheckedRowItemsAll(), // 선택된 행의 데이터
		};

		// 저장하시겠습니까
		showConfirm(null, t('msg.confirmSave'), () => {
			setLoopTrParams(params);
			ref.gridRef2.current?.clearGridData();
			modalRef.current.handlerOpen();
		});
	};

	/**
	 * 센터별 코스트센터 및 대표고객코드 취득
	 * @param dccode 센터코드
	 * @param ds_WMS_MNG_DC 공통코드 데이터 (array of objects)
	 * @returns 0 이상: 센터 row index, -1: 센터미입력, -2: 코스트센터 및대표고객코드 미입력, -3: 형태 오류, -4: 코스트센터 미입력, -5: 대표고객코드미입력
	 */
	function fn_getCostCdForDc(dccode: string): number {
		if (!dccode) return -1;
		//console.log(('ds_WMS_MNG_DC:', ds_WMS_MNG_DC);
		const tmpRow = ds_WMS_MNG_DC.findIndex(row => row.comCd === dccode);
		if (tmpRow < 0) return -1;

		const tmpStr = ds_WMS_MNG_DC[tmpRow].data2;
		if (!tmpStr) return -2;

		const arrCols = tmpStr.split('|');
		if (arrCols.length !== 2) return -3;
		if (!arrCols[0]) return -4;
		if (!arrCols[1]) return -5;

		return tmpRow;
	}

	/**
	 * 팝업 닫기 - 저장 후 호출
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
		props.search();
		setDetailTotalCnt(0);
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol1 = [
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), width: 100, editable: false, dataType: 'code' }, // 물류센터
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), width: 100, editable: false, dataType: 'code' }, // 조직
		{ dataField: 'stocktypenm', headerText: t('lbl.STOCKTYPE'), width: 100, editable: false, dataType: 'code' }, // 재고유형
		{ dataField: 'stockgradename', headerText: t('lbl.STOCKGRADE'), width: 100, editable: false, dataType: 'code' }, // 재고등급
		{ dataField: 'zone', headerText: t('lbl.ZONE'), width: 100, editable: false, dataType: 'code' }, // 존
		{ dataField: 'loc', headerText: t('lbl.LOC_ST'), width: 100, editable: false, dataType: 'code' }, // 로케이션
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			children: [
				{ dataField: 'sku', headerText: t('lbl.SKU'), width: 100, editable: false, dataType: 'code' }, // 상품코드
				{ dataField: 'skuname', headerText: t('lbl.SKUNAME'), width: 150, editable: false, dataType: 'name' }, // 상품명
			],
		},
		{ dataField: 'uom', headerText: t('lbl.UOM_ST'), width: 100, editable: false, dataType: 'code' }, // 단위
		{ dataField: 'qty', headerText: t('lbl.QTY_ST'), width: 100, editable: false, dataType: 'numeric' }, // 수량
		{ dataField: 'openqty', headerText: t('lbl.OPENQTY_ST'), width: 100, editable: false, dataType: 'numeric' }, // 가용수량
		{
			dataField: 'qtyallocated',
			headerText: t('lbl.QTYALLOCATED_ST'),
			width: 100,
			editable: false,
			dataType: 'numeric',
		}, // 할당수량
		// { dataField: 'qtypicked', headerText: t('lbl.QTYPICKED_ST'), width: 100, editable: false, dataType: 'numeric' }, // 피킹수량
		// {
		// 	dataField: 'tranqty',
		// 	headerText: t('lbl.ADJUSTQTY'),
		// 	width: 100,
		// 	editable: true,
		// 	dataType: 'numeric',
		// 	required: true,
		// }, // 조정수량
		// {
		// 	dataField: 'reasoncode',
		// 	headerText: t('lbl.REASONCODE_AJ'),
		// 	width: 170,
		// 	editable: true,
		// 	dataType: 'code',
		// 	required: true,
		// 	editRenderer: {
		// 		type: 'DropDownListRenderer',
		// 		list: reasonCodeList, // ReasonCodeLists를 options로 사용
		// 		keyField: 'comCd', // key 에 해당되는 필드명
		// 		valueField: 'cdNm',
		// 	},
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
		// 		return getCommonCodebyCd('REASONCODE_AJ', value)?.cdNm;
		// 	},
		// }, // 감모사유코드

		// {
		// 	dataField: 'processmain',
		// 	headerText: t('lbl.OTHER05_DMD_AJ'),
		// 	dataType: 'code',
		// 	editable: true,
		// 	commRenderer: {
		// 		type: 'checkBox',
		// 		checkValue: 'Y',
		// 		unCheckValue: 'N',
		// 		editable: true,
		// 	},
		// }, // 물류귀책부서
		// { dataField: 'other051', headerText: t('lbl.REMARK'), width: 200, editable: true, dataType: 'code' }, // 비고(사유)
		//
		{ dataField: 'neardurationyn', headerText: t('lbl.NEARDURATIONYN'), width: 120, editable: false, dataType: 'code' }, // 유통기한임박여부
		{ dataField: 'lottable01', headerText: t('lbl.LOTTABLE01'), width: 120, editable: false, dataType: 'code' }, // 유통기한
		{ dataField: 'durationTerm', headerText: t('lbl.DURATION_TERM'), width: 120, editable: false, dataType: 'code' }, // 소비기간(잔여/전체)
		{
			headerText: t('lbl.SERIALINFO'), // 시리얼정보
			children: [
				{ dataField: 'serialno', headerText: t('lbl.SERIALNO'), width: 100, editable: false, dataType: 'code' }, // 시리얼번호
				{ dataField: 'barcode', headerText: t('lbl.BARCODE'), width: 100, editable: false, dataType: 'code' }, // 바코드
				{ dataField: 'blno', headerText: t('lbl.BLNO'), width: 100, editable: false, dataType: 'code' }, // BL번호
				{ dataField: 'butcherydt', headerText: t('lbl.BUTCHERYDT'), width: 100, editable: false, dataType: 'code' }, // 도축일자
				{ dataField: 'factoryname', headerText: t('lbl.FACTORYNAME'), width: 100, editable: false, dataType: 'code' }, // 공장명
				{ dataField: 'contracttype', headerText: t('lbl.CONTRACTTYPE'), width: 100, editable: false, dataType: 'code' }, // 계약유형
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'),
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 계약업체코드
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 계약업체명
				{ dataField: 'fromvaliddt', headerText: t('lbl.FROMVALIDDT'), width: 100, editable: false, dataType: 'code' }, // 출발유효일자
				{ dataField: 'tovaliddt', headerText: t('lbl.TOVALIDDT'), width: 100, editable: false, dataType: 'code' }, // 도착유효일자
			],
		},

		/*START.hidden 컬럼*/
		{ dataField: 'storerkey', visible: false }, // 화주코드
		{ dataField: 'area', visible: false }, // 구역
		{ dataField: 'stocktypenm', visible: false }, // 재고유형명
		{ dataField: 'stockgradename', visible: false }, // 재고등급명
		{ dataField: 'lot', visible: false }, // 로트
		{ dataField: 'imputetype', visible: false }, // 입력유형
		//{ dataField: 'processmain', visible: false }, // 처리주체
		{ dataField: 'costcd', visible: false }, // 원가코드
		{ dataField: 'costcdname', visible: false }, // 원가코드명
		{ dataField: 'custkey', visible: false }, // 거래처코드
		{ dataField: 'custname', visible: false }, // 거래처명
		{ dataField: 'neardurationyn', visible: false }, // 유통기한임박여부
		{ dataField: 'lottable01', visible: false }, // 유통기한
		{ dataField: 'duration_term', visible: false }, // 유통기한_기간
		{ dataField: 'stockid', visible: false }, // 재고ID
		{ dataField: 'serialno', visible: false }, // 시리얼번호
		{ dataField: 'convserialno', visible: false }, // 변환시리얼번호
		{ dataField: 'seriallevel', visible: false }, // 시리얼레벨
		{ dataField: 'serialtype', visible: false }, // 시리얼타입
		{ dataField: 'factoryname', visible: false }, // 공장명
		{ dataField: 'colordescr', visible: false }, // 색상설명
		{ dataField: 'placeoforigin', visible: false }, // 원산지
		{ dataField: 'ordertype', visible: false }, // 주문유형
		{ dataField: 'duration', visible: false }, // 유통기한기간
		{ dataField: 'durationtype', visible: false }, // 유통기한구분
		{ dataField: 'butcherydt', visible: false }, // 도축일자
		{ dataField: 'contractcompany', visible: false }, // 계약거래처
		{ dataField: 'contractcompanyname', visible: false }, // 계약거래처명
		{ dataField: 'fromvaliddt', visible: false }, // 유효일자
		{ dataField: 'tovaliddt', visible: false }, // 유효일자2
		{ dataField: 'contracttype', visible: false }, // 계약유형
		{ dataField: 'barcode', visible: false }, // 바코드
		{ dataField: 'other05', visible: false }, // 기타05
		/*END.hidden 컬럼*/
	];

	// 그리드 Props
	const gridProps1 = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		independentAllCheckBox: false,
		fillColumnSizeMode: true,
		showFooter: true,
		rowIdField: 'uid',
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.delYn == 'Y') {
				return 'color-danger';
			}
			return '';
		},
	};

	// FooterLayout Props
	const footerLayout1 = [
		{ labelText: t('lbl.TOTAL'), positionField: 'dccode' }, // 합계
		{ dataField: 'qty', positionField: 'qty', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 수량 합계
		{ dataField: 'openqty', positionField: 'openqty', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 가용수량 합계
		{
			dataField: 'qtyallocated',
			positionField: 'qtyallocated',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		}, // 할당수량 합계
		{ dataField: 'qtypicked', positionField: 'qtypicked', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 피킹수량 합계
		{ dataField: 'adjustqty', positionField: 'adjustqty', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 조정수량 합계
	];

	/**
	 * 행삭제 - gridRef2에서 선택된 행들을 삭제
	 */
	const deleteSelectedRows1 = () => {
		const gridRef2 = ref.gridRef2.current;
		if (!gridRef2) return;

		const checkedItems = gridRef2.getCheckedRowItems();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 기존 데이터 가져오기
		const allData = gridRef2.getGridData() || [];

		// 선택된 행들의 인덱스를 Set으로 만들어서 삭제할 행들을 식별
		const checkedRowIndexes = new Set(checkedItems.map((item: any) => item.rowIndex));

		// 선택되지 않은 행들만 필터링
		const filteredData = allData.filter((row: any, index: number) => !checkedRowIndexes.has(index));

		// 필터링된 데이터를 그리드에 설정
		gridRef2.setGridData(filteredData);
		setDetailTotalCnt(filteredData.length);

		//showAlert(null, `${checkedItems.length}개 행이 삭제되었습니다.`);
	};

	/**
	 * 중복 SKU 체크 버튼 클릭
	 */
	// const handleCheckDuplicates = () => {
	// 	const result = checkDuplicateSku();

	// 	if (result.hasDuplicates) {
	// 		const duplicateInfo = result.duplicates.map((dup: any) => `${dup.sku} (${dup.count}개)`).join(', ');
	// 		showAlert(null, `중복된 SKU가 발견되었습니다:\n${duplicateInfo}`);
	// 	} else {
	// 		showAlert(null, '중복된 SKU가 없습니다.');
	// 	}
	// };

	// 그리드 버튼
	const gridBtn2: GridBtnPropsType = {
		tGridRef: ref.gridRef2, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'delete', // 행삭제
				callBackFn: deleteSelectedRows1,
			},

			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList2,
			},
		],
	};

	// 그리드 컬럼(상세목록 그리드)
	const gridCol2 = [
		// 그리드 컬럼
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), width: 100, editable: false, dataType: 'code' }, // 물류센터
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), width: 100, editable: false, dataType: 'code' }, // 조직
		{ dataField: 'stocktypenm', headerText: t('lbl.STOCKTYPE'), width: 100, editable: false, dataType: 'code' }, // 재고유형
		{ dataField: 'stockgradename', headerText: t('lbl.STOCKGRADE'), width: 100, editable: false, dataType: 'code' }, // 재고등급
		{ dataField: 'zone', headerText: t('lbl.ZONE'), width: 100, editable: false, dataType: 'code' }, // 존
		{ dataField: 'loc', headerText: t('lbl.LOC_ST'), width: 100, editable: false, dataType: 'code' }, // 로케이션
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			children: [
				{ dataField: 'sku', headerText: t('lbl.SKU'), width: 100, editable: false, dataType: 'code' }, // 상품코드
				{ dataField: 'skuname', headerText: t('lbl.SKUNAME'), width: 150, editable: false, dataType: 'name' }, // 상품명
			],
		},
		{ dataField: 'uom', headerText: t('lbl.UOM_ST'), width: 100, editable: false, dataType: 'code' }, // 단위
		{ dataField: 'qty', headerText: t('lbl.QTY_ST'), width: 100, editable: false, dataType: 'numeric' }, // 수량
		{ dataField: 'openqty', headerText: t('lbl.OPENQTY_ST'), width: 100, editable: false, dataType: 'numeric' }, // 가용수량
		{
			dataField: 'qtyallocated',
			headerText: t('lbl.QTYALLOCATED_ST'),
			width: 100,
			editable: false,
			dataType: 'numeric',
		}, // 할당수량
		{ dataField: 'qtypicked', headerText: t('lbl.QTYPICKED_ST'), width: 100, editable: false, dataType: 'numeric' }, // 피킹수량
		{
			dataField: 'tranqty',
			headerText: t('lbl.ADJUSTQTY'),
			width: 100,
			editable: true,
			dataType: 'numeric',
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
				// onlyNumeric: true, // 0~9만 입력가능
				onlyNumeric: false,
				//allowPoint: true, // 소수점( . ) 도 허용할지 여부
				allowNegative: true, // 마이너스 부호(-) 허용 여부
				textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
				maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
				autoThousandSeparator: true, // 천단위 구분자 삽입 여부
				// decimalPrecision: 2, // 소숫점 2자리까지 허용
				// regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
			},
		}, // 조정수량
		{
			dataField: 'reasoncode',
			headerText: t('lbl.REASONCODE_AJ'),
			width: 170,
			editable: true,
			dataType: 'code',
			required: true,
			editRenderer: {
				type: 'DropDownListRenderer',
				list: reasonCodeList, // ReasonCodeLists를 options로 사용
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('REASONCODE_AJ', value)?.cdNm;
			},
		}, // 감모사유코드

		{
			dataField: 'processmain',
			headerText: t('lbl.OTHER05_DMD_AJ'),
			width: 170,
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'checkBox',
				checkValue: 'Y',
				unCheckValue: 'N',
				editable: true,
			},
		}, // 물류귀책부서
		{ dataField: 'other051', headerText: t('lbl.REMARK'), width: 200, editable: true, dataType: 'code' }, // 비고(사유)
		//
		{ dataField: 'neardurationyn', headerText: t('lbl.NEARDURATIONYN'), width: 100, editable: false, dataType: 'code' }, // 유통기한임박여부
		{ dataField: 'lottable01', headerText: t('lbl.LOTTABLE01'), width: 100, editable: false, dataType: 'code' }, // 유통기한
		{ dataField: 'durationTerm', headerText: t('lbl.DURATION_TERM'), width: 100, editable: false, dataType: 'code' }, // 소비기간(잔여/전체)
		{
			headerText: t('lbl.SERIALINFO'), // 시리얼정보
			children: [
				{ dataField: 'serialno', headerText: t('lbl.SERIALNO'), width: 100, editable: false, dataType: 'code' }, // 시리얼번호
				{ dataField: 'barcode', headerText: t('lbl.BARCODE'), width: 100, editable: false, dataType: 'code' }, // 바코드
				{ dataField: 'blno', headerText: t('lbl.BLNO'), width: 100, editable: false, dataType: 'code' }, // BL번호
				{ dataField: 'butcherydt', headerText: t('lbl.BUTCHERYDT'), width: 100, editable: false, dataType: 'code' }, // 도축일자
				{ dataField: 'factoryname', headerText: t('lbl.FACTORYNAME'), width: 100, editable: false, dataType: 'code' }, // 공장명
				{ dataField: 'contracttype', headerText: t('lbl.CONTRACTTYPE'), width: 100, editable: false, dataType: 'code' }, // 계약유형
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'),
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 계약업체코드
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					width: 100,
					editable: false,
					dataType: 'code',
				}, // 계약업체명
				{ dataField: 'fromvaliddt', headerText: t('lbl.FROMVALIDDT'), width: 100, editable: false, dataType: 'code' }, // 출발유효일자
				{ dataField: 'tovaliddt', headerText: t('lbl.TOVALIDDT'), width: 100, editable: false, dataType: 'code' }, // 도착유효일자
			],
		},

		/*START.hidden 컬럼*/
		{ dataField: 'storerkey', visible: false }, // 화주코드
		{ dataField: 'area', visible: false }, // 구역
		{ dataField: 'stocktypenm', visible: false }, // 재고유형명
		{ dataField: 'stockgradename', visible: false }, // 재고등급명
		{ dataField: 'lot', visible: false }, // 로트
		{ dataField: 'imputetype', visible: false }, // 입력유형
		//{ dataField: 'processmain', visible: false }, // 처리주체
		{ dataField: 'costcd', visible: false }, // 원가코드
		{ dataField: 'costcdname', visible: false }, // 원가코드명
		{ dataField: 'custkey', visible: false }, // 거래처코드
		{ dataField: 'custname', visible: false }, // 거래처명
		{ dataField: 'neardurationyn', visible: false }, // 유통기한임박여부
		{ dataField: 'lottable01', visible: false }, // 유통기한
		{ dataField: 'duration_term', visible: false }, // 유통기한_기간
		{ dataField: 'stockid', visible: false }, // 재고ID
		{ dataField: 'serialno', visible: false }, // 시리얼번호
		{ dataField: 'convserialno', visible: false }, // 변환시리얼번호
		{ dataField: 'seriallevel', visible: false }, // 시리얼레벨
		{ dataField: 'serialtype', visible: false }, // 시리얼타입
		{ dataField: 'factoryname', visible: false }, // 공장명
		{ dataField: 'colordescr', visible: false }, // 색상설명
		{ dataField: 'placeoforigin', visible: false }, // 원산지
		{ dataField: 'ordertype', visible: false }, // 주문유형
		{ dataField: 'duration', visible: false }, // 유통기한기간
		{ dataField: 'durationtype', visible: false }, // 유통기한구분
		{ dataField: 'butcherydt', visible: false }, // 도축일자
		{ dataField: 'contractcompany', visible: false }, // 계약거래처
		{ dataField: 'contractcompanyname', visible: false }, // 계약거래처명
		{ dataField: 'fromvaliddt', visible: false }, // 유효일자
		{ dataField: 'tovaliddt', visible: false }, // 유효일자2
		{ dataField: 'contracttype', visible: false }, // 계약유형
		{ dataField: 'barcode', visible: false }, // 바코드
		{ dataField: 'other05', visible: false }, // 기타05
		/*END.hidden 컬럼*/
	];

	// FooterLayout Props
	const footerLayout2 = [
		{ labelText: t('lbl.TOTAL'), positionField: 'dccode' }, // 합계
		{ dataField: 'qty', positionField: 'qty', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 수량 합계
		{ dataField: 'openqty', positionField: 'openqty', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 가용수량 합계
		{
			dataField: 'qtyallocated',
			positionField: 'qtyallocated',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		}, // 할당수량 합계
		{ dataField: 'qtypicked', positionField: 'qtypicked', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 피킹수량 합계
		{ dataField: 'adjustqty', positionField: 'adjustqty', operation: 'SUM', formatString: '#,##0', style: 'right' }, // 조정수량 합계
	];

	// 그리드 Props(상세목록 그리드)
	const gridProps2 = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		independentAllCheckBox: false,
		fillColumnSizeMode: false,
		showFooter: true,
		rowIdField: 'uid',
		isLegacyRemove: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.delYn == 'Y') {
				return 'color-danger';
			}
			return '';
		},
	};
	// 그리드 버튼
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [],
	};

	// /**
	//  * gridRef2에서 중복 SKU 체크
	//  * @returns {{ hasDuplicates: boolean, duplicates: any[] }} 중복 SKU 정보 객체
	//  */
	// const checkDuplicateSku = () => {
	// 	const gridRef2 = ref.gridRef2.current;
	// 	if (!gridRef2) return { hasDuplicates: false, duplicates: [] };

	// 	const data = gridRef2.getGridData() || [];
	// 	const skuCountMap = new Map<string, any[]>();
	// 	const duplicates: any[] = [];

	// 	// SKU별 개수 카운트
	// 	data.forEach((row: any, index: number) => {
	// 		const sku = row.sku;
	// 		if (sku) {
	// 			if (!skuCountMap.has(sku)) {
	// 				skuCountMap.set(sku, []);
	// 			}
	// 			skuCountMap.get(sku)?.push({ index, row });
	// 		}
	// 	});

	// 	// 중복 SKU 찾기
	// 	skuCountMap.forEach((items, sku) => {
	// 		if (items.length > 1) {
	// 			duplicates.push({
	// 				sku,
	// 				count: items.length,
	// 				indexes: items.map((item: any) => item.index),
	// 				rows: items.map((item: any) => item.row),
	// 			});
	// 		}
	// 	});

	// 	return {
	// 		hasDuplicates: duplicates.length > 0,
	// 		duplicates,
	// 	};
	// };

	/**
	 * gridRef1에서 선택된 항목들을 gridRef2에 추가
	 */
	const addSelectedToGrid2 = () => {
		const gridRef1 = ref.gridRef1.current;
		const gridRef2 = ref.gridRef2.current;

		if (!gridRef1 || !gridRef2) return;

		const checkedItems = gridRef1.getCheckedRowItems();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// gridRef2의 기존 데이터 가져오기
		const existingData = gridRef2.getGridData() || [];
		const existingSkus = new Set(existingData.map((row: any) => row.sku).filter(Boolean));

		// 중복 SKU 체크
		const duplicateSkus: string[] = [];
		const newItems: any[] = [];

		checkedItems.forEach((item: any, index: number) => {
			const sku = item.item.sku;
			if (existingSkus.has(sku)) {
				duplicateSkus.push(sku);
			} else {
				newItems.push({
					...item.item,
					uid: `grid2-${Date.now()}-${index}`, // 고유 ID 생성
					rowStatus: 'I', // 신규 상태로 설정
					tranqty: 0, // 조정수량 초기화
					reasoncode: '', // 사유코드 초기화
					processmain: 'N', // 물류귀책배부 초기화
					other051: '', // 비고(사유) 초기화
				});
				existingSkus.add(sku); // 새로 추가되는 SKU도 중복 체크에 포함
			}
		});

		// 중복 SKU가 있으면 경고 메시지 표시
		if (duplicateSkus.length > 0) {
			const uniqueDuplicates = [...new Set(duplicateSkus)];

			if (newItems.length > 0) {
				showAlert(
					null,
					`중복된 SKU가 있습니다: ${uniqueDuplicates.join(', ')}\n중복되지 않은 ${
						newItems.length
					}개 항목만 추가되었습니다.`,
				);
			}
		}

		if (newItems.length > 0) {
			// 기존 데이터와 새 데이터를 합쳐서 gridRef2에 설정
			const combinedData = [...existingData, ...newItems];
			gridRef2.setGridData(combinedData);
			setDetailTotalCnt(combinedData.length);
		}
	};

	/**
	 * 선택적용 버튼 클릭 시
	 */
	const handleSelectApply = () => {
		const gridRef = ref.gridRef2.current;
		const checkedItems = gridRef.getCheckedRowItemsAll();

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedItems.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 필수값 체크
		const taskdt = formRef?.getFieldValue('taskdt')?.format('YYYYMMDD') ?? ''; // 조정일자
		const reasoncode = formRef.getFieldValue('reasoncode') ?? ''; // 발생사유
		const processmain = formRef.getFieldValue('processmain') ?? ''; // 물류귀책배부
		const other051 = formRef.getFieldValue('other051') ?? ''; // 비고(사유)

		if (taskdt.trim().length < 1) {
			showAlert('', t('msg.selectPlease1', [t('lbl.TASKDT_AJ')])); // {조정일자}을/를 선택해주세요
			const input = document.querySelector('input[name="taskdt"]') as HTMLInputElement;
			input?.focus();
			return;
		}

		if (processmain.trim().length < 1) {
			showAlert('', t('msg.selectPlease1', [t('lbl.OTHER05_DMD_AJ')])); // {'물류귀책배부}을/를 선택해주세요
			const input = document.querySelector('input[name="processmain"]') as HTMLInputElement;
			input?.focus();
			return;
		}

		if (reasoncode.trim().length < 1) {
			showAlert('', t('msg.selectPlease1', [t('lbl.REASONCODE')])); // {사유코드}을/를 선택해주세요
			const input = document.querySelector('input[name="reasoncode"]') as HTMLInputElement;
			input?.focus();
			return;
		}
		gridRef.updateRowsById(
			checkedItems.map((item: any) => ({
				...item,
				reasoncode: reasoncode,
				processmain: processmain,
				other051: other051,
				rowStatus: 'I',
			})),
		);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		const gridRef1 = ref.gridRef1.current;
		if (gridRef1) {
			gridRef1?.setSelectionByIndex(0, 0);

			// 성능 개선: cell단위 변경 대신 전체 데이터를 한번에 변경(2/2)
			const newRows = props.data.map((row: any, idx: any) => ({
				...row,
				uid: `ua-${idx + 1}`,
			}));
			gridRef1?.setGridData(newRows);

			if (props.data.length > 0) {
				const colSizeList = gridRef1.getFitColumnSizeList(true);
				gridRef1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	useEffect(() => {
		const fetchInitStore = async () => {
			await fetchMsOrganize();
		};
		// init store
		fetchInitStore();
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef1?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn1} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt}>
								<Button size={'small'} style={{ marginRight: 0 }} onClick={() => addSelectedToGrid2()}>
									{t('lbl.SELECT_MOVE')} {/* 선택이동 */}
								</Button>
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef1} columnLayout={gridCol1} gridProps={gridProps1} footerLayout={footerLayout1} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn2} gridTitle="품목LIST" totalCnt={detailTotalCnt}>
								{/* START.일괄적용영역 */}
								<Form form={formRef} layout="inline">
									<div className="sect">
										{/* 조정일자*/}
										<DatePicker
											label={t('lbl.TASKDT_AJ')}
											name="taskdt"
											onChange={setDates}
											defaultValue={dates}
											required
											allowClear
											showNow={true}
											className="bg-white"
											rules={[{ required: true, message: t('msg.placeholder1', [t('lbl.TASKDT_AJ')]) }]}
										/>

										{/* 물류귀책배부*/}
										<SelectBox
											name="processmain"
											label={t('lbl.OTHER05_DMD_AJ')}
											options={getCommonCodeList('YN', t('lbl.SELECT'))}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											defaultValue={t('lbl.SELECT')}
											required
											rules={[{ required: true, message: t('msg.placeholder1', [t('lbl.OTHER05_DMD_AJ')]) }]}
											style={{ width: '100px' }}
											className="bg-white"
										/>
										{/* 발생사유 */}
										<SelectBox
											name="reasoncode"
											label={t('lbl.REASONCODE_AJ')} //발생사유
											options={reasonCodeList}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											defaultValue={t('lbl.SELECT')}
											required
											rules={[{ required: true, message: t('msg.placeholder1', [t('lbl.REASONCODE')]) }]}
											style={{ width: '200px' }}
											className="bg-white"
										/>
										<li>
											{/* 비고 */}
											<InputText label="비고" name="other051" className="bg-white" maxLength={100} />
										</li>
										<Button size={'small'} style={{ marginRight: 0 }} onClick={() => handleSelectApply()}>
											{t('lbl.APPLY_SELECT')} {/* 선택적용 */}
										</Button>
									</div>
									{/* 팝업.CmLoopTranPopup */}
									<CustomModal ref={modalRef} width="1000px">
										<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
									</CustomModal>
								</Form>
							</GridTopBtn>
							{/* END.일괄적용영역 */}
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
});
export default StInoutResultDetail;
