/*
 ############################################################################
 # FiledataField	: CmCostCenterSearch.tsx
 # Description		: 귀속부서조회팝업
 # Author			: JeongHyeongCheol
 # Since			: 25.05.09
 # Modified		: 20251205@팝업요건 대응에 따른 공통 CommonPopupSearch 적용 by sss
 ############################################################################
*/
import { useTranslation } from 'react-i18next';

// component
import CmCostCenterPopup from '@/components/cm/popup/CmCostCenterPopup';
import CommonPopupSearch from '@/components/common/search/CommonPopupSearch';

// API Call Function
import { apiGetCostCenterList } from '@/api/cm/apiCmSearch';

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
	dummy?: string;
}

const CmCostCenterSearch = (props: SearchProps) => {
	const { t } = useTranslation();
	// 팝업컴포넌트 공통 변수 정의(1/3) - 변경해야 할 것
	const strPrefixNm = t('귀속부서');
	// wrap api function to always return a Promise (api may return false or Promise)
	const apiFunction = (params: any) => {
		const result = apiGetCostCenterList(params);
		return result === false ? Promise.resolve(false) : result;
	};
	const comPopupComponent = CmCostCenterPopup;

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
			placeholder={t('msg.placeholder1', [strPrefixNm + '코드 또는 이름'])}
			apiFunction={apiFunction}
			PopupComponent={comPopupComponent}
			// 팝업파라미터 정의(3/3)
			extraParams={{
				dummy: props?.dummy, // dummy - 귀속부서조회팝업은 현재 파라미터 없음
			}}
			modalWidth="1280px"
			dropdownColumns={locationDropdownColumns}
		/>
	);
};

export default CmCostCenterSearch;
