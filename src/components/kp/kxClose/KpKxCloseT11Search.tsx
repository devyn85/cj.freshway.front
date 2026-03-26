// lib

// component
import { CheckBox, Datepicker, InputText } from '@/components/common/custom/form';

// store

// api

// util

// hook

// type

// asset

const KpKxCloseT11Search = forwardRef((props: any, ref: any) => {
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
				<Datepicker label={t('lbl.EXECUTEDT')} name="deliveryDate" format="YYYY-MM" picker="month" />
			</li>
			<li>
				<InputText name="organize" label={'창고'} onPressEnter={search} />
			</li>
			<li>
				<InputText name="sku" label={'상품코드'} onPressEnter={search} />
			</li>
			<li>
				<CheckBox name="minusSubulYn" trueValue={'1'} falseValue={'0'}>
					{'(-)수불건 모니터링'}
				</CheckBox>
			</li>
		</>
	);
});

export default KpKxCloseT11Search;
