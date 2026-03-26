/*
 ############################################################################
 # FiledataField	: IbCloseStoragefeeSearch.tsx
 # Description		: 보관료 마감 처리 
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.29
 ############################################################################
*/
// lib
import { Form } from 'antd';
import dayjs from 'dayjs';

// component
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';

// store
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// api

// util

// hook

// type

// asset

const IbCloseStoragefeeSearch = forwardRef((props: any, ref) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const dateFormat = 'YYYY-MM';

	const [dcCodeList, setDcCodeList] = useState([]);
	const dcCode = Form.useWatch('dcCode', props.form);
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const closeYnOptions = getCommonCodeList('YN', t('lbl.ALL'), null).map(item => ({
		...item,
		cdNm: item.comCd === 'Y' ? '정산' : item.comCd === 'N' ? '미정산' : item.cdNm,
	}));

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	useEffect(() => {
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialStart = dayjs().add(-1, 'month');
		const initialEnd = dayjs().add(-1, 'month');
		setDates([initialStart, initialEnd]);
		props.form.setFieldValue('date', [initialStart, initialEnd]);
		const list = getCommonCodeList('SUPPLY_DC', '공통', 'STD');

		setDcCodeList([
			...list.map(item => ({
				...item,
				display: item.comCd && item.comCd !== 'STD' ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
			})),
		]);
	}, []);

	return (
		<>
			<li>
				<DatePicker
					label={t('lbl.STDYYMM')}
					name="date"
					format="YYYY-MM"
					picker="month"
					// onChange={onChange}
					allowClear
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox data-type={''} name={'dcCode'} label={t('lbl.DCCODENAME')} required disabled />
			</li>
			<li>
				{' '}
				<CmOrganizeSearch
					form={props.form}
					name="oranizeName"
					code="organize"
					returnValueFormat="name"
					selectionMode="multipleRows"
					dccode={dcCode}
				/>
			</li>
			<li>
				{props.activeKey === '1' ? (
					<SelectBox
						name="accountsYn"
						label={t('lbl.ACCOUNTS_YN')}
						options={getCommonCodeList('CALCULATE_YN', t('lbl.ALL'), null)}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				) : props.activeKey === '2' ? (
					<SelectBox
						name="closeYn"
						label={t('lbl.CLOSEYN')}
						options={getCommonCodeList('YN', t('lbl.ALL'), null)}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				) : null}
			</li>
		</>
	);
});
export default IbCloseStoragefeeSearch;
