import React from 'react';
import { InformativeQuestion } from '@components/informative-question';
import { STRING } from '@constants/DataTypes';
import { PAGE_DIRECTION } from '@information-texts/PageDirections';
import { InvoiceCardAvailable } from '../cards';
import { IPageDirectionsProps } from '.';

export const PageDirections: React.FC<IPageDirectionsProps> = ({
    routeIndex,
    quantityInvoices,
    includeCounter = true,
    isEdit = false,
}) => {
    const { answer, question, subTitle, submodule, indications } = PAGE_DIRECTION(isEdit)[routeIndex];
    return (
        <>
            {submodule && <h2 className="generate-invoices__subtitle">{submodule}</h2>}
            <div className="flex flex-col items-center justify-between sm:flex-row">
                <div className="flex-1 xl:flex-none">
                    <h3 className="mb-2 text-lg text-blue font-allerbold">{subTitle}</h3>
                    <InformativeQuestion question={question} answer={answer} />
                </div>
                {includeCounter && <InvoiceCardAvailable quantityInvoices={quantityInvoices} />}
            </div>
            {typeof indications === STRING ? <p className="text-gray-dark mt-4.5 mb-7">{indications}</p> : indications}
        </>
    );
};
