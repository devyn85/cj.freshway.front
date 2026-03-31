import { InputText } from '@/components/common/custom/form';
import { Row } from 'antd';

const SearchRoles = (props: any) => {
	const { t } = useTranslation();
	const { search } = props;
	return (
		<>
			<Row>
				<InputText
					name="authority"
					span={8}
					label={t('sysmgt.roles.group.authority')}
					placeholder={t('msg.placeholder2', [t('sysmgt.roles.group.authority')])}
					onPressEnter={search}
				/>
				<InputText
					name="roleNm"
					span={8}
					label={t('sysmgt.roles.group.roleNm')}
					placeholder={t('com.msg.placeholder1', [t('sysmgt.users.user.userNm')])}
					onPressEnter={search}
				/>
			</Row>
		</>
	);
};

export default SearchRoles;
