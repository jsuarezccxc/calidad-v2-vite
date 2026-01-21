import React from 'react';
import { cloneDeep } from 'lodash';
import { v4 as uuid } from 'uuid';
import { ITableNotePurchaseProps, headersTable, nameInputsTable, newEmpty } from '../..';
import { Table } from '@components/table';
import { IGenericRecord } from '@models/GenericRecord';
import { Link } from '@components/button';
import { Icon } from '@components/icon';
import { NumberFormatInput, PercentageFormatInput } from '@components/table-input';
import './TableNoteSupplier.scss';
import { ChangeEvent, SelectInput, TextInput } from '@components/input';
import { Checkbox } from '@components/checkbox';
import { TableNameInputs } from '@constants/CancellationElectronic';
import usePermissions from '@hooks/usePermissions';

export const TableNoteSupplier: React.FC<ITableNotePurchaseProps> = ({
    is_annulled,
    productsInvoice,
    productsNote,
    setProductsNote,
    totals,
    showTrashModal,
    setShowTrashModal,
    emptyFieldsError,
    discountError,
    quantityError,
    isCredit,
}) => {
    const { disabledInputs } = usePermissions();

    const setProductData = (optionSelected: IGenericRecord, rowData: IGenericRecord): void => {
        setProductsNote(
            productsNote.map((row: IGenericRecord) => ({
                ...row,
                ...(row.key === rowData.key && {
                    id: optionSelected.id,
                    ...optionSelected,
                    discount: optionSelected.discount || '0',
                    iva: optionSelected.iva || '0%',
                }),
            }))
        );
    };

    const setValuesInputs = (element: ChangeEvent, rowData: IGenericRecord, name: string): void => {
        setProductsNote(
            productsNote.map((row: IGenericRecord) => {
                const isThisItem = row.key === rowData.key;
                return {
                    ...row,
                    ...(isThisItem && { [name]: element?.target?.value }),
                    ...(isThisItem && name === TableNameInputs.DISCOUNT && !element?.target?.value && { discount: '0' }),
                };
            })
        );
    };
    const setValuesInputsNumber = (element: IGenericRecord, rowData: IGenericRecord, name: string): void => {
        const { floatValue } = element;

        setProductsNote(
            productsNote.map((row: IGenericRecord) => {
                const isThisItem = row.key === rowData.key;
                return {
                    ...row,
                    ...(isThisItem && { [name]: floatValue }),
                };
            })
        );
    };

    const addNewProduct = (): void => {
        const data = cloneDeep(productsNote);
        data.push(newEmpty(formatNo(data.length + 1)));
        setProductsNote(data);
    };

    const formatNo = (No: number): string => {
        if (No > 99) return No.toString();
        return No.toString().padStart(3, '0');
    };

    const setNewProduct = (id: string): void => {
        setProductsNote(
            productsNote.map((row: IGenericRecord) => ({
                ...row,
                ...(row.id === id && { isNewProduct: !row.isNewProduct ?? false }),
            }))
        );
    };

    const setChecked = (rowData: IGenericRecord): void => {
        setProductsNote(
            productsNote.map((row: IGenericRecord) => ({
                ...row,
                ...(row.id === rowData.id && { isChecked: !row.isChecked }),
            }))
        );
    };
    const includeError = (product: IGenericRecord, inputName: string): string => {
        return product?.fieldsWithError?.includes(inputName) ? 'border-purple' : '';
    };

    return (
        <div className="w-full">
            {!is_annulled && (
                <div className="flex justify-end my-3 trash-container">
                    <Icon
                        name="trashBlue"
                        hoverIcon="trashGreen"
                        {...(!disabledInputs && {
                            onClick: (): void => {
                                productsNote.some((item: IGenericRecord) => item.isChecked) && setShowTrashModal(!showTrashModal);
                            },
                        })}
                    />
                </div>
            )}
            <Table className="mt-1 table-note" headersTable={headersTable} data={[]} customTable>
                {productsNote.map((product: IGenericRecord, index: number) => (
                    <tr key={`row-product-${index}`}>
                        <td className="field-body--uneditable ">
                            <TextInput
                                classesWrapper="field-number"
                                classesWrapperInput="border-none field-number"
                                classesInput="field-number"
                                name="No"
                                value={product.No}
                                disabled
                            />
                        </td>
                        <td
                            className={`${disabledInputs ? 'field-body--uneditable' : 'field-body--editable'} ${includeError(
                                product,
                                'product_sku'
                            )} `}
                        >
                            {product.isNewProduct ? (
                                <TextInput
                                    classesWrapper="field-header-note"
                                    classesWrapperInput="border-none field-sku"
                                    classesInput="text-center  field-sku"
                                    value={product.product_sku}
                                    name={nameInputsTable.sku}
                                    placeholder="Nuevo SKU"
                                    onChange={(e): void => {
                                        setValuesInputs(e, product, nameInputsTable.sku);
                                    }}
                                    disabled={disabledInputs}
                                />
                            ) : (
                                <SelectInput
                                    value={product.product_sku || ''}
                                    newSelectFields={{
                                        trashClick: (): void => {},
                                        editClick: (): void => {},
                                        footerClick: (): void => setNewProduct(product.id),
                                        nameFooter: '+ Agregar SKU',
                                        isEdit: false,
                                    }}
                                    options={productsInvoice?.map((product, index) => ({
                                        value: product.sku_internal,
                                        unique_product_name: product.unique_product_name,
                                        product_sku: product.sku_internal,
                                        product_id: product.id,
                                        id: uuid(),
                                        index,
                                        key: uuid(),
                                        unit_cost: product.unit_cost,
                                        discount: product.discount,
                                        quantity: product.quantity,
                                        iva: product.iva,
                                        is_product: product.is_product,
                                        unit_measurements_id: product.unit_measurements_id,
                                    }))}
                                    classesWrapper="field-header-note"
                                    classesWrapperInput="field-sku border-none items-center flex"
                                    optionSelected={(option): void => {
                                        setProductData(option, product);
                                    }}
                                    isNewSelect={!isCredit}
                                    isTable
                                    disabled={disabledInputs}
                                />
                            )}
                        </td>
                        <td
                            className={`${disabledInputs ? 'field-body--uneditable' : 'field-body--editable'} ${includeError(
                                product,
                                'unique_product_name'
                            )}`}
                        >
                            {product.isNewProduct ? (
                                <TextInput
                                    classesWrapper="field-header-note"
                                    classesWrapperInput="border-none field-product"
                                    classesInput="text-center field-product"
                                    value={product.unique_product_name}
                                    name={nameInputsTable.productName}
                                    placeholder="Producto / servicio"
                                    onChange={(e): void => {
                                        setValuesInputs(e, product, nameInputsTable.productName);
                                    }}
                                    disabled={disabledInputs}
                                />
                            ) : (
                                <SelectInput
                                    value={product.unique_product_name || ''}
                                    newSelectFields={{
                                        trashClick: (): void => {},
                                        editClick: (): void => {},
                                        footerClick: (): void => setNewProduct(product.id),
                                        nameFooter: '+ Agregar Producto / servicio',
                                        isEdit: false,
                                    }}
                                    options={productsInvoice?.map((product, index) => ({
                                        value: product.unique_product_name,
                                        unique_product_name: product.unique_product_name,
                                        product_sku: product.sku_internal,
                                        product_id: product.id,
                                        id: uuid(),
                                        index,
                                        key: uuid(),
                                        unit_cost: product.unit_cost,
                                        discount: product.discount,
                                        quantity: product.quantity,
                                        iva: product.iva,
                                        is_product: product.is_product,
                                        unit_measurements_id: product.unit_measurements_id,
                                    }))}
                                    classesWrapper="field-header-note"
                                    classesWrapperInput="field-product border-none items-center flex"
                                    optionSelected={(option): void => {
                                        setProductData(option, product);
                                    }}
                                    isNewSelect={!isCredit}
                                    isTable
                                    disabled={disabledInputs}
                                />
                            )}
                        </td>
                        <td
                            className={`${disabledInputs ? 'field-body--uneditable' : 'field-body--editable'} ${includeError(
                                product,
                                'quantity'
                            )} `}
                        >
                            <TextInput
                                classesWrapper="field-header-note"
                                classesWrapperInput="border-none field-quantity"
                                classesInput="text-center field-quantity"
                                onlyNumbers
                                value={product.quantity}
                                name={nameInputsTable.quantity}
                                placeholder="000.000"
                                onChange={(e): void => {
                                    setValuesInputs(e, product, nameInputsTable.quantity);
                                }}
                                disabled={disabledInputs}
                            />
                        </td>
                        <td
                            className={`${disabledInputs ? 'field-body--uneditable' : 'field-body--editable'} ${includeError(
                                product,
                                'unit_cost'
                            )} `}
                        >
                            <NumberFormatInput
                                containerClass="field-header-note"
                                subContainerClass="border-none field-md"
                                inputClass="text-center"
                                allowNegative={false}
                                value={product.unit_cost}
                                name={nameInputsTable.unitCost}
                                placeholder="000.000"
                                onChange={(e): void => {
                                    setValuesInputsNumber(e, product, nameInputsTable.unitCost);
                                }}
                                disabled={disabledInputs}
                            />
                        </td>
                        <td
                            className={`${disabledInputs ? 'field-body--uneditable' : 'field-body--editable'} ${includeError(
                                product,
                                'discount'
                            )} `}
                        >
                            <NumberFormatInput
                                containerClass="field-header-note"
                                subContainerClass="border-none field-md"
                                inputClass="text-center"
                                value={product.discount}
                                allowNegative={false}
                                name={nameInputsTable.discount}
                                placeholder="000.000"
                                onChange={(e): void => {
                                    setValuesInputsNumber(e, product, nameInputsTable.discount);
                                }}
                                disabled={disabledInputs}
                            />
                        </td>
                        <td
                            className={`${disabledInputs ? 'field-body--uneditable' : 'field-body--editable'} ${includeError(
                                product,
                                'iva'
                            )} `}
                        >
                            <PercentageFormatInput
                                containerClass="field-header-note field-iva m-0"
                                subContainerClass="border-none "
                                inputClass="text-center field-iva"
                                value={product.iva}
                                name={nameInputsTable.iva}
                                placeholder="000.000"
                                onChange={(e): void => {
                                    setValuesInputsNumber(e, product, nameInputsTable.iva);
                                }}
                                disabled={disabledInputs}
                            />
                        </td>

                        <td className="w-5">
                            <Checkbox
                                disabled={disabledInputs}
                                classContainer="check-md"
                                checked={product.isChecked || false}
                                onChange={(): void => {
                                    setChecked(product);
                                }}
                            />
                        </td>
                    </tr>
                ))}
            </Table>
            <div className="flex flex-col">
                {emptyFieldsError && <span className="text-xs md:ml-2 md:mt-2 text-purple ">*Campos obligatorios</span>}
                {discountError && (
                    <span className="text-xs md:ml-2 md:mt-2 text-purple ">
                        *El valor de descuento no puede ser mayor que el costo del producto
                    </span>
                )}
                {quantityError?.flag && (
                    <span className="text-xs md:ml-2 md:mt-2 text-purple ">
                        *Solo puedes ingresar {quantityError.max_quantity} para el producto {quantityError.product_name}
                    </span>
                )}
            </div>

            <div className="mt-5">
                <Link
                    href="#"
                    onClick={(): void => {
                        if (productsInvoice.length) addNewProduct();
                    }}
                    text="+ Agregar compra producto/servicio"
                    classes="text-base"
                    disabled={!productsInvoice.length || disabledInputs}
                />
            </div>
            <div className="mt-9 total-table">
                <div className="border total-box">
                    <p className="total-text">Total descuento</p>
                </div>
                <div className="border-t border-b border-r total-container">
                    <NumberFormatInput
                        disabled
                        maxLength={20}
                        name="totalValue"
                        placeholder="000.000"
                        allowNegative={false}
                        value={totals.totalDiscount}
                    />
                </div>
            </div>
            <div className="total-table">
                <div className="border-b border-l border-r total-box">
                    <p className="total-text">*Total valor compra</p>
                </div>
                <div className="border-b border-r total-container">
                    <NumberFormatInput
                        disabled
                        maxLength={20}
                        name="totalValue"
                        placeholder="000.000"
                        allowNegative={false}
                        value={totals.totalBuy}
                    />
                </div>
            </div>
            <div className="total-table">
                <div className="border-l border-r total-box">
                    <p className="total-text">*Total IVA</p>
                </div>
                <div className="border-r total-container">
                    <NumberFormatInput
                        disabled
                        maxLength={20}
                        name="totalIva"
                        placeholder="000.000"
                        allowNegative={false}
                        value={totals.totalTax}
                    />
                </div>
            </div>
            <div className="mb-5 total-table">
                <div className="border total-box">
                    <p className="total-text">*Total</p>
                </div>
                <div className="border-t border-b border-r total-container">
                    <NumberFormatInput
                        disabled
                        name="total"
                        maxLength={20}
                        placeholder="000.000"
                        value={Math.max(0, totals.total)}
                    />
                </div>
            </div>
        </div>
    );
};
