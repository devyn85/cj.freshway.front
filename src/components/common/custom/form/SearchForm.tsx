import Search from '@/assets/styled/Search/Search';
import { usePageLayoutVisible } from '@/hooks/usePageLayoutVisible';
import { Form } from 'antd';

interface SearchFromProps {
	form: any;
	initialValues?: object;
	children?: any;
	onValuesChange?: (changedValues: any, allValues: any | null) => void;
	isAlwaysVisible?: boolean;
}

const SearchForm = (props: SearchFromProps) => {
	const { form, children, initialValues, onValuesChange, isAlwaysVisible = false } = props;

	const {
		layout: { isSearchFormVisible },
	} = usePageLayoutVisible();

	return (
		<>
			<Search style={{ display: isAlwaysVisible ? 'block' : isSearchFormVisible ? 'block' : 'none' }}>
				<Form form={form} initialValues={initialValues} preserve={false} onValuesChange={onValuesChange}>
					{children}
				</Form>
			</Search>
		</>
	);
};

export default memo(SearchForm);
