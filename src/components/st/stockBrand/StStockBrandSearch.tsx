/*
 ############################################################################
 # FiledataField	: StStockBrandSearch.tsx
 # Description		: 재고조회
 # Author			: JeongHyeongCheol
 # Since			: 25.09.12
 ############################################################################
*/

import CmCustBrandSearch from '@/components/cm/popup/CmCustBrandSearch';
import { Rangepicker } from '@/components/common/custom/form';

const StStockBrandSearch = (props: any) => {
	const form = props.form;

	return (
		<>
			{/* 월선택 */}
			<li>
				<Rangepicker
					label="월 선택"
					name="yyyyMm"
					format="YYYY-MM"
					picker="month"
					placeholder={'월 선택'}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 본점코드 */}
			<li>
				<CmCustBrandSearch form={form} selectionMode="multipleRows" name="custname" code="custkey" label="본점코드" />
			</li>
		</>
	);
};

export default StStockBrandSearch;
