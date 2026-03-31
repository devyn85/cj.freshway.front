// import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';
// import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

// import msZoneReducer from './msZoneStore';

// const rootReducer = combineReducers({
// 	msZone: msZoneReducer,
// });

// // config 작성
// const persistConfig = {
// 	key: 'root', // localStorage key
// 	storage, // localStorage
// 	// whitelist: ['user', 'tab'], // target (reducer name)
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = configureStore({
// 	reducer: persistedReducer,
// 	middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
// 	devTools: process.env.NODE_ENV !== 'production',
// });

// /**
//  * store init
//  * @param {object} preloadedState 사전 정의 state
//  * @returns {object} store object
//  */
// export function setupStore(preloadedState?: PreloadedState<RootState>) {
// 	return configureStore({
// 		reducer: persistedReducer,
// 		middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
// 		devTools: process.env.NODE_ENV !== 'production',
// 		preloadedState,
// 	});
// }

// export type RootState = ReturnType<typeof rootReducer>;
// export type AppStore = ReturnType<typeof setupStore>;
// export type AppDispatch = AppStore['dispatch'];
// export default store;
