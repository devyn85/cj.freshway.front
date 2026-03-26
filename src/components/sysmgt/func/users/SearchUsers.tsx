import { InputText } from '@/components/common/custom/form';
import { Row } from 'antd';

const SearchUsers = (props: any) => {
	const { search } = props;
	// 다국어
	const { t } = useTranslation();
	return (
		<div>
			<Row>
				<InputText
					name="userId"
					span={8}
					label={t('sysmgt.ipallow.search.userId')}
					placeholder={t('msg.placeholder2', [t('sysmgt.users.user.userId')])}
					onPressEnter={search}
				/>
				<InputText
					name="userNm"
					span={8}
					label={t('com.col.userNm')}
					placeholder={t('com.msg.placeholder1', [t('sysmgt.users.user.userNm')])}
					onPressEnter={search}
				/>
			</Row>
		</div>
	);
};

export default SearchUsers;
