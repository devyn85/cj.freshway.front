/*
 ############################################################################
 # FiledataField	: MsCustUsageCarSearch.tsx
 # Description		: 기준정보 > 거래처기준정보 > 거래처별전용차량정보
 # Author			: JeongHyeongCheol
 # Since			: 25.08.29
 ############################################################################
*/

import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface MsCustUsageCarSearchProps {
	form?: any;
}

const MsCustUsageCarSearch = (props: MsCustUsageCarSearchProps) => {
	const { form } = props;

	return (
		<>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="dccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={'물류센터'}
				/>
			</li>
			{/* 고객코드/명 */}
			<li>
				<CmCustSearch form={form} name="custName" code="custkey" selectionMode="multipleRows" />
			</li>
			{/* 차량ID/명 */}
			<li>
				<CmCarSearch form={form} name="carName" code="carno" selectionMode="multipleRows" />
			</li>
			{/* 거래처차량유형 */}
			<li>
				<SelectBox
					name="custcartype"
					span={24}
					placeholder="선택해주세요"
					options={getCommonCodeList('CUST_CAR_TYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'거래처차량유형'}
				/>
			</li>
			{/* 적용여부 */}
			<li>
				<SelectBox
					name="applyYn"
					span={24}
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'적용여부'}
				/>
			</li>
		</>
	);
};

export default MsCustUsageCarSearch;
