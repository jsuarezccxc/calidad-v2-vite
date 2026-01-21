import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PhoneIcon from '@assets/images/landing/phone-icon.svg';
import MailIcon from '@assets/images/landing/mail-icon.svg';
import { PHONE_CONTACT_LANDING, EMAIL_CONTACT_LANDING } from '@constants/Memberships';
import { Button } from '@components/button';
import { Information } from '@components/information';
import { Icon } from '@components/icon';
import { Form } from '@components/form';
import { ModalCustom } from '@components/modal-custom';
import { SelectSearchInput, TextArea, TextInput } from '@components/input';
import { Checkbox } from '@components/checkbox';
import { useContactForm } from './hooks/useContactForm';
import { validateEmail } from '@utils/Validation';
import { buildOptionsPrefixesLanding } from '@utils/Company';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { getPrefixNumber } from '@redux/notifications/actions';
import { RootState } from '@redux/rootReducer';
import {
    ERROR_MESSAGES,
    FormDataIndexes,
    MAX_LENGHT_NUMBER,
    MAX_LENGTH_CONTACT_FORM,
    VALIDATE_NUMBER_ZERO,
    optionSelectForm,
} from '.';
import './Contact.scss';

export const Contact: React.FC = () => {
    const {
        formData,
        handleChange,
        handlePasteLetters,
        handlePasteNumbers,
        handleSubmit,
        handleSelectChange,
        handleCloseModal,
        showModal,
        setCheckDataProcessing,
        checkDataProcessing,
        isSubmit,
    } = useContactForm();

    const dispatch = useDispatch();

    const { NAME_SURNAME, EMAIL, PREFIX, PHONE, COMPANY_NAME, AFFAIR, DESCRIPTION } = FormDataIndexes;
    const prefixNumber = useSelector((state: RootState) => state.notifications.prefix);

    const showRequiredMail = (): boolean => {
        return formData[EMAIL].required || (!!formData[EMAIL].value && !validateEmail(formData[EMAIL].value));
    };

    useEffect(() => {
        dispatch(getPrefixNumber());
    }, []);

    const prefixRenderOptions = buildOptionsPrefixesLanding(prefixNumber).map(item => ({ ...item, name: item.value }));
    const optionSelectFormRender = optionSelectForm.map(item => ({ ...item, name: item.value }));

    return (
        <div className="contact-form">
            <div className="flex flex-col items-center">
                <Information
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: 'contact-section-title',
                        action: ActionElementType.INFO,
                        elementType: ElementType.TXT,
                    })}
                    title="Contáctenos"
                    classNameTitle="text-2xl text-blue font-poppinsbold"
                />
                <p
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: 'contact-section-subtitle',
                        action: ActionElementType.INFO,
                        elementType: ElementType.TXT,
                    })}
                    className="mt-4 mb-3 font-medium font-poppins lg:text-2lg text-blue xs:text-center"
                >
                    Agregue sus datos y un experto se contactará pronto
                </p>
            </div>
            <div className="flex mt-6 xs:flex-col xs:mt-4 justify-evenly">
                <div className="flex flex-col p-5 border border-none rounded-lg font-aller xs:w-full lg:gap-y-4 xs:gap-y-5 xs:mt-6 min-w-224 container-form-landing">
                    <Form>
                        <div className="flex justify-between gap-x-5 xs:flex-col xs:gap-y-5">
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.LANDING,
                                    submodule: `contact-${formData[NAME_SURNAME].name}`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                classesWrapperInput="text-input"
                                classesWrapper="w-103.75 textInputLanding"
                                classesInput="placeholder-gray-dark"
                                placeholder="Nombre y apellido"
                                isTransparent
                                name={formData[NAME_SURNAME].name}
                                value={formData[NAME_SURNAME].value}
                                required={formData[FormDataIndexes.NAME_SURNAME].required}
                                maxLength={MAX_LENGTH_CONTACT_FORM}
                                onChange={(e): void => handleChange(e, NAME_SURNAME)}
                                onPaste={handlePasteLetters}
                            />
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.LANDING,
                                    submodule: `contact-${formData[EMAIL].name}`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                classesWrapperInput="text-input"
                                classesWrapper="w-103.75 textInputLanding"
                                classesInput="placeholder-gray-dark"
                                placeholder="Correo electrónico"
                                isTransparent
                                name={formData[EMAIL].name}
                                value={formData[EMAIL].value}
                                required={showRequiredMail()}
                                requiredText={
                                    formData[EMAIL].value && !validateEmail(formData[EMAIL].value)
                                        ? ERROR_MESSAGES.INVALID_EMAIL
                                        : ERROR_MESSAGES.REQUIRED
                                }
                                onChange={(e): void => handleChange(e, EMAIL)}
                                limitCharacters={false}
                            />
                        </div>
                    </Form>
                    <div className="flex justify-between gap-x-5 xs:flex-col gap-y-5">
                        <Form sendWithEnter>
                            <div className="flex mt-2.25 gap-1.9 textInputLanding w-103.75">
                                <SelectSearchInput
                                    id={generateId({
                                        module: ModuleApp.LANDING,
                                        submodule: `contact-${formData[PREFIX].name}`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    name={formData[PREFIX].name}
                                    valueSelect={formData[PREFIX].value}
                                    isTransparent
                                    selectIconType="arrowDownGreen"
                                    classesWrapperInput="text-input border-purple-contact-form w-25.2 xs:w-16"
                                    selectTextClass="text-lg"
                                    classIconSearch="lg:top-1 right-0.5 xs:-top-1"
                                    classesWrapper="text-gray-dark max-h-80 placeholder-gray-dark"
                                    optionSelect={prefixRenderOptions}
                                    onChangeSelect={(_, option): void => handleSelectChange(option, PREFIX)}
                                />
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.LANDING,
                                        submodule: `contact-${formData[PHONE].name}`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    classesWrapperInput="text-input"
                                    classesWrapper="w-85.5 textInputLanding"
                                    classesInput="placeholder-gray-dark"
                                    placeholder="Teléfono de contacto"
                                    name={formData[PHONE].name}
                                    value={formData[PHONE].value}
                                    onlyNumbers
                                    maxLength={MAX_LENGHT_NUMBER}
                                    required={formData[PHONE].required || formData[PHONE].value.startsWith(VALIDATE_NUMBER_ZERO)}
                                    requiredText={
                                        formData[PHONE].value.startsWith(VALIDATE_NUMBER_ZERO)
                                            ? ERROR_MESSAGES.INVALID_NUMBER_PHONE
                                            : ERROR_MESSAGES.REQUIRED
                                    }
                                    onChange={(e): void => handleChange(e, PHONE)}
                                    onPaste={handlePasteNumbers}
                                    isTransparent
                                />
                            </div>
                        </Form>
                        <Form>
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.LANDING,
                                    submodule: `contact-${formData[COMPANY_NAME].name}`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                classesWrapperInput="text-input"
                                classesWrapper="w-103.75 textInputLanding"
                                classesInput="placeholder-gray-dark"
                                placeholder="Nombre de la empresa"
                                maxLength={MAX_LENGTH_CONTACT_FORM}
                                isTransparent
                                name={formData[COMPANY_NAME].name}
                                value={formData[COMPANY_NAME].value}
                                required={formData[COMPANY_NAME].required}
                                onChange={(e): void => handleChange(e, COMPANY_NAME)}
                            />
                        </Form>
                    </div>
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.LANDING,
                            submodule: `contact-${formData[AFFAIR].name}`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        placeholder="Asunto"
                        classesWrapperInput="rounded-2xl bg-gray-light border-affair"
                        isTransparent
                        optionSelect={optionSelectFormRender}
                        selectTextClass="text-lg"
                        selectIconType="arrowDownGreen"
                        classesWrapper="text-gray-dark w-full placeholder-gray-dark"
                        classIconSearch="lg:top-1 right-0.5 xs:-top-1"
                        onChangeSelect={(_, option): void => handleSelectChange(option, AFFAIR)}
                        required={formData[AFFAIR].required}
                        valueSelect={formData[AFFAIR].value}
                    />
                    <TextArea
                        id={generateId({
                            module: ModuleApp.LANDING,
                            submodule: `contact-${formData[DESCRIPTION].name}`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        placeholder="Escriba sus dudas o inquietudes…"
                        classesInput="h-44 rounded-2xl bg-gray-light text-area-contact border-purple-contact-form placeholder-gray-dark"
                        name={formData[DESCRIPTION].name}
                        value={formData[DESCRIPTION].value}
                        required={formData[DESCRIPTION].required}
                        onChange={(e): void => handleChange(e, DESCRIPTION)}
                        maxLength={MAX_LENGTH_CONTACT_FORM}
                    />
                    <Checkbox
                        id={generateId({
                            module: ModuleApp.LANDING,
                            submodule: `contact-data-processing`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.CHK,
                        })}
                        classLabel="contact-form__checkbox-label"
                        label="Si doy autorización expresa para el tratamiento de los datos aquí consignados"
                        checked={checkDataProcessing}
                        classContainer="contact-form__checkbox lg:w-full"
                        onChange={(): void => setCheckDataProcessing(!checkDataProcessing)}
                    />
                    {isSubmit && !checkDataProcessing && <p className="ml-auto mr-3 text-tiny text-purple">*Campo obligatorio</p>}
                    <div className="flex justify-center mb-3 textInputLanding">
                        <Button
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: `contact-submit-form`,
                                action: ActionElementType.SEND,
                                elementType: ElementType.BTN,
                            })}
                            text="Enviar"
                            background="blue"
                            classes="w-39 textInputLanding h-8.2 rounded text-sm font-allerbold"
                            onClick={handleSubmit}
                        />
                    </div>
                    <div className="contact-data">
                        <div>
                            <img src={PhoneIcon} alt="icon phone" className="w-7 h-7" />
                            <span>{PHONE_CONTACT_LANDING}</span>
                        </div>
                        <div>
                            <img src={MailIcon} alt="icon phone" className="w-7 h-7" />
                            <span>{EMAIL_CONTACT_LANDING}</span>
                        </div>
                    </div>
                </div>
                <ModalCustom
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: `contact-submit-form`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.MDL,
                    })}
                    show={showModal}
                    showModal={(): void => {}}
                    closeIcon={false}
                >
                    <div className="flex">
                        <Icon
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: `contact-submit-form`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.ICO,
                            })}
                            name="checkBlue"
                            classIcon="h-5.5 w-auto"
                        />
                        <p className="text-xl text-blue ml-2.2">Enviado</p>
                    </div>
                    <div className="mt-2 text-base text-gray-dark">
                        <p>¡Su formulario ha sido enviado con éxito!</p>
                        <p className="mt-8 w-90">Un asesor se estará comunicando con usted en las próximas 48 horas hábiles.</p>
                    </div>

                    <div className="flex justify-center mt-5">
                        <Button
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: `contact-submit-form`,
                                action: ActionElementType.ACCEPT,
                                elementType: ElementType.BTN,
                            })}
                            text="Aceptar"
                            onClick={handleCloseModal}
                        />
                    </div>
                </ModalCustom>
            </div>
        </div>
    );
};
