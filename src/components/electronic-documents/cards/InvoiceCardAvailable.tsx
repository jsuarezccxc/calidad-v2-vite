import React from 'react';
import type { IGenericRecord } from '@models/GenericRecord';
import { getDateAnyFormat } from '@utils/Date';
import { formatNumber } from '@utils/Number';
import { DIGITS_REMOVED } from '.';

export const InvoiceCardAvailable: React.FC<{ quantityInvoices: IGenericRecord }> = ({ quantityInvoices }) => (
    <div className="flex-1 document-card xl:flex-none">
        <div className="align-middle ">
            <p className="text-blue">Documentos electrónicos</p>
            <span className="block text-center font-allerbold text-blue">
                {quantityInvoices?.is_unlimited ? 'ilimitados' : 'disponibles'}
            </span>
            {quantityInvoices?.is_unlimited ? (
                <p className="flex flex-row justify-center">
                    <span className="text-blue">hasta: </span>
                    <span className="ml-2 text-green text-2lg">{getDateAnyFormat(quantityInvoices?.expiration_date)}</span>
                </p>
            ) : (
                <p className="text-center">
                    <span className="text-green text-2lg">
                        {formatNumber(quantityInvoices?.number_invoice ?? 0).slice(DIGITS_REMOVED)}
                    </span>
                </p>
            )}
        </div>
    </div>
);
