import { Section } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import { getRoute, getRouteName } from '@utils/Paths';
import { typesAppointmentTable } from './components';

export { default } from './CalendarPlanning';

/**
 * Routes for the breadcrumb
 *
 * @returns Section[]
 */
export const routes = (): Section[] => {
    const { PLANNING_AND_ORGANIZATION_MENU, CALENDAR_PLANNING } = Routes;
    return [
        {
            name: getRouteName(PLANNING_AND_ORGANIZATION_MENU),
            route: getRoute(PLANNING_AND_ORGANIZATION_MENU),
        },
        {
            name: getRouteName(CALENDAR_PLANNING),
            route: getRoute(CALENDAR_PLANNING),
        },
    ];
};

/**
 * Validates the data that is added in locations table
 *
 * @param locations: IGenericRecord[] - device list
 * @param onSubmit: boolean - variable that identifies if a shipment has already been made
 * @returns IGenericRecord[]
 *  */
export const validateLocations = (locations: IGenericRecord[], onSubmit: boolean): IGenericRecord[] => {
    return locations.map(location => {
        return {
            ...location,
            fieldsWithError: !location.name && onSubmit ? ['name'] : [],
        };
    });
};

/**
 * Validates the data that is added in Appointment table
 *
 * @param appointments: IGenericRecord[] - appointments list
 * @param onSubmit: boolean - variable that identifies if a shipment has already been made
 * @param virtual: boolean - variable that identifies if a appointment is virtual
 * @param onSite: boolean - variable that identifies if a appointment is on site
 * @returns IGenericRecord[]
 *  */
export const validateAppointment = (
    appointments: IGenericRecord[],
    onSubmit: boolean,
    virtual: boolean,
    onSite: boolean
): IGenericRecord[] => {
    const data: IGenericRecord[] = [];
    appointments.forEach(appointment => {
        const fieldsWithError: string[] = [];
        if (onSubmit) {
            Object.keys(appointment).map(name => {
                if (onSite) {
                    if (name === 'name') {
                        !appointment.name && fieldsWithError.push('name');
                    }
                    if (name === 'location') {
                        !appointment.location && fieldsWithError.push('location');
                    }
                    if (name === 'type_appointment_id') {
                        !appointment?.type_appointment_id && fieldsWithError.push('type_appointment');
                    }
                }
            });
        }
        if (
            (appointment.type_appointment === typesAppointmentTable.VIRTUAL && virtual && !onSite) ||
            (appointment.type_appointment === typesAppointmentTable.VIRTUAL && virtual && onSite) ||
            (appointment.type_appointment === typesAppointmentTable.ON_SITE && virtual && onSite) ||
            (!appointment.type_appointment && virtual && onSite)
        ) {
            data.push({ ...appointment, fieldsWithError: fieldsWithError });
        }
        if (onSite && !virtual && appointment.type_appointment !== typesAppointmentTable.VIRTUAL) {
            data.push({
                ...appointment,
                fieldsWithError: fieldsWithError,
            });
        }
    });
    return data;
};
