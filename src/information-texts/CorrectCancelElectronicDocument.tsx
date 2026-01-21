import React from 'react';
import { IGenericRecord } from '@models/GenericRecord';

export const PAGE_INFORMATION: Record<string, IGenericRecord> = {
    DEBIT_NOTE: {
        TITLE: 'Generar nota débito',
        LIGHT_BULB:
            'Las notas débito a una factura de venta se generan cuando el valor registrado quedó por debajo del que debía quedar o cuando la cantidad registrada es menor a la acordada.',
        REASON: 'Seleccione la razón por la cual va a generar esta nota débito.',
        QUESTION: '¿Por qué debo generar una nota débito?',
    },
    CREDIT_NOTE: {
        TITLE: 'Generar nota crédito',
        LIGHT_BULB:
            'Las notas crédito a una factura de venta se generan cuando el cliente solicita una devolución, cuando el empresario da un descuento adicional o cuando ambas partes requieren anular una factura de venta.',
        REASON: 'Seleccione la razón por la cual va a generar esta nota crédito.',
        QUESTION: '¿Por qué debo generar una nota crédito?',
    },
    ADJUSTMENT_NOTE: {
        TITLE: 'Generar nota de ajuste',
        LIGHT_BULB:
            'Las notas de ajuste a un documento soporte se generan cuando solicita una devolución, cuando el proveedor da un descuento adicional o cuando ambas partes requieren anular un documento soporte.',
        REASON: 'Seleccione la razón por la cual va a generar esta nota  de ajuste.',
        QUESTION: '¿Por qué debo generar una nota de ajuste?',
    },
    DESCRIPTION: (
        <>
            <p className="mb-2">
                Para generar una nota débito, crédito o de ajuste seleccione el tipo de nota, luego seleccione el documento
                electrónico a corregir en el campo documento asociado. Seleccione el motivo y agregue la información para generar
                la corrección.
            </p>
            <p>
                Al terminar haga click en <span className="font-allerbold">Siguiente</span> para almacenar la información en el
                sistema y enviarla a la DIAN.
            </p>
        </>
    ),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MODAL_TYPE: { [key: string]: any } = {
    SAVE: (typeNote: string): { title: string; description: string | JSX.Element } => ({
        title: `¡Su ${typeNote} se ha guardado con éxito!`,
        description: (
            <>
                Para conocer el estado de su documento haga click en el botón <span className="font-allerbold">Siguiente</span> o
                si desea generar una nueva {typeNote} haga click en el botón &nbsp;
                <span className="font-allerbold">Generar nueva {typeNote}.</span>
            </>
        ),
    }),
    DRAFT: {
        title: 'Documento guardado como borrador',
        description: '¡Su información ha sido guardada con éxito!',
    },
};

export const INFO_DATE = {
    DEBIT_NOTE:
        'La fecha y hora de transmisión de la nota débito se genera al momento de hacer click en Siguiente al final de esta pantalla.',
    CREDIT_NOTE:
        'La fecha y hora de transmisión de la nota crédito se genera al momento de hacer click en Siguiente al final de esta pantalla. ',
    ADJUSTMENT_NOTE:
        'La fecha y hora de transmisión de la nota de ajuste se genera al momento de hacer click en Siguiente al final de esta pantalla.',
};

export const TOOLTIP_PAGE = {
    BUTTON_DRAFT: {
        title: 'Guardar como borrador:',
        description: 'Le permite conservar los cambios para termínalos en otro momento.',
    },
};

export const VALIDATIONS_INVOICES: { [key: string]: string } = {
    SKU_INTERNAL: '*Los campos SKU/Código de servicio, Producto/Servicio son obligatorios.',
    QUANTITY: '*La cantidad debe ser mayor a cero',
    UNIT_COST: '*Ingrese un costo unitario válido',
    SEND_COST: 'Ingrese un costo de envío inferior al valor de la venta',
    MANDATE_ID: '*Los campos Proveedor o tercero son obligatorios',
};

export const VALIDATIONS_ESPECIAL: { [key: string]: string } = {
    BATCH: '*Ingrese un Lote o/y Fecha de vencimiento',
    PERCENTAGE_DISCOUNT: '*El porcentaje de descuento debe ser menor o igual al 100%',
};
