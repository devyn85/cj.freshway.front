export type { ReqTempReport } from '@/store/tm/tmTempMonitorStore';

import { useAppSelector, useAppDispatch } from '@/store/core/coreHook';
import { setReqTempReport, clearReqTempReport, ReqTempReport } from '@/store/tm/tmTempMonitorStore';

export const useReqTempReport = () => {
    const dispatch = useAppDispatch();
    const reqTempReport = useAppSelector(state => state.tmTempMonitor.reqTempReport);

    return {
        reqTempReport,
        setReqTempReport: (reqTempReport: ReqTempReport) => dispatch(setReqTempReport(reqTempReport)),
        clearReqTempReport: () => dispatch(clearReqTempReport()),
    }
}