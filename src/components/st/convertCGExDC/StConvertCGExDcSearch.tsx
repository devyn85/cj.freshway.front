/*
 ############################################################################
 # FiledataField	: StConvertCGExDcSearch.tsx
 # Description		: 외부비축재고속성변경 검색영역
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.06.25
 ############################################################################
*/

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { MultiInputText, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
const StConvertCGExDcSearch = forwardRef((props: any) => {
	const { t } = useTranslation();
	const { form } = props;
	const [dcCodeList, setDcCodeList] = useState([]);
	const dcCode = Form.useWatch('dcCode');

	// * 초기값 설정 (컴포넌트 마운트 시)
	useEffect(() => {
		const list = getCommonCodeList('SUPPLY_DC');

		const allOption = { comCd: '', cdNm: '전체', display: '전체' };

		setDcCodeList([
			allOption,
			...list.map(item => ({
				...item,
				display: item.comCd && item.comCd !== 'STD' ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
			})),
		]);
	}, []);
	return (
		<>
			<li>
				{/* 물류센터 */}
				<SelectBox
					name="dcCode"
					span={24}
					options={dcCodeList}
					fieldNames={{ label: 'display', value: 'comCd' }}
					label={'물류센터'}
					disabled
				/>
			</li>
			{/* 창고 */}
			<li>
				<CmOrganizeSearch
					form={form}
					name="organizeName"
					code="organize"
					selectionMode="singleRow"
					returnValueFormat="name"
					label={t('창고')}
					dccode={dcCode}
				/>
			</li>
			{/* 상품코드 */}
			<li>
				<CmSkuSearch
					form={form}
					name="CmSkuGroup2Search"
					code="sku"
					selectionMode="multipleRows"
					returnValueFormat="name"
					label={t('상품코드')}
				/>
			</li>
			{/* B/L번호 */}
			<li>
				<MultiInputText
					label={t('lbl.CONVSERIALNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.CONVSERIALNO')])}
					name="blNo"
				/>
			</li>
			{/* 재고상태 */}
			<li>
				<SelectBox
					name="stockGrade"
					label={t('재고상태')}
					options={getCommonCodeList('STOCKGRADE', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
});

export default StConvertCGExDcSearch;
