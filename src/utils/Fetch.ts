/* eslint-disable @typescript-eslint/no-explicit-any */
import { urls } from '@api/urls';
import { store } from '@redux/configureStore';
import { hideLoader, showLoader } from '@redux/loader/actions';
import { clearSession, loginSession } from '@redux/session/actions';
import { LoginConstants } from '@constants/Login';
import {
    BAD_RESPONSE,
    FAILED_FETCH_MESSAGE,
    FORBIDDEN,
    INTERNAL_ERROR,
    MODAL_BAD_REQUEST,
    UNAUTHORIZED,
} from '@constants/StatusCodes';
import { ABORT_ERROR, STRING_TRUE } from '@constants/UtilsConstants';
import { ZERO } from '@pages/website-editor';
import localStorage from './LocalStorage';
import { isErrorResponse } from './Response';

interface IFetchInstance {
    request: (url: string, options: RequestInit) => Promise<any>;
    cancelAll: () => void;
}

const createInstance = (): IFetchInstance => {
    let countPetitions = ZERO;
    const controllers = new Set<AbortController>();
    
    return {
        request: async (url: string, options: RequestInit): Promise<any> => {
            countPetitions++;

            let headers = { ...options.headers };

            const isNotificationUrl = [
                urls.notification.latest,
                urls.notification.updateNotifications,
                urls.notification.unread,
            ].some(urlNotification => url.includes(urlNotification));

            if (countPetitions > ZERO && !isNotificationUrl) {
                store.dispatch(showLoader());
            }

            const userToken = localStorage.get(LoginConstants.USER_TOKEN);
            if (userToken) {
                headers = {
                    Authorization: `Bearer ${userToken}`,
                    ...headers,
                };
            }

            const controller = new AbortController();
            controllers.add(controller);

            const requestOptions: RequestInit = {
                ...options,
                headers,
                signal: controller.signal,
            };

            try {
                const response = await fetch(url, requestOptions);

                countPetitions--;
                controllers.delete(controller);

                if (!response.ok && !BAD_RESPONSE.includes(response?.status)) {
                    if (isErrorResponse(response?.status)) {
                        localStorage.set(MODAL_BAD_REQUEST, STRING_TRUE);
                    }
                    const jsonResponse = await response.json();
                    const validateDetail = String(jsonResponse.detail).includes(LoginConstants.TOKEN_EXPIRED);
                    if (jsonResponse.status === INTERNAL_ERROR && validateDetail) {
                        store.dispatch(clearSession());
                        store.dispatch(loginSession(true));
                    }

                    throw {
                        status: jsonResponse.status_code,
                        message: jsonResponse?.message || 'Network response was not ok',
                        data: jsonResponse,
                    };
                }

                if (countPetitions <= ZERO) {
                    store.dispatch(hideLoader());
                }

                return response;
            } catch (error: any) {
                countPetitions--;
                controllers.delete(controller);

                if (error.name === ABORT_ERROR) return Promise.reject({ aborted: true });

                try {
                    if (error.message === FAILED_FETCH_MESSAGE) {
                        localStorage.set(MODAL_BAD_REQUEST, 'true');
                    }
                } catch {
                    throw error;
                }

                if (error?.response && [UNAUTHORIZED, FORBIDDEN].includes(error?.response?.status)) {
                    localStorage.clearKey(LoginConstants.USER_TOKEN);
                    localStorage.clearKey(LoginConstants.USER_DATA);
                    if (error?.response?.status === UNAUTHORIZED) {
                        store.dispatch(clearSession());
                        store.dispatch(loginSession(true));
                    }
                }

                if (countPetitions <= ZERO) {
                    store.dispatch(hideLoader());
                }

                throw error;
            }
        },

        cancelAll: (): void => {
            controllers.forEach(c => c.abort());
            controllers.clear();
            countPetitions = ZERO;
            store.dispatch(hideLoader());
        },
    };
};

const instance = createInstance();

export default instance;
