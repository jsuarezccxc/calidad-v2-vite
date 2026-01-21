import React from 'react';

export const INFORMATION_MODAL: { [key: string]: JSX.Element } = {
    ACCUSE_RECEIVE_FE: (
        <p className="text-center text-gray-dark leading-19.38px h-9.5">
            ¿Está seguro de enviar a la DIAN el evento <span className="font-allerbold">Recibo documento</span> para esta factura?
        </p>
    ),
    ACCUSE_RECEIVE_BS: (
        <p className="text-center text-gray-dark leading-19.38px h-9.5">
            ¿Está seguro de enviar a la DIAN el evento <span className="font-allerbold">Recibo bienes/servicios</span> para esta
            factura?
        </p>
    ),
    ACCEPTANCE_CLAIM: (
        <p className="mb-2 text-center text-gray-dark leading-19.38px h-9.5 xs:h-auto">
            *Seleccione el evento que desea enviar a la DIAN para esta factura de compra
        </p>
    ),
};
