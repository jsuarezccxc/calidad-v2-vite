import 'react-color-palette/lib/css/styles.css';
import 'suneditor/dist/css/suneditor.min.css';

import React, { useEffect, Suspense, useMemo, useState, useRef, useCallback } from 'react';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import { Switch, Redirect, useLocation, useHistory } from 'react-router-dom';
import { PublicRoute, PrivateRoute } from 'react-private-public-route';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';

/** views **/
import usePermissions from '@hooks/usePermissions';
import { useNotificationPlan } from '@hooks/useNotificationPlan';
import { useClassesApp } from '@hooks/useClassesApp';
import Footer from '@components/footer';
import { Header } from '@components/header';
import { Banner } from '@components/banner';
import { ModalType } from '@components/modal';
import { CRM, OperationsTable } from '@components/operations-table';
import FreeMonthDisclaimer from '@components/free-month-disclaimer/FreeMonthDisclaimer';
import { ModalMigrationAccount } from '@components/modal-migration-account';
import { ModalCodesBadRequest, ModalCustom, UnauthorizedModal } from '@components/modal-custom';
import { PageMaintenance } from '@components/page-maintenance';
import { PlanNotifications } from '@components/plan-notification';
import LoginModals from '@components/login-modals/LoginModals';
import { TopProgressBar } from '@components/loader';
import { IPath } from '@models/Paths';
import { IGenericRecord } from '@models/GenericRecord';
import ChangePassword from '@pages/change-password';
import Login from '@pages/login';
import CreateAccount from '@pages/create-account';
import AccountCreated from '@pages/account-created';
import { ModalExpirationPlan } from '@pages/home/components/modal-expiration-plan';
import { getSubmodules, IModalNotificationPlanState, WEBSITE_ID } from '@pages/payment-plan';
import { ZERO } from '@pages/website-editor';
import { LandingHomeDiggipymes } from '@pages/home/components/landing-home-diggipymes/LandingHomeDiggipymes';
import { RootState } from '@redux/rootReducer';
import { getContingency } from '@redux/contingency/actions';
import { getActiveModules, getDocumentTypes, setDateMembership } from '@redux/company/actions';
import {
    getActiveMaintenance,
    getHasSeenModal,
    setCloseMaintenanceModal,
    updateViewModalMaintenance,
} from '@redux/maintenance/actions';
import { clearSession, setAuthorizationModal, setExpirationPlan, setLastNotificationPlanDate } from '@redux/session/actions';
import { postReactivePayment, setMembershipSelected } from '@redux/membership/actions';
import { setSelectedSupplier } from '@redux/suppliers/actions';
import { getNumberNotifications } from '@redux/notifications/actions';
import { setModalRedirectPlans } from '@redux/menu/actions';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { membershipDaysAvailable } from '@utils/Membership';
import { differenceDateExpirationDate, getUnix } from '@utils/Date';
import { getRoute } from '@utils/Paths';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { INFORMATION_TEXT } from '@information-texts/BannerInvoice';
import { EXPIRED_SESSION, MAINTENANCE_NOTIFICATION } from '@information-texts/UserManagement';
import { ZERO_DAYS, KEY_MODULES } from '@constants/Memberships';
import { STRING_TRUE } from '@constants/UtilsConstants';
import { MODAL_BAD_REQUEST } from '@constants/StatusCodes';
import { PATHS, Routes } from '@constants/Paths';
import { ContingencyState } from '@constants/ContingencyActivation';
import { CONTENT_SECURITY_POLICY, PERMISSIONS_POLICY, REFERRER_POLICY } from '@constants/Security';

/**
 * Main component of application
 *
 * @returns Element with the structure base
 */
const App: React.FC = (): React.ReactElement => {
    const dispatch = useDispatch();
    const { pathname, search } = useLocation();
    const freeModule = 'FREE';
    const freeMembershipIndex = 0;
    //This constant is temporary to hide free month banner and upgrade plan
    const showFreeMonthDisclaimer = false;
    const isWebsitePage: boolean = pathname === getRoute(Routes.WEBSITE_EDITOR) && !search;

    const history = useHistory();

    const {
        accessToken,
        expirationTime,
        authorizationModal = false,
        createAccountModal,
        accountCreatedModal,
        comesAccountCreated,
        comesCreateAccount,
        expirationPlan,
        lastNotificationShown,
        membership_selected,
        information,
        dateMembership,
        activeMemberships,
        membershipWebsiteDetails,
        activeMaintenance,
        showModal,
        dateMantenance,
        startTime,
        endTime,
        maintenanceId,
        is_administration_customer,
        contingency,
    } = useSelector(({ session, membership, company, maintenance, contingency }: RootState) => ({
        ...session,
        ...membership,
        ...company,
        ...maintenance,
        ...contingency,
    }));

    const { validateAccessUrl } = usePermissions();
    const { getCurrentNotification } = useNotificationPlan();
    const { bodyAppClasses, wrapperClasses, footerClasses } = useClassesApp();
    const [haveMembership, setHaveMembership] = useState<boolean>(lengthEqualToZero(information?.active_memberships || []));
    const [hasFreeMonth, setHasFreeMonth] = useState<IGenericRecord[]>([]);
    const [hasSevenDaysYear, setHasSevenDaysYear] = useState<IGenericRecord | null>(null);
    const [moduleNameFree, setModuleNameFree] = useState<string>('');
    const [moduleNameYear, setModuleNameYear] = useState<string>('');
    const [countFreeMonth, setCountFreeMonth] = useState<number>(0);
    const [countMembershipExpired, setCountMembershipExpired] = useState<number>(0);
    const [expiredSession, setExpiredSession] = useState<boolean>(false);
    const [expirationPlanModal, setExpirationPlanModal] = useState<boolean>(false);
    const [idPlanSelected, setIdPlanSelected] = useState<string>('');
    const [openModalMigration, setOpenModalMigration] = useState<boolean>(false);
    const [showModalCodeBadRequest, setShowModalCodeBadRequest] = useState(false);
    const [expired, setExpired] = useState(false);
    const [notifyPlanState, setNotifyPlanState] = useState<IGenericRecord>({
        rememberRenewal: false,
        rememberAutorenewal: false,
        confirmRenewal: false,
        countExpiration: false,
        expirationToday: false,
        expiredPlan: false,
        activateRenewal: false,
        successActiveRenewal: false,
    });

    const expirationRef = useRef<NodeJS.Timeout | null>(null);

    const clientInvoice: boolean =
        pathname === PATHS[Routes.INVOICE_SUMMARY].route || pathname == PATHS[Routes.REJECT_INVOICE].route;

    const activePlans = useMemo(() => getSubmodules(activeMemberships), [activeMemberships]);

    const isContingencyActivate = useMemo<boolean>(
        () => !!accessToken && !is_administration_customer && contingency.status === ContingencyState.InProgress,
        [accessToken, is_administration_customer, contingency]
    );

    const handleOpenModalMigration = useCallback(() => {
        setOpenModalMigration(!openModalMigration);
    }, [openModalMigration]);

    useEffect(() => {
        ((): void => {
            dispatch(getNumberNotifications());
        })();

        const intervalId = setInterval(() => {
            dispatch(getNumberNotifications());
        }, 240000);

        return (): void => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (!membershipWebsiteDetails?.expiration_date) return;

        verifyExpirationDate(membershipWebsiteDetails.expiration_date, true);

        if (!expirationRef.current) {
            expirationRef.current = setInterval(() => {
                handleShowExpirationPlanModal();
            }, 7200000);
        }

        return (): void => {
            if (expirationRef.current) {
                clearInterval(expirationRef.current);
                expirationRef.current = null;
            }
        };
    }, [membershipWebsiteDetails]);

    useEffect(() => {
        setShowModalCodeBadRequest(false);
        dispatch(getDocumentTypes());
        localStorage.removeItem(MODAL_BAD_REQUEST);
        if (accessToken) dispatch(getContingency());
    }, [accessToken]);

    useEffect(() => {
        membership_selected?.length &&
            setHasFreeMonth(
                membership_selected?.filter(
                    (membership: IGenericRecord) =>
                        membership?.payment_method === freeModule && membership?.is_first_payment && membership.is_active
                )
            );
        membership_selected?.length &&
            setHasSevenDaysYear(
                membership_selected?.find(
                    (membership: IGenericRecord) =>
                        membership?.payment_method !== freeModule && !membership?.is_frequent_payment && membership.is_active
                ) || null
            );
    }, [membership_selected]);

    useEffect(() => {
        if (hasSevenDaysYear) {
            const now = new Date();
            const expirationDate = new Date(hasSevenDaysYear?.expiration_date);
            const RemainingDays = Number(differenceDateExpirationDate(now.getTime(), expirationDate.getTime()));
            RemainingDays <= 7 && setCountMembershipExpired(RemainingDays);

            hasSevenDaysYear?.modules?.forEach((module: IGenericRecord) => {
                switch (module?.name) {
                    case KEY_MODULES[1]:
                        setModuleNameYear(KEY_MODULES[1]);
                        break;
                    case KEY_MODULES[2]:
                        setModuleNameYear(KEY_MODULES[2]);
                        break;
                    case KEY_MODULES[4]:
                        setModuleNameYear(KEY_MODULES[4]);
                        break;
                    default:
                        break;
                }
            });
        }
    }, [hasSevenDaysYear]);

    useEffect(() => {
        dispatch(getActiveModules());
    }, [dateMembership]);

    useEffect(() => {
        dispatch(setMembershipSelected(activeMemberships));
        handleNavigationUrl();
    }, [activeMemberships]);

    useEffect(() => {
        if (localStorage.getItem(MODAL_BAD_REQUEST) == STRING_TRUE) setShowModalCodeBadRequest(true);
    }, [localStorage.getItem(MODAL_BAD_REQUEST)]);

    useEffect(() => {
        hasFreeMonth[freeMembershipIndex]?.modules?.forEach((module: IGenericRecord) => {
            switch (module?.name) {
                case KEY_MODULES[1]:
                    setModuleNameFree(KEY_MODULES[1]);
                    break;
                case KEY_MODULES[2]:
                    setModuleNameFree(KEY_MODULES[2]);
                    break;
                case KEY_MODULES[4]:
                    setModuleNameFree(KEY_MODULES[4]);
                    break;
                default:
                    break;
            }
        });
        setCountFreeMonth(
            membershipDaysAvailable(
                typeof hasFreeMonth[freeMembershipIndex]?.expiration_date === 'string'
                    ? getUnix(new Date(hasFreeMonth[freeMembershipIndex]?.expiration_date))
                    : hasFreeMonth[freeMembershipIndex]?.expiration_date
            )
        );
    }, [hasFreeMonth]);

    useEffect(() => {
        setHaveMembership(lengthEqualToZero(information?.active_memberships || []));
        if (dateMembership !== new Date().toLocaleDateString()) {
            dispatch(setDateMembership(new Date().toLocaleDateString()));
        }
    }, [information]);

    useEffect(() => {
        handleNavigationUrl();
        if (pathname !== getRoute(Routes.GENERATE_SUPPORT_DOCUMENT) && pathname !== getRoute(Routes.GENERATE_PURCHASE_INVOICE))
            dispatch(setSelectedSupplier({ id: '', name: '', personId: '' }));
    }, [pathname]);

    useEffect(() => {
        expirationPlanModal && expirationPlan <= 3 && dispatch(setExpirationPlan());
    }, [expirationPlanModal]);

    useEffect(() => {
        const currentPlan = activePlans?.find(plan => plan.membership_modules_id === WEBSITE_ID && plan.is_active);

        if (!currentPlan || !lastNotificationShown) return;
        setIdPlanSelected(currentPlan.id);

        const notification = getCurrentNotification(currentPlan, lastNotificationShown);
        if (!notification) return;
        handleShowNotificationPlanState(notification.modal);
        dispatch(setLastNotificationPlanDate(notification.data));
    }, [activePlans]);

    const handleNavigationUrl = (): void => {
        dispatch(getActiveMaintenance());
        if (accessToken) {
            dispatch(getHasSeenModal());
            const permissionsAccessUrl = validateAccessUrl(pathname);
            if (!permissionsAccessUrl) {
                history.push(getRoute(Routes.HOME));
            }
        }
    };

    const handleShowExpirationPlanModal = (): void => {
        setExpirationPlanModal(prev => !prev);
    };

    const verifyExpirationDate = (date: string, showModal: boolean): boolean => {
        const currentDate = new Date();
        const [year, month, day] = date.split('-').map(Number);
        const expirationDate = new Date(year, month - 1, day);

        const diffTime = expirationDate.getTime() - currentDate.getTime();

        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1 && showModal) handleShowExpirationPlanModal();
        return diffDays <= 1;
    };

    const verifyExpirationToken = (date: number): void => {
        if (expired) return;
        const currentDate = new Date();
        const expirationDate = new Date(date * 1000);

        const diffTime = expirationDate.getTime() - currentDate.getTime();
        if (diffTime <= ZERO) {
            handleShowExpiredSession();
            setExpired(true);
            return;
        }

        setTimeout((): void => handleShowExpiredSession(), diffTime);
    };

    const handleShowNotificationPlanState = (type: string): void => {
        setNotifyPlanState(prev => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const paths = useMemo(() => Object.values(PATHS).map(path => path.route), []);

    const handleShowExpiredSession = (): void => {
        setExpiredSession(prev => !prev);
    };

    const handleExpiredSession = (): void => {
        dispatch(clearSession());
        handleShowExpiredSession();
    };
    const handleRenewalPlan = (): void => {
        dispatch(setModalRedirectPlans());
        handleShowExpirationPlanModal();
    };

    const handleRedirect = (route: string): void => {
        history.push(route);
    };

    const handleReactivatePlanUser = async (): Promise<void> => {
        const moduleId = activePlans?.find((plan: IGenericRecord) => plan.id === idPlanSelected)?.membership_has_modules_id || '';
        if (!moduleId) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await dispatch(
            postReactivePayment({
                module_id: moduleId,
            })
        );
        if (response) {
            dispatch(getActiveModules());
            handleShowNotificationPlanState(IModalNotificationPlanState.ACTIVATE_RENEWAL);
            handleShowNotificationPlanState(IModalNotificationPlanState.SUCCESS_ACTIVE_RENEWAL);
        }
    };

    const handleCloseModalMaintenance = (): void => {
        if (maintenanceId) {
            dispatch(updateViewModalMaintenance(maintenanceId));
        } else {
            dispatch(setCloseMaintenanceModal());
        }
    };

    const shouldShowFreeMonthDisclaimer = (): boolean =>
        (accessToken && countFreeMonth > ZERO_DAYS && lengthGreaterThanZero(hasFreeMonth)) || (!!haveMembership && !!accessToken);

    const shouldShowExpiredMembershipDisclaimer = (): boolean => !!accessToken && countMembershipExpired > ZERO_DAYS;

    accessToken && expirationTime && verifyExpirationToken(expirationTime);

    if (activeMaintenance) return <PageMaintenance />;

    if (pathname === PATHS[Routes.CHANGE_PASSWORD].route)
        return (
            <PublicRoute
                key={PATHS[Routes.CHANGE_PASSWORD].route}
                exact
                path={PATHS[Routes.CHANGE_PASSWORD].route}
                component={ChangePassword}
            />
        );

    const isCrmRoute = window.location.pathname.includes(CRM);

    return (
        <>
            {accessToken && showModal && (
                <ModalCustom
                    id={generateId({
                        module: ModuleApp.HOME,
                        submodule: 'maintenance-notification',
                        action: ActionElementType.INFO,
                        elementType: ElementType.MDL,
                    })}
                    closeIcon={false}
                    classesModal="modal-maintenance"
                    classesWrapper="modal-maintenance"
                    show={showModal}
                    showModal={handleCloseModalMaintenance}
                >
                    {MAINTENANCE_NOTIFICATION.DIGGI_PYMES_MAINTENANCE(
                        dateMantenance,
                        startTime,
                        endTime,
                        handleCloseModalMaintenance
                    )}
                </ModalCustom>
            )}
            <TopProgressBar />
            <Helmet>
                <meta name="referrer" content={REFERRER_POLICY} />
                <meta httpEquiv="Permissions-Policy" content={PERMISSIONS_POLICY} />
                <meta httpEquiv="Content-Security-Policy" content={CONTENT_SECURITY_POLICY} />
            </Helmet>
            {accessToken && (comesAccountCreated || comesCreateAccount) ? (
                <div className="h-full overflow-y-scroll bg-gray-background ">
                    <LandingHomeDiggipymes />
                </div>
            ) : (
                <div className="flex flex-col flex-1 container-fluid font-aller">
                    {/* <TranslateButton /> */}
                    {!clientInvoice && accessToken && <Header />}
                    {showFreeMonthDisclaimer && (
                        <>
                            {shouldShowFreeMonthDisclaimer() && (
                                <div className="flex justify-end">
                                    <FreeMonthDisclaimer
                                        haveMembership={haveMembership}
                                        hasFreeMonth={
                                            hasFreeMonth && lengthGreaterThanZero(hasFreeMonth)
                                                ? hasFreeMonth[freeMembershipIndex]
                                                : false
                                        }
                                        finishFreeMonth={false}
                                        moduleName={moduleNameFree}
                                        countFreeMonth={countFreeMonth}
                                    />
                                </div>
                            )}
                            {shouldShowExpiredMembershipDisclaimer() && (
                                <div className="flex justify-end">
                                    <FreeMonthDisclaimer
                                        moduleName={moduleNameYear}
                                        countMembershipExpired={countMembershipExpired}
                                    />
                                </div>
                            )}
                        </>
                    )}
                    <div className={`${accessToken ? 'flex relative flex-1' : 'h-full'}`}>
                        {accessToken && !clientInvoice && <OperationsTable />}
                        {accessToken && (
                            <ModalType
                                moduleId={`${ModuleApp.HOME}-expired-session-notification`}
                                open={expiredSession}
                                handleClosed={handleExpiredSession}
                                finalAction={handleExpiredSession}
                                iconName="alertMulticolor"
                                text={{
                                    title: EXPIRED_SESSION.TITLE,
                                    description: EXPIRED_SESSION.DESCRIPTION,
                                }}
                                textButton={EXPIRED_SESSION.BUTTON}
                            />
                        )}
                        {accessToken &&
                            membershipWebsiteDetails &&
                            verifyExpirationDate(membershipWebsiteDetails.expiration_date, false) && (
                                <ModalExpirationPlan
                                    show={expirationPlanModal}
                                    showModal={handleShowExpirationPlanModal}
                                    handleMainAction={handleRenewalPlan}
                                    remembered={expirationPlan >= 3}
                                />
                            )}

                        <PlanNotifications
                            notifyPlanState={notifyPlanState}
                            handleShowNotificationPlanState={handleShowNotificationPlanState}
                            handleRedirect={handleRedirect}
                            activePlans={activePlans}
                            idPlanSelected={idPlanSelected}
                            handleReactivatePlanUser={handleReactivatePlanUser}
                        />
                        <div id="bodyApp" className={bodyAppClasses(clientInvoice, accessToken)}>
                            {isContingencyActivate && (
                                <Banner
                                    text={INFORMATION_TEXT(contingency.start_time, contingency.end_time)}
                                    className="pl-4.5 pr-2.5 py-1.5"
                                />
                            )}
                            <div
                                className={wrapperClasses(isWebsitePage, {
                                    accessToken,
                                    isShowBanner: isContingencyActivate,
                                    pathname,
                                })}
                            >
                                <Switch>
                                    <Suspense fallback={<div />}>
                                        {map(PATHS, (path: IPath, index: number) =>
                                            isEqual(path.type, 'private') ? (
                                                <PrivateRoute
                                                    key={`path${index}`}
                                                    isAuthenticated={!!accessToken}
                                                    component={path.component}
                                                    path={path.route}
                                                    redirect="/"
                                                />
                                            ) : (
                                                <PublicRoute
                                                    key={`path${index}`}
                                                    path={path.route}
                                                    component={path.component}
                                                    redirect="/"
                                                    exact
                                                />
                                            )
                                        )}
                                        {!paths.includes(pathname) && <Redirect to="/" />}
                                    </Suspense>
                                </Switch>
                            </div>
                            {!clientInvoice && accessToken && !isCrmRoute && (
                                <Footer className={footerClasses(hasFreeMonth, accessToken)} />
                            )}
                        </div>
                    </div>
                </div>
            )}
            <Login handleOpenModalMigration={handleOpenModalMigration} />
            <LoginModals />
            <ModalMigrationAccount isOpen={openModalMigration} handleOpenModalMigration={handleOpenModalMigration} />
            {createAccountModal && <CreateAccount createAccountModal={createAccountModal} />}
            {accountCreatedModal && <AccountCreated accountCreatedModal={accountCreatedModal} />}
            {showModalCodeBadRequest && (
                <ModalCodesBadRequest
                    id={generateId({
                        module: ModuleApp.HOME,
                        submodule: `${ModuleApp.MODALS}-bad-request`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.MDL,
                    })}
                    show={showModalCodeBadRequest}
                    showModal={(): void => {
                        setShowModalCodeBadRequest(false);
                    }}
                />
            )}
            <UnauthorizedModal
                id={generateId({
                    module: ModuleApp.HOME,
                    submodule: `${ModuleApp.MODALS}-unauthorized`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.MDL,
                })}
                show={authorizationModal}
                showModal={(): void => {
                    dispatch(setAuthorizationModal());
                }}
                withoutInformation={!information?.name || false}
                haveMembership={haveMembership}
            />
        </>
    );
};

export default App;
