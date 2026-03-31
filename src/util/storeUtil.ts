/*
 ############################################################################
 # FiledataField	: storeUtil
 # Description		: Store에 대한 Util
 # Author			: JGS
 # Since			: 25.05.19
 ############################################################################
*/
import React from 'react';

// Store
import { getFindMenu } from '@/store/core/menuStore';

class storeUtil extends React.Component {
	/**
	 * 현재 메뉴 정보
	 * @returns {*} 현재 메뉴 정보
	 */
	static getMenuInfo = (): any => {
		return getFindMenu(location.pathname);
	};
}
export default storeUtil;
