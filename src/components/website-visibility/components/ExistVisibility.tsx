import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import FirstStepExample from '@assets/images/exist-first-step.png';
import SecondStepExample from '@assets/images/exist-second-step.png';
import ThirdStepExample from '@assets/images/exist-third-step.png';
import {
    HEIGHT_EXAMPLE_IMAGE,
    IStepProps,
    RADIO_LOGO_VALUES,
    SCROLL_NUMBER,
    WIDTH_EXAMPLE_IMAGE,
    buttonProps,
    radioButtonPropsLogo,
} from '.';

import { PageButtonsFooter } from '@components/page-buttons-footer';
import { RadioButton } from '@components/radiobutton';
import { FileInput, TextInput } from '@components/input';
import { Icon } from '@components/icon';
import { Modal } from '@components/modal';
import { Button } from '@components/button';
import { LOGO } from '@constants/website';
import { Routes } from '@constants/Paths';
import { Source } from '@constants/Onboarding';
import usePermissions from '@hooks/usePermissions';
import useOnboardingNavigation from '@hooks/useOnboardingNavigation';
import { IGenericRecord } from '@models/GenericRecord';
import { getRoute } from '@utils/Paths';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';

export const ExistVisibility: React.FC<IStepProps> = ({
    websiteLocationValues,
    websiteLocationErrors,
    onInputChangeWebsiteLocation,
    handleRemoveKeyword,
    sendDataWebsiteLocation,
    logoButton,
    setLogoButton,
    logo,
    setLogo,
    errorEmptyLogo,
    setErrorEmptyLogo,
    modalSuccess,
    setModalSuccess,
}) => {
    const keywordsRef = useRef<HTMLDivElement>(null);
    const historyHook = useHistory();
    const { disabledInputs } = usePermissions();
    const { handlePostConfirmation } = useOnboardingNavigation(Source.Website);

    const handleSlideKeyword = (): void => {
        if (keywordsRef.current) {
            keywordsRef.current.scrollLeft += SCROLL_NUMBER;
        }
    };

    const handleDeleteLogo = (id: IGenericRecord): void => {
        if (id) {
            setLogo([{ name: LOGO, files: [], value: 1 }]);
        }
    };

    const navigateSocialNetwork = (): void => {
        historyHook.push(getRoute(Routes.WEBSITE_SOCIAL));
    };

    const closeModal = (): void => setModalSuccess(false);

    return (
        <div>
            <p className="text-base font-allerbold text-blue">Haga visible su sitio web en internet</p>
            <p className="text-base text-blue mt-4.5 pr-32">
                Para mejorar su presencia en los buscadores de internet, ingrese el nombre de su sitio web, seleccione palabras
                clave relevantes y agregue una descripción clara. Para más información sobre cada campo, coloque el cursor sobre
                el icono
                <Icon name="infoGreen" className="inline w-4 h-4" />.
            </p>

            <div className="visibility-step">
                <TextInput
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `exist-visibility-name-website`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    labelText="*Nombre del sitio web:"
                    classesWrapper="max-w-full website-name"
                    placeholder="..."
                    name="title"
                    value={websiteLocationValues.title}
                    required={websiteLocationErrors?.title}
                    requiredText={websiteLocationErrors?.title}
                    onChange={onInputChangeWebsiteLocation}
                    tooltipInfo
                    disabled={disabledInputs}
                    titleTooltip="Nombre del sitio web:"
                    descTooltip='Es la forma como quiere que su sitio web sea encontrado en internet. Ejemplo: su empresa de costuras se llama "Vía libre" y desea que sea encontrado como "Costuras Vía Libre" escriba eso en el Nombre del sitio web.'
                />
                <div className="separate" />

                <img src={FirstStepExample} alt="First step example" className="example-image" />
            </div>
            <div className="visibility-step">
                <div className="flex flex-col gap-y-2">
                    <TextInput
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `exist-visibility-keywords`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="*Palabras clave:"
                        classesWrapper="max-w-full website-name"
                        placeholder="..."
                        name="keywords"
                        disabled={disabledInputs}
                        value={websiteLocationValues.keywords}
                        required={websiteLocationErrors?.keywords}
                        requiredText={websiteLocationErrors?.keywords}
                        onChange={onInputChangeWebsiteLocation}
                        tooltipInfo
                        titleTooltip="Palabras clave:"
                        descTooltip="Son los términos con los que su sitio web puede ser encontrado en las búsquedas de internet."
                    />
                    {websiteLocationValues?.keywords && (
                        <div className="flex container-exist-keywords">
                            <div className="keywords" ref={keywordsRef}>
                                {websiteLocationValues?.keywords.split(', ').map((keyword: string) => (
                                    <div className="keywords__keyword" key={keyword}>
                                        <span>{keyword}</span>
                                        <Icon
                                            name="closeKeyword"
                                            classIcon="cursor-pointer"
                                            onClick={(): void => handleRemoveKeyword(keyword)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <Icon name="arrowRightKeyword" classIcon="cursor-pointer" onClick={handleSlideKeyword} />
                        </div>
                    )}
                </div>
                <div className="separate" />

                <img
                    src={ThirdStepExample}
                    alt="First step example"
                    width={WIDTH_EXAMPLE_IMAGE}
                    height={HEIGHT_EXAMPLE_IMAGE}
                    className="example-image"
                />
            </div>
            <div className="visibility-step ">
                <TextInput
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `exist-visibility-description`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    labelText="*Descripción:"
                    classesWrapper="max-w-full website-name"
                    placeholder="..."
                    name="description"
                    value={websiteLocationValues.description}
                    required={websiteLocationErrors?.description}
                    requiredText={websiteLocationErrors?.description}
                    onChange={onInputChangeWebsiteLocation}
                    tooltipInfo
                    disabled={disabledInputs}
                    titleTooltip="Descripción:"
                    descTooltip="Es una descripción breve de su sitio web que aparece debajo del nombre del sitio web cuando es encontrado en internet."
                />
                <div className="separate" />

                <img
                    src={SecondStepExample}
                    alt="First step example"
                    width={WIDTH_EXAMPLE_IMAGE}
                    height={HEIGHT_EXAMPLE_IMAGE}
                    className="example-image"
                />
            </div>

            <div className="visibility-step-logo">
                <div>
                    <p className="text-base font-allerbold text-blue">Logo</p>
                    <div className="flex flex-col  mt-3.75 logo-left">
                        <div className="question-radio-logo">
                            <p className="text-base text-center font-allerbold text-gray-dark mb-4.5">
                                ¿Su negocio cuenta con un logo?
                            </p>
                            <RadioButton
                                disabled={disabledInputs}
                                classesContainer="mb-4.5"
                                classesLabel="text-blue"
                                {...radioButtonPropsLogo({
                                    selected: logoButton,
                                    setSelected: setLogoButton,
                                })}
                            />
                        </div>
                        <p className="text-base font-aller text-gray-dark">
                            En caso de seleccionar la opción “No”, diggi pymes mostrará por el nombre de su empresa registrado en
                            la sección Datos de la empresa.
                        </p>
                    </div>
                </div>

                {logoButton === RADIO_LOGO_VALUES.YES && (
                    <div className="w-full space-logo">
                        <FileInput
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `exist-visibility-logo`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.UPL,
                            })}
                            disabled={disabledInputs}
                            name={LOGO}
                            instructions="Subir en formato .png sin fondo"
                            labelText="Subir logo de la empresa:"
                            fileExtensionAccept=".jpg , .png, .jpeg"
                            classesWrapper="mt-8.4 mb-4.5 lg:w-72 w-full"
                            setFile={setLogo}
                            file={logo}
                            onClick={handleDeleteLogo}
                            isValidateSize
                            getFile={(e): void => {
                                setErrorEmptyLogo(!e.target.files?.length);
                            }}
                        />

                        {errorEmptyLogo && (
                            <span className="text-tiny text-purple mr-1.5  leading-xtiny mt-1">*Campo obligatorio</span>
                        )}
                    </div>
                )}
            </div>

            <PageButtonsFooter
                {...buttonProps(history, navigateSocialNetwork, () => {
                    history.back();
                })}
                threeButtons
                disabledCenter={disabledInputs}
                onClickButtonCenter={sendDataWebsiteLocation}
            />

            <Modal
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `${ModuleApp.MODALS}-exist-visibility`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.MDL,
                })}
                handleClose={closeModal}
                open={modalSuccess}
            >
                <div className="p-6.70 bg-white rounded-2.5xl flex flex-col justify-center items-center h-auto modal-success">
                    <Icon name="check" className="mb-2 w-22.2 h-22.2" />
                    <p className="mb-2 text-xl font-bold text-center leading-xl text-blue font-allerbold w-65">
                        Información guardada
                    </p>
                    <p className="text-base text-center text-gray-dark">¡Su información ha sido guardada con éxito!</p>
                    <div className="flex justify-center w-full mt-7">
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-exist-visibility`,
                                action: ActionElementType.ACCEPT,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => handlePostConfirmation(closeModal)}
                            text="Aceptar"
                            classes="shadow-templateDesign"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};
