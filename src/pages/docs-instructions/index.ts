import { IconsNames } from '@components/icon';
import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { getRoute } from '@utils/Paths';
import { stepsUrl } from './pages';

export { default } from './DocsInstructions';

/**
 * Routes for the breadcrumb
 *
 * @param title: string - Page title
 * @returns Section[]
 */
export const getRoutes = (title: string): Section[] => [
    {
        name: 'Documentos electrónicos',
        route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
    },
    {
        name: MODULE_TITLES.INVOICE,
        route: '#',
    },
    {
        name: title,
        route: '',
    },
];

/**
 * This interface describes the props of the state
 *
 * @typeParam icon: IconsNames - Name of icon in step cart
 * @typeParam title: string - Title in step cart
 * @typeParam type: string - Type of instruction
 * @typeParam description: string - describe the step
 * @typeParam content: () => ReactNode - content to the step
 */
export interface IStep {
    icon: IconsNames;
    title: string;
    type: stepsUrl;
    description: string;
    content: () => React.ReactNode;
}

/**
 * This interface extends the properties of a step with additional state information
 *
 * @extends IStep - Inherits the properties from IStep interface
 * @typeParam stepComplete: boolean - Indicates whether the step is complete
 */
export interface IStepComponent extends IStep {
    onClick: () => void;
    stepComplete: boolean;
}

/**
 * This interface describes the details of a step
 *
 * @typeParam description: string | React.ReactNode - A description of the step, which can be a string or a ReactNode
 * @typeParam content: () => React.ReactNode - A function returning the content of the step as a ReactNode
 */
export interface IStepDetail {
    description: string | React.ReactNode;
    content: () => React.ReactNode;
}
