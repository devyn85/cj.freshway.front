/*
 ############################################################################
 # FiledataField	: StInquiryMoveDetail1GridColumns.ts
 # Description		: 재고 > 재고조사 > 재고조사결과처리- Grid Column 정의
 # Author			: sss
 # Since			: 25.08.04
 ############################################################################
*/

import { apiPostSaveMasterList } from '@/api/st/apiStInquiryMove';
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';

/**
 * 탭 인덱스 전역변수
 */
let tabIndexGlobal = '1';

/**
 * 편집 가능한 상태인지 확인하는 함수
 * @param {any} item - 그리드 행 아이템
 * @returns {boolean} - 편집 가능 여부
 */
export const isDisabled = (item: any): boolean => {
	// 처리완료면 편집 불가
	if (commUtil.nvl(item?.commitYn, 'N') == 'Y') {
		return true;
	}

	// 재고실사 탭인 경우만 적용
	// 차이수량이 0이거나 더 조사가 되었다면 재고 이동 대상이 아니라고 disabled 처리
	// 차이수량 = 조사수량 - 지시수량
	if (tabIndexGlobal === '2') {
		if (item?.tranqty > -1) {
			return true;
		}
	}

	return false;
};

// 편집 가능한 상태인지 확인하는 함수(소비기한 변경 여부)
export const isDisabledToLot = (item: any): boolean => {
	if (item?.posbqty === 0) {
		return true;
	}

	return false;
};

// JAVA에서 설명 동일하게 있음
// 2026-01-19.소비기한 변경 + 재고이동 통합 API 구현 관련 메모
// - CASE1: 차이수량이 양수인 경우(실물이 더 많음) -> 소비기한 변경만 처리, 재고이동 처리 불필요
//   ->케이스
//         지시  조사  차이수량   이동가능수량
//         --------------------------
//         10	     12	    2	     10       =>CASE1->[처리사항]소비기한 10개만 처리, 사유)실사결과가 실물이 더 많으면 실사조정처리 않함
//          ->소비기한만 처리
//         --------------------------
//         10	     8	   -2	     10       =>CASE2->[정상처리]실물이 2개  분실 10   재고수량 중 2개를 이동 처리 후 나머지 8개 소비기한 변경
//          ->ABS(차이수량) < 이동가능수량 일 경우
//          ->재고이동 2개 + 소비기한 변경 8개 처리
//         --------------------------
//         56	     0	 -56	      5       =>CASE3->[예외처리]실물이 56개 분실 56개 실제이동가능수량이 5개 밖에 없음 => 재고이동 처리 후 소비기한변경 처리 시 이동가능수량 5개로 소비기한변경 처리 시 처리 불필요 로 변경
//          ->ABS(차이수량) > 이동가능수량 일 경우
//          ->재고이동 5개 + 소비기한 변경 0개 처리(상태를 처리 불필요 만 변경)
//         --------------------------

/**
 * caseFlag를 계산하는 함수
 * @param {string} type - 반환 타입 ('1': caseFlag, '2': boolean 소비기한처리 수량)
 * @param {any} item - 그리드 행 아이템
 * @returns {string|boolean} - type이 '1'일 때 CASE1/CASE2/CASE3, '2'일 때 posbqty - Math.abs(tranqty)
 */
export const getCaseFlag = (type: string, item: any): any => {
	const orderqty = Number(item.orderqty) || 0; // 지시수량
	const scanqtyA = Number(item.scanqtyA) || 0; // 실사수량
	const tranqty = Number(item.tranqty) || 0; // 차이수량
	const posbqty = Number(item.posbqty) || 0; // 이동가능수량

	// type이 '2'일 때 소비기한처리 수량 반환
	if (type === '2') {
		return posbqty - Math.abs(tranqty);
	}

	// CASE1: 지시수량보다 실사수량이 크면
	if (scanqtyA > orderqty) {
		return 'CASE1';
	}

	// CASE2, CASE3: 차이수량이 마이너스인 경우
	if (tranqty < 0) {
		// CASE3: 차이수량이 마이너스인데 차이수량 절대값이 이동가능수량보다 크면
		if (Math.abs(tranqty) > posbqty) {
			return 'CASE3';
		}
		// CASE2: 차이수량이 마이너스면 (CASE3 제외)
		return 'CASE2';
	}

	// 기본값 (차이수량이 0 이상인 경우)
	return 'CASE1';
};

/**
 * 그리드 컬럼 변수 저장소
 */
let gridColumnsCache: any[] = [];

/**
 * 그리드 컬럼 추가 함수
 * @param {object} column - 추가할 컬럼 객체
 */
export const addGridColumn = (column: any) => {
	gridColumnsCache.push(column);
};

/**
 * 그리드 컬럼 초기화
 */
export const clearGridColumns = () => {
	gridColumnsCache = [];
};

/**
 * 저장된 그리드 컬럼 반환
 * @returns {Array} 그리드 컬럼 배열
 */
export const getStoredGridColumns = () => {
	return [...gridColumnsCache]; // 복사본 반환
};

/**
 * 그리드 컬럼 정의 (Push 방식으로 다이나믹하게)
 * @param {Function} t - 번역 함수
 * @param {string} tabIndex - 탭 타입 ('1': 소비기한, '2': 재고실사)
 * @param gridRef
 * @returns {Array} 그리드 컬럼 배열
 */
export const getGridColumns = (t: any, tabIndex = '1', gridRef: any) => {
	tabIndexGlobal = tabIndex; // 전역변수에 tabIndex 저장
	const columns: any[] = [];

	// 기본 컬럼들을 push 방식으로 추가
	columns.push({ dataField: 'inquiryName', headerText: t('lbl.INQUIRY_ALIAS'), editable: false }); // 재고조사별칭
	columns.push({ dataField: 'inquiryno', headerText: t('lbl.INQUIRYNO'), editable: false, dataType: 'code' }); // 조회번호
	columns.push({ dataField: 'priority', headerText: t('lbl.SEQ'), editable: false, dataType: 'numeric' }); // 순번
	columns.push({ dataField: 'dccode', headerText: t('lbl.DCCODE'), editable: false, dataType: 'code' }); // 물류센터
	columns.push({ dataField: 'organize', headerText: t('lbl.ORGANIZE'), editable: false, dataType: 'code' }); // 창고
	columns.push({ dataField: 'status', headerText: t('lbl.INQUIRYSTATUS'), editable: false, dataType: 'code' }); // 조회상태

	columns.push({
		dataField: 'commitYnNm', // 처리상태
		headerText: t('lbl.QCSTATUS_RT'),
		editable: false,
		dataType: 'code',
		labelFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			if (Number(item.tranqty) === 0) {
				return '이동불필요';
			}
			return commUtil.nvl(item.commitYn, 'N') === 'Y' ? t('lbl.TASKCOMPLETE') : t('lbl.INCOMPLETE'); // 작업완료/미완료
		},
		styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
			if (Number(item.tranqty) === 0) {
				return {
					backgroundColor: '#1ad002',
				};
			}
			return {
				backgroundColor: commUtil.nvl(item.commitYn, 'N') === 'Y' ? '#1ad002' : '#d80000',
			};
		},
	});

	// 상품 관련 컬럼들
	columns.push({ dataField: 'sku', headerText: t('lbl.SKU'), editable: false, dataType: 'code' }); // 상품코드
	columns.push({ dataField: 'skuname', headerText: t('lbl.SKUNAME'), editable: false, dataType: 'string' }); // 상품명
	columns.push({ dataField: 'uom', headerText: t('lbl.UOM'), editable: false, dataType: 'code' }); // 단위

	// 창고 관련 컬럼들
	columns.push({ dataField: 'wharea', headerText: t('lbl.WHAREA'), editable: false, dataType: 'code' }); // 창고구역
	columns.push({ dataField: 'whareafloor', headerText: t('lbl.WHAREAFLOOR'), editable: false, dataType: 'code' }); // 창고구역층
	columns.push({ dataField: 'zone', headerText: t('lbl.ZONE'), editable: false, dataType: 'code' }); // 피킹존
	columns.push({ dataField: 'zonename', headerText: t('lbl.ZONENAME'), editable: false, dataType: 'string' }); // 피킹존명
	columns.push({ dataField: 'loc', headerText: t('lbl.LOC_ST'), editable: false, dataType: 'code' }); // 로케이션
	columns.push({ dataField: 'stockgrade', headerText: t('lbl.STOCKGRADE'), visible: false }); // 재고속성
	/*
		############################################################################
		# 소비기한은 소비기한변경과 조사수량을 동시에 처리할 수 있음
		# 재고실사는 조사수량만 처리 가능(소비기한 변경 불가)
		############################################################################
	*/
	// 이력정보 그룹 컬럼
	columns.push({
		headerText: t('재고조사'), // 재고조사
		disableMoving: true,
		children: [
			{
				dataField: 'orderqty',
				headerText: t('lbl.ORDERQTY_INQUIRY'), // 지시수량
				editable: false,
				dataType: 'numeric',
			},
			{
				dataField: 'scanqtyA',
				headerText: t('lbl.INQUIRYQTY'), // 조사수량
				editable: false,
				dataType: 'numeric',
				// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				// 	if (isDisabled(item)) {
				// 		// 편집 가능 class 삭제
				// 		gridRef.current.removeEditClass(columnIndex);
				// 	} else {
				// 		// 편집 가능 class 추가
				// 		return 'isEdit';
				// 	}
				// },
			},
			{
				dataField: 'tranqty',
				headerText: t('lbl.QTY_DIFF'), // 차이수량
				headerTooltip: {
					show: true,
					tooltipHtml: '※차이수량 = 조사수량 - 지시수량<br>-일 경우 이동처리가 됩니다.',
				},
				editable: false,
				dataType: 'numeric',
			},
			{
				dataField: 'posbqty',
				headerText: '이동가능수량',
				dataType: 'numeric',
				editable: false,
			},
		],
	});

	//
	//
	columns.push({ dataField: 'stockgradenm', headerText: t('lbl.STOCKGRADE'), editable: false, dataType: 'code' }); // 재고속성명
	columns.push({
		dataField: 'lottable01',
		headerText: t('lbl.LOTTABLE01'), // 소비기한일자
		editable: false,
		dataType: 'code',
		formatString: 'yyyy-mm-dd',
		dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
		// 입력가능해야 함
		commRenderer: {
			type: 'calender',
			onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
			showExtraDays: false,
			align: 'center',
		},
	});

	// 소비기한 탭: 편집 가능한 toLot 컬럼 추가
	columns.push({
		dataField: 'toLot',
		headerText: '소비기한일자(변경)',
		headerTooltip: {
			show: true,
			tooltipHtml: '※조사수량이 0이면 편집이 불가합니다.',
		},
		editable: true,
		formatString: 'yyyy-mm-dd',
		dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
		dataType: 'code',
		visible: tabIndex !== '2',
		style: 'user12',
		required: true,
		// STD 입력가능해야 함
		commRenderer: {
			type: 'calender',
			onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
			showExtraDays: false,
			align: 'center',
		},
		styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			if (isDisabled(item) || isDisabledToLot(item)) {
				// 편집 가능 class 삭제
				gridRef.current.removeEditClass(columnIndex);
			} else {
				// 편집 가능 class 추가
				return 'isEdit';
			}
		},
	}); // 소비기한일자(변경)

	// 기타 컬럼들
	columns.push({ dataField: 'durationTerm', headerText: t('lbl.DURATION_TERM'), editable: false, dataType: 'code' }); // 유통기간

	// 이력정보 그룹 컬럼
	columns.push({
		headerText: t('lbl.SERIALINFO'), // 이력정보
		disableMoving: true,
		children: [
			{ dataField: 'serialno', headerText: t('lbl.SERIALNO'), editable: false, dataType: 'code' }, // 이력번호
		],
	});

	// 재고ID
	columns.push({ dataField: 'stockid', headerText: t('lbl.TO_STOCKID'), editable: false, dataType: 'code' }); // 재고ID
	columns.push({
		dataField: 'instructionYn',
		headerText: t('lbl.IFFLAG'),
		dataType: 'code',
		editable: false,
		width: 80,
	}); // 지시여부
	columns.push({
		dataField: 'mobileAddYn',
		headerText: t('모바일등록여부'),
		dataType: 'code',
		editable: false,
		width: 80,
	}); // 모바일등록여부
	// 편집정보 그룹 컬럼
	columns.push({
		headerText: t('lbl.EDITINFO'), // 편집정보
		disableMoving: true,
		children: [
			{ dataField: 'editdate', headerText: t('lbl.ADDDATE'), editable: false, dataType: 'date' }, // 편집일자
			{ dataField: 'editwho', headerText: t('lbl.ADDWHO'), editable: false, dataType: 'code' }, // 편집자
			{ dataField: 'username', headerText: t('lbl.USERNAME'), editable: false, dataType: 'code' }, // 사용자명
		],
	});

	// Hidden 컬럼들 추가
	const hiddenColumns = [
		{ dataField: 'inquirydt', headerText: t('lbl.INQUIRYDT'), visible: false }, // 조회일자
		{ dataField: 'inquiryno', headerText: t('lbl.INQUIRYNO'), visible: false }, // 조회번호
		{ dataField: 'zone', headerText: '존', visible: false }, // 존
		{ dataField: 'fromLoc', headerText: '출고로케이션', visible: false }, // 출고로케이션
		{ dataField: 'fromLot', headerText: '출고로트', visible: false }, // 출고로트
		{ dataField: 'fromStockid', headerText: '출고재고ID', visible: false }, // 출고재고ID
		{ dataField: 'fromStocktype', headerText: '출고재고유형', visible: false }, // 출고재고유형
		{ dataField: 'fromStockgrade', headerText: '재고등급', visible: false }, // 재고등급
		{ dataField: 'fromLottable01', headerText: '출고LOT속성1', visible: false }, // 출고LOT속성1
		{ dataField: 'reasoncode', headerText: '사유코드', visible: false }, // 사유코드
		{ dataField: 'reasonmsg', headerText: '사유메세지', visible: false }, // 사유메세지
		{ dataField: 'duration', headerText: '소비기한', visible: false }, // 소비기한
		{ dataField: 'commitYn', headerText: 'commitYn', visible: false }, // 결과처리여부
	];

	// Hidden 컬럼들을 배열에 추가
	hiddenColumns.forEach(column => columns.push(column));

	// 컬럼을 변수에 누적 저장
	clearGridColumns(); // 기존 캐시 초기화
	columns.forEach(column => addGridColumn(column));

	return columns;
};

/**
 * 그리드 Props 정의
 * @returns {object} 그리드 Props 객체
 */
export const getGridProps = () => {
	return {
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
			return !isDisabled(item); // true면 체크 불가
		},
	};
};

export const saveMasterListImp01 = async (
	ref: any,
	gridRef: any,
	t: any,
	form: any,
	formRef: any,
	props: any,
	activeKeyMaster: number,
	setLoopTrParams: (params: any) => void,
	refLoopModal: any,
): Promise<void> => {
	// 차이가 있을 경우는 재고이동 처리
	const lottype = form.getFieldValue('lottype'); // 실사구분(0:소비기한, 1:재고실사)
	const dsCheckedHeader = ref.gridRef.current.getCheckedRowItemsAll();
	const checkedRows = ref.gridRef.current.getCheckedRowItems();

	// 선택된 행이 없으면 경고 메시지 표시
	if (checkedRows.length < 1) {
		showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
		return;
	}

	// 입력 값 검증
	// const isValid = await validateForm(formRef);
	// if (!isValid) {
	// 	return;
	// }

	// 조사수량 체크 > 0인 경우에만 처리 가능
	const toLotCheck = dsCheckedHeader.some((item: any) => Number(item.scanqtyA) > 0);
	if (toLotCheck) {
		const reasoncode = formRef.getFieldValue('reasoncode');
		const reasonmsg = formRef.getFieldValue('reasonmsg');

		if (!reasoncode || reasoncode.trim() === '') {
			showAlert(null, '소비기한 사유는 필수 입력입니다.');
			return;
		}

		if (!reasonmsg || reasonmsg.trim() === '') {
			showAlert(null, '소비기한 사유메세지는 필수 입력입니다.');
			return;
		}
	}

	// 차이수량이 마이너스인 row가 있는지 확인
	let tranqtyCheck = dsCheckedHeader.some((item: any) => Number(item.tranqty) < 0);

	// 이동가능한 수량이 있을 때 추가 체크
	if (tranqtyCheck) {
		tranqtyCheck = dsCheckedHeader.some((item: any) => Number(item.posbqty) > 0);
	}

	// 차이수량이 마이너스인 경우 필수 입력 체크
	if (tranqtyCheck) {
		const reasoncodeMoveValue = formRef.getFieldValue('reasoncodeMove');
		const locValue = formRef.getFieldValue('loc');

		if (!reasoncodeMoveValue || reasoncodeMoveValue.trim() === '') {
			showAlert(null, '재고이동을 처리할 row가 존재하여 이동사유코드는 필수 입력입니다.');
			return;
		}

		if (!locValue || locValue.trim() === '') {
			showAlert(null, '재고이동을 처리할 row가 존재하여 로케이션은 필수 입력입니다.');
			return;
		}
	}

	let message = '';

	if (tranqtyCheck && toLotCheck) {
		message = '재고이동과 소비기한 변경 처리를 하시겠습니까?';
	} else if (tranqtyCheck) {
		message = '재고이동 처리를 하시겠습니까?';
	} else if (toLotCheck) {
		message = '소비기한 변경 처리를 하시겠습니까?';
	}

	if (message === '') {
		showAlert(null, '처리할 데이터가 없습니다.');
		return;
	}

	//alert(tranqtyCheck + ' / ' + toLotCheck);

	// 각 행별 lottable01 값으로 유통기한 체크
	for (let i = 0; i < dsCheckedHeader.length; i++) {
		const scanqtyA = dsCheckedHeader[i].scanqtyA; // 조사수량
		const rowLottable01 = commUtil.nvl(dsCheckedHeader[i].toLot, ''); // 그리드의 lottable01 값 사용
		if (scanqtyA === 0) continue; // 조사수량이 0인 경우는 체크하지 않음

		const rowIndex = checkedRows[i].rowIndex; // 원래 Row번호

		if (rowLottable01 === '') {
			showAlert(null, `${rowIndex + 1}번째 행의 소비기한은 필수 입력입니다.`);
			ref.gridRef.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('toLot'));
			return;
		}
	}

	showConfirm(null, message, async () => {
		// 법적유통기한이 초과된 유통기한으로 입력하였는지 체크
		let strCheck = 'Y';

		// 각 행별 lottable01 값으로 유통기한 체크
		for (let i = 0; i < dsCheckedHeader.length; i++) {
			const scanqtyA = dsCheckedHeader[i].scanqtyA; // 조사수량
			const rowLottable01 = commUtil.nvl(dsCheckedHeader[i].toLot, ''); // 그리드의 lottable01 값 사용
			if (scanqtyA === 0) continue; // 조사수량이 0인 경우는 체크하지 않음

			// START.소비기한일자 체크
			if (rowLottable01 != 'STD' && rowLottable01 != '') {
				if (!dsCheckedHeader[i].duration || dsCheckedHeader[i].duration === null) continue;

				const numDuration = Number(dsCheckedHeader[i].duration);
				if (dsCheckedHeader[i].durationtype == '1') {
					// 유통기한
					if (dateUtil.addDate(rowLottable01, -numDuration) > dateUtil.today() || rowLottable01 < dateUtil.today()) {
						strCheck = 'N';
						break;
					}
				} else if (dsCheckedHeader[i].durationtype == '2') {
					//  제조일자
					if (rowLottable01 > dateUtil.today() || dateUtil.addDate(rowLottable01, numDuration) < dateUtil.today()) {
						strCheck = 'N';
						break;
					}
				}
			}
		}
		// END.소비기한일자 체크

		if (strCheck === 'N') {
			showAlert(null, '소비기한이 올바르지 않습니다. 다시 확인해주세요.');
			return;
		}

		const checkedRows2 = checkedRows
			.filter((item: any) => commUtil.nvl(item.item.commitYn, 'N') !== 'Y')
			.map((item: any) => {
				const absTranqty = Math.abs(item.item.tranqty);
				const posbqty = Number(item.item.posbqty) || 0;

				return {
					...item.item,
					tranqty: absTranqty > posbqty ? posbqty : absTranqty, // 차이수량 절대값이 이동가능수량보다 크면 이동가능수량으로 제한
					caseFlag: getCaseFlag('1', item.item), // caseFlag 추가
					lottableTranqty: getCaseFlag('2', item.item), // 소비기한처리 수량
					rowStatus: 'U',
				};
			});

		const params = {
			//apiUrl: '/api/st/stInquiryMove/v1.0/saveMasterList01', // 1/2 소비기한 변경 전용 API
			apiUrl: '/api/st/stInquiryMove/v1.0/saveMasterListAll', // 1/2 소비기한 변경 + 재고이동 통합 API
			avc_COMMAND: 'CONFIRM',
			converttype: 'CL',
			lottable01: '', // row별 lottable01 값으로 처리
			lottable02: 'STD',
			lottable03: 'STD',
			lottable04: 'STD',
			lottable05: 'STD',
			lottype: lottype,
			//
			//
			reasoncode: formRef.getFieldValue('reasoncode'), // 이동사유코드
			reasonmsg: formRef.getFieldValue('reasonmsg'), // 사유메세지
			reasoncodeMove: formRef.getFieldValue('reasoncodeMove'), // 이동사유코드
			loc: formRef.getFieldValue('loc'), // 로케이션
			//
			dataKey: 'saveList',
			saveDataList: checkedRows2, // 선택된 행의 데이터 중 처리안된 행만 필터
		};

		setLoopTrParams(params);
		refLoopModal.current.handlerOpen();
	});
};

// 저장 처리 함수(1/2) - 재고실사
export const saveMasterListImp02 = async (
	ref: any,
	gridRef: any,
	t: any,
	form: any,
	formRef: any,
	props: any,
	activeKeyMaster: number,
	setLoopTrParams: (params: any) => void,
	refLoopModal: any,
): Promise<void> => {
	const checkedRows = gridRef.current.getCheckedRowItems();
	const allGridData = gridRef.current.getGridData();
	const lottype = form.getFieldValue('lottype'); // 실사구분(0:소비기한, 1:재고실사)

	let isDoneJob01 = false;
	let isAllZero = true;

	// 중요.전체 데이터 기준으로 차이수량이 모두 0인지 체크
	for (let i = 0; i < allGridData.length; i++) {
		if (commUtil.nvl(allGridData[i].commitYn, 'N') != 'Y' && Number(allGridData[i].tranqty) != 0) {
			isAllZero = false;
			break;
		}
	}

	if (isAllZero) {
		/********************************************************
		 1/2. 전체.ROW 차이수량이 모두 0일 때 강제 완료 처리 - 전체처리(모두 정상실사를 할 경우)
		/********************************************************/
		showConfirm(null, '차이수량이 모두 0입니다. 처리결과완료 하시겠습니까?', async () => {
			const selectedMasterRow = ref.gridRef.current?.getSelectedRows()[0];
			if (selectedMasterRow) {
				const params = {
					saveList: ref.gridRef.current.getCheckedRowItemsAll().map((item: any) => ({
						...item,
						rowStatus: 'U',
					})),
					//
					lottype: props.activeKeyMaster === 1 ? 0 : 1, // 실사구분(0:소비기한, 1:재고실사)
				};

				try {
					const res = await apiPostSaveMasterList(params);
					if (res.statusCode > -1) {
						showAlert(null, '차이수량 0 처리가 완료되었습니다.');
						props.searchMasterList();
					}
				} catch (e) {}

				isDoneJob01 = true;
			}
		});

		return; // 차이수량 0 처리 후 함수 종료
	}

	/********************************************************/
	// // 선택된 행이 없으면 경고 메시지 표시
	if (checkedRows.length < 1) {
		showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
		return;
	}

	// 중요.전체 데이터 기준으로 차이수량이 모두 0인지 체크
	isAllZero = true;
	for (let i = 0; i < checkedRows.length; i++) {
		if (commUtil.nvl(checkedRows[i].item.commitYn, 'N') != 'Y' && Number(checkedRows[i].item.tranqty) != 0) {
			isAllZero = false;
			break;
		}
	}

	// 재고이동처리
	if (!isAllZero) {
		if (!isDoneJob01) {
			// 폼 값 검증
			const isValid = await validateForm(formRef);
			if (!isValid) {
				return;
			}

			// 1/2 처리 미완료 시 단순 메세지 표시
			showConfirm(null, '재고이동 처리를 하시겠습니까?', async () => {
				saveMasterListImp02Last(ref, checkedRows, lottype, formRef, setLoopTrParams, refLoopModal);
			});
		} else {
			saveMasterListImp02Last(ref, checkedRows, lottype, formRef, setLoopTrParams, refLoopModal);
		}
	} else {
		showAlert(null, '체크한 항목의 차이수량이 모두 0입니다. 재고이동 처리를 할 수 없습니다.');
	}
};

// 저장 처리 함수(1/2) - 재고실사 최종 구현
export const saveMasterListImp02Last = async (
	ref: any,
	checkedRows: any,
	lottype: any,
	formRef: any,
	setLoopTrParams: any,
	refLoopModal: any,
) => {
	const params = {
		apiUrl: '/api/st/stInquiryMove/v1.0/saveMasterList02',
		avc_COMMAND: 'CONFIRM',
		saveDataList: checkedRows
			.filter((item: any) => commUtil.nvl(item.item.commitYn, 'N') !== 'Y')
			.map((item: any) => ({
				...item.item,
				tranqty: Math.abs(item.item.tranqty), // 차이수량 절대값으로 전송
				caseFlag: getCaseFlag('1', item.item), // caseFlag 추가
			})), // 선택된 행의 데이터 중 처리안된 행만 필터
		//
		dataKey: 'saveList',
		lottype: lottype,
		reasoncode: formRef.getFieldValue('reasoncode'), // 이동사유코드
		loc: formRef.getFieldValue('loc'), // 로케이션
	};

	setLoopTrParams(params);
	refLoopModal.current.handlerOpen();
};

/**
 * Footer 레이아웃 정의
 * @param {Function} t - 번역 함수
 * @returns {Array} Footer 레이아웃 배열
 */
export const getFooterLayout = (t: any) => {
	return [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: 'checkyn',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		}, // 지시수량 합계
		{
			dataField: 'scanqtyA',
			positionField: 'scanqtyA',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		}, // 조사수량 합계
		{
			dataField: 'tranqty',
			positionField: 'tranqty',
			operation: 'SUM',
			formatString: '#,##0',
			style: 'right',
		}, // 차이수량 합계
	];
};
