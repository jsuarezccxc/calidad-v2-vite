import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { getInformationCompany } from '@redux/company/actions';
import { getDocumentList } from '@redux/electronic-invoice/actions';
import { RootState } from '@redux/rootReducer';
import { buttonsFooterProps } from '@utils/Button';
import { getDateCreated, getUnixFromDate } from '@utils/Date';
import { isEven } from '@utils/Number';
import { getRoute, getRouteName } from '@utils/Paths';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { IGenericRecord } from '@models/GenericRecord';
import { BreadCrumb } from '@components/bread-crumb';
import { Link, LinkColor } from '@components/button';
import { Form } from '@components/form';
import { DatePickerDayInput, DatePickerDayRange, IOptionSelect, SelectSearchInput } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitle } from '@components/page-title';
import { SUPPORT_DOCUMENTS_TITLE } from '@constants/ElectronicDocuments';
import { Table } from '@components/table';
import { IPaginatorBackend } from '@components/paginator-backend';
import { NumberFormatInput, Text } from '@components/table-input';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { ONE } from '@constants/Numbers';
import { DOCUMENT_TYPE_REQUIRE } from '@constants/ElectronicInvoice';
import { paginationDataFormat } from '@constants/PaginationBack';
import { Routes } from '@constants/Paths';
import {
    headersTable,
    routes,
    SelectDocumentOrderOptions,
    SelectNoteOrderOptions,
    typesOfNoteDocument,
    typesOfSupportDocument,
} from '.';
import './DraftDocuments.scss';

export const DraftDocuments: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { information, responseList, loader: loaderState } = useSelector(
        ({ company, electronicInvoice, loader }: RootState) => ({
            ...company,
            ...electronicInvoice,
            ...loader,
        })
    );

    const isDocument = useMemo(() => !String(pathname).includes('notes'), [pathname]);
    const creationDate = useMemo(() => information?.created_at, [information]);

    const [dates, setDates] = useState<Record<string, Date>>({ start: new Date(), end: new Date() });
    const [selectedOption, setSelectedOption] = useState<IOptionSelect | undefined>(undefined);
    const [generatedDocumentsData, setGeneratedDocumentsData] = useState<IPaginatorBackend<IGenericRecord>>(paginationDataFormat);

    const changeDateRange = ([start, end]: [Date, Date]): void => {
        setDates({ start, end });
    };

    const redirectPage = (typeDocument: string): string => {
        if (typeDocument === DOCUMENT_TYPE_REQUIRE.INVOICE) return getRoute(Routes.GENERATE_SALES_INVOICE);
        if (typeDocument === DOCUMENT_TYPE_REQUIRE.SUPPORT_DOCUMENT) return getRoute(Routes.GENERATE_SUPPORT_DOCUMENT);
        if (typeDocument === DOCUMENT_TYPE_REQUIRE.CREDIT_NOTE) return getRoute(Routes.GENERATE_CREDIT_NOTE);
        if (typeDocument === DOCUMENT_TYPE_REQUIRE.DEBIT_NOTE) return getRoute(Routes.GENERATE_DEBIT_NOTE);
        return getRoute(Routes.GENERATE_ADJUSTMENT_NOTE);
    };

    useEffect(() => {
        dispatch(getInformationCompany());
    }, []);

    useEffect(() => {
        if (isDocument) setSelectedOption(undefined);
    }, [isDocument]);

    useEffect(() => {
        setGeneratedDocumentsData(responseList);
    }, [responseList]);

    useEffect(() => {
        if (!dates.start || !dates.end) return;
        dispatch(
            getDocumentList({
                types: selectedOption ? [selectedOption.code] : isDocument ? typesOfSupportDocument : typesOfNoteDocument,
                start_date: getUnixFromDate(dates.start),
                finish_date: getUnixFromDate(dates.end),
                is_draft: true,
            })
        );
    }, [dates, isDocument, selectedOption]);

    const filterOptionsRender = (isDocument ? SelectDocumentOrderOptions : SelectNoteOrderOptions).map(item => ({
        ...item,
        name: item.value,
    }));

    return (
        <>
            <main className="draft-documents">
                <PageTitle
                    pageContent={SUPPORT_DOCUMENTS_SUBTITLE}
                    title={SUPPORT_DOCUMENTS_TITLE}
                    classContainer="without-margin"
                />
                <BreadCrumb routes={routes(isDocument)} />
                <h3 className="font-bold text-center text-blue text-26lg font-allerbold mb-4.5">
                    {isDocument ? MODULE_TITLES.INVOICE : MODULE_TITLES.NOTE}
                </h3>
                <p className="mb-2 text-lg font-bold font-allerbold text-blue">Borradores de documento electrónicos</p>
                <p className="text-gray-dark mb-4.5">
                    Revise los documentos pendientes y realice los ajustes necesarios dando click sobre el documento.
                </p>
                <Form sendWithEnter className="flex flex-wrap mb-4.5">
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.DRAFT_DOCUMENTS,
                            submodule: `filter-document-type`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        optionSelect={filterOptionsRender}
                        placeholder="Seleccionar"
                        valueSelect={selectedOption?.value ?? ''}
                        onChangeSelect={(_, option): void => {
                            setSelectedOption(option);
                        }}
                        classesWrapper="w-55 mr-4.5"
                        labelText="Documento electrónico"
                        selectIconType="arrowDownGreen"
                    />
                    <DatePickerDayRange
                        id={generateId({
                            module: ModuleApp.DRAFT_DOCUMENTS,
                            submodule: `filter-date-range`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        startDate={dates.start}
                        endDate={dates.end}
                        onChangeDateRange={(date): void => changeDateRange(date as [Date, Date])}
                        labelText="Fecha de guardado:"
                        classesWrapper="w-49"
                        selectIconType="calendarGreen"
                        maxDate={new Date()}
                        minDate={getDateCreated(creationDate || 0)}
                    />
                </Form>
                <Table
                    id={generateId({
                        module: ModuleApp.DRAFT_DOCUMENTS,
                        action: ActionElementType.INFO,
                        elementType: ElementType.TBL,
                    })}
                    isLoading={loaderState}
                    data={[]}
                    isNew
                    headersTable={headersTable}
                    paginatorBackendData={{ ...generatedDocumentsData, setData: setGeneratedDocumentsData }}
                    customTable
                >
                    {generatedDocumentsData?.data.map(({ id = '', invoice_type = '', ...data }, index) => (
                        <tr
                            id={generateId({
                                module: ModuleApp.DRAFT_DOCUMENTS,
                                submodule: `${id}-${index}`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.ROW,
                            })}
                            key={id}
                            className={`${isEven(index + ONE) ? 'bg-gray-light' : 'bg-white'} report-table--tr`}
                        >
                            <td className="report-table--tbody report-table--text">
                                <Link
                                    id={generateId({
                                        module: ModuleApp.DRAFT_DOCUMENTS,
                                        submodule: `${id}-${index}-preview`,
                                        action: ActionElementType.INFO,
                                        elementType: ElementType.LNK,
                                    })}
                                    linkColor={LinkColor.PURPLE}
                                    text={invoice_type}
                                    href={`${redirectPage(invoice_type)}?ID=${id}`}
                                    classes="px-1 py-1 lg:px-2 lg:py-3"
                                />
                            </td>
                            <td className="report-table--tbody report-table--date">
                                <DatePickerDayInput
                                    id={generateId({
                                        module: ModuleApp.DRAFT_DOCUMENTS,
                                        submodule: `${id}-${index}-date`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    classesWrapperInput="border-none bg-transparent"
                                    classesInput="text-gray text-align-left"
                                    selectIconType="calendarGray"
                                    classesWrapper="w-full"
                                    selected={data?.date}
                                    disabled
                                />
                            </td>
                            <td className="report-table--tbody report-table--text">
                                <Text
                                    text={data?.client_name || data?.supplier_name}
                                    className="text-sm text-gray"
                                    editTable={false}
                                    type="text"
                                    disabled
                                />
                            </td>
                            <td className="report-table--tbody report-table--text">
                                <Text
                                    text={data?.client_document_number || data?.supplier_document_number}
                                    disabled
                                    type="text"
                                    editTable={false}
                                    className="text-sm text-gray"
                                />
                            </td>
                            <td className="report-table--tbody report-table--text">
                                <NumberFormatInput
                                    id={generateId({
                                        module: ModuleApp.DRAFT_DOCUMENTS,
                                        submodule: `${id}-${index}-total`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    inputClass="text-align-left text-gray"
                                    value={data.total}
                                    disabled
                                    isTable
                                />
                            </td>
                        </tr>
                    ))}
                </Table>
            </main>
            <div className="flex items-end justify-end my-0 text-right xs:flex xs:items-center xs:justify-center">
                <PageButtonsFooter
                    {...buttonsFooterProps(
                        ModuleApp.DRAFT_DOCUMENTS,
                        history,
                        getRoute(isDocument ? Routes.ELECTRONIC_DOCUMENTS_GENERATED : Routes.CORRECTED_DOCUMENTS),
                        {
                            name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                            moduleName: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
                        }
                    )}
                />
            </div>
        </>
    );
};

export default DraftDocuments;
