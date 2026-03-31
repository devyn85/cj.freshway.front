// lib

// component
import { Datepicker, InputText } from '@/components/common/custom/form';

// store

// api

// util

// hook

// type

// asset

const KpKxCloseT05Search = forwardRef((props: any, ref: any) => {
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
				<Datepicker
					label={t('lbl.EXECUTEDT')}
					name="deliveryDate"
					format="YYYY-MM"
					picker="month" // type 지정: date | week | month | quarter | year | time
					// defaultValue={date} // 초기값 설정
					// format={dateFormat} // 화면에 표시될 형식
				/>
			</li>
			<li>
				<InputText name="dcCode" label={'물류센터'} required rules={[{ required: true, validateTrigger: 'none' }]} />
			</li>
			<li>
				<InputText
					name="sku"
					label={'상품코드'}
					onPressEnter={search}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<InputText name="organize" label={'창고'} onPressEnter={search} />
			</li>
		</>
	);
});

export default KpKxCloseT05Search;
