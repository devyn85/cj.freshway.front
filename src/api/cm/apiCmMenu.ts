import axios from '@/api/Axios';

/**
 * 즐겨찾기 메뉴 목록 조회
 * @returns {object} 즐겨찾기 메뉴 목록
 */
const apiGetCmFavoriteMenuList = () => {
	return axios.get('/api/cm/menu/v1.0/getFavoriteMenuList').then(res => res.data);
};

/**
 * 즐겨찾기 메뉴 저장
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostAddCmFavoriteMenu = (params: any) => {
	return axios.post('/api/cm/menu/v1.0/insertFavoriteMenu', params).then(res => res);
};

/**
 * 즐겨찾기 메뉴 삭제
 * @param {any} params 등록 파라미터
 * @returns {object} 성공여부 결과값
 */
const apiPostRemoveCmFavoriteMenu = (params: any) => {
	return axios.post('/api/cm/menu/v1.0/deleteFavoriteMenu', params).then(res => res);
};

const apiGetMyMenuPopupList = (params: any) => {
	return axios.get('/api/cm/myMenu/v1.0/getMyMenuPopupList', { params }).then(res => res.data);
};

const apiGetMyFavoriteMenuList = (params: any) => {
	return axios.get('/api/cm/myMenu/v1.0/getMyFavoriteMenuList', { params }).then(res => res.data);
};

const apiSaveMyMenuList = (params: any) => {
	return axios.post('/api/cm/myMenu/v1.0/saveMyMenuPopupList', params).then(res => res);
};

export {
	apiGetCmFavoriteMenuList,
	apiGetMyFavoriteMenuList,
	apiGetMyMenuPopupList,
	apiPostAddCmFavoriteMenu,
	apiPostRemoveCmFavoriteMenu,
	apiSaveMyMenuList,
};
