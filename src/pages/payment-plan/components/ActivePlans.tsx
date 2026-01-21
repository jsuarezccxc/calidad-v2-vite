import React, { useEffect } from 'react';
import { Table } from '@components/table';
import { Icon } from '@components/icon';
import { Paginator } from '@components/paginator';
import { Button } from '@components/button';
import { ITEMS_PAGE } from '@constants/Paginator';
import { Routes } from '@constants/Paths';
import { ZERO } from '@constants/Numbers';
import usePaginator from '@hooks/usePaginator';
import { getDateFromUnix } from '@utils/Date';
import { isEven } from '@utils/Number';
import { getRoute } from '@utils/Paths';
import { generateId, ActionElementType, ElementType, ModuleApp } from '@utils/GenerateId';
import { EXCLUDED_MODULE, IActivePlansProps, QUANTITY_ALLOWED_DE_MODULE } from '..';
import { ACTIVE_PLAN_HEADERS } from '.';

export const ActivePlans: React.FC<IActivePlansProps> = ({
    plans,
    handleRedirect,
    handleCancelPlan,
    handleActivateRenewal,
    handleCancelRenovation,
    handleReactivatePlan,
    isLoadingTable,
}) => {
    const { paginator, getLimits } = usePaginator(plans);

    useEffect(() => {
        getLimits();
    }, [plans]);

    return (
        <div className="active-plans">
            <Table
                id={generateId({
                    module: ModuleApp.PAYMENT_PLANS,
                    submodule: 'active',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                className="active-table"
                wrapperClassName="plan-table"
                customTable
                data={[]}
                headerRowsCustom={<TableHeaders />}
                isHeaderRowsCustom
                isLoading={isLoadingTable}
            >
                {paginator.dataLimits.map(
                    (
                        {
                            id,
                            expiration_date,
                            initial_date,
                            name,
                            nameModule,
                            has_action_cancellation,
                            is_cancel,
                            is_frequent_payment,
                            quantity,
                        },
                        index
                    ) => {
                        const { formattedDate } = getDateFromUnix(initial_date);
                        const formattedExpirationDateOriginal = getDateFromUnix(expiration_date).formattedDate;

                        const shouldShowNA =
                            nameModule?.toLowerCase().includes(EXCLUDED_MODULE) &&
                            QUANTITY_ALLOWED_DE_MODULE.includes(Number(quantity ?? ZERO));

                        const formattedExpirationDate = shouldShowNA ? 'N/A' : formattedExpirationDateOriginal;

                        return (
                            <tr
                                id={generateId({
                                    module: ModuleApp.PAYMENT_PLANS,
                                    submodule: `active-${index}`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.ROW,
                                })}
                                className={`${isEven(index + 1) ? 'bg-gray-light' : 'bg-white'}`}
                                key={`${nameModule}-${index}`}
                            >
                                <td className="table-field table-field--disabled">{nameModule || name}</td>
                                <td>
                                    <p className="active-table__field">
                                        {formattedDate}
                                        <Icon name="calendarGray" classIcon="w-5.5 h-5.5" />
                                    </p>
                                </td>
                                <td>
                                    <p className="active-table__field">
                                        {formattedExpirationDate}
                                        <Icon name="calendarGray" classIcon="w-5.5 h-5.5" />
                                    </p>
                                </td>
                                {has_action_cancellation &&
                                    is_cancel &&
                                    !is_frequent_payment &&
                                    !nameModule?.toLowerCase().includes(EXCLUDED_MODULE) && (
                                        <td className="px-2.5 bg-white">
                                            <Button
                                                id={generateId({
                                                    module: ModuleApp.PAYMENT_PLANS,
                                                    submodule: `active-plans-reactivate-${index}`,
                                                    action: ActionElementType.RENEW,
                                                    elementType: ElementType.BTN,
                                                })}
                                                text="Reactivar plan"
                                                background="white"
                                                classes="button--style"
                                                onClick={(): void => handleReactivatePlan(id)}
                                            />
                                        </td>
                                    )}
                                {has_action_cancellation &&
                                    !is_cancel &&
                                    !is_frequent_payment &&
                                    !nameModule?.toLowerCase().includes(EXCLUDED_MODULE) && (
                                        <>
                                            <td className="px-2.5 bg-white">
                                                <Button
                                                    id={generateId({
                                                        module: ModuleApp.PAYMENT_PLANS,
                                                        submodule: `active-plans-${index}`,
                                                        action: ActionElementType.CANCEL,
                                                        elementType: ElementType.BTN,
                                                    })}
                                                    text="Cancelar Plan de pago"
                                                    background="white"
                                                    classes="button--style"
                                                    onClick={(): void => handleCancelPlan(id)}
                                                />
                                            </td>
                                            <td className="px-2.5 bg-white">
                                                <Button
                                                    id={generateId({
                                                        module: ModuleApp.PAYMENT_PLANS,
                                                        submodule: `active-plans-${index}`,
                                                        action: ActionElementType.RENEW,
                                                        elementType: ElementType.BTN,
                                                    })}
                                                    text="Activar renovación"
                                                    background="white"
                                                    classes="button--style"
                                                    onClick={(): void => handleActivateRenewal(id)}
                                                />
                                            </td>
                                        </>
                                    )}
                                {!has_action_cancellation && !nameModule?.toLowerCase().includes(EXCLUDED_MODULE) && (
                                    <>
                                        <td className="px-2.5 bg-white">
                                            <Button
                                                id={generateId({
                                                    module: ModuleApp.PAYMENT_PLANS,
                                                    submodule: `active-plans-${index}-method-payment`,
                                                    action: ActionElementType.CHANGE,
                                                    elementType: ElementType.BTN,
                                                })}
                                                text="Cambiar método de pago"
                                                background="white"
                                                classes="button--style"
                                                onClick={(): void => handleRedirect(getRoute(Routes.PLAN_METHOD_PAYMENT))}
                                            />
                                        </td>
                                        <td className="px-2.5 bg-white">
                                            <Button
                                                id={generateId({
                                                    module: ModuleApp.PAYMENT_PLANS,
                                                    submodule: `active-plans-${index}`,
                                                    action: ActionElementType.CANCEL,
                                                    elementType: ElementType.BTN,
                                                })}
                                                text="Cancelar Plan de pago"
                                                background="white"
                                                classes="button--style"
                                                onClick={(): void => handleCancelPlan(id)}
                                            />
                                        </td>
                                        <td className="px-2.5 bg-white">
                                            <Button
                                                id={generateId({
                                                    module: ModuleApp.PAYMENT_PLANS,
                                                    submodule: `active-plans-${index}-renew`,
                                                    action: ActionElementType.CANCEL,
                                                    elementType: ElementType.BTN,
                                                })}
                                                text="Cancelar renovación"
                                                background="white"
                                                classes="button--style"
                                                onClick={(): void => handleCancelRenovation(id)}
                                            />
                                        </td>
                                    </>
                                )}
                            </tr>
                        );
                    }
                )}
            </Table>
            {plans.length > ITEMS_PAGE && <Paginator {...paginator} />}
        </div>
    );
};

const TableHeaders: React.FC = () => (
    <tr className="bg-green-extraLight">
        {ACTIVE_PLAN_HEADERS.map(({ className, title }, index) => (
            <th
                id={generateId({
                    module: ModuleApp.PAYMENT_PLANS,
                    submodule: `active-plans-${title}-${index}`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.COL,
                })}
                key={title}
                className={`table-head active-table__${className}`}
            >
                {title}
            </th>
        ))}
    </tr>
);
