/*
############################################################################
# FiledataField	: CmDcCalendarManagerSearch.tsx
# Description		: 주문 > 주문목록 > 발주용휴일관리 검색 영역
# Author			: LeeJeongCheol
# Since			: 26.03.05
############################################################################
*/
// Component
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface CmDcCalendarManagerSearchProps {
	form: any;
	dccode?: string[];
}

const CmDcCalendarManagerSearch = ({ form, dccode }: CmDcCalendarManagerSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//console.log(('ALL', store.getState().comCode.codeList);

	// 휴일유무 옵션 (공통코드 'YN')
	const restYnOptions = [{ comCd: '', cdNm: '전체' }, ...getCommonCodeList('YN')];

	// 구분 옵션 (calendarId)
	const calendarIdOptions = [
		// { comCd: '', cdNm: '전체' },
		// { comCd: 'STD', cdNm: 'FW' },
		// { comCd: '1000', cdNm: '1000센터' },
		{ comCd: 'TGSA', cdNm: '당일광역보충발주' },
	];

	const comCodeList = getCommonCodeList('TGSA_DC_LIST').map((item: any) => ({
		dccode: item.comCd,
		dcNm: item.cdNm,
	}));

	return (
		<>
			<li>
				<Rangepicker name="dateRange" label="일자" format="YYYY-MM-DD" allowClear />
			</li>
			<li>
				<SelectBox
					label={t('lbl.DCNAME')} // 센터명
					name="dccode"
					options={comCodeList}
					fieldNames={{ label: 'dcNm', value: 'dccode' }}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.REST_YN')}
					name="restYn"
					options={restYnOptions}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<InputText label={t('lbl.REST_DESC')} name="restDesc" placeholder="휴일내용을 입력하세요" />
			</li>
			<li>
				<SelectBox
					name="calendarId"
					//					placeholder="선택해주세요"
					label={t('lbl.GUBUN_2')}
					options={calendarIdOptions}
					// 기본값은 공통
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default CmDcCalendarManagerSearch;
