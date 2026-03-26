/*
 ############################################################################
 # FiledataField    : KpKxCloseT08Search.tsx
 # Description      : 실적미수신 검색 필터 컴포넌트
 # Author           : sss
 # Since            : 25.07.04
 #
 # ■ 주요 기능
 # --------------------------------------------------
 # 1. KX 실적 미수신 데이터 검색 및 필터링
 #    - 배송일자 범위 검색
 #    - 물류센터별 다중 선택
 #    - 문서번호 및 SKU 검색
 #    - 전표 유형별 필터링 (광역출고, 광역입고, 입고, 출고, 반품, 조정)
 #
 # ■ 주요 함수
 # --------------------------------------------------
 # - buildDocTypeFilter()     : DOCTYPE 필터 생성 (체크박스 선택 상태 기반)
 # - handleCheckBoxChange()   : 체크박스 변경 이벤트 (부모 search() 호출)
 #
 # ■ 필터링 로직
 # --------------------------------------------------
 # - 체크박스 선택 상태에 따라 DOCTYPE 필터링 적용
 # - 체크되지 않은(체크 해제된) 항목에 대해 제외 필터 생성
 # - 모든 체크박스가 언체크되면 필터링하지 않음
 # - 부모 컴포넌트의 search() 함수 호출로 즉시 필터링 반영
 ############################################################################
*/
// lib
import { forwardRef, useCallback } from 'react';

// component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, InputText, Rangepicker } from '@/components/common/custom/form';

// store

// api

// util

// hook

// type

// asset

const KpKxCloseT08Search = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { search, gridData8, setGridData8Filtered, setTotalCnt8 } = props;
	const hasSearch = typeof props?.search === 'function';

	// Declare react Ref(2/4)

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * DOCTYPE 필터 생성
	 *
	 * 설명:
	 * 체크박스 선택 상태에 따라 제외할 DOCTYPE 필터를 생성합니다.
	 * 체크되지 않은(값이 '1'이 아닌) 항목에 대해서만 제외 필터를 추가합니다.
	 *
	 * 예시:
	 * - stoWdYn이 체크 해제('0') → doctype!='광역출고' 필터 추가
	 * - stoDpYn이 체크 해제('0') → doctype!='광역입고' 필터 추가
	 * - wdYn이 체크 해제('0') → doctype!='출고' 필터 추가
	 * - dpYn이 체크 해제('0') → doctype!='입고' 필터 추가
	 * - rtYn이 체크 해제('0') → doctype!='반품' 필터 추가
	 * - ajYn이 체크 해제('0') → doctype!='조정' 필터 추가
	 *
	 * 필터들은 && (AND)로 연결되어 모든 조건을 동시에 만족하는 데이터만 반환됩니다.
	 * @param {any} values 검색 폼 값 (체크박스 상태 포함)
	 * @returns {string} && 로 연결된 필터 문자열 (예: " doctype!='광역출고' && doctype!='입고' ")
	 */
	const buildDocTypeFilter = useCallback((values: any) => {
		let strFilter = '';
		const docTypeFilters = [];

		// 체크 해제된 항목에 대해 제외 필터 생성
		if (values?.stoWdYn !== '1') {
			docTypeFilters.push(" doctype!='광역출고' ");
		}
		if (values?.stoDpYn !== '1') {
			docTypeFilters.push(" doctype!='광역입고' ");
		}
		if (values?.wdYn !== '1') {
			docTypeFilters.push(" doctype!='출고' ");
		}
		if (values?.dpYn !== '1') {
			docTypeFilters.push(" doctype!='입고' ");
		}
		if (values?.rtYn !== '1') {
			docTypeFilters.push(" doctype!='반품' ");
		}
		if (values?.ajYn !== '1') {
			docTypeFilters.push(" doctype!='조정' ");
		}

		// 필터 조건들을 AND로 연결
		strFilter = docTypeFilters.join(' && ');

		return strFilter;
	}, []);

	/**
	 * 체크박스 변경 이벤트
	 *
	 * 설명:
	 * 체크박스 상태가 변경되면 즉시 부모 컴포넌트의 search() 함수를 호출합니다.
	 * 이를 통해 실적미수신 데이터를 다시 조회하고 체크박스 선택 상태에 따라
	 * 필터링이 자동으로 적용됩니다.
	 *
	 * setTimeout을 사용하는 이유:
	 * - onChange 이벤트 발생 후 폼 값이 실제로 업데이트되는 시간을 확보하기 위함
	 * - 폼 값 업데이트 이후에 search() 함수가 최신 값을 읽도록 보장
	 *작동 흐름:
	 * 1. 사용자가 체크박스 클릭
	 * 2. handleCheckBoxChange 호출
	 * 3. setTimeout으로 약간의 지연 후 search() 호출
	 * 4. 부모에서 searchMaterList8() 실행
	 * 5. 필터링된 데이터가 그리드에 표시
	 */
	const handleCheckBoxChange = () => {
		const formdata = props.form.getFieldsValue();

		let data = [...gridData8];
		// 체크된 항목이 하나라도 있는지 확인
		const hasAnyChecked =
			formdata?.stoWdYn === '1' ||
			formdata?.stoDpYn === '1' ||
			formdata?.wdYn === '1' ||
			formdata?.dpYn === '1' ||
			formdata?.rtYn === '1' ||
			formdata?.ajYn === '1';

		// 체크된 항목이 있을 때만 필터링 적용
		if (hasAnyChecked) {
			const filters: string[] = [];
			if (formdata?.stoWdYn !== '1') {
				filters.push('광역출고');
			}
			if (formdata?.stoDpYn !== '1') {
				filters.push('광역입고');
			}
			if (formdata?.wdYn !== '1') {
				filters.push('출고');
			}
			if (formdata?.dpYn !== '1') {
				filters.push('입고');
			}
			if (formdata?.rtYn !== '1') {
				filters.push('반품');
			}
			if (formdata?.ajYn !== '1') {
				filters.push('조정');
			}

			// 제외된 DOCTYPE의 데이터 필터링
			data = data.filter((item: any) => !filters.includes(item.doctype));
		}

		setGridData8Filtered(data);
		setTotalCnt8(data.length);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			<li ref={ref} data-has-search={hasSearch}>
				<Rangepicker
					label={t('lbl.DELIVERYDATE')}
					name="deliveryDateRange"
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 물류센터 */}
				<CmGMultiDccodeSelectBox
					name="fixdccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')} // 물류센터
					mode={'multiple'}
					onChange={async () => {
						//loadZone(); // 센터에 해당되는 zone 정보 조회
					}}
				/>
			</li>
			<li>
				<InputText name="docno" label={t('lbl.DOCNO')} onPressEnter={search} />
			</li>
			{/* <li style={{ gridColumn: '2 / span 2' }}> */}
			<li>
				<InputText name="sku" label={t('lbl.SKU')} onPressEnter={search} />
			</li>
			<li>
				<span>
					<CheckBox
						name="stoWdYn"
						label={t('전표구분')}
						trueValue={'1'}
						falseValue={'0'}
						onChange={handleCheckBoxChange}
					>
						{'광역출고'}
					</CheckBox>

					<CheckBox name="stoDpYn" trueValue={'1'} falseValue={'0'} onChange={handleCheckBoxChange}>
						{'광역입고'}
					</CheckBox>

					<CheckBox name="dpYn" trueValue={'1'} falseValue={'0'} onChange={handleCheckBoxChange}>
						{'입고'}
					</CheckBox>

					<CheckBox name="wdYn" trueValue={'1'} falseValue={'0'} onChange={handleCheckBoxChange}>
						{'출고'}
					</CheckBox>

					<CheckBox name="rtYn" trueValue={'1'} falseValue={'0'} onChange={handleCheckBoxChange}>
						{'반품'}
					</CheckBox>

					<CheckBox name="ajYn" trueValue={'1'} falseValue={'0'} onChange={handleCheckBoxChange}>
						{'조정'}
					</CheckBox>
				</span>
			</li>
		</>
	);
});

export default KpKxCloseT08Search;
