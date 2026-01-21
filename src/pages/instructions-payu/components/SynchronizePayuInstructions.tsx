import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { changeIsInstructions, getCompanyPaymentGateway, storeCompanyPaymentGateway } from '@redux/payment-gateway/action';
import { ICredentials, IPaymentGateway } from '@models/PaymentGateway';
import { currentDateInUnix } from '@utils/Date';
import { Routes } from '@constants/Paths';
import { ONE } from '@constants/ElectronicInvoice';
import { ACCOUNT_ID, API_KEY, API_LOGIN, MERCHANT_ID, PUBLIC_KEY } from '@constants/PaymentGateway';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import integrationDatesInstructionsPayu from '@assets/images/integration-dates-instructions-payu.png';
import setPasswordInstructionPayu from '@assets/images/set-password-instruction-payu.png';
import technicalConfigurationInstructionPayu from '@assets/images/technical-configuration-instruction-payu.png';
import integrationDataInstructionPayu from '@assets/images/integration-data-instruction-payu.png';
import technicalConfigurationInputsPayu from '@assets/images/technical-configuration-inputs-payu.png';
import character from '@assets/images/character.png';
import { getRoute } from '@utils/Paths';
import { Icon } from '@components/icon';
import { Button, Link, SimpleButton } from '@components/button';
import { TextInput } from '@components/input';
import { Form } from '@components/form';
import usePermissions from '@hooks/usePermissions';
import usePopper from '@hooks/usePopper';
import { Tooltip } from '@components/tooltip';
import { NUMBER_MAX_OF_STEPS_SYNCHRONIZE_PAYU, NUMBER_MIN_OF_STEPS, NUMBER_OF_STEP_INPUT, NumberOfCurrentStep } from '.';

export const SynchronizePayuInstructions: React.FC = () => {
    const [numberOfStep, setNumberOfStep] = useState<number>(1);
    const history = useHistory();
    const { disabledInputs } = usePermissions();
    const dispatch = useDispatch();
    const { anchorEl, mouseProps } = usePopper();

    const {
        paymentGateway: { dataCompanyPaymentGateway },
    } = useSelector((state: RootState) => state);
    const [informationPayment, setInformationPayment] = useState<IPaymentGateway>({
        payment_gateway_id: 1,
        credentials: {
            api_login: '',
            public_key: '',
            account_id: '',
            api_key: '',
            merchant_id: '',
        },
        date: currentDateInUnix().toString(),
    });
    const [clickSaveBtn, setClickSaveBtn] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getCompanyPaymentGateway());
    }, []);

    useEffect(() => {
        if (!lengthGreaterThanZero(dataCompanyPaymentGateway)) return;
        const data = dataCompanyPaymentGateway.find(({ payment_gateway_id }) => payment_gateway_id === ONE);
        if (data) setInformationPayment({ ...informationPayment, credentials: data?.credentials });
    }, [dataCompanyPaymentGateway]);

    const updateTextField = (text: string, key: string): void => {
        const credentials = informationPayment.credentials;

        switch (key) {
            case API_LOGIN:
                credentials.api_login = text;
                break;
            case API_KEY:
                credentials.api_key = text;
                break;
            case ACCOUNT_ID:
                credentials.account_id = text;
                break;
            case MERCHANT_ID:
                credentials.merchant_id = text;
                break;
            case PUBLIC_KEY:
                credentials.public_key = text;
                break;
        }
        setInformationPayment({ ...informationPayment, credentials: credentials });
    };

    const updateCredentials = (): boolean => {
        setClickSaveBtn(true);

        setInformationPayment({
            ...informationPayment,
            date: currentDateInUnix().toString(),
        });

        const constraintTextInput = Object.keys(informationPayment?.credentials)?.filter(item => {
            return !informationPayment?.credentials[item as keyof ICredentials];
        });

        if (lengthGreaterThanZero(constraintTextInput)) return true;

        if (lengthEqualToZero(constraintTextInput)) {
            dispatch(storeCompanyPaymentGateway(informationPayment));
        }
        return false;
    };

    const handleClickSteps = (isIncrement: boolean): void => {
        if (isIncrement) {
            if (numberOfStep >= NUMBER_MAX_OF_STEPS_SYNCHRONIZE_PAYU) return;
            if (numberOfStep === NUMBER_OF_STEP_INPUT && updateCredentials()) {
                updateCredentials();
                return;
            }
            setNumberOfStep(numberOfStep + 1);
        } else {
            if (numberOfStep <= NUMBER_MIN_OF_STEPS) return;
            setNumberOfStep(numberOfStep - 1);
        }
    };

    return (
        <div className="instructions-payu__steps">
            <p className="p-4.5 text-white bg-blue rounded-lg mb-4.5">Paso 3: Sincronizar PayU con diggi pymes</p>
            <div className="instructions-payu__steps-container">
                {numberOfStep === NumberOfCurrentStep.One && (
                    <div className="w-full mb-7">
                        <div className="mb-8 instructions-payu__steps-container__description">
                            <p className="absolute flex items-center justify-center bg-white border rounded-full text-green -left-1 w-14 h-14 border-green">
                                3.1
                            </p>
                            <p className="text-white">
                                Una vez establezca una contraseña, podrá ingresar desde el menú superior a la opción
                                “Configuración” e ingrese a “Configuración técnica” a PayU desde su cuenta.
                            </p>
                        </div>
                        <img src={setPasswordInstructionPayu} alt="intrucción para restablecer contraseña" />
                    </div>
                )}
                {numberOfStep === NumberOfCurrentStep.Two && (
                    <div className="w-full mb-4.5">
                        <div className="mb-3 instructions-payu__steps-container__description">
                            <p className="absolute flex items-center justify-center bg-white border rounded-full text-green -left-1 w-14 h-14 border-green">
                                3.2
                            </p>
                            <p className="text-white">
                                En la parte derecha de la pantalla hay un recuadro gris nombrado “Datos de integración”. Allí
                                encontrará tres códigos nombrados API KEY, API LOGIN y Llave pública.
                            </p>
                        </div>
                        <img src={integrationDatesInstructionsPayu} alt="intrucción para restablecer contraseña" />
                    </div>
                )}
                {numberOfStep === NumberOfCurrentStep.Three && (
                    <div className="w-full mb-40">
                        <div className="instructions-payu__steps-container__description mb-29.25">
                            <p className="absolute flex items-center justify-center bg-white border rounded-full text-green -left-1 w-14 h-14 border-green">
                                3.3
                            </p>
                            <p className="p-2 leading-4 text-white">
                                Ingrese al correo registrado y abra el mensaje para validar el correo electrónico. Encuentre el
                                código denominado Merchant ID. Copie el código y péguelo en el campo Merchant ID de la parte
                                inferior de la pantalla de instrucciones 3.4
                            </p>
                        </div>
                        <img src={technicalConfigurationInstructionPayu} alt="intrucción para restablecer contraseña" />
                    </div>
                )}
                {numberOfStep === NumberOfCurrentStep.Four && (
                    <div className="w-full mb-7">
                        <div className="instructions-payu__steps-container__description mb-7">
                            <p className="absolute flex items-center justify-center bg-white border rounded-full text-green -left-1 w-14 h-14 border-green">
                                3.4
                            </p>
                            <p className="text-white">
                                Por último, en la parte superior izquierda, bajo su nombre, se encuentra el número de Cuenta,
                                copie este número y péguelo en el campo Account ID.
                            </p>
                        </div>
                        <div className="flex flex-col justify-between w-full md:flex-row">
                            <div>
                                <div className="md:w-100 mb-5.5">
                                    <img src={technicalConfigurationInputsPayu} alt="intrucción de inputs" />
                                </div>
                                <div className="md:w-100 mb-9">
                                    <img src={integrationDataInstructionPayu} alt="integración de los datos" />
                                </div>
                            </div>
                            <div className="instructions-payu__steps-divider" />
                            <div className="flex flex-col mt-13">
                                <div className="flex flex-col md:flex-row mb-4.5">
                                    <Form className="sm:mr-4.5">
                                        <div className="mb-5">
                                            <TextInput
                                                labelText="*API KEY:"
                                                value={informationPayment.credentials.api_key}
                                                placeholder="..."
                                                classesWrapper="sm:w-47.5"
                                                onChange={(e): void => {
                                                    updateTextField(e.target.value, API_KEY);
                                                }}
                                                required={clickSaveBtn && !informationPayment.credentials.api_key}
                                                disabled={disabledInputs}
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <TextInput
                                                labelText="*Llave pública:"
                                                value={informationPayment.credentials.public_key}
                                                placeholder="..."
                                                classesWrapper="sm:w-47.5"
                                                onChange={(e): void => {
                                                    updateTextField(e.target.value, PUBLIC_KEY);
                                                }}
                                                required={clickSaveBtn && !informationPayment.credentials.public_key}
                                                disabled={disabledInputs}
                                            />
                                        </div>
                                        <div className="mb-0 xs:mb-5">
                                            <TextInput
                                                labelText="*Account ID:"
                                                value={informationPayment.credentials.account_id}
                                                placeholder="..."
                                                classesWrapper="sm:w-47.5"
                                                onChange={(e): void => {
                                                    updateTextField(e.target.value, ACCOUNT_ID);
                                                }}
                                                required={clickSaveBtn && !informationPayment.credentials.account_id}
                                                disabled={disabledInputs}
                                            />
                                        </div>
                                    </Form>
                                    <Form>
                                        <div className="mb-5">
                                            <TextInput
                                                labelText="*API LOGIN:"
                                                value={informationPayment.credentials.api_login}
                                                placeholder="..."
                                                classesWrapper="sm:w-47.5"
                                                onChange={(e): void => {
                                                    updateTextField(e.target.value, API_LOGIN);
                                                }}
                                                required={clickSaveBtn && !informationPayment.credentials.api_login}
                                                disabled={disabledInputs}
                                            />
                                        </div>
                                        <div className="mb-5 sm:mb-0">
                                            <TextInput
                                                labelText="*id del negocio (Merchant ID):"
                                                value={informationPayment.credentials.merchant_id}
                                                placeholder="..."
                                                classesWrapper="sm:w-47.5"
                                                onChange={(e): void => {
                                                    updateTextField(e.target.value, MERCHANT_ID);
                                                }}
                                                required={clickSaveBtn && !informationPayment.credentials.merchant_id}
                                                disabled={disabledInputs}
                                            />
                                        </div>
                                    </Form>
                                </div>
                                <div className="flex items-center justify-center">
                                    <Button disabled={disabledInputs} text="Guardar" onClick={updateCredentials} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {numberOfStep === NumberOfCurrentStep.Five && (
                    <div className="flex flex-col items-center w-full mb-20 mt-14">
                        <div className="flex w-full pt-1 mb-2.5 flex-col md:flex-row">
                            <div className="md:mr-5 md:w-117 md:ml-14">
                                <h3 className="instructions-payu__steps-subtitle">¡Felicidades!</h3>
                                <p className="mb-8 text-xl text-gray-dark">Ha completado el paso 3 con éxito.</p>
                                <p className="text-xl leading-6 text-gray-dark">
                                    Continúe haciendo click en el
                                    <span className="font-allerbold"> Cómo promocionar y optimizar su sitio web</span>
                                </p>
                            </div>
                            <img src={character} alt="character" />
                        </div>
                        <SimpleButton
                            className="instructions-payu__next-page-button"
                            onClick={(): void => {
                                dispatch(changeIsInstructions(false));
                                history.push(getRoute(Routes.WEBSITE_VISIBILITY));
                            }}
                        >
                            <Link
                                classes="instructions-payu__steps-link"
                                text="Cómo promocionar y optimizar su sitio web"
                                href="/"
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
                                {numberOfStep} &nbsp; de &nbsp; {NUMBER_MAX_OF_STEPS_SYNCHRONIZE_PAYU}
                            </p>
                        </div>
                        <div className="w-5.5 h-5.5 border-l border-blue" onClick={(): void => handleClickSteps(true)}>
                            <Icon
                                name={`${
                                    numberOfStep === NUMBER_MAX_OF_STEPS_SYNCHRONIZE_PAYU ? 'arrowRightGray' : 'arrowRightGreen'
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
