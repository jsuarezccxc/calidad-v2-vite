import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ICalendarLocation, ICalendarAppointment, ICalendarJourney } from '@models/Calendar';
import { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';
import {
    deleteAppointmentAction,
    deleteCompanyJourneyAction,
    deleteCompanyWorkHourAction,
    deleteLocationAction,
    getAppointment,
    getCompanyJourneyAction,
    getCompanyWorkHourAction,
    getLocations,
    postCompanyAppointmentAction,
    postCompanyJourneyAction,
    postCompanyLocationsAction,
} from '@redux/calendar/actions';
import { lengthGreaterThanZero } from '@utils/Length';
import { isCorrectResponse } from '@utils/Response';

/**
 * Return interface for useCalendarData hook that manages calendar data state and operations
 *
 * @typeParam companyLocations: ICalendarLocation[] - Company locations list
 * @typeParam companyAppointment: ICalendarAppointment[] - Company appointments/schedules list
 * @typeParam journeyState: ICalendarJourney[] - Work journeys state
 * @typeParam deleteJourneyState: string[] - Journey IDs marked for deletion
 * @typeParam loading: boolean - Loading indicator for async operations
 * @typeParam setCompanyLocations: (locations: ICalendarLocation[]) => void - Updates company locations
 * @typeParam setCompanyAppointment: (appointments: ICalendarAppointment[]) => void - Updates company appointments
 * @typeParam setJourneyState: (journeys: ICalendarJourney[]) => void - Updates journeys state
 * @typeParam setDeleteJourneyState: (journeys: string[]) => void - Updates journeys marked for deletion
 * @typeParam submitLocations: (locations: ICalendarLocation[]) => Promise<boolean> - Submits locations to server and returns true if successful
 * @typeParam submitAppointment: (appointments: ICalendarAppointment[]) => Promise<boolean> - Submits appointments to server and returns true if successful
 * @typeParam submitJourney: (journeys: ICalendarJourney[]) => Promise<boolean> - Submits journeys to server and returns true if successful
 * @typeParam deleteJourney: (journeys: string[]) => Promise<boolean> - Deletes journeys from server and returns true if successful
 * @typeParam deleteLocations: (locationIds: string[]) => Promise<boolean> - Deletes locations from server and returns true if successful
 * @typeParam deleteAppointments: (appointmentIds: string[]) => Promise<boolean> - Deletes appointments from server and returns true if successful
 * @typeParam deleteWorkHour: (hourId: string) => Promise<boolean> - Deletes a specific work hour and returns true if successful
 * @typeParam refreshData: () => Promise<void> - Refreshes all calendar data from server
 */
interface IUseCalendarDataReturn {
    companyLocations: ICalendarLocation[];
    companyAppointment: ICalendarAppointment[];
    journeyState: ICalendarJourney[];
    deleteJourneyState: string[];
    loading: boolean;
    setCompanyLocations: (locations: ICalendarLocation[]) => void;
    setCompanyAppointment: (appointments: ICalendarAppointment[]) => void;
    setJourneyState: (journeys: ICalendarJourney[]) => void;
    setDeleteJourneyState: (journeys: string[]) => void;
    submitLocations: (locations: ICalendarLocation[]) => Promise<boolean>;
    submitAppointment: (appointments: ICalendarAppointment[]) => Promise<boolean>;
    submitJourney: (journeys: ICalendarJourney[]) => Promise<boolean>;
    deleteJourney: (journeys: string[]) => Promise<boolean>;
    deleteLocations: (locationIds: string[]) => Promise<boolean>;
    deleteAppointments: (appointmentIds: string[]) => Promise<boolean>;
    deleteWorkHour: (hourId: string) => Promise<boolean>;
    refreshData: () => Promise<void>;
}

export const useCalendarData = (): IUseCalendarDataReturn => {
    const dispatch = useDispatch();
    const { locations, appointments, journeysReducer } = useSelector(
        (state: RootState) => state.calendar
    );

    const [companyLocations, setCompanyLocations] = useState<ICalendarLocation[]>([]);
    const [companyAppointment, setCompanyAppointment] = useState<ICalendarAppointment[]>([]);
    const [journeyState, setJourneyState] = useState<ICalendarJourney[]>([]);
    const [deleteJourneyState, setDeleteJourneyState] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Initialize data on mount
    useEffect(() => {
        const initializeData = async (): Promise<void> => {
            setLoading(true);
            try {
                await Promise.all([
                    dispatch(getLocations()),
                    dispatch(getAppointment()),
                    dispatch(getCompanyWorkHourAction()),
                    dispatch(getCompanyJourneyAction()),
                ]);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [dispatch]);

    // Sync Redux state with local state
    useEffect(() => {
        if (locations) setCompanyLocations(locations as ICalendarLocation[]);
        if (appointments) setCompanyAppointment(appointments as ICalendarAppointment[]);
        if (journeysReducer) setJourneyState(journeysReducer as ICalendarJourney[]);
    }, [locations, appointments, journeysReducer]);

    // Memoized operations
    const submitLocations = useCallback(
        async (locations: ICalendarLocation[]): Promise<boolean> => {
            if (!lengthGreaterThanZero(locations)) return true;
            
            const formData = locations
                .filter(location => location.send)
                .map(location =>
                    location.color === 'Seleccionar' 
                        ? { ...location, color: 'lila', colorCode: '#81319B' } 
                        : location
                );

            if (!lengthGreaterThanZero(formData)) return true;

            setLoading(true);
            try {
                const status = await dispatch(postCompanyLocationsAction(formData));
                const success = isCorrectResponse(Number(status));
                if (success) {
                    await Promise.all([
                        dispatch(getLocations()),
                        dispatch(getAppointment()),
                    ]);
                }
                return success;
            } finally {
                setLoading(false);
            }
        },
        [dispatch]
    );

    const submitAppointment = useCallback(
        async (appointments: ICalendarAppointment[]): Promise<boolean> => {
            const formData = appointments.filter(appointment => appointment.send);
            if (!lengthGreaterThanZero(formData)) return true;

            setLoading(true);
            try {
                const status = await dispatch(postCompanyAppointmentAction(formData));
                const success = isCorrectResponse(Number(status));
                if (success) {
                    await Promise.all([
                        dispatch(getAppointment()),
                        dispatch(getLocations()),
                    ]);
                }
                return success;
            } finally {
                setLoading(false);
            }
        },
        [dispatch]
    );

    const submitJourney = useCallback(
        async (journeys: ICalendarJourney[]): Promise<boolean> => {
            if (!lengthGreaterThanZero(journeys)) return true;

            setLoading(true);
            try {
                const status = await dispatch(postCompanyJourneyAction(journeys));
                const success = isCorrectResponse(Number(status));
                if (success) {
                    await dispatch(getCompanyJourneyAction());
                }
                return success;
            } finally {
                setLoading(false);
            }
        },
        [dispatch]
    );

    const deleteJourney = useCallback(
        async (journeys: string[]): Promise<boolean> => {
            if (!lengthGreaterThanZero(journeys)) return true;

            setLoading(true);
            try {
                const status = await dispatch(deleteCompanyJourneyAction(journeys));
                const success = isCorrectResponse(Number(status));
                if (success) {
                    await dispatch(getCompanyJourneyAction());
                }
                return success;
            } finally {
                setLoading(false);
            }
        },
        [dispatch]
    );

    const deleteLocations = useCallback(
        async (locationIds: string[]): Promise<boolean> => {
            if (!lengthGreaterThanZero(locationIds)) return true;

            setLoading(true);
            try {
                const status = await dispatch(deleteLocationAction(locationIds.map(id => ({ id })) as IGenericRecord[]));
                const success = isCorrectResponse(Number(status));
                if (success) {
                    await dispatch(getLocations());
                }
                return success;
            } finally {
                setLoading(false);
            }
        },
        [dispatch]
    );

    const deleteAppointments = useCallback(
        async (appointmentIds: string[]): Promise<boolean> => {
            if (!lengthGreaterThanZero(appointmentIds)) return true;

            setLoading(true);
            try {
                const status = await dispatch(deleteAppointmentAction(appointmentIds.map(id => ({ id })) as IGenericRecord[]));
                const success = isCorrectResponse(Number(status));
                if (success) {
                    await dispatch(getAppointment());
                }
                return success;
            } finally {
                setLoading(false);
            }
        },
        [dispatch]
    );

    const deleteWorkHour = useCallback(
        async (hourId: string): Promise<boolean> => {
            setLoading(true);
            try {
                const status = await dispatch(deleteCompanyWorkHourAction(hourId));
                const success = isCorrectResponse(Number(status));
                if (success) {
                    await dispatch(getCompanyWorkHourAction());
                }
                return success;
            } finally {
                setLoading(false);
            }
        },
        [dispatch]
    );

    const refreshData = useCallback(async (): Promise<void> => {
        setLoading(true);
        try {
            await Promise.all([
                dispatch(getLocations()),
                dispatch(getAppointment()),
                dispatch(getCompanyWorkHourAction()),
                dispatch(getCompanyJourneyAction()),
            ]);
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    return {
        // State
        companyLocations,
        companyAppointment,
        journeyState,
        deleteJourneyState,
        loading,
        
        // Setters
        setCompanyLocations,
        setCompanyAppointment,
        setJourneyState,
        setDeleteJourneyState,
        
        // Operations
        submitLocations,
        submitAppointment,
        submitJourney,
        deleteJourney,
        deleteLocations,
        deleteAppointments,
        deleteWorkHour,
        
        // Data refresh
        refreshData,
    };
};
