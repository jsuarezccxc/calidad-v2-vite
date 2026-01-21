import React from 'react';
import { ICustomOption } from '../../select';
import { SingleCheckBox } from '@components/checkbox';

export const FilterOption: React.FC<ICustomOption> = ({ onClick, option, value = '' }) => {
    return (
        <div className="filter-option select__option" onClick={onClick}>
            <SingleCheckBox checked={value?.includes(option)} />
            <p className="filter-option__text" onClick={onClick}>
                {option}
            </p>
        </div>
    );
};
