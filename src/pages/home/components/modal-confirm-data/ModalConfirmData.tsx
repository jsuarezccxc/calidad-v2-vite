import React, { useEffect, useState } from 'react';
import { Icon } from '@components/icon';
import { Button } from '@components/button';
import { ModalCustom } from '@components/modal-custom';
import { NumberInput, TextInput } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { CONFIRM_DATA_FORM, SUCCESS_REGISTRATION } from '@information-texts/CompanyRegistration';
import { validateEmail } from '@utils/Validation';
import { lengthGreaterThanZero } from '@utils/Length';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { IModalConfirmData, IModalSuccessRegistration, TEXTS, VALIDATE_NUMBER_ZERO } from '.';
import './ModalConfirmData.scss';

export const ModalConfirmData: React.FC<IModalConfirmData> = ({ show, showModal, handleMainAction }) => {
    const [summited, setSummited] = useState<boolean>(false);
    const [dataForm, setDataForm] = useState<IGenericRecord>({
        name: '',
        email: '',
        phoneNumber: '',
    });
    const [errorsForm, setErrorsForm] = useState<IGenericRecord>({});
    const { NAME, EMAIL, PHONE_NUMBER } = TEXTS;

    useEffect(() => {
        summited && handleValidateFields(dataForm);
    }, [dataForm, summited]);

    const handleChangeValue = (value: string, name: string): void => {
        setDataForm({
            ...dataForm,
            [name]: value,
        });
    };

    const handleValidateFields = (data: IGenericRecord): boolean => {
        const errors: IGenericRecord = {};
        Object.keys(data).forEach(field => {
            if (!data[field] && field !== PHONE_NUMBER.field) errors[field] = NAME.required;
            if (field === EMAIL.field && !validateEmail(data[field])) errors[field] = EMAIL.required;
            if (field === PHONE_NUMBER.field && data[field] && data[field].startsWith(VALIDATE_NUMBER_ZERO))
                errors[field] = PHONE_NUMBER.required;
        });
        setErrorsForm(errors);
        return lengthGreaterThanZero(Object.keys(errors));
    };

    const handleSubmit = (data: IGenericRecord): void => {
        setSummited(true);
        if (handleValidateFields(data)) return;
        handleMainAction(data);
        setDataForm({ name: '', email: '', phoneNumber: '' });
        showModal();
    };

    return (
        <ModalCustom
            id={generateId({
                module: ModuleApp.HOME,
                submodule: `${ModuleApp.MODALS}-confirma-data`,
                action: ActionElementType.INFO,
                elementType: ElementType.MDL,
            })}
            show={show}
            showModal={showModal}
            closeIcon={false}
            classAdditional="zi-modals-landing"
            classesModal="modal-confirm-data"
            classesWrapper="modal-confirm-data"
            isTableModal
        >
            <div className="confirm-data">
                <div className="confirm-data__header">
                    <label className="title--modal">{CONFIRM_DATA_FORM.TITLE}</label>
                </div>
                <div className="confirm-data__body">
                    <div>
                        <TextInput
                            id={generateId({
                                module: ModuleApp.HOME,
                                submodule: `${ModuleApp.MODALS}-confirma-data-name`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="*Nombre:"
                            placeholder="..."
                            value={dataForm.name}
                            onChange={(e): void => handleChangeValue(e.target.value, NAME.field)}
                            required={errorsForm?.name}
                            requiredText={errorsForm?.name}
                            lettersWithAccent
                        />
                    </div>
                    <div>
                        <TextInput
                            id={generateId({
                                module: ModuleApp.HOME,
                                submodule: `${ModuleApp.MODALS}-confirma-data-email`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="*Correo:"
                            placeholder="..."
                            value={dataForm.email}
                            onChange={(e): void => handleChangeValue(e.target.value, EMAIL.field)}
                            required={errorsForm?.email}
                            requiredText={errorsForm?.email}
                        />
                    </div>
                    <div>
                        <NumberInput
                            id={generateId({
                                module: ModuleApp.HOME,
                                submodule: `${ModuleApp.MODALS}-confirma-data-phone`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            labelText="Celular (opcional):"
                            placeholder="..."
                            maxLength={10}
                            value={dataForm.phoneNumber}
                            onChange={(e): void => handleChangeValue(e.target.value, PHONE_NUMBER.field)}
                            required={errorsForm?.phoneNumber}
                            requiredText={errorsForm?.phoneNumber}
                        />
                    </div>
                </div>
                <div className="confirm-data__footer">
                    <Button
                        id={generateId({
                            module: ModuleApp.HOME,
                            submodule: `${ModuleApp.MODALS}-confirma-data`,
                            action: ActionElementType.SUBMIT,
                            elementType: ElementType.BTN,
                        })}
                        text={CONFIRM_DATA_FORM.BUTTON}
                        onClick={(): void => handleSubmit(dataForm)}
                    />
                </div>
            </div>
        </ModalCustom>
    );
};

export const ModalSuccessRegistration: React.FC<IModalSuccessRegistration> = ({ show, showModal }) => {
    return (
        <ModalCustom
            id={generateId({
                module: ModuleApp.HOME,
                submodule: `${ModuleApp.MODALS}-success-registration`,
                action: ActionElementType.INFO,
                elementType: ElementType.MDL,
            })}
            show={show}
            showModal={showModal}
            closeIcon={false}
            classAdditional="zi-modals-landing"
            classesModal="modal-success-registration"
            classesWrapper="modal-success-registration"
            isTableModal
        >
            <div className="success-registration">
                <div className="success-registration__header">
                    <Icon
                        id={generateId({
                            module: ModuleApp.HOME,
                            submodule: `${ModuleApp.MODALS}-success-registration`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.ICO,
                        })}
                        name="successMulticolor"
                        classIcon="icon--style"
                    />
                    <label className="title--style">{SUCCESS_REGISTRATION.TITLE}</label>
                </div>
                <div className="success-registration__body">
                    <label className="description--modal">{SUCCESS_REGISTRATION.DESCRIPTION}</label>
                    <Button
                        id={generateId({
                            module: ModuleApp.HOME,
                            submodule: `${ModuleApp.MODALS}-success-registration`,
                            action: ActionElementType.SUBMIT,
                            elementType: ElementType.BTN,
                        })}
                        text={SUCCESS_REGISTRATION.BUTTON}
                        onClick={showModal}
                    />
                </div>
            </div>
        </ModalCustom>
    );
};
