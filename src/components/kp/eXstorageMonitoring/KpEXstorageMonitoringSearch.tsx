/*
 ############################################################################
 # FiledataField	: KpEXstorageMonitoringSearch.tsx
 # Description		: 외부창고재고모니터링 검색영역
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.07.15
 ############################################################################
*/

// CSS

// Lib
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Util

// Type

// Component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
// API
import { apiGetgetSkuSpecForMsExDcRate } from '@/api/ms/apiMsExDcRate';
const KpEXstorageMonitoringSearch = forwardRef((props: any, ref) => {
	// =====================================================================
	//  01. 변수 선언부
	// =====================================================================
	const { search, form, searchRef } = props;
	const [expanded, setExpanded] = useState(false);
	const [skuL, setSkuL] = useState([]);
	const { t } = useTranslation();
	const user = useAppSelector(state => state.user.userInfo);

	// =====================================================================
	//  02. 함수
	// =====================================================================

	/**
	 * 상품 코드 대 중 소 세 세팅
	 * @param p_storerkey
	 * @param p_speccategory
	 * @param p_specclass
	 * @param r_dataset
	 */
	const searchSku = (p_storerkey: any, p_speccategory: any, p_specclass: any, r_dataset: any) => {
		const params = {
			storerkey: p_storerkey,
			specCategory: p_speccategory,
			specClass: p_specclass,
		};
		apiGetgetSkuSpecForMsExDcRate(params).then(res => {
			const firstRow = {
				specDescr: '선택',
				specCode: '',
			};
			res.data.unshift(firstRow);

			r_dataset(res.data);
		});
	};

	// =====================================================================
	//  03. 렌더링
	// =====================================================================

	useEffect(() => {
		const p_storerkey = user.defStorerkey;

		searchSku(p_storerkey, 'SKUGROUP', 'MC3', setSkuL);
	}, []);

	return (
		<>
			<li>
				<Rangepicker
					label={'기준일자'}
					name="slipdtRange"
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
				{/* <DatePicker
					label={'기준일자'}
					name="pvcDeliveryDt"
					placeholder={`시작일자를 입력해 주세요.`}
					required
					autoFocus
					// preserveInvalidOnBlur
					colon={false}
					allowClear
					showNow
					rules={[
						{
							required: true,
							validateTrigger: 'none',
						},
					]}
				/> */}
			</li>

			<li>
				<SelectBox //속성
					name="mapDiv"
					label={t('lbl.ATTRIBUTE')}
					span={24}
					options={getCommonCodeList('MAP_DIV', '--- 선택 ---', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<SelectBox //속성
					name="searchCategory"
					// label={t('lbl.ATTRIBUTE')}
					span={24}
					options={getCommonCodeList('SEARCHCATEGORY_EXDC', '--- 선택 ---', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					required
				/>
			</li>
			<li>
				<InputText name="searchValue" span={24} placeholder={t('lbl.SEARCH_PLACEHOLDER')} required />
			</li>
			<li>
				<CmPartnerSearch //협력사코드
					form={props.form}
					name="fromCustKey"
					code="fromCustKey"
					selectionMode="multipleRows"
					returnValueFormat="name"
					label={t('lbl.VENDOR')}
				/>
			</li>
			<li>
				<CmSkuSearch
					form={form}
					name="skuName"
					code="sku"
					label={t('lbl.SKU')}
					selectionMode="multipleRows" /*상품코드*/
				/>
			</li>
			<li>
				{' '}
				<SelectBox
					label={t('lbl.STATUS_DP')} //진행상태
					name="serialinfoCfmYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('SERIAL_CFM_STATUS', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				{' '}
				<CmOrganizeSearch
					form={form}
					selectionMode={'multipleRows'}
					label={'창고'} //공급센터
					name="organize"
					code="organize"
				/>
			</li>
			<li>
				<InputText
					name="stockId"
					span={24}
					placeholder={t('lbl.SEARCH_PLACEHOLDER')}
					label="바코드"
					// required
					// rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<SelectBox
					label={'계약유형'} //진행상태
					name="contractType"
					placeholder="선택해주세요"
					options={getCommonCodeList('CONTRACTTYPE_SN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<InputText label="B/L번호" name="blNo" span={24} placeholder={t('lbl.SEARCH_PLACEHOLDER')} />
			</li>
			<li>
				<InputText label="이력번호" name="serialNo" span={24} placeholder={t('lbl.SEARCH_PLACEHOLDER')} />
			</li>
			<li>
				<CmPartnerSearch //협력사코드
					form={props.form}
					name="contractCustKey"
					code="contractCustKey"
					selectionMode="multipleRows"
					returnValueFormat="name"
					label="계약업체"
				/>
			</li>
			<li>
				<SelectBox
					label={'구매유형'} //진행상태
					name="exdcOrderType"
					placeholder="선택해주세요"
					options={getCommonCodeList('EXDC_ORDERTYPE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={'가중량여부'} //진행상태
					name="tempYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('TMEP_WEIGHT_STATUS', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					label={'이체여부'} //이력여부
					name="moveYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('EXDC_MOVE', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				{' '}
				<SelectBox
					name="skul"
					label="상품 대분류"
					options={skuL}
					fieldNames={{ label: 'specDescr', value: 'specCode' }}
				/>
			</li>
		</>
	);
});

export default KpEXstorageMonitoringSearch;
