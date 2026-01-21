import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NumberFormatValues } from 'react-number-format';
import dayjs from '@utils/Dayjs';
import { RootState } from '@redux/rootReducer';
import useSelectSearch from '@hooks/useSelectSearch';
import usePaginator from '@hooks/usePaginator';
import { IGenericRecord } from '@models/GenericRecord';
import { ITaxesProductsStock } from '@models/Inventory';
import { sortArray } from '@utils/Array';
import { getChecked, handleChecked } from '@utils/Checkboxs';
import { changesTypeInput, defaultPercentageInput, sortOptionBatch, taxInformationForTables } from '@utils/ElectronicInvoice';
import { buildOptions, buildOptionsBatches, buildOptionsDate, buildOptionsSku } from '@utils/Company';
import { MaxLengthFields, NA } from '@constants/ElectronicInvoice';
import { ITEMS_PAGE } from '@constants/Paginator';
import usePermissions from '@hooks/usePermissions';
import { Icon } from '@components/icon';
import { Table } from '@components/table';
import { SelectInput } from '@components/input';
import { Checkbox } from '@components/checkbox';
import { DatePickerBase } from '@components/date-picker';
import { HeaderTableInvoice } from '@components/electronic-invoice/components';
import { NumberFormatInput, PercentageFormatInput, Text, TextArea } from '@components/table-input';
import { TableNameInputs } from '@constants/CancellationElectronic';
import { IOption, SelectSearch } from '@components/select-search';
import { Paginator } from '@components/paginator';
import { NO_QUANTITIES_AVAILABLE, VALUE } from '.';
import './TableCorrection.scss';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';

export const TableCorrection: React.FC<IGenericRecord> = ({
    data = [],
    optionsProducts = [],
    handleChangeSelect,
    handleChangeWarehouse,
    handleChange,
    annulation = false,
    selected = [],
    setSelected = [],
    sendInvoice = false,
    handleChangeBatchAndDate = (): void => {},
    setTableData,
    isMandate = false,
    symbol,
}) => {
    const { suppliers } = useSelector(({ suppliers }: RootState) => suppliers);
    const { showSelectSearch, toggleSelectSearch } = useSelectSearch();

    const { disabledInputs } = usePermissions();

    useEffect(() => {
        getLimits();
    }, [data]);

    const classRequired = (item: IGenericRecord, name: string): string => {
        if (sendInvoice) {
            if (item?.warehouse_name.value === NO_QUANTITIES_AVAILABLE || item[name].required) {
                return 'required table-body-correction--required';
            }
        }
        return 'editable';
    };

    const checkDisabled = (item: IGenericRecord, isInputNumber = false): boolean => {
        if (!annulation && isInputNumber) return annulation;
        return (
            item.warehouse_name.value === NO_QUANTITIES_AVAILABLE ||
            item.warehouse_name.value === NA ||
            !item.sku_internal.value ||
            !item.unique_product_name.value ||
            annulation
        );
    };

    const validateOptions = (options: IOption[]): IOption[] => {
        return options.map(option => ({
            name: option.value,
            value: option.id,
            id: option.id,
        }));
    };

    const handleChangeSelectSupplier = (option: IOption, item: IGenericRecord): void => {
        setTableData(
            data.map((product: IGenericRecord) => {
                if (product.id === item.id) {
                    return {
                        ...item,
                        is_mandate: true,
                        mandate_id: option.value,
                        mandate: suppliers.find(supplier => supplier.id === option.value),
                    };
                }
            })
        );
    };

    const { paginator, getLimits } = usePaginator(data);

    return (
        <>
            <Table
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `document-correction`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                isHeaderRowsCustom
                headerRowsCustom={<HeaderTableInvoice isMandate={isMandate} isDocument />}
                customTable
                data={[]}
                editable
                isNew
            >
                {data.slice(paginator?.limits.start, paginator?.limits.finish).map((item: IGenericRecord, index: number) => (
                    <tr
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `document-correction-${index}`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.ROW,
                        })}
                        key={index}
                        className="table-body-correction"
                    >
                        {!annulation && (
                            <td className="td-checkbox">
                                <Checkbox
                                    checked={getChecked(String(item.temporary_id), selected)}
                                    onChange={(): void => handleChecked(item, selected, setSelected, false, 'temporary_id')}
                                    name="check"
                                    classContainer="w-max mr-7 p-0 cursor-pointer"
                                    disabled={disabledInputs}
                                />
                            </td>
                        )}
                        <td className="field-body--editable text-gray">{item.number}</td>
                        <td className={`field-body--editable ${classRequired(item, 'sku_internal')} `}>
                            <SelectSearch
                                options={[
                                    ...validateOptions(sortArray(buildOptionsSku(optionsProducts), VALUE)),
                                    ...validateOptions(sortArray(buildOptions(optionsProducts), VALUE)),
                                ]}
                                onChange={(option): void => handleChangeSelect(option, item)}
                                toggleSelectSearch={toggleSelectSearch}
                                selectIconType="arrowDownGreen"
                                value={item.sku_internal.id}
                                showList={showSelectSearch}
                                disabled={disabledInputs}
                                name={`sku-${index}`}
                            />
                        </td>
                        <td className="field-body--editable">
                            <TextArea
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `document-correction-${index}-description`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                isTable
                                value={item.description || ''}
                                classesInput="text-left px-2"
                                onChange={(e): void => handleChange(e, item, 'description', true)}
                                disabled={disabledInputs || annulation}
                                maxLength={MaxLengthFields.DESCRIPTION}
                            />
                        </td>

                        <td className={`field-body--editable ${classRequired(item, 'warehouse_name')}`}>
                            {item?.warehouse_name.value === NA ? (
                                <div className="px-2 text-gray">{NA}</div>
                            ) : (
                                <SelectInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `document-correction-${index}-warehouse`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.DRP,
                                    })}
                                    value={item.warehouse_name.value}
                                    isTable
                                    options={buildOptions(
                                        item.test.filter((item: IGenericRecord) => item.warehouses_id),
                                        undefined,
                                        undefined,
                                        true
                                    )}
                                    optionSelected={(option): void => handleChangeWarehouse(option, item)}
                                    selectIconType="arrowDownGreen"
                                    disabled={disabledInputs || checkDisabled(item)}
                                    classesWrapper="w-full"
                                />
                            )}
                        </td>
                        <td className={`field-body--editable ${classRequired(item, 'batch_number')}`}>
                            {changesTypeInput(item.warehouse_name.value) ? (
                                <Text
                                    type="text"
                                    name={TableNameInputs.BATCH_INPUT}
                                    text={item.text_fields.batch}
                                    onChange={(e): void => handleChange(e, item, TableNameInputs.BATCH_INPUT)}
                                    disabled={disabledInputs || annulation}
                                    editTable
                                />
                            ) : item?.batch_number.value === NA ? (
                                <p className="px-2 text-gray">{NA}</p>
                            ) : (
                                <SelectInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `document-correction-${index}-batch`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.DRP,
                                    })}
                                    value={item.batch_number.value}
                                    isTable
                                    options={sortOptionBatch(buildOptionsBatches(item.test, item.warehouse_name.id))}
                                    optionSelected={(option): void => handleChangeBatchAndDate(option, item, false)}
                                    disabled={
                                        disabledInputs ||
                                        checkDisabled(item) ||
                                        !item.warehouse_name.value ||
                                        item?.batch_number?.value === NA
                                    }
                                    classesWrapper="w-full"
                                    selectIconType="arrowDownGreen"
                                />
                            )}
                        </td>
                        <td className={`field-body--editable ${classRequired(item, TableNameInputs.DATE_EXPIRATION)}`}>
                            {changesTypeInput(item.warehouse_name.value) ? (
                                <div className="flex flex-row items-center justify-center w-full h-full">
                                    <DatePickerBase
                                        dateFormat="dd/MM/yyyy"
                                        className="w-40 date-column without-padding-content"
                                        selected={item.text_fields.date_expiration}
                                        onChangeDate={(date): void => handleChange(date, item, TableNameInputs.DATE_EXPIRATION)}
                                        maxDate={dayjs().toDate()}
                                        disabled={disabledInputs}
                                    />
                                    <Icon name="calendarGray" alt="calendar" className="w-6" />
                                </div>
                            ) : item.date_expiration.value === NA ? (
                                <p className="px-2 text-gray">{NA}</p>
                            ) : (
                                <SelectInput
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `document-correction-${index}-batch-date`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.DRP,
                                    })}
                                    name="date"
                                    isTable
                                    classesInput="text-gray-dark text-sm"
                                    classesWrapperInput="border-none"
                                    optionSelected={(option): void => handleChangeBatchAndDate(option, item, true)}
                                    options={buildOptionsDate(item.test, item.batch_number.id)}
                                    value={item.date_expiration.value}
                                    selectIconType="calendarGreen"
                                    classesWrapper="without-padding-body justify-center"
                                    disabled={
                                        disabledInputs ||
                                        checkDisabled(item) ||
                                        !item.batch_number.value ||
                                        item.date_expiration.value === NA
                                    }
                                />
                            )}
                        </td>

                        <td className={`field-body--editable ${classRequired(item, 'quantity')}`}>
                            <NumberFormatInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `document-correction-${index}-quantity`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                value={item.quantity.value}
                                containerClass="correction-number-inputs"
                                withIcon={false}
                                disabled={disabledInputs || checkDisabled(item, true)}
                                onChange={(e): void => handleChange(e, item, 'quantity')}
                                isTable
                            />
                        </td>
                        <td className="py-1 field-body--editable padding-none">
                            <Text
                                className="text-left text-gray"
                                text={item.unit_measurement_name}
                                editTable={false}
                                type="text"
                                disabled
                            />
                        </td>
                        {isMandate && (
                            <td className="field-body--editable">
                                <SelectSearch
                                    id={generateId({
                                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                        submodule: `document-correction-${index}-suppliers`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.DRP,
                                    })}
                                    options={suppliers?.map(supplier => ({ name: supplier.name, value: supplier.id }))}
                                    onChange={(option): void => handleChangeSelectSupplier(option, item)}
                                    toggleSelectSearch={toggleSelectSearch}
                                    selectIconType="arrowDownGreen"
                                    showList={showSelectSearch}
                                    name={`mandate-${index}`}
                                    value={item.mandate.id}
                                    disabled={disabledInputs}
                                />
                            </td>
                        )}
                        <td className={`field-body--editable ${classRequired(item, 'unit_cost')}`}>
                            <NumberFormatInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `document-correction-${index}-unit-cost`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                disabled={disabledInputs || item.warehouse_name.value === NO_QUANTITIES_AVAILABLE || annulation}
                                onChange={(e): void => handleChange(e, item, 'unit_cost')}
                                containerClass="correction-number-inputs px-2"
                                value={item.unit_cost.value}
                                withIcon={false}
                                prefix={symbol}
                                isTable
                            />
                        </td>
                        <td className={`field-body--editable ${classRequired(item, 'percentage_discount')}`}>
                            <PercentageFormatInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `document-correction-${index}-percentage`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                value={item.percentage_discount.value}
                                onChange={(values: NumberFormatValues): void => handleChange(values, item, 'percentage_discount')}
                                onBlur={(e): void => {
                                    if (e.target.value) return;
                                    handleChange(
                                        defaultPercentageInput('percentage_discount', 0).values,
                                        item,
                                        'percentage_discount'
                                    );
                                }}
                                disabled={disabledInputs}
                            />
                        </td>
                        <td className="field-body--editable">
                            <NumberFormatInput
                                id={generateId({
                                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                                    submodule: `document-correction-${index}-discount`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                containerClass="correction-number-inputs--disabled"
                                value={item.discount.value}
                                inputClass="text-gray"
                                withIcon={false}
                                prefix={symbol}
                                disabled
                                isTable
                            />
                        </td>

                        <td className="cursor-default field-body--editable">
                            {item?.unique_product_taxes?.length ? (
                                item?.unique_product_taxes?.map((tax: ITaxesProductsStock, index: number) => (
                                    <p key={`tax-${index}`} className="px-2 text-sm xs:text-tiny text-gray">
                                        {tax.tax_name}: &nbsp; {symbol} &nbsp;
                                        {taxInformationForTables(tax, {
                                            quantity: Number(item?.quantity?.value || item?.quantity) || 0,
                                            sale_value: item?.total_buy || 0,
                                        })}
                                    </p>
                                ))
                            ) : (
                                <p className="text-sm text-left text-gray">N/A</p>
                            )}
                        </td>
                    </tr>
                ))}
            </Table>
            {data.length > ITEMS_PAGE && <Paginator {...paginator} />}
        </>
    );
};
