/*
 ############################################################################
 # FiledataField	: CmDcXOrganizeSelectBox.tsx
 # Description		: 창고 SelectBox
 # Author			: sss
 # Since			: 25.05.13
 ############################################################################
*/
// Component

import SelectBox from '@/components/common/custom/form/SelectBox';

//Store
import { fetchMsOrganize, getMsOrganizeList } from '@/store/biz/msOrganize';

interface CmDcXOrganizeSelectBox {
	form: any;
	search: any;
}

const CmDcXOrganizeSelectBox = (props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		/*START.참고SelectBox 조회 */
		const fetchInitStore = async () => {
			await fetchMsOrganize();
		};
		// init store
		fetchInitStore();
		/*END.참고SelectBox 조회 */
	}, []);

	return (
		<li>
			{/* 창고 */}
			<SelectBox
				label={t('lbl.ORGANIZE')} // 창고
				required={props.required ? props.required : false}
				name="organize"
				options={getMsOrganizeList(props.dccode)}
				fieldNames={{ label: 'comNm', value: 'comCd' }}
				placeholder={t('lbl.SELECT')} // 선택
				defaultValue={''}
			/>
		</li>
	);
};

export default CmDcXOrganizeSelectBox;
