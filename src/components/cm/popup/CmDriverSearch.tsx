/*
 ############################################################################
 # FiledataField : CmDriverSearch.tsx
 # Description   : 기사정보 조회 검색 컴포넌트
 # Author        : ParkJinWoo
 # Since         : 25.05.21
 # Modified		: 20251205@팝업요건 대응에 따른 공통 CommonPopupSearch 적용 by sss
 ############################################################################
*/
import { useTranslation } from 'react-i18next';

// component
import CmPopup from '@/components/cm/popup/CmDriverPopup';
import CommonPopupSearch from '@/components/common/search/CommonPopupSearch';

// API Call Function
import { apiGetCmDriverList } from '@/api/cm/apiCmSearch';

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
	// 팝업파라미터 정의
	nameOnly?: boolean;
	//carrierType?: string; // 운송사유형
}

const CmDriverSearch = (props: SearchProps) => {
	const { t } = useTranslation();
	// 팝업컴포넌트 공통 변수 정의(1/3) - 변경해야 할 것
	const strPrefixNm = t('기사');
	const apiFunction = apiGetCmDriverList;
	const comPopupComponent = CmPopup;

	// 검색 시 드롭다운  컬럼
	const dropdownColumns = [
		{ key: 'code' as const, title: strPrefixNm + 'ID' },
		{ key: 'name' as const, title: strPrefixNm + '명', className: 'txt-l' },
	];

	return (
		// 팝업컴포넌트 정의(2/3)
		<CommonPopupSearch
			{...props}
			label={props.label ?? strPrefixNm + 'ID/명'}
			placeholder={t('msg.placeholder1', [strPrefixNm + 'ID 또는 이름'])}
			apiFunction={apiFunction}
			PopupComponent={comPopupComponent}
			// 팝업파라미터 정의(3/3)
			extraParams={{
				disableOnBlurClear: true, // 자동삭제 방지
			}}
			modalWidth="1280px"
			dropdownColumns={dropdownColumns}
			callBack={props.callBack}
		/>
	);
};

export default CmDriverSearch;
