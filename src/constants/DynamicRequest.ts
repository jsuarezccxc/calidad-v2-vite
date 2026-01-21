export const CITIES = 'cities';
export const COUNTRIES = 'countries';
export const DEPARTMENTS = 'departments';
export const UNIT_MEASUREMENTS = 'unit_measurements';
export const QUALIFICATION_TYPES = 'qualification_types';
export const TRANSACTION_TYPES = 'transaction_types';
export const ACTIVITY_TYPES = 'activity_types';
export const DOCUMENT_TYPES = 'document_types';
export const TAXS = 'taxs';
export const NOTIFICATION_STATES = 'notification_states';
export const INVOICE_STATES = 'invoice_states';
export const LANGUAGE_KEY_VARIABLES = 'global_variables';
export const PAYMENT_METHODS = 'payment_methods';
export const NOTIFICATION_TYPES = 'notification_types';
export const MESSAGE_TEMPLATE_TYPES = 'message_template_types';
export const NOTIFICATION_TYPES_DETAILS = 'notification_type_details';
export const CIIUS = 'ciius';
export const FISCAL_RESPONSIBILITIES = 'fiscal_responsibilities';
export const CONSULTING_AREAS = 'ConsultingAreas';
export const MODULE_NOTIFICATIONS = 'module_notifications';
export const TYPE_TAX_PAYER = 'type_tax_payer';
export const FOREIGN_EXCHANGE = 'foreign_exchange';
export const TAX_DETAIL = 'tax_details';
export const REASON_REJECTIONS = 'reason_rejections';
export const PAYMENT_TYPES = 'payment_types';
export const WITHHOLDINGS = 'withholdings';

/**
 * Taxpayer types' constants
 */
export const NATURAL_PERSON = 'Persona natural';
export const LEGAL_PERSON = 'Persona jurídica';
export const NATURAL_PERSON_MERCHANT = 'Persona natural comerciante';

/**
 * Fiscal responsibilities constants
 */
export const GREAT_CONTRIBUTOR = 'O-13 Gran contribuyente';
export const SELF_RETAINING = 'O-15 Autorretenedor';
export const IVA_AGENT = 'O-23 Agente de retención IVA';
export const SIMPLE_REGIMEN = 'O-47 Régimen simple de tributación SIMPLE';
export const OTHERS = 'R-99-PN No aplica - Otros';
export const PERSON_OPTIONS = [
    {
        id: 'NATURAL_PERSON',
        key: 'NATURAL_PERSON',
        value: 'Persona natural',
        name: 'person_type',
    },
    {
        id: 'LEGAL_PERSON',
        key: 'LEGAL_PERSON',
        value: 'Persona jurídica',
        name: 'person_type',
    },
    {
        id: 'NATURAL_PERSON_MERCHANT',
        key: 'NATURAL_PERSON_MERCHANT',
        value: 'Persona natural comerciante',
        name: 'person_type',
    },
];

/**
 * List of tax responsibilities that cannot be combined with others
 */
export const SINGLE_TAX_RESPONSIBILITIES = [OTHERS, SIMPLE_REGIMEN];
