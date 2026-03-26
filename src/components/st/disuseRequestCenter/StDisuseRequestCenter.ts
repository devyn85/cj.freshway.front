/*
 ############################################################################
 # FiledataField	: StDisuseRequestCenter.ts
 # Description		: 재고 > 재고현황 > 재고폐기요청/처리 - 공통 함수 및 상수 정의
 # Author			: sss
 # Since			: 25.12.04
 ############################################################################
*/

import { getCommonCodeList } from '@/store/core/comCodeStore';
import { showAlert } from '@/util/MessageUtil';

/**
 * 발생사유(대분류) 코드 목록
 */
export const reasoncode1List = [
	{ comCd: '1', cdNm: 'SCM내부' },
	{ comCd: '2', cdNm: '관리사유' },
];

/**
 * 발생사유(대분류) 코드 목록(선택적용)
 */
export const reasoncode1List2 = [
	{ comCd: '', cdNm: '선택' },
	{ comCd: '1', cdNm: 'SCM내부' },
	{ comCd: '2', cdNm: '관리사유' },
];

/**
 * 변경사유(세부) 코드 목록
 */
export const reasonmsg2List = [
	{ comCd: '1', cdNm: '고객반품:반품오더접수내역' },
	{ comCd: '2', cdNm: '재고전화:RTN이동 시 기재사유' },
];

/**
 * =====================================================================
 * 그리드 셀 편집 완료 이벤트 처리 함수
 * - 조정수량 변경 시: 양수 검증 + 총중량/폐기비용 자동 계산
 * - 귀책(최종) 변경 시: 기존 귀책과 비교하여 변경구분 자동 설정
 * - 귀속부서 코드 변경 시: 귀속부서명 클리어
 * @param {object} event - AUIGrid 셀 편집 이벤트 객체
 * @param {any} ref - 그리드 ref 객체
 * @param {Function} t - 번역 함수
 * @param {string} costperkg - KG당 폐기비용
 * =====================================================================
 */
export const handleCellEditEnd = (event: any, ref: any, t: any, costperkg: string) => {
	const { value, item, oldValue } = event;
	const gridRef = ref.gridRef.current;

	// 귀속부서 코드 편집 시 처리 - 부서명 클리어
	if (event.dataField === 'toRespDeptCd') {
		const updatedRow = {
			...item,
			toRespDeptCd: value,
			toRespDeptNm: '', // 부서명 클리어
			rowStatus: 'U',
		};
		gridRef.updateRowsById([updatedRow], true);
		return;
	} // 거래처 코드 편집 시 처리 - 거래처명 클리어
	else if (event.dataField === 'chgCustkey') {
		const updatedRow = {
			...item,
			chgCustkey: value,
			chgCustname: '', // 거래처명 클리어
			rowStatus: 'U',
		};
		gridRef.updateRowsById([updatedRow], true);
		return;
	}

	// 조정수량 컬럼 편집 시 처리
	if (event.dataField === 'adjustqty') {
		// 값이 실제로 변경되었는지 확인 (무의미한 업데이트 방지)
		const newValue = Number(value) || 0;
		const previousValue = Number(oldValue) || 0;

		// 값이 변경되지 않았다면 처리하지 않음
		if (newValue === previousValue) {
			return;
		}

		// 비즈니스 룰 검증: 조정수량은 반드시 양수여야 함
		if (newValue <= 0) {
			showAlert(null, t('MSG_COM_VAL_217', [t('lbl.ADJUSTQTY')]));
			// 유효하지 않은 값이므로 이전 값으로 되돌리기
			const revertRow = {
				...item,
				adjustqty: previousValue,
			};
			gridRef.updateRowsById([revertRow], true);
			return;
		}

		// 자동 계산 로직 1: 총중량 계산 (조정수량 × 평균중량)
		const adjustqty = newValue;
		const avgweight = Number(item.avgweight) || 0;
		const grossweight = adjustqty * avgweight;

		// 자동 계산 로직 2: 폐기비용 계산 (총중량 × KG당 폐기비용)
		const disusecost = grossweight * Number(costperkg); // 폐기비용(총중량*KG당비용)

		// 자동 계산 로직 3: 폐기금액 계산 (총중량 × 단가)
		const disuseprice = adjustqty * Number(item.purchaseprice); // 폐기비용(총중량*KG당비용)

		// updateRowsById로 한번에 업데이트 (변경사항 추적 활성화)
		const updatedRow = {
			...item,
			adjustqty,
			grossweight,
			disusecost,
			disuseprice,
			rowStatus: 'U', // 변경됨 상태 명시
		};
		gridRef.updateRowsById([updatedRow], true); // isMarkEdited: true로 변경
	} else if (event.dataField === 'logiRespDistbCd') {
		// 물류귀책배부 변경 시 귀책 자동 설정
		const logiRespDistbCd = value || '';

		// 선택된 코드의 코드명(cdNm) 찾기
		const centerRespCodes = getCommonCodeList('CENTER_RESP');
		const selectedCode = centerRespCodes.find(code => code.comCd === logiRespDistbCd);
		const codeName = selectedCode ? selectedCode.cdNm : '';

		// 코드명의 왼쪽 1자리가 'Y'이면 귀책을 물류(코드값:12)로 설정
		if (codeName.charAt(0) === 'Y') {
			const updatedRow = {
				...item,
				logiRespDistbCd: value,
				toRespPartyCd: '12', // 물류 코드값 직접 설정
				toRespDeptCd: item.assingedDept, // 귀속부서(기본2210 쿼리에 하드코딩)
				toRespDeptNm: item.assingedDeptname, // 귀속부서명
				rowStatus: 'U',
			};
			gridRef.updateRowsById([updatedRow], true);
		} else if (codeName.charAt(0) === 'N') {
			if (codeName.split('_')[1] === '상품') {
				const updatedRow = {
					...item,
					logiRespDistbCd: value,
					toRespPartyCd: '', // 물류 코드값 직접 설정
					toRespDeptCd: item.assingedDept, // 귀속부서(기본2210 쿼리에 하드코딩)
					toRespDeptNm: item.assingedDeptname, // 귀속부서명
					chgCustkey: item.rtCustkey, // 실거래처
					chgCustname: item.rtCustname, // 실거래처명
					rowStatus: 'U',
				};
				gridRef.updateRowsById([updatedRow], true);
			} else if (codeName.split('_')[1] === '영업') {
				const updatedRow = {
					...item,
					logiRespDistbCd: value,
					toRespPartyCd: '', // 물류 코드값 직접 설정
					toRespDeptCd: item.assingedDept, // 귀속부서(기본2210 쿼리에 하드코딩)
					toRespDeptNm: item.assingedDeptname, // 귀속부서명
					chgCustkey: item.rtCustkey, // 실거래처
					chgCustname: item.rtCustname, // 실거래처명
					rowStatus: 'U',
				};
				gridRef.updateRowsById([updatedRow], true);
			} else if (codeName.split('_')[1] === '기타') {
				const updatedRow = {
					...item,
					logiRespDistbCd: value,
					toRespPartyCd: '', // 물류 코드값 직접 설정
					toRespDeptCd: '', // 귀속부서는 공백으로 설정
					toRespDeptNm: '', // 부서명은 공백으로 설정
					chgCustkey: item.rtCustkey, // 실거래처
					chgCustname: item.rtCustname, // 실거래처명
					rowStatus: 'U',
				};
				gridRef.updateRowsById([updatedRow], true);
			}
		} else {
			// Y가 아닌 경우는 물류귀책배부 값만 업데이트
			const updatedRow = {
				...item,
				logiRespDistbCd: value,
				toRespPartyCd: '', // 귀책은 빈값으로 설정
				toRespDeptCd: '', // 귀속부서는 공백으로 설정
				toRespDeptNm: '', // 부서명은 공백으로 설정
				rowStatus: 'U',
			};
			gridRef.updateRowsById([updatedRow], true);
		}
	} else if (event.dataField === 'toRespPartyCd') {
		// 물류귀책배부 변경 시 귀책 자동 설정
		const toRespPartyCd = value || '';

		// 코드명의 왼쪽 1자리가 'Y'이면 귀책을 물류(코드값:12)로 설정
		if (toRespPartyCd === '12') {
			const updatedRow = {
				...item,
				toRespDeptCd: '2210', // 귀속부서는 2210으로 설정
				toRespDeptNm: 'SCM)SCM혁신담당', // 부서명은 SCM)SCM혁신담당으로 설정
				rowStatus: 'U',
			};
			gridRef.updateRowsById([updatedRow], true);
		}
	} else if (event.dataField === 'respPartyCd') {
		// 귀책 변경 시 변경구분 자동 업데이트
		const toRespPartyCd = item.toRespPartyCd || '';
		const respPartyCd = value || '';
		const changedYn = toRespPartyCd !== respPartyCd ? '변경' : '동일';

		// updateRowsById로 한번에 업데이트 (성능 개선)
		const updatedRow = {
			_$uid: event.item._$uid ?? event.serialkey, // 그리드 식별자
			toRespPartyCdOri: value,
			changedYn: changedYn,
			rowStatus: 'U',
		};
		gridRef.updateRowsById([updatedRow], true);
	}
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
export const bindGridEvents = (ref: any, t: any, costperkg: string) => {
	const gridRef = ref.gridRef.current;
	if (gridRef) {
		// 셀 편집 시작 이벤트 바인딩
		gridRef?.unbind('cellEditBegin'); // [필수]기존 이벤트 핸들러 제거 - 안하면 재 랜더링 시 이벤트가 중복으로 발행함
		gridRef?.bind('cellEditBegin', function (event: any) {
			// 등록(00) 상태인 경우에만 편집 허용
			if (commUtil.nvl(event?.item?.status, '00') == '00') {
				return true;
			} else {
				return false;
			}
		});

		// 셀 편집 완료 이벤트 바인딩
		gridRef.bind('cellEditEnd', (event: any) => {
			handleCellEditEnd(event, ref, t, costperkg);
		});
	}
};
