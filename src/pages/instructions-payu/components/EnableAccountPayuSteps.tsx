import React, { useState } from 'react';
import character from '@assets/images/character.png';
import emailEnable from '@assets/images/email-enable-instruction-payu.png';
import receiveEmail from '@assets/images/receive-email.png';
import { Link, SimpleButton } from '@components/button';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import usePopper from '@hooks/usePopper';
import { ENABLE_ACCOUNT, SYNCHRONIZE_PAYU } from '..';
import { NUMBER_MAX_OF_STEPS_ENABLE_ACCOUNT, NUMBER_MIN_OF_STEPS, NumberOfCurrentStep } from '.';

export const EnableAccountPayuSteps: React.FC = () => {
    const { anchorEl, mouseProps } = usePopper();

    const [numberOfStep, setNumberOfStep] = useState<number>(1);

    const handleClickSteps = (isIncrement: boolean): void => {
        if (isIncrement) {
            if (numberOfStep >= NUMBER_MAX_OF_STEPS_ENABLE_ACCOUNT) return;
            setNumberOfStep(numberOfStep + 1);
        } else {
            if (numberOfStep <= NUMBER_MIN_OF_STEPS) return;
            setNumberOfStep(numberOfStep - 1);
        }
    };

    return (
        <div className="instructions-payu__steps">
            <p className="p-4.5 text-white bg-blue rounded-lg mb-4.5 font-allerbold">
                Paso 2: Habilitar su cuenta para recibir pagos
            </p>
            <div className="instructions-payu__steps-container">
                {numberOfStep === NumberOfCurrentStep.One && (
                    <div className="w-full mb-40 pb-2.5">
                        <div className="instructions-payu__steps-container__description mb-7">
                            <p className="absolute flex items-center justify-center bg-white border rounded-full text-green -left-1 w-14 h-14 border-green">
                                2.1
                            </p>
                            <p className="text-white">
                                Recibirá un correo solicitando algunos documentos para la validación de su cuenta.
                            </p>
                        </div>

                        <div className="flex gap-4 mt-24">
                            <img
                                src={receiveEmail}
                                alt="imagen Recibirá un correo solicitando algunos documentos para la validación de su cuenta."
                            />
                            <p className="text-gray-dark">
                                Estos documentos pueden ser:
                                <ul className="list-disc ml-7">
                                    <li>Certificado bancario.</li>
                                    <li>Descripción de la empresa y productos y/o servicios que vende.</li>
                                    <li>Foto del documento de identificación.</li>
                                </ul>
                                Los documentos solicitados pueden variar según el caso particular. Envíe la información solicitada
                                al correo indicado por PayU la cuenta quedará habilitada en un plazo máximo de 3 días hábiles, y
                                será confirmada mediante correo electrónico.
                            </p>
                        </div>
                    </div>
                )}

                {numberOfStep === NumberOfCurrentStep.Two && (
                    <div className="w-full mb-7">
                        <div className="instructions-payu__steps-container__description mb-7">
                            <p className="absolute flex items-center justify-center bg-white border rounded-full text-green -left-1 w-14 h-14 border-green">
                                2.2
                            </p>
                            <p className="text-white">
                                Habilite su cuenta para recibir pagos directamente desde su página web. Envíe un mensaje al correo
                                &nbsp;
                                <span className="text-purple font-allerbold">comercios.co@payu.com.</span> Indicando que solicita
                                los permisos de API para la integración con su página web.
                            </p>
                        </div>

                        <div className="flex items-center justify-center">
                            <img src={emailEnable} alt="imagen de la instrucción de como habilitar una cuenta en payu" />
                        </div>
                    </div>
                )}

                {numberOfStep === NumberOfCurrentStep.Three && (
                    <div className="flex flex-col items-center w-full mt-14 mb-21.75">
                        <div className="flex flex-col w-full pt-1 mb-4.5 md:flex-row">
                            <div className="mt-10 md:mr-5 md:w-117 md:ml-14">
                                <h3 className="instructions-payu__steps-subtitle">¡Felicidades!</h3>
                                <p className="mb-8 text-xl text-gray-dark">Ha completado el paso 2 con éxito.</p>
                                <p className="text-xl leading-6 text-gray-dark">
                                    Continúe con el
                                    <span className="font-allerbold"> Paso 3: </span>
                                    Sincronizar PayU con diggi pymes
                                </p>
                            </div>
                            <img src={character} alt="character" />
                        </div>
                        <SimpleButton
                            onClick={(): void => {
                                localStorage.setItem(ENABLE_ACCOUNT, 'true');
                            }}
                            className="instructions-payu__steps-button-step"
                        >
                            <Link
                                classes="instructions-payu__steps-link"
                                text="Paso 3: Sincronizar PayU con diggi pymes"
                                href={`/instructions-payu?page=${SYNCHRONIZE_PAYU}`}
                            />
                        </SimpleButton>
                    </div>
                )}

                <div className="flex">
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
                        <div className="w-5.5 h-5.5 border-r border-blue" onClick={(): void => handleClickSteps(false)}>
                            <Icon
                                name={`${numberOfStep === NUMBER_MIN_OF_STEPS ? 'arrowLeftGray' : 'arrowLeftGreen'}`}
                                className="cursor-pointer"
                            />
                        </div>
                        <div className="flex justify-center w-14">
                            <p className="text-tiny text-blue">
                                {numberOfStep} &nbsp; de &nbsp; {NUMBER_MAX_OF_STEPS_ENABLE_ACCOUNT}
                            </p>
                        </div>
                        <div className="w-5.5 h-5.5 border-l border-blue" onClick={(): void => handleClickSteps(true)}>
                            <Icon
                                name={`${
                                    numberOfStep === NUMBER_MAX_OF_STEPS_ENABLE_ACCOUNT ? 'arrowRightGray' : 'arrowRightGreen'
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
