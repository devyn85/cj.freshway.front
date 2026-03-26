import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ReqTempReport {
    reqNo: string;
    reqDoc: string;
    serialKey?: string;
    deliveryDt: string;
    custKey: string;
    custNm: string;
    dcCode: string;
    cdNm: string;
    targetTab?: 'vehicle' | 'detail';
}

export type TmTempMonitorState = {
    reqTempReport: ReqTempReport;
}

const initialState: TmTempMonitorState = {
    reqTempReport: {
        reqNo: '',
        reqDoc: '',
        serialKey: '',
        deliveryDt: '',
        custKey: '',
        custNm: '',
        dcCode: '',
        cdNm: '',
    },
}

const tmTempMonitorStore = createSlice({
    name: 'tmTempMonitor',
    initialState,
    reducers: {
        setReqTempReport(state, action: PayloadAction<ReqTempReport>) {
            state.reqTempReport = action.payload;
        },
        clearReqTempReport(state) {
            // state.reqTempReport = initialState.reqTempReport;
            state.reqTempReport = {
                reqNo: '',
                reqDoc: '',
                serialKey: '',
                deliveryDt: '',
                custKey: '',
                custNm: '',
                dcCode: '',
                cdNm: '',
                targetTab: undefined,
            };
        },
    },
});

export const { setReqTempReport, clearReqTempReport } = tmTempMonitorStore.actions;
export default tmTempMonitorStore.reducer;
