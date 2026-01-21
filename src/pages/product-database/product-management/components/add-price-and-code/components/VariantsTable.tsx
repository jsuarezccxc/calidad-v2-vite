import React from 'react';
import { NumberFormatInput, Text } from '@components/table-input';
import { Table } from '@components/table';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { TableHeader } from './TableHeader';

export const VariantsTable: React.FC<IGenericRecord> = ({ variantList, toggleSelect, handleChangeValue, validate }) => {
    return (
        <>
            <Table
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                    submodule: 'product-service-variants',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                headerRowsCustom={<TableHeader />}
                isHeaderRowsCustom
                customTable
                data={[]}
                className="add-price-code__table-container"
                wrapperClassName="add-price-code__table-wrapper"
            >
                {variantList.map((option: IGenericRecord, index: number) => (
                    <tr
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: `product-service-variants-${option.id}`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.ROW,
                        })}
                        key={option.id}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-light'}`}
                    >
                        <td className="flex items-center content-center justify-center h-10 bg-white">
                            <div
                                className={`w-5 h-5 border rounded border-gray cursor-pointer ${option.select ? 'bg-blue' : ''}`}
                                onClick={(): void => toggleSelect(option.id)}
                            />
                        </td>
                        <td className="h-10 px-2 border-b border-gray">
                            <Text
                                text={option.reference || 'N/A'}
                                disabled
                                type="text"
                                editTable={false}
                                className="p-2 text-sm text-gray font-aller"
                            />
                        </td>
                        <td className="h-10 px-2 border-b border-gray">
                            <Text
                                text={option.name || 'N/A'}
                                disabled={!option.select}
                                type="text"
                                editTable={option.select}
                                className={`add-price-code__input-name text-sm  font-aller ${
                                    option.select ? 'text-gray-dark' : 'text-gray'
                                }`}
                                onChange={({ target }): void => handleChangeValue(target, option.id, 'name')}
                            />
                        </td>
                        <td className="h-10 border-b border-gray">
                            {option.select ? (
                                <Text
                                    text={option.sku_internal}
                                    type="text"
                                    editTable
                                    name="sku_internal"
                                    className="w-22.3"
                                    placeholder="..."
                                    onChange={({ target }): void => handleChangeValue(target, option.id, 'sku_internal')}
                                />
                            ) : (
                                <p className="px-2 text-sm text-gray">N/A</p>
                            )}
                        </td>
                        <td
                            className={`h-10 px-2 border-b border-gray ${
                                validate && !option.unit_value && option.select ? 'border-purple' : ''
                            }`}
                        >
                            {option.select ? (
                                <NumberFormatInput
                                    value={option.unit_value}
                                    allowNegative={false}
                                    inputClass="add-price-code__input-value"
                                    onChange={(e): void => handleChangeValue(e, option.id, 'unit_value')}
                                    maxLength={12}
                                    name="unit_value"
                                    disabled={!option.select}
                                />
                            ) : (
                                <p className="px-2 text-sm text-gray">N/A</p>
                            )}
                        </td>
                    </tr>
                ))}
            </Table>
            {validate && variantList.some((variant: IGenericRecord) => !variant.unit_value) && (
                <label className="self-end text-tiny text-purple mr-1.5 ml-7 text-right leading-xtiny mt-1">
                    *Campos obligatorios
                </label>
            )}
        </>
    );
};
