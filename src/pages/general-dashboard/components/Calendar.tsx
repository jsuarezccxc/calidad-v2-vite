import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Routes } from '@constants/Paths';
import { ADD_EVENT } from '@constants/Calendar';
import { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';
import { getDateFormat } from '@utils/Date';
import { getRoute } from '@utils/Paths';
import { remToPx } from '@utils/Size';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { BACKGROUND, CALENDAR_PROPS } from '.';

export const Calendar: React.FC = () => {
    const history = useHistory();
    const { events: eventList = [] } = useSelector((state: RootState) => state.calendar);
    const [events, setEvents] = useState<IGenericRecord[]>([]);

    useEffect(() => {
        groupEvents();
    }, [eventList]);

    const groupEvents = (): void => {
        const eventsByDate: IGenericRecord = {};

        eventList.forEach(event => {
            const { dateWithDash = '' } = getDateFormat(event?.start);
            eventsByDate[dateWithDash] = [...(eventsByDate[dateWithDash] ?? []), event];
        });

        const data: IGenericRecord[] = [];
        for (const key in eventsByDate) data.push({ date: key, events: eventsByDate[key], display: BACKGROUND });
        setEvents(data);
    };

    const goToCalendar = (): void => history.push(`${getRoute(Routes.CALENDAR)}?${ADD_EVENT}=true`);

    const heightInPxCalendar = useMemo(() => remToPx(13.125), [document.body.clientWidth]);

    return (
        <div
            id={generateId({
                module: ModuleApp.DASHBOARD,
                submodule: 'calendar',
                action: ActionElementType.INFO,
                elementType: ElementType.CRD,
            })}
            className="calendar"
        >
            <button
                id={generateId({
                    module: ModuleApp.DASHBOARD,
                    submodule: 'calendar-add-task',
                    action: ActionElementType.ACTION,
                    elementType: ElementType.BTN,
                })}
                className="calendar__button"
                onClick={goToCalendar}
            >
                + Agregar tareas
            </button>
            <div className="calendar__content">
                <FullCalendar
                    plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                    events={events}
                    height={heightInPxCalendar}
                    {...CALENDAR_PROPS}
                />
            </div>
        </div>
    );
};
