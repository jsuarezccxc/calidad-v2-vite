import { useMemo } from 'react';
import { ICalendarLocation, ICalendarAppointment, ICalendarTypesAppointment } from '@models/Calendar';
import { lengthGreaterThanZero } from '@utils/Length';

/**
 * Configuration parameters for useCalendarValidation hook
 *
 * @typeParam companyLocations: ICalendarLocation[] - Company locations list
 * @typeParam companyAppointment: ICalendarAppointment[] - Company appointments list
 * @typeParam submitLocations: boolean - Indicates if locations are being submitted
 * @typeParam submitAppointment: boolean - Indicates if appointments are being submitted
 * @typeParam validate: boolean - Indicates if validation should occur
 * @typeParam typesAppointment: ICalendarTypesAppointment - Enabled appointment types (virtual, in-person)
 * @typeParam validateLocations: (locations: ICalendarLocation[], submitted: boolean) => ICalendarLocation[] - Function to validate locations
 * @typeParam validateAppointment: (appointments: ICalendarAppointment[], submitted: boolean, virtual: boolean, inPerson: boolean) => ICalendarAppointment[] - Function to validate appointments
 */
interface IUseCalendarValidationConfig {
    companyLocations: ICalendarLocation[];
    companyAppointment: ICalendarAppointment[];
    submitLocations: boolean;
    submitAppointment: boolean;
    validate: boolean;
    typesAppointment: ICalendarTypesAppointment;
    validateLocations: (locations: ICalendarLocation[], submitted: boolean) => ICalendarLocation[];
    validateAppointment: (
        appointments: ICalendarAppointment[], 
        submitted: boolean, 
        virtual: boolean, 
        inPerson: boolean
    ) => ICalendarAppointment[];
}

/**
 * Return interface for useCalendarValidation hook that handles calendar data validation
 *
 * @typeParam validateErrorsInLocations: boolean - Indicates if there are errors in locations
 * @typeParam validateErrorsInAppointments: boolean - Indicates if there are errors in appointments
 * @typeParam validateLocationsData: ICalendarLocation[] - Validated locations data
 * @typeParam validateAppointmentsData: ICalendarAppointment[] - Validated appointments data
 */
interface IUseCalendarValidationReturn {
    validateErrorsInLocations: boolean;
    validateErrorsInAppointments: boolean;
    validateLocationsData: ICalendarLocation[];
    validateAppointmentsData: ICalendarAppointment[];
}

/**
 * Hook for calendar data validation
 * @param config - Validation configuration object
 * @returns Object with validation results
 */
export const useCalendarValidation = (config: IUseCalendarValidationConfig): IUseCalendarValidationReturn => {
    const {
        companyLocations,
        companyAppointment,
        submitLocations,
        submitAppointment,
        validate,
        typesAppointment,
        validateLocations,
        validateAppointment
    } = config;
    
    const validateLocationsData = useMemo(
        () => validateLocations(companyLocations, submitLocations),
        [companyLocations, submitLocations, validateLocations]
    );

    const validateAppointmentsData = useMemo(
        () => validateAppointment(
            companyAppointment, 
            submitAppointment, 
            typesAppointment.virtual, 
            typesAppointment.inPerson
        ),
        [companyAppointment, submitAppointment, typesAppointment, validateAppointment]
    );

    const validateErrorsInLocations = useMemo(
        () => validate && lengthGreaterThanZero(
            validateLocationsData.filter(
                (location: ICalendarLocation) => location?.fieldsWithError?.length
            )
        ),
        [validate, validateLocationsData]
    );

    const validateErrorsInAppointments = useMemo(
        () => validate && lengthGreaterThanZero(
            validateAppointmentsData.filter(
                (appointment: ICalendarAppointment) => appointment?.fieldsWithError?.length
            )
        ),
        [validate, validateAppointmentsData]
    );

    return {
        validateErrorsInLocations,
        validateErrorsInAppointments,
        validateLocationsData,
        validateAppointmentsData,
    };
};
