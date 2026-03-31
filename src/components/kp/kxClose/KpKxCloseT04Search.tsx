// lib

// component
import { CheckBox, Datepicker } from '@/components/common/custom/form';

// store

// api

// util

// hook

// type

// asset

const KpKxCloseT04Search = forwardRef((props: any, ref: any) => {
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
				<Datepicker
					label={t('lbl.EXECUTEDT')}
					name="deliveryDate"
					format="YYYY-MM"
					picker="month" // type 지정: date | week | month | quarter | year | time
					// defaultValue={date} // 초기값 설정
					// format={dateFormat} // 화면에 표시될 형식
				/>
				{/* // 반품미수신건 필터 주석처리 추후 필요시 해제 */}
				<CheckBox name="ifSearchYn" trueValue={'1'} falseValue={'0'}>
					{'반품미수신건 필터'}
				</CheckBox>
			</li>
		</>
	);
});

export default KpKxCloseT04Search;
