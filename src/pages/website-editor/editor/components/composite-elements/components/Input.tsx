import React from 'react';
import { v4 } from 'uuid';
import { IInputProps } from '.';
import './Styles.scss';

export const Input: React.FC<IInputProps> = ({
    disabled = false,
    inputClassName = '',
    labelText,
    placeholder = '...',
    wrapperClassName = '',
    required = false,
}) => {
    const id = v4();
    return (
        <div className={`input ${wrapperClassName}`}>
            {labelText && (
                <label htmlFor={id} className="input__label">
                    {required && '*'}
                    {labelText}:
                </label>
            )}
            <input className={`input__box ${inputClassName}`} disabled={disabled} id={id} placeholder={placeholder} type="text" />
        </div>
    );
};
