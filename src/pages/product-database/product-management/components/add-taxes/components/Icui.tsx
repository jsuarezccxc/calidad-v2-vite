import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { ProductDatabaseContext, eTaxes } from '@pages/product-database/context';
import { NumberFormatInput, Text } from '@components/table-input';
import { ADD_TAXES } from '@information-texts/ProductDatabase';
import { stringToFloat } from '@utils/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { Information } from '@components/information';
import { MoneyInput } from '@components/input';
import { Table } from '@components/table';
import usePopper from '@hooks/usePopper';
import { Icon } from '@components/icon';
import { IVariantValues } from '..';

export const Icui: React.FC<IGenericRecord> = ({ toggleRenderTaxes }) => {
    const { isUniqueProduct, data, localValues, setLocalValues, deleteTax } = useContext(ProductDatabaseContext);
    const { companyTaxes } = useSelector((state: RootState) => state.company);

    const { anchorEl: anchorVariants, mouseProps: mouseVariants } = usePopper();
    const hoverVariants = {
        mouseProps: { ...mouseVariants },
        anchorElTitle: anchorVariants,
        description: ADD_TAXES.DESCRIPTION_ICUI,
    };

    useEffect(() => {
        handledChangeIcui();
    }, []);

    const handledChangeIcui = async (): Promise<void> => {
        const dataIcuiTax = companyTaxes.find(tax => tax.tax_name === eTaxes.ICUI);
        if (!dataIcuiTax) return;
        if (isUniqueProduct) {
            const tempLocalValues = {
                ...localValues,
                [eTaxes.ICUI]: {
                    tax_id: dataIcuiTax?.id,
                    tax_value: String((dataIcuiTax.rate / 100) * parseFloat(data.unique_products[0].unit_value)),
                    tax_calculated_value:
                        (dataIcuiTax.rate / 100) * parseFloat(data.unique_products[0].unit_value) +
                        parseFloat(data.unique_products[0].unit_value),
                    variants: [],
                },
            };
            setLocalValues(tempLocalValues);
        } else {
            const tempVariants: IVariantValues[] = [];
            data.unique_products.forEach((product: IGenericRecord, index: number) => {
                tempVariants.push({
                    id: product.id,
                    value: String((dataIcuiTax.rate / 100) * parseFloat(data.unique_products[index].unit_value)),
                    calculateValue:
                        (dataIcuiTax.rate / 100) * parseFloat(data.unique_products[index].unit_value) +
                        parseFloat(data.unique_products[index].unit_value),
                });
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setLocalValues((prevState: any) => {
                prevState[eTaxes.ICUI].tax_id = dataIcuiTax.id;
                prevState[eTaxes.ICUI].variants = [...tempVariants];
                return prevState;
            });
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex">
                <Information
                    title="ICUI"
                    color="blue"
                    classNameTitle="add-taxes__title"
                    hoverIcon={hoverVariants}
                    classNameContainer="mt-4.5"
                />
                <Icon
                    name="trashBlue"
                    classIcon="ml-auto w-5.5 h-5.5 my-auto cursor-pointer"
                    onClick={(): void => {
                        toggleRenderTaxes(eTaxes.ICUI);
                        deleteTax(eTaxes.ICUI);
                    }}
                />
            </div>
            {isUniqueProduct ? (
                <div className="mb-4.5">
                    <MoneyInput
                        value={String(localValues[eTaxes.ICUI].tax_calculated_value)}
                        classesInput=""
                        labelText="Valor unitario + impuesto calculado"
                        classesWrapper="w-full lg:w-73 mt-2 mb-2"
                        onChange={(): void => {}}
                        placeholder=""
                        disabled
                        symbols
                    />
                </div>
            ) : (
                <Table
                    customTable
                    isHeaderRowsCustom
                    className="add-taxes__table-container-icui"
                    headerRowsCustom={<TableHeader />}
                    data={[]}
                >
                    {data.unique_products.map(
                        (
                            product: {
                                [key: string]: string;
                                id: string;
                            },
                            index: number
                        ) => {
                            const { variants } = localValues[eTaxes.ICUI];
                            const variantsIndex = variants?.findIndex((varL: IGenericRecord) => varL.id === product.id);
                            const textValue = variants[variantsIndex]?.calculateValue || 0;
                            return (
                                <tr
                                    key={index}
                                    className={`md:h-10 xs:h-8.75 border-b border-gray ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-light'
                                    }`}
                                >
                                    <td className="">
                                        <Text
                                            className="px-2 text-gray font-aller"
                                            text={product.reference}
                                            disabled
                                            type="text"
                                            editTable={false}
                                            name="reference"
                                        />
                                    </td>
                                    <td className="">
                                        <NumberFormatInput
                                            value={stringToFloat(textValue)}
                                            allowNegative={false}
                                            inputClass="add-taxes__table-input-value"
                                            onChange={(): void => {}}
                                            maxLength={10}
                                            name="icui_value"
                                            disabled
                                            allowLeadingZeros={false}
                                        />
                                    </td>
                                </tr>
                            );
                        }
                    )}
                </Table>
            )}
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
