import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { PDF } from '@constants/DownloadFile';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { INFORMATION_PAGE } from '@information-texts/ContingencyActivation';
import { IContingencyActivation } from '@models/ContingencyActivation';
import { getRoute, getRouteName } from '@utils/Paths';
import { getDateAnyFormat } from '@utils/Date';

export { default } from './ContingencyActivation';

/**
 * This const is bread crumbs page
 */
const ROUTES: Section[] = [
    {
        name: MODULE_TITLES.CONTINGENCY,
        route: '#',
    },
    {
        name: getRouteName(Routes.CONTINGENCY_ACTIVATION),
        route: getRoute(Routes.CONTINGENCY_ACTIVATION),
    },
];

/**
 * This const is information page
 */
const SUB_INFORMATION = {
    title: getRouteName(Routes.CONTINGENCY_ACTIVATION),
    description: INFORMATION_PAGE.DESCRIPTION,
};

/**
 * This enum is modal keys
 */
export enum ModalKeys {
    ModalQuestion = 'MODAL_QUESTION',
    ModalSave = 'MODAL_SAVE',
}

/**
 * This const is modal state
 */
const MODAL_STATE = {
    [ModalKeys.ModalQuestion]: false,
    [ModalKeys.ModalSave]: false,
};

/**
 * This function is validate file
 * 
 * @param file: File | undefined - File report
 * @returns boolean
 */
const validatePdf = (file: File | undefined): boolean => !!file && !file.type.includes(PDF);

/**
 * This function is validate form
 * 
 * @param contingency: IContingencyActivation - Contingency state
 * @returns boolean
 */
const validate = ({ description, file }: IContingencyActivation): boolean => {
    return !description || !file || validatePdf(file);
};

/**
 * This function is request endpoint
 * 
 * @param param0: IContingencyActivation - Contingency state
 * @returns IContingencyActivation
 */
const request = ({ start_date, end_date, ...contingency }: IContingencyActivation): IContingencyActivation => ({
    ...contingency,
    start_date: getDateAnyFormat(start_date, 'YYYY-MM-DD'),
    end_date: getDateAnyFormat(end_date, 'YYYY-MM-DD'),
});

/**
 * This const is utils page
 */
export const UTILS = {
    ROUTES,
    request,
    validate,
    validatePdf,
    MODAL_STATE,
    SUB_INFORMATION,
    CURRENT_DATE: new Date(),
    PAGE_TITLE: MODULE_TITLES.CONTINGENCY,
    DEFAULT_FILE: [{ name: 'report', files: [] }],
};
