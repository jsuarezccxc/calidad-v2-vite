import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Plan } from '@models/GeneralDashboard';
import { CommonProperty } from '@models/WebsiteNode';
import { Onboarding } from '@components/onboarding';
import { STEPS_COMPLETED_PERCENTAGE } from '@constants/Onboarding';
import { LandingHomeDiggipymes } from '@pages/home/components/landing-home-diggipymes/LandingHomeDiggipymes';
import CustomerCatalogs from '@pages/user-administration/customer-catalogs';
import ContextProvider from '@pages/home/context/LandingContext';
import { getSales } from '@redux/sales-report-sales-force/action';
import { RootState } from '@redux/rootReducer';
import { getActiveModules } from '@redux/company/actions';
import { getOnboardingInformation } from '@redux/onboarding/action';
import { getEvents } from '@redux/calendar/actions';
import { getEconomicData } from '@redux/home-landing/action';
import { getInflation } from '@redux/utils/actions';
import { getAnalyticsData } from '@redux/website/actions';
import { getCommonProperties } from '@redux/website-node/actions';
import { loginSession, setCreateAccountModal, setLoginModal } from '@redux/session/actions';
import { setModalRedirectPlans } from '@redux/menu/actions';
import { ISetModalRedirectPlans } from '@redux/menu/types';
import { getActivePlans } from '@utils/Membership';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { Calendar, ChartCard, IndicatorCards, TrafficCards, WebsiteCard, WebsiteCards } from './components';
import { getAnalyticsDates, getInitialDates, IDates, getPlan, BANNER } from '.';
import './GeneralDashboard.scss';

const GeneralDashboard: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const {
        accessToken,
        activeMemberships,
        analyticsData,
        commonProperties,
        sales,
        user,
        trm,
        inflation,
        login,
        is_administration_customer = false,
        onboardingData,
    } = useSelector(
        ({ company, salesReportSalesForce, session, websiteNode, homeLanding, website, utils, onboarding }: RootState) => ({
            ...salesReportSalesForce,
            ...company,
            ...session,
            ...websiteNode,
            ...homeLanding,
            ...website,
            ...utils,
            ...onboarding,
        })
    );

    const [dates, setDates] = useState<IDates>(getInitialDates());

    const [onboardingPrincipal, setOnboardingPrincipal] = useState<boolean>(false);

    const { current, previous, selectedMonth } = dates;

    useEffect(() => {
        setOnboardingPrincipal(
            onboardingData?.electronic_documents?.percentage !== STEPS_COMPLETED_PERCENTAGE ||
                onboardingData?.website?.percentage !== STEPS_COMPLETED_PERCENTAGE
        );
    }, [onboardingData]);

    useEffect(() => {
        if (accessToken) getData();
    }, [accessToken]);

    useEffect(() => {
        getBimonthlySales();
    }, [selectedMonth]);

    useEffect(() => {
        dispatch(getOnboardingInformation());
        getData();
    }, []);

    const goToPaymentPlans = (): ISetModalRedirectPlans => dispatch(setModalRedirectPlans());

    const getBimonthlySales = async (): Promise<void> => {
        if (current && accessToken) await Promise.all([dispatch(getSales(current)), dispatch(getSales(previous))]);
    };

    const getData = async (): Promise<void> => {
        await Promise.all([
            dispatch(getSales(current)),
            dispatch(getSales(previous)),
            dispatch(getEconomicData()),
            dispatch(getActiveModules()),
            dispatch(getCommonProperties([CommonProperty.Domain])),
            dispatch(getAnalyticsData(getAnalyticsDates(), commonProperties.domain)),
            dispatch(getInflation()),
            dispatch(getEvents()),
        ]);
    };

    const activePlans = useMemo(() => getActivePlans(activeMemberships), [activeMemberships]);

    const isWithoutPlans = !activePlans.electronicDocuments?.id && !activePlans.website?.id;

    const currentPlan = useMemo(() => getPlan(activePlans, isWithoutPlans), [activePlans]);

    const toggleRegister = (): void => {
        dispatch(setCreateAccountModal());
        dispatch(loginSession(false));
    };

    const toggleLogin = (): void => {
        dispatch(loginSession(!login));
        dispatch(setLoginModal());
    };

    const renderPlanSection = (): ReactElement => {
        if (currentPlan === Plan.Advanced) {
            return (
                <>
                    <WebsiteCard activePlan={activePlans.website} disable={isWithoutPlans} domain={commonProperties.domain} />
                    <WebsiteCards data={analyticsData} disable={isWithoutPlans} />
                </>
            );
        }

        return (
            <>
                <ChartCard
                    sales={sales[current]}
                    selectedMonth={selectedMonth}
                    updateSelectedMonth={({ value }): void => setDates(getInitialDates(value))}
                    disable={isWithoutPlans}
                />
                <TrafficCards disable={isWithoutPlans} sales={sales} dates={dates} />
            </>
        );
    };

    if (accessToken && is_administration_customer) {
        return <CustomerCatalogs />;
    }

    if (accessToken) {
        return (
            <>
                <div className="general-dashboard">
                    <main className="flex-1">
                        <IndicatorCards goToPaymentPlans={goToPaymentPlans} inflation={inflation} marketRate={trm} user={user} />
                        {onboardingPrincipal && (
                            <>
                                <Onboarding
                                    principalOnboarding
                                    setToggleOnboarding={setOnboardingPrincipal}
                                    hasWebsite={
                                        onboardingData?.website &&
                                        onboardingData?.website?.percentage !== STEPS_COMPLETED_PERCENTAGE
                                    }
                                    hasElectronicDocuments={
                                        onboardingData?.electronic_documents &&
                                        onboardingData?.electronic_documents?.percentage !== STEPS_COMPLETED_PERCENTAGE
                                    }
                                />
                            </>
                        )}
                        <div className="flex flex-col lg:flex-row mt-4.5 gap-4.5">
                            {BANNER[currentPlan](goToPaymentPlans)}
                            <Calendar />
                        </div>
                        <div
                            className={`general-dashboard__lower-cards ${
                                currentPlan === Plan.Advanced ? '' : 'general-dashboard__lower-cards--hight'
                            }`}
                        >
                            {renderPlanSection()}
                        </div>
                    </main>
                    <button
                        id={generateId({
                            module: ModuleApp.DASHBOARD,
                            action: ActionElementType.BACK,
                            elementType: ElementType.BTN,
                        })}
                        type="button"
                        className="general-dashboard__back-button"
                        onClick={(): void => history.goBack()}
                    >
                        Atrás
                    </button>
                </div>
            </>
        );
    }

    return (
        <ContextProvider>
            <LandingHomeDiggipymes toggleAccount={toggleRegister} toggleLogin={toggleLogin} />
        </ContextProvider>
    );
};

export default GeneralDashboard;
