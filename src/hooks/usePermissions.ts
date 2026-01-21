import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { IGenericRecord } from '@models/GenericRecord';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { membershipDaysAvailable } from '@utils/Membership';
import {
    ACCESS_ELECTRONIC_DOCUMENTOS_INTERNAL_ROUTES,
    ALWAYS_ACCESS_MODULES_NAME,
    ALWAYS_ACCESS_MODULES_ROUTE,
    ALWAYS_ACCESS_WITH_MODULE_NAME,
    ALWAYS_ACCESS_WITH_MODULE_ROUTE,
    ROUTES_ANALYTICS_REPORTS_WEBSITE,
    getRoute,
    getRouteName,
} from '@utils/Paths';
import { setAuthorizationModal } from '@redux/session/actions';
import { RootState } from '@redux/rootReducer';
import { ELECTRONIC_DOCUMENTS, SUPPORT_DOCUMENT } from '@constants/Memberships';
import { ZERO } from '@constants/Numbers';
import { ADMINISTRATOR, READ_ANALYZE, SUPER_ADMINISTRATOR } from '@constants/UserManagement';
import { PATHS, Routes } from '@constants/Paths';
import { ITEMS } from '@components/operations-table';
import { EXCLUDED_MODULE, QUANTITY_ALLOWED_DE_MODULE } from '@pages/payment-plan';

/**
 * This interface describes that properties the usePermissions hook return
 *
 * @typeParam getRole: () => string - Function that allows return user's role
 * @typeParam getPermission: (name: string, moduleName: string) => boolean - Function that allows return if user has module's access
 * @typeParam validationPermissionsMenu: (name: string, moduleName: string, isMenu?: boolean) => boolean - Function that allows return if user with an without company id has module's and menus' access
 * @typeParam disabledInputs: boolean - Variable for using if inputs are disabled according with user's role
 * @typeParam stringWithModules: () => string - Function that returns all permissions according to membership
 * @typeParam dispatchAuthorizationModal: () => void - Function that dispatch authorization modal
 * @typeParam modulesMembership: IGenericRecord[] - Modules selected in membership
 */
interface IUsePermissions {
    getRole: () => string;
    getPermissions: (name: string, moduleName: string) => boolean;
    validateAccessUrl: (currentUrl: string) => boolean;
    validationPermissionsMenu: (name: string, moduleName: string) => boolean;
    disabledInputs: boolean;
    stringWithModules: () => string;
    dispatchAuthorizationModal: () => void;
    modulesMembership: IGenericRecord[];
}

/**
 * Custom hook that get user role and permissions data
 *
 * @returns IUsePermissions
 */
const usePermissions = (): IUsePermissions => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const {
        session: { user },
        company: { activeMemberships },
    } = useSelector((state: RootState) => state);

    const [roles, setRoles] = useState<IGenericRecord[]>([]);
    const [modulesMembership, setModulesMembership] = useState<IGenericRecord[]>([]);

    useEffect(() => {
        setRoles(user?.roles || []);
    }, [user]);

    useEffect(() => {
        const activeModules: IGenericRecord[] = filterModulesActives();
        setModulesMembership(activeModules);
        if (!lengthEqualToZero(activeModules)) {
            localStorage.setItem('activeModulesLocal', JSON.stringify(activeModules));
        }
    }, [activeMemberships]);

    const getRole = (): string => (lengthGreaterThanZero(roles) ? roles[0].name : '');

    const permissions = roles[0]?.permissions || [];

    const disabledInputs = getRole() === READ_ANALYZE;

    const dispatchAuthorizationModal = (): void => {
        dispatch(setAuthorizationModal());
    };

    const stringWithModules = (): string => {
        if (modulesMembership.length) {
            return modulesMembership
                ?.filter((module: IGenericRecord) =>
                    permissions.some((permission: IGenericRecord) => permission.parent === module.name)
                )
                .map((module: IGenericRecord) => module.name)
                .join(', ');
        }

        return getRouteName(Routes.DATABASE_MENU);
    };

    const filterModulesActives = (): IGenericRecord[] => {
        let modules: IGenericRecord[] = [];
        if (!lengthEqualToZero(activeMemberships)) {
            activeMemberships
                ?.flatMap(item => item.modules)
                ?.filter(membership => {
                    const membershipSubmodules = membership?.membership_submodules[ZERO];

                    const hasAllowedQuantity = QUANTITY_ALLOWED_DE_MODULE.some(quantity =>
                        membershipSubmodules?.nameModule.includes(quantity)
                    );
                    const isDocumentElectronic =
                        membershipSubmodules?.nameModule.toLowerCase().includes(EXCLUDED_MODULE) && hasAllowedQuantity;

                    if (isDocumentElectronic) {
                        return membershipSubmodules?.remaining_invoices > ZERO;
                    }

                    return membershipDaysAvailable(membership?.expiration_date) > ZERO;
                })
                ?.forEach(
                    (membership: IGenericRecord) =>
                        (modules = [
                            ...modules,
                            {
                                id: membership.id,
                                name: membership.name === SUPPORT_DOCUMENT ? ELECTRONIC_DOCUMENTS : membership.name,
                            },
                        ])
                );

            return modules;
        }
        return [];
    };

    const findModule = (currentRoute: string, arrayModule: IGenericRecord[]): string => {
        for (const element of arrayModule) {
            if (element.route === currentRoute || PATHS[element.routeIndex]?.route === currentRoute) {
                return element.module || element.parentModule || '';
            }

            if (element.items) {
                const foundInItems = findModule(currentRoute, element.items);
                if (foundInItems) return foundInItems;
            }

            if (element.options) {
                const foundInOptions = findModule(currentRoute, element.options);
                if (foundInOptions) return foundInOptions;
            }
        }
        return '';
    };

    const validateAccessUrl = (currentUrl: string): boolean => {
        const modulesWithPermissions = filterModulesActives();
        const routeTree = ITEMS(true);
        let routeElectronicDocument = false;
        const activeModules = JSON.parse(localStorage.getItem('activeModulesLocal') ?? '[]');

        const alwaysAccessPagesWithMembership =
            lengthGreaterThanZero(modulesWithPermissions) && ALWAYS_ACCESS_WITH_MODULE_ROUTE.includes(currentUrl);
        ALWAYS_ACCESS_WITH_MODULE_ROUTE.includes(currentUrl);

        let routeAccess = ALWAYS_ACCESS_MODULES_ROUTE.includes(currentUrl);

        const accessRoutesElectronicDocuments = modulesWithPermissions?.find(
            (module: IGenericRecord) => module.name === getRouteName(Routes.ELECTRONIC_DOCUMENTS)
        );
        if (accessRoutesElectronicDocuments) {
            routeElectronicDocument = ACCESS_ELECTRONIC_DOCUMENTOS_INTERNAL_ROUTES.includes(currentUrl);
        }
        const currentModule = findModule(currentUrl, routeTree);

        if (modulesWithPermissions?.find((module: IGenericRecord) => module.name === getRouteName(Routes.WEBSITE_MENU))) {
            routeAccess = routeAccess || ROUTES_ANALYTICS_REPORTS_WEBSITE.includes(currentUrl);
        }
        if (lengthEqualToZero(modulesWithPermissions)) {
            routeAccess = routeAccess || activeModules?.some((module: IGenericRecord) => module.name === currentModule);
        }
        const dataBaseEmployeesId = currentUrl.includes(getRoute(Routes.DATABASE_EMPLOYEE_DETAIL));

        return (
            dataBaseEmployeesId ||
            alwaysAccessPagesWithMembership ||
            routeAccess ||
            routeElectronicDocument ||
            modulesWithPermissions?.some((module: IGenericRecord) => module.name === currentModule)
        );
    };

    const getPermissions = (name: string, moduleName: string): boolean => {
        return true;
        const modules = filterModulesActives();
        /* CONDITION WHEN COMPANY DOESN'T HAVE MEMBERSHIP */
        if (lengthEqualToZero(modules)) {
            return false;
        } else {
            if (moduleName === ELECTRONIC_DOCUMENTS || moduleName === getRouteName(Routes.SUPPORT_DOCUMENT_MENU)) {
                return modules.some((moduleMembership: IGenericRecord) => moduleMembership.name === ELECTRONIC_DOCUMENTS);
            }

            return modules.some(
                (moduleMembership: IGenericRecord) => moduleMembership.name === moduleName || moduleMembership.name === name
            );
        }
    };

    const validationPermissionsMenu = (name: string, moduleName: string): boolean => {
        if (canManageUsers()) return true;
        const modules = filterModulesActives();
        /* Constant with all menus into app and company registration module */
        const menuUserWithoutCompanyId = [
            getRouteName(Routes.HOME),
            getRouteName(Routes.DATABASE_MENU),
            getRouteName(Routes.HOME),
            getRouteName(Routes.NOTIFICATION_CENTER),
        ];

        if (name === PATHS[Routes.PURCHASING_PROCESS].title || moduleName === PATHS[Routes.PURCHASING_PROCESS].title) {
            return true;
        }

        const alwaysAccessPages = ALWAYS_ACCESS_MODULES_NAME.includes(name) || ALWAYS_ACCESS_MODULES_NAME.includes(moduleName);
        const alwaysAccessPagesWithMembership =
            (lengthGreaterThanZero(modules) && ALWAYS_ACCESS_WITH_MODULE_NAME.includes(name)) ||
            ALWAYS_ACCESS_WITH_MODULE_NAME.includes(moduleName);

        if (name || moduleName) {
            const menuCompany = menuUserWithoutCompanyId.includes(moduleName);

            if (!(menuCompany || alwaysAccessPages || alwaysAccessPagesWithMembership)) {
                return getPermissions(name, moduleName);
            }
        }
        return true;
    };

    const canManageUsers = (): boolean => {
        return (
            pathname === getRoute(Routes.USER_CATALOG_LIST) &&
            roles.some(({ name }) => name === ADMINISTRATOR || name === SUPER_ADMINISTRATOR)
        );
    };

    return {
        getRole,
        getPermissions,
        validateAccessUrl,
        validationPermissionsMenu,
        disabledInputs,
        stringWithModules,
        dispatchAuthorizationModal,
        modulesMembership,
    };
};

export default usePermissions;
