import { IGenericRecord } from '@models/GenericRecord';
import { TOOLTIPS_INFORMATION } from '@information-texts/CreateElectronicInvoice';

export * from './TooltipTitle';

/**
 * Terms used in tooltips
 */
export const TERMS: IGenericRecord = {
    sku: {
        title: 'SKU/Código de servicio',
        description: 'es el código único de identificación de sus productos/servicios.',
    },
    'product/service': {
        title: 'Producto/servicio',
        description: 'es el nombre de sus productos/Servicios.',
    },
    warehouse: {
        title: 'Bodega',
        description: 'es el nombre de la(s) bodega(s) en las que está almacenado el producto.',
    },
    batch: {
        title: 'Lote',
        description: 'es la identificación del lote del producto.',
    },
    dueDate: {
        title: 'Fecha de vencimiento',
        description: 'es la fecha de expiración de su producto.',
    },
    quantity: {
        title: 'Cantidad',
        description: 'es la cantidad del producto vendida a su cliente.',
    },
    measurementUnit: {
        title: 'Unidad de medida',
        description: 'es la magnitud con la que se mide su producto/servicio.',
    },
    id: {
        title: 'ID. Tercero y Tercero',
        description:
            'es el número de identificación y nombre del tercero o proveedor cuyos productos/servicios usted vende a su nombre bajo la modalidad de mandato.',
    },
    unitValue: {
        title: 'Valor unitario',
        description: 'es el precio de venta de una unidad de la referencia del producto.',
    },
    description: {
        title: 'Descripción',
        description: 'Agregue información adicional para la venta del producto/servicio.',
    },
    percentageDiscount: {
        title: 'Porcentaje de descuento',
        description: 'es el porcentaje del valor venta que el proveedor disminuye al producto/servicio.',
    },
    discount: {
        title: 'Descuento',
        description: 'es el resultado de la siguiente operación (valor venta * Porcentaje descuento)',
    },
    saleValue: {
        title: 'Valor venta',
        description: 'es el resultado de la siguiente operación (cantidad * valor unitario) - Descuento.',
    },
    consumption: {
        title: 'Impoconsumo',
        description:
            'el impuesto al consumo es el valor que se genera a partir de la compra o adquisición de un producto/servicio que no se considera indispensable.',
    },
    vat: {
        title: 'IVA',
        description: 'el impuesto al valor agregado es un valor adicional que se aplica al precio de cada producto/servicio.',
    },
    rates: [
        {
            title: 'Base',
            description: 'monto sobre el cual se determina el valor del impuesto o retención.',
        },
        {
            title: 'Tarifa',
            description: 'porcentaje que se aplica a la base.',
        },
        {
            title: 'Valor',
            description: 'Es la cantidad monetaria determinada por la multiplicación entre la base y la tarifa.',
        },
    ],
    withholdings: [
        {
            title: 'Retefuente',
            description: 'Es el recaudo anticipo del impuesto de renta.',
        },
        {
            title: 'Reteica',
            description: 'Es el recaudo anticipado del impuesto de Industria y Comercio.',
        },
        {
            title: 'Reteiva',
            description: 'Es el recaudo anticipado del Impuesto a las ventas.',
        },
    ],
    notInformationClient: {
        title: 'No suministró información personal',
        description:
            'Si su cliente no suministra dar su información personal, la factura se genera a nombre de Consumidor final con número de documento 222222222222.',
    },
    informationClient: {
        title: 'Voluntariamente autoriza su información personal',
        description:
            'Si su cliente suministra su información personal, agréguela en el formulario para la generación de la factura.',
    },
    sendEmail: {
        title: 'Envío por correo electrónico',
        description: TOOLTIPS_INFORMATION.SEND_EMAIL,
    },
    invoicePrint: {
        title: 'Entregar factura impresa',
        description: TOOLTIPS_INFORMATION.INVOICE_PRINT,
    },
    invoiceDevice: {
        title: 'Entregar factura en un dispositivo',
        description: TOOLTIPS_INFORMATION.INVOICE_DEVICE,
    },
    basicPlan: {
        description:
            'Ideal para diseñar de manera fácil y rápida el sitio web, con acompañamiento permanente y sin ningún cargo adicional por comisiones.',
    },
    standardPlan: {
        description:
            'Ideal para crear la tienda virtual de manera más fácil y rápida, con acompañamiento permanente y y sin ningún cargo adicional por comisiones.',
    },
    advancedPlan: {
        description:
            'Eleva al máximo el sitio web en el menor tiempo posible con opciones ilimitadas con acompañamiento permanente y sin ningún cargo adicional por comisiones.',
    },
    premiumPlan: {
        description:
            'Escala el negocio al siguiente nivel con el paquete completo que maximiza tus ventas en línea, con acompañamiento permanente y sin ningún cargo adicional por comisiones.',
    },
    firstDetailsDocument: {
        description: 'Identidad digital para simplificar los procesos de facturación de manera legal, segura y rápida.',
    },
    secondDetailsDocument: {
        description: 'Reenvíe fácil y rápido los documentos electrónicos emitidos al correo electrónico del cliente.',
    },
    thirdDetailsDocument: {
        description: 'Notifique los eventos (acuse de recibo, recibo de mercancía y aceptación o reclamo de la factura) a la DIAN verificando el estado de sus documentos electrónicos.',
    },
    fourthDetailsDocument: {
        description: 'Elabore los documentos electrónicos necesarios para la gestión de su negocio cumpliendo todos los requisitos exigidos por la DIAN.',
    },
    fifthDetailsDocument: {
        description: 'Contáctenos a través del correo electrónico de soporte a cualquier hora y se le responderá lo más pronto posible.',
    },
    sixthDetailsDocument: {
        description: 'Garantizamos la seguridad de su información a través de los servidores de Amazon Web Services.',
    },
    seventhDetailsDocument: {
        description: 'Personalice los documentos electrónicos de sus clientes con el logo de su empresa.',
    },
    eighthDetailsDocument: {
        description: 'Guarde los documentos electrónicos en su dispositivo en formato PDF o XML de manera fácil y rápida. ',
    },
    ninthDetailsDocument: {
        description: 'Acompañamiento por un especialista de diggi pymes durante el proceso de habilitación ante la DIAN para la generación de documentos electrónicos.',
    },
    priceDocuments: {
        description: 'Pago total por el paquete sin devoluciones',
    },
    freeDocuments: {
        description: TOOLTIPS_INFORMATION.FREE_DOCUMENTS
    },
    registrationName: {
        description: TOOLTIPS_INFORMATION.REGISTRATION_NAME,
    },
    companyId: {
        description: TOOLTIPS_INFORMATION.COMPANY_ID,
    },
    taxes: {
        title: 'Impuestos',
        description: TOOLTIPS_INFORMATION.TAXES
    }
};
