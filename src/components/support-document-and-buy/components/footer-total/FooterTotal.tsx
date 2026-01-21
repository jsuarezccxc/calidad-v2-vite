import React from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { NumberFormatInput, Title } from '@components/table-input';

export const FooterTotal: React.FC<IGenericRecord> = ({ colSpan = 5, discount, total, taxes }) => {
    return (
        <>
            <tr>
                <td className=""></td>
                <td colSpan={colSpan} className="field-header--uneditable body__h-auto">
                    <Title color="blue" disabled text="Total" />
                </td>
                <td className="body__px-0 body__h-auto field-header--uneditable">
                    <NumberFormatInput value={discount ?? 0} disabled inputClass="lg:h-auto text-blue font-allerbold" />
                </td>
                <td className="body__px-0 body__h-auto field-header--uneditable">
                    <NumberFormatInput value={total ?? 0} disabled inputClass="lg:h-auto text-blue font-allerbold" />
                </td>
                <td className="field-header--uneditable">
                    <NumberFormatInput value={taxes ?? 0} disabled inputClass="lg:h-auto text-blue font-allerbold" />
                </td>
            </tr>
        </>
    );
};
