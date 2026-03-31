import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, Rangepicker } from '@/components/common/custom/form';
import { FormInstance } from 'antd/lib/form';
import dayjs from 'dayjs';

interface TmLocationMonitorHistorySearchProps {
	form: FormInstance;
}

const TmLocationMonitorHistorySearch = ({ form }: TmLocationMonitorHistorySearchProps) => {
	return (
		<>
			{/* 이력일시 */}
			<li>
				<Rangepicker label="이력일시" defaultValue={[dayjs(), dayjs()]} name="date" format="YYYY-MM-DD" />
			</li>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					label="물류센터"
					name="dccode"
					span={24}
					placeholder="선택해주세요"
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{/* 차량번호 */}
			<li>
				<CmCarSearch form={form} code="carno" name="carnoListName" label={'차량번호'} selectionMode="multipleRows" />
			</li>
			{/* 사용자 */}
			<li>
				<InputText name="username" label="사용자" placeholder="사용자를 입력해주세요." />
			</li>
		</>
	);
};

export default TmLocationMonitorHistorySearch;
