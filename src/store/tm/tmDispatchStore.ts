import type { TmSetDispatchResp } from '@/api/tm/apiTmDispatch';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type VehicleOperationSetting = {
	id: string;
	type: '고정' | '지입' | '임시';
	carNo: string;
	driverName: string;
	operationOn: boolean;
	driverRestDays: number[]; // 0(일)~6(토)
};

export type TmDispatchState = {
	lastResponse: TmSetDispatchResp | null;
	deliveryDate: string | null; // YYYYMMDD
	dccode: string | null;
	// 자동배차 실행 전, 주문 목록에서 저장해 두는 조건(페이지 전환 후 실행용)
	pendingCriteria: PendingDispatchCriteria | null;
	// 계획목록에서 배차조정으로 들어올 때 사용할 파라미터
	pendingAdjustParams: PendingAdjustParams | null;
	// 차량 운행 여부 설정 (배송일자별로 관리)
	vehicleOperationSettings: Record<string, VehicleOperationSetting[]>; // key: YYYYMMDD
};

export type PendingDispatchCriteria = {
	deliveryDate: string; // YYYYMMDD
	deliveryType: string; // e.g., 'WD'
	dccode?: string | null;
	custName?: string | null;
	custCode?: string | null;
	planOptionType?: number;
};

export type PendingAdjustParams = {
	deliveryDate: string; // YYYYMMDD
	dccode?: string | null;
	deliveryType?: string | null; // 'WD' 등
	regionCode?: string | null;
	carnoSearch?: string | null;
};

const initialState: TmDispatchState = {
	lastResponse: null,
	deliveryDate: null,
	pendingCriteria: null,
	dccode: null,
	pendingAdjustParams: null,
	vehicleOperationSettings: {},
};

const tmDispatchStore = createSlice({
	name: 'tmDispatch',
	initialState,
	reducers: {
		setTmDispatchResult(
			state,
			action: PayloadAction<{
				response: TmSetDispatchResp | null;
				deliveryDate?: string | null;
				dccode?: string | null;
				tmDeliveryType?: string | null;
			}>,
		) {
			state.lastResponse = action.payload?.response ?? null;
			state.deliveryDate = action.payload?.deliveryDate ?? null;
			state.dccode = action.payload?.dccode ?? null;
		},
		setPendingDispatchCriteria(state, action: PayloadAction<PendingDispatchCriteria | null>) {
			state.pendingCriteria = action.payload ?? null;
		},
		clearPendingDispatchCriteria(state) {
			state.pendingCriteria = null;
		},
		setPendingAdjustParams(state, action: PayloadAction<PendingAdjustParams | null>) {
			state.pendingAdjustParams = action.payload ?? null;
		},
		clearPendingAdjustParams(state) {
			state.pendingAdjustParams = null;
		},
		// 차량 운행 여부 설정 저장 (배송일자별)
		setVehicleOperationSettings(
			state,
			action: PayloadAction<{ deliveryDate: string; vehicles: VehicleOperationSetting[] }>,
		) {
			state.vehicleOperationSettings[action.payload.deliveryDate] = action.payload.vehicles;
		},
		// 차량 운행 여부 설정 초기화 (배송일자별)
		clearVehicleOperationSettings(state, action: PayloadAction<string>) {
			delete state.vehicleOperationSettings[action.payload];
		},
		clearTmDispatchResult(state) {
			state.lastResponse = null;
			state.deliveryDate = null;
		},
	},
});

export const {
	setTmDispatchResult,
	clearTmDispatchResult,
	setPendingDispatchCriteria,
	clearPendingDispatchCriteria,
	setPendingAdjustParams,
	clearPendingAdjustParams,
	setVehicleOperationSettings,
	clearVehicleOperationSettings,
} = tmDispatchStore.actions;
export default tmDispatchStore.reducer;
