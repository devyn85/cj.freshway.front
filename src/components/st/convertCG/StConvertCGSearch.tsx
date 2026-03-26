/*
 ############################################################################
 # FiledataField	: StConvertCGSearch.tsx
 # Description		: 재고 > 재고조정 > 재고속성변경
 # Author			    : 고혜미
 # Since		    	: 25.09.18
 ############################################################################
*/

import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputRange, SelectBox } from '@/components/common/custom/form';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const StConvertCGSearch = (props: any) => {
	const form = props.form;
	const { t } = useTranslation();
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const [zoneOptions, setZoneOptions] = useState([]);

	// * 센터에 해당되는 zone 정보 조회
	const loadZone = async () => {
		await fetchMsZone();
		setZoneOptions([{ baseDescr: t('lbl.ALL'), baseCode: '' }, ...getMsZoneList(form.getFieldValue('fixdccode'))]);
		form.setFieldValue('fromzone', ''); // 피킹존을 "전체"가 선택되도록 설정
		form.setFieldValue('tozone', '');
	};

	// * 초기값 세팅
	useEffect(() => {
		loadZone();
		// 사용자 물류센터 기본값 세팅
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
					label={t('lbl.DCCODE')}
					mode={'single'}
					onChange={async () => {
						loadZone();
					}}
				/>
			</li>
			{/* 창고구분 */}
			<li>
				<SelectBox
					name="wharea"
					label="창고구분"
					options={getCommonCodeList('WHAREA', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
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
					label={t('lbl.SORTKEY')}
				/>
			</li>
			{/* 상품코드/명 */}
			<li>
				<CmSkuSearch form={form} name="skuName" code="sku" selectionMode="multipleRows" />
			</li>
			{/* 로케이션 */}
			<li>
				<InputRange label={t('lbl.LOCATION_FROM_TO')} fromName="fromloc" toName="toloc" />
			</li>
			{/* FROM ZONE */}
			<li>
				<SelectBox
					name="fromzone"
					label={'FROM ZONE'}
					options={zoneOptions}
					fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
				/>
			</li>
			{/* TO ZONE */}
			<li>
				<SelectBox
					name="tozone"
					label={'TO ZONE'}
					options={zoneOptions}
					fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
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
		</>
	);
};

export default StConvertCGSearch;
