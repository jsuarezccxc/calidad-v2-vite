/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { v4 as uuid } from 'uuid';
import { Section } from '@components/bread-crumb';
import { IInformationProps } from '@components/information';
import { IOptionSelect, IPropsInput } from '@components/input';
import { IBodyTable, IHeaderTable, ITableProps } from '@components/table';
import { Routes } from '@constants/Paths';
import { ITableFieldType } from '@constants/TableFieldType';
import { getRoute, getRouteName } from '@utils/Paths';
import { getUnixFromDate } from '@utils/Date';
import { IGenericRecord } from '@models/GenericRecord';
import { IFileRequest } from '@models/File';
import { PRODUCT_NAME } from '@constants/ProductName';
export { default } from './NotificationCenter';

/**
 * This interface describes the properties of the each option
 *
 * @typeParam [key: string]: IOptionSelect - Select option
 */
export interface IOption {
    [key: string]: IOptionSelect;
}

/**
 * Option types
 */
export enum OPTION_TYPE {
    MODULE = 'module',
    NOTIFICATION = 'notification',
}

/**
 * Notification types
 */
export enum NOTIFICATION {
    MODULE = 'module_notification',
    TYPE = 'type_notification',
}

/**
 * Function that return the header of the table
 *
 * @param { headerClass, wrapperClass }: { [key: string]: string } - Classes to customize the fields
 * @returns IHeaderTable[]
 */
export const headersTable = (): IHeaderTable[] => [
    {
        title: 'Fecha',
        className: 'w-37',
        wrapperClassName: 'max-w--columns w-37 2xl:w-37',
        translationKey: 'date',
    },
    {
        title: 'Hora',
        className: 'w-37',
        wrapperClassName: 'max-w--columns w-37 2xl:w-37',
        translationKey: 'hour',
    },
    {
        title: 'Notificación',
        className: 'notification-field',
        wrapperClassName: 'notification-field',
        translationKey: 'notification',
    },
];

/**
 * Fields body of the table
 */
export const fieldsBody = (): IBodyTable[] => [
    {
        type: ITableFieldType.DATE,
        field: 'date',
        editableField: false,
        wrapperClassName: 'max-w--columns w-37 h-10 xs:h-7',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'hour',
        editableField: false,
        wrapperClassName: 'max-w--columns w-37 h-10 xs:h-7',
    },
    {
        type: ITableFieldType.TEXT,
        field: 'notification',
        editableField: false,
        wrapperClassName: 'notification-field',
    },
];

/**
 * Select limit words
 */
export const SELECT_LIMIT_WORDS = 5;

/**
 * Function that return the breadcrumb routes
 *
 * @returns Section[]
 */
export const routes = (): Section[] => {
    return [
        {
            name: getRouteName(Routes.COMPANY_PROFILE_MENU),
            route: getRoute(Routes.COMPANY_PROFILE_MENU),
            routeIndex: Routes.COMPANY_PROFILE_MENU,
        },
        {
            name: getRouteName(Routes.SERVICE_INFORMATION_MENU),
            route: getRoute(Routes.SERVICE_INFORMATION_MENU),
            routeIndex: Routes.SERVICE_INFORMATION_MENU,
        },
        {
            name: getRouteName(Routes.NOTIFICATION_CENTER),
            routeIndex: Routes.NOTIFICATION_CENTER,
            route: '#',
        },
    ];
};

/**
 * Function that return the information props
 *
 * @param onClickIcon: onClickIcon = (): void => {} - OnClick icon function
 * @returns IInformationProps
 */
export const informationProps = (onClickIcon = (): void => {}): IInformationProps => ({
    title: 'Histórico de notificaciones',
    description: `A continuación visualice el listado de todas las notificaciones que se han generado en ${PRODUCT_NAME}`,
    onClickIcon,
});

/**
 * Function that return the select className
 *
 * @param option: IOptionSelect - Select option
 * @returns IGenericRecord
 */
export const getSelectClassName = (option: IOptionSelect): IGenericRecord => {
    let selectTextClass = option?.value.split(' ').length > SELECT_LIMIT_WORDS ? 'double-select-text' : '';
    selectTextClass += !option?.key ? 'text-gray' : '';
    return {
        selectTextClass,
        classesWrapperInput: !option?.key ? 'initial-select' : '',
        classesWrapper: 'w-73 xs:w-full',
    };
};

/**
 * Function that filter the options by type
 *
 * @param options: IOptionSelect[] - Select options
 * @param type: string - Option type
 * @returns IOptionSelect[]
 */
export const getOptionsByType = (options: IOptionSelect[], type: string): IOptionSelect[] =>
    options?.filter(option => option?.type === type);

/**
 * Function that return the input props
 *
 * @param date: number - Current date unix
 * @param onChangeDate: (date: Date) => void - Function that change the current date
 * @param searchValue: string - Search value
 * @param handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void - Function that filter the data based on the search value
 * @returns IPropsInput[]
 */
export const inputsProps = (
    date: number,
    onChangeDate: (date: Date) => void,
    searchValue: string,
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
): IPropsInput[] => [
    {
        name: 'date',
        labelText: 'Fecha:',
        classesWrapper: 'w-49 xs:w-full',
        selected: date,
        maxDate: new Date(),
        onChangeDate,
        selectIconType: 'calendarGreen'
    },
    {
        name: 'search',
        labelText: 'Buscador:',
        placeholder: '...',
        value: searchValue,
        onChange: handleSearch,
        classesWrapper: 'w-49 xs:w-full',
        isNew: true,
        iconClassName: 'w-4 h-4'
    },
];

/**
 * Function that return the formatted data table
 *
 * @param data: IGenericRecord[] - Table data
 * @returns IGenericRecord[]
 */
const getDataTable = (data: IGenericRecord[]): IGenericRecord[] =>
    data?.map((item: IGenericRecord) => ({
        consecutive: item?.consecutive,
        date: item?.date,
        hour: '01:30 pm',
        module: item?.module_notification?.name,
        notification: item?.type_notification?.name,
        type_notification: item?.type_notification,
    }));

/**
 * Function that return the select options
 *
 * @param data: IGenericRecord[] - Table data
 * @returns IOptionSelect[]
 */
export const getOptions = (data: IGenericRecord[] = []): IOptionSelect[] => {
    const options: IOptionSelect[] = [];

    const existOption = (value: string): boolean => !!options?.find(option => option?.value === value);

    getDataTable(data)?.map(item => {
        const { module, notification } = item;
        if (!existOption(module)) options.push({ value: module, type: 'module', key: uuid() });
        if (!existOption(notification)) options.push({ value: notification, type: 'notification', key: uuid() });
    });
    return options;
};

/**
 * Function to return data with date formatted
 * 
 * @param data: IGenericRecord[] - Data table from user
 * @returns IGenericRecord[] - Data formatted
 */
export const formatDate = (data: IGenericRecord[]): IGenericRecord[] => {
    return data.map(notification => ({ ...notification, date: getUnixFromDate(notification.date) }))
}

/**
 * Function that return the table props
 *
 * @param data: IGenericRecord[] - Table data
 * @returns ITableProps
 */
export const tableProps = (data: IGenericRecord[]): ITableProps => {
    return {
        isNew: true,
        headersTable: headersTable(),
        fieldsBody: fieldsBody(),
        data: formatDate(data),
        className: 'xs:mt-3 w-max',
    };
};

/**
 * Props for the NotificationCenter view
 */
export const props = {
    info: informationProps,
    inputs: inputsProps,
    table: tableProps,
};

/**
 * Generates a file request object for notifications history.
 *
 * @param type: string - The type of file.
 * @param date: number - The initial date in milliseconds.
 * @param search: string - The search string.
 * @param data: IGenericRecord[] - Data to render in table.
 * @returns IFileRequest.
 */
export const getRequestFile = (
    type: string,
    date: number,
    search: string,
    data: IGenericRecord[]
): IFileRequest => {
    return {
        type,
        module: 'notification-history',
        date,
        searched_by: search,
        data: data,
    };
};

/**
 * Key used to translate the texts
 */
export const TRANSLATION_KEY = 'company-profile.notification-center';
