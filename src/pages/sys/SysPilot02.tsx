/*
 ############################################################################
 # FiledataField	: Pilot02.tsx
 # Description		: ADMIN > 시스템운영 > 프로그램 Pilot02
 # Author			: 공두경
 # Since			: 25.05.08
 ############################################################################
*/
// Lib
import { Button, Divider, Form } from 'antd';

// Component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustBrandSearch from '@/components/cm/popup/CmCustBrandSearch';
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchForm } from '@/components/common/custom/form';

const Program = () => {
	const [form] = Form.useForm();
	const [isFlag, setIsFlag] = useState(true);
	const [mode, setMode] = useState('singleRow');

	const handleClick = () => {
		setIsFlag(!isFlag);
		isFlag ? setMode('singleRow') : setMode('multipleRows');
	};

	const onvaluesChange = (changedValues: any, allValues: any) => {};
	return (
		<>
			<MenuTitle />
			<div className="grid-column-2">
				<SearchForm form={form} onValuesChange={onvaluesChange}>
					<ButtonWrap data-props="message">
						<Button type="primary" onClick={handleClick}>
							{mode}
						</Button>
					</ButtonWrap>
					<Divider orientation="left">파일럿 2 팝업 테스트 차량 조회({mode})</Divider>
					<CmCarSearch
						form={form}
						name="carName1"
						code="carCode1"
						selectionMode={mode}
						returnValueFormat="name"
					></CmCarSearch>
					<Divider orientation="left">파일럿 2 팝업 테스트 본점 조회({mode})</Divider>
					<CmCustBrandSearch
						form={form}
						name="custBrandName1"
						code="custBrandCode1"
						selectionMode={mode}
						returnValueFormat="name"
					></CmCustBrandSearch>
				</SearchForm>
			</div>
		</>
	);
};
export default Program;
