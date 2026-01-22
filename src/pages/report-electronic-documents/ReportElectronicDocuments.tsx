import React from 'react';
import { useHistory } from 'react-router-dom';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { SUPPORT_DOCUMENTS_TITLE } from '@constants/ElectronicDocuments';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { Routes } from '@constants/Paths';
import { buttonsFooterProps } from '@utils/Button';
import { getRoute, getRouteName } from '@utils/Paths';
import { ModuleApp } from '@utils/GenerateId';
import { Texts, ReportTable } from './components';
import { routes } from '.';
import './ReportElectronicDocuments.scss';

const ReportElectronicDocuments: React.FC = () => {
    const history = useHistory();

    return (
        <main>
            <PageTitle pageContent={SUPPORT_DOCUMENTS_SUBTITLE} title={SUPPORT_DOCUMENTS_TITLE} classContainer="without-margin" />
            <BreadCrumb routes={routes()} />
            <Texts />
            <ReportTable />
            <div className="flex items-end justify-end my-0 text-right xs:flex xs:items-center xs:justify-center">
                <PageButtonsFooter
                    {...buttonsFooterProps(ModuleApp.ACCOUNTING_REPORTS, history, getRoute(Routes.SALES_REPORT), {
                        name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                        moduleName: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    })}
                />
            </div>
        </main>
    );
};

export default ReportElectronicDocuments;
