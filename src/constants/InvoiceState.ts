import { IGenericRecord } from '@models/GenericRecord';

export const INVOICE_STATE: IGenericRecord = {
    NA: 'N/A',
    IN_VERIFICATION: 'En verificación',
    ACCEPTED: 'Aceptada',
    REJECTED: 'Rechazada',
    PENDING_PAYMENT: 'Pago pendiente',
    REJECTED_CLIENT: 'Rechazada',
    VOIDED: 'Anulada',
};

//Names old package invoices
export const oldInvoicesNames = {
    1: 'Facturación Electrónica - Paquete 60 facturas',
    2: 'Facturación Electrónica - Paquete 120 facturas',
    3: 'Facturación Electrónica - Paquete 300 facturas',
    4: 'Facturación Electrónica - Paquete 720 facturas',
};

//constant that contains the names and number of previous documents
export const oldInvoiceInformation = [
    {
        name: 'Facturación Electrónica - Paquete 60 facturas',
        price_year: 100000,
        quantity: 60,
    },
    {
        name: 'Facturación Electrónica - Paquete 120 facturas',
        price_year: 180000,
        quantity: 120,
    },
    {
        name: 'Facturación Electrónica - Paquete 300 facturas300',
        price_year: 300000,
        quantity: 300,
    },
    {
        name: 'Facturación Electrónica - Paquete 720 facturas720 facturas',
        price_year: 540000,
        quantity: 720,
    },
];

//constant that contains the names and number of previous documents in detail
export const oldWebsiteWarehouseInformation = [
    {
        idModule: 2,
        idSubmodule: 5,
        price_year: 119982.86,
        price_discount_year: 83988,
        price_semester: 59994.0,
        discount: 35994.86,
    },
    {
        idModule: 2,
        idSubmodule: 6,
        price_year: 179997.14,
        price_discount_year: 125998,
        price_semester: 89994.0,
        discount: 53999.14,
    },
    {
        idModule: 2,
        idSubmodule: 7,
        price_year: 251982.86,
        price_discount_year: 176388,
        price_semester: 125994.0,
        discount: 75594.86,
    },
    {
        idModule: 2,
        idSubmodule: 10,
        price_year: 335982.86,
        price_discount_year: 235188,
        price_semester: 167994.0,
        discount: 100794.86,
    },
    {
        idModule: 4,
        idSubmodule: 0,
        price_year: 239982.86,
        price_discount_year: 167988,
        price_semester: 119994.0,
        discount: 71994.86,
    },
];

//change date from electronic billing package to supporting documents
export const dateUpdatePackage = '2024-02-01';
//purchasable submodules ids
export const purchasableBubmodulesIds = [2, 3, 4];

export const ACCEPTED = 'ACCEPTED';
export const REJECTED = 'REJECTED';
