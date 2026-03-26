import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// Components
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCostCenterSearch from '@/components/cm/popup/CmCostCenterSearch';
import { SelectBox } from '@/components/common/custom/form';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

import { Form } from 'antd';

const SysPilot02Search = (props: any) => {
	const { search } = props;

	const [form] = Form.useForm();

	return (
		<>
			<UiFilterArea>
				<UiFilterGroup>
					<li>
						<label>시스템구분</label>
						<span>
							<SelectBox
								name="systemCl"
								placeholder="선택해주세요"
								options={getCommonCodeList('COUNTRY')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								onChange={search}
							/>
						</span>
						<label>차량검색</label>
						<span>
							<CmCarSearch
								form={form}
								name="carName"
								code="carCode"
								selectionMode="multipleRows"
								returnValueFormat="name"
							/>
						</span>
						<label>귀속부서</label>
						<span>
							<CmCostCenterSearch
								form={form}
								name="CostCenterName"
								code="CostCenterCode"
								selectionMode="singleRow"
								returnValueFormat="name"
							/>
						</span>
					</li>
				</UiFilterGroup>
			</UiFilterArea>
		</>
	);
};

export default SysPilot02Search;
