import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// Components
import { SelectBox } from '@/components/common/custom/form';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

const SysPilot04Search = (props: any) => {
	const { search } = props;

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
					</li>
				</UiFilterGroup>
			</UiFilterArea>
		</>
	);
};

export default SysPilot04Search;
