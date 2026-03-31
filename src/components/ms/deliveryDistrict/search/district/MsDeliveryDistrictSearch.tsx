/*
 ############################################################################
 # FiledataField	: MsDeliveryDistrictSearch.tsx
 # Description		: 기준정보 > 센터기준정보 > 배송권역 권역 탭 검색 영역
 # Author			: insung son
 # Since			: 25.03.23
 ############################################################################
*/

// Lib
import { useTranslation } from 'react-i18next';

// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Datepicker } from '@/components/common/custom/form';
import GroupSearch from '@/components/ms/popup/MsDeliveryDistrictGroupSearch';
import PopSearch from '@/components/ms/popup/MsDeliveryDistrictPopSearch';
import DistrictSearch from '@/components/ms/popup/MsDeliveryDistrictSearch';

interface IMsDeliveryDistrictSearchProps {
	form: any;
}

const MsDeliveryDistrictSearch = ({ form }: IMsDeliveryDistrictSearchProps) => {
	const { t } = useTranslation();
	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					mode={'single'}
					name={'dccode'}
					rules={[{ required: true }]}
					onChange={(event: any) => {
						form.setFieldsValue({
							dlvdistrictId: '',
							dlvdistrictNm: '',
							searchDistrict: '',
							searchDistrictGroup: '',
							searchKeyword: '',
						});
					}}
				/>
			</li>
			<li>
				<Datepicker
					required={true}
					label={'적용일자'}
					name="effectiveDate"
					allowClear
					showNow={true}
					format="YYYY-MM-DD"
				/>
			</li>
			{/* <li>
				<InputText label={'대표POP'} name="searchKeyword" placeholder="대표POP를 입력하세요" />
			</li>
			<li>
				<InputText label={'권역그룹'} name="searchDistrictGroup" placeholder="권역그룹을 입력하세요" />
			</li>
			<li>
				<InputText label={'권역'} name="searchDistrict" placeholder="권역을 입력하세요" />
			</li> */}
			<li>
				<PopSearch form={form} name="popName" code="searchKeyword" selectionMode="multipleRows" />
			</li>
			<li>
				<GroupSearch form={form} name="dlvgroupNm" code="searchDistrictGroup" selectionMode="multipleRows" />
			</li>
			<li>
				<DistrictSearch
					form={form}
					name="dlvdistrictId" // 표시용 (새 필드명)
					code="searchDistrict" // 실제 검색 파라미터로 쓸 필드
					selectionMode="multipleRows"
				/>
			</li>
		</>
	);
};

export default MsDeliveryDistrictSearch;
