import axios from '../Axios';

const apiCntrPickGroupBatchList = (params: any) => {
	return axios
		.get('/sample/cntr/pickingBatchGroup/search', {
			params,
		})
		.then(res => res.data);
};
const apiCntrPickGroupBatchDetail = (params: any) => {
	return axios
		.get('/sample/cntr/pickingBatchGroup/searchDetaile', {
			params,
		})
		.then(res => res.data);
};
const apiSaveCntrPickGroupBatch = (insertParams: any) => {
	return axios.post('/sample/cntr/pickingBatchGroup/save', { insertParams }).then(res => res.data);
};
const apiCntrPickGroupDcodeList = () => {
	return axios.get('/sample/cntr/pickingBatchGroup/getDccode', {}).then(res => res.data);
};
export { apiCntrPickGroupBatchDetail, apiCntrPickGroupBatchList, apiCntrPickGroupDcodeList, apiSaveCntrPickGroupBatch };
