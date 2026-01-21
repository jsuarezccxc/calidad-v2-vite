import React from 'react';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';

export const INFORMATION_PAGE = {
    title: MODULE_TITLES.INVOICE,
    question: '¿Para qué debo generar un documento soporte?',
    lightBulb:
        'Para acreditar la compra de bienes y/o servicios a un proveedor que no está obligado a facturar o a generar documentos equivalentes.',
    description: (
        <>
            <p className="text-gray-dark">Para generar el documento soporte agregue todos lo datos solicitados.</p>
            <p className="text-gray-dark">
                Para almacenar la información en el sistema y transmitir el documento a la DIAN, haga click en el botón
                &quot;Siguiente&quot;.
            </p>
        </>
    ),
    TEXT_DATE:
        'La fecha y hora de transmisión del documento soporte se genera al momento de hacer click en Siguiente al final de esta pantalla.',
};

export const MODAL = {
    SAVE_SUPPLIER: {
        title: 'Información guardada',
        description: '¡Su información ha sido guardada con éxito!',
    },
    SAVE_SUPPORT: {
        title: '¡Su documento soporte se ha guardado con éxito!',
        description: (
            <>
                Para visualizar todos los documentos electrónicos haga click en el botón &nbsp;
                <span className="font-allerbold">Siguiente</span> o si desea generar una nuevo documento soporte haga click en el
                botón <span className="font-allerbold">Generar nuevo documento soporte</span>
            </>
        ),
    },
    BUTTON_SAVE_SUPPORT: 'Generar nuevo documento soporte',
};
