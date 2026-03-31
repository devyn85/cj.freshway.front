import { InputText } from '@/components/common/custom/form';
import { Row } from 'antd';

const SearchCntrPickingGroup = (props: any) => {
	const { search } = props;
	const { t } = useTranslation();

	return (
		<>
			<Row>
				<InputText name="batchgroup" label="배치그룹" placeholder="배치그룹을 입력해주세요" onPressEnter={search} />
				<InputText name="description" label="내역" placeholder="내역을 입력해주세요" onPressEnter={search} />
			</Row>
		</>
	);
};

export default SearchCntrPickingGroup;
