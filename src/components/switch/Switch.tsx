import React from 'react';
import { ISwitchProps } from '.';
import './Switch.scss';

export const Switch: React.FC<ISwitchProps> = ({
    checked = false,
    labelText,
    handleChange,
    wrapperClassName = '',
    includeOptions = true,
}) => (
    <div className={`switch ${wrapperClassName}`}>
        {labelText && <h2 className="switch__label">{labelText}</h2>}
        <label className="switch__button">
            <input className="switch__input" checked={checked} onChange={handleChange} type="checkbox" />
            <div className="switch__slider" />
            {includeOptions && (
                <span className={`switch__text ${checked ? 'left-2.5' : 'right-2.5'}`}>{checked ? 'Si' : 'No'}</span>
            )}
        </label>
    </div>
);
