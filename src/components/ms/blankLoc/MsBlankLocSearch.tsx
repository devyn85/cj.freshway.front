// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SelectBox } from '@/components/common/custom/form';

//Store
import { getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';

interface MsBlankLocSearchProps {
	form: any;
	search: any;
	zoneOptions: any;
	setZoneOptions: any;
}

const MsBlankLocSearch = ({ form, search, zoneOptions, setZoneOptions }: MsBlankLocSearchProps) => {
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
						form.setFieldsValue({ zone: null, loc: '' });
					}}
				/>
			</li>
			<li>
				<SelectBox
					name="zone"
					options={[{ baseCode: null, baseDescr: '--- 전체 ---' }, ...zoneOptions]}
					fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
					label={'피킹존'}
				/>
			</li>
			<li>
				<InputText
					name="loc"
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.LOC_ST')])}
					onPressEnter={search}
					label={t('lbl.LOC_ST')}
				/>
			</li>
			<li>
				<SelectBox
					name="locType"
					placeholder="선택해주세요"
					options={getCommonCodeList('LOCTYPE_BLANK', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'로케이션유형'}
				/>
			</li>
		</>
	);
};

export default MsBlankLocSearch;
