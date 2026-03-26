// Component
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import { InputText } from '@/components/common/custom/form';

const CbCommunitySearch = () => {
	return (
		<UiFilterArea>
			<UiFilterGroup>
				<li>
					<InputText name="basecode" label="제목" />
				</li>
				<li>
					<InputText name="basedescr" label="내용" />
				</li>
			</UiFilterGroup>
		</UiFilterArea>
	);
};

export default CbCommunitySearch;
