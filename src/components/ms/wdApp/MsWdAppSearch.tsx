/*
 ############################################################################
 # FiledataField	: MsWdAppSearch.tsx
 # Description		: 기준정보 > 물류센터 정보 > 결품대응 POP그룹 관리 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.10.24
 ############################################################################
*/

// Components
import { InputText, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { useSelector } from 'react-redux';

// Store

// Libs

// Utils

const MsWdAppSearch = ({ form }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// const rangeRef = useRef(null);

	// const [expanded, setExpanded] = useState(false);
	// const [showToggleBtn, setShowToggleBtn] = useState(false);
	// const groupRef = useRef<HTMLUListElement>(null);

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		form.setFieldValue('dccode', gDccode);
	}, []);

	return (
		<>
			{/* 물류센터 */}
			<li>
				<SelectBox
					label={t('lbl.DCCODE')}
					name="dccode"
					options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* POP그룹명 */}
			<li>
				<InputText
					label={t('lbl.POP_GROUP')}
					name="popGroup"
					placeholder={t('msg.placeholder1', [t('lbl.POP_GROUP')])}
				/>
			</li>
			{/* 저장유형 */}
			<li>
				<SelectBox
					label={t('lbl.SAVE_TYPE')}
					name="storagetype"
					options={getCommonCodeList('SKUGROUP', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 사용여부 */}
			<li>
				<SelectBox
					label={t('lbl.USE_YN')}
					name="useYn"
					options={[
						{ cdNm: t('lbl.ALL'), comCd: '' },
						{ cdNm: 'Y', comCd: 'Y' },
						{ cdNm: 'N', comCd: 'N' },
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default MsWdAppSearch;
