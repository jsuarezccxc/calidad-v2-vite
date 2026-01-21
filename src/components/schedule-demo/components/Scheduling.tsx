import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from '@utils/Dayjs';
// FullCalendar - core must be imported first
import '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { IGenericRecord } from '@models/GenericRecord';
import { getDailySchedules } from '@redux/calendar/actions';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { isPreviousDate } from '@utils/Date';
import {
    Hours,
    CALENDAR_PROPS,
    ISchedulingProps,
    DAYS_DISABLED,
    WEEKEND_INDICES,
    DECEMBER_INDICATOR,
    ONE_DIGIT_LIMIT,
    DATE_FORMAT_SCHEDULING,
    MAX_MONTHS_CALENDAR,
} from '.';

export const Scheduling: React.FC<ISchedulingProps> = ({ data, toggleCalendar, updateData, goBack }) => {
    const dispatch = useDispatch();
    const [validate, setValidate] = useState<boolean>(false);

    const { date, hour } = data;

    useEffect(() => {
        const start = dayjs().format(DATE_FORMAT_SCHEDULING);
        if (date === start) {
            setValidate(false);
        } else {
            dispatch(getDailySchedules(start));
        }
    }, []);

    useEffect(() => {
        if (date && hour) setValidate(false);
    }, [date, hour]);

    useEffect(() => {
        if (date) dispatch(getDailySchedules(date));
    }, [date]);

    const selectEvent = ({ start: date, startStr: formattedDate }: IGenericRecord): void => {
        if (formattedDate !== dayjs().format(DATE_FORMAT_SCHEDULING)) {
            const elements = document.querySelectorAll('.fc-day-today');
            elements.forEach(element => {
                element.classList.replace('fc-day-today', 'fc-day-future');
            });
        }
        const day = new Date(date).getDay();
        if (isInvalidDate(day, { date, formattedDate })) return;
        updateData({ ...data, date: formattedDate });
        setValidate(false);
    };

    const getBoxClass = ({ date, dow: day }: IGenericRecord): string => {
        const formattedDate = dayjs(date).format(DATE_FORMAT_SCHEDULING).replaceAll('/', '-');
        if (isInvalidDate(day, { date, formattedDate })) return 'fc-day-other';
        if (formattedDate === data.date && formattedDate !== dayjs().format(DATE_FORMAT_SCHEDULING)) return 'fc-day-selected';
        return '';
    };

    const isInvalidDate = (day: number, { date, formattedDate }: IGenericRecord): boolean => {
        return WEEKEND_INDICES.includes(day) || DAYS_DISABLED.includes(formattedDate) || isPreviousDate(date);
    };

    const getDateRange = (date?: string): { start: string; end: string } => {
        const start = date ?? dayjs().format(DATE_FORMAT_SCHEDULING);
        const [year, month, day] = start.split('-');
        const newDay = `${Number(day) > ONE_DIGIT_LIMIT ? '' : '0'}${Number(day) + 1}`;

        if (month === DECEMBER_INDICATOR) return { start, end: `${Number(year) + 1}-01-${newDay}` };

        const endLimit = dayjs(start).add(MAX_MONTHS_CALENDAR, 'month').add(1, 'day').format('YYYY-MM-DD');

        return {
            start,
            end: endLimit,
        };
    };

    const scheduleDemo = (e: FormEvent): void => {
        e.preventDefault();
        if (!hour || !date) return setValidate(true);
        setValidate(false);
        toggleCalendar();
    };

    return (
        <div className="scheduling">
            <div className="scheduling__content">
                <div
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: 'schedule-calendar',
                        action: ActionElementType.CONTAINER,
                        elementType: ElementType.CRD,
                    })}
                    className="scheduling__calendar"
                >
                    <FullCalendar
                        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                        select={selectEvent}
                        eventClick={selectEvent}
                        eventChange={selectEvent}
                        dayCellClassNames={getBoxClass}
                        allDayMaintainDuration={false}
                        validRange={getDateRange()}
                        {...CALENDAR_PROPS}
                    />
                </div>
                <Hours data={data} scheduleDemo={scheduleDemo} updateData={updateData} validate={validate} goBack={goBack} />
            </div>
        </div>
    );
};
