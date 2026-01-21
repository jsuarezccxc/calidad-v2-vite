import React from 'react';
import { IInformationPageProps } from '@models/PurchaseNote';
import { CREDIT_NOTE_SUPPLIER, DEBIT_NOTE_SUPPLIER } from '@constants/PurchaseInvoiceNotes';

export const PURCHASE_NOTE = {
    TABLE_DESCRIPTION: (
        <p className="mt-6">
            A continuación revise la información de su factura. Modifique la información en los campos que desee, en caso que
            necesite agregar un producto haga click en +Agregar compra producto/servicio.
        </p>
    ),
};

export const PURCHASE_NOTE_SUBTITLE: Record<string, string> = {
    [DEBIT_NOTE_SUPPLIER]: 'Información de la nota débito',
    [CREDIT_NOTE_SUPPLIER]: 'Información de la nota crédito',
};

export const PURCHASE_NOTE_DESCRIPTION: Record<string, IInformationPageProps> = {
    [DEBIT_NOTE_SUPPLIER]: {
        title: 'Registrar nota débito',
        description: (
            <>
                <p className="text-gray-dark font-aller mb-4.5">
                    Las notas débito a una factura de compra se generan cuando el valor registrado por su proveedor quedó por
                    debajo del que debía quedar o cuando la cantidad registrada es menor a la acordada.
                </p>
                <p className="mb-0 text-gray-dark font-aller">
                    Al terminar haga click en <span className="font-allerbold">Siguiente</span> para almacenar la información en
                    el sistema.
                </p>
            </>
        ),
    },
    [CREDIT_NOTE_SUPPLIER]: {
        title: 'Registrar nota crédito',
        description: (
            <>
                <p className="text-gray-dark font-aller">
                    Las notas crédito a una factura de compra se generan cuando usted como empresario solicita una devolución,
                    cuando el proveedor da un descuento adicional o cuando ambas partes requieren anular una factura de venta. En
                    caso de que vaya a anular la factura con la nota crédito seleccione la opción “Anulación” y haga clic en
                    siguiente.
                </p>
            </>
        ),
    },
};

export const TOOLTIPS_FORM = {
    CUDE: {
        tooltip: {
            title: 'CUDE:',
            description: 'Código Único de Facturación Electrónica.',
        },
        tooltipInfo: true,
    },
    NUMBER_SUPPLIER_INVOICE: {
        tooltip: {
            title: 'Número de factura del proveedor:',
            description: 'Es el número que identifica la factura que el proveedor le ha transmitido a usted.',
        },
        tooltipInfo: true,
    },
    PREFIX: {
        tooltip: {
            title: 'Prefijo:',
            description: 'Es un identificador de documentos de cuatro caracteres alfanuméricos.',
        },
        tooltipInfo: true,
    },
    SUPPLIER: {
        tooltip: {
            title: 'Proveedor:',
            description: 'Es el nombre del proveedor que le genera la factura de compra.',
        },
        tooltipInfo: true,
    },
    DOCUMENT_TYPE: {
        tooltip: {
            title: 'Tipo de documento:',
            description: 'Es el tipo de identificación del proveedor.',
        },
        tooltipInfo: true,
    },
    DOCUMENT_NUMBER: {
        tooltip: {
            title: 'Número de documento:',
            description: 'Es el número de identificación del proveedor.',
        },
        tooltipInfo: true,
    },
    TAXPAYER_TYPE: {
        tooltip: {
            title: 'Tipo de contribuyente:',
            description: (
                <>
                    <p className="text-sm text-blue">
                        <span className="font-allerbold">Persona natural:</span> cuando el proveedor actúa a título personal.
                    </p>
                    <p className="text-sm text-blue">
                        <span className="font-allerbold">Persona jurídica:</span> cuando el proveedor actúa en representación de
                        una sociedad conformada por una o mas personas.
                    </p>
                </>
            ),
        },
        tooltipInfo: true,
    },
    PAYMENT_TYPE: {
        tooltip: {
            title: 'Forma de pago:',
            description: (
                <ul className="ml-6 list-disc">
                    <li className="text-sm leading-16.95px text-blue mb-4.5">
                        <span className="font-allerbold">Crédito:</span> es la modalidad de pago que se hace efectivo en un
                        periodo de tiempo diferente al día en el que se realiza la compra.
                    </li>
                    <li className="text-sm leading-16.95px text-blue mb-4.5">
                        <span className="font-allerbold">Contado:</span> es la modalidad de pago que se hace efectivo en el mismo
                        instante que se realiza la compra.
                    </li>
                </ul>
            ),
        },
        tooltipInfo: true,
    },
    PAYMENT_METHOD: {
        tooltip: {
            title: 'Medio de pago:',
            description: 'Es el medio que se utiliza para pagar la factura.',
        },
    },
    FOREIGN_CURRENCY: {
        tooltip: {
            title: 'Divisa:',
            description: 'Es la moneda con la que se va a expedir la factura de compra.',
        },
        tooltipInfo: true,
    },
    COMMENT_INTERNAL: {
        tooltip: {
            title: 'Comentario interno:',
            description:
                'Son anotaciones o notas internas que se adjuntan en el documento con fines de registro interno o comunicación entre la empresa.',
        },
        tooltipInfo: true,
    },
    REASON: {
        tooltip: {
            title: 'Motivo:',
            description: 'Seleccione la razón por la cual se está generando la nota.',
        },
        tooltipInfo: true,
    },
};
