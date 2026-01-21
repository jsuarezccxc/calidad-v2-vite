import React from 'react';
import { SELF_RETAINING_OPTIONS } from '@constants/ElectronicInvoice';
import { retentionIsSelected } from '@utils/ElectronicInvoice';
import usePermissions from '@hooks/usePermissions';
import { IWithholdingsProps, hasAWithholding } from '.';

export const Withholdings: React.FC<IWithholdingsProps> = ({ selectRetention, withholdings, validate }) => {
    const { disabledInputs } = usePermissions();
    return (
        <div className="flex flex-col gap-2 mt-2.5">
            {SELF_RETAINING_OPTIONS.map(({ name, label }) => (
                <div
                    className="flex items-center gap-2 text-sm"
                    key={name}
                    onClick={(): void => (!disabledInputs ? selectRetention(name) : undefined)}
                >
                    <div className={`checkbox ${retentionIsSelected(withholdings, name) ? 'checkbox--checked' : ''}`} />
                    <span className="text-gray-dark">{label}</span>
                </div>
            ))}
            {validate && !hasAWithholding(withholdings) && (
                <span className="text-tiny text-purple">*Seleccione mínimo una opción</span>
            )}
        </div>
    );
};
