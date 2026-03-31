import { createSlice } from '@reduxjs/toolkit';

export const globalStore = createSlice({
	name: 'global',
	initialState: {
		globalVariable: {
			gSystem: 'WMSAPP',
			gUserId: '',
			// gUserNm: '',
			// gUseStsCd: '',
			gStartSysCl: '',

			gAuthority: '',
			gStorerkey: '',
			gDccode: '',
			gDccodeNm: '',
			gDccodeNmOnlyNm: '',
			gOrganize: '',
			gArea: '',
			gMultiStorerkey: '',
			gMultiDccode: '',
			gMultiOrganize: '',
			gMultiArea: '',

			gEmpno: '',
			gComCd: '',
			gDeptCd: '',
			gDeptNm: '',
		},
	},
	reducers: {
		setGlobalVariable(state, action) {
			state.globalVariable = Object.assign({}, state.globalVariable, action.payload);
		},
		setInitGlobalStore(state) {
			state.globalVariable = globalStore.getInitialState().globalVariable;
		},
	},
});

export const { setGlobalVariable, setInitGlobalStore } = globalStore.actions;
export default globalStore.reducer;
