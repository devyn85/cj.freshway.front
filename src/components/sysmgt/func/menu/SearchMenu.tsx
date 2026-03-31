import { InputText } from '@/components/common/custom/form';
import { Row } from 'antd';
import React from 'react';

const SearchMenu = (props: any) => {
	const { search } = props;
	const { t } = useTranslation();

	return (
		<>
			<Row>
				<InputText
					name="menuId"
					span={8}
					label={t('sysmgt.menu.menuId')}
					placeholder={t('msg.placeholder2', [t('sysmgt.menu.menuId')])}
					onPressEnter={search}
				/>
				<InputText
					name="menuNm"
					span={8}
					label={t('sysmgt.menu.menuNm')}
					placeholder={t('com.msg.placeholder1', [t('sysmgt.menu.menuNm')])}
					onPressEnter={search}
				/>
			</Row>
		</>
	);
};

export default SearchMenu;
