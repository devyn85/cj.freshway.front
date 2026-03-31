// Component
import { CheckBox, InputText } from '@/components/common/custom/form';

const KpKxCloseT10Search = forwardRef((props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { search } = props;

	return (
		<>
			<li>
				<InputText
					name="fixdccode"
					label={'물류센터'}
					onPressEnter={search}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<InputText name="organize" label={'창고'} onPressEnter={search} />
			</li>
			<li>
				<InputText name="sku" label={'상품코드'} onPressEnter={search} />
			</li>
			<li>
				<CheckBox name="stockidChgYn">{'바코드변경건'}</CheckBox>
			</li>
		</>
	);
});

export default KpKxCloseT10Search;
