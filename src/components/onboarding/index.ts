export { Onboarding } from './Onboarding';

/**
 * This interface is onboarding redux
 *
 * @typeParam electronic_documents: IOnboarding - data electronic documents for onboarding
 * @typeParam website: IOnboarding - data website for onboarding
 */
export interface IOnboardingRedux {
    electronic_documents: IOnboarding;
    website: IOnboarding;
}

/**
 * This interface is onboarding
 *
 * @typeParam module: string - Module name
 * @typeParam percentage: string - Percentage to advance
 * @typeParam steps: IOnboardingData[] - Steps for the onboarding
 * @typeParam setToggleOnboarding: React.Dispatch<React.SetStateAction<boolean>> - Set toggle onboarding
 * @typeParam principalOnboarding: boolean - Indicates if it's the principal onboarding
 * @typeParam hasWebsite: boolean - Indicates if the user has a website
 * @typeParam hasElectronicDocuments: boolean - Indicates if the user has electronic documents
 * @typeParam isNearFinalStep: boolean - Indicates if the onboarding is near completion
 * @typeParam status_modal_website: boolean - Indicates if the website modal is open
 * @typeParam status_modal_electronic: boolean - Indicates if the electronic documents modal is open
 */
export interface IOnboarding {
    module?: string;
    percentage?: string;
    steps?: IOnboardingData[];
    setToggleOnboarding: React.Dispatch<React.SetStateAction<boolean>>;
    principalOnboarding?: boolean;
    hasWebsite?: boolean;
    hasElectronicDocuments?: boolean;
    isNearFinalStep?: boolean;
    status_modal_website?: boolean;
    status_modal_electronic?: boolean;
}

/**
 * This interface represents onboarding step data
 *
 * @typeParam id - Unique identifier for the onboarding step
 * @typeParam step - Name or label of the current step
 * @typeParam action - Description or label of the action for this step
 * @typeParam substeps - Optional list of nested onboarding substeps
 * @typeParam icon - Optional icon representation for the step
 * @typeParam inactive - Optional flag to mark the step as inactive
 * @typeParam completedSubStep - Optional flag to indicate if substeps are completed
 * @typeParam completed - Flag to indicate whether the step has been completed
 * @typeParam route - Optional route or path associated with the step
 */
export interface IOnboardingData {
    id: string;
    step: string;
    action: string;
    substeps?: IOnboardingData[];
    icon?: string;
    inactive?: boolean;
    completedSubStep?: boolean;
    completed: boolean;
    route?: string;
}

/**
 * Const with title for onboarding value
 */
export const TITLE_ONBOARDING =
    'Configure la información de su empresa y comience a disfrutar de las funcionalidades de diggi pymes';

/**
 * Const with information for electronic document onboarding value
 */
export const INFORMATION_ELECTRONIC_DOCUMENT = (isWebsite = false):string =>
    `Este proceso de configuración es esencial para activar todas las funcionalidades del módulo de ${isWebsite? 'Sitio web y tienda diggital': 'Documentos electrónicos'}. Haga clic en el botón para que complete los pasos para empezar a vender y gestionar su negocio de manera eficiente.`;

