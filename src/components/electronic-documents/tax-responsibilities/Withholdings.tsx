import React from 'react';
import { SELF_RETAINING_OPTIONS } from '@constants/ElectronicInvoice';
import { retentionIsSelected } from '@utils/ElectronicInvoice';
import { IWithholdingsProps, hasAWithholding } from '.';

export const Withholdings: React.FC<IWithholdingsProps> = ({ selectRetention, withholdings, validate }) => (
    <div className="flex flex-col gap-2 mt-2.5 w-full">
        {SELF_RETAINING_OPTIONS.map(({ name, label }) => (
            <div className="flex items-center gap-2 text-sm w-max" key={name} onClick={(): void => selectRetention(name)}>
                <div className={`checkbox ${retentionIsSelected(withholdings, name) ? 'checkbox--checked' : ''}`} />
                <span className="text-gray-dark">{label}</span>
            </div>
        ))}
        {validate && !hasAWithholding(withholdings) && (
            <span className="text-tiny text-purple">*Seleccione mínimo una opción</span>
        )}
    </div>
);
