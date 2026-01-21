import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SelectSearchOption } from 'react-select-search';

import { AddPerson } from '@components/electronic-documents';
import { BreadCrumb } from '@components/bread-crumb';
import { CardFile } from '@components/card-file';
import { SelectSearchInput } from '@components/input';
import { SharedModal } from '@components/modal';
import { PageTitle } from '@components/page-title';

import { MODAL_TEXTS, QUOTE_UNAUTHORIZED_DATA } from '@constants/QuoteViewLabels';
import { ModalType } from '@constants/Modal';
import { Routes } from '@constants/Paths';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { TitleButtons } from '@constants/Buttons';
import { DOCUMENT_LANGUAGES, TypeFile } from '@constants/ElectronicInvoice';
import { ZERO } from '@constants/Numbers';

import { INFORMATION } from '@information-texts/Invoice';

import { IInvoiceDetails, ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { IQuoteFormData } from '@models/QuoteGeneration';

import { RootState } from '@redux/rootReducer';
import { getClientById } from '@redux/client-portal/actions';
import { setStateInvoice } from '@redux/electronic-invoice/actions';

import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { getRouteName } from '@utils/Paths';

import { GENERATE_QUOTE_TEXTS, PageButtonsFooter, QuoteBillingInformation, useQuoteForm } from '.';

import './QuoteGenerate.scss';

const GenerateQuote: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { filesLogo: logoFile } = useSelector(({ parameterizationInvoice }: RootState) => parameterizationInvoice);
    const { information: companyInfo } = useSelector(({ company }: RootState) => company);

    const {
        formData,
        openModal,
        addClient,
        validate,
        updateFormData,
        handleSubmit,
        resetForm,
        toggleModal,
        toggleNegativeValueModal,
        handleClientCreated,
        setAddClient,
        setProducts,
        setWithholdings,
        products,
        withholdings,
        isSubmitting,
        showNegativeValueModal,
        createdQuoteNumber,
    } = useQuoteForm();

    const [clientSuccessModal, setClientSuccessModal] = useState<boolean>(false);

    const toggleClientSuccessModal = (): void => setClientSuccessModal(!clientSuccessModal);

    const convertFormDataToQuoteFormData = (data: IQuoteFormData): IQuoteFormData => {
        return {
            ...data,
            not_information_customer: data.documentConfig?.authorizePersonalData || false,
            authorize_personal_data: data.documentConfig?.authorizePersonalData ? 'true' : 'false',
            selected_option_id: '',
        } as IQuoteFormData;
    };

    const handleQuoteFormDataUpdate = (data: IQuoteFormData | ((prev: IQuoteFormData) => IQuoteFormData)): void => {
        if (typeof data === 'function') {
            updateFormData(currentFormData => {
                const quoteFormData = convertFormDataToQuoteFormData(currentFormData);
                const updatedQuoteFormData = data(quoteFormData);

                const result: IQuoteFormData = {
                    ...currentFormData,
                    ...updatedQuoteFormData,
                    documentConfig: {
                        ...currentFormData.documentConfig,
                        authorizePersonalData: updatedQuoteFormData.not_information_customer || false,
                    },
                };

                return result;
            });
        } else {
            const updatedFormData = {
                ...formData,
                ...data,
            };

            if (data.not_information_customer !== undefined) {
                updatedFormData.documentConfig = {
                    ...updatedFormData.documentConfig,
                    authorizePersonalData: data.not_information_customer,
                };
            }

            updateFormData(updatedFormData);
        }
    };

    const handleProductsChange = useCallback((products: IInvoiceDetails[]): void => {
        setProducts(products);
    }, []);

    const handleWithholdingsChange = useCallback((withholdings: ITableTaxesAndRetention[]): void => {
        setWithholdings(withholdings);
    }, []);

    const quoteFormData = useMemo(() => convertFormDataToQuoteFormData(formData), [formData]);

    useEffect(() => {
        if (formData?.id !== QUOTE_UNAUTHORIZED_DATA.id && formData?.client_id) {
            dispatch(getClientById(formData.client_id));
        }
    }, [formData?.client_id, dispatch]);

    const routes = [
        {
            name: getRouteName(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
            route: GENERATE_QUOTE_TEXTS.BREADCRUMB.ROUTE_ELECTRONIC_DOCS,
        },
        {
            name: GENERATE_QUOTE_TEXTS.BREADCRUMB.TITLE_HOW_TO,
            route: GENERATE_QUOTE_TEXTS.BREADCRUMB.ROUTE_ELECTRONIC_INVOICE,
        },
        {
            name: GENERATE_QUOTE_TEXTS.BREADCRUMB.QUOTES,
            route: GENERATE_QUOTE_TEXTS.BREADCRUMB.ROUTE_QUOTES,
        },
        {
            name: addClient ? GENERATE_QUOTE_TEXTS.BREADCRUMB.ADD_CLIENT : GENERATE_QUOTE_TEXTS.BREADCRUMB.GENERATE_QUOTE,
            route: GENERATE_QUOTE_TEXTS.BREADCRUMB.ROUTE_CURRENT,
        },
    ];

    const handleFormSubmit = (): void => {
        handleSubmit();
    };

    const handleClientFormOpen = (): void => {
        dispatch(setStateInvoice({
            formData: formData,
            productData: products,
            withholdingTable: withholdings,
            sendingCharge: formData.sending_charge || ZERO
        }));
        setAddClient(true);
    };

    const handleBackToForm = (): void => {
        setAddClient(false);
    };

    const handleToggleModal = (clientId?: string, isNotShow?: boolean): void => {
        handleClientCreated();
        if (clientId) {
            updateFormData({
                ...formData,
                client_id: clientId,
                not_information_customer: true,
                documentConfig: { ...formData.documentConfig, authorizePersonalData: true },
            });
            dispatch(getClientById(clientId));
        }
        if (!isNotShow) toggleClientSuccessModal();
    };

    return (
        <div className="quotes-generate">
            <PageTitle title={getRouteName(Routes.DASHBOARD_ELECTRONIC_DOCUMENT)} pageContent={SUPPORT_DOCUMENTS_SUBTITLE} />
            <BreadCrumb routes={routes} />
            <h2 className="page-subtitle">{GENERATE_QUOTE_TEXTS.PAGE.SUBTITLE}</h2>

            {addClient ? (
                <AddPerson isClient toggleModal={handleToggleModal} backAddUser={handleBackToForm} />
            ) : (
                <>
                    <div className="quotes-common__container">
                        <h3 className="quotes-common__title">Generar cotización</h3>
                    </div>

                    <p className="quotes-common__description">
                        Complete la información solicitada para generar una cotización de sus productos o servicios. Al finalizar,
                        haga clic en el botón &quot;Siguiente&quot; para guardar los datos en el sistema y generar la cotización.
                    </p>

                    <div className="mt-6 mb-6">
                        <div className="mb-2 w-37 xs:w-full quote-language-select">
                            <SelectSearchInput
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `generate-language`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                classesWrapper="w-37 xs:w-full mb-2 quote-language-select"
                                labelText="Idioma del documento:"
                                valueSelect={formData.document_language || 'es'}
                                placeholder="Seleccionar"
                                optionSelect={DOCUMENT_LANGUAGES as unknown as SelectSearchOption[]}
                                onChangeSelect={({ value }): void => updateFormData({ ...formData, document_language: value })}
                                disabled={false}
                            />
                        </div>

                        <div className="mb-6 quote-generate__cards">
                            <div className="quote-generate__cards--logo-card">
                                <CardFile
                                    className="w-full h-full p-0"
                                    file={formData?.logo || {}}
                                    url={logoFile?.url}
                                    updateFile={(logo): void =>
                                        updateFormData({
                                            ...formData,
                                            logo,
                                            urlLogo: logo ? '' : logoFile?.url,
                                        })
                                    }
                                    typeLogo={TypeFile.LOGO_INVOICE}
                                />
                            </div>

                            <div className="quote-generate__cards--company-card">{INFORMATION.COMPANY(companyInfo)}</div>

                            <div className="quote-generate__cards--date-card">
                                <p>
                                    <span className="quote-generate__text--blue">Fecha cotización:</span>
                                    <span className="quote-generate__text--blue">
                                        {new Date().toLocaleDateString('es-CO', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <span className="quote-generate__text--blue">No. cotización:</span>
                                    <span className="quote-generate__text--blue">{formData.number || '---'}</span>
                                </p>
                            </div>
                        </div>

                        <p
                            className="mt-4 mb-6 font-aller text-blue"
                            style={{
                                fontSize: '0.75rem',
                                fontWeight: '400',
                                lineHeight: 'normal',
                                maxWidth: '60.5rem',
                                textAlign: 'left',
                            }}
                        >
                            La fecha y hora de transmisión de la factura electrónica se genera al momento de hacer click en
                            Siguiente al final de esta pantalla.
                        </p>
                    </div>

                    <div className="billing-information">
                        <h3 className="font-allerbold text-blue mb-4.5">Información para cotizar</h3>
                        <QuoteBillingInformation
                            formData={quoteFormData}
                            updateFormData={handleQuoteFormDataUpdate}
                            openForm={handleClientFormOpen}
                            isContingency={false}
                            validate={validate}
                            onProductsChange={handleProductsChange}
                            onWithholdingsChange={handleWithholdingsChange}
                        />
                    </div>

                    <PageButtonsFooter
                        moduleId={ModuleApp.QUOTES}
                        titleButtonLeft={TitleButtons.BACK}
                        titleButtonRight={TitleButtons.NEXT}
                        onClickButtonLeft={(): void => history.goBack()}
                        onClickButtonRight={handleFormSubmit}
                        disabledRight={isSubmitting}
                    />
                </>
            )}

            <SharedModal
                moduleId={`${ModuleApp.QUOTES}-save-success`}
                open={openModal}
                type={ModalType.Success}
                handleClosed={toggleModal}
                finalAction={(): void => {
                    toggleModal();
                    history.push(`/quotes-report?view=quote-view&quote=${createdQuoteNumber}`);
                }}
                leftButton={{
                    text: 'Generar nueva cotización',
                    action: (): void => {
                        resetForm();
                        toggleModal();
                        window.location.reload();
                    },
                }}
                text={MODAL_TEXTS.QUOTE_SAVE_SUCCESS}
                finishButtonText={TitleButtons.NEXT}
            />

            <SharedModal
                moduleId={`${ModuleApp.QUOTES}-negative-value-warning`}
                open={showNegativeValueModal}
                type={ModalType.Information}
                iconName="alertMulticolor"
                handleClosed={toggleNegativeValueModal}
                finalAction={toggleNegativeValueModal}
                text={{
                    title: 'Advertencia',
                    description: 'Verifique que el valor total sea correcto y no muestre un valor negativo',
                }}
                finishButtonText={TitleButtons.CLOSE}
            />

            <SharedModal
                moduleId={`${ModuleApp.QUOTES}-client-success`}
                open={clientSuccessModal}
                type={ModalType.Success}
                handleClosed={toggleClientSuccessModal}
                finalAction={toggleClientSuccessModal}
                finishButtonText={TitleButtons.ACCEPT}
            />
        </div>
    );
};

export default GenerateQuote;
