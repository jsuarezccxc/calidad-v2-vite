import React from 'react';
import { IGenericRecord } from '@models/GenericRecord';

export const SUPPORT_DOCUMENT = {
    MODAL_TITLE: 'Definición de términos',
    MODAL: (
        <>
            <div className="mt-4 overflow-auto text-gray-dark md:h-112">
                <p className="mb-4.5">
                    <span className="font-allerbold">Documento soporte electrónico:</span> es el documento que soporta la compra
                    de un producto o la prestación de un servicio cuando el proveedor es un sujeto no obligado a expedir factura
                    electrónica.
                </p>
                <p className="mb-4.5">
                    El comprador debe realizar este documento para soportar la transacción que da lugar a costos, deducciones o
                    impuestos descontables, por medio de un documento con numeración autorizada por la DIAN.
                </p>
                <p className="mb-4.5">
                    <span className="font-allerbold">Prefijo:</span> es un identificador de documentos de cuatro caracteres
                    alfanuméricos.
                </p>
                <div className="mb-4.5">
                    <span className="font-allerbold">Tipo de pago:</span>
                    <ol className="ml-6 list-disc mt-4.5">
                        <li className="mb-4.5">
                            <span className="font-allerbold">Crédito:</span> es la modalidad de pago que se hace efectivo en un
                            periodo de tiempo diferente al día en el que se realiza la compra.
                        </li>
                        <li>
                            <span className="font-allerbold">Contado:</span> es la modalidad de pago que se hace efectivo en el
                            mismo instante que se realiza la compra.
                        </li>
                    </ol>
                </div>
                <p className="mb-4.5">
                    <span className="font-allerbold">Número del documento entregado por el proveedor:</span> es el consecutivo de
                    la factura que le emitió su proveedor por los servicios/productos adquiridos.
                </p>
                <p className="mb-4.5">
                    <span className="font-allerbold">Nombre de encargado de la compra:</span> es el nombre del tercero (empleado)
                    que realiza la compra a nombre de su empresa.
                </p>
                <p className="mb-4.5">
                    <span className="font-allerbold">Clasificación:</span> es el campo en el que se selecciona si la compra es de
                    productos, de servicios, o de la combinación de ambos.
                </p>
                <p>
                    <span className="font-allerbold">Distribución en bodegas:</span> es la tabla en la cual se distribuyen los
                    productos si selecciona una bodega podrá almacenar los productos comprados en una sola bodega. Si selecciona
                    varias bodegas bodegas tendrá la opción de almacenar los productos comprados en las bodegas disponibles en la
                    tabla Distribución varias bodegas.
                </p>
            </div>
        </>
    ),
    TABLE_TITLE: 'Definición de términos',
    TABLE: (
        <>
            <div className="mt-2 text-gray-dark w-89 xs:w-full">
                <p className="mb-5">
                    <span className="font-allerbold">Valor compra:</span> es la multiplicación entre el costo unitario y compras
                    en unidades, menos el descuento, más el costo de entrega de cada producto.
                </p>
                <p>
                    <span className="font-allerbold">Total:</span> es la suma del valor de compra más el IVA, Retefuente y
                    Reteica.
                </p>
            </div>
        </>
    ),
    MODAL_SAVE_TITLE: 'Información guardada',
    MODAL_SAVE_TEXT: ({ prefix = 'XXX', number = 'YYYY' }: IGenericRecord): JSX.Element => (
        <div className="w-89 xs:w-full">
            <p className="mt-2 text-gray-dark">¡Su información ha sido guardada con éxito!</p>

            <p className="text-gray-dark my-4.5">
                Su documento soporte ha sido creado y transmitido a la DIAN con el prefijo {prefix} y el número {number}.
            </p>

            <p className="text-gray-dark mb-7">
                Si desea crear otro documento soporte, haga click en el botón Agregar. Si no tiene más documentos soporte por
                crear, haga click en Siguiente
            </p>
        </div>
    ),
    MODAL_TITLE_FORM: 'Agregar proveedor',
    MODAL_FORM_TEXT: <p className="text-base text-gray-dark">Agregue la siguiente información por proveedor.</p>,
};

export const MODAL_TYPE = {
    DELETE: {
        title: 'Eliminar producto/servicio',
        description: '¿Está seguro que desea eliminar los elementos seleccionados?',
    },
    SAVE: {
        title: '¡Su documento soporte se ha guardado con éxito!',
        description: (
            <>
                Para visualizar todos los documentos electrónicos haga click en el botón &nbsp;
                <span className="font-allerbold">Siguiente</span> o si desea generar una nuevo documento soporte haga click en el
                botón <span className="font-allerbold">Generar nuevo documento soporte</span>
            </>
        ),
    },
};

export const MODAL_TOTAL = {
    WARNING: {
        title: 'Advertencia',
        description: 'Verifique que el valor total sea correcto y no muestre un valor negativo',
    },
};

export const TOOLTIPS_PAGE = {
    INTERNAL_COMMENT: {
        title: 'Comentario para uso interno:',
        description:
            'Agregue la información adicional de uso interno para su empresa, tenga en cuenta que esta información no se transmite a la DIAN ni al cliente.',
    },
    PREFIX: {
        titleTooltip: 'Prefijo:',
        descTooltip: 'es un identificador de documentos de cuatro caracteres alfanuméricos.',
    },
    SUPPLIER: {
        titleTooltip: 'Nombre del proveedor:',
        descTooltip: 'es el nombre del proveedor que le genera la factura de compra.',
    },
    TYPE_DOCUMENT: {
        titleTooltip: 'Tipo de documento:',
        descTooltip: 'es el tipo de identificación del proveedor.',
    },
    DOCUMENT_NUMBER: {
        titleTooltip: 'Número de documento:',
        descTooltip: 'es el número de identificación del proveedor.',
    },
    ADDRESS: {
        titleTooltip: 'Dirección:',
        descTooltip: 'Ubicación geográfica del proveedor.',
    },
    COUNTRY: {
        titleTooltip: 'País:',
        descTooltip: 'Ubicación geográfica del proveedor.',
    },
    DEPARTMENT: {
        titleTooltip: 'Departamento:',
        descTooltip: 'Ubicación geográfica del proveedor.',
    },
    CITY: {
        titleTooltip: 'Ciudad:',
        descTooltip: 'Ubicación geográfica del proveedor.',
    },
    POSTAL_CODE: {
        titleTooltip: 'Código postal:',
        descTooltip: 'es la combinación de números que representa la zona en la que está ubicado del proovedor. ',
    },
    PHONE: {
        titleTooltip: 'Teléfono:',
        descTooltip: 'es número de teléfono fijo o celular del proveedor.',
    },
    TAXES: {
        titleTooltip: 'Detalle de impuestos:',
        descTooltip: 'es el tributo al que el contribuyente está obligado a facturar. Se encuentra en la casilla 53 del RUT.',
    },
    FISCAL_RESPONSIBILITY: {
        titleTooltip: 'Responsabilidad fiscal:',
        descTooltip:
            'es la clasificación que la DIAN le da a los contribuyentes, para saber a qué impuestos están obligados. Se encuentra en la casilla 53 del RUT.',
    },
    TAXPAYER: {
        titleTooltip: 'Tipo de contribuyente:',
        descTooltip: (
            <ul className="ml-6 list-disc">
                <li className="text-sm leading-16.95px text-blue mb-4.5">
                    <span className="font-allerbold">Persona natural:</span> cuando el proveedor actúa a título personal.
                </li>
                <li className="text-sm leading-16.95px text-blue">
                    <span className="font-allerbold">Persona jurídica:</span> cuando el proveedor actúa en representación de una
                    sociedad conformada por una o mas personas.
                </li>
            </ul>
        ),
    },
    SUPPORT_DOCUMENT: {
        titleTooltip: 'Número de la cuenta de cobro o documento equivalente por el proveedor:',
        descTooltip: 'es el consecutivo de la factura que le emitió su proveedor por los servicios/productos adquiridos.',
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
        descTooltip: 'es el medio que se utiliza para pagar el documento de soporte.',
    },
    COMMENTS: {
        title: 'Comentario para uso interno:',
        description:
            'son anotaciones o notas internas que se adjuntan en el documento con fines de registro interno o comunicación entre la empresa.',
    },
    BADGE: {
        titleTooltip: 'Divisa:',
        descTooltip: ' es la moneda con la que se va a expedir el documento soporte',
    },
};

export const PAGE_TEXT = {
    DOCUMENT_TYPE: 'Si la persona natural no tiene RUT, no podrá ser incluida en el documento soporte electrónico',
};
