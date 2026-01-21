import { IGenericRecord } from '@models/GenericRecord';

/**
 * Enum for session-related action keys
 */
export enum ActionKeys {
    SET_SESSION = 'SET_SESSION',
    FAILED_SESSION = 'FAILED_SESSION',
    CLEAR_SESSION = 'CLEAR_SESSION',
    CLEAR_ERRORS = 'CLEAR_ERRORS',
    SET_LOGIN = 'SET_LOGIN',
    SET_AUTHORIZATION_MODAL = 'SET_AUTHORIZATION_MODAL',
    SET_CREATE_ACCOUNT_MODAL = 'SET_CREATE_ACCOUNT_MODAL',
    SET_ACCOUNT_CREATED_MODAL = 'SET_ACCOUNT_CREATED_MODAL',
    SET_DATA_COMPANY_LANDING = 'SET_DATA_COMPANY_LANDING',
    SET_COMES_ACCOUNT_CREATED = 'SET_COMES_ACCOUNT_CREATED',
    SET_COMES_CREATE_ACCOUNT = 'SET_COMES_CREATE_ACCOUNT',
    SET_LOGIN_MODAL = 'SET_LOGIN_MODAL',
    SET_FREE_FINISH_MODAL = 'SET_FREE_FINISH_MODAL',
    CLEAR_ATTEMPTS = 'CLEAR_ATTEMPTS',
    CLOSE_LOGIN = 'CLOSE_LOGIN',
    SET_SHOW_ERROR_CREATE = 'SET_SHOW_ERROR_CREATE',
    SET_EXPIRATION_PLAN = 'SET_EXPIRATION_PLAN',
    SET_LAST_NOTIFICATION_DATE = 'SET_LAST_NOTIFICATION_DATE',
    SET_MODAL_LOGIN_RESPONSE_WITHOUT_ACTIVE_PLANS = 'SET_MODAL_LOGIN_RESPONSE_WITHOUT_ACTIVE_PLANS',
    SET_MODAL_LOGIN_RESPONSE_WITHOUT_ANY_PLANS = 'SET_MODAL_LOGIN_RESPONSE_WITHOUT_ANY_PLANS',
    SET_MODAL_LOGIN_RESPONSE_WITHOUT_ELECTRONIC_DOCUMENTS = 'SET_MODAL_LOGIN_RESPONSE_WITHOUT_ELECTRONIC_DOCUMENTS',
}

/**
 * Default content type for Captcha requests
 */
export const contentTypeCaptcha = { 'Content-Type': 'application/json; charset=utf-8' };

/**
 * Action to set the user session
 */
export interface ISetSession {
    type: ActionKeys.SET_SESSION;
    accessToken: string;
    is_administration_customer: boolean;
    expirationTime: number;
    user: IGenericRecord;
}

/**
 * Action for failed session attempts
 */
export interface IFailedSession {
    type: ActionKeys.FAILED_SESSION;
    error: string;
}

/**
 * Action to clear the user session
 */
export interface IClearSession {
    type: ActionKeys.CLEAR_SESSION;
}

/**
 * Action to clear session-related errors
 */
export interface IClearErrors {
    type: ActionKeys.CLEAR_ERRORS;
}

/**
 * Action to set the login modal visibility
 */
export interface ISetLogin {
    type: ActionKeys.SET_LOGIN;
    show: boolean;
}

/**
 * Action to close the login modal
 */
export interface ISetCloseLogin {
    type: ActionKeys.CLOSE_LOGIN;
}

/**
 * Action to show the authorization modal
 */
export interface ISetAuthorizationModal {
    type: ActionKeys.SET_AUTHORIZATION_MODAL;
}

/**
 * Action to show the create account modal
 */
export interface ISetCreateAccountModal {
    type: ActionKeys.SET_CREATE_ACCOUNT_MODAL;
}

/**
 * Action to show the account created confirmation modal
 */
export interface ISetAccountCreatedModal {
    type: ActionKeys.SET_ACCOUNT_CREATED_MODAL;
}

/**
 * Action to set the company landing page data
 */
export interface ISetDataCompanyLanding {
    type: ActionKeys.SET_DATA_COMPANY_LANDING;
}

/**
 * Action to indicate that the user comes from the account created modal
 */
export interface ISetComesAccountCreated {
    type: ActionKeys.SET_COMES_ACCOUNT_CREATED;
}

/**
 * Action to indicate that the user comes from the create account modal
 */
export interface ISetComesCreateAccount {
    type: ActionKeys.SET_COMES_CREATE_ACCOUNT;
}

/**
 * Action to show the login modal
 */
export interface ISetLoginModal {
    type: ActionKeys.SET_LOGIN_MODAL;
}

/**
 * Action to clear the login attempts count
 */
export interface IClearAttempts {
    type: ActionKeys.CLEAR_ATTEMPTS;
}

/**
 * Action to set the visibility of the free finish modal
 */
export interface ISetFreeFinishModal {
    type: ActionKeys.SET_FREE_FINISH_MODAL;
    freeFinishModal: boolean;
}

/**
 * Action to show or hide the user creation error modal
 */
export interface ISetShowErrorCreate {
    type: ActionKeys.SET_SHOW_ERROR_CREATE;
    show: boolean;
}

/**
 * Action to set the expiration plan date
 */
export interface ISetExpirationPlan {
    type: ActionKeys.SET_EXPIRATION_PLAN;
}

/**
 * Action to set the last notification date for expiration alerts
 */
export interface ISetLastNotificationDate {
    type: ActionKeys.SET_LAST_NOTIFICATION_DATE;
    dates: IGenericRecord;
}

/**
 * Action to show the modal for login response without active plans
 */
export interface ISetModalLoginResponseWithoutActivePlans {
    type: ActionKeys.SET_MODAL_LOGIN_RESPONSE_WITHOUT_ACTIVE_PLANS;
}

/**
 * Action to show the modal for login response without any plans
 */
export interface ISetModalLoginResponseWithoutAnyPlans {
    type: ActionKeys.SET_MODAL_LOGIN_RESPONSE_WITHOUT_ANY_PLANS;
}

/**
 * Action to show the modal for login response without electronic documents
 */
export interface ISetModalLoginResponseWithoutElectronicDocuments {
    type: ActionKeys.SET_MODAL_LOGIN_RESPONSE_WITHOUT_ELECTRONIC_DOCUMENTS;
}

/**
 * Type representing all possible session-related actions
 */
export type SessionActions =
    | ISetSession
    | IFailedSession
    | IClearSession
    | ISetAuthorizationModal
    | ISetCreateAccountModal
    | ISetAccountCreatedModal
    | ISetDataCompanyLanding
    | ISetComesAccountCreated
    | ISetComesCreateAccount
    | ISetLoginModal
    | IClearAttempts
    | ISetLogin
    | ISetFreeFinishModal
    | IClearErrors
    | ISetCloseLogin
    | ISetShowErrorCreate
    | ISetExpirationPlan
    | ISetLastNotificationDate
    | ISetModalLoginResponseWithoutActivePlans
    | ISetModalLoginResponseWithoutAnyPlans
    | ISetModalLoginResponseWithoutElectronicDocuments;
