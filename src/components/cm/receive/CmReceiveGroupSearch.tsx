// Component
import { InputText } from '@/components/common/custom/form';

const CmReceiveGroupSearch = forwardRef((props: any, ref: any) => {
	return (
		<li>
			<InputText name="recvGroupNm" label="사용자 정의 그룹명" />
		</li>
	);
});

export default CmReceiveGroupSearch;
