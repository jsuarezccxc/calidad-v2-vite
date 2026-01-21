import React from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { Icon } from '@components/icon';

export const VariantOption: React.FC<IGenericRecord> = ({ text, actionDelete }) => {
    return (
        <div className="flex items-center content-center h-6.5 mt-2 rounded bg-green-extraLight px-1.5 w-max">
            <p className="px-1 text-sm cursor-default w-max basic-information__table-example whitespace-nowrap">{text}</p>
            <Icon name="closeBlue" onClick={actionDelete} className="w-3 cursor-pointer" />
        </div>
    );
};
