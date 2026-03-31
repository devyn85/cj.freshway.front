/*
 ############################################################################
 # FiledataField	: CmSkuPopup.tsx
 # Description		: 상품조회팝업
 # Author			: JeongHyeongCheol
 # Since			: 25.05.09
 # Modified		: 20251205@팝업요건 대응에 따른 공통 CommonPopupSearch 적용 by sss
 ############################################################################
*/
import { useTranslation } from 'react-i18next';

// component
import CmSkuPopup from '@/components/cm/popup/CmSkuPopup';
import CommonPopupSearch from '@/components/common/search/CommonPopupSearch';

// API Call Function
import { apiGetSkuList } from '@/api/cm/apiCmSearch';

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
	kit?: string; // KIT상품
	callFrom?: string; // 호출하는곳(1:화주상품,2:KIT상품)
	organize?: any; // 창고
	custkey?: any; // 고객사코드
	allDataYn?: string; // 전체데이터 조회 여부 (Y/N)
}

const CmSkuSearch = (props: SearchProps) => {
	const { t } = useTranslation();
	// 팝업컴포넌트 공통 변수 정의(1/3) - 변경해야 할 것
	const strPrefixNm = t('상품');
	const apiFunction = apiGetSkuList;
	const comPopupComponent = CmSkuPopup;

	// 검색 시 드롭다운  컬럼
	const SkuDropdownColumns = [
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
				kit: props.kit,
				callFrom: props.callFrom, // 호출하는곳(1:화주상품,2:KIT상품)
				organize: props.form.getFieldValue('organize') || props.organize,
				custkey: props.form.getFieldValue('custkey') || props.custkey,
				allDataYn: props.allDataYn || 'Y', // 전체데이터 조회 여부 (Y/N) / 기본값  : Y(전체 상품 조회) / N(사용여부 - 정상 상품 조회)
			}}
			modalWidth="1280px"
			dropdownColumns={SkuDropdownColumns}
		/>
	);
};

export default CmSkuSearch;
