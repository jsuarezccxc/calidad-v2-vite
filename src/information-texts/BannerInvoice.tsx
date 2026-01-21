import React from 'react';
import { PRODUCT_NAME } from '@constants/ProductName';
import { getTimeDate } from '@utils/Date';

export const INFORMATION_TEXT = (initHour: string, finishHour: string): JSX.Element => {
    return (
        <>
            Estamos experimentando fallas en el sistema de {PRODUCT_NAME}. Por ello, la transmisión de facturación electrónica no
            estará disponible desde <span className="lowercase">{getTimeDate(initHour)}</span>. hasta &nbsp;
            <span className="lowercase">{getTimeDate(finishHour)}</span>. o hasta que el servicio se restablezca.
        </>
    );
};
