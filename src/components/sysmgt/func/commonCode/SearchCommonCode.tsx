// Lib
import { Row } from 'antd';

// Utils

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Component
import { InputText, SelectBox } from '@/components/common/custom/form';

// API Call Function

const SearchCommonCode = (props: any) => {
	const { search } = props;
	const { t } = useTranslation();
	return (
		<>
			<Row>
				<InputText
					name="comGrpCd"
					span={8}
					label={t('sysmgt.commoncode.group.comGrpCd')}
					placeholder={t('msg.placeholder2', [t('sysmgt.commoncode.group.comGrpCd')])}
					onPressEnter={search}
				/>
				<InputText
					name="grpCdNm"
					span={8}
					label={t('sysmgt.commoncode.group.grpCdNm')}
					placeholder={t('com.msg.placeholder1', [t('sysmgt.commoncode.group.grpCdNm')])}
					onPressEnter={search}
				/>
				<SelectBox
					name="useYn"
					span={7}
					label={t('sysmgt.commoncode.useYn')}
					options={getCommonCodeList('USE_YN', t('com.btn.all'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</Row>
		</>
	);
};

export default SearchCommonCode;
