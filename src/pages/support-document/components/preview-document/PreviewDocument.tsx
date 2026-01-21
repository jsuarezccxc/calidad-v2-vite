import React from 'react';
import { InvoiceViewer } from '@components/invoice-viewer';
import { Information } from '@components/information';
import LocalStorage from '@utils/LocalStorage';
import { PREVIEW_DOCUMENT_SUPPORT } from '@pages/support-document';

export const PreviewDocument: React.FC = () => {
    const fieldInputs = LocalStorage.get(PREVIEW_DOCUMENT_SUPPORT) && JSON.parse(LocalStorage.get(PREVIEW_DOCUMENT_SUPPORT));

    return (
        <>
            <Information
                title="Previsualización"
                description="Una vez haya revisado la información, haga click en transmitir para enviar el documento soporte a la DIAN."
            />
            <InvoiceViewer isPDF invoicePDFUrl={fieldInputs?.pdf_url} onlyOneIcon classContainer="mt-4.5" />
        </>
    );
};
