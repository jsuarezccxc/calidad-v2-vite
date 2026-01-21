import React from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { MoneyInput, TextInput } from '@components/input';
import { Form } from '@components/form';
import usePermissions from '@hooks/usePermissions';
import { SEVEN } from '@constants/Numbers';
import { ZERO } from '@constants/UtilsConstants';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { EIGHT, ZERO_STRING } from '.';

export const UniqueProduct: React.FC<IGenericRecord> = ({ handleChangeUniqueValue, uniqueProduct, validate }) => {
    const { disabledInputs } = usePermissions();
    const limits = (value: string): number => {
        const val = value.split('');
        if (val.length > SEVEN && value.includes('.')) {
            return parseFloat(val.join('') ?? ZERO_STRING);
        }
        return parseFloat(val.slice(ZERO, EIGHT).join('') ?? ZERO_STRING);
    };

    return (
        <Form className="flex xs:flex-col gap-4.5 items-end mt-2">
            <TextInput
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                    submodule: 'product-service-unique-sku',
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                labelText="SKU:"
                placeholder="..."
                classesWrapper="add-price-code__unique-sku"
                name="name"
                tooltipInfo
                descTooltip="nombre único que identifica este artículo."
                titleTooltip="Nombre del producto/servicio:"
                onChange={(value): void => handleChangeUniqueValue(value.target, uniqueProduct?.id, 'sku_internal')}
                value={uniqueProduct?.sku_internal}
                disabled={disabledInputs}
                maxLength={30}
            />
            <MoneyInput
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                    submodule: 'product-service-unique-unit-value',
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                classesInput="text-number-format"
                labelText="*Valor unitario de venta:"
                placeholder="..."
                classesWrapper="w-73 xs:w-full mt-2"
                value={uniqueProduct?.unit_value}
                name="unit_value"
                onChange={(value): void =>
                    handleChangeUniqueValue({ ...value, value: limits(value?.value) }, uniqueProduct?.id, 'unit_value')
                }
                disabled={disabledInputs}
                required={validate && !uniqueProduct?.unit_value}
                symbols
                maxLength={16}
            />
        </Form>
    );
};
