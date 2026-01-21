import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Link } from '@components/button';
import { Checkbox } from '@components/checkbox';
import { getTimeIssue } from '@components/electronic-note';
import { ChangeEvent, DatePickerDayInput, IOptionSelect, SelectSearchInput, TextArea, TextInput } from '@components/input';
import { ModalCustom } from '@components/modal-custom';
import { TWELVE_MONTHS as TWELVE } from '@constants/PaymentPlans';
import { RadioButton } from '@components/radiobutton';
import { AM, EVENT_COLORS, FINISH_DATE } from '@constants/Calendar';
import { ZERO_DAYS as ZERO } from '@constants/Memberships';
import { IGenericRecord } from '@models/GenericRecord';
import { TimeFields, duration, typesAppointmentTable } from '@pages/catalog-planning/components';
import { getAppointment, getCompanyJourneyAction, getCompanyWorkHourAction, getLocations } from '@redux/calendar/actions';
import { RootState } from '@redux/rootReducer';
import { buildOptions } from '@utils/Company';
import { currentDateInUnix, getDateFromUnix, getDateTablePicker, getUnixFromDate } from '@utils/Date';
import { lengthEqualOneOrGreaterThanOne, lengthGreaterThanZero } from '@utils/Length';
import { INITIAL_HOUR, ITime, addAnHour, convertTime, convertTo24HourFormat } from '@utils/TimePicker';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import {
    DEFAULT_COLOR,
    IEventFormProps,
    IHourRange,
    INITIAL_DATA_APPOINTMENT,
    INITIAL_DATA_TASK,
    ON_SITE,
    PM,
    SIXTY,
    TEN,
    compareHours,
    dataRadioButton,
    dayNames,
    formatDate,
    namesSelectInput,
    typeEvents,
} from '.';
import { removeSpecialCharacters } from '@utils/Text';

export const EventForm: React.FC<IEventFormProps> = ({
    showModal,
    toggleModal,
    saveEvent,
    deleteEvent,
    requiredFieldsValidate,
    setRequiredFieldsValidate,
    event,
    setEvent,
    validate,
    events,
}) => {
    const [dispatch] = [useDispatch()];

    const { disabledInputs } = usePermissions();

    const [storeTime, setStoreTime] = useState<ITime>(INITIAL_HOUR);
    const [storeTimeSecond, setStoreTimeSecond] = useState<ITime>(INITIAL_HOUR);
    const timeInput = getTimeIssue(storeTime, 'HH:mm');
    const timeSecond = getTimeIssue(storeTimeSecond, 'HH:mm');

    const [dataSelect, setDataSelect] = useState<string>(typeEvents.TASK);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const [localState, setLocalState] = useState({
        initialDate: currentDateInUnix(),
        finishDate: currentDateInUnix(),
    });

    const { locations, appointments, journeysReducer } = useSelector((state: RootState) => state.calendar);
    const { initialDate, finishDate } = localState;
    const [hours, setHours] = useState<IGenericRecord[]>([]);
    const [stateHoursJourney, setStateHoursJourney] = useState<IGenericRecord[]>([]);
    const [selectTypeAppointment, setSelectTypeAppointment] = useState<IGenericRecord>({
        onSite: true,
        virtual: false,
    });

    useEffect(() => {
        dispatch(getLocations());
        dispatch(getAppointment());
        dispatch(getCompanyWorkHourAction());
        dispatch(getCompanyJourneyAction());
        setStateHoursJourney([]);
        setHours([]);
    }, []);
    useEffect(() => {
        setSelectedDate(event?.id ? event?.startStr : selectedDate);
        setDataSelect(event?.id && !!event?.jsEvent ? typeEvents.APPOINTMENT : typeEvents.TASK);
        setSelectTypeAppointment(
            event?.id && event?.jsEvent?.type_appointment !== ON_SITE
                ? { onSite: false, virtual: true }
                : { onSite: true, virtual: false }
        );
    }, [!!event?.id]);
    useEffect(() => {
        setRequiredFieldsValidate({
            ...requiredFieldsValidate,
            selectedRadioButton: dataSelect,
            selectTypeAppointment: selectTypeAppointment,
        });
    }, [dataSelect, selectTypeAppointment]);
    useEffect(() => {
        if (storeTime?.hour && storeTimeSecond?.hour && storeTime?.minutes && storeTimeSecond?.minutes) {
            setEvent({
                ...event,
                end: `${getDateFromUnix(finishDate, formatDate).dateFormat} ${timeSecond}`,
                start: `${getDateFromUnix(initialDate, formatDate).dateFormat} ${timeInput}`,
            });
            setRequiredFieldsValidate(prev => ({
                ...prev,
                diffHour: compareHours(storeTime, storeTimeSecond),
            }));
        }
    }, [timeInput, timeSecond, storeTime, storeTimeSecond, localState]);

    useEffect(() => {
        if (dataSelect === typeEvents.APPOINTMENT) {
            let hour = '';
            if (event?.jsEvent?.hour) {
                hour = convertTo24HourFormat(event?.jsEvent?.hour);
            }
            setEvent({
                ...event,
                end: `${getDateFromUnix(getUnixFromDate(selectedDate), formatDate).dateFormat} ${addAnHour(hour)}`,
                start: `${getDateFromUnix(getUnixFromDate(selectedDate), formatDate).dateFormat} ${hour}`,
                jsEvent: {
                    ...event.jsEvent,
                    date: getDateTablePicker(selectedDate),
                    type_appointment: selectTypeAppointment?.onSite
                        ? typesAppointmentTable.ON_SITE_ID
                        : typesAppointmentTable.VIRTUAL_ID,
                },
            });
            const location = locations.find(location => location?.id === event.jsEvent?.location_id);
            const locationJorney = journeysReducer.filter(journey => journey?.location_id === location?.id);
            setStateHoursJourney(locationJorney);
        }
    }, [dataSelect, selectedDate, event?.jsEvent?.hour, selectTypeAppointment]);

    useEffect(() => {
        let array: IGenericRecord[] = [];
        if (lengthGreaterThanZero(stateHoursJourney)) {
            stateHoursJourney.map(jorney => {
                const timePartsStart = jorney?.start_time?.split(':');
                const timePartsEnd = jorney?.end_time?.split(':');
                array = array.concat(
                    generateHourRange({
                        startHour: parseInt(timePartsStart[0]),
                        endHour: parseInt(timePartsEnd[0]),
                        interval: event?.jsEvent?.duration_time ? parseInt(event?.jsEvent?.duration_time) : 30,
                        day: String(jorney?.day_of_week),
                    })
                );
            });
            setHours(array);
        } else {
            if (requiredFieldsValidate.selectTypeAppointment.virtual) {
                dayNames.forEach(
                    item =>
                        (array = array.concat(
                            generateHourRange({
                                startHour: 0,
                                endHour: 23,
                                interval: 30,
                                day: item,
                            })
                        ))
                );
                setHours(array);
                return;
            }
            setHours([]);
        }
    }, [
        stateHoursJourney,
        event?.jsEvent?.duration_time,
        requiredFieldsValidate.selectTypeAppointment?.virtual,
        requiredFieldsValidate.selectTypeAppointment?.onSite,
        !!event?.id,
    ]);

    useEffect(() => {
        if (dataSelect === typeEvents.TASK && event?.start) {
            const startTime = convertTime(new Date(event?.start).toTimeString().split(' ')[0]);
            setStoreTime({
                hour: startTime?.hours12,
                minutes: startTime?.minutes,
                schedule: startTime?.amPm,
            });
            const endTime = convertTime(new Date(event?.end).toTimeString().split(' ')[0]);
            setStoreTimeSecond({
                hour: endTime?.hours12,
                minutes: endTime?.minutes,
                schedule: endTime?.amPm,
            });
        }
    }, [!!event?.start]);

    const generateHourRange = ({ startHour, endHour, interval, day }: IHourRange): IGenericRecord[] => {
        const hourArray: IGenericRecord[] = [];

        for (let i = startHour; i <= endHour; i++) {
            for (let j = ZERO; j < SIXTY; j += interval) {
                const formattedHour = i % TWELVE === ZERO ? TWELVE : i % TWELVE;
                const amPm = i < TWELVE ? AM.toUpperCase() : PM.toUpperCase();
                const formattedMinute = j < TEN ? `0${j}` : j.toString();
                const hourString = `${formattedHour}:${formattedMinute} ${amPm}`;
                hourArray.push({
                    day,
                    hour: hourString,
                });
            }
        } //

        return hourArray;
    };

    const handleHourClick = (hour: IGenericRecord): void => {
        setEvent({
            ...event,
            jsEvent: { ...event.jsEvent, hour: hour?.hour, day_week: hour?.day },
        });
        setRequiredFieldsValidate({ ...requiredFieldsValidate, calendarHour: { hour: !!hour?.hour, day_week: !!hour?.day } });
    };
    const handleChangeObservations = (data: IGenericRecord, index: number): void => {
        setEvent({
            ...event,
            jsEvent: {
                ...event.jsEvent,
                observation_appointment: lengthEqualOneOrGreaterThanOne(event?.jsEvent?.observation_appointment)
                    ? event.jsEvent?.observation_appointment?.map((observation: string, itemIndex: number) =>
                          itemIndex === index ? data : observation
                      )
                    : [data],
            },
        });
    };

    const handleSelectCardColor = (backgroundColor: string): void => setEvent({ ...event, backgroundColor });

    const handleChangeText = ({ target }: ChangeEvent): void => setEvent({ ...event, [target.name]: target.value });

    const handleChangeDate = (date: Date, name: string): void => {
        const dateSelected = getUnixFromDate(date);
        let initalDate: IGenericRecord = {};
        name === FINISH_DATE && date < new Date(getDateFromUnix(initialDate).date)
            ? (initalDate = {
                  initialDate: dateSelected,
              })
            : null;

        setLocalState({ ...localState, [name]: dateSelected, ...initalDate });
    };

    const handleChangeTextAppointment = ({ target }: ChangeEvent): void =>
        setEvent({
            ...event,
            jsEvent: { ...event.jsEvent, [target.name]: removeSpecialCharacters(target.value) },
        });

    const handleChangeEmail = ({ target }: ChangeEvent): void =>
        setEvent({
            ...event,
            jsEvent: { ...event.jsEvent, [target.name]: target.value },
        });

    const handleChangeSelectAppointment = (option: IOptionSelect, name?: string | undefined): void => {
        if (name) {
            let location;
            if (name === namesSelectInput.LOCATION) {
                location = locations.find(location => location?.id === option.id);
                const locationJorney = journeysReducer.filter(journey => journey?.location_id === option.id);
                setStateHoursJourney(locationJorney);
            }
            setEvent({
                ...event,
                backgroundColor: location?.colorCode ? location?.colorCode : DEFAULT_COLOR,
                jsEvent: {
                    ...event.jsEvent,
                    [name]: String(option.value),
                    location_id: name === namesSelectInput.LOCATION ? String(option.id) : event.jsEvent?.location_id,
                    address: name === namesSelectInput.LOCATION ? location?.address : event.jsEvent?.address,
                    duration_time: name === namesSelectInput.DURATION ? String(option.code) : event.jsEvent?.duration_time,
                    name_appointment_id:
                        name === namesSelectInput.NAME_APPOINTMENT ? String(option.id) : event.jsEvent?.name_appointment_id,
                    send: true,
                },
            });
        }
    };

    const handleDateChange = (date: Date): void => {
        setSelectedDate(date);
    };

    const appoinmentsOptionsRender = buildOptions(
        appointments.filter(appointment => {
            if (selectTypeAppointment.onSite && appointment.type_appointment === typesAppointmentTable.ON_SITE)
                return appointment;
            if (!selectTypeAppointment.onSite && appointment.type_appointment === typesAppointmentTable.VIRTUAL)
                return appointment;
        })
    ).map(item => ({ ...item, name: item.value }));
    const locationsOptionsRender = buildOptions(locations).map(item => ({ ...item, name: item.value }));
    const durationOptionsRender = duration.map(item => ({ ...item, name: item.value }));

    return (
        <ModalCustom
            id={generateId({
                module: ModuleApp.PLANNING_AND_ORGANIZATION,
                submodule: `${ModuleApp.MODALS}-event`,
                action: ActionElementType.INFO,
                elementType: ElementType.MDL,
            })}
            show={showModal}
            showModal={toggleModal}
            classesWrapper="modal--full"
            classesModal="modal--full w-151.4"
        >
            <div className="overflow-y-scroll calendar__modal-content xs:p-2 h-123 bg-green-scrollbar xs:w-full xs:h-full">
                <h3 className="w-full text-xl text-center text-blue font-allerbold">{event.id ? 'Editar' : 'Agregar'} evento</h3>
                {!event.id && (
                    <RadioButton
                        moduleId={ModuleApp.PLANNING_AND_ORGANIZATION}
                        classesRadioButton="-mr-4.5"
                        classesLabel="block mt-2 text-blue"
                        classesContainer="mt-4.5"
                        entities={dataRadioButton}
                        selected={dataSelect}
                        setSelected={setDataSelect}
                        handleChangeOption={(option): void => {
                            if (option.name === typeEvents.APPOINTMENT) {
                                setEvent({ ...INITIAL_DATA_APPOINTMENT });
                            } else {
                                setEvent({ ...INITIAL_DATA_TASK });
                            }
                        }}
                        bgInputDark
                        disabled={disabledInputs}
                    />
                )}
                {dataSelect === typeEvents.TASK ? (
                    <>
                        <TextInput
                            id={generateId({
                                module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                submodule: `${ModuleApp.MODALS}-event-title`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name="title"
                            labelText="*Nombre de la tarea:"
                            classesWrapper="w-full mt-2"
                            onChange={handleChangeText}
                            value={event.title}
                            placeholder="Título del evento"
                            required={validate && !event.title}
                            disabled={disabledInputs}
                        />
                        <div className="flex w-full xs:flex-col xs:justify-center mt-4.5">
                            <DatePickerDayInput
                                id={generateId({
                                    module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                    submodule: `${ModuleApp.MODALS}-event-initial-date`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                name="initialDate"
                                labelText="Fecha inicial:"
                                classesWrapper="md:w-60 w-37 xs:w-full xs:ml-0 -ml-1 md:ml-0 d-content"
                                selected={initialDate}
                                onChangeDate={(date): void => handleChangeDate(date, 'initialDate')}
                                maxDate={new Date(getDateFromUnix(finishDate).date)}
                                disabled={disabledInputs}
                            />
                            <DatePickerDayInput
                                id={generateId({
                                    module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                    submodule: `${ModuleApp.MODALS}-event-finish-date`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                name="finishDate"
                                labelText="Fecha final:"
                                classesWrapper="md:w-60 w-37 xs:w-full xs:ml-0 ml-4 d-content"
                                selected={finishDate}
                                onChangeDate={(date): void => handleChangeDate(date, 'finishDate')}
                                minDate={new Date(getDateFromUnix(initialDate).date)}
                                disabled={disabledInputs}
                            />
                        </div>
                        <TimeFields
                            storeTime={storeTime}
                            setStoreTime={setStoreTime}
                            storeTimeSecond={storeTimeSecond}
                            setStoreTimeSecond={setStoreTimeSecond}
                            validate={validate && !compareHours(storeTime, storeTimeSecond)}
                            disabled={disabledInputs}
                        />
                        {validate && !compareHours(storeTime, storeTimeSecond) && (
                            <label className="text-tiny text-purple mr-1.5 text-right leading-xtiny mt-1">
                                *La hora de fin debe ser como minimo 1 hora mayor a la inicial.
                            </label>
                        )}
                        <div className="flex justify-center gap-3.5 my-4.5">
                            {EVENT_COLORS.map((backgroundColor, index) => (
                                <div
                                    id={generateId({
                                        module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                        submodule: `${ModuleApp.MODALS}-event-color-${index}`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.BTN,
                                    })}
                                    key={`color${index}`}
                                    className={`p-0.5 border rounded-full cursor-pointer border-${
                                        backgroundColor === event.backgroundColor ? 'gray-dark' : 'transparent'
                                    }`}
                                    onClick={(): void => (!disabledInputs ? handleSelectCardColor(backgroundColor) : undefined)}
                                >
                                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor }} />
                                </div>
                            ))}
                        </div>
                        {validate && !event?.backgroundColor && (
                            <label className="block mt-1 mr-16 text-right text-tiny text-purple leading-xtiny">
                                *Se debe seleccionar un color para la tarea.
                            </label>
                        )}
                    </>
                ) : (
                    <>
                        <p className="font-allerbold text-gray-dark text-sm mt-4.5">Seleccione los tipos de citas que atiende:</p>
                        <div className="flex mt-4.5">
                            <Checkbox
                                id={generateId({
                                    module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                    submodule: `${ModuleApp.MODALS}-event-appointment-onsite`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.CHK,
                                })}
                                classLabel="text-gray-dark text-tiny"
                                label="Presencial"
                                checked={selectTypeAppointment.onSite}
                                classContainer="mb-4.5"
                                classBox="ml-7"
                                disabled={disabledInputs}
                                onChange={(): void => {
                                    setSelectTypeAppointment({
                                        onSite: true,
                                        virtual: false,
                                    });
                                    setEvent({ ...event, jsEvent: { ...event?.jsEvent, name_appointment: '' } });
                                }}
                            />
                            <Checkbox
                                id={generateId({
                                    module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                    submodule: `${ModuleApp.MODALS}-event-appointment-virtual`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.CHK,
                                })}
                                classLabel="text-gray-dark text-tiny"
                                label="Virtual"
                                checked={selectTypeAppointment.virtual}
                                classContainer="-ml-56 xs:ml-0 mb-4.5"
                                classBox="-ml-7"
                                disabled={disabledInputs}
                                onChange={(): void => {
                                    setSelectTypeAppointment({
                                        onSite: false,
                                        virtual: true,
                                    });
                                    setEvent({ ...event, jsEvent: { ...event?.jsEvent, name_appointment: '' } });
                                }}
                            />
                        </div>
                        <p className="font-allerbold text-gray-dark mt-4.5">Cita:</p>
                        <div className="flex my-2 xs:flex-col">
                            <SelectSearchInput
                                id={generateId({
                                    module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                    submodule: `${ModuleApp.MODALS}-event-appointment-type`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                valueSelect={event?.jsEvent?.name_appointment}
                                placeholder="Seleccionar"
                                labelText="*Tipo de cita:"
                                name={namesSelectInput.NAME_APPOINTMENT}
                                classesWrapper="w-60 xs:w-full"
                                disabled={disabledInputs}
                                optionSelect={appoinmentsOptionsRender}
                                onChangeSelect={(_, option: IOptionSelect): void =>
                                    handleChangeSelectAppointment(option, namesSelectInput.NAME_APPOINTMENT)
                                }
                                required={validate && !event?.jsEvent?.name_appointment}
                            />
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                    submodule: `${ModuleApp.MODALS}-event-appointment-name`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                name="title"
                                labelText="*Nombre de la cita:"
                                classesWrapper="w-60 xs:mt-2 xs:w-full xs:ml-0 ml-4.5"
                                onChange={handleChangeText}
                                value={event.title}
                                placeholder="..."
                                required={validate && !event.title}
                                disabled={disabledInputs}
                            />
                        </div>
                        <div className={`flex xs:flex-col${selectTypeAppointment.onSite ? '' : 'flex-row-reverse'}`}>
                            {selectTypeAppointment.onSite && (
                                <SelectSearchInput
                                    id={generateId({
                                        module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                        submodule: `${ModuleApp.MODALS}-event-location`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.DRP,
                                    })}
                                    valueSelect={event?.jsEvent?.location}
                                    labelText="*Sede:"
                                    name={namesSelectInput.LOCATION}
                                    classesWrapper="w-60 xs:w-full"
                                    optionSelect={locationsOptionsRender}
                                    onChangeSelect={(_, option: IOptionSelect): void =>
                                        handleChangeSelectAppointment(option, namesSelectInput.LOCATION)
                                    }
                                    required={validate && !event?.jsEvent?.location}
                                    disabled={disabledInputs}
                                />
                            )}
                            <SelectSearchInput
                                id={generateId({
                                    module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                    submodule: `${ModuleApp.MODALS}-event-duration`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                valueSelect={event?.jsEvent?.duration}
                                labelText="Duración:"
                                name={namesSelectInput.DURATION}
                                classesWrapper={`w-60 xs:w-full xs:mt-2 xs:ml-0 ${selectTypeAppointment.onSite ? 'ml-4.5' : ''}`}
                                optionSelect={durationOptionsRender}
                                onChangeSelect={(_, option: IOptionSelect): void =>
                                    handleChangeSelectAppointment(option, namesSelectInput.DURATION)
                                }
                                disabled={disabledInputs}
                            />
                            {selectTypeAppointment.virtual && (
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                        submodule: `${ModuleApp.MODALS}-event-link`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    name="link"
                                    labelText="*Link de la reunión:"
                                    classesWrapper="ml-4.5 w-60 xs:w-full"
                                    onChange={handleChangeEmail}
                                    value={event?.jsEvent?.link}
                                    placeholder="www.zoom.com.co"
                                    required={validate && !event?.jsEvent?.link}
                                    disabled={disabledInputs}
                                />
                            )}
                        </div>
                        <p className="font-allerbold text-gray-dark text-sm mt-4.5">Información del cliente:</p>
                        <div className="flex my-2 xs:flex-col">
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                    submodule: `${ModuleApp.MODALS}-event-name-customer`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                name="name_customer"
                                labelText="*Nombre:"
                                classesWrapper="w-60 xs:w-full"
                                onChange={handleChangeTextAppointment}
                                value={event?.jsEvent?.name_customer}
                                placeholder="..."
                                required={validate && !event?.jsEvent?.name_customer}
                                disabled={disabledInputs}
                            />
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                    submodule: `${ModuleApp.MODALS}-event-lastname-customer`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                name="lastname_customer"
                                labelText="*Apellido:"
                                classesWrapper="w-60 xs:mt-2 xs:w-full xs:ml-0 ml-4.5"
                                onChange={handleChangeTextAppointment}
                                value={event?.jsEvent?.lastname_customer}
                                placeholder="..."
                                required={validate && !event?.jsEvent?.lastname_customer}
                                disabled={disabledInputs}
                            />
                        </div>
                        <div className="flex mb-2 xs:flex-col">
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                    submodule: `${ModuleApp.MODALS}-event-email`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                name="email"
                                labelText="*Correo electrónico:"
                                classesWrapper="w-60 xs:w-full"
                                onChange={handleChangeEmail}
                                value={event?.jsEvent?.email}
                                placeholder="..."
                                required={validate && !event?.jsEvent?.email}
                                disabled={disabledInputs}
                                limitCharacters={false}
                            />
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                    submodule: `${ModuleApp.MODALS}-event-phone`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                name="phone"
                                labelText="Teléfono de contacto:"
                                classesWrapper="w-60 xs:mt-2 xs:w-full xs:ml-0 ml-4.5"
                                onChange={handleChangeTextAppointment}
                                value={event?.jsEvent?.phone}
                                placeholder="..."
                                onlyNumbers
                                maxLength={10}
                                disabled={disabledInputs}
                            />
                        </div>
                        <p className="font-allerbold text-gray-dark text-sm mt-4.5 mb-4.5">Horarios:</p>
                        <div className="flex flex-row">
                            <DatePicker
                                id={generateId({
                                    module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                    submodule: `${ModuleApp.MODALS}-event-date`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                locale="es"
                                calendarClassName="calendar-datepicker w-44.25 calendar-box-shadow"
                                className="w-52"
                                selected={selectedDate}
                                onChange={handleDateChange}
                                inline
                                disabled={disabledInputs}
                            />
                            <div className="ml-4.5">
                                <p className="font-aller text-gray-dark text-tiny">
                                    Selecciona la hora para su cita el{' '}
                                    {selectedDate?.toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                                <div
                                    className={`h-25 ${
                                        validate &&
                                        !(requiredFieldsValidate.calendarHour.hour || requiredFieldsValidate.calendarHour.day)
                                            ? 'border-purple border'
                                            : ''
                                    } overflow-y-auto bg-green-scrollbar mt-3`}
                                >
                                    <div className="grid grid-cols-4 gap-3 ">
                                        {hours.map((hour, index) => {
                                            const dayNameInSpanish = dayNames[selectedDate?.getDay()];
                                            return (
                                                dayNameInSpanish === hour?.day &&
                                                !events?.find(
                                                    localEvent =>
                                                        localEvent?.jsEvent?.hour === hour?.hour &&
                                                        localEvent?.jsEvent?.day_week === hour?.day
                                                ) && (
                                                    <div
                                                        id={generateId({
                                                            module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                                            submodule: `${ModuleApp.MODALS}-event-hour`,
                                                            action: ActionElementType.INPUT,
                                                            elementType: ElementType.TXT,
                                                        })}
                                                        key={index}
                                                        className={`calendar-hours ${
                                                            event?.jsEvent?.hour === hour?.hour && 'calendar-hours-select'
                                                        }`}
                                                        onClick={(): void => handleHourClick(hour)}
                                                    >
                                                        {hour?.hour}
                                                    </div>
                                                )
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {validate && !(requiredFieldsValidate.calendarHour.hour || requiredFieldsValidate.calendarHour.day) && (
                            <label className="text-tiny text-purple mr-1.5 text-right leading-xtiny mt-1">
                                *Campo obligatorio
                            </label>
                        )}
                        <p className="font-allerbold text-gray-dark text-sm mb-4.5 mt-4.5">Observaciones:</p>
                        {event?.jsEvent?.observation_appointment?.map((observation: string, itemIndex: number) => (
                            <TextArea
                                id={generateId({
                                    module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                    submodule: `${ModuleApp.MODALS}-event-observation`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                key={itemIndex}
                                value={observation || ''}
                                onChange={(e): void => handleChangeObservations(e.target.value, itemIndex)}
                                labelText=""
                                placeholder="* Si desea reagendar su cita por favor comuníquese al xxx xxx xxxx."
                                classesWrapper="xs:w-full w-full mb-4.5"
                                classesInput="rounded-none h-12"
                                disabled={disabledInputs}
                            />
                        ))}

                        <Link
                            id={generateId({
                                module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                submodule: `${ModuleApp.MODALS}-event-observation`,
                                action: ActionElementType.ADD,
                                elementType: ElementType.LNK,
                            })}
                            href="#"
                            text="+ Agregar observación"
                            classes="text-base"
                            onClick={(): void =>
                                setEvent({
                                    ...event,
                                    jsEvent: {
                                        ...event.jsEvent,
                                        observation_appointment: [...event.jsEvent?.observation_appointment, ''],
                                    },
                                })
                            }
                            disabled={disabledInputs}
                        />
                    </>
                )}
                <div className="flex justify-center gap-4.5 mt-14.75">
                    <Button
                        id={generateId({
                            module: ModuleApp.PLANNING_AND_ORGANIZATION,
                            submodule: `${ModuleApp.MODALS}-event`,
                            action: ActionElementType.BACK,
                            elementType: ElementType.BTN,
                        })}
                        text="Atrás"
                        onClick={(): void => {
                            setDataSelect(typeEvents.TASK);
                            toggleModal();
                        }}
                    />
                    <Button
                        id={generateId({
                            module: ModuleApp.PLANNING_AND_ORGANIZATION,
                            submodule: `${ModuleApp.MODALS}-event`,
                            action: ActionElementType.SAVE,
                            elementType: ElementType.BTN,
                        })}
                        text={`${dataSelect !== typeEvents.TASK ? 'Programar cita' : 'Guardar'}`}
                        onClick={(): void => {
                            saveEvent();
                        }}
                        disabled={disabledInputs}
                    />
                    {event.id && (
                        <Button
                            id={generateId({
                                module: ModuleApp.PLANNING_AND_ORGANIZATION,
                                submodule: `${ModuleApp.MODALS}-event`,
                                action: ActionElementType.DELETE,
                                elementType: ElementType.BTN,
                            })}
                            text="Eliminar"
                            onClick={(): void => {
                                setDataSelect(typeEvents.TASK);
                                deleteEvent();
                            }}
                            disabled={disabledInputs}
                        />
                    )}
                </div>
            </div>
        </ModalCustom>
    );
};
