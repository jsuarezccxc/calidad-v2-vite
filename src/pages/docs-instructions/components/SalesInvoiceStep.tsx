import React, { useContext, useEffect } from 'react';
import GenerateSalesInvoice from '@pages/generate-sales-invoice';
import GenerateSupportDocument from '@pages/generate-support-document/GenerateSupportDocument';
import { DocsInstructionContext, TypeDoc } from '../context';
import { StepWrapper } from './StepWrapper';
import { ISalesInvoiceStep } from '.';

export const SalesInvoiceStep: React.FC<ISalesInvoiceStep> = ({ title, description, typeDoc = TypeDoc.EI }) => {
    const { saveCompleteStep } = useContext(DocsInstructionContext);

    useEffect(() => {
        saveCompleteStep();
    }, []);

    return (
        <StepWrapper title={title} description={description}>
            {typeDoc === TypeDoc.EI || typeDoc === TypeDoc.CI ? (
                <GenerateSalesInvoice isInsertedPage isContingency={typeDoc === TypeDoc.CI} />
            ) : (
                <GenerateSupportDocument isInsertedPage />
            )}
        </StepWrapper>
    );
};
