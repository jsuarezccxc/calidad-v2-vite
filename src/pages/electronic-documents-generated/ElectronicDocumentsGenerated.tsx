/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
//--- Components ---//
import { BreadCrumb } from '@components/bread-crumb';
import { Form } from '@components/form';
import { DatePickerDayRange, IOptionSelect, SearchInput, SelectSearchInput } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitle } from '@components/page-title';
import { IPaginatorBackend } from '@components/paginator-backend';
//--- Constants ---//
import { TitleButtons } from '@constants/Buttons';
import { paginationDataFormat } from '@constants/PaginationBack';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { Routes } from '@constants/Paths';
//--- Information Texts ---//
import { DOCUMENT_INFORMATION } from '@information-texts/ElectronicDocumentsGenerated';
//--- Models ---//
import { IGenericRecord } from '@models/GenericRecord';
//--- Redux ---//
import { getDocumentList } from '@redux/electronic-invoice/actions';
import { RootState } from '@redux/rootReducer';
import { getFile } from '@redux/user/actions';
//--- Utils ---//
import { buttonsFooterProps } from '@utils/Button';
import { getDateCreated } from '@utils/Date';
import { getRoute, getRouteName } from '@utils/Paths';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
//--- Root ---//
import { DocumentTable } from './components';
import { DOCUMENT_OPTIONS, DOCUMENT_TYPES, FILE_TITLE, formatDates, getRequestFile, getRoutes, IDates } from '.';
//--- Styles ---//
import './ElectronicDocumentsGenerated.scss';

const ElectronicDocumentsGenerated: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { information, responseList, loader: loaderState } = useSelector(
        ({ company, electronicInvoice, loader }: RootState) => ({
            ...company,
            ...electronicInvoice,
            ...loader,
        })
    );
    const [data, setData] = useState<IGenericRecord[]>([]);
    const [dates, setDates] = useState<IDates>({ start: new Date(), end: new Date() });
    const [searchValue, setSearchValue] = useState<string>('');
    const [selectedDocument, setSelectedDocument] = useState<Record<string, string>>({ key: '', value: '' });
    const [generatedDocumentsData, setGeneratedDocumentsData] = useState<IPaginatorBackend<IGenericRecord>>(paginationDataFormat);
    const routes = getRoutes();

    const formattedDates = useMemo(() => formatDates(dates), [dates]);

    useEffect(() => {
        setData(generatedDocumentsData?.data);
    }, [generatedDocumentsData]);

    useEffect(() => {
        setGeneratedDocumentsData(responseList);
    }, [responseList]);

    useEffect(() => {
        dispatch(
            getDocumentList(
                { ...formattedDates, types: selectedDocument.key ? [selectedDocument.key] : DOCUMENT_TYPES, ccxc: false },
                false,
                searchValue
            )
        );
    }, [dates, searchValue, selectedDocument.key]);

    const downloadFile = (type: string): void => {
        const value = selectedDocument.value || null;
        dispatch(getFile(getRequestFile({ type, data, formattedDates, searchValue, selectedDocument: value }), FILE_TITLE));
    };

    const filterByDocument = ({ value, key }: IOptionSelect): void => {
        setSelectedDocument({ value, key });
    };

    const handleDateChange = ([start, end]: any): void => setDates({ start, end });

    const documentOptionsRender = DOCUMENT_OPTIONS.map(item => ({ ...item, name: item.value }));

    return (
        <div className="generated-documents">
            <main>
                <PageTitle title={getRouteName(Routes.DASHBOARD_ELECTRONIC_DOCUMENT)} pageContent={SUPPORT_DOCUMENTS_SUBTITLE} />
                <BreadCrumb routes={routes} />
                <h2 className="page-subtitle">{getRouteName(Routes.ELECTRONIC_DOCUMENTS_GENERATED)}</h2>
                <p className="my-4.5 text-gray-dark">{DOCUMENT_INFORMATION.INSTRUCTIONS}</p>
                <Form sendWithEnter className="filters">
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `generated-filter-type`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        classesWrapper="filters__document-selector"
                        labelText="Documentos electrónicos:"
                        optionSelect={documentOptionsRender}
                        onChangeSelect={(_, e): void => filterByDocument(e)}
                        valueSelect={selectedDocument?.value}
                    />
                    <SearchInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `generated-seatch`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Buscador rápido:"
                        onChange={({ target: { value } }): void => setSearchValue(value)}
                        value={searchValue}
                        classesWrapper="filters__search-input"
                        maxLength={240}
                    />
                    <DatePickerDayRange
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `generated-filter-dates`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        classesWrapper="filters__date-picker"
                        labelText="Fecha de transmisión:"
                        startDate={dates?.start}
                        endDate={dates?.end}
                        maxDate={new Date()}
                        onChangeDateRange={handleDateChange}
                        minDate={getDateCreated(information?.created_at || 0)}
                    />
                </Form>
                <DocumentTable
                    isLoadingTable={loaderState}
                    data={data}
                    downloadFile={downloadFile}
                    paginatorBack={{ ...generatedDocumentsData, setData: setGeneratedDocumentsData }}
                />
            </main>
            <PageButtonsFooter
                {...buttonsFooterProps(
                    ModuleApp.ELECTRONIC_DOCUMENTS,
                    history,
                    getRoute(Routes.PREFIX_NOTE),
                    {
                        name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                        moduleName: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                    },
                    TitleButtons.NEXT
                )}
            />
        </div>
    );
};

export default ElectronicDocumentsGenerated;
