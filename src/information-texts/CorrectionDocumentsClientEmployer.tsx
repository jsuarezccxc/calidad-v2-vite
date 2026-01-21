import React from 'react';
import { Icon } from '@components/icon';
import { PRODUCT_NAME } from '@constants/ProductName';
import { IGenericRecord } from '@models/GenericRecord';
import { getTypeInvoice } from '@pages/correction-business-document';
import { getTimeDate } from '@utils/Date';

export const PARAGRAPHS = {
    INFORMATION: (
        <div className="description-text font-aller">
            <p>
                La corrección de documentos por parte del empresario por rechazo del cliente le muestra al empresario el
                documento, el motivo del rechazo, las observaciones y los documentos de soporte. La primera acción de su parte es
                revisar este rechazo y verificar si está de acuerdo o no con el mismo.
            </p>
            <ul className="mt-4 ml-2 list-disc list-inside">
                <li>
                    Si está de acuerdo haga click en aceptar rechazo, lo cual lo llevará a realizar las correcciones
                    correspondientes.
                </li>
                <li>
                    Si NO está de acuerdo haga click en <span className="font-allerbold">No aceptar rechazo</span>, lo cual lo
                    llevará a la plantilla de correo electrónico para contactar a su cliente.
                    <ul className="mt-1 ml-6 list-disc list-outside">
                        <li>
                            Asegúrese de que cuando haya llegado a un acuerdo con su cliente regrese a la pantalla Corrección de
                            documentos electrónicos por parte del empresario y actualice el proceso haciendo click en acuerdo con
                            el cliente si no hay cambios en el documento. Una vez usted haga click en acuerdo con el cliente,{' '}
                            <span className="font-allerbold">{PRODUCT_NAME}</span> actualizará este documento como debidamente
                            aceptado por el cliente.
                        </li>
                        <li>
                            Si después de contactarse con su cliente se aceptan los cambios en el documento, en esta pantalla haga
                            click en <span className="font-allerbold">Aceptar rechazo</span> y siga el debido proceso.
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    ),
    DESCRIPTION_SUMMARY_ARRANGEMENTS: (
        <div>
            En la siguiente tabla puede visualizar los documentos electrónicos que han sido corregidos por los siguientes motivos:
            error en datos personales, error en fechas, error en descripción de servicio, descuento no aplicado, devolución
            parcial de productos, error valor cobrado de más en la factura, desistimiento de la compra, error valor cobrado de
            menos en la factura, error en cantidad de los productos facturados vs. productos recibidos por el cliente y por error
            en referencia de productos facturado. Cada fila de la tabla corresponde a un documento electrónico
            <ul className="mt-1 ml-8">
                <li>
                    En la columna número de documento electrónico puede visualizar el documento electrónico rechazado junto con el
                    motivo de rechazo, observaciones y documento de soporte para el rechazo haciendo click sobre el número del
                    documento electrónico en la fila correspondiente.
                </li>
                <li>
                    En la columna motivo de corrección puede visualizar el documento electrónico haciendo click sobre el motivo de
                    corrección del documento correspondiente.
                </li>
            </ul>
        </div>
    ),
    DESCRIPTION_VIEW_CORRECTION:
        'En esta pantalla puede visualizar los cambios realizados para corregir los errores del documento electrónico.',
    DESCRIPTION_EDIT_CORRECTION: (
        <React.Fragment>
            <p>
                Si su empresa debe realizar correcciones a los documentos emitidos a sus clientes cuando estos han sido rechazados
                por el cliente, las puede hacer desde esta pantalla.
            </p>
            <div className="mt-5">
                Teniendo en cuenta las observaciones y los documentos de soporte proporcionados por su cliente para justificar el
                rechazo, decida si necesita corregir la factura electrónica de venta mediante una nota débito o una nota crédito.
                Las notas débito se usan para aumentar el valor de la factura debido a un cobro no realizado o por un valor menor
                facturado. Las notas crédito se usan para disminuir el valor de la factura debido a valores cobrados de más, por
                un mayor precio del producto/servicio cobrado en la factura o para anular la factura de venta. Si las correcciones
                a realizar en la factura de su cliente dan lugar a una anulación, haga click en el botón Nota crédito, luego
                seleccione la opción “Anulación” y haga click en Guardar.
                <ul className="ml-8 mt-4.5">
                    <li>Para generar una nota débito a la factura, haga click en el botón Nota débito.</li>
                    <li>Para generar una nota crédito a la factura, haga click en el botón Nota crédito.</li>
                    <li>
                        Si requiere tanto una nota débito como una nota crédito, genere primero alguna de las dos, haga click en
                        Guardar y podrá generar la otra nota.
                    </li>
                </ul>
            </div>
        </React.Fragment>
    ),
    DESCRIPTION_CREDIT_NOTE:
        'Las notas crédito a un documento electrónico se generan cuando el cliente solicita una devolución, cuando el empresario da un descuento adicional o cuando ambas partes requieren anular una factura de venta. Desde esta pantalla agregue la información que necesita para generar el documento de ajuste del documento electrónico rechazado.',
    DESCRIPTION_CREATE_CREDIT_NOTE: (
        <React.Fragment>
            <p>
                Las notas crédito a una factura de venta se generan cuando el cliente solicita una devolución, cuando el
                empresario da un descuento adicional o cuando ambas partes requieren anular una factura de venta. Desde esta
                pantalla agregue la información que necesita para generar el documento de ajuste del documento electrónico
                rechazado. En caso de que vaya a anular la factura con la nota crédito seleccione la opción “Anulación” y haga
                click en Guardar.
            </p>
        </React.Fragment>
    ),

    DESCRIPTION_CREATE_DEBIT_NOTE:
        'Las notas débito a un documento electrónico se generan cuando el valor registrado quedó por debajo del que debía quedar o cuando la cantidad registrada es menor a la acordada.',
    DESCRIPTION_MODAL_SAVE: (
        <React.Fragment>
            <p>¡Su información ha sido guardada con éxito!</p>
            <p className="mt-5">La nota será enviada a la DIAN.</p>
        </React.Fragment>
    ),
};

export const SAVE_CORRECTION = {
    INFORMATION: (
        <div className="modal--response">
            <div>
                <div className="flex flex-row items-center mb-2">
                    <Icon name="checkBlue" onClick={(): void => {}} className="header__icon" alt="info-modal" />
                    <h3 className="text-xl font-bold leading-xl text-blue">Información</h3>
                </div>
                <div className="w-full text-base font-normal leading-base text-gray-dark">
                    <p>Guarde la información antes de continuar. Si da click en siguiente los cambios se perderán</p>
                </div>
            </div>
        </div>
    ),
};

export const MODAL_SAVE = (data: IGenericRecord, type: string): IGenericRecord => ({
    DESCRIPTION_MODAL_SAVE: (
        <React.Fragment>
            <div className="w-96">
                <p>¡Su información ha sido guardada con éxito!</p>
                <p className="mt-5">
                    Su {getTypeInvoice(type).type.toLowerCase()} ha sido creada con el prefijo {data?.consecutive || ''} Y el
                    número {data?.number || ''}
                </p>
                <p className="mt-3">
                    Hora de emisión: <span className="lowercase">{getTimeDate(data.time_issue)}</span> hrs
                </p>
            </div>
        </React.Fragment>
    ),
});

export const DELETE_TABLE_PRODUCTS = {
    TITLE: 'Eliminar',
    INFORMATION: (
        <React.Fragment>
            <p>
                ¿Está seguro de eliminar los elementos seleccionados?
                <br /> <br />
                Los elementos eliminados son llevados a la papelera.
            </p>
        </React.Fragment>
    ),
};
