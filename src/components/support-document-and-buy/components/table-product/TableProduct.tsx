import React, { useEffect, useState } from 'react';
import { NumberFormatValues } from 'react-number-format';
import usePaginator from '@hooks/usePaginator';
import { ITEMS_PAGE } from '@constants/Paginator';
import { IGenericRecord } from '@models/GenericRecord';
import { ITaxesProductsStock } from '@models/Inventory';
import { getUnixFromDate } from '@utils/Date';
import { setZeroValueInInputNumber } from '@utils/Input';
import { taxInformationForTables } from '@utils/ElectronicInvoice';
import { lengthEqualToZero, lengthGreaterThanZero, lengthLastItem } from '@utils/Length';
import { Table } from '@components/table';
import { Icon } from '@components/icon';
import { Link } from '@components/button';
import { Checkbox } from '@components/checkbox';
import { Paginator } from '@components/paginator';
import { TableError } from '@components/table-error';
import { SelectSearchInput } from '@components/input';
import { DatePickerBase } from '@components/date-picker';
import {
    EDITABLE,
    UNEDITABLE,
    classFields,
    optionsTable,
    typeDeleteItemTable,
    validationTables,
} from '@components/support-document-and-buy/components';
import { NotFindElements } from '@components/not-find-elements';
import { validateProduct } from '@components/electronic-invoice';
import { TooltipIcon } from '@components/electronic-invoice/components';
import { getBorder, MAX_LENGHT_PERCENTAGE } from '@components/support-document-and-buy';
import { NumberFormatInput, PercentageFormatInput, Text } from '@components/table-input';
import { PRODUCTS } from '.';

const ProductHeaderTable: React.FC = () => {
    const [tooltip, setTooltip] = useState<string>('');

    return (
        <tr>
            <th className="w-6" />
            <th className="h-6 field-header--uneditable header__w-35-1">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    No.
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-35-1">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    SKU/Código - Producto/Servicio
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-35-1">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    Descripción
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-28-8">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    Bodega
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-26-4">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    Lote
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-26-4">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    Fecha de vencimiento
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-26-4">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    Cantidad
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-28-8">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    Unidad de medida
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-36-6">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    Costo unitario
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-28-8">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    % de descuento
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-28-8">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    Descuento
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-28-8">
                <div className="flex header-table-buy header-table-buy__w-taxes__content-text-icon">
                    <span className="gap-1 xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                        Impuestos
                        <TooltipIcon setTooltip={(): void => setTooltip('taxes')} tooltip={tooltip} invest />
                    </span>
                </div>
            </th>
        </tr>
    );
};

export const TableProduct: React.FC<IGenericRecord> = ({
    listOptionsTable,
    handleChangeSelectTable,
    onChangeProductTable,
    validateDiscount,
    setSelectedCheckbox,
    listProducts,
    addProductTable,
    setModalsErrors,
    addBatchProduct,
    onSubmitForm,
    disableAdd = false,
    onAddProductTable = (): void => {},
    batchDisabled = false,
    isAnnulation = false,
}) => {
    const idTable = 'tableProductSupportDocument';
    const products: IGenericRecord[] = listProducts;
    const { paginator, getLimits } = usePaginator(products);
    const [hoverTrash, setHoverTrash] = useState(false);
    const [disabledAddProducts, setDisabledAddProducts] = useState(false);

    useEffect(() => {
        getLimits();
        const emptyProducts = products?.filter((product: IGenericRecord) => !product.sku_internal);
        setDisabledAddProducts(lengthGreaterThanZero(emptyProducts));
    }, [products]);

    return (
        <div className="w-max-table-product">
            <div className="flex items-end justify-end mt-2.5 -mb-2.5">
                <span onMouseEnter={(): void => setHoverTrash(true)} onMouseLeave={(): void => setHoverTrash(false)}>
                    <Icon
                        name={hoverTrash ? 'trashGreen' : 'trashBlue'}
                        alt="trash"
                        className="cursor-pointer"
                        onClick={(): void => {
                            lengthGreaterThanZero(
                                products.filter((product: IGenericRecord) => product.check || product.checkBatch)
                            ) &&
                                setModalsErrors({
                                    delete: true,
                                    service: false,
                                    warehouse: false,
                                });
                        }}
                    />
                </span>
            </div>
            <Table
                className="table-service-product xs:text-sm"
                wrapperClassName="xs:mt-5 xs:min-h-8.76"
                idContentTable={idTable}
                data={products}
                isHeaderRowsCustom
                headerRowsCustom={<ProductHeaderTable />}
                customTable
                isNew
            >
                {products?.slice(paginator?.limits.start, paginator?.limits.finish)?.map((product: IGenericRecord) => {
                    const listUniqueProducts = products?.filter(
                        (row: IGenericRecord) => row.unique_products_id && row.unique_products_id === product?.unique_products_id
                    );
                    const ultimatePosition = lengthLastItem(listUniqueProducts);
                    const firsPositionUniqueProducts = listUniqueProducts[0];
                    const initialTable = (length: number): IGenericRecord => (
                        <>
                            <td className="w-28" rowSpan={length}>
                                <Checkbox
                                    checked={product?.check}
                                    onChange={(): void => setSelectedCheckbox(product)}
                                    classContainer="w-28"
                                    disabled={isAnnulation}
                                />
                            </td>
                            <td
                                className={`field-body--${isAnnulation ? UNEDITABLE : EDITABLE} header__w-35-1 ${
                                    onSubmitForm ? getBorder(product?.sku_internal) : ''
                                }`}
                                rowSpan={length}
                            >
                                <SelectSearchInput
                                    idContentTable={idTable}
                                    placeholder="Seleccionar"
                                    classesWrapperInput="border-none xs-h-auto"
                                    classesWrapper="select-table"
                                    optionSelect={optionsTable(
                                        listOptionsTable?.sku?.filter((product: IGenericRecord) => product?.isProduct),
                                        product,
                                        'sku_internal',
                                        'sku_internal'
                                    )}
                                    valueSelect={product?.sku_internal}
                                    onChangeSelect={(_, selectedOption): void => {
                                        handleChangeSelectTable(selectedOption, product, 'sku_internal');
                                    }}
                                    isTableSearch
                                    name="sku_internal"
                                    disabled={isAnnulation}
                                />
                            </td>
                            <td
                                className={`field-body--${isAnnulation ? UNEDITABLE : EDITABLE} header__w-35-1 ${
                                    onSubmitForm ? getBorder(product?.unique_product_name) : ''
                                }`}
                                rowSpan={length}
                            >
                                <SelectSearchInput
                                    idContentTable={idTable}
                                    placeholder="Seleccionar"
                                    classesWrapperInput="border-none xs-h-auto"
                                    classesWrapper="select-table"
                                    optionSelect={optionsTable(
                                        listOptionsTable?.products?.filter((product: IGenericRecord) => product?.isProduct) || [],
                                        {
                                            ...product,
                                            reference: product.unique_product_name,
                                        }
                                    )}
                                    valueSelect={product.unique_product_name}
                                    onChangeSelect={(_, selectedOption): void => {
                                        handleChangeSelectTable(selectedOption, product, 'unique_product_name');
                                    }}
                                    isTableSearch
                                    name="unique_product_name"
                                    disabled={isAnnulation}
                                />
                            </td>
                        </>
                    );
                    return (
                        <React.Fragment key={'product-' + product?.unique_products_id}>
                            <tr className="body">
                                {firsPositionUniqueProducts?.number === product?.number && product?.is_inventoriable
                                    ? initialTable(listUniqueProducts?.length + 1)
                                    : !product?.unique_products_id || !product?.is_inventoriable
                                    ? initialTable(1)
                                    : null}
                                <td
                                    className={`header__w-36-6 body__h-auto field-body--${classFields(
                                        product?.is_inventoriable,
                                        isAnnulation
                                    )}
                                        ${
                                            onSubmitForm && product?.is_inventoriable
                                                ? getBorder(product?.batch || product.batch_number)
                                                : ''
                                        }`}
                                >
                                    <div className="body__input-lot">
                                        {product?.is_inventoriable && (
                                            <Checkbox
                                                checked={product?.checkBatch}
                                                onChange={(): void => setSelectedCheckbox(product, typeDeleteItemTable.BATCH)}
                                                classContainer="w-28"
                                            />
                                        )}
                                        <Text
                                            type="text"
                                            name="batch"
                                            disabled={!product?.is_inventoriable || isAnnulation}
                                            onChange={(e): void => onChangeProductTable(e, product)}
                                            editTable
                                            className="w-full"
                                            text={product?.batch || product.batch_number || ''}
                                        />
                                    </div>
                                </td>
                                <td
                                    className={`header__w-36-6 body__h-auto field-body--${classFields(
                                        product?.is_inventoriable,
                                        isAnnulation
                                    )}
                                        } ${
                                            onSubmitForm && product?.is_inventoriable
                                                ? getBorder(product?.input_date_expiration || product?.date_expiration)
                                                : ''
                                        }`}
                                >
                                    <div className="body__input-date">
                                        {product?.is_inventoriable ? (
                                            <DatePickerBase
                                                name="input_date_expiration"
                                                dateFormat="dd/MM/yyyy"
                                                className="w-40 without-padding-date"
                                                maxDate={new Date()}
                                                onChangeDate={(e): void => onChangeProductTable(e, product)}
                                                selected={getUnixFromDate(product?.input_date_expiration)}
                                                disabled={isAnnulation}
                                            />
                                        ) : (
                                            <Text
                                                type="text"
                                                name="input_date_expiration"
                                                disabled
                                                editTable={false}
                                                className="w-full"
                                                text={product?.input_date_expiration}
                                            />
                                        )}
                                        <Icon name="calendarGray" alt="calendar" className="w-6" />
                                    </div>
                                </td>
                                <td
                                    className={`field-body--${isAnnulation ? UNEDITABLE : EDITABLE} body__h-auto header__w-28-8 ${
                                        onSubmitForm ? getBorder(product?.unit_cost) : ''
                                    }`}
                                >
                                    <NumberFormatInput
                                        value={product.unit_cost}
                                        handleChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                                            onChangeProductTable(e, product, true)
                                        }
                                        name="unit_cost"
                                        inputClass="lg:h-auto"
                                        disabled={isAnnulation}
                                    />
                                </td>
                                <td
                                    className={`field-body--${isAnnulation ? UNEDITABLE : EDITABLE} body__h-auto header__w-26-4 ${
                                        onSubmitForm ? getBorder(product?.quantity) : ''
                                    }`}
                                >
                                    <NumberFormatInput
                                        value={product.quantity}
                                        handleChange={(e): void => onChangeProductTable(e, product, true)}
                                        name="quantity"
                                        withIcon={false}
                                        allowNegative={false}
                                        disabled={isAnnulation}
                                    />
                                </td>
                                <td className="header__w-48-1 field-body--uneditable body__h-auto">
                                    <Text
                                        text={product?.measurement || product?.unit_measurement_name}
                                        type="text"
                                        disabled
                                        editTable={false}
                                    />
                                </td>
                                <td
                                    className={`field-body--${isAnnulation ? UNEDITABLE : EDITABLE} ${
                                        onSubmitForm ? getBorder(!validateProduct(product).includes('percentage_discount')) : ''
                                    } body__h-auto header__w-28-8`}
                                >
                                    <PercentageFormatInput
                                        onChange={(values: NumberFormatValues): void => {
                                            onChangeProductTable({ name: 'percentage_discount', values }, product, true);
                                        }}
                                        inputClass="w-full h-auto lg:h-auto p-0"
                                        containerClass="w-30.7 h-auto m-auto"
                                        value={product.percentage_discount}
                                        name="percentage_discount"
                                        disabled={isAnnulation}
                                        withIcon={false}
                                        onBlur={(e): void => {
                                            validateDiscount(product, e);
                                        }}
                                        maxLength={MAX_LENGHT_PERCENTAGE}
                                    />
                                </td>
                                <td className="field-body--uneditable body__h-auto header__w-28-8">
                                    <NumberFormatInput
                                        value={product.discount}
                                        name="discount"
                                        handleChange={(e): void => onChangeProductTable(e, product)}
                                        onBlur={(e): void =>
                                            onChangeProductTable(setZeroValueInInputNumber(e, 'discount'), product)
                                        }
                                        allowNegative={false}
                                        disabled
                                        isTable
                                    />
                                </td>
                                <td className="field-body--uneditable header__w-28-8">
                                    <NumberFormatInput
                                        value={product.total_buy}
                                        name="total_buy"
                                        allowNegative={false}
                                        disabled
                                        isTable
                                    />
                                </td>
                                <td className="field-body--uneditable header__w-28-8">
                                    {(product?.taxes_invoice?.length
                                        ? product?.taxes_invoice
                                        : product?.product_taxes?.length
                                        ? product?.product_taxes
                                        : []
                                    ).map((tax: ITaxesProductsStock, index: number) => (
                                        <p key={index} className="text-sm text-gray-dark">
                                            {tax.tax_name}:
                                            {taxInformationForTables(tax, {
                                                quantity: product.quantity,
                                                sale_value: product.total_buy,
                                            })}
                                        </p>
                                    ))}
                                </td>
                            </tr>
                            {product?.is_inventoriable && listUniqueProducts[ultimatePosition]?.number === product?.number && (
                                <tr key={'product-link-' + product?.unique_products_id}>
                                    <td className="field-body--editable h-10 xs:h-8.2 text-left-link" colSpan={10}>
                                        <Link
                                            disabled={batchDisabled}
                                            onClick={(): void => addBatchProduct(product)}
                                            href="#"
                                            text="+ Agregar lote"
                                            classes="text-sm ml-5"
                                        />
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    );
                })}
            </Table>
            {products?.length > ITEMS_PAGE && <Paginator {...paginator} />}
            {onSubmitForm &&
                !lengthEqualToZero(products) &&
                validationTables(products).map((messages, index) => <TableError key={index} customText={messages} />)}
            {lengthEqualToZero(products) && (
                <NotFindElements
                    withoutData
                    classesWrapper="ml-4"
                    customText="Hasta el momento no ha agregado productos/servicios, haga click sobre la opción + Agregar compra producto para agregar uno."
                />
            )}
            <button
                disabled={disabledAddProducts || disableAdd}
                onClick={(): void => {
                    onAddProductTable(PRODUCTS);
                    addProductTable(true);
                }}
                className={`text-base ${disableAdd ? 'text-gray' : 'text-green hover:text-purple'} underline ml-7 mt-2-1`}
            >
                + Agregar compra producto{' '}
            </button>
        </div>
    );
};
