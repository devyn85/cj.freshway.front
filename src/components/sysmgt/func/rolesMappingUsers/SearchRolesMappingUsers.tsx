import { InputText, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Row } from 'antd';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

const SearchRolesMappingUsers = (props: any) => {
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
					<li>
						<InputText
							name="userNm"
							label={t('sysmgt.rolesmappingusers.search.userNm')}
							placeholder={t('msg.placeholder2', [t('sysmgt.users.user.userId')])}
							onPressEnter={search}
						/>
					</li>
					<li>
						<SelectBox
							name="include"
							label={t('sysmgt.rolesmappingusers.search.include')}
							options={getCommonCodeList('USE_YN', t('com.btn.all'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</UiFilterGroup>
			</UiFilterArea>
		</>
	);
};

export default SearchRolesMappingUsers;
