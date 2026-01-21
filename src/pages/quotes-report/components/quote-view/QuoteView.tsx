import React from 'react';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { TitleButtons } from '@constants/Buttons';
import { ModuleApp } from '@utils/GenerateId';
import { QuoteViewHeader, ActionButtonsBar, QuotePreviewContainer } from './components';
import { useQuoteView } from '.';
import './QuoteView.scss';

const QuoteView: React.FC = (): JSX.Element => {
    const {
        quoteData,
        handleExportPDF,
        handlePrint,
        handleSendEmail,
        handleGenerateInvoice,
        handleGoBack,
        handleGoNext,
    } = useQuoteView();

    return (
        <div className="quote-view__container">
            <QuoteViewHeader />

            <ActionButtonsBar
                onExportPDF={handleExportPDF}
                onPrint={handlePrint}
                onSendEmail={handleSendEmail}
                onGenerateInvoice={handleGenerateInvoice}
            />

            <QuotePreviewContainer quoteData={quoteData} />

            <PageButtonsFooter
                moduleId={ModuleApp.QUOTES}
                titleButtonLeft={TitleButtons.BACK}
                titleButtonRight={TitleButtons.NEXT}
                onClickButtonLeft={handleGoBack}
                onClickButtonRight={handleGoNext}
            />
        </div>
    );
};

export default QuoteView;
