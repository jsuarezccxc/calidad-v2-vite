import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { MODAL_TYPE } from '@information-texts/ContingencyActivation';
import useModal from '@hooks/useModal';
import { Form } from '@components/form';
import { ModalType } from '@components/modal';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { Information } from '@components/information';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { ChangeEvent, DatePickerDayInput, FileInput, IFile, TextArea } from '@components/input';
import { InputSelectTime } from '@components/form-invoice-purchase/components/input-select-time';
import { getRoute } from '@utils/Paths';
import { lengthEqualToZero } from '@utils/Length';
import { buttonsFooterProps } from '@utils/Button';
import { isCorrectResponse } from '@utils/Response';
import { getUnixFromDate, limitedDay } from '@utils/Date';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { Routes } from '@constants/Paths';
import { FIFTEEN } from '@constants/ElectronicInvoice';
import { ContingencyState, DEFAULT_DATA, FormKeys } from '@constants/ContingencyActivation';
import { IGenericRecord } from '@models/GenericRecord';
import { IContingencyActivation } from '@models/ContingencyActivation';
import { RootState } from '@redux/rootReducer';
import { getContingency, postContingencyActivation } from '@redux/contingency/actions';
import { ModalKeys, UTILS } from '.';
import './ContingencyActivation.scss';

const ContingencyActivation: React.FC = () => {
    const [history, { CURRENT_DATE, validate, DEFAULT_FILE }, dispatch] = [useHistory(), UTILS, useDispatch()];
    const { activeModal, toggleModal } = useModal({ ...UTILS.MODAL_STATE });
    const contingencyCurrent = useSelector(({ contingency }: RootState) => contingency.contingency);
    const [submit, setSubmit] = useState<boolean>(false);
    const [openTime, setOpenTime] = useState<boolean>(false);
    const [openTime2, setOpenTime2] = useState<boolean>(false);
    const [file, setFile] = useState<IFile>([...DEFAULT_FILE]);
    const [contingency, setContingency] = useState<IContingencyActivation>({ ...DEFAULT_DATA });

    const warningSave = (): void => {
        setSubmit(true);
        if (!validate(contingency)) {
            toggleModal(ModalKeys.ModalQuestion);
        }
    };

    const closeModal = (): void => toggleModal('');

    const handleDate = (date: Date, name: string): void => {
        setContingency({ ...contingency, [name]: date });
    };

    const handleTime = (time: string, name: string): void => {
        setContingency({ ...contingency, [name]: time });
    };

    const handleText = ({ target }: ChangeEvent): void => {
        setContingency({ ...contingency, [target.name]: target.value });
    };

    const assignFileInState = (): void => {
        const [
            {
                files: [report],
            },
        ] = file as IFile[];
        if (report) setContingency({ ...contingency, file: report });
    };

    const contingencySave = async (): Promise<void> => {
        if (contingencyCurrent?.status === ContingencyState.InProgress) return;
        const response: IGenericRecord = await dispatch(postContingencyActivation(UTILS.request(contingency)));
        if (isCorrectResponse(response.statusCode)) {
            toggleModal(ModalKeys.ModalSave);
            setContingency({ ...DEFAULT_DATA });
            setFile([...DEFAULT_FILE]);
            setSubmit(false);
        }
    };

    const handleModal = (): void => {
        if (activeModal === ModalKeys.ModalQuestion) {
            closeModal();
            contingencySave();
            return;
        }
        closeModal();
        history.push(getRoute(Routes.CONTINGENCY_HISTORY));
    };

    const validateFile = (file: IFile | undefined): boolean => {
        if (!file) return true;
        const [{ files }] = file as IFile[];
        return lengthEqualToZero(files);
    };

    useEffect(() => {
        dispatch(getContingency());
    }, []);

    useEffect(() => {
        assignFileInState();
    }, [file]);

    return (
        <>
            {activeModal && <ModalType {...MODAL_TYPE(closeModal)[activeModal]} open finalAction={handleModal} />}
            <PageTitle title={UTILS.PAGE_TITLE} />
            <BreadCrumb routes={UTILS.ROUTES} />
            <Information
                {...UTILS.SUB_INFORMATION}
                classNameContainer="mb-7"
                classNameSubContainer="mb-4.5"
                classNameTitle="contingency-activation__sub-title"
            />
            <Form className="contingency-activation">
                <fieldset className="contingency-activation__form-group">
                    <DatePickerDayInput
                        id={generateId({
                            module: ModuleApp.CONTINGENCY,
                            submodule: `activation-init-date`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        selected={getUnixFromDate(contingency.start_date)}
                        minDate={limitedDay(CURRENT_DATE, FIFTEEN)}
                        labelText="*Fecha inicio contingencia:"
                        onChangeDate={handleDate}
                        classesWrapper="w-46.5"
                        name="start_date"
                    />
                    <InputSelectTime
                        setTimeValue={({ time_issue }): void => handleTime(time_issue, FormKeys.StartTime)}
                        className="contingency-activation__form-group__input"
                        label="*Hora inicio contingencia:"
                        eventClass="timepicker-start"
                        setTimePicker={setOpenTime}
                        timeValue={contingency}
                        timePicker={openTime}
                    />
                </fieldset>
                <fieldset className="contingency-activation__form-group">
                    <DatePickerDayInput
                        id={generateId({
                            module: ModuleApp.CONTINGENCY,
                            submodule: `activation-end-date`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name="end_date"
                        minDate={CURRENT_DATE}
                        classesWrapper="w-46.5"
                        onChangeDate={handleDate}
                        labelText="*Fecha final contingencia:"
                        selected={getUnixFromDate(contingency.end_date)}
                    />
                    <InputSelectTime
                        setTimeValue={({ time_issue }): void => handleTime(time_issue, FormKeys.EndTime)}
                        className="contingency-activation__form-group__input"
                        label="*Hora final contingencia:"
                        setTimePicker={setOpenTime2}
                        eventClass="timepicker-end"
                        timeValue={contingency}
                        timePicker={openTime2}
                    />
                </fieldset>
                <TextArea
                    id={generateId({
                        module: ModuleApp.CONTINGENCY,
                        submodule: `activation-description`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    required={submit && !contingency.description}
                    labelText="*Descripción de la contingencia:"
                    placeholder="Máximo 500 caracteres"
                    value={contingency.description}
                    name={FormKeys.Description}
                    classesInput="text-area"
                    classesWrapper="w-max"
                    onChange={handleText}
                    maxLength={500}
                />
                <FileInput
                    id={generateId({
                        module: ModuleApp.CONTINGENCY,
                        submodule: `activation-file-report`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    labelText="*Carta reporte de contingencia:"
                    required={submit && validateFile(file)}
                    classesWrapper="file-input"
                    classNameFiles="file-input"
                    placeholder="Subir archivo"
                    fileExtensionAccept=".pdf"
                    setFile={setFile}
                    isTransparent
                    name="report"
                    file={file}
                />
            </Form>
            <PageButtonsFooter
                {...buttonsFooterProps(ModuleApp.CONTINGENCY, history, getRoute(Routes.CONTINGENCY_HISTORY), {
                    moduleName: '',
                    name: '',
                })}
                titleButtonCenter="Activar contingencia"
                onClickButtonCenter={warningSave}
                className="mt-10"
                threeButtons
            />
        </>
    );
};

export default ContingencyActivation;
