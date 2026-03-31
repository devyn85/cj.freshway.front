import instance from '../Axios';

const ROOT_URL = '/api/tm/order';

/* ############################################################################
 * 주문 목록 조회
############################################################################ */
export const getTmOrderList = async (params: any) => {
	const url = `${ROOT_URL}/list`;
	const res = await instance.get(url, { params });
	return res.data;
};
