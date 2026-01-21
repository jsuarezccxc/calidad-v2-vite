import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { Checkbox } from '@components/checkbox';
import { Icon } from '@components/icon';
import { IOptionSelect, SelectInput } from '@components/input';
import { ModalType } from '@components/modal-custom';
import { NA, Table } from '@components/table';
import { TableError } from '@components/table-error';
import { PRODUCT_SHIPPING } from '@information-texts/ProductShippingCost';
import { IGenericRecord } from '@models/GenericRecord';
import { validateAppointment } from '@pages/catalog-planning';
import {
    deleteAppointmentAction,
    deleteCompanyWorkHourAction,
    deleteLocationAction,
    getAppointment,
    getCompanyJourneyAction,
    getCompanyWorkHourAction,
    getLocations,
} from '@redux/calendar/actions';
import { RootState } from '@redux/rootReducer';
import { buildOptions } from '@utils/Company';
import { lengthGreaterThanZero } from '@utils/Length';
import { convertTimeFormat12 } from '@utils/TimePicker';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import { ONE } from '@constants/Numbers';
import { TWELVE_MONTHS as TWELVE } from '@constants/PaymentPlans';
import {
    DURATION,
    LOCATION,
    ModalCustomHour,
    NOT_AVAILABLE,
    TYPE_APPOINTMENT,
    VALIDATE_PLURAL_ERROR,
    VALIDATE_SINGULAR_ERROR,
    fieldsBodyAppointment,
    fieldsBodyLocations,
    headersTableAppointment,
    headersTableJourneys,
    headersTableLocations,
    journeys,
    timeSlotType,
    typesAppointmentTable,
} from '..';
import './ContentTable.scss';

export const ContentTable: React.FC<IGenericRecord> = ({
    typesAppointment,
    companyLocations,
    setCompanyLocations,
    companyAppointment,
    setCompanyAppointment,
    validateLocations,
    submitLocations,
    submitAppointment,
    setModalSave,
    journeyState,
    setJourneyState,
    deleteJourneyState,
    setDeleteJourneyState,
    validate = false,
}) => {
    const [dispatch] = [useDispatch()];

    const { locations, appointments, workHours, journeysReducer } = useSelector((state: RootState) => state.calendar);

    const { disabledInputs } = usePermissions();

    const [showModalHour, setShowModalHour] = useState(false);
    const [modalDeleteLocation, setModalDeleteLocation] = useState(false);
    const [modalDeleteAppointment, setModalDeleteAppointment] = useState(false);
    const [modalDeleteHour, setModalDeleteHour] = useState(false);
    const [validateDifferentSchedules, setValidateDifferentSchedules] = useState(false);
    const [editHourState, setEditHourState] = useState<IGenericRecord | undefined>(undefined);
    const [deleteHourState, setDeleteHourState] = useState<string | undefined>('');

    useEffect(() => {
        dispatch(getLocations());
        dispatch(getAppointment());
        dispatch(getCompanyWorkHourAction());
        dispatch(getCompanyJourneyAction());
    }, []);

    useEffect(() => {
        if (locations) {
            setCompanyLocations(locations);
        }
        if (appointments) {
            setCompanyAppointment(appointments);
        }
        if (journeysReducer) {
            setJourneyState(journeysReducer);
        }
    }, [locations, appointments, journeysReducer]);

    const handleChangeTableLocations = (e: React.ChangeEvent<HTMLInputElement>, item: IGenericRecord): void => {
        const { value, name } = e?.target;
        setCompanyLocations(
            companyLocations.map((location: IGenericRecord) => {
                if (item && location.id === item.id) {
                    return {
                        ...location,
                        fieldsWithError: location.fieldsWithError?.filter((nameField: string) => nameField !== name),
                        [name]: String(value).toUpperCase(),
                        send: true,
                    };
                }
                return location;
            })
        );
    };

    const handleChangeSelectLocations = (
        option: IGenericRecord,
        others?: IGenericRecord | undefined,
        name?: string | undefined
    ): void => {
        setCompanyLocations(
            companyLocations.map((location: IGenericRecord) => {
                if (others && name && location.id === others?.id) {
                    return {
                        ...location,
                        [name]: String(option.value),
                        colorCode: String(option.code),
                        send: true,
                    };
                }
                return location;
            })
        );
    };

    const handleChangeSelectAppointment = (
        option: IGenericRecord,
        others?: IGenericRecord | undefined,
        name?: string | undefined
    ): void => {
        setCompanyAppointment(
            companyAppointment.map((appointment: IGenericRecord) => {
                if (others && name && appointment.id === others?.id) {
                    return {
                        ...appointment,
                        [name]: String(option.value),
                        location:
                            name === LOCATION
                                ? String(option.value)
                                : name === TYPE_APPOINTMENT
                                ? option?.value === typesAppointmentTable.VIRTUAL
                                    ? 'N/A'
                                    : ''
                                : appointment?.location,
                        location_id: name === LOCATION ? String(option.id) : appointment?.location_id,
                        duration_time: name === DURATION ? String(option.code) : appointment?.duration_time,
                        type_appointment_id: name === TYPE_APPOINTMENT ? String(option.id) : appointment?.type_appointment_id,
                        send: true,
                    };
                }
                return appointment;
            })
        );
    };

    const handleChangeTableAppointment = (e: React.ChangeEvent<HTMLInputElement>, item: IGenericRecord): void => {
        const { value, name } = e?.target;
        setCompanyAppointment(
            companyAppointment.map((appointment: IGenericRecord) => {
                if (item && appointment.id === item.id) {
                    return {
                        ...appointment,
                        fieldsWithError: appointment.fieldsWithError?.filter((nameField: string) => nameField !== name),
                        [name]: String(value).toUpperCase(),
                        send: true,
                    };
                }
                return appointment;
            })
        );
    };

    const setSelectedCheckbox = (item: IGenericRecord): void => {
        setCompanyLocations(
            companyLocations.map((device: IGenericRecord) => {
                const deviceSelected = item[0];
                if (device.id === deviceSelected?.id) {
                    return { ...device, check: !device.check };
                }
                return device;
            })
        );
    };

    const setSelectedCheckboxAppointment = (item: IGenericRecord): void => {
        setCompanyAppointment(
            companyAppointment.map((device: IGenericRecord) => {
                const deviceSelected = item[0];
                if (device.id === deviceSelected?.id) {
                    return { ...device, check: !device.check };
                }
                return device;
            })
        );
    };

    const addCompanyLocations = (): void => {
        const id = uuid();
        setCompanyLocations([
            ...companyLocations,
            { name: '', address: '', color: 'Seleccionar', colorCode: '', id, check: false, isLocal: true },
        ]);
    };
    const isLocalDelete = (companyItem: IGenericRecord): boolean =>
        companyItem.some((location: IGenericRecord) => location?.check && location?.isLocal) &&
        !companyItem.some((location: IGenericRecord) => location?.check && !location?.isLocal);

    const onDeleteLocations = async (): Promise<void> => {
        const formDataDelete = companyLocations.map((location: IGenericRecord) => (location.check ? location.id : ''));
        if (isLocalDelete(companyLocations)) {
            setCompanyLocations(companyLocations.filter((location: IGenericRecord) => !location.check));
            return;
        }
        if (lengthGreaterThanZero(formDataDelete)) await dispatch(deleteLocationAction(formDataDelete));
        await dispatch(getLocations());
        setModalSave(true);
    };

    const onDeleteAppointment = async (): Promise<void> => {
        const formDataDelete = companyAppointment.map((appointment: IGenericRecord) => (appointment.check ? appointment.id : ''));
        if (isLocalDelete(companyAppointment)) {
            setCompanyAppointment(companyAppointment.filter((appointment: IGenericRecord) => !appointment?.check));
            return;
        }
        if (lengthGreaterThanZero(formDataDelete)) await dispatch(deleteAppointmentAction(formDataDelete));
        await dispatch(getAppointment());
        setModalSave(true);
    };

    const onDeleteHour = async (): Promise<void> => {
        if (deleteHourState) await dispatch(deleteCompanyWorkHourAction(deleteHourState));
        await dispatch(getCompanyWorkHourAction());
        setModalSave(true);
    };

    const isOnlyVirtualDate = (): boolean => {
        const { virtual, inPerson } = typesAppointment;
        return virtual && !inPerson;
    };

    const addCompanyAppointment = (): void => {
        const id = uuid();
        setCompanyAppointment([
            {
                name: '',
                duration: '',
                location: isOnlyVirtualDate() ? NA : '',
                location_id: isOnlyVirtualDate() ? null : '',
                duration_time: '',
                type_appointment:
                    typesAppointment.virtual && typesAppointment.inPerson
                        ? ''
                        : isOnlyVirtualDate()
                        ? typesAppointmentTable.VIRTUAL
                        : typesAppointmentTable.ON_SITE,
                type_appointment_id:
                    typesAppointment.virtual && typesAppointment.inPerson
                        ? ''
                        : isOnlyVirtualDate()
                        ? typesAppointmentTable.VIRTUAL_ID
                        : typesAppointmentTable.ON_SITE_ID,
                id,
                check: false,
            },
            ...companyAppointment,
        ]);
    };

    const footerClick = (): void => {
        setShowModalHour(true);
    };

    const editClick = (id: string | undefined): void => {
        setEditHourState(workHours?.find(item => item.id === id));
        setShowModalHour(true);
    };

    const trashClick = (id: string | undefined): void => {
        setDeleteHourState(id);
        setModalDeleteHour(true);
    };

    const handleChangeSelectJourney = (option: IOptionSelect, day: string, table: timeSlotType, location_id = ''): void => {
        if (option?.value !== NOT_AVAILABLE) {
            const hour = workHours?.find(hour => option?.id === hour?.id);
            setJourneyState([
                ...journeyState,
                {
                    id: uuid(),
                    time_slot_type: table,
                    start_time: hour?.start_time,
                    end_time: hour?.end_time,
                    day_of_week: day,
                    location_id,
                },
            ]);
        } else {
            setJourneyState(
                journeyState.filter((journey: IGenericRecord) => {
                    return journey?.id !== option?.id;
                })
            );
            option?.id && setDeleteJourneyState([...deleteJourneyState, option?.id]);
        }
    };
    const validatedLocations = useMemo(() => validateLocations(companyLocations, submitLocations), [
        companyLocations,
        submitLocations,
        validateLocations,
    ]);

    const validatedAppointments = useMemo(
        () => validateAppointment(companyAppointment, submitAppointment, typesAppointment.virtual, typesAppointment.inPerson),
        [companyAppointment, submitAppointment, typesAppointment, validateAppointment]
    );

    const validateErrorsInLocations = useMemo(
        () =>
            validate &&
            lengthGreaterThanZero(validatedLocations.filter((location: IGenericRecord) => location?.fieldsWithError?.length)),
        [validate, validatedLocations]
    );

    const validateErrorsInAppointments = useMemo(
        () =>
            validate &&
            lengthGreaterThanZero(
                validatedAppointments.filter((appointment: IGenericRecord) => appointment?.fieldsWithError?.length)
            ),
        [validate, validatedAppointments]
    );

    const buildOptionsDifferentSchedules = useCallback(
        (workHours: IGenericRecord, optionId = '', isMorning: boolean, isDifferentSchedules: boolean): IOptionSelect[] => {
            return [
                {
                    key: uuid(),
                    value: NOT_AVAILABLE,
                    id: optionId,
                },
                ...(workHours?.map((hour: IGenericRecord) => {
                    const option = {
                        key: uuid(),
                        value: `${convertTimeFormat12(hour?.start_time)} - ${convertTimeFormat12(hour?.end_time)}`,
                        id: hour?.id,
                    };
                    if (isDifferentSchedules) {
                        if (parseInt(hour.start_time) > TWELVE && !isMorning) {
                            return option;
                        }
                        if (parseInt(hour.start_time) < TWELVE && isMorning) {
                            return option;
                        }
                        return;
                    }
                    return option;
                }) || []),
            ].filter(option => option);
        },
        []
    );

    return (
        <>
            <ModalCustomHour
                showModal={showModalHour}
                toggleModal={setShowModalHour}
                dispatch={dispatch}
                editHourState={editHourState}
            />
            <ModalType
                id={generateId({
                    module: ModuleApp.CALENDAR_PLANNING,
                    submodule: `${ModuleApp.MODALS}-delete-location`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.MDL,
                })}
                type="delete"
                show={modalDeleteLocation}
                showModal={(): void => setModalDeleteLocation(false)}
                title="Eliminar"
                text={PRODUCT_SHIPPING.MODAL_DELETE}
                mainAction={(): void => {
                    onDeleteLocations();
                    setModalDeleteLocation(false);
                }}
            />
            <ModalType
                id={generateId({
                    module: ModuleApp.CALENDAR_PLANNING,
                    submodule: `${ModuleApp.MODALS}-delete-appointment`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.MDL,
                })}
                type="delete"
                show={modalDeleteAppointment}
                showModal={(): void => setModalDeleteAppointment(false)}
                title="Eliminar"
                text={PRODUCT_SHIPPING.MODAL_DELETE}
                mainAction={(): void => {
                    onDeleteAppointment();
                    setModalDeleteAppointment(false);
                }}
            />
            <ModalType
                id={generateId({
                    module: ModuleApp.CALENDAR_PLANNING,
                    submodule: `${ModuleApp.MODALS}-delete-hour`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.MDL,
                })}
                type="delete"
                show={modalDeleteHour}
                showModal={(): void => setModalDeleteHour(false)}
                title="Eliminar"
                text={PRODUCT_SHIPPING.MODAL_DELETE_HOUR}
                mainAction={(): void => {
                    onDeleteHour();
                    setModalDeleteHour(false);
                }}
            />
            {typesAppointment && (typesAppointment.inPerson || (!typesAppointment.inPerson && !typesAppointment.virtual)) && (
                <>
                    <p className="font-allerbold text-gray-dark mt-4.5 mb-2">Agregue las sedes de su negocio:</p>
                    <div className="flex justify-end mb-2 w-176 xs:w-full">
                        <Icon
                            id={generateId({
                                module: ModuleApp.CALENDAR_PLANNING,
                                submodule: `delete-company-locations`,
                                action: ActionElementType.TRASH,
                                elementType: ElementType.ICO,
                            })}
                            name="trashBlue"
                            hoverIcon="trashGreen"
                            classIcon="w-5.5 h-5.5"
                            onClick={(): void => {
                                lengthGreaterThanZero(companyLocations.filter((device: IGenericRecord) => device.check)) &&
                                    !disabledInputs &&
                                    setModalDeleteLocation(true);
                            }}
                        />
                    </div>
                    <Table
                        id={generateId({
                            module: ModuleApp.CALENDAR_PLANNING,
                            submodule: `company-locations`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.TBL,
                        })}
                        disabled={disabledInputs}
                        editable={!disabledInputs}
                        headersTable={headersTableLocations}
                        data={!typesAppointment?.inPerson && !typesAppointment?.virtual ? [] : validatedLocations}
                        fieldsBody={fieldsBodyLocations(handleChangeTableLocations, handleChangeSelectLocations)}
                        setSelected={setSelectedCheckbox}
                        className="w-max"
                        validate={validate}
                        isFooterRowsCustom
                        textAddLink="+ Agregar sede"
                        onClickAddLink={
                            !typesAppointment?.inPerson && !typesAppointment?.virtual ? undefined : addCompanyLocations
                        }
                        sendFormWithEnter
                    />
                    {validateErrorsInLocations && (
                        <TableError
                            className="ml-7.3"
                            customText={`${
                                validatedLocations.filter((location: IGenericRecord) => location?.fieldsWithError?.length)
                                    .length === ONE
                                    ? VALIDATE_SINGULAR_ERROR
                                    : VALIDATE_PLURAL_ERROR
                            }`}
                        />
                    )}
                </>
            )}
            <p className="mb-2 text-gray-dark font-allerbold mt-7">Citas:</p>
            <div
                className={`flex justify-end mb-2 ${
                    typesAppointment?.inPerson && !typesAppointment?.virtual
                        ? 'w-141'
                        : !typesAppointment?.inPerson && typesAppointment?.virtual
                        ? 'w-86.9'
                        : 'w-176'
                } xs:w-full`}
            >
                <Icon
                    id={generateId({
                        module: ModuleApp.CALENDAR_PLANNING,
                        submodule: `company-appointments`,
                        action: ActionElementType.TRASH,
                        elementType: ElementType.ICO,
                    })}
                    name="trashBlue"
                    hoverIcon="trashGreen"
                    classIcon="w-5.5 h-5.5"
                    onClick={(): void => {
                        lengthGreaterThanZero(companyAppointment.filter((device: IGenericRecord) => device.check === true)) &&
                            !disabledInputs &&
                            setModalDeleteAppointment(true);
                    }}
                />
            </div>
            <Table
                id={generateId({
                    module: ModuleApp.CALENDAR_PLANNING,
                    submodule: `company-appointments`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                editable={!disabledInputs}
                disabled={disabledInputs}
                headersTable={headersTableAppointment(typesAppointment)}
                data={[...validatedAppointments].reverse()}
                isFooterRowsCustom
                fieldsBody={fieldsBodyAppointment(
                    typesAppointment,
                    buildOptions(companyLocations),
                    handleChangeTableAppointment,
                    handleChangeSelectAppointment
                )}
                setSelected={setSelectedCheckboxAppointment}
                className="w-max"
                validate={validate}
                textAddLink="+ Agregar tipo de cita"
                onClickAddLink={!typesAppointment?.inPerson && !typesAppointment?.virtual ? undefined : addCompanyAppointment}
                sendFormWithEnter
            />
            {validateErrorsInAppointments && (
                <div>
                    <TableError
                        className="ml-7.3"
                        customText={` ${
                            validatedAppointments.filter((appointment: IGenericRecord) => appointment?.fieldsWithError?.length)
                                .length === ONE
                                ? VALIDATE_SINGULAR_ERROR
                                : VALIDATE_PLURAL_ERROR
                        }`}
                    />
                </div>
            )}
            <p className="font-allerbold text-gray-dark mt-7 mb-4.5">Días y horas disponibles para citas:</p>
            <Checkbox
                id={generateId({
                    module: ModuleApp.CALENDAR_PLANNING,
                    submodule: `different-schedules`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.CHK,
                })}
                disabled={disabledInputs}
                classLabel="text-gray-dark"
                label="Las sedes manejan diferentes jornadas (mañana o tarde)"
                checked={validateDifferentSchedules}
                classContainer="mb-4.5"
                classBox="ml-7"
                onChange={(): void => setValidateDifferentSchedules(!validateDifferentSchedules)}
            />
            {companyLocations
                ?.filter(
                    (location: IGenericRecord) =>
                        location?.name?.trim() && location?.address?.trim() && location?.colorCode?.trim()
                )
                .map((location: IGenericRecord) => (
                    <div className={`flex mt-4.5 ${validateDifferentSchedules ? 'w-168.75' : 'w-88'}`} key={location.id}>
                        <Table
                            id={generateId({
                                module: ModuleApp.CALENDAR_PLANNING,
                                submodule: `company-location-${location.id}`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TBL,
                            })}
                            editable={!disabledInputs}
                            disabled={disabledInputs}
                            customTable
                            data={journeys}
                            headersTable={headersTableJourneys(location?.name, validateDifferentSchedules)}
                            sendFormWithEnter
                        >
                            {journeys.map(({ day }, index) => {
                                const optionSelect = journeyState?.find(
                                    (item: IGenericRecord) =>
                                        item?.location_id === location?.id &&
                                        item?.day_of_week === day &&
                                        item?.time_slot_type === timeSlotType.MORNING
                                );
                                const optionSelect2 = journeyState?.find(
                                    (item: IGenericRecord) =>
                                        item?.location_id === location?.id &&
                                        item?.day_of_week === day &&
                                        item?.time_slot_type === timeSlotType.AFTERNOON
                                );

                                return (
                                    <tr
                                        id={generateId({
                                            module: ModuleApp.CALENDAR_PLANNING,
                                            submodule: `company-location-${location.id}-reference-${index}`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.ROW,
                                        })}
                                        key={`reference${index}`}
                                        className="h-8.2 lg:h-10"
                                    >
                                        <td className="field-body--uneditable table-text">{day}</td>
                                        <td
                                            className={`field-body--${
                                                disabledInputs ? 'uneditable' : 'editable'
                                            } build-product__select-field`}
                                        >
                                            <SelectInput
                                                id={generateId({
                                                    module: ModuleApp.CALENDAR_PLANNING,
                                                    submodule: `company-location-${location.id}-reference-${index}-journeys`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementType.DRP,
                                                })}
                                                value={
                                                    optionSelect
                                                        ? `${convertTimeFormat12(
                                                              optionSelect?.start_time
                                                          )} - ${convertTimeFormat12(optionSelect?.end_time)}`
                                                        : NOT_AVAILABLE
                                                }
                                                classesWrapper="w-full"
                                                options={buildOptionsDifferentSchedules(
                                                    workHours,
                                                    optionSelect?.id,
                                                    true,
                                                    validateDifferentSchedules
                                                )}
                                                newSelectFields={{
                                                    nameFooter: 'Agregar hora',
                                                    isEdit: true,
                                                    editClick,
                                                    trashClick,
                                                    footerClick,
                                                }}
                                                optionSelected={(option): void =>
                                                    handleChangeSelectJourney(option, day, timeSlotType.MORNING, location?.id)
                                                }
                                                isNewSelect
                                                isTable
                                                disabled={disabledInputs}
                                                withFocus={false}
                                            />
                                        </td>
                                        {validateDifferentSchedules && (
                                            <td
                                                className={`field-body--${
                                                    disabledInputs ? 'uneditable' : 'editable'
                                                } build-product__select-field`}
                                            >
                                                <SelectInput
                                                    id={generateId({
                                                        module: ModuleApp.CALENDAR_PLANNING,
                                                        submodule: `company-location-${location.id}-reference-${index}-journeys-start-date`,
                                                        action: ActionElementType.INPUT,
                                                        elementType: ElementType.DRP,
                                                    })}
                                                    value={
                                                        optionSelect2?.start_time
                                                            ? `${convertTimeFormat12(optionSelect2?.start_time)}
                                                                   - 
                                                                  ${convertTimeFormat12(optionSelect2?.end_time)}`
                                                            : NOT_AVAILABLE
                                                    }
                                                    classesWrapper="w-full"
                                                    options={buildOptionsDifferentSchedules(
                                                        workHours,
                                                        optionSelect2?.id,
                                                        false,
                                                        validateDifferentSchedules
                                                    )}
                                                    newSelectFields={{
                                                        nameFooter: 'Agregar hora',
                                                        isEdit: true,
                                                        editClick,
                                                        trashClick,
                                                        footerClick,
                                                    }}
                                                    optionSelected={(option): void =>
                                                        handleChangeSelectJourney(
                                                            option,
                                                            day,
                                                            timeSlotType.AFTERNOON,
                                                            location?.id
                                                        )
                                                    }
                                                    isNewSelect
                                                    isTable
                                                    disabled={disabledInputs}
                                                    withFocus={false}
                                                />
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </Table>
                    </div>
                ))}
        </>
    );
};
