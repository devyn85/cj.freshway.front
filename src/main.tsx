// import ReactDOM from 'react-dom/client';
import React from 'react';
import ReactDOM from 'react-dom'; // React 17
import { BrowserRouter } from 'react-router-dom';

import { AliveScope } from 'react-activation';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import store from './store/core/coreStore';

import '@/lang/i18n';
import App from './App';

const persistor = persistStore(store);

/* eslint-disable */
ReactDOM.render(
	<CookiesProvider>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<BrowserRouter>
					<AliveScope>
						<React.StrictMode>
							<App />
						</React.StrictMode>
					</AliveScope>
				</BrowserRouter>
			</PersistGate>
		</Provider>
	</CookiesProvider>,
	document.getElementById('root'),
);
