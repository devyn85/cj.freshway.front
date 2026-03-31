/*
 ############################################################################
 # FiledataField	: MsPlantXSLSearch.tsx
 # Description		: 저장위치정보 검색
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.18
 ############################################################################
*/
// lib
import { Form } from 'antd';

// component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SelectBox } from '@/components/common/custom/form';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// api
import { apigetPlantList } from '@/api/ms/apiMsPlantXSL';

// util

// hook

// type

// asset
interface MsPlantXSLProps {
	form: any;
}
const MsPlantXSLSearch = (props: MsPlantXSLProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const form = props.form;
	// 플랜트 옵션
	const [plantOptions, setPlantOptions] = useState<any[]>([]);
	const dccode = Form.useWatch('plant', form);
	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	/**
	 * 플랜트 옵션을 가져오는 함수
	 */
	const getPlantOptions = () => {
		apigetPlantList().then(res => {
			if (res.data) {
				setPlantOptions(res.data);
			}
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	// 최초 마운트시 초기화
	useEffect(() => {
		// getPlantOptions();
	}, []);

	return (
		<>
			<li>
				<CmGMultiDccodeSelectBox data-type={''} name={'dccode'} label={t('lbl.DCCODENAME')} required disabled />
			</li>
			<li>
				<CmOrganizeSearch
					form={form}
					name="organizeName"
					code="organize"
					dccode={'2170'}
					returnValueFormat="name"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<SelectBox
					name="qtyyn"
					span={24}
					options={getCommonCodeList('YN', '전체', null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.CURRENT_STOCK')}
				/>
			</li>
			<li>
				<SelectBox
					name="contractyn"
					span={24}
					placeholder="선택해주세요"
					options={getCommonCodeList('YN', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.CONTRACT_YN')}
				/>
			</li>
		</>
	);
};

export default MsPlantXSLSearch;
