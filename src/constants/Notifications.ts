import { getRoute } from '@utils/Paths';
import { Routes } from '@constants/Paths';

export const NOTIFICATION_TYPE = 'Tipo de notificación';
export const VERIFICATION_TYPE = 'Tipo de verificación';
export const NOTIFICATION_DESCRIPTION = 'Descripción';

export const ENOUGH_UNITS = 'c1425743-b0b3-45a6-a21b-88d4b363fa11';
export const EXPIRATION_DATE = 'f552899c-f6ee-11eb-9a03-0242ac130003';
export const SHOPPING_CART = 'c1425740-b0b0-45a6-a21b-88d4b363fa11';

// Notification's ids: Website
export const OUT_PRODUCT_WAREHOUSE = '0e8b00a6-0706-3d3f-b0e3-50f661db34e1';
export const PURCHASE_ORDER = '15679be6-f6ef-11eb-9a03-0242ac130003';
export const DNS_FAILED_CONNECT = '9b761f5e-2f31-431c-bba1-8a2a909c7c66';

// Notification's ids: Inventory
export const MINIMUM_INVENTORY = 'c3479a40-63f3-3330-b6cd-7905af8053a7';
export const MAXIMUM_INVENTORY = 'f764b530-f589-30cf-baa2-8a3fd9ab5de6';
export const KARDEX_INVENTORY = 'e99a1a40-bf6d-11ed-afa1-0242ac120002';

// Notification's ids: Electronic invoice
export const SALE_COMPLETED = 'b5ff88ad-0d65-442f-b868-3ab8f80d05e2';
export const DIAN_REJECTION = 'cc57c2de-2614-405f-b141-ef6f16199a09';
export const CLIENT_REJECTION = '1c567267-28a7-4c73-a190-85687a035c3b';
export const PHYSICAL_STORE_SALE_RECORD = 'a972d48d-93d9-485f-850b-109e034a56b1';
export const DIAN_ACCEPTED = '70beecb5-4297-4a65-912f-3292ca23ec92';
export const DIAN_RESPONSE_PENDING = '2b3f6d19-f773-4f33-8f45-ca340bce3192';
export const CLIENT_ACCEPTED = '5984bdb4-2478-4670-9d7a-f0678ea09b5b';
export const RESOLUTION_EXPIRATION = 'df9047cc-644e-403b-8299-8e73395c13e7';
export const RANK_DEPLETTION = '9d7ddb1a-59e5-4a59-ae2e-6270a04335fa';
export const WARNING_LIMIT_INVOICE = '814a4bad-3a8e-4210-b233-fd39d589e70e';

// Notification's ids: Support document
export const DIAN_ACCEPTED_SUPPORT = '7ae2be07-9d12-4d99-8743-78e10a21ccf4';
export const DIAN_RESPONSE_PENDING_SUPPORT = '23b52d23-c76e-4d94-8ae4-25b80d3da1c1';
export const CONSECUTIVE_BILLING_NOTIFICATION = 'b5ff88ad-0d65-442f-b868-3ab8f80d05e2';
export const EXPIRATION_RESOLUTION_INVOICE = '8d540a29-dd6f-4fde-acac-a59b728ffa40';

export const MODULE_PAYMENT_PLANS = '2f3e3247-349e-4f76-a9e4-5c6bb42b302a';

// Notification' status
export const PENDING_NOTIFICATION = '641a18d5-baa9-35ff-a2ae-daa86cdb8363';
export const SECOND_PENDING_NOTIFICATION = '1cc36b00-2b46-36cd-b306-4bff0a438baa';

// Array with notification's id and link must be redirect when click into bell notification
export const ALL_NOTIFICATIONS_REDIRECTION = [
    {
        id: OUT_PRODUCT_WAREHOUSE,
        redirect: getRoute(Routes.HOME),
    },
    {
        id: MAXIMUM_INVENTORY,
        redirect: getRoute(Routes.HOME),
    },
    {
        id: DIAN_REJECTION,
        redirect: getRoute(Routes.CORRECTION_BUSINESS_DOCUMENT),
    },
    {
        id: CLIENT_REJECTION,
        redirect: getRoute(Routes.CORRECTION_DOCUMENTS_CLIENT_EMPLOYER),
    },
    {
        id: KARDEX_INVENTORY,
        redirect: getRoute(Routes.HOME),
    },
    {
        id: WARNING_LIMIT_INVOICE,
        redirect: getRoute(Routes.PAYMENT_PLANS_MENU),
    },
];
