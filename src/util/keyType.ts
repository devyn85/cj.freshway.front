import { getCommonCodeList } from '@/store/core/comCodeStore';

export const parseKeyType = (
	passwordType?: string,
	passwordTypeCd?: string,
): { showPasswordIcon: boolean; keyType?: string } => {
	const passwordTypeCodes = getCommonCodeList('CRM_DLV_KEYTYPE');

	if (passwordTypeCd) {
		const passwordTypeCode = passwordTypeCodes.find(code => code.comCd === passwordTypeCd);
		if (passwordTypeCode && passwordTypeCode.cdNm !== '없음') {
			return {
				showPasswordIcon: true,
				keyType: passwordTypeCode.cdNm,
			};
		}
	} else if (passwordType && passwordType !== '없음') {
		return {
			showPasswordIcon: true,
			keyType: passwordType,
		};
	}

	return {
		showPasswordIcon: false,
	};
};
