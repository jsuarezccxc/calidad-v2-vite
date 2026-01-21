import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RootState } from '@redux/rootReducer';
import { getActiveModules } from '@redux/company/actions';
import { setPlanWebsiteActive } from '@redux/membership/actions';
import { getOnboardingInformation, updateOnboardingFinalModal } from '@redux/onboarding/action';
import { getCommonProperties, getWebsites } from '@redux/website-node/actions';
import { PageTitle } from '@components/page-title';
import { Information } from '@components/information';
import { SharedModal } from '@components/modal';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { Onboarding } from '@components/onboarding';
import { WEBSITE_AND_VIRTUAL_STORE } from '@constants/Memberships';
import { COMPLETION_MODAL_CONTENT } from '@constants/Onboarding';
import { Routes } from '@constants/Paths';
import { VARIABLE_TYPE } from '@constants/DataTypes';
import { SUBTITLE_WEBSITE_DASHBOARD, WEBSITE_DESIGN_AND_ADMINISTRATION } from '@constants/WebsiteNode';
import useModalController from '@hooks/useModalController';
import useOnboardingCore from '@hooks/useOnboardingCore';
import { CommonProperty } from '@models/WebsiteNode';
import { buttonsFooterProps } from '@utils/Button';
import { getRoute, getRouteName } from '@utils/Paths';
import { ModuleApp } from '@utils/GenerateId';
import { WebsiteCard } from './components';
import { CURRENT_WEBSITE, ZERO_PERCENTAGE } from '.';
import './WebsiteDashboard.scss';

const WebsiteDashboard: React.FC = () => {
    const [dispatch, history] = [useDispatch(), useHistory()];
    const { activeMemberships } = useSelector(({ company }: RootState) => company);
    const { planWebsiteActive } = useSelector(({ membership }: RootState) => membership);
    const { user } = useSelector(({ session }: RootState) => session);
    const { websites, commonProperties } = useSelector(({ websiteNode }: RootState) => websiteNode);
    const onboarding = useSelector(({ onboarding }: RootState) => onboarding.onboardingData.website);
    const currentWebsite = websites?.find((_, index) => index === CURRENT_WEBSITE) || null;
    const { isModalOpen, toggleModal } = useModalController();
    const { hasFinishedAllSteps, incompleteSteps, isNearFinalStep, isOnboardingVisible, toggleOnboarding } = useOnboardingCore(
        onboarding
    );

    useEffect(() => {
        Promise.all([
            dispatch(getOnboardingInformation()),
            dispatch(getActiveModules()),
            dispatch(getWebsites()),
            dispatch(getCommonProperties([CommonProperty.Domain])),
        ]);
    }, []);
    useEffect(() => {
        let idSubModule = 0;
        let planModule = '';
        if (activeMemberships.length) {
            const activePlan = activeMemberships
                .flatMap(item => item.modules)
                .filter(module => module.name === WEBSITE_AND_VIRTUAL_STORE)
                .flatMap(subModule => subModule.membership_submodules)
                .filter(plan => {
                    if (plan.sub_module_id > idSubModule) {
                        idSubModule = plan.sub_module_id;
                        planModule = plan.name;
                        return plan;
                    }
                })
                .find(namePlan => namePlan.name === planModule)?.name;
            dispatch(setPlanWebsiteActive(activePlan));
        }
    }, [activeMemberships]);
    useEffect(() => {
        if (hasFinishedAllSteps) toggleModal();
    }, [hasFinishedAllSteps]);
    const handleRedirect = (path: Routes | string, openWindow = false): void => {
        if (!openWindow && typeof path !== VARIABLE_TYPE.STRING) return history.push(getRoute(path as Routes));
        window.open(`https://${path}`, '_blank');
    };

    return (
        <div className="website-dashboard">
            {onboarding.percentage != ZERO_PERCENTAGE ? (
                <PageTitle title={WEBSITE_DESIGN_AND_ADMINISTRATION} classContainer="title-screen" />
            ) : (
                <p className="mt-12 text-26lg mb-7 text-blue">
                    ¡Bienvenido/a, <br />
                    {user?.name}!
                </p>
            )}
            {isOnboardingVisible && (
                <Onboarding
                    module={onboarding.module}
                    percentage={onboarding.percentage}
                    steps={incompleteSteps}
                    setToggleOnboarding={toggleOnboarding}
                    isNearFinalStep={isNearFinalStep}
                />
            )}
            {isNearFinalStep && (
                <>
                    <Information title={SUBTITLE_WEBSITE_DASHBOARD} color="blue" classNameContainer="mt-4.5" />
                    <div className="website-dashboard__card-container">
                        {currentWebsite && (
                            <WebsiteCard
                                plan={planWebsiteActive || ''}
                                website={currentWebsite}
                                domain={commonProperties?.domain || ''}
                                handleRedirect={handleRedirect}
                            />
                        )}
                    </div>
                    <div className="website-dashboard__footer-container">
                        <PageButtonsFooter
                            bgColorLeftButton="white"
                            {...buttonsFooterProps(ModuleApp.WEBSITE, history, getRoute(Routes.WEBSITE_ACTIVE_DOMAIN), {
                                name: getRouteName(Routes.WEBSITE_MENU),
                                moduleName: getRouteName(Routes.WEBSITE_MENU),
                            })}
                        />
                    </div>
                </>
            )}
            {isModalOpen && !onboarding?.status_modal_website && (
                <SharedModal
                    moduleId={ModuleApp.WEBSITE}
                    text={COMPLETION_MODAL_CONTENT}
                    finalAction={(): void => {
                        dispatch(updateOnboardingFinalModal(true));
                        toggleModal();
                    }}
                    open
                />
            )}
        </div>
    );
};
export default WebsiteDashboard;
