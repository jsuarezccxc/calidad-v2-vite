import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import purchaseSummary from '@assets/images/plans/purchase-summary.svg';
import { Icon } from '@components/icon';
import { Modal } from '@models/PaymentPlans';
import { PlanType } from '@pages/new-payment-plans';
import { RootState } from '@redux/rootReducer';
import { formatMoney } from '@utils/Decimals';
import { getDateFormat } from '@utils/Date';
import { getActivePlan } from '@utils/Plans';
import { ISummaryTableProps, DEFAULT_PRICE } from '.';
import './SummaryTable.scss';

export const SummaryTable: React.FC<ISummaryTableProps> = ({ data, goToPayment, toggleModal, updateData, viewPlans }) => {
    const { userPlans } = useSelector(({ membership }: RootState) => membership);
    const { annualPlan, documentPlan, websitePlan } = data;

    const plans = [...(documentPlan ? [documentPlan] : []), ...(websitePlan ? [websitePlan] : [])];

    const deletePlan = (isWebsite: boolean): void => {
        toggleModal(Modal.Delete);
        const plan = isWebsite ? PlanType.WebsitePlan : PlanType.DocumentPlan;
        updateData({ ...data, [plan]: { ...data[plan], delete: true } });
    };

    const activeWebsite = getActivePlan(userPlans.website);

    const isAnnualPlan = annualPlan ? activeWebsite?.price_year : activeWebsite?.price_semester;

    const websiteDiscount = websitePlan ? isAnnualPlan ?? DEFAULT_PRICE : DEFAULT_PRICE;

    const getTotal = (): string => {
        let total = (documentPlan?.price_month ?? DEFAULT_PRICE) - websiteDiscount;
        if (websitePlan) {
            total += annualPlan ? websitePlan?.price_year ?? DEFAULT_PRICE : websitePlan?.price_semester ?? DEFAULT_PRICE;
        }
        return formatMoney(total, DEFAULT_PRICE);
    };

    const showTrashIcon = viewPlans || plans.length > 1;

    return (
        <>
            <h2 className="payment-plans__table-title">
                <img alt="Purchase summary" className="icon-purchase" src={purchaseSummary} />
                Visualice su resumen de compra
            </h2>
            {!!plans.length && (
                <div className="summary-table">
                    {plans.map(({ quantity, name, price_year, price_month, price_semester, isWebsite }) => {
                        const value = isWebsite ? (annualPlan ? price_year : price_semester) : price_month;
                        return (
                            <Fragment key={name}>
                                <h3 className="summary-table__title">
                                    {isWebsite ? 'Sitio web y tienda virtual' : 'Documentos Electrónicos'}
                                </h3>
                                <div className="summary-table__header">
                                    {isWebsite ? (
                                        <p className="text-sm text-gray-dark">
                                            Sitio web y tienda virtual: &nbsp;
                                            <span className="font-allerbold text-blue">{name}</span>
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-dark">
                                            <span className="font-allerbold">{quantity} Documentos</span>
                                            &nbsp; por año
                                        </p>
                                    )}
                                    {showTrashIcon && (
                                        <Icon
                                            className="w-5.5 h-5.5 cursor-pointer"
                                            name="trashBlue"
                                            onClick={(): void => deletePlan(isWebsite)}
                                        />
                                    )}
                                </div>
                                <hr className="summary-table__line" />
                                <p className="summary-table__item summary-table__item--small">
                                    Valor plan {annualPlan || !isWebsite ? 'anual' : 'semestral'}: &nbsp;
                                    <span className="font-allerbold">Cop {formatMoney(value, 0)}</span>
                                </p>
                                <p className="summary-table__item summary-table__item--underlined">
                                    Descuento: &nbsp;
                                    <span className="font-allerbold">
                                        {isWebsite ? `Cop ${formatMoney(websiteDiscount, 0)}` : 'No aplica'}
                                    </span>
                                </p>
                                <p className="summary-table__item summary-table__item--underlined">
                                    Total: &nbsp;
                                    <span className="font-allerbold">
                                        Cop {formatMoney(value - (isWebsite ? websiteDiscount : 0), 0)}
                                    </span>
                                </p>
                                <p className="summary-table__item">
                                    Fecha de cobro: &nbsp;
                                    <span className="font-allerbold">{getDateFormat(new Date(), true).formattedDate}</span>
                                </p>
                            </Fragment>
                        );
                    })}
                    <div className="summary-table__footer">
                        <p className="text-2lg">Total a pagar</p>
                        <p className="text-lg">{getTotal()}</p>
                    </div>
                    {viewPlans && (
                        <button className="summary-table__button" onClick={goToPayment}>
                            Pagar ahora
                        </button>
                    )}
                </div>
            )}
        </>
    );
};
