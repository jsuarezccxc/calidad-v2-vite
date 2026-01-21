import React from 'react';
import { FieldName } from '@models/SalesInvoice';
import { Form } from '@models/ElectronicDocuments';
import { IGenericRecord } from '@models/GenericRecord';
import { PRODUCT_NAME } from '@constants/ProductName';

export const INFORMATION: IGenericRecord = {
    PRODUCT_TABLE_INDICATION:
        'La información puede ser editada ubicándose en el campo requerido. Si necesita eliminar un producto o servicio, selecciónelo en las casillas ubicadas al lado izquierdo de la tabla y utilice el ícono de la caneca.',

    [Form.Client]: {
        title: 'Agregar cliente',
        description: 'Ingrese los datos de su cliente para transmitir la factura',
    },
    [Form.Supplier]: {
        title: 'Agregar proveedor',
        description: 'Agregue la siguiente información del proveedor',
    },
    INTERNAL_NOTES: {
        title: 'Comentario para uso interno:',
        description: 'Es un comentario de uso interno el cual no se va a ver en la factura generada al cliente.',
    },
    INVOICE_GENERATED: {
        title: '¡Su factura de venta se ha guardado con éxito!',
        description: (
            <p className="tex-gray-dark">
                Para conocer el estado de su documento haga click en el botón &nbsp;
                <span className="font-allerbold">Siguiente</span> o si desea generar una nueva factura electrónica de venta haga
                click en el botón <span className="font-allerbold">Generar nueva factura de venta.</span>
            </p>
        ),
    },
    INVOICE_REJECTED: {
        title: '¡Su factura ha sido rechazada por la DIAN!',
        description: (
            <p className="tex-gray-dark">
                Para ver el motivo del rechazo y corregirlo, haga click en el botón &nbsp;
                <span className="font-allerbold">Corregir.</span>
            </p>
        ),
    },
    DRAFT_MODAL: {
        title: 'Documento guardado como borrador',
        description: '¡Su información ha sido guardada con éxito!',
    },
    REMOVE_PRODUCT: {
        title: 'Eliminar producto/servicio',
        description: '¿Está seguro que desea eliminar los elementos seleccionados?',
    },
    INVOICE_IN_VERIFICATION: {
        title: 'Información',
        description: (
            <p className="text-gray-dark">
                <span className="block mb-3">
                    ¡La DIAN ha excedido el tiempo habitual para procesar el documento electrónico!
                </span>
                &nbsp; Actualmente su documento electrónico se encuentra en estado de verificación. Por favor, vuelva a revisar el
                estado del documento en aproximadamente 1 hora para verificar si ha cambiado a &nbsp;
                <span className="font-allerbold">Aceptado o Rechazado.</span>
            </p>
        ),
    },
    INVOICE_ERROR: {
        title: 'Error en la transmisión de factura de venta',
        description: (
            <p className="text-gray-dark">
                La DIAN presenta error 04 (fuera de línea), su factura se reenviará automáticamente cada 5 segundos hasta 3
                intentos. En caso de continuar el error tipo 4, la factura se retransmite automáticamente 1 hora más tarde, y así
                sucesivamente hasta que el error desaparezca o hasta que sea transmitida exitosamente.
                <span className="block">Se le notificará una vez la factura haya sido transmitida con éxito.</span>
            </p>
        ),
    },
    DRAFT_TOOLTIP: {
        title: 'Guardar como borrador:',
        description: 'Le permite conservar los cambios para termínalos en otro momento.',
    },
    ERROR_DIAN: {
        title: 'Contingencia',
        description: `${PRODUCT_NAME} está presentando un problema con la transmisión a la DIAN, pero no se preocupe, puede seguir facturando sin problemas. Genere una factura de contingencia y, una vez solucionada la contingencia, los documentos se enviarán automáticamente a la DIAN.`,
    },
    CONTINGENCY_SAVE: {
        title: '¡Su factura electrónica de contingencia se ha guardado con éxito!',
        description:
            'Para conocer el estado de su documento haga click en el botón Siguiente o si desea generar una nueva factura electrónica de venta haga click en el botón Generar nueva factura de venta.',
    },
};

export const TOOLTIP_DATA: { [key: string]: { titleTooltip: string; descTooltip: string | JSX.Element } } = {
    [FieldName.ClientName]: {
        titleTooltip: 'Nombre del cliente:',
        descTooltip: 'es el nombre del cliente.',
    },
    [FieldName.DocumentType]: {
        titleTooltip: 'Tipo de documento:',
        descTooltip: 'es el tipo de identificación del cliente.',
    },
    [FieldName.DocumentNumber]: {
        titleTooltip: 'Numero del documento:',
        descTooltip: 'es el número de identificación del cliente.',
    },
    [FieldName.PersonType]: {
        titleTooltip: 'Tipo de contribuyente:',
        descTooltip: (
            <>
                <p className="mt-0.5 mb-1 text-blue text-sm">
                    <span className="font-allerbold">• Persona natural: </span>&nbsp; cuando el cliente actúa a título personal.
                </p>
                <p className="text-sm text-blue">
                    <span className="font-allerbold">• Persona jurídica: </span>&nbsp; cuando el cliente actúa en representación
                    de una sociedad conformada por una o mas personas.
                </p>
            </>
        ),
    },
    [FieldName.OperationType]: {
        titleTooltip: 'Tipo de factura:',
        descTooltip: (
            <>
                <p className="mt-0.5 mb-1 text-blue text-sm">
                    <span className="font-allerbold">Estándar:</span>&nbsp; Documento comercial generado por un vendedor como
                    prueba de la venta de bienes o servicios a un comprador.
                </p>
                <p className="text-sm text-blue">
                    <span className="font-allerbold">Mandato: </span>&nbsp; Documento que se transmite cuando una persona o
                    empresa realiza una compra o contrata un servicio en nombre de otra.
                </p>
            </>
        ),
    },
    [FieldName.Prefix]: {
        titleTooltip: 'Prefijo:',
        descTooltip: 'es un identificador de facturas electrónicas de venta de cuatro caracteres alfanuméricos.',
    },
    [FieldName.PaymentType]: {
        titleTooltip: 'Forma de pago:',
        descTooltip: (
            <>
                <p className="mt-0.5 mb-1 text-blue text-sm">
                    <span className="font-allerbold">• Crédito: </span>&nbsp; es la modalidad de pago que se hace efectivo en un
                    periodo de tiempo diferente al día en el que se realiza la compra.
                </p>
                <p className="text-sm text-blue">
                    <span className="font-allerbold">• Contado:</span>&nbsp; es la modalidad de pago que se hace efectivo en el
                    mismo instante que se realiza la compra.
                </p>
            </>
        ),
    },
    [FieldName.PaymentMethod]: {
        titleTooltip: 'Medio de pago:',
        descTooltip: 'es el medio que se utiliza para pagar la factura.',
    },
    [FieldName.ForeignExchangeId]: {
        titleTooltip: 'Divisa:',
        descTooltip: 'Es la moneda con la que se va a expedir la factura de venta.',
    },
    [FieldName.Supplier]: {
        titleTooltip: 'Nombre proveedor o tercero:',
        descTooltip:
            'Entidad externa que suministra bienes o servicios a una empresa u organización en el curso de sus operaciones comerciales.',
    },
    [FieldName.Taxes]: {
        titleTooltip: 'Impuestos:',
        descTooltip: (
            <p className="text-sm text-blue">
                obligaciones tributarias que la persona o empresa deben pagar al estado. Para saber mas sobre impuestos haga click
                aca: &nbsp;
                <a
                    target="__blank"
                    className="underline text-purple"
                    href="https://www.dian.gov.co/Paginas/Vencimientos-tributarios-marzo-2024.aspx"
                >
                    Ver más
                </a>
            </p>
        ),
    },
};
