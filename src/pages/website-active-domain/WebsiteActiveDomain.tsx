import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
import { Source } from '@constants/Onboarding';
import { WEBSITE_DESIGN_AND_ADMINISTRATION } from '@constants/WebsiteNode';
import { ACTIVE_SUBDOMAIN, MainStepSelection, REQUIRED_SUBDOMAIN, SubStepSelection } from '@constants/Domain';
import { lengthGreaterThanZero } from '@utils/Length';
import { getRoute } from '@utils/Paths';
import { ModuleApp } from '@utils/GenerateId';
import { RootState } from '@redux/rootReducer';
import { getInformationCompany } from '@redux/company/actions';
import { getCommonProperties, upsertCommonProperty } from '@redux/website-node/actions';
import { setTypeDomain } from '@redux/domain/actions';
import useOnboardingNavigation from '@hooks/useOnboardingNavigation';
import { CommonProperty } from '@models/WebsiteNode';
import { ConnectDomain, CurrentStepDomain, StepsActiveDomain, SummaryDomain, WelcomeActiveDomain } from './components';
import {
    COMMON_PROPERTIES,
    getDomainProps,
    routes,
    STEPS_DOMAIN,
    STEP_CONGRATS_DOMAIN,
    STEP_CONNECT_DOMAIN,
    STEP_SELECT_DOMAIN,
} from '.';
import './WebsiteActiveDomain.scss';

const WebsiteActiveDomain: React.FC = () => {
    const [dispatch, history] = [useDispatch(), useHistory()];
    const {
        domain: { typeDomain, stepsCompleted },
        websiteNode: { commonProperties },
    } = useSelector((state: RootState) => state);
    const [ownDomain, setOwnDomain] = useState<string>('');
    const [mainStep, setMainStep] = useState<MainStepSelection | null>(null);
    const [subStep, setSubStep] = useState<SubStepSelection>(0);
    const [newDomain, setNewDomain] = useState<string>('');
    const [emptyDomain, setEmptyDomain] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [invalidDomain, setInvalidDomain] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [isVerifiedParent, setIsVerifiedParent] = useState(false);
    const [isEditActionModal, setIsEditActionModal] = useState(false);
    const [newDomainEdit, setNewDomainEdit] = useState('');
    const [isRedirectDomain, setIsRedirectDomain] = useState(false);

    const { domain, hostedZone, isDomain } = useMemo(() => getDomainProps(commonProperties), [commonProperties]);
    const subdomain = isDomain ? '' : domain;

    const { handlePostConfirmation } = useOnboardingNavigation(Source.Website);

    useEffect(() => {
        getInitialData();
        handleLoadStep();
    }, []);

    useEffect(() => {
        if (isDomain) setOwnDomain(domain);
    }, [domain]);

    useEffect(() => {
        if (typeDomain === MainStepSelection.OWN_DOMAIN) setMainStep(typeDomain as MainStepSelection);
    }, []);

    const getInitialData = async (): Promise<void> => {
        await Promise.all([dispatch(getInformationCompany()), dispatch(getCommonProperties(COMMON_PROPERTIES))]);
    };

    const handleLoadStep = (): void => {
        if (stepsCompleted.length < 3 && lengthGreaterThanZero(stepsCompleted)) {
            typeDomain && handleMainStep(typeDomain as MainStepSelection);
            const lastSubstepCompleted = stepsCompleted[stepsCompleted.length - 1];
            handleSubStep(lastSubstepCompleted);
        }
    };

    const handleMainStep = (step: MainStepSelection | null): void => {
        dispatch(setTypeDomain(step || ''));
        setMainStep(step);
    };

    const handleSubStep = (step: SubStepSelection): void => {
        setSubStep(step);
    };

    const handleRedirectConnectDomain = (isDomain: boolean): void => {
        if (isDomain) {
            handleMainStep(MainStepSelection.DIGGIPYMES_DOMAIN);
        } else {
            handleMainStep(MainStepSelection.OWN_DOMAIN);
            handleSubStep(SubStepSelection.CONNECT_DOMAIN);
        }
        setIsRedirectDomain(true);
    };

    const changePage = (): void => {
        handlePostConfirmation(history.push(getRoute(Routes.WEBSITE_EDITOR)));
    };

    const handleBackButton = (): void => {
        const initDomain = !ownDomain && !subdomain && !mainStep;
        const isDiggipymesDomain = !subdomain && mainStep === MainStepSelection.DIGGIPYMES_DOMAIN;

        if (isDiggipymesDomain || (ownDomain && !mainStep)) {
            history.push(getRoute(Routes.WEBSITE_DASHBOARD));
            return;
        }

        if (initDomain || (subdomain && !mainStep)) {
            history.goBack();
            return;
        }

        if (mainStep === MainStepSelection.OWN_DOMAIN) {
            switch (subStep) {
                case SubStepSelection.OPTIONS_OWN_DOMAIN:
                    handleMainStep(MainStepSelection.WELCOME);
                    handleSubStep(SubStepSelection.OPTIONS_OWN_DOMAIN);
                    return;
                case SubStepSelection.CONNECT_DOMAIN:
                    handleMainStep(MainStepSelection.OWN_DOMAIN);
                    handleSubStep(SubStepSelection.OPTIONS_OWN_DOMAIN);
                    return;
                case SubStepSelection.CONFIG_DNS:
                    handleMainStep(MainStepSelection.OWN_DOMAIN);
                    handleSubStep(SubStepSelection.CONNECT_DOMAIN);
                    return;
                case SubStepSelection.ACTIVE_DOMAIN:
                    handleMainStep(MainStepSelection.OWN_DOMAIN);
                    handleSubStep(SubStepSelection.CONFIG_DNS);
                    return;
                case SubStepSelection.CONGRATULATIONS:
                    handleMainStep(MainStepSelection.OWN_DOMAIN);
                    handleSubStep(SubStepSelection.ACTIVE_DOMAIN);
                    return;
                default:
                    handleMainStep(MainStepSelection.OWN_DOMAIN);
                    handleSubStep(subStep - 1);
                    return;
            }
        }

        return history.push(getRoute(Routes.WEBSITE_DASHBOARD));
    };

    const handleNextButton = (): void => {
        if (typeDomain === MainStepSelection.OWN_DOMAIN && !newDomain) {
            setEmptyDomain(true);
            return;
        }

        if (typeDomain === MainStepSelection.OWN_DOMAIN && !newDomain && !isConnected) {
            setInvalidDomain(true);
            return;
        }

        if (typeDomain === MainStepSelection.DIGGIPYMES_DOMAIN && !url) {
            setMessage(REQUIRED_SUBDOMAIN);
            return;
        }

        if (typeDomain === MainStepSelection.DIGGIPYMES_DOMAIN && !isVerifiedParent) {
            setMessage(ACTIVE_SUBDOMAIN);
            return;
        }

        setEmptyDomain(false);
        const initDomain = !ownDomain && !subdomain && !mainStep;
        const isCongratulationScreen = mainStep === MainStepSelection.OWN_DOMAIN && subStep === SubStepSelection.CONGRATULATIONS;
        const isDiggipymesDomain = !subdomain && mainStep === MainStepSelection.DIGGIPYMES_DOMAIN;
        const hasDomain = (ownDomain || subdomain) && !mainStep;

        if (initDomain || isCongratulationScreen || isDiggipymesDomain || hasDomain) changePage();

        if (mainStep === MainStepSelection.OWN_DOMAIN) {
            switch (subStep) {
                case SubStepSelection.OPTIONS_OWN_DOMAIN:
                    handleMainStep(MainStepSelection.OWN_DOMAIN);
                    handleSubStep(SubStepSelection.CONNECT_DOMAIN);
                    return;
                case SubStepSelection.CONNECT_DOMAIN:
                    handleMainStep(MainStepSelection.OWN_DOMAIN);
                    handleSubStep(SubStepSelection.CONFIG_DNS);
                    return;
                case SubStepSelection.CONFIG_DNS:
                    handleMainStep(MainStepSelection.OWN_DOMAIN);
                    handleSubStep(SubStepSelection.ACTIVE_DOMAIN);
                    return;
                case SubStepSelection.ACTIVE_DOMAIN:
                    handleMainStep(MainStepSelection.OWN_DOMAIN);
                    handleSubStep(SubStepSelection.CONGRATULATIONS);
                    return;
                default:
                    handleMainStep(MainStepSelection.OWN_DOMAIN);
                    handleSubStep(subStep + 1);
                    return;
            }
        }

        return changePage();
    };

    const updateSecurityDomain = async (domain: string): Promise<void> => {
        await dispatch(upsertCommonProperty(CommonProperty.Domain, domain));
    };

    const renderCurrentStep = (mainStep: MainStepSelection | null, currentSubStep: SubStepSelection): React.ReactElement => {
        if ((newDomainEdit || ownDomain || subdomain) && !isRedirectDomain)
            return (
                <SummaryDomain
                    domain={ownDomain}
                    subdomain={subdomain}
                    commonProperties={commonProperties}
                    handleAction={handleRedirectConnectDomain}
                    updateSecurityDomain={updateSecurityDomain}
                    setIsEditActionModal={setIsEditActionModal}
                    isEditActionModal={isEditActionModal}
                    setNewDomainEdit={setNewDomainEdit}
                />
            );
        if (mainStep === MainStepSelection.OWN_DOMAIN && currentSubStep === SubStepSelection.OPTIONS_OWN_DOMAIN)
            return <StepsActiveDomain handleSelectSubStep={handleSubStep} stepsCompleted={stepsCompleted} />;
        if (mainStep === MainStepSelection.OWN_DOMAIN && currentSubStep > SubStepSelection.OPTIONS_OWN_DOMAIN)
            return (
                <CurrentStepDomain
                    domain={ownDomain}
                    subdomain={subdomain}
                    hostedZone={hostedZone}
                    commonProperties={commonProperties}
                    currentSubStep={subStep}
                    updateSecurityDomain={updateSecurityDomain}
                    newDomain={newDomain}
                    setNewDomain={setNewDomain}
                    emptyDomain={emptyDomain}
                    setEmptyDomain={setEmptyDomain}
                    isConnected={isConnected}
                    setIsConnected={setIsConnected}
                    invalidDomain={invalidDomain}
                    setInvalidDomain={setInvalidDomain}
                />
            );

        if (mainStep === MainStepSelection.DIGGIPYMES_DOMAIN)
            return (
                <ConnectDomain
                    commonProperties={commonProperties}
                    domain={domain}
                    isDomain={isDomain}
                    currentSubdomain={subdomain}
                    updateSecurityDomain={updateSecurityDomain}
                    url={url}
                    setUrl={setUrl}
                    message={message}
                    setMessage={setMessage}
                    setIsVerifiedParent={setIsVerifiedParent}
                />
            );

        if (
            (!ownDomain && !subdomain && !mainStep) ||
            (mainStep === MainStepSelection.WELCOME && currentSubStep === SubStepSelection.OPTIONS_OWN_DOMAIN)
        )
            return <WelcomeActiveDomain handleSelectOption={handleMainStep} />;

        return <></>;
    };

    return (
        <div className="website-active-domain">
            <PageTitle title={WEBSITE_DESIGN_AND_ADMINISTRATION} classContainer="title__container" />
            <BreadCrumb routes={routes(domain)} />
            <div className="container__views">{renderCurrentStep(mainStep, subStep)}</div>
            <div>
                <PageButtonsFooter
                    moduleId={ModuleApp.WEBSITE}
                    bgColorLeftButton="white"
                    classNameBtnLeft="px-2"
                    className="flex justify-end"
                    titleButtonLeft={
                        subStep === STEP_CONNECT_DOMAIN || subStep === STEP_SELECT_DOMAIN
                            ? TitleButtons.BACK
                            : TitleButtons.PREV_STEP
                    }
                    titleButtonRight={
                        STEPS_DOMAIN.includes(subStep) ||
                        (subStep === STEP_CONGRATS_DOMAIN && mainStep === MainStepSelection.OWN_DOMAIN)
                            ? TitleButtons.NEXT
                            : TitleButtons.NEXT_STEP
                    }
                    onClickButtonLeft={(): void => handleBackButton()}
                    onClickButtonRight={(): void => handleNextButton()}
                />
            </div>
        </div>
    );
};

export default WebsiteActiveDomain;
