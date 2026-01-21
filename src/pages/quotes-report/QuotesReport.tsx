import React, { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import './components/quote-list/QuoteList.scss';

const ROUTE_VIEWS = {
    CREATE: 'create',
    EDIT: 'edit',
    QUOTE_VIEW: 'quote-view',
    QUOTE_SEND_MAIL: 'quote-send-mail',
} as const;

const GenerateQuote = React.lazy(() => import('./components/quote-generate/GenerateQuote'));
const QuoteView = React.lazy(() => import('./components/quote-view/QuoteView'));
const QuoteSendMail = React.lazy(() => import('./components/quote-send-mail/QuoteSendMail'));
const ReportTableContent = React.lazy(() => import('./components/quote-list/ReportTableContent'));

const ROUTE_COMPONENTS = {
    [ROUTE_VIEWS.CREATE]: GenerateQuote,
    [ROUTE_VIEWS.EDIT]: GenerateQuote,
    [ROUTE_VIEWS.QUOTE_VIEW]: QuoteView,
    [ROUTE_VIEWS.QUOTE_SEND_MAIL]: QuoteSendMail,
} as const;

const QuotesReport: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const view = searchParams.get('view');

    const LoadingSpinner = (): React.ReactElement => <div />;

    const Component = ROUTE_COMPONENTS[view as keyof typeof ROUTE_COMPONENTS] || ReportTableContent;

    return (
        <div className="quotes-report">
            <Suspense fallback={<LoadingSpinner />}>
                <Component />
            </Suspense>
        </div>
    );
};

export default QuotesReport;
