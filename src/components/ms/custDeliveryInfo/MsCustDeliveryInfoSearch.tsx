/*
 ############################################################################
 # FiledataField	: MsCustDeliveryInfoSearch.tsx
 # Description		: 기준정보 > 거래처기준정보 > 고객배송조건 
 # Author			: JeongHyeongCheol
 # Since			: 25.08.22
 ############################################################################
*/
// component
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// CSS

// store

// API Call Function

interface MsCustDeliveryInfoSearchProps {
	form?: any;
}

const MsCustDeliveryInfoSearch = (props: MsCustDeliveryInfoSearchProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const { form } = props;
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	/**
	 * 현재날짜를 셋팅한다.
	 */
	useEffect(() => {
		// 초기값 설정 (컴포넌트 마운트 시)
		// const initialStart = dayjs();
		// const initialEnd = dayjs();
		// setDates([initialStart, initialEnd]);
		// form.setFieldValue('procLogiDate', [initialStart, initialEnd]);
	}, []);

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="dlvDccode"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={t('lbl.DLV_DCCODE')}
				/>
			</li>
			<li>
				<CmCustSearch form={form} name="custname" code="custkey" selectionMode="multipleRows" />
			</li>
			<li>
				<SelectBox
					label={'OTD여부'}
					name="otdYn"
					options={getCommonCodeList('YN', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.FACE_TO_FACE_INSPECTION_YN ')}
					name="inspecttype"
					options={getCommonCodeList('YN', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={'레드존여부'}
					name="redzoneYn"
					options={getCommonCodeList('YN', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<CmCustSearch
					form={form}
					label={'실착지코드명'}
					name="truthcustname"
					code="truthcustkey"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<SelectBox
					label="배송정보적용요청여부"
					name="dlvInfoApplyYn"
					options={getCommonCodeList('YN', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				></SelectBox>
			</li>
			<li>
				<Rangepicker
					label="등록기간"
					name="procLogiDate"
					// defaultValue={dates} // 초기값 설정
					format="YYYY-MM-DD" // 화면에 표시될 형식
					allowClear
					showNow={false}
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<SelectBox
					label="실착지 미등록여부" // 실착지등록여부 -> 실착지 미등록여부
					name="truthcustkeyYn"
					options={getCommonCodeList('YN', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				></SelectBox>
			</li>
		</>
	);
};

export default MsCustDeliveryInfoSearch;
