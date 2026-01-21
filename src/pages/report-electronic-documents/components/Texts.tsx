import React from 'react';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import { CONSULT_ACCOUNTING_REPORTS } from '..';
import usePopper from '@hooks/usePopper';

export const Texts: React.FC = () => {
    const {
        anchorEl,
        mouseProps: { onMouseLeave, onMouseOver },
    } = usePopper();

    return (
        <>
            <h3 className="font-bold text-center text-blue text-26lg font-allerbold mb-4.5">{CONSULT_ACCOUNTING_REPORTS}</h3>
            <div className="flex items-center mb-4.5">
                <span onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
                    <Icon name="infoGreen" className="w-5.5 h-5.5 cursor-pointer" />
                </span>
                <p className="ml-1 text-lg font-bold text-blue font-allerbold">
                    Reporte de movimiento de inventario por documentos electrónicos
                </p>
                <Tooltip
                    anchorEl={anchorEl}
                    iconName="infoBlue"
                    title="Reporte de movimiento de inventario por documentos electrónicos:"
                    description="Es un registro de todas las entradas o salidas que afectan al inventario de su negocio."
                    wrapperClassName="rounded"
                />
            </div>
            <p className="text-base text-gray-dark mb-7">
                A continuación visualice el reporte de los movimientos que se han generado en su inventario debido a la
                transmisión de los documentos electrónicos (factura electrónica, nota débito y nota crédito y factura de compra).
            </p>
        </>
    );
};
