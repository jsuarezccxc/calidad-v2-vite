import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store, persistor } from '@redux/configureStore';
import spanishJson from './translations/es/global.json';
import englishJson from './translations/en/global.json';
import { ES, EN, LANGUAGE, LANGUAGE_KEY } from '@constants/Translate';

i18next.init({
    interpolation: { escapeValue: false },
    lng: localStorage[LANGUAGE] || ES,
    resources: {
        [ES]: {
            [LANGUAGE_KEY]: spanishJson,
        },
        [EN]: {
            [LANGUAGE_KEY]: englishJson,
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <HelmetProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Router>
                        <I18nextProvider i18n={i18next}>
                            <App />
                        </I18nextProvider>
                    </Router>
                </PersistGate>
            </Provider>
        </HelmetProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
