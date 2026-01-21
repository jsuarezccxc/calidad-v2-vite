import { Modal, PaymentMethod } from '@models/PaymentPlans';
import { DEFAULT_RESPONSIBILITY } from '@utils/Company';
import { currentDateInUnix } from '@utils/Date';
import { CREDIT_CARD_OR_DEBIT_CARD } from '@constants/PaymentPlans';
import { IGenericRecord } from '@models/GenericRecord';
import { IconsNames } from '@components/icon';
import { PURCHASING_PROCESS_TEXTS } from '@information-texts/PurchasingProcess';
export { default } from './PurchasingProcess';

/**
 * This interface describes the modal props
 *
 * @typeParam [key: string]: (...args: IGenericRecord[]) => ISharedModalProps - It is a function that returns the properties of each modal according to its type
 */
interface IModalProps {
    [key: string]: (
        ...args: IGenericRecord[]
    ) => {
        text: { title: string; description: string | JSX.Element };
        iconName?: IconsNames;
        finalAction?: () => void;
        leftButton?: { action: () => void; text: string };
        finishButtonText?: string;
    };
}

/**
 * Initial purchase data
 */
export const DEFAULT_DATA = {
    fiscal_responsibilities: [DEFAULT_RESPONSIBILITY],
    paymentMethod: PaymentMethod.Card,
    department_id: '',
    truthfulInformation: false,
    clientIsOwner: false,
    annualPlan: true,
    documentPlan: null,
    websitePlan: null,
    diggitalSeller: null,
    organizationPlanning: null,
    card_expiration: currentDateInUnix(),
    queryParam: CREDIT_CARD_OR_DEBIT_CARD,
};

/**
 * It is used to save the purchased plan
 */
export enum PlanType {
    WebsitePlan = 'websitePlan',
    DocumentPlan = 'documentPlan',
    OrganizationPlanning = 'organizationPlanning',
    DiggitalSeller = 'diggitalSeller',
    CrmPlan = 'crm',
}

/**
 * Initial state of the modals
 */
export const MODALS: { [key in Modal]: boolean } = {
    [Modal.Delete]: false,
    [Modal.Success]: false,
    [Modal.Wrong]: false,
    [Modal.Declined]: false,
    [Modal.Pending]: false,
    [Modal.NotApproved]: false,
    [Modal.Approved]: false,
    [Modal.ApplicationApproved]: false,
    [Modal.ApplicationNotApproved]: false,
    [Modal.Inactivity]: false,
    [Modal.PlanAlreadyActive]: false,
    [Modal.PlanAlreadyPurchasedThisYear]: false,
};

/**
 * Modals that have no action when clicking accept
 */
export const MODALS_WITHOUT_ACTION: string[] = [Modal.ApplicationNotApproved, Modal.Inactivity];

/**
 * Props of each type of modal
 */
export const MODAL_PROPS: IModalProps = {
    [Modal.Delete]: (data: IGenericRecord, { deletePlan, planToDelete, closeModal }: IGenericRecord) => ({
        finalAction: deletePlan,
        text: PURCHASING_PROCESS_TEXTS.DELETE_PLAN(data?.[planToDelete]?.name),
        iconName: 'trashMulticolor',
        leftButton: { action: closeModal, text: 'Omitir' },
        finishButtonText: 'Eliminar',
    }),
};

/** Const for modules id */
export const ORGANIZATION_PLANNING_MODULE_ID = 5;
export const CRM_MODULE_ID = 18;
export const DIGGITAL_SELLER_MODULE_ID = 16;
export const WEBSITE_MODULE_ID = 2;
export const ELECTRONIC_DOCUMENTS_MODULE_ID = 3;

/**
 * Name of the module representing a website and virtual store.
 */
export const WEBSITE_MODULE = 'Sitio web y tienda virtual';

/**
 * Name of the module representing a digital seller.
 */
export const DIGGITAL_SELLER_MODULE = 'Vendedor diggital';

/**
 * Name of the module representing electronic documents.
 */
export const ELECTRONIC_DOCUMENTS_MODULE =
    'Documentos Electrónicos: Facturación electrónica, Documento Soporte, Notas débito y crédito, Notas de ajuste';

/**
 * Name of the module representing planning and organization tools.
 */
export const ORGANIZATION_PLANNING = 'Planeación y organización';

/**
 * Name of the module representing CRM.
 */
export const CRM = 'CRM';

/**
 * Constant for string "delete" variable to delete plans function
 */
export const DELETE_VARIABLE = 'delete';

/**
 * Constant for string "pse_response" variable to save pse response
 */
export const PSE_RESPONSE = 'PSE_RESPONSE';

/**
 * Enum for fields modal free plan
 */
export enum FIELDS {
    NUMBER_EMPLOYEES = 'numberEmployees',
    TOTAL_REVENUE = 'totalRevenue',
    ACCEPT_CHECKBOX = 'accept_checkbox',
}

/**
 * Initial data for company data for free plan
 */
export const INITIAL_DATA = {
    numberEmployees: undefined,
    totalRevenue: undefined,
    accept_checkbox: false,
};

/**
 * Initial data validation fields
 */
export const REQUIRED_DATA = {
    numberEmployees: {
        error: false,
        text: '',
    },
    totalRevenue: {
        error: false,
        text: '',
    },
    accept_checkbox: {
        error: false,
        text: '',
    },
};

/**
 * Interface for response dispatch validation free documents endpoint
 */
export interface IFreeMembershipResponse {
    message: string;
    statusCode: number;
    service: string;
    data: string;
}

/**
 * Const for response when user does not meet the requirements for the 15-document plan.
 */
export const VALIDATE_FREE_DOCUMENTS_REQUIREMENTS_NOT_MET = 'You do not meet the requirements for the plan';

/**
 * Const for response when user has used the 15 free documents but has not completed a year.
 */
export const VALIDATE_FREE_DOCUMENTS_USED_YEAR_NOT_OVER_YET = '15 free documents used, year not over yet';

/**
 * Const for response when user already has an active 15-document plan.
 */
export const VALIDATE_FREE_DOCUMENTS_ALREADY_ACTIVE = 'You already have an active 15 document plan';

/**
 * Const for response when user is eligible for the 15-document plan and has more than one plan added.
 */
export const VALIDATE_FREE_DOCUMENTS_ELIGIBLE_WITH_MULTIPLE_PLANS = 'It is valid for the 15 document plan';

/**
 * Const for response when the 15-document plan is successfully created.
 */
export const VALIDATE_FREE_DOCUMENTS_PLAN_CREATED = 'A 15 document plan has been created';
