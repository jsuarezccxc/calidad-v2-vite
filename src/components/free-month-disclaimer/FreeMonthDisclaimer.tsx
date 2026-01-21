import React from 'react';
import { Link, LinkColor } from '@components/button';
import { IGenericRecord } from '@models/GenericRecord';
import { getRoute } from '@utils/Paths';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { Routes } from '@constants/Paths';

import './FreeMonthDisclaimer.scss';
import { VALUE_ZERO_NUMBER } from '.';

const FreeMonthDisclaimer: React.FC<IGenericRecord> = ({
    haveMembership,
    finishFreeMonth,
    moduleName,
    countFreeMonth,
    countMembershipExpired,
}) => {
    return (
        <div className="flex items-start justify-start justify-self-end free-month-disclaimer calculate-width">
            <p className="m-1 text-left lg:m-1.5 xs:pl-4.5">
                {countMembershipExpired && countMembershipExpired > VALUE_ZERO_NUMBER ? (
                    <span className="ml-4.5 xs:ml-0">
                        Le quedan <span className="font-poppinsbold">{countMembershipExpired}</span> días del módulo&nbsp;
                        <span className="font-poppinsbold">{moduleName}</span>. Para renovar el método de pago{' '}
                        <Link
                            id={generateId({
                                module: ModuleApp.HOME,
                                submodule: 'free-month-disclaimer',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.LNK,
                            })}
                            text="haga click aquí"
                            href={getRoute(Routes.PAYMENT_PLANS_MENU)}
                            linkColor={LinkColor.WHITE}
                            classes="text-base font-poppinsbold"
                            hover={false}
                        />
                        .
                    </span>
                ) : !haveMembership ? (
                    <>
                        {countFreeMonth >= VALUE_ZERO_NUMBER ? (
                            <span>
                                <span className="ml-4.5 xs:ml-0">
                                    Le quedan <span className="font-poppinsbold">{countFreeMonth}</span> días de su prueba GRATIS
                                </span>
                                &nbsp; del módulo <span className="font-poppinsbold">{moduleName}</span>
                            </span>
                        ) : (
                            finishFreeMonth && (
                                <span>
                                    <span className="ml-4.5">
                                        Ha finalizado su prueba <span className="font-poppinsbold">GRATIS</span>.
                                    </span>
                                    &nbsp; Para adquirir un plan &nbsp;
                                    <Link
                                        id={generateId({
                                            module: ModuleApp.HOME,
                                            submodule: 'free-month-disclaimer',
                                            action: ActionElementType.REDIRECT,
                                            elementType: ElementType.LNK,
                                        })}
                                        text="haga click aquí"
                                        href={getRoute(Routes.PAYMENT_PLANS_MENU)}
                                        linkColor={LinkColor.WHITE}
                                        classes="text-base"
                                        hover={false}
                                    />
                                    .
                                </span>
                            )
                        )}
                    </>
                ) : (
                    <span>
                        <Link
                            id={generateId({
                                module: ModuleApp.HOME,
                                submodule: 'free-month-disclaimer',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.LNK,
                            })}
                            text="Haga click aquí"
                            href={getRoute(Routes.PAYMENT_PLANS_MENU)}
                            linkColor={LinkColor.WHITE}
                            classes="text-base font-poppinsbold"
                            hover={false}
                        />
                        &nbsp;y seleccione los planes que más se ajusten a su empresa.
                    </span>
                )}
            </p>
        </div>
    );
};

export default FreeMonthDisclaimer;
