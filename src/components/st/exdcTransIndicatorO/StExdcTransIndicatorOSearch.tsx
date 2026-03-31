/*
 ############################################################################
 # FiledataField	: StExdcTransIndicatorOSearch.tsx
 # Description		: 외부비축재고속성변경 검색영역
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.06.25
 ############################################################################
*/

import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Datepicker, RadioBox } from '@/components/common/custom/form';
import { Form } from 'antd';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const StExdcTransIndicatorOSearch = forwardRef((props: any) => {
	const { t } = useTranslation();
	const { search, form, searchRef } = props;
	const [dcCodeList, setDcCodeList] = useState([]);
	const dcCode = Form.useWatch('dcCode');
	const radioOpt1 = [
		{
			label: '전체',
			value: null,
		},
		{
			label: '실온',
			value: '10',
		},
		{
			label: '냉장',
			value: '20',
		},
		{
			label: '냉동',
			value: '30',
		},
	];

	useEffect(() => {
		// form.setFieldValue('date', dates); // dates 준비된 뒤 한 번만
		//
		const params = {};

		// setClaimtypeL([...res.data, { specCode: '', specDescr: '전체', baseCode: 'L' }]);
	}, []);

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox mode={'single'} name={'dcCode'} rules={[{ required: true }]} />
			</li>
			<li>
				<Datepicker
					name="date"
					allowClear
					showNow={false}
					label={t('lbl.DOCDT_WD')}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
					picker="year"
					// dataformat={dateFormat}
				/>
			</li>
			<li style={{ gridColumn: 'span 2' }}>
				<RadioBox label={'저장조건'} options={radioOpt1} name="storageType" />
			</li>
		</>
	);
});

export default StExdcTransIndicatorOSearch;
