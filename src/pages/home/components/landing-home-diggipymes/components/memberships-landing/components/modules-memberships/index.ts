import { ISubModules } from '@models/Membership';
import organizationPlanningImage from '@assets/images/landing/organization-planning-review.svg';
import crmImage from '@assets/images/landing/crm-review.svg';
export * from './ModulesMemberships';

/**
 * This interface describes the properties for the `ModulesMemberships` component.
 *
 * @typeParam subModule - Represents a submodule object that adheres to the `ISubModules` interface.
 *                        This contains detailed information about the submodule, such as its pricing,
 *                        status, and identification details.
 * @typeParam handleRadioChange - A function that handles the change event when a radio button is clicked.
 *                                It is triggered to update the state of the selected module.
 * @typeParam selectedModule - Represents the currently selected submodule. It adheres to the `ISubModules`
 *                             interface or can be `null` if no module is selected.
 */
export interface IPropsModuleMemberships {
    subModule: ISubModules;
    handleRadioChange: (subModule: ISubModules) => void;
    selectedModule: ISubModules | null;
}

/** Const for image organizationPlanning module */
export const IMAGE_ORGANIZATION_PLANNING = organizationPlanningImage;
/** Const for image crm module */
export const IMAGE_CRM = crmImage;
