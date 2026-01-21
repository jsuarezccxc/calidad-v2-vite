/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

export * from './DatePickerBase';

/**
 * @typeParam dateFormat: string - Optional format for days, 'MM/yyyy' for month ,'yyyy' for year
 * @typeParam showMonthYearPicker: boolean - Optional get true for show Month format datePicker
 * @typeParam showYearPicker: boolean - Optional get true for show Year format datePicker
 * @typeParam customInput: React.ReactElement - Optional get Custom input component input
 * @typeParam required: boolean - Optional if datePicker is required
 * @typeParam disabled: boolean - Optional if datePicker is disable
 * @typeParam selected: any - Optional date selected param
 * @typeParam onChangeDate: (date: Date, event: React.SyntheticEvent) => void - Optional action to change date datePicker for selectsRange Date Date
 * @typeParam maxDate: Date - Optional max date of the datepicker
 * @typeParam minDate: Date - Optional min date of the datepicker
 * @typeParam className: string - Optional prop for customize the component
 * @typeParam showPlaceHolderDate: boolean - Optional prop Show Placeholder Date
 * @typeParam withoutDate: boolean - Optional prop that indicates if the input has initial date
 * @typeParam name: string - Optional prop that indicates if the input name
 * @typeParam id: string - Optional prop that indicates if the input id
 * @typeParam placeholder - string - Optional prop to placeholder input 

 */
export interface IDatePickerProps {
    dateFormat?: string;
    showMonthYearPicker?: boolean;
    showYearPicker?: boolean;
    customInput?: React.ReactElement;
    required?: boolean;
    disabled?: boolean;
    selected?: any;
    onChangeDate?: (date: Date, event?: React.SyntheticEvent) => void;
    maxDate?: Date;
    minDate?: Date;
    className?: string;
    showPlaceHolderDate?: boolean;
    withoutDate?: boolean;
    name?: string;
    id?: string;
    placeholder?: string;
}
