// lib

// component
import { InputText } from '@/components/common/custom/form';

// store

// api

// util

// hook

// type

// asset

const KpKxCloseT06Search = forwardRef((props: any, ref: any) => {
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
				<InputText name="ifId" label="IF_ID" required rules={[{ required: true }]} />
			</li>
		</>
	);
});

export default KpKxCloseT06Search;
