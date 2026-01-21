import React from 'react';
import { SingleCheckBox } from '@components/checkbox';
import { Icon } from '@components/icon';
import { ChangeEvent } from '@components/input';
import { Table } from '@components/table';
import { isEven } from '@utils/Number';
import { EMPTY_ARRAY_LENGTH } from '@utils/quoteHelpers';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { UI_TEXTS } from '@constants/QuoteViewLabels';
import { QuotesTableHeader } from './QuotesTableHeader';
import type { IReportTableProps } from '..';
import { formatTimestampToDate } from '..';
import '../QuoteList.scss';

const OBJECT_TYPE = 'object';

export const ReportTable: React.FC<IReportTableProps> = ({ data, onCheckboxChange, onQuoteClick, paginatorBackendData }) => {
    const handleSelectionRow = ({ target: { checked } }: ChangeEvent, row: number): void => {
        if (onCheckboxChange && data[row]) {
            const quoteId = data[row].id || data[row].number;
            onCheckboxChange(quoteId, checked);
        }
    };

    const getRowClassName = (columnClass: string, index: number): string => {
        const baseClasses = `table-field ${columnClass} quotes-report-table__cell-standard`;
        const backgroundClass = isEven(index + 1) ? 'bg-gray-light' : 'bg-white';
        return `${baseClasses} ${backgroundClass}`;
    };

    return (
        <div className="quotes-report-table">
            <Table
                id={generateId({
                    module: ModuleApp.QUOTES,
                    submodule: `report`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                headerRowsCustom={<QuotesTableHeader />}
                className="quotes-report-table__table"
                tbodyClassName="quotes-report-table__table"
                theadClassName="quotes-report-table__table"
                wrapperClassName="w-full"
                isHeaderRowsCustom
                customTable
                data={data}
                isNew
                paginatorBackendData={paginatorBackendData}
            >
                {Array.isArray(data) &&
                    data.length > EMPTY_ARRAY_LENGTH &&
                    data
                        .filter(item => item && typeof item === OBJECT_TYPE)
                        .map((item, index) => (
                            <tr
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `report-${item.id}-${index}`,
                                    action: ActionElementType.INFO,
                                    elementType: ElementType.ROW,
                                })}
                                key={item.id || index}
                            >
                                <td className="table-field quotes-report-table__selector quotes-report-table__cell-selector">
                                    <SingleCheckBox
                                        checked={item.checked || false}
                                        handleChange={(e: ChangeEvent): void => handleSelectionRow(e, index)}
                                        name="checked"
                                        className="single-checkbox--table"
                                    />
                                </td>
                                <td className={getRowClassName('quotes-report-table__number', index)}>
                                    <button
                                        id={generateId({
                                            module: ModuleApp.QUOTES,
                                            submodule: `report-${item.id}-${index}-number-quote`,
                                            action: ActionElementType.REDIRECT,
                                            elementType: ElementType.BTN,
                                        })}
                                        className="text-sm font-normal leading-4 text-left underline bg-transparent border-none cursor-pointer quotes-report-table__link-purple hover:opacity-80"
                                        onClick={(): void => onQuoteClick && onQuoteClick(item.id || item.number)}
                                    >
                                        {item.number || UI_TEXTS.PLACEHOLDERS.DEFAULT_QUOTE_NUMBER}
                                    </button>
                                </td>
                                <td className={getRowClassName('quotes-report-table__date', index)}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm leading-4 table-field-text">
                                            {formatTimestampToDate(item.date) || UI_TEXTS.PLACEHOLDERS.DATE}
                                        </span>
                                        <Icon name="calendarGray" alt="calendar" className="flex-shrink-0 w-4 h-4 ml-2" />
                                    </div>
                                </td>
                                <td className={getRowClassName('quotes-report-table__client', index)}>
                                    <span className="text-sm leading-4 table-field-text">
                                        {item.customer || item.client_name || UI_TEXTS.PLACEHOLDERS.DEFAULT_CUSTOMER}
                                    </span>
                                </td>
                                <td className={getRowClassName('quotes-report-table__email', index)}>
                                    <span className="text-sm leading-4 table-field-text">
                                        {item.email || item.client_email || UI_TEXTS.PLACEHOLDERS.DEFAULT_EMAIL}
                                    </span>
                                </td>
                                <td className={getRowClassName('quotes-report-table__status', index)}>
                                    <span className="text-sm leading-4 table-field-text">
                                        {item.state || UI_TEXTS.PLACEHOLDERS.DEFAULT_STATE}
                                    </span>
                                </td>
                            </tr>
                        ))}
            </Table>
        </div>
    );
};
