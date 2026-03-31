// Component
import CmCarPopSearch from '@/components/cm/popup/CmCarPopSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';
import DistrictSearch from '@/components/ms/popup/MsDeliveryDistrictSearch';
//Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface MsDistrictSearchProps {
	form: any;
	search: any;
	setSelectDcCode: any;
}

const MsDistrictSearch = ({ form, search, setSelectDcCode }: MsDistrictSearchProps) => {
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

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					// mode="multiple"
					label={'물류센터'}
					onChange={(event: any) => {
						setSelectDcCode(event);
					}}
				/>
			</li>
			<li>
				{/* <InputText
					name="districtCode"
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.LBL_DELIVERYGROUP')])}
					label={t('lbl.LBL_DELIVERYGROUP')}
				/> */}
				<CmCarPopSearch form={form} name="popName" code="districtCode" selectionMode="multipleRows" />
			</li>
			<li>
				{/* <InputText
					name="workPopNo"
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.DISTRICT')])}
					label={t('lbl.DISTRICT')}
				/> */}
				<DistrictSearch
					form={form}
					name="dlvdistrictId" // 표시용 (새 필드명)
					code="workPopNo" // 실제 검색 파라미터로 쓸 필드
					selectionMode="multipleRows"
					customDccode={form.getFieldValue('dcCode')}
				/>
			</li>
			<li>
				<SelectBox
					name="delYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('DEL_YN', '--- 선택 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.CONTROLTYPE')}
				/>
			</li>
		</>
	);
};

export default MsDistrictSearch;
