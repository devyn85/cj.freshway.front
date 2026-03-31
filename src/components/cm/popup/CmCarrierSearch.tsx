/*
 ############################################################################
 # FiledataField	: CmCarrierSearch.tsx
 # Description		: 운송사 조회 팝업
 # Author			: KimSunHo	
 # Since			: 25.05.09
 # Modified		: 20251205@팝업요건 대응에 따른 공통 CommonPopupSearch 적용 by sss
 ############################################################################
*/
import { useTranslation } from 'react-i18next';

// component
import CmPopup from '@/components/cm/popup/CmCarrierPopup';
import CommonPopupSearch from '@/components/common/search/CommonPopupSearch';

// API Call Function
import { apiGetCarrierList } from '@/api/cm/apiCmSearch';

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
	callBack?: any;
}

const CmCarrierSearch = (props: SearchProps) => {
	const { t } = useTranslation();
	// 팝업컴포넌트 공통 변수 정의(1/3) - 변경해야 할 것
	const strPrefixNm = t('운송사');
	const apiFunction = apiGetCarrierList;
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
			extraParams={{
				carrierType: props.carrierType, // 운송사유형
				carrierTypeHiddenYn: props.carrierTypeHiddenYn, // 운송사유형 숨김여부
			}}
			modalWidth="1280px"
			dropdownColumns={dropdownColumns}
			callBack={props.callBack}
		/>
	);
};

export default CmCarrierSearch;
