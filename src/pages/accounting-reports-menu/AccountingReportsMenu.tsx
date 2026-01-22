import React from 'react';
import { Link } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router-dom';
import { BreadCrumb } from '@components/bread-crumb';
import { PageTitle } from '@components/page-title';
import { Icon } from '@components/icon';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { Routes } from '@constants/Paths';
import { buttonsFooterProps } from '@utils/Button';
import { getRoute, getRouteName } from '@utils/Paths';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { nameReports, getRoutes } from '.';
import './AccountingReportsMenu.scss';

const AccountingReportsMenu: React.FC = () => {
    const history = useHistory();
    const { pathname } = useLocation();

    const isWebsitePage = pathname === getRoute(Routes.ACCOUNTING_REPORTS_MENU);

    return (
        <>
            <div className="h-full accounting-report">
                <PageTitle title={getRouteName(Routes.WEBSITE_MENU)} classContainer=" accounting-report__title" />
                <BreadCrumb routes={getRoutes(isWebsitePage)} />
                <h1 className="text-center text-blue font-allerbold text-26lg mt-2.5 mb-4.5">Consulte los reportes contables</h1>
                <h3 className="text-gray-dark">Haga click en el informe contable que quiera visualizar.</h3>
                <div className="flex gap-4.5 mt-9 flex-wrap justify-center">
                    {nameReports.map(item => (
                        <Link
                            id={generateId({
                                module: ModuleApp.ANALYTICAL_REPORTS,
                                submodule: `accounting-${item.icon}`,
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.CRD,
                            })}
                            className="accounting-report__card"
                            key={item.id}
                            to={item.route}
                        >
                            <Icon name={item.icon} className="w-20 h-20 m-auto" />
                            <p className="mt-2 text-center font-allerbold text-green">{item.name}</p>
                        </Link>
                    ))}
                </div>
            </div>
            <PageButtonsFooter
                {...buttonsFooterProps(ModuleApp.ANALYTICAL_REPORTS, history, getRoute(Routes.SALES_REPORT_PRODUCT_WAREHOUSE), {
                    name: '#',
                    moduleName: getRouteName(Routes.WEBSITE_MENU),
                })}
            />
        </>
    );
};

export default AccountingReportsMenu;
