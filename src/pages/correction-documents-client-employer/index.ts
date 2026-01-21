import dayjs from '@utils/Dayjs';
import { v4 as uuid } from 'uuid';
import { Section } from '@components/bread-crumb';
import { LinkColor } from '@components/button';
import { IFields } from '@components/electronic-document';
import { IOptionSelect } from '@components/input';
import { IBodyTable } from '@components/table';
import { Routes } from '@constants/Paths';
import { ITableFieldType } from '@constants/TableFieldType';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { getRoute, getRouteName } from '@utils/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { buildOptions } from '@utils/Company';
import { lengthGreaterThanZero } from '@utils/Length';

export { default } from './CorrectionDocumentsClientEmployer';

const { NOTE } = MODULE_TITLES;

/**
 * Routes from breadcrumb
 */
export const routes = (): Section[] => {
    return [
        {
            name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
            route: getRoute(Routes.ENABLE_ELECTRONIC_BILLER),
        },
        {
            name: NOTE,
            route: '#',
        },
        {
            name: getRouteName(Routes.CORRECTION_DOCUMENTS_CLIENT_EMPLOYER),
            route: getRoute(Routes.CORRECTION_DOCUMENTS_CLIENT_EMPLOYER),
        },
    ];
};

/**
 * Routes from breadcrumb accept rejection option
 */
export const acceptRejectionRoutes = (): Section[] => {
    return [
        {
            name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
            route: getRoute(Routes.ENABLE_ELECTRONIC_BILLER),
        },
        {
            name: NOTE,
            route: '#',
        },
        {
            name: getRouteName(Routes.CORRECTION_DOCUMENTS_CLIENT_EMPLOYER),
            route: getRoute(Routes.CORRECTION_DOCUMENTS_CLIENT_EMPLOYER),
        },
    ];
};

/**
 * Routes email template from breadcrumb
 */
export const routesEmailTemplate = (): Section[] => {
    return [
        {
            name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
            route: getRoute(Routes.ENABLE_ELECTRONIC_BILLER),
        },
        {
            name: NOTE,
            route: '#',
        },
        {
            name: 'No aceptar el rechazo',
            route: '#',
        },
        {
            name: 'Editar plantilla de correo.',
            route: '#',
        },
    ];
};

//This header table Support documents
export const headerTableSupport = [
    {
        title: 'Documentos adjuntos',
        className: 'text-sm h-6.8 lg:h-5.75 padding-none flex justify-center items-center',
    },
];

//This data table Support documents
export const dataTableSupport = [
    {
        name: 'Imagen1.jpg',
        url: '',
    },
    {
        name: 'Archivo1.jpg',
        url: '',
    },
];

/**
 * Titles from total table
 */
export const headerTableCorrection = [
    {
        title: 'Tipo de documento electrónico',
        field: 'typeElectronicDocument',
        className: 'w-40 lg:h-5.75 xs:h-8.6',
    },
    {
        title: 'Número de documento electrónico',
        field: 'electronicDocumentNumber',
        className: 'w-40 lg:h-5.75 xs:h-8.6',
    },
    {
        title: 'Fecha de emisión',
        field: 'date',
        className: 'w-30 lg:h-5.75 xs:h-8.6',
    },
    {
        title: 'Cliente',
        field: 'client',
        className: 'w-32 lg:h-5.75 xs:h-8.6',
    },
    {
        title: 'Valor total',
        field: 'totalValue',
        className: 'w-20 lg:h-5.75 xs:h-8.6',
    },
    {
        title: 'Motivo de corrección',
        field: 'correction',
        className: 'w-36 lg:h-5.75 xs:h-8.6',
    },
];

//Table headers view sales record
export const tableBodyCorrection = (
    handleOnViewDocument: (item: IGenericRecord, show: boolean) => void,
    setViewCorrection: React.Dispatch<React.SetStateAction<boolean>>
): IBodyTable[] => {
    return [
        {
            type: ITableFieldType.TEXT,
            field: 'invoice_type',
            editableField: false,
            className: 'w-full lg:h-8.9 padding-none',
        },
        {
            type: ITableFieldType.LINK,
            field: 'number',
            color: LinkColor.PURPLE,
            editableField: false,
            className: 'w-20 padding-none lg:h-8.9',
            onClick: (item): void => handleOnViewDocument(item, true),
        },
        {
            type: ITableFieldType.DATE,
            field: 'date',
            editableField: false,
            className: 'w-30 padding-none lg:h-8.9',
        },
        {
            type: ITableFieldType.TEXT,
            field: 'client_name',
            editableField: false,
            className: 'w-full padding-none lg:h-8.9',
        },
        {
            type: ITableFieldType.VALUE,
            containerClass: 'xs:h-6.75',
            isTable: true,
            className: 'xs:h-6.75',
            field: 'total',
            editableField: false,
        },
        {
            type: ITableFieldType.LINK,
            field: 'reason_rejection_name',
            color: LinkColor.PURPLE,
            editableField: false,
            className: 'w-20 xs:h-6.75',
            onClick: (item): void => {
                handleOnViewDocument(item, false);
                setViewCorrection(true);
            },
        },
    ];
};

//temporary data for the sales display table
export const dataCorrection = [
    {
        typeElectronicDocument: 'Factura',
        electronicDocumentNumber: '004',
        date: 1629817347,
        client: 'Cliente 1',
        totalValue: '000.000.000',
        correction: 'Error datos personales',
    },
    {
        typeElectronicDocument: 'Factura',
        electronicDocumentNumber: '009',
        date: 1629817347,
        client: 'Cliente 2',
        totalValue: '000.000.000',
        correction: 'Descuentos no aplicados',
    },
];

export const valueIfNull = (data: IGenericRecord[] = []): IGenericRecord[] => {
    const formatData: IGenericRecord[] = [];
    data.forEach((item: IGenericRecord) => {
        if (lengthGreaterThanZero(item.reason_rejections) && item.has_note) {
            formatData.push({
                id: item.id,
                invoice_type: 'Factura de venta',
                number: item.number,
                date: item.date,
                client_name: item.client_name,
                total: item.total,
                reason_rejection_name: item.reason_rejections[0].reason_rejection_name,
            });
        }
    });
    return formatData;
};

/**
 * Initial data fields from fields
 */
export const initFields = (annulation: boolean, isList = false, disabledInputs = false): IFields => {
    return {
        associated_document_prefix: {
            value: '',
            onChange: (): void => {},
            disabled: false,
        },
        associated_document_number: {
            value: '',
            onChange: (): void => {},
            disabled: true,
        },
        prefix: {
            value: '',
            options: [],
            onChange: (): void => {},
            disabled: isList,
        },
        invoice_number: {
            value: '',
            onChange: (): void => {},
            disabled: false,
        },
        badge: {
            value: '',
            options: [],
            onChange: (): void => {},
            disabled: true,
        },
        date_issue: {
            value: '',
            onChange: (): void => {},
            disabled: annulation,
        },
        broadcast_time: {
            value: '',
            onChange: (): void => {},
            disabled: annulation,
        },
        due_date: {
            value: '',
            onChange: (): void => {},
            disabled: annulation,
        },
        reason_rejection: {
            value: '',
            onChange: (): void => {},
            disabled: true,
        },
        purchase_order_number: {
            value: '',
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        customer_document_type: {
            value: '',
            options: [],
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        customer_name: {
            value: '',
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        address: {
            value: '',
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        department_state: {
            value: '',
            options: [],
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        postal_code: {
            value: '',
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        purchase_manager: {
            value: '',
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        purchase_number_document_number: {
            value: '',
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        collection_days: {
            value: '',
            onChange: (): void => {},
            disabled: true,
        },
        way_pay: {
            value: '',
            options: [],
            onChange: (): void => {},
            disabled: true,
        },
        fiscal_responsibility: {
            value: '',
            options: [],
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        observations: {
            value: '',
            onChange: (): void => {},
            disabled: annulation,
        },
        sales_manager: {
            value: '',
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        customer_document_number: {
            value: '',
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        email: {
            value: '',
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        country: {
            value: '',
            options: [],
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        city: {
            value: '',
            options: [],
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        phone: {
            value: '',
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        type_document_purchase_manager: {
            value: '',
            options: [],
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        payment_type: {
            value: '',
            options: [],
            onChange: (): void => {},
            disabled: true,
        },
        type_taxpayer: {
            value: '',
            options: [],
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        tax_detail: {
            value: '',
            options: [],
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        seller_type_document: {
            value: '',
            options: [],
            onChange: (): void => {},
            disabled: disabledInputs,
        },
        seller_document_number: {
            value: '',
            onChange: (): void => {},
            disabled: disabledInputs,
        },
    };
};

/**
 * Initial data fields disabled from taxes table
 */
export const initFieldsTaxTable: IFields = {
    tax: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    base: {
        value: 0,
        onChange: () => {},
        disabled: false,
    },
    rate: {
        value: '',
        onChange: () => {},
        disabled: true,
    },
    value: {
        value: 0,
        onChange: () => {},
        disabled: true,
    },
};

export const fiscalResponsibilities = [
    {
        value: '',
        options: [],
        onChange: (): void => {},
        disabled: true,
    },
];

export const buildOptionsInvoice = (data: IGenericRecord[] = []): IOptionSelect[] => {
    const options: IOptionSelect[] = [];
    data.forEach((item: IGenericRecord) => {
        options.push({
            id: uuid(),
            key: item.id,
            value: item.number,
        });
    });
    return options;
};

const formatTimePicker = (date: string): IGenericRecord => {
    const hourComplete = dayjs(date).format('hh:mm A');
    const [hour, minutes, schedule] = hourComplete.split(/[: ]/);
    return { hour, minutes, schedule };
};

export const electronicComponentFormat = (data: IGenericRecord): IGenericRecord => ({
    associated_document_prefix: data?.associate_prefix,
    associated_document_number: data?.associate_number,
    date_issue_associated_document: dayjs(data?.associate_date).unix(),
    prefix: '',
    invoice_number: '',
    badge: data?.foreign_exchange_id,
    date_issue: dayjs(data?.date).unix(),
    broadcast_time: formatTimePicker(data?.time_issue),
    due_date: dayjs().unix(),
    purchase_order_number: data?.number_purchase_order,
    sales_manager: data?.sales_manager,
    seller_type_document: data?.document_type_name_sales_manager,
    seller_document_number: data?.document_number_sales_manager,
    customer_name: data?.client_name,
    customer_document_type: data?.client_information?.document_type,
    customer_document_number: data?.client_information?.document_number,
    email: data?.email,
    address: data?.client_information?.address,
    country: data?.country_id,
    department_state: data?.department_id,
    city: data?.city_id,
    postal_code: data?.postal_code,
    phone: data?.client_information?.cellphone,
    purchase_manager: data?.purchasing_manager,
    type_document_purchase_manager: data?.document_type_name_purchasing_manager,
    purchase_number_document_number: data?.document_number_purchasing_manager,
    payment_type: data?.payment_type_name,
    collection_days: data?.days_collection,
    way_pay: data?.payment_method_id,
    type_taxpayer: data?.client_information?.type_taxpayer_id,
    tax_detail: '',
    observations: data?.note,
});

export const reasonRejectedFields: IGenericRecord = {
    error_discount: {
        discount: true,
    },
    error_quantity: {
        quantity: true,
    },
    error_quantity_check: {
        quantity: true,
        check: true,
    },
    error_unit_value_check: {
        unit_value: true,
        check: true,
    },
    error_shipping_charge: {
        send_cost: true,
    },
};

export const optionsSelectsInputs = (
    document_types: IGenericRecord[],
    countries: IGenericRecord[],
    country_departments: IGenericRecord[],
    department_cities: IGenericRecord[]
): IFields => {
    return {
        ...initFields(true),
        prefix: {
            value: '',
            options: [],
            onChange: (): void => {},
            disabled: true,
        },
        badge: {
            value: '',
            options: [],
            onChange: (): void => {},
            disabled: true,
        },
        customer_document_type: {
            value: '',
            options: buildOptions(document_types),
            onChange: (): void => {},
            disabled: true,
        },
        department_state: {
            value: '',
            options: buildOptions(country_departments),
            onChange: (): void => {},
            disabled: true,
        },
        way_pay: {
            value: '',
            options: [],
            onChange: (): void => {},
            disabled: true,
        },
        country: {
            value: '',
            options: buildOptions(countries),
            onChange: (): void => {},
            disabled: true,
        },
        city: {
            value: '',
            options: buildOptions(department_cities),
            onChange: (): void => {},
            disabled: true,
        },
        type_document_purchase_manager: {
            value: '',
            options: buildOptions(document_types),
            onChange: (): void => {},
            disabled: true,
        },
        payment_type: {
            value: '',
            options: buildOptions([]),
            onChange: (): void => {},
            disabled: true,
        },
        type_taxpayer: {
            value: '',
            options: buildOptions([]),
            onChange: (): void => {},
            disabled: true,
        },
        tax_detail: {
            value: '',
            options: buildOptions([]),
            onChange: (): void => {},
            disabled: true,
        },
        seller_type_document: {
            value: '',
            options: buildOptions(document_types),
            onChange: (): void => {},
            disabled: true,
        },
    };
};

export const fieldsEnabled = (initFields: IFields, inputsEnabled: string): IFields => {
    Object.keys(initFields).forEach(itemInput => {
        Object.keys(reasonRejectedFields[inputsEnabled]).forEach(inputName => {
            if (itemInput === inputName) {
                const inputProps = initFields[itemInput];
                initFields = {
                    ...initFields,
                    [inputName]: {
                        ...inputProps,
                        disabled: !reasonRejectedFields[inputsEnabled][inputName],
                    },
                };
            }
        });
    });
    return initFields;
};

export const tableBodyInvoice = (bodyTable: IFields, columnsDisable: IGenericRecord): IGenericRecord => {
    Object.keys(bodyTable).forEach((item: string) => {
        Object.keys(columnsDisable).forEach((itemColumn: string) => {
            if (item === itemColumn) {
                bodyTable[item].disabled = false;
            }
        });
    });
    return bodyTable;
};

/**
 * query param id
 */
export const invoiceId = 'invoice_id';
