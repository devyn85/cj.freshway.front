// Utils

// Store

// Component
import { CheckBox, InputText } from '@/components/common/custom/form';
import Datepicker from '@/components/common/custom/form/Datepicker';

// API Call Function

const SysExecuteLogSearch = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	return (
		<>
			<li>
				<Datepicker label={t('lbl.EXECUTEDT')} name="executeDt" />
			</li>
			<li>
				<InputText label={t('lbl.OBJECTNAME')} name="objectName" placeholder="" />
			</li>
			<li>
				<InputText label={t('lbl.COMMAND')} name="command" placeholder="" />
			</li>
			<li>
				<InputText label={t('lbl.WORKER')} name="worker" placeholder="" />
			</li>
			<li>
				<InputText label={t('lbl.SPID')} name="spid" placeholder="" />
			</li>
			<li>
				<InputText label={t('lbl.REQUESTMSG')} name="requestMsg" placeholder="" />
			</li>
			<li>
				<CheckBox label={t('lbl.ERROR')} name="error" trueValue={'1'} falseValue={'0'}>
					{t('lbl.ERROR')}
				</CheckBox>
			</li>
		</>
	);
});

export default SysExecuteLogSearch;
