import { Section } from '@components/bread-crumb';
import { IconsNames } from '@components/icon';
import { LEGAL_PERSON } from '@constants/DynamicRequest';
import { COLOMBIA_ID } from '@constants/Location';
import { CREDIT_CARD } from '@constants/PaymentMethods';
import { CREDIT_CARD_OR_DEBIT_CARD } from '@constants/PaymentPlans';
import { INFORMATION } from '@information-texts/PaymentPlans';
import { IGenericRecord } from '@models/GenericRecord';
import { Field, Modal, PaymentMethod, View } from '@models/PaymentPlans';
import { DEFAULT_RESPONSIBILITY } from '@utils/Company';
import { cardType } from '@utils/CreditCard';
import { currentDateInUnix, getDateFromUnix } from '@utils/Date';

export { default } from './PaymentPlans';

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
 * Transaction Responses
 */
export enum TransactionResponse {
    Approved = 'APPROVED',
    Declined = 'DECLINED',
}

/**
 * Routes for the breadcrumb
 *
 * @returns Section[]
 */
export const getRoutes = (activeView: View, { activateView, togglePlanView, queryParam }: IGenericRecord): Section[] => [
    {
        name: 'Planes de pago',
        route: '#',
        onClick: togglePlanView,
    },
    {
        name: 'Método de pago',
        route: '#',
        onClick: (): void => activateView(View.Method),
    },
    ...(queryParam
        ? [
              {
                  name: queryParam.replace('?', ''),
                  route: '#',
              },
          ]
        : []),
];

/**
 * Initial purchase data
 */
export const DEFAULT_DATA = {
    fiscal_responsibilities: [DEFAULT_RESPONSIBILITY],
    paymentMethod: PaymentMethod.Card,
    department_id: '',
    truthfulInformation: false,
    clientIsOwner: false,
    documentPlan: {},
    websitePlan: {},
    diggitalSeller: {},
    organizationPlanning: {},
    crm: {},
    card_expiration: currentDateInUnix(),
    queryParam: CREDIT_CARD_OR_DEBIT_CARD,
};

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
 * It is used to save the purchased plan
 */
export enum PlanType {
    WebsitePlan = 'websitePlan',
    DocumentPlan = 'documentPlan',
}

/**
 * This function returns the required fields
 *
 * @param data: IGenericRecord - Purchase data
 * @returns string[]
 */
export const getRequiredFields = (data: IGenericRecord): string[] => {
    const paymentWithoutPse = data.paymentMethod !== PaymentMethod.Pse;

    return [
        ...REQUIRED_FIELDS,
        ...(paymentWithoutPse && !data.clientIsOwner ? REQUIRED_HOLDER_FIELDS : []),
        ...(paymentWithoutPse ? REQUIRED_CARD_FIELDS : []),
        ...(data?.card_type_key === CREDIT_CARD ? [Field.Quotas] : []),
        ...(data[Field.CountryId] === COLOMBIA_ID ? [Field.DepartmentId, Field.CityId] : [Field.DepartmentName, Field.CityName]),
    ];
};

/**
 * This formats the selected plan to make the purchase
 *
 * @param data: IGenericRecord - Purchase data
 * @param plan: IGenericRecord - Selected plan
 * @returns IGenericRecord
 */
export const formatPlan = (data: IGenericRecord, plan: IGenericRecord): IGenericRecord => {
    const moduleIdCast = Number(plan.modules_id);
    const idModule = [ELECTRONIC_DOCUMENTS_MODULE_ID, WEBSITE_MODULE_ID].includes(moduleIdCast) ? moduleIdCast : plan.id;

    return {
        expiration_date: [ELECTRONIC_DOCUMENTS_MODULE_ID, WEBSITE_MODULE_ID].includes(moduleIdCast) ? ZERO : TWELVE,
        id: idModule,
        sub_modules: [ELECTRONIC_DOCUMENTS_MODULE_ID, WEBSITE_MODULE_ID].includes(moduleIdCast)
            ? [
                  {
                      id: plan.id,
                      expiration_date: TWELVE,
                  },
              ]
            : [],
    };
};

/**
 * This returns the submodules of the specified module
 *
 * @param data: IGenericRecord - Purchase data
 * @returns IGenericRecord[]
 */
const getSubmodules = (data: IGenericRecord): IGenericRecord[] => {
    const { websitePlan, documentPlan, organizationPlanning, diggitalSeller, crm } = data;
    const modules: IGenericRecord[] = [];
    if (documentPlan?.id) modules.push(formatPlan(data, documentPlan));
    if (websitePlan?.id) modules.push(formatPlan(data, websitePlan));
    if (organizationPlanning?.id) modules.push(formatPlan(data, organizationPlanning));
    if (diggitalSeller?.id) modules.push(formatPlan(data, diggitalSeller));
    if (crm?.id) modules.push(formatPlan(data, crm));
    return modules;
};

/**
 * This returns the names of the specified module
 *
 * @param data: IGenericRecord - Purchase data
 * @returns string
 */
const getDescription = (data: IGenericRecord): string => {
    const { websitePlan, documentPlan, organizationPlanning, diggitalSeller, crm } = data;

    const names: string[] = [];

    if (documentPlan?.id) {
        const quantity = documentPlan.quantity ?? ZERO;
        names.push(quantity > ZERO ? `${quantity} Documentos electrónicos` : `Documentos electrónicos Ilimitados por año`);
    }

    if (websitePlan?.id) {
        names.push(`Sitio web y tienda diggital: ${websitePlan.name}`);
    }

    if (organizationPlanning?.id) names.push(organizationPlanning.name);
    if (diggitalSeller?.id) names.push(diggitalSeller.name);
    if (crm?.id) names.push(crm.name);

    return names.join(' | ');
};

/**
 * This returns the request for payment
 *
 * @param data: IGenericRecord - Purchase data
 * @returns IGenericRecord
 */
export const getPaymentRequest = ({ data, information, user }: IGenericRecord): IGenericRecord => {
    const isWithPSE = data.paymentMethod === PaymentMethod.Pse;
    const address = {
        city: data?.city_name,
        country: 'CO',
        phone: data?.phone,
        postalCode: data?.postal_code,
        state: data?.department_name,
        street1: data?.address,
        street2: data?.address,
    };
    return {
        additional_customer_data: {
            card_type: data.card_type_key,
            city_id: data?.city_id ?? data?.city_name,
            country_id: data?.country_id ?? COLOMBIA_ID,
            department_id: data?.department_id ?? data?.department_name,
            document_type: data.document_type_id,
            fiscal_responsibilities: data.fiscal_responsibilities,
            tax_details_name: data.tax_detail,
            tax_details_code: data.tax_detail_code,
            type_taxpayer_id: data.person_type_id,
            type_taxpayer_name: data.person_type,
        },
        company_id: information?.id ?? user?.company_id,
        is_immediate_purchase: false,
        modules: getSubmodules(data),
        pages_quantity: 0,
        users_quantity: 0,
        payu_data: {
            transaction: {
                ...(isWithPSE
                    ? { extraParameters: getPSEParameters(data) }
                    : {
                          creditCard: getCardParameters(data, user),
                      }),
                order: {
                    buyer: {
                        contactPhone: data?.phone,
                        dniNumber: data?.document_number,
                        emailAddress: data?.email,
                        fullName: data?.client_name,
                        shippingAddress: address,
                    },
                    description: getDescription(data),
                    notifyUrl: process.env.REACT_APP_FRONT_BASE_URL,
                },
                payer: {
                    type_taxpayer_id: data.type_taxpayer_id,
                    type_taxpayer_name: data.type_taxpayer_name,
                    billingAddress: address,
                    contactPhone: data?.phone,
                    dniNumber: data?.document_number,
                    emailAddress: data?.email,
                    fullName: data?.holder_name || data?.client_name,
                },
                paymentMethod: isWithPSE ? PaymentMethod.Pse : cardType(data?.card_number),
                userAgent: window.navigator.userAgent,
            },
        },
    };
};

/**
 * This returns the parameters required for payment with PSE
 *
 * @param data: IGenericRecord - Purchase data
 * @returns IGenericRecord
 */
const getPSEParameters = (data: IGenericRecord): IGenericRecord => ({
    RESPONSE_URL: `${process.env.REACT_APP_FRONT_BASE_URL}/payments-plans?payment-method=PSE`,
    FINANCIAL_INSTITUTION_CODE: data.bank,
    USER_TYPE: data.person_type === LEGAL_PERSON ? 'J' : 'N',
    PSE_REFERENCE2: data.document_type,
    PSE_REFERENCE3: data.document_number,
});

/**
 * This returns the parameters required for payment with card
 *
 * @param data: IGenericRecord - Purchase data
 * @param user: IGenericRecord - User data
 * @returns IGenericRecord
 */
const getCardParameters = (data: IGenericRecord, user: IGenericRecord): IGenericRecord => ({
    expirationDate: getDateFromUnix(data.card_expiration, 'YYYY/MM').dateFormat,
    identificationNumber: data?.holder_document_number || data?.document_number,
    name: data?.holder_name || data?.client_name,
    number: data?.card_number,
    payerId: user?.id ?? '',
    securityCode: data?.card_code,
    paymentMethod: cardType(data?.card_number),
});

/**
 * This returns the request when a old card is used
 *
 * @param data: IGenericRecord - Purchase data
 * @returns IGenericRecord
 */
export const getRequestForOldCard = ({ data, information, user }: IGenericRecord): IGenericRecord => ({
    company_id: information?.id ?? user?.company_id,
    is_immediate_purchase: false,
    users_quantity: 0,
    pages_quantity: 0,
    additional_customer_data: {
        type_taxpayer_id: '',
        type_taxpayer_name: '',
        tax_details_code: '',
        tax_details_name: '',
        document_type: '',
        department_id: '',
        country_id: 46,
        fiscal_responsibilities: [
            {
                id: '',
            },
        ],
    },
    payu_data: {},
    modules: getSubmodules(data),
});

/**
 * Props of each type of modal
 */
export const MODAL_PROPS: IModalProps = {
    [Modal.Wrong]: () => ({ text: INFORMATION.WRONG_TRANSACTION, iconName: 'cancelMulticolor' }),
    [Modal.Declined]: () => ({ text: INFORMATION.TRANSACTION_DECLINED, iconName: 'warning' }),
    [Modal.Pending]: () => ({ text: INFORMATION.PENDING_TRANSACTION, iconName: 'warning' }),
    [Modal.NotApproved]: () => ({ text: INFORMATION.UNAPPROVED_TRANSACTION, iconName: 'warning' }),
    [Modal.Approved]: () => ({ text: INFORMATION.APPROVED_TRANSACTION }),
    [Modal.Inactivity]: () => ({ text: INFORMATION.INACTIVITY, iconName: 'clockMulticolor' }),
    [Modal.ApplicationApproved]: () => ({ text: INFORMATION.APPLICATION_APPROVED }),
    [Modal.ApplicationNotApproved]: () => ({ text: INFORMATION.APPLICATION_NOT_APPROVED, iconName: 'cancelMulticolor' }),
    [Modal.Delete]: (data: IGenericRecord, { deletePlan, planToDelete, closeModal }: IGenericRecord) => ({
        finalAction: deletePlan,
        text: INFORMATION.DELETE_PLAN(data?.[planToDelete]?.name),
        iconName: 'trashMulticolor',
        leftButton: { action: closeModal, text: 'Omitir' },
        finishButtonText: 'Eliminar',
    }),
};

/**
 * Required fields for card payment
 */
const REQUIRED_CARD_FIELDS = [Field.DocumentNumber, Field.CardNumber, Field.CardExpiration, Field.CardCode];

/**
 * Required fields for payment with cardholder
 */
const REQUIRED_HOLDER_FIELDS = [
    Field.HolderName,
    Field.HolderDocumentType,
    Field.HolderDocumentNumber,
    Field.HolderEmail,
    Field.TypeTaxpayer,
];

/**
 * Required fields for payment
 */
const REQUIRED_FIELDS = [
    Field.ClientName,
    Field.DocumentType,
    Field.DocumentNumber,
    Field.Address,
    Field.PostalCode,
    Field.Phone,
    Field.Email,
    Field.PersonType,
    Field.TaxDetail,
];

/**
 * This is used to get the payment method from the query param
 */
export const PAYMENT_METHOD = 'payment-method';

/**
 * This is used to validate whether the purchase summary should be displayed
 */
export const TRANSACTION_ID = 'transactionId';

/**
 * Modals that have no action when clicking accept
 */
export const MODALS_WITHOUT_ACTION: string[] = [Modal.ApplicationNotApproved, Modal.Inactivity];

/**
 * Const for numbers
 */
export const ZERO = 0;
export const FIFTEEN = 15;
export const TWELVE = 12;

/** Const for modules id */
export const ORGANIZATION_PLANNING_MODULE_ID = 5;
export const CRM_MODULE_ID = 18;
export const DIGGITAL_SELLER_MODULE_ID = 16;
export const WEBSITE_MODULE_ID = 2;
export const ELECTRONIC_DOCUMENTS_MODULE_ID = 3;
