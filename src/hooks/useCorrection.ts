import React, { Dispatch, SetStateAction } from 'react';
import { v4 as uuid } from 'uuid';
import { isEmpty } from 'lodash';
import { IGenericRecord } from '@models/GenericRecord';
import { CREDIT_PAYMENT } from '@pages/correction-documents-client-employer/components/electronic-document-correction';
import { IOptionSelect } from '@components/input';
import { quantityMaxProduct } from '@components/electronic-note';
import { discountOfValue } from '@utils/Number';
import { formatInitialNumber } from '@utils/Decimals';
import { lengthEqualToZero, lengthGreaterThanOne, lengthGreaterThanZero } from '@utils/Length';
import { getDateFromUnix, getDateToString, getDaysFromTwoDates, getUnixFromDate } from '@utils/Date';
import { discardUntaxed, stringToFloat, unitCostToDetails, validateDateLimit, validateTypeProduct } from '@utils/ElectronicInvoice';
import { RETE_IVA } from '@constants/Tax';
import { VARIABLE_TYPE } from '@constants/DataTypes';
import { NA, ONE_HUNDRED } from '@constants/ElectronicInvoice';
import { FormNameInputs, TableNameInputs } from '@constants/CancellationElectronic';

/**
 * This interface describe returns useCorrection
 *
 * @typeParam handleChange: (e: React.ChangeEvent<HTMLInputElement>, setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>, fieldInputs: IGenericRecord) => void - Change inputs
 * @typeParam handleChangeDate: (date: Date, name: string, setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>, fieldInputs: IGenericRecord) => void - Change inputs date
 * @typeParam handleChangeTime: (time: IGenericRecord, name: string, setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>, fieldInputs: IGenericRecord) => void - Change inputs time
 * @typeParam formatProducts: (products: IGenericRecord[], productsStock: IGenericRecord[]) => IGenericRecord[] - Format data products
 * @typeParam formatDataSelect: (table: IGenericRecord[], setTable: Dispatch<SetStateAction<IGenericRecord[]>>, currentProduct: IGenericRecord, item: IGenericRecord) => void - Format data select
 * @typeParam formatTaxes: (e: IGenericRecord, item: IGenericRecord, taxes: IGenericRecord[], setTaxes: Dispatch<SetStateAction<IGenericRecord[]>>, withHoldings: IGenericRecord[], setwithHoldings: Dispatch<SetStateAction<IGenericRecord[]>>, isWithHoldings?: boolean) => void - Format taxes table
 * @typeParam handleDelete: (table: IGenericRecord[], setTable: Dispatch<SetStateAction<IGenericRecord[]>>, selected: IGenericRecord[], setSelected: Dispatch<SetStateAction<IGenericRecord[]>>) => void - Delete table products
 * @typeParam formatValueTitles: (valuesTitles: IGenericRecord[], valueTotals: IGenericRecord[]) => { title: string; value: number }[] - Format titles
 * @typeParam handleDeleteResponsibility: (id: string, data: IGenericRecord, setData: Dispatch<SetStateAction<IGenericRecord>>) => void - Delete fiscal responsibilities
 * @typeParam handleAddResponsibility: (data: IGenericRecord, setData: Dispatch<SetStateAction<IGenericRecord>>) => void - Add fiscal responsibilities
 * @typeParam formatPreviousDate: (date: number) => Date - Format previous date
 * @typeParam handleChangeTable: (e: IGenericRecord, item: IGenericRecord, name: string, tableData: IGenericRecord[], isText?: boolean, isOnBlur?: boolean) => IGenericRecord[] - Handle change products table;
 * @typeParam formatChangeBatchAndDate: ( e: IOptionSelect, item: IGenericRecord, tableData: IGenericRecord[], isDate: boolean, products: IGenericRecord[]) => IGenericRecord[] - Handle change table batches;
 * @typeParam formatAddNewProduct: (tableData: IGenericRecord[]) => IGenericRecord[] - Format date add new product
 * @typeParam formatChangeWarehouse: (tableData: IGenericRecord[], option: IOptionSelect, item: IGenericRecord, products: IGenericRecord[]) => IGenericRecord[] - Format data change warehouse;
 */
interface IUseCorrection {
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>,
        fieldInputs: IGenericRecord,
        required?: boolean
    ) => void;
    handleChangeDate: (
        date: Date,
        name: string,
        setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>,
        fieldInputs: IGenericRecord
    ) => void;
    handleChangeTime: (
        time: IGenericRecord,
        name: string,
        setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>,
        fieldInputs: IGenericRecord
    ) => void;
    formatProducts: (products: IGenericRecord[], productsStock: IGenericRecord[]) => IGenericRecord[];
    formatDataSelect: (
        table: IGenericRecord[],
        setTable: Dispatch<SetStateAction<IGenericRecord[]>>,
        currentProduct: IGenericRecord,
        item: IGenericRecord
    ) => void;
    formatTaxes: (
        e: IGenericRecord,
        item: IGenericRecord,
        taxes: IGenericRecord[],
        setTaxes: Dispatch<SetStateAction<IGenericRecord[]>>,
        withHoldings: IGenericRecord[],
        setwithHoldings: Dispatch<SetStateAction<IGenericRecord[]>>,
        isWithHoldings?: boolean
    ) => void;
    handleDelete: (
        table: IGenericRecord[],
        setTable: Dispatch<SetStateAction<IGenericRecord[]>>,
        selected: IGenericRecord[],
        setSelected: Dispatch<SetStateAction<IGenericRecord[]>>,
        setOneProductTable: Dispatch<SetStateAction<boolean>>
    ) => void;
    formatValueTitles: (valuesTitles: IGenericRecord[], valueTotals: IGenericRecord[]) => { title: string; value: number }[];
    handleDeleteResponsibility: (id: string, data: IGenericRecord, setData: Dispatch<SetStateAction<IGenericRecord>>) => void;
    handleAddResponsibility: (data: IGenericRecord, setData: Dispatch<SetStateAction<IGenericRecord>>) => void;
    formatPreviousDate: (date: number) => Date;
    handleChangeTable: (
        e: IGenericRecord,
        item: IGenericRecord,
        name: string,
        tableData: IGenericRecord[],
        isText?: boolean,
        isOnBlur?: boolean
    ) => IGenericRecord[];
    formatChangeBatchAndDate: (
        e: IOptionSelect,
        item: IGenericRecord,
        tableData: IGenericRecord[],
        isDate: boolean,
        products: IGenericRecord[]
    ) => IGenericRecord[];
    formatAddNewProduct: (tableData: IGenericRecord[]) => IGenericRecord[];
    formatChangeWarehouse: (
        tableData: IGenericRecord[],
        option: IOptionSelect,
        item: IGenericRecord,
        products: IGenericRecord[]
    ) => IGenericRecord[];
}

/**
 * This interface describe format data for total table
 *
 * @typeParam title: string - Title row
 * @typeParam value: number - Value row
 * @typeParam className?:string - Optional style row
 * @typeParam edit?:boolean - Optional edit row
 */
export interface IValueTotals {
    title: string;
    value: number;
    className?: string;
    edit?: boolean;
}

export const useCorrection = (): IUseCorrection => {
    const formatChangeWarehouse = (
        tableData: IGenericRecord[],
        option: IOptionSelect,
        item: IGenericRecord,
        products: IGenericRecord[]
    ): IGenericRecord[] => {
        const quantityMax = quantityMaxProduct(products, { sku_internal: item.sku_internal.value, warehouse_id: option.id });
        return tableData.map((parameter: IGenericRecord) => {
            const currentWarehouse = parameter?.test?.find((warehouse: IGenericRecord) => warehouse.warehouses_id === option?.id);

            return {
                ...parameter,
                warehouse_name:
                    parameter.temporary_id === item.temporary_id
                        ? {
                              id: option.id,
                              value: option.value,
                              required: false,
                          }
                        : parameter.warehouse_name,
                ...(currentWarehouse &&
                    lengthEqualToZero(currentWarehouse?.batch) && {
                        batch_number: {
                            ...parameter.batch_number,
                            value: NA,
                        },
                        date_expiration: {
                            ...parameter.date_expiration,
                            value: NA,
                        },
                    }),
                quantityMax,
            };
        });
    };
    const formatAddNewProduct = (tableData: IGenericRecord[]): IGenericRecord[] => {
        return [
            ...tableData,
            {
                number: formatInitialNumber(tableData.length + 1),
                temporary_id: uuid(),
                sku_internal: {
                    value: 0,
                    required: true,
                },
                quantity: { value: 0, required: false },
                delivery_cost: { value: 0, required: false },
                product_taxes: [],
                percentage_discount: { value: 0, required: false },
                discount: { value: 0, required: false },
                reference: '',
                unit_measurement_name: '',
                unique_product_name: { value: '', required: true },
                unique_products_id: '',
                unit_cost: { value: 0, required: false },
                unit_value: { value: 0, required: false },
                date_expiration: {
                    value: NA,
                    required: false,
                },
                batch_number: {
                    id: '',
                    value: '',
                    required: false,
                },
                warehouse_name: { id: '', value: '', required: false },
                totalBuyWithTaxes: 0,
                total_iva: 0,
                total_consumption: 0,
                iva: 0,
                consumption: 0,
                total_buy: 0,
                total: 0,
                test: [],
                text_fields: {
                    warehouse: '',
                    batch: '',
                    date_expiration: '',
                },
                quantityMax: 0,
                is_mandate: false,
                mandate_id: NA,
                mandate: NA,
            },
        ];
    };
    const formatChangeBatchAndDate = (
        e: IOptionSelect,
        item: IGenericRecord,
        tableData: IGenericRecord[],
        isDate: boolean,
        products: IGenericRecord[]
    ): IGenericRecord[] =>
        tableData.map((parameter: IGenericRecord) => {
            if (isDate) {
                return {
                    ...parameter,
                    date_expiration:
                        parameter.temporary_id === item.temporary_id
                            ? {
                                  id: e.id,
                                  value: e.value,
                                  required: false,
                              }
                            : parameter.date_expiration,
                };
            }
            const quantityMax = quantityMaxProduct(products, {
                sku_internal: item.sku_internal.value,
                batch_detail_id: e.id,
                warehouse_id: item.warehouse_name.id,
            });
            return {
                ...parameter,
                quantityMax,
                batch_number:
                    parameter.temporary_id === item.temporary_id
                        ? {
                              id: e.id,
                              value: e.value,
                              required: false,
                          }
                        : parameter.batch_number,
            };
        });
    const handleChangeTable = (
        e: IGenericRecord,
        item: IGenericRecord,
        name: string,
        tableData: IGenericRecord[],
        isText?: boolean,
        isOnBlur = false
    ): IGenericRecord[] => {
        return tableData?.map((parameter: IGenericRecord) => {
            if (parameter.temporary_id === item.temporary_id) {
                if (['warehouse_input', 'batch_input', 'date_input'].includes(name)) {
                    if (TableNameInputs.WAREHOUSE_INPUT === name || TableNameInputs.BATCH_INPUT === name) {
                        const indexReal = name.slice(0, name.length - 6);
                        return {
                            ...parameter,
                            text_fields: {
                                ...parameter.text_fields,
                                [indexReal]: e.target.value,
                            },
                        };
                    }
                    if (TableNameInputs.DATE_INPUT === name) {
                        return {
                            ...parameter,
                            text_fields: {
                                ...parameter.text_fields,
                                date_expiration: getUnixFromDate(`${e}`),
                            },
                        };
                    }
                }
                if ((e?.target?.name || name === TableNameInputs.DELIVERY_COST) && name !== TableNameInputs.DISCOUNT) {
                    return {
                        ...parameter,
                        [e?.target?.name || name]: {
                            value: e?.floatValue,
                            required: !e?.value,
                        },
                        validate_delivery: e?.floatValue >= parameter[TableNameInputs.UNIT_VALUE],
                    };
                }
                const validateValueInput = isEmpty(e?.target?.value) ? 0 : stringToFloat(e?.target?.value);
                const isQuantity = name === TableNameInputs.QUANTITY;
                const isUnitCost = name === TableNameInputs.UNIT_COST;
                const isPercentage = name === TableNameInputs.PERCENTAGE_DISCOUNT;
                const discount = discountOfValue(
                    (isQuantity ? e?.floatValue || 0 : parameter.quantity.value || 0) *
                        (isUnitCost ? e?.floatValue || 0 : parameter.unit_cost.value || 0),
                    isPercentage ? e?.floatValue || 0 : parameter.percentage_discount.value || 0
                );
                return {
                    ...parameter,
                    discount: isText
                        ? parameter.discount
                        : {
                              value: discount,
                              required: isPercentage ? !e.value : !e?.floatValue,
                          },
                    ...(isQuantity && {
                        percentage_discount: { ...item.percentage_discount, value: 0 },
                    }),
                    ...(name !== TableNameInputs.DISCOUNT && {
                        [e?.target?.name || name]: isText
                            ? e.target?.value || ''
                            : typeof parameter === VARIABLE_TYPE.OBJECT
                            ? {
                                  value: isOnBlur ? validateValueInput : e?.floatValue,
                                  required: e?.target?.name ? !e?.value : !e?.floatValue,
                              }
                            : e?.floatValue,
                    }),
                };
            }
            return parameter;
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>,
        fieldInputs: IGenericRecord,
        required?: boolean
    ): void => {
        const isDepartmentOrCity = [FormNameInputs.CITY, FormNameInputs.DEPARTMENT_STATE].includes(
            e.target.name as FormNameInputs
        );
        const isCollectionDays = e.target.name === FormNameInputs.COLLECTION_DAYS;
        const isTypeCollectionDays = e.target.name === FormNameInputs.DAYS_COLLECTION_TYPE;
        setFieldInputs({
            ...fieldInputs,
            ...(isTypeCollectionDays && {
                due_date: getUnixFromDate(validateDateLimit(Number(fieldInputs?.collection_days?.value), e.target.value)),
            }),
            ...(isCollectionDays && {
                due_date: getUnixFromDate(validateDateLimit(Number(e.target.value), fieldInputs?.days_collection_type?.value)),
            }),
            ...(isDepartmentOrCity
                ? {
                      [e.target.name]: {
                          ...fieldInputs[e.target.name],
                          name: e.target.value,
                          value: null,
                      },
                  }
                : {
                      [e.target.name]: required
                          ? {
                                value: e.target.value,
                                required:
                                    (isTypeCollectionDays || isCollectionDays) && fieldInputs.payment_type.id !== CREDIT_PAYMENT
                                        ? false
                                        : !e.target.value,
                            }
                          : e.target.value,
                  }),
        });
    };

    const formatPreviousDate = (date: number): Date => {
        const currentDate = getDateFromUnix(date);
        return new Date(`${currentDate.month}/${currentDate.day}/${currentDate.year}`);
    };

    const handleChangeDate = (
        date: Date,
        name: string,
        setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>,
        fieldInputs: IGenericRecord
    ): void => {
        const collectionDays = {
            value: 0,
            required: false,
        };
        const validateDueDate = name === FormNameInputs.DUE_DATE && fieldInputs?.payment_type?.id === CREDIT_PAYMENT;
        if (validateDueDate) {
            const initDate = new Date(getDateFromUnix(fieldInputs.date_issue, 'MM-DD-YYYY').dateFormat);
            collectionDays.value = getDaysFromTwoDates(initDate, date);
        }
        setFieldInputs({
            ...fieldInputs,
            ...(validateDueDate && { collection_days: { ...collectionDays } }),
            [name]: getUnixFromDate(date),
        });
    };

    const handleChangeTime = (
        time: IGenericRecord,
        name: string,
        setFieldInputs: Dispatch<SetStateAction<IGenericRecord>>,
        fieldInputs: IGenericRecord
    ): void => {
        setFieldInputs({
            ...fieldInputs,
            [name]: time,
        });
    };

    const formatProducts = (products: IGenericRecord[], productsStock: IGenericRecord[]): IGenericRecord[] => {
        return products?.map((item: IGenericRecord) => {
            const stock = productsStock.find(({ sku_internal }) => sku_internal === item.sku_internal.value)?.stock || [];
            const { batch = [] } =
                stock?.find(({ warehouses_id }: IGenericRecord) => warehouses_id === item.warehouse_name.id) || {};
            return {
                batch: item.batch_number.value === NA ? null : item.batch_number.value,
                batch_detail_id:
                    batch?.find(({ batch_id }: IGenericRecord) => batch_id === item.batch_number.id)?.batch_detail_id || null,
                batch_number: item.batch_number.value === NA ? null : item.batch_number.value,
                ciiu_id: item.ciiu_id,
                date_expiration: item.date_expiration.value === NA ? null : getDateToString(item.date_expiration.value),
                delivery_cost: item.delivery_cost.value,
                description: item.description,
                discount: item.discount.value || 0,
                id: item.id,
                invoice_id: item.invoice_id,
                is_product: item.is_product,
                quantity: item.quantity.value,
                reference: item.reference,
                sale: item.sale,
                sku_internal: item.sku_internal.value,
                total_buy: item.total_buy,
                unique_product_name: item.unique_product_name.value,
                unique_products_id: item.unique_products_id,
                unit_measure_milliliters: item.unit_measure_milliliters,
                unit_cost: item.unit_cost.value,
                unit_measurement_name: item.unit_measurement_name,
                unit_measurements_id: item.unit_measurement_id || item.unit_measurements_id,
                unit_value: item.unit_value.value,
                warehouse_id: item.warehouse_id,
                warehouse_name: item.warehouse_name.value,
                taxes: item?.unique_product_taxes?.map(({ company_tax_id, tax_value }: IGenericRecord) => ({
                    company_tax_id,
                    tax_value,
                })),
                text_fields: item.text_fields,
                is_inventoriable: item.is_inventoriable,
                mandate_id: item.mandate_id === NA ? null : item.mandate_id,
                is_mandate: item.is_mandate,
                mandate: item.mandate === NA ? null : item.mandate,
            };
        });
    };

    const replacePercentage = (value = '0'): number => stringToFloat(value.replace('%', ''));

    const formatDataSelect = (
        table: IGenericRecord[],
        setTable: Dispatch<SetStateAction<IGenericRecord[]>>,
        currentProduct: IGenericRecord,
        { rate, ...item}: IGenericRecord
    ): void => {
        const isPerishable = lengthGreaterThanZero(currentProduct?.stock[0]?.batch || []);
        const uniqueProductTaxes = discardUntaxed(currentProduct?.unique_product_taxes);
        let unitValue = unitCostToDetails(currentProduct, uniqueProductTaxes);
        if (rate) unitValue = unitValue / rate;
        const { warehouse_name, batch_number, date_expiration } = validateTypeProduct(currentProduct);
        const { is_mandate, mandate, mandate_id } = currentProduct;
        setTable(
            table?.map((parameter: IGenericRecord) => {
                if (parameter.temporary_id === item.temporary_id) {
                    return {
                        unit_cost: {
                            ...parameter.unit_cost,
                            value: unitValue,
                            required: false,
                        },
                        unit_value: {
                            value: unitValue,
                            required: false,
                        },
                        sku_internal: {
                            value: currentProduct?.sku_internal || currentProduct?.service_code,
                            id: currentProduct.id,
                            required: false,
                        },
                        ciiu_id: currentProduct?.product?.ciiu_id,
                        quantity: {
                            value: 0,
                            required: true,
                        },
                        delivery_cost: {
                            value: 0,
                            required: false,
                        },
                        purchase_details: currentProduct?.purchase_details,
                        product_taxes: uniqueProductTaxes.map(item => ({
                            ...item,
                            tax: {
                                id: item.company_tax_id,
                                percentage: item.tax_rate,
                                type: item.tax_name,
                            },
                        })),
                        discount: {
                            value: 0,
                            required: false,
                        },
                        unique_product_taxes: uniqueProductTaxes,
                        percentage_discount: { value: 0, required: false },
                        reference: currentProduct?.reference,
                        unit_measurement_name: currentProduct?.unit_measurement_name,
                        unit_measurement_id: currentProduct?.unit_measurement_id,
                        test: lengthGreaterThanZero(currentProduct?.stock) ? currentProduct?.stock : [],
                        unique_product_name: { value: currentProduct?.name, required: false },
                        unique_products_id: currentProduct?.id,
                        is_inventoriable: currentProduct?.is_inventoriable || false,
                        date_expiration: {
                            value: date_expiration,
                            required: false,
                        },
                        batch_number: {
                            value: batch_number,
                            required: isPerishable,
                        },
                        is_mandate: is_mandate,
                        mandate: is_mandate ? mandate : NA,
                        mandate_id: is_mandate ? mandate_id : NA,
                        warehouse_name: {
                            value: warehouse_name,
                            required: false,
                        },
                        required: false,
                        clear: true,
                    };
                }
                return parameter;
            })
        );
    };

    const formatTaxes = (
        e: IGenericRecord,
        item: IGenericRecord,
        taxes: IGenericRecord[],
        setTaxes: Dispatch<SetStateAction<IGenericRecord[]>>,
        withHoldings: IGenericRecord[],
        setWithHoldings: Dispatch<SetStateAction<IGenericRecord[]>>,
        isWithHoldings?: boolean
    ): void => {
        const { value, name } = e.target;

        const updateWithHoldings = (parameter: IGenericRecord): IGenericRecord => {
            if (parameter.id !== item.id) {
                return parameter;
            }

            let percentage = stringToFloat(String(parameter.percentage || 0).replace('%', ''));
            let base = stringToFloat(parameter.value);

            switch (name) {
                case TableNameInputs.OTHER_VALUE:
                    return {
                        ...parameter,
                        [name]: stringToFloat(value),
                    };
                case TableNameInputs.VALUE:
                    base = stringToFloat(value);
                    return {
                        ...parameter,
                        [name]: base,
                        [TableNameInputs.OTHER_VALUE]: (base * percentage) / 100,
                    };
                case TableNameInputs.PERCENTAGE:
                    percentage =
                        replacePercentage(value) < ONE_HUNDRED || parameter.name === RETE_IVA
                            ? replacePercentage(value)
                            : percentage;
                    return {
                        ...parameter,
                        [name]: percentage,
                        [TableNameInputs.OTHER_VALUE]: (base * percentage) / 100,
                    };
                default:
                    return parameter;
            }
        };

        const updateTaxes = (parameter: IGenericRecord): IGenericRecord => {
            if (parameter.id === item.id) {
                return {
                    ...parameter,
                    [name]: Number(value.replace('%', '').replace('.', '')),
                };
            }
            return parameter;
        };

        if (isWithHoldings) {
            setWithHoldings(withHoldings.map(updateWithHoldings));
        } else {
            setTaxes(taxes.map(updateTaxes));
        }
    };

    const formatValueTitles = (valueTitles: IGenericRecord[], valueTotals: IGenericRecord[]): IValueTotals[] => {
        const newData: IValueTotals[] = [];
        valueTitles.map(item => {
            if (lengthGreaterThanZero(valueTotals)) {
                valueTotals.map(value => {
                    if (value.field === item.field) {
                        newData.push({
                            ...item,
                            title: item.title,
                            value: value.value || 0,
                        });
                    }
                });
            } else {
                newData.push({
                    ...item,
                    title: item.title,
                    value: 0,
                });
            }
        });

        return newData;
    };

    const handleDelete = (
        table: IGenericRecord[],
        setTable: Dispatch<SetStateAction<IGenericRecord[]>>,
        selected: IGenericRecord[],
        setSelected: Dispatch<SetStateAction<IGenericRecord[]>>,
        setOneProductTable: Dispatch<SetStateAction<boolean>>
    ): void => {
        if (lengthGreaterThanZero(selected)) {
            const main = table.slice();
            selected.forEach((item: IGenericRecord) => {
                const index = main.findIndex((product: IGenericRecord) => product.temporary_id === item.id);
                main.splice(index, 1);
            });
            if (lengthGreaterThanOne(table) && table.length !== selected.length) setOneProductTable(true);
            setTable(main);
            setSelected([]);
        } else {
            setOneProductTable(true);
            setSelected([]);
        }
    };

    const handleDeleteResponsibility = (
        id: string,
        data: IGenericRecord,
        setData: Dispatch<SetStateAction<IGenericRecord>>
    ): void => {
        setData({
            ...data,
            [FormNameInputs.FISCAL_RESPONSIBILITY]: {
                value: data.fiscal_responsibility.value.filter((value: IGenericRecord) => value.id !== id),
            },
        });
    };

    const handleAddResponsibility = (data: IGenericRecord, setData: Dispatch<SetStateAction<IGenericRecord>>): void => {
        setData({
            ...data,
            fiscal_responsibility: {
                value: [
                    ...data?.fiscal_responsibility?.value,
                    { id: uuid(), fiscal_responsibility_name: '', fiscal_responsibility_id: '' },
                ],
            },
        });
    };

    return {
        handleChange,
        handleChangeDate,
        handleChangeTime,
        formatProducts,
        formatDataSelect,
        formatTaxes,
        handleDelete,
        formatValueTitles,
        handleDeleteResponsibility,
        handleAddResponsibility,
        formatPreviousDate,
        handleChangeTable,
        formatChangeBatchAndDate,
        formatAddNewProduct,
        formatChangeWarehouse,
    };
};
