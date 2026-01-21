import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { Form } from '@components/form';
import { DownloadIcons, Icon } from '@components/icon';
import { DatePickerDayInput, IOptionSelect, SearchInput, SelectSearchInput } from '@components/input';
import { Table } from '@components/table';
import { IGenericPaginationData, paginationDataFormatDynamic } from '@constants/PaginationBack';
import { ONE } from '@constants/Numbers';
import { ZERO } from '@constants/UtilsConstants';
import { IGenericRecord } from '@models/GenericRecord';
import { IKardexMovement } from '@models/Inventory';
import { THREE, TWO } from '@pages/virtual-store-sales-receipts';
import { getKardexDailyInventoryMovement, getReportKardexInventory } from '@redux/inventory/actions';
import { RootState } from '@redux/rootReducer';
import { currentDateInUnix, getDateCreated, getUnixFromDate } from '@utils/Date';
import { downloadIconsProps } from '@utils/DownloadFile';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { CustomHeaderTable } from './CustomHeaderTable';
import { CONCEPT_OPTIONS, getRequestFile, initialDateState, SelectOrderOptions } from '.';

export const ReportTable: React.FC = () => {
    const {
        information,
        kardexMovement: { data: kardexMovement, ...metaTable },
        loader: loaderState,
    } = useSelector(({ company, inventory, loader }: RootState) => ({ ...company, ...inventory, ...loader }));

    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState<number>(currentDateInUnix());
    const [sortBy, setSortBy] = useState('');
    const [selectedConcept, setSelectedConcept] = useState({ key: '', value: '' });
    const [kardexData, setKardexData] = useState<IGenericPaginationData<IKardexMovement>>(
        paginationDataFormatDynamic<IKardexMovement>()
    );

    const onChange = (date: Date): void => {
        setStartDate(getUnixFromDate(date));
    };

    useEffect(() => {
        setKardexData({ data: kardexMovement, ...metaTable });
    }, [kardexMovement]);

    useEffect(() => {
        dispatch(getKardexDailyInventoryMovement(initialDateState.initialDate, initialDateState.finishDate));
    }, []);

    useEffect(() => {
        if (search.length >= THREE || !search) {
            dispatch(
                getKardexDailyInventoryMovement(
                    startDate,
                    initialDateState.finishDate,
                    false,
                    search,
                    selectedConcept.value || '',
                    sortBy
                )
            );
        }
    }, [search, selectedConcept, sortBy, startDate]);

    const downloadFile = (type: string): void => {
        dispatch(
            getReportKardexInventory(
                getRequestFile(
                    type,
                    startDate,
                    initialDateState.finishDate,
                    sortBy,
                    search,
                    selectedConcept.value,
                    kardexData?.data
                )
            )
        );
    };

    const handleOrderOption = (option: IOptionSelect): void => {
        setSortBy(SelectOrderOptions.find(orderOption => orderOption.code === option.code)?.code || '');
    };

    const orderOptionsRender = SelectOrderOptions.map(item => ({ ...item, name: item.value }));
    const conceptOptionsRender = CONCEPT_OPTIONS.map(item => ({ ...item, name: item.value }));

    return (
        <div className="report-table">
            <Form sendWithEnter>
                <div className="flex flex-wrap lg:flex-nowrap mb-4.5">
                    <SearchInput
                        id={generateId({
                            module: ModuleApp.ACCOUNTING_REPORTS,
                            submodule: `${ModuleApp.ELECTRONIC_DOCUMENTS}-search-sku`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        name="search"
                        value={search}
                        onChange={(e): void => setSearch(e.target.value)}
                        classesWrapper="w-full lg:w-57.5 lg:mr-4.5"
                        labelText="Buscador por:"
                        placeholder="SKU/Producto"
                        iconClassName="w-5.5 h-5.5"
                        alphanumeric
                        isNew
                    />
                    <DatePickerDayInput
                        id={generateId({
                            module: ModuleApp.ACCOUNTING_REPORTS,
                            submodule: `${ModuleApp.ELECTRONIC_DOCUMENTS}-filter-start-date`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        maxDate={new Date()}
                        labelText="Fecha:"
                        selected={startDate}
                        selectIconType="calendarGreen"
                        classesWrapper="w-full lg:w-49 lg:mr-4.5"
                        onChangeDate={onChange}
                        withoutDate
                        minDate={getDateCreated(information?.created_at || ZERO)}
                    />
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.ACCOUNTING_REPORTS,
                            submodule: `${ModuleApp.ELECTRONIC_DOCUMENTS}-order-by`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        labelText="Ordenar por:"
                        optionSelect={orderOptionsRender}
                        onChangeSelect={(_, e): void => handleOrderOption(e)}
                        selectIconType="arrowDownGreen"
                        classesWrapper="w-full lg:w-57.5 lg:mr-4.5"
                    />
                    <SelectSearchInput
                        id={generateId({
                            module: ModuleApp.ACCOUNTING_REPORTS,
                            submodule: `${ModuleApp.ELECTRONIC_DOCUMENTS}-filter-concept`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.DRP,
                        })}
                        labelText="Tipo de concepto:"
                        optionSelect={conceptOptionsRender}
                        onChangeSelect={(_, option): void => {
                            setSelectedConcept(option);
                        }}
                        selectIconType="arrowDownGreen"
                        classesWrapper="w-full lg:w-57.5"
                    />
                </div>
                <DownloadIcons
                    notFirstXls
                    {...downloadIconsProps(downloadFile, ModuleApp.ACCOUNTING_REPORTS)}
                    className="report-table__download"
                    withoutText
                />
            </Form>
            <Table
                id={generateId({
                    module: ModuleApp.ACCOUNTING_REPORTS,
                    submodule: ModuleApp.ELECTRONIC_DOCUMENTS,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                isLoading={loaderState}
                data={[]}
                withScrollTable
                theadClassName="report-table__head flex border-b border-gray"
                wrapperClassName="report-table__wrapper"
                isHeaderRowsCustom
                headerRowsCustom={<CustomHeaderTable />}
                tbodyClassName="report-table__body flex flex-col"
                customTable
                paginatorBackendData={{
                    setData: setKardexData,
                    ...kardexData,
                }}
            >
                {kardexData?.data?.map?.((data: IGenericRecord, index) => (
                    <tr
                        id={generateId({
                            module: ModuleApp.ACCOUNTING_REPORTS,
                            submodule: `${ModuleApp.ELECTRONIC_DOCUMENTS}-${ModuleApp.TABLE}-${index}`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.ROW,
                        })}
                        key={data?.name + index}
                        className={`${(index + ONE) % TWO == ZERO ? 'bg-gray-light' : 'bg-white'} report-table--tr`}
                    >
                        <td className="report-table--tbody report-table--date">
                            <DatePickerDayInput
                                id={generateId({
                                    module: ModuleApp.ACCOUNTING_REPORTS,
                                    submodule: `${ModuleApp.ELECTRONIC_DOCUMENTS}-${ModuleApp.TABLE}-${data?.name + index}-date-order`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                classesWrapper="w-full"
                                selected={getUnixFromDate(data?.date_order)}
                                disabled
                            />
                        </td>
                        <td className="report-table--tbody report-table--product">
                            <span> {data?.name}</span>
                        </td>
                        <td className="report-table--tbody report-table--sku">
                            <span>{data?.sku_internal}</span>
                        </td>
                        <td className="report-table--tbody report-table--concept">
                            <span>{data?.concept}</span>
                        </td>
                        <td className="report-table--tbody report-table--electronic">
                            <span>{data?.number}</span>
                        </td>
                        <td className="px-2 report-table--tbody w-29">
                            <NumberFormat
                                className="bg-transparent"
                                thousandSeparator="."
                                decimalSeparator=","
                                disabled
                                value={data?.input_quantity}
                            />
                        </td>
                        <td className="pr-2 report-table--tbody w-29">
                            <div className="flex items-center">
                                <Icon name="moneyGray" classIcon="w-5.5 h-5.5" />
                                <NumberFormat
                                    className="bg-transparent"
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    disabled
                                    value={data?.input_unit_value_product}
                                />
                            </div>
                        </td>
                        <td className="px-2 report-table--tbody w-29">
                            <NumberFormat
                                className="bg-transparent"
                                thousandSeparator="."
                                decimalSeparator=","
                                disabled
                                value={data?.output_quantity}
                            />
                        </td>
                        <td className="pr-2 report-table--tbody w-29">
                            <div className="flex items-center">
                                <Icon name="moneyGray" classIcon="w-5.5 h-5.5" />
                                <NumberFormat
                                    className="bg-transparent"
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    disabled
                                    value={data?.output_unit_value_product}
                                />
                            </div>
                        </td>
                        <td className="px-2 report-table--tbody w-29">
                            <NumberFormat
                                className="bg-transparent"
                                thousandSeparator="."
                                decimalSeparator=","
                                disabled
                                value={data?.available_quantity}
                            />
                        </td>
                        <td className="pr-2 report-table--tbody w-29">
                            <div className="flex items-center">
                                <Icon name="moneyGray" classIcon="w-5.5 h-5.5" />
                                <NumberFormat
                                    className="bg-transparent"
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    disabled
                                    value={data?.available_unit_value_product}
                                />
                            </div>
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    );
};
