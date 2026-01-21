import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { BreadCrumb } from '@components/bread-crumb';
import { Information } from '@components/information';
import { ModalType } from '@components/modal-custom';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitle } from '@components/page-title';
import { Routes } from '@constants/Paths';
import { LANGUAGE_KEY } from '@constants/Translate';
import { ADD_EVENT } from '@constants/Calendar';
import useButtonProps from '@hooks/useButtonProps';
import useModal from '@hooks/useModal';
import useModalProps from '@hooks/useModalProps';
import useParam from '@hooks/useParam';
import { IGenericRecord } from '@models/GenericRecord';
import { deleteEvent, getEvents, postEvent, postSendEmailCalendarAction } from '@redux/calendar/actions';
import { RootState } from '@redux/rootReducer';
import { getRoute, getRouteName } from '@utils/Paths';
import { restProps } from '@utils/Props';
import { getRouteKey } from '@utils/Translation';
import { getDateFromUnix, getUnixFromDate } from '@utils/Date';
import { ModuleApp } from '@utils/GenerateId';
import { CALENDAR_MODALS, EventForm, MODALS, calendarProps, routes, typeEvents, getDurationTime } from '.';
import './Calendar.scss';

const Calendar: React.FC = () => {
    const dispatch = useDispatch();
    const { events } = useSelector((state: RootState) => state.calendar);

    const [event, setEvent] = useState<IGenericRecord>({});
    const [validate, setValidate] = useState<boolean>(false);
    const [requiredFieldsValidate, setRequiredFieldsValidate] = useState<IGenericRecord>({
        selectedRadioButton: typeEvents.TASK,
        selectTypeAppointment: {
            onSite: true,
            virtual: false,
        },
        diffHour: false,
        calendarHour: { hour: false, day_week: false },
    });
    const { getButtonProps } = useButtonProps();
    const [translate] = useTranslation(LANGUAGE_KEY);
    const { modals, toggleModal } = useModal(CALENDAR_MODALS);
    const { saveModal } = useModalProps({
        showModal: modals.success,
        toggleModal: (): void => toggleModal(MODALS.SUCCESS),
        moduleId: ModuleApp.CALENDAR,
    });

    const { queryParam } = useParam(ADD_EVENT);

    useEffect(() => {
        dispatch(getEvents());
    }, []);

    useEffect(() => {
        if (queryParam) toggleModal(MODALS.EVENT);
    }, [queryParam]);

    const selectEvent = (event: IGenericRecord): void => {
        toggleModal(MODALS.EVENT);
        if (event.event) {
            const { id, start, end, allDay } = event.event;
            const selectedEvent = events.find(item => item?.id === id);
            return setEvent({ ...selectedEvent, allDay, startStr: start, endStr: end });
        }
        setEvent({ end: event.end, start: event.start });
    };

    const closeModal = (): void => {
        toggleModal(MODALS.EVENT);
        setEvent({});
        setTimeout(() => setEvent({}), 500);
    };

    const validateFields = (): boolean => {
        if (requiredFieldsValidate.selectedRadioButton === typeEvents.TASK)
            return !event?.title || !requiredFieldsValidate?.diffHour || !event?.backgroundColor;
        return (
            !event?.title ||
            !(requiredFieldsValidate.selectTypeAppointment.onSite ? event?.jsEvent?.location : true) ||
            !event?.jsEvent?.name_customer ||
            !event?.jsEvent?.lastname_customer ||
            !event?.jsEvent?.email ||
            !requiredFieldsValidate.calendarHour.hour ||
            !requiredFieldsValidate.calendarHour.day_week ||
            !event?.jsEvent?.name_appointment ||
            (requiredFieldsValidate.selectTypeAppointment.virtual && !event?.jsEvent?.link) ||
            !event?.backgroundColor
        );
    };

    const saveEvent = async (): Promise<void> => {
        if (validateFields()) return setValidate(true);
        toggleModal(MODALS.EVENT);
        const isCorrectResponse = Boolean(
            (await event?.jsEvent)
                ? dispatch(
                      postSendEmailCalendarAction({
                          ...event,
                          startStr: event?.start,
                          endStr: event?.end,
                          allDay: false,
                          jsEvent: {
                              ...event?.jsEvent,
                              name_appointment: event?.title,
                              duration: getDurationTime(String(event?.jsEvent?.duration_time)),
                              date: getDateFromUnix(getUnixFromDate(event?.date)).formatYearMonthDay,
                          },
                      })
                  )
                : dispatch(postEvent(event))
        );
        if (isCorrectResponse) toggleModal(MODALS.SUCCESS);
        setValidate(false);
    };

    const deleteCalendarEvent = (): void => {
        toggleModal(MODALS.EVENT);
        dispatch(deleteEvent(event.id));
    };

    return (
        <div className="calendar">
            <PageTitle title={getRouteName(Routes.PLANNING_AND_ORGANIZATION_MENU)} />
            <BreadCrumb routes={routes()} />
            <Information
                title={translate(getRouteKey(Routes.CALENDAR))}
                description="Desde esta pantalla visualice el calendario, elija el tipo de visualización entre mes, semana o día. Agregue eventos con la fecha y hora que desee y agregue etiquetas de color a los eventos."
            />
            <div className="relative flex flex-col mt-7">
                <EventForm
                    events={events}
                    showModal={modals.event}
                    toggleModal={closeModal}
                    deleteEvent={deleteCalendarEvent}
                    requiredFieldsValidate={requiredFieldsValidate}
                    setRequiredFieldsValidate={setRequiredFieldsValidate}
                    {...restProps({ validate, event, setEvent, saveEvent })}
                />
                <FullCalendar
                    plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                    select={selectEvent}
                    eventClick={selectEvent}
                    eventChange={selectEvent}
                    events={events.map(event => ({
                        ...event,
                        start: new Date(event?.start.replace('Z', '')),
                        end: new Date(event?.end.replace('Z', '')),
                    }))}
                    {...calendarProps}
                />
            </div>
            <PageButtonsFooter
                {...getButtonProps({
                    moduleId: ModuleApp.PLANNING_AND_ORGANIZATION,
                    rightPath: getRoute(Routes.GANTT),
                    permissions: { name: Routes.GANTT, moduleName: Routes.PLANNING_AND_ORGANIZATION_MENU },
                })}
            />
            <ModalType {...saveModal} />
        </div>
    );
};

export default Calendar;
