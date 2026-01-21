import React, { FormEvent } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { INotificationData } from '@models/User';
import {
    VALIDATE_LENGTH_PASSWORD,
    VALIDATE_LOWER_CASE_PASSWORD,
    VALIDATE_NUMBER_PASSWORD,
    VALIDATE_SPECIAL_CHAR_PASSWORD,
    VALIDATE_UPPERCASE_CASE_PASSWORD,
} from '@constants/FieldsValidation';

/**
 * Invalid Char number
 */
export const invalidChar = ['e', 'E', '+', '-'];

/**
 * Invalid Char decimal
 */
export const invalidCharNoDecimals = ['e', 'E', '+', '-', '.'];

/**
 * validate email structure
 *
 * @param email: string
 * @returns boolean
 */
export const validateEmail = (email: string): boolean => {
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return pattern.test(String(email).toLowerCase());
};

/**
 * validate Nit range
 *
 * @param nit: string
 * @returns boolean
 */
export const validateNit = (nit: string): boolean => {
    const pattern = /^([0-9]{6,10})+-[0-9]{1}$/;
    return pattern.test(String(nit).toLowerCase());
};

/**
 * validate url structure
 *
 * @param nit: string
 * @returns boolean
 */
export const validateUrl = (url: string): boolean => {
    const pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return pattern.test(String(url).toLowerCase());
};

/**
 * validate Fields Array no empty
 *
 * @param requiredField: IGenericRecord
 * @param data: IGenericRecord
 * @returns boolean
 */
export const validateFieldsArray = (requiredField: IGenericRecord, data: IGenericRecord): IGenericRecord => {
    const fields = Object.keys(requiredField);
    const validationFields: IGenericRecord = { ...requiredField };
    fields.map(field => {
        validationFields[field] = !(data && data[field as keyof INotificationData]);
        return field;
    });
    return validationFields;
};

/**
 * Validate params password
 *
 * @param password?: string
 * @returns boolean
 */
export const validatePasswordOld = (password: string): boolean => {
    if (password.length >= 8) {
        let number = false;
        let capitalLetter = false;
        let lowerLetter = false;
        let character = false;

        for (let i = 0; i < password.length; i++) {
            if (password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90) {
                capitalLetter = true;
            } else if (password.charCodeAt(i) >= 97 && password.charCodeAt(i) <= 122) {
                lowerLetter = true;
            } else if (password.charCodeAt(i) >= 48 && password.charCodeAt(i) <= 57) {
                number = true;
            } else {
                character = true;
            }
        }
        if (capitalLetter && lowerLetter && character && number) {
            return true;
        }
    }
    return false;
};

/**
 * validate Fields Array not null
 *
 * @param data: IGenericRecord[] - Information
 * @param keys: IGenericRecord[] - Names Fields
 * @returns boolean
 */
export const validateNull = (data: IGenericRecord[], keys: string[] = ['unit_value', 'unit_cost']): IGenericRecord[] =>
    data.map(item => {
        keys.map(key => (item[key] = !item[key] ? 0 : item[key]));
        return item;
    });

/**
 * validate alpha numeric structure
 *
 * @param e: React.KeyboardEvent<HTMLInputElement> - event
 * @returns void
 */
export const validateAlphanumeric = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/g.test(e.key)) e.preventDefault();
};

/**
 * validate alpha numeric no whitespace structure
 *
 * @param e: React.KeyboardEvent<HTMLInputElement> - event
 * @returns void
 */
export const validateAlphanumericNoWhitespace = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ]+$/g.test(e.key)) e.preventDefault();
};

/**
 * validate Letters With Accent structure in onChange
 *
 * @param e: React.KeyboardEvent<HTMLInputElement> - event
 * @returns void
 */
export const validateLettersWithAccent = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/g.test(e.key)) e.preventDefault();
};

/**
 * validate Letters WithAccent And Special Characters structure in onChange
 *
 * @param e: React.KeyboardEvent<HTMLInputElement> - event
 * @returns void
 */
export const validateLettersWithAccentAndSpecialCharacters = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!/[a-zA-ZñÑáéíóúÁÉÍÓÚ`!@#$%^&*()_+\-={};':"\\|,.<>?~\s]+$/g.test(e.key)) e.preventDefault();
};

/**
 * validate Numbers structure in onChange
 *
 * @param e: React.KeyboardEvent<HTMLInputElement> - event
 * @returns void
 */
export const validateNumbers = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (/[^0-9]/g.test(e.key)) e.preventDefault();
};

/**
 * validate Only Numbers structure in onChange
 *
 * @param e: React.KeyboardEvent<HTMLInputElement> - event
 * @returns void
 */
export const validateOnlyNumbers = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if ((e?.target as IGenericRecord)?.value.includes(',')) {
        if (/[^0-9]/g.test(e.key)) e.preventDefault();
    } else {
        if (/[^0-9]/g.test(e.key)) e.preventDefault();
    }
};

/**
 * validate Only Numbers structure boolean
 *
 * @param e: React.KeyboardEvent<HTMLInputElement> - event
 * @returns boolean
 */
export const validateOnlyNumbersOnPaste = (e: React.ChangeEvent<HTMLInputElement>): boolean => {
    if ((e?.target as IGenericRecord)?.value.includes(',')) {
        return /[^0-9]/g.test(e.target.value);
    } else {
        return /[^0-9]/g.test(e.target.value);
    }
};

/**
 * validate Only Decimal numbers and the percentage sign at the end
 *
 * @param e: React.KeyboardEvent<HTMLInputElement> - event
 * @returns void
 */
export const validatePercentageFilter = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const currentValue = (e.target as HTMLInputElement).value;
    const isNumber = /^[0-9]*\.?[0-9]*$/.test(currentValue + e.key);
    const isPercentSign = e.key === '%' && !currentValue.includes('%');
    if (!(isNumber || (isPercentSign && currentValue !== ''))) {
        e.preventDefault();
    }
    if (currentValue.includes('%')) {
        e.preventDefault();
    }
};

/**
 * remove zero value in number
 *
 * @param value: string - Number
 * @returns string
 */
export const removeZero = (value: string): string => (value.length > 1 && !Number(value[0]) ? value.slice(1) : value);

/**
 * remove decimal value in number
 *
 * @param value: string - Number
 * @returns number
 */
export const removeDecimals = (value: string): number => {
    const numberLength = String(Math.floor(Number(value))).length + DECIMAL_LENGTH;
    return parseFloat(value.slice(0, numberLength));
};

/**
 * get Field Border
 *
 * @param validate?: boolean
 * @param value: string
 * @param validateNumber: boolean
 * @returns IGenericRecord
 */
export const getBorder = (validate: boolean, value: string, validateNumber = true): string => {
    return validate && (validateNumber ? !Number(value) : !value) ? 'border-purple' : '';
};

export const hasEmptyValue = (validate: boolean, value: string): boolean => validate && !String(value);

/**
 * get Field Border
 *
 * @param validate?: boolean
 * @param {value: string, isNumber : boolean}?: IGenericRecord
 * @returns IGenericRecord
 */
export const getFieldBorder = (validate: boolean, { value, isNumber = false }: IGenericRecord): string => {
    return validate ? (!(isNumber ? Number : String)(value) ? 'border-purple' : '') : '';
};

/**
 * Validate params password
 *
 * @param password?: string
 * @returns IGenericRecord
 */
export const validatePassword = (password: string): IGenericRecord => {
    const validLength = /.{8,}/;
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;
    const hasSpecialChar = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
    const hasNumber = /[0-9]/;

    const passwordParams = [
        {
            message: VALIDATE_LENGTH_PASSWORD,
            isCorrect: validLength.test(password),
        },
        {
            message: VALIDATE_UPPERCASE_CASE_PASSWORD,
            isCorrect: hasUppercase.test(password),
        },
        {
            message: VALIDATE_LOWER_CASE_PASSWORD,
            isCorrect: hasLowercase.test(password),
        },
        {
            message: VALIDATE_SPECIAL_CHAR_PASSWORD,
            isCorrect: hasSpecialChar.test(password),
        },
        {
            message: VALIDATE_NUMBER_PASSWORD,
            isCorrect: hasNumber.test(password),
        },
    ];

    const isPasswordValid = !passwordParams.some((item: IGenericRecord) => !item?.isCorrect);

    return {
        isPasswordValid,
        passwordParams,
    };
};

const DECIMAL_LENGTH = 3;

export const validateFields = (data: IGenericRecord, fields: string[]): boolean => {
    return fields.some(field => !String(data?.[field] ?? ''));
};

/**
 * This function is for compare strings
 *
 * @param str1: string - String value 1
 * @param str2: string - String value 2
 * @returns boolean
 */
export const compareStrings = (str1: string, str2: string): boolean => str1.toLowerCase().includes(str2.toLowerCase());

/**
 * Prevents non-numeric key inputs in a form input element by removing any non-digit characters.
 * This function is designed to be used as an event handler for form input events.
 *
 * @param  e: FormEvent<HTMLInputElement> - The form event object containing the input element
 * @returns void
 */
export const onlyNumbersPreventDeadKeys = (e: FormEvent<HTMLInputElement>): void => {
    const input = e.currentTarget;
    const value = input.value;

    if (/[^0-9]/g.test(value)) {
        input.value = value.replace(/[^0-9]/g, '');
    }
};
