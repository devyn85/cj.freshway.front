// Component
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';

//Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
interface MsKitSearchProps {
	form: any;
	search: any;
	setSelectDcCode: any;
}

const MsKitSearch = ({ form, search, setSelectDcCode }: MsKitSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox
					name="dcCode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="single"
					label={'물류센터'}
					onChange={(event: any) => {
						setSelectDcCode(event);
					}}
				/>
			</li>
			<li>
				<CmSkuSearch
					form={form}
					selectionMode="multipleRows"
					name="kitSkuName"
					label={'KIT상품'}
					code="kitSku"
					returnValueFormat="name"
					kit={'Y'}
				/>
			</li>
			<li>
				<SelectBox
					name="delYn"
					placeholder="선택해주세요"
					options={getCommonCodeList('DEL_YN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'중단여부'}
				/>
			</li>
		</>
	);
};

export default MsKitSearch;
