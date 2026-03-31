/*
 ############################################################################
 # FiledataField	: MsDeliveryDistrictPopSearch.tsx
 # Description		: 기준정보 > 센터기준정보 > 배송권역 대표POP 탭 검색 영역
 # Author			: insung son
 # Since			: 25.03.23
 ############################################################################
*/

// Lib
import { useTranslation } from 'react-i18next';

// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Datepicker, InputText } from '@/components/common/custom/form';

interface IMsDeliveryDistrictPopSearchProps {
	form?: any;
}

const MsDeliveryDistrictPopSearch = ({ form }: IMsDeliveryDistrictPopSearchProps) => {
	const { t } = useTranslation();

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox mode={'single'} name={'dccode'} rules={[{ required: true }]} />
			</li>
			<li>
				<Datepicker
					label={'적용일자'}
					name="effectiveDate"
					allowClearshowNow={true}
					format="YYYY-MM-DD"
					required={true}
				/>
			</li>
			<li>
				<InputText name="searchKeyword" span={24} placeholder="대표 POP를 입력해주세요" label={'대표 POP'} />
			</li>
			{/* <li>
				<PopSearch 
					form={form}
					name='popName'
					code='searchKeyword'
					selectionMode="multipleRows"
				/>
			</li> */}
		</>
	);
};

export default MsDeliveryDistrictPopSearch;
