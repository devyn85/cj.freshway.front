// Lib
import { Row } from 'antd';

// Utils

// Store

// Component
import { InputText } from '@/components/common/custom/form';

// API Call Function

const SearchIpAllow = (props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search } = props;
	// 다국어
	const { t } = useTranslation();

	return (
		<>
			<Row>
				<InputText
					name="userId"
					span={8}
					label={t('sysmgt.ipallow.search.userId')}
					placeholder={t('msg.placeholder2', [t('sysmgt.ipallow.search.userId')])}
					onPressEnter={search}
				/>
				<InputText
					name="ipAddr"
					span={8}
					label={t('sysmgt.ipallow.search.ipAddr')}
					placeholder={t('com.msg.placeholder1', [t('sysmgt.ipallow.search.ipAddr')])}
					onPressEnter={search}
				/>
			</Row>
		</>
	);
};

export default SearchIpAllow;
