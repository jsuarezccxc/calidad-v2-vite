import React, { useEffect, useState } from 'react';
import { NumberFormatValues } from 'react-number-format';
import { IGenericRecord } from '@models/GenericRecord';
import usePaginator from '@hooks/usePaginator';
import { IBUA } from '@constants/BuildProduct';
import { ITEMS_PAGE } from '@constants/Paginator';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { Icon } from '@components/icon';
import { Table } from '@components/table';
import { Checkbox } from '@components/checkbox';
import { Paginator } from '@components/paginator';
import { TableError } from '@components/table-error';
import { SelectSearchInput } from '@components/input';
import { NotFindElements } from '@components/not-find-elements';
import { validateProduct } from '@components/electronic-invoice';
import { TooltipIcon } from '@components/electronic-invoice/components';
import { getBorder, MAX_LENGHT_PERCENTAGE } from '@components/support-document-and-buy';
import { NumberFormatInput, PercentageFormatInput, Text } from '@components/table-input';
import {
    countTableFooter,
    EDITABLE,
    FooterTotal,
    optionsTable,
    UNEDITABLE,
    validationTables,
} from '@components/support-document-and-buy/components';

const ServiceHeaderTable: React.FC = () => {
    const [tooltip, setTooltip] = useState<string>('');

    return (
        <tr>
            <th className="w-6" />
            <th className="h-6 field-header--uneditable header__w-35-1">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    Código del servicio
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-35-1">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    Servicio
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-28-8">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    *Costo unitario
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-26-4">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    Compras (cantidades)
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-36-6">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    Unidad de medida
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-28-8">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    Porcentaje de descuento
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-28-8">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    Descuento
                </span>
            </th>
            <th className="h-6 field-header--uneditable header__w-28-8">
                <span className="xs:min-h-7.5 text-sm leading-4 font-allerbold justify-center items-center m-auto text-center flex  xs:p-0 h-6 header__w-35-1 text-blue">
                    Valor compra
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

export const TableService: React.FC<IGenericRecord> = ({
    listOptionsTable,
    handleChangeSelectTable,
    onChangeProductTable,
    validateDiscount,
    listProducts,
    addProductTable,
    setSelectedCheckbox,
    setModalsErrors,
    onSubmitForm,
    adjustmentNote = false,
    disableAdd = false,
    onAddProductTable = (): void => {},
    fixOptionsTable = [],
    isAnnulation = false,
}) => {
    const idTable = 'tableServiceSupportDocument';
    const services: IGenericRecord[] = listProducts?.filter(
        (product: IGenericRecord) => product?.service || !product?.is_product
    );
    const { paginator, getLimits } = usePaginator(services);
    const [hoverTrash, setHoverTrash] = useState(false);
    const [disabledAddServices, setDisabledAddServices] = useState(false);

    useEffect(() => {
        getLimits();
        const emptyServices = services?.filter((service: IGenericRecord) => !service.sku_internal);
        setDisabledAddServices(lengthGreaterThanZero(emptyServices));
    }, [services]);

    return (
        <div className="w-max-table-service">
            <div className="flex items-end justify-end mt-2.5 -mb-2.5">
                <span onMouseEnter={(): void => setHoverTrash(true)} onMouseLeave={(): void => setHoverTrash(false)}>
                    <Icon
                        name={hoverTrash ? 'trashGreen' : 'trashBlue'}
                        alt="trash"
                        className="cursor-pointer"
                        onClick={(): void => {
                            lengthGreaterThanZero(services.filter((product: IGenericRecord) => product.check)) &&
                                setModalsErrors({
                                    delete: true,
                                    service: true,
                                    warehouse: false,
                                });
                        }}
                    />
                </span>
            </div>
            <Table
                idContentTable={idTable}
                data={services}
                isHeaderRowsCustom
                headerRowsCustom={<ServiceHeaderTable />}
                customTable
                wrapperClassName="xs:mt-5 xs:min-h-8.76"
                className="table-service-product"
                isFooterRowsCustom
                footerRowsCustom={
                    lengthEqualToZero(services) ? <></> : <FooterTotal colSpan={6} {...countTableFooter(services)} />
                }
            >
                {services?.slice(paginator?.limits.start, paginator?.limits.finish)?.map((product: IGenericRecord) => (
                    <tr key={'service-' + product?.unique_products_id}>
                        <td className="w-28">
                            <Checkbox
                                checked={product?.check}
                                onChange={(): void => setSelectedCheckbox(product)}
                                classContainer="w-28"
                                disabled={isAnnulation}
                            />
                        </td>
                        <td
                            className={`field-body--${isAnnulation ? UNEDITABLE : EDITABLE} body__h-auto header__w-35-1 ${
                                onSubmitForm ? getBorder(product?.sku_internal) : ''
                            }`}
                        >
                            <SelectSearchInput
                                idContentTable={idTable}
                                placeholder="Seleccionar"
                                classesWrapperInput="border-none xs-h-auto"
                                classesWrapper="select-table"
                                optionSelect={
                                    adjustmentNote
                                        ? fixOptionsTable(listOptionsTable?.sku, product, true)?.filter(
                                              (product: IGenericRecord) => !product?.isProduct
                                          )
                                        : optionsTable(
                                              listOptionsTable?.sku?.filter((product: IGenericRecord) => !product?.isProduct) ||
                                                  [],
                                              product,
                                              'sku_internal',
                                              'sku_internal'
                                          )
                                }
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
                            className={`field-body--${isAnnulation ? UNEDITABLE : EDITABLE} body__h-auto header__w-35-1 ${
                                onSubmitForm ? getBorder(product?.unique_product_name) : ''
                            }`}
                        >
                            <SelectSearchInput
                                idContentTable={idTable}
                                placeholder="Seleccionar"
                                classesWrapperInput="border-none xs-h-auto"
                                classesWrapper="select-table"
                                optionSelect={
                                    adjustmentNote
                                        ? fixOptionsTable(listOptionsTable?.products, product)?.filter(
                                              (product: IGenericRecord) => !product?.isProduct
                                          )
                                        : optionsTable(
                                              listOptionsTable?.products?.filter(
                                                  (product: IGenericRecord) => !product?.isProduct
                                              ) || [],
                                              {
                                                  ...product,
                                                  reference: product.unique_product_name,
                                              }
                                          )
                                }
                                valueSelect={product?.unique_product_name}
                                required={false}
                                onChangeSelect={(_, selectedOption): void => {
                                    handleChangeSelectTable(selectedOption, product, 'unique_product_name');
                                }}
                                isTableSearch
                                name="unique_product_name"
                                disabled={isAnnulation}
                            />
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
                        <td className="field-body--uneditable header__w-36-6">
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
                                handleChange={(e: React.ChangeEvent<HTMLInputElement>): void => onChangeProductTable(e, product)}
                                value={product.discount}
                                allowNegative={false}
                                name="discount"
                                disabled
                                isTable
                            />
                        </td>
                        <td className="field-body--uneditable header__w-28-8">
                            <NumberFormatInput
                                value={product.total_buy}
                                name="total_buy"
                                allowNegative={false}
                                isTable
                                disabled
                            />
                        </td>
                        <td className="field-body--uneditable header__w-28-8 without-padding-body">
                            {(product?.taxes_invoice?.length
                                ? product?.taxes_invoice
                                : product?.product_taxes?.length
                                ? product?.product_taxes
                                : []
                            ).map((tax: IGenericRecord, index: number) => (
                                <p key={index} className="text-sm text-gray-dark">
                                    {tax.tax_name}: $
                                    {Intl.NumberFormat('de-DE').format(
                                        tax.tax_name === IBUA
                                            ? Number(product.quantity) * tax.tax_value
                                            : (product.total_buy * tax.tax_rate) / 100
                                    )}
                                </p>
                            ))}
                        </td>
                    </tr>
                ))}
            </Table>
            {services.length > ITEMS_PAGE && <Paginator {...paginator} />}
            {onSubmitForm &&
                !lengthEqualToZero(services) &&
                validationTables(services).map((messages, index) => <TableError key={index} customText={messages} />)}
            {lengthEqualToZero(services) && (
                <NotFindElements
                    withoutData
                    classesWrapper="ml-4"
                    customText="Hasta el momento no ha agregado productos/servicios, haga click sobre la opción + Agregar compra servicio para agregar uno."
                />
            )}
            <button
                disabled={disabledAddServices || disableAdd}
                onClick={(): void => {
                    addProductTable(false);
                    onAddProductTable('');
                }}
                className={`text-base ${disableAdd ? 'text-gray' : 'text-green hover:text-purple'} underline ml-7 mt-2-1`}
            >
                + Agregar compra servicio{' '}
            </button>
        </div>
    );
};
