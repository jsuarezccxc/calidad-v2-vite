import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';

export * from './components';
export { default } from './Calendar';

/**
 * Modal types of the calendar view
 */
export enum MODALS {
    EVENT = 'event',
    SUCCESS = 'success',
    DELETE = 'delete',
}

/**
 * Routes for the breadcrumb
 *
 * @returns Section[]
 */
export const routes = (): Section[] => {
    const { PLANNING_AND_ORGANIZATION_MENU, CALENDAR } = Routes;
    return [
        {
            name: getRouteName(PLANNING_AND_ORGANIZATION_MENU),
            route: getRoute(PLANNING_AND_ORGANIZATION_MENU),
        },
        {
            name: getRouteName(CALENDAR),
            route: getRoute(CALENDAR),
        },
    ];
};

/**
 * Static props of the calendar
 */
export const calendarProps = {
    initialView: 'dayGridMonth',
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay,listYear' },
    locale: 'es',
    longPressDelay: 1000,
    eventLongPressDelay: 1000,
    selectLongPressDelay: 1000,
    selectable: true,
    dayMaxEvents: true,
    editable: true,
    allDaySlot: false,
    buttonText: { today: 'Fecha', month: 'Mes', week: 'Semana', day: 'Día', list: 'Lista' },
    views: {
        dayGridMonth: {
            buttonText: 'Mes',
            eventDisplay: 'list-item',
        },
        timeGridWeek: {
            buttonText: 'Semana',
        },
        timeGridDay: {
            buttonText: 'Día',
        },
        listYear: {
            buttonText: 'Año',
            listYearFormat: 'YYYY',
        },
    },
};

/**
 * Modal list of the calendar
 */
export const CALENDAR_MODALS = {
    delete: false,
    success: false,
    event: false,
};

/**
 * Functions that return parse time
 *
 * @param time: string - time in seconds
 * @returns string
 */
export const getDurationTime = (time: string): string => {
    switch (time) {
        case '60':
            return '1 hora';
        case '120':
            return '2 horas';
        case '30':
            return '30 minutos';
        default:
            return '';
    }
};
