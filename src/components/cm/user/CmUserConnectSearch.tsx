// Utils

// Store

// Component
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import { InputText } from '@/components/common/custom/form';

// API Call Function

const CmUserConnectSearch = () => {
	return (
		<UiFilterArea>
			<UiFilterGroup>
				<li>
					<InputText name="사용자아이디" label="사용자아이디" />
				</li>
			</UiFilterGroup>
		</UiFilterArea>
	);
};

export default CmUserConnectSearch;
