/*
 ############################################################################
 # FiledataField	: CmTcSearch.tsx
 # Description		: TC센터 조회 
 # Author			: ParkYosep	
 # Since			: 26.02.26
 # Modified		: 
 ############################################################################
*/
import { useTranslation } from 'react-i18next';

// component
import CmPopup from '@/components/cm/popup/CmTcPopup';
import CommonPopupSearch from '@/components/common/search/CommonPopupSearch';

// API Call Function
import { apiGetTcCodeCfgList } from '@/api/cm/apiCmSearch';

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
	carrierType?: string; // 운송사유형
	carrierTypeHiddenYn?: string; // 운송사유형 숨김여부
}

const CmTcSearch = (props: SearchProps) => {
	const { t } = useTranslation();
	// 팝업컴포넌트 공통 변수 정의(1/3) - 변경해야 할 것
	const strPrefixNm = t('TC센터');
	const apiFunction = apiGetTcCodeCfgList;
	// const apiFunction = apiGetCarrierList;

	const comPopupComponent = CmPopup;

	// 검색 시 드롭다운  컬럼
	const dropdownColumns = [
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
			// extraParams={{
			// 	carrierType: props.carrierType, // 운송사유형
			// 	carrierTypeHiddenYn: props.carrierTypeHiddenYn, // 운송사유형 숨김여부
			// }}
			modalWidth="1280px"
			dropdownColumns={dropdownColumns}
		/>
	);
};

export default CmTcSearch;
