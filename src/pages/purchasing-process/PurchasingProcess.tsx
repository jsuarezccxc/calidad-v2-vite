import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { RootState } from '@redux/rootReducer';
import {
    createPurchaseProcess,
    getPurchaseProcess,
    postFreeMembership,
    setMembershipToPay,
    setPlansToPay,
    setShowModalFreePlanResponse,
    setUserPlans,
} from '@redux/membership/actions';
import { clearSession, setLoginModal } from '@redux/session/actions';
import { IconTitle } from '@components/page-title';
import Footer from '@components/footer';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { SharedModal } from '@components/modal';
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
import { PURCHASING_PROCESS_TEXTS } from '@information-texts/PurchasingProcess';
import { ISubModules } from '@models/Membership';
import { IGenericRecord } from '@models/GenericRecord';
import { Modal } from '@models/PaymentPlans';
import useModal from '@hooks/useModal';
import PaymentPlans from '@pages/new-payment-plans/PaymentPlans';
import { TRANSACTION_ID } from '@pages/new-payment-plans';
import { getRoute } from '@utils/Paths';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import LocalStorage from '@utils/LocalStorage';
import { SummaryTable } from './components';
import { ONE, TWO, YEAR_IN_MONTHS, ZERO } from './components/summary-table';
import { PurchaseModals } from './components/purchase-modals';
import {
    DEFAULT_DATA,
    DIGGITAL_SELLER_MODULE_ID,
    ELECTRONIC_DOCUMENTS_MODULE_ID,
    MODAL_PROPS,
    MODALS,
    MODALS_WITHOUT_ACTION,
    ORGANIZATION_PLANNING_MODULE_ID,
    PlanType,
    WEBSITE_MODULE_ID,
    DIGGITAL_SELLER_MODULE,
    ORGANIZATION_PLANNING,
    CRM,
    DELETE_VARIABLE,
    INITIAL_DATA,
    REQUIRED_DATA,
    FIELDS,
    IFreeMembershipResponse,
    VALIDATE_FREE_DOCUMENTS_REQUIREMENTS_NOT_MET,
    VALIDATE_FREE_DOCUMENTS_ALREADY_ACTIVE,
    VALIDATE_FREE_DOCUMENTS_USED_YEAR_NOT_OVER_YET,
    VALIDATE_FREE_DOCUMENTS_ELIGIBLE_WITH_MULTIPLE_PLANS,
    VALIDATE_FREE_DOCUMENTS_PLAN_CREATED,
    CRM_MODULE_ID,
    PSE_RESPONSE,
} from '.';
import './PurchasingProcess.scss';

const PurchasingProcess: React.FC = () => {
    const [dispatch, history, location] = [useDispatch(), useHistory(), useLocation()];

    const { accessToken, modules, activeMemberships, plansToBuy, showModalFreePlanResponse } = useSelector(
        ({ session, company, membership }: RootState) => ({
            ...session,
            ...company,
            ...membership,
        })
    );

    const [data, setData] = useState<IGenericRecord>(DEFAULT_DATA);
    const [showPlans, setShowPlans] = useState<boolean>(true);
    const [continuePayment, setContinuePayment] = useState<boolean>(false);
    const [redirectToSummaryPayPse, setRedirectToSummaryPayPse] = useState<boolean>(false);
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [dataFreePlanCompany, setDataFreePlanCompany] = useState(INITIAL_DATA);
    const [showModalInfoCompanyFreePlan, setShowModalInfoCompanyFreePlan] = useState<boolean>(false);
    const [requiredField, setRequiredField] = useState<IGenericRecord>(REQUIRED_DATA);
    const [statement, setStatement] = useState<boolean>(false);
    const [responseValidationFreeDocuments, setResponseValidationFreeDocuments] = useState<string>('');

    const { activeModal, toggleModal } = useModal(MODALS);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const response: IGenericRecord = await dispatch(getPurchaseProcess());

            const combinedPlans = { ...plansToBuy, ...response.modules };
            const selectedArray = Object.values(combinedPlans);

            const relevantPlans = selectedArray.filter(module => (module as IGenericRecord).id !== ONE);
            const planToAdd = modules?.find(plan => plan.id === ORGANIZATION_PLANNING_MODULE_ID);
            const hasPlanOrganization = !!combinedPlans[ORGANIZATION_PLANNING_MODULE_ID];

            if (relevantPlans.length >= TWO && planToAdd && !hasPlanOrganization) {
                combinedPlans[planToAdd.id] = {
                    ...planToAdd,
                    price_month: ZERO,
                    price_semester: ZERO,
                    price_semester_month: ZERO,
                    price_year: ZERO,
                };
            }

            setData(organizePlans(combinedPlans));
        };

        fetchData();
    }, []);

    useEffect(() => {
        dispatch(setUserPlans(modules, activeMemberships));
    }, [modules, activeMemberships]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const transactionIdResponse = searchParams.get(TRANSACTION_ID);

        if (location.search) LocalStorage.set(PSE_RESPONSE, location.search);
        if (transactionIdResponse) setTransactionId(transactionIdResponse);
        if (transactionIdResponse || transactionId) setRedirectToSummaryPayPse(true);
    }, [location, history]);

    useEffect(() => {
        if (dataFreePlanCompany !== INITIAL_DATA && showModalInfoCompanyFreePlan) {
            validateFields();
        }
    }, [dataFreePlanCompany, statement]);

    const organizePlans = (data: Record<string, IGenericRecord>): Record<string, IGenericRecord> => {
        const organizedPlans = {
            documentPlan: {},
            websitePlan: {},
            diggitalSeller: {},
            organizationPlanning: {},
            crm: {},
        };

        Object.values(data).forEach(plan => {
            const moduleId = Number(plan.modules_id);

            if (moduleId === WEBSITE_MODULE_ID) {
                organizedPlans.websitePlan = plan;
            }

            if (moduleId === ELECTRONIC_DOCUMENTS_MODULE_ID) {
                organizedPlans.documentPlan = plan;
            }

            if (plan.name === DIGGITAL_SELLER_MODULE && plan.id === DIGGITAL_SELLER_MODULE_ID) {
                organizedPlans.diggitalSeller = plan;
            }

            if (plan.name === ORGANIZATION_PLANNING && plan.id === ORGANIZATION_PLANNING_MODULE_ID) {
                organizedPlans.organizationPlanning = plan;
            }

            if (plan.name === CRM && plan.id === CRM_MODULE_ID) {
                organizedPlans.crm = plan;
            }
        });

        return organizedPlans;
    };

    const updateData = (data: IGenericRecord): void => setData(data);
    const togglePlanView = (): void => setShowPlans(!showPlans);

    const planToDelete = Object.values(PlanType).find(key => data[key]?.delete) ?? '';

    const closeModal = (): void => {
        toggleModal('');

        if (planToDelete) {
            updateData({
                ...data,
                [planToDelete]: Object.fromEntries(Object.entries(data[planToDelete]).filter(([key]) => key !== DELETE_VARIABLE)),
            });
        }
    };

    const deletePlan = (): void => {
        if (planToDelete) {
            const planToDeleteData = data[planToDelete];

            if (planToDeleteData?.id) {
                const planIdToDelete = planToDeleteData.id;

                const updatedPlansToBuy = Object.keys(plansToBuy).reduce((acc, key) => {
                    if (plansToBuy[key].id !== planIdToDelete) {
                        acc[key] = plansToBuy[key];
                    }
                    return acc;
                }, {} as Record<string, ISubModules>);

                dispatch(setPlansToPay(updatedPlansToBuy));
                setData({ ...data, [planToDelete]: {} });
            }

            toggleModal('');
        }
    };

    const acceptModal = async (): Promise<void> => {
        if (MODALS_WITHOUT_ACTION.includes(activeModal)) return closeModal();

        if (activeModal === Modal.ApplicationApproved) {
            closeModal();
        }
        closeModal();
        togglePlanView();
    };

    const convertToModulesFormat = (data: IGenericRecord): { modules: IGenericRecord } => {
        const plans = [
            { key: PlanType.DocumentPlan, idKey: 'modules_id', subModules: true },
            { key: PlanType.WebsitePlan, idKey: 'modules_id', subModules: true },
            { key: PlanType.DiggitalSeller, idKey: 'id', subModules: false },
            { key: PlanType.OrganizationPlanning, idKey: 'id', subModules: false },
            { key: PlanType.CrmPlan, idKey: 'id', subModules: false },
        ];

        const modules = plans
            .filter(({ key }) => data[key] && Object.keys(data[key]).length > ZERO)
            .map(({ key, idKey, subModules }) => ({
                id: data[key][idKey],
                sub_modules: subModules ? [{ id: data[key].id, expiration_date: YEAR_IN_MONTHS }] : [],
                expiration_date: YEAR_IN_MONTHS,
            }));

        return { modules };
    };

    const handleRedirect = (): void => {
        if (accessToken) {
            history.push(getRoute(Routes.HOME));
            dispatch(clearSession());
            const elementHeader = document.querySelector('*');
            elementHeader?.classList.remove('screen-scroll-smooth');
            elementHeader?.classList.add('screen-smooth-logout');
        }
        return;
    };

    const handleChangeInputFreeDocument = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target) {
            const { name, value } = e.target;

            setDataFreePlanCompany(prevState => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            const { value } = e as IGenericRecord;
            setDataFreePlanCompany(prevState => ({
                ...prevState,
                totalRevenue: value,
            }));
        }
    };

    const validateFields = (): boolean => {
        const fields = Object.keys(requiredField);
        const validationFields: IGenericRecord = { ...requiredField };

        fields.map(field => {
            if (field === FIELDS.NUMBER_EMPLOYEES) {
                validationFields.numberEmployees.error = !dataFreePlanCompany.numberEmployees;
                validationFields.numberEmployees.text = validationFields.numberEmployees.error && '*Campo obligatorio';
            } else if (field === FIELDS.TOTAL_REVENUE) {
                validationFields.totalRevenue.error = !dataFreePlanCompany.totalRevenue;
                validationFields.totalRevenue.text = validationFields.totalRevenue.error && '*Campo obligatorio';
            } else if (field === FIELDS.ACCEPT_CHECKBOX) {
                validationFields.accept_checkbox.error = !statement;
                validationFields.accept_checkbox.text = validationFields.accept_checkbox.error && '*Campo obligatorio';
            }
            return field;
        });

        setRequiredField(validationFields);
        return Object.values(validationFields).some(field => field.error);
    };

    const validateFreeDocumentPlan = async (): Promise<void> => {
        const validateForm = validateFields();
        if (!validateForm && data) {
            const numberEmployees = Number(dataFreePlanCompany.numberEmployees);
            const totalRevenue = Number(dataFreePlanCompany.totalRevenue);

            const activePlans = Object.values(data).filter(plan => Object.keys(plan).length > ZERO);
            const hasOnlyDocumentPlan = activePlans.length === ONE && data.documentPlan?.id === ONE;

            const response = await ((dispatch(
                postFreeMembership({
                    number_employees: numberEmployees,
                    total_revenue: totalRevenue,
                    is_validation: !hasOnlyDocumentPlan,
                })
            ) as unknown) as IFreeMembershipResponse);

            setResponseValidationFreeDocuments(response.data);
            setShowModalInfoCompanyFreePlan(!showModalInfoCompanyFreePlan);

            if (response.data === VALIDATE_FREE_DOCUMENTS_REQUIREMENTS_NOT_MET) {
                dispatch(
                    setShowModalFreePlanResponse({
                        approved: false,
                        rejected: true,
                        planAlreadyActive: false,
                        planAlreadyPurchasedThisYear: false,
                    })
                );
            }

            if (response.data === VALIDATE_FREE_DOCUMENTS_ALREADY_ACTIVE) {
                dispatch(
                    setShowModalFreePlanResponse({
                        approved: false,
                        rejected: false,
                        planAlreadyActive: true,
                        planAlreadyPurchasedThisYear: false,
                    })
                );
            }

            if (response.data === VALIDATE_FREE_DOCUMENTS_USED_YEAR_NOT_OVER_YET) {
                dispatch(
                    setShowModalFreePlanResponse({
                        approved: false,
                        rejected: false,
                        planAlreadyActive: false,
                        planAlreadyPurchasedThisYear: true,
                    })
                );
            }

            if (
                response.data === VALIDATE_FREE_DOCUMENTS_ELIGIBLE_WITH_MULTIPLE_PLANS ||
                response.data === VALIDATE_FREE_DOCUMENTS_PLAN_CREATED
            ) {
                dispatch(
                    setShowModalFreePlanResponse({
                        approved: true,
                        rejected: false,
                        planAlreadyActive: false,
                        planAlreadyPurchasedThisYear: false,
                    })
                );
            }
        }
    };

    const handleValidateModalFreePlan = (): void => {
        if (!data) return;

        const activePlans = Object.values(data).filter(plan => Object.keys(plan).length > ZERO);
        const hasOnlyDocumentPlan = activePlans.length === ONE && data.documentPlan?.id === ONE;

        if (showModalFreePlanResponse?.approved) {
            dispatch(
                setShowModalFreePlanResponse({
                    approved: false,
                    rejected: false,
                    planAlreadyActive: false,
                    planAlreadyPurchasedThisYear: false,
                })
            );

            if (hasOnlyDocumentPlan && responseValidationFreeDocuments === VALIDATE_FREE_DOCUMENTS_PLAN_CREATED) {
                handleRedirect();
                setTimeout(() => {
                    dispatch(setLoginModal());
                }, 1500);
            } else {
                dispatch(createPurchaseProcess(convertToModulesFormat(data)));
                dispatch(setMembershipToPay(convertToModulesFormat(data)));
                setContinuePayment(!continuePayment);
            }
        }

        if (
            showModalFreePlanResponse?.rejected ||
            showModalFreePlanResponse?.planAlreadyActive ||
            showModalFreePlanResponse?.planAlreadyPurchasedThisYear
        ) {
            dispatch(
                setShowModalFreePlanResponse({
                    approved: false,
                    rejected: false,
                    planAlreadyActive: false,
                    planAlreadyPurchasedThisYear: false,
                })
            );

            if (data.documentPlan?.id === ONE) {
                setData(prevData => {
                    const remainingData = Object.fromEntries(
                        Object.entries(prevData).filter(([key]) => key !== PlanType.DocumentPlan)
                    );
                    return remainingData;
                });
            }
        }
    };

    const saveDataInBD = (): void => {
        dispatch(createPurchaseProcess(convertToModulesFormat(data)));
        dispatch(setMembershipToPay(convertToModulesFormat(data)));
    };

    const continueToPay = (): void => {
        if (data?.documentPlan?.id === ONE) {
            setShowModalInfoCompanyFreePlan(true);
        } else {
            dispatch(createPurchaseProcess(convertToModulesFormat(data)));
            dispatch(setMembershipToPay(convertToModulesFormat(data)));
            setContinuePayment(!continuePayment);
        }
    };

    if (continuePayment || redirectToSummaryPayPse) {
        return (
            <PaymentPlans
                plansData={data}
                setContinuePayment={setContinuePayment}
                continuePayment={continuePayment}
                redirectToSummaryPayPse={redirectToSummaryPayPse}
                setRedirectToSummaryPayPse={setRedirectToSummaryPayPse}
                setTransactionId={setTransactionId}
            />
        );
    }

    return (
        <>
            <PurchaseModals
                showModalInfoCompanyFreePlan={showModalInfoCompanyFreePlan}
                setShowModalInfoCompanyFreePlan={setShowModalInfoCompanyFreePlan}
                dataFreePlanCompany={dataFreePlanCompany}
                handleChangeInputFreeDocument={handleChangeInputFreeDocument}
                requiredField={requiredField}
                statement={statement}
                setStatement={setStatement}
                showModalFreePlanResponse={showModalFreePlanResponse}
                validateFreeDocumentPlan={validateFreeDocumentPlan}
                handleValidateModalFreePlan={handleValidateModalFreePlan}
            />
            <div className="h-full px-2 bg-gray-background sm:px-28">
                <IconTitle
                    id={generateId({
                        module: ModuleApp.PURCHASING_PROCESS,
                        submodule: 'title',
                        action: ActionElementType.INFO,
                        elementType: ElementType.TXT,
                    })}
                    label="Proceso de compra"
                    icon="purchasingProcess"
                    size="large"
                    classContainer="mt-7 mb-2"
                />
                <div className="flex flex-col justify-center w-full text-center">
                    <p
                        id={generateId({
                            module: ModuleApp.PURCHASING_PROCESS,
                            submodule: 'paragraph-one',
                            action: ActionElementType.INFO,
                            elementType: ElementType.TXT,
                        })}
                        className="text-gray-dark text-2lg leading-2lg font-aller"
                    >
                        {PURCHASING_PROCESS_TEXTS.FIRST_PARAGRAPH}
                    </p>
                    <p
                        id={generateId({
                            module: ModuleApp.PURCHASING_PROCESS,
                            submodule: 'paragraph-second',
                            action: ActionElementType.INFO,
                            elementType: ElementType.TXT,
                        })}
                        className="mt-2 text-gray-dark text-2lg leading-2lg font-aller"
                    >
                        {PURCHASING_PROCESS_TEXTS.SECOND_PARAGRAPH}
                    </p>
                </div>
                <IconTitle
                    id={generateId({
                        module: ModuleApp.PURCHASING_PROCESS,
                        submodule: 'subtitle',
                        action: ActionElementType.INFO,
                        elementType: ElementType.TXT,
                    })}
                    label="Resumen de compra"
                    icon="purchaseResume"
                    size="medium"
                    classContainer="my-7"
                />
                <SummaryTable
                    data={data}
                    saveData={saveDataInBD}
                    continueToPay={continueToPay}
                    toggleModal={toggleModal}
                    updateData={updateData}
                    viewPlans={true}
                />
                {activeModal && (
                    <SharedModal
                        moduleId={ModuleApp.PURCHASING_PROCESS}
                        open
                        handleClosed={closeModal}
                        finalAction={acceptModal}
                        {...MODAL_PROPS[activeModal](data, { deletePlan, planToDelete, closeModal })}
                    />
                )}
                <PageButtonsFooter
                    moduleId={ModuleApp.PURCHASING_PROCESS}
                    titleButtonLeft={TitleButtons.BACK}
                    onClickButtonLeft={handleRedirect}
                    classButton="xs:w-full shadow-templateDesign"
                />
                <Footer className="text-center bg-gray-background" />
            </div>
        </>
    );
};

export default PurchasingProcess;
