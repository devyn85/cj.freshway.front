/*
 ############################################################################
 # FiledataField	: MsSkuChainSearch.tsx
 # Description		: 기준정보 > 상품기준정보 > PLT변환값 마스터
 # Author			: JeongHyeongCheol
 # Since			: 25.06.26
 ############################################################################
*/
// component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';

// CSS

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';

// lib

interface MsSkuChainSearchProps {
	form: any;
	dccode: string;
}
const MsSkuChainSearch = (props: MsSkuChainSearchProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { form, dccode } = props;
	const dcCode = Form.useWatch('dccode', form);
	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		if (dcCode) {
			form.setFieldsValue({ plantNm: null, plant: null });
		}
	}, [dcCode]);

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="dccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="multiple"
					label={t('lbl.DCCODE')} // 물류센터
					dataType="COMMON"
				/>
			</li>
			<li>
				<CmOrganizeSearch
					form={form}
					selectionMode="multipleRows"
					name="plantNm"
					code="plant"
					returnValueFormat="name"
					dccode={dccode}
					label={t('lbl.ORGANIZE')} //창고
					disabled={!(dccode === '1000' || dccode === '2170')}
					placeholder={'해당 칸은 2170과 1000센터 대상에 한정됩니다.'}
				/>
			</li>

			<li>
				<SelectBox
					name="storagetype"
					span={24}
					placeholder="선택해주세요"
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					mode="multiple"
					label={t('lbl.STORAGETYPE')} // 저장조건
					allowClear={true}
				/>
			</li>
			{/* <li>
				<CmPartnerSearch form={form} name="partnerName" code="custkey" selectionMode="multipleRows" />
			</li> */}
			<li>
				<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			<li>
				<SelectBox
					name="delYn"
					span={24}
					placeholder="선택해주세요"
					options={getCommonCodeList('DEL_YN', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.DEL_YN')}
					allowClear={true}
				/>
			</li>
			<li>
				<SelectBox
					name="baseuom"
					span={24}
					placeholder="선택해주세요"
					options={getCommonCodeList('UOM', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.UOM')} // 단위
					allowClear={true}
				/>
			</li>
			<li>
				<SelectBox
					name="pltYn"
					span={24}
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', t('lbl.ALL'), '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'PLT변환값입력여부'}
					allowClear={true}
				/>
			</li>
		</>
	);
};

export default MsSkuChainSearch;
