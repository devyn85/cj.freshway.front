import { InputText } from '@/components/common/custom/form';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

const SearchRolesMappingMenu = (props: any) => {
	const { search } = props;
	const { t } = useTranslation();
	return (
		<>
			<UiFilterArea>
				<UiFilterGroup>
					<li>
						<InputText
							name="authority"
							label={t('sysmgt.roles.group.authority')}
							placeholder={t('msg.placeholder2', [t('sysmgt.roles.group.authority')])}
							onPressEnter={search}
						/>
					</li>
					<li>
						<InputText
							name="roleNm"
							label={t('sysmgt.roles.group.roleNm')}
							placeholder={t('com.msg.placeholder1', [t('sysmgt.users.user.userNm')])}
							onPressEnter={search}
						/>
					</li>
				</UiFilterGroup>
			</UiFilterArea>
		</>
	);
};

export default SearchRolesMappingMenu;
