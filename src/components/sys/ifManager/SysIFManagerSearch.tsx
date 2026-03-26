// Utils

// Store

// Component
import { CheckBox, InputText } from '@/components/common/custom/form';

// API Call Function

const SysIFManagerSearch = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	return (
		<>
			<li style={{ gridColumn: 'span 2' }} className=" flex-wrap">
				<InputText label={t('lbl.IF_ID')} name="ifId" placeholder="" />
				<CheckBox name="eaiMngChYn" trueValue={'1'} falseValue={'0'}>
					{t('lbl.EAI_OK')}
				</CheckBox>
			</li>
		</>
	);
});

export default SysIFManagerSearch;
