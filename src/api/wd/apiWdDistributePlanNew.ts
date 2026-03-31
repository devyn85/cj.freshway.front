import axios from '@/api/Axios';

/**
 * 미출예정확인(New) 미출예정 목록 조회(Tab1)
 * @param params
 * @returns
 */
const getMasterListTab1 = (params: any) => {
	return axios.post('/api/wd/distributePlanNew/v1.0/getMasterListTab1', params).then(res => res.data);
};

/**
 * 미출예정확인(New) 상품별 목록 조회(Tab2)
 * @param params
 * @returns
 */
const getMasterListTab2 = (params: any) => {
	return axios.post('/api/wd/distributePlanNew/v1.0/getMasterListTab2', params).then(res => res.data);
};

/**
 * 미출예정확인(New) 미출예정 목록 조회(Tab1) - 양산, 수도권, 장성, 제주, CJL, 선마감, 본마감
 * @param params
 * @returns
 */
const getMasterListTab1WithCondition = (params: any) => {
	return axios.post('/api/wd/distributePlanNew/v1.0/getMasterListTab1WithCondition', params).then(res => res.data);
};

export { getMasterListTab1, getMasterListTab1WithCondition, getMasterListTab2 };
