import { ICard } from '@components/step-card';
import { Step } from '@models/EnableElectronicBiller';

export { Steps } from './Steps';

/**
 * These are the steps to become an electronic biller
 */
export const ELECTRONIC_BILLER_STEPS: ICard[] = [
    {
        title: 'Paso 1: Datos de la empresa',
        description: '',
        icon: 'company-information',
        step: Step.CompanyInformation,
    },
    {
        title: 'Paso 2: Registro en la DIAN',
        description: '',
        icon: 'dian-register',
        step: Step.DianRegistration,
    },
    {
        title: 'Paso 3: Hablitación como facturador electrónico',
        description: '',
        icon: 'approved-document',
        step: Step.Enablement,
    },
];

/**
 * This enum represents the cards help
 */
export enum CARDS {
    DEFINITIONS = 'DEFINITIONS',
    ENABLEMENT = 'ENABLEMENT',
    ACCOMPANIMENT = 'ACCOMPANIMENT',
}

/**
 * Screen help list using enum values
 */
export const AIDS = Object.values(CARDS);
