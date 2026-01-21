import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { getSpecificDocument } from '@redux/cancellation-electronic-document/actions';
import { buttonsFooterProps } from '@utils/Button';
import { getRouteName } from '@utils/Paths';
import { ModuleApp } from '@utils/GenerateId';
import { ID, TYPE } from '@constants/UtilsConstants';
import { Routes } from '@constants/Paths';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { PURCHASE_SUPPLIER } from '@constants/ElectronicInvoice';
import { BreadCrumb } from '@components/bread-crumb';
import { PageTitle } from '@components/page-title';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { SUPPORT_DOCUMENTS_TITLE } from '@constants/ElectronicDocuments';
import { CONSULT_ELECTRONIC_DOCUMENT } from '@information-texts/ConsultElectronicDocument';
import { Actions, Download } from './components';
import { nextPage, principalTitle, routes } from '.';
import './ConsultElectronicDocument.scss';

const ConsultElectronicDocument: React.FC = () => {
    const dispatch = useDispatch();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get(ID);
    const typeNavigation = queryParams.get(TYPE);
    const history = useHistory();
    const { document } = useSelector(({ cancellationElectronicDocuments }: RootState) => cancellationElectronicDocuments);
    const invoiceType = document?.invoice_type;

    useEffect(() => {
        if (id) dispatch(getSpecificDocument(id));
    }, [id]);

    return (
        <main className="consult-electronic-document">
            <PageTitle pageContent={SUPPORT_DOCUMENTS_SUBTITLE} title={SUPPORT_DOCUMENTS_TITLE} />
            <BreadCrumb routes={routes(invoiceType)} />
            <h3 className="w-full font-bold text-center font-allerbold text-26lg text-blue mb-7">
                {principalTitle(invoiceType)}
            </h3>
            <p className="mb-2 text-lg font-bold font-allerbold text-blue">{CONSULT_ELECTRONIC_DOCUMENT.STATE_DOCUMENT}</p>
            <p className="text-gray-dark mb-4.5">{CONSULT_ELECTRONIC_DOCUMENT.STATE_PURCHASE}</p>
            <Download isPurchaseSupplier={invoiceType === PURCHASE_SUPPLIER} electronicDocument={document} />
            <Actions />
            <div className="flex items-end justify-end my-0 text-right xs:flex xs:items-center xs:justify-center">
                <PageButtonsFooter
                    {...buttonsFooterProps(ModuleApp.ELECTRONIC_DOCUMENTS, history, nextPage(typeNavigation), {
                        name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                        moduleName: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    })}
                />
            </div>
        </main>
    );
};

export default ConsultElectronicDocument;
