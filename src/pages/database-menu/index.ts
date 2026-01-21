import { PATHS, Routes } from '@constants/Paths';
import { getRoute } from '@utils/Paths';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { ICardDatabaseProps } from './components';

export { default } from './DatabaseMenu';

/**
 * Data cards menu
 */
export const DATA_CARDS_MENU = (firstTime: boolean): ICardDatabaseProps[] => {
    return [
        {
            id: generateId({
                module: ModuleApp.TECHNICAL_SHEET,
                submodule: 'database-products-services',
                action: ActionElementType.REDIRECT,
                elementType: ElementType.CRD,
            }),
            title: PATHS[Routes.PRODUCT_DATABASE].title,
            iconName: 'databaseProductsServices',
            color: 'green',
            textColor: 'green',
            cardRoute: getRoute(Routes.PRODUCT_DATABASE),
        },
        {
            id: generateId({
                module: ModuleApp.TECHNICAL_SHEET,
                submodule: 'database-warehouses',
                action: ActionElementType.REDIRECT,
                elementType: ElementType.CRD,
            }),
            title: 'Ficha técnica de bodegas',
            iconName: 'databaseWarehouse',
            color: 'purple-light',
            textColor: 'purple',
            cardRoute: getRoute(Routes.WAREHOUSES),
        },
        {
            id: generateId({
                module: ModuleApp.TECHNICAL_SHEET,
                submodule: 'database-customers',
                action: ActionElementType.REDIRECT,
                elementType: ElementType.CRD,
            }),
            title: PATHS[Routes.CUSTOMER_DATABASE].title,
            iconName: 'databaseClientsEmployees',
            color: 'purple',
            textColor: 'blue',
            cardRoute: PATHS[Routes.CUSTOMER_DATABASE].route,
        },
        {
            id: generateId({
                module: ModuleApp.TECHNICAL_SHEET,
                submodule: 'database-suppliers',
                action: ActionElementType.REDIRECT,
                elementType: ElementType.CRD,
            }),
            title: PATHS[Routes.SUPPLIER_DATABASE].title,
            iconName: 'databaseSuppliers',
            color: 'gray',
            textColor: 'blue',
            cardRoute: PATHS[Routes.SUPPLIER_DATABASE].route,
        },
        {
            id: generateId({
                module: ModuleApp.TECHNICAL_SHEET,
                submodule: 'database-employees',
                action: ActionElementType.REDIRECT,
                elementType: ElementType.CRD,
            }),
            title: PATHS[Routes.DATABASE_EMPLOYEES].title,
            iconName: 'databaseClientsEmployees',
            color: 'purple',
            textColor: 'blue',
            cardRoute: firstTime ? getRoute(Routes.DATABASE_EMPLOYEES) : getRoute(Routes.DATABASE_EMPLOYEES_FORM),
        },
    ];
};
