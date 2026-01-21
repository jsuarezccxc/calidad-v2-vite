export { default } from './HomeLanding';
import { SUPPORT_DOCUMENTS_TITLE } from '@constants/ElectronicDocuments';
import { SUPPORT_DOCUMENT } from '@constants/Memberships';
import { PATHS, Routes } from '@constants/Paths';
import { ICompany } from '@models/Company';
import { IGenericRecord } from '@models/GenericRecord';
import { lengthGreaterThanZero } from '@utils/Length';
import { getRoute, getRouteName } from '@utils/Paths';

/**
 * Interface to demo button.
 * @typeParam href: string - url
 * @typeParam text: string - title
 * @typeParam classesDiv: string - classes to main div
 * @typeParam classesText: string - classes to text
 */
export const demoButtonProps = {
    href: 'https://view.genial.ly/619d91e2b09e460db9540b81',
    text: 'Ver demo',
    classesDiv: 'button-landing',
    classesText: 'button-landing--link-information',
};

/**
 * HomeLanding Interface.
 * @typeParam accessToken: string - access token
 * @typeParam toggleAccount: ()=> void - function to toggle account
 * @typeParam toggleLogin: ()=> void - function to toggle login
 * @typeParam modules: IGenericRecord - list of available modules
 * @typeParam economicData: IGenericRecord - list of economic data
 * @typeParam refreshEconomicIndicators: ()=> void - function to refreshEconomicIndicators
 * @typeParam information: ICompany | null - list of information
 * @typeParam haveMembership: boolean - true if the company don't have membership
 */
export interface IHomeLanding {
    accessToken: string | undefined;
    toggleAccount: () => void;
    toggleLogin: () => void;
    modules: IGenericRecord;
    economicData: IGenericRecord;
    refreshEconomicIndicators: () => void;
    information: ICompany | null;
    haveMembership: boolean;
}

/**
 * IHomeLandingDiggipymes Interface.
 * @typeParam toggleAccount - Optional: ()=> void - function to toggle account
 * @typeParam toggleLogin - Optional: ()=> void - function to toggle login
 */
export interface IHomeLandingDiggipymes {
    toggleAccount?: () => void;
    toggleLogin?: () => void;
}

/**@param param: string - Current route param
 * It returns an object with a title and an onClick function
 * @typeParam module - IGenericRecord - this is the module that is passed to the function.
 * @typeParam name - The name of the module that you want to check if it exists in the module
 * array.
 * @typeParam history - IGenericRecord - this is the history object from the
 * react-router-dom library.
 * @typeParam first - boolean - this is a boolean value that determines whether the first or
 * second module is returned.
 * @returns A function that returns an object.
 */
export const dynamicModule = (module: IGenericRecord, name: string, history: IGenericRecord, first: boolean): IGenericRecord => {
    const pathLikeArray = Object.keys(PATHS).map(key => PATHS[key]);
    const haveRoute = (nameOfModule: string): IGenericRecord =>
        pathLikeArray?.find((item: IGenericRecord) => item?.title === nameOfModule && item?.route?.includes('menu')) ||
        pathLikeArray?.find((item: IGenericRecord) => item?.title === nameOfModule) ||
        {};
    if (module?.find((moduleFind: IGenericRecord) => moduleFind.name === name))
        return {
            title: name === SUPPORT_DOCUMENT ? SUPPORT_DOCUMENTS_TITLE : name,
            onClick: (): void => {
                history.push(haveRoute(name) ? haveRoute(name)?.route : '');
            },
        };

    const otherModulesAvailable = module
        ?.filter(
            (moduleFilter: IGenericRecord) =>
                moduleFilter.name !== getRouteName(Routes.HOME) || moduleFilter.title !== getRouteName(Routes.NOTIFICATION_CENTER)
        )
        ?.map((moduleFilter: IGenericRecord) => ({
            ...moduleFilter,
            name: moduleFilter?.name === SUPPORT_DOCUMENT ? SUPPORT_DOCUMENTS_TITLE : name,
        }));
    return {
        title: first ? otherModulesAvailable[0]?.name || '' : otherModulesAvailable[1]?.name || '',
        onClick: (): void => {
            history.push(
                first
                    ? haveRoute(otherModulesAvailable[0]?.name)?.route || ''
                    : haveRoute(otherModulesAvailable[1]?.name)?.route || ''
            );
        },
    };
};

/**
 * It returns an array of objects that have a title and an onClick function
 * @typeParam history - IGenericRecord: This is the history object from react-router-dom.
 * @typeParam modules - IGenericRecord: This is the modules object that is returned from
 * the API.
 * @returns An array of objects with the following properties:
 *     title: string
 *     onClick: function
 */
export const cardButtonProps = (history: IGenericRecord, modules: IGenericRecord, haveMembership: boolean): IGenericRecord => {
    return [
        {
            title: getRouteName(Routes.HOME),
            onClick: (): void => {
                !haveMembership && history.push(getRoute(Routes.HOME));
            },
        },
        {
            title: getRouteName(Routes.NOTIFICATION_CENTER),
            onClick: (): void => {
                !haveMembership && history.push(getRoute(Routes.NOTIFICATION_CENTER));
            },
        },
        dynamicModule(lengthGreaterThanZero(modules) ? modules[0]?.modules : [], 'Administración de bodegas', history, true),
        dynamicModule(lengthGreaterThanZero(modules) ? modules[0]?.modules : [], 'Planificación y organización', history, false),
    ];
};

/**
 * It takes an object with a property called trm, which is an array of objects, and returns an array of
 * objects with the same structure
 * @typeParam economicData - This is the data that is being passed from the parent
 * component.
 * @returns An array of objects
 */
export const InformationCardLandingProps = (economicData: IGenericRecord): IGenericRecord => {
    return [
        {
            title: 'Inflación anual',
            information: '13,12%',
        },
        {
            title: 'Tasa de interés de política',
            information: '12%',
            subtitle: 'Próxima decisión 27/01/2023',
            date: 'Vigente desde 19/12/2022',
        },
        {
            title: 'Indicador bancario de referencia (IBR) Overnight',
            information: '11,126%',
            subtitle: 'Tasa nominal',
            // date: '26/08/2022',
        },
        {
            title: 'Tasa de cambio representativa del mercado (TRM)',
            information: lengthGreaterThanZero(economicData?.trm) ? economicData?.trm[0]?.valor : '0',
            date: lengthGreaterThanZero(economicData?.trm)
                ? economicData?.trm[0]?.vigenciadesde?.split('T').reverse().splice(1).join()
                : '00/00/00',
        },
    ];
};
