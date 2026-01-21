/**
 * This interface defines the notification parameterization response
 *
 * @typeParam id: string - Optional property with the notification id
 * @typeParam company_id: string - Optional property with the company id
 * @typeParam account_accreditation: boolean - Indicates if the account accreditation is active
 * @typeParam buy_and_sell_checks: boolean - Indicates if the notification in buy and sell is active
 * @typeParam inventory_level_checks: boolean - Optional indicates if the inventory level is active
 * @typeParam physical_store_notification_time: string - Physical store notification time
 * @typeParam warehouse_exit_notification_time: string - Warehouse exit notification time
 * @typeParam electronic_invoice_notification: boolean - Optional indicates if notifications electronic invoice is active
 * @typeParam pending_notifications: string - Indicates if exist any pending notification
 * @typeParam consecutive_invoice_authorized?: number - Consecutive billing remaining notification
 * @typeParam resolution_expiration_date?: number - Notice of resolution about to expire
 * @typeParam created_at: number - Optional property with the created date
 * @typeParam updated_at: number - Optional property with the updated date
 */
export interface INotificationParameterization {
    id?: string;
    company_id?: string;
    account_accreditation: boolean;
    buy_and_sell_checks?: boolean;
    inventory_level_checks?: boolean;
    physical_store_notification_time: string;
    warehouse_exit_notification_time: string;
    electronic_invoice_notification?: boolean;
    pending_notifications: boolean;
    consecutive_invoice_authorized?: number;
    resolution_expiration_date?: number;
    created_at?: number;
    updated_at?: number;
}

/**
 * This interface defines the notification response
 *
 * @typeParam id: string - Notification id
 * @typeParam consecutive: string - Notification consecutive
 * @typeParam reference: string - Notification reference
 * @typeParam date: number - Notification date
 * @typeParam type: string - Notification type
 * @typeParam description: string - Notification description
 * @typeParam type_of_verification: string - Type of verification
 * @typeParam type_notification: INotificationType - Type of notification
 * @typeParam module_notification: INotificationType - Module of notification
 * @typeParam state_notification: INotificationType - State of notification
 * @typeParam created_at: number - Created date
 * @typeParam updated_at: number - Updated date
 */
export interface INotifications {
    id: string;
    consecutive: string;
    reference: string;
    date: number;
    type: string;
    description: string;
    type_of_verification: string;
    type_notification: INotificationType;
    module_notification: INotificationType;
    state_notification: INotificationType;
    created_at: number;
    updated_at: number;
}

/**
 * This interface defines the prefix number response
 *
 * @typeParam id: number - Prefix id
 * @typeParam country: string - Country name
 * @typeParam countryCode: string - Prefix code
 */
export interface IPrefixNumber {
    id: number
    country: string
    countryCode: string
}

/**
 * This interface defines the notification response
 *
 * @typeParam id: string - Notification id
 * @typeParam date: string - Notification date
 * @typeParam hour: string - Notification hour
 * @typeParam notification: string - Notification description
 */
export interface INotificationHistory {
    id: string
    date: string
    hour: string
    notification: string
}

/**
 * This interface defines the properties of the notification type
 *
 * @typeParam id: string - Notification id
 * @typeParam name: string - Notification name
 * @typeParam description: string - Notification description
 */
export interface INotificationType {
    id: string;
    name: string;
    description: string;
}

/**
 * This interface defines the properties of the checkbox
 *
 * @typeParam defaultCheck: string - Checkbox status
 * @typeParam defaultSetCheck: React.Dispatch<React.SetStateAction<string>> - Action to change status checkbox
 * @typeParam defaultSingle: boolean - Indicates if the component is single
 */
export interface IDefaultNotification {
    defaultCheck: string;
    defaultSetCheck: React.Dispatch<React.SetStateAction<string>>;
    defaultSingle: boolean;
}
