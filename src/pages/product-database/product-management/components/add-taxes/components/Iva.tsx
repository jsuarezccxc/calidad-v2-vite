import React, { useContext, useMemo } from 'react';
import usePopper from '@hooks/usePopper';
import { ProductDatabaseContext, eTaxes } from '@pages/product-database/context';
import { NumberFormatInput, Text } from '@components/table-input';
import { ADD_TAXES } from '@information-texts/ProductDatabase';
import { MoneyInput, SelectInput } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { Information } from '@components/information';
import { Table } from '@components/table';
import { Icon } from '@components/icon';
import { findTaxRate } from '.';

export const Iva: React.FC<IGenericRecord> = ({ toggleRenderTaxes }) => {
    const { isUniqueProduct, data, localValues, setLocalValues, ivaRateArray, deleteTax } = useContext(ProductDatabaseContext);

    const { anchorEl: anchorVariants, mouseProps: mouseVariants } = usePopper();

    const hoverVariants = {
        mouseProps: { ...mouseVariants },
        anchorElTitle: anchorVariants,
        description: ADD_TAXES.DESCRIPTION_IVA,
    };

    const handledChangeRatedTaxes = async (option: IGenericRecord, tax: keyof typeof eTaxes): Promise<void> => {
        if (isUniqueProduct) {
            const tempLocalValues = {
                ...localValues,
                [tax]: {
                    tax_id: option.id,
                    tax_value: String((parseFloat(option.key) / 100) * parseFloat(data.unique_products[0].unit_value)),
                    tax_calculated_value:
                        (parseFloat(option.key) / 100) * parseFloat(data.unique_products[0].unit_value) +
                        parseFloat(data.unique_products[0].unit_value),
                    variants: [],
                    tax_rate: option.key,
                },
            };
            setLocalValues(tempLocalValues);
        } else {
            const taxRate = parseFloat(option.key) / 100;

            const newVariants = data.unique_products.map((product: IGenericRecord) => {
                const unitValue = parseFloat(product.unit_value);
                return {
                    id: product.id,
                    value: String(taxRate * unitValue),
                    calculateValue: taxRate * unitValue + unitValue,
                };
            });
            const tempLocalValues = {
                ...localValues,
                [tax]: {
                    tax_id: option.id,
                    tax_value: '',
                    tax_calculated_value: 0,
                    variants: newVariants,
                },
            };
            setLocalValues(tempLocalValues);
        }
    };

    const rate = useMemo(() => findTaxRate(ivaRateArray, eTaxes.IVA, localValues), [localValues]);

    return (
        <div className="flex flex-col">
            <div className="flex">
                <Information
                    title="IVA"
                    color="blue"
                    classNameTitle="add-taxes__title"
                    hoverIcon={hoverVariants}
                    classNameContainer="mt-4.5"
                />
                <Icon
                    name="trashBlue"
                    classIcon="ml-auto w-5.5 h-5.5 my-auto cursor-pointer"
                    onClick={(): void => {
                        toggleRenderTaxes(eTaxes.IVA);
                        deleteTax(eTaxes.IVA);
                    }}
                />
            </div>
            <div className={`${isUniqueProduct ? 'flex gap-4.5' : 'flex flex-col'}`}>
                <SelectInput
                    classesWrapper="w-full lg:w-73 mt-2"
                    labelText="Tarifa:"
                    classListSelect
                    options={ivaRateArray}
                    optionSelected={async (option: IGenericRecord): Promise<void> =>
                        await handledChangeRatedTaxes(option, eTaxes.IVA)
                    }
                    value={rate?.value}
                />
                {isUniqueProduct ? (
                    <MoneyInput
                        value={String(localValues[eTaxes.IVA]?.tax_value)}
                        classesInput=""
                        labelText="Impuesto calculado"
                        classesWrapper="w-full lg:w-73 mt-2 mb-2"
                        onChange={(): void => {}}
                        placeholder=""
                        disabled
                        symbols
                    />
                ) : (
                    <Table
                        customTable
                        isHeaderRowsCustom
                        className="add-taxes__table-container-iva mt-4.5"
                        headerRowsCustom={<TableHeader />}
                        data={[]}
                    >
                        {data.unique_products.map((product: IGenericRecord, index: number) => {
                            const { variants } = localValues[eTaxes.IVA];
                            const variant = variants.find((varL: IGenericRecord) => varL.id === product.id);
                            const textValue = variant ? variant.calculateValue : 0;

                            return (
                                <tr
                                    key={index}
                                    className={`md:h-10 xs:h-8.75 border-b border-gray ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-light'
                                    }`}
                                >
                                    <td>
                                        <Text
                                            text={product.reference}
                                            disabled
                                            type="text"
                                            editTable={false}
                                            name="reference"
                                            className="px-2 text-gray font-aller"
                                        />
                                    </td>
                                    <td>
                                        <NumberFormatInput
                                            value={Number(textValue)}
                                            allowNegative={false}
                                            inputClass="add-taxes__table-input-value"
                                            onChange={(): void => {}}
                                            maxLength={10}
                                            name="iva_value"
                                            disabled
                                            allowLeadingZeros={false}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </Table>
                )}
            </div>
        </div>
    );
};

const TableHeader: React.FC = () => {
    return (
        <tr className="md:h-10 xs:h-8.75">
            <th className="px-2 add-taxes__table-variants">Variantes</th>
            <th className="px-2 add-taxes__table-tax">impuesto calculado</th>
        </tr>
    );
};
