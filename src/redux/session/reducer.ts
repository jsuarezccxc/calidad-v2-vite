import { ZERO } from '@pages/website-editor';
import localStorage from '@utils/LocalStorage';
import { LoginConstants } from '@constants/Login';
import { IGenericRecord } from '@models/GenericRecord';
import { ActionKeys, SessionActions } from './types';

/**
 * Interface session state from redux
 *
 * @typeParam accessToken?: string - Optional acess token key
 * @typeParam is_administration_customer?: boolean - Optional access flag for admin panel
 * @typeParam user?: IGenericRecord - Optional object user login
 * @typeParam error?: string - Optional error reducer
 * @typeParam login?: boolean - Optional state to know if user is login
 * @typeParam authorizationModal?: boolean - Optional state to show modal authorization
 * @typeParam createAccountModal?: boolean - Optional state to show create account
 * @typeParam accountCreatedModal?: boolean - Optional state to show account created modal
 * @typeParam dataCompanyLanding?: boolean - Optional state to show company landing page
 * @typeParam comesAccountCreated?: boolean - Optional state to know if user comes to account created modal
 * @typeParam comesCreateAccount?: boolean - Optional state to know if user comes to create account modal
 * @typeParam loginModal?: boolean - Optional state to show login modal
 * @typeParam attempts: number - State to count attempts to login
 * @typeParam freeFinishModal?: boolean - Optional state to show free finish modal
 * @typeParam showErrorCreateUser?: boolean - Optional state to show error create user
 * @typeParam expirationPlan: number - State to know date expiration plan
 * @typeParam lastNotificationShown?: IGenericRecord - Optional state to know last dates notification expiration
 * @typeParam modalLoginResponseWithoutActivePlans?: boolean - Optional state to show modal to response login action without active plans
 * @typeParam modalLoginResponseWithoutAnyPlans?: boolean - Optional state to show modal to response login action without any plans
 */
interface ISessionState {
    accessToken?: string;
    is_administration_customer?: boolean;
    user?: IGenericRecord;
    error?: string;
    login?: boolean;
    authorizationModal?: boolean;
    createAccountModal?: boolean;
    accountCreatedModal?: boolean;
    dataCompanyLanding?: boolean;
    comesAccountCreated?: boolean;
    comesCreateAccount?: boolean;
    loginModal?: boolean;
    attempts: number;
    freeFinishModal?: boolean;
    showErrorCreateUser?: boolean;
    expirationTime?: number;
    expirationPlan: number;
    lastNotificationShown?: IGenericRecord;
    modalLoginResponseWithoutActivePlans?: boolean;
    modalLoginResponseWithoutAnyPlans?: boolean;
    modalLoginResponseWithoutElectronicDocuments?: boolean;
}

/**
 * Initial state for session reducer
 */
const initialState = {
    error: '',
    login: false,
    authorizationModal: false,
    createAccountModal: false,
    accountCreatedModal: false,
    dataCompanyLanding: false,
    comesAccountCreated: false,
    comesCreateAccount: false,
    loginModal: false,
    attempts: ZERO,
    freeFinishModal: false,
    showErrorCreateUser: false,
    expirationTime: ZERO,
    expirationPlan: ZERO,
    lastNotificationShown: {},
    modalLoginResponseWithoutActivePlans: false,
    modalLoginResponseWithoutAnyPlans: false,
    modalLoginResponseWithoutElectronicDocuments: false,
};

export const reducer = (state: ISessionState = initialState, action: SessionActions): ISessionState => {
    switch (action.type) {
        case ActionKeys.SET_SESSION:
            localStorage.set(LoginConstants.USER_TOKEN, action.accessToken);
            localStorage.setObject(LoginConstants.USER_DATA, action.user);
            return {
                ...state,
                accessToken: action.accessToken,
                is_administration_customer: action.is_administration_customer,
                user: action.user,
                attempts: ZERO,
                expirationTime: action.expirationTime,
            };

        case ActionKeys.FAILED_SESSION:
            return {
                ...state,
                error: action.error,
                attempts: state.attempts + 1,
            };

        case ActionKeys.SET_LOGIN:
            return { ...state, login: action.show };

        case ActionKeys.CLOSE_LOGIN:
            return { ...state, login: false };

        case ActionKeys.CLEAR_ERRORS:
            return { ...state, error: '' };

        case ActionKeys.CLEAR_SESSION:
            localStorage.clearKey(LoginConstants.USER_TOKEN);
            localStorage.clearKey(LoginConstants.USER_DATA);
            return { attempts: ZERO, expirationPlan: ZERO, expirationTime: ZERO };
        case ActionKeys.CLEAR_ATTEMPTS:
            return { ...state, attempts: ZERO };

        case ActionKeys.SET_AUTHORIZATION_MODAL:
            return { ...state, authorizationModal: !state.authorizationModal };

        case ActionKeys.SET_CREATE_ACCOUNT_MODAL:
            return { ...state, createAccountModal: !state.createAccountModal };

        case ActionKeys.SET_ACCOUNT_CREATED_MODAL:
            return { ...state, accountCreatedModal: !state.accountCreatedModal };

        case ActionKeys.SET_DATA_COMPANY_LANDING:
            return { ...state, dataCompanyLanding: !state.dataCompanyLanding };

        case ActionKeys.SET_COMES_ACCOUNT_CREATED:
            return { ...state, comesAccountCreated: !state.comesAccountCreated };

        case ActionKeys.SET_COMES_CREATE_ACCOUNT:
            return { ...state, comesCreateAccount: !state.comesCreateAccount };

        case ActionKeys.SET_LOGIN_MODAL:
            return { ...state, loginModal: !state.loginModal };

        case ActionKeys.SET_FREE_FINISH_MODAL:
            return { ...state, freeFinishModal: action.freeFinishModal };

        case ActionKeys.SET_EXPIRATION_PLAN:
            return { ...state, expirationPlan: (state?.expirationPlan || ZERO) + 1 };

        case ActionKeys.SET_SHOW_ERROR_CREATE:
            return { ...state, showErrorCreateUser: action.show };

        case ActionKeys.SET_LAST_NOTIFICATION_DATE:
            return { ...state, lastNotificationShown: action.dates };
        case ActionKeys.SET_MODAL_LOGIN_RESPONSE_WITHOUT_ACTIVE_PLANS:
            return { ...state, modalLoginResponseWithoutActivePlans: !state.modalLoginResponseWithoutActivePlans };
        case ActionKeys.SET_MODAL_LOGIN_RESPONSE_WITHOUT_ANY_PLANS:
            return { ...state, modalLoginResponseWithoutAnyPlans: !state.modalLoginResponseWithoutAnyPlans };
        case ActionKeys.SET_MODAL_LOGIN_RESPONSE_WITHOUT_ELECTRONIC_DOCUMENTS:
            return {
                ...state,
                modalLoginResponseWithoutElectronicDocuments: !state.modalLoginResponseWithoutElectronicDocuments,
            };
        default:
            return state;
    }
};
