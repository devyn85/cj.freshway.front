
export interface DriverInfoResponse {
  memberList: Array<{ driverId?: number; vehicle?: { licenseNumber?: string } }>; // minimal shape used in Timeline
}

export const getDriverInfo = async (): Promise<DriverInfoResponse> => {
  // TODO: Replace with real endpoint once available
  // return axios.get('/api/tm/driver/info').then(res => res.data);
  return { memberList: [] };
};

export default getDriverInfo;


