import React from 'react';

export const CANCELLATION_ELECTRONIC_DOCUMENTS = {
    DESCRIPTION_PAGE: (
        <>
            <p className="mb-4 description-text">
                Desde esta pantalla genere tantas notas débito y/o crédito como necesite para cada una de sus facturas de venta
                electrónicas, no electrónicas o importadas desde otro proveedor tecnológico mediante archivo XML. Las facturas de
                venta electrónicas mostradas en la tabla, corresponden a aquellas que han sido aceptadas por la DIAN.
            </p>
            <p className="mb-4 description-text">
                Si el valor en la columna <span className="font-allerbold">Estado del documento</span> es “Anulado” significa que
                se generó una nota crédito con motivo de anulación y no está disponible para realizarle ajustes. Si el valor en la
                columna Estado del documento es “Activo” significa que la factura de venta no ha sido anulada.
            </p>
            <ul className="pl-6 list-disc">
                <li>Para visualizar una factura, haga click sobre su número.</li>
                <li>Para generar una nota débito a la factura, haga click en el botón Nota débito.</li>
                <li>Para generar una nota crédito a la factura, haga click en el botón Nota crédito.</li>
                <li>Para encontrar las facturas de venta de un cliente específico use el buscador.</li>
            </ul>
        </>
    ),
    ANNULAR_DESCRIPTION:
        'Si su empresa debe realizar la anulación de un documento electrónico emitido a sus clientes, puede hacerlo desde esta pantalla. Primero, rectifique que la factura junto a su información es la que desea anular. Finalmente haga click en Guardar para completar la anulación.',
    CANCEL_CREDIT_DESCRIPTION: (
        <>
            <p className="mb-4 description-text">
                Las notas crédito a una factura de venta se generan cuando el cliente solicita una devolución, cuando el
                empresario da un descuento adicional o cuando ambas partes requieren anular una factura de venta. Desde esta
                pantalla agregue la información que necesita para generar el documento de ajuste del documento electrónico
                rechazado. En caso de que vaya a anular la factura con la nota crédito seleccione la opción “Anulación” y haga
                click en Guardar.
            </p>
        </>
    ),
};
