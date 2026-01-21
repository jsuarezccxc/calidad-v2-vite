import React from 'react';
import { v4 } from 'uuid';
import { getRoute, getRouteName } from '@utils/Paths';
import { lengthEqualToZero } from '@utils/Length';

import { Routes } from '@constants/Paths';
import {
    ACCOUNTING_COMING_SOON,
    ADMINISTRATOR,
    ALL_MODULES,
    CRM_COMING_SOON,
    DYNAMIC_REPORT_COMING_SOON,
    EDIT,
    ELECTRONIC_PAYROLL_COMING_SOON,
    READ_ANALYZE,
    UNIT_VALUE_REPORT_COMING_SOON,
} from '@constants/UserManagement';

import { Section } from '@components/bread-crumb';
import { IOptionSelect } from '@components/input';
import { IPageButtonsFooterProps } from "@components/page-buttons-footer";

import { IGenericRecord } from '@models/GenericRecord';
import { ZERO } from '@pages/website-editor';
import { IButtonProps } from "@hooks/useButtonProps";

export { UserDetail } from './UserDetail';
export { default } from './UserManagement';

/**
 * * This interface defines the props accepted by the UserManagement component.
 * @typeparam  getButtonProps: (buttonProps: IButtonProps) => IPageButtonsFooterProps - Optional function to define the footer buttons
 */

export interface IUserManagementProps { 
    getButtonProps?: (buttonProps: IButtonProps) => IPageButtonsFooterProps; 
}

export type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

/**
 * Routes from breadcrumb
 */
export const routes = (isEdit: boolean, isDetail?: boolean): Section[] => [
    {
        name: getRouteName(Routes.USER_CATALOG_LIST),
        route: getRoute(Routes.USER_CATALOG_LIST),
    },
    {
        name: isDetail ? 'Detalle del usuario' : isEdit ? 'Editar usuario' : 'Agregar usuario',
        route: '#',
    },
];

/**
 * Number of required files
 */
export const COUNT_FIELD = 4;

/**
 * assigns id to modules
 */
export const createModulesId = (modules: string[]): IGenericRecord[] => {
    return modules.map((item: string, index: number) => ({ id: index, name: item }));
};

/**
 * Fields require to create user
 */
export const requiredFields = {
    name: false,
    email: false,
    password: false,
    password_confirmation: false,
    role: true,
    edit_role: true,
    text_email: '',
    text_password: '',
};

/**
 * Select options for give role the user
 */
export const OPTIONS_FOR_MODULE_PERMISSIONS: IOptionSelect[] = [
    {
        key: v4(),
        value: ADMINISTRATOR,
    },
    {
        key: v4(),
        value: EDIT,
    },
    {
        key: v4(),
        value: READ_ANALYZE,
    },
];

/**
 * This function allows checked parents and children.
 *
 * @param data: IGenericRecord[] - Data to map
 * @returns IGenericRecord[]
 */
export const checkedItems = (data: IGenericRecord[]): IGenericRecord[] =>
    data.map((permission: IGenericRecord) => {
        if (permission.name === ALL_MODULES)
            return {
                ...permission,
                checked: data
                    .filter((itemFilter: IGenericRecord) => itemFilter.name !== ALL_MODULES)
                    .every((permissionEvery: IGenericRecord) => permissionEvery.checked),
            };

        if (permission.children) {
            if (permission.name === getRouteName(Routes.HOME))
                return {
                    ...permission,
                    checked: checkedItems(permission.children)
                        .filter(
                            (child: IGenericRecord) =>
                                child.name !== ACCOUNTING_COMING_SOON &&
                                child.name !== ELECTRONIC_PAYROLL_COMING_SOON &&
                                child.name !== CRM_COMING_SOON
                        )
                        .every((permissionEvery: IGenericRecord) => permissionEvery.checked),
                    children: checkedItems(permission.children),
                };

            if (permission.name === getRouteName(Routes.HOME))
                return {
                    ...permission,
                    checked: checkedItems(permission.children)
                        .filter(
                            (child: IGenericRecord) =>
                                child.name !== UNIT_VALUE_REPORT_COMING_SOON && child.name !== DYNAMIC_REPORT_COMING_SOON
                        )
                        .every((permissionEvery: IGenericRecord) => permissionEvery.checked),
                    children: checkedItems(permission.children),
                };

            return {
                ...permission,
                checked: checkedItems(permission.children).every((permissionEvery: IGenericRecord) => permissionEvery.checked),
                children: checkedItems(permission.children),
            };
        }

        return {
            ...permission,
        };
    });

/* allows add checked property for all permissions: Parent, children and more */
/**
 * This function allow add checked property for all permissions.
 *
 * @param data: IGenericRecord[] - Optional param data to map
 * @returns: IGenericRecord[]
 */
export const checkedProperty = (usersPermissions: IGenericRecord[], data?: IGenericRecord): IGenericRecord[] => {
    let activePermissions: IGenericRecord[];
    if (lengthEqualToZero(Object.keys(data || {}))) {
        activePermissions = [];
    } else {
        activePermissions = data?.roles[ZERO]?.permissions;
    }

    return usersPermissions.map((permission: IGenericRecord) => ({
        ...permission,
        checked: activePermissions?.some(activePermission => permission?.name === activePermission?.name),
    }));
};

/**
 * Validate checked when item select has children and theirs must be checked / When item select must be checked.
 *
 * @param data: IGenericRecord[] - Data to map
 * @param name: string - Optional param with name checked's item
 * @param module: string - Optional param with module's name item
 * @param checked: string - Optional param with checked's item value
 * @returns: IGenericRecord[]
 */
export const validateChecked = (data: IGenericRecord[], name = '', module = '', checked?: boolean): IGenericRecord[] =>
    data.map((item: IGenericRecord) => {
        if (item.father === module || item.parentNode === module || item.description === module || name === ALL_MODULES) {
            if (item.children) {
                if (item.name === name || item.father === name || name === ALL_MODULES)
                    return {
                        ...item,
                        children: item.children.map((child: IGenericRecord) => ({
                            ...child,
                            checked: checked || !item.checked,
                        })),
                        checked: checked || !item.checked,
                    };
                return {
                    ...item,
                    children: validateChecked(item.children, name, module, checked),
                };
            }

            if (item.name === name || item.description === name || name === ALL_MODULES)
                return { ...item, checked: checked || !item.checked };
        }

        return { ...item };
    });

/**
 * max characters in inputs email and user name
 */
export const MAX_LENGTH_NAME_EMAIL = 240;

/**
 * max characters in inputs email and user name
 */
export const MAX_LENGTH_PASSWORD = 120;

/**
 * Validate if is input name
 */
export const INPUT_NAME = 'name';
