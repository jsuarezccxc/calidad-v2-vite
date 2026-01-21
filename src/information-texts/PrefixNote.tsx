import React from 'react';
import { IGenericRecord } from '@models/GenericRecord';

export const INFORMATION_PAGE: IGenericRecord = {
    TITLE_CREDIT_DEBIT_NOTE: 'Nota débito y crédito',
    TITLE_ADJUSTMENT_NOTE: 'Nota de ajuste',
    DESCRIPTION: (
        <p>
            Agregue y consulte los prefijos para la corrección y/o anulación de sus documentos electrónicos. Los prefijos que ya
            hayan sido utilizados en la transmisión de documentos electrónicos no podrán ser eliminados.
        </p>
    ),
    MODAL_SAVE: {
        title: 'Información guardada',
        description: '¡Su información ha sido guardada con éxito!',
    },
    MODAL_DELETE: {
        title: 'Eliminar prefijo',
        description: '¿Está seguro que desea eliminar el prefijo seleccionado?',
    },
};

export const INFORMATION_TABLE = {
    DEBIT_NOTE: {
        LINK_NAME: '+Agregar prefijo nota débito/nota crédito',
        DESCRIPTION: (
            <>
                <p className="mb-4.5">
                    Cuando se realiza un documento electrónico, es probable que se cometa un error en los valores cobrados o que
                    su cliente desista de la compra, haciendo que el valor inicialmente registrado o facturado deba ser
                    modificado, ya sea para aumentarlo o para disminuirlo. Las notas débito o crédito se utilizan para realizar
                    estos ajustes. Tenga en cuenta que las notas débito/crédito realizadas a las facturas electrónicas de venta,
                    alteran el inventario y también son transmitidas a la DIAN.
                </p>
                <p>
                    Para identificar sus notas débito o crédito con un prefijo, haga click en +Agregar prefijo nota débito/nota
                    crédito y agregue la información solicitada. Este prefijo es opcional.
                </p>
            </>
        ),
    },
    ADJUSTMENT_NOTE: {
        LINK_NAME: '+Agregar prefijo nota de ajuste',
        DESCRIPTION: (
            <p>
                Para registrar modificaciones a los documentos soporte electrónicos registrados y transmitidos, asigne uno o más
                prefijos para sus notas de ajuste electrónicas. Tenga en cuenta que las notas de ajuste realizadas a documentos
                soporte electrónicos, alteran el inventario y también son transmitidos a la DIAN.
            </p>
        ),
    },
};
