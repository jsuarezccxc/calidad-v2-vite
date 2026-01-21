/**
 * This interface describes the properties of the date state
 *
 * @typeParam start_date: number - Start date
 * @typeParam finish_date: number - Finish date
 */
export interface IDates {
    start_date: number;
    finish_date: number;
}


/**
 * This interface describes the dates
 *
 * @typeParam start?: Date - Optional start date
 * @typeParam end?: Date - Optional end date
 */
export interface IDatesDayRange {
    start?: Date | null;
    end?: Date | null;
}
