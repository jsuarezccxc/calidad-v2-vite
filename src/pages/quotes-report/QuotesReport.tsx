import React, { Suspense, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { getRoute } from '@utils/Paths';
import { Routes } from '@constants/Paths';
import { DOCUMENT_TYPE_PARAMS } from '@constants/DocumentType';
import './components/quote-list/QuoteList.scss';

const ROUTE_VIEWS = {
    CREATE: 'create',
    EDIT: 'edit',
    QUOTE_VIEW: 'quote-view',
    QUOTE_SEND_MAIL: 'quote-send-mail',
} as const;

const GenerateQuote = React.lazy(() => import('./components/quote-generate/GenerateQuote'));
const ReportTableContent = React.lazy(() => import('./components/quote-list/ReportTableContent'));

const ROUTE_COMPONENTS = {
    [ROUTE_VIEWS.CREATE]: GenerateQuote,
    [ROUTE_VIEWS.EDIT]: GenerateQuote,
} as const;

const QuotesReport: React.FC = () => {
    const location = useLocation();
    const history = useHistory();
    const searchParams = new URLSearchParams(location.search);
    const view = searchParams.get('view');
    const id = searchParams.get('id');
    const quoteId = searchParams.get('quote');

    useEffect(() => {
        const documentId = id || quoteId;

        if (view === ROUTE_VIEWS.QUOTE_VIEW && documentId) {
            history.push(`${getRoute(Routes.CONSULT_ELECTRONIC_DOCUMENT)}?type=QUOTE_VIEW&id=${documentId}`);
        }

        if (view === ROUTE_VIEWS.QUOTE_SEND_MAIL && documentId) {
            history.push(`${getRoute(Routes.EDIT_EMAIL_TEMPLATE_DOCUMENT)}?id=${documentId}&type=${DOCUMENT_TYPE_PARAMS.QUOTE}`);
        }
    }, [view, id, quoteId, history]);

    if (view === ROUTE_VIEWS.QUOTE_VIEW || view === ROUTE_VIEWS.QUOTE_SEND_MAIL) {
        return null;
    }

    const Component = ROUTE_COMPONENTS[view as keyof typeof ROUTE_COMPONENTS] || ReportTableContent;

    return (
        <div className="quotes-report">
            <Suspense fallback={<div />}>
                <Component />
            </Suspense>
        </div>
    );
};

export default QuotesReport;
