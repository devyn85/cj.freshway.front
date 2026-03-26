/*
 ############################################################################
 # FiledataField	: MsSkuDcSetSearch.tsx
 # Description		: 센터상품속성
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.05.23
 ############################################################################
*/

// CSS
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// Lib

// Utils

// Store

// Component
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';

// API

const MsSkuDcSetSearch = (props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// pros
	const { form } = props;

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			<UiFilterArea>
				<UiFilterGroup>
					<li>
						<CmGMultiDccodeSelectBox
							name="dccode"
							label={t('lbl.DCCODE')}
							span={24}
							placeholder="선택해주세요"
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					<li>
						<CmSkuSearch
							form={form}
							selectionMode="multipleRows"
							name="skuName"
							code="skuCode"
							returnValueFormat="name"
						/>
					</li>
				</UiFilterGroup>
			</UiFilterArea>
		</>
	);
};

export default MsSkuDcSetSearch;
