/*
 ############################################################################
 # FiledataField	: StStockSNSearch.tsx
 # Description		: 이력재고조회
 # Author			    : sss
 # Since			    : 25.07.04
 ############################################################################
*/

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputRange, InputText, SelectBox } from '@/components/common/custom/form';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import styled from 'styled-components';

const StStockOutOrgSearch = (props: any) => {
	const form = props.form;
	const { t } = useTranslation();
	const dccode = Form.useWatch('fixdccode', form);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	// 피킹존 옵션 상태
	const [zoneOptions, setZoneOptions] = useState([]);

	// * 센터에 해당되는 zone 정보 조회
	const loadZone = async () => {
		await fetchMsZone();
		setZoneOptions([{ baseDescr: '전체', baseCode: '' }, ...getMsZoneList(form.getFieldValue('fixdccode'))]);
		form.setFieldValue('zone', ''); // 피킹존을 "전체"가 선택되도록 설정
	};

	// * 초기값 설정
	useEffect(() => {
		loadZone(); // 센터에 해당되는 zone 정보 조회

		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
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
					mode={'single'}
					onChange={async () => {
						loadZone(); // 센터에 해당되는 zone 정보 조회
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
			{/* 소비기한여부 */}
			<ExpirationDateWrap>
				<SelectBox
					label="소비기한여부"
					name="searchType"
					span={24}
					options={[
						{ comCd: '1', cdNm: '소비기한여부' },
						{ comCd: '2', cdNm: '소비기한임박여부' },
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
				/>
				{/* ALL/Y/N */}
				<SelectBox
					name="lottable01yn"
					options={getCommonCodeList('YN2', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</ExpirationDateWrap>
			{/* 정렬순서 */}
			<li>
				<SelectBox
					name="sortKey"
					options={[
						{ comCd: null, cdNm: t('lbl.ALL') },
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
			{/* 피킹존 */}
			<li>
				<SelectBox
					name="zone"
					label={t('lbl.ZONE')}
					options={zoneOptions}
					fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
				/>
			</li>
			{/* B/L번호 */}
			<li style={{ gridColumn: ' / span 0' }}>
				<InputText label="B/L번호" name="blno" />
			</li>
			{/* 이력번호 */}
			<li style={{ gridColumn: ' / span 0' }}>
				<InputText label="이력번호" name="serialno" />
			</li>
		</>
	);
};

export default StStockOutOrgSearch;

const ExpirationDateWrap = styled.li`
	display: flex;
`;
