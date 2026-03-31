/*
 ############################################################################
 # FiledataField	: CmCarSearch.tsx
 # Description		: 차량 조회 팝업
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.19
 # Modified		: 20251205@팝업요건 대응에 따른 공통 CommonPopupSearch 적용 by sss
 ############################################################################
*/
import { useTranslation } from 'react-i18next';

// component
import CmPopup from '@/components/cm/popup/CmCarPopup';
import CommonPopupSearch from '@/components/common/search/CommonPopupSearch';

// API Call Function
import { apiGetCmCarList } from '@/api/cm/apiCmSearch';

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
	placeholder?: string;
	// 팝업파라미터 정의
	customDccode?: string; // 커스텀 물류센터 코드
	carnoList?: string[]; // 차량번호 리스트
	controlRef?: any; // 외부에서 모달 제어
	//onConfirm?: (selected: any[]) => void; // 선택 후 콜백 - 미사용삭제
}

const CmCarSearch = (props: SearchProps) => {
	const { t } = useTranslation();
	// 팝업컴포넌트 공통 변수 정의(1/3) - 변경해야 할 것
	const strPrefixNm = t('차량');
	const apiFunction = apiGetCmCarList;
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
			placeholder={props.placeholder ?? t('msg.placeholder1', [strPrefixNm + 'ID 또는 이름'])}
			apiFunction={apiFunction}
			PopupComponent={comPopupComponent}
			// 팝업파라미터 정의(3/3)
			extraParams={{
				//
				customDccode: props.customDccode, // 커스텀 물류센터 코드
				carnoList: props.carnoList, // 차량번호 리스트 필터용
			}}
			modalWidth="1280px"
			dropdownColumns={dropdownColumns}
			callBack={props.callBack}
		/>
	);
};

export default CmCarSearch;
