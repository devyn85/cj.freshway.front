/*
 ############################################################################
 # FiledataField	: TmAttendanceSearch.tsx
 # Description		: 근태관리 검색
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.09.16
 ############################################################################
*/

import CmCarrierSearch from '@/components/cm/popup/CmCarrierSearch';
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import { SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

const TmAttendanceSearch = forwardRef((props: any, ref) => {
	const [dcCodeList, setDcCodeList] = useState([]);
	const { t } = useTranslation();
	const form = props.form;

	useEffect(() => {
		const list = getUserDccodeList('STD') || [];
		list.filter(item => {
			item.dccode !== 'STD';
		});
		setDcCodeList(list.filter(item => item.dccode !== 'STD'));
	}, []);

	return (
		<>
			{/* 월선택 */}
			<li>
				<DatePicker label="월 선택" name="date" format="YYYY-MM" picker="month" placeholder={'월 선택'} allowClear />
			</li>
			{/* 물류센터 */}
			<li>
				<SelectBox
					name="dcCode"
					span={24}
					options={dcCodeList}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					label={'물류센터'}
				/>
			</li>
			{/* 운송사코드/명 */}
			<li>
				<CmCarrierSearch
					form={props.form}
					selectionMode="multipleRows"
					name="carrierKeyName"
					code="carrierKey"
					returnValueFormat="name"
				/>
			</li>
			{/* 차량ID/명 */}
			<li>
				<CmCarSearch form={form} selectionMode="multipleRows" name="carNoName" code="carNo" returnValueFormat="name" />
			</li>
			{/* 계약유형 */}
			<li>
				<SelectBox
					name="contractType"
					label="계약유형"
					options={getCommonCodeList('CONTRACTTYPE', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* 차량톤수 */}
			<li>
				<SelectBox
					name="carType"
					placeholder="선택해주세요"
					options={getCommonCodeList('CARCAPACITY', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.CARCAPACITY')}
				/>
			</li>
		</>
	);
});
export default TmAttendanceSearch;
