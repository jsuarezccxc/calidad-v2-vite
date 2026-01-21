import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { Icon } from '@components/icon';
import { Table } from '@components/table';
import { Information } from '@components/information';
import { RadioButton } from '@components/radiobutton';
import { SelectSearch } from '@components/select-search';
import { NumberFormatInput, Text } from '@components/table-input';
import { MoneyInput, SelectInput, TextInput } from '@components/input';

import { ProductDatabaseContext, eTaxes } from '@pages/product-database/context';

import { ADD_TAXES } from '@information-texts/ProductDatabase';

import { IGenericRecord } from '@models/GenericRecord';

import { ZERO } from '@constants/UtilsConstants';
import { LITER_ID, MILLILITER, MILLILITER_ID } from '@constants/Product';

import { RootState } from '@redux/rootReducer';

import usePopper from '@hooks/usePopper';

import { computeTaxForVariant, IIbuaValues, IVariantsNetContent, LT, ML, netContentOptions, netContentOptionsTable } from '.';

export const Ibua: React.FC<IGenericRecord> = ({ toggleRenderTaxes }) => {
    const {
        isUniqueProduct,
        localValues,
        setLocalValues,
        data,
        deleteTax,
        edit,
        setIbuaRateSelected,
        ibuaRateSelected,
        setNetContent,
        netContent,
        setUnitMeasure,
        unitMeasure,
        variantsNetContent,
        setVariantsNetContent,
        handleContentMilliliters,
        handleContentMillilitersVariants,
        handleUnitMeasureVariant,
    } = useContext(ProductDatabaseContext);

    const { companyTaxes } = useSelector((state: RootState) => state.company);
    const { anchorEl: anchorVariants, mouseProps: mouseVariants } = usePopper();

    const [ibuaValues, setIbuaValues] = useState<IIbuaValues>();

    const optionsIbuaRate = useMemo(
        () =>
            companyTaxes
                .filter((tax: IGenericRecord) => tax.tax_name === eTaxes.IBUA && tax.is_active)
                .sort((a: IGenericRecord, b: IGenericRecord) => a.rate - b.rate)
                .map((tax: IGenericRecord) => {
                    let label = 'Más de 10 gramos de azúcar.';
                    if (tax.rate === ZERO) {
                        label = 'Menor a 6 gramos.';
                    } else if (tax.rate === 38) {
                        label = 'Entre 6 y 10 gramos de azúcar.';
                    }
                    return {
                        name: tax.id,
                        label,
                    };
                }),
        []
    );

    const hoverVariants = {
        mouseProps: { ...mouseVariants },
        anchorElTitle: anchorVariants,
        description: ADD_TAXES.DESCRIPTION_IBUA,
    };

    const calculateIbua = (option: string, taxIndex?: IGenericRecord): number => {
        let calculateTax = 0;
        option === MILLILITER
            ? (calculateTax = (parseFloat(netContent) / 100) * taxIndex?.rate)
            : (calculateTax = parseFloat(netContent) * 10 * taxIndex?.rate);

        return calculateTax;
    };

    const updateTaxes = (variantsNetContentChange?: IVariantsNetContent[]): void => {
        const taxSelected = companyTaxes.find(t => t.id === ibuaRateSelected);
        if (!taxSelected) return;

        if (variantsNetContentChange) setVariantsNetContent(variantsNetContentChange);

        const updatedAll = (variantsNetContentChange ?? variantsNetContent)?.map((variantItem: IVariantsNetContent) => {
            const products = data.unique_products.find((product: IGenericRecord) => product.id === variantItem.id);
            const mlInfoFromItem = variantItem.unitMeasureMilliliters ?? ZERO;
            const netMl = Number(variantItem.unitSelected === LT ? mlInfoFromItem * 1000 : mlInfoFromItem);
            const basePrice = Number(products.unit_value ?? ZERO);

            const { tax, total } = computeTaxForVariant(netMl, taxSelected.rate, ML, basePrice);

            return {
                ...variantItem,
                value: String(tax),
                calculateValue: total,
                unitMeasureMilliliters: netMl,
                unitSelected: variantItem.unitSelected || ML,
            };
        });

        const tempLocalValues = {
            ...localValues,
            IBUA: {
                ...(localValues?.IBUA ?? {}),
                tax_id: String(taxSelected.id),
                variants: updatedAll,
            },
        };
        setLocalValues(tempLocalValues);
    };

    const handleChangeIbua1 = (optionValues: IIbuaValues): void => {
        setIbuaValues(optionValues);
        const { option, product } = optionValues;

        const unitMeasureId = option?.key === MILLILITER ? MILLILITER_ID : LITER_ID;
        handleUnitMeasureVariant(unitMeasureId, product?.id || data.unique_products[0].id);
        setUnitMeasure(option?.value || '');
        const taxSelected = companyTaxes.find(tax => tax.id === ibuaRateSelected);
        if (!taxSelected) return;
        if (isUniqueProduct) {
            const dataProduct = data.unique_products[0];
            const calculateTax = calculateIbua(option?.key || '', taxSelected);
            const tempLocalValues = {
                ...localValues,
                [eTaxes.IBUA]: {
                    tax_id: String(taxSelected?.id),
                    tax_value: String(calculateTax),
                    tax_calculated_value: calculateTax + parseFloat(dataProduct.unit_value),
                    unit_measure_milliliters: Number(netContent),
                    variants: [],
                },
            };

            setLocalValues(tempLocalValues);
        }
    };

    const handleChangeIbuaVariants = (optionValues: IIbuaValues): void => {
        const { option, product } = optionValues;

        const unitMeasureId = option?.key === MILLILITER ? MILLILITER_ID : LITER_ID;
        handleUnitMeasureVariant(unitMeasureId, product?.id || data.unique_products[0].id);
        setUnitMeasure(option?.value || '');
        const taxSelected = companyTaxes.find(tax => tax.id === ibuaRateSelected);
        if (!taxSelected) return;

        const existingNetContent = variantsNetContent.find(variantNetContent => variantNetContent.id === product?.id);

        let calculateTax = 0;
        let unitMeasurements = 0;

        if (existingNetContent) {
            const netContentValue = parseFloat(String(existingNetContent.unitMeasureMilliliters));

            if (option?.value === MILLILITER) {
                calculateTax = (netContentValue / 100) * taxSelected.rate;
                unitMeasurements = netContentValue;
            }
            if (option?.value !== MILLILITER) {
                calculateTax = netContentValue * 10 * taxSelected.rate;
                unitMeasurements = netContentValue;
            }
        }
        const existingVariantIndex = variantsNetContent.findIndex(variant => variant.id === product?.id);

        if (existingVariantIndex !== -1) {
            variantsNetContent[existingVariantIndex] = {
                ...variantsNetContent[existingVariantIndex],
                value: String(calculateTax),
                calculateValue: calculateTax + parseFloat(product?.unit_value),
                unitMeasureMilliliters: unitMeasurements,
            };
        } else {
            variantsNetContent.push({
                id: product?.id,
                value: String(calculateTax),
                calculateValue: calculateTax + parseFloat(product?.unit_value),
                unitMeasureMilliliters: unitMeasurements,
            });
        }

        const tempLocalValues = {
            ...localValues,
            IBUA: {
                tax_id: String(taxSelected?.id),
                tax_value: '',
                tax_calculated_value: 0,
                unit_measure_milliliters: 0,
                unitSelected: option?.key,
                variants: variantsNetContent,
            },
        };
        setLocalValues(tempLocalValues);

        const newVariantsNetContent = variantsNetContent?.map(item =>
            item.id === product?.id ? { ...item, unitSelected: option?.key } : item
        );

        updateTaxes(newVariantsNetContent);
    };

    useEffect(() => {
        const taxIbuaExisting = localValues.IBUA;
        if (edit) {
            setNetContent(taxIbuaExisting ? String(taxIbuaExisting.unit_measure_milliliters) : '');
            setIbuaRateSelected(taxIbuaExisting.tax_id);
        }
    }, [localValues]);

    useEffect(() => {
        if ((isUniqueProduct && ibuaValues?.option) || ibuaValues?.product) {
            handleChangeIbua1(ibuaValues);
            return;
        }
        updateTaxes();
    }, [ibuaRateSelected]);

    return (
        <div className="flex flex-col">
            <div className="flex">
                <Information
                    title="IBUA"
                    color="blue"
                    classNameTitle="add-taxes__title"
                    hoverIcon={hoverVariants}
                    classNameContainer="mt-4.5"
                />
                <Icon
                    name="trashBlue"
                    classIcon="ml-auto w-5.5 h-5.5 my-auto cursor-pointer"
                    onClick={(): void => {
                        toggleRenderTaxes(eTaxes.IBUA);
                        deleteTax(eTaxes.IBUA);
                    }}
                />
            </div>
            {ADD_TAXES.DESCRIPTION_IBUA_SELECT}
            <RadioButton
                classesLabel="w-auto px-2 bg-white justify-start"
                entities={optionsIbuaRate}
                selected={ibuaRateSelected}
                setSelected={setIbuaRateSelected}
                classesContainer="mt-4.5 !flex-col w-full lg:w-73"
                radioColDirection
                bgCircle="white"
                classesRadioInput="border border-gray"
            />
            {ADD_TAXES.DESCRIPTION_ADD_CONTENT}
            {isUniqueProduct ? (
                <div className="mt-4 mb-4.5 md:gap-4 flex flex-col md:flex-row items-center">
                    <div className="flex items-end gap-4.5">
                        <TextInput
                            classesWrapper="w-44.2"
                            labelText="Contenido neto del producto"
                            value={netContent}
                            onChange={(e): void => handleContentMilliliters(e.target.value)}
                            type="number"
                        />
                        <SelectInput
                            classesWrapper="rate-input"
                            labelText="Tarifa"
                            classListSelect
                            options={netContentOptions}
                            optionSelected={(option): void => handleChangeIbua1({ option, product: undefined })}
                            value={unitMeasure}
                            selectIconType="arrowDownGreen"
                        />
                    </div>
                    <MoneyInput
                        value={String(localValues.IBUA.tax_calculated_value || localValues.IBUA.tax_value)}
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
                    headerRowsCustom={<IbuaTableHeader />}
                    data={[]}
                    withScrollTable={false}
                    className="add-taxes__table-container"
                >
                    {data.unique_products.map((product: IGenericRecord, index: number) => {
                        const { variants } = localValues[eTaxes.IBUA];
                        const variant = variants?.find((varL: IGenericRecord) => varL.id === product.id);
                        const NetContent = variantsNetContent.find(v => v.id === product.id);
                        const textValue = variant?.calculateValue || 0;

                        return (
                            <tr
                                key={index}
                                className={`md:h-10 xs:h-8.75 border-b border-gray ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-light'
                                }`}
                            >
                                <td className="">
                                    <Text
                                        text={product.reference}
                                        disabled
                                        type="text"
                                        editTable={false}
                                        name="reference"
                                        className="px-2 text-gray font-aller"
                                    />
                                </td>
                                <td className="w-37">
                                    <TextInput
                                        value={String(NetContent?.unitMeasureMilliliters)}
                                        onChange={(e): void => handleContentMillilitersVariants(e.target.value, product.id)}
                                        classesWrapperInput={`border-none ${index % 2 === 0 ? 'bg-white' : 'bg-gray-light'}`}
                                        classesInput="text-left no-arrows text-gray-dark"
                                        type="number"
                                        classesWrapper="w-full"
                                    />
                                </td>
                                <td className="w-16">
                                    <SelectSearch
                                        onChange={(option): void => handleChangeIbuaVariants({ option, product })}
                                        options={netContentOptionsTable}
                                        value={product.unit_measure_milliliter_id === LITER_ID ? LT : ML}
                                        placeholder=""
                                        className="text-gray"
                                        inputClass="add-taxes__milliliters"
                                        selectIconType="arrowDownGreen"
                                    />
                                </td>
                                <td className="">
                                    <NumberFormatInput
                                        value={textValue}
                                        allowNegative={false}
                                        inputClass="mr-3 add-taxes__input-text"
                                        onChange={(): void => {}}
                                        maxLength={10}
                                        name="unit_value"
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
    );
};

const IbuaTableHeader: React.FC = () => {
    return (
        <tr className="h-10 xs:h-8.75">
            <th className="px-2 add-taxes__table-variants">Variantes</th>
            <th className="add-taxes__table-content" colSpan={2}>
                Contenido neto de la variante
            </th>
            <th className="px-2 add-taxes__table-tax">impuesto calculado</th>
        </tr>
    );
};
