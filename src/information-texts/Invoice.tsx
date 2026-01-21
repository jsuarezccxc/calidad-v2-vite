import React from 'react';
import { urls } from '@api/urls';
import { CREDIT } from '@constants/Invoice';
import { PRODUCT_NAME } from '@constants/ProductName';
import { FieldName } from '@models/Company';
import { Form } from '@models/ElectronicDocuments';
import { IGenericRecord } from '@models/GenericRecord';
import { PAD_NUMBER } from '@pages/generate-purchase-invoice';
import { ZERO } from '@pages/website-editor';
import { getDateAnyFormat, getTodaysTime } from '@utils/Date';

export const INFORMATION: IGenericRecord = {
    COMPANY: (data: IGenericRecord) => (
        <p>
            <span className="invoice-cards__text--blue">{data?.name}</span>
            <span className="invoice-cards__text--blue">
                {data?.document_type_name} {data?.document_number}
            </span>
            <span className="invoice-cards__text--blue">{data?.address}</span>
            <span className="invoice-cards__text--blue">
                {data?.city_name ? `${data.city_name},` : ''} {data?.department_name ? `${data.department_name},` : ''} &nbsp;
                {data?.country_name}
            </span>
            <span className="invoice-cards__text--blue">{data?.phone}</span>
            <span className="invoice-cards__text--blue">{data?.domain ? data?.domain : ''}</span>
        </p>
    ),
    INVOICE_DATE: (paymentMethod: string, expirationDate: string) => {
        const currentDate = getDateAnyFormat(new Date());
        return (
            <p>
                <span className="invoice-cards__text--blue">Fecha de transmisión:</span>
                <span className="invoice-cards__text--blue">{currentDate}</span>
                <span className="invoice-cards__text--blue">Hora de transmisión: {getTodaysTime()}</span>
                <span className="invoice-cards__text--blue">Fecha de vencimiento:</span>
                <span className="invoice-cards__text--blue">{paymentMethod === CREDIT ? expirationDate : currentDate}</span>
            </p>
        );
    },
    TAXES: {
        title: 'Impuestos:',
        description: (
            <p className="text-sm text-blue">
                obligaciones tributarias que la persona o empresa deben pagar al estado. Para saber mas sobre impuestos haga click
                aca: &nbsp;
                <a target="__blank" className="underline text-purple" href={urls.taxObligations}>
                    Ver más
                </a>
            </p>
        ),
    },
    [Form.Client]: {
        title: 'Agregar cliente',
        description: 'Ingrese los datos de su cliente para transmitir la factura',
    },
    [Form.EditClient]: {
        title: 'Edite cliente',
        description: 'Edite los datos de su cliente para transmitir la factura',
    },
    [Form.Supplier]: {
        title: 'Agregar proveedor',
        description: 'Agregue la siguiente información del proveedor',
    },
    [Form.EditSupplier]: {
        title: 'Edite proveedor',
        description: 'Editar la información del proveedor',
    },
    PURCHASE_NUMBER: (invoiceNumber: number) => (
        <p className="text-lg text-center text-blue">
            <span className="block mb-1">Compra</span>
            <span>{String(invoiceNumber).padStart(PAD_NUMBER, String(ZERO))}</span>
        </p>
    ),
};

export const TOOLTIP_DATA = (isClient = true): { [key: string]: { titleTooltip: string; descTooltip: string | JSX.Element } } => {
    const person = isClient ? 'cliente' : 'proveedor';
    return {
        [FieldName.Name]: {
            titleTooltip: `Nombre del ${person}:`,
            descTooltip: `es el nombre del ${person}.`,
        },
        [FieldName.DocumentType]: {
            titleTooltip: 'Tipo de documento:',
            descTooltip: `es el tipo de identificación del ${person}.`,
        },
        [FieldName.DocumentNumber]: {
            titleTooltip: 'Numero del documento:',
            descTooltip: `es el número de identificación del ${person}.`,
        },
        [FieldName.Address]: {
            titleTooltip: 'Dirección:',
            descTooltip: `Ubicación geográfica del ${person}.`,
        },
        [FieldName.CountryId]: {
            titleTooltip: 'País:',
            descTooltip: `Ubicación geográfica del ${person}.`,
        },
        [FieldName.DepartmentId]: {
            titleTooltip: 'Departamento:',
            descTooltip: `ubicación geográfica del ${person}.`,
        },
        [FieldName.CityId]: {
            titleTooltip: 'Ciudad:',
            descTooltip: `ubicación geográfica del ${person}.`,
        },
        [FieldName.PostalCode]: {
            titleTooltip: 'Código postal:',
            descTooltip: `es la combinación de números que representa la zona en la que está ubicado el ${person}.`,
        },
        [FieldName.Phone]: {
            titleTooltip: 'Teléfono:',
            descTooltip: `es el número de teléfono fijo o celular del ${person}.`,
        },
        [FieldName.PersonType]: {
            titleTooltip: 'Tipo de contribuyente:',
            descTooltip: (
                <>
                    <p className="mt-0.5 mb-1 text-blue text-sm">
                        <span className="font-allerbold">• Persona natural: </span>&nbsp; cuando el {person} actúa a título
                        personal.
                    </p>
                    <p className="text-sm text-blue">
                        <span className="font-allerbold">• Persona jurídica: </span>&nbsp; cuando el {person} actúa en
                        representación de una sociedad conformada por una o mas personas.
                    </p>
                </>
            ),
        },
        [FieldName.TaxDetail]: {
            titleTooltip: 'Detalle de impuesto:',
            descTooltip: 'el impuesto que el contribuyente debe incluir en sus ventas de acuerdo al producto/servicio que vende.',
        },
        [FieldName.Responsibilities]: {
            titleTooltip: 'Responsabilidad fiscal:',
            descTooltip:
                'es la clasificación que la DIAN le da a los contribuyentes, para saber a qué impuestos están obligados. Se encuentra en la casilla 53 del RUT.',
        },
    };
};

export const TOOLTIP_BUTTON = {
    title: 'Base de datos DIAN:',
    description: (
        <>
            La consulta se realiza directamente en la DIAN para importar automáticamente los datos de los adquirentes/compradores
            en la base de datos de {PRODUCT_NAME}. La información que se traerá desde la base de datos DIAN serán &nbsp;
            <span className="font-allerbold">Nombre del cliente y Correo electrónico.</span>
        </>
    ),
};
