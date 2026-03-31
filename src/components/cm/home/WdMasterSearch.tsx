import { useAppSelector } from '@/store/core/coreHook';

// Component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Rangepicker } from '@/components/common/custom/form';
import { DatePickerProps } from 'antd';
import { Dayjs } from 'dayjs';

interface NewMasterSearchProps {
	search?: any;
	form?: any;
}

const WdMasterSearch = ({ search, form }: NewMasterSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const dateFormat = 'YYYY-MM-DD';
	const { t } = useTranslation();

	const globalVariable = useAppSelector(state => state.global.globalVariable); // 글로벌 변수
	const initialized = useAppSelector(state => state.menu.initialized); // fetchInitApi 초기값 설정 완료 여부


	const disabled7DaysDate: DatePickerProps['disabledDate'] = (current, { from, type }) => {
		const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();

		if (from) {
			const minDate = from.add(-6, 'days');
			const maxDate = from.add(6, 'days');

			switch (type) {
				case 'year':
					return current.year() < minDate.year() || current.year() > maxDate.year();

				case 'month':
					return (
						getYearMonth(current) < getYearMonth(minDate) ||
						getYearMonth(current) > getYearMonth(maxDate)
					);

				default:
					return Math.abs(current.diff(from, 'days')) >= 7;
			}
		}

		return false;
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		//
	}, [initialized]);

	return (
		<>
			<li>
				<Rangepicker
					disabledDate={disabled7DaysDate}
					label={t('lbl.DOCDT_WD')} //입고일자
					name="slipdt"
					format={dateFormat} // 화면에 표시될 형식
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
					onChange={search}
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox
					name={'fixdccode'}
					required
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={t('lbl.DCCODE')}
					onChange={search}
				/>
			</li>
		</>
	);
};

export default WdMasterSearch;
