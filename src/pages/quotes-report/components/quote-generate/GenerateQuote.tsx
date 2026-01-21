import React from 'react';
import { useHistory } from 'react-router-dom';
import { AddPerson } from '@components/electronic-documents';
import { BreadCrumb } from '@components/bread-crumb';
import { PageTitle } from '@components/page-title';
import { SharedModal } from '@components/modal';
import { ModalType } from '@constants/Modal';
import { TitleButtons } from '@constants/Buttons';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { Routes } from '@constants/Paths';
import { MODAL_TEXTS } from '@constants/QuoteViewLabels';
import { Form } from '@models/ElectronicDocuments';
import { getRouteName } from '@utils/Paths';
import { ModuleApp } from '@utils/GenerateId';
import { GENERATE_QUOTE_TEXTS, PageButtonsFooter, QuoteBillingInformation, useQuoteForm } from '.';
import './QuoteGenerate.scss';

const GenerateQuote: React.FC = () => {
    const history = useHistory();

    const {
        formData,
        openModal,
        addClient,
        validationErrors,
        validationWarnings,
        updateFormData,
        handleSubmit,
        resetForm,
        toggleModal,
        handleClientCreated,
        setAddClient,
        setProducts,
        isSubmitting,
        submitError,
    } = useQuoteForm();

    const routes = [
        {
            name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
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
        handleSubmit(Form.Client);
    };

    const handleBackToForm = (): void => {
        setAddClient(false);
    };

    const handleToggleModal = (clientId?: string, isNotShow?: boolean): void => {
        handleClientCreated();
        if (clientId) {
            updateFormData({ clientInfo: { ...formData.clientInfo, name: clientId } });
        }
        if (!isNotShow) toggleModal();
    };

    return (
        <div className={`font-aller ${GENERATE_QUOTE_TEXTS.UI_CONSTANTS.BACKGROUND_COLOR}`}>
            <PageTitle title={getRouteName(Routes.ELECTRONIC_DOCUMENTS)} pageContent={SUPPORT_DOCUMENTS_SUBTITLE} />
            <BreadCrumb routes={routes} />
            <h2 className="page-subtitle">{GENERATE_QUOTE_TEXTS.PAGE.SUBTITLE}</h2>

            {submitError && (
                <div className="p-4 mb-4 border rounded border-red submit-error bg-gray-light">
                    <p className="font-semibold text-red">{submitError}</p>
                </div>
            )}

            {validationErrors.length > GENERATE_QUOTE_TEXTS.UI_CONSTANTS.EMPTY_VALIDATION && (
                <div className="p-4 mb-4 border rounded border-red validation-errors bg-gray-light">
                    <h4 className="mb-2 font-semibold text-red">{GENERATE_QUOTE_TEXTS.VALIDATION.ERRORS_TITLE}</h4>
                    <ul className="list-disc list-inside text-red">
                        {validationErrors.map((error, index) => (
                            <li
                                key={`${GENERATE_QUOTE_TEXTS.KEY_PREFIXES.ERROR}-${error.slice(
                                    0,
                                    GENERATE_QUOTE_TEXTS.KEY_SLICE_LENGTH
                                )}-${index}`}
                            >
                                {error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {validationWarnings.length > GENERATE_QUOTE_TEXTS.UI_CONSTANTS.EMPTY_VALIDATION && (
                <div className="p-4 mb-4 border border-yellow-300 rounded validation-warnings bg-yellow-50">
                    <h4 className="mb-2 font-semibold text-yellow-700">{GENERATE_QUOTE_TEXTS.VALIDATION.WARNINGS_TITLE}</h4>
                    <ul className="text-yellow-600 list-disc list-inside">
                        {validationWarnings.map((warning, index) => (
                            <li
                                key={`${GENERATE_QUOTE_TEXTS.KEY_PREFIXES.WARNING}-${warning.slice(
                                    0,
                                    GENERATE_QUOTE_TEXTS.KEY_SLICE_LENGTH
                                )}-${index}`}
                            >
                                {warning}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

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

                    <div className="billing-information">
                        <h3 className="font-allerbold text-blue mb-4.5">Información para facturar</h3>
                        <QuoteBillingInformation
                            formData={formData}
                            updateFormData={updateFormData}
                            openForm={handleClientFormOpen}
                            toggleModal={toggleModal}
                            isContingency={false}
                            onProductsChange={setProducts}
                            isInsertedPage={false}
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
                    history.push('/quotes-report');
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
        </div>
    );
};

export default GenerateQuote;
