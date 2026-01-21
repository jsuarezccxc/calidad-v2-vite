/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { useHistory } from 'react-router-dom';
import { RootState } from '@redux/rootReducer';
import { ICreateAccount } from '@models/User';
import { ILoginData } from '@models/Login';
import { IGenericRecord } from '@models/GenericRecord';
import { FetchRequest } from '@models/Request';
import { apiPostUsers, apiValidatemigrationAccount } from '@api/users';
import { apiGetCompany, apiPostCompanyAccountCreated } from '@api/company';
import { urls } from '@api/urls';
import { getRoute } from '@utils/Paths';
import { isCorrectResponse } from '@utils/Response';
import { lengthGreaterThanZero } from '@utils/Length';
import { Routes } from '@constants/Paths';
import { FORBIDDEN } from '@constants/StatusCodes';
import { CompanyActions } from '@redux/company/types';
import { setCompany } from '@redux/company/actions';
import { setMembershipSelected } from '@redux/membership/actions';
import { MembershipActions } from '@redux/membership/types';
import { INITIAL_COMPANY } from '@constants/Company';
import {
    LOGIN_RESPONSE_ACTIVE_MESSAGE,
    LOGIN_RESPONSE_ANY_MESSAGE,
    LOGIN_RESPONSE_WITHOUT_ELECTRONIC_DOCUMENTS,
} from '@components/login-modals';
import {
    ISetSession,
    IFailedSession,
    IClearSession,
    ActionKeys,
    SessionActions,
    ISetLogin,
    ISetAuthorizationModal,
    IClearAttempts,
    IClearErrors,
    ISetFreeFinishModal,
    contentTypeCaptcha,
    ISetShowErrorCreate,
    ISetExpirationPlan,
    ISetLastNotificationDate,
    ISetModalLoginResponseWithoutActivePlans,
    ISetModalLoginResponseWithoutAnyPlans,
    ISetModalLoginResponseWithoutElectronicDocuments,
} from './types';

export const setSession = (
    accessToken: string,
    expirationTime: number,
    user: IGenericRecord,
    is_administration_customer = false
): ISetSession => ({
    type: ActionKeys.SET_SESSION,
    accessToken,
    is_administration_customer,
    expirationTime,
    user,
});

export const failedSession = (error: string): IFailedSession => ({
    type: ActionKeys.FAILED_SESSION,
    error,
});

export const clearSession = (): IClearSession => ({
    type: ActionKeys.CLEAR_SESSION,
});

export const clearErrors = (): IClearErrors => ({
    type: ActionKeys.CLEAR_ERRORS,
});

export const loginSession = (show: boolean): ISetLogin => ({
    type: ActionKeys.SET_LOGIN,
    show,
});

export const setErrorCreateUser = (show: boolean): ISetShowErrorCreate => ({
    type: ActionKeys.SET_SHOW_ERROR_CREATE,
    show,
});

export const setAuthorizationModal = (): ISetAuthorizationModal => ({
    type: ActionKeys.SET_AUTHORIZATION_MODAL,
});

export const setCreateAccountModal = (): any => ({
    type: ActionKeys.SET_CREATE_ACCOUNT_MODAL,
});

export const setAccountCreatedModal = (): any => ({
    type: ActionKeys.SET_ACCOUNT_CREATED_MODAL,
});
export const setDataCompanyLanding = (): any => ({
    type: ActionKeys.SET_DATA_COMPANY_LANDING,
});

export const setComesToAccountCreated = (): any => ({
    type: ActionKeys.SET_COMES_ACCOUNT_CREATED,
});

export const setComesToCreateAccount = (): any => ({
    type: ActionKeys.SET_COMES_CREATE_ACCOUNT,
});

export const setLoginModal = (): any => ({
    type: ActionKeys.SET_LOGIN_MODAL,
});

export const setCloseLoginModal = (): any => ({
    type: ActionKeys.CLOSE_LOGIN,
});

export const clearAttempts = (): IClearAttempts => ({
    type: ActionKeys.CLEAR_ATTEMPTS,
});

export const setFreeFinishModal = (freeFinishModal: boolean): ISetFreeFinishModal => ({
    type: ActionKeys.SET_FREE_FINISH_MODAL,
    freeFinishModal,
});

export const setExpirationPlan = (): ISetExpirationPlan => ({
    type: ActionKeys.SET_EXPIRATION_PLAN,
});

export const setLastNotificationPlanDate = (dates: IGenericRecord): ISetLastNotificationDate => ({
    type: ActionKeys.SET_LAST_NOTIFICATION_DATE,
    dates,
});

export const setModalLoginResponseWithoutActivePlans = (): ISetModalLoginResponseWithoutActivePlans => ({
    type: ActionKeys.SET_MODAL_LOGIN_RESPONSE_WITHOUT_ACTIVE_PLANS,
});

export const setModalLoginResponseWithoutAnyPlans = (): ISetModalLoginResponseWithoutAnyPlans => ({
    type: ActionKeys.SET_MODAL_LOGIN_RESPONSE_WITHOUT_ANY_PLANS,
});

export const setModalLoginResponseWithoutElectronicDocuments = (): ISetModalLoginResponseWithoutElectronicDocuments => ({
    type: ActionKeys.SET_MODAL_LOGIN_RESPONSE_WITHOUT_ELECTRONIC_DOCUMENTS,
});

export const login = (
    { email, password, recaptchaValue }: ILoginData,
    url: string
): ThunkAction<Promise<void>, RootState, unknown, SessionActions> => {
    return async (
        dispatch: ThunkDispatch<RootState, unknown, SessionActions | CompanyActions | MembershipActions>
    ): Promise<void> => {
        try {
            if (email === process.env.REACT_APP_EMAIL_AUTOMATION) {
                const array = new Uint8Array(Math.random());
                crypto.getRandomValues(array);
                recaptchaValue = btoa(String.fromCharCode(...array)).slice(0, Math.random() * 2);
            }
            const request = new FetchRequest(urls.login, { email, password, is_account_created: false });
            const response: any = await apiPostUsers(request, { ...contentTypeCaptcha, Recaptcha: recaptchaValue ?? '' });
            dispatch(
                setSession(
                    response.data.access_token,
                    response.data.expires_in_unix,
                    response.data.user,
                    response.data.is_administration_customer
                )
            );
            const { company_id } = response.data.user;

            const fetchRequest = new FetchRequest(urls.company.get(company_id));
            const dataCompany: any = await apiGetCompany(fetchRequest);
            dispatch(
                setCompany({
                    ...dataCompany.data,
                    ciius: lengthGreaterThanZero(dataCompany.data.ciius) ? dataCompany.data.ciius : INITIAL_COMPANY.ciius,
                })
            );
            dispatch(setMembershipSelected(dataCompany?.data.active_memberships));
            dispatch(setFreeFinishModal(true));
            useHistory().push(url);
        } catch (error: any) {
            if (error.status === FORBIDDEN && error.message === LOGIN_RESPONSE_ANY_MESSAGE) {
                dispatch(setModalLoginResponseWithoutAnyPlans());
                return;
            }

            if (error.status === FORBIDDEN && error.message === LOGIN_RESPONSE_ACTIVE_MESSAGE) {
                dispatch(setModalLoginResponseWithoutActivePlans());
                return;
            }

            if (error.status === FORBIDDEN && error.message === LOGIN_RESPONSE_WITHOUT_ELECTRONIC_DOCUMENTS) {
                dispatch(setModalLoginResponseWithoutElectronicDocuments());
                return;
            }

            dispatch(failedSession('*Ingrese un email y/o contraseña válidos'));
        }
    };
};

export const createAccount = (
    data: ICreateAccount,
    recaptchaValue: string
): ThunkAction<Promise<unknown>, RootState, unknown, SessionActions> => {
    return async (
        dispatch: ThunkDispatch<RootState, unknown, SessionActions | CompanyActions | MembershipActions>
    ): Promise<unknown> => {
        try {
            const request = new FetchRequest(urls.register, data);
            const response: any = await apiPostUsers(request, { ...contentTypeCaptcha, Recaptcha: recaptchaValue });
            if (isCorrectResponse(response.statusCode)) {
                dispatch(setComesToCreateAccount());
                const { company_id } = response.data.user;
                dispatch(
                    setSession(
                        response.data.access_token,
                        response.data.expires_in_unix,
                        response.data.user,
                        response.data.is_administration_customer
                    )
                );
                const fetchRequest = new FetchRequest(urls.company.get(company_id));
                const dataCompany: any = await apiGetCompany(fetchRequest);
                dispatch(
                    setCompany({
                        ...dataCompany.data,
                        ciius: lengthGreaterThanZero(dataCompany.data.ciius) ? dataCompany.data.ciius : INITIAL_COMPANY.ciius,
                    })
                );
                dispatch(setFreeFinishModal(true));
                useHistory().push(getRoute(Routes.PURCHASING_PROCESS));
            }
            dispatch(failedSession(''));
            if (response?.response?.data?.errors?.document_type) {
                dispatch(setErrorCreateUser(true));
            }
            return response;
        } catch (error: any) {
            dispatch(failedSession(''));
        }
    };
};

export const validateMigrationAccount = (email: string): ThunkAction<Promise<unknown>, RootState, unknown, SessionActions> => {
    return async (): Promise<unknown> => {
        try {
            const request = new FetchRequest(urls.migrationAccout, { email });
            const response: any = await apiValidatemigrationAccount(request);
            if (isCorrectResponse(response.statusCode)) {
                const { is_migrated } = response.data;
                return is_migrated;
            }
        } catch (error: any) {
            return false;
        }
    };
};

export const accountCreated = ({
    email,
    password,
    recaptchaValue,
}: ILoginData): ThunkAction<Promise<void>, RootState, unknown, SessionActions> => {
    return async (
        dispatch: ThunkDispatch<RootState, unknown, SessionActions | CompanyActions | MembershipActions>
    ): Promise<void> => {
        try {
            const request = new FetchRequest(urls.login, { email, password, is_account_created: true });
            const response: any = await apiPostUsers(request, { ...contentTypeCaptcha, Recaptcha: recaptchaValue ?? '' });

            dispatch(setComesToAccountCreated());
            const { company_id } = response.data.user;
            dispatch(setMembershipSelected(response?.data?.company?.active_memberships));
            dispatch(
                setSession(
                    response.data.access_token,
                    response.data.expires_in_unix,
                    response.data.user,
                    response.data.is_administration_customer
                )
            );
            const fetchRequest = new FetchRequest(urls.company.get(company_id));
            const dataCompany: any = await apiGetCompany(fetchRequest);
            dispatch(
                setCompany({
                    ...dataCompany.data,
                    ciius: lengthGreaterThanZero(dataCompany.data.ciius) ? dataCompany.data.ciius : INITIAL_COMPANY.ciius,
                })
            );
            dispatch(setAccountCreatedModal());
            dispatch(setDataCompanyLanding());
            dispatch(setFreeFinishModal(true));
            useHistory().push(getRoute(Routes.COMPANY_DATA_LANDING));

            if (response?.response?.data?.errors?.document_type) {
                dispatch(setErrorCreateUser(true));
            }
        } catch (error: any) {
            dispatch(failedSession('*Ingrese un email y/o contraseña válidos'));
        }
    };
};

export const updateDataCompanyAccountCreated = (
    dataRequest: IGenericRecord
): ThunkAction<Promise<void>, RootState, unknown, CompanyActions> => {
    return async (dispatch: ThunkDispatch<RootState, unknown, CompanyActions | SessionActions>, getState): Promise<void> => {
        try {
            const { session } = getState();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const request = new FetchRequest(urls.company.updateCompanyAccountCreated, dataRequest);
            const { data, statusCode }: any = await apiPostCompanyAccountCreated(request);
            if (statusCode === 200) {
                if (session.accessToken)
                    dispatch(
                        setCompany({
                            ...data.company,
                            name: data.name,
                            company_representative_name: data.company_representative_name,
                            phone: data.phone,
                            document_number: data.document_number,
                        })
                    );
            }
            return statusCode;
        } catch (error) {
            dispatch(failedSession(String(error)));
        }
    };
};
