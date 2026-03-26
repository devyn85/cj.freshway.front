// Lib

// Utils
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// Store
import { getCommonCodeList, getCommonCodeListByData } from '@/store/core/comCodeStore';

// Component
import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import CmSkuSpecSearch from '@/components/cm/popup/CmSkuSpecSearch';
import { SelectBox } from '@/components/common/custom/form';

// API Call Function

const SysPilot20Search = (props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form } = props;
	const { t } = useTranslation();

	return (
		<>
			<UiFilterArea>
				<UiFilterGroup>
					<li>
						<label>운송사유형</label>
						<span>
							<SelectBox
								name="carriertype"
								span={24}
								placeholder="선택해주세요"
								options={getCommonCodeList('CARRIERTYPE', '--- 선택 ---')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</span>
						<label>권역</label>
						<span>
							<SelectBox
								name="area1"
								span={24}
								placeholder="선택해주세요"
								options={getCommonCodeListByData('T005S', null, null, null, null, '--- 선택 ---')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</span>
						<label>지역</label>
						<span>
							<SelectBox
								name="area2"
								span={24}
								placeholder="선택해주세요"
								options={getCommonCodeListByData('T005S', null, null, null, '41', '--- 선택 ---')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</span>
					</li>
					<li>
						<label>운송사</label>
						<span>
							<CmCarrierSearch
								form={form}
								selectionMode="singleRow"
								name="carrierName"
								code="carrierCode"
								returnValueFormat="name"
							/>
						</span>
					</li>
					<li>
						<label>상품분류</label>
						<span>
							<CmSkuSpecSearch
								form={form}
								selectionMode="singleRow"
								name="skuSpecName"
								code="skuSpecCode"
								returnValueFormat="name"
							/>
						</span>
					</li>
				</UiFilterGroup>
			</UiFilterArea>
		</>
	);
};

export default SysPilot20Search;
