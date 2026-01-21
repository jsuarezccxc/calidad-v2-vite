import basicPlan from '@assets/images/plans/website/basic-plane.svg';
import standardPlan from '@assets/images/plans/website/standard-plane.svg';
import advancedPlan from '@assets/images/plans/website/advanced-plane.svg';
import premiumPlan from '@assets/images/plans/website/premium-plane.svg';
import { IGenericRecord } from '@models/GenericRecord';
import { ISubModules } from '@models/Membership';

export { Card } from './Card';
export { Details } from './Details';
export { Website } from './Website';

/**
 * This interface describes the props of card
 *
 * @typeParam data: IGenericRecord - Purchase data
 * @typeParam card: { name: string; price_year: number; price_semester: number; index: number; isActive?: boolean } - Card data
 * @typeParam selectPlan: () => void - Function to select a plan
 * @typeParam showAllButtons: boolean - This indicates whether all buttons should be displayed
 * @typeParam hideButton: boolean - This is optional and indicates whether the button should be hidden
 * @typeParam hasActivePlan: boolean - This indicates if there is an active plan
 * @typeParam toggleLogin: () => void - Function to toggle Login
 */
export interface ICardProps {
    data: IGenericRecord;
    card: { name: string; price_year: number; price_semester: number; index: number; isActive?: boolean };
    selectPlan: () => void;
    showAllButtons: boolean;
    hideButton: boolean;
    hasActivePlan: boolean;
    toggleLogin?: () => void;
}

/**
 * This interface describes the props of website
 *
 * @typeParam submodules: ISubModules[] - List of submodules
 * @typeParam data: IGenericRecord - Purchase data
 * @typeParam updateData: (data: IGenericRecord) => void - Function to update data
 * @typeParam toggleLogin: () => void - Function to toggle Login
 */
export interface IWebsiteProps {
    submodules: ISubModules[];
    data: IGenericRecord;
    updateData: (data: IGenericRecord) => void;
    toggleLogin?: () => void;
}

/**
 * Card icons
 */
export const ICONS: string[] = [basicPlan, standardPlan, advancedPlan, premiumPlan];

/**
 * Premium plan
 */
export const PREMIUM_PLAN_ASTERISK = 'Plan Premium';
