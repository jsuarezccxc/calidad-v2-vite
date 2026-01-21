import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@components/button';
import { Checkbox } from '@components/checkbox';
import { Form } from '@components/form';
import { SelectInput, TextInput } from '@components/input';
import { SharedModal } from '@components/modal';
import { ChangeEvent } from '@components/radiobutton';
import { createAppointment } from '@redux/calendar/actions';
import { RootState } from '@redux/rootReducer';
import { buildOptionsPrefixesLanding } from '@utils/Company';
import { returnOnlyText } from '@utils/Text';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { validateEmail } from '@utils/Validation';
import { IContactFormProps, IOption, MAX_LENGTH_CONTACT_FORM, MAX_LENGTH_CONTACT_NUMBER, NAME } from '.';

export const ContactForm: React.FC<IContactFormProps> = ({ data, toggleScheduling, updateData, toggleCalendar }) => {
    const dispatch = useDispatch();

    const { prefix = [] } = useSelector((state: RootState) => state.notifications);

    const [isInvalidEmail, setIsInvalidEmail] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [startValidation, setStartValidation] = useState<boolean>(false);
    const [validate, setValidate] = useState<boolean>(false);

    const hasEmptyFields = (): boolean => Object.values(data).some(item => !item);

    const emptyFields = useMemo(() => hasEmptyFields(), [data]);

    const { company_name, data_processing, email, name, phone, phone_prefix } = data;

    useEffect(() => {
        setIsInvalidEmail(email ? !validateEmail(email) : false);
    }, [email]);

    useEffect(() => {
        if (startValidation) setValidate(emptyFields);
    }, [startValidation, emptyFields]);

    const handlingDataChange = ({ target: { name, value } }: ChangeEvent): void => {
        updateData({ ...data, [name]: name === NAME ? returnOnlyText(value) : value });
    };

    const confirmAppointment = async (): Promise<void> => {
        if (preventScheduling()) {
            return;
        }
        const success = Boolean(await dispatch(createAppointment(data)));
        if (success) setOpenModal(true);
        setValidate(false);
    };

    const preventScheduling = (): boolean => {
        if (emptyFields) {
            setStartValidation(true);
            setValidate(true);
            return true;
        }
        return isInvalidEmail;
    };

    return (
        <div className="contact-form">
            <p className="contact-form__description">Agregue la siguiente información</p>
            <Form sendWithEnter>
                <TextInput
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: `schedule-calendar-name-contact`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    name="name"
                    value={name}
                    placeholder="Nombre y apellido"
                    onChange={handlingDataChange}
                    classesWrapper="contact-form__input--text"
                    classesWrapperInput="border-green input4K"
                    required={validate && !name}
                    classRequired="required4K"
                    maxLength={MAX_LENGTH_CONTACT_FORM}
                />
                <TextInput
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: `schedule-calendar-email-contact`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    name="email"
                    value={email}
                    placeholder="Correo electrónico"
                    onChange={handlingDataChange}
                    classesWrapper="contact-form__input--text my-2"
                    classesWrapperInput="border-green input4K"
                    required={(validate && !email) || isInvalidEmail}
                    {...(isInvalidEmail && { requiredText: '*Correo electrónico invalido' })}
                    classRequired="required4K"
                    limitCharacters={false}
                />
                <div className="flex gap-2 mb-2">
                    <SelectInput
                        id={generateId({
                            module: ModuleApp.LANDING,
                            submodule: `schedule-calendar-phone-prefix-contact`,
                            action: ActionElementType.SELECT,
                            elementType: ElementType.TXT,
                        })}
                        name="phone_prefix"
                        value={phone_prefix}
                        options={buildOptionsPrefixesLanding(prefix)}
                        selectIconType="arrowDownGreen"
                        classesWrapperInput="contact-form__prefix border-green"
                        classScrollSelect="scroll-form-contact"
                        classesInput="text-gray-soft max-h-80"
                        optionSelected={(e: IOption): void => updateData({ ...data, phone_prefix: e.value })}
                        selectTextClass="contact-form__prefix-text"
                        required={validate && !phone_prefix}
                        classRequired="required4K"
                    />
                    <TextInput
                        id={generateId({
                            module: ModuleApp.LANDING,
                            submodule: `schedule-calendar-phone-contact`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name="phone"
                        value={phone}
                        placeholder="Teléfono de contacto"
                        onChange={handlingDataChange}
                        maxLength={MAX_LENGTH_CONTACT_NUMBER}
                        classesWrapper="contact-form__input--number"
                        classesWrapperInput="border-green input4K"
                        onlyNumbers
                        integerNumbers
                        type="text"
                        required={validate && !phone}
                        classRequired="required4K"
                    />
                </div>
                <TextInput
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: `schedule-calendar-company-name-contact`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    alphanumeric
                    name="company_name"
                    value={company_name}
                    placeholder="Nombre de la empresa"
                    onChange={handlingDataChange}
                    classesWrapper="contact-form__input--text"
                    classesWrapperInput="border-green input4K"
                    required={validate && !company_name}
                    maxLength={MAX_LENGTH_CONTACT_FORM}
                    classRequired="required4K"
                />
                <Checkbox
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: `schedule-calendar-data-processing-contact`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.CHK,
                    })}
                    label="Si doy autorización expresa para el tratamiento de los datos aquí consignados"
                    checked={data_processing}
                    onChange={(): void => updateData({ ...data, data_processing: !data_processing })}
                    classLabel="text-left font-aller text-gray-dark"
                    classContainer="my-2 checkbox-contact-form"
                    classCheck={`checkmark4K ${validate && !data_processing ? 'border-purple' : 'border-gray-blocking'}`}
                />
                {validate && <label className="contact-form__error">*Campo obligatorio</label>}
                <div className="contact-form__container-buttons">
                    <Button
                        id={generateId({
                            module: ModuleApp.LANDING,
                            submodule: `schedule-calendar-contact-form-back-to-hours`,
                            action: ActionElementType.BACK,
                            elementType: ElementType.BTN,
                        })}
                        text="Atrás"
                        classes="contact-form__button-back"
                        onClick={toggleCalendar}
                    />
                    <Button
                        id={generateId({
                            module: ModuleApp.LANDING,
                            submodule: `schedule-calendar-contact-form-confirm`,
                            action: ActionElementType.SUBMIT,
                            elementType: ElementType.BTN,
                        })}
                        text="Confirmar Demostración"
                        classes="contact-form__button"
                        onClick={confirmAppointment}
                    />
                </div>
            </Form>
            {openModal && (
                <SharedModal
                    moduleId="schedule-calendar-modal-confirmation"
                    open
                    finalAction={(): void => toggleScheduling(false)}
                    text={{ title: 'Demostración agendada', description: 'Los detalles han sido enviados a su correo' }}
                />
            )}
        </div>
    );
};
