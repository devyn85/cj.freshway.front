/*
 ############################################################################
 # FiledataField	: StExdcManualIndicatorSearch.tsx
 # Description		: 외부비축재고속성변경 검색영역
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.06.25
 ############################################################################
*/

// CSS
// Lib
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Util

// Type

// Component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import { Datepicker } from '@/components/common/custom/form';

// Store
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Form } from 'antd';
// API

const StExdcManualIndicatorSearch = forwardRef((props: any, ref) => {
	// =====================================================================
	//  01. 변수 선언부
	// =====================================================================
	const { search, form, searchRef } = props;
	const [dcCodeList, setDcCodeList] = useState([]);
	const { t } = useTranslation();
	const dcCode = Form.useWatch('dcCode');
	// =====================================================================
	//  02. 함수
	// =====================================================================

	// =====================================================================
	//  03. 렌더링
	// =====================================================================
	// useEffect(() => {
	// 	// 초기값 설정 (컴포넌트 마운트 시)

	// 	const list = getCommonCodeList('SUPPLY_DC');
	// 	//console.log(
	// 		list.map(item => ({
	// 			...item,
	// 			display: item.comCd ? `[${item.comCd}] ${item.cdNm}` : `[] ${item.cdNm}`,
	// 		})),
	// 	);
	// 	const allOption = { comCd: '', cdNm: '전체', display: '전체' };

	// 	setDcCodeList([
	// 		allOption,
	// 		...list.map(item => ({
	// 			...item,
	// 			display: item.comCd && item.comCd !== 'STD' ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
	// 		})),
	// 	]);
	// }, []);
	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="single"
					label={'물류센터'}
					required
					disabled
				/>
			</li>

			<li>
				<Datepicker
					name="date"
					allowClear
					showNow={false}
					label={t('lbl.DOCDT_WD')}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
					picker="month"
					// dataformat={dateFormat}
				/>
			</li>
			<li>
				<CmOrganizeSearch
					form={form}
					name="organizeName"
					code="organize"
					selectionMode="multipleRow"
					returnValueFormat="name"
					label={t('창고')}
					dccode={dcCode}
				/>
			</li>
		</>
	);
});
export default StExdcManualIndicatorSearch;
