import TmDispatchListByCarSearch from '@/components/tm/order/search/car/TmDispatchListByCarSearch';
import TmDispatchListByCarHistorySearch from '@/components/tm/order/search/carHistory/TmDispatchListByCarHistorySearch';
import TmDispatchListByCustomerSearch from '@/components/tm/order/search/customer/TmDispatchListByCustomerSearch';
import TmDispatchListByDistrictSearch from '@/components/tm/order/search/district/TmDispatchListByDistrictSearch';
import TmDispatchListByPopSearch from '@/components/tm/order/search/pop/TmDispatchListByPopSearch';
import { tabKeyUnion } from '@/pages/tm/TmDispatchList';

interface ITmDispatchListSearchSelector {
	activeTabKey: tabKeyUnion;
	form: any;
}

const TmDispatchListSearchSelector = ({ activeTabKey, form }: ITmDispatchListSearchSelector) => {
	return (
		<>
			{/* 차량별 검색 */}
			{activeTabKey === 'vehicle' && <TmDispatchListByCarSearch form={form} />}
			{/* 거래처별 검색 */}
			{activeTabKey === 'customer' && <TmDispatchListByCustomerSearch form={form} />}
			{/* POP별 검색 */}
			{activeTabKey === 'pop' && <TmDispatchListByPopSearch form={form} />}
			{/* 권역별 검색 */}
			{activeTabKey === 'area' && <TmDispatchListByDistrictSearch form={form} />}
			{/* 차량 변경내역 */}
			{activeTabKey === 'history' && <TmDispatchListByCarHistorySearch form={form} />}
		</>
	);
};

export default TmDispatchListSearchSelector;
