/*
 ############################################################################
 # FiledataField	: CmOrganizeSearch.tsx
 # Description		: 창고조회팝업
 # Author			: JeongHyeongCheol
 # Since			: 25.05.09
 # Modified		: 20251205@팝업요건 대응에 따른 공통 CommonPopupSearch 적용 by sss
 ############################################################################
*/
import { useTranslation } from 'react-i18next';

// component
import CmOrganizePopup from '@/components/cm/popup/CmOrganizePopup';
import CommonPopupSearch from '@/components/common/search/CommonPopupSearch';

// API Call Function
import { apiGetOrganizePopupList } from '@/api/cm/apiCmSearch';

interface SearchProps {
	form: any;
	label?: string;
	selectionMode?: string;
	name: string;
	code: string;
	returnValueFormat?: string;
	required?: boolean;
	value?: string;
	disabled?: boolean;
	className?: string;
	// 팝업파라미터 정의
	dccode?: string | string[];
	dccodeDisabled?: boolean;
	placeholder?: string;
	extraParams?: any;
}

const CmOrganizeSearch = (props: SearchProps) => {
	const { t } = useTranslation();
	// 팝업컴포넌트 공통 변수 정의(1/3) - 변경해야 할 것
	const strPrefixNm = t('창고');
	const apiFunction = async (params: any) => {
		params.dccode = props.dccode?.toString() ?? '';
		const result = apiGetOrganizePopupList(params);
		return (await result) === false ? Promise.resolve(false) : result;
	};
	const comPopupComponent = CmOrganizePopup;

	// 검색 시 드롭다운 컬럼
	const locationDropdownColumns = [
		{ key: 'code' as const, title: strPrefixNm + '코드' },
		{ key: 'name' as const, title: strPrefixNm + '명', className: 'txt-l' },
	];

	return (
		// 팝업컴포넌트 정의(2/3)
		<CommonPopupSearch
			{...props}
			label={props.label ?? strPrefixNm + '코드/명'}
			placeholder={props.placeholder ?? t('msg.placeholder1', [strPrefixNm + '코드 또는 이름'])}
			apiFunction={apiFunction}
			PopupComponent={comPopupComponent}
			// 팝업파라미터 정의(3/3)
			extraParams={{
				dccode: props.dccode, // 센터코드
				dccodeDisabled: props.dccodeDisabled, // 센터Disabled여부
			}}
			modalWidth="1280px"
			dropdownColumns={locationDropdownColumns}
		/>
	);
};

export default CmOrganizeSearch;
