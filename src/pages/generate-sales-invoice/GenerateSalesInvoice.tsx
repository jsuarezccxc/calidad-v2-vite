import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { DOC, TypeDoc } from '@pages/docs-instructions/context';
import { BreadCrumb } from '@components/bread-crumb';
import { SalesCards, PageDirections, AddPerson } from '@components/electronic-documents';
import { SharedModal } from '@components/modal';
import { PageTitle } from '@components/page-title';
import { BillingInformation, FORM_DATA, UNAUTHORIZED_DATA, assignProducts, INVOICE_TYPES } from './components';
import { Routes } from '@constants/Paths';
import { TypeFile } from '@constants/ElectronicInvoice';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import {
    FOREIGN_EXCHANGE,
    PAYMENT_METHODS,
    PAYMENT_TYPES,
    OPERATION_TYPES,
    PERSON_UTILS,
    LANGUAGES,
} from '@constants/UtilsConstants';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import useParam from '@hooks/useParam';
import { INFORMATION } from '@information-texts/GenerateSalesInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { IInvoiceDetails, ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { RootState } from '@redux/rootReducer';
import { getUtils } from '@redux/utils/actions';
import { getSuppliers } from '@redux/suppliers/actions';
import { getClientsThin } from '@redux/clients/actions';
import { getCompanyTaxes, getInformationCompany } from '@redux/company/actions';
import { getClientById, setClientSelected } from '@redux/client-portal/actions';
import { getFilesCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';
import {
    getInvoicesAvailable,
    getPrefix,
    getPrefixCompany,
    getUniqueProductStock,
    setStateInvoice,
} from '@redux/electronic-invoice/actions';
import { getDocumentType } from '@utils/ElectronicInvoice';
import { getRoute, getRouteName } from '@utils/Paths';
import { AssignDataToObject } from '@utils/Json';
import { ModuleApp } from '@utils/GenerateId';
import { loadQuoteForInvoice } from '@redux/quotes/actions';
import { getRoutes, FORM, PREFIXES, QUOTE_DATA_TEMPLATE, QUOTE_QUERY_PARAM, CLIENT_QUERY_PARAM, buildWithholdingTable, findNameById } from '.';
import './GenerateSalesInvoice.scss';

const GenerateSalesInvoice: React.FC<{ isInsertedPage?: boolean; isContingency?: boolean }> = ({
    isInsertedPage = false,
    isContingency = false,
}) => {
    const dispatch = useDispatch();
    const [history, { pathname }] = [useHistory(), useLocation()];
    const isContingencyInInvoice = getRoute(Routes.GENERATE_CONTINGENCY_INVOICE) === pathname;

    const { information, utils, quantityInvoices, products } = useSelector(
        ({ utils, company, electronicInvoice, clientPortal }: RootState) => ({
            ...utils,
            ...company,
            ...electronicInvoice,
            ...clientPortal,
        })
    );
    const { queryParam, id: queryId } = useParam('invoice');
    const [formData, setFormData] = useState<IGenericRecord>({ ...FORM_DATA, ...UNAUTHORIZED_DATA });
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [stepInstructions, setStepInstructions] = useState<IGenericRecord | null>(null);
    const [addClient, setAddClient] = useState(false);
    const [quoteProductData, setQuoteProductData] = useState<IInvoiceDetails[] | undefined>(undefined);
    const [quoteWithholdingData, setQuoteWithholdingData] = useState<ITableTaxesAndRetention[] | undefined>(undefined);
    const [quoteSendingCharge, setQuoteSendingCharge] = useState<number | undefined>(undefined);

    const personTexts = queryParam ? INFORMATION[queryParam] : {};
    const { prefix_id: prefixId, client_id: clientId } = formData;

    useEffect(() => {
        if (information) setStepInstructions(information.step_instructions);
    }, [information]);

    useEffect(() => {
        if (
            !isInsertedPage &&
            stepInstructions &&
            (stepInstructions[TypeDoc.EI] === undefined || !stepInstructions[TypeDoc.EI]?.isComplete)
        ) {
            history.push(`${getRoute(Routes.DOCS_INSTRUCTIONS)}?${DOC}=${isContingency ? TypeDoc.CI : TypeDoc.EI}`);
        }
    }, [stepInstructions]);

    useEffect(() => {
        if (prefixId) dispatch(getPrefix(prefixId));
    }, [prefixId]);

    useEffect(() => {
        if (formData.id !== UNAUTHORIZED_DATA.id && clientId) dispatch(getClientById(clientId));
    }, [clientId]);

    useEffect(() => {
        getData();
        return (): void => {
            dispatch(setStateInvoice({}));
        };
    }, []);

    useEffect(() => {
        const loadQuoteData = async (): Promise<void> => {
            if (
                queryParam === QUOTE_QUERY_PARAM &&
                queryId &&
                utils?.payment_types &&
                utils?.payment_methods &&
                utils?.foreign_exchange &&
                products &&
                products.length > 0
            ) {
                const quote = await dispatch(loadQuoteForInvoice(queryId));

                if (quote) {
                    const quoteData = quote as IGenericRecord;
                    const mappedData = AssignDataToObject(QUOTE_DATA_TEMPLATE, quoteData);
                    const hasClientId = Boolean(quoteData.client_id);

                    const operationTypeName = findNameById(INVOICE_TYPES, mappedData.operation_type_id, 'value');

                    const updatedFormData = {
                        ...FORM_DATA,
                        ...mappedData,
                        operation_type: operationTypeName,
                        not_information_customer: hasClientId,
                    };

                    setFormData(updatedFormData);

                    if (quoteData.client_id) {
                        dispatch(getClientById(quoteData.client_id));
                    }

                    const assignedProducts = assignProducts(quoteData.invoice_details || [], products);
                    const builtWithholdings = buildWithholdingTable(quoteData);

                    setQuoteProductData(assignedProducts);
                    setQuoteWithholdingData(builtWithholdings);
                    setQuoteSendingCharge(quoteData.sending_charge || 0);
                }
            }
        };

        loadQuoteData();
    }, [queryParam, queryId, utils, products]);

    const getData = async (): Promise<void> => {
        await Promise.all([
            dispatch(getUniqueProductStock()),
            dispatch(getClientsThin()),
            dispatch(getSuppliers(true)),
            dispatch(getInformationCompany()),
            dispatch(getCompanyTaxes()),
            dispatch(getPrefixCompany(PREFIXES)),
            dispatch(getUtils([PAYMENT_TYPES, PAYMENT_METHODS, FOREIGN_EXCHANGE, OPERATION_TYPES, LANGUAGES, ...PERSON_UTILS])),
            dispatch(getFilesCompanyAction(TypeFile.LOGO_INVOICE)),
            dispatch(getInvoicesAvailable()),
        ]);
    };

    const openForm = (): void => {
        setAddClient(true);
        dispatch(setClientSelected({}));
    };

    const toggleModal = (): void => setOpenModal(!openModal);

    const redirect = (): void => {
        (async (): Promise<void> => {
            await dispatch(getClientsThin());
        })();
        history.push(getRoute(Routes.GENERATE_SALES_INVOICE));
        toggleModal();
    };

    const routes = getRoutes(personTexts, isContingencyInInvoice);

    const documentType = useMemo(() => getDocumentType(utils, information?.document_type), [information, utils]);

    const routeIndex =
        isContingency || isContingencyInInvoice ? Routes.GENERATE_CONTINGENCY_INVOICE : Routes.GENERATE_SALES_INVOICE;

    const backAddUser = (): void => {
        setAddClient(false);
        if (queryParam) history.goBack();
    };

    const handleToSale = (): void => {
        const params = new URLSearchParams(location.search);
        params.delete(FORM);
        history.replace({
            pathname: location.pathname,
            search: params.toString(),
        });
    };

    return (
        <div className="generate-invoices">
            {!isInsertedPage && (
                <>
                    <PageTitle title={getRouteName(Routes.ELECTRONIC_DOCUMENTS)} pageContent={SUPPORT_DOCUMENTS_SUBTITLE} />
                    <BreadCrumb routes={routes} />
                    <h2 className="page-subtitle">{MODULE_TITLES.INVOICE}</h2>
                </>
            )}
            {addClient || queryParam === CLIENT_QUERY_PARAM ? (
                <AddPerson
                    isClient
                    toggleModal={(clientId, isNotShow): void => {
                        setAddClient(false);
                        if (clientId) {
                            setFormData({ ...formData, id: '', client_id: clientId, not_information_customer: true });
                            handleToSale();
                            setAddClient(false);
                        }
                        if (!isNotShow) toggleModal();
                    }}
                    backAddUser={backAddUser}
                />
            ) : (
                <>
                    <PageDirections routeIndex={routeIndex} quantityInvoices={quantityInvoices} />
                    <SalesCards
                        companyData={{ ...information, documentType }}
                        invoiceData={formData}
                        updateInvoiceData={(data): void => setFormData({ ...formData, ...data })}
                    />
                    <BillingInformation
                        formData={formData}
                        updateFormData={(data): void => setFormData({ ...formData, ...data })}
                        openForm={openForm}
                        toggleModal={toggleModal}
                        isInsertedPage={isInsertedPage}
                        isContingency={isContingencyInInvoice}
                        initialProductData={quoteProductData}
                        initialWithholdingData={quoteWithholdingData}
                        initialSendingCharge={quoteSendingCharge}
                    />
                </>
            )}
            {openModal && (
                <SharedModal moduleId={ModuleApp.ELECTRONIC_INVOICE} finalAction={queryParam ? redirect : toggleModal} open />
            )}
        </div>
    );
};

export default GenerateSalesInvoice;
