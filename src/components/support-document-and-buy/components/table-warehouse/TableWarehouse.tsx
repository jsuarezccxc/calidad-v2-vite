import React, { useEffect } from 'react';
import { SelectSearchOption } from 'react-select-search';
import { Table } from '@components/table';
import { headersTableWarehouse, optionsTable, typeDeleteItemTable } from '..';
import { Checkbox } from '@components/checkbox';
import { Icon } from '@components/icon';
import { DatePickerBase } from '@components/date-picker';
import { NumberFormatInput, Text } from '@components/table-input';
import { SelectSearchInput } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { getUnixFromDate } from '@utils/Date';
import { Link } from '@components/button';
import { validateDistributionWarehouse } from '@components/support-document-and-buy';
import { TableError } from '@components/table-error';
import { lengthGreaterThanZero } from '@utils/Length';
import usePaginator from '@hooks/usePaginator';
import { ITEMS_PAGE } from '@constants/Paginator';
import { Paginator } from '@components/paginator';

export const TableWarehouse: React.FC<IGenericRecord> = ({
    listOptionsTable,
    listProducts,
    addWarehouseProduct,
    handleChangeSelectTable,
    handleChangeQuantityWarehouse,
    onSubmitForm,
    variousWarehouse,
    setSelectedCheckbox,
    setModalsErrors,
}) => {
    const getBorder = (show: boolean): string => (!show ? '' : 'border-purple');
    const products: IGenericRecord[] = listProducts?.filter(
        (product: IGenericRecord) => product?.is_product && product?.is_inventoriable
    );
    const { errors } = validateDistributionWarehouse(products);
    const validateWarehouse = (batch_id_temp: string): string => {
        if (errors.some((item: IGenericRecord) => item.batchId === batch_id_temp)) return 'border-purple';
        return '';
    };

    const { paginator, getLimits } = usePaginator(products);

    const optionsWarehouse = (options: SelectSearchOption[], batchId: string): SelectSearchOption[] => {
        const productsBatch = products.filter(product => product.batch_id_temp === batchId);
        return options.filter(option => {
            if (productsBatch.some(product => product.warehouse_id === option.value)) return;
            return option;
        });
    };

    useEffect(() => {
        getLimits();
    }, [products]);

    return (
        <div className="w-max-table-warehouse">
            <div className="flex items-end justify-end -my-2.5 mr-10-trash">
                <Icon
                    name="trashBlue"
                    alt="trash"
                    className="cursor-pointer"
                    onClick={(): void => {
                        lengthGreaterThanZero(products.filter((product: IGenericRecord) => product.checkWarehouse)) &&
                            setModalsErrors({
                                delete: true,
                                service: false,
                                warehouse: true,
                            });
                    }}
                />
            </div>
            <Table
                data={[]}
                headersTable={headersTableWarehouse}
                className="table-service-product"
                wrapperClassName="mb-29"
                customTable
            >
                {products
                    ?.slice(paginator?.limits.start, paginator?.limits.finish)
                    ?.map((product: IGenericRecord, index: number) => {
                        const listUniqueProducts = products?.filter(
                            (row: IGenericRecord) => row.number && product?.number === row.number
                        );
                        const initialTable = (length: number): IGenericRecord => (
                            <>
                                <td className="field-body--uneditable xs:h-8.75 h-10" rowSpan={length}>
                                    <Text
                                        text={product?.unique_product_name}
                                        type="text"
                                        disabled
                                        onChange={(): void => {}}
                                        editTable={false}
                                    />
                                </td>
                                <td className="field-body--uneditable" rowSpan={length}>
                                    <Text
                                        text={product?.measurement}
                                        type="text"
                                        disabled
                                        onChange={(): void => {}}
                                        editTable={false}
                                    />
                                </td>
                                <td className="field-body--uneditable" rowSpan={length}>
                                    <Text
                                        text={product?.batch}
                                        type="text"
                                        disabled
                                        onChange={(): void => {}}
                                        editTable={false}
                                    />
                                </td>
                                <td className="field-body--uneditable" rowSpan={length}>
                                    <div className="body__input-date">
                                        <DatePickerBase
                                            dateFormat="dd/MM/yyyy"
                                            className="w-40 without-padding-date"
                                            selected={getUnixFromDate(product?.input_date_expiration)}
                                            disabled
                                        />
                                        <Icon name="calendarGray" alt="calendar" className="w-6" />
                                    </div>
                                </td>
                            </>
                        );
                        return (
                            <React.Fragment key={index}>
                                <tr>
                                    {listUniqueProducts[0]?.id === product?.id
                                        ? initialTable(variousWarehouse ? listUniqueProducts?.length + 1 : 1)
                                        : null}
                                    <td
                                        className={`field-body--editable h-10 xs:h-8.2 ${
                                            onSubmitForm ? getBorder(!product?.warehouse_name) : ''
                                        }`}
                                    >
                                        <SelectSearchInput
                                            placeholder="Seleccionar"
                                            isTableSearch
                                            classesWrapperInput="border-none"
                                            classesWrapper="select-table"
                                            optionSelect={
                                                optionsTable(
                                                    optionsWarehouse(listOptionsTable?.warehouses, product.batch_id_temp),
                                                    product,
                                                    'warehouse_name',
                                                    'warehouse_id'
                                                ) || []
                                            }
                                            valueSelect={product.warehouse_id}
                                            onChangeSelect={(selectedValue, selectedOption): void => {
                                                handleChangeSelectTable(selectedOption, product, 'warehouse_name', product?.id);
                                            }}
                                        />
                                    </td>
                                    <td className="field-body--uneditable">
                                        <NumberFormatInput
                                            value={product?.total_stock}
                                            withIcon={false}
                                            containerClass="items-center justify-center"
                                            disabled
                                        />
                                    </td>
                                    <td className="field-body--uneditable">
                                        {product?.maxQuantityWarehouse === 'N/A' ? (
                                            <Text
                                                type="text"
                                                name="input_date_expiration"
                                                disabled
                                                onChange={(): void => {}}
                                                editTable
                                                className="w-full"
                                                text={product?.maxQuantityWarehouse}
                                            />
                                        ) : (
                                            <NumberFormatInput
                                                value={product?.maxQuantityWarehouse}
                                                withIcon={false}
                                                containerClass="items-center justify-center"
                                                disabled
                                            />
                                        )}
                                    </td>
                                    <td
                                        className={`field-body--editable ${
                                            onSubmitForm ? getBorder(!product?.quantityWarehouse) : ''
                                        } ${onSubmitForm ? validateWarehouse(product.batch_id_temp) : ''}`}
                                    >
                                        <NumberFormatInput
                                            value={product?.quantityWarehouse}
                                            withIcon={false}
                                            containerClass="items-center justify-center"
                                            handleChange={(e): void => handleChangeQuantityWarehouse(e, product, product?.id)}
                                        />
                                    </td>
                                    <td className="w-4.5">
                                        <Checkbox
                                            checked={product?.checkWarehouse}
                                            onChange={(): void => setSelectedCheckbox(product, typeDeleteItemTable.WAREHOUSE)}
                                            classContainer="check-input"
                                        />
                                    </td>
                                </tr>
                                {listUniqueProducts[listUniqueProducts.length - 1]?.id === product?.id && variousWarehouse && (
                                    <tr key={'warehouse-link-' + index}>
                                        <td className="field-body--editable h-10 xs:h-8.2 text-left-link" colSpan={4}>
                                            <Link
                                                onClick={(): void => addWarehouseProduct(product)}
                                                href="#"
                                                text="+Seleccionar bodega"
                                                classes="text-sm ml-5"
                                            />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
            </Table>
            {products.length > ITEMS_PAGE && <Paginator {...paginator} />}
            <div className="-mt-4">
                {onSubmitForm &&
                    errors.map((item: IGenericRecord, index: number) => (
                        <TableError key={'error-' + index} customText={item.message} />
                    ))}
            </div>
        </div>
    );
};
