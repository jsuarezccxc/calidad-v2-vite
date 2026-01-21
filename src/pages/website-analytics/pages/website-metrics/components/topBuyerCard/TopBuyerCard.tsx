import { Icon } from '@components/icon';
import { IGenericRecord } from '@models/GenericRecord';
import React from 'react';
import { positions } from '.';
import { SubstringText } from '@utils/SubstringText';

export const TopBuyerCard: React.FC<IGenericRecord> = ({ backgroundColor, name, position, score, showIcon, height, itemKey }) => {
    return (
        <article key={itemKey} className={`flex flex-col ${backgroundColor} w-28.5 h-${height} items-center rounded-t-2xl`}>
            <div className="flex flex-col items-center justify-center h-8 mt-3 bg-white rounded w-22 py-0.5">
                <p className="text-xs text-center capitalize font-allerbold">{SubstringText(name, 11)}</p>
                <span className="italic text-xtiny font-aller">{positions[position]}</span>
            </div>
            <span className="mt-2 text-base leading-5 text-white font-allerbold">{score}</span>
            {showIcon && <Icon classIcon="medal-icon mt-1" name="medal" />}
        </article>
    );
};
