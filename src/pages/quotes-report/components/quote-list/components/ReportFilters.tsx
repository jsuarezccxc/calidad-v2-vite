import React from 'react';
import { Icon } from '@components/icon';
import { DatePickerBase } from '@components/date-picker';
import { SelectSearchInput, TextInput } from '@components/input';
import { UI_TEXTS } from '@constants/QuoteViewLabels';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { getUnixFromDate } from '@utils/Date';
import type { IReportFiltersProps } from '..';

export const ReportFilters: React.FC<IReportFiltersProps> = ({ filterValues, filterHandlers }) => {
    const { search, documentStatus, startDate, endDate, hasSelectedQuotes } = filterValues;
    const { onSearchChange, onDocumentStatusChange, onStartDateChange, onEndDateChange, onDeleteClick } = filterHandlers;

    const getFilterInputClassName = (baseClasses: string, hasValue: boolean, emptyClass: string): string => {
        return `${baseClasses} ${!hasValue ? emptyClass : ''}`;
    };

    const handleStartDateChange = (date: Date | null): void => {
        onStartDateChange(date);
    };

    const handleEndDateChange = (date: Date | null): void => {
        onEndDateChange(date);
    };

    return (
        <div className="mb-4">
            <div className="flex items-end justify-between mb-4">
                <div className="flex items-end gap-4">
                    <div className="flex flex-col gap-0.5">
                        <div className="px-1.5 py-0.5">
                            <label className="font-['Aller:Bold',_sans-serif] text-xs font-bold leading-[100%] text-blue">
                                {UI_TEXTS.LABELS.INITIAL_DATE}
                            </label>
                        </div>
                        <div className="relative bg-white rounded-md border border-[#AEAEAF] quote-filter-date quotes-report-datepicker">
                            <DatePickerBase
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: 'reports-filter-start-date',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                selected={startDate ? getUnixFromDate(startDate) : null}
                                onChangeDate={handleStartDateChange}
                                placeholder={UI_TEXTS.PLACEHOLDERS.DATE}
                                className={getFilterInputClassName(
                                    'h-full pl-2 pr-8 bg-transparent border-none outline-none date-input-placeholder quote-filter-text--start-date cursor-pointer',
                                    !!startDate,
                                    'quote-filter-text--start-date--empty'
                                )}
                                dateFormat="dd/MM/yyyy"
                                maxDate={new Date()}
                            />
                            <div className="absolute transform -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                <Icon name="calendarGreen" className="w-5.5 h-5.5" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <div className="px-1.5 py-0.5">
                            <label className="font-['Aller:Bold',_sans-serif] text-xs font-bold leading-[100%] text-blue">
                                {UI_TEXTS.LABELS.FINAL_DATE}
                            </label>
                        </div>
                        <div className="relative bg-white rounded-md border border-[#AEAEAF] quote-filter-date quotes-report-datepicker">
                            <DatePickerBase
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: 'reports-filter-end-date',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                selected={endDate ? getUnixFromDate(endDate) : null}
                                onChangeDate={handleEndDateChange}
                                placeholder={UI_TEXTS.PLACEHOLDERS.DATE}
                                className={getFilterInputClassName(
                                    'h-full pl-2 pr-8 bg-transparent border-none outline-none date-input-placeholder quote-filter-text--end-date cursor-pointer',
                                    !!endDate,
                                    'quote-filter-text--end-date--empty'
                                )}
                                dateFormat="dd/MM/yyyy"
                                maxDate={new Date()}
                                minDate={startDate ? new Date(startDate) : undefined}
                            />
                            <div className="absolute transform -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                <Icon name="calendarGreen" className="w-5.5 h-5.5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-end">
                <div className="flex items-end flex-1 gap-4">
                    <TextInput
                        id={generateId({
                            module: ModuleApp.QUOTES,
                            submodule: 'reports-filter-search',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        name="search"
                        value={search}
                        onChange={(e): void => onSearchChange(e.target.value)}
                        onKeyDown={(e): void => {
                            if (e.key === 'Enter') {
                                onSearchChange(search);
                            }
                        }}
                        placeholder="..."
                        labelText={UI_TEXTS.LABELS.SEARCHER}
                        classesWrapper="flex flex-col gap-0.5 quote-filter-input"
                        classesInput={getFilterInputClassName(
                            'h-8 p-1.5 quote-filter-text--search',
                            !!search,
                            'quote-filter-text--search--empty'
                        )}
                        classesLabel="font-['Aller:Bold',_sans-serif] text-xs font-bold leading-[100%] text-blue"
                        icons={true}
                        selectIconType="searchGreen"
                        classIconSearch="quote-search-icon"
                    />

                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.QUOTES,
                            submodule: 'reports-filter-status',
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        name="documentStatus"
                        valueSelect={documentStatus}
                        optionSelect={[
                            { value: 'sent', name: 'Enviado' },
                            { value: 'unsent', name: 'Sin enviar' },
                        ]}
                        onChangeSelect={(value): void => onDocumentStatusChange(value || '')}
                        placeholder={UI_TEXTS.LABELS.SELECT_OPTION}
                        labelText={UI_TEXTS.LABELS.DOCUMENT_STATUS}
                        classesWrapper="flex flex-col gap-0.5 quote-filter-input"
                        classesLabel="font-['Aller:Bold',_sans-serif] text-xs font-bold leading-[100%] text-blue"
                        selectIconType="arrowDownGreen"
                        classIconSearch="quote-dropdown-icon"
                    />
                </div>

                <div className="flex items-center ml-4">
                    <Icon
                        id={generateId({
                            module: ModuleApp.QUOTES,
                            submodule: 'reports-filter',
                            action: ActionElementType.DELETE,
                            elementType: ElementType.ICO,
                        })}
                        name="trashBlue"
                        className="w-5.5 h-5.5 transition-all duration-200 cursor-pointer hover:scale-105"
                        onClick={(): void => {
                            if (hasSelectedQuotes) {
                                onDeleteClick();
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
