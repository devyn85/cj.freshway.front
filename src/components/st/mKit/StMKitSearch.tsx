/*
 ############################################################################
 # FiledataField	: StMKitSearch.tsx
 # Description		: 재고 > 재고조정 > 키트처리
 # Author		    	: 고혜미
 # Since			    : 25.11.04
 ############################################################################
*/

import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { RadioBox, Rangepicker, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const dateFormat = 'YYYY-MM-DD';

const StMKitSearch = (props: any) => {
	const form = props.form;
	const { t } = useTranslation();
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	useEffect(() => {
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialStart = dayjs();
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		form.setFieldValue('trandtRange', [initialStart, initialEnd]);

		// 사용자 물류센터 기본값 세팅
		if (gDccode) {
			form.setFieldValue('fixdccode', gDccode);
		}
	}, []);

	return (
		<>
			{/* 계획일자 */}
			<li>
				<Rangepicker
					label={t('lbl.PLAN_DATE')}
					name="trandtRange"
					defaultValue={dates}
					format={dateFormat}
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 물류센터*/}
			<li>
				<CmGMultiDccodeSelectBox
					name="fixdccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')}
				/>
			</li>
			{/* 키트상품 */}
			<li>
				<CmSkuSearch
					form={form}
					selectionMode="multipleRows"
					name="kitSkuName"
					label={'키트상품'}
					code="kitSku"
					returnValueFormat="name"
					kit={'Y'}
				/>
			</li>
			{/* 저장조건 */}
			<li>
				<SelectBox
					label={t('lbl.STORAGETYPE')}
					name="storagetype"
					placeholder="선택해주세요"
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 처리구분 */}
			<li>
				<RadioBox
					label={t('lbl.QCTYPE_RT')}
					name="procdiv"
					options={[
						{ label: t('lbl.PRODUCTION'), value: '1' },
						{ label: t('lbl.DISASSEMBLE'), value: '2' },
					]}
				/>
			</li>
		</>
	);
};

export default StMKitSearch;
