import React, { Fragment, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Icon } from '@components/icon';
import { Link, LinkColor } from '@components/button';
import { IGenericRecord } from '@models/GenericRecord';
import { Modal } from '@models/PaymentPlans';
import { RootState } from '@redux/rootReducer';
import { clearSession } from '@redux/session/actions';
import { formatMoney } from '@utils/Decimals';
import { getDateFormat } from '@utils/Date';
import { getRoute } from '@utils/Paths';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import {
    DIGGITAL_SELLER_MODULE_ID,
    ELECTRONIC_DOCUMENTS_MODULE_ID,
    ORGANIZATION_PLANNING_MODULE_ID,
    WEBSITE_MODULE_ID,
    CRM_MODULE_ID,
    PlanType,
} from '@pages/purchasing-process';
import { TitleButtons } from '@constants/Buttons';
import { Routes } from '@constants/Paths';
import { PURCHASING_PROCESS_TEXTS } from '@information-texts/PurchasingProcess';
import { ISummaryTableProps, DEFAULT_PRICE, ZERO, ONE, TWO } from '.';
import './SummaryTable.scss';

export const SummaryTable: React.FC<ISummaryTableProps> = ({
    data,
    saveData,
    continueToPay,
    toggleModal,
    updateData,
    viewPlans,
}) => {
    const [dispatch, history] = [useDispatch(), useHistory()];

    const { accessToken, modules } = useSelector(({ session, membership }: RootState) => ({
        ...session,
        ...membership,
    }));

    const { documentPlan, websitePlan, organizationPlanning, diggitalSeller, crm } = data;

    const plans = Object.values({ documentPlan, websitePlan, organizationPlanning, diggitalSeller, crm }).filter(
        plan => plan && Object.keys(plan).length > ZERO
    );

    const countValidPlans = plans.filter(plan => plan.id !== ONE && plan.id !== ORGANIZATION_PLANNING_MODULE_ID).length;
    const originalPlanOrganizationPlanning = modules?.find(module => module.id === ORGANIZATION_PLANNING_MODULE_ID);

    if (countValidPlans < TWO && organizationPlanning && organizationPlanning.price_year === ZERO) {
        updateData({
            ...data,
            organizationPlanning: {
                ...originalPlanOrganizationPlanning,
            },
        });
    }

    const deletePlan = (plan: IGenericRecord): void => {
        toggleModal(Modal.Delete);

        const planType = ((): string | null => {
            if (Number(plan.modules_id) === WEBSITE_MODULE_ID) return PlanType.WebsitePlan;
            if (Number(plan.modules_id) === ELECTRONIC_DOCUMENTS_MODULE_ID) return PlanType.DocumentPlan;
            if (plan.id === DIGGITAL_SELLER_MODULE_ID) return PlanType.DiggitalSeller;
            if (plan.id === ORGANIZATION_PLANNING_MODULE_ID) return PlanType.OrganizationPlanning;
            if (plan.id === CRM_MODULE_ID) return PlanType.CrmPlan;
            return null;
        })();

        if (planType && data[planType]) {
            updateData({
                ...data,
                [planType]: { ...data[planType], delete: true },
            });
        }
    };

    const getTotal = (): string => {
        let total = DEFAULT_PRICE;

        total += documentPlan?.price_month ?? DEFAULT_PRICE;
        total += websitePlan?.price_year ?? DEFAULT_PRICE;
        total += organizationPlanning?.price_year ?? DEFAULT_PRICE;
        total += diggitalSeller?.price_year ?? DEFAULT_PRICE;
        total += crm?.price_year ?? DEFAULT_PRICE;

        return formatMoney(total, DEFAULT_PRICE);
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

    const showTrashIcon = viewPlans || plans.length > ONE;

    const getModuleInfo = (plan: IGenericRecord): { name: string; description: ReactElement } => {
        if (Number(plan.modules_id) === WEBSITE_MODULE_ID) {
            return {
                name: 'Sitio web y tienda diggital',
                description: (
                    <p className="text-sm text-gray-dark">
                        Sitio web y tienda diggital: &nbsp;
                        <span className="font-allerbold text-blue">{plan.name}</span>
                    </p>
                ),
            };
        } else if (Number(plan.modules_id) === ELECTRONIC_DOCUMENTS_MODULE_ID) {
            return {
                name: 'Documentos Electrónicos',
                description: (
                    <p className="text-sm font-allerbold">
                        {plan.quantity > ZERO ? (
                            `${plan.quantity} Documentos`
                        ) : (
                            <>
                                Documentos Ilimitados <span className="text-gray-dark font-aller">Por Año</span>
                            </>
                        )}
                    </p>
                ),
            };
        } else if (plan.id === DIGGITAL_SELLER_MODULE_ID) {
            return {
                name: 'Vendedor diggital',
                description: <p className="text-sm text-gray-dark">Vendedor diggital</p>,
            };
        } else if (plan.id === ORGANIZATION_PLANNING_MODULE_ID) {
            return {
                name: 'Planeación y organización',
                description: (
                    <p className="text-sm text-gray-dark">
                        Planeación y organización: &nbsp;
                        <span className="font-allerbold text-blue">
                            Calendario, Diagrama de Gantt y Configuración de citas y calendario
                        </span>
                    </p>
                ),
            };
        } else {
            return {
                name: 'CRM',
                description: <p className="text-sm text-gray-dark">CRM</p>,
            };
        }
    };

    return (
        <>
            {plans.length &&
            (data.websitePlan || data.documentPlan || data.diggitalSeller || data.organizationPlanning || data.crm) ? (
                <div
                    id={generateId({
                        module: ModuleApp.PURCHASING_PROCESS,
                        submodule: 'summary-table',
                        action: ActionElementType.CONTAINER,
                        elementType: ElementType.CRD,
                    })}
                    className="summary-table"
                >
                    {plans.map(plan => {
                        const { id, price_year, price_month, modules_id } = plan;
                        const moduleId = Number(modules_id);

                        const moduleInfo = getModuleInfo(plan);
                        return (
                            <Fragment key={id}>
                                <h3
                                    id={generateId({
                                        module: ModuleApp.PURCHASING_PROCESS,
                                        submodule: `summary-table-${id}-title`,
                                        action: ActionElementType.INFO,
                                        elementType: ElementType.TXT,
                                    })}
                                    className="summary-table__title"
                                >
                                    {moduleInfo.name}
                                </h3>
                                <div
                                    id={generateId({
                                        module: ModuleApp.PURCHASING_PROCESS,
                                        submodule: `summary-table-${id}-header`,
                                        action: ActionElementType.INFO,
                                        elementType: ElementType.TXT,
                                    })}
                                    className="summary-table__header"
                                >
                                    {moduleInfo.description}
                                    {showTrashIcon && plan.price_year > ZERO && (
                                        <Icon
                                            id={generateId({
                                                module: ModuleApp.PURCHASING_PROCESS,
                                                submodule: `summary-table-${id}`,
                                                action: ActionElementType.DELETE,
                                                elementType: ElementType.ICO,
                                            })}
                                            className="cursor-pointer"
                                            name="trashBlue"
                                            onClick={(): void => deletePlan(plan)}
                                        />
                                    )}
                                </div>
                                <hr className="summary-table__line" />
                                {price_year > ZERO ? (
                                    <p
                                        id={generateId({
                                            module: ModuleApp.PURCHASING_PROCESS,
                                            submodule: `summary-table-${id}-price`,
                                            action: ActionElementType.INFO,
                                            elementType: ElementType.TXT,
                                        })}
                                        className="summary-table__item summary-table__item--small"
                                    >
                                        Valor plan:&nbsp;
                                        <span className="italic font-allerbold">
                                            Cop &nbsp;
                                            {formatMoney(
                                                moduleId === ELECTRONIC_DOCUMENTS_MODULE_ID ? price_month : price_year,
                                                ZERO
                                            )}
                                        </span>
                                    </p>
                                ) : (
                                    <p
                                        id={generateId({
                                            module: ModuleApp.PURCHASING_PROCESS,
                                            submodule: `summary-table-${id}-price`,
                                            action: ActionElementType.INFO,
                                            elementType: ElementType.TXT,
                                        })}
                                        className={`summary-table__item break-words ${
                                            id === ORGANIZATION_PLANNING_MODULE_ID && moduleId !== ELECTRONIC_DOCUMENTS_MODULE_ID
                                                ? 'summary-table__item--big'
                                                : moduleId === ELECTRONIC_DOCUMENTS_MODULE_ID && price_month == ZERO
                                                ? 'summary-table__item--small'
                                                : 'summary-table__item--big'
                                        }`}
                                    >
                                        Valor plan:&nbsp;
                                        <span className="italic font-allerbold">
                                            GRATIS &nbsp;
                                            {moduleId !== ELECTRONIC_DOCUMENTS_MODULE_ID && 'por la compra de más de un módulo'}
                                        </span>
                                    </p>
                                )}
                                <p
                                    id={generateId({
                                        module: ModuleApp.PURCHASING_PROCESS,
                                        submodule: `summary-table-${id}`,
                                        action: ActionElementType.DATE,
                                        elementType: ElementType.TXT,
                                    })}
                                    className="summary-table__item"
                                >
                                    Fecha de compra: &nbsp;
                                    <span className="font-allerbold">{getDateFormat(new Date(), true).formattedDate}</span>
                                </p>
                            </Fragment>
                        );
                    })}
                    <div
                        id={generateId({
                            module: ModuleApp.PURCHASING_PROCESS,
                            submodule: 'summary-table-footer',
                            action: ActionElementType.INFO,
                            elementType: ElementType.CRD,
                        })}
                        className="summary-table__footer"
                    >
                        <p
                            id={generateId({
                                module: ModuleApp.PURCHASING_PROCESS,
                                submodule: 'summary-table-total-label',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className="text-2lg"
                        >
                            Total a pagar
                        </p>
                        <p
                            id={generateId({
                                module: ModuleApp.PURCHASING_PROCESS,
                                submodule: 'summary-table-total-value',
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className="text-lg"
                        >
                            Cop {getTotal()}
                        </p>
                    </div>
                    {viewPlans && (
                        <div
                            id={generateId({
                                module: ModuleApp.PURCHASING_PROCESS,
                                submodule: 'summary-table-buttons',
                                action: ActionElementType.CONTAINER,
                                elementType: ElementType.CRD,
                            })}
                            className="summary-table__buttons-container"
                        >
                            <button
                                id={generateId({
                                    module: ModuleApp.PURCHASING_PROCESS,
                                    submodule: 'summary-table',
                                    action: ActionElementType.SAVE,
                                    elementType: ElementType.BTN,
                                })}
                                className="summary-table__button-save"
                                onClick={saveData}
                            >
                                {TitleButtons.SAVE}
                            </button>
                            <button
                                id={generateId({
                                    module: ModuleApp.PURCHASING_PROCESS,
                                    submodule: 'summary-table',
                                    action: ActionElementType.NEXT,
                                    elementType: ElementType.BTN,
                                })}
                                className="summary-table__button-next"
                                onClick={continueToPay}
                            >
                                {TitleButtons.NEXT}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    id={generateId({
                        module: ModuleApp.PURCHASING_PROCESS,
                        submodule: 'summary-table-empty',
                        action: ActionElementType.INFO,
                        elementType: ElementType.CRD,
                    })}
                    className="summary-table-empty"
                >
                    <p
                        id={generateId({
                            module: ModuleApp.PURCHASING_PROCESS,
                            submodule: 'summary-table-empty-message',
                            action: ActionElementType.INFO,
                            elementType: ElementType.TXT,
                        })}
                        className="text-center leading-2lg text-2lg font-aller text-gray-dark"
                    >
                        {PURCHASING_PROCESS_TEXTS.SUMMARY_TABLE_EMPTY}
                        <br />
                        &nbsp;
                        <Link
                            id={generateId({
                                module: ModuleApp.PURCHASING_PROCESS,
                                submodule: 'summary-table-home',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.LNK,
                            })}
                            text="haga click aquí"
                            linkColor={LinkColor.PURPLE}
                            onClick={handleRedirect}
                            href={getRoute(Routes.HOME)}
                            classes="hover:text-blue text-2lg"
                        />
                    </p>
                </div>
            )}
        </>
    );
};
