import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// Biz Reducers
import msCarGroup from '../biz/msCarGroupStore';
import msCarrierStore from '../biz/msCarrierStore';
import msOrganizeStore from '../biz/msOrganize';
import msPlantStore from '../biz/msPlantStore';
import msZoneStore from '../biz/msZoneStore';

// Core Reducers
//import { reportStore } from '@/store/report/reportStore';
import reportReducer from '@/store/report/reportStore'; // default import로 변경
import tmDispatchReducer from '@/store/tm/tmDispatchStore';
import tmTempMonitorReducer from '@/store/tm/tmTempMonitorStore';
import comCodeReducer from './comCodeStore';
import globalReducer from './globalStore';
import layoutReducer from './layoutStore';
import loadingReducer from './loadingStore';
import menuReducer from './menuStore';
import tabReducer from './tabStore';
import translationReducer from './translationStore';
import userReducer from './userStore';

const rootReducer = combineReducers({
	menu: menuReducer,
	user: userReducer,
	tab: tabReducer,
	loading: loadingReducer,
	comCode: comCodeReducer,
	global: globalReducer,
	layout: layoutReducer,
	msZone: msZoneStore,
	msPlant: msPlantStore,
	msCarrier: msCarrierStore,
	report: reportReducer,
	tmDispatch: tmDispatchReducer,
	msOrganize: msOrganizeStore, // 20250921@창고SELECTBOX를 위한 store 추가 by sss
	translation: translationReducer,
	tmTempMonitor: tmTempMonitorReducer,
	msCarGroup: msCarGroup,
});

// config 작성
const persistConfig = {
	key: 'root', // localStorage key
	storage, // localStorage
	whitelist: ['user', 'tab', 'report'], // target (reducer name)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// export function setupStore(preloadedState?: PreloadedState<RootState>) {
// 	return configureStore({
// 		reducer: rootReducer,
// 		devTools: process.env.NODE_ENV !== 'production',
// 		preloadedState,
// 	});
// }

const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
	devTools: process.env.NODE_ENV !== 'production',
});

/**
 * store init
 * @param {object} preloadedState 사전 정의 state
 * @returns {object} store object
 */
export function setupStore(preloadedState?: PreloadedState<RootState>) {
	return configureStore({
		reducer: persistedReducer,
		middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
		devTools: process.env.NODE_ENV !== 'production',
		preloadedState,
	});
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
// export default rootReducer;
export default store;
