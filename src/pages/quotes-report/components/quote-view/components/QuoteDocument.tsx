import React from 'react';
import type { IQuoteDocumentProps } from '..';
import { formatNumber } from '@utils/Number';
import { formatDate } from '@utils/quoteHelpers';
import { DOCUMENT_CONFIG, UI_LABELS } from '@constants/QuoteViewLabels';

export const QuoteDocument: React.FC<IQuoteDocumentProps> = ({ data }) => {

    return (
        <div className="w-full p-10 bg-white md:p-5 font-aller quote-document__container">
            <div className="flex flex-col items-start justify-between gap-5 pb-5 mb-10 border-b-2 md:flex-row md:gap-0 quote-document__header-border">
                <div>
                    <h1 className="text-2xl font-bold m-0 mb-2.5 quote-document__title">{data.company.name}</h1>
                    <p className="my-1 text-sm quote-document__text">{UI_LABELS.COMPANY_LABELS.NIT} {data.company.nit}</p>
                    <p className="my-1 text-sm quote-document__text">{UI_LABELS.COMPANY_LABELS.ADDRESS} {data.company.address}</p>
                    <p className="my-1 text-sm quote-document__text">{UI_LABELS.COMPANY_LABELS.PHONE} {data.company.phone}</p>
                    <p className="my-1 text-sm quote-document__text">{data.company.city}</p>
                    <p className="my-1 text-sm quote-document__text">{data.company.email}</p>
                </div>
                <div className="text-right md:text-left">
                    <h2 className="text-2xl font-bold quote-document__title m-0 mb-2.5">{DOCUMENT_CONFIG.DOCUMENT_TYPE}</h2>
                    <p className="my-1 text-lg font-bold quote-document__quote-number">{UI_LABELS.QUOTE_LABELS.QUOTE_NUMBER} {data.number}</p>
                    <p className="my-1 text-sm quote-document__text">{UI_LABELS.QUOTE_LABELS.DATE} {formatDate(data.date)}</p>
                    <p className="my-1 text-sm quote-document__text">{UI_LABELS.QUOTE_LABELS.VALID_UNTIL} {formatDate(data.validUntil)}</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-bold quote-document__title m-0 mb-4 pb-2.5 border-b quote-document__border">{UI_LABELS.CLIENT_SECTION}</h3>
                <div className="p-4 rounded quote-document__background">
                    <p className="text-sm my-1.5 quote-document__text">
                        <strong className="font-bold quote-document__strong">{data.customer.name}</strong>
                    </p>
                    <p className="text-sm my-1.5 quote-document__text">{UI_LABELS.COMPANY_LABELS.NIT}/CC: {data.customer.nit}</p>
                    <p className="text-sm my-1.5 quote-document__text">{UI_LABELS.COMPANY_LABELS.ADDRESS} {data.customer.address}</p>
                    <p className="text-sm my-1.5 quote-document__text">Teléfono: {data.customer.phone}</p>
                    <p className="text-sm my-1.5 quote-document__text">Email: {data.customer.email}</p>
                </div>
            </div>

            <div className="mb-8">
                <table className="w-full border-collapse shadow-[0_0.125rem_0.25rem_rgba(0,0,0,0.1)]">
                    <thead className="bg-blue">
                        <tr>
                            <th className="p-3 text-sm font-bold text-left text-white">{UI_LABELS.TABLE_HEADERS.ITEM}</th>
                            <th className="p-3 text-sm font-bold text-left text-white">{UI_LABELS.TABLE_HEADERS.DESCRIPTION}</th>
                            <th className="p-3 text-sm font-bold text-right text-white">{UI_LABELS.TABLE_HEADERS.QUANTITY}</th>
                            <th className="p-3 text-sm font-bold text-right text-white">{UI_LABELS.TABLE_HEADERS.UNIT_PRICE}</th>
                            <th className="p-3 text-sm font-bold text-right text-white">{UI_LABELS.TABLE_HEADERS.DISCOUNT}</th>
                            <th className="p-3 text-sm font-bold text-right text-white">{UI_LABELS.TABLE_HEADERS.TAX}</th>
                            <th className="p-3 text-sm font-bold text-right text-white">{UI_LABELS.TABLE_HEADERS.TOTAL}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.products.map((product, index) => (
                            <tr key={product.id} className="border-b quote-document__table-row">
                                <td className="p-3 text-sm quote-document__text">{index + DOCUMENT_CONFIG.ITEM_INDEX_START}</td>
                                <td className="p-3 text-sm quote-document__text">{product.description}</td>
                                <td className="p-3 text-sm text-center quote-document__text">{product.quantity}</td>
                                <td className="p-3 text-sm text-right quote-document__text">{formatNumber(product.unitPrice)}</td>
                                <td className="p-3 text-sm text-right quote-document__text">{formatNumber(product.discount)}</td>
                                <td className="p-3 text-sm text-right quote-document__text">{formatNumber(product.tax)}</td>
                                <td className="p-3 text-sm text-right quote-document__text">{formatNumber(product.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end mb-10">
                <div className="w-80 md:w-full">
                    <div className="flex justify-between py-2 text-sm">
                        <span className="quote-document__text">{UI_LABELS.TOTALS.SUBTOTAL}</span>
                        <span className="font-bold quote-document__total-text">{formatNumber(data.subtotal)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm">
                        <span className="quote-document__text">{UI_LABELS.TOTALS.TOTAL_DISCOUNT}</span>
                        <span className="font-bold quote-document__total-text">{formatNumber(data.totalDiscount)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm">
                        <span className="quote-document__text">{UI_LABELS.TOTALS.TOTAL_TAX}</span>
                        <span className="font-bold quote-document__total-text">{formatNumber(data.totalTax)}</span>
                    </div>
                    <div className="flex justify-between pt-3 mt-2 text-lg border-t-2 border-green">
                        <span className="font-bold quote-document__total-text">{UI_LABELS.TOTALS.FINAL_TOTAL}</span>
                        <span className="font-bold quote-document__total-text">{formatNumber(data.total)}</span>
                    </div>
                </div>
            </div>

            {(data.notes || data.terms) && (
                <div className="p-5 mb-10 rounded quote-document__background">
                    {data.notes && (
                        <div className="mb-5 last:mb-0">
                            <h4 className="text-base font-bold quote-document__title m-0 mb-2.5">{UI_LABELS.SECTIONS.NOTES}</h4>
                            <p className="text-sm quote-document__text m-0 leading-[1.5]">{data.notes}</p>
                        </div>
                    )}
                    {data.terms && (
                        <div className="mb-5 last:mb-0">
                            <h4 className="text-base font-bold quote-document__title m-0 mb-2.5">{UI_LABELS.SECTIONS.TERMS}</h4>
                            <p className="text-sm quote-document__text m-0 leading-[1.5]">{data.terms}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col items-end justify-between gap-8 mt-16 md:flex-row md:gap-0 md:items-end">
                <div>
                    <p className="my-1 text-sm quote-document__text">
                        <strong className="font-bold quote-document__strong">{UI_LABELS.SECTIONS.ATTENDED_BY}</strong>
                    </p>
                    <p className="my-1 text-sm quote-document__text">{data.seller.name}</p>
                    <p className="my-1 text-sm quote-document__text">{data.seller.email}</p>
                    <p className="my-1 text-sm quote-document__text">{data.seller.phone}</p>
                </div>
                <div className="w-full text-center min-w-48 md:w-auto">
                    <div className="w-full h-px mb-2 bg-gray"></div>
                    <p className="m-0 text-sm quote-document__text">{UI_LABELS.SECTIONS.AUTHORIZED_SIGNATURE}</p>
                </div>
            </div>
        </div>
    );
};
