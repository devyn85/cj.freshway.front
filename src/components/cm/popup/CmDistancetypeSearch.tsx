/*
 ############################################################################
 # FiledataField	: CmDistancetypeSearch.tsx
 # Description		: 원거리유형 조회 팝업
 # Author			: KimSunHo	
 # Since			: 26.03.10
 # Modified		: 20251205@팝업요건 대응에 따른 공통 CommonPopupSearch 적용 by sss
 ############################################################################
*/
import { useTranslation } from 'react-i18next';

// component
import CmPopup from '@/components/cm/popup/CmDistancetypePopup';
import CommonPopupSearch from '@/components/common/search/CommonPopupSearch';

// API Call Function
import { apiPostDistanceTypeList } from '@/api/cm/apiCmSearch';

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
	callBack?: any;
}

const CmDistancetypeSearch = (props: SearchProps) => {
	const { t } = useTranslation();
	// 팝업컴포넌트 공통 변수 정의(1/3) - 변경해야 할 것
	const strPrefixNm = t('원거리유형');
	const apiFunction = apiPostDistanceTypeList;
	const comPopupComponent = CmPopup;

	// 검색 시 드롭다운  컬럼
	const dropdownColumns = [
		{ key: 'code' as const, title: strPrefixNm },
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
			modalWidth="1280px"
			dropdownColumns={dropdownColumns}
			callBack={props.callBack}
		/>
	);
};

export default CmDistancetypeSearch;
