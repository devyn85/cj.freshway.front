/*
 ############################################################################
 # FiledataField	: MsDeliveryDistrictSearchSelector.tsx
 # Description		: 기준정보 > 센터기준정보 > 배송권역 탭별 검색 조건 셀렉터
 # Author			: insung son
 # Since			: 25.03.23
 ############################################################################
*/

// Component
import MsDeliveryDistrictSearch from '@/components/ms/deliveryDistrict/search/district/MsDeliveryDistrictSearch';
import MsDeliveryDistrictGroupSearch from '@/components/ms/deliveryDistrict/search/districtGroup/MsDeliveryDistrictGroupSearch';
import MsDeliveryDistrictPopSearch from '@/components/ms/deliveryDistrict/search/pop/MsDeliveryDistrictPopSearch';

// Types
import { TTabKeyUnion } from '@/pages/ms/MsDeliveryDistrict';

interface IMsDeliveryDistrictSearchSelectorProps {
	activeTabKey: TTabKeyUnion;
	form: any;
}

const MsDeliveryDistrictSearchSelector = ({ activeTabKey, form }: IMsDeliveryDistrictSearchSelectorProps) => {
	return (
		<>
			{activeTabKey === 'district' && <MsDeliveryDistrictSearch form={form} />}
			{activeTabKey === 'districtGroup' && <MsDeliveryDistrictGroupSearch />}
			{activeTabKey === 'pop' && <MsDeliveryDistrictPopSearch />}
		</>
	);
};

export default MsDeliveryDistrictSearchSelector;
