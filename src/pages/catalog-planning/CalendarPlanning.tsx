import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { BreadCrumb } from '@components/bread-crumb';
import { Button } from '@components/button';
import { Checkbox } from '@components/checkbox';
import { Information } from '@components/information';
import { ModalType } from '@components/modal-custom';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitle } from '@components/page-title';
import { Routes } from '@constants/Paths';
import { LANGUAGE_KEY } from '@constants/Translate';
import { CALENDAR_PLANNING } from '@information-texts/CalendarPlanning';
import { MODAL_INFORMATION } from '@information-texts/Modal';
import { lengthGreaterThanZero } from '@utils/Length';
import { getRoute, getRouteName } from '@utils/Paths';
import { getRouteKey } from '@utils/Translation';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { buttonsFooterProps } from '@utils/Button';
import usePermissions from '@hooks/usePermissions';
import { useCalendarData } from '@hooks/useCalendarData';
import { routes, validateAppointment, validateLocations } from '.';
import { ContentTable } from './components';
import { PreviewModal } from './components/preview-modal/PreviewModal';

const CalendarPlanning: React.FC = () => {
    const history = useHistory();

    const { disabledInputs } = usePermissions();
    const {
        companyLocations,
        setCompanyLocations,
        companyAppointment,
        setCompanyAppointment,
        journeyState,
        setJourneyState,
        deleteJourneyState,
        setDeleteJourneyState,
        loading,
        submitLocations: submitLocationsAPI,
        submitAppointment: submitAppointmentAPI,
        submitJourney,
        deleteJourney,
    } = useCalendarData();

    const [modalSave, setModalSave] = useState(false);
    const [translate] = useTranslation(LANGUAGE_KEY);
    const [validate, setValidate] = useState<boolean>(false);
    const [submitLocations, setSubmitLocations] = useState<boolean>(false);
    const [submitAppointment, setSubmitAppointment] = useState<boolean>(false);
    const [modalPreview, setModalPreview] = useState<boolean>(false);
    const [typesAppointment, setTypesAppointment] = useState({
        virtual: false,
        inPerson: true,
    });

    const onSubmitLocations = useCallback(async (): Promise<void> => {
        const formData = companyLocations.filter(location => location.send);
        setSubmitLocations(true);

        if (
            validateLocations(companyLocations, true).some(location => lengthGreaterThanZero(location.fieldsWithError)) ||
            formData.some(location => !location.name)
        ) {
            setCompanyLocations(validateLocations(companyLocations, true));
            return;
        }

        const success = await submitLocationsAPI(companyLocations);
        if (success) {
            setModalSave(true);
        }
    }, [companyLocations, submitLocationsAPI, validateLocations, setCompanyLocations]);

    const onSubmitAppointment = useCallback(async (): Promise<void> => {
        const success = await submitAppointmentAPI(companyAppointment);
        if (success) {
            setModalSave(true);
        }
    }, [companyAppointment, submitAppointmentAPI]);

    const onSubmitJourney = useCallback(async (): Promise<void> => {
        const success = await submitJourney(journeyState);
        if (success) {
            setModalSave(true);
        }
    }, [journeyState, submitJourney]);

    const onDeleteJourney = useCallback(async (): Promise<void> => {
        const success = await deleteJourney(deleteJourneyState);
        if (success) {
            setModalSave(true);
        }
    }, [deleteJourneyState, deleteJourney]);

    const onSubmitAll = useCallback(async (): Promise<void> => {
        const formData = companyLocations.filter(location => location.send);
        setValidate(true);
        setSubmitLocations(true);

        if (
            validateLocations(companyLocations, true).some(location => lengthGreaterThanZero(location.fieldsWithError)) ||
            formData.some(location => !location.name)
        ) {
            setCompanyLocations(validateLocations(companyLocations, true));
            return;
        }

        setSubmitAppointment(true);
        if (
            validateAppointment(companyAppointment, true, typesAppointment.virtual, typesAppointment.inPerson).some(location =>
                lengthGreaterThanZero(location.fieldsWithError)
            )
        ) {
            return;
        }

        setValidate(false);
        await Promise.all([onSubmitLocations(), onSubmitAppointment(), onSubmitJourney(), onDeleteJourney()]);
    }, [
        companyLocations,
        companyAppointment,
        typesAppointment,
        validateLocations,
        validateAppointment,
        setCompanyLocations,
        onSubmitLocations,
        onSubmitAppointment,
        onSubmitJourney,
        onDeleteJourney,
    ]);
    return (
        <div className="calendar xs:px-2">
            <ModalType
                id={generateId({
                    module: ModuleApp.CALENDAR_PLANNING,
                    action: ActionElementType.SAVE,
                    elementType: ElementType.MDL,
                })}
                show={modalSave}
                showModal={(): void => {
                    setModalSave(!modalSave);
                }}
                type="save"
                title={MODAL_INFORMATION.SAVE_TITLE}
                text={MODAL_INFORMATION.SAVE_DESCRIPTION}
                classModalType="reload-modal-custom-save-fe"
            />
            <PreviewModal showModal={modalPreview} toggleModal={setModalPreview} />
            <PageTitle title={getRouteName(Routes.PLANNING_AND_ORGANIZATION_MENU)} />
            <BreadCrumb routes={routes()} />
            <Information
                title={translate(getRouteKey(Routes.CALENDAR_PLANNING))}
                description="Desde esta pantalla configure los parámetros para que sus clientes y usted puedan agendar una cita. Para ello, agregue la información solicitada."
            />
            <p className="font-allerbold text-gray-dark mt-4.5">Seleccione los tipos de citas que atiende:</p>
            <div className="flex mt-4.5 xs:flex-col xs:gap-2">
                <Checkbox
                    id={generateId({
                        module: ModuleApp.CALENDAR_PLANNING,
                        submodule: `type-appointment-in-person`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.CHK,
                    })}
                    classLabel="text-blue bg-gray-light py-2 px-4.5 rounded-md h-8.5 text-center items-center justify-center xs:flex-1"
                    label="Presencial"
                    checked={typesAppointment.inPerson}
                    classContainer="mb-4.5 xs:w-full xs:mx-0 xs:flex-1 w-26.4 mx-5"
                    classBox="ml-7"
                    onChange={(): void =>
                        setTypesAppointment({
                            ...typesAppointment,
                            inPerson: !typesAppointment.inPerson,
                        })
                    }
                    disabled={disabledInputs}
                />
                <Checkbox
                    id={generateId({
                        module: ModuleApp.CALENDAR_PLANNING,
                        submodule: `type-appointment-virtual`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.CHK,
                    })}
                    classLabel="text-blue bg-gray-light py-2 px-4.5 rounded-md h-8.5 text-center items-center justify-center xs:flex-1"
                    label="Virtual"
                    checked={typesAppointment.virtual}
                    classContainer="mb-4.5 xs:w-full xs:mx-0 w-26.4 mx-5"
                    classBox="ml-7"
                    onChange={(): void =>
                        setTypesAppointment({
                            ...typesAppointment,
                            virtual: !typesAppointment.virtual,
                        })
                    }
                    disabled={disabledInputs}
                />
            </div>
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <span className="text-gray-600">Cargando datos del calendario...</span>
                </div>
            ) : (
                <ContentTable
                    typesAppointment={typesAppointment}
                    companyLocations={companyLocations}
                    setCompanyLocations={setCompanyLocations}
                    companyAppointment={companyAppointment}
                    setCompanyAppointment={setCompanyAppointment}
                    journeyState={journeyState}
                    setJourneyState={setJourneyState}
                    deleteJourneyState={deleteJourneyState}
                    setDeleteJourneyState={setDeleteJourneyState}
                    validateLocations={validateLocations}
                    submitLocations={submitLocations}
                    submitAppointment={submitAppointment}
                    setModalSave={setModalSave}
                    validate={validate}
                />
            )}
            <div className="mt-4.5">
                {CALENDAR_PLANNING.DESCRIPTION_PREVIEW}
                {CALENDAR_PLANNING.DESCRIPTION_FORM}
            </div>
            <div className="flex justify-end mt-5">
                <Button
                    id={generateId({
                        module: ModuleApp.CALENDAR_PLANNING,
                        action: ActionElementType.PREVIEW,
                        elementType: ElementType.BTN,
                    })}
                    text="Previsualizar"
                    disabled={loading}
                    onClick={(): void => {
                        setModalPreview(!modalPreview);
                    }}
                />
            </div>
            <PageButtonsFooter
                threeButtons
                disabledCenter={disabledInputs || loading}
                titleButtonCenter="Guardar"
                className="w-full"
                onClickButtonCenter={(): Promise<void> => onSubmitAll()}
                {...buttonsFooterProps(ModuleApp.CALENDAR_PLANNING, history, getRoute(Routes.HOME), {
                    name: getRouteName(Routes.HOME),
                    moduleName: getRouteName(Routes.PLANNING_AND_ORGANIZATION_MENU),
                })}
            />
        </div>
    );
};

export default CalendarPlanning;
