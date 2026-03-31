/*
 ############################################################################
 # FiledataField	: StStockLotMonitoringSearch.tsx
 # Description		: 유통기한점검
 # Author			: JeongHyeongCheol
 # Since			: 25.11.10
 ############################################################################
*/

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, InputRange, InputText, SelectBox } from '@/components/common/custom/form';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { fetchGrpCommCode, getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

const StStockLotMonitoringSearch = (props: any) => {
	const form = props.form;
	const { t } = useTranslation();
	const userAuthInfo = useAppSelector(state => state.user.userInfo);

	// 피킹존 옵션 상태
	const [zoneOptions, setZoneOptions] = useState([]);
	// 정렬순서 이전 값 추적 (토글 기능을 위해)
	const [preSelectedSortkey, setPreSelectedSortkey] = useState<string | null>(null);
	// 중복 호출 방지
	const [loaded, setLoaded] = useState(false);
	const [options, setOptions] = useState(getCommonCodeList('BUYERKEY', '--- 전체 ---'));

	// 정렬순서
	const sortOptions = [
		{ cdNm: '로케이션/상품/기준일순', comCd: 'LOC' },
		{ cdNm: '상품/기준일순', comCd: 'DATE' },
	];

	// * 센터에 해당되는 zone 정보 조회
	const loadZone = async () => {
		await fetchMsZone();
		setZoneOptions([...getMsZoneList(form.getFieldValue('fixdccode'))]);
		form.setFieldValue('zone', null); // 피킹존을 "전체"가 선택되도록 설정
	};
	const fetchOptions = async () => {
		if (loaded) return;

		setLoaded(true);

		// 공통코드 다시 가져오기
		fetchGrpCommCode().then(() => {
			setOptions(getCommonCodeList('BUYERKEY', '--- 전체 ---'));
			setLoaded(false);
		});
	};

	// * 센터에 해당되는 zone 정보 조회
	useEffect(() => {
		loadZone();
	}, []);

	return (
		<>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="fixdccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={'물류센터'}
					disabled={
						!userAuthInfo.roles?.includes('00') &&
						!userAuthInfo.roles?.includes('20') &&
						!userAuthInfo.roles?.includes('05') &&
						!userAuthInfo.roles?.includes('10') &&
						!userAuthInfo.roles?.includes('000') &&
						!userAuthInfo.roles?.includes('200') &&
						!userAuthInfo.roles?.includes('010') &&
						!userAuthInfo.roles?.includes('100')
					}
					onChange={async () => {
						loadZone();
					}}
				/>
			</li>
			{/* 창고코드/명 */}
			<li>
				<CmOrganizeSearch form={form} name="orgName" code="organize" selectionMode="multipleRows" />
			</li>
			{/* 소비기한 임박 여부 */}
			<li>
				<SelectBox
					name="lottable01yn"
					label={t('lbl.NEARDURATIONYN2')}
					options={getCommonCodeList('YN', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
				/>
			</li>
			{/* 정렬순서 */}
			<li>
				<SelectBox
					name="sortkey"
					label={'정렬순서'}
					options={sortOptions}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					onSelect={(value: string) => {
						if (preSelectedSortkey === value) {
							setPreSelectedSortkey(null);
							form.setFieldValue('sortkey', null);
						} else {
							setPreSelectedSortkey(value);
						}
					}}
					onChange={(value: string | null) => {
						if (value !== preSelectedSortkey) {
							setPreSelectedSortkey(value);
						}
					}}
				/>
			</li>
			{/* 상품코드/명 */}
			<li>
				<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 재고위치 */}
			<li>
				<SelectBox
					name="stocktype"
					label={'재고위치'}
					options={getCommonCodeList('STOCKTYPE', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
				/>
			</li>
			{/* 재고속성 */}
			<li>
				<SelectBox
					name="stockgrade"
					label={'재고속성'}
					options={getCommonCodeList('STOCKGRADE', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
				/>
			</li>
			{/* 저장조건 */}
			<li>
				<SelectBox
					name="storagetype"
					label={'저장조건'}
					options={getCommonCodeList('STORAGETYPE', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
				/>
			</li>
			{/* 로케이션 */}
			<li>
				<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromloc" toName="toloc" />
			</li>
			{/* 로케이션종류 */}
			<li>
				<SelectBox
					name="loccategory"
					label={'로케이션종류'}
					options={getCommonCodeList('LOCCATEGORY', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
				/>
			</li>
			{/* 피킹존 */}
			<li>
				<SelectBox
					name="zone"
					label={t('lbl.ZONE')}
					options={zoneOptions}
					fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
					mode="multiple"
					placeholder="선택해주세요"
				/>
			</li>
			{/* 이력번호 */}
			<li>
				<InputText name="serialno" label={'이력번호'} placeholder="이력번호 선택" />
			</li>
			{/* 기준일(소비,제조) */}
			<li>
				<InputText name="lottable01" label={'기준일(소비,제조)'} placeholder="기준일(소비,제조) 검색" />
			</li>

			{/* 소진가능여부 */}
			<li>
				<SelectBox
					name="exhaustionchk"
					label={'소진가능여부'}
					options={getCommonCodeList('YN', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
				/>
			</li>
			{/* 수급담당 */}
			<li>
				<SelectBox
					name="buyerkey"
					placeholder="선택해주세요"
					options={options}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.POMDCODE')}
					onDropdownVisibleChange={(open: boolean) => {
						if (open) {
							fetchOptions();
						}
					}}
				/>
			</li>
			{/* 현재고 0인 상품 제외 */}
			<li>
				<CheckBox name="zeroQtyYn" trueValue="1" falseValue="0" label={'현재고 0인 상품 제외'} />
			</li>
		</>
	);
};

export default StStockLotMonitoringSearch;
