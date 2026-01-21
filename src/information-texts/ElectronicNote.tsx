import React from 'react';

export const MODAL_TYPE = {
    DELETE: {
        title: 'Eliminar producto/servicio',
        description: '¿Está seguro que desea eliminar los elementos seleccionados?',
    },
    SAVE: {
        title: '',
        description: '',
    },
};

export const TOOLTIPS_PAGE = {
    INTERNAL_COMMENT: {
        show: true,
        title: 'Comentario para uso interno:',
        description:
            'Agregue la información adicional de uso interno para su empresa, tenga en cuenta que esta información no se transmite a la DIAN ni al cliente.',
    },
    PREFIX_DEBIT_NOTE: {
        titleTooltip: 'Prefijo nota débito:',
        descTooltip: 'es una combinación alfanumérica que elige para nombrar el documento electrónico.',
    },
    PREFIX_CREDIT_NOTE: {
        titleTooltip: 'Prefijo nota crédit o:',
        descTooltip: 'es una combinación alfanumérica que elige para nombrar el documento electrónico.',
    },
    PREFIX_INVOICE: {
        titleTooltip: 'Prefijo:',
        descTooltip: 'es un identificador de facturas electrónicas de venta de cuatro caracteres alfanuméricos.',
    },
    CUSTOMER: {
        titleTooltip: 'Cliente:',
        descTooltip: 'es el nombre del cliente.',
    },
    DOCUMENT_TYPE: {
        titleTooltip: 'Tipo de documento:',
        descTooltip: 'es el tipo de identificación del cliente.',
    },
    DOCUMENT_NUMBER: {
        titleTooltip: 'Número de documento:',
        descTooltip: 'es el número de identificación del cliente.',
    },
    TAXPAYER: {
        titleTooltip: 'Tipo de contribuyente:',
        descTooltip: (
            <ul className="ml-6 list-disc">
                <li className="text-sm leading-16.95px text-blue mb-4.5">
                    <span className="font-allerbold">Persona natural:</span> cuando el proveedor actúa a título personal.
                </li>
                <li className="text-sm leading-16.95px text-blue">
                    <span className="font-allerbold">Persona jurídica:</span> cuando el proveedor actúa enrepresentación de una
                    sociedad conformada por una o mas personas.
                </li>
            </ul>
        ),
    },
    WAY_PAY: {
        titleTooltip: 'Forma de pago:',
        descTooltip: (
            <ul className="ml-6 list-disc">
                <li className="text-sm leading-16.95px text-blue mb-4.5">
                    <span className="font-allerbold">Crédito:</span> es la modalidad de pago que se hace efectivo en un periodo de
                    tiempo diferente al día en el que se realiza la compra.
                </li>
                <li className="text-sm leading-16.95px text-blue">
                    <span className="font-allerbold">Contado:</span> es la modalidad de pago que se hace efectivo en el mismo
                    instante que se realiza la compra.
                </li>
            </ul>
        ),
    },
    PAYMENT_METHOD: {
        titleTooltip: 'Medio de pago:',
        descTooltip: 'es el medio que se utiliza para pagar la factura.',
    },
    BADGE: {
        titleTooltip: 'Divisa:',
        descTooltip: 'es la moneda con la que se va a expedir la factura de venta.',
    },
    INVOICE_TYPE: {
        titleTooltip: 'Tipo de factura:',
        descTooltip: (
            <ul>
                <li className="text-sm leading-16.95px text-blue">
                    <span className="font-allerbold">Estándar:</span> Documento comercial generado por un vendedor como prueba de
                    la venta de bienes o servicios a un comprador.
                </li>
                <li className="text-sm leading-16.95px text-blue">
                    <span className="font-allerbold">Mandato:</span> Documento que se transmite cuando una persona o empresa
                    realiza una compra o contrata un servicio en nombre de otra.
                </li>
            </ul>
        ),
    },
};
