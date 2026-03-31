/*
 ############################################################################
 # FiledataField	: MsDeliveryDistrictGroupSearch.tsx
 # Description		: 기준정보 > 센터기준정보 > 배송권역 권역그룹 탭 검색 영역
 # Author			: insung son
 # Since			: 25.03.23
 ############################################################################
*/

// Lib
import { useTranslation } from 'react-i18next';

// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Datepicker, InputText } from '@/components/common/custom/form';

interface IMsDeliveryDistrictGroupSearchProps {
	form?: any;
}

const MsDeliveryDistrictGroupSearch = ({ form }: IMsDeliveryDistrictGroupSearchProps) => {
	const { t } = useTranslation();
	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="dccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="single"
					label={'물류센터'}
					required={true}
				/>
			</li>
			<li>
				{/* 조회일자 */}
				<Datepicker
					label={'적용일자'}
					name="effectiveDate"
					allowClear
					showNow={true}
					format="YYYY-MM-DD"
					required={true}
				/>
			</li>
			<li>
				<InputText
					name="searchKeyword"
					placeholder={'권역그룹을 입력해주세요'}
					// onPressEnter={search}
					label={'권역그룹'}
				/>
			</li>
			{/* <li>
				<GroupSearch 
					form={form}
					name='dlvgroupNm'
					code='searchKeyword'
					selectionMode="multipleRows"
				/>
			</li> */}
		</>
	);
};

export default MsDeliveryDistrictGroupSearch;
