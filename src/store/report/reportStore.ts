// reportStore.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fileName: '',
  dataSet: {},
  params: '',
  title: '',
};

const reportStore = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setReportParams(state, action) {
      return { ...state, ...action.payload };
    },
    clearReportParams(state) {
      return initialState;
    },
  },
});

export const { setReportParams, clearReportParams } =
  reportStore.actions;
export default reportStore.reducer;