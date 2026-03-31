/*
 ############################################################################
 # FiledataField    : KpKxCloseT13Search.tsx
 # Description      : 재고비교
 # Author           : sss
 # Since            : 25.07.04
 ############################################################################
*/
// lib

// component
import { CheckBox, Datepicker } from '@/components/common/custom/form';

// store

// api

// util

// hook

// type

// asset

const KpKxCloseT13Search = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

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
			<li style={{ gridColumn: 'span 2' }} className=" flex-wrap">
				<Datepicker label={t('lbl.SEARCH_MONTH')} name="deliveryDate" format="YYYY-MM" picker="month" />
				<CheckBox name="diffYn" trueValue={'1'} falseValue={'0'}>
					{'수량차이분'}
				</CheckBox>
			</li>
		</>
	);
});

export default KpKxCloseT13Search;
