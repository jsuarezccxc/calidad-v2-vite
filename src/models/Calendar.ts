/**
 * Calendar location interface
 *
 * @typeParam id: string - Unique location identifier
 * @typeParam name: string - Location name
 * @typeParam address: string - Physical location address
 * @typeParam color: string - Assigned location color (color name)
 * @typeParam colorCode: string - Hexadecimal color code
 * @typeParam isLocal?: boolean - Indicates if it's a local location
 * @typeParam check?: boolean - Indicates if location is selected
 * @typeParam send?: boolean - Indicates if location should be sent to server
 * @typeParam fieldsWithError?: string[] - List of fields with validation errors
 */
export interface ICalendarLocation {
    id: string;
    name: string;
    address: string;
    color: string;
    colorCode: string;
    isLocal?: boolean;
    check?: boolean;
    send?: boolean;
    fieldsWithError?: string[];
}

/**
 * Calendar appointment or schedule interface
 *
 * @typeParam id: string - Unique appointment identifier
 * @typeParam name: string - Descriptive appointment name
 * @typeParam duration: string - Appointment duration
 * @typeParam location: string - Location name where appointment will take place
 * @typeParam location_id: string | null - Location ID (can be null if no location assigned)
 * @typeParam duration_time: string - Duration time in specific format
 * @typeParam type_appointment: string - Appointment type (virtual, in-person, etc.)
 * @typeParam type_appointment_id: string - Appointment type ID
 * @typeParam check?: boolean - Indicates if appointment is selected
 * @typeParam send?: boolean - Indicates if appointment should be sent to server
 * @typeParam fieldsWithError?: string[] - List of fields with validation errors
 */
export interface ICalendarAppointment {
    id: string;
    name: string;
    duration: string;
    location: string;
    location_id: string | null;
    duration_time: string;
    type_appointment: string;
    type_appointment_id: string;
    check?: boolean;
    send?: boolean;
    fieldsWithError?: string[];
}

/**
 * Calendar work journey interface
 *
 * @typeParam id: string - Unique journey identifier
 * @typeParam time_slot_type: 'morning' | 'afternoon' - Journey type (morning or afternoon)
 * @typeParam start_time: string - Journey start time (HH:mm format)
 * @typeParam end_time: string - Journey end time (HH:mm format)
 * @typeParam day_of_week: string - Day of week (monday, tuesday, etc.)
 * @typeParam location_id: string - Location ID where journey takes place
 */
export interface ICalendarJourney {
    id: string;
    time_slot_type: 'morning' | 'afternoon';
    start_time: string;
    end_time: string;
    day_of_week: string;
    location_id: string;
}

/**
 * Calendar work hour interface
 *
 * @typeParam id: string - Unique work hour identifier
 * @typeParam start_time: string - Schedule start time (HH:mm format)
 * @typeParam end_time: string - Schedule end time (HH:mm format)
 * @typeParam day_of_week?: string - Day of week (optional)
 * @typeParam location_id?: string - Location ID (optional)
 */
export interface ICalendarWorkHour {
    id: string;
    start_time: string;
    end_time: string;
    day_of_week?: string;
    location_id?: string;
}

/**
 * Calendar event interface
 *
 * @typeParam id: string - Unique event identifier
 * @typeParam title: string - Event title
 * @typeParam start: string - Event start date and time (ISO format)
 * @typeParam end: string - Event end date and time (ISO format)
 * @typeParam description?: string - Optional event description
 * @typeParam location_id?: string - Location ID where event takes place
 * @typeParam jsEvent?: any - Original JavaScript event (for FullCalendar compatibility)
 */
export interface ICalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    description?: string;
    location_id?: string;
    jsEvent?: any;
}

/**
 * Available appointment types interface
 *
 * @typeParam virtual: boolean - Indicates if virtual appointments are enabled
 * @typeParam inPerson: boolean - Indicates if in-person appointments are enabled
 */
export interface ICalendarTypesAppointment {
    virtual: boolean;
    inPerson: boolean;
}

/**
 * Available time slots type
 */
export type TimeSlotType = 'morning' | 'afternoon';

/**
 * Calendar validation error interface
 *
 * @typeParam field: string - Field with error
 * @typeParam message: string - Error message
 */
export interface ICalendarValidationError {
    field: string;
    message: string;
}

/**
 * Calendar Redux state interface
 *
 * @typeParam events: ICalendarEvent[] - Calendar events list
 * @typeParam locations: ICalendarLocation[] - Available locations list
 * @typeParam appointments: ICalendarAppointment[] - Configured appointments/schedules list
 * @typeParam workHours: ICalendarWorkHour[] - Work hours list
 * @typeParam journeys: ICalendarJourney[] - Work journeys list
 * @typeParam dailySchedules: string[] - Daily schedules (string format)
 * @typeParam loading: boolean - Loading indicator for async operations
 * @typeParam error?: string - Error message (if exists)
 */
export interface ICalendarState {
    events: ICalendarEvent[];
    locations: ICalendarLocation[];
    appointments: ICalendarAppointment[];
    workHours: ICalendarWorkHour[];
    journeys: ICalendarJourney[];
    dailySchedules: string[];
    loading: boolean;
    error?: string;
}
