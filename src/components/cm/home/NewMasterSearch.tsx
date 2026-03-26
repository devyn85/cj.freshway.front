import { useAppSelector } from '@/store/core/coreHook';

// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

interface NewMasterSearchProps {
	search?: any;
	form?: any;
}

const NewMasterSearch = ({ search, form }: NewMasterSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const globalVariable = useAppSelector(state => state.global.globalVariable); // 글로벌 변수
	const initialized = useAppSelector(state => state.menu.initialized); // fetchInitApi 초기값 설정 완료 여부

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		// 슬라이드 active 됐을때 "fixdccode" 변경
		if (initialized) {
			form.setFieldValue('fixdccode', globalVariable.gDccode);
		}
	}, [initialized]);

	return (
		<li>
			<CmGMultiDccodeSelectBox
				name={'fixdccode'}
				required
				fieldNames={{ label: 'dcname', value: 'dccode' }}
				label={t('lbl.DCCODE')}
				onChange={search}
			/>
		</li>
	);
};

export default NewMasterSearch;
