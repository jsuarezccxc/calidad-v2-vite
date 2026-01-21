import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@components/icon';
import { DatePickerBase } from '@components/date-picker';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { UI_TEXTS } from '@constants/QuoteViewLabels';
import type { IReportFiltersProps } from '..';

export const ReportFilters: React.FC<IReportFiltersProps> = ({ filterValues, filterHandlers }) => {
    const { search, documentStatus, startDate, endDate, hasSelectedQuotes } = filterValues;
    const { onSearchChange, onDocumentStatusChange, onStartDateChange, onEndDateChange, onDeleteClick } = filterHandlers;

    const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
    const startDateRef = useRef<HTMLDivElement>(null);
    const endDateRef = useRef<HTMLDivElement>(null);

    const getFilterInputClassName = (baseClasses: string, hasValue: boolean, emptyClass: string): string => {
        return `${baseClasses} ${!hasValue ? emptyClass : ''}`;
    };

    const handleStartDateChange = (date: Date | null): void => {
        if (date) {
            const formattedDate = date.toISOString().split('T')[0];
            onStartDateChange(formattedDate);
        }
        setShowStartDatePicker(false);
    };

    const handleEndDateChange = (date: Date | null): void => {
        if (date) {
            const formattedDate = date.toISOString().split('T')[0];
            onEndDateChange(formattedDate);
        }
        setShowEndDatePicker(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (startDateRef.current && !startDateRef.current.contains(event.target as Node)) {
                setShowStartDatePicker(false);
            }
            if (endDateRef.current && !endDateRef.current.contains(event.target as Node)) {
                setShowEndDatePicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return (): void => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                        <div
                            ref={startDateRef}
                            className="relative bg-white h-8 rounded-md border border-[#AEAEAF] overflow-hidden quote-filter-input"
                        >
                            {showStartDatePicker ? (
                                <div className="absolute left-0 z-10 bg-white border rounded-md shadow-lg top-full border-gray">
                                    <DatePickerBase
                                        id={generateId({
                                            module: ModuleApp.QUOTES,
                                            submodule: `reports-filter-date`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.TXT,
                                        })}
                                        selected={startDate ? new Date(startDate) : null}
                                        onChangeDate={handleStartDateChange}
                                        placeholder={UI_TEXTS.PLACEHOLDERS.DATE}
                                        className="w-full h-8 pl-2 pr-8 bg-transparent border-none outline-none"
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                            ) : (
                                <input
                                    id={generateId({
                                        module: ModuleApp.QUOTES,
                                        submodule: `reports-filter-start-date`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    type="text"
                                    value={startDate ? new Date(startDate).toLocaleDateString('es-ES') : ''}
                                    readOnly
                                    placeholder={UI_TEXTS.PLACEHOLDERS.DATE}
                                    className={getFilterInputClassName(
                                        'w-full h-full pl-2 pr-8 bg-transparent border-none outline-none date-input-placeholder quote-filter-text--start-date cursor-pointer',
                                        !!startDate,
                                        'quote-filter-text--start-date--empty'
                                    )}
                                    onClick={(): void => setShowStartDatePicker(true)}
                                />
                            )}
                            <div className="absolute transform -translate-y-1/2 right-3 top-1/2">
                                <Icon
                                    name="calendarGreen"
                                    className="w-5.5 h-5.5 cursor-pointer"
                                    onClick={(): void => setShowStartDatePicker(!showStartDatePicker)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <div className="px-1.5 py-0.5">
                            <label className="font-['Aller:Bold',_sans-serif] text-xs font-bold leading-[100%] text-blue">
                                {UI_TEXTS.LABELS.FINAL_DATE}
                            </label>
                        </div>
                        <div
                            ref={endDateRef}
                            className="relative bg-white h-8 rounded-md border border-[#AEAEAF] overflow-hidden quote-filter-input"
                        >
                            {showEndDatePicker ? (
                                <div className="absolute left-0 z-10 bg-white border rounded-md shadow-lg top-full border-gray">
                                    <DatePickerBase
                                        selected={endDate ? new Date(endDate) : null}
                                        onChangeDate={handleEndDateChange}
                                        placeholder={UI_TEXTS.PLACEHOLDERS.DATE}
                                        className="w-full h-8 pl-2 pr-8 bg-transparent border-none outline-none"
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                            ) : (
                                <input
                                    id={generateId({
                                        module: ModuleApp.QUOTES,
                                        submodule: `reports-filter-end-date`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    type="text"
                                    value={endDate ? new Date(endDate).toLocaleDateString('es-ES') : ''}
                                    readOnly
                                    placeholder={UI_TEXTS.PLACEHOLDERS.DATE}
                                    className={getFilterInputClassName(
                                        'w-full h-full pl-2 pr-8 bg-transparent border-none outline-none date-input-placeholder quote-filter-text--end-date cursor-pointer',
                                        !!endDate,
                                        'quote-filter-text--end-date--empty'
                                    )}
                                    onClick={(): void => setShowEndDatePicker(true)}
                                />
                            )}
                            <div className="absolute transform -translate-y-1/2 right-3 top-1/2">
                                <Icon
                                    name="calendarGreen"
                                    className="w-5.5 h-5.5 cursor-pointer"
                                    onClick={(): void => setShowEndDatePicker(!showEndDatePicker)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-end">
                <div className="flex items-end flex-1 gap-4">
                    <div className="flex flex-col gap-0.5">
                        <div className="px-1.5 py-0.5">
                            <label className="font-['Aller:Bold',_sans-serif] text-xs font-bold leading-[100%] text-blue">
                                {UI_TEXTS.LABELS.SEARCHER}
                            </label>
                        </div>
                        <div className="relative bg-white h-8 rounded-md border border-[#AEAEAF] quote-filter-wide">
                            <input
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `reports-filter-search`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                type="text"
                                placeholder="..."
                                value={search}
                                onChange={(e): void => onSearchChange(e.target.value)}
                                onKeyPress={(e): void => {
                                    if (e.key === 'Enter') {
                                        onSearchChange(search);
                                    }
                                }}
                                className={getFilterInputClassName(
                                    'w-full h-full bg-transparent outline-none border-none pl-1.5 pr-8 py-1.5 quote-filter-text--search',
                                    !!search,
                                    'quote-filter-text--search--empty'
                                )}
                            />
                            <Icon
                                name="searchGreen"
                                className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-5.5 h-5.5 cursor-pointer"
                                onClick={(): void => onSearchChange(search)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <div className="px-1.5 py-0.5">
                            <label className="font-['Aller:Bold',_sans-serif] text-xs font-bold leading-[100%] text-blue">
                                {UI_TEXTS.LABELS.DOCUMENT_STATUS}
                            </label>
                        </div>
                        <div className="relative bg-white h-8 rounded-md border border-[#AEAEAF] quote-filter-wide">
                            <select
                                id={generateId({
                                    module: ModuleApp.QUOTES,
                                    submodule: `reports-filter-status`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                value={documentStatus}
                                onChange={(e): void => onDocumentStatusChange(e.target.value)}
                                className={getFilterInputClassName(
                                    'w-full h-full bg-transparent outline-none text-left appearance-none cursor-pointer border-none pl-1.5 pr-8 py-1.5 quote-filter-text--select',
                                    !!(documentStatus && documentStatus !== ''),
                                    'quote-filter-text--select--empty'
                                )}
                            >
                                <option value="" disabled hidden>
                                    {UI_TEXTS.LABELS.SELECT_OPTION}
                                </option>
                                <option value="Enviado">{UI_TEXTS.LABELS.SENT}</option>
                                <option value="Sin enviar">{UI_TEXTS.LABELS.UNSENT}</option>
                            </select>
                            <Icon
                                name="arrowDownGreen"
                                className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-5.5 h-5.5 pointer-events-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center ml-4">
                    <Icon
                        id={generateId({
                            module: ModuleApp.QUOTES,
                            submodule: `reports-filter`,
                            action: ActionElementType.DELETE,
                            elementType: ElementType.ICO,
                        })}
                        name="trashBlue"
                        className={`w-5.5 h-5.5 transition-all duration-200 ${
                            hasSelectedQuotes ? 'cursor-pointer hover:scale-105 opacity-100' : 'cursor-not-allowed opacity-50'
                        }`}
                        onClick={(): void => {
                            if (hasSelectedQuotes) {
                                onDeleteClick();
                            }
                        }}
                        title={
                            hasSelectedQuotes ? 'Eliminar cotizaciones seleccionadas' : 'Seleccione cotizaciones para eliminar'
                        }
                    />
                </div>
            </div>
        </div>
    );
};
