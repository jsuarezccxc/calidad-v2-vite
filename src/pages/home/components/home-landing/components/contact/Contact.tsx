import React, { useEffect } from 'react';
import Slider, { Settings } from 'react-slick';
import { useDispatch, useSelector } from 'react-redux';
import { getPrefixNumber } from '@redux/notifications/actions';
import { RootState } from '@redux/rootReducer';
import { Button } from '@components/button';
import { Information } from '@components/information';
import { Icon } from '@components/icon';
import { ModalCustom } from '@components/modal-custom';
import { SelectInput, TextArea, TextInput } from '@components/input';
import { Form } from '@components/form';
import { Checkbox } from '@components/checkbox';
import { EMAIL_CONTACT_LANDING, PHONE_CONTACT_LANDING } from '@constants/Memberships';
import { buildOptionsPrefixesLanding } from '@utils/Company';
import { validateEmail } from '@utils/Validation';
import phoneIcon from '@assets/images/landing/phone-icon.svg';
import emailIcon from '@assets/images/landing/email-icon.svg';
import { useContactForm } from './hooks/useContactForm';
import {
    ERROR_MESSAGES,
    FormDataIndexes,
    IMAGES_REVIEWS,
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

    const settings: Settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dotsClass: 'dots-class',
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
    };

    return (
        <div className="contact-form">
            <div className="flex flex-col items-center contact__content xs:items-start">
                <Information title="Contáctenos" classNameTitle="text-2xl text-blue font-poppinsbold" />
                <p className="mt-4 mb-4 font-medium font-poppins lg:text-2lg text-blue ">
                    Agregue sus datos y nuestro equipo se contactará pronto
                </p>
            </div>
            <div className="flex mt-6 xs:flex-col xs:mt-4 gap-x-10 contact__content">
                <div className="flex flex-col p-5 rounded-lg form__grid font-aller lg:gap-y-2 xs:gap-y-5 xs:mt-6">
                    <Form>
                        <div className="flex gap-x-7 xs:flex-col xs:gap-y-5">
                            <TextInput
                                classesWrapperInput="text-input"
                                classesWrapper="contact__input--default xs:full"
                                placeholder="Nombre y apellido"
                                isTransparent
                                lettersWithAccent
                                name={formData[NAME_SURNAME].name}
                                value={formData[NAME_SURNAME].value}
                                required={formData[FormDataIndexes.NAME_SURNAME].required}
                                maxLength={MAX_LENGTH_CONTACT_FORM}
                                onChange={(e): void => handleChange(e, NAME_SURNAME)}
                                onPaste={handlePasteLetters}
                            />
                            <TextInput
                                classesWrapperInput="text-input"
                                classesWrapper="contact__input--default xs:full"
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
                    <div className="flex flex-wrap gap-x-7 xs:flex-col gap-y-5">
                        <Form>
                            <div className="flex mt-2.25 gap-1.9 xs:w-full w-72">
                                <SelectInput
                                    name={formData[PREFIX].name}
                                    value={formData[PREFIX].value}
                                    isTransparent
                                    selectIconType="arrowDownGreen"
                                    classesWrapperInput="contact__input--prefix text-input border-purple-contact-form"
                                    classScrollSelect="scroll-form-contact"
                                    classesInput="mt-2 text-gray-soft max-h-80"
                                    options={buildOptionsPrefixesLanding(prefixNumber)}
                                    optionSelected={(option): void => handleSelectChange(option, PREFIX)}
                                />
                                <TextInput
                                    classesWrapperInput="text-input"
                                    classesWrapper="contact__input--phone xs:full"
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
                                classesWrapperInput="text-input"
                                classesWrapper="contact__input--default xs:full"
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
                    <SelectInput
                        placeholder="Asunto"
                        classesWrapperInput="text-input contact__input--affair"
                        isTransparent
                        options={optionSelectForm}
                        selectIconType="arrowDownGreen"
                        classScrollSelect="max-h-80 scroll-form-contact"
                        classesInput="text-gray-soft px-6 mt-2"
                        optionSelected={(option): void => handleSelectChange(option, AFFAIR)}
                        required={formData[AFFAIR].required}
                        value={formData[AFFAIR].value}
                    />
                    <TextArea
                        classesWrapper="contact__input--affair"
                        placeholder="Escriba sus dudas o inquietudes…"
                        classesInput="h-44 text-input text-area-contact border-purple-contact-form"
                        name={formData[DESCRIPTION].name}
                        value={formData[DESCRIPTION].value}
                        required={formData[DESCRIPTION].required}
                        onChange={(e): void => handleChange(e, DESCRIPTION)}
                    />
                    <Checkbox
                        classLabel="contact-form__checkbox-label"
                        label="Si doy autorización expresa para el tratamiento de los datos aquí consignados"
                        checked={checkDataProcessing}
                        classContainer="contact-form__checkbox lg:11/11"
                        onChange={(): void => setCheckDataProcessing(!checkDataProcessing)}
                    />
                    {isSubmit && !checkDataProcessing && <p className="ml-auto mr-3 text-tiny text-purple">*Campo obligatorio</p>}
                    <div className="flex justify-center mt-7.3">
                        <Button
                            text="Enviar"
                            background="green"
                            classes="w-39 h-8.2 rounded-lg text-sm font-allerbold"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
                <ModalCustom show={showModal} showModal={(): void => {}} closeIcon={false}>
                    <div className="flex">
                        <Icon name="checkBlue" classIcon="h-5.5 w-auto" />
                        <p className="text-xl text-blue ml-2.2">Enviado</p>
                    </div>
                    <div className="mt-2 text-gray-dark">
                        <p>¡Su formulario ha sido enviado con éxito!</p>
                        <p className="mt-8 w-90">Un asesor se estará comunicando con usted en las próximas 48 horas hábiles.</p>
                    </div>

                    <div className="flex justify-center mt-5">
                        <Button text="Aceptar" onClick={handleCloseModal} />
                    </div>
                </ModalCustom>
                <div className="review-slider">
                    <Slider {...settings}>
                        {IMAGES_REVIEWS.map(image => (
                            <div className="xs:w-full" key={image}>
                                <img src={image} />
                            </div>
                        ))}
                    </Slider>

                    <div className="contact-info">
                        <div className="contact-info__section">
                            <img src={phoneIcon} />
                            <p>{PHONE_CONTACT_LANDING}</p>
                        </div>
                        <div className="contact-info__section">
                            <img src={emailIcon} />
                            <p>{EMAIL_CONTACT_LANDING}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
