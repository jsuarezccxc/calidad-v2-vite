import React from 'react';
import { Icon } from '@components/icon';
import { Link, LinkColor } from '@components/button';

export const INVOICE_INFORMATION = {
    REGISTRATION_STEPS: (
        <>
            <p className="invoice-text">
                Para contar con factura electrónica, ésta debe ser aprobada por la DIAN. Este proceso consiste en los siguientes
                cuatro pasos:
            </p>
            <p className="mt-3 invoice-text">1. Inscripción del RUT en la DIAN</p>
            <p className="invoice-text">2. Habilitación en la DIAN</p>
            <p className="invoice-text">3. Set de pruebas</p>
            <p className="invoice-text">4. Asociar prefijos de numeración de facturación</p>
            <p className="mt-3 invoice-text">
                Las instrucciones detalladas para completar cada uno de ellos se encuentran en el siguiente &nbsp;
                <Link text="PDF." href="/electronic-invoice" linkColor={LinkColor.PURPLE} classes="underline invoice-text" />
                &nbsp; En caso de que ya tenga
            </p>
            <p className="invoice-text">inscrito el RUT en la DIAN, siga al paso número dos.</p>
        </>
    ),
    API: <p className="invoice-text">API que permite subir factura electrónica</p>,
};

export const VALIDATIONS_INVOICES = {
    SKU: 'El campo SKU/Código de servicio - Producto/Servicio es obligatorio.',
    WAREHOUSE: '*Ingrese una Bodega',
    BATCH_AND_WAREHOUSE: '*Ingrese un Lote o/y Fecha de vencimiento',
    QUANTITY_ZERO: '*La cantidad debe ser mayor a cero',
    UNIT_COST: '*Ingrese un costo unitario válido',
    PERCENTAGE_DISCOUNT: '*El porcentaje de descuento debe ser menor o igual al 100%',
    SEND_COST: 'Ingrese un costo de envío inferior al valor de la venta',
    BUY: '*Estos campos son obligatorios, agréguelos antes de continuar.',
};

export const messageHour = (isNote = true): string =>
    `*Hora de emisión: La hora de la emisión de la ${
        isNote ? 'nota' : 'cotización'
    } se genera al momento de hacer click en Guardar al final de esta pantalla.`;

export const DETAILS_INVOICE =
    'La información puede ser editada ubicándose en el campo requerido. Si necesita eliminar un producto o servicio, selecciónelo en las casillas ubicadas al lado izquierdo de la tabla y utilice el ícono de la caneca.';

export const TABLE_TOOLTIPS = {
    SKU: (
        <div className="flex w-77">
            <Icon name="infoBlue" />
            <p className="text-sm text-blue">
                <span className="font-allerbold">SKU/Código - Producto/servicio:</span> es el código único de identificación y el
                nombre de sus productos/servicios.
            </p>
        </div>
    ),
    DESCRIPTION: (
        <div className="flex">
            <Icon name="infoBlue" />
            <p className="text-sm text-blue">
                <span className="font-allerbold">Descripción:</span> información adicional para la venta del producto/servicio.
            </p>
        </div>
    ),
    QUANTITY: (
        <div className="flex">
            <Icon name="infoBlue" />
            <p className="text-sm text-blue">
                <span className="font-allerbold">Cantidad:</span> es la cantidad del producto vendida a su cliente.
            </p>
        </div>
    ),
};
