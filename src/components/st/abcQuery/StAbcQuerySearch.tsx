/*
 ############################################################################
 # FiledataField	: StAbcQuerySearch.tsx
 # Description		: 재고 > 재고운영 > ABC 분석 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.11.12
 ############################################################################
*/

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { InputRange, SelectBox } from '@/components/common/custom/form';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { useSelector } from 'react-redux';

const StAbcQuerySearch = ({ form, activeKey }: any) => {
	const { t } = useTranslation();
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	// 피킹존 옵션 상태
	const [zoneOptions, setZoneOptions] = useState([]);

	// * 센터에 해당되는 zone 정보 조회
	const loadZone = async () => {
		await fetchMsZone();

		// 현재 선택된 물류센터(dccode)에 해당하는 zone 리스트를 안전하게 읽기
		const zones = getMsZoneList(form.getFieldValue('fixdccode')) || [];

		// zones 객체의 필드 네이밍은 여러 형태(baseCode/basecode/BASECODE 등)일 수 있으므로 안전하게 추출
		const zoneMap = zones.map((item: any) => ({
			comCd: item.baseCode,
			cdNm: item.baseDescr,
		}));

		// SelectBox에서 사용할 comCd/cdNm 형태로 설정 (맨 앞에 전체 항목 추가)
		setZoneOptions([{ comCd: '', cdNm: t('lbl.ALL') }, ...zoneMap]);

		form.setFieldValue('fromzone', '');
		form.setFieldValue('tozone', '');
		form.setFieldValue('excludeZone', '');
	};

	// * 초기값 세팅
	useEffect(() => {
		loadZone();
		form.setFieldValue('fixdccode', gDccode);
	}, []);
	return (
		<>
			<li>
				{/* 물류센터 */}
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
			{activeKey === '1' && (
				<>
					{/* 창고 */}
					<li>
						<CmOrganizeSearch
							form={form}
							label={t('lbl.STORE')}
							selectionMode="multipleRows"
							name="organizenm"
							code="organize"
							returnValueFormat="name"
							dccode={form.getFieldValue('fixdccode')}
						/>
					</li>
					{/* 창고구분 */}
					<li>
						<SelectBox
							label={t('lbl.WHAREA')}
							name="wharea"
							options={getCommonCodeList('WHAREA', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 피킹존 */}
					<li className="range-align">
						<SelectBox
							label={t('lbl.ZONE')}
							name="fromzone"
							options={zoneOptions}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
						<span>-</span>
						<SelectBox name="tozone" options={zoneOptions} fieldNames={{ label: 'cdNm', value: 'comCd' }} />
					</li>
					{/* 상품코드 */}
					<li>
						<CmSkuSearch label={t('lbl.SKUCD')} form={form} name="skuName" code="sku" selectionMode="multipleRows" />
					</li>
					{/* 로케이션종류 */}
					<li>
						<SelectBox
							label={t('lbl.LOCCATEGORY')}
							name="loccategory"
							options={getCommonCodeList('LOCCATEGORY', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 로케이션(From~To) */}
					<li>
						<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromloc" toName="toloc" />
					</li>
					{/* 제외 존 */}
					<li>
						<SelectBox
							label={t('lbl.EXCLUDE_ZONE')}
							name="excludeZone"
							options={zoneOptions}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}
		</>
	);
};

export default StAbcQuerySearch;
