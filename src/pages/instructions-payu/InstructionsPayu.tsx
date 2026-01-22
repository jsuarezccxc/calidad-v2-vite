import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Icon } from '@components/icon';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
import { URL_DASHBOARD } from '@constants/Domain';
import { WEBSITE_PLANS } from '@constants/WebsiteNode';
import { PRODUCT_NAME } from '@constants/ProductName';
import { Source } from '@constants/Onboarding';
import useOnboardingNavigation from '@hooks/useOnboardingNavigation';
import useParam from '@hooks/useParam';
import { RootState } from '@redux/rootReducer';
import { buttonsFooterProps } from '@utils/Button';
import { lengthGreaterThanOne } from '@utils/Length';
import { getRoute, getRouteName } from '@utils/Paths';
import { ModuleApp } from '@utils/GenerateId';
import { StepsCard, CreateAccountPayuSteps, EnableAccountPayuSteps, SynchronizePayuInstructions } from './components';
import { CREATE_ACCOUNT, ENABLE_ACCOUNT, SYNCHRONIZE_PAYU, routesInstructions, stepCartElements, ROUTE_HELP_CENTER } from '.';
import './InstructionsPayu.scss';

const InstructionsPayu: React.FC = () => {
    const history = useHistory();
    const { queryParam } = useParam('page');
    const {
        paymentGateway: { dataCompanyPaymentGateway, isInstructions },
    } = useSelector((state: RootState) => state);
    const { planWebsiteActive } = useSelector((state: RootState) => state.membership);

    const { handlePostConfirmation } = useOnboardingNavigation(Source.Website);

    useEffect(() => {
        if ([WEBSITE_PLANS.BASIC_PLAN, WEBSITE_PLANS.ADVANCED_PLAN].includes(planWebsiteActive || '')) {
            history.push(URL_DASHBOARD);
        }
        if (lengthGreaterThanOne(dataCompanyPaymentGateway?.credentials?.account_id || []) && !isInstructions) {
            history.replace(`${getRoute(Routes.INSTRUCTIONS_PAYU)}?page=${SYNCHRONIZE_PAYU}`);
        }
    }, []);

    const handleNextRoute = (): void => {
        handlePostConfirmation(() => history.push(getRoute(Routes.WEBSITE_VISIBILITY)));
    };

    return (
        <div className="xs:px-2">
            <div className="instructions-payu">
                <PageTitle classContainer="instructions-payu__title" title={getRouteName(Routes.WEBSITE_MENU)} />
                <BreadCrumb routes={routesInstructions()} />
                <h2 className="text-center mb-7 text-26lg text-blue font-allerbold">Cómo armar el sitio web</h2>
                {queryParam === CREATE_ACCOUNT ? (
                    <CreateAccountPayuSteps />
                ) : queryParam === ENABLE_ACCOUNT ? (
                    <EnableAccountPayuSteps />
                ) : queryParam === SYNCHRONIZE_PAYU ? (
                    <SynchronizePayuInstructions />
                ) : (
                    <>
                        <h3 className="text-base text-blue font-allerbold mb-7">{getRouteName(Routes.INSTRUCTIONS_PAYU)}</h3>
                        <div className="flex flex-wrap justify-center md:justify-between">
                            <div>
                                {stepCartElements.map(step => (
                                    <StepsCard
                                        type={step.type}
                                        key={step.url}
                                        icon={step.icon}
                                        title={step.title}
                                        url={step.url}
                                    />
                                ))}
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="instructions-payu__help-text">
                                    <p className="text-sm text-white">Preguntas frecuentes</p>
                                    <Icon name="questionGreen" className="absolute top-0 -right-9" />
                                </div>
                                <div
                                    className="instructions-payu__help-card"
                                    onClick={(): void => history.push(`${ROUTE_HELP_CENTER}definitions`)}
                                >
                                    <p className="text-sm text-center text-gray-dark">
                                        <span className="font-allerbold">Definiciones cortas</span> y claras de los términos que
                                        encontrará en la Sincronización de PayU con
                                        <span className="font-allerbold"> {PRODUCT_NAME}</span> y que usted podría no conocer
                                    </p>
                                </div>
                                <div
                                    className="instructions-payu__help-card"
                                    onClick={(): void => history.push(`${ROUTE_HELP_CENTER}contact`)}
                                >
                                    <p className="text-sm text-center text-gray-dark">
                                        <span className="font-allerbold">Acompañamiento</span> de un experto en la Sincronización
                                        de PayU con
                                        <span className="font-allerbold"> {PRODUCT_NAME} </span>para entender este módulo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {queryParam !== SYNCHRONIZE_PAYU ? (
                <PageButtonsFooter
                    {...buttonsFooterProps(
                        ModuleApp.INSTRUCTIONS,
                        history,
                        `${getRoute(Routes.INSTRUCTIONS_PAYU)}?page=${
                            !queryParam ? CREATE_ACCOUNT : queryParam === CREATE_ACCOUNT ? ENABLE_ACCOUNT : SYNCHRONIZE_PAYU
                        }`,
                        {
                            name: getRouteName(Routes.INSTRUCTIONS_PAYU),
                            moduleName: getRouteName(Routes.WEBSITE_MENU),
                        },
                        TitleButtons.NEXT_STEP
                    )}
                    titleButtonLeft={`${queryParam === ENABLE_ACCOUNT ? TitleButtons.PREV_STEP : TitleButtons.BACK}`}
                    classNameBtnLeft="px-2"
                    className="flex justify-end"
                />
            ) : (
                <PageButtonsFooter
                    {...buttonsFooterProps(ModuleApp.INSTRUCTIONS, history, handleNextRoute, {
                        name: getRouteName(Routes.WEBSITE_EDITOR),
                        moduleName: getRouteName(Routes.WEBSITE_MENU),
                    })}
                    titleButtonLeft={TitleButtons.PREV_STEP}
                    classNameBtnLeft="px-2"
                    className="flex justify-end"
                />
            )}
        </div>
    );
};

export default InstructionsPayu;
