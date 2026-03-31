/*
 ############################################################################
 # FiledataField	: TmInplanMessageSearch.tsx
 # Description		: 배송전달사항
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.05
 ############################################################################
*/

import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import dayjs from 'dayjs';

const TmInplanMessageSearch = forwardRef((props: any) => {
	const form = props.form;
	const dateFormat = 'YYYY-MM-DD';
	const initDates = [dayjs(), dayjs()];
	const [dcCodeList, setDcCodeList] = useState([]);
	// 글로벌 변수에서 현재 설정된 물류센터 코드를 가져옵니다.
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	useEffect(() => {
		form.setFieldValue('date', initDates);
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

	// 물류센터 목록(dcCodeList)이 준비된 후에, 글로벌 변수에 저장된 물류센터를 기본값으로 설정
	useEffect(() => {
		if (dcCodeList.length > 0 && globalVariable.gDccode) {
			form.setFieldValue('dcCode', globalVariable.gDccode);
		}
	}, [dcCodeList, globalVariable.gDccode]);
	return (
		<>
			{/* 출고일자 */}
			<li>
				<Rangepicker
					label="출고일자"
					name="date"
					defaultValue={initDates}
					format={dateFormat}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					span={24}
					fieldNames={{ label: 'display', value: 'comCd' }}
					label={'물류센터'}
				/>
			</li>
			{/* 고객코드/명 */}
			<li>
				<CmCustSearch
					form={form}
					name="toCustkeyName"
					code="toCustkey"
					selectionMode="multipleRows"
					returnValueFormat="name"
				/>
			</li>
			{/* 			
			 차량번호 
			<li>
				<InputText label={'차량번호'} name="carNo" onPressEnter={null} />
			</li>
			 SAP등록자 
			<li>
				<InputText label={'SAP등록자'} name="sapAddWho" onPressEnter={null} />
			</li>
			 영업조직 
			<li>
				<SelectBox
					name="saleOrganize"
					label="영업조직"
					options={getCommonCodeList('SALEORGANIZE', '전체')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li> */}
		</>
	);
});
export default TmInplanMessageSearch;
