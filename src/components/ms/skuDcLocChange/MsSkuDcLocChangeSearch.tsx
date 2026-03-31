// Component
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputRange, SelectBox } from '@/components/common/custom/form';

//Store
import { getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface MsBlankLocSearchProps {
	form: any;
	search: any;
	zoneOptions: any;
	setZoneOptions: any;
}

const MsSkuDcLocChangeSearch = ({ form, search, zoneOptions, setZoneOptions }: MsBlankLocSearchProps) => {
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
	 *  03. react hook event
	 * =====================================================================
	 */
	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={'물류센터'}
					onChange={() => {
						setZoneOptions(getMsZoneList(form.getFieldValue('dcCode')));
						form.setFieldsValue({ zone: null, fromLoc: '', toLoc: '' });
					}}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CmSkuSearch form={form} label={t('lbl.LBL_SKU')} name="skuNm" code="sku" selectionMode="multipleRows" />
			</li>
			<li>
				<SelectBox
					name="delYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('DEL_YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'사용여부'}
				/>
			</li>
			<li>
				<SelectBox
					name="zone"
					options={[{ baseCode: null, baseDescr: '--- 선택 ---' }, ...zoneOptions]}
					fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
					label={'피킹존'}
				/>
			</li>
			<li>
				{/* 로케이션(From~To) */}
				<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromLoc" toName="toLoc" />
			</li>
		</>
	);
};

export default MsSkuDcLocChangeSearch;
