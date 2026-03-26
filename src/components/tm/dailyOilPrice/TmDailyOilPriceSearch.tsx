/*
 ############################################################################
 # FiledataField	: TmDailyOilPriceSearch.tsx
 # Description		: 유가관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.09.05
 ############################################################################
*/
// lib
import { Form } from 'antd';
import dayjs from 'dayjs';
// component
import { Rangepicker, SelectBox } from '@/components/common/custom/form';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// api

// util

// hook

// type

// asset

const TmDailyOilPriceSearch = forwardRef((props: any, ref) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const dateFormat = 'YYYY-MM-DD';
	const [dcCodeList, setDcCodeList] = useState([]);
	const dcCode = Form.useWatch('dcCode', props.form);
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	//공통 코드 호출
	// const getFuelTypeCommonCodeList = () => {
	// 	const list = getUserDccodeList('STD') || [];
	// 	list.unshift({ dccode: '', dcname: '전체' });
	// 	return list;
	// };
	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	useEffect(() => {
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialStart = dayjs();
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		props.form.setFieldValue('date', [initialStart, initialEnd]);
		// const list = getUserDccodeList('STD') || [];
		const list = (getUserDccodeList('STD') || []).map(item =>
			item.dccode === 'STD' ? { ...item, dcname: '공통' } : item,
		);
		list.unshift({ dccode: '', dcname: '전체' });
		setDcCodeList(list);
	}, []);

	return (
		<>
			<li>
				<SelectBox
					name="dcCode" //IF Status
					span={24}
					options={dcCodeList}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')}
					// value={null}
				/>
			</li>
			<li>
				<Rangepicker
					label="기준일자"
					name="date"
					defaultValue={dates} // 초기값 설정1
					format={dateFormat} // 화면에 표시될 형식
					// format="YYYY-MM"
					// picker="month"
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* <li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="single"
					label={'물류센터'}
				/>
			</li> */}

			<li>
				<SelectBox
					name="gasType" //IF Status
					span={24}
					options={getCommonCodeList('FUELTYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'유종'}
				/>
			</li>
		</>
	);
});
export default TmDailyOilPriceSearch;
