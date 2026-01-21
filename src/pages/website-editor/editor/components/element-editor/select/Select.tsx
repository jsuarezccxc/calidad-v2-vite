import React, { Fragment } from 'react';
import useToggleRendering from '@hooks/useToggleRendering';
import { Arrow, ISelectProps } from '.';
import './Select.scss';

export const Select: React.FC<ISelectProps> = ({
    id,
    customOption: CustomOption,
    customList: CustomList,
    handleChange = (): void => {},
    isStyle = true,
    labelText,
    multiple = false,
    options = [],
    placeholder = 'Seleccionar',
    selectClassName = '',
    style = {},
    value = '',
    wrapperClassName = '',
    handleStyleChange = (): void => {},
}) => {
    const { parentRef, renderElement } = useToggleRendering();

    const getValue = (newValue: string): string => {
        if (multiple) {
            const checkedOptions = value.split(',');
            const newCheckedOptions = checkedOptions.includes(newValue)
                ? checkedOptions.filter(option => option !== newValue)
                : [...checkedOptions, newValue];
            return newCheckedOptions.filter(item => item).join(',');
        }
        return newValue;
    };

    const selectOption = (value: string): void => handleChange(getValue(value));

    const modifier = isStyle ? 'style' : 'common';

    return (
        <div id={id} className={`select ${wrapperClassName} `}>
            {labelText && <label className="select__label">{labelText}</label>}
            <div className={`select__content select__content--${modifier} ${selectClassName}`} ref={parentRef}>
                <p
                    className={`select__${value ? 'value' : 'placeholder'} select__${
                        value ? 'value' : 'placeholder'
                    }--${modifier}`}
                >
                    {placeholder.type ? placeholder : value || placeholder}
                </p>
                <Arrow isActive={renderElement} />
                {renderElement && (
                    <div
                        className={`select__options ${
                            CustomList ? '' : 'bg-green-scrollbar overflow-y-auto'
                        } select__options--${modifier}`}
                    >
                        <>
                            {CustomList ? (
                                <CustomList handleStyleChange={handleStyleChange} style={style} value={value} />
                            ) : (
                                options.map((option, index) => (
                                    <Fragment key={option}>
                                        {CustomOption ? (
                                            <CustomOption
                                                index={index}
                                                onClick={(): void => selectOption(option)}
                                                option={option}
                                                value={value}
                                            />
                                        ) : (
                                            <p className="select__option" onClick={(): void => selectOption(option)}>
                                                {option}
                                            </p>
                                        )}
                                    </Fragment>
                                ))
                            )}
                        </>
                    </div>
                )}
            </div>
        </div>
    );
};
