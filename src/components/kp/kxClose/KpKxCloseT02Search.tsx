// lib

// component
import { CheckBox, InputText, Rangepicker } from '@/components/common/custom/form';

// store

// api

// util

// hook

// type

// asset

const KpKxCloseT02Search = forwardRef((props: any, ref: any) => {
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
				<Rangepicker
					label={'기준일'}
					name="basedtRange"
					format={'YYYY-MM-DD'} // 화면에 표시될 형식
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<InputText name="docno" label={t('lbl.DOCNO')} onPressEnter={search} />
			</li>
			<li>
				<InputText name="slipno" label={'KX오더번호'} onPressEnter={search} />
			</li>
			<li>
				<CheckBox name="dmdEqYn" trueValue={'1'} falseValue={'0'}>
					{'실적차이건 필터'}
				</CheckBox>
			</li>
		</>
	);
});

export default KpKxCloseT02Search;
