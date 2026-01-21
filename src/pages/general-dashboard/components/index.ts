import { IGenericRecord } from '@models/GenericRecord';
import { IDates } from '..';
import { IOptionSelect } from '@components/input';

export { CardDisabled } from './CardDisabled';
export { Calendar } from './Calendar';
export { Chart } from './Chart';
export { ChartCard } from './ChartCard';
export { IndicatorCards } from './IndicatorCards';
export { TrafficCards } from './TrafficCards';
export { WebsiteCard } from './WebsiteCard';
export { WebsiteCards } from './WebsiteCards';

/**
 * This interface describes the props of each card
 *
 * @typeParam disable: boolean - This indicates if the card is disabled
 */
export interface ICardProps {
    disable: boolean;
    sales: IGenericRecord;
    dates: IDates;
}

/**
 * This interface describes the props of chart card
 *
 * @typeParam sales: IGenericRecord - Sales data
 * @typeParam selectedMonth: string - Selected month to obtain data
 * @typeParam updateSelectedMonth: (option: IOptionSelect) => void - Function to update the selected month
 * @typeParam disable: boolean - This indicates if the card is disabled
 */
export interface IChartCardProps {
    sales: IGenericRecord;
    selectedMonth: string;
    updateSelectedMonth: (option: IOptionSelect) => void;
    disable: boolean;
}

/**
 * This interface describes the props of indicator cards
 *
 * @typeParam goToPaymentPlans: () => void - Function that directs to payment plans
 * @typeParam user: IGenericRecord - Optional user with active session
 * @typeParam marketRate: IGenericRecord - Representative market rate
 * @typeParam inflation: IGenericRecord - Annual inflation
 */
export interface IIndicatorCardsProps {
    goToPaymentPlans: () => void;
    user?: IGenericRecord;
    marketRate: IGenericRecord;
    inflation: IGenericRecord;
}

/**
 * This interface describes the props of website card
 *
 * @typeParam activePlan: IGenericRecord - Active plan
 * @typeParam disable: boolean - This indicates if the card is disabled
 * @typeParam domain: string - Website domain
 */
export interface IWebsiteCardProps {
    activePlan: IGenericRecord;
    disable: boolean;
    domain: string;
}

/**
 * Chart titles
 */
export enum Sales {
    TotalSales = 'Ventas totales',
    SalesValue = 'Valor ventas',
}

/**
 * Key used to get visitor count
 */
export const COUNT = 'count';

/**
 * Intermediate plan identifiers
 */
export const INTERMEDIATE_PLANS = [6, 10];

/**
 * Current market rate index
 */
export const MARKET_RATE_INDEX = 0;

/**
 * Static props of the calendar
 */
export const CALENDAR_PROPS = {
    initialView: 'dayGridMonth',
    headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: '',
    },
    locale: 'es',
    longPressDelay: 1000,
    eventLongPressDelay: 1000,
    selectLongPressDelay: 1000,
    selectable: true,
    dayMaxEvents: true,
    editable: true,
    allDaySlot: false,
    views: {
        dayGridMonth: {
            buttonText: 'Mes',
            eventDisplay: 'list-item',
        },
    },
};

/**
 * This property allows events to be painted over the entire calendar box
 */
export const BACKGROUND = 'background';
