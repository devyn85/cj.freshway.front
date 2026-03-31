/*
 ############################################################################
 # FiledataField	: OmAutoOrderSetupTgsaSearch.tsx
 # Description		: 주문 > 주문등록 > 당일광역보충발주관리
 # Author			: LeeJeongCheol
 # Since			: 26.03.06
 ############################################################################
*/
// component
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';

// CSS

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// API Call Function

interface OmAutoOrderSetupTgsaSearchProps {
	form?: any;
}

const OmAutoOrderSetupTgsaSearch = (props: OmAutoOrderSetupTgsaSearchProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const { form } = props;
	const { t } = useTranslation();

	const globalVariable = useAppSelector(state => state.global.globalVariable);
	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	useEffect(() => {
		if (globalVariable?.gDccode) {
			form.setFieldValue('frDccode', [globalVariable.gDccode]);
		}
	}, [globalVariable?.gDccode]);
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* <li>
				<CmGMultiDccodeSelectBox
					name="frDccode"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={t('lbl.FROM_DCCODE')} // 공급센터
				/>
			</li> */}
			<li>
				<CmGMultiDccodeSelectBox
					name="toDccode"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={t('lbl.TO_DCCODE')} // 공급받는센터
				/>
			</li>
			<li>
				<InputText name="purchaseTxt" label={'발주코드/명'} placeholder={'발주코드/명을 입력해주세요'} allowClear />
			</li>
			<li>
				<CmSkuSearch
					label={t('lbl.SKU')} // 상품코드
					form={form}
					name="skuName"
					code="sku"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<SelectBox //속성
					name="delYn"
					label={t('lbl.DEL_YN')}
					span={24}
					options={getCommonCodeList('DEL_YN', t('lbl.ALL'), '').filter(item => ['Y', 'N', ''].includes(item.comCd))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
};

export default OmAutoOrderSetupTgsaSearch;
