// lib

// component
import { InputText } from '@/components/common/custom/form';

// store

// api

// util

// hook

// type

// asset

const KpKxCloseT03Search = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { search } = props;

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<InputText name="docno" label={t('lbl.DOCNO')} onPressEnter={search} />
			</li>
			<li>
				<InputText name="slipno" label={'KX' + t('lbl.ORDER_NO')} onPressEnter={search} />
			</li>
			<li>
				<InputText name="sourcekey" label={t('lbl.SOURCEKEY')} onPressEnter={search} />
			</li>
			<li>
				<InputText name="pokey" label={t('lbl.POKEY')} onPressEnter={search} />
			</li>
		</>
	);
});

export default KpKxCloseT03Search;
