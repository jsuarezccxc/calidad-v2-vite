import React from 'react';
import { IDatePickerProps } from '.';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import es from 'date-fns/locale/es';
import { getDateFromUnix } from '@utils/Date';
registerLocale('es', es);

import './DatePickerBase.scss';

export const DatePickerBase: React.FC<IDatePickerProps> = props => {
    const {
        id = '',
        dateFormat = 'dd/MM/yyyy',
        showMonthYearPicker = false,
        showYearPicker = false,
        customInput,
        required = false,
        disabled = false,
        selected,
        onChangeDate = (): void => {},
        maxDate,
        minDate,
        className = '',
        showPlaceHolderDate = false,
        withoutDate = false,
        name = 'datePicker',
        placeholder = 'dd/mm/aaaa',
    } = props;

    return (
        <DatePicker
            id={id}
            name={name}
            onKeyDown={(e): void => {
                e.preventDefault();
            }}
            selected={
                withoutDate && !selected
                    ? null
                    : selected
                    ? new Date(
                          Number(getDateFromUnix(Number(selected)).year),
                          Number(getDateFromUnix(Number(selected)).month) - 1,
                          Number(getDateFromUnix(Number(selected)).day)
                      )
                    : showPlaceHolderDate
                    ? null
                    : new Date()
            }
            onChange={onChangeDate}
            locale="es"
            showMonthYearPicker={showMonthYearPicker}
            showYearPicker={showYearPicker}
            dateFormat={dateFormat}
            customInput={customInput}
            showMonthDropdown
            showYearDropdown
            placeholderText={placeholder}
            dropdownMode="scroll"
            className={`w-full  pr-0.5 text-sm text-center xs:pr-2 xs:text-tiny input text-gray-dark ${className} ${
                disabled ? 'cursor-default' : 'cursor-pointer'
            }`}
            required={required}
            disabled={disabled}
            maxDate={maxDate}
            minDate={minDate}
            autoComplete="off"
            showFullMonthYearPicker={showMonthYearPicker}
        />
    );
};
