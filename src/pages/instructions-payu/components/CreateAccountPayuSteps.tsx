import React, { useState } from 'react';
import createAccountPayu from '@assets/images/create-account-payu.png';
import selectTypeOfCountPayu from '@assets/images/select-type-of-count-payu.svg';
import emailInstructionPayu from '@assets/images/email-instruction-payu.png';
import openEmailInstructionPayu from '@assets/images/open-email-instruction-payu.png';
import addInformationInstructionPayu from '@assets/images/add-information-instruction-payu.png';
import definePasswordInstructionsPayu from '@assets/images/define-password-instructions-payu.png';
import addPasswordInstructionsPayu from '@assets/images/add-password-instructions-payu.png';
import character from '@assets/images/character.png';
import { Icon } from '@components/icon';
import { Link, SimpleButton } from '@components/button';
import { Tooltip } from '@components/tooltip';
import usePopper from '@hooks/usePopper';
import { CREATE_ACCOUNT, ENABLE_ACCOUNT } from '..';
import { NUMBER_MAX_OF_STEPS_CREATE_ACCOUNT, NUMBER_MIN_OF_STEPS, NumberOfCurrentStep } from '.';

export const CreateAccountPayuSteps: React.FC = () => {
    const [numberOfStep, setNumberOfStep] = useState<number>(1);

    const { anchorEl, mouseProps } = usePopper();

    const handleClickSteps = (isIncrement: boolean): void => {
        if (isIncrement) {
            if (numberOfStep >= NUMBER_MAX_OF_STEPS_CREATE_ACCOUNT) return;
            setNumberOfStep(numberOfStep + 1);
        } else {
            if (numberOfStep <= NUMBER_MIN_OF_STEPS) return;
            setNumberOfStep(numberOfStep - 1);
        }
    };

    return (
        <div className="instructions-payu__steps">
            <p className="instructions-payu__steps-title"> Paso 1: Crear cuenta en PayU</p>
            <div className="instructions-payu__steps-container">
                {numberOfStep === NumberOfCurrentStep.One && (
                    <div className="w-full mb-17">
                        <div className="mb-10 instructions-payu__steps-container__description">
                            <p className="absolute flex items-center justify-center bg-white border rounded-full text-green -left-1 w-14 h-14 border-green">
                                1.1
                            </p>
                            <p className="text-white">
                                Ingrese a la página &nbsp;
                                <span className="underline cursor-pointer text-purple font-allerbold">
                                    <a
                                        className="cursor-pointer"
                                        target="_blank"
                                        rel="noreferrer"
                                        href="https://colombia.payu.com/"
                                    >
                                        PayU- Crear tu cuenta
                                    </a>
                                </span>
                                &nbsp; y continue con las instrucciones de la página.
                            </p>
                        </div>
                        <img src={createAccountPayu} alt="imagen guía para crear cuenta en payu" className="pr-2.5" />
                    </div>
                )}

                {numberOfStep === NumberOfCurrentStep.Two && (
                    <div className="mb-7">
                        <div className="pr-5 instructions-payu__steps-container__description mb-7">
                            <p className="absolute flex items-center justify-center bg-white border rounded-full text-green -left-1 w-14 h-14 border-green">
                                1.2
                            </p>
                            <p className="text-white">
                                Seleccione su tipo de cuenta, si es persona natural o jurídica y tenga en cuenta el monto de
                                facturación indicado
                            </p>
                        </div>
                        <div className="mx-auto">
                            <img
                                src={selectTypeOfCountPayu}
                                className="w-full h-full"
                                alt="imagen guía para seleccionar una cuenta en payu"
                            />
                        </div>
                    </div>
                )}

                {numberOfStep === NumberOfCurrentStep.Three && (
                    <div className="w-full mb-10">
                        <div className="instructions-payu__steps-container__description mb-7">
                            <p className="absolute flex items-center justify-center bg-white border rounded-full text-green -left-1 w-14 h-14 border-green">
                                1.3
                            </p>
                            <p className="text-white font-allerbold">
                                Ingrese un correo electrónico para crear su cuenta en PayU y haga click en “Enviar”. A su correo
                                electrónico deberá llegar un enlace para continuar con el proceso de registro
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <img src={emailInstructionPayu} alt="imagen guía para crear un correo en payu" />
                        </div>
                    </div>
                )}

                {numberOfStep === NumberOfCurrentStep.Four && (
                    <div className="w-full mb-7.3">
                        <div className="mb-6 instructions-payu__steps-container__description">
                            <p className="absolute flex items-center justify-center bg-white border rounded-full text-green -left-1 w-14 h-14 border-green">
                                1.4
                            </p>
                            <p className="text-white font-allerbold">
                                Abra su correo electrónico y revise su bandeja de entrada con el mensaje “Estás a punto de abrir
                                tu cuenta y empezar a vender”. Luego haga click en el botón “Validar mi correo electrónico”.
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <img src={openEmailInstructionPayu} alt="imagen guía para abrir un correo en payu" />
                        </div>
                    </div>
                )}

                {numberOfStep === NumberOfCurrentStep.Five && (
                    <div className="w-full mb-6">
                        <div className="mb-7 instructions-payu__steps-container__description">
                            <p className="absolute flex items-center justify-center bg-white border rounded-full text-green -left-1 w-14 h-14 border-green">
                                1.5
                            </p>
                            <p className="text-white">Agregue la información solicitada en el formulario</p>
                        </div>
                        <div className="flex justify-center">
                            <img
                                src={addInformationInstructionPayu}
                                alt="imagen guía para llenar la información del formulario en payu"
                            />
                        </div>
                    </div>
                )}

                {numberOfStep === NumberOfCurrentStep.Six && (
                    <div className="w-full mb-13">
                        <div className="instructions-payu__steps-container__description mb-7">
                            <p className="absolute flex items-center justify-center bg-white border rounded-full text-green -left-1 w-14 h-14 border-green">
                                1.6
                            </p>
                            <p className="text-white font-allerbold">
                                Ingrese al correo electrónico registrado y abra el mensaje “Active la cuenta en el Módulo PayU”.
                                Finalmente haga click en el botón “Activar cuenta”.
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <img src={definePasswordInstructionsPayu} alt="intrucciones para definir la contraseña" />
                        </div>
                    </div>
                )}

                {numberOfStep === NumberOfCurrentStep.Seven && (
                    <div className="w-full mb-7">
                        <div className="instructions-payu__steps-container__description mb-7">
                            <p className="absolute flex items-center justify-center bg-white border rounded-full text-green -left-1 w-14 h-14 border-green">
                                1.7
                            </p>
                            <p className="text-white font-allerbold">
                                Será redirigido a una página en la que debe establecer una contraseña para acceder a su cuenta
                                PayU.
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <img src={addPasswordInstructionsPayu} alt="intrucciones para añadir la contraseña" />
                        </div>
                    </div>
                )}

                {numberOfStep === NumberOfCurrentStep.Eight && (
                    <div className="flex flex-col items-center w-full mt-16 mb-17">
                        <div className="flex flex-col w-full pt-1 mb-10.5 md:flex-row">
                            <div className="md:mr-5 md:w-117 md:ml-14 mt-9">
                                <h3 className="instructions-payu__steps-subtitle">¡Felicidades!</h3>
                                <p className="mb-8 text-xl text-gray-dark">Ha completado el paso 1 con éxito.</p>
                                <p className="text-xl leading-6 text-gray-dark">
                                    Continúe el
                                    <span className="font-allerbold"> Paso 2: </span>
                                    Habilitar su cuenta para recibir pagos
                                </p>
                            </div>
                            <img src={character} alt="character" />
                        </div>
                        <SimpleButton
                            onClick={(): void => {
                                localStorage.setItem(CREATE_ACCOUNT, 'true');
                            }}
                            className="px-6 instructions-payu__steps-button-step"
                        >
                            <Link
                                classes="instructions-payu__steps-link"
                                text="Paso 2: Habilitación su cuenta para recibir pagos"
                                href={`/instructions-payu?page=${ENABLE_ACCOUNT}`}
                            />
                        </SimpleButton>
                    </div>
                )}
                <div className="flex mb-1.5">
                    <p className="flex items-center">
                        <span {...mouseProps}>
                            <Icon name="infoGreen" className="w-4 h-4 mr-1 cursor-pointer" />
                        </span>
                        <Tooltip
                            anchorEl={anchorEl}
                            iconName="infoBlue"
                            description="Herramienta que le permite avanzar y retroceder en las instrucciones."
                            placement="bottom-start"
                            wrapperClassName="rounded"
                            title="Paginador:"
                        />
                    </p>
                    <div className="w-25 h-5.5 border border-blue rounded flex">
                        <div
                            className="w-5.5 h-5.5 border-r border-blue m-auto flex justify-center items-center"
                            onClick={(): void => handleClickSteps(false)}
                        >
                            <Icon
                                name={`${numberOfStep === NUMBER_MIN_OF_STEPS ? 'arrowLeftGray' : 'arrowLeftGreen'}`}
                                className="cursor-pointer"
                            />
                        </div>
                        <div className="flex justify-center w-14">
                            <p className="text-tiny text-blue">
                                {numberOfStep} &nbsp; de &nbsp; {NUMBER_MAX_OF_STEPS_CREATE_ACCOUNT}
                            </p>
                        </div>
                        <div
                            className="w-5.5 h-5.5 border-l border-blue m-auto flex justify-center items-center"
                            onClick={(): void => handleClickSteps(true)}
                        >
                            <Icon
                                name={`${
                                    numberOfStep === NUMBER_MAX_OF_STEPS_CREATE_ACCOUNT ? 'arrowRightGray' : 'arrowRightGreen'
                                }`}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
