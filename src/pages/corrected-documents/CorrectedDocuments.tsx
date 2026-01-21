/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { BreadCrumb } from '@components/bread-crumb';
import { Form } from '@components/form';
import { DownloadIcons } from '@components/icon';
import { Information } from '@components/information';
import { DatePickerDayRange, IOptionSelect, SearchInput, SelectSearchInput } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { IPaginatorBackend } from '@components/paginator-backend';
import { PageTitle } from '@components/page-title';
import { ACCEPT_EMAIL_NO_SENT } from '@constants/CorrectionElectronicInvoice';
import { paginationDataFormatDynamic } from '@constants/PaginationBack';
import { ANSWER_DIAN, INFORMATION_PAGE } from '@information-texts/CorrectedDocuments';
import { IGenericRecord } from '@models/GenericRecord';
import { formatDates } from '@pages/electronic-documents-generated';
import { getDocumentList } from '@redux/electronic-invoice/actions';
import { RootState } from '@redux/rootReducer';
import { getFile } from '@redux/user/actions';
import { buttonsFooterProps } from '@utils/Button';
import { getDateCreated, getUnixCalendar, getUnixFromDate } from '@utils/Date';
import { downloadIconsProps } from '@utils/DownloadFile';
import { assignValue } from '@utils/Json';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { TableCorrectedDocuments } from './components';
import { ICorrectionNotes, utils } from '.';

const CorrectedDocuments: React.FC = () => {
    const [history, dispatch, { FILE_NAME, VALIDATE_MODULE }] = [useHistory(), useDispatch(), utils];

    const { information, loader: loaderState } = useSelector(({ company, loader }: RootState) => ({ ...company, ...loader }));
    const { data: responseList, ...paginatorBack } = useSelector(
        ({ electronicInvoice: { responseList } }: RootState) => responseList
    );
    const [dates, setDates] = useState<{ start?: Date; end?: Date }>({ start: new Date(), end: new Date() });
    const formattedDates = useMemo(() => formatDates(dates), [dates]);
    const [dataTable, setDataTable] = useState<ICorrectionNotes[]>([]);
    const [correctedDocumentsData, setCorrectedDocumentsData] = useState<IPaginatorBackend<ICorrectionNotes>>(
        paginationDataFormatDynamic<ICorrectionNotes>()
    );
    const [searchValue, setSearchValue] = useState<string>('');
    const [select, setSelect] = useState<Record<string, string>>({ key: '', value: '' });

    const handleData = async (searchValue = ''): Promise<void> => {
        const key = select.key;
        await dispatch(
            getDocumentList(
                {
                    types: key ? utils.OPTION_KEY[key] : utils.TYPE_DOCUMENTS,
                    ...formattedDates,
                },
                false,
                searchValue
            )
        );
    };

    const changeDateRange = ([start, end]: any): void => {
        setDates({
            start,
            end,
        });
    };

    const handleSelect = ({ value, key }: IOptionSelect): void => {
        setSelect({ value, key });
    };

    const filterData = (data: ICorrectionNotes[]): ICorrectionNotes[] =>
        [...data].map(({ DIAN_response, ...detail }: ICorrectionNotes) => ({
            ...detail,
            message: true,
            DIAN_response: DIAN_response === ACCEPT_EMAIL_NO_SENT ? ANSWER_DIAN.EMAIL_NO_SENT : DIAN_response,
        }));

    const data = useMemo(() => filterData(dataTable), [dataTable]);

    const downloadReport = (type: string): void => {
        dispatch(
            getFile(
                {
                    type,
                    module: 'list-corrected-documents',
                    data: dataTable?.map(item => ({ ...item, quantity: item.number_sold })) || [],
                    range: {
                        start_date: getUnixCalendar(getUnixFromDate(dates.start), true),
                        finish_date: getUnixCalendar(getUnixFromDate(dates.end), false),
                    },
                    searched_by: searchValue ?? '...',
                    concept_type: select.value,
                },
                FILE_NAME
            )
        );
    };

    useEffect(() => {
        handleData();
    }, [dates, select?.key]);

    useEffect(() => {
        setDataTable(
            correctedDocumentsData?.data.map((item: IGenericRecord) => ({
                ...assignValue(
                    {
                        tree: {},
                        base: [
                            ...utils.KEYS_REPORT,
                            ...(Object.keys(item).includes('supplier_name') ? utils.KEY_SUPPLIER : utils.KEY_CLIENT),
                        ],
                    },
                    item
                ),
            })) as ICorrectionNotes[]
        );
    }, [correctedDocumentsData]);

    useEffect(() => {
        setCorrectedDocumentsData({ data: responseList, ...paginatorBack });
    }, [responseList]);

    useEffect(() => {
        handleData(searchValue);
    }, [searchValue]);

    const optionsInputRender = utils.OPTIONS_INPUT.map(item => ({ ...item, name: item.value }));

    return (
        <>
            <div className="flex flex-col h-full">
                <PageTitle {...utils.PAGE_TITLE} classContainer="lg:mb-0" classTitle="leading-19.38px" />
                <BreadCrumb routes={utils.BREAD_CRUMB} />
                <Information
                    {...INFORMATION_PAGE}
                    classNameTitle="font-allerbold text-26lg leading-8"
                    classNameSubContainer="justify-center mb-4.5"
                    classNameContainer="mb-4.5"
                    color="blue"
                />
                <Form sendWithEnter className="flex xs:flex-col gap-y-4.5 lg:gap-x-7 mb-4.5">
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `corrected-documents-filter`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        labelText="Documentos electrónicos:"
                        selectIconType="arrowDownGreen"
                        classesWrapper="w-55 xs:w-full"
                        onChangeSelect={(_, e): void => handleSelect(e)}
                        optionSelect={optionsInputRender}
                        valueSelect={select?.value}
                    />
                    <SearchInput
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `corrected-search`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Buscador rápido:"
                        placeholder="..."
                        classesWrapper="w-57.5 xs:w-full"
                        onChange={({ target: { value } }): void => setSearchValue(value)}
                        value={searchValue}
                        isNew
                    />
                    <DatePickerDayRange
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `corrected-range-date-created`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Fecha de transmisión:"
                        startDate={dates.start}
                        endDate={dates.end}
                        maxDate={new Date()}
                        classesWrapper="w-49 xs:w-full"
                        onChangeDateRange={changeDateRange}
                        isNew
                        minDate={getDateCreated(information?.created_at || 0)}
                    />
                </Form>
                <DownloadIcons
                    withoutText
                    {...downloadIconsProps(downloadReport, `${ModuleApp.ELECTRONIC_DOCUMENTS}-corrected`)}
                />
                <TableCorrectedDocuments
                    props={{ ...correctedDocumentsData, data: data, setData: setCorrectedDocumentsData }}
                    isLoadingTable={loaderState}
                />
            </div>
            <PageButtonsFooter
                {...buttonsFooterProps(ModuleApp.ELECTRONIC_DOCUMENTS, history, utils.NEXT_PAGE, {
                    moduleName: VALIDATE_MODULE,
                    name: VALIDATE_MODULE,
                })}
            />
        </>
    );
};

export default CorrectedDocuments;
