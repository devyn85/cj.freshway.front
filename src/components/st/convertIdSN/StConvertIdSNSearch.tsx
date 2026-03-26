/*
 ############################################################################
 # FiledataField	: StConvertIdSNSearch.tsx
 # Description		: 재고 > 재고작업 > 이력상품바코드변경 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.09.16
 ############################################################################
*/

import CmSkuGroup2Search from '@/components/cm/popup/CmSkuGroup2Search';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputRange, InputText, SelectBox } from '@/components/common/custom/form';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { useSelector } from 'react-redux';

const StConvertIdSNSearch = ({ form }: any) => {
	const { t } = useTranslation();
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	// 피킹존 옵션 상태
	const [zoneOptions, setZoneOptions] = useState([]);

	// * 센터에 해당되는 zone 정보 조회
	const loadZone = async () => {
		await fetchMsZone();

		const zones = getMsZoneList(form.getFieldValue('fixdccode')) || [];

		const zoneMap = zones.map((item: any) => ({
			comCd: item.baseCode,
			cdNm: item.baseDescr,
		}));

		setZoneOptions([{ comCd: '', cdNm: t('lbl.ALL') }, ...zoneMap]);

		form.setFieldValue('fromzone', '');
		form.setFieldValue('tozone', '');
	};

	// * 초기값 세팅
	useEffect(() => {
		loadZone();
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
	}, []);
	return (
		<>
			{/* 물류센터 */}
			<li>
				<SelectBox
					label={t('lbl.DCCODE')}
					name="fixdccode"
					options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					onChange={async () => {
						loadZone();
					}}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 상품코드 */}
			<li>
				<CmSkuSearch label={t('lbl.SKUCD')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 상품분류 */}
			<li>
				<CmSkuGroup2Search label={t('lbl.MC')} form={form} name="skugroupName" code="skugroup" />
			</li>
			{/* 로케이션(From~To) */}
			<li>
				<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromloc" toName="toloc" />
			</li>
			{/* 존 */}
			<li className="range-align">
				<SelectBox
					label={t('lbl.ZONE_1')}
					name="fromzone"
					options={zoneOptions}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					rules={[{ required: false, validateTrigger: 'none' }]}
				/>
				<span>-</span>
				<SelectBox
					name="tozone"
					options={zoneOptions}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					rules={[{ required: false, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 이력번호 */}
			<li>
				<InputText label={t('lbl.SERIALNO')} name="serialno" placeholder={t('msg.placeholder1', [t('lbl.SERIALNO')])} />
			</li>
		</>
	);
};

export default StConvertIdSNSearch;
