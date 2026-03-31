/*
 ############################################################################
 # FiledataField	: StDailyStockSearch.tsx
 # Description		: 시점별재고조회
 # Author			    : KimDongHyeon
 # Since			    : 2025.11.05
 ############################################################################
*/

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { CheckBox, InputNumber, InputRange, InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';

const StDailyStockOutOrgSearch = (props: any) => {
	const form = props.form;
	const { t } = useTranslation();
	const dccode = Form.useWatch('fixdccode', form);
	// 피킹존 옵션 상태
	const [zoneOptions, setZoneOptions] = useState([]);

	// * 센터에 해당되는 zone 정보 조회
	const loadZone = async () => {
		await fetchMsZone();
		setZoneOptions([{ baseDescr: '전체', baseCode: '' }, ...getMsZoneList(form.getFieldValue('fixdccode'))]);
		form.setFieldValue('zone', ''); // 피킹존을 "전체"가 선택되도록 설정
	};

	// * 센터에 해당되는 zone 정보 조회
	useEffect(() => {
		loadZone();
	}, []);

	return (
		<>
			{/* 조회일 */}
			<li>
				<DatePicker name="stockdate" label={t('lbl.SEARCHDT')} showSearch allowClear showNow={false} required />
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="fixdccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={'물류센터'}
					mode={'single'}
					onChange={async () => {
						loadZone();
					}}
				/>
			</li>
			{/* 창고 */}
			<li>
				<CmOrganizeSearch
					form={form}
					selectionMode="multipleRows"
					name="organizenm"
					code="organize"
					returnValueFormat="name"
					dccode={dccode}
					label="창고"
				/>
			</li>
			{/* 정렬순서 */}
			<li>
				<SelectBox
					name="sortkey"
					options={[
						{ comCd: 'LOC', cdNm: '로케이션/상품/기준일 순' },
						{ comCd: 'DATE', cdNm: '상품/기준일 순' },
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label="정렬순서"
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
					label="재고위치"
					options={getCommonCodeList('STOCKTYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 재고속성 */}
			<li>
				<SelectBox
					name="stockgrade"
					label="재고속성"
					options={getCommonCodeList('STOCKGRADE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 저장조건 */}
			<li>
				<SelectBox
					name="storagetype"
					label="저장조건"
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
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
					placeholder="선택해주세요"
					options={getCommonCodeList('LOCCATEGORY', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.LOCCATEGORY')}
				/>
			</li>
			{/* 피킹존 */}
			<li>
				<SelectBox
					name="zone"
					label={t('lbl.ZONE')}
					options={zoneOptions}
					fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
				/>
			</li>
			{/* 이력번호 */}
			<li>
				<InputText label="이력번호" name="serialno" />
			</li>
			{/* 소비기한여부 */}
			<li>
				<SelectBox
					name="lottable01yn"
					label="소비기한여부"
					options={getCommonCodeList('YN2', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 소비기한잔여(%)  */}
			<li>
				<InputNumber name="usebydatefreert" label={t('lbl.USEBYDATE_FREE_RT')} />
			</li>
			{/* 기타 */}
			<li style={{ gridColumn: ' span 4' }}>
				<span>
					<CheckBox label={'기타'} name="zeroQtyYn" trueValue="1" falseValue="0">
						현재고 0인 상품 제외
					</CheckBox>
					<CheckBox name="locSkuSumYn" trueValue="1" falseValue="0">
						로케이션/상품별 합계표시
					</CheckBox>
					<CheckBox name="except1" trueValue="1" falseValue="0">
						CROSS존제외
					</CheckBox>
					<CheckBox name="except2" trueValue="1" falseValue="0">
						STAGE존제외
					</CheckBox>
					<CheckBox name="except3" trueValue="1" falseValue="0">
						CANCEL존제외
					</CheckBox>
					<CheckBox name="except4" trueValue="1" falseValue="0">
						소비기한9999제외
					</CheckBox>
				</span>
			</li>
		</>
	);
};

export default StDailyStockOutOrgSearch;
