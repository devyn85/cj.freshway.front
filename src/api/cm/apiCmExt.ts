import axios from '@/api/Axios';

/**
 * IAM에 SSO처리를 위해  1회용 Ticket 요청
 * @returns {object} 성공여부 결과값
 */
const apiGetSSOTicket = () => {
	return axios
		.get('/api/cm/ext/v1.0/getSSOTicket', {
			withCredentials: false, // 쿠키 전송하지 않음
		})
		.then(res => res.data);
};

export { apiGetSSOTicket };
