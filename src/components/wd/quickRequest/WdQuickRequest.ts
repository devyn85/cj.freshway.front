/*
 ############################################################################
 # FiledataField	: WdQuickRequest.ts
 # Description		: 출고 > 출고작업 > 퀵주문접수(VOC)  - 공통 함수 및 상수 정의
 # Author			: sss
 # Since			: 25.12.10
 ############################################################################
*/
import { Modal } from 'antd';
import { useDaumPostcodePopup } from 'react-daum-postcode';

// API 호출 함수를 실제 경로로 교체하세요.

/**
 * Daum 우편번호 팝업 Hook
 */
export const useOpenDaumPostcode = () => {
	return useDaumPostcodePopup('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js');
};

/**
 * 편집 가능한 상태인지 확인하는 함수
 * @param {any} item - 그리드 행 아이템
 * @returns {boolean} - 편집 가능 여부
 */
export const isDisabled = (item: any): boolean => {
	//console.log('item?.status->', item?.status);
	if (commUtil.nvl(item?.status, '01') > '02') {
		// 상태(01:VOC퀵요청,02:센터접수,03:퀵주문등록,04:퀵주문취소등록,05:퀵주문처리완료,06:퀵주문취소완료))
		// 03:퀵주문등록 되었으면 이상은 편집 불가
		return true;
	}
	return false;
};

/**
 * =====================================================================
 * 그리드 셀 편집 완료 이벤트 처리 함수
 * @param {object} event - AUIGrid 셀 편집 이벤트 객체
 * @param {any} ref - 그리드 ref 객체
 * @param {Function} t - 번역 함수
 * @param {string} costperkg - KG당 폐기비용
 * =====================================================================
 */
export const handleCellEditEnd = (event: any, ref: any, t: any) => {
	// const { value, item, oldValue } = event;
	// const gridRef = ref.gridRef.current;
	// // 귀속부서 코드 편집 시 처리 - 부서명 클리어
	// if (event.dataField === 'gthNm') {
	// 	const updatedRow = {
	// 		...item,
	// 		respDeptCd: value,
	// 		respDeptNm: '', // 부서명 클리어
	// 		rowStatus: 'U',
	// 	};
	// 	gridRef.updateRowsById([updatedRow], true);
	// 	return;
	// }
};

/**
 * =====================================================================
 * 그리드 이벤트 바인딩 함수
 * - 셀 편집 완료 이벤트를 handleCellEditEnd 함수와 연결
 * - 엑셀 업로드 후에도 호출되어 이벤트 핸들링 유지
 * @param {any} ref - 그리드 ref 객체
 * @param {Function} t - 번역 함수
 * @param {string} costperkg - KG당 폐기비용
 * =====================================================================
 */
export const bindGridEvents = (ref: any, t: any) => {
	const gridRef = ref.gridRef1?.current;

	if (gridRef) {
		// 셀 편집 시작 이벤트 바인딩
		gridRef?.unbind('cellEditBegin'); // [필수]기존 이벤트 핸들러 제거 - 안하면 재 랜더링 시 이벤트가 중복으로 발행함
		gridRef?.bind('cellEditBegin', function (event: any) {
			// disable 편집 허용
			if (!isDisabled(event?.item)) {
				// disable 아니면 편집 허용
				return true;
			} else {
				return false;
			}
		});

		// 셀 편집 완료 이벤트 바인딩
		// gridRef.bind('cellEditEnd', (event: any) => {
		// 	handleCellEditEnd(event, ref, t);
		// });
	}
};

/**
 * 그리드 변경 여부를 체크하는 유틸 함수
 * @param gridRef - AUIGrid ref 객체
 * @returns boolean - 변경사항 있으면 true
 */
export function isGridChangedData(gridRef: any): boolean {
	if (!gridRef || typeof gridRef.getChangedData !== 'function') return false;
	const changedRows = gridRef.getChangedData({ validationYn: false });
	return Array.isArray(changedRows) && changedRows.length > 0;
}

/**
 * 저장 변경사항 있음 체크 함수
 * @param formRefChanged - form 변경 여부
 * @param gridRef - 그리드 참조
 * @param removedItems - 삭제된 행
 * @returns boolean - 변경사항 있음 여부
 */
export const isChanged01 = (formRefChanged: boolean, gridRef: any, removedItems: any[]): boolean => {
	// formRefChanged 또는 removedItems가 있으면 true
	if (formRefChanged || removedItems.length > 0) {
		return true;
	}

	// isGridChangedData로 변경사항 확인
	if (isGridChangedData(gridRef)) {
		return true;
	}

	// setGridData()로 추가된 new rows 확인 및 삭제된 행 확인 (rowStatus === 'I' or 'D')
	if (gridRef && typeof gridRef.getGridData === 'function') {
		const gridData = gridRef.getGridData();
		if (Array.isArray(gridData) && gridData.some((row: any) => row.rowStatus === 'I' || row.rowStatus === 'D')) {
			return true;
		}
	}

	return false;
};

/**
 * 최소한의 주소 패턴 체크 (한글, 영문, 숫자, 공백, -, ., , 만 허용)
 * @param address - 검사할 주소 문자열
 * @returns boolean - 유효하면 true, 아니면 false
 */
export function isValidAddressPattern(address: string): boolean {
	if (!address) return false;

	const normalized = address
		.replace(/[\r\n]/g, ' ')
		.trim()
		.replace(/\s+/g, ' ');

	// 길이 최소 체크 (너무 짧은 값 방지)
	if (normalized.length < 4 || normalized.length > 150) return false;

	// 거의 다 허용 (한글/영문/숫자 + 주소에서 쓰는 특수문자)
	if (!/^[가-힣a-zA-Z0-9\s\-.,()/#]+$/.test(normalized)) return false;

	// 최소 의미 있는 문자 (한글/영문/숫자 중 하나는 있어야 함)
	if (!/[가-힣a-zA-Z0-9]/.test(normalized)) return false;

	// 완전 이상한 값만 차단 (특수문자만 있는 경우)
	if (/^[\s\-.,()/#]+$/.test(normalized)) return false;

	return true;
}

/**
 * 그리드 행 데이터에서 컬럼 레이아웃에 정의된 dataField 필드만 추출하는 함수
 * @param row
 * @param columnLayout
 * @returns
 */
export const pickGridFields = (row: any, columnLayout: Array<{ dataField?: string }>): Record<string, any> => {
	if (!row || !Array.isArray(columnLayout)) return {};

	const fields = new Set<string>((columnLayout || []).map(col => col.dataField).filter(Boolean) as string[]);
	const out: Record<string, any> = {};

	Object.keys(row).forEach(k => {
		if (fields.has(k)) out[k] = row[k];
	});

	return out;
};

// 예약시간 옵션 목록 생성기 (00:00 ~ 23:30, 30분 간격)
export const buildReserveTimeOptions = () => {
	const list: { comCd: string; cdNm: string }[] = [];

	// 빈값 추가
	list.push({ comCd: '', cdNm: '' });

	for (let h = 0; h < 24; h++) {
		for (let m = 0; m < 60; m += 30) {
			const hh = String(h).padStart(2, '0');
			const mm = String(m).padStart(2, '0');
			list.push({ comCd: `${hh}:${mm}`, cdNm: `${hh}:${mm}` });
		}
	}

	return list;
};

/**
 * 그리드 리사이즈 함수
 * @param key - 탭 키 ('1' 또는 '2')
 * @param ref - 그리드 ref (gridRef1, gridRef2 포함)
 */
export const fnResize = (key: string, ref: any) => {
	if (key === '1') {
		ref.gridRef1?.current?.resize('100%', '100%');
	} else if (key === '2') {
		ref.gridRef2?.current?.resize('100%', '100%');
	}
};

/**
 * 라디오 값 변경 핸들러
 * @param event - 라디오 버튼 변경 이벤트
 * @param setValue - 상태 설정 함수
 * @param formRef - Form 참조
 */
export const handleRadioChange = (event: any, setValue: (value: string) => void, formRef: any) => {
	setValue(event.target.value);

	if (event.target.value === '2') {
		// 협력사 선택 시 센터 값을 빈 값으로 설정
		formRef?.setFieldValue('center', '');
	}
};

/**
 * 탭 클릭 이벤트 핸들러 - 저장 여부 확인 및 탭 이동
 * @param key - 이동할 탭 키
 * @param ref - 그리드 ref (gridRef1, gridRef2 포함)
 * @param formRefChanged - form 변경 여부
 * @param isChanged01Fn - 변경사항 체크 함수
 * @param showAlert - 알림 함수
 * @param setActiveKeyDetail - 활성 탭 설정 함수
 * @param formRef2 - form2 참조
 * @param searchDetailList - 상세 목록 조회 함수
 */
export const tabClickDetail1 = (
	key: string,
	ref: any,
	formRefChanged: boolean,
	isChanged01Fn: (formRefChanged: boolean, gridRef: any, removedItems: any[]) => boolean,
	showAlert: (title: any, content: string) => void,
	setActiveKeyDetail: (key: string) => void,
	formRef2: any,
	searchDetailList: () => void,
) => {
	const gridRef1 = ref.gridRef1?.current;
	const gridRef2 = ref.gridRef2?.current;

	const removedItems1 = gridRef1?.getRemovedItems?.() || [];
	const removedItems2 = gridRef2?.getRemovedItems?.() || [];

	const isModified1 = isChanged01Fn(formRefChanged, gridRef1, removedItems1);
	const isModified2 = isChanged01Fn(formRefChanged, gridRef2, removedItems2);

	const moveTab = () => {
		setActiveKeyDetail(key);
		formRef2?.setFieldValue('activeKey', key);
		searchDetailList();
		fnResize(key, ref);
	};

	// 도착지 탭으로 이동할 때만 집하지 조건 체크
	if (key === '2') {
		const gridData1 = gridRef1?.getGridData?.() || [];

		if (gridData1.length === 0) {
			showAlert(null, '우측 상단에 집하지 이동을 먼저 처리 후 도착지 탭을 클릭해주세요.');
			setActiveKeyDetail('1');
			formRef2?.setFieldValue('activeKey', '1');
			fnResize('1', ref);
			return;
		}

		if (isModified1) {
			showAlert(null, '집하지 정보를 먼저 저장하세요.');
			setActiveKeyDetail('1');
			formRef2?.setFieldValue('activeKey', '1');
			fnResize('1', ref);
			return;
		}

		moveTab();
		return;
	}

	// 집하지 탭으로 이동할 때는 도착지 탭 변경사항만 확인
	if (key === '1') {
		if (isModified2) {
			Modal.confirm({
				content: '저장되지 않은 변경사항이 있습니다. 이동하시겠습니까?',
				okText: '예',
				cancelText: '아니오',
				onOk() {
					moveTab();
				},
				onCancel() {
					// 취소 시 탭 이동 안 함
				},
			});
			return;
		}

		moveTab();
		return;
	}
};

/**
 * 선택적용 버튼 클릭 핸들러
 * @param ref - 그리드 ref (gridRef1 포함)
 * @param radioValue1 - 라디오 선택 값 ('1':센터, '2':주소)
 * @param formGridRef1 - Form 참조 (center, address1, address2)
 * @param centerList - 센터 목록
 * @param showAlert - 알림 함수
 */
export const handleSelectApply1 = async (
	ref: any,
	radioValue1: string,
	formGridRef1: any,
	centerList: any[],
	showAlert: (title: any, content: string) => void,
) => {
	const gridRef1 = ref.gridRef1?.current;
	const checkedItems = gridRef1?.getCheckedRowItems?.();

	// 선택된 행 체크
	if (!checkedItems || checkedItems.length < 1) {
		showAlert(null, '선택된 행이 없습니다.');
		return;
	}

	// 센터 또는 주소 검증(formGridRef1에서)
	const center = formGridRef1.getFieldValue('center');
	const address1 = formGridRef1.getFieldValue('address1');
	const address2 = formGridRef1.getFieldValue('address2');

	if (radioValue1 === '1' && !center) {
		showAlert(null, '센터를 선택해주세요.');
		return;
	}

	if (radioValue1 === '2' && !address1) {
		showAlert(null, '주소를 입력해주세요.');
		return;
	}

	if (radioValue1 === '2' && !address2) {
		showAlert(null, '상세주소를 입력해주세요.');
		return;
	}

	// 센터 정보 조회 (센터 선택 시)
	let centerInfo = null;

	if (radioValue1 === '1') {
		const centerObj = centerList.find((c: any) => c.comCd === center);

		if (centerObj) {
			centerInfo = {
				address1: centerObj?.address1 || '',
				address2: centerObj?.address2 || '',
				empname1: centerObj?.empname1 || '',
				empphone1: centerObj?.empphone1 || '',
				location: centerObj?.location || '',
			};
		} else {
			showAlert(null, '센터 정보를 조회할 수 없습니다.');
			return;
		}
	}

	const gthNm = radioValue1 === '1' ? centerList.find((c: any) => c.comCd === center)?.cdNm || '' : '';

	// START.성능 개선: cell단위 변경 대신 전체 데이터를 한번에 변경
	const allData = gridRef1?.getGridData?.() || [];

	// setGridData() 호출 시 체크가 해제되므로, 이전에 체크된 행들의 ID를 저장해 둡니다.
	const rowIdField = gridRef1?.getProp?.('rowIdField') || '_$uid';
	const checkedRowIds = checkedItems.map((item: any) => item.item[rowIdField]);
	const checkedRowIndexes = new Set(checkedItems.map((item: any) => item.rowIndex));

	const newData = allData.map((row: any, index: number) => {
		if (checkedRowIndexes.has(index)) {
			return {
				...row,
				gthCd: radioValue1 === '1' ? center : '',
				gthNm,
				gthAddr: radioValue1 === '1' ? centerInfo?.address1 || '' : address1,
				gthAddrdtl: radioValue1 === '1' ? centerInfo?.address2 || '' : address2,
				gthEmpNm: radioValue1 === '1' ? centerInfo?.empname1 || '' : '',
				gthTel: radioValue1 === '1' ? centerInfo?.empphone1 || '' : '',
				location: radioValue1 === '1' ? centerInfo?.location || '' : '',
				rowStatus: 'I',
			};
		}

		return row;
	});

	// 변경된 행만 업데이트
	if (newData.length > 0) {
		gridRef1?.updateRowsById?.(newData, true);
	}

	// 이전에 체크된 행들을 다시 체크합니다.
	gridRef1?.setCheckedRowsByIds?.(checkedRowIds);
	// END.성능 개선: cell단위 변경 대신 전체 데이터를 한번에 변경
};

/**
 * 배송메모 팝업 열기
 * @param rmk - 배송메모 값
 * @param setParams - 팝업 params 설정 함수
 * @param deliveryMemoModalRef - 배송메모 모달 ref
 */
export const openDeliveryMemoModal = (rmk: string, setParams: (params: any) => void, deliveryMemoModalRef: any) => {
	setParams({ rmk });
	deliveryMemoModalRef.current.handlerOpen();
};
