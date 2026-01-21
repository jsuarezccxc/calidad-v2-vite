import { Section } from '@components/bread-crumb';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { Routes } from '@constants/Paths';
import { getRoute } from '@utils/Paths';

export { default } from './DocumentCorrectionCCXC';

export const breadCrumb = (): Section[] => {
    return [
        {
            name: 'Documentos electrónicos',
            route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
        },
        {
            name: MODULE_TITLES.NOTE,
            route: '#',
        },
        {
            name: 'Corrección de documentos electrónicos por parte de CCxC',
            route: '#',
        },
    ];
};

