import { IGenericRecord } from '@models/GenericRecord';
export * from './PlanNotification';

/**
 * Interface plan notification component 
 * 
 * @typeParam notifyPlanState: IGenericRecord - State to show modal
 * @typeParam handleShowNotificationPlanState - Action to show modal
 * @typeParam handleRedirect: (route: string) => void - Action to redirect
 * @typeParam activePlans: IGenericRecord[] - Current active plans by user
 * @typeParam idPlanSelected: string - Id plan selected
 * @typeParam handleReactivatePlanUser: () => Promise<void> - Action to reactivate plan user
 */
export interface IPlanNotifcation {
    notifyPlanState: IGenericRecord;
    handleShowNotificationPlanState: (type: string) => void;
    handleRedirect: (route: string) => void;
    activePlans: IGenericRecord[];
    idPlanSelected: string;
    handleReactivatePlanUser: () => Promise<void>;
}
