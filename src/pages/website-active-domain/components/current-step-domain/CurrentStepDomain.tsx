//--- Libraries ---//
import React, { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
//--- Components ---//
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import { PaginatorSteps } from '@components/paginator-steps';
import { CurrentStep, InstructionStep } from '@components/current-step';
import { ConfigDns, Congratulations, ConnectOwnDomain, InstructionsScreenshot } from './components';
//--- Utils ---//
import { getRoute } from '@utils/Paths';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
//--- Hooks ---//
import usePopper from '@hooks/usePopper';
//--- Constants ---//
import { Routes } from '@constants/Paths';
import { PaginationSteps, SubStepSelection } from '@constants/Domain';
import { PRODUCT_NAME } from '@constants/ProductName';
//--- Models ---//
import { CommonProperty } from '@models/WebsiteNode';
import { IGenericRecord } from '@models/GenericRecord';
//--- Redux ---//
import { getCommonProperties } from '@redux/website-node/actions';
import { createHostedZone, deleteSubdomain, saveDomainInAWS, setStepsCompleted } from '@redux/domain/actions';
//--- Assets ---//
import administrativePanel from '@assets/images/administrative-panel.svg';
import domainSettings from '@assets/images/domain-settings.svg';
import manageDns from '@assets/images/manage-dns.svg';
import serverNames from '@assets/images/server-names.svg';
import changeServerName from '@assets/images/change-server-name.svg';
import editServerNames from '@assets/images/edit-server-names.svg';
//--- Root ---//
import { ActiveDomainModal } from '..';
import { IInformationSteps, ICurrentStepDomainProps, MAIN_STEP_PAGINATOR, STEP_SECOND_PAGINATOR } from '.';
//--- Styles ---//
import './CurrentStepDomain.scss';

/**
 * Information by steps
 */
export const INFORMATION_MAIN_STEPS: IInformationSteps[] = [
    {
        title: 'Paso 1: Conectar dominio propio',
        description: `Escriba su dominio y conéctelo a ${PRODUCT_NAME}.`,
        step: '1.1',
        instruction:
            'Ingrese la URL de su dominio sin "https" y haga clic en "Conectar". Al realizar la conexión con diggi pymes, su dominio se desvinculará de su proveedor actual.',
    },
    {
        title: 'Paso 2: Copiar los DNS en el proveedor del dominio',
        step: '2.1',
        instruction: (
            <div>
                Configure las DNS, al hacer click en conectar aparece la tabla nombres de dominios &nbsp;
                <Icon className="inline w-5.5 h-5.5" name="infoBlue" /> DNS, las cuales debe copiar haciendo click en el icono
                &nbsp;
                <Icon name="copyBorderBlue" className="inline w-5.5 h-5.5" /> y agregar en la página de su proveedor de dominio.
            </div>
        ),
    },
    {
        title: 'Paso 3: Activar dominio',
        step: '3.1',
        instruction:
            'Una vez guardados los DNS en su proveedor de dominio, haga click en el botón “Activar” para que el proceso de conexión de su dominio quede completo.',
    },
    {
        title: 'Paso 3: Activar dominio',
    },
];

/**
 * Steps pagination
 */
export const INFORMATION_PAGINATION_STEPS: IInformationSteps[] = [
    {
        title: 'Paso 2: Copiar los DNS en el proveedor del dominio',
        step: '2.1',
        instruction: (
            <>
                <p>
                    Configure las DNS, al hacer click en conectar aparece la tabla nombres de dominios &nbsp;
                    <Icon className="inline w-5.5 h-5.5" name="infoBlue" /> DNS, las cuales debe copiar haciendo click en el icono
                    &nbsp;
                    <Icon name="copyBorderBlue" className="inline w-5.5 h-5.5" /> y agregar en la página de su proveedor de
                    dominio.
                </p>
            </>
        ),
    },
    {
        title: 'Paso 2: Copiar los DNS en el proveedor del dominio',
        description: 'Copie las direcciones de la tabla DNS.',
        step: '2.2',
        instruction:
            'Diríjase al panel administrativo de su proveedor y allí encontrará la sección de Dominios con el cual podrá escoger el dominio que va a conectar con diggi pymes.',
        descriptionStep: '',
        screenshots: [
            {
                image: administrativePanel,
                height: 325,
            },
            {
                image: domainSettings,
                height: 302,
            },
        ],
    },
    {
        title: 'Paso 2: Copiar los DNS en el proveedor del dominio',
        description: 'Copie las direcciones de la tabla DNS.',
        step: '2.3',
        instruction: 'Una vez elegido el dominio a conectar, acceda a la sección “Administrar DNS"',
        descriptionStep: '',
        screenshots: [{ image: manageDns, height: 361 }],
    },
    {
        title: 'Paso 2: Copiar los DNS en el proveedor del dominio',
        description: 'Copie las direcciones de la tabla DNS.',
        step: '2.4',
        instruction: 'Seleccione la opción “Servidores de nombres”.',
        descriptionStep: '',
        screenshots: [{ image: serverNames, height: 472 }],
    },
    {
        title: 'Paso 2: Copiar los DNS en el proveedor del dominio',
        description: 'Copie las direcciones de la tabla DNS.',
        step: '2.5',
        instruction: 'Busque la opción “Cambiar servidores de nombres” y haga click en “Editar" servidores de nombres',
        descriptionStep: '',
        screenshots: [{ image: changeServerName, height: 303 }],
    },
    {
        title: 'Paso 2: Copiar los DNS en el proveedor del dominio',
        description: 'Copie las direcciones de la tabla DNS.',
        step: '2.6',
        instruction:
            'Cuando haga click en “Editar servidores de nombres”, tendrá que pegar los DNS uno a uno en esta sección, luego hace click en “Guardar” para finalizar el proceso de conexión.',
        descriptionStep: '',
        screenshots: [{ image: editServerNames, height: 362 }],
    },
];

export const CurrentStepDomain: React.FC<ICurrentStepDomainProps> = ({
    domain,
    subdomain,
    commonProperties,
    currentSubStep,
    updateSecurityDomain,
    newDomain,
    setNewDomain,
    emptyDomain,
    setEmptyDomain,
    invalidDomain,
    setInvalidDomain,
    setIsConnected,
}) => {
    const { anchorEl, mouseProps } = usePopper();
    const [dispatch, history] = [useDispatch(), useHistory()];

    const [currentPage, setCurrentPage] = useState<number>(SubStepSelection.CONNECT_DOMAIN);
    const [paginationStep, setPaginationStep] = useState<number>(PaginationSteps.CONFIG_DNS);
    const [currentData, setCurrentData] = useState<IInformationSteps | null>(null);

    const [showActiveModal, setShowActiveModal] = useState<boolean>(false);
    const [loadSubStep, setLoadSubStep] = useState(currentSubStep);

    const domains = useMemo(() => commonProperties?.hosted_zone?.dns?.map((item: string) => item), [commonProperties]);

    useEffect(() => {
        currentSubStep && handleChangePage(currentSubStep);
    }, []);

    useEffect(() => {
        if (loadSubStep && currentSubStep && loadSubStep !== currentSubStep) {
            handleChangePage(currentSubStep);
            setLoadSubStep(currentSubStep);
        }
    }, [currentSubStep]);

    useEffect(() => {
        setNewDomain(domain);
    }, [domain]);

    useEffect(() => {
        handleGetCurrentData(INFORMATION_MAIN_STEPS, false);
    }, [currentPage]);

    useEffect(() => {
        currentPage === MAIN_STEP_PAGINATOR.SECOND_PAGE && handleGetCurrentData(INFORMATION_PAGINATION_STEPS, true);
    }, [currentPage, paginationStep]);

    const handleChangePage = (page: number): void => {
        setCurrentPage(page);
        if (page === SubStepSelection.CONFIG_DNS) return handleChangePaginationByStep(PaginationSteps.CONFIG_DNS);
    };

    const handleChangePaginationByStep = (page: number): void => {
        setPaginationStep(page);
    };

    const handleGetCurrentData = (data: IGenericRecord[], isPaginationStep: boolean): void => {
        const indexByCurrentPage = isPaginationStep ? paginationStep - 1 : currentPage - 1;
        const stepInformation = data.find((_, index) => index === indexByCurrentPage);
        if (stepInformation) {
            return setCurrentData(stepInformation as IInformationSteps);
        }
        return setCurrentData(null);
    };

    const handleChangeOwnDomain = (value: string): void => {
        setNewDomain(value);
        setInvalidDomain(false);
    };

    const handleConnectDomain = async (): Promise<void> => {
        if (!newDomain) {
            setEmptyDomain(true);
            return;
        }

        setEmptyDomain(false);

        if (subdomain) await dispatch(deleteSubdomain(subdomain));
        const isCorrectResponse = Boolean(await dispatch(createHostedZone(newDomain)));
        setInvalidDomain(!isCorrectResponse);
        if (isCorrectResponse) {
            setIsConnected(true);
            dispatch(setStepsCompleted([SubStepSelection.CONNECT_DOMAIN]));
            await updateSecurityDomain(newDomain);
            await dispatch(getCommonProperties([CommonProperty.Domain, CommonProperty.HostedZone]));
            handleChangePage(currentPage + 1);
        }
    };

    const saveDomain = async (): Promise<void> => {
        const isCorrectResponse = ((await dispatch(saveDomainInAWS(newDomain))) as unknown) as boolean;
        if (isCorrectResponse) {
            dispatch(
                setStepsCompleted([SubStepSelection.CONNECT_DOMAIN, SubStepSelection.CONFIG_DNS, SubStepSelection.ACTIVE_DOMAIN])
            );
            handleShowActiveModal();
            handleChangePage(currentPage + 1);
        }
    };

    const handleConnectOwnDomain = async (): Promise<void> => {
        if (currentPage === MAIN_STEP_PAGINATOR.FIRST_PAGE) {
            await handleConnectDomain();
        } else {
            await saveDomain();
        }
    };

    const handleCompleteStepTwo = (): void => {
        dispatch(setStepsCompleted([SubStepSelection.CONNECT_DOMAIN, SubStepSelection.CONFIG_DNS]));
    };

    const handleShowActiveModal = (): void => {
        setShowActiveModal(!showActiveModal);
    };

    const handleRedirect = (): void => {
        history.push(getRoute(Routes.WEBSITE_EDITOR));
    };

    return (
        <div className="current-step-domain">
            <ActiveDomainModal show={showActiveModal} showModal={handleShowActiveModal} />
            <div className="current-step-domain__title">
                <h3 className="title">Cómo escoger y activar el dominio</h3>
            </div>
            <div className="current-step-domain__content">
                <div className="subtitle__container">
                    <label className="title title--bold">Cómo escoger y activar el dominio propio</label>
                </div>
                <CurrentStep title={currentData?.title || ''} description={currentData?.description} />
            </div>
            <div className="current-step-domain__info-step">
                {currentPage !== MAIN_STEP_PAGINATOR.NINTH_PAGE && (
                    <InstructionStep step={currentData?.step || ''} title={currentData?.instruction || ''} />
                )}
                <div className="instruction__content">
                    {[MAIN_STEP_PAGINATOR.FIRST_PAGE, MAIN_STEP_PAGINATOR.EIGHTH_PAGE].includes(currentPage) && (
                        <ConnectOwnDomain
                            value={newDomain}
                            invalidDomain={invalidDomain}
                            onChange={handleChangeOwnDomain}
                            currentPage={currentPage}
                            handleMainAction={handleConnectOwnDomain}
                            emptyDomain={emptyDomain}
                        />
                    )}
                    {currentPage === MAIN_STEP_PAGINATOR.SECOND_PAGE && paginationStep === STEP_SECOND_PAGINATOR.FIRST_PAGE && (
                        <ConfigDns domains={domains || []} handleValidateStep={handleCompleteStepTwo} />
                    )}
                    {[
                        STEP_SECOND_PAGINATOR.SECOND_PAGE,
                        STEP_SECOND_PAGINATOR.THIRD_PAGE,
                        STEP_SECOND_PAGINATOR.FOURTH_PAGE,
                        STEP_SECOND_PAGINATOR.FIFTH_PAGE,
                        STEP_SECOND_PAGINATOR.SIXTH_PAGE,
                    ].includes(paginationStep) &&
                        currentPage === MAIN_STEP_PAGINATOR.SECOND_PAGE && (
                            <InstructionsScreenshot
                                descriptionStep={currentData?.descriptionStep || ''}
                                screenshots={currentData?.screenshots || []}
                            />
                        )}
                    {currentPage === MAIN_STEP_PAGINATOR.NINTH_PAGE && <Congratulations handleRedirect={handleRedirect} />}
                </div>
                {![MAIN_STEP_PAGINATOR.FIRST_PAGE, MAIN_STEP_PAGINATOR.EIGHTH_PAGE, MAIN_STEP_PAGINATOR.NINTH_PAGE].includes(
                    currentPage
                ) && (
                    <div className="-ml-10 paginator__container">
                        <Tooltip
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `paginator`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.TOOL,
                            })}
                            iconName="infoBlue"
                            placement="top-start"
                            anchorEl={anchorEl}
                            textStyles="text-blue"
                            wrapperClassName="rounded-lg"
                            title="Paginador"
                            description="Herramienta que le permite avanzar y retroceder en las instrucciones."
                        />
                        <span {...mouseProps}>
                            <Icon name="infoGreen" className="mr-2" />
                        </span>
                        <PaginatorSteps
                            data={INFORMATION_PAGINATION_STEPS}
                            currentPage={paginationStep}
                            setCurrentPage={handleChangePaginationByStep}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
