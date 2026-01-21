import React from 'react';

export const INFORMATION_PAGE = {
    title: 'Consulte los documentos electrónicos corregidos',
    description:
        'A continuación encuentra todos los documentos electrónicos que ha generado. Para ver el detalle del documento haga click en el número de documento correspondiente.',
};

export const TOOLTIPS_TABLE = {
    DATE: {
        title: 'Fecha de transmisión',
        description: 'Día en que se envía el documento electrónico a la DIAN',
    },
    SALE: {
        title: 'Total venta',
        description: 'Es el valor de la suma de todos los productos registrados en el documento electrónico',
    },
};

export const ANSWER_DIAN = {
    EMAIL_NO_SENT: (
        <>
            <p className="mt-0 text-sm text-gray">Aceptada</p>
            <p className="mt-0 text-tiny text-gray">Pendiente envío a cliente</p>
        </>
    ),
};
