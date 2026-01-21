import React from 'react';
import { v4 as uuid } from 'uuid';
import { IGenericRecord } from '@models/GenericRecord';
import { getCheckboxInputClassName, ICheckboxProps } from '.';
import './Checkbox.scss';

export const Checkbox: React.FC<ICheckboxProps> = ({
    id = '',
    label = '',
    checked = false,
    onChange = (): void => {},
    classContainer = '',
    classLabel = '',
    classCheck = '',
    name = '',
    disabled = false,
    isFather = false,
}) => {
    return (
        <label id={id} className={`${classContainer} container container--${isFather ? 'father' : 'child'}`}>
            <span className={classLabel}>{label}</span>
            <input type="checkbox" checked={checked} onChange={onChange} name={name} disabled={disabled} />
            <span id={id} className={`checkmark ${classCheck}`} />
        </label>
    );
};

export const CheckboxValidate: React.FC<ICheckboxProps> = ({
    id = '',
    label = '',
    checked = false,
    onChange = (): void => {},
    classContainer = 'text-black',
    classCheck = '',
    requiredText = '*Campo obligatorio',
    validate,
    name,
    value,
}) => {
    return (
        <div>
            <label id={id} className={`container ${classContainer}`}>
                {label}
                <input type="checkbox" name={name} value={value} checked={checked} onChange={onChange} />
                <span className={`checkmark ${classCheck}`} />
            </label>
            {validate && <label className="text-tiny text-purple mr-1.5">{requiredText ? requiredText : ''}</label>}
        </div>
    );
};

export const SingleCheckBox: React.FC<IGenericRecord> = ({
    className,
    name = '',
    checkedFields = {},
    handleChange = (): void => {},
    checked = false,
    labelText = '',
    classInput = '',
    labelClass,
    required,
    disabled = false,
}) => {
    const id = uuid();
    const value = checked || checkedFields[name] || false;
    return (
        <>
            <div className={`single-checkbox ${className}`}>
                <input
                    type="checkbox"
                    name={name}
                    className="hidden"
                    checked={value}
                    onChange={handleChange}
                    disabled={disabled}
                    id={id}
                />
                <label
                    htmlFor={id}
                    className={`single-checkbox__input ${getCheckboxInputClassName(value, className)} ${classInput}`}
                />
                {labelText && <span className={`single-checkbox__label ${labelClass}`}>{labelText}</span>}
                <div />
            </div>
            {required && <span className="mt-2 text-purple text-tiny">*Campo obligatorio</span>}
        </>
    );
};
