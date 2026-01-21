import { IDataLineChart } from '@models/DashboardElectronicDocuments';
import { NameType, Payload, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export * from './LineChart';

/**
 * This interface is line chart props
 * 
 * @typeParam data: IDataLineChart[] - Data line chart
 */
export interface ILineChartProps {
    data: IDataLineChart[];
}

/**
 * This interface is tooltip props
 * 
 * @typeParam data: IDataLineChart[] - Data line chart
 * @typeParam active?: boolean - Optional prop is active tooltip
 * @typeParam payload?: Payload<ValueType, NameType>[] - Payload value
 */
export interface ITooltipProps {
    data: IDataLineChart[];
    active?: boolean;
    payload?: Payload<ValueType, NameType>[];
}

/**
 * This interface is custom tick props
 * 
 * @typeParam x: number - Position in X
 * @typeParam y: number - Position in Y
 * @typeParam payload: Payload<ValueType, NameType> - Payload information
 */
export interface ICustomTickProps {
    x: number;
    y: number;
    payload: Payload<ValueType, NameType>;
}

/**
 * This const is number repeat
 */
const { ZERO, ONE, ONE_THOUSAND } = {
    ZERO: 0,
    ONE: 1,
    ONE_THOUSAND: 1000,
};

/**
 * This const is utils page
 */
export const UTILS = {
    ZERO,
    ONE,
    ONE_THOUSAND,
};
