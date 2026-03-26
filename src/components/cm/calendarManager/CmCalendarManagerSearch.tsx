/*
############################################################################
# FiledataField	: CmCalendarManagerSearch.tsx
# Description		: 주문 > 주문목록 > 발주용휴일관리 검색 영역
# Author			: YeoSeungCheol
# Since			: 25.09.12
############################################################################
*/

import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface CmCalendarManagerSearchProps {
	form: any;
	dccode?: string[];
}

const CmCalendarManagerSearch = ({ form, dccode }: CmCalendarManagerSearchProps) => {
	// 다국어
	const { t } = useTranslation();

	// 휴일유무 옵션 (공통코드 'YN')
	const restYnOptions = [{ comCd: '', cdNm: '전체' }, ...getCommonCodeList('YN')];

	// 구분 옵션 (calendarId)
	const calendarIdOptions = [
		// { comCd: '', cdNm: '전체' },
		{ comCd: 'STD', cdNm: 'FW' },
		{ comCd: '1000', cdNm: '1000센터' },
	];

	return (
		<>
			{/* 일자 */}
			<li>
				<Rangepicker name="dateRange" label="일자" format="YYYY-MM-DD" allowClear />
			</li>
			{/* 구분 */}
			<li>
				<SelectBox
					name="calendarId"
					placeholder="선택해주세요"
					label={t('lbl.GUBUN_2')}
					options={calendarIdOptions}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 휴일유무 */}
			<li>
				<SelectBox
					label={t('lbl.REST_YN')}
					name="restYn"
					options={restYnOptions}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 휴일내용 */}
			<li>
				<InputText label={t('lbl.REST_DESC')} name="restDesc" placeholder="휴일내용을 입력하세요" />
			</li>
			{/* 물류센터 */}
			{/* <li>
				<CmGMultiDccodeSelectBox
					name="dccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="single"
					label={t('lbl.DCCODE')}
					customOptions={[{ dcname: '공통', dccode: 'STD' }]}
				/>
			</li> */}
		</>
	);
};

export default CmCalendarManagerSearch;
