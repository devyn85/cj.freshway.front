/*
############################################################################
# FiledataField		: TmIndividualDispatchSearch.tsx
# Description		: 개별배차 (Individual Dispatch) - 검색 컴포넌트
# Since			: 2026.03.04
############################################################################
*/

// util
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { MultiInputText, Rangepicker, SelectBox } from '@/components/common/custom/form';

import { DatePickerProps } from 'antd';
import { Dayjs } from 'dayjs';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';


interface TmIndividualDispatchSearchProps {
	form: any;
}

const TmIndividualDispatchSearch = ({ form }: TmIndividualDispatchSearchProps) => {
	const { t } = useTranslation();
	const dateFormat = 'YYYY-MM-DD';
	const [dates, setDates] = useState([dayjs().add(1, 'day'), dayjs().hour() < 12 ? dayjs().add(2, 'day') : dayjs().add(1, 'day')]);

	useEffect(() => {
		const deliveryDtFrom = dayjs().add(1, 'day');
		const deliveryDtTo = dayjs().hour() < 12 ? dayjs().add(2, 'day') : dayjs().add(1, 'day');
		setDates([deliveryDtFrom, deliveryDtTo]);
		form.setFieldValue('deliveryDate', [deliveryDtFrom, deliveryDtTo]);
	}, []);

	const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();
	const disabledDaysDate: DatePickerProps['disabledDate'] = (current, { from, type }) => {
		if (from) {
			const minDate = from.add(-31, 'days');
			const maxDate = from.add(31, 'days');

			switch (type) {
				case 'year':
					return current.year() < minDate.year() || current.year() > maxDate.year();

				case 'month':
					return (
						getYearMonth(current) < getYearMonth(minDate) ||
						getYearMonth(current) > getYearMonth(maxDate)
					);

				default:
					return Math.abs(current.diff(from, 'days')) >= 31;
			}
		}

		return false;
	};

	return (
		<>
			<li>
				{/* 물류센터(*) - 필수 */}
				<CmGMultiDccodeSelectBox
					mode="single"
					name="gDccode"
					label={t('lbl.DCCODE')}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 배송일자 */}
				<Rangepicker
					label={t('lbl.DELIVERYDATE') || '배송일자'}
					name="deliveryDate"
					defaultValue={dates}
					format={dateFormat}
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
					disabled={false}
					disabledDate={disabledDaysDate}
				/>
			</li>
			<li>
				{/* 배송유형 */}
				<SelectBox
					name="tmDeliverytype"
					label={t('lbl.DELIVERYTYPE_WD') || '배송유형'}
					options={getCommonCodeList('TM_DELIVERYTYPE', '배송', '1').filter(
						(item: any) => ['1', '3', '4', '5'].includes(item.comCd),
					)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* 배차상태 */}
				<SelectBox
					label={t('lbl.DISPATCH_STATUS') || '배차상태'}
					name={'dispatchStatus'}
					allowClear
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					options={getCommonCodeList('STATUS_TM', '전체', '').filter(
						(item: any) => ['', '00', '50', '90'].includes(item.comCd),
					)}
				/>
			</li>
			<li>
				{/* 차량번호 */}
				<CmCarSearch
					form={form}
					name="carname"
					code="carno"
					label={t('lbl.CARNO') || '차량번호'}
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				{/* 거래처 */}
				<CmCustSearch
					form={form}
					name="custname"
					code="custkey"
					label="거래처"
					selectionMode="multipleRows"
					returnValueFormat="name"
				/>
			</li>
			<li>
				{/* 전표번호 */}
				<MultiInputText
					label="전표번호"
					name="docno"
					placeholder={t('msg.placeholder1', ['전표번호'])}
				/>
			</li>
		</>
	);
};

export default TmIndividualDispatchSearch;
