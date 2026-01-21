import React from 'react';
import { FieldName } from '@models/PurchaseInvoice';

export const INFORMATION = {
    PRODUCT_TABLE_INDICATION:
        'La información puede ser editada ubicándose en el campo requerido. Si necesita eliminar un producto o servicio, selecciónelo en los recuadros ubicados al lado izquierdo de la tabla y utilice el ícono de la caneca.',

    INTERNAL_NOTES: {
        title: 'Comentario para uso interno:',
        description:
            'agregue la información adicional de uso interno para su empresa, tenga en cuenta que esta información no se transmite a la DIAN ni al proveedor.',
    },
    SUCCESS_MODAL: {
        title: '¡Su factura de compra se ha guardado con éxito!',
        description: (
            <p className="text-gray-dark">
                Para visualizar todos los documentos electrónicos haga click en el botón &nbsp;
                <span className="font-allerbold">Siguiente</span> o si desea generar una nueva factura electrónica de compra haga
                click en el botón <span className="font-allerbold">Generar nueva factura de compra.</span>
            </p>
        ),
    },
    SUCCESS_EDIT: {
        title: 'Información guardada',
        description: <p className="text-gray-dark">¡Su información ha sido guardada con éxito!</p>,
    },
};

export const TOOLTIP_DATA: { [key: string]: { titleTooltip: string; descTooltip: string | JSX.Element } } = {
    [FieldName.Cufe]: {
        titleTooltip: 'CUFE:',
        descTooltip: 'Código Único de Facturación Electrónica.',
    },
    [FieldName.InvoiceNumber]: {
        titleTooltip: 'Número de factura del proveedor:',
        descTooltip: 'es el número que identifica la factura que el proveedor le ha transmitido a usted.',
    },
    [FieldName.Prefix]: {
        titleTooltip: 'Prefijo:',
        descTooltip: 'es un identificador de documentos de cuatro caracteres alfanuméricos.',
    },
    [FieldName.IssueDate]: {
        titleTooltip: 'Hora de emisión:',
        descTooltip: 'hora en la que se expide la factura de compra.',
    },
    [FieldName.BroadcastDate]: {
        titleTooltip: 'Fecha de emisión:',
        descTooltip: 'fecha en la que se expide la factura de compra.',
    },
    [FieldName.ExpirationDate]: {
        titleTooltip: 'Fecha de vencimiento:',
        descTooltip: 'fecha límite de cobro de la compra.',
    },
    [FieldName.BroadcastTime]: {
        titleTooltip: 'Hora de emisión:',
        descTooltip: 'hora en la que se expide la factura de compra.',
    },
    [FieldName.Supplier]: {
        titleTooltip: 'Nombre del proveedor:',
        descTooltip: 'es el nombre del proveedor que le genera la factura de compra.',
    },
    [FieldName.DocumentType]: {
        titleTooltip: 'Tipo de documento:',
        descTooltip: ' es el tipo de identificación del proveedor. ',
    },
    [FieldName.DocumentNumber]: {
        titleTooltip: 'Numero de documento:',
        descTooltip: 'es el número de identificación del proveedor.',
    },
    [FieldName.PersonType]: {
        titleTooltip: 'Tipo de contribuyente:',
        descTooltip: (
            <>
                <p className="mt-0.5 mb-1 text-blue text-sm">
                    <span className="font-allerbold">• Persona natural: </span>&nbsp; cuando el proveedor actúa a título personal.
                </p>
                <p className="text-sm text-blue">
                    <span className="font-allerbold">• Persona jurídica: </span>&nbsp; cuando el proveedor actúa en representación
                    de una sociedad conformada por una o mas personas.
                </p>
            </>
        ),
    },
    [FieldName.Comment]: {
        titleTooltip: 'Comentario para uso interno:',
        descTooltip:
            'agregue la información adicional de uso interno para su empresa, tenga en cuenta que esta información no se transmite a la DIAN ni al proveedor.',
    },
    [FieldName.PaymentType]: {
        titleTooltip: 'Forma de pago:',
        descTooltip: (
            <React.Fragment>
                <p className="mt-0.5 mb-1 text-blue text-sm">
                    <span className="font-allerbold">• Crédito: </span>&nbsp; es la modalidad de pago que se hace efectivo en un
                    periodo de tiempo diferente al día en el que se realiza la compra.
                </p>
                <p className="text-sm text-blue">
                    <span className="font-allerbold">• Contado:</span>&nbsp; es la modalidad de pago que se hace efectivo en el
                    mismo instante que se realiza la compra.
                </p>
            </React.Fragment>
        ),
    },
    [FieldName.PaymentMethod]: {
        titleTooltip: 'Medio de pago:',
        descTooltip: 'es el medio que se utiliza para pagar la factura.',
    },
    [FieldName.ForeignExchange]: {
        titleTooltip: 'Divisa:',
        descTooltip: 'es la moneda con la que se va a expedir la factura de compra.',
    },
};
