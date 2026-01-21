import React from 'react';
import { Routes } from '@constants/Paths';

const getGenerationInstructions = (documentType: string, buttonText: string): React.ReactElement => (
    <p className="text-gray-dark mt-4.5 mb-7">
        Para generar la {documentType} diligencie todos los campos requeridos y al finalizar dar clic en el botón
        &quot;{buttonText}&quot; para almacenar la información en el sistema.
    </p>
);

export const PAGE_DIRECTION: (
    isEditPage: boolean
) => {
    [key: number]: {
        submodule?: string;
        subTitle: string;
        question: string;
        answer: string;
        indications: string | JSX.Element;
    };
} = (isEditPage: boolean) => ({
    [Routes.GENERATE_SALES_INVOICE]: {
        subTitle: 'Generar factura electrónica de venta',
        question: '¿Por qué debo generar una factura de venta?',
        answer: 'Para cumplir con los requerimientos de la DIAN y para el control y seguimiento sobre sus ventas',
        indications: (
            <div className="text-gray-dark mt-2 mb-4.5">
                <p>Para generar la factura electrónica agregue todos los datos solicitados.</p>
                <p>
                    Para almacenar la información en el sistema y transmitir la factura a la DIAN, haga click en el botón
                    &quot;Siguiente&quot;.
                </p>
            </div>
        ),
    },
    [Routes.GENERATE_CONTINGENCY_INVOICE]: {
        subTitle: 'Generar factura electrónica de contingencia',
        question: '¿Por qué debo generar una factura electrónica de contingencia?',
        answer: 'Para mantener al dia su facturación electrónica durante la contingencia del sistema.',
        indications: (
            <>
                <p className="text-gray-dark my-4.5">
                    Cuando diggi pymes presente inconvenientes en su software, las facturas electrónicas de venta no podrán ser
                    enviadas a la DIAN y por lo tanto, no podrán ser aceptadas ni rechazadas. Una vez diggi pymes recupere el
                    funcionamiento de su software, todas las facturas de contingencia serán enviadas a la DIAN para su posterior
                    rechazo o aceptación.
                </p>
                <p className="text-gray-dark mb-4.5">
                    Para almacenar la información en el sistema y transmitir la factura a la DIAN una vez restablecido el
                    servicio, haga click en el botón &quot;Siguiente&quot;.
                </p>
            </>
        ),
    },
    [Routes.GENERATE_PURCHASE_INVOICE]: {
        subTitle: isEditPage ? 'Editar factura de compra' : 'Generar factura de compra',
        question: isEditPage ? '¿Por qué editar una factura de compra?' : '¿Por qué debo generar una factura de compra?',
        answer: isEditPage
            ? 'Para ajustar o corregir la información de sus facturas de compra con el proveedor en caso de haber diligenciado datos incorrectos o que requiera realizar ajustes.'
            : 'Para almacenar y llevar un registro eficiente de todas sus facturas de compra con el proveedor',
        indications: getGenerationInstructions('factura de compra', 'siguiente'),
    },
    [Routes.QUOTES_REPORT]: {
        subTitle: isEditPage ? 'Editar cotización' : 'Generar cotización',
        question: isEditPage ? '¿Por qué editar una cotización?' : '¿Por qué debo generar una cotización?',
        answer: isEditPage
            ? 'Para ajustar o corregir la información de sus cotizaciones en caso de haber diligenciado datos incorrectos o que requiera realizar ajustes.'
            : 'Para formalizar y dejar constancia de una oferta comercial a un cliente, detallando productos, servicios y condiciones.',
        indications: getGenerationInstructions('cotización', 'Guardar'),
    },
});
