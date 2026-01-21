import React, { useMemo } from 'react';
import dayjs from '@utils/Dayjs';
import { NumberFormatValues } from 'react-number-format';
import { Icon } from '@components/icon';
import { Table } from '@components/table';
import { Checkbox } from '@components/checkbox';
import { COMMA } from '@components/electronic-invoice';
import { SelectSearch } from '@components/select-search';
import { DatePickerBase } from '@components/date-picker';
import { SelectInput, IOptionSelect } from '@components/input';
import { NumberFormatInput, PercentageFormatInput, Text } from '@components/table-input';
import { IGenericRecord } from '@models/GenericRecord';
import { ITaxesProductsStock } from '@models/Inventory';
import { lengthGreaterThanZero } from '@utils/Length';
import { getChecked, handleChecked } from '@utils/Checkboxs';
import { changesTypeInput, defaultPercentageInput, taxInformationForTables, columnClass } from '@utils/ElectronicInvoice';
import useSelectSearch from '@hooks/useSelectSearch';
import { PERCENTAGE } from '@constants/Tax';
import { HeaderTableInvoice, IPropsContentTableInvoice, UNEDITABLE } from '..';

export const TableInvoice: React.FC<IPropsContentTableInvoice> = ({
    data,
    fields,
    setSelected,
    selected = [],
    productOptions = [],
}) => {
    const onChangePercentage = fields.percentage_discount.onChange;

    const { showSelectSearch, toggleSelectSearch } = useSelectSearch();

    const isMandateDetails = useMemo(() => data.some(item => item.is_mandate), [data]);

    const validateItem = (index: string, fieldsWithError?: string[]): string =>
        lengthGreaterThanZero(fieldsWithError || []) && fieldsWithError?.includes(index) ? 'border-purple' : '';

    const valueCheck = (item: IGenericRecord): boolean =>
        item.check ? item.check : getChecked(String(item.id || item.unique_product_id), selected);

    const handleValidatePercentage = (e: React.KeyboardEvent<HTMLInputElement>): boolean =>
        e.code !== COMMA && e.currentTarget.value === PERCENTAGE.ZERO && !!onChangePercentage;

    const renderWarehouseName = (item: IGenericRecord, index: number): React.ReactElement =>
        changesTypeInput(item.warehouse_name) ? (
            <Text
                id={`dp-electronic-invoice-cesi-warehouse-${index}-text-box`}
                type="text"
                name={fields.warehouse_input.name}
                text={item.text_fields.warehouse}
                onChange={(e): void => fields.warehouse_input.onChangeInput?.(e, item, fields.warehouse_input.name)}
                disabled={fields.warehouse.disabled}
                editTable
            />
        ) : (
            <SelectInput
                id={`dp-electronic-invoice-cesi-warehouse-${index}-select`}
                classesWrapper="justify-center"
                classesInput="text-gray-dark text-sm"
                classesWrapperInput="border-none"
                disabled={columnClass(item.warehouse_name, fields.warehouse.disabled).includes(UNEDITABLE)}
                options={fields?.warehouse?.multiOptions?.[index]}
                name={fields.warehouse.name}
                value={item.warehouse_name}
                optionSelected={(option: IOptionSelect): void =>
                    fields.warehouse.onChangeSimple?.(option, item, fields.warehouse.name)
                }
                isTable
            />
        );

    const renderWarehouseBatch = (item: IGenericRecord, index: number): React.ReactElement =>
        changesTypeInput(item.warehouse_name) ? (
            <Text
                type="text"
                name={fields.batch_input.name}
                text={item.text_fields.batch}
                onChange={(e): void => fields.batch_input.onChangeInput?.(e, item, fields.batch_input.name)}
                disabled={fields.batch.disabled}
                editTable
            />
        ) : (
            <SelectInput
                id={`dp-electronic-invoice-cesi-lote-${index}-select`}
                classesWrapper="justify-center"
                classesInput="text-gray-dark text-sm"
                classesWrapperInput="border-none"
                disabled={columnClass(item.batch, fields.batch.disabled).includes(UNEDITABLE)}
                options={fields?.batch?.multiOptions?.[index]}
                name={fields.batch.name}
                value={item.batch}
                optionSelected={(option: IOptionSelect): void => fields.batch.onChangeSimple?.(option, item, fields.batch.name)}
                isTable
            />
        );

    const renderDateWarehouse = (item: IGenericRecord, index: number): React.ReactElement =>
        changesTypeInput(item.warehouse_name) ? (
            <div className="flex flex-row items-center justify-center w-full h-full">
                <DatePickerBase
                    id={`dp-electronic-invoice-cesi-exp-date-${index}-select`}
                    dateFormat="dd/MM/yyyy"
                    className="w-40 date-column without-padding-content"
                    selected={item.text_fields.date_expiration}
                    onChangeDate={(date): void => {
                        fields.date_input.onChangeInput?.(date, item, fields.date_input.name);
                    }}
                    maxDate={dayjs().toDate()}
                />
                <Icon name="calendarGray" alt="calendar" className="w-6" />
            </div>
        ) : (
            <SelectInput
                id={`dp-electronic-invoice-cesi-exp-date-${index}-select`}
                classesWrapper="justify-center"
                classesInput="text-gray-dark text-sm"
                classesWrapperInput="border-none"
                selectIconType="calendarGray"
                disabled={columnClass(item.input_date_expiration, fields.input_date_expiration.disabled).includes(UNEDITABLE)}
                options={fields?.input_date_expiration?.multiOptions?.[index]}
                name={fields.input_date_expiration.name}
                value={item.input_date_expiration}
                optionSelected={(option: IOptionSelect): void =>
                    fields.input_date_expiration.onChangeSimple?.(option, item, fields.input_date_expiration.name)
                }
                isTable
            />
        );

    return (
        <Table
            isHeaderRowsCustom
            headerRowsCustom={<HeaderTableInvoice isMandate={isMandateDetails} />}
            className="pr-1"
            customTable
            data={[]}
            onScroll={(): void => toggleSelectSearch(false)}
        >
            <>
                {data.map((item: IGenericRecord, index: number) => (
                    <tr key={Symbol(`invoice-${index}`).toString()}>
                        <td className="without-padding-body field-body--uneditable">
                            <Text
                                id={`dp-electronic-invoice-cesi-number-${index}-table-text`}
                                text={item.number}
                                editTable={false}
                                name="number"
                                type="text"
                                disabled
                            />
                        </td>
                        <td
                            className={`without-padding-body field-body--${columnClass(item.sku_internal, fields.sku.disabled)}
                            ${validateItem(fields.sku.name, item?.fieldsWithError)} w-32.7`}
                        >
                            <SelectSearch
                                id={`dp-electronic-invoice-cesi-sku-${index}-select-search-${item.sku_internal}`}
                                allOptions={[...fields.sku.options, { name: item.sku_internal, value: item.sku_internal }]}
                                options={fields.sku.options}
                                onChange={(option): void => fields.sku.onChange?.(option, item, fields.sku.name)}
                                value={item.sku_internal}
                                disabled={fields.sku.disabled}
                                showList={showSelectSearch}
                                toggleSelectSearch={toggleSelectSearch}
                                name={`sku${index}`}
                            />
                        </td>
                        <td
                            className={`relative without-padding-body field-body--${columnClass(
                                item.unique_product_name,
                                fields.products.disabled
                            )}
                            ${validateItem(fields.products.name, item?.fieldsWithError)} w-44`}
                        >
                            <SelectSearch
                                id={`dp-electronic-invoice-cesi-prod-serv-${index}-select-search`}
                                allOptions={productOptions}
                                options={fields.products.options}
                                onChange={(option): void => fields.products.onChange?.(option, item, fields.products.name)}
                                value={item.unique_products_id}
                                disabled={fields.products.disabled}
                                showList={showSelectSearch}
                                toggleSelectSearch={toggleSelectSearch}
                                name={`product/service${index}`}
                            />
                        </td>
                        <td
                            className={`without-padding-body field-body--${columnClass(
                                item.warehouse_name,
                                fields.warehouse.disabled
                            )}
                            ${(validateItem(fields.warehouse.name), item?.fieldsWithError)} w-34`}
                        >
                            {renderWarehouseName(item, index)}
                        </td>
                        <td
                            className={`without-padding-body field-body--${columnClass(item.batch, fields.batch.disabled)}
                            ${validateItem(fields.batch.name, item?.fieldsWithError)} w-34`}
                        >
                            {renderWarehouseBatch(item, index)}
                        </td>
                        <td
                            className={`without-padding-body field-body--${columnClass(
                                item.input_date_expiration,
                                fields.input_date_expiration.disabled
                            )}
                            ${validateItem(fields.input_date_expiration.name, item?.fieldsWithError)} w-34.5`}
                        >
                            {renderDateWarehouse(item, index)}
                        </td>
                        <td
                            className={`without-padding-body field-body--${columnClass(item.quantity, fields.quantity.disabled)}
                            ${validateItem(fields.quantity.name, item?.fieldsWithError)} w-34`}
                        >
                            <NumberFormatInput
                                id={`dp-electronic-invoice-cesi-quantity-${index}-text-box`}
                                inputClass="lg:h-auto"
                                disabled={fields.quantity.disabled}
                                name={fields.quantity.name}
                                value={item.quantity}
                                allowNegative={false}
                                withIcon={false}
                                handleChange={(e): void => fields.quantity.onChange?.(e, item, fields.quantity.name)}
                            />
                        </td>
                        <td className="without-padding-body field-body--uneditable w-34">
                            <Text
                                id={`dp-electronic-invoice-cesi-measurement-${index}-text-box`}
                                className="w-full height-auto body__margin-input"
                                disabled={fields.measurement.disabled}
                                text={item.measurement}
                                name={fields.measurement.name}
                                type="text"
                                editTable={false}
                                onChange={(e): void => fields.measurement.onChange?.(e, item, fields.measurement.name)}
                            />
                        </td>
                        {isMandateDetails && (
                            <>
                                <td className="field-body--uneditable without-padding-body">
                                    <Text
                                        id={`dp-electronic-invoice-cesi-mandate-document-number-${index}-text-box`}
                                        className="w-full height-auto body__margin-input"
                                        text={item?.mandate?.document_number || item?.mandate}
                                        editTable={false}
                                        type="text"
                                        disabled
                                    />
                                </td>
                                <td className="field-body--uneditable without-padding-body">
                                    <Text
                                        id={`dp-electronic-invoice-cesi-mandate-name-${index}-text-box`}
                                        className="w-full height-auto body__margin-input"
                                        text={item?.mandate?.name || item?.mandate}
                                        editTable={false}
                                        type="text"
                                        disabled
                                    />
                                </td>
                            </>
                        )}
                        <td
                            className={`without-padding-body field-body--uneditable
                            ${validateItem(fields.unit_cost.name, item?.fieldsWithError)} w-34`}
                        >
                            <NumberFormatInput
                                id={`dp-electronic-invoice-cesi-unit-cost-${index}-text-box`}
                                inputClass="lg:h-auto"
                                disabled
                                name={fields.unit_cost.name}
                                value={item.unit_cost}
                                allowNegative={false}
                                handleChange={(e): void => fields.unit_cost.onChange?.(e, item, fields.unit_cost.name)}
                                fixedDecimalScale
                            />
                        </td>
                        <td
                            className={`field-body--${columnClass(
                                item.percentage_discount,
                                fields.percentage_discount.disabled
                            )} ${validateItem(fields.percentage_discount.name, item?.fieldsWithError)} without-padding-body`}
                        >
                            <PercentageFormatInput
                                value={item.percentage_discount}
                                name={fields.percentage_discount.name}
                                onChange={(values: NumberFormatValues): void => {
                                    onChangePercentage?.(
                                        {
                                            name: fields.percentage_discount.name,
                                            values,
                                        },
                                        item
                                    );
                                }}
                                onKeyPress={(e): void => {
                                    if (handleValidatePercentage(e)) {
                                        onChangePercentage?.(
                                            defaultPercentageInput(fields.percentage_discount.name, undefined),
                                            item
                                        );
                                    }
                                }}
                                onBlur={(e): void => {
                                    if (e.target.value) return;
                                    onChangePercentage?.(defaultPercentageInput(fields.percentage_discount.name, 0), item);
                                }}
                            />
                        </td>
                        <td className="without-padding-body field-body--uneditable w-34">
                            <NumberFormatInput
                                id={`dp-electronic-invoice-cesi-discount-${index}-text-box`}
                                inputClass="lg:h-auto"
                                allowNegative={false}
                                value={item.discount}
                                name={fields.discount.name}
                                disabled
                                handleChange={(e): void => {
                                    fields.discount.onChange?.(e, item);
                                }}
                                fixedDecimalScale
                            />
                        </td>
                        <td className="without-padding-body field-body--uneditable">
                            <NumberFormatInput
                                id={`dp-electronic-invoice-cesi-sales-value-${index}-text-box`}
                                disabled
                                inputClass="lg:h-auto"
                                value={item.total_buy}
                                name={fields.total_buy.name}
                                fixedDecimalScale
                            />
                        </td>
                        <td className="without-padding-body field-body--uneditable">
                            {lengthGreaterThanZero(item.taxes_invoice) &&
                                item.taxes_invoice.map((tax: ITaxesProductsStock) => {
                                    return (
                                        <p key={tax.id} className="text-sm xs:text-tiny text-gray-dark">
                                            {tax.tax_name}: &nbsp;
                                            {taxInformationForTables(tax, {
                                                quantity: Number(item.quantity),
                                                sale_value: item.total_buy,
                                            })}
                                        </p>
                                    );
                                })}
                        </td>
                        <td>
                            <Checkbox
                                id={`dp-electronic-invoice-cesi-${index}-check-box`}
                                checked={valueCheck(item)}
                                name="check"
                                onChange={(): void => handleChecked(item, selected, setSelected)}
                                classContainer="w-max p-0 ml-3"
                                disabled={fields.check.disabled}
                            />
                        </td>
                    </tr>
                ))}
            </>
        </Table>
    );
};
