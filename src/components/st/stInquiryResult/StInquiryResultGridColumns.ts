/*
 ############################################################################
 # FiledataField	: StInquiryResultGridColumns.ts
 # Description		: 재고 > 재고현황 > 조사지시현황 그리드 컬럼 정의
 # Author			: sss
 # Since			: 25.11.13
 ############################################################################
*/

import { apiGetSequenceNumber, apiPostSaveCloseMasterList, apiPostSaveMasterList } from '@/api/st/apiStInquiryResult';
import commUtil from '@/util/commUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import dayjs from 'dayjs';

/**
 * 편집 가능한 상태인지 확인하는 함수
 * @param {any} item - 그리드 행 아이템
 * @returns {boolean} - 편집 가능 여부
 */
export const isDisabled = (item: any): boolean => {
	// 처리완료 상태일 때 편집 불가
	if (commUtil.nvl(item?.statusnm, 'x') == '종료') {
		return true;
	}

	// 조사일자가 당일 이전일 때 편집 불가
	if (item?.inquirydt) {
		const inquiryDate = dayjs(item.inquirydt);
		const today = dayjs();
		if (inquiryDate.isBefore(today, 'day')) {
			return true;
		}
	}

	if (item?.mobileAddYn == 'Y') {
		return true;
	}

	return false;
};

/**
 * 조사지시현황 그리드 컬럼 정의 함수 (Detail1용)
 * @param tabIndex
 * @param {Function} t - 다국어 번역 함수
 * @returns {Array} - 그리드 컬럼 배열
 */
export const getGridColumns = (tabIndex: number, t: any) => {
	const columns = [
		{ dataField: 'inquiryno', headerText: t('lbl.INQUIRYNO'), dataType: 'code', editable: false, width: 120 }, // 조사번호
		{ dataField: 'inquiryName', headerText: t('lbl.INQUIRY_ALIAS'), width: 65 }, // 재고조사별칭
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), width: 65 }, // 물류센터
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), width: 65 }, // 조직
		{ dataField: 'inquirydt', headerText: t('lbl.INQUIRYDT'), width: 65, dataType: 'code' }, // 조사일자
		{ dataField: 'statusnm', headerText: t('lbl.INQUIRYSTATUS'), width: 65, dataType: 'code' }, // 조사상태
		{ dataField: 'wharea', headerText: t('lbl.WHAREA'), width: 65, dataType: 'code' }, // 창고구역
		{ dataField: 'zone', headerText: t('lbl.ZONE'), width: 65, dataType: 'code' }, // 존

		// tabIndex가 1일 때만 로케이션 컬럼 노출
		...(tabIndex === 1 ? [{ dataField: 'loc', headerText: t('lbl.LOC_ST'), width: 65 }] : []), // 로케이션

		{ dataField: 'sku', headerText: t('lbl.SKU'), dataType: 'code', width: 69 }, // 상품코드
		{ dataField: 'skuname', headerText: t('lbl.SKUNAME'), width: 320 }, // 상품명
		{ dataField: 'uom', headerText: t('lbl.UOM'), dataType: 'code', width: 65 }, // 단위

		// tabIndex가 1일 때만 재고ID 컬럼 노출
		...(tabIndex === 1
			? [{ dataField: 'stockid', headerText: t('lbl.TO_STOCKID'), dataType: 'code', editable: false }]
			: []), // 재고ID

		{ dataField: 'totaldiffqty', headerText: '최종차이<BR>수량', width: 80, dataType: 'numeric', style: 'right' }, // 최종차이수량
		{ dataField: 'totaldiffamt', headerText: '최종차이<BR>금액', width: 80, dataType: 'numeric', style: 'right' }, // 최종차이금액
		{ dataField: 'lastpriority', headerText: '최종차수', width: 40, dataType: 'numeric', style: 'right' }, // 최종차수
		{ dataField: 'orderqty', headerText: '지시수량', width: 80, dataType: 'numeric', style: 'right' }, // 지시수량
		{
			headerText: '1차',
			children: [
				{ dataField: 'priority01', headerText: t('lbl.QTY'), width: 65, dataType: 'numeric', style: 'right' }, // 1차 수량
				{ dataField: 'diffqty01', headerText: t('lbl.DIFFQTY'), width: 65, dataType: 'numeric', style: 'right' }, // 1차 차이수량
			],
		},
		{
			headerText: '2차',
			children: [
				{ dataField: 'priority02', headerText: t('lbl.QTY'), width: 65, dataType: 'numeric', style: 'right' }, // 2차 수량
				{ dataField: 'diffqty02', headerText: t('lbl.DIFFQTY'), width: 65, dataType: 'numeric', style: 'right' }, // 2차 차이수량
			],
		},
		{
			headerText: '3차',
			children: [
				{ dataField: 'priority03', headerText: t('lbl.QTY'), width: 65, dataType: 'numeric', style: 'right' }, // 3차 수량
				{ dataField: 'diffqty03', headerText: t('lbl.DIFFQTY'), width: 65, dataType: 'numeric', style: 'right' }, // 3차 차이수량
			],
		},
		{
			headerText: '4차',
			children: [
				{ dataField: 'priority04', headerText: t('lbl.QTY'), width: 65, dataType: 'numeric', style: 'right' }, // 4차 수량
				{ dataField: 'diffqty04', headerText: t('lbl.DIFFQTY'), width: 65, dataType: 'numeric', style: 'right' }, // 4차 차이수량
			],
		},
		{
			headerText: '5차',
			children: [
				{ dataField: 'priority05', headerText: t('lbl.QTY'), width: 65, dataType: 'numeric', style: 'right' }, // 5차 수량
				{ dataField: 'diffqty05', headerText: t('lbl.DIFFQTY'), width: 65, dataType: 'numeric', style: 'right' }, // 5차 차이수량
			],
		},
		{
			headerText: '6차',
			children: [
				{ dataField: 'priority06', headerText: t('lbl.QTY'), width: 65, dataType: 'numeric', style: 'right' }, // 6차 수량
				{ dataField: 'diffqty06', headerText: t('lbl.DIFFQTY'), width: 65, dataType: 'numeric', style: 'right' }, // 6차 차이수량
			],
		},
		{
			headerText: '7차',
			children: [
				{ dataField: 'priority07', headerText: t('lbl.QTY'), width: 65, dataType: 'numeric', style: 'right' }, // 7차 수량
				{ dataField: 'diffqty07', headerText: t('lbl.DIFFQTY'), width: 65, dataType: 'numeric', style: 'right' }, // 7차 차이수량
			],
		},
		{
			headerText: '8차',
			children: [
				{ dataField: 'priority08', headerText: t('lbl.QTY'), width: 65, dataType: 'numeric', style: 'right' }, // 8차 수량
				{ dataField: 'diffqty08', headerText: t('lbl.DIFFQTY'), width: 65, dataType: 'numeric', style: 'right' }, // 8차 차이수량
			],
		},
		{
			headerText: '9차',
			children: [
				{ dataField: 'priority09', headerText: t('lbl.QTY'), width: 65, dataType: 'numeric', style: 'right' }, // 9차 수량
				{ dataField: 'diffqty09', headerText: t('lbl.DIFFQTY'), width: 65, dataType: 'numeric', style: 'right' }, // 9차 차이수량
			],
		},
		{
			headerText: '10차',
			children: [
				{ dataField: 'priority10', headerText: t('lbl.QTY'), width: 65, dataType: 'numeric', style: 'right' }, // 10차 수량
				{ dataField: 'diffqty10', headerText: t('lbl.DIFFQTY'), width: 65, dataType: 'numeric', style: 'right' }, // 10차 차이수량
			],
		},

		{ dataField: 'stockqty', headerText: t('lbl.STOCKQTY'), width: 65, dataType: 'numeric', style: 'right' }, // 재고수량
		{ dataField: 'inquiryqty', headerText: t('lbl.INQUIRYQTY'), width: 65, dataType: 'numeric', style: 'right' }, // 조사수량
		{ dataField: 'diffqty', headerText: t('lbl.DIFFQTY'), width: 65, dataType: 'numeric', style: 'right' }, // 차이수량
		{ dataField: 'reasoncode', headerText: t('lbl.INQUIRYREASONCODE'), width: 65 }, // 조사사유코드
		{ dataField: 'reasonmsg', headerText: t('lbl.INQUIRYREASONMSG'), width: 65 }, // 조사사유메시지
		{ dataField: 'inquiryno', headerText: t('lbl.INQUIRYNO'), width: 65 }, // 조사번호
		{ dataField: 'stockgradenm', headerText: t('lbl.STOCKGRADE'), width: 65, dataType: 'code' }, // 재고등급명
		{ dataField: 'lottable01', headerText: t('lbl.LOTTABLE01'), dataType: 'code', width: 65 }, // 기준일(소비,제조)
		{ dataField: 'durationTerm', headerText: t('lbl.DURATION_TERM'), dataType: 'code', width: 65 }, // 유통기한
		{
			headerText: t('lbl.SERIALINFO'), // 시리얼정보
			children: [
				{ dataField: 'serialno', headerText: t('lbl.SERIALNO'), width: 65, dataType: 'code' }, // 시리얼번호
			],
		},
		{ dataField: 'instructionYn', headerText: t('lbl.IFFLAG'), dataType: 'code', editable: false, width: 80 }, // 지시여부
		{ dataField: 'mobileAddYn', headerText: t('모바일등록여부'), dataType: 'code', editable: false, width: 80 }, // 모바일등록여부
		{ dataField: 'commityn', headerText: t('lbl.PROCESS_RESULT'), width: 65, dataType: 'code' }, // 처리결과

		/*START.hidden 컬럼*/
		{ dataField: 'status', editable: false, visible: false }, // 상태
		{ dataField: 'lottype', editable: false, visible: false }, // 실사구분(0:소비기한,1:재고조사)
		{ dataField: 'stockgrade', headerText: t('lbl.STOCKGRADE'), width: 65, visible: false }, // 재고등급
		{ dataField: 'area', editable: false, visible: false }, // area
		{ dataField: 'lot', editable: false, visible: false }, // lot
		/*END.hidden 컬럼*/
	];

	return columns;
};

/**
 * 공통 FooterLayout 생성 함수
 * @param type
 * @param tabIndex
 * @returns {Array} - FooterLayout 배열
 */
export const getFooterLayout = (tabIndex: number): Array<any> => [
	// 주요 수량/금액 컬럼들
	{ dataField: 'totaldiffqty', positionField: 'totaldiffqty', operation: 'SUM', formatString: '#,##0' }, // 최종차이수량 합계
	{ dataField: 'totaldiffamt', positionField: 'totaldiffamt', operation: 'SUM', formatString: '#,##0' }, // 최종차이금액 합계

	// 1차~10차 수량 합계
	{ dataField: 'priority01', positionField: 'priority01', operation: 'SUM', formatString: '#,##0' }, // 1차 수량 합계
	{ dataField: 'diffqty01', positionField: 'diffqty01', operation: 'SUM', formatString: '#,##0' }, // 1차 차이수량 합계
	{ dataField: 'priority02', positionField: 'priority02', operation: 'SUM', formatString: '#,##0' }, // 2차 수량 합계
	{ dataField: 'diffqty02', positionField: 'diffqty02', operation: 'SUM', formatString: '#,##0' }, // 2차 차이수량 합계
	{ dataField: 'priority03', positionField: 'priority03', operation: 'SUM', formatString: '#,##0' }, // 3차 수량 합계
	{ dataField: 'diffqty03', positionField: 'diffqty03', operation: 'SUM', formatString: '#,##0' }, // 3차 차이수량 합계
	{ dataField: 'priority04', positionField: 'priority04', operation: 'SUM', formatString: '#,##0' }, // 4차 수량 합계
	{ dataField: 'diffqty04', positionField: 'diffqty04', operation: 'SUM', formatString: '#,##0' }, // 4차 차이수량 합계
	{ dataField: 'priority05', positionField: 'priority05', operation: 'SUM', formatString: '#,##0' }, // 5차 수량 합계
	{ dataField: 'diffqty05', positionField: 'diffqty05', operation: 'SUM', formatString: '#,##0' }, // 5차 차이수량 합계
	{ dataField: 'priority06', positionField: 'priority06', operation: 'SUM', formatString: '#,##0' }, // 6차 수량 합계
	{ dataField: 'diffqty06', positionField: 'diffqty06', operation: 'SUM', formatString: '#,##0' }, // 6차 차이수량 합계
	{ dataField: 'priority07', positionField: 'priority07', operation: 'SUM', formatString: '#,##0' }, // 7차 수량 합계
	{ dataField: 'diffqty07', positionField: 'diffqty07', operation: 'SUM', formatString: '#,##0' }, // 7차 차이수량 합계
	{ dataField: 'priority08', positionField: 'priority08', operation: 'SUM', formatString: '#,##0' }, // 8차 수량 합계
	{ dataField: 'diffqty08', positionField: 'diffqty08', operation: 'SUM', formatString: '#,##0' }, // 8차 차이수량 합계
	{ dataField: 'priority09', positionField: 'priority09', operation: 'SUM', formatString: '#,##0' }, // 9차 수량 합계
	{ dataField: 'diffqty09', positionField: 'diffqty09', operation: 'SUM', formatString: '#,##0' }, // 9차 차이수량 합계
	{ dataField: 'priority10', positionField: 'priority10', operation: 'SUM', formatString: '#,##0' }, // 10차 수량 합계
	{ dataField: 'diffqty10', positionField: 'diffqty10', operation: 'SUM', formatString: '#,##0' }, // 10차 차이수량 합계

	// 기존 주요 수량 컬럼들
	{ dataField: 'stockqty', positionField: 'stockqty', operation: 'SUM', formatString: '#,##0' }, // 재고수량 합계
	{ dataField: 'inquiryqty', positionField: 'inquiryqty', operation: 'SUM', formatString: '#,##0' }, // 조사수량 합계
	{ dataField: 'diffqty', positionField: 'diffqty', operation: 'SUM', formatString: '#,##0' }, // 차이수량 합계
];

/**
 * 저장 처리 함수 - 재지시
 * @param props
 * @param {any} gridRef - 그리드 참조 객체
 * @param {Function} t - 다국어 번역 함수
 * @param {any} form - 폼 객체
 * @param {number} activeKeyMaster - 활성 키 마스터
 * @param {(params: any) => void} setLoopTrParams - 루프 트랜잭션 파라미터 설정 함수
 * @param {any} refLoopModal - 루프 모달 참조 객체
 * @returns {Promise<void>}
 */
export const saveMasterListImp = async (
	props: any,
	gridRef: any,
	t: any,
	form: any,
	activeKeyMaster: number,
	setLoopTrParams: (params: any) => void,
	refLoopModal: any,
): Promise<void> => {
	const checkedRows = gridRef.getCheckedRowItems();

	// 선택된 행이 없으면 경고 메시지 표시
	if (checkedRows.length < 1) {
		showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
		return;
	}

	// validation
	if (checkedRows.length > 0 && !gridRef.validateRequiredGridData()) {
		return;
	}

	// 저장하시겠습니까?
	showConfirm(null, t('msg.confirmSave'), async () => {
		// 중복되지 않는 재고조사별칭과 조사번호 목록 생성
		const uniqueInquiryMap = new Map(checkedRows.map((row: any) => [row.item.inquiryName, row.item.inquiryno]));

		const uniqueInquiryNames = Array.from(uniqueInquiryMap.keys());
		const uniqueInquiryNos = Array.from(uniqueInquiryMap.values());

		// 별칭별 seq 채번
		const seqResponse = await apiGetSequenceNumber({
			...form.getFieldsValue(),
			inquiryNameNew: uniqueInquiryNames.join(','),
			inquirynoNew: uniqueInquiryNos.join(','),
		});

		const requestParams = {
			dccode: checkedRows[0].item.dccode,
			lottype: checkedRows[0].item.lottype,
		};

		//const { data } = await apiPostInquiryName(requestParams);

		// 각 체크된 행에 priority 세팅 (inquiryName이 같을 때)
		checkedRows.forEach((row: any) => {
			if (seqResponse.data && row.item.inquiryName) {
				// seqResponse.data에서 해당 inquiryName에 맞는 priority 찾기
				const matchingRow = seqResponse.data.find((seq: any) => seq.inquiryName === row.item.inquiryName);

				if (matchingRow) {
					// priority가 10을 넘으면 경고 메시지 표시
					if (matchingRow.priority > 10) {
						showAlert(null, `조사차수는 최대 10차까지만 가능합니다. 현재 차수: ${matchingRow.priority}차`);
						return;
					}

					// console.log('matchingRow.priority;:', matchingRow.priority);
					// console.log('matchingRow.inquirynoNew;:', matchingRow.inquiryno);
					// console.log('matchingRow.inquiryNameNew;:', matchingRow.inquiryName);

					row.item.inquirynoNew = matchingRow.inquiryno; // 조사번호
					row.item.inquiryNameNew = matchingRow.inquiryName; // 조사별칭
					row.item.priorityNew = matchingRow.priority; // SEQ
				}
			}
		});

		//console.log('checkedRows:', checkedRows);

		const tmpDccode = checkedRows[0].item.dccode;
		const tmpOrganize = checkedRows[0].item.organize;

		const params = {
			fixdccode: tmpDccode,
			fixdorganize: tmpOrganize,
			apiUrl: '/api/st/stInquiryResult/v1.0/saveMasterList',
			avc_COMMAND: 'NEW_RECREATE',
			saveList: checkedRows.map((item: any) => ({
				...item.item,
			})),
			//
			//dataKey: 'saveList',
			reqFlag: commUtil.nvl(activeKeyMaster, 1), // 요청구분(1:Location, 2:상품별)
		};

		const res = await apiPostSaveMasterList(params);
		const data2 = res.data;
		if (res.error == undefined && data2?.errorCode == undefined && !(res?.statusCode < 0)) {
			showAlert('', '저장되었습니다');
			props.search();
		}

		//setLoopTrParams(params);
		//refLoopModal.current.handlerOpen();
	});
};

/**
 * 예약재고조사(일일) 처리 함수
 * @param props
 * @param {any} gridRef - 그리드 참조 객체
 * @param {Function} t - 다국어 번역 함수
 * @param {any} form - 폼 객체
 * @param {number} activeKeyMaster - 활성 키 마스터
 * @param {(params: any) => void} setLoopTrParams - 루프 트랜잭션 파라미터 설정 함수
 * @param {any} refLoopModal - 루프 모달 참조 객체
 * @returns {Promise<void>}
 */
export const saveReserveMasterListImp = async (
	props: any,
	gridRef: any,
	t: any,
	form: any,
	activeKeyMaster: number,
	setLoopTrParams: (params: any) => void,
	refLoopModal: any,
): Promise<void> => {
	const checkedRows = gridRef.getCheckedRowItems();

	// 선택된 행이 없으면 경고 메시지 표시
	if (checkedRows.length < 1) {
		showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
		return;
	}

	// validation
	if (checkedRows.length > 0 && !gridRef.validateRequiredGridData()) {
		return;
	}

	// {{0}} 를/을 처리하시겠습니까?
	showConfirm(null, t('msg.MSG_COM_CFM_020', ['익일 예약재고']), () => {
		const params = {
			apiUrl: '/api/st/stInquiryResult/v1.0/saveReserveMasterList',
			avc_COMMAND: 'CREATION_NEXT',
			saveDataList: checkedRows.map((item: any) => ({
				...item.item,
			})),
			//
			dataKey: 'saveList',
			reqFlag: commUtil.nvl(activeKeyMaster, 1), // 요청구분(1:Location, 2:상품별)
		};

		setLoopTrParams(params);
		refLoopModal.current.handlerOpen();

		// setLoopTrParams 미사용 시 아래와 같이 api 호출
		// apiPostSaveReserveMasterList(params).then(res => {
		// 	if (res.statusCode > -1) {
		// 		showAlert(null, t('msg.save1')); // 저장되었습니다
		// 		props.search();
		// 	}
		// });
	});
};

/**
 * 종료 처리 함수
 * @param props
 * @param {any} gridRef - 그리드 참조 객체
 * @param {Function} t - 다국어 번역 함수
 * @param {any} form - 폼 객체
 * @param {number} activeKeyMaster - 활성 키 마스터
 * @param {(params: any) => void} setLoopTrParams - 루프 트랜잭션 파라미터 설정 함수
 * @param {any} refLoopModal - 루프 모달 참조 객체
 * @returns {Promise<void>}
 */
export const saveCloseMasterListImp = async (
	props: any,
	gridRef: any,
	t: any,
	form: any,
	activeKeyMaster: number,
): Promise<void> => {
	const checkedRows = gridRef.getCheckedRowItems();

	// 선택된 행이 없으면 경고 메시지 표시
	if (checkedRows.length < 1) {
		showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
		return;
	}

	// validation
	if (checkedRows.length > 0 && !gridRef.validateRequiredGridData()) {
		return;
	}

	// {{0}} 를/을 처리하시겠습니까?
	showConfirm(null, t('msg.MSG_COM_CFM_020', ['재고 종료']), () => {
		const params = {
			saveList: checkedRows.map((item: any) => ({
				...item.item,
				rowStatus: 'U', // 저장 시 변경됨 상태로 전송
			})),
			//
			reqFlag: commUtil.nvl(activeKeyMaster, 1), // 요청구분(1:Location, 2:상품별)
		};

		apiPostSaveCloseMasterList(params).then(res => {
			if (res.statusCode > -1) {
				showAlert(null, t('msg.save1')); // 저장되었습니다
				props.search();
			}
		});
	});
};
