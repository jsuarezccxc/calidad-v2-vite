import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import {
    ExistVisibility,
    FirstStep,
    LogoStep,
    RADIO_LOGO_VALUES,
    SecondStep,
    ThirdStep,
    WebsiteLayout,
} from '@components/website-visibility';
import { Icon } from '@components/icon';
import { FinishStep } from '@components/website-visibility/components/FinishStep';
import { ChangeEvent, DEFAULT_REQUIRED_TEXT, IFile, SIZE_MAX_MB } from '@components/input';
import { ModalType } from '@components/modal-custom';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { ZERO as ZERO_VALUE } from '@constants/Numbers';
import { RootState } from '@redux/rootReducer';
import { deleteFileLogo, getCommonProperties, getFileCompanyAction, postCommonProperties } from '@redux/website-node/actions';
import { postFileCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';
import { IGenericRecord } from '@models/GenericRecord';
import { CommonProperty } from '@models/WebsiteNode';
import { LANGUAGE_KEY } from '@constants/Translate';
import { LOGO } from '@constants/website';
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
import { Source } from '@constants/Onboarding';
import useOnboardingNavigation from '@hooks/useOnboardingNavigation';
import { validateSizeFile } from '@utils/File';
import { isCorrectResponse } from '@utils/Response';
import { getRoute } from '@utils/Paths';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { FIVE, IStep, MAX_STEP, STEP_FOUR, buttonProps, visibilitySteps } from '.';
import './WebsiteVisibility.scss';
import { FooterOption, defaultPosition } from '.';

export const steps = (
    websiteLocationValues: IGenericRecord,
    setWebsiteLocationValues: Dispatch<SetStateAction<IGenericRecord>>,
    setWebsiteLocationErrors: Dispatch<SetStateAction<IGenericRecord>>,
    websiteLocationErrors: IGenericRecord,
    handleRemoveKeyword: (keyword: string) => void,
    sendDataForStep: () => void,
    logo: IFile,
    setLogo: Dispatch<SetStateAction<IFile>>,
    logoButton: string,
    setLogoButton: Dispatch<SetStateAction<string>>,
    errorEmptyLogo: boolean,
    setErrorEmptyLogo: Dispatch<SetStateAction<boolean>>
): IStep[] => {
    return [
        {
            title: 'Paso 1: Agregue el nombre de su empresa o marca',
            content: 'Nombre de su sitio web',
            description: 'Identifique su negocio en internet.',
            step: '1.1',
            instruction:
                'Agregue en el espacio correspondiente el nombre de su empresa o marca. En la parte inferior visualice un ejemplo del nombre de la empresa en los buscadores de internet.',
            component: (
                <FirstStep
                    websiteLocationValues={websiteLocationValues}
                    setWebsiteLocationValues={setWebsiteLocationValues}
                    websiteLocationErrors={websiteLocationErrors}
                    setWebsiteLocationErrors={setWebsiteLocationErrors}
                />
            ),
            classWrapperStep: 'wrapper__step--first',
        },
        {
            title: 'Paso 2: Agregue la descripción del sitio web',
            content: 'Descripción de su sitio web',
            description: 'Resuma el contenido del sitio web para sus clientes.',
            step: '2.1',
            instruction:
                'Agregue en el espacio correspondiente la descripción la empresa del sitio web. En la parte inferior visualice un ejemplo de la descripción de su empresa en los buscadores de internet.',
            component: (
                <SecondStep
                    websiteLocationValues={websiteLocationValues}
                    setWebsiteLocationValues={setWebsiteLocationValues}
                    websiteLocationErrors={websiteLocationErrors}
                    setWebsiteLocationErrors={setWebsiteLocationErrors}
                />
            ),
            classWrapperStep: 'wrapper__step--second',
        },
        {
            title: 'Paso 3: Agregue las palabras claves',
            content: 'Palabras clave de su sitio web',
            description: 'Describa en palabras su negocio para encontrarlo en internet.',
            step: '3.1',
            instruction:
                'Agregue las palabras claves que representan su empresa y el contenido de su sitio web en la parte inferior  visualice un ejemplo de las palabras clave de su empresa en los buscadores de internet.',
            component: (
                <ThirdStep
                    websiteLocationValues={websiteLocationValues}
                    setWebsiteLocationValues={setWebsiteLocationValues}
                    websiteLocationErrors={websiteLocationErrors}
                    handleRemoveKeyword={handleRemoveKeyword}
                    setWebsiteLocationErrors={setWebsiteLocationErrors}
                />
            ),
            classWrapperStep: 'wrapper__step--third',
        },
        {
            title: 'Paso 4: Agregue el logo de su negocio',
            content: 'Logo de su negocio',
            description: 'Si su negocio tiene logo suba el archivo',
            step: '4.1',
            instruction:
                'Suba el logo de su negocio en caso de no querer subir logo, diggi pymes reemplazará el espacio del logo en la página web por el nombre de su negocio.',
            component: (
                <LogoStep
                    logo={logo}
                    logoButton={logoButton}
                    setLogo={setLogo}
                    setLogoButton={setLogoButton}
                    errorEmptyLogo={errorEmptyLogo}
                    setErrorEmptyLogo={setErrorEmptyLogo}
                />
            ),
            classWrapperStep: 'wrapper__step--four',
        },
        {
            title: 'Paso 4: ¡Felicidades!',
            content: '',
            description: '',
            step: '',
            instruction: '',
            component: <FinishStep />,
            classWrapperStep: 'wrapper__step--finish',
        },
    ];
};

export const WebsiteVisibility: React.FC = () => {
    const dispatch = useDispatch();
    const historyHook = useHistory();
    const { search } = useLocation();
    const { commonProperties, logo: websiteLogo } = useSelector((state: RootState) => state.websiteNode);
    const [translate] = useTranslation(LANGUAGE_KEY);
    const [firstTime, setFirstTime] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [logoButton, setLogoButton] = useState<string>('SI');
    const [logo, setLogo] = useState<IFile>([{ name: 'logo', files: [], value: 0 }]);
    const [errorEmptyLogo, setErrorEmptyLogo] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(false);

    const [websiteLocationValues, setWebsiteLocationValues] = useState<IGenericRecord>({
        title: '',
        description: '',
        keywords: '',
    });

    const [websiteLocationErrors, setWebsiteLocationErrors] = useState<IGenericRecord>({});
    const [showModalSave, setShowModalSave] = useState(false);

    const { handlePostConfirmation } = useOnboardingNavigation(Source.Website);

    useEffect(() => {
        (async (): Promise<void> => {
            await Promise.all([
                dispatch(getCommonProperties([CommonProperty.Title, CommonProperty.Description, CommonProperty.KeyWords])),
                dispatch(getFileCompanyAction()),
            ]);
        })();
    }, []);

    useEffect(() => {
        const { title, description, keywords } = commonProperties;
        if (title && description && keywords) {
            setFirstTime(false);
        }
        setWebsiteLocationValues(commonProperties);
    }, [commonProperties]);

    useEffect(() => {
        if (websiteLogo?.bucket) {
            const file = websiteLogo?.bucket;
            const name = websiteLogo?.file_original_name;

            setLogo([{ name: LOGO, files: [{ file: file, name: name, id: uuid() }], value: 0 }]);
            setLogoButton('SI');
        } else {
            setLogo([{ name: 'logo', files: [], value: 0 }]);
            setLogoButton('NO');
        }
    }, [websiteLogo]);

    useEffect(() => {
        if (logoButton === RADIO_LOGO_VALUES.NO) {
            setLogo([{ name: 'logo', files: [], value: 0 }]);
            setErrorEmptyLogo(false);
        }
    }, [logoButton]);

    useEffect(() => {
        if (currentStep === ZERO_VALUE && !firstTime) {
            validateFields(websiteLocationValues, setWebsiteLocationErrors);
        }
    }, [websiteLocationValues]);

    const validateFields = (data: IGenericRecord, setErrors: Dispatch<SetStateAction<IGenericRecord>>): boolean => {
        const errors: IGenericRecord = {};
        Object.keys(data).forEach(key => {
            if (!data[key]) {
                errors[key] = DEFAULT_REQUIRED_TEXT;
            }
        });

        setErrors(errors);

        return !Object.keys(errors).length;
    };

    const onInputChangeWebsiteLocation = (e: ChangeEvent): void => {
        const { name, value } = e.target;

        setWebsiteLocationValues({
            ...websiteLocationValues,
            [name]: value,
        });
    };

    const handleRemoveKeyword = (keyword: string): void => {
        if (websiteLocationValues && websiteLocationValues.keywords) {
            const keywords = websiteLocationValues.keywords.split(', ');
            const index = keywords.indexOf(keyword);

            if (index !== defaultPosition) {
                keywords.splice(index, 1);
            }

            const newKeywords = keywords.join(', ');

            setWebsiteLocationValues({
                ...websiteLocationValues,
                keywords: newKeywords,
            });
        }
    };

    const sendDataWebsiteLocation = async (): Promise<void> => {
        const isValidWebsiteLocation = validateFields(websiteLocationValues, setWebsiteLocationErrors);

        if (!isValidWebsiteLocation) {
            return;
        }

        const logoFile = logo?.[ZERO_VALUE]?.files?.[ZERO_VALUE];

        if (logoButton === RADIO_LOGO_VALUES.YES) {
            if (!logoFile) {
                setErrorEmptyLogo(true);
                return;
            }

            if (logoFile?.type && !validateSizeFile(logo, LOGO, SIZE_MAX_MB)) {
                setErrorEmptyLogo(false);
                const status = await dispatch(postFileCompanyAction(logoFile, 'logo'));
                if (isCorrectResponse(Number(status))) {
                    dispatch(getFileCompanyAction());
                }
            } else {
                dispatch(
                    postCommonProperties(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        Object.entries(websiteLocationValues).map(([property, value]: any) => ({ property, value }))
                    )
                );
                setCurrentStep(0);
                setModalSuccess(true);
                return;
            }
        } else {
            dispatch(deleteFileLogo());
        }

        dispatch(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            postCommonProperties(Object.entries(websiteLocationValues).map(([property, value]: any) => ({ property, value })))
        );
        setCurrentStep(0);
        setModalSuccess(true);
    };

    const handleNextStep = (): void => {
        if (currentStep < FIVE) {
            setCurrentStep(currentStep + 1);
        }
    };
    const handleBackStep = (): void => {
        if (currentStep === FooterOption.Three) {
            if (commonProperties.keywords) {
                setWebsiteLocationValues({
                    ...websiteLocationValues,
                    keywords: commonProperties.keywords,
                });
            } else {
                setWebsiteLocationValues({
                    ...websiteLocationValues,
                    keywords: undefined,
                });
            }

            setWebsiteLocationErrors({
                ...websiteLocationErrors,
                keywords: '',
            });
        }

        if (currentStep === FooterOption.Two) {
            if (commonProperties.description) {
                setWebsiteLocationValues({
                    ...websiteLocationValues,
                    description: commonProperties.description,
                });
            } else {
                setWebsiteLocationValues({
                    ...websiteLocationValues,
                    description: undefined,
                });
            }

            setWebsiteLocationErrors({
                ...websiteLocationErrors,
                description: '',
            });
        }

        if (currentStep === FooterOption.One) {
            if (commonProperties.title) {
                setWebsiteLocationValues({
                    ...websiteLocationValues,
                    title: commonProperties.title,
                });
            } else {
                setWebsiteLocationValues({
                    ...websiteLocationValues,
                    title: undefined,
                });
            }

            setWebsiteLocationErrors({
                ...websiteLocationErrors,
                title: '',
            });
        }

        if (currentStep >= FooterOption.One) {
            setCurrentStep(currentStep - 1);
        }
    };

    const validateFormToNextStep = (): boolean => {
        const errors: IGenericRecord = {};

        if (currentStep === FooterOption.One) {
            if (!websiteLocationValues?.title) {
                errors.title = DEFAULT_REQUIRED_TEXT;
            }
        }

        if (currentStep === FooterOption.Two) {
            if (!websiteLocationValues?.description) {
                errors.description = DEFAULT_REQUIRED_TEXT;
            }
        }

        setWebsiteLocationErrors({ ...websiteLocationErrors, ...errors });
        return !Object.keys(errors).length;
    };

    const validateKeywords = (): boolean => {
        const errors: IGenericRecord = {};

        if (currentStep === FooterOption.Three) {
            if (!websiteLocationValues?.keywords) {
                errors.keywords = 'Agrega una palabra clave';
                setWebsiteLocationErrors({ keywords: 'Agrega una palabra clave' });
            } else {
                setWebsiteLocationErrors({});
            }
        }

        return !Object.keys(errors).length;
    };

    const sendDataForStep = async (): Promise<void> => {
        if (currentStep === FooterOption.One) {
            dispatch(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                postCommonProperties(Object.entries(websiteLocationValues).map(([property, value]: any) => ({ property, value })))
            );

            if (commonProperties.description && commonProperties.keywords) {
                historyHook.push(`${getRoute(Routes.WEBSITE_VISIBILITY)}?send=true`);
                setCurrentStep(0);
                return;
            }
        }

        if (currentStep === FooterOption.Two) {
            dispatch(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                postCommonProperties(Object.entries(websiteLocationValues).map(([property, value]: any) => ({ property, value })))
            );

            if (commonProperties.title && commonProperties.keywords) {
                historyHook.push(`${getRoute(Routes.WEBSITE_VISIBILITY)}?send=true`);
                setCurrentStep(0);
                return;
            }
        }

        if (currentStep === FooterOption.Four) {
            dispatch(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                postCommonProperties(Object.entries(websiteLocationValues).map(([property, value]: any) => ({ property, value })))
            );

            if (logo?.[ZERO_VALUE]?.files?.length) {
                const status = await dispatch(postFileCompanyAction(logo?.[ZERO_VALUE]?.files?.[ZERO_VALUE], 'logo'));
                if (isCorrectResponse(Number(status))) {
                    dispatch(getFileCompanyAction());
                }
            } else {
                if (websiteLogo.bucket) {
                    dispatch(deleteFileLogo());
                }

                setLogo([{ name: 'logo', files: [], value: 0 }]);
            }

            if (commonProperties.title && commonProperties.description && commonProperties.keywords) {
                historyHook.push(`${getRoute(Routes.WEBSITE_VISIBILITY)}?send=true`);
            } else {
                historyHook.push(getRoute(Routes.WEBSITE_VISIBILITY));
                setCurrentStep(0);
                return;
            }
        }

        if (currentStep == MAX_STEP) historyHook.push(getRoute(Routes.WEBSITE_SOCIAL));

        handleNextStep();
    };

    return (
        <WebsiteLayout firstTime={firstTime}>
            {search ? (
                <FinishStep setCurrentStep={setCurrentStep} />
            ) : (
                <>
                    {firstTime ? (
                        <>
                            {currentStep > ZERO_VALUE ? (
                                <Steps
                                    steps={steps(
                                        websiteLocationValues,
                                        setWebsiteLocationValues,
                                        setWebsiteLocationErrors,
                                        websiteLocationErrors,
                                        handleRemoveKeyword,
                                        sendDataForStep,
                                        logo,
                                        setLogo,
                                        logoButton,
                                        setLogoButton,
                                        errorEmptyLogo,
                                        setErrorEmptyLogo
                                    )}
                                    currentStep={currentStep}
                                    handleNextStep={handleNextStep}
                                    handleBackStep={handleBackStep}
                                    validateFormToNextStep={validateFormToNextStep}
                                    sendDataForStep={sendDataForStep}
                                    validateKeywords={validateKeywords}
                                    setWebsiteLocationErrors={setWebsiteLocationErrors}
                                />
                            ) : (
                                <>
                                    <p className="text-base font-allerbold text-blue mb-4.5">
                                        Haga visible su sitio web en internet para que sus clientes lo encuentren fácil y rápido
                                    </p>
                                    <div
                                        className={`visibility ${
                                            visibilitySteps(commonProperties, logo).some(step => step.active) ? 'gap-x-14' : ''
                                        }`}
                                    >
                                        <div className="visibility__steps">
                                            {visibilitySteps(commonProperties, logo).map((step, idx: number) => (
                                                <div
                                                    id={generateId({
                                                        module: ModuleApp.WEBSITE,
                                                        submodule: `visibility-step-${idx}`,
                                                        action: ActionElementType.INFO,
                                                        elementType: ElementType.CRD,
                                                    })}
                                                    className={`step ${step.active ? 'step--active' : ''}`}
                                                    key={step.title}
                                                    onClick={(): void => setCurrentStep(idx + 1)}
                                                >
                                                    <div className="step__icon">
                                                        <Icon name={step.iconName} />
                                                    </div>
                                                    <div className="step__info">
                                                        <h2>{step.title}</h2>
                                                        <p>{step.desc}</p>
                                                    </div>
                                                    <div className="step__arrow">
                                                        <Icon name="arrowStepLeft" />
                                                        {step.active && <Icon name="checkGradient" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="visibility__definitions">
                                            <div className="definition-icon">
                                                <p>Preguntas frecuentes</p>
                                                <Icon name="question" classIcon="question" />
                                            </div>
                                            <div className="definition">
                                                <p>
                                                    <span>Definiciones cortas</span> y claras de los términos de cómo promocionar
                                                    y optimizar el sitio web.
                                                </p>
                                            </div>
                                            <div className="definition">
                                                <p>
                                                    <span>Acompañamiento</span> de un experto en cómo promocionar y optimizar el
                                                    sitio web.
                                                </p>
                                            </div>
                                        </div>
                                        <PageButtonsFooter
                                            {...buttonProps(
                                                history,
                                                () => setCurrentStep(1),
                                                () => history.back()
                                            )}
                                            className="visibility__buttons"
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <ExistVisibility
                                websiteLocationValues={websiteLocationValues}
                                websiteLocationErrors={websiteLocationErrors}
                                onInputChangeWebsiteLocation={onInputChangeWebsiteLocation}
                                handleRemoveKeyword={handleRemoveKeyword}
                                sendDataWebsiteLocation={sendDataWebsiteLocation}
                                logoButton={logoButton}
                                setLogoButton={setLogoButton}
                                logo={logo}
                                setLogo={setLogo}
                                errorEmptyLogo={errorEmptyLogo}
                                setErrorEmptyLogo={setErrorEmptyLogo}
                                modalSuccess={modalSuccess}
                                setModalSuccess={setModalSuccess}
                            />
                            {showModalSave && (
                                <ModalType
                                    id={generateId({
                                        module: ModuleApp.WEBSITE,
                                        submodule: 'visibility-save',
                                        action: ActionElementType.INFO,
                                        elementType: ElementType.MDL,
                                    })}
                                    show={showModalSave}
                                    showModal={(): void => handlePostConfirmation(() => setShowModalSave(!showModalSave))}
                                    type="save"
                                    title={translate('modal.save-title')}
                                    text={translate('modal.save-description')}
                                />
                            )}
                        </>
                    )}
                </>
            )}
        </WebsiteLayout>
    );
};

const Steps: React.FC<{
    steps: IStep[];
    currentStep: number;
    handleNextStep: () => void;
    handleBackStep: () => void;
    validateFormToNextStep: () => boolean;
    sendDataForStep: () => void;
    validateKeywords: () => boolean;
    setWebsiteLocationErrors: Dispatch<SetStateAction<IGenericRecord>>;
}> = ({
    steps,
    currentStep,
    handleBackStep,
    validateFormToNextStep,
    sendDataForStep,
    validateKeywords,
    setWebsiteLocationErrors,
}) => {
    const { title, description, content, component, step, instruction, classWrapperStep } = steps[currentStep - 1];

    const sendDataWebsiteLocation = (): void => {
        const isValidateNext = validateFormToNextStep();
        const isValidateKeywords = validateKeywords();

        if (currentStep === FooterOption.Three && isValidateKeywords) {
            setWebsiteLocationErrors({});
        }

        if (isValidateNext && isValidateKeywords) {
            sendDataForStep();
        }
    };

    return (
        <div>
            {content && <p className="text-base mb-7 font-allerbold text-blue">{content}</p>}
            <div className={`bg-blue rounded-lg mb-4.5 desc-step ${!description ? 'p-4.5' : 'px-4.5 py-2'}`}>
                <p className="text-base text-white font-allerbold">{title}</p>
                {description && <p className="text-base text-white font-aller">{description}</p>}
            </div>
            <div className={`bg-white rounded component-step ${classWrapperStep}`}>
                {step && (
                    <div className="relative flex items-center content-step mb-4.5">
                        <div className="number-step">{step}</div>
                        <div
                            className={`instruction-step-visibility ${
                                step === STEP_FOUR ? 'instruction-step-visibility--mobile' : ''
                            }`}
                        >
                            {instruction}
                        </div>
                    </div>
                )}

                {component}
            </div>
            <div className="footer-info">
                <PageButtonsFooter
                    {...buttonProps(history, sendDataWebsiteLocation, () => handleBackStep())}
                    classNameBtnLeft="px-2"
                    className="flex justify-end"
                    titleButtonLeft={currentStep === FooterOption.One ? TitleButtons.BACK : TitleButtons.PREV_STEP}
                    titleButtonRight={TitleButtons.NEXT_STEP}
                />
            </div>
        </div>
    );
};

export default WebsiteVisibility;
