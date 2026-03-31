import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import CmCostCenterSearch from '@/components/cm/popup/CmCostCenterSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';

// Components

// Store
interface SysPilot03Props {
	form: any;
}
const SysPilot03Search = (props: SysPilot03Props) => {
	const { form } = props;

	return (
		<>
			<UiFilterArea>
				<UiFilterGroup>
					<li>
						{/* 팝업 */}
						<CmSkuSearch form={form} name="skuName" code="skuCode" selectionMode="multipleRows" />
					</li>
					<li>
						{/* 팝업 */}
						<CmCostCenterSearch form={form} name="costCenterName" code="costCencterCode" selectionMode="multipleRows" />
					</li>
					<li>
						{/* 팝업 */}
						<CmCustSearch form={form} name="custName" code="custCode" selectionMode="multipleRows" />
					</li>
				</UiFilterGroup>
			</UiFilterArea>
		</>
	);
};

export default SysPilot03Search;
